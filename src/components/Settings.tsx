import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../types'

type SettingsProps = {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onImport: (cards: Card[]) => void
  cards: Card[]
}

export function Settings({ theme, onToggleTheme, onImport, cards }: SettingsProps) {
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const dataStr = JSON.stringify(cards, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `memow-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportError(null)
    setImportSuccess(null)

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (!Array.isArray(data)) {
        throw new Error('Le fichier doit contenir un tableau de cartes')
      }

      const validCards = data.map((item: any) => ({
        id: item.id || crypto.randomUUID(),
        question: item.question || '',
        answer: item.answer || '',
        category: item.category,
        createdAt: item.createdAt || Date.now(),
        updatedAt: item.updatedAt || Date.now(),
        successCount: item.successCount || 0,
        failCount: item.failCount || 0,
        lastReviewedAt: item.lastReviewedAt
      })).filter((card: any) => card.question && card.answer)

      onImport(validCards)
      setImportSuccess(validCards.length)
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Erreur lors de l\'import')
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Paramètres
      </h2>

      {/* Theme */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-slate-800 dark:text-slate-100">
              Thème
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {theme === 'light' ? 'Mode clair' : 'Mode sombre'}
            </p>
          </div>
          <button
            onClick={onToggleTheme}
            className="relative w-14 h-8 bg-slate-200 dark:bg-slate-700 rounded-full transition-colors"
          >
            <motion.div
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow"
              animate={{ left: theme === 'light' ? '4px' : '32px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </div>

      {/* Import/Export */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="font-medium text-slate-800 dark:text-slate-100">
          Import / Export
        </h3>
        
        <div className="flex gap-3">
          <button
            onClick={handleImportClick}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Importer
          </button>
          <button
            onClick={handleExport}
            disabled={cards.length === 0}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Exporter
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        {importError && (
          <p className="text-sm text-rose-600 dark:text-rose-400">
            {importError}
          </p>
        )}

        {importSuccess !== null && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            {importSuccess} carte(s) importée(s) avec succès
          </p>
        )}
      </div>

      {/* Data info */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="font-medium text-slate-800 dark:text-slate-100 mb-2">
          Données
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {cards.length} carte(s) enregistrée(s)
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          Les données sont stockées localement dans votre navigateur
        </p>
      </div>
    </motion.div>
  )
}