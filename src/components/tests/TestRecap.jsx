export default function TestRecap({ answers, questions, onEdit, onSubmit, onCancel }) {
  const getScoreForQuestion = (questionId) => {
    return answers[questionId]?.note || '—';
  };

  const getMissingTexts = (questionId) => {
    const answer = answers[questionId];
    if (!answer) return 3;
    let missing = 0;
    if (!answer.contexte || answer.contexte.length < 20) missing++;
    if (!answer.exemple || answer.exemple.length < 30) missing++;
    if (!answer.reaction || answer.reaction.length < 10) missing++;
    return missing;
  };

  const totalMissingTexts = questions.reduce((sum, q) => sum + getMissingTexts(q.id), 0);
  const hasAllNotes = questions.every(q => answers[q.id]?.note);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mb-2" style={{ fontFamily: "'EB Garamond', Georgia, serif", color: '#1A1209' }}>
        Récapitulatif de tes réponses
      </h2>
      
      <p className="text-center mb-8" style={{ color: '#666' }}>
        Vérifie tes réponses avant d'envoyer à Doctor Claude pour analyse.
      </p>

      {/* Grid des scores */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {questions.map((q, index) => {
          const score = getScoreForQuestion(q.id);
          const missing = getMissingTexts(q.id);
          
          return (
            <div 
              key={q.id}
              onClick={() => onEdit(index)}
              className="p-4 rounded-xl cursor-pointer transition-all hover:shadow-md"
              style={{ 
                backgroundColor: score === '—' ? '#FFF8E7' : '#F5F0EA',
                border: missing > 0 ? '1px solid #F0D78C' : '1px solid #E8E0D8'
              }}
            >
              <div className="text-2xl font-bold mb-1" style={{ color: score === '—' ? '#C96442' : '#1A1209' }}>
                {score}
              </div>
              <div className="text-xs uppercase tracking-wider mb-2" style={{ color: '#888' }}>
                {q.dimension_label.substring(0, 20)}
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#E8E0D8' }}>
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    backgroundColor: score === '—' ? '#C96442' : '#C96442',
                    width: score === '—' ? '0%' : `${(score / 5) * 100}%`
                  }}
                />
              </div>
              {missing > 0 && (
                <div className="text-xs mt-2" style={{ color: '#8B6914' }}>
                  {missing} champ{missing > 1 ? 's' : ''} vide
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Alertes */}
      {totalMissingTexts > 0 && (
        <div className="p-4 rounded-xl mb-6 text-sm" style={{ backgroundColor: '#FFF8E7', border: '1px solid #F0D78C', color: '#8B6914' }}>
          <strong>⚠️ Attention :</strong> Tu n'as pas détaillé les réponses textuelles pour {totalMissingTexts} champ{totalMissingTexts > 1 ? 's' : ''}. 
          Cela limitera la précision de l'analyse de Doctor Claude. Tu peux modifier les questions concernées ou continuer quand même.
        </div>
      )}

      {!hasAllNotes && (
        <div className="p-4 rounded-xl mb-6 text-sm" style={{ backgroundColor: '#FEE7E7', border: '1px solid #FCA5A5', color: '#DC2626' }}>
          <strong>❌ Bloquant :</strong> Tu n'as pas donné de note pour toutes les questions. Clique sur les cases "—" ci-dessus pour compléter.
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <button
          onClick={onCancel}
          className="px-6 py-3 rounded-xl font-medium transition-colors"
          style={{ border: '1px solid #E8E0D8', color: '#666' }}
        >
          ← Modifier mes réponses
        </button>
        
        <button
          onClick={onSubmit}
          disabled={!hasAllNotes}
          className="px-8 py-3 rounded-xl font-medium text-white transition-colors disabled:opacity-50"
          style={{ backgroundColor: hasAllNotes ? '#1A1209' : '#999' }}
        >
          {hasAllNotes ? 'Tout est bon → Analyser avec Doctor Claude' : 'Complétez toutes les notes'}
        </button>
      </div>

      <p className="text-center text-xs mt-4" style={{ color: '#888' }}>
        En cliquant sur "Analyser", tu acceptes que tes réponses soient traitées par notre IA pour générer un rapport personnalisé.
      </p>
    </div>
  );
}
