import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { UserStats } from '../../models/user.model';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
}

interface Activity {
  text: string;
  time: Date;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  statsCards: StatCard[] = [];
  recentActivities: Activity[] = [];
  departmentStats: { [key: string]: number } = {};
  maxDepartmentCount = 0;
  showAllActivities = false;
  maxActivitiesToShow = 3;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.generateRecentActivities();
  }

  loadDashboardData() {
    this.userService.getUserStats().subscribe(stats => {
      this.statsCards = [
        {
          label: 'Total Users',
          value: stats.totalUsers,
          icon: 'people',
          color: '#2196F3'
        },
        {
          label: 'Active Users',
          value: stats.activeUsers,
          icon: 'person',
          color: '#4CAF50'
        },
        {
          label: 'New This Month',
          value: stats.newUsersThisMonth,
          icon: 'person_add',
          color: '#FF9800'
        },
        {
          label: 'Departments',
          value: Object.keys(stats.usersByDepartment).length,
          icon: 'business',
          color: '#9C27B0'
        }
      ];

      this.departmentStats = stats.usersByDepartment;
      this.maxDepartmentCount = Math.max(...Object.values(stats.usersByDepartment));
    });
  }

  generateRecentActivities() {
    this.recentActivities = [
      {
        text: 'New user John Doe registered',
        time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        icon: 'person_add',
        color: '#4CAF50'
      },
      {
        text: 'System backup completed successfully',
        time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        icon: 'backup',
        color: '#2196F3'
      },
      {
        text: 'User profile updated',
        time: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        icon: 'edit',
        color: '#FF9800'
      },
      {
        text: 'Security scan completed',
        time: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        icon: 'security',
        color: '#9C27B0'
      },
      {
        text: 'Database optimization finished',
        time: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        icon: 'storage',
        color: '#607D8B'
      }
    ];
  }

  toggleActivities() {
    this.showAllActivities = !this.showAllActivities;
    this.maxActivitiesToShow = this.showAllActivities ? this.recentActivities.length : 3;
  }

  navigateToUsers() {
    this.router.navigate(['/users']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
  }

  showNotification() {
    this.snackBar.open('This is a test notification!', 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}