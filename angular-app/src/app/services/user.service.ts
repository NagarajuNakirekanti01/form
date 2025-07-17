import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, UserStats } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  private mockUsers: User[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0123',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'male',
      role: 'Developer',
      isActive: true,
      department: 'Engineering',
      joinDate: new Date('2022-01-15')
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1-555-0124',
      dateOfBirth: new Date('1988-08-22'),
      gender: 'female',
      role: 'Designer',
      isActive: true,
      department: 'Design',
      joinDate: new Date('2021-11-03')
    },
    {
      id: 3,
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1-555-0125',
      dateOfBirth: new Date('1985-12-10'),
      gender: 'male',
      role: 'Manager',
      isActive: false,
      department: 'Management',
      joinDate: new Date('2020-06-20')
    }
  ];

  constructor() {
    this.usersSubject.next(this.mockUsers);
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  getUserById(id: number): Observable<User | undefined> {
    const user = this.mockUsers.find(u => u.id === id);
    return of(user);
  }

  addUser(user: Omit<User, 'id'>): Observable<User> {
    const newUser: User = {
      ...user,
      id: Math.max(...this.mockUsers.map(u => u.id)) + 1
    };
    this.mockUsers.push(newUser);
    this.usersSubject.next([...this.mockUsers]);
    return of(newUser);
  }

  updateUser(id: number, updates: Partial<User>): Observable<User | null> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers[index] = { ...this.mockUsers[index], ...updates };
      this.usersSubject.next([...this.mockUsers]);
      return of(this.mockUsers[index]);
    }
    return of(null);
  }

  deleteUser(id: number): Observable<boolean> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers.splice(index, 1);
      this.usersSubject.next([...this.mockUsers]);
      return of(true);
    }
    return of(false);
  }

  getUserStats(): Observable<UserStats> {
    const stats: UserStats = {
      totalUsers: this.mockUsers.length,
      activeUsers: this.mockUsers.filter(u => u.isActive).length,
      newUsersThisMonth: this.mockUsers.filter(u => {
        const now = new Date();
        const userJoinDate = new Date(u.joinDate);
        return userJoinDate.getMonth() === now.getMonth() && 
               userJoinDate.getFullYear() === now.getFullYear();
      }).length,
      usersByDepartment: this.mockUsers.reduce((acc, user) => {
        const dept = user.department || 'Unknown';
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number })
    };
    return of(stats);
  }
}