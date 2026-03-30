import { useState } from 'react';

export default function TestReport({ report, onDownloadPDF, onChat, onViewProfile }) {
  const [expandedSections, setExpandedSections] = useState({
    profil: true,
    dynamiques: true,
    forces: true,
    axes: true,
    conseils: true,
    ressources: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const SectionHeader = ({ title, section, children }) => (
    <div 
      className="flex justify-between items-center cursor-pointer py-4 border-b"
      style={{ borderColor: '#F0EBE4' }}
      onClick={() => toggleSection(section)}
    >
      <h3 className="text-lg font-semibold" style={{ color: '#1A1209' }}>{title}</h3>
      <span className="text-2xl" style={{ color: '#888' }}>
        {expandedSections[section] ? '−' : '+'}
      </span>
    </div>
  );

  return (
    <div>
      {/* Header du rapport */}
      <div className="bg-white rounded-2xl border p-8 mb-6 shadow-lg" style={{ borderColor: '#E8E0D8' }}>
        <div className="text-center mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#C96442' }}>
            RAPPORT D'ANALYSE
          </span>
          <h1 className="text-3xl font-semibold mt-2" style={{ fontFamily: "'EB Garamond', Georgia, serif", color: '#1A1209' }}>
            Audit Instinctif & Corporel
          </h1>
          <p className="text-sm mt-2" style={{ color: '#888' }}>
            Généré le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Score global */}
        <div className="flex items-baseline justify-center gap-3 mb-6">
          <span className="text-6xl font-bold" style={{ color: '#C96442' }}>
            {report?.scoreGlobal || '28'}
          </span>
          <span className="text-xl" style={{ color: '#888' }}>/ 100</span>
        </div>
        
        <p className="text-center font-medium" style={{ color: '#666' }}>
          {report?.interpretation || "Instinctif à développer"}
        </p>

        {/* Actions rapides */}
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <button 
            onClick={onDownloadPDF}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: '#1A1209', color: 'white' }}
          >
            📄 Télécharger PDF
          </button>
          <button 
            onClick={onChat}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ border: '1px solid #E8E0D8', color: '#666' }}
          >
            💬 Discuter avec Doctor Chat
          </button>
          <button 
            onClick={onViewProfile}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ border: '1px solid #E8E0D8', color: '#666' }}
          >
            👤 Voir dans mon Profil
          </button>
        </div>
      </div>

      {/* Section I : Profil */}
      <div className="bg-white rounded-2xl border p-6 mb-6 shadow-sm" style={{ borderColor: '#E8E0D8' }}>
        <SectionHeader title="I. Votre Profil Instinctif" section="profil">
          <div className="mt-6">
            {/* Graphiques des 12 dimensions */}
            <div className="space-y-3">
              {(report?.dimensions || [
                { name: 'Noticing', score: 2, max: 5 },
                { name: 'Not-Distracting', score: 1, max: 5 },
                { name: 'Attention Regulation', score: 3, max: 5 },
                { name: 'Emotional Awareness', score: 2, max: 5 },
                { name: 'Trusting', score: 1, max: 5 },
                { name: 'Self-Regulation', score: 1, max: 5 },
                { name: 'Body Listening', score: 1, max: 5 },
                { name: 'Intuition', score: 2, max: 5 },
                { name: 'Interoceptive Clarity', score: 1, max: 5 },
                { name: 'Self-Compassion', score: 2, max: 5 },
                { name: 'Embodied Presence', score: 1, max: 5 },
                { name: 'Somatic Integration', score: 1, max: 5 }
              ]).map((dim) => (
                <div key={dim.name} className="flex items-center">
                  <div className="w-36 text-xs" style={{ color: '#666' }}>{dim.name}</div>
                  <div className="flex-1 h-6 rounded-full overflow-hidden mx-3" style={{ backgroundColor: '#F5F0EA' }}>
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        backgroundColor: '#C96442',
                        width: `${(dim.score / dim.max) * 100}%`
                      }}
                    />
                  </div>
                  <div className="w-10 text-xs font-medium text-right">{dim.score}/{dim.max}</div>
                </div>
              ))}
            </div>

            {/* Synthèse narrative */}
            <div className="mt-6 p-4 rounded-lg border-l-4 italic" style={{ backgroundColor: '#F5F0EA', borderLeftColor: '#C96442', color: '#666' }}>
              "{report?.synthese || "Ton profil montre une conscience corporelle très basique. Tu perçois les signaux intenses (douleur, fatigue extrême) mais ignores les nuances. Le corps est perçu comme source de problèmes techniques plutôt que comme ressource d'information."}"
            </div>
          </div>
        </SectionHeader>
        
        {expandedSections.profil && (
          <div className="pt-4">
            {/* Le contenu est déjà affiché ci-dessus */}
          </div>
        )}
      </div>

      {/* Section II : Dynamiques */}
      <div className="bg-white rounded-2xl border p-6 mb-6 shadow-sm" style={{ borderColor: '#E8E0D8' }}>
        <SectionHeader title="II. Ce que vos réponses révèlent" section="dynamiques" />
        
        {expandedSections.dynamiques && (
          <div className="pt-4 space-y-4">
            {(report?.dynamiques || [
              { 
                titre: "Le corps comme obstacle", 
                description: "Le corps envoie un signal d'alerte qui est traité comme un problème à reporter, pas comme une information à écouter immédiatement.",
                extrait: "J'ai mal au dos mais je continue à travailler, je verrai ce soir"
              },
              { 
                titre: "L'intuition comme non-fiable", 
                description: "Une expérience négative a mis en place une méfiance systématique envers toute décision non-rationnelle.",
                extrait: "Une fois j'ai suivi mon instinct et c'était une erreur, depuis je préfère analyser"
              }
            ]).map((dyn, index) => (
              <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: '#F5F0EA' }}>
                <h4 className="font-medium mb-2" style={{ color: '#1A1209' }}>{dyn.titre}</h4>
                <p className="text-sm mb-2" style={{ color: '#666' }}>{dyn.description}</p>
                <p className="text-xs italic" style={{ color: '#888' }}>
                  Extrait : "{dyn.extrait}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section III : Forces */}
      <div className="bg-white rounded-2xl border p-6 mb-6 shadow-sm" style={{ borderColor: '#E8E0D8' }}>
        <SectionHeader title="III. Forces détectées" section="forces" />
        
        {expandedSections.forces && (
          <div className="pt-4">
            <ul className="space-y-2" style={{ color: '#666' }}>
              {(report?.forces || [
                "Tu as déjà identifié que ton mode de fonctionnement actuel pose problème (lucidité)",
                "Tu es rigoureux et structuré — ces qualités vont aider à intégrer des pratiques régulières",
                "Tu marches quotidiennement — c'est une porte d'entrée corporelle déjà ouverte"
              ]).map((force, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span style={{ color: '#C96442' }}>•</span>
                  <span>{force}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Section IV : Axes prioritaires */}
      <div className="bg-white rounded-2xl border p-6 mb-6 shadow-sm" style={{ borderColor: '#E8E0D8' }}>
        <SectionHeader title="IV. Axes de développement prioritaires" section="axes" />
        
        {expandedSections.axes && (
          <div className="pt-4 space-y-4">
            {(report?.axes || [
              {
                priorite: 1,
                dimension: "Not-Distracting",
                exercice: "3 fois par jour, pose une alarme. Quand elle sonne, note UNE sensation corporelle présente. Pas d'action requise, juste noter.",
                frequence: "3×/jour",
                duree: "30 secondes"
              },
              {
                priorite: 2,
                dimension: "Self-Regulation",
                exercice: "Cohérence cardiaque 5 min le matin avant le premier écran. Appli Respirelax ou respiration 5/5.",
                frequence: "1×/jour",
                duree: "5 minutes"
              },
              {
                priorite: 3,
                dimension: "Trusting",
                exercice: "Une fois cette semaine, prends une décision mineure en te basant uniquement sur ce que ton ventre te dit.",
                frequence: "1×/semaine",
                duree: "Durée variable"
              }
            ]).map((axe) => (
              <div key={axe.priorite} className="p-4 rounded-xl" style={{ backgroundColor: '#F5F0EA' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: '#C96442' }}>
                    {axe.priorite}
                  </div>
                  <h4 className="font-semibold" style={{ color: '#1A1209' }}>{axe.dimension}</h4>
                </div>
                <p className="text-sm mb-2" style={{ color: '#666' }}>
                  <strong>Exercice :</strong> {axe.exercice}
                </p>
                <p className="text-xs" style={{ color: '#888' }}>
                  Fréquence : {axe.frequence} · Durée : {axe.duree}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section V : Conseils généraux */}
      <div className="bg-white rounded-2xl border p-6 mb-6 shadow-sm" style={{ borderColor: '#E8E0D8' }}>
        <SectionHeader title="V. Conseils généraux" section="conseils" />
        
        {expandedSections.conseils && (
          <div className="pt-4">
            <ul className="space-y-3" style={{ color: '#666' }}>
              {(report?.conseils || [
                "Le travail n'est pas de devenir moins rationnel — c'est de rouvrir progressivement le registre corporel en parallèle",
                "Ne pas chercher à 'comprendre' tes sensations avant de les ressentir — le comprendre vient après, pas avant",
                "Le corps ne ment pas, il faut juste apprendre son langage — commence par noter sans juger",
                "Petites pratiques quotidiennes > grandes séances occasionnelles — la régularité construit la plasticité"
              ]).map((conseil, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-lg">💡</span>
                  <span>{conseil}</span>
                </li>
              ))}
            </ul>

            {/* Recommandations quotidiennes */}
            <div className="mt-6 space-y-4">
              <h4 className="font-medium" style={{ color: '#1A1209' }}>📅 Recommandations quotidiennes</h4>
              
              <div className="grid gap-4">
                <div className="p-4 rounded-lg border" style={{ borderColor: '#E8E0D8' }}>
                  <div className="font-semibold mb-2" style={{ color: '#C96442' }}>🌅 MATIN — 5 minutes</div>
                  <p className="text-sm" style={{ color: '#666' }}>
                    <strong>Cohérence cardiaque :</strong> Avant le premier écran, 5 minutes de respiration 5/5. Pose une main sur le ventre, l'autre sur le cœur. Observer simplement.
                  </p>
                </div>

                <div className="p-4 rounded-lg border" style={{ borderColor: '#E8E0D8' }}>
                  <div className="font-semibold mb-2" style={{ color: '#C96442' }}>☀️ JOURNÉE — Moments opportunistes</div>
                  <p className="text-sm" style={{ color: '#666' }}>
                    <strong>Micro-pauses sensorielles :</strong> À chaque transition, 3 secondes d'attention sur une sensation (pieds au sol, épaules, respiration).
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#888' }}>5-10×/jour · 3-5 secondes</p>
                </div>

                <div className="p-4 rounded-lg border" style={{ borderColor: '#E8E0D8' }}>
                  <div className="font-semibold mb-2" style={{ color: '#C96442' }}>🌙 SOIR — 5 minutes</div>
                  <p className="text-sm" style={{ color: '#666' }}>
                    <strong>Body scan ou Journal somatique :</strong> Allongé, balayage tête → pieds. Ou sur papier : "Aujourd'hui, mon corps a ressenti..." (3 sensations + 1 émotion).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section VI : Ressources */}
      <div className="bg-white rounded-2xl border p-6 mb-6 shadow-sm" style={{ borderColor: '#E8E0D8' }}>
        <SectionHeader title="VI. Ressources pour approfondir" section="ressources" />
        
        {expandedSections.ressources && (
          <div className="pt-4 space-y-6">
            {/* Livre */}
            <div>
              <h4 className="font-medium mb-3" style={{ color: '#1A1209' }}>📖 Livre phare</h4>
              <div className="p-4 rounded-lg border" style={{ borderColor: '#E8E0D8' }}>
                <div className="font-semibold" style={{ color: '#1A1209' }}>
                  {report?.livre?.titre || "Waking the Tiger"} — {report?.livre?.auteur || "Peter Levine"}
                </div>
                <p className="text-sm mt-2" style={{ color: '#666' }}>
                  {report?.livre?.description || "Fondateur du Somatic Experiencing. Méthode concrète pour réactiver le registre instinctif via le corps, particulièrement adaptée aux profils à dominante cognitive."}
                </p>
              </div>
            </div>

            {/* Concepts */}
            <div>
              <h4 className="font-medium mb-3" style={{ color: '#1A1209' }}>🧠 Concepts clés</h4>
              <div className="grid grid-cols-2 gap-3">
                {(report?.concepts || [
                  { icon: "🧭", nom: "Théorie polyvagale", desc: "Pourquoi le corps se fige sous stress" },
                  { icon: "💭", nom: "Marqueurs somatiques", desc: "Signaux corporels qui guident les décisions" },
                  { icon: "🎯", nom: "Somatic Experiencing", desc: "Méthode pour reconnecter corps et psyché" },
                  { icon: "🎈", nom: "Focusing", desc: "Technique pour écouter le 'sens corporel'" }
                ]).map((concept, index) => (
                  <div key={index} className="p-3 rounded-lg" style={{ backgroundColor: '#F5F0EA' }}>
                    <div className="text-2xl mb-1">{concept.icon}</div>
                    <div className="font-medium text-sm" style={{ color: '#1A1209' }}>{concept.nom}</div>
                    <div className="text-xs" style={{ color: '#888' }}>{concept.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Praticien */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F0EA' }}>
              <h4 className="font-medium mb-2" style={{ color: '#1A1209' }}>🎧 Type de praticien recommandé</h4>
              <p className="text-sm" style={{ color: '#666' }}>
                {report?.praticien || "Thérapie somatique (Somatic Experiencing) ou psychothérapie corporelle. Cherche un praticien certifié SE ou en thérapie Focusing."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex flex-wrap gap-3 justify-center mt-8 mb-12">
        <button 
          onClick={onDownloadPDF}
          className="px-6 py-3 rounded-xl font-medium text-white transition-colors"
          style={{ backgroundColor: '#1A1209' }}
        >
          📄 Télécharger PDF
        </button>
        <button 
          onClick={onChat}
          className="px-6 py-3 rounded-xl font-medium transition-colors"
          style={{ border: '1px solid #E8E0D8', color: '#666' }}
        >
          💬 Discuter avec Doctor Chat
        </button>
        <button 
          onClick={onViewProfile}
          className="px-6 py-3 rounded-xl font-medium transition-colors"
          style={{ border: '1px solid #E8E0D8', color: '#666' }}
        >
          👤 Voir dans mon Profil
        </button>
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs" style={{ color: '#888' }}>
        <p>
          *Re-Boot — Audit cognitif personnel | {new Date().toLocaleDateString('fr-FR')}*
        </p>
        <p className="mt-2">
          Disclaimer : Audit Re-Boot with Doctor Claude est un audit propulsé par l'intelligence artificielle. 
          Cet audit est à titre informatif et ne remplace pas une consultation chez un psychologue praticien agréé.
        </p>
      </div>
    </div>
  );
}
