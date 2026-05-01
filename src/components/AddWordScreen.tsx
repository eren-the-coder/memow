import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { X, Check } from 'lucide-react';
import { Language } from '../types';
import { storage } from '../utils/storage';
import { motion } from 'framer-motion';

interface AddWordScreenProps {
  onClose: () => void;
  onAdd: () => void;
}

export function AddWordScreen({ onClose, onAdd }: AddWordScreenProps) {
  const [term, setTerm] = useState('');
  const [meaning, setMeaning] = useState('');
  const [language, setLanguage] = useState<Language>('english');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (!term.trim() || !meaning.trim()) return;

    storage.addWord({
      term: term.trim(),
      meaning: meaning.trim(),
      language
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onAdd();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="pt-6 pb-4 px-6 flex items-center justify-between border-b border-slate-200 bg-white">
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <X className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">Ajouter un mot</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-6 py-8">
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div>
              <Label className="text-sm font-medium text-slate-600 mb-2 block">Langue</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setLanguage('english')}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    language === 'english'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xl">🇬🇧</span>
                  <span className={`ml-2 text-sm font-medium ${
                    language === 'english' ? 'text-emerald-700' : 'text-slate-600'
                  }`}>Anglais</span>
                </button>
                <button
                  onClick={() => setLanguage('french')}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    language === 'french'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xl">🇫🇷</span>
                  <span className={`ml-2 text-sm font-medium ${
                    language === 'french' ? 'text-emerald-700' : 'text-slate-600'
                  }`}>Français</span>
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="term" className="text-sm font-medium text-slate-600 mb-2 block">
                Mot
              </Label>
              <Input
                id="term"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="ephemeral"
                className="w-full px-4 py-3 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div>
              <Label htmlFor="meaning" className="text-sm font-medium text-slate-600 mb-2 block">
                Signification
              </Label>
              <Input
                id="meaning"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                placeholder="qui dure très peu de temps"
                className="w-full px-4 py-3 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSubmit}
          disabled={!term.trim() || !meaning.trim()}
          className="w-full mt-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 transition-all disabled:opacity-50"
        >
          Enregistrer
        </Button>
      </main>

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-8 shadow-2xl"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-slate-800 font-semibold text-lg">Mot ajouté !</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}