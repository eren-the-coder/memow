import { Word } from '../types';

const STORAGE_KEY = 'memow_words';

export const storage = {
  getWords: (): Word[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const words = JSON.parse(data);
      return words.map((w: Word) => ({
        ...w,
        dateAdded: new Date(w.dateAdded),
        lastRevised: w.lastRevised ? new Date(w.lastRevised) : undefined
      }));
    } catch {
      return [];
    }
  },

  saveWords: (words: Word[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  },

  addWord: (word: Omit<Word, 'id' | 'dateAdded' | 'timesSeen' | 'successes' | 'failures'>): Word => {
    const words = storage.getWords();
    const newWord: Word = {
      ...word,
      id: crypto.randomUUID(),
      dateAdded: new Date(),
      timesSeen: 0,
      successes: 0,
      failures: 0
    };
    storage.saveWords([...words, newWord]);
    return newWord;
  },

  updateWord: (id: string, updates: Partial<Word>): void => {
    const words = storage.getWords();
    const updated = words.map(w =>
      w.id === id ? { ...w, ...updates } : w
    );
    storage.saveWords(updated);
  },

  deleteWord: (id: string): void => {
    const words = storage.getWords();
    storage.saveWords(words.filter(w => w.id !== id));
  },

  recordAnswer: (id: string, knew: boolean): Word => {
    const words = storage.getWords();
    const wordIndex = words.findIndex(w => w.id === id);
    if (wordIndex === -1) throw new Error('Word not found');
    const word = words[wordIndex];
    const updated: Word = {
      ...word,
      timesSeen: word.timesSeen + 1,
      successes: knew ? word.successes + 1 : word.successes,
      failures: knew ? word.failures : word.failures + 1,
      lastRevised: new Date()
    };
    words[wordIndex] = updated;
    storage.saveWords(words);
    return updated;
  }
};