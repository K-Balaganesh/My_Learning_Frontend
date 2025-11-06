import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  images: string[] = [
    'assets/slide4.jpg',
    'assets/slide9.jpeg',
    'assets/slide6.jpg',
    'assets/slide8.jpeg',
    'assets/slide5.jpg',
  ];

  supportEmail = 'support@learnhub.com'; // 👈 Added property

  currentIndex = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private readonly slideInterval = 4000; // ms

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.clearAutoSlide();
  }

  private startAutoSlide(): void {
    this.clearAutoSlide();
    this.intervalId = setInterval(() => this.nextSlide(), this.slideInterval);
  }

  private clearAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevSlide(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.images.length) {
      this.currentIndex = index;
    }
  }

  pauseAutoSlide(): void {
    this.clearAutoSlide();
  }

  resumeAutoSlide(): void {
    this.startAutoSlide();
  }
}
