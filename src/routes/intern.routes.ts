import { Router } from 'express';
import { InternService } from '../services/InternService';
import { InternController } from '../controllers/InternController';

export const createInternRouter = (): Router => {
  const router = Router();
  const internService = new InternService();
  const internController = new InternController(internService);

  // Create a new intern
  router.post('/', internController.createIntern);

  // Get all interns (supports query params: status, department, mentor)
  router.get('/', internController.getAllInterns);

  // Get intern by ID
  router.get('/:id', internController.getInternById);

  // Update intern
  router.put('/:id', internController.updateIntern);

  // Delete intern
  router.delete('/:id', internController.deleteIntern);

  return router;
};
