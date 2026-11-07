import express from 'express';
import {
  getTestCatalog,
  getHealthPackages,
  triggerManualSync,
  getSyncInfo,
  createTestItem,
  updateTestItem,
  deleteTestItem,
} from '../controllers/controller.tests.js';
import { middlewareAuth } from '../middleware/middleware.auth.js';

export const routeTests = express.Router();

// Public routes
routeTests.get('/', getTestCatalog);
routeTests.get('/packages', getHealthPackages);

// Admin-only synchronization & CRUD routes
routeTests.get('/sync-status', middlewareAuth, getSyncInfo);
routeTests.post('/sync', middlewareAuth, triggerManualSync);
routeTests.post('/', middlewareAuth, createTestItem);
routeTests.put('/:id', middlewareAuth, updateTestItem);
routeTests.delete('/:id', middlewareAuth, deleteTestItem);
