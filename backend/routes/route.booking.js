import { Router } from 'express';
import { createBooking, getBookingById } from '../controllers/controller.booking.js';

export const routeBooking = Router();

routeBooking.post('/', createBooking);
routeBooking.get('/:id', getBookingById);

