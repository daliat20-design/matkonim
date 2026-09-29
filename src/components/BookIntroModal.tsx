import React, { useState } from 'react';
import { X, BookOpen, Edit3, Check, RotateCcw, Heart, Sparkles } from 'lucide-react';
import { LaurelBranch, OliveSprig, HeartDoodle } from './DecorativeIcons';

const DEFAULT_INTRO_TEXT = `יש משפחות שמספרות את הסיפור שלהן דרך תמונות, מכתבים וזיכרונות. אצלנו, כנראה שאפשר לספר חלק לא קטן מהסיפור גם דרך האוכל.

בספר הזה נפגשים מרוקו, פולין, ונצואלה ואורוגוואי ועוד... עם השפעות שעברו ממטבח למטבח, מדור לדור ומארץ לארץ. סוג של קיבוץ גלויות משפחתי, שמספר לא רק מה אכלנו, אלא גם מאיפה באנו ואיך כל המקומות האלה נכנסו בסוף למטבח אחד.

כפי שכולם יודעים, סבתא אסתר נולדה במרוקו, אבל הגפילטע פיש שלה, הוא בהחלט תחרות לכל פולניה תורנית (אולי בגלל זה סבתא לאה לא אהבה אותה ?... - חחח).אז,  מרוקאי זה לא -  אבל אצלנו כנראה שהגבולות במטבח אף פעם לא היו מאוד קשיחים.

יש כאן מתכון של סבא יצחק, שעלה לארץ עם סבתא מרי - אחרי שכל הילדים החליטו להפריח את השממה ולחסום את הסורים על הגדרות (כל הכבוד סבתא אסתר על הנחישות בקיבוץ דן) הוא היה מכין לנו סוכריות מקליפות תפוז. יש פה מתכונים בהשראתה של סבתא לאה הפולנייה, עם המאכלים האשכנזיים שלה, והחסכנות הידועה! ידעתם שלא צריך להשתמש במפית שלמה, גם רבע מספיק ?

ג'וליאנה מביאה איתה ניחוחות מאורוגוואי, עם נגיעה איטלקית, כך שגם שם הגבולות הגיאוגרפיים לא ממש מחזיקים מעמד. יש פה, מתכונים שלי (דלית) בעיקר מהרשת, אבל הם כבר אומצו על ידי המשפחה - אז מעכשיו הם שלנו !

את רוב המתכונים סבתא אסתר הכתיבה או כתבה בדיוק כמו שמבשלים אצלנו במשפחה: קצת מזה, קצת מזה, לפי העין, לפי הטעם, ואז פתאום: "אההה, שכחתי להגיד שמוסיפים גם..." הכי פולני שלה... חחח

למזלנו, הבינה המלאכותית הצליחה להבין גם את הכמויות שלא נאמרו, גם את מה שנשכח באמצע, וגם את המשפטים שהתחילו במתכון אחד והסתיימו באחר.

כך נולד הספר הזה – אוסף של טעמים, אנשים, מקומות, סיפורים וזיכרונות קטנים שעברו איתנו לאורך השנים. בתיאבון! ❤️`;

const INTRO_STORAGE_KEY = 'family_book_intro_text_v2';

interface BookIntroModalProps {
  onClose: () => void;
  onOpenTableOfContents?: () => void;
}

