// DiagnosticScreen harmonisé avec le format des rapports secondaires
import { useState } from 'react';
import RadarChart from '../ui/RadarChart';
import { getScoreLevel } from '../../lib/scoring';

const REGISTRES_META = [
  { id: 'reptilien',  label: 'Reptilien',  abbr: 'REP', icon: '🦎', color: '#e07b39' },
  { id: 'instinctif', label: 'Instinctif', abbr: 'INS', icon: '🫀', color: '#c0392b' },
  { id: 'emotionnel', label: 'Émotionnel', abbr: 'EMO', icon: '💛', color: '#e6a817' },
  { id: 'rationnel',  label: 'Rationnel',  abbr: 'RAT', icon: '🧠', color: '#2980b9' },
];

const CONFIG = {
  title: 'Rapport Audit des 4 Registres',
  subtitle: 'Cartographie complète de vos modes de fonctionnement cognitif',
  color: '#C96442',
  icon: '🧭',
  maxScore: 100
};

function SectionTitle({ num, children }) {
  return (
    <div className="flex items-baseline gap-3 mb-4">
      <span className="text-xs font-bold text-[#e07b39] tracking-widest tabular-nums">{num}</span>
      <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-[#1c1c1c]">{children}</h2>
      <div className="flex-1 h-px bg-[#e0ddd6] ml-1" />
    </div>
  );
}

function ScoreBar({ value, max = 25 }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = pct >= 72 ? '#4a7c59' : pct >= 48 ? '#e07b39' : '#c0392b';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#ede9e1] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-[#999] w-8 text-right tabular-nums">{pct}%</span>
    </div>
  );
}

