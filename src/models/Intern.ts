export interface Intern {
  id: string;
  name: string;
  email: string;
  department: string;
  mentor: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'on_leave';
  skills: string[];
  notes?: string;
}

export interface CreateInternDto {
  name: string;
  email: string;
  department: string;
  mentor: string;
  startDate: Date;
  endDate?: Date;
  status?: 'active' | 'completed' | 'on_leave';
  skills?: string[];
  notes?: string;
}

export interface UpdateInternDto {
  name?: string;
  email?: string;
  department?: string;
  mentor?: string;
  startDate?: Date;
  endDate?: Date;
  status?: 'active' | 'completed' | 'on_leave';
  skills?: string[];
  notes?: string;
}
