/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Recipe, BookThemeId } from './types';
import { INITIAL_RECIPES, BOOK_THEMES, CANONICAL_RECIPE_IMAGES } from './data/recipes';
import { BookView } from './components/BookView';
import { BookCoverPage } from './components/BookCoverPage';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { TableOfContentsModal } from './components/TableOfContentsModal';
import { AddRecipeModal } from './components/AddRecipeModal';
import { EditRecipeModal } from './components/EditRecipeModal';
import { CookingModeModal } from './components/CookingModeModal';
import { ShareModal } from './components/ShareModal';
import { BookIntroModal } from './components/BookIntroModal';
import { MobileLinkModal } from './components/MobileLinkModal';
import { CleanGalleryView } from './components/CleanGalleryView';
import { saveCustomImage, loadCustomImagesMap } from './utils/storage';
import { 
  BookOpen, 
  Palette, 
  Plus, 
  Share2, 
  Search, 
  Sparkles, 
  Printer, 
  Heart, 
  RotateCcw,
  Edit2,
  Check,
  Smartphone,
  LayoutGrid,
  Camera
} from 'lucide-react';
import { LaurelBranch } from './components/DecorativeIcons';

const STORAGE_RECIPES_KEY = 'family_recipe_book_recipes_v13_focaccia_cakes_salads';
const STORAGE_THEME_KEY = 'family_recipe_book_theme_v13';
const STORAGE_TITLE_KEY = 'family_recipe_book_title_v13';
const STORAGE_VIEW_FORMAT_KEY = 'family_recipe_book_view_format_v1';

const DEMO_RECIPES_TO_PURGE = new Set([
  'flan-caramel',
  'farmers-rustic-salad',
  'bean-and-potato-salad',
  'beef-chestnut-stew',
  'pkaila-traditional',
  'chocolate-babka',
  'moroccan-fish-shabbat',
  'armuronia-chicken-kippur',
  'almond-pudding-malabi'
]);

