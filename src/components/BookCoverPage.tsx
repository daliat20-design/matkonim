import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  ChefHat, 
  Search, 
  ChevronLeft, 
  Clock, 
  Heart, 
  Edit3, 
  Check, 
  RotateCcw,
  Flame,
  Plus
} from 'lucide-react';
import { Recipe, BookTheme } from '../types';
import { LaurelBranch, HeartDoodle } from './DecorativeIcons';
import { CANONICAL_RECIPE_IMAGES } from '../data/recipes';

const DEFAULT_INTRO_TEXT = `יש משפחות שמספרות את הסיפור שלהן דרך תמונות, מכתבים וזיכרונות. אצלנו, כנראה שאפשר לספר חלק לא קטן מהסיפור גם דרך האוכל.

בספר הזה נפגשים מרוקו, פולין, ונצואלה ואורוגוואי ועוד... עם השפעות שעברו ממטבח למטבח, מדור לדור ומארץ לארץ. סוג של קיבוץ גלויות משפחתי, שמספר לא רק מה אכלנו, אלא גם מאיפה באנו ואיך כל המקומות האלה נכנסו בסוף למטבח אחד.

כפי שכולם יודעים, סבתא אסתר נולדה במרוקו, אבל הגפילטע פיש שלה, הוא בהחלט תחרות לכל פולניה תורנית (אולי בגלל זה סבתא לאה לא אהבה אותה ?... - חחח).אז,  מרוקאי זה לא -  אבל אצלנו כנראה שהגבולות במטבח אף פעם לא היו מאוד קשיחים.

יש כאן מתכון של סבא יצחק, שעלה לארץ עם סבתא מרי - אחרי שכל הילדים החליטו להפריח את השממה ולחסום את הסורים על הגדרות (כל הכבוד סבתא אסתר על הנחישות בקיבוץ דן) הוא היה מכין לנו סוכריות מקליפות תפוז. יש פה מתכונים בהשראתה של סבתא לאה הפולנייה, עם המאכלים האשכנזיים שלה, והחסכנות הידועה! ידעתם שלא צריך להשתמש במפית שלמה, גם רבע מספיק ?

ג'וליאנה מביאה איתה ניחוחות מאורוגוואי, עם נגיעה איטלקית, כך שגם שם הגבולות הגיאוגרפיים לא ממש מחזיקים מעמד. יש פה, מתכונים שלי (דלית) בעיקר מהרשת, אבל הם כבר אומצו על ידי המשפחה - אז מעכשיו הם שלנו !

את רוב המתכונים סבתא אסתר הכתיבה או כתבה בדיוק כמו שמבשלים אצלנו במשפחה: קצת מזה, קצת מזה, לפי העין, לפי הטעם, ואז פתאום: "אההה, שכחתי להגיד שמוסיפים גם..." הכי פולני שלה... חחח

למזלנו, הבינה המלאכותית הצליחה להבין גם את הכמויות שלא נאמרו, גם את מה שנשכח באמצע, וגם את המשפטים שהתחילו במתכון אחד והסתיימו באחר.

כך נולד הספר הזה – אוסף של טעמים, אנשים, מקומות, סיפורים וזיכרונות קטנים שעברו איתנו לאורך השנים. בתיאבון! ❤️`;

const INTRO_STORAGE_KEY = 'family_book_intro_text_v2';

const CATEGORY_NAMES: Record<string, string> = {
  all: 'הכל',
  sauces: 'רטבים',
  starters: 'ראשונות',
  salads: 'סלטים',
  mains: 'עיקריות',
  dessert: 'קינוחים',
  sweets: 'מתוקים',
  casserole: 'מאפים'
};

interface BookCoverPageProps {
  bookTitle: string;
  recipes: Recipe[];
  theme: BookTheme;
  onSelectRecipe: (index: number) => void;
  onNextPage: () => void;
  onOpenAddRecipe?: () => void;
}

