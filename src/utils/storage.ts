import { Card, Category } from '../types'

const CARDS_KEY = 'memow_cards'
const CATEGORIES_KEY = 'memow_categories'
const THEME_KEY = 'memow_theme'

// Cards
export function getCards(): Card[] {
  const data = localStorage.getItem(CARDS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveCard(card: Card): void {
  const cards = getCards()
  const existingIndex = cards.findIndex(c => c.id === card.id)
  if (existingIndex >= 0) {
    cards[existingIndex] = card
  } else {
    cards.push(card)
  }
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards))
}

export function saveCards(newCards: Card[]): void {
  const existingCards = getCards()
  const existingIds = new Set(existingCards.map(c => c.id))
  
  const mergedCards = [...existingCards]
  for (const card of newCards) {
    if (!existingIds.has(card.id)) {
      mergedCards.push(card)
    }
  }
  
  localStorage.setItem(CARDS_KEY, JSON.stringify(mergedCards))
}

export function updateCard(card: Card): void {
  const cards = getCards()
  const index = cards.findIndex(c => c.id === card.id)
  if (index >= 0) {
    cards[index] = card
    localStorage.setItem(CARDS_KEY, JSON.stringify(cards))
  }
}

export function deleteCard(id: string): void {
  const cards = getCards().filter(c => c.id !== id)
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards))
}

// Categories
export function getCategories(): Category[] {
  const data = localStorage.getItem(CATEGORIES_KEY)
  return data ? JSON.parse(data) : []
}

export function saveCategory(category: Category): void {
  const categories = getCategories()
  const existingIndex = categories.findIndex(c => c.id === category.id)
  if (existingIndex >= 0) {
    categories[existingIndex] = category
  } else {
    categories.push(category)
  }
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
}

export function updateCategory(id: string, name: string): void {
  const categories = getCategories()
  const index = categories.findIndex(c => c.id === id)
  if (index >= 0) {
    categories[index].name = name
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
    
    // Update cards with this category
    const cards = getCards()
    const oldName = categories[index].name
    cards.forEach((card, cardIndex) => {
      if (card.category === oldName) {
        cards[cardIndex].category = name
      }
    })
    localStorage.setItem(CARDS_KEY, JSON.stringify(cards))
  }
}

export function deleteCategory(id: string): void {
  const categories = getCategories()
  const category = categories.find(c => c.id === id)
  
  if (category) {
    // Remove category
    const filteredCategories = categories.filter(c => c.id !== id)
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filteredCategories))
    
    // Delete cards with this category
    const cards = getCards().filter(c => c.category !== category.name)
    localStorage.setItem(CARDS_KEY, JSON.stringify(cards))
  }
}

// Theme
export function getTheme(): 'light' | 'dark' {
  const data = localStorage.getItem(THEME_KEY)
  return data === 'dark' ? 'dark' : 'light'
}

export function saveTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(THEME_KEY, theme)
}