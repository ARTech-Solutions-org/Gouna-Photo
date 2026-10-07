import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import generateHandler from './api/gouna/generate.js';
import uploadHandler from './api/gouna/upload.js';

config(); // Load variables from .env

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Mount the Vercel serverless handlers
app.post('/api/gouna/generate', generateHandler);
app.post('/api/gouna/upload', uploadHandler);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`[Local API] Running on http://localhost:${PORT}`);
});
