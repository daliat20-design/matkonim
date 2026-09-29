import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  Heart, 
  Clock, 
  ChefHat, 
  Video, 
  ExternalLink, 
  ArrowRight, 
  Printer, 
  Share2, 
  Sparkles, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Edit3,
  Bookmark,
  MessageCircle,
  Plus,
  Camera
} from 'lucide-react';
import { Recipe } from '../types';
import { CANONICAL_RECIPE_IMAGES } from '../data/recipes';
import { shareRecipeToWhatsApp } from '../utils/shareWhatsApp';
import { FamilyPhotoGallery } from './FamilyPhotoGallery';

interface CleanGalleryViewProps {
  recipes: Recipe[];
  onToggleFavorite: (id: string) => void;
  onOpenShare: (recipe: Recipe) => void;
  onEditRecipe?: (recipe: Recipe) => void;
  onAddRecipe?: () => void;
  bookTitle?: string;
  selectedRecipeId?: string | null;
  onSelectRecipeId?: (id: string | null) => void;
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const RECIPE_CATEGORIES = [
  { id: 'all', label: 'הכל' },
  { id: 'salads', label: 'סלטים' },
  { id: 'baking', label: 'מאפים' },
  { id: 'mains', label: 'תבשילים' },
  { id: 'sweets', label: 'קינוחים' },
  { id: 'sauces', label: 'רטבים' },
];

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  salads: 'סלטים',
  baking: 'מאפים',
  mains: 'תבשילים',
  sweets: 'קינוחים',
  sauces: 'רטבים',
  other: 'מתכונים'
};

const FAMILY_STORY = `יש משפחות שמספרות את הסיפור שלהן דרך תמונות, מכתבים וזיכרונות. אצלנו, כנראה שאפשר לספר חלק לא קטן מהסיפור גם דרך האוכל.

בספר הזה נפגשים מרוקו, פולין, ונצואלה ואורוגוואי ועוד... עם השפעות שעברו ממטבח למטבח, מדור לדור ומארץ לארץ. סוג של קיבוץ גלויות משפחתי, שמספר לא רק מה אכלנו, אלא גם מאיפה באנו ואיך כל המקומות האלה נכנסו בסוף למטבח אחד.

כפי שכולם יודעים, סבתא אסתר נולדה במרוקו, אבל הגפילטע פיש שלה, הוא בהחלט תחרות לכל פולניה תורנית (אולי בגלל זה סבתא לאה לא אהבה אותה ?... - חחח).אז,  מרוקאי זה לא -  אבל אצלנו כנראה שהגבולות במטבח אף פעם לא היו מאוד קשיחים.

יש כאן מתכון של סבא יצחק, שעלה לארץ עם סבתא מרי - אחרי שכל הילדים החליטו להפריח את השממה ולחסום את הסורים על הגדרות (כל הכבוד סבתא אסתר על הנחישות בקיבוץ דן) הוא היה מכין לנו סוכריות מקליפות תפוז. יש פה מתכונים בהשראתה של סבתא לאה הפולנייה, עם המאכלים האשכנזיים שלה, והחסכנות הידועה! ידעתם שלא צריך להשתמש במפית שלמה, גם רבע מספיק ?

ג'וליאנה מביאה איתה ניחוחות מאורוגוואי, עם נגיעה איטלקית, כך שגם שם הגבולות הגיאוגרפיים לא ממש מחזיקים מעמד. יש פה, מתכונים שלי (דלית) בעיקר מהרשת, אבל הם כבר אומצו על ידי המשפחה - אז מעכשיו הם שלנו !

את רוב המתכונים סבתא אסתר הכתיבה או כתבה בדיוק כמו שמבשלים אצלנו במשפחה: קצת מזה, קצת מזה, לפי העין, לפי הטעם, ואז פתאום: "אההה, שכחתי להגיד שמוסיפים גם..." הכי פולני שלה... חחח

למזלנו, הבינה המלאכותית הצליחה להבין גם את הכמויות שלא נאמרו, גם את מה שנשכח באמצע, וגם את המשפטים שהתחילו במתכון אחד והסתיימו באחר.

כך נולד הספר הזה – אוסף של טעמים, אנשים, מקומות, סיפורים וזיכרונות קטנים שעברו איתנו לאורך השנים. בתיאבון! ❤️`;

