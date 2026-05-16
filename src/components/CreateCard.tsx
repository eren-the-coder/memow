import { useState } from 'react'
import { motion } from 'framer-motion'
import { Category } from '../types'

type CreateCardProps = {
  categories: Category[]
  onCreate: (question: string, answer: string, category?: string) => void
  onCancel: () => void
}

export function CreateCard({ categories, onCreate, onCancel }: CreateCardProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (question.trim() && answer.trim()) {
      onCreate(question.trim(), answer.trim(), category || undefined)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          Nouvelle carte
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Créez une nouvelle carte mémoire
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            Question
          </label>
          <textarea
            value={question}
            onChange={(e: any) => setQuestion(e.target.value)}
            placeholder="Entrez la question ou le mot..."
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            rows={3}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            Réponse
          </label>
          <textarea
            value={answer}
            onChange={(e: any) => setAnswer(e.target.value)}
            placeholder="Entrez la réponse ou la définition..."
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            Catégorie (optionnelle)
          </label>
          <select
            value={category}
            onChange={(e: any) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={!question.trim() || !answer.trim()}
            className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Créer
          </button>
        </div>
      </form>
    </motion.div>
  )
}