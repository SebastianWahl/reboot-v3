import { useState } from 'react';
import ProgressBar from '../ui/ProgressBar';

export default function QuestionScreen({ question, questionIndex, registerIndex, registerLabel, onNext, onBack, onCancel, savedAnswer, isLoading }) {
  const [text, setText] = useState(savedAnswer || '');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const MAX_CHARS = 1500;
  const MIN_CHARS = 20;
  const globalQuestionNumber = registerIndex * 5 + questionIndex + 1;
  const progressValue = (globalQuestionNumber / 20) * 100;

  function handleNext() {
    if (text.trim().length >= MIN_CHARS) {
      onNext(text.trim());
      setText('');
    }
  }

  const isOverLimit = text.length > MAX_CHARS;
  const isUnderMin = text.trim().length < MIN_CHARS;

  return (
    <div className="min-h-screen bg-[#fff8f0] flex flex-col">
      {/* Modal confirmation annulation */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-bold text-gray-900 mb-2">Abandonner l'audit ?</h3>
            <p className="text-sm text-gray-500 mb-5">Ta progression sera sauvegardée. Tu pourras reprendre plus tard.</p>
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 bg-[#1a1209] text-white rounded-xl py-3 font-semibold text-sm">
                Quitter
              </button>
              <button onClick={() => setShowCancelConfirm(false)} className="flex-1 border border-gray-200 text-gray-700 rounded-xl py-3 font-semibold text-sm hover:bg-gray-50">
                Continuer
              </button>
            </div>
          </div>
        </div>
      )}

      <ProgressBar value={progressValue} />

      <div className="flex-1 flex flex-col px-6 py-8 max-w-2xl mx-auto w-full">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-sm text-[#2d1a0e]/50 hover:text-[#2d1a0e] transition-colors flex items-center gap-1">
            ← Retour
          </button>
          <p className="text-sm text-[#2d1a0e]/50">
            {registerLabel} — Question {questionIndex + 1}/5
          </p>
          <button onClick={() => setShowCancelConfirm(true)} className="text-sm text-[#2d1a0e]/40 hover:text-red-500 transition-colors">
            Annuler
          </button>
        </div>

        {/* Question */}
        <h2 className="text-xl font-semibold text-[#2d1a0e] leading-relaxed mb-6">
          {question.texte}
        </h2>

        {/* Pense à */}
        <div className="bg-orange-50 rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-[#2d1a0e]/60 mb-2 uppercase tracking-wide">Pense à :</p>
          <ul className="space-y-1">
            {question.dimensions.map((dim, i) => (
              <li key={i} className="text-sm text-[#2d1a0e]/70">• {dim}</li>
            ))}
          </ul>
        </div>

        {/* Textarea */}
        <div className="flex-1 flex flex-col mb-6">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Décris librement ce que tu vis, ressens ou observes..."
            maxLength={MAX_CHARS + 50}
            className="flex-1 w-full border border-orange-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none min-h-[180px]"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-[#2d1a0e]/40">
              {isUnderMin && text.length > 0 ? `Minimum ${MIN_CHARS} caractères` : ''}
            </span>
            <span className={`text-xs ${isOverLimit ? 'text-red-500 font-semibold' : text.length > 1400 ? 'text-orange-500' : 'text-[#2d1a0e]/40'}`}>
              {text.length}/{MAX_CHARS}
            </span>
          </div>
        </div>

        {/* Bouton */}
        <button
          onClick={handleNext}
          disabled={isUnderMin || isOverLimit || isLoading}
          className="w-full bg-[#e07b39] hover:bg-[#c96a2a] text-white rounded-2xl py-4 text-lg font-bold disabled:opacity-40 transition-colors"
        >
          {isLoading ? 'Analyse en cours...' : 'Suivant →'}
        </button>
      </div>
    </div>
  );
}
