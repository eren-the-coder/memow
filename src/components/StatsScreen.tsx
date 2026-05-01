import { Card, CardContent } from '../components/ui/card';
import { X, TrendingUp, Brain, Calendar, Award } from 'lucide-react';
import { Word } from '../types';
import { getSuccessRate } from '../utils/reviewEngine';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface StatsScreenProps {
  words: Word[];
  onClose: () => void;
}

export function StatsScreen({ words, onClose }: StatsScreenProps) {
  const totalWords = words.length;
  const totalReviews = words.reduce((sum, w) => sum + w.timesSeen, 0);
  const totalSuccesses = words.reduce((sum, w) => sum + w.successes, 0);
  const overallSuccessRate = totalReviews > 0 
    ? Math.round((totalSuccesses / totalReviews) * 100) 
    : 0;

  const topWords = [...words]
    .filter(w => w.timesSeen > 0)
    .sort((a, b) => getSuccessRate(b) - getSuccessRate(a))
    .slice(0, 5);

  const strugglingWords = [...words]
    .filter(w => w.timesSeen > 0)
    .sort((a, b) => getSuccessRate(a) - getSuccessRate(b))
    .slice(0, 5);

  const recentWords = [...words]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="pt-6 pb-4 px-6 flex items-center justify-between border-b border-slate-200 bg-white">
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <X className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">Statistiques</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white border border-slate-200">
              <CardContent className="p-4 text-center">
                <Brain className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-800">{totalWords}</p>
                <p className="text-xs text-slate-500">Mots</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white border border-slate-200">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-800">{totalReviews}</p>
                <p className="text-xs text-slate-500">Révisions</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white border border-slate-200">
              <CardContent className="p-4 text-center">
                <Award className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-800">{overallSuccessRate}%</p>
                <p className="text-xs text-slate-500">Réussite</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {topWords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <h2 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <span className="text-lg">🔥</span> Mots maîtrisés
            </h2>
            <Card className="bg-white border border-slate-200">
              <CardContent className="p-4 space-y-3">
                {topWords.map(word => (
                  <div key={word.id} className="flex items-center justify-between">
                    <div>
                      <span className="text-xs mr-1">
                        {word.language === 'english' ? '🇬🇧' : '🇫🇷'}
                      </span>
                      <span className="font-medium text-slate-700">{word.term}</span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">
                      {getSuccessRate(word)}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {strugglingWords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <h2 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <span className="text-lg">⚠️</span> À retravailler
            </h2>
            <Card className="bg-white border border-slate-200">
              <CardContent className="p-4 space-y-3">
                {strugglingWords.map(word => (
                  <div key={word.id} className="flex items-center justify-between">
                    <div>
                      <span className="text-xs mr-1">
                        {word.language === 'english' ? '🇬🇧' : '🇫🇷'}
                      </span>
                      <span className="font-medium text-slate-700">{word.term}</span>
                    </div>
                    <span className="text-sm font-semibold text-rose-600">
                      {getSuccessRate(word)}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {recentWords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Ajouts récents
            </h2>
            <Card className="bg-white border border-slate-200">
              <CardContent className="p-4 space-y-3">
                {recentWords.map(word => (
                  <div key={word.id} className="flex items-center justify-between">
                    <div>
                      <span className="text-xs mr-1">
                        {word.language === 'english' ? '🇬🇧' : '🇫🇷'}
                      </span>
                      <span className="font-medium text-slate-700">{word.term}</span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {format(new Date(word.dateAdded), 'd MMM', { locale: fr })}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}