import express from 'express';
import { getAllProperties, getPropertyById, createProperty, deleteProperty } from '../controllers/propertyController.js';

const router = express.Router();

router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.post('/', createProperty);
router.delete('/:id', deleteProperty);

export default router; 