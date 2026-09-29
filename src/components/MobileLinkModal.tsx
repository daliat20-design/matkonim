import React, { useState } from 'react';
import { X, Smartphone, Copy, Check, ExternalLink, QrCode, MessageCircle, Globe } from 'lucide-react';

interface MobileLinkModalProps {
  onClose: () => void;
}

export const MobileLinkModal: React.FC<MobileLinkModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  // We detect the current origin and also offer the public shared URL
  const currentOriginUrl = typeof window !== 'undefined' 
    ? (window.location.origin + window.location.pathname).replace(/\/$/, '') 
    : '';

  // The shared cloud run URL:
  const sharedPreUrl = 'https://ais-pre-2kvel5e2f2aehsyrge6v2q-29867443297.europe-west1.run.app';

  // State for which link to show if needed, default to current origin since it is always live
  const [useSharedPre, setUseSharedPre] = useState(false);

  const targetUrl = useSharedPre ? sharedPreUrl : (currentOriginUrl || sharedPreUrl);

  const handleCopy = (urlToCopy?: string) => {
    const text = urlToCopy || targetUrl;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareToWhatsApp = () => {
    const message = encodeURIComponent(`📖 מוזמנים לספר המתכונים והזיכרונות המשפחתי שלנו!\n${targetUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  // QR Code generator using free fast standard service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(targetUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#faf5ec] text-[#2c1f17] rounded-2xl shadow-2xl border-4 border-[#d8c3a5] p-5 sm:p-6 flex flex-col max-h-[95vh] overflow-y-auto"
        dir="rtl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-[#ebdcc0] text-[#5a4332] transition-colors"
          title="סגירה"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#8a4b2a] flex items-center justify-center text-amber-100 shadow-xs shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-['Frank_Ruhl_Libre'] text-[#3b2416]">
              קישור לספר המתכונים
            </h3>
            <p className="text-xs text-[#7d5d47]">
              לפתיחה בנייד, שמירה במועדפים או שיתוף למשפחה
            </p>
          </div>
        </div>

        {/* Link Choice Toggle (Current Live URL vs Public Shared Link) */}
        <div className="my-2 p-1 bg-[#ede0ce] rounded-xl flex items-center gap-1 text-xs font-bold border border-[#d8c3a5]">
          <button
            onClick={() => setUseSharedPre(false)}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              !useSharedPre
                ? 'bg-[#8a4b2a] text-white shadow-xs'
                : 'text-[#6b4e3a] hover:bg-[#e4d4be]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>הקישור הפעיל כרגע</span>
          </button>
          <button
            onClick={() => setUseSharedPre(true)}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              useSharedPre
                ? 'bg-[#8a4b2a] text-white shadow-xs'
                : 'text-[#6b4e3a] hover:bg-[#e4d4be]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>קישור לשיתוף ציבורי</span>
          </button>
        </div>

        {/* QR Code Section */}
        <div className="my-1 flex flex-col items-center justify-center p-3 sm:p-4 bg-white rounded-2xl border-2 border-[#e6d8c3] shadow-inner">
          <img 
            src={qrCodeUrl} 
            alt="סריקת קוד QR לפתיחה"
            className="w-40 h-40 rounded-lg shadow-xs"
            loading="lazy"
          />
          <span className="text-[11px] text-[#856752] mt-2 font-medium flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5" />
            סרקו עם מצלמת הנייד לפתיחה מיידית
          </span>
        </div>

        {/* Direct Link Box */}
        <div className="mt-3 mb-2">
          <label className="block text-xs font-bold text-[#6a4c38] mb-1.5">
            הקישור להעתקה:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={targetUrl}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-[#d8c3a5] text-[#332217] font-mono select-all focus:outline-none"
            />
            <button
              onClick={() => handleCopy()}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 ${
                copied 
                  ? 'bg-emerald-700 text-white' 
                  : 'bg-[#8a4b2a] hover:bg-[#723a1e] text-amber-50'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>הועתק!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>העתק</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* WhatsApp & Open in Browser buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 my-2">
          <button
            onClick={handleShareToWhatsApp}
            className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white text-white" />
            <span>שליחת הקישור בווטסאפ</span>
          </button>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-[#523321] hover:bg-[#68412a] text-amber-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#784c31]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>פתיחה בחלון חדש</span>
          </a>
        </div>

        {/* Tip for home screen */}
        <div className="p-2.5 rounded-xl bg-[#ebdcc0]/60 border border-[#d8c3a5] text-[11px] text-[#5c3e29] space-y-0.5 mt-1">
          <p className="font-bold flex items-center gap-1 text-[#8a4b2a]">
            💡 טיפ להוספה למסך הבית:
          </p>
          <p>
            בפתיחה בדפדפן הנייד (Safari או Chrome), לוחצים על כפתור השיתוף ובוחרים <strong>"הוסף למסך הבית"</strong> כדי לשמור את ספר המתכונים כמו אפליקציה!
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-3 w-full py-2 rounded-xl bg-[#5c3e29] text-amber-100 text-xs font-bold hover:bg-[#4a301f] transition-colors"
        >
          סגור
        </button>
      </div>
    </div>
  );
};
