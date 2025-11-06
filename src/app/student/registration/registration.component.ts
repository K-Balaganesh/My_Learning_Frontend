import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Samplepage } from '../../shared/models/samplepage.model';
import { StudentService } from '../../shared/services/student.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  studentRegistration: Samplepage = {
    name: '',
    age: 0,
    gender: '',
    no: '',
    email: '', // 💡 Manually typed by student
    course: '',
    paymentmethod: '',
    session: '',
    filename: '',
  };

  selectedFile: File | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  formEnabled = true;

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    if (user?.username) {
      // ✅ Check if student already registered using username
      this.studentService.getByEmail(user.username).subscribe({
        next: (existingData: Samplepage) => {
          if (existingData) {
            this.studentRegistration = existingData;
            this.formEnabled = false;
            this.successMessage = 'You have already registered.';
          }
        },
        error: () => {
          this.formEnabled = true; // allow registration if not found
        },
      });
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'Login session expired. Please login again.';
      return;
    }

    const formData = new FormData();
    formData.append('name', this.studentRegistration.name.trim());
    formData.append('age', this.studentRegistration.age.toString());
    formData.append('gender', this.studentRegistration.gender);
    formData.append('no', this.studentRegistration.no);
    formData.append('username', currentUser.username); // used to find user_id
    formData.append('email', this.studentRegistration.email.trim()); // manually entered email
    formData.append('course', this.studentRegistration.course);
    formData.append('paymentmethod', this.studentRegistration.paymentmethod);
    formData.append('session', this.studentRegistration.session);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    this.studentService.submitRegistration(formData).subscribe({
      next: () => {
        this.successMessage = 'Registration successful!';
        this.formEnabled = false;
        this.router.navigate(['/student-dashboard']);
      },
      error: (err) => {
  const errorMsg = err.error?.message || 'Registration failed. Please try again.';
  this.errorMessage = errorMsg;
  console.error('Registration error:', errorMsg);
}

    });
  }
}
