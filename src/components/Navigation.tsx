import { Home, Plus, BookOpen, BarChart3 } from 'lucide-react';

type Screen = 'home' | 'add' | 'list' | 'stats';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home' as Screen, icon: Home, label: 'Accueil' },
    { id: 'add' as Screen, icon: Plus, label: 'Ajouter' },
    { id: 'list' as Screen, icon: BookOpen, label: 'Mots' },
    { id: 'stats' as Screen, icon: BarChart3, label: 'Stats' },
  ];

  return (
    <nav className="bg-white border-t border-slate-200 px-6 py-2">
      <div className="flex items-center justify-around">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
              currentScreen === id
                ? 'text-emerald-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon className={`w-6 h-6 ${currentScreen === id ? 'stroke-[2.5]' : ''}`} />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}