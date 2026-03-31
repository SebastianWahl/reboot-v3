// Composant d'affichage des rapports pour les tests secondaires (Instinctif, Émotionnel, Mental)
import { useState } from 'react';

export default function SecondaryTestReport({ session, testType }) {
  const [showResponses, setShowResponses] = useState(false);
  
  if (!session) {
    return null;
  }
  
  const data = session.session_data || session;
  const diagnostic = data?.diagnostic;
  const profil = diagnostic?.profil_global;
  const reponses = data?.reponses || [];
  
  if (!profil) {
    return null;
  }

  // Configuration selon le type de test
  const config = {
    instinctif: {
      title: 'Rapport Audit Instinctif',
      subtitle: 'Conscience corporelle, intuition et ancrage somatique',
      color: '#c0392b',
      icon: '🫀',
      maxScore: 60
    },
    emotionnel: {
      title: 'Rapport Audit Émotionnel',
      subtitle: 'Intelligence émotionnelle et relations',
      color: '#e6a817',
      icon: '💞',
      maxScore: 60
    },
    mental: {
      title: 'Rapport Audit Mental',
      subtitle: 'Processus cognitifs et pensée',
      color: '#2980b9',
      icon: '🧠',
      maxScore: 60
    }
  }[testType] || config.instinctif;

  const score = profil.score || 0;
  const scorePct = Math.round((score / config.maxScore) * 100);

  return (
    <div className="min-h-screen bg-[#f0ede6] pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Paper */}
        <div className="bg-white shadow-lg">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-[#e0ddd6]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-1">
                  Re-Boot with Doctor Claude
                </p>
                <h1 className="text-xl font-bold text-[#1a1209]" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
                  {config.title}
                </h1>
                <p className="text-xs text-[#888] mt-1">{config.subtitle}</p>
              </div>
              <div className="text-3xl">{config.icon}</div>
            </div>
            
            {/* Score global */}
            <div className="flex items-center gap-4 bg-[#faf7f2] rounded-xl p-4">
              <div className="flex-1">
                <p className="text-[10px] font-bold tracking-wider uppercase text-[#888] mb-1">Score Global</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold" style={{ color: config.color }}>{score}</span>
                  <span className="text-sm text-[#999]">/ {config.maxScore}</span>
                  <span className="text-sm font-medium ml-2" style={{ color: config.color }}>({scorePct}%)</span>
                </div>
                <p className="text-xs font-medium mt-1" style={{ color: config.color }}>{profil.niveau}</p>
              </div>
              <div className="w-24">
                <div className="h-2 bg-[#ede9e1] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${scorePct}%`, backgroundColor: config.color }} />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Section I - Synthèse */}
            <section>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-xs font-bold text-[#e07b39] tracking-widest tabular-nums">I</span>
                <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-[#1c1c1c]">Synthèse</h2>
                <div className="flex-1 h-px bg-[#e0ddd6] ml-1" />
              </div>
              <p className="text-xs text-[#444] leading-relaxed italic">{profil.synthese}</p>
            </section>

            {/* Section II - Dimensions détaillées */}
            <section>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-xs font-bold text-[#e07b39] tracking-widest tabular-nums">II</span>
                <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-[#1c1c1c]">Dimensions détaillées</h2>
                <div className="flex-1 h-px bg-[#e0ddd6] ml-1" />
              </div>
              <div className="space-y-2">
                {profil.dimensions?.map((dim, idx) => {
                  const pct = Math.round((dim.score / dim.max) * 100);
                  const color = pct >= 72 ? '#4a7c59' : pct >= 48 ? '#e07b39' : '#c0392b';
                  return (
                    <div key={idx} className="flex items-center gap-3 py-1.5 border-b border-[#f0ebe4] last:border-0">
                      <span className="text-[11px] text-[#666] flex-1">{dim.nom}</span>
                      <div className="w-20 h-1.5 bg-[#ede9e1] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                      <span className="text-[10px] font-bold w-10 text-right tabular-nums" style={{ color }}>
                        {dim.score}/{dim.max}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section III - Lecture globale - TOUJOURS AFFICHÉE */}
            <section>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-xs font-bold text-[#e07b39] tracking-widest tabular-nums">III</span>
                <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-[#1c1c1c]">Lecture approfondie</h2>
                <div className="flex-1 h-px bg-[#e0ddd6] ml-1" />
              </div>
              {profil.lecture_globale ? (
                <div className="bg-[#faf7f2] rounded-xl p-4 border border-[#e8e0d8]">
                  {profil.lecture_globale.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="text-xs text-[#555] leading-relaxed mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#888] italic bg-[#faf7f2] rounded-xl p-4 border border-[#e8e0d8]">
                  Aucune lecture approfondie disponible pour ce profil.
                </p>
              )}
            </section>

            {/* Section IV - Dynamiques centrales */}
            <section>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-xs font-bold text-[#e07b39] tracking-widest tabular-nums">IV</span>
                <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-[#1c1c1c]">Dynamiques centrales</h2>
                <div className="flex-1 h-px bg-[#e0ddd6] ml-1" />
              </div>
              {diagnostic.dynamiques?.length > 0 ? (
                <div className="space-y-3">
                  {diagnostic.dynamiques.map((d, i) => (
                    <div key={i} className="flex gap-3 py-2 border-b border-[#f0ebe4] last:border-0">
                      <div
                        className="w-0.5 rounded-full shrink-0 self-stretch"
                        style={{ backgroundColor: i === 0 ? config.color : '#e8e0d8' }}
                      />
                      <div>
                        <p className="text-xs font-bold mb-1" style={{ color: i === 0 ? config.color : '#666' }}>
                          {d.titre}
                        </p>
                        {d.citation && (
                          <p className="text-[10px] text-[#888] italic mb-1">"{d.citation}"</p>
                        )}
                        <p className="text-xs text-[#666] leading-relaxed">{d.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#888] italic">Aucune dynamique centrale identifiée.</p>
              )}
            </section>

            {/* Section V - Forces */}
            <section>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-xs font-bold text-[#e07b39] tracking-widest tabular-nums">V</span>
                <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-[#1c1c1c]">Forces identifiées</h2>
                <div className="flex-1 h-px bg-[#e0ddd6] ml-1" />
              </div>
              {diagnostic.forces?.length > 0 ? (
                <div className="grid gap-2">
                  {diagnostic.forces.map((f, i) => (
                    <div key={i} className="bg-[#f5f0ea] rounded-lg p-3">
                      <p className="text-xs font-semibold text-[#1a1209] mb-1">{f.titre}</p>
                      <p className="text-[11px] text-[#666] leading-relaxed">{f.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#888] italic">Aucune force identifiée spécifiquement.</p>
              )}
            </section>

            {/* Section VI - Axes prioritaires */}
            <section>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-xs font-bold text-[#e07b39] tracking-widest tabular-nums">VI</span>
                <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-[#1c1c1c]">Axes de travail prioritaires</h2>
                <div className="flex-1 h-px bg-[#e0ddd6] ml-1" />
              </div>
              {diagnostic.axes_prioritaires?.length > 0 ? (
                <div className="space-y-3">
                  {diagnostic.axes_prioritaires.map((axe, i) => (
                    <div key={i} className="bg-[#faf7f2] rounded-xl p-4 border border-[#e8e0d8]">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-xs font-bold text-[#1a1209]">{axe.titre}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#666] border border-[#e0ddd6]">
                          {axe.frequence}
                        </span>
                      </div>
                      <p className="text-xs text-[#555] leading-relaxed mb-2">{axe.exercice}</p>
                      <div className="flex items-center gap-4 text-[10px] text-[#888]">
                        <span>⏱ {axe.duree}</span>
                        <span>✓ {axe.signal_reussite}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#888] italic">Aucun axe prioritaire défini.</p>
              )}
            </section>

            {/* Section VII - Recommandations quotidiennes */}
            <section>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-xs font-bold text-[#e07b39] tracking-widest tabular-nums">VII</span>
                <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-[#1c1c1c]">Prescription quotidienne</h2>
                <div className="flex-1 h-px bg-[#e0ddd6] ml-1" />
              </div>
              {diagnostic.recommandations_quotidiennes ? (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'matin', label: 'Matin', icon: '🌅' },
                    { key: 'journee', label: 'Journée', icon: '☀️' },
                    { key: 'soir', label: 'Soir', icon: '🌙' },
                  ].map(({ key, label, icon }) => {
                    const items = diagnostic.recommandations_quotidiennes?.[key];
                    const itemsArray = Array.isArray(items) ? items : [];
                    
                    return (
                      <div key={key} className="bg-[#faf7f2] rounded-xl p-4 border border-[#e8e0d8]">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">{icon}</span>
                          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: config.color }}>{label}</p>
                        </div>
                        <ul className="space-y-2">
                          {itemsArray.length > 0 ? (
                            itemsArray.map((item, i) => (
                              <li key={i} className="text-xs text-[#444] leading-relaxed flex items-start gap-2">
                                <span style={{ color: config.color }}>›</span>
                                {item}
                              </li>
                            ))
                          ) : (
                            <li className="text-xs text-[#888] italic">Aucune recommandation</li>
                          )}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-[#888] italic">Aucune prescription quotidienne définie.</p>
              )}
            </section>

            {/* Section VIII - Conseils généraux */}
            <section>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-xs font-bold text-[#e07b39] tracking-widest tabular-nums">VIII</span>
                <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-[#1c1c1c]">Conseils généraux</h2>
                <div className="flex-1 h-px bg-[#e0ddd6] ml-1" />
              </div>
              {diagnostic.conseils_generaux?.length > 0 ? (
                <div className="bg-[#faf7f2] rounded-xl p-4 border border-[#e8e0d8]">
                  <ul className="space-y-2">
                    {diagnostic.conseils_generaux.map((c, i) => (
                      <li key={i} className="text-xs text-[#555] leading-relaxed flex items-start gap-2">
                        <span style={{ color: config.color }}>•</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-xs text-[#888] italic">Aucun conseil général supplémentaire.</p>
              )}
            </section>

            {/* Section IX - Concepts à explorer */}
            <section>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-xs font-bold text-[#e07b39] tracking-widest tabular-nums">IX</span>
                <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-[#1c1c1c]">Concepts à explorer</h2>
                <div className="flex-1 h-px bg-[#e0ddd6] ml-1" />
              </div>
              {diagnostic.ressources?.concepts?.length > 0 ? (
                <div className="bg-white rounded-xl p-4 border border-[#e8e0d8]">
                  <div className="flex flex-wrap gap-2">
                    {diagnostic.ressources.concepts.map((concept, i) => (
                      <span 
                        key={i} 
                        className="text-xs px-3 py-1.5 rounded-full bg-[#faf7f2] text-[#555] border border-[#e0ddd6]"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#888] italic">Aucun concept supplémentaire recommandé.</p>
              )}
            </section>

            {/* Section X - Ressources (Livre + Praticien) */}
            <section>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-xs font-bold text-[#e07b39] tracking-widest tabular-nums">X</span>
                <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-[#1c1c1c]">Ressources recommandées</h2>
                <div className="flex-1 h-px bg-[#e0ddd6] ml-1" />
              </div>
              {(diagnostic.ressources?.livre || diagnostic.ressources?.praticien) ? (
                <div className="space-y-4">
                  {/* Livre */}
                  {diagnostic.ressources.livre && (
                    <div className="bg-[#faf7f2] rounded-xl p-4 border border-[#e8e0d8]">
                      <p className="text-[10px] font-semibold tracking-wider uppercase text-[#888] mb-2">📚 Livre recommandé</p>
                      <p className="text-sm font-semibold text-[#1a1209] mb-1">{diagnostic.ressources.livre.titre}</p>
                      <p className="text-xs text-[#666] mb-1">par {diagnostic.ressources.livre.auteur}</p>
                      <p className="text-xs text-[#888] italic">{diagnostic.ressources.livre.pourquoi}</p>
                    </div>
                  )}
                  
                  {/* Type de praticien */}
                  {diagnostic.ressources.praticien && (
                    <div className="bg-[#faf7f2] rounded-xl p-4 border border-[#e8e0d8] flex items-start gap-3">
                      <span className="text-lg">👤</span>
                      <div>
                        <p className="text-[10px] font-semibold tracking-wider uppercase text-[#888] mb-1">Praticien recommandé</p>
                        <p className="text-xs text-[#555]">{diagnostic.ressources.praticien}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-[#888] italic">Aucune ressource supplémentaire recommandée.</p>
              )}
            </section>

            {/* Section XI - Réponses détaillées (OPTIONNEL - en dernier) */}
            {reponses.length > 0 && (
              <section>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-xs font-bold text-[#e07b39] tracking-widest tabular-nums">XI</span>
                  <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-[#1c1c1c]">Réponses détaillées</h2>
                  <div className="flex-1 h-px bg-[#e0ddd6] ml-1" />
                </div>
                
                <button
                  onClick={() => setShowResponses(!showResponses)}
                  className="text-xs px-4 py-2 rounded-lg border mb-3 transition-colors"
                  style={{ 
                    borderColor: config.color, 
                    color: config.color,
                    backgroundColor: showResponses ? `${config.color}10` : 'transparent'
                  }}
                >
                  {showResponses ? 'Masquer les réponses' : `Voir les ${reponses.length} réponses`}
                </button>
                
                {showResponses && (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {reponses.map((rep, idx) => (
                      <div key={idx} className="bg-[#faf7f2] rounded-xl p-4 border border-[#e8e0d8]">
                        <p className="text-[10px] font-semibold text-[#888] uppercase tracking-wider mb-2">
                          Question {idx + 1}
                        </p>
                        <p className="text-xs text-[#444] mb-3 leading-relaxed">{rep.question}</p>
                        <div className="bg-white rounded-lg p-3 border-l-2" style={{ borderColor: config.color }}>
                          <p className="text-xs text-[#555] italic leading-relaxed">"{rep.reponse}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Footer */}
            <div className="pt-6 border-t border-[#e0ddd6]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-[#888]">
                    Ce rapport est généré par Doctor Claude (Anthropic)
                  </p>
                  <p className="text-[10px] text-[#aaa] mt-0.5">
                    Re-Boot — Audit cognitif personnel
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="text-[10px] px-3 py-1.5 rounded-lg bg-[#1a1209] text-white"
                >
                  Imprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}