import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Assignment } from '../../shared/models/assignment.model';
import { Query } from '../../shared/models/query.model';
import { StudentService } from '../../shared/services/student.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
})
export class StudentDashboardComponent implements OnInit {
  assignments: Assignment[] = [];
  studentQueries: Query[] = [];
  newQueryText: string = '';
  studentId: number = 0;

  constructor(
    private studentService: StudentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const loggedInUser = this.authService.getCurrentUser();
    if (loggedInUser?.id) {
      this.studentId = loggedInUser.id;
      this.loadAssignments();
      this.loadStudentQueries();
    }
  }

  loadAssignments(): void {
    this.studentService.getAssignments().subscribe({
      next: (data) => (this.assignments = data),
      error: (err) => console.error('Failed to load assignments:', err),
    });
  }

  loadStudentQueries(): void {
    this.studentService.getQueries(this.studentId).subscribe({
      next: (data) => (this.studentQueries = data),
      error: (err) => console.error('Failed to load queries:', err),
    });
  }

  submitQuery(): void {
    const trimmedQuestion = this.newQueryText.trim();
    if (!trimmedQuestion) {
      alert('Please enter a query.');
      return;
    }

    this.studentService.submitQuery({ studentId: this.studentId, question: trimmedQuestion }).subscribe({
      next: () => {
        alert('Query submitted successfully.');
        this.newQueryText = '';
        this.loadStudentQueries();
      },
      error: (err) => {
        console.error('Failed to submit query:', err);
        alert('Failed to submit your query.');
      },
    });
  }

  downloadAssignment(filename: string) {
    this.studentService.downloadAssignment(filename);
  }
}
