import React, { useState } from 'react';
import { Recipe } from '../types';
import { Share2, Copy, Check, Printer, MessageCircle, Download, FileText, X } from 'lucide-react';

interface ShareModalProps {
  recipe: Recipe;
  allRecipes: Recipe[];
  onClose: () => void;
  onPrint: () => void;
  onImportRecipes: (recipes: Recipe[]) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  recipe,
  allRecipes,
  onClose,
  onPrint,
  onImportRecipes
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate formatted WhatsApp message
  const getWhatsAppMessage = () => {
    let msg = `📖 *${recipe.title}*\n`;
    if (recipe.subtitle) msg += `_${recipe.subtitle}_\n`;
    msg += `👩‍🍳 *${recipe.contributor}*\n`;
    msg += `⏱️ הכנה: ${recipe.prepTime} | בישול: ${recipe.cookTime} | ${recipe.servings}\n\n`;
    
    msg += `🛒 *מצרכים:*\n`;
    recipe.ingredients.forEach(ing => {
      msg += `• ${ing.item} — ${ing.amount}\n`;
    });

    msg += `\n🍳 *אופן ההכנה:*\n`;
    recipe.steps.forEach((step, idx) => {
      msg += `${idx + 1}. ${step.text}\n`;
    });

    if (recipe.secretTip) {
      msg += `\n💡 *הטיפ של סבתא:* ${recipe.secretTip}\n`;
    }

    if (recipe.grandmaVoiceNote) {
      msg += `\n📜 *ככה סבתא אסתר מעבירה מתכונים – בהצלחה!! 😂*\n"${recipe.grandmaVoiceNote}"\n`;
    }

    if (recipe.familyMemory) {
      msg += `\n❤️ *זיכרון משפחתי:* ${recipe.familyMemory}\n`;
    }

    msg += `\n📚 נשלח מתוך ספר המתכונים שלנו`;
    return msg;
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(getWhatsAppMessage());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(getWhatsAppMessage());
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (e) {
      console.error('Failed to copy text', e);
    }
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}${window.location.pathname}#recipe-${recipe.id}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error('Failed to copy link', e);
    }
  };

  const handleExportAllJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allRecipes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "family-recipe-book.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onImportRecipes(parsed);
            alert(`יובאו בהצלחה ${parsed.length} מתכונים לספר המשפחתי!`);
            onClose();
          }
        } catch (err) {
          alert('הקובץ אינו קובץ מתכונים תקין');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#faf6ec] text-[#2c2218] rounded-2xl shadow-2xl border-4 border-[#d4c5a9] p-6 sm:p-7"
        dir="rtl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-[#ebdcc0] text-[#5a4332] transition-colors"
          title="סגירה"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-[#ebdcc0] flex items-center justify-center text-[#8a4b2a] shadow-xs">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-['Frank_Ruhl_Libre'] text-[#3b2416]">
              שיתוף מתכון משפחתי
            </h3>
            <p className="text-xs text-[#735946]">
              {recipe.title} • {recipe.contributor}
            </p>
          </div>
        </div>

        {/* Action options */}
        <div className="space-y-3">
          {/* WhatsApp button */}
          <button
            onClick={handleWhatsAppShare}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#1a5b32] font-semibold text-sm transition-all shadow-xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="font-bold">שליחה בוואטסאפ המשפחתי</div>
                <div className="text-xs font-normal opacity-80">שליחת המתכון המלא מעוצב עם מצרכים והטיפ של סבתא</div>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-[#25D366]/20 font-bold">שתף</span>
          </button>

          {/* Copy formatted text */}
          <button
            onClick={handleCopyText}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#ebdcc0]/60 hover:bg-[#ebdcc0] border border-[#d8c3a5] text-[#3d2716] font-medium text-sm transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#8a4b2a] text-white flex items-center justify-center shadow-xs">
                {copiedText ? <Check className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div className="text-right">
                <div className="font-bold">העתקת כל תוכן המתכון</div>
                <div className="text-xs text-[#6d5543]">מוכן להדבקה במייל, הודעות או פתקים</div>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-black/5">
              {copiedText ? 'הועתק!' : 'העתק'}
            </span>
          </button>

          {/* Print / Save as PDF */}
          <button
            onClick={() => {
              onClose();
              setTimeout(onPrint, 300);
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#ebdcc0]/60 hover:bg-[#ebdcc0] border border-[#d8c3a5] text-[#3d2716] font-medium text-sm transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#61412b] text-white flex items-center justify-center shadow-xs">
                <Printer className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="font-bold">הדפסה כדף ספר מעוצב (או שמירה כ-PDF)</div>
                <div className="text-xs text-[#6d5543]">מעוצב בדיוק כמו עמוד מספר בישול פיזי</div>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-black/5">הדפס</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#ebdcc0]/60 hover:bg-[#ebdcc0] border border-[#d8c3a5] text-[#3d2716] font-medium text-sm transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#533f32] text-white flex items-center justify-center shadow-xs">
                {copiedLink ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </div>
              <div className="text-right">
                <div className="font-bold">העתקת קישור למתכון זה</div>
                <div className="text-xs text-[#6d5543]">פתיחה ישירה של המתכון בספר הדיגיטלי</div>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-black/5">
              {copiedLink ? 'הועתק!' : 'העתק קישור'}
            </span>
          </button>
        </div>

        {/* Book export & import section */}
        <div className="mt-6 pt-5 border-t border-[#d8c3a5] flex flex-col gap-2">
          <div className="text-xs font-bold text-[#5c402d] uppercase tracking-wider mb-1">
            גיבוי ושיתוף כל ספר המתכונים המשפחתי:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportAllJSON}
              className="py-2 px-3 rounded-lg bg-[#ebdcc0] hover:bg-[#dfcbb0] text-xs font-semibold text-[#422919] flex items-center justify-center gap-1.5 transition-colors border border-[#cfba9e]"
            >
              <Download className="w-4 h-4" />
              ייצוא קובץ מתכונים (JSON)
            </button>
            <label className="py-2 px-3 rounded-lg bg-[#ebdcc0] hover:bg-[#dfcbb0] text-xs font-semibold text-[#422919] flex items-center justify-center gap-1.5 transition-colors border border-[#cfba9e] cursor-pointer text-center">
              <Share2 className="w-4 h-4" />
              ייבוא מתכונים לספר
              <input 
                type="file" 
                accept=".json" 
                className="hidden" 
                onChange={handleImportJSON} 
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
