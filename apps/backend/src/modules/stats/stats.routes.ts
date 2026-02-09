import { Router } from 'express';
import { statsController } from './stats.controller.js';

const router = Router();

router.get('/', statsController.getDashboardStats);

export { router as statsRoutes };
