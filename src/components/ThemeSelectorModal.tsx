import React, { useState } from 'react';
import { BookTheme, BookThemeId } from '../types';
import { BOOK_THEMES } from '../data/recipes';
import { Check, Sparkles, X, Eye, BookOpen, Layers } from 'lucide-react';

interface ThemeSelectorModalProps {
  currentThemeId: BookThemeId;
  onSelectTheme: (id: BookThemeId) => void;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  currentThemeId,
  onSelectTheme,
  onClose
}) => {
  const [showReferenceComparison, setShowReferenceComparison] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#faf6ec] text-[#2c2218] rounded-2xl shadow-2xl border-4 border-[#d4c5a9] p-6 sm:p-8"
        dir="rtl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full hover:bg-[#ebdcc0] text-[#5a4332] transition-colors"
          title="סגירה"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebdcc0]/70 text-[#734327] text-sm font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>סגנונות עיצוב לבחירה</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Frank_Ruhl_Libre'] text-[#3b2416]">
            בחרו את מראה ספר המתכונים המשפחתי
          </h2>
          <p className="text-[#6d5543] text-sm sm:text-base mt-1 max-w-xl mx-auto">
            כל עיצוב מעניק חוויה ייחודית – מעוצב עם טקסטורות נייר אמיתיות, כריכות רטרו ודפדוף אותנטי שאינו נראה כמו סתם דף אינטרנט.
          </p>
        </div>

        {/* Reference Image Comparison Toggle */}
        <div className="mb-6 p-3 sm:p-4 rounded-xl bg-[#f2e7d3] border border-[#d8c3a5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#e2cfb0] flex items-center justify-center text-[#683f25] shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#422919]">השוואה לרפרנס הספר המודפס שהעליתם</h4>
              <p className="text-xs text-[#785b46]">
                צפו בתמונת הספר המקורי (פקיילה / בשר ביין) מול העיצובים שבנינו
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowReferenceComparison(!showReferenceComparison)}
            className="px-4 py-2 rounded-lg bg-[#8a4b2a] text-amber-50 hover:bg-[#723b1f] text-xs sm:text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
          >
            {showReferenceComparison ? 'הסתר רפרנס מקורי' : 'הצג את הרפרנס המקורי'}
          </button>
        </div>

        {/* Reference comparison panel */}
        {showReferenceComparison && (
          <div className="mb-6 p-4 rounded-xl bg-white/80 border-2 border-dashed border-[#bfa886] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8a4b2a]">
                התמונה שהעליתם כדוגמה:
              </span>
              <span className="text-xs text-[#7d6756]">ספר מתכונים מאויר, כריכה פתוחה, פתקיות וואשי טייפ ועיטורי עשבים</span>
            </div>
            <div className="flex justify-center bg-[#29221d] p-3 rounded-lg">
              <img 
                src="/image.png" 
                alt="רפרנס ספר מתכונים מקורי" 
                className="max-h-72 rounded shadow-md object-contain border border-amber-900/30"
                onError={(e) => {
                  // Fallback in case path resolution differs
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <p className="text-xs text-center text-[#735845] mt-2">
              שימו לב כיצד עיצוב <strong>"ספר מאויר בצבעי מים"</strong> משחזר במדויק את מראה הקדירה עם האדים, הפתקיות המודבקות וחלוקת הדפים!
            </p>
          </div>
        )}

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {BOOK_THEMES.map((theme: BookTheme) => {
            const isSelected = currentThemeId === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => {
                  onSelectTheme(theme.id);
                }}
                className={`group relative cursor-pointer rounded-xl p-5 border-2 transition-all duration-200 ${
                  isSelected 
                    ? 'border-[#8a4b2a] ring-2 ring-[#8a4b2a]/30 shadow-lg scale-[1.01]' 
                    : 'border-[#dfd0b7] hover:border-[#b89b7b] hover:shadow-md'
                }`}
                style={{ backgroundColor: theme.previewColor }}
              >
                {/* Selected check badge */}
                {isSelected && (
                  <div className="absolute top-4 left-4 bg-[#8a4b2a] text-white p-1 rounded-full shadow">
                    <Check className="w-4 h-4" />
                  </div>
                )}

                {/* Theme Title */}
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-[#8a4b2a]" />
                  <h3 className="font-bold text-lg text-[#3b2416] font-['Frank_Ruhl_Libre']">
                    {theme.name}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#5d4635] leading-relaxed mb-4">
                  {theme.description}
                </p>

                {/* Visual miniature mockup */}
                <div className="h-20 w-full rounded-lg bg-[#faf6ec] border border-[#d3c2a3] p-2 shadow-inner flex items-center justify-between overflow-hidden relative">
                  {theme.ringBinder && (
                    <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-around py-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-2.5 h-1.5 rounded-full bg-zinc-700/60 shadow-sm" />
                      ))}
                    </div>
                  )}

                  <div className="flex-1 px-2">
                    <div className="w-2/3 h-3 rounded bg-[#8a4b2a]/20 mb-1.5" />
                    <div className="w-5/6 h-2 rounded bg-zinc-400/20 mb-1" />
                    <div className="w-1/2 h-2 rounded bg-zinc-400/20" />
                  </div>

                  {/* Tape or stamp element */}
                  <div 
                    className="w-10 h-8 rounded text-[9px] flex items-center justify-center font-bold shadow-xs rotate-6"
                    style={{ backgroundColor: theme.washiTapeColor, color: '#332211' }}
                  >
                    טיפ!
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  type="button"
                  className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isSelected
                      ? 'bg-[#8a4b2a] text-white'
                      : 'bg-[#ebd9bd] text-[#553b27] group-hover:bg-[#dfc8a5]'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      הסגנון הפעיל כעת
                    </>
                  ) : (
                    'בחר סגנון זה'
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="mt-8 pt-4 border-t border-[#dfd0b7] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#8a4b2a] hover:bg-[#703b20] text-amber-50 font-medium text-sm shadow transition-colors"
          >
            חזרה לספר המתכונים
          </button>
        </div>
      </div>
    </div>
  );
};