export const BookIntroModal: React.FC<BookIntroModalProps> = ({ onClose, onOpenTableOfContents }) => {
  const [introText, setIntroText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(INTRO_STORAGE_KEY);
      if (saved && saved.trim().length > 50) return saved;
    } catch (e) {}
    return DEFAULT_INTRO_TEXT;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(introText);

  const handleSave = () => {
    setIntroText(editText);
    setIsEditing(false);
    try {
      localStorage.setItem(INTRO_STORAGE_KEY, editText);
    } catch (e) {}
  };

  const handleReset = () => {
    if (window.confirm('האם להחזיר את נוסח הפתיח המקורי של המשפחה?')) {
      setIntroText(DEFAULT_INTRO_TEXT);
      setEditText(DEFAULT_INTRO_TEXT);
      setIsEditing(false);
      try {
        localStorage.setItem(INTRO_STORAGE_KEY, DEFAULT_INTRO_TEXT);
      } catch (e) {}
    }
  };

  // Split text into paragraphs
  const paragraphs = introText.split('\n\n').filter(p => p.trim().length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] bg-[#faf5eb] text-[#2f2219] rounded-2xl sm:rounded-3xl shadow-2xl border-4 sm:border-8 border-[#3f271c] flex flex-col overflow-hidden"
        dir="rtl"
      >
        {/* Top Header Bar */}
        <div className="bg-[#ebdcc0] px-5 py-3.5 border-b border-[#d8c3a5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#8a4b2a] flex items-center justify-center text-amber-100 shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-['Frank_Ruhl_Libre'] text-[#3b2416]">
                פתיח לספר: הסיפור של המשפחה שלנו
              </h2>
              <p className="text-[11px] text-[#78553e]">
                על המטבחים, הארצות והזיכרונות שנאספו למקום אחד
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => {
                  setEditText(introText);
                  setIsEditing(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#dcc9af] hover:bg-[#cfb99b] text-[#553b27] text-xs font-semibold flex items-center gap-1 transition-colors"
                title="עריכת נוסח הפתיח"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">עריכת פתיח</span>
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-3 py-1 rounded-lg bg-[#8a4b2a] text-amber-50 hover:bg-[#703b20] text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>שמור שינויים</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#dfcbaf] text-[#5a4332] transition-colors"
              title="סגירה"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Parchment Paper Scroll Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 vintage-paper relative">
          {/* Decorative Branch at Top Center */}
          <div className="flex flex-col items-center mb-6">
            <LaurelBranch className="w-24 h-6 text-[#8a4b2a]/50 mb-2" />
            <span className="font-['Caveat'] text-2xl text-[#8a4b2a] font-bold">
              הקדמה וברכת הבית
            </span>
            <div className="w-32 h-[1px] bg-[#d3c2a6] mt-2" />
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-[#684732]">
                טקסט הפתיח (פסקה כפולה יוצרת רווח בין פסקאות):
              </label>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={16}
                className="w-full p-4 rounded-xl border-2 border-[#d3c2a6] bg-white/80 font-['Assistant'] text-sm leading-relaxed text-[#3a281c] focus:outline-none focus:border-[#8a4b2a]"
              />
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={handleReset}
                  className="text-xs text-[#8a4b2a] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  איפוס לנוסח המקורי
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-lg border border-[#cbb79a] text-xs font-semibold hover:bg-white"
                  >
                    ביטול
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-1.5 rounded-lg bg-[#8a4b2a] text-amber-50 text-xs font-bold shadow-xs hover:bg-[#703b20]"
                  >
                    שמור
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-4 font-['Assistant'] text-[#322318] text-sm sm:text-base leading-relaxed">
              {paragraphs.map((para, i) => {
                const isSignOff = i === paragraphs.length - 1 || para.includes('אוהבים מלא');
                const isBonAppetit = para.includes('בתיאבון');

                if (isSignOff) {
                  return (
                    <div key={i} className="pt-4 text-center">
                      <span className="inline-block font-['Caveat'] text-3xl font-bold text-[#8a4b2a] rotate-[-2deg]">
                        {para}
                      </span>
                    </div>
                  );
                }

                if (isBonAppetit) {
                  return (
                    <div key={i} className="pt-2 text-center">
                      <span className="inline-flex items-center gap-2 font-['Frank_Ruhl_Libre'] text-xl font-bold text-[#5c3e29]">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        {para}
                        <Sparkles className="w-4 h-4 text-amber-600" />
                      </span>
                    </div>
                  );
                }

                return (
                  <p 
                    key={i} 
                    className={`text-justify text-[#3a281c] ${i === 0 ? 'font-medium text-base sm:text-lg text-[#2a1b12] first-letter:text-3xl first-letter:font-bold first-letter:font-serif first-letter:text-[#8a4b2a]' : ''}`}
                  >
                    {para}
                  </p>
                );
              })}

              {/* Decorative Corner Foliage */}
              <div className="pt-8 flex justify-center items-center gap-3 text-[#947762]">
                <OliveSprig className="w-10 h-10 opacity-40 rotate-12" />
                <HeartDoodle className="w-6 h-6 text-rose-700/50" />
                <OliveSprig className="w-10 h-10 opacity-40 -scale-x-100 -rotate-12" />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="bg-[#ebdcc0] px-5 py-3 border-t border-[#d8c3a5] flex items-center justify-between shrink-0 text-xs text-[#6e4e37]">
          <span>ספר המתכונים המשפחתי</span>
          <div className="flex items-center gap-3">
            {onOpenTableOfContents && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTableOfContents();
                }}
                className="text-xs font-bold text-[#8a4b2a] hover:underline"
              >
                לתוכן העניינים ◄
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1 rounded-lg bg-[#8a4b2a] text-amber-50 font-bold hover:bg-[#703b20] transition-colors"
            >
              לספר המתכונים
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
