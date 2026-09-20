import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { X, CheckSquare, Square, ChevronRight, ChevronLeft, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

interface CookingModeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({ recipe, onClose }) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Kitchen Timer feature
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const startTimer = (minutes: number) => {
    setTimerSeconds(minutes * 60);
    setIsTimerRunning(true);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1f1a17] text-[#f4efe6] overflow-y-auto" dir="rtl">
      {/* Top sticky cooking header */}
      <div className="sticky top-0 z-10 bg-[#2b241f] border-b border-[#473b32] px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#3d332c] hover:bg-[#52453c] text-amber-100 transition-colors"
            title="חזרה לספר"
          >
            <X className="w-6 h-6" />
          </button>
          <div>
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              מצב בישול במטבח
            </div>
            <h1 className="text-lg sm:text-xl font-bold font-['Frank_Ruhl_Libre'] text-amber-50">
              {recipe.title}
            </h1>
          </div>
        </div>

        {/* Floating Timer in header */}
        <div className="flex items-center gap-2 bg-[#1b1613] px-3 py-1.5 rounded-xl border border-[#42352b]">
          <span className="font-mono text-base sm:text-lg font-bold text-amber-300">
            {formatTimer(timerSeconds)}
          </span>
          {timerSeconds > 0 ? (
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1.5 rounded-lg bg-amber-600/30 text-amber-200 hover:bg-amber-600/50"
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          ) : (
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => startTimer(5)}
                className="px-2 py-0.5 rounded bg-[#3b2e25] text-amber-200 hover:bg-[#523e31]"
              >
                +5ד׳
              </button>
              <button
                onClick={() => startTimer(15)}
                className="px-2 py-0.5 rounded bg-[#3b2e25] text-amber-200 hover:bg-[#523e31]"
              >
                +15ד׳
              </button>
              <button
                onClick={() => startTimer(30)}
                className="px-2 py-0.5 rounded bg-[#3b2e25] text-amber-200 hover:bg-[#523e31]"
              >
                +30ד׳
              </button>
            </div>
          )}
          {timerSeconds > 0 && (
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(0);
              }}
              className="p-1 text-zinc-400 hover:text-zinc-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Ingredients Column (Checkable) */}
        <div className="md:col-span-5 bg-[#28221c] p-5 rounded-2xl border border-[#42372e] shadow-md">
          <h3 className="text-base font-bold text-amber-200 mb-3 border-b border-[#3d332c] pb-2 flex items-center justify-between">
            <span>מצרכים למתכון ({recipe.ingredients.length})</span>
            <span className="text-xs font-normal text-amber-200/60">סמנו מה שכבר מוכן</span>
          </h3>
          <div className="space-y-2.5 max-h-[65vh] overflow-y-auto pr-1">
            {recipe.ingredients.map((ing, idx) => {
              const isChecked = !!checkedIngredients[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleIngredient(idx)}
                  className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between gap-3 border transition-colors ${
                    isChecked
                      ? 'bg-[#1e1916] border-zinc-800 text-zinc-500 line-through'
                      : 'bg-[#312a23] border-[#473c33] text-[#f2ece2] hover:bg-[#3d332b]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{ing.icon || '🧂'}</span>
                    <span className="text-sm font-medium">{ing.item}</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/20 text-amber-300">
                    {ing.amount}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Steps Column (Large reader) */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-[#28221c] p-6 rounded-2xl border border-[#42372e] shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                שלב {currentStepIdx + 1} מתוך {recipe.steps.length}
              </span>
              <button
                onClick={() => toggleStep(currentStepIdx)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  completedSteps[currentStepIdx]
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                    : 'bg-[#3d332c] text-amber-100 hover:bg-[#52443a]'
                }`}
              >
                {completedSteps[currentStepIdx] ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                {completedSteps[currentStepIdx] ? 'השלב הושלם!' : 'סמן כהושלם'}
              </button>
            </div>

            {/* Huge readable text */}
            <div className="text-xl sm:text-2xl leading-relaxed font-['Assistant'] text-amber-50 mb-6 font-medium">
              {recipe.steps[currentStepIdx].text}
            </div>

            {recipe.steps[currentStepIdx].note && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-200 text-sm mb-6 flex items-start gap-2">
                <span className="text-base">💡</span>
                <span>{recipe.steps[currentStepIdx].note}</span>
              </div>
            )}

            {/* Step navigation controls */}
            <div className="flex items-center justify-between pt-4 border-t border-[#3d332c]">
              <button
                disabled={currentStepIdx === 0}
                onClick={() => setCurrentStepIdx(p => p - 1)}
                className="px-4 py-2 rounded-xl bg-[#3d332c] hover:bg-[#504138] disabled:opacity-30 text-sm font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                לשלב הקודם
              </button>

              <button
                disabled={currentStepIdx === recipe.steps.length - 1}
                onClick={() => setCurrentStepIdx(p => p + 1)}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-30 text-amber-50 text-sm font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                לשלב הבא
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grandma's Secret tip card in dark mode */}
          {recipe.secretTip && (
            <div className="p-5 rounded-2xl bg-[#33281f] border-2 border-amber-700/50 text-amber-100 shadow-md">
              <div className="font-bold text-amber-300 text-sm mb-1 font-['Frank_Ruhl_Libre']">
                הסוד של סבתא לשלב זה:
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-amber-100/90 font-['Assistant']">
                {recipe.secretTip}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
