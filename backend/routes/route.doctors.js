import express from 'express';
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from '../controllers/controller.doctors.js';
import { middlewareAuth } from '../middleware/middleware.auth.js';
import { middlewareUpload } from '../middleware/middleware.upload.js';

export const routeDoctors = express.Router();

// Public routes
routeDoctors.get('/', getDoctors);
routeDoctors.get('/:id', getDoctorById);

// Admin-only routes with Cloudinary upload
routeDoctors.post('/', middlewareAuth, middlewareUpload.single('image'), createDoctor);
routeDoctors.put('/:id', middlewareAuth, middlewareUpload.single('image'), updateDoctor);
routeDoctors.delete('/:id', middlewareAuth, deleteDoctor);
