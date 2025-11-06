import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { StudentService } from '../../shared/services/student.service';
import { UserLogin } from '../../shared/models/userlogin.model';
import { Samplepage } from '../../shared/models/samplepage.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user: UserLogin = { username: '', password: '', role: '' };
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.user.role) {
      this.errorMessage = 'Please select a role.';
      return;
    }

    this.authService.login(this.user).subscribe({
      next: () => {
        const loggedInUser = this.authService.getCurrentUser();

        if (!loggedInUser) {
          this.errorMessage = 'Login failed. Please try again.';
          return;
        }

        if (loggedInUser.role === 'STUDENT') {
          this.studentService.getByUsername(loggedInUser.username).subscribe({
            next: (existingData: Samplepage) => {
              // Already registered -> go dashboard
              this.router.navigate(['/student-dashboard']);
            },
            error: (err: any) => {
              if (err.status === 404) {
                // First-time login -> registration
                this.router.navigate(['/register']);
              } else {
                this.errorMessage =
                  'Unable to verify registration. Please try again.';
              }
            },
          });
        } else if (loggedInUser.role === 'FACULTY') {
          this.router.navigate(['/faculty-dashboard']);
        } else {
          this.errorMessage = 'Unknown role. Please contact admin.';
        }
      },
      error: (err: any) => {
        this.errorMessage = err.message || 'Login failed';
      },
    });
  }
}
