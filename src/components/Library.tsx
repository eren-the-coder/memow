import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, Category } from '../types'
import { deleteCategory, updateCategory } from '../utils/storage'

type LibraryProps = {
  cards: Card[]
  categories: Category[]
  onDeleteCard: (id: string) => void
  onEditCard: (card: Card) => void
  onCreateCategory: (name: string) => void
  onRefreshCategories: () => void
  onRefreshCards: () => void
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export function Library({
  cards,
  categories,
  onDeleteCard,
  onEditCard,
  onCreateCategory,
  onRefreshCategories,
  onRefreshCards
}: LibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Toutes')
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState<Category | null>(null)

  const filteredCards = cards.filter(card => {
    const matchesSearch =
      card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'Toutes' || card.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      onCreateCategory(newCategoryName.trim())
      setNewCategoryName('')
      setShowCategoryModal(false)
    }
  }

  const handleSaveEdit = () => {
    if (editingCard) {
      onEditCard(editingCard)
      setEditingCard(null)
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory({ ...category })
  }

  const handleSaveCategoryEdit = () => {
    if (editingCategory) {
      updateCategory(editingCategory.id, editingCategory.name)
      onRefreshCategories()
      onRefreshCards()
      setEditingCategory(null)
    }
  }

  const handleDeleteCategory = (category: Category) => {
    setDeleteCategoryConfirm(category)
  }

  const confirmDeleteCategory = () => {
    if (deleteCategoryConfirm) {
      deleteCategory(deleteCategoryConfirm.id)
      onRefreshCategories()
      onRefreshCards()
      setDeleteCategoryConfirm(null)
      setSelectedCategory('Toutes')
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e: any) => setSearchQuery(e.target.value)}
          placeholder="Rechercher une carte..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('Toutes')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === 'Toutes'
              ? 'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-800'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
        >
          Toutes
        </button>
        {categories.map((cat) => (
          <div key={cat.id} className="relative group">
            <button
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${selectedCategory === cat.name
                  ? 'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-800'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
            >
              {cat.name}
              {selectedCategory === cat.name && selectedCategory !== 'Toutes' && (
                <div className="flex gap-1 ml-1">
                  <svg
                    onClick={(e: any) => {
                      e.stopPropagation()
                      handleEditCategory(cat)
                    }}
                    className="w-4 h-4 cursor-pointer hover:text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <svg
                    onClick={(e: any) => {
                      e.stopPropagation()
                      handleDeleteCategory(cat)
                    }}
                    className="w-4 h-4 cursor-pointer hover:text-rose-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        ))}
        <button
          onClick={() => setShowCategoryModal(true)}
          className="px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-colors"
        >
          + Catégorie
        </button>
      </div>

      <div className="grid gap-3">
        <AnimatePresence>
          {filteredCards.map((card) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {card.question}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {card.answer}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    {card.category && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {card.category}
                      </span>
                    )}
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      Ajoutée le {formatDate(card.createdAt)}
                    </span>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {card.successCount}
                      </span>
                      <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {card.failCount}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCard(card)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(card.id)}
                    className="p-2 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          Aucune carte trouvée
        </div>
      )}

      {/* Category Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCategoryModal(false)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                  Nouvelle catégorie
                </h3>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e: any) => setNewCategoryName(e.target.value)}
                  placeholder="Nom de la catégorie"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleCreateCategory}
                    className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    Créer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Category Modal */}
      <AnimatePresence>
        {editingCategory && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingCategory(null)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e: any) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                  Modifier la catégorie
                </h3>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e: any) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveCategoryEdit}
                    className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Category Confirmation Modal */}
      <AnimatePresence>
        {deleteCategoryConfirm && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteCategoryConfirm(null)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  Supprimer la catégorie ?
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  La catégorie "{deleteCategoryConfirm.name}" sera supprimée. Les cartes associées seront aussi supprimées.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteCategoryConfirm(null)}
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDeleteCategory}
                    className="flex-1 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Card Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  Supprimer cette carte ?
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      onDeleteCard(deleteConfirmId)
                      setDeleteConfirmId(null)
                    }}
                    className="flex-1 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Card Modal */}
      <AnimatePresence>
        {editingCard && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingCard(null)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e: any) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                  Modifier la carte
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                      Question
                    </label>
                    <input
                      type="text"
                      value={editingCard.question}
                      onChange={(e: any) => setEditingCard({ ...editingCard, question: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                      Réponse
                    </label>
                    <input
                      type="text"
                      value={editingCard.answer}
                      onChange={(e: any) => setEditingCard({ ...editingCard, answer: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                      Catégorie
                    </label>
                    <select
                      value={editingCard.category || ''}
                      onChange={(e: any) => setEditingCard({ ...editingCard, category: e.target.value || undefined })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Aucune catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setEditingCard(null)}
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}