import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assignment } from '../models/assignment.model';
import { Query } from '../models/query.model';
import { Samplepage } from '../models/samplepage.model';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class FacultyService {
  private facultyApiUrl = 'http://localhost:8080/api/faculty';
  private samplePageApiUrl = 'http://localhost:8080/api/samplepage';

  constructor(private http: HttpClient) {}

  uploadAssignment(title: string, file: File, facultyUsername: string): Observable<any> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    formData.append('facultyUsername', facultyUsername);
    return this.http.post(`${this.facultyApiUrl}/assignments`, formData);
  }

  getAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.facultyApiUrl}/assignments`);
  }

  getAllStudentRegistrations(): Observable<Samplepage[]> {
    return this.http.get<Samplepage[]>(this.samplePageApiUrl);
  }

  getAllQueries(): Observable<Query[]> {
    return this.http.get<Query[]>(`${this.facultyApiUrl}/queries`);
  }

  respondToQuery(queryId: number, response: string): Observable<any> {
    return this.http.post(`${this.facultyApiUrl}/queries/${queryId}/response`, { response });
  }

  updateStudentRegistration(id: number, student: Partial<Samplepage>): Observable<Samplepage> {
    const payload = {
      name: student.name,
      email: student.email,
      course: student.course,
      session: student.session
    };
    return this.http.put<Samplepage>(`${this.samplePageApiUrl}/${id}`, payload);
  }

  deleteStudentRegistration(id: number): Observable<void> {
    return this.http.delete<void>(`${this.samplePageApiUrl}/${id}`);
  }

  // Download any file (student registration or assignment)
  downloadFileBlob(id: number, type: 'assignment' | 'student'): Observable<Blob> {
    const url =
      type === 'assignment'
        ? `${this.facultyApiUrl}/assignments/download/${id}`
        : `${this.samplePageApiUrl}/download/${id}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  // Helper to save file
  saveFile(blob: Blob, filename: string) {
    saveAs(blob, filename);
  }
}
