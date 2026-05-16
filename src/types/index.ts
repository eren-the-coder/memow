export type Card = {
  id: string
  question: string
  answer: string
  category?: string
  createdAt: number
  updatedAt: number
  successCount: number
  failCount: number
  lastReviewedAt?: number
}

export type Category = {
  id: string
  name: string
  createdAt: number
}