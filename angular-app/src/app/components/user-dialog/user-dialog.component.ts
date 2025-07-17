import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null
  ) {
    this.userForm = this.createForm();
  }

  ngOnInit() {
    if (this.data) {
      this.userForm.patchValue({
        ...this.data,
        dateOfBirth: new Date(this.data.dateOfBirth),
        joinDate: new Date(this.data.joinDate)
      });
    }
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
      joinDate: [new Date(), Validators.required],
      isActive: [true]
    });
  }

  onSave() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const userData = {
        ...formValue,
        dateOfBirth: new Date(formValue.dateOfBirth),
        joinDate: new Date(formValue.joinDate)
      };
      
      this.dialogRef.close(userData);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}