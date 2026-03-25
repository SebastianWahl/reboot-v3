import RadarChart from '../ui/RadarChart';
import { getScoreLevel } from '../../lib/scoring';
import { exportPDF } from '../../lib/pdf';

// Props:
// registres: { reptilien: { score, ... }, instinctif: ..., emotionnel: ..., rationnel: ... }
// diagnostic: { dynamiques, points_solides, priorites, lecture_globale }
export default function DiagnosticScreen({ registres, diagnostic }) {
  const labels = ['Reptilien', 'Instinctif', 'Émotionnel', 'Rationnel'];
  const values = [
    registres.reptilien?.score ?? 0,
    registres.instinctif?.score ?? 0,
    registres.emotionnel?.score ?? 0,
    registres.rationnel?.score ?? 0,
  ];

  async function handleExport() {
    try {
      await exportPDF('diagnostic-pdf-content', `reboot-audit-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error('Export PDF failed:', e);
    }
  }

  return (
    <div className="min-h-screen bg-[#fff8f0] pb-20">
      <div className="max-w-2xl mx-auto px-6 py-8" id="diagnostic-pdf-content">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2d1a0e]">Ton profil cognitif</h1>
          <p className="text-sm text-[#2d1a0e]/50 mt-1">{new Date().toLocaleDateString('fr-FR', { dateStyle: 'long' })}</p>
        </div>

        {/* Radar chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 flex justify-center">
          <div className="w-full max-w-xs">
            <RadarChart labels={labels} values={values} />
          </div>
        </div>

        {/* Tableau scores */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
          <table className="w-full">
            <thead className="bg-orange-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#2d1a0e]">Registre</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-[#2d1a0e]">Score</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-[#2d1a0e]">Niveau</th>
              </tr>
            </thead>
            <tbody>
              {['reptilien', 'instinctif', 'emotionnel', 'rationnel'].map((id, i) => (
                <tr key={id} className="border-t border-orange-50">
                  <td className="px-4 py-3 font-medium text-[#2d1a0e]">{labels[i]}</td>
                  <td className="px-4 py-3 text-center font-bold text-[#e07b39]">
                    {registres[id]?.score?.toFixed(1) ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-[#2d1a0e]/60">
                    {getScoreLevel(registres[id]?.score ?? 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dynamiques centrales */}
        {diagnostic?.dynamiques && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#2d1a0e] mb-3">Tes dynamiques centrales</h3>
            <div className="space-y-3">
              {diagnostic.dynamiques.map((d, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                  <h4 className="font-bold text-[#e07b39] mb-1">{d.titre}</h4>
                  <p className="text-sm text-[#2d1a0e]/70 leading-relaxed">{d.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ce qui est déjà solide */}
        {diagnostic?.points_solides && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <h3 className="text-lg font-bold text-green-700 mb-3">Ce qui est déjà solide</h3>
            <ul className="space-y-1">
              {diagnostic.points_solides.map((p, i) => (
                <li key={i} className="text-sm text-[#2d1a0e]/70">✓ {p}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Priorités d'amélioration */}
        {diagnostic?.priorites && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#2d1a0e] mb-3">Priorités d'amélioration</h3>
            <div className="space-y-3">
              {diagnostic.priorites.map((p, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-[#2d1a0e]">{p.registre}</h4>
                    <span className="text-sm font-bold text-[#e07b39]">{p.score?.toFixed(1)}/10</span>
                  </div>
                  <ul className="space-y-1">
                    {p.actions?.map((action, j) => (
                      <li key={j} className="text-sm text-[#2d1a0e]/70">→ {action}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lecture d'ensemble */}
        {diagnostic?.lecture_globale && (
          <div className="bg-orange-50 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-[#2d1a0e] mb-3">Lecture d'ensemble</h3>
            <p className="text-sm text-[#2d1a0e]/80 leading-relaxed">{diagnostic.lecture_globale}</p>
          </div>
        )}
      </div>

      {/* Export PDF */}
      <div className="max-w-2xl mx-auto px-6">
        <button
          onClick={handleExport}
          className="w-full border-2 border-[#e07b39] text-[#e07b39] hover:bg-[#e07b39] hover:text-white rounded-2xl py-4 text-lg font-bold transition-colors"
        >
          Exporter en PDF
        </button>
      </div>
    </div>
  );
}
