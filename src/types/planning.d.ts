export type PlanningSessionStatus =
  | 'REQUESTING'
  | 'MATCHED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELED';

export interface PlanningSession {
  id: string;
  userId: string;
  plannerId?: string;
  status: PlanningSessionStatus;
  userRequest: {
    destinations: string[];
    duration: string;
    interests: string;
    budget: string;
    notes: string;
  };
  createdAt: Date;
} 