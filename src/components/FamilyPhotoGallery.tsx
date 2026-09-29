import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Maximize2, X, Upload, Trash2, RefreshCw } from 'lucide-react';
import { compressImageFile } from '../utils/imageCompressor';

export const GALLERY_PHOTOS: string[] = [
  'https://i.postimg.cc/YCmM7wkP/Whats-App-Image-2026-09-21-at-16-53-57.jpg',
  'https://i.postimg.cc/vmry1L1Q/Whats-App-Image-2026-09-21-at-16-50-23.jpg',
  'https://i.postimg.cc/hjMqsDbH/Whats-App-Image-2026-09-21-at-16-55-57.jpg',
  'https://i.postimg.cc/QN43WMML/Whats-App-Image-2026-09-21-at-17-00-34.jpg',
];

const BROKEN_POSTIMAGES_URLS = new Set([
  'https://i.postimg.cc/3wVYwYcZ/Whats-App-Image-2026-09-22-at-17-48-00.jpg',
  'https://i.postimg.cc/YCywXtM7/Whats-App-Image-2026-09-28-at-11-13-26-(1).jpg',
  'https://i.postimg.cc/YS5BH8vd/Whats-App-Image-2026-09-28-at-11-13-26.jpg',
  'https://i.postimg.cc/sxyFBX90/Whats-App-Image-2026-09-28-at-11-13-25-(2).jpg',
  'https://i.postimg.cc/sgxkGbSJ/Whats-App-Image-2026-09-28-at-11-13-25-(1).jpg',
  'https://i.postimg.cc/BnzdTNBF/Whats-App-Image-2026-09-28-at-11-13-25.jpg',
  'https://i.postimg.cc/wMzssJBM/Whats-App-Image-2026-09-28-at-11-13-25-(1).jpg',
  'https://i.postimg.cc/Z5QBxXqD/Whats-App-Image-2026-09-28-at-11-13-25-(2).jpg',
  'https://i.postimg.cc/NFbL9zVT/Whats-App-Image-2026-09-28-at-11-13-26-(1).jpg',
  'https://i.postimg.cc/qvWq3nbv/Whats-App-Image-2026-09-28-at-11-13-54-(1).jpg',
  'https://i.postimg.cc/qM5MPydM/Whats-App-Image-2026-09-28-at-11-13-54.jpg',
  'https://i.postimg.cc/sXjrQgRc/Whats-App-Image-2026-09-28-at-23-50-37.jpg',
]);

const STORAGE_GALLERY_KEY = 'family_recipe_book_gallery_v2';

function cleanAndOrganizePhotos(list: string[]): string[] {
  // Purge any blocked / 403 Postimages URLs
  const cleaned = list.filter(url => !BROKEN_POSTIMAGES_URLS.has(url) && !url.includes('postimg.cc/wMzssJBM') && !url.includes('postimg.cc/Z5QBxXqD') && !url.includes('postimg.cc/NFbL9zVT') && !url.includes('postimg.cc/qvWq3nbv') && !url.includes('postimg.cc/qM5MPydM') && !url.includes('postimg.cc/sXjrQgRc'));
  
  const originals = cleaned.filter(url => !url.startsWith('data:'));
  const userUploaded = cleaned.filter(url => url.startsWith('data:'));

  if (userUploaded.length === 0) {
    return originals.length > 0 ? originals : GALLERY_PHOTOS;
  }

  // Interleave user-uploaded photos smoothly between the 4 original family photos
  const result: string[] = [];
  let origIdx = 0;
  let userIdx = 0;

  while (origIdx < originals.length || userIdx < userUploaded.length) {
    if (origIdx < originals.length) {
      result.push(originals[origIdx++]);
    }
    const remainingOrigs = originals.length - origIdx;
    const remainingUploads = userUploaded.length - userIdx;
    const take = remainingOrigs > 0 ? Math.ceil(remainingUploads / (remainingOrigs + 1)) : remainingUploads;
    for (let i = 0; i < take && userIdx < userUploaded.length; i++) {
      result.push(userUploaded[userIdx++]);
    }
  }

  return result;
}

