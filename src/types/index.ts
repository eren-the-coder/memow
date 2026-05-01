export interface Word {
  id: string;
  term: string;
  meaning: string;
  language: 'english' | 'french';
  dateAdded: Date;
  timesSeen: number;
  successes: number;
  failures: number;
  lastRevised?: Date;
}

export interface SessionStats {
  totalReviews: number;
  correctAnswers: number;
  date: Date;
}

export type Language = 'english' | 'french';