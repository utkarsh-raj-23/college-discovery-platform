import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import collegeRoutes from './routes/colleges';
import authRoutes from './routes/auth';
import qaRoutes from './routes/qa';
import predictRoutes from './routes/predict';
import savedRoutes from './routes/saved';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/colleges', collegeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/saved', savedRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;