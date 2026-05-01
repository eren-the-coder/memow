import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ThumbsUp, ThumbsDown, X, Shuffle } from 'lucide-react';
import { Word } from '../types';
import { storage } from '../utils/storage';
import { motion, AnimatePresence } from 'framer-motion';

interface TrainingScreenProps {
  words: Word[];
  onClose: () => void;
  onComplete: () => void;
}

export function TrainingScreen({ words, onClose, onComplete }: TrainingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isShuffling, setIsShuffling] = useState(true);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });

  const currentWord = words[currentIndex];
  const isLastWord = currentIndex === words.length - 1;

  useEffect(() => {
    const timer = setTimeout(() => setIsShuffling(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleAnswer = (success: boolean) => {
    if (!currentWord) return;

    storage.updateWord(currentWord.id, {
      timesSeen: currentWord.timesSeen + 1,
      successes: success ? currentWord.successes + 1 : currentWord.successes,
      failures: success ? currentWord.failures : currentWord.failures + 1,
      lastRevised: new Date()
    });

    setSessionStats(prev => ({
      correct: success ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));

    if (isLastWord) {
      onComplete();
    } else {
      setIsRevealed(false);
      setCurrentIndex(prev => prev + 1);
      setIsShuffling(true);
      setTimeout(() => setIsShuffling(false), 600);
    }
  };

  if (!currentWord) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Aucun mot disponible</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="pt-6 pb-4 px-6 flex items-center justify-between">
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <X className="w-6 h-6 text-slate-600" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">
            {currentIndex + 1} / {words.length}
          </span>
        </div>
        <div className="w-10" />
      </header>

      <div className="flex-1 px-6 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {isShuffling ? (
            <motion.div
              key="shuffle"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-3"
            >
              <Shuffle className="w-8 h-8 text-emerald-500 animate-pulse" />
              <span className="text-slate-500 font-medium">Mélange...</span>
            </motion.div>
          ) : (
            <motion.div
              key={currentWord.id}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <Card className="bg-white border border-slate-200 shadow-lg">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {currentWord.language === 'english' ? '🇬🇧 Anglais' : '🇫🇷 Français'}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">
                    {currentWord.term}
                  </h2>

                  {!isRevealed ? (
                    <button
                      onClick={handleReveal}
                      className="w-full py-4 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 font-medium transition-all duration-200"
                    >
                      Tap pour révéler →
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <p className="text-emerald-800 text-center font-medium">
                          {currentWord.meaning}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={() => handleAnswer(false)}
                          className="py-4 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl font-medium transition-all"
                        >
                          <ThumbsDown className="w-5 h-5 mr-2" />
                          Pas connu
                        </Button>
                        <Button
                          onClick={() => handleAnswer(true)}
                          className="py-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-xl font-medium transition-all"
                        >
                          <ThumbsUp className="w-5 h-5 mr-2" />
                          Connu
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pb-6 px-6">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}