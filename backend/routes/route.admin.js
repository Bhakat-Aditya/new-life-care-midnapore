import express from 'express';
import {
  loginAdmin,
  getAdminMe,
  changeAdminPassword,
  getAdminStats,
} from '../controllers/controller.admin.js';
import { middlewareAuth } from '../middleware/middleware.auth.js';
import { Booking } from '../models/model.booking.js';

export const routeAdmin = express.Router();

// Public login
routeAdmin.post('/login', loginAdmin);

// Protected Admin Endpoints
routeAdmin.get('/me', middlewareAuth, getAdminMe);
routeAdmin.post('/change-password', middlewareAuth, changeAdminPassword);
routeAdmin.get('/stats', middlewareAuth, getAdminStats);

// Admin Bookings Management
routeAdmin.get('/bookings', middlewareAuth, async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const bookings = await Booking.find(filter).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving bookings' });
  }
});

routeAdmin.put('/bookings/:id/status', middlewareAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    return res.json({ success: true, message: 'Booking status updated', data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating booking status' });
  }
});

