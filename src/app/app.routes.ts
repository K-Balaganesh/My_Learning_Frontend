import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { StudentDashboardComponent } from './student/dashboard/student-dashboard.component';
import { FacultyDashboardComponent } from './faculty/dashboard/faculty-dashboard.component';
import { RegistrationComponent } from './student/registration/registration.component';
import { DatalistComponent } from './student/datalist/datalist.component';
import { FacultyQueryComponent } from './faculty/query/faculty-query.component'; // 👈 Add import
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  {
    path: 'student-dashboard',
    component: StudentDashboardComponent,
    canActivate: [authGuard],
    data: { roles: ['STUDENT'] },
  },
  {
    path: 'faculty-dashboard',
    component: FacultyDashboardComponent,
    canActivate: [authGuard],
    data: { roles: ['FACULTY'] },
  },
  {
    path: 'register',
    component: RegistrationComponent,
    canActivate: [authGuard],
    data: { roles: ['STUDENT'] },
  },
  {
    path: 'datalist',
    component: DatalistComponent,
    canActivate: [authGuard],
    data: { roles: ['FACULTY'] },
  },
 {
  path: 'faculty/queries',
  loadComponent: () =>
    import('./faculty/query/faculty-query.component').then(m => m.FacultyQueryComponent),
  canActivate: [authGuard],
  data: { roles: ['FACULTY'] },
},


  { path: '**', redirectTo: '/home' },   // Fallback route
];
