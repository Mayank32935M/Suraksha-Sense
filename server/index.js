import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import gapRecommendationsRouter from './routes/gapRecommendations.js';
import classifyEventRouter from './routes/classifyEvent.js';
import trustScoreRouter from './routes/trustScore.js';
import voiceoverRouter from './routes/voiceover.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'suraksha-sense-server' });
});

// Routes
app.use('/api', gapRecommendationsRouter);
app.use('/api', classifyEventRouter);
app.use('/api', trustScoreRouter);
app.use('/api', voiceoverRouter);

app.listen(PORT, () => {
  console.log(`Suraksha Sense server running on port ${PORT}`);
});

export default app;
