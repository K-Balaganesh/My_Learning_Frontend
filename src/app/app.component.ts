// app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './shared/services/auth.service';
import { Subscription } from 'rxjs';
import { UserLogin } from './shared/models/userlogin.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Student-Faculty Portal';
  isLoggedIn: boolean = false;
  userRole: string | null = null;

  private userSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe((user: UserLogin | null) => {
      this.isLoggedIn = !!user;
      this.userRole = user?.role?.toUpperCase() || null;
      console.log('AppComponent Navbar State Updated:');
      console.log('  isLoggedIn:', this.isLoggedIn);
      console.log('  userRole:', this.userRole);
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
