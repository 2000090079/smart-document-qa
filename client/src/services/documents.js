import api from './api';

export const uploadDocument = (file) => {
  const form = new FormData();
  form.append('pdf', file);
  return api.post('/api/documents/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getDocuments = () => api.get('/api/documents');

export const getDocument = (id) => api.get(`/api/documents/${id}`);

export const askQuestion = (id, question) =>
  api.post(`/api/documents/${id}/ask`, { question });

export const deleteDocument = (id) => api.delete(`/api/documents/${id}`);
