import { v4 as uuidv4 } from 'uuid';
import { CreateInternDto, Intern, UpdateInternDto } from '../models/Intern';

export class InternService {
  private interns: Map<string, Intern>;

  constructor() {
    this.interns = new Map();
  }

  /**
   * Create a new intern profile
   */
  createIntern(dto: CreateInternDto): Intern {
    const intern: Intern = {
      id: uuidv4(),
      name: dto.name,
      email: dto.email,
      department: dto.department,
      mentor: dto.mentor,
      startDate: dto.startDate,
      endDate: dto.endDate,
      status: dto.status || 'active',
      skills: dto.skills || [],
      notes: dto.notes,
    };

    this.interns.set(intern.id, intern);
    return intern;
  }

  /**
   * Get intern by ID
   */
  getInternById(id: string): Intern | undefined {
    return this.interns.get(id);
  }

  /**
   * Get all interns
   */
  getAllInterns(): Intern[] {
    return Array.from(this.interns.values());
  }

  /**
   * Get interns by status
   */
  getInternsByStatus(status: Intern['status']): Intern[] {
    return Array.from(this.interns.values()).filter(
      (intern) => intern.status === status
    );
  }

  /**
   * Get interns by department
   */
  getInternsByDepartment(department: string): Intern[] {
    return Array.from(this.interns.values()).filter(
      (intern) => intern.department === department
    );
  }

  /**
   * Get interns by mentor
   */
  getInternsByMentor(mentor: string): Intern[] {
    return Array.from(this.interns.values()).filter(
      (intern) => intern.mentor === mentor
    );
  }

  /**
   * Update intern information
   */
  updateIntern(id: string, dto: UpdateInternDto): Intern | null {
    const intern = this.interns.get(id);
    if (!intern) {
      return null;
    }

    const updatedIntern: Intern = {
      ...intern,
      ...dto,
      skills: dto.skills ?? intern.skills,
    };

    this.interns.set(id, updatedIntern);
    return updatedIntern;
  }

  /**
   * Delete intern
   */
  deleteIntern(id: string): boolean {
    return this.interns.delete(id);
  }
}
