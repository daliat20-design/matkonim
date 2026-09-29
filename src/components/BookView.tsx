import React, { useState, useEffect } from 'react';
import { Recipe, BookTheme } from '../types';
import { 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Users, 
  Heart, 
  Bookmark, 
  Share2, 
  Sparkles, 
  ChefHat, 
  Check, 
  RotateCw, 
  BookOpen, 
  Edit3, 
  Camera,
  ArrowRight,
  Video,
  ExternalLink 
} from 'lucide-react';
import { SteamDoodle, LaurelBranch, HeartDoodle, OliveSprig, PaperClip } from './DecorativeIcons';
import { compressImageFile } from '../utils/imageCompressor';
import { CANONICAL_RECIPE_IMAGES } from '../data/recipes';

interface BookViewProps {
  recipe: Recipe;
  oppositeRecipe?: Recipe; // For 2-page open book spread
  currentPageIndex: number;
  totalPages: number;
  theme: BookTheme;
  onNextPage: () => void;
  onPrevPage: () => void;
  onGoToCover?: () => void;
  onToggleFavorite: (id: string) => void;
  onOpenShare: (recipe: Recipe) => void;
  onOpenCookingMode: (recipe: Recipe) => void;
  onOpenTableOfContents: () => void;
  onEditRecipe?: (recipe: Recipe) => void;
  onUpdateRecipeImage?: (recipeId: string, newImageUrl: string) => void;
}

