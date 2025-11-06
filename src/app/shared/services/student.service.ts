import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assignment } from '../models/assignment.model';
import { Query } from '../models/query.model';
import { Samplepage } from '../models/samplepage.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private studentApiUrl = 'http://localhost:8080/api/student';
  private samplePageApiUrl = 'http://localhost:8080/api/samplepage';

  constructor(private http: HttpClient) {}

  // Assignments
  getAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.studentApiUrl}/assignments`);
  }

  // Queries
  getQueries(studentId: number): Observable<Query[]> {
    return this.http.get<Query[]>(`${this.studentApiUrl}/queries?studentId=${studentId}`);
  }

  submitQuery(query: { studentId: number; question: string }): Observable<any> {
    return this.http.post(`${this.studentApiUrl}/query`, query);
  }

  // Registration APIs
  submitRegistration(formData: FormData): Observable<Samplepage> {
    return this.http.post<Samplepage>(this.samplePageApiUrl, formData);
  }

  getByEmail(email: string): Observable<Samplepage> {
    return this.http.get<Samplepage>(`${this.samplePageApiUrl}/by-email?email=${email}`);
  }

  getByUsername(username: string): Observable<Samplepage> {
    return this.http.get<Samplepage>(`${this.samplePageApiUrl}/by-username?username=${username}`);
  }

  // Download assignments only
  downloadAssignment(filename: string): void {
    const url = `${this.studentApiUrl}/assignments/download/${filename}`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      error: (err: HttpErrorResponse) => {
        console.error('File download failed:', err);
        alert('Unable to download assignment.');
      },
    });
  }
}