interface FamilyPhotoGalleryProps {
  onBackToRecipes?: () => void;
}

export const FamilyPhotoGallery: React.FC<FamilyPhotoGalleryProps> = ({ onBackToRecipes }) => {
  const [photos, setPhotos] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_GALLERY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const organized = cleanAndOrganizePhotos(parsed);
          if (organized.length > 0) {
            return organized;
          }
        }
      }
    } catch (e) {
      console.error('Error loading gallery photos', e);
    }
    return GALLERY_PHOTOS;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Automatically ensure broken Postimages URLs are purged and saved clean
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_GALLERY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const organized = cleanAndOrganizePhotos(parsed);
          if (organized.length !== parsed.length) {
            savePhotos(organized);
          }
        }
      }
    } catch (e) {
      console.error('Error syncing gallery storage', e);
    }
  }, []);

  // Save to localStorage whenever photos change
  const savePhotos = (newPhotos: string[]) => {
    setPhotos(newPhotos);
    try {
      localStorage.setItem(STORAGE_GALLERY_KEY, JSON.stringify(newPhotos));
    } catch (e) {
      console.error('Error saving gallery photos', e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const compressed = await compressImageFile(file, 1000, 1000, 0.78);
          newUrls.push(compressed);
        }
      }

      if (newUrls.length > 0) {
        const combined = [...photos, ...newUrls];
        const organized = cleanAndOrganizePhotos(combined);
        savePhotos(organized);
        setTimeout(() => {
          scrollToImage(Math.min(currentIndex + 1, organized.length - 1));
        }, 100);
      }
    } catch (err) {
      console.error('Failed to upload photos', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeletePhoto = (indexToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (photos.length <= 1) return;
    const updated = photos.filter((_, idx) => idx !== indexToDelete);
    savePhotos(updated);
    if (currentIndex >= updated.length) {
      setCurrentIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleResetPhotos = () => {
    if (window.confirm('האם להחזיר את הגלריה לרשימת התמונות המקורית?')) {
      savePhotos(GALLERY_PHOTOS);
      setCurrentIndex(0);
    }
  };

  const scrollToImage = (index: number) => {
    if (index < 0 || index >= photos.length) return;
    setCurrentIndex(index);
    const container = scrollContainerRef.current;
    if (container) {
      const child = container.children[index] as HTMLElement;
      if (child) {
        child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      scrollToImage(currentIndex + 1);
    } else {
      scrollToImage(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      scrollToImage(currentIndex - 1);
    } else {
      scrollToImage(photos.length - 1);
    }
  };

  // Listen to scroll events to update current index
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const width = container.clientWidth;
      let closestIdx = 0;
      let minDistance = Infinity;
      const center = scrollLeft + width / 2;

      Array.from(container.children).forEach((child, idx) => {
        const el = child as HTMLElement;
        const childCenter = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(center - childCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });
      setCurrentIndex(closestIdx);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenImage) {
        if (e.key === 'Escape') setFullscreenImage(null);
        if (e.key === 'ArrowLeft') handleNext();
        if (e.key === 'ArrowRight') handlePrev();
        return;
      }
      if (e.key === 'ArrowLeft') handleNext();
      if (e.key === 'ArrowRight') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, fullscreenImage, photos.length]);

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4">
      {/* Top Bar inside the gallery */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          {onBackToRecipes && (
            <button
              onClick={onBackToRecipes}
              className="px-4 py-1.5 rounded-full bg-white text-[#5a4336] text-xs sm:text-sm font-bold border border-[#e2d5c6] shadow-2xs hover:bg-[#f6eee4] transition-colors"
            >
              ← חזרה למתכונים
            </button>
          )}

          {/* Upload Button */}
          <label className="cursor-pointer px-3.5 py-1.5 rounded-full bg-[#8a4b2a] hover:bg-[#723c20] text-amber-50 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95">
            <Upload className={`w-4 h-4 text-amber-200 ${isUploading ? 'animate-bounce' : ''}`} />
            <span>{isUploading ? 'מעלה תמונות...' : 'העלאת תמונות מהמכשיר'}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              disabled={isUploading}
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        <div className="flex items-center gap-2">
          {photos.length !== GALLERY_PHOTOS.length && (
            <button
              onClick={handleResetPhotos}
              className="p-1.5 rounded-full text-[#8c7b70] hover:text-[#4a382c] hover:bg-[#f2ece4] transition-colors"
              title="איפוס הגלריה לרשימה המקורית"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* Counter indicator */}
          <div className="text-xs sm:text-sm font-bold text-[#8a4b2a] bg-[#f5ede4] px-3.5 py-1 rounded-full border border-[#e5d6c5]">
            תמונה {currentIndex + 1} מתוך {photos.length}
          </div>
        </div>
      </div>

      {/* Main Single Window Gallery View */}
      <div className="relative bg-[#201814] rounded-3xl overflow-hidden border-2 border-[#523d32] shadow-xl">
        {/* Horizontal Scroll Track */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none items-center h-[380px] sm:h-[500px] md:h-[580px] w-full bg-[#18120e]"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {photos.map((url, idx) => (
            <div
              key={idx}
              className="w-full flex-shrink-0 h-full flex items-center justify-center snap-center p-3 sm:p-6 select-none relative group"
            >
              <img
                src={url}
                alt={`תמונה משפחתית ${idx + 1}`}
                referrerPolicy="no-referrer"
                loading="eager"
                onClick={() => setFullscreenImage(url)}
                className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl cursor-zoom-in transition-transform duration-300 hover:scale-[1.01]"
              />

              {/* Action buttons on image hover */}
              <div className="absolute bottom-6 left-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setFullscreenImage(url)}
                  className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white/90 backdrop-blur-xs"
                  title="פתיחה בהגדלה"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                {photos.length > 1 && (
                  <button
                    onClick={(e) => handleDeletePhoto(idx, e)}
                    className="p-2 rounded-xl bg-black/60 hover:bg-rose-600 text-white/90 backdrop-blur-xs"
                    title="מחיקת תמונה זו מהגלריה"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows on Left and Right sides */}
        <button
          onClick={handleNext}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/85 text-amber-100 border border-white/20 flex items-center justify-center backdrop-blur-xs shadow-lg transition-all active:scale-95 z-10"
          aria-label="תמונה הבאה"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handlePrev}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/85 text-amber-100 border border-white/20 flex items-center justify-center backdrop-blur-xs shadow-lg transition-all active:scale-95 z-10"
          aria-label="תמונה קודמת"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-xs z-10 max-w-[90%] overflow-x-auto scrollbar-none">
          {photos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToImage(idx)}
              className={`transition-all rounded-full shrink-0 ${
                currentIndex === idx
                  ? 'w-6 h-2.5 bg-amber-400'
                  : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`עבור לתמונה ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails row for quick visual clicking */}
      <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 mt-4 overflow-x-auto py-2 scrollbar-none">
        {photos.map((url, idx) => (
          <button
            key={idx}
            onClick={() => scrollToImage(idx)}
            className={`relative rounded-xl overflow-hidden border-2 transition-all shrink-0 w-16 h-16 sm:w-20 sm:h-20 ${
              currentIndex === idx
                ? 'border-amber-600 ring-2 ring-amber-400/40 scale-105 shadow-md'
                : 'border-[#d8c8b6] opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={url}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen Modal View if clicked */}
      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4 backdrop-blur-md cursor-zoom-out animate-fadeIn"
        >
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 left-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="סגירה"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={fullscreenImage}
            alt=""
            referrerPolicy="no-referrer"
            className="max-h-[95vh] max-w-[95vw] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
