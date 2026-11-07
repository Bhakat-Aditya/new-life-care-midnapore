import express from 'express';
import {
  getActiveNotices,
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from '../controllers/controller.notice.js';
import { middlewareAuth } from '../middleware/middleware.auth.js';

export const routeNotice = express.Router();

// Public route for active notices banner
routeNotice.get('/', getActiveNotices);

// Admin-only management
routeNotice.get('/all', middlewareAuth, getAllNotices);
routeNotice.post('/', middlewareAuth, createNotice);
routeNotice.put('/:id', middlewareAuth, updateNotice);
routeNotice.delete('/:id', middlewareAuth, deleteNotice);

