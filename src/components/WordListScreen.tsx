import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { X, Edit2, Trash2, Search } from 'lucide-react';
import { Word } from '../types';
import { storage } from '../utils/storage';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

interface WordListScreenProps {
  words: Word[];
  onClose: () => void;
  onUpdate: () => void;
}

export function WordListScreen({ words, onClose, onUpdate }: WordListScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredWords = words.filter(w =>
    w.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    storage.deleteWord(id);
    setDeleteConfirm(null);
    onUpdate();
  };

  const handleUpdate = (word: Word, updates: Partial<Word>) => {
    storage.updateWord(word.id, updates);
    setEditingWord(null);
    onUpdate();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="pt-6 pb-4 px-6 flex items-center justify-between border-b border-slate-200 bg-white">
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <X className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">Mes mots</h1>
        <div className="w-10" />
      </header>

      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-3 bg-slate-100 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <main className="flex-1 px-6 py-4 overflow-y-auto">
        <AnimatePresence>
          {filteredWords.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-slate-400">
                {searchQuery ? 'Aucun résultat' : 'Aucun mot enregistré'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredWords.map((word, index) => (
                <motion.div
                  key={word.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-white border border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      {editingWord?.id === word.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            defaultValue={word.term}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            id={`edit-term-${word.id}`}
                          />
                          <input
                            type="text"
                            defaultValue={word.meaning}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            id={`edit-meaning-${word.id}`}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => setEditingWord(null)}
                              className="flex-1 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200"
                            >
                              Annuler
                            </Button>
                            <Button
                              onClick={() => {
                                const termInput = document.getElementById(`edit-term-${word.id}`) as HTMLInputElement;
                                const meaningInput = document.getElementById(`edit-meaning-${word.id}`) as HTMLInputElement;
                                handleUpdate(word, {
                                  term: termInput.value,
                                  meaning: meaningInput.value
                                });
                              }}
                              className="flex-1 py-2 bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                              Sauver
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs">
                                  {word.language === 'english' ? '🇬🇧' : '🇫🇷'}
                                </span>
                                <h3 className="font-semibold text-slate-800">{word.term}</h3>
                              </div>
                              <p className="text-slate-600 text-sm mb-2">{word.meaning}</p>
                              <p className="text-slate-400 text-xs">
                                Ajouté le {format(new Date(word.dateAdded), 'd MMMM yyyy', { locale: fr })}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => setEditingWord(word)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4 text-slate-400" />
                              </button>
                              {deleteConfirm === word.id ? (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleDelete(word.id)}
                                    className="p-2 bg-rose-100 rounded-lg"
                                  >
                                    <Trash2 className="w-4 h-4 text-rose-600" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="p-2 bg-slate-100 rounded-lg text-xs text-slate-600"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirm(word.id)}
                                  className="p-2 hover:bg-rose-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 text-slate-400" />
                                </button>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}