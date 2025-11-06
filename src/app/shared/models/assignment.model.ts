export interface Assignment {
  id?: number;
  title: string;
  uploadDate: string; // Or Date, depending on how you handle dates in Angular
  filename: string;
}