import { motion } from 'framer-motion'
import { Category } from '../types'

type CategorySelectorProps = {
  categories: Category[]
  selected: string
  onSelect: (category: string) => void
}

export function CategorySelector({ categories, selected, onSelect }: CategorySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-start">
      <motion.button
        onClick={() => onSelect('Toutes')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          selected === 'Toutes'
            ? 'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-800'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        Toutes
      </motion.button>
      
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          onClick={() => onSelect(cat.name)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            selected === cat.name
              ? 'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-800'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          {cat.name}
        </motion.button>
      ))}
    </div>
  )
}