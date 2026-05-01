import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Play, Brain, BookOpen } from 'lucide-react';
import { Language } from '../types';

interface HomeScreenProps {
  onStartTraining: (language: Language) => void;
  wordCount: number;
}

export function HomeScreen({ onStartTraining, wordCount }: HomeScreenProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('english');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="pt-12 pb-8 px-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Brain className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Memow</h1>
        </div>
        <p className="text-center text-slate-500 text-sm">Entraîne ta mémoire, pas juste ta lecture</p>
      </header>

      <main className="flex-1 px-6 flex flex-col justify-center">
        <Card className="bg-white border border-slate-200 shadow-sm mb-6">
          <CardContent className="p-6">
            <p className="text-slate-600 text-sm mb-4 font-medium">Choisis ta langue</p>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedLanguage('english')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedLanguage === 'english'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-2xl mb-1 block">🇬🇧</span>
                <span className={`text-sm font-medium ${
                  selectedLanguage === 'english' ? 'text-emerald-700' : 'text-slate-600'
                }`}>Anglais</span>
              </button>
              
              <button
                onClick={() => setSelectedLanguage('french')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedLanguage === 'french'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-2xl mb-1 block">🇫🇷</span>
                <span className={`text-sm font-medium ${
                  selectedLanguage === 'french' ? 'text-emerald-700' : 'text-slate-600'
                }`}>Français</span>
              </button>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={() => onStartTraining(selectedLanguage)}
          disabled={wordCount === 0}
          className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-lg font-semibold shadow-lg shadow-emerald-200 transition-all duration-200 disabled:opacity-50 disabled:shadow-none"
        >
          <Play className="w-5 h-5 mr-2" />
          Commencer l'entraînement
        </Button>
        
        {wordCount === 0 && (
          <p className="text-center text-slate-400 text-sm mt-4">
            Ajoute des mots pour commencer
          </p>
        )}
      </main>

      <footer className="pb-8 px-6">
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <BookOpen className="w-4 h-4" />
          <span className="text-sm">{wordCount} mots enregistrés</span>
        </div>
      </footer>
    </div>
  );
}