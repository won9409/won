import { Request, Response } from 'express';
import { AssignmentService } from '../services/AssignmentService';
import { CreateAssignmentDto, UpdateAssignmentDto } from '../models/Assignment';

export class AssignmentController {
  private assignmentService: AssignmentService;

  constructor(assignmentService: AssignmentService) {
    this.assignmentService = assignmentService;
  }

  /**
   * POST /assignments - Create a new assignment
   */
  createAssignment = (req: Request, res: Response): void => {
    try {
      const dto: CreateAssignmentDto = {
        title: req.body.title,
        description: req.body.description,
        dueDate: new Date(req.body.dueDate),
        createdBy: req.body.createdBy,
        assignedTo: req.body.assignedTo,
        maxScore: req.body.maxScore,
        attachments: req.body.attachments,
      };

      if (!dto.title || !dto.description || !dto.dueDate || !dto.createdBy) {
        res.status(400).json({
          error: 'Missing required fields: title, description, dueDate, createdBy',
        });
        return;
      }

      const assignment = this.assignmentService.createAssignment(dto);
      res.status(201).json(assignment);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to create assignment',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * GET /assignments/:id - Get assignment by ID
   */
  getAssignmentById = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const assignment = this.assignmentService.getAssignmentById(id);

      if (!assignment) {
        res.status(404).json({ error: 'Assignment not found' });
        return;
      }

      res.status(200).json(assignment);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get assignment',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * GET /assignments - Get all assignments (with optional filters)
   */
  getAllAssignments = (req: Request, res: Response): void => {
    try {
      const { status, assignedTo, createdBy } = req.query;

      let assignments;

      if (status) {
        assignments = this.assignmentService.getAssignmentsByStatus(
          status as any
        );
      } else if (assignedTo) {
        assignments = this.assignmentService.getAssignmentsByAssignee(
          assignedTo as string
        );
      } else if (createdBy) {
        assignments = this.assignmentService.getAssignmentsByCreator(
          createdBy as string
        );
      } else {
        assignments = this.assignmentService.getAllAssignments();
      }

      res.status(200).json(assignments);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get assignments',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * PUT /assignments/:id - Update assignment
   */
  updateAssignment = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const dto: UpdateAssignmentDto = req.body;

      if (dto.dueDate) {
        dto.dueDate = new Date(dto.dueDate);
      }

      const assignment = this.assignmentService.updateAssignment(id, dto);

      if (!assignment) {
        res.status(404).json({ error: 'Assignment not found' });
        return;
      }

      res.status(200).json(assignment);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update assignment',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * DELETE /assignments/:id - Delete assignment
   */
  deleteAssignment = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const deleted = this.assignmentService.deleteAssignment(id);

      if (!deleted) {
        res.status(404).json({ error: 'Assignment not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        error: 'Failed to delete assignment',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * POST /assignments/update-overdue - Update overdue assignments
   */
  updateOverdueAssignments = (req: Request, res: Response): void => {
    try {
      this.assignmentService.updateOverdueAssignments();
      res.status(200).json({ message: 'Overdue assignments updated' });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update overdue assignments',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}