export const CleanGalleryView: React.FC<CleanGalleryViewProps> = ({
  recipes,
  onToggleFavorite,
  onOpenShare,
  onEditRecipe,
  onAddRecipe,
  bookTitle,
  selectedRecipeId: propSelectedRecipeId,
  onSelectRecipeId,
  activeCategory,
  onCategoryChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [internalCategory, setInternalCategory] = useState('all');
  const selectedCategory = activeCategory !== undefined ? activeCategory : internalCategory;
  const setSelectedCategory = (cat: string) => {
    setInternalCategory(cat);
    if (onCategoryChange) {
      onCategoryChange(cat);
    }
  };

  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const [isStoryExpanded, setIsStoryExpanded] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  const detailTopRef = useRef<HTMLDivElement>(null);

  const selectedRecipeId = propSelectedRecipeId !== undefined ? propSelectedRecipeId : internalSelectedId;
  const setSelectedRecipeId = (id: string | null) => {
    setInternalSelectedId(id);
    if (onSelectRecipeId) {
      onSelectRecipeId(id);
    }
    if (id) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };

  // When a recipe is opened, ensure the view is immediately positioned at the very top of the recipe
  useEffect(() => {
    if (selectedRecipeId) {
      // 1. Immediate scroll
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // 2. Next animation frame
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        if (detailTopRef.current) {
          detailTopRef.current.scrollIntoView({ block: 'start', inline: 'nearest' });
        }
      });

      // 3. Short timeout fallback for dynamic image/layout renders
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        if (detailTopRef.current) {
          detailTopRef.current.scrollIntoView({ block: 'start', inline: 'nearest' });
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [selectedRecipeId]);

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      // Search
      const matchesSearch = searchQuery.trim() === '' || 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.contributor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.ingredients.some(ing => ing.item.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.familyMemory && r.familyMemory.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Category
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'favorites') return r.isFavorite;
      if (selectedCategory === 'memories') return !!r.familyMemory && r.familyMemory.trim().length > 0;
      if (selectedCategory === 'salads') return r.category === 'salads' || r.category === 'starters' || r.category === 'fish';
      if (selectedCategory === 'mains') return r.category === 'mains' || r.category === 'casserole';
      if (selectedCategory === 'sweets') return r.category === 'sweets' || r.category === 'dessert';
      return r.category === selectedCategory;
    });
  }, [recipes, searchQuery, selectedCategory]);

  const selectedRecipe = useMemo(() => {
    if (!selectedRecipeId) return null;
    return recipes.find(r => r.id === selectedRecipeId) || null;
  }, [recipes, selectedRecipeId]);

  const toggleIngredientCheck = (key: string) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getCanonicalImageUrl = (r: Recipe) => {
    const canonical = CANONICAL_RECIPE_IMAGES[r.id];
    if (canonical && (!r.imageUrl || !r.imageUrl.startsWith('data:') || r.imageUrl.includes('localhost'))) {
      return canonical;
    }
    return r.imageUrl || canonical;
  };

  // -------------------------------------------------------------
  // RENDER SINGLE RECIPE DETAIL VIEW (MODERN MAGAZINE STYLE)
  // -------------------------------------------------------------
  if (selectedRecipe) {
    const imageUrl = getCanonicalImageUrl(selectedRecipe);

    return (
      <div ref={detailTopRef} id="recipe-detail-view" className="w-full min-h-screen bg-[#fbf9f6] text-[#2c2420] py-6 sm:py-10 px-3 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Top Bar Actions */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <button
              onClick={() => setSelectedRecipeId(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#4a3b32] text-sm font-semibold shadow-xs hover:shadow-md border border-[#e8dfd5] transition-all hover:bg-[#f7f2eb]"
            >
              <ArrowRight className="w-4 h-4" />
              <span>חזרה לכל המתכונים</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => shareRecipeToWhatsApp(selectedRecipe)}
                className="px-3.5 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                title="שיתוף מתכון זה ישירות בווטסאפ"
              >
                <MessageCircle className="w-4 h-4 fill-white text-white" />
                <span>שיתוף בווטסאפ</span>
              </button>
              {onEditRecipe && (
                <button
                  onClick={() => onEditRecipe(selectedRecipe)}
                  className="p-2 rounded-full bg-white text-[#70584b] hover:bg-[#f7f2eb] border border-[#e8dfd5] shadow-xs transition-colors"
                  title="עריכת מתכון"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => onToggleFavorite(selectedRecipe.id)}
                className="p-2 rounded-full bg-white text-rose-600 hover:bg-[#f7f2eb] border border-[#e8dfd5] shadow-xs transition-colors"
                title="מועדף"
              >
                <Heart className={`w-4 h-4 ${selectedRecipe.isFavorite ? 'fill-rose-600' : ''}`} />
              </button>
              <button
                onClick={() => onOpenShare(selectedRecipe)}
                className="p-2 rounded-full bg-white text-[#70584b] hover:bg-[#f7f2eb] border border-[#e8dfd5] shadow-xs transition-colors"
                title="שיתוף מתכון"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => window.print()}
                className="p-2 rounded-full bg-white text-[#70584b] hover:bg-[#f7f2eb] border border-[#e8dfd5] shadow-xs transition-colors"
                title="הדפסה"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Recipe Card Article */}
          <article className="bg-white rounded-3xl shadow-sm border border-[#ede5db] overflow-hidden">
            {/* Hero Image */}
            <div className="relative w-full h-72 sm:h-96 bg-[#f0eae1] overflow-hidden">
              <img
                src={imageUrl}
                alt={selectedRecipe.imageAlt || selectedRecipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Badges on Hero */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                  <ChefHat className="w-3.5 h-3.5 text-amber-300" />
                  <span>{selectedRecipe.contributor}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#4a382c] text-xs font-bold shadow-sm">
                  {CATEGORY_DISPLAY_NAMES[selectedRecipe.category] || selectedRecipe.category}
                </span>
              </div>

              {/* Title on Hero (Mobile & Desktop) */}
              <div className="absolute bottom-4 right-4 left-4 text-white">
                {selectedRecipe.credit && (
                  <div className="text-xs text-amber-200/90 font-medium mb-1">
                    מקור / קרדיט: {selectedRecipe.credit}
                  </div>
                )}
                <h1 className="text-2xl sm:text-4xl font-black font-['Frank_Ruhl_Libre'] drop-shadow-md leading-tight">
                  {selectedRecipe.title}
                </h1>
                {selectedRecipe.subtitle && (
                  <p className="text-sm sm:text-base text-amber-50/90 mt-1 drop-shadow-xs max-w-2xl font-light">
                    {selectedRecipe.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Meta Stats Row */}
            <div className="grid grid-cols-3 divide-x divide-x-reverse divide-[#f0e8de] border-b border-[#f0e8de] bg-[#fdfbf9] py-3 text-center">
              <div>
                <div className="text-[11px] text-[#8c786a]">זמן הכנה</div>
                <div className="text-xs sm:text-sm font-bold text-[#4a382c]">{selectedRecipe.prepTime}</div>
              </div>
              <div>
                <div className="text-[11px] text-[#8c786a]">בישול / אפייה</div>
                <div className="text-xs sm:text-sm font-bold text-[#4a382c]">{selectedRecipe.cookTime}</div>
              </div>
              <div>
                <div className="text-[11px] text-[#8c786a]">כמות מנות</div>
                <div className="text-xs sm:text-sm font-bold text-[#4a382c]">{selectedRecipe.servings}</div>
              </div>
            </div>

            {/* Video Button if Available */}
            {selectedRecipe.videoUrl && (
              <div className="p-4 sm:p-6 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xs">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#4a382c]">סרטון הדגמה מצולם</div>
                    <div className="text-xs text-[#786b62]">קישור לסרטון ההכנה המקורי ברשת</div>
                  </div>
                </div>
                <a
                  href={selectedRecipe.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4a382c] hover:bg-[#34261d] text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
                >
                  <span>{selectedRecipe.videoTitle || 'צפייה בסרטון ההכנה ↗'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                </a>
              </div>
            )}

            {/* Family Memory Card (Highlighted) */}
            {selectedRecipe.familyMemory && (
              <div className="m-4 sm:m-6 p-4 sm:p-5 rounded-2xl bg-[#fcf5ec] border border-[#ecdcc7] flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-200/70 text-[#7a4c28] flex items-center justify-center shrink-0 mt-0.5">
                  <Heart className="w-4 h-4 fill-amber-600 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8a4b2a] mb-1">
                    זיכרון משפחתי
                  </h3>
                  <p className="text-sm sm:text-base text-[#5c3e29] font-['Frank_Ruhl_Libre'] leading-relaxed italic">
                    "{selectedRecipe.familyMemory}"
                  </p>
                </div>
              </div>
            )}

            {/* Content Grid: Ingredients & Steps */}
            <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Ingredients Column (5 cols) */}
              <div className="lg:col-span-5 bg-[#fcfaf7] p-5 rounded-2xl border border-[#ede5db]">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#ebdccf]">
                  <h2 className="text-lg font-bold font-['Frank_Ruhl_Libre'] text-[#3b2b22] flex items-center gap-2">
                    <span>מצרכים דרושים</span>
                    <span className="text-xs font-normal text-[#8c786a]">({selectedRecipe.ingredients.length} פריטים)</span>
                  </h2>
                </div>

                {/* Column Headers: Right is Amount, Left is Ingredient */}
                <div className="flex items-center justify-between px-3 py-1.5 text-xs font-bold text-[#7d5d47] border-b border-[#ebdccf] mb-2 bg-[#f6eee4] rounded-lg">
                  <span className="w-28 text-right font-bold">כמות</span>
                  <span className="flex-1 text-right font-bold pr-2">מצרך</span>
                </div>

                <ul className="space-y-2">
                  {selectedRecipe.ingredients.map((ing, idx) => {
                    const key = `${selectedRecipe.id}-ing-${idx}`;
                    const isChecked = checkedIngredients[key];

                    return (
                      <li
                        key={idx}
                        onClick={() => toggleIngredientCheck(key)}
                        className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors cursor-pointer text-sm ${
                          isChecked 
                            ? 'bg-amber-100/50 text-[#8c786a] line-through' 
                            : 'hover:bg-white bg-white/60 border border-[#f0e8df] text-[#3b2b22]'
                        }`}
                      >
                        {/* Right Column (העמודה הימנית): Amount */}
                        <span className="font-bold text-xs sm:text-sm text-[#8a4b2a] w-28 shrink-0 text-right dir-rtl font-mono sm:font-sans">
                          {ing.amount}
                        </span>

                        {/* Left Column (העמודה השמאלית): Ingredient Name + Checkbox */}
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                            isChecked ? 'bg-amber-700 border-amber-700 text-white' : 'border-[#d0c2b4] bg-white'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span className="font-medium text-[#3b2b22] leading-snug break-words">{ing.item}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <p className="text-[11px] text-[#9c897b] mt-4 text-center">
                  💡 טיפ: ניתן לסמן פריטים במצרכים בזמן הבישול
                </p>
              </div>

              {/* Instructions Column (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h2 className="text-lg font-bold font-['Frank_Ruhl_Libre'] text-[#3b2b22] mb-4 pb-2 border-b border-[#ebdccf]">
                    אופן ההכנה
                  </h2>

                  <ol className="space-y-4">
                    {selectedRecipe.steps.map((step) => (
                      <li key={step.stepNumber} className="flex items-start gap-3.5 group">
                        <span className="w-7 h-7 rounded-full bg-[#4a382c] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-2xs">
                          {step.stepNumber}
                        </span>
                        <p className="text-sm sm:text-base text-[#3b2b22] leading-relaxed pt-0.5">
                          {step.text}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Secret Tip Card */}
                {selectedRecipe.secretTip && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/80 text-[#523824]">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>הסוד של סבתא / הטיפ למנה</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      {selectedRecipe.secretTip}
                    </p>
                  </div>
                )}

                {/* Grandma Esther's Authentic Humorous Recipe Note Sticky */}
                {selectedRecipe.grandmaVoiceNote && (
                  <div className="relative mt-6 p-5 sm:p-6 rounded-2xl bg-[#fffde8] border-2 border-[#e7dea9] shadow-md text-[#3b2b18] transform -rotate-[0.5deg]">
                    {/* Sticky Note Pin / Washi Tape Graphic */}
                    <div className="absolute -top-3.5 right-6 px-3.5 py-1 bg-[#e08e6d] text-amber-50 text-[11px] font-bold rounded-sm shadow-2xs rotate-1 tracking-wider flex items-center gap-1.5">
                      <span>📌</span>
                      <span>הפתק של סבתא אסתר</span>
                    </div>

                    <div className="pb-2 flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#ebe1af] mb-3 gap-2">
                      <div className="font-bold font-['Frank_Ruhl_Libre'] text-base sm:text-lg text-[#7c3f1d] flex items-center gap-2">
                        <span className="text-xl">😂</span>
                        <span>ככה סבתא אסתר מעבירה מתכונים – בהצלחה!! 😂</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#f5eab5] text-[#6d4611] border border-[#e8dba0] w-fit">
                        אותנטי מילה במילה
                      </span>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl bg-white/80 border border-[#eee4b9] shadow-inner">
                      <p className="text-sm sm:text-base leading-relaxed font-['Assistant'] text-[#3a2818] whitespace-pre-line italic font-medium">
                        "{selectedRecipe.grandmaVoiceNote}"
                      </p>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-xs text-[#8a4b2a]">
                      <span className="font-['Caveat'] text-sm sm:text-base font-bold">
                        — מוקלט באהבה מסבתא אסתר ❤️ בתיאבון!
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Back Button & WhatsApp Share */}
            <div className="p-6 border-t border-[#f0e8de] bg-[#fdfbf9] flex items-center justify-between gap-3 flex-wrap">
              <button
                onClick={() => setSelectedRecipeId(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4a382c] hover:bg-[#34261d] text-white text-sm font-bold shadow-sm transition-all"
              >
                <ArrowRight className="w-4 h-4" />
                <span>חזרה לכל המתכונים</span>
              </button>

              <button
                onClick={() => shareRecipeToWhatsApp(selectedRecipe)}
                className="px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white text-white" />
                <span>שיתוף מתכון זה בווטסאפ 💬</span>
              </button>
            </div>
          </article>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER MAIN GALLERY VIEW (MATCHING THE USER SCREENSHOT!)
  // -------------------------------------------------------------
  return (
    <div className="w-full min-h-screen bg-[#fbf9f6] text-[#2c2420] pb-16">
      {/* 1. TOP HEADER & STORY INTRO */}
      <div className="w-full max-w-3xl mx-auto px-4 pt-8 sm:pt-12 text-center">
        {/* Decorative butterfly */}
        <div className="inline-block text-2xl mb-2 animate-bounce">
          🦋
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Frank_Ruhl_Libre'] text-[#3b2b22] tracking-tight mb-2">
          {bookTitle || 'ספר המתכונים שלנו'}
        </h1>

        <div className="text-base sm:text-lg lg:text-xl font-bold font-['Frank_Ruhl_Libre'] text-[#8a4b2a] mb-5">
          ספר המתכונים והזיכרונות של המשפחה
        </div>

        <div className="bg-white/80 backdrop-blur-xs p-6 sm:p-7 rounded-3xl border border-[#ecdcc7] shadow-xs text-right max-w-2xl mx-auto space-y-3.5 text-sm sm:text-base text-[#4f3e34] leading-relaxed font-['Assistant']">
          <p>
            את הספר הזה ניסיתי לבנות כבר בתקופת הקורונה, בטכנולוגיה שהיום מרגישה כמעט עתיקה. הקורונה הסתיימה לפני שהספר הסתיים, וכל מה שכבר בניתי נמחק.
          </p>
          <p>
            אז מתחילים מחדש, רק שהפעם יש לי קצת עזרה מפלאי הבינה המלאכותית.
          </p>
          <p>
            בסוף כנראה שהרווחנו: הספר יוצא לאור בגרסה דיגיטלית, אפשר להוסיף אליו בקלות מתכונים, תמונות וסיפורים, ולשתף כל מתכון ישירות בווטסאפ.
          </p>
          <p className="font-bold text-[#8a4b2a] pt-1">
            תהנו, תוסיפו, תשתפו ובעיקר תבשלו - כי אין כמו ניחוחות בישול בבית שמעלים זיכרון.
          </p>
          <div className="text-left font-['Frank_Ruhl_Libre'] font-bold text-base sm:text-lg text-[#3b2b22]">
            דלית
          </div>
        </div>

        {/* Expandable Story & Memories Toggle */}
        <div className="mt-5">
          <button
            onClick={() => setIsStoryExpanded(!isStoryExpanded)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#705545] text-xs sm:text-sm font-semibold border border-[#e8dfd5] shadow-2xs hover:shadow-xs hover:bg-[#f7f2ec] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isStoryExpanded ? 'סגירת סיפור המשפחה והשורשים' : 'לקריאת סיפור השורשים והמטבח המשפחתי 📖'}</span>
            {isStoryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsible Story Box */}
        {isStoryExpanded && (
          <div className="mt-6 p-6 sm:p-8 rounded-3xl bg-white border border-[#e8ded3] shadow-sm text-right max-w-3xl mx-auto transition-all animate-fadeIn">
            <h2 className="text-xl font-bold font-['Frank_Ruhl_Libre'] text-[#4a382c] mb-4 pb-2 border-b border-[#f0e6dc] flex items-center justify-between">
              <span>הסיפור שמאחורי המתכונים</span>
              <span className="text-xs text-[#8a4b2a] font-normal">מרוקו • פולין • ונצואלה • אורוגוואי</span>
            </h2>
            <div className="space-y-3.5 text-sm sm:text-base text-[#4f3e34] leading-relaxed font-['Assistant']">
              {FAMILY_STORY.split('\n\n').filter(p => p.trim()).map((para, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. DUAL TOOLBARS: סרגל מתכונים + סרגל נפרד (זכרונות משפחתיים, מועדפים) */}
      <div className="sticky top-14 sm:top-16 z-20 w-full max-w-5xl mx-auto px-3 sm:px-4 mt-6 space-y-2.5">
        {/* סרגל 1: סרגל מתכונים (הכל, סלטים, מאפים, תבשילים, קינוחים, רטבים + חפש/י מתכון + מתכון חדש) */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 shadow-sm border border-[#ede3d7] flex flex-col lg:flex-row items-center justify-between gap-2.5">
          {/* Recipe Categories Tabs */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
            {RECIPE_CATEGORIES.map(tab => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#4a382c] text-white shadow-xs'
                      : 'text-[#6d5b4f] hover:bg-[#f5eee6] hover:text-[#382b22]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Box & Add Recipe Tab */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
            <div className="relative flex-1 sm:w-56 shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="חפש/י מתכון..."
                className="w-full pl-3 pr-9 py-1.5 rounded-full bg-[#fbf9f6] text-xs sm:text-sm text-[#3b2b22] placeholder-[#a69588] border border-[#e8dfd5] focus:outline-none focus:border-[#4a382c] focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-[#a69588] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {onAddRecipe && (
              <button
                onClick={onAddRecipe}
                className="px-3.5 sm:px-4 py-1.5 rounded-full bg-[#8a4b2a] hover:bg-[#723c20] text-amber-50 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 whitespace-nowrap active:scale-95"
                title="הוספת מתכון חדש לספר"
              >
                <Plus className="w-4 h-4 text-amber-200" />
                <span>מתכון חדש</span>
              </button>
            )}
          </div>
        </div>

        {/* סרגל 2: סרגל נפרד (זכרונות משפחתיים) */}
        <div className="bg-[#fcf7f1]/95 backdrop-blur-md rounded-2xl p-2 sm:py-2 sm:px-3 shadow-2xs border border-[#e8ded3] flex items-center justify-between sm:justify-start gap-2.5 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-[#8a4b2a] px-1 hidden sm:inline-block shrink-0">
            אוספים משפחתיים:
          </span>

          {/* זכרונות משפחתיים */}
          <button
            onClick={() => setSelectedCategory(selectedCategory === 'memories' ? 'all' : 'memories')}
            className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 whitespace-nowrap ${
              selectedCategory === 'memories'
                ? 'bg-[#8a4b2a] text-amber-50 shadow-xs ring-1 ring-[#723c20]'
                : 'bg-white text-[#5c4638] hover:bg-[#f3e9de] border border-[#e2d3c3]'
            }`}
          >
            <Camera className="w-4 h-4 text-amber-500" />
            <span>זכרונות משפחתיים</span>
          </button>
        </div>

        {/* Filter count & indicator */}
        <div className="text-xs text-[#8c7b70] px-3 flex items-center justify-between">
          {selectedCategory === 'memories' ? (
            <span className="font-semibold text-[#8a4b2a]">זכרונות משפחתיים • גלריית תמונות ומתכונים עם סיפור</span>
          ) : (
            <span>נמצאו {filteredRecipes.length} מתכונים</span>
          )}
          {selectedCategory !== 'all' && (
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="text-[#8a4b2a] hover:underline font-medium"
            >
              הצגת כל המתכונים
            </button>
          )}
        </div>
      </div>

      {/* 3. RECIPES GRID OR MEMORIES VIEW (PHOTO GALLERY + MEMORIES) */}
      {selectedCategory === 'memories' ? (
        <div className="mt-4 space-y-8">
          {/* Family Photo Gallery */}
          <FamilyPhotoGallery onBackToRecipes={() => setSelectedCategory('all')} />

          {/* Recipes with Family Memories */}
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-6 pt-4 border-t border-[#ebdcd0]">
              <h3 className="text-lg sm:text-xl font-bold font-['Frank_Ruhl_Libre'] text-[#4a382c]">
                מתכונים עם זיכרונות וסיפורים משפחתיים
              </h3>
              <p className="text-xs sm:text-sm text-[#8c7b70] mt-1">
                מגוון מתכונים ששזורים בהם סיפורים, אנקדוטות וטעמי ילדות
              </p>
            </div>

            {filteredRecipes.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#ede3d7] max-w-md mx-auto text-sm text-[#7a6454]">
                לא נמצאו מתכונים שתואמים לחיפוש
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {filteredRecipes.map((recipe) => {
                  const imageUrl = getCanonicalImageUrl(recipe);

                  return (
                    <div
                      key={recipe.id}
                      onClick={() => setSelectedRecipeId(recipe.id)}
                      className="bg-white rounded-3xl overflow-hidden border border-[#ede3d7] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
                    >
                      {/* Top Image Box */}
                      <div className="relative w-full aspect-[4/3] bg-[#f0eae1] overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={recipe.imageAlt || recipe.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Category Capsule Tag Floating Top-Left */}
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-bold text-[#4a382c] shadow-xs border border-white/40">
                            {CATEGORY_DISPLAY_NAMES[recipe.category] || recipe.category}
                          </span>
                        </div>

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(recipe.id);
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                            recipe.isFavorite
                              ? 'bg-rose-500 text-white shadow-md'
                              : 'bg-black/30 hover:bg-black/50 text-white'
                          }`}
                          title={recipe.isFavorite ? "הסרה ממועדפים" : "הוספה למועדפים"}
                        >
                          <Heart className={`w-4 h-4 ${recipe.isFavorite ? 'fill-white' : ''}`} />
                        </button>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between text-right">
                        <div>
                          <div className="flex items-center justify-between text-xs text-[#8c7b70] mb-2">
                            <span className="font-semibold text-[#8a4b2a]">מאת {recipe.contributor}</span>
                            <span className="flex items-center gap-1">
                              <ChefHat className="w-3.5 h-3.5 text-[#8c7b70]" />
                              <span>{recipe.difficulty}</span>
                            </span>
                          </div>

                          <h3 className="font-['Frank_Ruhl_Libre'] font-bold text-xl sm:text-2xl text-[#3b2b22] group-hover:text-[#8a4b2a] transition-colors leading-tight mb-2">
                            {recipe.title}
                          </h3>

                          {recipe.subtitle && (
                            <p className="text-xs sm:text-sm text-[#705545] leading-relaxed line-clamp-2 mb-3">
                              {recipe.subtitle}
                            </p>
                          )}

                          {recipe.familyMemory && (
                            <div className="mt-2 p-3 rounded-2xl bg-[#fdfaf7] border border-[#f0e3d6] text-xs text-[#5c4638] leading-relaxed italic line-clamp-3">
                              "{recipe.familyMemory}"
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#f2ece4] flex items-center justify-between text-xs text-[#8c7b70]">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5 text-[#8a4b2a]" />
                            <span>{recipe.prepTime.split(' ')[0]}</span>
                          </span>
                          <span className="text-[#8a4b2a] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                            למתכון המלא ←
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 mt-6">
        {filteredRecipes.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#ede3d7] max-w-md mx-auto shadow-xs">
            <div className="text-4xl mb-3">
              {selectedCategory === 'favorites' ? '❤️' : '🍲'}
            </div>
            <h3 className="text-lg font-bold text-[#4a382c] mb-1">
              {selectedCategory === 'favorites' ? 'אין עדיין מתכונים מועדפים' : 'לא נמצאו מתכונים מתאימים'}
            </h3>
            <p className="text-xs sm:text-sm text-[#8c7b70] mb-4">
              {selectedCategory === 'favorites'
                ? 'לחצו על סמל הלב בכל כרטיס מתכון שתרצו לשמור כאן'
                : 'נסו לשנות את מונח החיפוש או לבחור קטגוריה אחרת'}
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-full bg-[#4a382c] text-white text-xs font-semibold hover:bg-[#382b22] transition-colors"
            >
              הצגת כל המתכונים
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredRecipes.map((recipe) => {
              const imageUrl = getCanonicalImageUrl(recipe);

              return (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipeId(recipe.id)}
                  className="bg-white rounded-3xl overflow-hidden border border-[#ede3d7] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
                >
                  {/* Top Image Box */}
                  <div className="relative w-full aspect-[4/3] bg-[#f0eae1] overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={recipe.imageAlt || recipe.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Category Capsule Tag Floating Top-Left */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-bold text-[#4a382c] shadow-xs border border-white/40">
                        {CATEGORY_DISPLAY_NAMES[recipe.category] || recipe.category}
                      </span>
                    </div>

                    {/* Contributor badge top-right */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-xs text-[11px] font-medium text-white shadow-xs flex items-center gap-1">
                        <ChefHat className="w-3 h-3 text-amber-300" />
                        <span>{recipe.contributor}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-bold font-['Frank_Ruhl_Libre'] text-[#3b2b22] group-hover:text-[#8a4b2a] transition-colors leading-snug line-clamp-1">
                        {recipe.title}
                      </h3>

                      {/* Subtitle / Teaser */}
                      {recipe.subtitle && (
                        <p className="text-xs sm:text-sm text-[#786b62] leading-relaxed mt-1.5 line-clamp-2 font-['Assistant']">
                          {recipe.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Card Meta & Favorite Heart Row */}
                    <div className="pt-3.5 mt-3 border-t border-[#f5ede4] flex items-center justify-between text-xs text-[#8c7b70]">
                      {/* Left: WhatsApp & Favorite Actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            shareRecipeToWhatsApp(recipe);
                          }}
                          className="px-2.5 py-1 rounded-full bg-[#e8f7ee] hover:bg-[#d4f2de] text-[#128c7e] font-bold flex items-center gap-1 transition-colors text-[11px] border border-emerald-200/60 shadow-2xs active:scale-95"
                          title="שיתוף מתכון זה ישירות בווטסאפ"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-[#25D366] text-[#25D366]" />
                          <span>ווטסאפ</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(recipe.id);
                          }}
                          className="p-1.5 rounded-full hover:bg-rose-50 text-[#a89689] hover:text-rose-600 transition-colors"
                          title="שמירה במועדפים"
                        >
                          <Heart className={`w-4 h-4 ${recipe.isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
                        </button>
                      </div>

                      {/* Right: Prep Time & Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        {recipe.grandmaVoiceNote && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100/90 text-amber-950 text-[10px] font-bold border border-amber-300/80 flex items-center gap-1 shadow-2xs" title="כולל פתק מקורי מסבתא אסתר">
                            <span>📝</span>
                            <span>פתק סבתא 😂</span>
                          </span>
                        )}
                        {recipe.videoUrl && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100/70 text-amber-900 text-[10px] font-bold">
                            🎬 סרטון
                          </span>
                        )}
                        {recipe.familyMemory && (
                          <span className="px-2 py-0.5 rounded-md bg-orange-100/70 text-[#7a4c28] text-[10px] font-bold">
                            💭 זיכרון
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#8a4b2a]" />
                          <span>{recipe.prepTime.split(' ')[0]}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}
    </div>
  );
};
