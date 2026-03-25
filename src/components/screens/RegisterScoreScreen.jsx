import { useState } from 'react';
import ScoreAdjuster from '../ui/ScoreAdjuster';

// Props:
// register: { label, icon, color }
// questions: array de 5 objets { numero, texte, sous_scores, score_claude, score_final }
// registerScore: number (calculé en temps réel)
// pointsForts: string[]
// pointsFaibles: string[]
// onAdjust: fn(questionNumero, delta)
// onConfirm: fn()
export default function RegisterScoreScreen({
  register,
  questions,
  registerScore,
  pointsForts,
  pointsFaibles,
  onAdjust,
  onConfirm,
}) {
  const [collapsed, setCollapsed] = useState({});

  function toggleCollapse(num) {
    setCollapsed(prev => ({ ...prev, [num]: !prev[num] }));
  }

  return (
    <div className="min-h-screen bg-[#fff8f0] pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-[#fff8f0]/95 backdrop-blur-sm px-6 py-4 border-b border-orange-100 z-10">
        <h2 className="text-xl font-bold text-[#2d1a0e]">
          {register.icon} Ton registre {register.label}
        </h2>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-bold" style={{ color: register.color }}>
            {registerScore?.toFixed(1) ?? '—'}
          </span>
          <span className="text-sm text-[#2d1a0e]/50">/10</span>
        </div>
      </div>

      <div className="px-6 py-6 max-w-2xl mx-auto space-y-4">
        {/* Questions */}
        {questions.map((q) => (
          <div key={q.numero} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Question header collapsible */}
            <button
              onClick={() => toggleCollapse(q.numero)}
              className="w-full text-left px-4 py-3 flex items-center justify-between"
            >
              <span className="text-sm text-[#2d1a0e]/60 font-medium">
                Q{q.numero} — {q.texte?.substring(0, 60)}...
              </span>
              <span className="text-[#2d1a0e]/40 text-xs ml-2">{collapsed[q.numero] ? '▼' : '▲'}</span>
            </button>

            {/* Sous-scores (visible par défaut) */}
            {!collapsed[q.numero] && (
              <div className="px-4 pb-2">
                <table className="w-full text-sm">
                  <tbody>
                    {q.sous_scores?.map((ss, i) => (
                      <tr key={i} className="border-t border-orange-50">
                        <td className="py-2 text-[#2d1a0e]/70 font-medium">{ss.label}</td>
                        <td className="py-2 text-center font-bold text-[#e07b39]">{ss.score?.toFixed(1)}/3.3</td>
                        <td className="py-2 text-[#2d1a0e]/50 text-xs">{ss.commentaire}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Score total + ajustement */}
            <div className="px-4 py-3 bg-orange-50/50 flex items-center justify-between">
              <span className="text-sm text-[#2d1a0e]/60">Score question</span>
              <ScoreAdjuster
                score={q.score_final ?? 0}
                onChange={(delta) => onAdjust(q.numero, delta)}
              />
            </div>
          </div>
        ))}

        {/* Points forts / faibles */}
        <div className="grid grid-cols-2 gap-4">
          {pointsForts?.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h4 className="text-sm font-bold text-green-700 mb-2">Points forts</h4>
              <ul className="space-y-1">
                {pointsForts.map((p, i) => (
                  <li key={i} className="text-xs text-[#2d1a0e]/70">✓ {p}</li>
                ))}
              </ul>
            </div>
          )}
          {pointsFaibles?.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h4 className="text-sm font-bold text-orange-700 mb-2">À améliorer</h4>
              <ul className="space-y-1">
                {pointsFaibles.map((p, i) => (
                  <li key={i} className="text-xs text-[#2d1a0e]/70">○ {p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bouton confirmer */}
        <button
          onClick={onConfirm}
          className="w-full bg-[#e07b39] hover:bg-[#c96a2a] text-white rounded-2xl py-4 text-lg font-bold transition-colors"
        >
          Confirmer et continuer →
        </button>
      </div>
    </div>
  );
}
