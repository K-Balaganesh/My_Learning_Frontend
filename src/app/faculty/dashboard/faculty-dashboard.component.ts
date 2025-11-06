import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Assignment } from '../../shared/models/assignment.model';
import { Query } from '../../shared/models/query.model';
import { Samplepage } from '../../shared/models/samplepage.model';
import { FacultyService } from '../../shared/services/faculty.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-faculty-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faculty-dashboard.component.html',
  styleUrls: ['./faculty-dashboard.component.css']
})
export class FacultyDashboardComponent implements OnInit {
  assignments: Assignment[] = [];
  allQueries: Query[] = [];
  studentRegistrations: Samplepage[] = [];
  newAssignmentTitle: string = '';
  selectedAssignmentFile: File | null = null;
  responseTexts: { [key: number]: string } = {};

  // Filters
  filterName: string = '';
  filterCourse: string = '';
  filterId: string = '';

  // Edit
  editId: number | null = null;
  editForm: Partial<Samplepage> = {};

  constructor(
    private facultyService: FacultyService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAssignments();
    this.loadStudentQueries();
    this.loadStudentRegistrations();
  }

  // ---------------- Assignment Methods ----------------
  onAssignmentFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target?.files?.length) this.selectedAssignmentFile = target.files[0];
  }

  uploadAssignment(): void {
    if (!this.newAssignmentTitle.trim() || !this.selectedAssignmentFile) {
      alert('Please provide both assignment title and file.');
      return;
    }
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.username) {
      alert('Please log in again.');
      return;
    }
    this.facultyService.uploadAssignment(
      this.newAssignmentTitle,
      this.selectedAssignmentFile,
      currentUser.username
    ).subscribe({
      next: () => {
        alert('Assignment uploaded successfully.');
        this.newAssignmentTitle = '';
        this.selectedAssignmentFile = null;
        this.loadAssignments();
      },
      error: (err: any) => {
        console.error('Upload error:', err);
        alert('Failed to upload assignment.');
      }
    });
  }

  loadAssignments(): void {
    this.facultyService.getAssignments().subscribe({
      next: data => this.assignments = data,
      error: (err: any) => console.error(err)
    });
  }

  // ---------------- Query Methods ----------------
  loadStudentQueries(): void {
    this.facultyService.getAllQueries().subscribe({
      next: data => this.allQueries = data,
      error: (err: any) => console.error(err)
    });
  }

  respondToQuery(queryId: number): void {
    const response = this.responseTexts[queryId];
    if (!response?.trim()) {
      alert('Please enter a response.');
      return;
    }
    this.facultyService.respondToQuery(queryId, response).subscribe({
      next: () => {
        alert('Response sent!');
        this.responseTexts[queryId] = '';
        this.loadStudentQueries();
      },
      error: (err: any) => {
        console.error('Failed to respond to query', err);
        alert('Response failed.');
      }
    });
  }

  // ---------------- Student Registrations ----------------
  loadStudentRegistrations(): void {
    this.facultyService.getAllStudentRegistrations().subscribe({
      next: data => this.studentRegistrations = data,
      error: (err: any) => console.error(err)
    });
  }

  // ---------------- File Download ----------------
openFile(id: number, type: 'assignment' | 'student', filename?: string): void {
  this.facultyService.downloadFileBlob(id, type).subscribe({
    next: (blob: Blob) => {
      this.facultyService.saveFile(blob, filename || (type === 'assignment' ? 'assignment_file' : 'student_file'));
    },
    error: (err: any) => {
      console.error('Download failed', err);
      alert('Failed to download file.');
    }
  });
}


  // ---------------- Edit Student ----------------
  startEdit(student: Samplepage): void {
    this.editId = student.id!;
    this.editForm = { ...student };
  }

  saveEdit(studentId: number): void {
    this.facultyService.updateStudentRegistration(studentId, this.editForm)
      .subscribe({
        next: () => {
          alert('Student updated successfully');
          this.editId = null;
          this.loadStudentRegistrations();
        },
        error: (err: any) => {
          console.error(err);
          alert('Update failed');
        }
      });
  }

  cancelEdit(): void {
    this.editId = null;
    this.editForm = {};
  }

  // ---------------- Delete Student ----------------
  deleteStudent(studentId: number): void {
    if (!confirm('Are you sure you want to delete this student?')) return;

    this.facultyService.deleteStudentRegistration(studentId).subscribe({
      next: () => {
        alert('Student deleted successfully!');
        this.loadStudentRegistrations();
      },
      error: (err: any) => {
        console.error(err);
        alert('Failed to delete student.');
      }
    });
  }

  // ---------------- Filters ----------------
  resetFilters(): void {
    this.filterId = '';
    this.filterName = '';
    this.filterCourse = '';
  }

  filteredRegistrations(): Samplepage[] {
    return this.studentRegistrations.filter(reg => {
      const matchesId = this.filterId ? (reg.id?.toString() ?? '').includes(this.filterId) : true;
      const matchesName = reg.name.toLowerCase().includes(this.filterName.toLowerCase());
      const matchesCourse = reg.course.toLowerCase().includes(this.filterCourse.toLowerCase());
      return matchesId && matchesName && matchesCourse;
    });
  }
}
