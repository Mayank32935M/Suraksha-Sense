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
app.use(express.json({ limit: '10kb' })); // Guard against oversized payloads

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'suraksha-sense-server' });
});

// Routes
app.use('/api', gapRecommendationsRouter);
app.use('/api', classifyEventRouter);
app.use('/api', trustScoreRouter);
app.use('/api', voiceoverRouter);

// 404 catch-all for unknown routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: true, message: 'Endpoint not found.' });
});

// Global error handler — never leaks stack traces or raw input
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error('Unhandled server error:', err.message);
  res.status(500).json({ error: true, message: 'An internal server error occurred.' });
});

app.listen(PORT, () => {
  console.log(`Suraksha Sense server running on port ${PORT}`);
});

export default app;
