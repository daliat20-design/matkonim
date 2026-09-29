import React, { useState } from 'react';
import { Recipe, Ingredient, Step } from '../types';
import { CATEGORIES_CONFIG } from '../data/recipes';
import { X, Plus, Trash2, Image as ImageIcon, Sparkles, Heart } from 'lucide-react';
import { compressImageFile } from '../utils/imageCompressor';
import beefImg from '../assets/images/beef_chestnut_stew_1789736152370.jpg';
import pkailaImg from '../assets/images/pkaila_pot_1789736164009.jpg';
import babkaImg from '../assets/images/chocolate_babka_1789736176829.jpg';
import fishImg from '../assets/images/moroccan_fish_pot_1789736188914.jpg';
import flanImg from '../assets/images/flan_caramel_dessert_1789736968075.jpg';
import choppedLiverImg from '../assets/images/chopped_liver_rustic_1789736990597.jpg';
import kippurChickenImg from '../assets/images/kippur_chicken_pot_1789737001822.jpg';
import candiedPeelsImg from '../assets/images/candied_orange_peels_1789737013635.jpg';
import almondPuddingImg from '../assets/images/almond_pudding_bowl_1789737026517.jpg';
import sukkotKugelImg from '../assets/images/sukkot_kugel_pan_1789737036192.jpg';
import pomeloSaladImg from '../assets/images/pomelo_fresh_salad_1789737046460.jpg';
import farmerSaladImg from '../assets/images/farmer_rustic_salad_1789737057899.jpg';
import beanPotatoSaladImg from '../assets/images/beans_potato_salad_1789737071776.jpg';
import guasacacaImg from '../assets/images/guasacaca_avocado_sauce_1789837881951.jpg';

interface AddRecipeModalProps {
  onAddRecipe: (newRecipe: Recipe) => void;
  onClose: () => void;
}