export const BookCoverPage: React.FC<BookCoverPageProps> = ({
  bookTitle,
  recipes,
  theme,
  onSelectRecipe,
  onNextPage,
  onOpenAddRecipe
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileTab, setMobileTab] = useState<'story' | 'toc'>('story');

  // Intro Story Text state
  const [introText, setIntroText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(INTRO_STORAGE_KEY);
      if (saved && saved.trim().length > 50) return saved;
    } catch (e) {}
    return DEFAULT_INTRO_TEXT;
  });

  const [isEditingStory, setIsEditingStory] = useState(false);
  const [editStoryDraft, setEditStoryDraft] = useState(introText);

  const handleSaveStory = () => {
    setIntroText(editStoryDraft);
    setIsEditingStory(false);
    try {
      localStorage.setItem(INTRO_STORAGE_KEY, editStoryDraft);
    } catch (e) {}
  };

  const handleResetStory = () => {
    if (window.confirm('האם לשחזר את נוסח הפתיח המקורי של המשפחה?')) {
      setIntroText(DEFAULT_INTRO_TEXT);
      setEditStoryDraft(DEFAULT_INTRO_TEXT);
      setIsEditingStory(false);
      try {
        localStorage.setItem(INTRO_STORAGE_KEY, DEFAULT_INTRO_TEXT);
      } catch (e) {}
    }
  };

  // Filter recipes for table of contents
  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.contributor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const paragraphs = introText.split('\n\n').filter(p => p.trim().length > 0);

  return (
    <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center overflow-x-hidden">
      
      {/* Main Physical Book Container */}
      <div className="relative w-full rounded-2xl sm:rounded-3xl p-2 sm:p-5 lg:p-7 bg-[#2d1c14] border-2 sm:border-8 border-[#3f271c] shadow-2xl book-edge-stack">
        
        {/* Book Spine Texture Top Decor (Desktop) */}
        <div className="hidden lg:flex justify-between items-center px-4 py-1 mb-2 text-[#96735e] text-xs font-serif tracking-widest border-b border-[#442c20]">
          <span>שער הספר ופתיח • תוכן העניינים המשפחתי</span>
          <span className="flex items-center gap-2">
            <span>דפדוף לעמוד הראשון ◄</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600/70" />
            <span>סגנון: {theme.name}</span>
          </span>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP 2-PAGE SPREAD (lg & xl screens)                      */}
        {/* Right Page = Family Heritage Prologue                        */}
        {/* Left Page  = Complete Interactive Table of Contents         */}
        {/* ============================================================ */}
        <div className="hidden lg:grid grid-cols-2 min-h-[720px] rounded-xl overflow-hidden shadow-inner relative border border-[#c5b597]">
          
          {/* CENTER BOOK SPINE CREASE & SHADOW */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 pointer-events-none z-20 flex justify-center">
            <div className="w-1 h-full bg-[#3d2719]/40 shadow-md" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
          </div>

          {/* ---------------- RIGHT PAGE: FAMILY STORY & DEDICATION ---------------- */}
          <div className={`p-8 xl:p-10 ${theme.paperClass} book-spine-shadow-right text-[${theme.textColor}] flex flex-col justify-between relative border-l border-[#d8c3a5]/60 overflow-y-auto max-h-[740px]`}>
            <div>
              {/* Decorative Header Ornament */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <LaurelBranch className="w-10 h-6 text-amber-800/60 rotate-180" />
                <span className="text-xs tracking-widest uppercase text-[#8a5231] font-bold font-serif">
                  שער ופתיח הספר
                </span>
                <LaurelBranch className="w-10 h-6 text-amber-800/60" />
              </div>

              {/* Book Main Title */}
              <div className="text-center mb-6">
                <h1 className="text-3xl xl:text-4xl font-black font-['Frank_Ruhl_Libre'] text-[#3a2213] tracking-tight leading-tight">
                  {bookTitle}
                </h1>
                <p className="text-sm text-[#7a543b] font-medium mt-1">
                  זיכרונות, טעמים ומתכונים שעברו מדור לדור
                </p>
              </div>

              {/* Family Story Text */}
              <div className="relative p-5 rounded-2xl bg-white/60 border border-[#ddcfb6] shadow-xs">
                <div className="flex items-center justify-between mb-3 border-b border-[#ebdcc4] pb-2">
                  <span className="text-xs font-bold text-[#7a482b] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    הסיפור של המשפחה והמטבח שלנו
                  </span>
                  
                  {!isEditingStory ? (
                    <button
                      onClick={() => {
                        setEditStoryDraft(introText);
                        setIsEditingStory(true);
                      }}
                      className="text-[11px] text-[#8a5231] hover:text-[#5a331c] flex items-center gap-1 transition-colors"
                      title="עריכת נוסח הפתיח"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>ערוך סיפור</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveStory}
                        className="px-2 py-0.5 rounded bg-[#8a4b2a] text-white text-[11px] font-bold flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>שמור</span>
                      </button>
                      <button
                        onClick={() => setIsEditingStory(false)}
                        className="text-[11px] text-gray-500 hover:text-gray-700"
                      >
                        ביטול
                      </button>
                    </div>
                  )}
                </div>

                {isEditingStory ? (
                  <div className="space-y-2">
                    <textarea
                      value={editStoryDraft}
                      onChange={(e) => setEditStoryDraft(e.target.value)}
                      rows={12}
                      className="w-full p-3 rounded-xl border border-amber-300 bg-amber-50/70 text-xs sm:text-sm text-[#3b2719] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#8a4b2a]"
                    />
                    <div className="flex justify-between items-center text-[11px] text-[#7a5944]">
                      <button
                        onClick={handleResetStory}
                        className="flex items-center gap-1 hover:text-rose-700 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>שחזר נוסח מקורי</span>
                      </button>
                      <span>לחצו שמור לעדכון בספר</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs xl:text-sm text-[#453023] leading-relaxed font-['Assistant']">
                    {paragraphs.map((p, idx) => (
                      <p key={idx} className={idx === 0 ? "font-medium text-[#2d1c12]" : ""}>
                        {p}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Invitation to Flip */}
            <div className="mt-6 pt-3 border-t border-[#dfd0b7] flex items-center justify-between">
              <span className="text-xs text-[#8c6b54] italic font-serif flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600/60" />
                בתיאבון, ובאהבה גדולה מדור לדור
              </span>

              <button
                onClick={onNextPage}
                className="px-4 py-2 rounded-xl bg-[#8a4b2a] hover:bg-[#9c5530] text-amber-50 text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <span>למתכון הראשון בספר</span>
                <ChevronLeft className="w-4 h-4 text-amber-200" />
              </button>
            </div>
          </div>

          {/* ---------------- LEFT PAGE: INTERACTIVE TABLE OF CONTENTS ---------------- */}
          <div className={`p-8 xl:p-10 ${theme.paperClass} book-spine-shadow-left text-[${theme.textColor}] flex flex-col justify-between relative overflow-y-auto max-h-[740px]`}>
            <div>
              {/* Header Title */}
              <div className="flex items-center justify-between mb-4 border-b-2 border-[#d5c3a5] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#8a4b2a] flex items-center justify-center text-amber-100 shadow-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-['Frank_Ruhl_Libre'] text-[#3b2416]">
                      תוכן העניינים של הספר
                    </h2>
                    <p className="text-xs text-[#7a5944]">
                      לחצו על כל מתכון למעבר ישיר לעמוד שלו
                    </p>
                  </div>
                </div>

                {onOpenAddRecipe && (
                  <button
                    onClick={onOpenAddRecipe}
                    className="px-3 py-1 rounded-lg bg-[#5a3622] hover:bg-[#6e432c] text-amber-100 text-xs font-semibold flex items-center gap-1 transition-all"
                    title="הוספת מתכון משפחתי חדש"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>מתכון חדש</span>
                  </button>
                )}
              </div>

              {/* Search Box */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-[#8a5d40] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="חיפוש מתכון, מרכיב או בן משפחה..."
                  className="w-full pr-9 pl-3 py-2 text-xs rounded-xl bg-white/70 border border-[#d6c4a8] text-[#3d2719] placeholder:text-[#9d7d66] focus:outline-none focus:ring-1 focus:ring-[#8a4b2a]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 flex-wrap mb-4">
                {Object.entries(CATEGORY_NAMES).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      selectedCategory === key
                        ? 'bg-[#8a4b2a] text-white shadow-xs'
                        : 'bg-white/60 text-[#684834] hover:bg-white/90 border border-[#ddcfba]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Recipes Index List */}
              <div className="space-y-2.5">
                {filteredRecipes.map((recipe) => {
                  const originalIndex = recipes.findIndex(r => r.id === recipe.id);
                  const effectiveImg = recipe.imageUrl || CANONICAL_RECIPE_IMAGES[recipe.id];

                  return (
                    <div
                      key={recipe.id}
                      onClick={() => onSelectRecipe(originalIndex)}
                      className="group p-3 rounded-xl bg-white/60 hover:bg-white/95 border border-[#dfd0b7] hover:border-[#8a4b2a] shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Recipe Thumbnail */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#d8c3a5] bg-[#ebdcc0] shrink-0">
                          {effectiveImg ? (
                            <img
                              src={effectiveImg}
                              alt={recipe.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                const fallback = CANONICAL_RECIPE_IMAGES[recipe.id];
                                if (fallback && e.currentTarget.src !== fallback) {
                                  e.currentTarget.src = fallback;
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">
                              🍲
                            </div>
                          )}
                        </div>

                        {/* Title and details */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-mono text-xs font-bold text-[#8a4b2a] bg-[#ebe0cb] px-1.5 py-0.2 rounded">
                              #{originalIndex + 1}
                            </span>
                            <span className="text-[11px] text-[#7e5c46] font-medium flex items-center gap-1">
                              <ChefHat className="w-3 h-3" />
                              {recipe.contributor}
                            </span>
                          </div>
                          <h3 className="text-base font-bold font-['Frank_Ruhl_Libre'] text-[#3b2416] group-hover:text-[#8a4b2a] transition-colors truncate">
                            {recipe.title}
                          </h3>
                          <p className="text-[11px] text-[#6d503d] truncate">
                            {recipe.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Jump button */}
                      <div className="shrink-0 flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#8a5d40] bg-[#f2e7d5] px-2 py-0.5 rounded border border-[#dfd2be]">
                          עמ' {originalIndex + 1}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-[#8a4b2a]/10 group-hover:bg-[#8a4b2a] text-[#8a4b2a] group-hover:text-white flex items-center justify-center transition-colors">
                          <ChevronLeft className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredRecipes.length === 0 && (
                  <div className="text-center py-8 text-[#8c6b54] text-xs">
                    לא נמצאו מתכונים התואמים את החיפוש.
                  </div>
                )}
              </div>
            </div>

            {/* Left Page Footer */}
            <div className="mt-4 pt-3 border-t border-[#dfd0b7] flex items-center justify-between text-xs text-[#7e5f4b]">
              <span>סך הכל {recipes.length} מתכונים משפחתיים</span>
              <span className="font-mono">שער • עמוד תוכן עניינים</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* MOBILE SINGLE SCREEN VIEW (< lg screens)                     */}
        {/* Everything fits neatly on a mobile screen without overflow!  */}
        {/* ============================================================ */}
        <div className="block lg:hidden w-full">
          {/* Mobile Header Bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#3f271c] rounded-t-xl text-amber-100 text-xs border-b border-[#523525]">
            <span className="font-bold font-serif flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              שער הספר ותוכן עניינים
            </span>
            <span className="font-mono text-amber-300/80">
              {recipes.length} מתכונים
            </span>
          </div>

          {/* Book Page Card with Paper Texture */}
          <div className={`p-3.5 sm:p-5 rounded-b-xl ${theme.paperClass} text-[${theme.textColor}] shadow-lg border border-[#cfbe9f] flex flex-col justify-between`}>
            
            {/* Title Section */}
            <div className="text-center mb-3">
              <h1 className="text-xl sm:text-2xl font-black font-['Frank_Ruhl_Libre'] text-[#3a2213]">
                {bookTitle}
              </h1>
              <p className="text-[11px] text-[#7a543b] mt-0.5">
                מסורות, טעמים וזיכרונות שנאספו מדור לדור
              </p>
            </div>

            {/* Notebook Tabs on Mobile: Story vs Table of Contents */}
            <div className="grid grid-cols-2 gap-1.5 mb-3">
              <button
                onClick={() => setMobileTab('story')}
                className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 border ${
                  mobileTab === 'story'
                    ? 'bg-[#8a4b2a] text-amber-50 border-[#8a4b2a] shadow-xs'
                    : 'bg-[#ebe0cb] text-[#5a3f2b] border-[#d8c3a5] hover:bg-[#dfd0b7]'
                }`}
              >
                <span>📜</span>
                <span>סיפור המשפחה</span>
              </button>

              <button
                onClick={() => setMobileTab('toc')}
                className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 border ${
                  mobileTab === 'toc'
                    ? 'bg-[#8a4b2a] text-amber-50 border-[#8a4b2a] shadow-xs'
                    : 'bg-[#ebe0cb] text-[#5a3f2b] border-[#d8c3a5] hover:bg-[#dfd0b7]'
                }`}
              >
                <span>📖</span>
                <span>תוכן העניינים ({recipes.length})</span>
              </button>
            </div>

            {/* TAB 1: TABLE OF CONTENTS (DEFAULT ON MOBILE) */}
            {mobileTab === 'toc' && (
              <div className="space-y-2 animate-in fade-in duration-200">
                {/* Search in TOC */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#8a5d40] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="חיפוש מתכון או בן משפחה..."
                    className="w-full pr-8 pl-2 py-1.5 text-xs rounded-lg bg-white/70 border border-[#d6c4a8] text-[#3d2719] placeholder:text-[#9d7d66] focus:outline-none focus:ring-1 focus:ring-[#8a4b2a]"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                  {Object.entries(CATEGORY_NAMES).slice(0, 5).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`px-2 py-0.5 rounded text-[11px] whitespace-nowrap font-medium transition-colors ${
                        selectedCategory === key
                          ? 'bg-[#8a4b2a] text-white'
                          : 'bg-white/60 text-[#684834] border border-[#ddcfba]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Recipe items */}
                <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-0.5">
                  {filteredRecipes.map((recipe) => {
                    const originalIndex = recipes.findIndex(r => r.id === recipe.id);
                    const effectiveImg = recipe.imageUrl || CANONICAL_RECIPE_IMAGES[recipe.id];

                    return (
                      <div
                        key={recipe.id}
                        onClick={() => onSelectRecipe(originalIndex)}
                        className="p-2 rounded-lg bg-white/70 hover:bg-white border border-[#ded0b8] active:bg-amber-100/50 flex items-center justify-between gap-2 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-[#ebdcc0] shrink-0 border border-[#d8c3a5]">
                            {effectiveImg ? (
                              <img
                                src={effectiveImg}
                                alt={recipe.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const fallback = CANONICAL_RECIPE_IMAGES[recipe.id];
                                  if (fallback && e.currentTarget.src !== fallback) {
                                    e.currentTarget.src = fallback;
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sm">
                                🍲
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-[10px] font-bold text-[#8a4b2a] bg-[#ebe0cb] px-1 rounded">
                                #{originalIndex + 1}
                              </span>
                              <span className="text-[10px] text-[#7a5842] truncate">
                                {recipe.contributor}
                              </span>
                            </div>
                            <div className="font-bold text-xs text-[#3b2416] truncate font-['Frank_Ruhl_Libre']">
                              {recipe.title}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1">
                          <span className="text-[10px] font-mono text-[#8a5d40] bg-[#f2e7d5] px-1.5 py-0.5 rounded">
                            עמ' {originalIndex + 1}
                          </span>
                          <ChevronLeft className="w-3.5 h-3.5 text-[#8a4b2a]" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: STORY ON MOBILE (DEFAULT) */}
            {mobileTab === 'story' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                {/* Story text box */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-white/70 border border-[#ddcfb6] max-h-[380px] overflow-y-auto space-y-3 text-sm sm:text-base text-[#382315] leading-relaxed">
                  {paragraphs.map((p, idx) => (
                    <p key={idx} className={idx === 0 ? "font-bold text-[#27160c] text-sm sm:text-base" : "text-sm sm:text-base"}>
                      {p}
                    </p>
                  ))}
                  <div className="pt-2 text-center text-[#8a4b2a] font-bold text-sm">
                    בתיאבון, ובאהבה גדולה מדור לדור ❤️
                  </div>
                </div>

                <button
                  onClick={() => setMobileTab('toc')}
                  className="w-full py-2.5 rounded-xl bg-[#8a4b2a] text-amber-50 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs active:scale-98"
                >
                  <span>מעבר לתוכן העניינים ולמתכונים</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Bottom Footer */}
            <div className="mt-3 pt-2 border-t border-[#dfd0b7] flex items-center justify-between text-[11px] text-[#7e5f4b]">
              <span className="font-medium">שער הספר המשפחתי</span>
              <button
                onClick={onNextPage}
                className="py-1 px-3 rounded-lg bg-[#8a4b2a] text-amber-50 font-bold flex items-center gap-1"
              >
                <span>למתכון הראשון</span>
                <ChevronLeft className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PHYSICAL BOOK BOTTOM CONTROLLER (Navigation bar)             */}
        {/* Fits perfectly across all screens without horizontal stretch! */}
        {/* ============================================================ */}
        <div className="mt-2.5 sm:mt-5 pt-2.5 border-t border-[#472d20] flex items-center justify-between px-1 sm:px-6 w-full gap-1">
          {/* Previous Page (Disabled on Cover) */}
          <button
            disabled={true}
            className="px-2.5 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-[#4a2e21] opacity-30 cursor-not-allowed text-amber-100 font-semibold text-xs sm:text-sm flex items-center gap-1"
            title="עמוד קודם"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-300 rotate-180" />
            <span className="hidden sm:inline">הקודם</span>
          </button>

          {/* Center page indicator */}
          <div className="flex items-center gap-1 sm:gap-2 px-2.5 py-1 rounded-lg bg-[#3d251a] text-amber-200 text-xs sm:text-sm border border-amber-950/80">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-amber-300">
              שער הספר ותוכן העניינים
            </span>
          </div>

          {/* Next Page -> Recipe 1 */}
          <button
            onClick={onNextPage}
            className="px-2.5 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-[#8a4b2a] hover:bg-[#9c5530] text-amber-50 font-bold text-xs sm:text-sm flex items-center gap-1 transition-all shadow-md active:scale-95"
            title="עבור למתכון הראשון"
          >
            <span>למתכון 1</span>
            <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-200" />
          </button>
        </div>
      </div>
    </div>
  );
};
