import axios from 'axios';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchColleges = (params: Record<string, string>) =>
  api.get('/colleges', { params }).then((r) => r.data);

export const fetchCollege = (id: number) =>
  api.get(`/colleges/${id}`).then((r) => r.data);

export const fetchCompare = (ids: number[]) =>
  api
    .get('/colleges/compare/multi', { params: { ids: ids.join(',') } })
    .then((r) => r.data);

export const predict = (exam: string, rank: number) =>
  api.post('/predict', { exam, rank }).then((r) => r.data);

export const fetchQuestions = (collegeId?: number) =>
  api
    .get('/qa', { params: collegeId ? { collegeId } : {} })
    .then((r) => r.data);

export const postQuestion = (data: {
  title: string;
  body: string;
  collegeId?: number;
}) => api.post('/qa', data).then((r) => r.data);

export const postAnswer = (questionId: number, body: string) =>
  api.post(`/qa/${questionId}/answers`, { body }).then((r) => r.data);

export const fetchSaved = () => api.get('/saved').then((r) => r.data);

export const saveCollege = (id: number) =>
  api.post(`/saved/${id}`).then((r) => r.data);

export const unsaveCollege = (id: number) =>
  api.delete(`/saved/${id}`).then((r) => r.data);

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password }).then((r) => r.data);

export const register = (name: string, email: string, password: string) =>
  api.post('/auth/register', { name, email, password }).then((r) => r.data);