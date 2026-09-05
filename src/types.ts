export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: Priority;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  lastLoginAt: string;
}

export type TaskFilter = 'all' | 'active' | 'completed';
export type PriorityFilter = 'all' | Priority;