export default function DiagnosticScreen({ registres, diagnostic, onBack, answers = [] }) {
  const [showResponses, setShowResponses] = useState(false);
  const values = REGISTRES_META.map(r => registres[r.id]?.score ?? 0);
  const labels = REGISTRES_META.map(r => r.label);
  const totalScore = values.reduce((a, b) => a + b, 0);
  const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  function handleExport() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-[#f0ede6] pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Paper */}
        <div className="bg-white shadow-lg" id="diagnostic-pdf-content">

          {/* Header harmonisé */}
          <div className="px-8 pt-8 pb-6 border-b border-[#e0ddd6]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-1">
                  Re-Boot with Doctor Claude
                </p>
                <h1 className="text-xl font-bold text-[#1a1209]" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
                  {CONFIG.title}
                </h1>
                <p className="text-xs text-[#888] mt-1">{CONFIG.subtitle}</p>
              </div>
              <div className="text-3xl">{CONFIG.icon}</div>
            </div>
            
            {/* Score global harmonisé */}
            <div className="flex items-center gap-4 bg-[#faf7f2] rounded-xl p-4">
              <div className="flex-1">
                <p className="text-[10px] font-bold tracking-wider uppercase text-[#888] mb-1">Score Global</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold" style={{ color: CONFIG.color }}>{totalScore.toFixed(0)}</span>
                  <span className="text-sm text-[#999]">/ {CONFIG.maxScore}</span>
                  <span className="text-sm font-medium ml-2" style={{ color: CONFIG.color }}>
                    ({Math.round((totalScore / CONFIG.maxScore) * 100)}%)
                  </span>
                </div>
              </div>
              <div className="w-24">
                <div className="h-2 bg-[#ede9e1] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ width: `${(totalScore / CONFIG.maxScore) * 100}%`, backgroundColor: CONFIG.color }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-10">

            {/* I. Profil global (Radar + Table) */}
            <section>
              <SectionTitle num="I.">Profil global</SectionTitle>
              <div className="grid grid-cols-2 gap-6">
                {/* Radar */}
                <div className="flex items-center justify-center" style={{ minHeight: '250px' }}>
                  <div className="w-full" style={{ maxWidth: '280px', height: '250px' }}>
                    <RadarChart labels={labels} values={values} />
                  </div>
                </div>

                {/* Table des registres */}
                <div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#e0ddd6]">
                        <th className="text-left pb-2 text-[10px] tracking-widest uppercase text-[#999] font-medium">Registre</th>
                        <th className="text-right pb-2 text-[10px] tracking-widest uppercase text-[#999] font-medium">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {REGISTRES_META.map((r) => (
                        <tr key={r.id} className="border-b border-[#f0ede6]">
                          <td className="py-2">
                            <p className="text-xs font-medium text-[#1c1c1c]">{r.icon} {r.label}</p>
                            <p className="text-[9px] text-[#999] mt-0.5">{getScoreLevel(registres[r.id]?.score ?? 0)}</p>
                          </td>
                          <td className="py-2 text-right">
                            <span className="text-xs font-bold" style={{ color: r.color }}>{registres[r.id]?.score?.toFixed(1) ?? '—'}</span>
                            <span className="text-[9px] text-[#bbb]">/25</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Synthèse */}
              {diagnostic?.resume_court && (
                <div className="mt-6 bg-[#faf7f2] rounded-xl p-4 border-l-2" style={{ borderColor: CONFIG.color }}>
                  <p className="text-xs text-[#555] leading-relaxed italic">{diagnostic.resume_court}</p>
                </div>
              )}
            </section>

            {/* II. Lecture d'ensemble */}
            {diagnostic?.lecture_globale && (
              <section>
                <SectionTitle num="II.">Lecture approfondie</SectionTitle>
                <div className="bg-[#faf7f2] rounded-xl p-4 border border-[#e8e0d8]">
                  <p className="text-xs text-[#555] leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                    {diagnostic.lecture_globale}
                  </p>
                </div>
              </section>
            )}

            {/* III. Dynamiques centrales */}
            {diagnostic?.dynamiques?.length > 0 && (
              <section>
                <SectionTitle num="III.">Dynamiques centrales</SectionTitle>
                <div className="space-y-3">
                  {diagnostic.dynamiques.map((d, i) => (
                    <div key={i} className="flex gap-3 py-2 border-b border-[#f0ebe4] last:border-0">
                      <div
                        className="w-0.5 rounded-full shrink-0 self-stretch"
                        style={{ backgroundColor: i === 0 ? CONFIG.color : '#e8e0d8' }}
                      />
                      <div>
                        <p className="text-xs font-bold mb-1" style={{ color: i === 0 ? CONFIG.color : '#666' }}>
                          {d.titre}
                        </p>
                        <p className="text-xs text-[#666] leading-relaxed">{d.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* IV. Forces */}
            {diagnostic?.points_solides?.length > 0 && (
              <section>
                <SectionTitle num="IV.">Forces identifiées</SectionTitle>
                <div className="grid gap-2">
                  {diagnostic.points_solides.map((p, i) => (
                    <div key={i} className="bg-[#f5f0ea] rounded-lg p-3">
                      <p className="text-xs text-[#555] leading-relaxed">{p}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* V. Axes de développement */}
            {diagnostic?.priorites?.length > 0 && (
              <section>
                <SectionTitle num="V.">Axes de développement prioritaires</SectionTitle>
                {diagnostic.priorites_intro && (
                  <p className="text-xs text-[#555] leading-relaxed mb-4">{diagnostic.priorites_intro}</p>
                )}
                <div className="space-y-3">
                  {diagnostic.priorites.map((p, i) => (
                    <div key={i} className="bg-[#faf7f2] rounded-xl p-4 border border-[#e8e0d8]">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {REGISTRES_META.find(r => r.label === p.registre)?.icon}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-[#1a1209]">{p.registre}</p>
                            {p.but && <p className="text-[10px] text-[#888]">But : {p.but}</p>}
                          </div>
                        </div>
                        <span className="text-xs font-bold tabular-nums" style={{ color: CONFIG.color }}>
                          {p.score?.toFixed(1)}/25
                        </span>
                      </div>
                      <ScoreBar value={p.score ?? 0} />
                      <ul className="mt-3 space-y-1.5">
                        {p.actions?.map((action, j) => (
                          <li key={j} className="text-xs text-[#555] flex items-start gap-2">
                            <span style={{ color: CONFIG.color }}>›</span>{action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* VI. Prescription quotidienne (harmonisée) */}
            {diagnostic?.conseils?.pratiques_quotidiennes && (
              <section>
                <SectionTitle num="VI.">Prescription quotidienne</SectionTitle>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'matin', label: 'Matin', icon: '🌅' },
                    { key: 'journee', label: 'Journée', icon: '☀️' },
                    { key: 'soir', label: 'Soir', icon: '🌙' },
                  ].map(({ key, label, icon }) => {
                    const pq = diagnostic.conseils.pratiques_quotidiennes;
                    const items = Array.isArray(pq) ? [] : (pq[key] || []);
                    if (!items.length) return null;
                    return (
                      <div key={key} className="bg-[#faf7f2] rounded-xl p-4 border border-[#e8e0d8]">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">{icon}</span>
                          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: CONFIG.color }}>{label}</p>
                        </div>
                        <ul className="space-y-2">
                          {items.map((item, i) => (
                            <li key={i} className="text-xs text-[#444] leading-relaxed flex items-start gap-2">
                              <span style={{ color: CONFIG.color }}>›</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* VII. Conseils généraux */}
            {diagnostic?.conseils?.conseils_generaux?.length > 0 && (
              <section>
                <SectionTitle num="VII.">Conseils généraux</SectionTitle>
                <div className="bg-[#faf7f2] rounded-xl p-4 border border-[#e8e0d8]">
                  <ul className="space-y-2">
                    {diagnostic.conseils.conseils_generaux.map((c, i) => (
                      <li key={i} className="text-xs text-[#555] leading-relaxed flex items-start gap-2">
                        <span style={{ color: CONFIG.color }}>•</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* VIII. Concepts à explorer */}
            {diagnostic?.conseils?.concepts_a_etudier?.length > 0 && (
              <section>
                <SectionTitle num="VIII.">Concepts à explorer</SectionTitle>
                <div className="bg-white rounded-xl p-4 border border-[#e8e0d8]">
                  <div className="flex flex-wrap gap-2">
                    {diagnostic.conseils.concepts_a_etudier.map((c, i) => (
                      <div key={i} className="bg-[#faf7f2] rounded-lg p-3 flex-1 min-w-[200px]">
                        <p className="text-xs font-semibold text-[#1a1209] mb-1">{c.concept}</p>
                        <p className="text-[10px] text-[#666]">{c.pourquoi}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* IX. Ressources recommandées */}
            {diagnostic?.conseils?.ressources?.length > 0 && (
              <section>
                <SectionTitle num="IX.">Ressources recommandées</SectionTitle>
                <div className="space-y-3">
                  {diagnostic.conseils.ressources.map((r, i) => (
                    <div key={i} className="bg-[#faf7f2] rounded-xl p-4 border border-[#e8e0d8] flex items-start gap-3">
                      <span className="text-lg">📚</span>
                      <div>
                        <p className="text-sm font-semibold text-[#1a1209]">
                          {r.titre}
                          {r.auteur && <span className="font-normal text-[#666]">, {r.auteur}</span>}
                          {r.type && (
                            <span className="ml-2 text-[9px] tracking-widest uppercase border border-[#ccc] text-[#999] px-1.5 py-0.5">
                              {r.type}
                            </span>
                          )}
                        </p>
                        {r.pourquoi && <p className="text-xs text-[#666] mt-1">{r.pourquoi}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* X. Détail par registre */}
            <section>
              <SectionTitle num="X.">Détail par registre</SectionTitle>
              <div className="space-y-6">
                {REGISTRES_META.map(({ id, label, icon, color }) => {
                  const r = registres[id];
                  if (!r) return null;
                  return (
                    <div key={id} className="bg-[#faf7f2] rounded-xl p-4 border border-[#e8e0d8]">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{icon}</span>
                          <p className="text-xs font-bold text-[#1a1209]">{label}</p>
                        </div>
                        <span className="text-xs font-bold tabular-nums" style={{ color }}>
                          {r.score?.toFixed(1)}/25
                        </span>
                      </div>
                      <ScoreBar value={r.score ?? 0} />
                      
                      {/* Questions */}
                      {(r.questions || []).length > 0 && (
                        <div className="mt-3 space-y-2">
                          {(r.questions || []).slice(0, 3).map((q) => (
                            <div key={q.numero} className="bg-white rounded-lg p-2 text-xs">
                              <span className="font-bold text-[#bbb] mr-2">Q{q.numero}</span>
                              <span className="text-[#666]">{q.texte?.substring(0, 50)}...</span>
                              <span className="float-right font-bold" style={{ color }}>
                                {(q.score_final ?? 0).toFixed(1)}/5
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Points forts/faibles */}
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        {r.points_forts?.length > 0 && (
                          <div>
                            <p className="text-[9px] font-bold tracking-widest uppercase text-[#4a7c59] mb-1">Points forts</p>
                            <ul className="space-y-0.5">
                              {r.points_forts.slice(0, 2).map((p, i) => (
                                <li key={i} className="text-[10px] text-[#555]">✓ {p}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {r.points_faibles?.length > 0 && (
                          <div>
                            <p className="text-[9px] font-bold tracking-widest uppercase text-[#c0392b] mb-1">À développer</p>
                            <ul className="space-y-0.5">
                              {r.points_faibles.slice(0, 2).map((p, i) => (
                                <li key={i} className="text-[10px] text-[#555]">○ {p}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* XI. Réponses détaillées */}
            {answers.length > 0 && (
              <section>
                <SectionTitle num="XI.">Réponses détaillées</SectionTitle>
                
                <button
                  onClick={() => setShowResponses(!showResponses)}
                  className="text-xs px-4 py-2 rounded-lg border mb-3 transition-colors"
                  style={{ 
                    borderColor: CONFIG.color, 
                    color: CONFIG.color,
                    backgroundColor: showResponses ? `${CONFIG.color}10` : 'transparent'
                  }}
                >
                  {showResponses ? 'Masquer les réponses' : `Voir les ${answers.length} réponses`}
                </button>
                
                {showResponses && (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {answers.map((rep, idx) => (
                      <div key={idx} className="bg-[#faf7f2] rounded-xl p-4 border border-[#e8e0d8]">
                        <p className="text-[10px] font-semibold text-[#888] uppercase tracking-wider mb-2">
                          Question {idx + 1}
                        </p>
                        <p className="text-xs text-[#444] mb-3 leading-relaxed">{rep.question}</p>
                        <div className="bg-white rounded-lg p-3 border-l-2" style={{ borderColor: CONFIG.color }}>
                          <p className="text-xs text-[#555] italic leading-relaxed">"{rep.answer}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

          </div>

          {/* Footer harmonisé */}
          <div className="pt-6 border-t border-[#e0ddd6]">
            <div className="flex items-center justify-between px-8 pb-4">
              <div>
                <p className="text-[10px] text-[#888]">
                  Ce rapport est généré par Doctor Claude (Anthropic)
                </p>
                <p className="text-[10px] text-[#aaa] mt-0.5">
                  Re-Boot — Audit cognitif personnel
                </p>
              </div>
              <button
                onClick={handleExport}
                className="text-[10px] px-3 py-1.5 rounded-lg bg-[#1a1209] text-white"
              >
                Imprimer
              </button>
            </div>
            <p className="text-[9px] text-[#bbb] leading-relaxed px-8 pb-4">
              Disclaimer : Audit Re-Boot with Doctor Claude est un audit propulsé par l'intelligence artificielle. 
              Cet audit est à titre informatif et ne remplace pas une consultation chez un psychologue praticien agréé.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}