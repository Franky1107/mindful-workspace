export type Priority = 'low' | 'medium' | 'high';
export type Category = 'Work' | 'Study' | 'Personal' | 'Errands';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO string
  startTime?: string; // e.g., "09:30 AM"
  endTime?: string; // e.g., "10:30 AM"
  priority: Priority;
  category: Category;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  pinned: boolean;
  updatedAt: string; // ISO string
  attachments?: {
    type: 'image' | 'link';
    count: number;
  }[];
}

export type View = 'tasks' | 'calendar' | 'notes' | 'analytics' | 'timer' | 'create-task';
