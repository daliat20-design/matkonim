import React, { useState } from 'react';
import { X, Smartphone, Copy, Check, ExternalLink, QrCode } from 'lucide-react';

interface MobileLinkModalProps {
  onClose: () => void;
}

export const MobileLinkModal: React.FC<MobileLinkModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  // Link for the shared app
  const mobileUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // QR Code generator using free fast standard service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(mobileUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#faf5ec] text-[#2c1f17] rounded-2xl shadow-2xl border-4 border-[#d8c3a5] p-6 flex flex-col"
        dir="rtl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-[#ebdcc0] text-[#5a4332] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#8a4b2a] flex items-center justify-center text-amber-100 shadow-xs">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-['Frank_Ruhl_Libre'] text-[#3b2416]">
              פתיחת הספר בנייד ובסמארטפון
            </h3>
            <p className="text-xs text-[#7d5d47]">
              סרקו את הקוד או העתיקו את הקישור לטלפון
            </p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="my-3 flex flex-col items-center justify-center p-4 bg-white rounded-2xl border-2 border-[#e6d8c3] shadow-inner">
          <img 
            src={qrCodeUrl} 
            alt="סריקת קוד QR לפתיחה בנייד"
            className="w-44 h-44 rounded-lg shadow-xs"
            loading="lazy"
          />
          <span className="text-[11px] text-[#856752] mt-2 font-medium flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5" />
            פתחו את המצלמה בנייד וסרקו את הקוד
          </span>
        </div>

        {/* Direct Link Box */}
        <div className="mt-2 mb-4">
          <label className="block text-xs font-bold text-[#6a4c38] mb-1.5">
            קישור ישיר לספר:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={mobileUrl}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-[#d8c3a5] text-[#332217] font-mono select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
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

        {/* Tip for home screen */}
        <div className="p-3 rounded-xl bg-[#ebdcc0]/60 border border-[#d8c3a5] text-xs text-[#5c3e29] space-y-1">
          <p className="font-bold flex items-center gap-1 text-[#8a4b2a]">
            💡 טיפ שימושי:
          </p>
          <p>
            כשפותחים בדפדפן בנייד (Safari או Chrome), אפשר ללחוץ על <strong>"הוסף למסך הבית"</strong> (Add to Home Screen) והספר יהפוך לאפליקציה אמיתית שפותחת ישר למתכונים!
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-xl bg-[#5c3e29] text-amber-100 text-xs font-bold hover:bg-[#4a301f] transition-colors"
        >
          סגור
        </button>
      </div>
    </div>
  );
};
