export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: string;
  role: string;
  isActive: boolean;
  avatar?: string;
  department?: string;
  joinDate: Date;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByDepartment: { [key: string]: number };
}