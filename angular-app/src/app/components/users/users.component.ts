import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['avatar', 'name', 'email', 'department', 'status', 'joinDate', 'actions'];
  dataSource = new MatTableDataSource<User>();
  selectedUser: User | null = null;
  
  searchTerm = '';
  selectedDepartment = '';
  selectedStatus = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.dataSource.data = users;
    });
  }

  applyFilter() {
    const filterValue = this.searchTerm.toLowerCase();
    
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const matchesSearch = !filter || 
        data.firstName.toLowerCase().includes(filter) ||
        data.lastName.toLowerCase().includes(filter) ||
        data.email.toLowerCase().includes(filter) ||
        (data.department && data.department.toLowerCase().includes(filter));
      
      const matchesDepartment = !this.selectedDepartment || 
        data.department === this.selectedDepartment;
      
      const matchesStatus = !this.selectedStatus || 
        (this.selectedStatus === 'active' && data.isActive) ||
        (this.selectedStatus === 'inactive' && !data.isActive);
      
      return matchesSearch && matchesDepartment && matchesStatus;
    };
    
    this.dataSource.filter = filterValue;
  }

  selectUser(user: User) {
    this.selectedUser = user;
  }

  clearSelection() {
    this.selectedUser = null;
  }

  openUserDialog(user?: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '600px',
      data: user ? { ...user } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (user) {
          this.updateUser(user.id, result);
        } else {
          this.addUser(result);
        }
      }
    });
  }

  editUser(user: User) {
    this.openUserDialog(user);
  }

  addUser(userData: Omit<User, 'id'>) {
    this.userService.addUser(userData).subscribe(newUser => {
      this.showSnackBar('User added successfully');
      this.loadUsers();
    });
  }

  updateUser(id: number, userData: Partial<User>) {
    this.userService.updateUser(id, userData).subscribe(updatedUser => {
      if (updatedUser) {
        this.showSnackBar('User updated successfully');
        this.loadUsers();
        if (this.selectedUser?.id === id) {
          this.selectedUser = updatedUser;
        }
      }
    });
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      this.userService.deleteUser(user.id).subscribe(success => {
        if (success) {
          this.showSnackBar('User deleted successfully');
          this.loadUsers();
          if (this.selectedUser?.id === user.id) {
            this.selectedUser = null;
          }
        }
      });
    }
  }

  toggleUserStatus(user: User) {
    const newStatus = !user.isActive;
    this.userService.updateUser(user.id, { isActive: newStatus }).subscribe(updatedUser => {
      if (updatedUser) {
        const statusText = newStatus ? 'activated' : 'deactivated';
        this.showSnackBar(`User ${statusText} successfully`);
        this.loadUsers();
      }
    });
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}