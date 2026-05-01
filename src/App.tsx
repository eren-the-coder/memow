import { useState, useEffect } from 'react';
import { Word, Language } from './types';
import { storage } from './utils/storage';
import { selectWordsForReview } from './utils/reviewEngine';
import { HomeScreen } from './components/HomeScreen';
import { TrainingScreen } from './components/TrainingScreen';
import { AddWordScreen } from './components/AddWordScreen';
import { WordListScreen } from './components/WordListScreen';
import { StatsScreen } from './components/StatsScreen';
import { Navigation } from './components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';

type Screen = 'home' | 'training' | 'add' | 'list' | 'stats';

export default function App() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [trainingWords, setTrainingWords] = useState<Word[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('english');

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = () => {
    const stored = storage.getWords();
    setWords(stored);
  };

  const handleStartTraining = (language: Language) => {
    setSelectedLanguage(language);
    const toReview = selectWordsForReview(words, language, 10);
    if (toReview.length > 0) {
      setTrainingWords(toReview);
      setCurrentScreen('training');
    }
  };

  const handleTrainingComplete = () => {
    loadWords();
    setCurrentScreen('home');
  };

  const handleAddWord = () => {
    loadWords();
    setCurrentScreen('home');
  };

  const showNav = currentScreen !== 'training';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex-1">
              <HomeScreen 
                onStartTraining={handleStartTraining}
                wordCount={words.length}
              />
            </div>
          </motion.div>
        )}

        {currentScreen === 'training' && (
          <motion.div
            key="training"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <TrainingScreen
              words={trainingWords}
              onClose={() => setCurrentScreen('home')}
              onComplete={handleTrainingComplete}
            />
          </motion.div>
        )}

        {currentScreen === 'add' && (
          <motion.div
            key="add"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1"
          >
            <AddWordScreen
              onClose={() => setCurrentScreen('home')}
              onAdd={handleAddWord}
            />
          </motion.div>
        )}

        {currentScreen === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1"
          >
            <WordListScreen
              words={words}
              onClose={() => setCurrentScreen('home')}
              onUpdate={loadWords}
            />
          </motion.div>
        )}

        {currentScreen === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1"
          >
            <StatsScreen
              words={words}
              onClose={() => setCurrentScreen('home')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showNav && (
        <Navigation
          currentScreen={currentScreen as 'home' | 'add' | 'list' | 'stats'}
          onNavigate={(screen) => setCurrentScreen(screen as Screen)}
        />
      )}
    </div>
  );
}