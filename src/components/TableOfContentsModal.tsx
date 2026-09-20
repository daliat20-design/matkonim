import React, { useState } from 'react';
import { Recipe } from '../types';
import { CATEGORIES_CONFIG } from '../data/recipes';
import { X, Search, BookOpen, Clock, Users, Heart } from 'lucide-react';
import { LaurelBranch } from './DecorativeIcons';

interface TableOfContentsModalProps {
  recipes: Recipe[];
  currentIndex: number;
  onSelectRecipe: (index: number) => void;
  onClose: () => void;
  onOpenBookIntro?: () => void;
}

export const TableOfContentsModal: React.FC<TableOfContentsModalProps> = ({
  recipes,
  currentIndex,
  onSelectRecipe,
  onClose,
  onOpenBookIntro
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const availableCategories = CATEGORIES_CONFIG.filter(cat => 
    cat.id === 'all' || recipes.some(r => r.category === cat.id)
  );

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCat = selectedCategory === 'all' || recipe.category === selectedCategory;
    const matchesQuery = 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.contributor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some(i => i.item.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-[#faf6ec] text-[#2c2218] rounded-2xl shadow-2xl border-4 border-[#d4c5a9] p-5 sm:p-7 flex flex-col"
        dir="rtl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-[#ebdcc0] text-[#5a4332] transition-colors"
          title="סגירה"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with decorative branch */}
        <div className="text-center mb-4">
          <div className="flex justify-center mb-1">
            <LaurelBranch className="w-20 h-5 text-[#8a4b2a]/50" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Frank_Ruhl_Libre'] text-[#3b2416]">
            תוכן העניינים של הספר
          </h2>
          <p className="text-xs sm:text-sm text-[#735946] mt-1">
            דפדוף מהיר בין כל המתכונים והטעמים של המשפחה
          </p>
        </div>

        {/* Family Prologue Banner */}
        {onOpenBookIntro && (
          <button
            onClick={() => {
              onClose();
              onOpenBookIntro();
            }}
            className="mb-3.5 p-3 rounded-xl bg-gradient-to-r from-[#ebd8ba] via-[#f5e9d3] to-[#ebd8ba] border-2 border-[#d3be9e] text-right flex items-center justify-between hover:border-[#8a4b2a] transition-all shadow-xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#8a4b2a] text-amber-100 flex items-center justify-center shrink-0 shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold font-['Frank_Ruhl_Libre'] text-sm text-[#3b2416] group-hover:text-[#8a4b2a] transition-colors flex items-center gap-1.5">
                  <span>📜 פתיח הספר: סיפור המשפחה והמטבח שלנו</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8a4b2a]/15 text-[#733f23] font-sans font-semibold">הקדמה</span>
                </div>
                <div className="text-[11px] text-[#694e3b]">
                  על מרוקו, פולין, ונצואלה ואורוגוואי והזיכרונות שנאספו למטבח אחד
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-[#8a4b2a] font-serif pr-2 group-hover:translate-x-[-2px] transition-transform">
              קרא ◄
            </span>
          </button>
        )}

        {/* Search bar */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="חיפוש מתכון, מצרך או שם של בן משפחה..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 px-4 pr-10 rounded-xl bg-white/70 border border-[#d8c5a8] text-sm focus:outline-none focus:ring-2 focus:ring-[#8a4b2a] text-[#2c2218] placeholder-[#947863]"
          />
          <Search className="w-4 h-4 text-[#8a4b2a] absolute right-3.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-800"
            >
              נקה
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
          {availableCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#8a4b2a] text-amber-50 shadow-xs'
                  : 'bg-[#ede0c7] text-[#553b27] hover:bg-[#e2ceb0]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Recipe list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-[#ebdcc0]">
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-10 text-[#826a57] text-sm">
              לא נמצאו מתכונים שתואמים לחיפוש שלך
            </div>
          ) : (
            filteredRecipes.map((r) => {
              const realIndex = recipes.findIndex(rec => rec.id === r.id);
              const isCurrent = realIndex === currentIndex;
              return (
                <div
                  key={r.id}
                  onClick={() => {
                    onSelectRecipe(realIndex);
                    onClose();
                  }}
                  className={`pt-2.5 pb-2.5 px-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    isCurrent 
                      ? 'bg-[#edd8be] font-bold text-[#351c0e] shadow-xs' 
                      : 'hover:bg-[#f3e6d2] text-[#412c1d]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#cfba9e] shrink-0 shadow-2xs">
                      <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold flex items-center gap-2">
                        <span>{r.title}</span>
                        {r.isFavorite && <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 shrink-0" />}
                      </div>
                      <div className="text-xs text-[#735946] flex items-center gap-2 mt-0.5">
                        <span className="font-medium text-[#8a4b2a]">{r.contributor}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {r.cookTime}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {r.servings}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-[#ebdcc0] text-[#6d4329]">
                      עמוד {realIndex + 1}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#dfd0b7] flex items-center justify-between text-xs text-[#735946]">
          <span>סך הכל {recipes.length} מתכונים בספר</span>
          <span className="text-[#8a4b2a] font-medium">לחצו על מתכון כדי לקפוץ אליו</span>
        </div>
      </div>
    </div>
  );
};
