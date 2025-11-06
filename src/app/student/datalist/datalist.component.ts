import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SampleService } from '../../shared/services/samplepage.service';
import { Samplepage } from '../../shared/models/samplepage.model';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-datalist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datalist.component.html',
  styleUrls: ['./datalist.component.css']
})
export class DatalistComponent implements OnInit {
  samples: Samplepage[] = [];
  allSamples: Samplepage[] = [];
  filterCourse = '';
  filterSession = '';
  searchName = '';

  userRole: string | null = null;

  constructor(
    private sampleService: SampleService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userRole = user?.role || null;
    this.getAllSamples();
  }

  getAllSamples(): void {
    this.sampleService.getAllSamples().subscribe({
      next: (sampleList: Samplepage[]) => {
        this.allSamples = sampleList;
        this.samples = [...sampleList];
      },
      error: (err: any) => {
        console.error('Error fetching samples:', err);
      }
    });
  }

  deleteSample(sampleId: number): void {
    if (this.userRole !== 'FACULTY') {
      alert('Only faculty can delete records.');
      return;
    }

    if (confirm('Are you sure you want to delete this entry?')) {
      this.sampleService.deleteSample(sampleId).subscribe({
        next: () => {
          this.samples = this.samples.filter(s => s.id !== sampleId);
          this.allSamples = this.allSamples.filter(s => s.id !== sampleId);
        },
        error: (err: any) => {
          console.error('Error deleting sample:', err);
        }
      });
    }
  }

  editSample(sample: Samplepage): void {
    if (this.userRole !== 'FACULTY') {
      alert('Only faculty can edit records.');
      return;
    }
    this.sampleService.setSelectedSample(sample);
    this.router.navigate(['/student/registration']);
  }

  viewFile(sample: Samplepage): void {
    const fileUrl = this.sampleService.downloadFile(sample.id!);
    window.open(fileUrl, '_blank');
  }

  filterSamples(): void {
    this.samples = this.allSamples.filter((sample: Samplepage) =>
      (!this.searchName || sample.name.toLowerCase().includes(this.searchName.toLowerCase())) &&
      (!this.filterCourse || sample.course.toLowerCase().includes(this.filterCourse.toLowerCase())) &&
      (!this.filterSession || sample.session.toLowerCase().includes(this.filterSession.toLowerCase()))
    );
  }
}
