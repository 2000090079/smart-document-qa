const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { Anthropic: AIClient } = require('@anthropic-ai/sdk');
const { protect: auth } = require('../middleware/auth');
const Document = require('../models/Document');

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

const aiClient = new AIClient({ apiKey: process.env.AI_API_KEY });

function splitIntoChunks(text, chunkSize = 1500) {
  const paragraphs = text.split(/\n{2,}/);
  const chunks = [];
  let current = '';
  for (const para of paragraphs) {
    if ((current + para).length > chunkSize && current) {
      chunks.push(current.trim());
      current = para;
    } else {
      current += (current ? '\n\n' : '') + para;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

// POST /api/documents/upload
router.post('/upload', auth, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const buffer = fs.readFileSync(req.file.path);
    const parsed = await pdfParse(buffer);

    const rawChunks = splitIntoChunks(parsed.text);
    const chunks = rawChunks.map((text, i) => ({ text, page: i + 1 }));

    const doc = await Document.create({
      user: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      pageCount: parsed.numpages,
      chunks,
    });

    res.status(201).json({
      _id: doc._id,
      originalName: doc.originalName,
      pageCount: doc.pageCount,
      chunkCount: chunks.length,
      createdAt: doc.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/documents
router.get('/', auth, async (req, res) => {
  try {
    const docs = await Document.find({ user: req.user.id })
      .select('-chunks')
      .sort('-createdAt');
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/documents/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, user: req.user.id }).select('-chunks');
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/documents/:id/ask
router.post('/:id/ask', auth, async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: 'Question is required' });

    const doc = await Document.findOne({ _id: req.params.id, user: req.user.id });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    // Simple keyword relevance: pick top 5 chunks containing question words
    const words = question.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const scored = doc.chunks.map(chunk => {
      const lower = chunk.text.toLowerCase();
      const score = words.reduce((s, w) => s + (lower.includes(w) ? 1 : 0), 0);
      return { ...chunk.toObject(), score };
    });
    scored.sort((a, b) => b.score - a.score);
    const topChunks = scored.slice(0, 5);

    const context = topChunks
      .map((c, i) => `[Source ${i + 1}, Chunk ${c.page}]:\n${c.text}`)
      .join('\n\n---\n\n');

    const systemPrompt = `You are a document Q&A assistant. Answer the user's question using ONLY the provided document excerpts.
After your answer, include a "Citations:" section listing the specific [Source N] references you used.
If the answer is not in the excerpts, say so clearly.`;

    const response = await aiClient.messages.create({
      model: process.env.AI_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Document excerpts:\n\n${context}\n\nQuestion: ${question}`,
        },
      ],
    });

    const answerText = response.content[0].text;

    // Extract citations from answer
    const citationMatches = [...answerText.matchAll(/\[Source (\d+)/g)];
    const usedIndices = [...new Set(citationMatches.map(m => parseInt(m[1]) - 1))];
    const citations = usedIndices
      .filter(i => topChunks[i])
      .map(i => ({ text: topChunks[i].text.slice(0, 200) + '...', page: topChunks[i].page }));

    const qaEntry = { question, answer: answerText, citations };
    doc.qaHistory.push(qaEntry);
    await doc.save();

    res.json({ question, answer: answerText, citations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/documents/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const doc = await Document.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const filePath = path.join(uploadsDir, doc.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
