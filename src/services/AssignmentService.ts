import { v4 as uuidv4 } from 'uuid';
import { Assignment, CreateAssignmentDto, UpdateAssignmentDto } from '../models/Assignment';

export class AssignmentService {
  private assignments: Map<string, Assignment>;

  constructor() {
    this.assignments = new Map();
  }

  /**
   * Create a new assignment
   */
  createAssignment(dto: CreateAssignmentDto): Assignment {
    const now = new Date();
    const assignment: Assignment = {
      id: uuidv4(),
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate,
      createdAt: now,
      updatedAt: now,
      status: 'pending',
      createdBy: dto.createdBy,
      assignedTo: dto.assignedTo,
      maxScore: dto.maxScore,
      attachments: dto.attachments || [],
    };

    this.assignments.set(assignment.id, assignment);
    return assignment;
  }

  /**
   * Get assignment by ID
   */
  getAssignmentById(id: string): Assignment | undefined {
    return this.assignments.get(id);
  }

  /**
   * Get all assignments
   */
  getAllAssignments(): Assignment[] {
    return Array.from(this.assignments.values());
  }

  /**
   * Get assignments by status
   */
  getAssignmentsByStatus(status: Assignment['status']): Assignment[] {
    return Array.from(this.assignments.values()).filter(
      (assignment) => assignment.status === status
    );
  }

  /**
   * Get assignments by assignee
   */
  getAssignmentsByAssignee(assignedTo: string): Assignment[] {
    return Array.from(this.assignments.values()).filter(
      (assignment) => assignment.assignedTo === assignedTo
    );
  }

  /**
   * Update assignment
   */
  updateAssignment(id: string, dto: UpdateAssignmentDto): Assignment | null {
    const assignment = this.assignments.get(id);
    if (!assignment) {
      return null;
    }

    const updatedAssignment: Assignment = {
      ...assignment,
      ...dto,
      updatedAt: new Date(),
    };

    this.assignments.set(id, updatedAssignment);
    return updatedAssignment;
  }

  /**
   * Delete assignment
   */
  deleteAssignment(id: string): boolean {
    return this.assignments.delete(id);
  }

  /**
   * Update assignment status based on due date
   */
  updateOverdueAssignments(): void {
    const now = new Date();
    this.assignments.forEach((assignment) => {
      if (
        assignment.status !== 'completed' &&
        assignment.dueDate < now
      ) {
        assignment.status = 'overdue';
        assignment.updatedAt = now;
      }
    });
  }

  /**
   * Get assignments created by user
   */
  getAssignmentsByCreator(createdBy: string): Assignment[] {
    return Array.from(this.assignments.values()).filter(
      (assignment) => assignment.createdBy === createdBy
    );
  }
}