export default function App() {
  // Load initial state ensuring only user-uploaded recipes exist and canonical images are hydrated
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_RECIPES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out demo recipes
          const cleaned = parsed.filter((r: Recipe) => !DEMO_RECIPES_TO_PURGE.has(r.id));
          if (cleaned.length > 0) {
            // Make sure any newly added user initial recipes exist
            const existingIds = new Set(cleaned.map((r: Recipe) => r.id));
            const missing = INITIAL_RECIPES.filter(r => !existingIds.has(r.id));
            const combined = [...cleaned, ...missing];
            return combined.map((r: Recipe) => {
              const canonical = CANONICAL_RECIPE_IMAGES[r.id];
              const initial = INITIAL_RECIPES.find(init => init.id === r.id);
              let updated = { ...r };
              if (initial && initial.grandmaVoiceNote) {
                updated.grandmaVoiceNote = initial.grandmaVoiceNote;
              }
              if (canonical && (!r.imageUrl || !r.imageUrl.startsWith('data:') || r.imageUrl.startsWith('/images/') || r.imageUrl.startsWith('/src/assets') || r.imageUrl.includes('localhost'))) {
                updated.imageUrl = canonical;
              }
              return updated;
            });
          }
        }
      }
    } catch (e) {
      console.error('Error loading saved recipes', e);
    }
    return INITIAL_RECIPES;
  });

  const [currentThemeId, setCurrentThemeId] = useState<BookThemeId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY) as BookThemeId;
      if (saved && ['illustrated', 'notebook', 'rustic', 'heritage'].includes(saved)) {
        return saved;
      }
    } catch (e) {}
    return 'illustrated';
  });

  const [familyBookTitle, setFamilyBookTitle] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TITLE_KEY);
      if (saved && saved !== 'ספר המתכונים של משפחתנו' && saved !== 'ספר המתכונים המשפחתי') {
        return saved;
      }
    } catch (e) {}
    return 'ספר המתכונים שלנו';
  });

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  // Selected Recipe ID for detail view in the clean gallery
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [mainCategory, setMainCategory] = useState<string>('all');
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);

  // Modals state
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isTocModalOpen, setIsTocModalOpen] = useState(false);
  const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isCookingModeOpen, setIsCookingModeOpen] = useState(false);
  const [shareRecipe, setShareRecipe] = useState<Recipe | null>(null);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
  const [isMobileLinkModalOpen, setIsMobileLinkModalOpen] = useState(false);

  // Restore any user-uploaded custom images from durable IndexedDB storage
  useEffect(() => {
    loadCustomImagesMap().then(map => {
      if (map && Object.keys(map).length > 0) {
        setRecipes(prev => prev.map(r => map[r.id] ? { ...r, imageUrl: map[r.id] } : r));
      }
    });
  }, []);

  // Clean old storage keys and purge unrequested recipes
  useEffect(() => {
    ['family_recipe_book_recipes_v1', 'family_recipe_book_recipes_v2', 'family_recipe_book_recipes_v3', 'family_recipe_book_recipes_v4'].forEach(k => {
      try { localStorage.removeItem(k); } catch (e) {}
    });

    setRecipes(prev => {
      const filtered = prev.filter(r => !DEMO_RECIPES_TO_PURGE.has(r.id));
      const existingIds = new Set(filtered.map(r => r.id));
      const missing = INITIAL_RECIPES.filter(r => !existingIds.has(r.id));
      return [...filtered, ...missing].map(r => {
        const canonical = CANONICAL_RECIPE_IMAGES[r.id];
        const initial = INITIAL_RECIPES.find(init => init.id === r.id);
        let updated = { ...r };
        if (initial && initial.grandmaVoiceNote) {
          updated.grandmaVoiceNote = initial.grandmaVoiceNote;
        }
        if (canonical && (!r.imageUrl || !r.imageUrl.startsWith('data:') || r.imageUrl.startsWith('/images/') || r.imageUrl.startsWith('/src/assets') || r.imageUrl.includes('localhost'))) {
          updated.imageUrl = canonical;
        }
        return updated;
      });
    });
  }, []);

  // Persist recipes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_RECIPES_KEY, JSON.stringify(recipes));
    } catch (e) {
      console.error('Failed to persist recipes', e);
    }
  }, [recipes]);

  // Persist theme
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_THEME_KEY, currentThemeId);
    } catch (e) {}
  }, [currentThemeId]);

  // Persist title
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TITLE_KEY, familyBookTitle);
    } catch (e) {}
  }, [familyBookTitle]);

  // Current active theme object
  const currentTheme = BOOK_THEMES.find(t => t.id === currentThemeId) || BOOK_THEMES[0];

  // Current active recipe (fallback to first recipe if on cover)
  const currentRecipe = currentRecipeIndex >= 0 
    ? (recipes[currentRecipeIndex] || recipes[0])
    : recipes[0];

  // Page turning handlers: support -1 (Cover & Table of Contents)
  const handleNextPage = () => {
    if (currentRecipeIndex === -1) {
      setCurrentRecipeIndex(0);
    } else if (currentRecipeIndex < recipes.length - 1) {
      setCurrentRecipeIndex(i => i + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentRecipeIndex === 0) {
      setCurrentRecipeIndex(-1);
    } else if (currentRecipeIndex > 0) {
      setCurrentRecipeIndex(i => i - 1);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r));
  };

  const handleAddNewRecipe = async (newRecipe: Recipe) => {
    if (newRecipe.imageUrl && (newRecipe.imageUrl.startsWith('data:') || newRecipe.imageUrl.startsWith('blob:'))) {
      await saveCustomImage(newRecipe.id, newRecipe.imageUrl);
    }
    const updated = [newRecipe, ...recipes];
    setRecipes(updated);
    setCurrentRecipeIndex(0); // Jump directly to the newly added recipe
  };

  const handleSaveRecipe = async (updatedRecipe: Recipe) => {
    if (updatedRecipe.imageUrl && (updatedRecipe.imageUrl.startsWith('data:') || updatedRecipe.imageUrl.startsWith('blob:'))) {
      await saveCustomImage(updatedRecipe.id, updatedRecipe.imageUrl);
    }
    setRecipes(prev => prev.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
  };

  const handleUpdateRecipeImage = async (recipeId: string, newImageUrl: string) => {
    await saveCustomImage(recipeId, newImageUrl);
    setRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, imageUrl: newImageUrl } : r));
  };

  const handleDeleteRecipe = (id: string) => {
    setRecipes(prev => {
      const remaining = prev.filter(r => r.id !== id);
      return remaining.length > 0 ? remaining : INITIAL_RECIPES;
    });
    setCurrentRecipeIndex(0);
    setEditingRecipe(null);
  };

  const handleImportRecipes = (imported: Recipe[]) => {
    setRecipes(imported);
    setCurrentRecipeIndex(0);
  };

  const handleResetDefaults = () => {
    if (confirm('האם לאפס את הספר למתכוני הבסיס המקוריים? (המתכונים שנוספו יימחקו)')) {
      setRecipes(INITIAL_RECIPES);
      setCurrentRecipeIndex(0);
      localStorage.removeItem(STORAGE_RECIPES_KEY);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#241c18] text-[#f4eee5] flex flex-col justify-between selection:bg-[#8a4b2a] selection:text-white" dir="rtl">
      
      {/* ---------------- TOP VINTAGE WOODEN COOKBOOK APP BAR ---------------- */}
      <header className="sticky top-0 z-40 bg-[#2d1f18]/95 backdrop-blur-md border-b border-[#4d3528] shadow-md px-2 sm:px-6 py-2 no-print max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
          
          {/* Family Book Title */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            <button
              onClick={() => setCurrentRecipeIndex(-1)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8a4b2a] hover:bg-[#9e542d] flex items-center justify-center text-amber-100 shadow-xs border border-amber-900/50 shrink-0 transition-colors"
              title="לשער הספר ולתוכן העניינים"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="min-w-0">
              {isEditingTitle ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={familyBookTitle}
                    onChange={e => setFamilyBookTitle(e.target.value)}
                    className="px-2 py-0.5 rounded bg-black/40 text-amber-200 border border-[#8a4b2a] text-xs sm:text-sm font-bold focus:outline-none max-w-[120px] sm:max-w-none"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsEditingTitle(false)}
                    className="p-1 rounded bg-[#8a4b2a] text-white"
                  >
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
                  <h1 className="font-bold text-xs sm:text-lg font-['Frank_Ruhl_Libre'] text-amber-100 group-hover:text-amber-300 transition-colors truncate max-w-[120px] xs:max-w-[170px] sm:max-w-none">
                    {familyBookTitle}
                  </h1>
                  <Edit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#8a4b2a] group-hover:text-amber-300 transition-colors opacity-60 group-hover:opacity-100 shrink-0" />
                </div>
              )}
              <div className="text-[10px] sm:text-[11px] text-[#a88a75] hidden sm:block">
                מהדורה דיגיטלית חמה ומאוירת • {recipes.length} מתכונים משפחתיים
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile Link & QR Button */}
            <button
              onClick={() => setIsMobileLinkModalOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#39261c] hover:bg-[#4d3427] text-amber-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors border border-[#5a3c2c]"
              title="קישור לספר וסריקת QR"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">קישור לספר</span>
            </button>

            {/* Table of Contents Search Button */}
            <button
              onClick={() => setIsTocModalOpen(true)}
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-[#422c20] hover:bg-[#573b2c] text-amber-200 text-xs sm:text-sm font-semibold flex items-center gap-1 transition-colors border border-[#5a3c2c]"
              title="חיפוש מתכון ורשימת מתכונים"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span className="hidden sm:inline">חיפוש</span>
            </button>

            {/* Add Recipe Button */}
            <button
              onClick={() => setIsAddRecipeModalOpen(true)}
              className="px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-xl bg-[#8a4b2a] hover:bg-[#9e542d] text-amber-50 text-xs sm:text-sm font-bold flex items-center gap-1 transition-colors shadow-md active:scale-95 shrink-0"
              title="הוספת מתכון חדש"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>מתכון חדש</span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- MAIN RECIPE GALLERY AREA ---------------- */}
      <CleanGalleryView
        recipes={recipes}
        bookTitle={familyBookTitle}
        selectedRecipeId={selectedRecipeId}
        onSelectRecipeId={setSelectedRecipeId}
        activeCategory={mainCategory}
        onCategoryChange={setMainCategory}
        onToggleFavorite={handleToggleFavorite}
        onOpenShare={(rec) => setShareRecipe(rec)}
        onEditRecipe={(rec) => setEditingRecipe(rec)}
        onAddRecipe={() => setIsAddRecipeModalOpen(true)}
      />

      {/* ---------------- BOTTOM FOOTER ---------------- */}
      <footer className="py-4 px-4 border-t border-[#3b271d] bg-[#1c1512] text-center text-xs text-[#826a5b] no-print">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>ספר המתכונים שלנו</span>
            <span>•</span>
            <span>נבנה לשיתוף ושימור הזיכרונות של הבית</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="hover:text-amber-300 transition-colors"
            >
              החלפת סגנון עיצוב
            </button>
            <span>•</span>
            <button
              onClick={() => handlePrint()}
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              הדפסה כספר
            </button>
            <span>•</span>
            <button
              onClick={handleResetDefaults}
              className="hover:text-rose-400 transition-colors flex items-center gap-1"
              title="שחזור מתכוני ברירת מחדל"
            >
              <RotateCcw className="w-3 h-3" />
              איפוס ספר
            </button>
          </div>
        </div>
      </footer>

      {/* ---------------- MODALS & DIALOGS ---------------- */}

      {/* Theme Selector Modal */}
      {isThemeModalOpen && (
        <ThemeSelectorModal
          currentThemeId={currentThemeId}
          onSelectTheme={(themeId) => {
            setCurrentThemeId(themeId);
          }}
          onClose={() => setIsThemeModalOpen(false)}
        />
      )}

      {/* Table Of Contents Modal */}
      {isTocModalOpen && (
        <TableOfContentsModal
          recipes={recipes}
          currentIndex={currentRecipeIndex}
          onSelectRecipe={(idx) => {
            setCurrentRecipeIndex(idx);
            if (recipes[idx]) {
              setSelectedRecipeId(recipes[idx].id);
              window.scrollTo(0, 0);
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
            }
          }}
          onClose={() => setIsTocModalOpen(false)}
          onOpenBookIntro={() => setIsIntroModalOpen(true)}
        />
      )}

      {/* Book Story & Prologue Modal */}
      {isIntroModalOpen && (
        <BookIntroModal
          onClose={() => setIsIntroModalOpen(false)}
          onOpenTableOfContents={() => setIsTocModalOpen(true)}
        />
      )}

      {/* Mobile Smartphone View & QR Code Modal */}
      {isMobileLinkModalOpen && (
        <MobileLinkModal
          onClose={() => setIsMobileLinkModalOpen(false)}
        />
      )}

      {/* Add Recipe Modal */}
      {isAddRecipeModalOpen && (
        <AddRecipeModal
          onAddRecipe={handleAddNewRecipe}
          onClose={() => setIsAddRecipeModalOpen(false)}
        />
      )}

      {/* Edit Recipe Modal */}
      {editingRecipe && (
        <EditRecipeModal
          recipe={editingRecipe}
          onSaveRecipe={handleSaveRecipe}
          onDeleteRecipe={handleDeleteRecipe}
          onClose={() => setEditingRecipe(null)}
        />
      )}

      {/* Cooking Mode Fullscreen Modal */}
      {isCookingModeOpen && (
        <CookingModeModal
          recipe={currentRecipe}
          onClose={() => setIsCookingModeOpen(false)}
        />
      )}

      {/* Share Modal */}
      {shareRecipe && (
        <ShareModal
          recipe={shareRecipe}
          allRecipes={recipes}
          onClose={() => setShareRecipe(null)}
          onPrint={handlePrint}
          onImportRecipes={handleImportRecipes}
        />
      )}

      {/* ---------------- PRINT LAYOUT (Visible only when user prints) ---------------- */}
      <div className="hidden print:block text-black bg-white p-8" dir="rtl">
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold font-['Frank_Ruhl_Libre']">{currentRecipe.title}</h1>
          <p className="text-sm italic text-zinc-600">{currentRecipe.subtitle}</p>
          <div className="text-xs font-bold text-amber-800 mt-1">{currentRecipe.contributor}</div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-base border-b mb-2">מצרכים:</h3>
            <ul className="text-sm space-y-1">
              {currentRecipe.ingredients.map((ing, i) => (
                <li key={i} className="flex justify-between">
                  <span>{ing.item}</span>
                  <span className="font-bold">{ing.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base border-b mb-2">אופן ההכנה:</h3>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              {currentRecipe.steps.map((st, i) => (
                <li key={i} className="leading-relaxed">{st.text}</li>
              ))}
            </ol>

            {currentRecipe.secretTip && (
              <div className="mt-4 p-3 bg-zinc-100 border border-zinc-300 rounded text-xs">
                <strong>הסוד של סבתא: </strong>
                {currentRecipe.secretTip}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
