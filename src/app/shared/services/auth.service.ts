import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserLogin } from '../models/userlogin.model';
import { AuthResponse } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserLogin | null>;
  public currentUser$: Observable<UserLogin | null>;

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = this.getStoredUserFromToken();
    this.currentUserSubject = new BehaviorSubject<UserLogin | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // ✅ Decode token stored in localStorage and extract user info
  private getStoredUserFromToken(): UserLogin | null {
    const token = localStorage.getItem('jwt_token');

    if (token) {
      try {
        const parsed = typeof token === 'string' ? JSON.parse(token) : token;
        const payload = parsed; // If backend returns full object, not pure JWT

        if (payload && payload.username && payload.role) {
          localStorage.setItem('userRole', payload.role.toUpperCase());

          return {
            id: payload.id,
            username: payload.username,
            role: payload.role.toUpperCase(),
          } as UserLogin;
        }
      } catch (error) {
        console.error('Failed to parse stored token:', error);
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('userRole');
      }
    }
    return null;
  }

  // ✅ Signup method that returns clean error if username is taken
  signup(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user).pipe(
      catchError(error => {
        const message = error.error?.message || 'Signup failed';
        return throwError(() => new Error(message));
      })
    );
  }

  // ✅ Login method: stores token, sets user, and emits value
  login(credentials: any): Observable<UserLogin | null> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, credentials).pipe(
      map(response => {
        if (response && response.role) {
          // Save full object (not just token string)
          localStorage.setItem('jwt_token', JSON.stringify(response));
          localStorage.setItem('userRole', response.role.toUpperCase());

          const user: UserLogin = {
            id: response.id,
            username: response.username,
            role: response.role.toUpperCase(),
          };

          this.currentUserSubject.next(user);
          return user;
        }
        return null;
      }),
      catchError(error => {
        const message = error.error?.message || 'Login failed';
        return throwError(() => new Error(message));
      })
    );
  }

  // ✅ Logout function clears localStorage and state
  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('userRole');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // ✅ Observable for login state
  get isLoggedIn$(): Observable<boolean> {
    return this.currentUser$.pipe(map(user => !!user));
  }

  // ✅ Observable for current user's role
  get userRole$(): Observable<string | null> {
    return this.currentUser$.pipe(
      map(user => user?.role?.toUpperCase() || null)
    );
  }

  // ✅ Synchronously get current user
  getCurrentUser(): UserLogin | null {
    return this.currentUserSubject.value;
  }
}
