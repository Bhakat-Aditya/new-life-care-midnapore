import { Router } from 'express';
import { getPatientReports, downloadReport } from '../controllers/controller.reports.js';

export const routeReports = Router();

routeReports.get('/', getPatientReports);
routeReports.get('/download/:reportId', downloadReport);

