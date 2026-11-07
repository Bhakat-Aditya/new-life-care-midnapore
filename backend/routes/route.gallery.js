import express from 'express';
import {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../controllers/controller.gallery.js';
import { middlewareAuth } from '../middleware/middleware.auth.js';
import { middlewareUpload } from '../middleware/middleware.upload.js';

export const routeGallery = express.Router();

// Public route
routeGallery.get('/', getGalleryItems);

// Admin-only routes with Cloudinary upload
routeGallery.post('/', middlewareAuth, middlewareUpload.single('image'), createGalleryItem);
routeGallery.put('/:id', middlewareAuth, middlewareUpload.single('image'), updateGalleryItem);
routeGallery.delete('/:id', middlewareAuth, deleteGalleryItem);

