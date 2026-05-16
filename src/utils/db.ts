import Dexie, { Table } from 'dexie'
import { Card, Category } from '../types'

class MemowDatabase extends Dexie {
  cards!: Table<Card>
  categories!: Table<Category>

  constructor() {
    super('MemowDB')
    this.version(1).stores({
      cards: 'id, category, createdAt, lastReviewedAt',
      categories: 'id, name'
    })
  }
}

export const db = new MemowDatabase()

export const generateId = () => crypto.randomUUID()

export const cardService = {
  async getAll(): Promise<Card[]> {
    return await db.cards.toArray()
  },

  async getByCategory(category: string): Promise<Card[]> {
    if (category === 'Toutes') return await db.cards.toArray()
    return await db.cards.where('category').equals(category).toArray()
  },

  async create(card: Omit<Card, 'id' | 'createdAt' | 'updatedAt' | 'successCount' | 'failCount'>): Promise<Card> {
    const now = Date.now()
    const newCard: Card = {
      ...card,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      successCount: 0,
      failCount: 0
    }
    await db.cards.add(newCard)
    return newCard
  },

  async update(id: string, updates: Partial<Card>): Promise<void> {
    await db.cards.update(id, { ...updates, updatedAt: Date.now() })
  },

  async delete(id: string): Promise<void> {
    await db.cards.delete(id)
  },

  async recordSuccess(id: string): Promise<void> {
    const card = await db.cards.get(id)
    if (card) {
      await db.cards.update(id, {
        successCount: card.successCount + 1,
        lastReviewedAt: Date.now(),
        updatedAt: Date.now()
      })
    }
  },

  async recordFail(id: string): Promise<void> {
    const card = await db.cards.get(id)
    if (card) {
      await db.cards.update(id, {
        failCount: card.failCount + 1,
        lastReviewedAt: Date.now(),
        updatedAt: Date.now()
      })
    }
  },

  async search(query: string): Promise<Card[]> {
    const lowerQuery = query.toLowerCase()
    const allCards = await db.cards.toArray()
    return allCards.filter(card =>
      card.question.toLowerCase().includes(lowerQuery) ||
      card.answer.toLowerCase().includes(lowerQuery) ||
      (card.category && card.category.toLowerCase().includes(lowerQuery))
    )
  },

  async importCards(cards: Array<{ question: string; answer: string; category?: string }>): Promise<number> {
    const now = Date.now()
    const newCards: Card[] = cards.map(card => ({
      ...card,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      successCount: 0,
      failCount: 0
    }))
    await db.cards.bulkAdd(newCards)
    return newCards.length
  },

  async exportCards(): Promise<Card[]> {
    return await db.cards.toArray()
  }
}

export const categoryService = {
  async getAll(): Promise<Category[]> {
    return await db.categories.toArray()
  },

  async create(name: string): Promise<Category> {
    const newCategory: Category = {
      id: generateId(),
      name,
      createdAt: Date.now()
    }
    await db.categories.add(newCategory)
    return newCategory
  },

  async update(id: string, updates: Partial<Category>): Promise<void> {
    await db.categories.update(id, updates)
  },

  async delete(id: string): Promise<void> {
    await db.categories.delete(id)
  }
}