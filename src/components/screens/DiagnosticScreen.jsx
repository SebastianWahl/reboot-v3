import RadarChart from '../ui/RadarChart';
import { getScoreLevel } from '../../lib/scoring';

const REGISTRES_META = [
  { id: 'reptilien',  label: 'Reptilien',  abbr: 'REP', icon: '🦎' },
  { id: 'instinctif', label: 'Instinctif', abbr: 'INS', icon: '🫀' },
  { id: 'emotionnel', label: 'Émotionnel', abbr: 'EMO', icon: '💛' },
  { id: 'rationnel',  label: 'Rationnel',  abbr: 'RAT', icon: '🧠' },
];

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

export default function DiagnosticScreen({ registres, diagnostic, onBack }) {
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

          {/* ── Cover header ── */}
          <div className="px-8 pt-10 pb-8 border-b-2 border-[#1c1c1c]">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#999] mb-2">Rapport d'évaluation cognitive</p>
            <h1 className="text-3xl font-bold text-[#1c1c1c] leading-tight">Votre audit Re-Boot</h1>
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-sm text-[#666]">Réalisé le {dateStr}</p>
                <p className="text-[10px] text-[#aaa] mt-1 max-w-md leading-relaxed">Disclaimer : Audit Re-Boot with Doctor Claude est un audit propulsé par l'intelligence artificielle. Cet audit est à titre informatif et ne remplace pas une consultation chez un psychologue praticien agréé.</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-[#e07b39]">{totalScore.toFixed(0)}</span>
                <span className="text-sm text-[#999]">/100</span>
                <p className="text-[10px] tracking-widest uppercase text-[#999]">Score global</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-8 space-y-14">

            {/* ── I. Profil global ── */}
            <section style={{ pageBreakInside: 'avoid' }}>
              <SectionTitle num="I.">Profil global</SectionTitle>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">

                {/* [haut-gauche] RadarChart */}
                <div className="flex items-center justify-center">
                  <div className="w-full">
                    <RadarChart labels={labels} values={values} />
                  </div>
                </div>

                {/* [haut-droite] Registres */}
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
                            <p className="text-xs font-medium text-[#1c1c1c]">{r.label}</p>
                            <p className="text-[9px] text-[#999] mt-0.5">{getScoreLevel(registres[r.id]?.score ?? 0)}</p>
                          </td>
                          <td className="py-2 text-right">
                            <span className="text-xs font-bold text-[#1c1c1c]">{registres[r.id]?.score?.toFixed(1) ?? '—'}</span>
                            <span className="text-[9px] text-[#bbb]">/25</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* [bas-gauche] Synthèse */}
                <div className="border-t border-[#e0ddd6] pt-3">
                  {diagnostic?.resume_court && (
                    <div className="border-l-2 border-[#e07b39] pl-3">
                      <p className="text-sm font-bold text-[#e07b39] mb-1">Synthèse</p>
                      <p className="text-xs text-[#333] leading-relaxed italic text-justify">{diagnostic.resume_court}</p>
                    </div>
                  )}
                </div>

                {/* [bas-droite] Total + barres */}
                <div className="border-t-2 border-[#1c1c1c] pt-3">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="font-bold text-[#1c1c1c]">Total</span>
                    <div>
                      <span className="font-bold text-[#e07b39] text-lg">{totalScore.toFixed(0)}</span>
                      <span className="text-xs text-[#bbb]">/100</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {REGISTRES_META.map((r) => (
                      <div key={r.id} className="grid grid-cols-[36px_1fr] items-center gap-2">
                        <span className="text-[9px] tracking-widest uppercase text-[#999]">{r.abbr}</span>
                        <ScoreBar value={registres[r.id]?.score ?? 0} />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </section>

            {/* ── II. Lecture d'ensemble ── */}
            {diagnostic?.lecture_globale && (
              <section style={{ pageBreakInside: 'avoid' }}>
                <SectionTitle num="II.">Lecture d'ensemble</SectionTitle>
                <p className="text-sm text-[#333] leading-[1.8] whitespace-pre-line text-justify">{diagnostic.lecture_globale}</p>
              </section>
            )}

            {/* ── III. Dynamiques centrales ── */}
            {diagnostic?.dynamiques?.length > 0 && (
              <section style={{ pageBreakInside: 'avoid' }}>
                <SectionTitle num="III.">Dynamiques centrales</SectionTitle>
                <p className="text-xs text-[#888] mb-4 leading-relaxed">
                  Ces patterns émergent de la configuration globale de vos registres — ils décrivent la façon dont vos modes de fonctionnement s'articulent et se renforcent mutuellement.
                </p>
                <div className="space-y-4">
                  {diagnostic.dynamiques.map((d, i) => (
                    <div key={i} className="grid grid-cols-[3px_1fr] gap-4">
                      <div className="bg-[#e07b39] rounded-full" />
                      <div>
                        <p className="text-xs font-bold tracking-wide uppercase text-[#e07b39] mb-1">{d.titre}</p>
                        <p className="text-sm text-[#444] leading-relaxed text-justify">{d.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── IV. Forces identifiées ── */}
            {diagnostic?.points_solides?.length > 0 && (
              <section style={{ pageBreakInside: 'avoid' }}>
                <SectionTitle num="IV.">Forces identifiées</SectionTitle>
                <div className="space-y-1.5">
                  {diagnostic.points_solides.map((p, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-[10px] font-bold text-[#4a7c59] mt-0.5 tracking-widest">{String(i + 1).padStart(2, '0')}</span>
                      <p className="text-sm text-[#333] text-justify">{p}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── V. Axes de développement ── */}
            {diagnostic?.priorites?.length > 0 && (
              <section style={{ pageBreakInside: 'avoid' }}>
                <SectionTitle num="V.">Axes de développement prioritaires</SectionTitle>
                {diagnostic.priorites_intro && (
                  <p className="text-sm text-[#333] leading-relaxed text-justify mb-4">{diagnostic.priorites_intro}</p>
                )}
                <div className="space-y-5">
                  {diagnostic.priorites.map((p, i) => (
                    <div key={i}>
                      <div className="flex items-baseline justify-between mb-2">
                        <p className="text-xs font-bold tracking-widest uppercase text-[#1c1c1c]">
                          {REGISTRES_META.find(r => r.label === p.registre)?.icon} {p.registre}
                          {p.but && <span className="font-normal normal-case tracking-normal text-[#888]"> / But : {p.but}</span>}
                        </p>
                        <span className="text-xs text-[#e07b39] font-bold tabular-nums">{p.score?.toFixed(1)}/25</span>
                      </div>
                      <ScoreBar value={p.score ?? 0} />
                      <ul className="mt-2 space-y-1">
                        {p.actions?.map((action, j) => (
                          <li key={j} className="text-sm text-[#444] flex items-start gap-2 text-justify">
                            <span className="text-[#ccc] mt-0.5 shrink-0">›</span>{action}
                          </li>
                        ))}
                      </ul>
                      {i < diagnostic.priorites.length - 1 && <div className="mt-4 h-px bg-[#f0ede6]" />}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── VI. Recommandations ── */}
            {diagnostic?.conseils && (
              <section style={{ pageBreakInside: 'avoid' }}>
                <SectionTitle num="VI.">Recommandations</SectionTitle>
                <div className="space-y-6">

                  {/* A. Prescription quotidienne */}
                  {diagnostic.conseils.pratiques_quotidiennes && (
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-3">A — Prescription quotidienne</p>
                      <div className="space-y-3">
                        {[
                          { key: 'matin',   label: 'Matin'   },
                          { key: 'journee', label: 'Journée' },
                          { key: 'soir',    label: 'Soir'    },
                        ].map(({ key, label }) => {
                          const pq = diagnostic.conseils.pratiques_quotidiennes;
                          const items = Array.isArray(pq) ? [] : (pq[key] || []);
                          if (!items.length) return null;
                          return (
                            <div key={key} className="grid grid-cols-[56px_1fr] gap-3 items-start">
                              <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#e07b39] border border-[#e07b39] px-1.5 py-0.5 text-center mt-0.5">{label}</p>
                              <ul className="space-y-1.5">
                                {items.map((p, i) => (
                                  <li key={i} className="text-sm text-[#333] flex items-start gap-2 text-justify">
                                    <span className="text-[#ccc] mt-0.5 shrink-0">›</span>{p}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* B. Conseils généraux */}
                  {diagnostic.conseils.conseils_generaux?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-2">B — Conseils généraux</p>
                      <ul className="space-y-1.5">
                        {diagnostic.conseils.conseils_generaux.map((c, i) => (
                          <li key={i} className="text-sm text-[#333] flex items-start gap-2 text-justify">
                            <span className="text-[#e07b39] mt-0.5 font-bold shrink-0">›</span>{c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* C. Concepts */}
                  {diagnostic.conseils.concepts_a_etudier?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-2">C — Concepts à explorer</p>
                      <table className="w-full text-sm">
                        <tbody>
                          {diagnostic.conseils.concepts_a_etudier.map((c, i) => (
                            <tr key={i} className="border-b border-[#f0ede6]">
                              <td className="py-2 pr-4 font-medium text-[#1c1c1c] w-2/5">{c.concept}</td>
                              <td className="py-2 text-[#555] text-justify">{c.pourquoi}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* D. Ressources */}
                  {diagnostic.conseils.ressources?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-2">D — Ressources recommandées</p>
                      <div className="space-y-2.5">
                        {diagnostic.conseils.ressources.map((r, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="text-[10px] font-bold text-[#bbb] mt-0.5 w-4 tabular-nums">{i + 1}.</span>
                            <div>
                              <p className="text-sm font-semibold text-[#1c1c1c]">
                                {r.titre}
                                {r.auteur && <span className="font-normal text-[#888]">, {r.auteur}</span>}
                                {r.type && <span className="ml-2 text-[9px] tracking-widest uppercase border border-[#ccc] text-[#999] px-1.5 py-0.5">{r.type}</span>}
                              </p>
                              {r.pourquoi && <p className="text-xs text-[#777] mt-0.5 text-justify">{r.pourquoi}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </section>
            )}

            {/* ── VII. Détail par registre ── */}
            <section style={{ pageBreakInside: 'avoid' }}>
              <SectionTitle num="VII.">Détail par registre</SectionTitle>
              <div className="space-y-6">
                {REGISTRES_META.map(({ id, label, icon }) => {
                  const r = registres[id];
                  if (!r) return null;
                  return (
                    <div key={id}>
                      <div className="flex items-baseline justify-between mb-2">
                        <p className="text-xs font-bold tracking-widest uppercase text-[#1c1c1c]">{icon} {label}</p>
                        <span className="text-xs text-[#e07b39] font-bold tabular-nums">{r.score?.toFixed(1)}/25</span>
                      </div>
                      <ScoreBar value={r.score ?? 0} />
                      <table className="w-full text-sm mt-3">
                        <tbody>
                          {(r.questions || []).map((q) => (
                            <tr key={q.numero} className="border-b border-[#f5f3ef]">
                              <td className="py-1.5 text-[#555] pr-4">
                                <span className="text-[10px] font-bold text-[#bbb] mr-2">Q{q.numero}</span>
                                {q.texte?.substring(0, 60)}…
                              </td>
                              <td className="py-1.5 text-right font-bold text-[#1c1c1c] tabular-nums whitespace-nowrap">
                                {(q.score_final ?? 0).toFixed(1)}<span className="text-xs font-normal text-[#bbb]">/5</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {(r.points_forts?.length > 0 || r.points_faibles?.length > 0) && (
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          {r.points_forts?.length > 0 && (
                            <div>
                              <p className="text-[9px] font-bold tracking-widest uppercase text-[#4a7c59] mb-1">Points forts</p>
                              <ul className="space-y-0.5">
                                {r.points_forts.map((p, i) => (
                                  <li key={i} className="text-xs text-[#555]">✓ {p}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {r.points_faibles?.length > 0 && (
                            <div>
                              <p className="text-[9px] font-bold tracking-widest uppercase text-[#c0392b] mb-1">À développer</p>
                              <ul className="space-y-0.5">
                                {r.points_faibles.map((p, i) => (
                                  <li key={i} className="text-xs text-[#555]">○ {p}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-[#e0ddd6]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] tracking-widest uppercase text-[#bbb]">Re-Boot — Audit cognitif personnel</p>
              <p className="text-[10px] text-[#bbb]">{dateStr}</p>
            </div>
            <p className="text-[10px] text-[#bbb] leading-relaxed">Disclaimer : Audit Re-Boot with Doctor Claude est un audit propulsé par l'intelligence artificielle. Cet audit est à titre informatif et ne remplace pas une consultation chez un psychologue praticien agréé.</p>
          </div>
        </div>

        {/* Export */}
        <button
          onClick={handleExport}
          className="no-print mt-4 w-full bg-[#1c1c1c] hover:bg-[#333] text-white py-3 text-sm font-bold tracking-widest uppercase transition-colors"
        >
          Exporter en PDF
        </button>

        {onBack && (
          <button
            onClick={onBack}
            className="no-print mt-2 w-full border border-[#e0ddd6] text-[#666] py-3 text-sm font-bold tracking-widest uppercase transition-colors hover:bg-[#f5f0ea]"
          >
            ← Retour
          </button>
        )}

      </div>
    </div>
  );
}
