export interface Query {
  id?: number;
  question: string;
  askedDate?: Date;
  response?: string;
  respondedDate?: Date;
  student: { id: number };
}