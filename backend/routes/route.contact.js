import { Router } from 'express';
import { submitContact } from '../controllers/controller.contact.js';

export const routeContact = Router();

routeContact.post('/', submitContact);

