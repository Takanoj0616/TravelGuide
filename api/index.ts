import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import generateRouteHandler from './generate-route.js';
import getAiRecommendationHandler from './get-ai-recommendation.js';
import { getTravelStories, createTravelStory } from './travel-stories-handler.js';
import { getTravelStory, updateTravelStory, deleteTravelStory } from './travel-stories-detail-handler.js';
import { getRealTimeCrowdData } from './api/social-crowd-analyzer.js';
import crowdDataScheduler from './scheduler.js';


// A simple utility to wrap async route handlers and catch errors
const asyncHandler = <T = unknown>(fn: (req: Request, res: Response, next: NextFunction) => Promise<T>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const app = express();
const port = 3001;

app.use(cors());

// Body parser middleware. IMPORTANT: This must come before the routes.
app.use(express.json());

// Custom logging middleware to see if requests get past the body parser
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] Request received for: ${req.method} ${req.path}`);
  console.log('Request Body:', req.body);
  next();
});

// Health check route
app.get('/', (_req, res) => {
  res.send('API Server is running!');
});

// Register routes using the asyncHandler wrapper
app.post('/api/generate-route', asyncHandler(generateRouteHandler));
app.post('/api/get-ai-recommendation', asyncHandler(getAiRecommendationHandler));

// Travel Stories routes
app.get('/api/travel-stories', asyncHandler(getTravelStories));
app.post('/api/travel-stories', asyncHandler(createTravelStory));
app.get('/api/travel-stories/:id', asyncHandler(getTravelStory));
app.put('/api/travel-stories/:id', asyncHandler(updateTravelStory));
app.delete('/api/travel-stories/:id', asyncHandler(deleteTravelStory));

// Real-time crowd analysis routes
app.get('/api/crowd-analysis/:location', asyncHandler(getRealTimeCrowdData));
app.get('/api/crowd-analysis', asyncHandler(async (req: Request, res: Response) => {
  // lat/lngがなくてもlocationがあればOK
  const { location, lat, lng, radius = 1000 } = req.query;
  if ((!location || (typeof location === 'string' && location.trim() === '')) && (!lat || !lng)) {
    return res.status(400).json({ error: 'Location parameter or coordinates are required' });
  }
  const data = await getRealTimeCrowdData(req, res);
  return res.json(data);
}));

// Scheduler management routes
app.get('/api/scheduler/status', (_req, res) => {
  res.json(crowdDataScheduler.getStatus());
});

app.post('/api/scheduler/start', (req, res) => {
  const { intervalMinutes = 15 } = req.body;
  crowdDataScheduler.start(intervalMinutes);
  res.json({ message: 'Scheduler started', status: crowdDataScheduler.getStatus() });
});

app.post('/api/scheduler/stop', (_req, res) => {
  crowdDataScheduler.stop();
  res.json({ message: 'Scheduler stopped', status: crowdDataScheduler.getStatus() });
});

app.post('/api/scheduler/update', asyncHandler(async (_req, res) => {
  await crowdDataScheduler.runManualUpdate();
  res.json({ message: 'Manual update completed' });
}));

// Centralized error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] Unhandled error:`, err);
  // Avoid sending back detailed error messages in production
  res.status(500).json({ message: 'An internal server error occurred.' });
});

app.listen(port, () => {
  console.log(`[API Server] Listening on http://localhost:${port}`);
  
  // 開発環境でのみスケジューラーを自動開始
  if (process.env.NODE_ENV === 'development') {
    console.log('[API Server] Starting crowd data scheduler in development mode...');
    crowdDataScheduler.start(15); // 15分間隔で更新
  }
}); 