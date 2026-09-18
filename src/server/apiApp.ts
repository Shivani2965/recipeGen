import express from 'express';
import dotenv from 'dotenv';
import recipeRoutes from './routes/recipeRoutes.ts';
import pdfRoutes from './routes/pdfRoutes.ts';
import { errorHandler } from './middleware/errorHandler.ts';

dotenv.config();
dotenv.config({ path: '.env.example' });

const apiApp = express();

apiApp.use(express.json({ limit: '5mb' }));
apiApp.use(express.urlencoded({ extended: true }));

// Mount routes
apiApp.use('/api/recipes', pdfRoutes);
apiApp.use('/api/recipes', recipeRoutes);

apiApp.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'SmartRecipe Backend', timestamp: new Date().toISOString() });
});

// Centralized error handler
apiApp.use(errorHandler);

export default apiApp;
