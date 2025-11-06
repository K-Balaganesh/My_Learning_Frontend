// src/app/faculty/faculty-query/faculty-query.component.ts
import { Component, OnInit } from '@angular/core';
import { Query } from '../../shared/models/query.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacultyService } from '../../shared/services/faculty.service';

@Component({
  selector: 'app-faculty-query',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faculty-query.component.html',
  styleUrls: ['./faculty-query.component.css']
})
export class FacultyQueryComponent implements OnInit {
  queries: Query[] = [];
  replyTextMap: { [key: number]: string } = {};

  constructor(private facultyService: FacultyService) {}

  ngOnInit(): void {
    this.loadQueries();
  }

  loadQueries(): void {
    this.facultyService.getAllQueries().subscribe((data: Query[]) => {
      this.queries = data;
    });
  }

  submitReplyTo(queryId: number): void {
    const reply = this.replyTextMap[queryId]?.trim();
    if (reply) {
      this.facultyService.respondToQuery(queryId, reply).subscribe(() => {
        alert('Reply sent successfully!');
        this.replyTextMap[queryId] = '';
        this.loadQueries();
      });
    } else {
      alert('Please enter a reply before submitting.');
    }
  }
}
