import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  originalFormValue: any;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      department: ['', Validators.required],
      role: ['', [Validators.required, Validators.minLength(2)]],
      joinDate: [{ value: '', disabled: true }],
      bio: [''],
      emailNotifications: [true],
      smsNotifications: [false],
      marketingEmails: [false],
      newsletter: [true],
      preferredLanguage: ['en']
    });
  }

  private loadUserProfile() {
    // Simulate loading current user profile (ID: 1)
    this.userService.getUserById(1).subscribe(user => {
      if (user) {
        const profileData = {
          ...user,
          dateOfBirth: new Date(user.dateOfBirth),
          joinDate: new Date(user.joinDate),
          bio: 'Passionate software developer with 5+ years of experience in web technologies.',
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: false,
          newsletter: true,
          preferredLanguage: 'en'
        };
        
        this.profileForm.patchValue(profileData);
        this.originalFormValue = this.profileForm.getRawValue();
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      
      // Simulate API call delay
      setTimeout(() => {
        const formValue = this.profileForm.value;
        
        // Update user profile (excluding preferences for this demo)
        const userUpdate = {
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          email: formValue.email,
          phone: formValue.phone,
          dateOfBirth: formValue.dateOfBirth,
          gender: formValue.gender,
          department: formValue.department,
          role: formValue.role
        };
        
        this.userService.updateUser(1, userUpdate).subscribe(updatedUser => {
          this.isLoading = false;
          if (updatedUser) {
            this.originalFormValue = this.profileForm.getRawValue();
            this.profileForm.markAsPristine();
            this.showSnackBar('Profile updated successfully!');
          } else {
            this.showSnackBar('Failed to update profile. Please try again.');
          }
        });
      }, 1500);
    } else {
      this.markFormGroupTouched();
      this.showSnackBar('Please fill in all required fields correctly.');
    }
  }

  resetForm() {
    this.profileForm.patchValue(this.originalFormValue);
    this.profileForm.markAsPristine();
    this.showSnackBar('Form reset to original values.');
  }

  private markFormGroupTouched() {
    Object.keys(this.profileForm.controls).forEach(key => {
      this.profileForm.get(key)?.markAsTouched();
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