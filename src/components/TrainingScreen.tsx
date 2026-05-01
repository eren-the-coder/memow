import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Word } from '../types';
import { storage } from '../utils/storage';
import { Button } from './ui/button';

interface TrainingScreenProps {
  words: Word[];
  onClose: () => void;
  onComplete: () => void;
}

export function TrainingScreen({ words, onClose, onComplete }: TrainingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewWords, setReviewWords] = useState(words);

  const currentWord = reviewWords[currentIndex];
  const isComplete = currentIndex >= reviewWords.length;

  const handleAnswer = (knew: boolean) => {
    if (currentWord) {
      const updated = storage.recordAnswer(currentWord.id, knew);
      const newWords = [...reviewWords];
      newWords[currentIndex] = updated;
      setReviewWords(newWords);
    }

    setShowAnswer(false);
    if (currentIndex + 1 >= reviewWords.length) {
      onComplete();
    } else {
      setCurrentIndex((prev: number) => prev + 1);
    }
  };

  if (!currentWord || isComplete) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-slate-50 flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <span className="text-sm text-slate-500">
          {currentIndex + 1} / {reviewWords.length}
        </span>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm"
          >
            <div className="card-base p-8 text-center">
              <motion.div
                initial={false}
                animate={{ rotateY: showAnswer ? 180 : 0 }}
                transition={{ duration: 0.4 }}
                className="perspective-1000"
              >
                <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">
                  {currentWord.language === 'english' ? '🇬🇧 Anglais' : '🇫🇷 Français'}
                </p>

                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  {currentWord.term}
                </h2>

                <AnimatePresence>
                  {showAnswer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-slate-200 pt-4 mt-4"
                    >
                      <p className="text-lg text-slate-600">
                        {currentWord.meaning}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="mt-8 space-y-4 w-full max-w-sm">
              {!showAnswer ? (
                <Button
                  onClick={() => setShowAnswer(true)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 text-lg"
                >
                  Voir la réponse
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <Button
                    onClick={() => handleAnswer(false)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4"
                  >
                    <ThumbsDown className="w-5 h-5 mr-2" />
                    Je ne connaissais pas
                  </Button>
                  <Button
                    onClick={() => handleAnswer(true)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-4"
                  >
                    <ThumbsUp className="w-5 h-5 mr-2" />
                    Je connaissais
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-4">
        <div className="flex gap-1">
          {reviewWords.map((_: Word, idx: number) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-colors ${idx < currentIndex
                ? 'bg-emerald-500'
                : idx === currentIndex
                  ? 'bg-emerald-300'
                  : 'bg-slate-200'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
