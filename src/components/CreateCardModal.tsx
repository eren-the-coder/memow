import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Category } from '../types'

type CreateCardModalProps = {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  onCreate: (card: { question: string; answer: string; category?: string }) => void
}

export function CreateCardModal({ isOpen, onClose, categories, onCreate }: CreateCardModalProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (!question.trim() || !answer.trim()) return

    onCreate({
      question: question.trim(),
      answer: answer.trim(),
      category: category || undefined
    })

    setQuestion('')
    setAnswer('')
    setCategory('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
                Nouvelle carte
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="question" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Question
                  </label>
                  <input
                    id="question"
                    type="text"
                    value={question}
                    onChange={(e: any) => setQuestion(e.target.value)}
                    placeholder="Mot, question, formule..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="answer" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Réponse
                  </label>
                  <input
                    id="answer"
                    type="text"
                    value={answer}
                    onChange={(e: any) => setAnswer(e.target.value)}
                    placeholder="Définition, réponse, traduction..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Catégorie (optionnelle)
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
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

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    Créer
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}