export interface DashboardUser {
  _id: string;
  _creationTime: number;
  name: string;
  role: string;
  avatarUrl: string;
}

export interface InProgressCourse {
  _id: string;
  _creationTime: number;
  title: string;
  category: string;
  progressPercent: number;
  completedClasses: number;
  totalClasses: number;
  imageUrl: string;
}
