const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({
  text: String,
  page: Number,
});

const qaSchema = new mongoose.Schema({
  question: String,
  answer: String,
  citations: [{ text: String, page: Number }],
  askedAt: { type: Date, default: Date.now },
});

const documentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    pageCount: { type: Number, default: 0 },
    chunks: [chunkSchema],
    qaHistory: [qaSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
