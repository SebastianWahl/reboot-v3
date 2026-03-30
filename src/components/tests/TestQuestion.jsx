import { useState } from 'react';

export default function TestQuestion({ 
  question, 
  answer, 
  onAnswer, 
  onNext, 
  onPrevious,
  isFirst,
  isLast 
}) {
  const [localAnswer, setLocalAnswer] = useState(answer);
  const [showWarning, setShowWarning] = useState(false);

  const handleNoteChange = (note) => {
    const updated = { ...localAnswer, note };
    setLocalAnswer(updated);
    onAnswer(question.id, updated);
    setShowWarning(false);
  };

  const handleTextChange = (field, value) => {
    const updated = { ...localAnswer, [field]: value };
    setLocalAnswer(updated);
    onAnswer(question.id, updated);
  };

  const handleNext = () => {
    if (!localAnswer.note) {
      setShowWarning(true);
      return;
    }
    onNext();
  };

  const likertLabels = {
    1: question.likert_1,
    2: question.likert_2,
    3: question.likert_3,
    4: question.likert_4,
    5: question.likert_5
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#888' }}>
          {question.dimension_label}
        </span>
        <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: '#F5F0EA', color: '#666' }}>
          Question {question.ordre}/12
        </span>
      </div>

      {/* Question */}
      <h2 className="text-xl font-medium mb-8 leading-relaxed" style={{ color: '#1A1209' }}>
        {question.question}
      </h2>

      {/* Likert Scale */}
      <div className="mb-8">
        <div className="flex justify-between gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleNoteChange(value)}
              className={`flex-1 py-4 rounded-xl border-2 font-semibold text-lg transition-all ${
                localAnswer.note === value 
                  ? 'border-[#C96442] bg-[#C96442] text-white' 
                  : 'border-[#E8E0D8] hover:border-[#C96442]'
              }`}
              style={{ 
                backgroundColor: localAnswer.note === value ? '#C96442' : 'white',
                color: localAnswer.note === value ? 'white' : '#1A1209'
              }}
            >
              {value}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between text-xs" style={{ color: '#888' }}>
          <span className="max-w-[100px]">{likertLabels[1]}</span>
          <span className="max-w-[100px] text-right">{likertLabels[5]}</span>
        </div>
      </div>

      {/* Warning si pas de note */}
      {showWarning && (
        <div className="mb-6 p-3 rounded-lg text-sm" style={{ backgroundColor: '#FFF8E7', border: '1px solid #F0D78C', color: '#8B6914' }}>
          ⚠️ Veuillez sélectionner une note de 1 à 5 pour continuer.
        </div>
      )}

      {/* Hints */}
      {question.hints && question.hints.length > 0 && (
        <div className="mb-8 p-4 rounded-lg text-sm" style={{ backgroundColor: '#F5F0EA', color: '#666' }}>
          <strong>💡 Suggestions :</strong> {question.hints.join(', ')}
        </div>
      )}

      {/* Champs texte */}
      <div className="border-t pt-8" style={{ borderColor: '#E8E0D8' }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-6" style={{ color: '#888' }}>
          Détaille ta réponse <span className="normal-case font-normal">(optionnel mais recommandé)</span>
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666' }}>
              {question.champ_contexte_label}
            </label>
            <textarea
              value={localAnswer.contexte || ''}
              onChange={(e) => handleTextChange('contexte', e.target.value)}
              placeholder={question.champ_contexte_placeholder}
              className="w-full p-4 rounded-xl border resize-y min-h-[80px] focus:outline-none transition-colors"
              style={{ borderColor: '#E8E0D8' }}
              onFocus={(e) => e.target.style.borderColor = '#C96442'}
              onBlur={(e) => e.target.style.borderColor = '#E8E0D8'}
            />
            <div className="text-right text-xs mt-1" style={{ color: '#888' }}>
              {(localAnswer.contexte || '').length} caractères
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666' }}>
              {question.champ_exemple_label}
            </label>
            <textarea
              value={localAnswer.exemple || ''}
              onChange={(e) => handleTextChange('exemple', e.target.value)}
              placeholder={question.champ_exemple_placeholder}
              className="w-full p-4 rounded-xl border resize-y min-h-[100px] focus:outline-none transition-colors"
              style={{ borderColor: '#E8E0D8' }}
              onFocus={(e) => e.target.style.borderColor = '#C96442'}
              onBlur={(e) => e.target.style.borderColor = '#E8E0D8'}
            />
            <div className="text-right text-xs mt-1" style={{ color: '#888' }}>
              {(localAnswer.exemple || '').length} caractères
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666' }}>
              {question.champ_reaction_label}
            </label>
            <textarea
              value={localAnswer.reaction || ''}
              onChange={(e) => handleTextChange('reaction', e.target.value)}
              placeholder={question.champ_reaction_placeholder}
              className="w-full p-4 rounded-xl border resize-y min-h-[80px] focus:outline-none transition-colors"
              style={{ borderColor: '#E8E0D8' }}
              onFocus={(e) => e.target.style.borderColor = '#C96442'}
              onBlur={(e) => e.target.style.borderColor = '#E8E0D8'}
            />
            <div className="text-right text-xs mt-1" style={{ color: '#888' }}>
              {(localAnswer.reaction || '').length} caractères
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-10 pt-6 border-t" style={{ borderColor: '#E8E0D8' }}>
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className="px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
          style={{ border: '1px solid #E8E0D8', color: '#666', backgroundColor: isFirst ? '#F5F0EA' : 'white' }}
        >
          ← Précédent
        </button>

        <button
          onClick={handleNext}
          className="px-8 py-3 rounded-xl font-medium text-white transition-colors"
          style={{ backgroundColor: '#1A1209' }}
        >
          {isLast ? 'Voir le récapitulatif' : 'Suivant →'}
        </button>
      </div>
    </div>
  );
}
