import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Samplepage } from '../models/samplepage.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SampleService {
  private baseUrl = 'http://localhost:8080/api/samplepage';

  private selectedSample: Samplepage | null = null;

  constructor(private http: HttpClient) {}

  // ✅ Get all student registrations
  getAllSamples(): Observable<Samplepage[]> {
    return this.http.get<Samplepage[]>(`${this.baseUrl}`);
  }

  // ✅ Create new registration with file upload
  createSamplepageWithFile(formData: FormData): Observable<Samplepage> {
    return this.http.post<Samplepage>(`${this.baseUrl}`, formData);
  }

  // ✅ Update with file replacement (Spring expects @PutMapping("/upload/{id}"))
  updateSampleWithFile(id: number, formData: FormData): Observable<Samplepage> {
    return this.http.put<Samplepage>(`${this.baseUrl}/upload/${id}`, formData);
  }

  // ✅ Update without file (standard @PutMapping("/{id}"))
  updateSampleWithoutFile(id: number, sample: Samplepage): Observable<Samplepage> {
    return this.http.put<Samplepage>(`${this.baseUrl}/${id}`, sample);
  }

  // ✅ Delete by ID
  deleteSample(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ✅ Store selected sample for editing
  setSelectedSample(sample: Samplepage | null): void {
    this.selectedSample = sample;
  }

  getSelectedSample(): Samplepage | null {
    return this.selectedSample;
  }

  // ✅ Optional: download file (used in DatalistComponent)
  downloadFile(id: number): string {
    return `${this.baseUrl}/download/${id}`;
  }
}
