import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

interface SettingSection {
  id: string;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  activeSection = 'general';
  
  settingSections: SettingSection[] = [
    { id: 'general', title: 'General', icon: 'settings' },
    { id: 'notifications', title: 'Notifications', icon: 'notifications' },
    { id: 'security', title: 'Security', icon: 'security' },
    { id: 'privacy', title: 'Privacy', icon: 'privacy_tip' }
  ];

  generalForm: FormGroup;
  notificationForm: FormGroup;
  securityForm: FormGroup;
  privacyForm: FormGroup;

  private originalValues: { [key: string]: any } = {};

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.generalForm = this.createGeneralForm();
    this.notificationForm = this.createNotificationForm();
    this.securityForm = this.createSecurityForm();
    this.privacyForm = this.createPrivacyForm();
  }

  ngOnInit() {
    this.loadSettings();
    this.storeOriginalValues();
  }

  private createGeneralForm(): FormGroup {
    return this.fb.group({
      theme: ['light'],
      language: ['en'],
      timezone: ['UTC'],
      autoSave: [true],
      compactMode: [false],
      showTooltips: [true]
    });
  }

  private createNotificationForm(): FormGroup {
    return this.fb.group({
      emailEnabled: [true],
      newUserEmails: [true],
      systemAlerts: [true],
      weeklyReports: [false],
      securityAlerts: [true],
      pushEnabled: [true],
      instantMessages: [true],
      taskReminders: [true],
      meetingAlerts: [true],
      quietHoursStart: ['22:00'],
      quietHoursEnd: ['08:00']
    });
  }

  private createSecurityForm(): FormGroup {
    return this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      twoFactorEnabled: [false],
      rememberMe: [true],
      sessionTimeout: [60, [Validators.min(5), Validators.max(480)]]
    }, { validators: this.passwordMatchValidator });
  }

  private createPrivacyForm(): FormGroup {
    return this.fb.group({
      analyticsEnabled: [true],
      crashReporting: [true],
      profileVisibility: ['team'],
      showOnlineStatus: [true]
    });
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  private loadSettings() {
    // Simulate loading settings from API
    // In a real app, you would load these from a service
  }

  private storeOriginalValues() {
    this.originalValues = {
      general: this.generalForm.value,
      notifications: this.notificationForm.value,
      security: this.securityForm.value,
      privacy: this.privacyForm.value
    };
  }

  selectSection(sectionId: string) {
    this.activeSection = sectionId;
  }

  hasUnsavedChanges(): boolean {
    const currentForm = this.getCurrentForm();
    if (!currentForm) return false;
    
    const originalValue = this.originalValues[this.activeSection];
    const currentValue = currentForm.value;
    
    return JSON.stringify(originalValue) !== JSON.stringify(currentValue);
  }

  private getCurrentForm(): FormGroup | null {
    switch (this.activeSection) {
      case 'general': return this.generalForm;
      case 'notifications': return this.notificationForm;
      case 'security': return this.securityForm;
      case 'privacy': return this.privacyForm;
      default: return null;
    }
  }

  resetCurrentForm() {
    const currentForm = this.getCurrentForm();
    if (currentForm) {
      currentForm.patchValue(this.originalValues[this.activeSection]);
      this.showSnackBar('Settings reset to original values');
    }
  }

  saveCurrentSettings() {
    const currentForm = this.getCurrentForm();
    if (currentForm && currentForm.valid) {
      // Simulate API call
      setTimeout(() => {
        this.originalValues[this.activeSection] = currentForm.value;
        currentForm.markAsPristine();
        this.showSnackBar(`${this.getSectionTitle()} settings saved successfully`);
      }, 500);
    } else {
      this.showSnackBar('Please fix validation errors before saving');
    }
  }

  private getSectionTitle(): string {
    const section = this.settingSections.find(s => s.id === this.activeSection);
    return section ? section.title : 'Settings';
  }

  changePassword() {
    if (this.securityForm.get('currentPassword')?.valid && 
        this.securityForm.get('newPassword')?.valid && 
        this.securityForm.get('confirmPassword')?.valid &&
        !this.securityForm.hasError('passwordMismatch')) {
      
      // Simulate password change
      setTimeout(() => {
        this.securityForm.patchValue({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        this.showSnackBar('Password changed successfully');
      }, 1000);
    } else {
      this.showSnackBar('Please fill in all password fields correctly');
    }
  }

  exportData() {
    // Simulate data export
    this.showSnackBar('Data export started. You will receive an email when ready.');
  }

  deleteAccount() {
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmed) {
      this.showSnackBar('Account deletion request submitted. Please check your email for confirmation.');
    }
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}