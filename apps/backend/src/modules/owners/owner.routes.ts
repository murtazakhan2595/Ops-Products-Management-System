import { Router } from 'express';
import { ownerController } from './owner.controller.js';

const router = Router();

router.get('/', ownerController.getAllOwners);
router.get('/:id', ownerController.getOwnerById);
router.get('/:id/products', ownerController.getProductsByOwner);

export { router as ownerRoutes };
