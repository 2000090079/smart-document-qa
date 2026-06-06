import { useState, useEffect, useRef } from 'react';
import { uploadDocument, getDocuments, askQuestion, deleteDocument } from '../services/documents';

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [question, setQuestion] = useState('');
  const [qa, setQa] = useState(null);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  useEffect(() => {
    fetchDocs();
  }, []);

  async function fetchDocs() {
    try {
      const { data } = await getDocuments();
      setDocs(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load documents.');
    }
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      await uploadDocument(file);
      await fetchDocs();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
      fileRef.current.value = '';
    }
  }

  async function handleAsk(e) {
    e.preventDefault();
    if (!question.trim() || !selectedDoc) return;
    setAsking(true);
    setQa(null);
    setError('');
    try {
      const { data } = await askQuestion(selectedDoc._id, question);
      setQa(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get answer.');
    } finally {
      setAsking(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this document?')) return;
    try {
      await deleteDocument(id);
      if (selectedDoc?._id === id) {
        setSelectedDoc(null);
        setQa(null);
      }
      setDocs(prev => prev.filter(d => d._id !== id));
    } catch {
      setError('Failed to delete document.');
    }
  }

  return (
    <div className="flex h-full gap-6">
      {/* Left panel: document list */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Upload PDF</h2>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-lg p-4 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition">
            <svg className="w-8 h-8 text-indigo-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm text-indigo-500 dark:text-indigo-400">
              {uploading ? 'Uploading…' : 'Click to upload PDF'}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow flex-1 overflow-y-auto">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">My Documents</h2>
          {docs.length === 0 && (
            <p className="text-sm text-gray-400">No documents yet. Upload a PDF to get started.</p>
          )}
          <ul className="space-y-2">
            {docs.map(doc => (
              <li
                key={doc._id}
                className={`group flex items-start justify-between p-2 rounded-lg cursor-pointer transition ${
                  selectedDoc?._id === doc._id
                    ? 'bg-indigo-100 dark:bg-indigo-900/40'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => { setSelectedDoc(doc); setQa(null); setQuestion(''); }}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{doc.originalName}</p>
                  <p className="text-xs text-gray-400">{doc.pageCount} pages · {new Date(doc.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={ev => { ev.stopPropagation(); handleDelete(doc._id); }}
                  className="ml-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right panel: Q&A */}
      <div className="flex-1 flex flex-col gap-4">
        {!selectedDoc ? (
          <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium">Select a document to start asking questions</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <h2 className="font-semibold text-gray-800 dark:text-white text-lg">{selectedDoc.originalName}</h2>
              <p className="text-sm text-gray-400">{selectedDoc.pageCount} pages</p>
            </div>

            <form onSubmit={handleAsk} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow flex gap-3">
              <input
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Ask a question about this document…"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={asking || !question.trim()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
              >
                {asking ? 'Asking…' : 'Ask'}
              </button>
            </form>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {asking && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow flex items-center gap-3 text-gray-500">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                Analyzing document…
              </div>
            )}

            {qa && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow flex-1 overflow-y-auto space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500 mb-1">Question</p>
                  <p className="text-gray-800 dark:text-white font-medium">{qa.question}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-green-500 mb-1">Answer</p>
                  <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{qa.answer}</p>
                </div>
                {qa.citations && qa.citations.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-2">Source Citations</p>
                    <div className="space-y-2">
                      {qa.citations.map((c, i) => (
                        <div key={i} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
                          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-1">Chunk {c.page}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 italic">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
