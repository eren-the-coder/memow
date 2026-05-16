import { motion } from 'framer-motion'
import { Card, Category } from '../types'

type StatisticsProps = {
  cards: Card[]
  categories: Category[]
}

export function Statistics({ cards, categories }: StatisticsProps) {
  const totalCards = cards.length
  
  const totalSuccess = cards.reduce((sum, card) => sum + card.successCount, 0)
  const totalFail = cards.reduce((sum, card) => sum + card.failCount, 0)
  const totalReviews = totalSuccess + totalFail
  
  const successRate = totalReviews > 0 
    ? Math.round((totalSuccess / totalReviews) * 100) 
    : 0

  const masteredCards = cards.filter(card => {
    const total = card.successCount + card.failCount
    return total >= 5 && (card.successCount / total) >= 0.8
  }).length

  const strugglingCards = cards
    .filter(card => card.failCount > 0)
    .sort((a, b) => b.failCount - a.failCount)
    .slice(0, 5)

  const categoryStats = categories.map(cat => {
    const catCards = cards.filter(c => c.category === cat.name)
    const catSuccess = catCards.reduce((sum, c) => sum + c.successCount, 0)
    const catFail = catCards.reduce((sum, c) => sum + c.failCount, 0)
    const catTotal = catSuccess + catFail
    
    return {
      name: cat.name,
      count: catCards.length,
      successRate: catTotal > 0 ? Math.round((catSuccess / catTotal) * 100) : 0
    }
  }).filter(stat => stat.count > 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Statistiques
      </h2>

      {/* Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {totalCards}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Cartes totales
          </p>
        </div>
        
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {masteredCards}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Cartes maîtrisées
          </p>
        </div>
        
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {totalReviews}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Révisions totales
          </p>
        </div>
        
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {successRate}%
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Taux de réussite
          </p>
        </div>
      </div>

      {/* Category Progress */}
      {categoryStats.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-slate-700 dark:text-slate-200">
            Progression par catégorie
          </h3>
          <div className="space-y-2">
            {categoryStats.map((stat) => (
              <div
                key={stat.name}
                className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {stat.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {stat.count} cartes
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${stat.successRate}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-right">
                  {stat.successRate}% de réussite
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Struggling Cards */}
      {strugglingCards.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-slate-700 dark:text-slate-200">
            Cartes à réviser
          </h3>
          <div className="space-y-2">
            {strugglingCards.map((card) => (
              <div
                key={card.id}
                className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {card.question}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {card.answer}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {card.failCount} échecs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalCards === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          Créez des cartes pour voir vos statistiques
        </div>
      )}
    </motion.div>
  )
}