const DEFAULT_ILLUSTRATIONS = [
  { label: 'רוטב גואסאקאקה אבוקדו', url: guasacacaImg },
  { label: 'כבד קצוץ ובצל', url: choppedLiverImg },
  { label: 'אלמורוניה כנפיים ושקדים', url: kippurChickenImg },
  { label: 'פודינג שקדים ספרדי', url: almondPuddingImg },
  { label: 'סלט פומלה רענן', url: pomeloSaladImg },
  { label: 'פלאן קרמל זהוב', url: flanImg },
  { label: 'קליפות תפוז מסוכרות', url: candiedPeelsImg },
  { label: 'קיגל סוכות מתוק', url: sukkotKugelImg },
  { label: 'סלט איכרים כפרי', url: farmerSaladImg },
  { label: 'סלט שעועית ותפו״א', url: beanPotatoSaladImg }
];

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ onAddRecipe, onClose }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [contributor, setContributor] = useState('המתכון של ');
  const [category, setCategory] = useState<Recipe['category']>('casserole');
  const [prepTime, setPrepTime] = useState('20 דקות');
  const [cookTime, setCookTime] = useState('שעה');
  const [servings, setServings] = useState('6 מנות');
  const [difficulty, setDifficulty] = useState<Recipe['difficulty']>('בינוני');
  const [secretTip, setSecretTip] = useState('');
  const [familyMemory, setFamilyMemory] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>(beefImg);
  const [customImageUrl, setCustomImageUrl] = useState('');

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { item: '', amount: '', icon: '🧂' }
  ]);

  const [steps, setSteps] = useState<Step[]>([
    { stepNumber: 1, text: '', note: '' }
  ]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { item: '', amount: '', icon: '🥄' }]);
  };

  const handleRemoveIngredient = (idx: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== idx));
    }
  };

  const handleUpdateIngredient = (idx: number, field: keyof Ingredient, val: string) => {
    const updated = [...ingredients];
    updated[idx] = { ...updated[idx], [field]: val };
    setIngredients(updated);
  };

  const handleAddStep = () => {
    setSteps([...steps, { stepNumber: steps.length + 1, text: '', note: '' }]);
  };

  const handleRemoveStep = (idx: number) => {
    if (steps.length > 1) {
      const filtered = steps.filter((_, i) => i !== idx);
      const renumbered = filtered.map((s, i) => ({ ...s, stepNumber: i + 1 }));
      setSteps(renumbered);
    }
  };

  const handleUpdateStep = (idx: number, text: string) => {
    const updated = [...steps];
    updated[idx] = { ...updated[idx], text };
    setSteps(updated);
  };

  const handleCustomImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const compressed = await compressImageFile(e.target.files[0]);
        setSelectedImage(compressed);
      } catch (err) {
        console.error('Failed to compress image', err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('נא להזין שם למתכון');
      return;
    }

    const validIngredients = ingredients.filter(i => i.item.trim());
    if (validIngredients.length === 0) {
      alert('נא להזין לפחות מצרך אחד');
      return;
    }

    const validSteps = steps.filter(s => s.text.trim());
    if (validSteps.length === 0) {
      alert('נא להזין לפחות שלב הכנה אחד');
      return;
    }

    const newRecipe: Recipe = {
      id: `recipe-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      contributor: contributor.trim() || 'מתכון משפחתי',
      category,
      prepTime,
      cookTime,
      servings,
      difficulty,
      ingredients: validIngredients,
      steps: validSteps,
      secretTip: secretTip.trim(),
      familyMemory: familyMemory.trim(),
      imageUrl: customImageUrl.trim() || selectedImage,
      isFavorite: true
    };

    onAddRecipe(newRecipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#faf6ec] text-[#2c2218] rounded-2xl shadow-2xl border-4 border-[#d4c5a9] p-5 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-[#ebdcc0] text-[#5a4332] transition-colors"
          title="סגירה"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebdcc0] text-[#8a4b2a] text-xs font-bold mb-2">
            <Heart className="w-3.5 h-3.5 fill-[#8a4b2a]" />
            הוספת מתכון משפחתי חדש
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Frank_Ruhl_Libre'] text-[#3b2416]">
            לשמור את הטעמים של הבית לעד
          </h2>
          <p className="text-xs sm:text-sm text-[#735946]">
            המתכון יישמר בספר הדיגיטלי עם העיצוב המאויר, הפתקית של סבתא והדפדוף
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5a3e2b] mb-1">שם המנה / התבשיל *</label>
              <input
                type="text"
                required
                placeholder="למשל: סיר קציצות עם אפונה וארטישוק"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/80 border border-[#d8c3a5] text-sm focus:ring-2 focus:ring-[#8a4b2a] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5a3e2b] mb-1">של מי המתכון? (יוצר/ת המתכון) *</label>
              <input
                type="text"
                required
                placeholder="המתכון של סבתא רחל / אמא / דוד יוסי"
                value={contributor}
                onChange={e => setContributor(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/80 border border-[#d8c3a5] text-sm focus:ring-2 focus:ring-[#8a4b2a] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5a3e2b] mb-1">תיאור קצר או כותרת משנה</label>
            <input
              type="text"
              placeholder="קציצות רכות ברוטב צהבהב עם לימון ועשבי תיבול טריים"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/80 border border-[#d8c3a5] text-sm focus:ring-2 focus:ring-[#8a4b2a] focus:outline-none"
            />
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f2e7d3] p-3 rounded-xl border border-[#dfceb4]">
            <div>
              <label className="block text-[11px] font-bold text-[#644733] mb-1">קטגוריה</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-2 py-1.5 rounded-lg bg-white/90 border border-[#d8c3a5] text-xs"
              >
                {CATEGORIES_CONFIG.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#644733] mb-1">זמן הכנה</label>
              <input
                type="text"
                value={prepTime}
                onChange={e => setPrepTime(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg bg-white/90 border border-[#d8c3a5] text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#644733] mb-1">זמן בישול/אפייה</label>
              <input
                type="text"
                value={cookTime}
                onChange={e => setCookTime(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg bg-white/90 border border-[#d8c3a5] text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#644733] mb-1">כמות סועדים</label>
              <input
                type="text"
                value={servings}
                onChange={e => setServings(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg bg-white/90 border border-[#d8c3a5] text-xs"
              />
            </div>
          </div>

          {/* Illustration Selection */}
          <div>
            <label className="block text-xs font-bold text-[#5a3e2b] mb-2 flex items-center justify-between">
              <span>איור או תמונה למתכון (בסגנון ספר מודפס):</span>
              <span className="text-[11px] font-normal text-[#806450]">ניתן גם להעלות תמונה משפחתית</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {DEFAULT_ILLUSTRATIONS.map((ill, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedImage(ill.url);
                    setCustomImageUrl('');
                  }}
                  className={`p-1.5 rounded-xl cursor-pointer border-2 transition-all text-center ${
                    selectedImage === ill.url && !customImageUrl
                      ? 'border-[#8a4b2a] bg-[#ebd8be] shadow-xs'
                      : 'border-[#dfd0b7] hover:border-[#bda586] bg-white/50'
                  }`}
                >
                  <img src={ill.url} alt={ill.label} referrerPolicy="no-referrer" className="w-full h-16 object-cover rounded-lg mb-1" />
                  <span className="text-[11px] font-medium text-[#463122] block truncate">{ill.label}</span>
                </div>
              ))}
            </div>

            {/* Custom image upload or URL */}
            <div className="flex items-center gap-3">
              <label className="py-2 px-3 rounded-lg bg-[#ebdcc0] hover:bg-[#decaad] text-xs font-bold text-[#523926] cursor-pointer flex items-center gap-1.5 border border-[#cbb497]">
                <ImageIcon className="w-3.5 h-3.5" />
                העלאת תמונה מהטלפון / מחשב
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleCustomImageUpload} 
                />
              </label>
              <input
                type="url"
                placeholder="או הדביקו כתובת תמונה ברשת (URL)..."
                value={customImageUrl}
                onChange={e => setCustomImageUrl(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-white/80 border border-[#d8c3a5] text-xs"
              />
            </div>
          </div>

          {/* Ingredients list */}
          <div className="bg-[#f7efe1] p-4 rounded-xl border border-[#ded0b8]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#5a3e2b]">רשימת מצרכים:</span>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="px-2.5 py-1 rounded-lg bg-[#ebdcc0] hover:bg-[#dfcbb0] text-[#553b28] text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                הוסף מצרך
              </button>
            </div>

            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="שם המצרך (למשל: בשר בקר)"
                    value={ing.item}
                    onChange={e => handleUpdateIngredient(idx, 'item', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#d8c3a5] text-xs"
                  />
                  <input
                    type="text"
                    placeholder="כמות (למשל: 1 ק״ג)"
                    value={ing.amount}
                    onChange={e => handleUpdateIngredient(idx, 'amount', e.target.value)}
                    className="w-32 px-3 py-1.5 rounded-lg bg-white border border-[#d8c3a5] text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Steps list */}
          <div className="bg-[#f7efe1] p-4 rounded-xl border border-[#ded0b8]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#5a3e2b]">שלבי ההכנה:</span>
              <button
                type="button"
                onClick={handleAddStep}
                className="px-2.5 py-1 rounded-lg bg-[#ebdcc0] hover:bg-[#dfcbb0] text-[#553b28] text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                הוסף שלב
              </button>
            </div>

            <div className="space-y-2">
              {steps.map((st, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#ebdcc0] text-[#8a4b2a] flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                    {idx + 1}
                  </span>
                  <textarea
                    rows={2}
                    placeholder={`שלב ${idx + 1}...`}
                    value={st.text}
                    onChange={e => handleUpdateStep(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#d8c3a5] text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 transition-colors mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Grandma's secret tip & Memory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#fff7d6] border border-[#e3d088]">
              <label className="block text-xs font-bold text-[#644b1c] mb-1">
                💡 הטיפ הסודי של סבתא (יוצג כפתקית וואשי טייפ)
              </label>
              <textarea
                rows={2}
                placeholder="למשל: לתת לרוטב לנוח רבע שעה לפני ההגשה כדי שהבשר יתרכך..."
                value={secretTip}
                onChange={e => setSecretTip(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white/90 border border-[#e0cb79] text-xs"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#faeee5] border border-[#ddbfb0]">
              <label className="block text-xs font-bold text-[#683f2d] mb-1">
                ❤️ זיכרון משפחתי או סיפור מאחורי המנה
              </label>
              <textarea
                rows={2}
                placeholder="המנה שתמיד הוגשה בערב פסח כשכל הדודים התאספו בסלון..."
                value={familyMemory}
                onChange={e => setFamilyMemory(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white/90 border border-[#d8b8a7] text-xs"
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-3 border-t border-[#dfceb4] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#ede2cf] text-[#5c402d] text-sm font-semibold hover:bg-[#e2d2bb]"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl bg-[#8a4b2a] hover:bg-[#723b1f] text-amber-50 font-bold text-sm shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              שמור מתכון לספר המשפחתי
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
