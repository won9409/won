import { Router } from 'express';
import { AssignmentController } from '../controllers/AssignmentController';
import { AssignmentService } from '../services/AssignmentService';

export const createAssignmentRouter = (): Router => {
  const router = Router();
  const assignmentService = new AssignmentService();
  const assignmentController = new AssignmentController(assignmentService);

  // Create a new assignment
  router.post('/', assignmentController.createAssignment);

  // Get all assignments (supports query params: status, assignedTo, createdBy)
  router.get('/', assignmentController.getAllAssignments);

  // Get assignment by ID
  router.get('/:id', assignmentController.getAssignmentById);

  // Update assignment
  router.put('/:id', assignmentController.updateAssignment);

  // Delete assignment
  router.delete('/:id', assignmentController.deleteAssignment);

  // Update overdue assignments
  router.post('/update-overdue', assignmentController.updateOverdueAssignments);

  return router;
};
