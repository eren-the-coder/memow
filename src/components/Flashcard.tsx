import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../types'

type FlashcardProps = {
  card: Card
  onSuccess: () => void
  onFail: () => void
  onPrevious: () => void
  onNext: () => void
  canGoPrevious: boolean
  canGoNext: boolean
}

export function Flashcard({
  card,
  onSuccess,
  onFail,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleSuccess = () => {
    setIsFlipped(false)
    onSuccess()
  }

  const handleFail = () => {
    setIsFlipped(false)
    onFail()
  }

  const handleNext = () => {
    setIsFlipped(false)
    onNext()
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    onPrevious()
  }

  return (
    <div className="space-y-6">
      {/* Card Container */}
      <motion.div
        key={card.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="perspective-1000"
      >
        {/* Flip Container */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full h-80"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Face - Question */}
          <div
            onClick={handleFlip}
            className="absolute inset-0 cursor-pointer rounded-2xl shadow-lg bg-white dark:bg-slate-800"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)'
            }}
          >
            <div className="h-full flex flex-col items-center justify-center p-8">
              {/* Category badge */}
              {card.category && (
                <div className="absolute top-5 left-5">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {card.category}
                  </span>
                </div>
              )}
              
              <p className="text-center text-xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                {card.question}
              </p>
              
              {/* Stats */}
              <div className="absolute bottom-5 right-5 flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {card.successCount}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {card.failCount}
                </span>
              </div>
              
              {/* Flip hint */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Cliquez pour révéler
                </span>
              </div>
            </div>
          </div>

          {/* Back Face - Answer */}
          <div
            onClick={handleFlip}
            className="absolute inset-0 cursor-pointer rounded-2xl shadow-lg bg-emerald-600"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="h-full flex items-center justify-center p-8">
              <p className="text-center text-xl font-medium text-white leading-relaxed">
                {card.answer}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          className="p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {isFlipped && (
          <>
            <button
              onClick={handleFail}
              className="p-3 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/60 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              onClick={handleSuccess}
              className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </>
        )}

        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className="p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}