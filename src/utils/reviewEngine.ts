import { Word } from '../types';

export const calculatePriority = (word: Word): number => {
  const failureRate = (word.failures + 1) / (word.successes + 1);
  
  const daysSinceLastReview = word.lastRevised 
    ? (Date.now() - new Date(word.lastRevised).getTime()) / (1000 * 60 * 60 * 24)
    : 100;
  
  const recencyBonus = Math.min(daysSinceLastReview / 7, 2);
  
  return failureRate * (1 + recencyBonus);
};

export const selectWordsForReview = (
  words: Word[], 
  language: 'english' | 'french',
  count: number = 10
): Word[] => {
  const filtered = words.filter(w => w.language === language);
  
  if (filtered.length <= count) return filtered;
  
  const withPriority = filtered.map(w => ({
    word: w,
    priority: calculatePriority(w)
  }));
  
  withPriority.sort((a, b) => b.priority - a.priority);
  
  const topPriority = withPriority.slice(0, Math.ceil(count * 0.7));
  const remaining = withPriority.slice(Math.ceil(count * 0.7));
  
  const shuffled = remaining.sort(() => Math.random() - 0.5);
  const randomPick = shuffled.slice(0, count - topPriority.length);
  
  const selected = [...topPriority, ...randomPick];
  return selected.sort(() => Math.random() - 0.5).map(s => s.word);
};

export const getSuccessRate = (word: Word): number => {
  if (word.timesSeen === 0) return 0;
  return Math.round((word.successes / word.timesSeen) * 100);
};