import { useState, useEffect } from 'react'
import { Card, Category } from '../types'
import { getCards, getCategories, getTheme, saveTheme } from './storage'

export function useCards() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = () => {
    const data = getCards()
    setCards(data)
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  return { cards, loading, refresh }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = () => {
    const data = getCategories()
    setCategories(data)
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  return { categories, loading, refresh }
}

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const savedTheme = getTheme()
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    saveTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return { theme, toggleTheme }
}