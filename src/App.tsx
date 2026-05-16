import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, Category } from './types'
import { useCards, useCategories, useTheme } from './utils/hooks'
import { saveCard, deleteCard, saveCategory, updateCard, saveCards } from './utils/storage'
import { Flashcard } from './components/Flashcard'
import { CategorySelector } from './components/CategorySelector'
import { Library } from './components/Library'
import { Statistics } from './components/Statistics'
import { Settings } from './components/Settings'
import { CreateCard } from './components/CreateCard'

type View = 'home' | 'library' | 'create' | 'statistics' | 'settings'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { cards, loading: cardsLoading, refresh: refreshCards } = useCards()
  const { categories, loading: categoriesLoading, refresh: refreshCategories } = useCategories()
  
  const [currentView, setCurrentView] = useState<View>('home')
  const [selectedCategory, setSelectedCategory] = useState('Toutes')
  const [currentIndex, setCurrentIndex] = useState(0)

  const filteredCards = cards.filter(card => {
    return selectedCategory === 'Toutes' || card.category === selectedCategory
  })

  const currentCard = filteredCards[currentIndex]

  const handleNextCard = () => {
    if (filteredCards.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length)
    }
  }

  const handlePreviousCard = () => {
    if (filteredCards.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length)
    }
  }

  const handleSuccess = () => {
    if (currentCard) {
      const updatedCard = {
        ...currentCard,
        successCount: currentCard.successCount + 1,
        lastReviewedAt: Date.now(),
        updatedAt: Date.now()
      }
      updateCard(updatedCard)
      refreshCards()
    }
    handleNextCard()
  }

  const handleFail = () => {
    if (currentCard) {
      const updatedCard = {
        ...currentCard,
        failCount: currentCard.failCount + 1,
        lastReviewedAt: Date.now(),
        updatedAt: Date.now()
      }
      updateCard(updatedCard)
      refreshCards()
    }
    handleNextCard()
  }

  const handleCreateCard = (question: string, answer: string, category?: string) => {
    const newCard: Card = {
      id: crypto.randomUUID(),
      question,
      answer,
      category,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      successCount: 0,
      failCount: 0
    }
    saveCard(newCard)
    refreshCards()
    setCurrentView('home')
  }

  const handleCreateCategory = (name: string) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now()
    }
    saveCategory(newCategory)
    refreshCategories()
  }

  const handleDeleteCard = (id: string) => {
    deleteCard(id)
    refreshCards()
  }

  const handleEditCard = (card: Card) => {
    updateCard(card)
    refreshCards()
  }

  const handleImport = (importedCards: Card[]) => {
    saveCards(importedCards)
    refreshCards()
  }

  useEffect(() => {
    setCurrentIndex(0)
  }, [selectedCategory])

  if (cardsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Memow
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Mieux mémoriser
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {cards.length} cartes
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <AnimatePresence mode="wait">
            {currentView === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <CategorySelector
                  categories={categories}
                  selected={selectedCategory}
                  onSelect={setSelectedCategory}
                />

                <div className="mt-8">
                  {currentCard ? (
                    <Flashcard
                      card={currentCard}
                      onSuccess={handleSuccess}
                      onFail={handleFail}
                      onPrevious={handlePreviousCard}
                      onNext={handleNextCard}
                      canGoPrevious={filteredCards.length > 1}
                      canGoNext={filteredCards.length > 1}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 mb-2">
                        Aucune carte à réviser
                      </p>
                      <p className="text-sm text-slate-400 dark:text-slate-500">
                        {selectedCategory === 'Toutes' 
                          ? 'Créez votre première carte pour commencer'
                          : 'Sélectionnez une autre catégorie ou créez des cartes'}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {currentView === 'library' && (
              <motion.div
                key="library"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Library
                  cards={cards}
                  categories={categories}
                  onDeleteCard={handleDeleteCard}
                  onEditCard={handleEditCard}
                  onCreateCategory={handleCreateCategory}
                  onRefreshCategories={refreshCategories}
                  onRefreshCards={refreshCards}
                />
              </motion.div>
            )}

            {currentView === 'create' && (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <CreateCard
                  categories={categories}
                  onCreate={handleCreateCard}
                  onCancel={() => setCurrentView('home')}
                />
              </motion.div>
            )}

            {currentView === 'statistics' && (
              <motion.div
                key="statistics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Statistics cards={cards} categories={categories} />
              </motion.div>
            )}

            {currentView === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Settings
                  theme={theme}
                  onToggleTheme={toggleTheme}
                  onImport={handleImport}
                  cards={cards}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-around py-2">
            {[
              { id: 'home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
              { id: 'library', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
              { id: 'create', icon: 'M12 4v16m8-8H4' },
              { id: 'statistics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              { id: 'settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 13a3 3 0 11-6 0 3 3 0 016 0z' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as View)}
                className={`p-3 rounded-xl transition-colors ${
                  currentView === item.id
                    ? 'bg-slate-800 dark:bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <svg 
                  className="w-6 h-6" 
                  fill={currentView === item.id ? 'currentColor' : 'none'}
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default App