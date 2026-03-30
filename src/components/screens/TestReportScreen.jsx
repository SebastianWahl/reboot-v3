import { useState } from 'react';

// Format des nouveaux tests (Instinctif, Émotionnel, Mental)
// Style "PDF scrollable" comme DiagnosticScreen

const TEST_META = {
  instinctif: { 
    nom: 'Audit Instinctif & Corporel', 
    icon: '🫀',
    description: 'Intelligence somatique, intuition et ancrage corporel'
  },
  emotionnel: { 
    nom: 'Audit Émotionnel & Relationnel', 
    icon: '💞',
    description: 'Intelligence émotionnelle et qualité des relations'
  },
  mental: { 
    nom: 'Audit Mental & Cognitif', 
    icon: '🧠',
    description: 'Fonctionnement mental, pensée stratégique et focus'
  }
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

function ScoreBar({ value, max = 5 }) {
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

export default function TestReportScreen({ sessionData, testType }) {
  const [showPrint, setShowPrint] = useState(false);
  
  const meta = TEST_META[testType] || { nom: 'Audit', icon: '📝', description: '' };
  const report = sessionData?.diagnostic || sessionData?.report || {};
  const scores = sessionData?.scores || sessionData?.session_data?.scores || {};
  const scoreGlobal = sessionData?.score_global || sessionData?.session_data?.score_global || 0;
  
  const dateStr = new Date(sessionData?.date || sessionData?.created_at || Date.now()).toLocaleDateString('fr-FR', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  });

  const dimensions = report?.profil_global?.dimensions || [];
  const niveau = report?.profil_global?.niveau || 'Profil à construire';
  const synthese = report?.profil_global?.synthese || report?.resume_court || '';
  const lecture_globale = report?.profil_global?.lecture_globale || report?.lecture_globale || report?.lecture_densemble || '';

  function handleExport() {
    window.print();
  }

  if (!report || Object.keys(report).length === 0) {
    return (
      <div className="min-h-screen bg-[#f0ede6] pb-20">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white shadow-lg p-8 text-center">
            <p className="text-[#888]">Rapport non disponible ou en cours de génération.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0ede6] pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Paper */}
        <div className="bg-white shadow-lg" id="test-report-pdf-content">

          {/* ── HEADER ── */}
          <div className="px-8 pt-10 pb-8 border-b-2 border-[#2d1a0e]">
            <p className="text-xs tracking-[0.2em] uppercase text-[#999] mb-2">
              Rapport d'évaluation cognitive
            </p>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold text-[#2d1a0e]" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
                {meta.nom}
              </h1>
              <span className="text-4xl">{meta.icon}</span>
            </div>
            <p className="text-sm text-[#666] mt-2">{meta.description}</p>

            <div className="flex items-start justify-between mt-6">
              <div>
                <p className="text-xs text-[#999]">Réalisé le {dateStr}</p>
                <p className="text-xs text-[#aaa] mt-1 max-w-md leading-relaxed">
                  Disclaimer : Audit Re-Boot with Doctor Claude est un audit propulsé par l'intelligence artificielle. 
                  Cet audit est à titre informatif et ne remplace pas une consultation chez un psychologue praticien agréé.
                </p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-[#e07b39] tabular-nums">
                  {scoreGlobal}<span className="text-2xl text-[#bbb]">/100</span>
                </div>
                <p className="text-xs text-[#999] mt-1">Score global</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-8 space-y-14">

            {/* ── I. Profil global ── */}
            <section style={{ pageBreakInside: 'avoid' }}>
              <SectionTitle num="I.">Profil global</SectionTitle>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {/* Tableau des dimensions */}
                <div className="col-span-2">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#e0ddd6]">
                        <th className="text-left pb-2 text-[10px] tracking-widest uppercase text-[#999] font-medium">Dimension</th>
                        <th className="text-right pb-2 text-[10px] tracking-widest uppercase text-[#999] font-medium">Score</th>
                        <th className="w-24"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {dimensions.map((dim, idx) => (
                        <tr key={idx} className="border-b border-[#f5f3ef]">
                          <td className="py-2">
                            <span className="text-[#2d1a0e] font-medium">{dim.nom}</span>
                          </td>
                          <td className="text-right tabular-nums">
                            <span className="font-semibold text-[#2d1a0e]">{dim.score}</span>
                            <span className="text-[#bbb] text-xs">/{dim.max}</span>
                          </td>
                          <td className="pl-3">
                            <ScoreBar value={dim.score} max={dim.max} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Synthèse */}
                <div className="col-span-2">
                  <div className="bg-[#faf7f2] border-l-2 border-[#e07b39] pl-4 py-3 pr-3">
                    <p className="text-xs font-semibold text-[#e07b39] uppercase tracking-wide mb-1">Synthèse</p>
                    <p className="text-sm text-[#555] leading-relaxed italic">{synthese}</p>
                  </div>
                </div>

                {/* Total et niveau */}
                <div className="col-span-2 flex items-center justify-between pt-2 border-t border-[#e0ddd6]">
                  <div>
                    <p className="text-xs text-[#999] uppercase tracking-wide">Niveau</p>
                    <p className="text-lg font-semibold text-[#2d1a0e]">{niveau}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#999] uppercase tracking-wide">Total</p>
                    <p className="text-2xl font-bold text-[#2d1a0e]">{scoreGlobal}<span className="text-base text-[#bbb]">/100</span></p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── II. Lecture d'ensemble ── */}
            {lecture_globale && (
              <section style={{ pageBreakInside: 'avoid' }}>
                <SectionTitle num="II.">Lecture d'ensemble</SectionTitle>
                <div className="bg-[#faf7f2] rounded-lg p-6 border border-[#f0ebe4]">
                  <p className="text-sm text-[#555] leading-relaxed">
                    {lecture_globale}
                  </p>
                </div>
              </section>
            )}

            {/* ── III. Dynamiques ── */}
            {(report.dynamiques || report.dynamiques)?.length > 0 && (
              <section style={{ pageBreakInside: 'avoid' }}>
                <SectionTitle num="III.">Dynamiques identifiées</SectionTitle>
                <p className="text-xs text-[#888] mb-4 leading-relaxed">
                  Ces patterns émergent de la configuration globale de ton profil — ils décrivent la façon dont tes modes de fonctionnement s'articulent et se renforcent mutuellement.
                </p>
                <div className="space-y-4">
                  {(report.dynamiques || []).map((dyn, idx) => (
                    <div key={idx} className="bg-[#faf7f2] rounded-lg p-4 border border-[#f0ebe4]">
                      <p className="text-xs font-semibold text-[#e07b39] mb-1">{idx + 1}. {dyn.titre}</p>
                      {dyn.citation && (
                        <p className="text-xs text-[#888] italic mb-2 border-l-2 border-[#e07b39] pl-2">"{dyn.citation}"</p>
                      )}
                      <p className="text-sm text-[#555] leading-relaxed">{dyn.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── IV. Forces ── */}
            {(report.forces || report.points_solides)?.length > 0 && (
              <section style={{ pageBreakInside: 'avoid' }}>
                <SectionTitle num="IV.">Forces identifiées</SectionTitle>
                <div className="grid grid-cols-1 gap-3">
                  {(report.forces || report.points_solides || []).map((force, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-[#f8f9f5] rounded-lg p-3 border border-[#e8ebe3]">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4a7c59] text-white flex items-center justify-center text-xs font-semibold">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        {typeof force === 'string' ? (
                          <p className="text-sm text-[#2d1a0e]">{force}</p>
                        ) : (
                          <>
                            <p className="text-sm font-semibold text-[#2d1a0e]">{force.titre}</p>
                            <p className="text-xs text-[#666] mt-0.5">{force.description}</p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── V. Axes prioritaires ── */}
            {(report.axes_prioritaires || report.priorites)?.length > 0 && (
              <section style={{ pageBreakInside: 'avoid' }}>
                <SectionTitle num="V.">Axes de développement prioritaires</SectionTitle>
                {report.priorites_intro && (
                  <p className="text-sm text-[#555] mb-4 leading-relaxed">{report.priorites_intro}</p>
                )}
                <div className="space-y-4">
                  {(report.axes_prioritaires || report.priorites || []).map((axe, idx) => (
                    <div key={idx} className="border-l-2 border-[#e07b39] pl-4 py-1">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-sm font-semibold text-[#2d1a0e]">{idx + 1}. {axe.titre || axe.registre}</span>
                        {axe.but && <span className="text-xs text-[#888]">/ But : {axe.but}</span>}
                      </div>
                      {axe.exercice && (
                        <div className="mb-2">
                          <p className="text-xs text-[#e07b39] font-semibold mb-1">Exercice</p>
                          <p className="text-sm text-[#555]">{axe.exercice}</p>
                        </div>
                      )}
                      {axe.actions && axe.actions.length > 0 && (
                        <ul className="space-y-1 mb-2">
                          {axe.actions.map((action, i) => (
                            <li key={i} className="text-sm text-[#555] flex items-start gap-2">
                              <span className="text-[#e07b39]">›</span> {action}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="flex gap-4 text-xs text-[#888] mt-2">
                        {axe.frequence && <span><strong>Fréquence :</strong> {axe.frequence}</span>}
                        {axe.duree && <span><strong>Durée :</strong> {axe.duree}</span>}
                      </div>
                      {axe.signal_reussite && (
                        <p className="text-xs text-[#4a7c59] mt-2"><strong>Signal de réussite :</strong> {axe.signal_reussite}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── VI. Conseils généraux ── */}
            {(report.conseils_generaux || report.conseils?.conseils_generaux)?.length > 0 && (
              <section style={{ pageBreakInside: 'avoid' }}>
                <SectionTitle num="VI.">Conseils généraux</SectionTitle>
                <div className="bg-[#faf7f2] rounded-lg p-4 border border-[#f0ebe4]">
                  <ul className="space-y-3">
                    {(report.conseils_generaux || report.conseils?.conseils_generaux || []).map((conseil, idx) => (
                      <li key={idx} className="text-sm text-[#555] leading-relaxed flex items-start gap-2">
                        <span className="text-[#e07b39] flex-shrink-0">›</span>
                        {conseil}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* ── VII. Recommandations quotidiennes ── */}
            {(report.recommandations_quotidiennes || report.conseils?.pratiques_quotidiennes) && (
              <section style={{ pageBreakInside: 'avoid' }}>
                <SectionTitle num="VII.">Recommandations quotidiennes</SectionTitle>
                <div className="space-y-4">
                  {['matin', 'journee', 'soir'].map((periode) => {
                    const data = report.recommandations_quotidiennes?.[periode] || 
                                 report.conseils?.pratiques_quotidiennes?.[periode];
                    if (!data || (Array.isArray(data) && data.length === 0)) return null;
                    
                    const items = Array.isArray(data) ? data : [data];
                    const label = periode === 'matin' ? 'Matin' : periode === 'journee' ? 'Journée' : 'Soir';
                    
                    return (
                      <div key={periode} className="border-l-2 border-[#e07b39] pl-4">
                        <p className="text-xs font-semibold text-[#e07b39] uppercase tracking-wide mb-2">{label}</p>
                        <ul className="space-y-1">
                          {items.map((item, idx) => (
                            <li key={idx} className="text-sm text-[#555] flex items-start gap-2">
                              <span className="text-[#e07b39]">›</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── VIII. Ressources ── */}
            {(report.ressources || report.conseils?.ressources) && (
              <section style={{ pageBreakInside: 'avoid' }}>
                <SectionTitle num="VIII.">Ressources recommandées</SectionTitle>
                <div className="space-y-4">
                  {/* Livre */}
                  {(report.ressources?.livre || report.conseils?.ressources?.livre) && (
                    <div className="bg-[#f8f9f5] rounded-lg p-4 border border-[#e8ebe3]">
                      <p className="text-xs font-semibold text-[#4a7c59] uppercase tracking-wide mb-2">Livre recommandé</p>
                      <p className="text-sm font-semibold text-[#2d1a0e]">
                        {report.ressources?.livre?.titre || report.conseils?.ressources?.livre?.titre}
                      </p>
                      <p className="text-xs text-[#888]">
                        {report.ressources?.livre?.auteur || report.conseils?.ressources?.livre?.auteur}
                      </p>
                      <p className="text-sm text-[#555] mt-2 italic">
                        {report.ressources?.livre?.pourquoi || report.conseils?.ressources?.livre?.pourquoi}
                      </p>
                    </div>
                  )}

                  {/* Concepts */}
                  {(report.ressources?.concepts || report.conseils?.concepts_a_etudier)?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-[#999] uppercase tracking-wide mb-2">Concepts à explorer</p>
                      <table className="w-full text-sm">
                        <tbody>
                          {(report.ressources?.concepts || report.conseils?.concepts_a_etudier || []).map((concept, idx) => (
                            <tr key={idx} className="border-b border-[#f0ebe4]">
                              <td className="py-2 pr-4">
                                <span className="font-medium text-[#2d1a0e]">
                                  {typeof concept === 'string' ? concept : concept.concept}
                                </span>
                              </td>
                              <td className="py-2 text-[#666]">
                                {typeof concept === 'object' && concept.pourquoi}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Praticien */}
                  {(report.ressources?.praticien || report.conseils?.praticien) && (
                    <div className="bg-[#faf7f2] rounded-lg p-3 border border-[#f0ebe4]">
                      <p className="text-xs font-semibold text-[#e07b39] uppercase tracking-wide mb-1">Type de praticien recommandé</p>
                      <p className="text-sm text-[#555]">
                        {report.ressources?.praticien || report.conseils?.praticien}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Footer */}
            <div className="pt-8 border-t border-[#e0ddd6] flex items-center justify-between">
              <div>
                <p className="text-xs text-[#999]">Re-Boot — Audit cognitif personnel</p>
                <p className="text-xs text-[#bbb]">{dateStr}</p>
              </div>
              <p className="text-xs text-[#aaa] max-w-sm text-right leading-relaxed">
                Disclaimer : Audit Re-Boot with Doctor Claude est un audit propulsé par l'intelligence artificielle. 
                Cet audit est à titre informatif et ne remplace pas une consultation chez un psychologue praticien agréé.
              </p>
            </div>

          </div>
        </div>

        {/* Export Button */}
        <div className="mt-8 text-center no-print">
          <button 
            onClick={handleExport}
            className="px-6 py-3 rounded-xl font-medium text-white transition-colors shadow-lg"
            style={{ backgroundColor: '#C96442' }}
          >
            📄 Exporter en PDF
          </button>
        </div>

      </div>
    </div>
  );
}
