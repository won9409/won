import { Request, Response } from 'express';
import { InternService } from '../services/InternService';
import { CreateInternDto, UpdateInternDto } from '../models/Intern';

export class InternController {
  private internService: InternService;

  constructor(internService: InternService) {
    this.internService = internService;
  }

  /**
   * POST /interns - Create a new intern profile
   */
  createIntern = (req: Request, res: Response): void => {
    try {
      const dto: CreateInternDto = {
        name: req.body.name,
        email: req.body.email,
        department: req.body.department,
        mentor: req.body.mentor,
        startDate: new Date(req.body.startDate),
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
        status: req.body.status,
        skills: req.body.skills,
        notes: req.body.notes,
      };

      if (!dto.name || !dto.email || !dto.department || !dto.mentor) {
        res.status(400).json({
          error: 'Missing required fields: name, email, department, mentor',
        });
        return;
      }

      const intern = this.internService.createIntern(dto);
      res.status(201).json(intern);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to create intern',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * GET /interns/:id - Get intern by ID
   */
  getInternById = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const intern = this.internService.getInternById(id);

      if (!intern) {
        res.status(404).json({ error: 'Intern not found' });
        return;
      }

      res.status(200).json(intern);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get intern',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * GET /interns - Get all interns (with optional filters)
   */
  getAllInterns = (req: Request, res: Response): void => {
    try {
      const { status, department, mentor } = req.query;

      let interns;

      if (status) {
        interns = this.internService.getInternsByStatus(status as any);
      } else if (department) {
        interns = this.internService.getInternsByDepartment(department as string);
      } else if (mentor) {
        interns = this.internService.getInternsByMentor(mentor as string);
      } else {
        interns = this.internService.getAllInterns();
      }

      res.status(200).json(interns);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get interns',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * PUT /interns/:id - Update intern
   */
  updateIntern = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const dto: UpdateInternDto = {
        ...req.body,
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      };

      const intern = this.internService.updateIntern(id, dto);

      if (!intern) {
        res.status(404).json({ error: 'Intern not found' });
        return;
      }

      res.status(200).json(intern);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update intern',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * DELETE /interns/:id - Delete intern
   */
  deleteIntern = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const deleted = this.internService.deleteIntern(id);

      if (!deleted) {
        res.status(404).json({ error: 'Intern not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        error: 'Failed to delete intern',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}
