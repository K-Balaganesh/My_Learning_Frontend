import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../shared/services/auth.service';
import { UserLogin } from '../../shared/models/userlogin.model';

interface SignupSuccessResponse {
  message: string;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  user: UserLogin = { username: '', password: '', role: '' };
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
  if (!this.user.role) {
    this.errorMessage = 'Please select a role';
    return;
  }
  this.authService.signup(this.user).subscribe({
    next: (res) => {
      this.successMessage = res.message;
      this.router.navigate(['/login']);
    },
    error: (err) => {
      this.errorMessage = err.message || 'Signup failed';
    }
  });
}

}