export const BookView: React.FC<BookViewProps> = ({
  recipe,
  oppositeRecipe,
  currentPageIndex,
  totalPages,
  theme,
  onNextPage,
  onPrevPage,
  onGoToCover,
  onToggleFavorite,
  onOpenShare,
  onOpenCookingMode,
  onOpenTableOfContents,
  onEditRecipe,
  onUpdateRecipeImage
}) => {
  // Mobile tab state: 'ingredients' or 'instructions'
  const [mobileTab, setMobileTab] = useState<'ingredients' | 'instructions'>('ingredients');

  const handleQuickImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUpdateRecipeImage) {
      try {
        const compressed = await compressImageFile(e.target.files[0]);
        onUpdateRecipeImage(recipe.id, compressed);
      } catch (err) {
        console.error('Error compressing image', err);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        onNextPage(); // In RTL, left arrow moves forward to next page
      } else if (e.key === 'ArrowRight') {
        onPrevPage(); // In RTL, right arrow moves back
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNextPage, onPrevPage]);

  // When recipe changes, reset mobile tab to ingredients
  useEffect(() => {
    setMobileTab('ingredients');
  }, [recipe.id]);

  // Fallback to canonical imported image if local url is invalid, broken, or vite-dev-only
  const canonicalImg = CANONICAL_RECIPE_IMAGES[recipe.id];
  const effectiveImageUrl = (recipe.imageUrl && (recipe.imageUrl.startsWith('data:') || recipe.imageUrl.startsWith('blob:') || recipe.imageUrl.startsWith('http') || recipe.imageUrl.startsWith('/assets/')))
    ? recipe.imageUrl
    : (canonicalImg || recipe.imageUrl);

  return (
    <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center overflow-x-hidden">
      {/* Top Bar Navigation: Clear Return to All Recipes */}
      <div className="w-full flex items-center justify-between mb-3 px-1 sm:px-3">
        <button
          onClick={onGoToCover || onOpenTableOfContents}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5c2a18] hover:bg-[#78361e] text-amber-50 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 border border-[#8a4b2a]/60"
        >
          <ArrowRight className="w-4 h-4 text-amber-300" />
          <span>חזרה לכלל המתכונים</span>
        </button>

        <button
          onClick={onOpenTableOfContents}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#3f271c] hover:bg-[#4f3224] text-amber-200 text-xs font-semibold border border-amber-900/50 shadow-xs transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-300" />
          <span>תוכן עניינים מהיר</span>
        </button>
      </div>

      {/* Decorative Hanging Bookmark Ribbon */}
      <div 
        onClick={onGoToCover || onOpenTableOfContents}
        className="absolute top-10 sm:top-8 left-6 sm:left-24 z-30 cursor-pointer group transition-transform hover:translate-y-1 select-none"
        title="חזרה לשער הספר ולתוכן העניינים"
      >
        <div className="relative w-7 sm:w-10 h-14 sm:h-20 bg-[#9e2a2b] shadow-md rounded-t-sm flex flex-col items-center justify-between pb-2 border-x border-[#7a1f20]">
          <div className="w-full h-1 bg-amber-300/40 mt-1" />
          <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200 fill-amber-200/80 mb-1" />
          <div className="absolute -bottom-3 left-0 right-0 border-l-[14px] sm:border-l-[20px] border-l-[#9e2a2b] border-r-[14px] sm:border-r-[20px] border-r-[#9e2a2b] border-b-[10px] sm:border-b-[12px] border-b-transparent border-t-0" />
        </div>
      </div>

      {/* Main Physical Book Container */}
      <div className="relative w-full rounded-2xl sm:rounded-3xl p-1.5 sm:p-5 lg:p-7 bg-[#2d1c14] border-2 sm:border-8 border-[#3f271c] shadow-2xl book-edge-stack overflow-hidden">
        
        {/* Book Spine Texture Top Decor */}
        <div className="hidden lg:flex justify-between items-center px-4 py-1 mb-2 text-[#96735e] text-xs font-serif tracking-widest border-b border-[#442c20]">
          <span>ספר המתכונים המשפחתי • מהדורה דיגיטלית חיה</span>
          <span className="flex items-center gap-2">
            <span>דפדוף במקשי החצים ◄ ►</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600/70" />
            <span>סגנון: {theme.name}</span>
          </span>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP 2-PAGE SPREAD (lg & xl screens)                      */}
        {/* Exact homage to the uploaded cookbook reference spread!       */}
        {/* ============================================================ */}
        <div className="hidden lg:grid grid-cols-2 min-h-[720px] rounded-xl overflow-hidden shadow-inner relative border border-[#c5b597]">
          
          {/* CENTER BOOK SPINE CREASE & SHADOW (Simulates middle fold of open printed book) */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 pointer-events-none z-20 flex justify-center">
            <div className="w-full h-full bg-gradient-to-r from-black/25 via-black/40 to-black/25" />
            <div className="absolute top-0 bottom-0 w-[1px] bg-amber-950/40" />
          </div>

          {/* ---------------- RIGHT PAGE: Main dish, Watercolor pot, Ingredients ---------------- */}
          <div className={`relative p-8 xl:p-10 flex flex-col justify-between ${theme.paperClass} text-[${theme.textColor}] book-spine-shadow-right border-l border-[#d3c4a6]`}>
            {/* Ring binder spiral simulation if notebook theme */}
            {theme.ringBinder && (
              <div className="absolute -left-3 top-0 bottom-0 flex flex-col justify-around py-4 z-30">
                {[...Array(14)].map((_, i) => (
                  <div key={i} className="w-6 h-3 rounded-full bg-gradient-to-r from-zinc-500 via-zinc-300 to-zinc-600 shadow-sm border border-zinc-700" />
                ))}
              </div>
            )}

            <div>
              {/* Desktop Quick Navigation Back Button */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#dfd0b7]">
                <button
                  onClick={onGoToCover || onOpenTableOfContents}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#efe4d2] hover:bg-[#e4d4bd] text-[#5a3a25] text-xs font-bold border border-[#ceb99c] transition-colors shadow-2xs"
                  title="חזרה לכלל המתכונים"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#8a4b2a]" />
                  <span>חזרה לכלל המתכונים</span>
                </button>
                <span className="text-[11px] font-mono text-[#8a4b2a]/80">מתכון {currentPageIndex + 1} מתוך {totalPages}</span>
              </div>

              {/* Top Page Header & Contributor */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-[#8a4b2a] mb-1">
                    <div className="flex items-center gap-1.5">
                      <ChefHat className="w-3.5 h-3.5 text-[#8a4b2a]" />
                      <span>{recipe.contributor}</span>
                    </div>
                    {recipe.credit && (
                      <span className="text-[11px] text-[#785942] font-normal normal-case">
                        • מקור: {recipe.credit}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl xl:text-4xl font-black font-['Frank_Ruhl_Libre'] text-[#3b2416] tracking-tight leading-tight flex items-center gap-2">
                    <span>{recipe.title}</span>
                    <HeartDoodle className="w-5 h-5 text-rose-600/70 shrink-0 inline-block" />
                  </h1>
                  {recipe.subtitle && (
                    <p className="text-sm xl:text-base text-[#684e3b] font-['Assistant'] mt-1 italic">
                      "{recipe.subtitle}"
                    </p>
                  )}
                  {recipe.videoUrl && (
                    <div className="mt-2.5">
                      <a
                        href={recipe.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5c2a18]/10 hover:bg-[#5c2a18]/20 text-[#5c2a18] text-xs font-bold border border-[#5c2a18]/30 transition-all shadow-2xs group"
                        title="פתיחת סרטון ההכנה בטאב חדש"
                      >
                        <Video className="w-3.5 h-3.5 text-[#8a4b2a]" />
                        <span>{recipe.videoTitle || 'צפייה בסרטון ההכנה ↗'}</span>
                        <ExternalLink className="w-3 h-3 text-[#8a4b2a]/70 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Favorite & Quick Share & Edit buttons */}
                <div className="flex items-center gap-1.5 shrink-0 bg-white/50 p-1 rounded-xl border border-[#d6c4a8] shadow-2xs">
                  {onEditRecipe && (
                    <button
                      onClick={() => onEditRecipe(recipe)}
                      className="p-1.5 rounded-lg hover:bg-white text-[#73513b] transition-colors"
                      title="עריכת מתכון / תמונה"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onToggleFavorite(recipe.id)}
                    className="p-1.5 rounded-lg hover:bg-white text-rose-600 transition-colors"
                    title="סמן כאהוב"
                  >
                    <Heart className={`w-4 h-4 ${recipe.isFavorite ? 'fill-rose-600' : ''}`} />
                  </button>
                  <button
                    onClick={() => onOpenShare(recipe)}
                    className="p-1.5 rounded-lg hover:bg-white text-[#5c3e29] transition-colors"
                    title="שיתוף מתכון"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onOpenCookingMode(recipe)}
                    className="p-1.5 rounded-lg hover:bg-white text-[#8a4b2a] transition-colors"
                    title="מצב בישול במטבח"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Recipe Meta Badges (Time, Servings, Difficulty) */}
              <div className="flex items-center gap-3 py-2 border-y border-[#dfd0b7] mb-6 text-xs text-[#5f4634]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#8a4b2a]" />
                  <span>הכנה: <strong>{recipe.prepTime}</strong></span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#8a4b2a]" />
                  <span>בישול: <strong>{recipe.cookTime}</strong></span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#8a4b2a]" />
                  <span><strong>{recipe.servings}</strong></span>
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-full bg-[#ebdcc0] text-[#704226] font-semibold text-[11px]">
                  דרגה: {recipe.difficulty}
                </span>
              </div>

              {/* Illustrated Pot with Rising Animated Steam */}
              <div className="relative mb-6 flex justify-center">
                <div className="relative w-64 h-52 xl:w-72 xl:h-56 group">
                  {/* Steam Wafer animation directly above the pot */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                    <SteamDoodle className="w-20 h-14 text-amber-900/60" />
                  </div>

                  {/* The watercolor artwork */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden p-2 bg-white/70 shadow-md border-2 border-[#dfd0b7] rotate-[-1deg] group-hover:rotate-0 transition-transform duration-300">
                    <img 
                      src={effectiveImageUrl} 
                      alt={recipe.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain drop-shadow-md"
                      onError={(e) => {
                        const fallback = CANONICAL_RECIPE_IMAGES[recipe.id];
                        if (fallback && e.currentTarget.src !== fallback) {
                          e.currentTarget.src = fallback;
                        }
                      }}
                    />

                    {/* Quick photo update button */}
                    {onUpdateRecipeImage && (
                      <label 
                        className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-black/65 hover:bg-black/85 text-white cursor-pointer shadow-md transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-[11px] font-sans" 
                        title="החלפת תמונה למתכון (מצלמה / קובץ)"
                      >
                        <Camera className="w-3.5 h-3.5 text-amber-300" />
                        <span>שנה תמונה</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleQuickImageUpload} 
                          className="hidden" 
                        />
                      </label>
                    )}
                  </div>

                  {/* Little botanical sprig at bottom corner */}
                  <div className="absolute -bottom-2 -right-3 pointer-events-none">
                    <OliveSprig className="w-12 h-12 text-[#516444]/60" />
                  </div>
                </div>
              </div>

              {/* Ingredients Heading & List */}
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold font-['Frank_Ruhl_Libre'] text-[#3b2416] tracking-wide">
                    מצרכים דרושים:
                  </h3>
                  <LaurelBranch className="w-14 h-4 text-[#8a4b2a]/40" />
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {recipe.ingredients.map((ing, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-baseline justify-between text-xs xl:text-sm py-1 border-b border-dotted border-[#e2d5bd]"
                    >
                      <span className="font-mono font-bold text-[#8a4b2a] shrink-0 pl-2 dir-rtl">
                        {ing.amount}
                      </span>
                      <div className="flex items-center gap-2 font-['Assistant'] text-[#3a281c]">
                        <span className="text-base select-none">{ing.icon || '•'}</span>
                        <span className="font-medium">{ing.item}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Family Memory directly under Ingredients */}
                {recipe.familyMemory ? (
                  <div className="relative p-3.5 rounded-lg bg-[#f7ebe1] border border-[#e2cdbe] shadow-2xs mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#8a4b2a] flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 fill-[#8a4b2a]" />
                        זיכרון משפחתי:
                      </span>
                      <span className="text-[11px] text-[#8e7362] font-serif">מסורת ביתית</span>
                    </div>
                    <p className="text-xs xl:text-sm text-[#553a27] italic font-['Assistant'] leading-relaxed">
                      "{recipe.familyMemory}"
                    </p>
                  </div>
                ) : recipe.id === 'candied-orange-peels' && (
                  <div 
                    onClick={() => onEditRecipe && onEditRecipe(recipe)}
                    className="relative p-3.5 rounded-lg border-2 border-dashed border-[#c5b095] bg-white/40 hover:bg-white/70 transition-colors cursor-pointer text-center group mt-4 shadow-2xs"
                    title="לחצו להוספת זיכרון משפחתי"
                  >
                    <div className="text-xs font-bold text-[#8a4b2a] flex items-center justify-center gap-1.5 mb-1">
                      <Heart className="w-3.5 h-3.5 text-[#8a4b2a]" />
                      <span>זיכרון משפחתי – מקום פתוח לטקסט</span>
                    </div>
                    <p className="text-xs text-[#8c6f5a] font-['Assistant'] italic">
                      (לחצו כאן לעריכה וכתיבת הזיכרון המשפחתי כשהטקסט יהיה מוכן)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Page number on bottom corner */}
            <div className="pt-6 flex justify-between items-center text-xs text-[#8c7462] border-t border-[#dfd0b7]/60">
              <span className="font-serif">ספר המתכונים המשפחתי</span>
              <span className="font-mono font-bold px-2 py-0.5 rounded bg-[#ebdfc8] text-[#5c3e29]">
                עמוד {currentPageIndex * 2 + 1}
              </span>
            </div>
          </div>

          {/* ---------------- LEFT PAGE: Method Steps, Grandma's Secret Washi Note, Family Memory ---------------- */}
          <div className={`relative p-8 xl:p-10 flex flex-col justify-between ${theme.paperClass} text-[${theme.textColor}] book-spine-shadow-left`}>
            <div>
              {/* Method Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#dfd0b7]">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold font-['Frank_Ruhl_Libre'] text-[#3b2416]">
                    אופן ההכנה
                  </h3>
                  <HeartDoodle className="w-4 h-4 text-rose-600/60" />
                </div>
                <button
                  onClick={() => onOpenCookingMode(recipe)}
                  className="text-xs px-3 py-1 rounded-full bg-[#8a4b2a] text-amber-50 hover:bg-[#703b20] transition-colors flex items-center gap-1 shadow-2xs font-semibold"
                >
                  <Sparkles className="w-3 h-3" />
                  מצב בישול נוח
                </button>
              </div>

              {/* Numbered Step-by-Step Stamps */}
              <div className="space-y-4 mb-6">
                {recipe.steps.map((st, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 group">
                    {/* Vintage Number Stamp */}
                    <div className="w-7 h-7 rounded-full bg-[#ebdcc0] border border-[#bda688] text-[#703f25] font-serif font-black flex items-center justify-center text-xs shrink-0 shadow-2xs mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs xl:text-sm leading-relaxed text-[#2f2015] font-['Assistant']">
                        {st.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grandma's Secret Tip Note (Clean, elegant, non-overlapping) */}
              {recipe.secretTip && (
                <div className="relative mt-5 mb-4 p-4 rounded-xl bg-[#fff8db] border border-[#e4d49a] shadow-xs text-[#46341d]">
                  <div className="flex items-center justify-between font-bold font-['Frank_Ruhl_Libre'] text-sm text-[#734b17] mb-2 pb-1.5 border-b border-[#ebd7a0]">
                    <span className="flex items-center gap-1.5">
                      <span>💡</span>
                      <span>הסוד של סבתא:</span>
                    </span>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[#ebd7a0]/80 text-[#613e17]">
                      טיפ זהב למנה
                    </span>
                  </div>
                  <p className="text-xs xl:text-sm leading-relaxed font-['Assistant'] text-[#3b2b1a]">
                    {recipe.secretTip}
                  </p>
                </div>
              )}

              {/* Grandma Esther's Dictated Voice Note Sticky */}
              {recipe.grandmaVoiceNote && (
                <div className="relative mt-5 p-4 rounded-xl bg-[#fffde8] border-2 border-[#e7dea9] shadow-md text-[#3b2b18]">
                  <div className="absolute -top-3 right-6 px-3 py-0.5 bg-[#e08e6d] text-amber-50 text-[10px] font-bold rounded-sm shadow-2xs rotate-1 tracking-wider uppercase">
                    סבתא אסתר במטבח
                  </div>
                  <div className="pb-1.5 flex items-center justify-between border-b border-[#ebe1af] mb-2.5">
                    <div className="font-bold font-['Frank_Ruhl_Libre'] text-sm sm:text-base text-[#7c3f1d] flex items-center gap-1.5">
                      <span>📜</span>
                      <span>ככה סבתא אסתר מעבירה מתכונים – בהצלחה!! 😂</span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#f5eab5] text-[#6d4611]">
                      אותנטי מילה במילה
                    </span>
                  </div>
                  <p className="text-xs xl:text-sm leading-relaxed font-['Assistant'] text-[#3a2818] bg-white/70 p-3 rounded-lg border border-[#eee4b9] whitespace-pre-line italic">
                    "{recipe.grandmaVoiceNote}"
                  </p>
                  <div className="mt-2 text-left text-xs font-['Caveat'] text-[#8a4b2a] font-bold">
                    — מוקלט באהבה מסבתא אסתר ❤️ בתיאבון!
                  </div>
                </div>
              )}
            </div>

            {/* Page number on bottom-left corner & Grandma's sign-off */}
            <div className="pt-6 flex justify-between items-center text-xs text-[#8c7462] border-t border-[#dfd0b7]/60">
              <span className="font-mono font-bold px-2 py-0.5 rounded bg-[#ebdfc8] text-[#5c3e29]">
                עמוד {currentPageIndex * 2 + 2}
              </span>
              <span className="font-['Caveat'] text-base text-[#8a4b2a] font-bold">
                בתיאבון ובאהבה לכולם! ❤️
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* MOBILE PHYSICAL POCKET BOOK VIEW (< lg screens)               */}
        {/* Strictly formatted as a tactile recipe journal - NOT a landing page! */}
        {/* ============================================================ */}
        <div className="block lg:hidden w-full">
          {/* Mobile Pocket Book Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#3f271c] rounded-t-xl text-amber-100 text-xs border-b border-[#523525]">
            <span className="font-bold font-serif flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              פנקס המתכונים של המשפחה
            </span>
            <span className="font-mono text-amber-300/80">
              עמוד {currentPageIndex + 1} מתוך {totalPages}
            </span>
          </div>

          {/* Book Page Card with Paper Texture */}
          <div className={`p-4 sm:p-6 rounded-b-xl ${theme.paperClass} text-[${theme.textColor}] shadow-lg border border-[#cfbe9f] min-h-[560px] flex flex-col justify-between relative`}>
            
            {/* Spiral binding on side if notebook theme */}
            {theme.ringBinder && (
              <div className="absolute right-0 top-6 bottom-6 w-3 flex flex-col justify-around">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-3 h-1.5 rounded-l-full bg-zinc-600 shadow-inner" />
                ))}
              </div>
            )}

            <div>
              {/* Mobile Back to All Recipes Button */}
              <button
                onClick={onGoToCover || onOpenTableOfContents}
                className="w-full mb-3 py-2 px-3 rounded-xl bg-[#5c2a18] hover:bg-[#73351f] text-amber-50 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 border border-[#7a3720]"
              >
                <ArrowRight className="w-4 h-4 text-amber-300" />
                <span>חזרה לכלל המתכונים</span>
              </button>

              {/* Recipe Title & Contributor */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <div className="text-[11px] font-bold text-[#8a4b2a] flex items-center flex-wrap gap-1 mb-0.5">
                    <div className="flex items-center gap-1">
                      <ChefHat className="w-3 h-3 text-[#8a4b2a]" />
                      <span>{recipe.contributor}</span>
                    </div>
                    {recipe.credit && (
                      <span className="text-[10px] text-[#785942] font-normal">
                        • {recipe.credit}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold font-['Frank_Ruhl_Libre'] text-[#3b2416] leading-snug">
                    {recipe.title}
                  </h1>
                  {recipe.videoUrl && (
                    <div className="mt-1.5">
                      <a
                        href={recipe.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#5c2a18]/10 text-[#5c2a18] text-[11px] font-bold border border-[#5c2a18]/30 transition-all shadow-2xs"
                        title="פתיחת סרטון ההכנה בטאב חדש"
                      >
                        <Video className="w-3 h-3 text-[#8a4b2a]" />
                        <span>{recipe.videoTitle || 'לסרטון ההכנה ↗'}</span>
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {onEditRecipe && (
                    <button
                      onClick={() => onEditRecipe(recipe)}
                      className="p-1.5 rounded-lg bg-white/70 text-[#73513b] border border-[#d8c3a5]"
                      title="עריכת מתכון"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onToggleFavorite(recipe.id)}
                    className="p-1.5 rounded-lg bg-white/70 text-rose-600 border border-[#d8c3a5]"
                    title="מועדף"
                  >
                    <Heart className={`w-4 h-4 ${recipe.isFavorite ? 'fill-rose-600' : ''}`} />
                  </button>
                  <button
                    onClick={() => onOpenShare(recipe)}
                    className="p-1.5 rounded-lg bg-white/70 text-[#5a3e2b] border border-[#d8c3a5]"
                    title="שתף"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {recipe.subtitle && (
                <p className="text-xs sm:text-sm text-[#684e3b] italic mb-3">
                  "{recipe.subtitle}"
                </p>
              )}

              {/* Quick Info bar */}
              <div className="flex flex-wrap items-center justify-between gap-1 text-xs sm:text-sm py-2 px-2.5 bg-white/70 rounded-lg border border-[#dfd0b7] mb-3 text-[#4c3524] font-medium">
                <span>⏱️ הכנה: {recipe.prepTime}</span>
                <span>🔥 בישול: {recipe.cookTime}</span>
                <span className="truncate max-w-[150px]">👥 {recipe.servings}</span>
              </div>

              {/* Physical Bookmark Tabs */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => setMobileTab('ingredients')}
                  className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 border ${
                    mobileTab === 'ingredients'
                      ? 'bg-[#8a4b2a] text-amber-50 border-[#8a4b2a] shadow-xs'
                      : 'bg-[#ebe0cb] text-[#5a3f2b] border-[#d8c3a5] hover:bg-[#dfd0b7]'
                  }`}
                >
                  <span>🥗</span>
                  <span>מצרכים</span>
                </button>

                <button
                  onClick={() => setMobileTab('instructions')}
                  className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 border ${
                    mobileTab === 'instructions'
                      ? 'bg-[#8a4b2a] text-amber-50 border-[#8a4b2a] shadow-xs'
                      : 'bg-[#ebe0cb] text-[#5a3f2b] border-[#d8c3a5] hover:bg-[#dfd0b7]'
                  }`}
                >
                  <span>📜</span>
                  <span>אופן ההכנה</span>
                </button>
              </div>

              {/* TAB 1: Ingredients & Watercolor Pot + Family Memory */}
              {mobileTab === 'ingredients' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {/* Watercolor pot centered with steam */}
                  <div className="relative mx-auto w-48 h-36">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                      <SteamDoodle className="w-14 h-10 text-amber-900/60" />
                    </div>
                    <div className="relative w-full h-full rounded-xl overflow-hidden p-1.5 bg-white/70 shadow-sm border border-[#dfd0b7]">
                      <img 
                        src={effectiveImageUrl} 
                        alt={recipe.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const fallback = CANONICAL_RECIPE_IMAGES[recipe.id];
                          if (fallback && e.currentTarget.src !== fallback) {
                            e.currentTarget.src = fallback;
                          }
                        }}
                      />
                      {onUpdateRecipeImage && (
                        <label 
                          className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-white cursor-pointer shadow text-[10px] flex items-center gap-1"
                          title="החלפת תמונה למתכון"
                        >
                          <Camera className="w-3 h-3 text-amber-300" />
                          <span>החלף תמונה</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleQuickImageUpload} 
                            className="hidden" 
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Ingredients list with larger font */}
                  <div className="bg-white/60 p-3.5 rounded-xl border border-[#ded0b8]">
                    <div className="text-sm font-bold text-[#422919] mb-2.5 flex items-center justify-between">
                      <span>רשימת מצרכים:</span>
                      <span className="text-xs text-[#735946]">{recipe.ingredients.length} פריטים</span>
                    </div>
                    <div className="space-y-2">
                      {recipe.ingredients.map((ing, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-dotted border-[#e6d8c2]">
                          <span className="font-mono font-bold text-[#8a4b2a] text-xs sm:text-sm shrink-0 pl-2 dir-rtl">
                            {ing.amount}
                          </span>
                          <div className="flex items-center gap-2 text-[#3b271b]">
                            <span className="text-base select-none">{ing.icon || '•'}</span>
                            <span className="font-medium text-sm sm:text-base">{ing.item}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Family Memory on Mobile (Moved right below Ingredients) */}
                  {recipe.familyMemory ? (
                    <div className="p-3.5 rounded-xl bg-[#f7ebe1] border border-[#e2cdbe] text-sm text-[#4d3321] shadow-2xs">
                      <div className="text-xs sm:text-sm font-bold text-[#8a4b2a] flex items-center gap-1.5 mb-1">
                        <Heart className="w-3.5 h-3.5 fill-[#8a4b2a]" />
                        <span>זיכרון משפחתי:</span>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed italic font-['Assistant']">
                        "{recipe.familyMemory}"
                      </p>
                    </div>
                  ) : recipe.id === 'candied-orange-peels' && (
                    <div 
                      onClick={() => onEditRecipe && onEditRecipe(recipe)}
                      className="p-3 rounded-xl border-2 border-dashed border-[#c5b095] bg-white/40 hover:bg-white/70 transition-colors cursor-pointer text-center group shadow-2xs"
                      title="לחצו להוספת זיכרון משפחתי"
                    >
                      <div className="text-xs font-bold text-[#8a4b2a] flex items-center justify-center gap-1.5 mb-0.5">
                        <Heart className="w-3.5 h-3.5 text-[#8a4b2a]" />
                        <span>זיכרון משפחתי – מקום פתוח לטקסט</span>
                      </div>
                      <p className="text-[11px] text-[#8c6f5a] font-['Assistant'] italic">
                        (לחצו כאן לעריכה וכתיבת הזיכרון כשהטקסט יהיה מוכן)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Instructions & Grandma's secret note */}
              {mobileTab === 'instructions' && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="space-y-3">
                    {recipe.steps.map((st, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#ebdcc0] border border-[#c5b094] text-[#703f25] font-serif font-black flex items-center justify-center text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm sm:text-base leading-relaxed text-[#26170d] font-['Assistant']">
                            {st.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Grandma's Secret Note on Mobile */}
                  {recipe.secretTip && (
                    <div className="relative mt-3 p-3.5 rounded-xl bg-[#fff8db] border border-[#e4d49a] shadow-xs">
                      <div className="text-xs sm:text-sm font-bold text-[#734b17] mb-1.5 flex items-center gap-1.5">
                        <span>💡</span>
                        <span>הסוד של סבתא:</span>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed text-[#3f2e18]">
                        {recipe.secretTip}
                      </p>
                    </div>
                  )}

                  {/* Grandma Esther's Dictated Voice Note Sticky on Mobile */}
                  {recipe.grandmaVoiceNote && (
                    <div className="relative mt-5 p-4 rounded-xl bg-[#fffde8] border-2 border-[#e7dea9] shadow-md text-[#3b2b18] transform -rotate-[0.5deg]">
                      <div className="absolute -top-3 right-4 px-2.5 py-0.5 bg-[#e08e6d] text-amber-50 text-[10px] font-bold rounded-sm shadow-2xs rotate-1 tracking-wider uppercase flex items-center gap-1">
                        <span>📌</span>
                        <span>הפתק של סבתא אסתר</span>
                      </div>
                      <div className="pt-1 pb-1.5 flex items-center justify-between border-b border-[#ebe1af] mb-2">
                        <div className="font-bold font-['Frank_Ruhl_Libre'] text-sm text-[#7c3f1d] flex items-center gap-1.5">
                          <span className="text-base">😂</span>
                          <span>ככה סבתא אסתר מעבירה מתכונים – בהצלחה!! 😂</span>
                        </div>
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#f5eab5] text-[#6d4611] border border-[#e8dba0]">
                          אותנטי מילה במילה
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed font-['Assistant'] text-[#3a2818] bg-white/75 p-3 rounded-lg border border-[#eee4b9] whitespace-pre-line italic">
                        "{recipe.grandmaVoiceNote}"
                      </p>
                      <div className="mt-1.5 text-left text-xs font-['Caveat'] text-[#8a4b2a] font-bold">
                        — מוקלט באהבה מסבתא אסתר ❤️ בתיאבון!
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Bottom Bar */}
            <div className="mt-4 pt-2 border-t border-[#dfd0b7] flex items-center justify-between text-xs text-[#7d6452]">
              <button
                onClick={() => onOpenCookingMode(recipe)}
                className="py-1 px-2.5 rounded-lg bg-[#8a4b2a] text-amber-50 text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
              >
                <Sparkles className="w-3 h-3" />
                מצב בישול
              </button>
              <button
                onClick={onGoToCover || onOpenTableOfContents}
                className="font-mono font-bold text-[11px] px-2.5 py-1 rounded-lg bg-[#efe4d2] hover:bg-[#e4d4bd] text-[#553b27] border border-[#d3c2a6] flex items-center gap-1"
              >
                <BookOpen className="w-3 h-3 text-[#8a4b2a]" />
                <span>עמוד {currentPageIndex + 1} • לכל המתכונים</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PHYSICAL BOOK BOTTOM CONTROLLER (Turn Pages / Index)         */}
        {/* ============================================================ */}
        <div className="mt-2.5 sm:mt-5 pt-2.5 border-t border-[#472d20] flex items-center justify-between px-1 sm:px-6 w-full gap-1">
          {/* Previous Page (RTL: right button moves to previous page or cover) */}
          <button
            onClick={onPrevPage}
            className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#4a2e21] hover:bg-[#5e3b2b] text-amber-100 font-semibold text-xs sm:text-sm flex items-center gap-1 transition-all shadow-md active:scale-95 shrink-0"
            title={currentPageIndex === 0 ? "חזרה לשער ולפתיח" : "עמוד קודם"}
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-300" />
            <span className="hidden sm:inline">{currentPageIndex === 0 ? "לשער ולפתיח" : "לעמוד הקודם"}</span>
            <span className="sm:hidden">{currentPageIndex === 0 ? "לשער" : "הקודם"}</span>
          </button>

          {/* Center page indicator & table of contents shortcut */}
          <button
            onClick={onGoToCover || onOpenTableOfContents}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#5c2a18] hover:bg-[#73351f] text-amber-100 text-xs sm:text-sm font-bold transition-all border border-amber-800/70 shadow-md active:scale-95 shrink-0"
            title="חזרה לכלל המתכונים ולשער הספר"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
            <span>לכל המתכונים</span>
            <span className="font-mono text-[11px] sm:text-xs text-amber-300/80 mr-1">
              ({currentPageIndex + 1}/{totalPages})
            </span>
          </button>

          {/* Next Page (RTL: left button moves to next page) */}
          <button
            disabled={currentPageIndex >= totalPages - 1}
            onClick={onNextPage}
            className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#8a4b2a] hover:bg-[#9c5530] disabled:opacity-30 disabled:cursor-not-allowed text-amber-50 font-bold text-xs sm:text-sm flex items-center gap-1 transition-all shadow-md active:scale-95 shrink-0"
            title="עמוד הבא"
          >
            <span className="hidden sm:inline">לעמוד הבא</span>
            <span className="sm:hidden">הבא</span>
            <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-200" />
          </button>
        </div>
      </div>
    </div>
  );
};
