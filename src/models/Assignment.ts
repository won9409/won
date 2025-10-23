export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assignedTo?: string;
  createdBy: string;
  maxScore?: number;
  attachments?: string[];
}

export interface CreateAssignmentDto {
  title: string;
  description: string;
  dueDate: Date;
  createdBy: string;
  assignedTo?: string;
  maxScore?: number;
  attachments?: string[];
}

export interface UpdateAssignmentDto {
  title?: string;
  description?: string;
  dueDate?: Date;
  status?: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assignedTo?: string;
  maxScore?: number;
  attachments?: string[];
}
