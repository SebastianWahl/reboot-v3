import { useState } from 'react';

// Données réelles de Sebastian Wahl (26 mars 2026)
const REAL_ANSWERS = {
  1: { note: 2, contexte: "Je perçois les tensions physiques mais seulement quand elles deviennent douloureuses. Je ne fais pas attention aux signaux faibles.", aide: "Les 10000 pas par jour, les étirements 3 fois par jour", blocage: "Smartphone pendant la marche, être trop dans ma tête, habitué au rythme" },
  2: { note: 1, contexte: "Je me fige et attends que ça passe. Je subis plutôt que je ne gère activement.", aide: "Attendre que l'orage passe...", blocage: "Réaction passive, peur de ressentir, refuge mental" },
  3: { note: 1, contexte: "Je n'ai aucune pratique d'ancrage réelle. Même la marche est colonisée par le smartphone.", aide: "La marche... mais avec smartphone", blocage: "Smartphone, aucune pratique de pleine conscience, pas de méditation" },
  4: { note: 1, contexte: "Je ne localise pas mes émotions. Stress = cœur + gorge. Pour la joie, je ne sais pas.", aide: "Aucune pratique spécifique", blocage: "Manque de vocabulaire corporel, déconnexion corps-émotion" },
  5: { note: 1, contexte: "Je ne fais pas confiance à mon intuition. Elle m'a trompé dans le passé.", aide: "Aucune — je privilégie l'analyse rationnelle", blocage: "Expériences passées négatives, confiance brisée en l'intuition" },
  6: { note: 2, contexte: "Je laisse passer l'orage. Je ne fais rien activement pour réguler.", aide: "Le temps qui passe", blocage: "Attitude passive, pas de techniques de régulation corporelle" },
  7: { note: 1, contexte: "Je sais que j'ai une mauvaise posture et des tensions, mais je ne change pas mon comportement.", aide: "Les étirements quand j'y pense", blocage: "Désattention chronique, priorités ailleurs (travail, écrans)" },
  8: { note: 1, contexte: "Je ne me souviens pas d'intuitions corporelles fiables. Je privilégie l'analyse.", aide: "L'analyse rationnelle", blocage: "Méfiance envers les signaux non-verbaux, trauma de l'intuition" },
  9: { note: 2, contexte: "Je distingue la fatigue des tensions physiques liées aux écrans, mais je ne fais pas attention aux autres signaux.", aide: "Le ressenti physique quand je fais attention", blocage: "Habitude de l'état actuel, manque de scan corporel régulier" },
  10: { note: 2, contexte: "Je ne suis pas méchant avec mon corps, mais je ne le chouchoute pas non plus. Je l'ignore.", aide: "La conscience que je devrais prendre soin de moi", blocage: "Déconnection, manque de tendresse envers soi" },
  11: { note: 1, contexte: "Je travaille seul depuis chez moi. J'ai peu d'interactions sociales. Je ne sais pas si je reste connecté à mon corps.", aide: "Les rares moments avec ma mère et mon frère", blocage: "Isolement, travail à domicile, arrêt des interactions sociales" },
  12: { note: 2, contexte: "J'utilise principalement la cognition. Le corps est une source d'information très secondaire.", aide: "Les tensions physiques comme signal de stress", blocage: "Dominance cognitive, méfiance envers l'intuition corporelle" }
};

const QUESTIONS = [
  { id: 1, dimension: "Noticing", text: "Perçois-tu les signaux que t'envoie ton corps (fatigue, tensions, faim, inconfort) ?" },
  { id: 2, dimension: "Not-Distracting", text: "Arrives-tu à rester avec une sensation corporelle désagréable sans chercher à la fuir ?" },
  { id: 3, dimension: "Attention Regulation", text: "Peux-tu ramener volontairement ton attention sur tes sensations corporelles ?" },
  { id: 4, dimension: "Emotional Awareness", text: "Arrives-tu à localiser tes émotions dans ton corps — où se manifestent-elles physiquement ?" },
  { id: 5, dimension: "Trusting", text: "Fais-tu confiance à ton intuition, ton gut feeling, dans tes décisions quotidiennes ?" },
  { id: 6, dimension: "Self-Regulation", text: "Quand tu es submergé par une émotion intense, arrives-tu à retrouver un état de calme corporel ?" },
  { id: 7, dimension: "Body Listening", text: "Quand ton corps te signale quelque chose, lui donnes-tu de l'attention ?" },
  { id: 8, dimension: "Intuition", text: "As-tu déjà eu des intuitions corporelles qui se sont révélées justes ?" },
  { id: 9, dimension: "Interoceptive Clarity", text: "Arrives-tu à distinguer clairement faim, fatigue, tension nerveuse, excitation ?" },
  { id: 10, dimension: "Self-Compassion", text: "Quand ton corps est fatigué ou en difficulté, lui parles-tu avec bienveillance ?" },
  { id: 11, dimension: "Embodied Presence", text: "Quand tu interagis avec d'autres, restes-tu connecté à tes sensations corporelles ?" },
  { id: 12, dimension: "Somatic Integration", text: "Utilises-tu tes sensations corporelles comme source d'information dans ta vie quotidienne ?" }
];

const DYNAMICS = [
  {
    title: "1. L'intuition invalidée",
    citation: "Gut feeling pas fiable selon lui... quand il s'écoute, ça donne souvent de mauvais résultats.",
    description: "Cette méfiance a créé un blocage profond : le corps n'est pas considéré comme une source d'information valable. C'est une protection qui, au fil du temps, a coupé l'accès à l'intelligence somatique."
  },
  {
    title: "2. Le corps fantôme dans les interactions",
    citation: "Travail depuis chez soi amplifie l'isolement. A arrêté de relancer ses amis depuis ~1 an et ne sort plus.",
    description: "Le contexte d'isolement (travail à domicile, arrêt des relations sociales depuis le deuil) a supprimé les occasions d'être en présence relationnelle ancrée. Le corps existe dans un vide social, sans miroir ni feedback externe."
  },
  {
    title: "3. La fuite cognitive comme régulation",
    citation: "Se fige, se laisse envahir par l'émotion, attend que l'orage passe avant de réagir.",
    description: "Ta stratégie face au stress est passive : attendre. Il n'y a pas de pratique active de régulation corporelle (respiration, ancrage, mouvement). Le corps subit plutôt qu'il n'agit. Le refuge mental remplace l'action somatique."
  },
  {
    title: "4. Le smartphone comme fuite du corps",
    citation: "Utilise le smartphone pendant la balade — pas d'ancrage réel.",
    description: "Même les pratiques potentiellement corporelles (marche, étirements) sont colonisées par la distraction mentale. Le smartphone empêche l'ancrage réel et maintient la dissociation corps-esprit."
  }
];

const STRENGTHS = [
  { title: "Conscience des tensions physiques", description: "Tu sais que tu as des tensions (dos, cou, yeux). C'est déjà une ouverture vers le dialogue corporel." },
  { title: "Discipline des 10000 pas", description: "Tu essaies de marcher 10000 pas par jour et de t'étirer 3x/jour. C'est une base solide à transformer en pratique consciente." },
  { title: "Honnêteté lucide", description: "Tu décris ton profil sans minimisation. Cette lucidité est une force rare — elle accélèrera le changement quand tu décideras de travailler là-dessus." }
];

const EXERCISES = [
  {
    title: "1. Marche sans écran (Trusting + Body Listening)",
    description: "Pendant tes 10000 pas quotidiens, laisse le smartphone à la maison OU éteins l'écran. Laisse ton corps décider du rythme, de la direction, des pauses. Écoute les sensations : chaleur, tension, légèreté.",
    frequency: "6j/7",
    duration: "10-20 min minimum",
    signal: "Sensation de « retour au corps » après la marche"
  },
  {
    title: "2. Check-in corporel 3x/jour (Noticing)",
    description: "3 alarmes quotidiennes (ex: 10h, 14h, 18h). Stop tout. Scan rapide : pieds (contact avec le sol) → ventre (tension/détente) → mains (chaleur/sensation) → respiration (profondeur).",
    frequency: "3x/jour",
    duration: "2 minutes max",
    signal: "Capacité à nommer une sensation précise"
  },
  {
    title: "3. Respiration 4-7-8 avant repas (Self-Regulation)",
    description: "Avant chaque repas, 5 cycles : inspire 4 secondes → retiens 7 secondes → expire 8 secondes. Cela active le système nerveux parasympathique et prépare le corps à la digestion.",
    frequency: "Avant chaque repas",
    duration: "1-2 minutes",
    signal: "Sensation de calme, faim naturelle ressentie"
  }
];

const ADVICE = [
  "Commencer microscopique : 30 secondes de respiration comptent plus que 30 minutes de méditation manquée. La fréquence prime sur la durée.",
  "Ne pas juger les sensations : Une tension n'est ni bonne ni mauvaise — c'est de l'information. Tu as appris à juger ton intuition ; ne reproduis pas ce pattern avec ton corps.",
  "Accepter la lenteur : Reconnecter un registre qui a été ignoré pendant des années prend du temps. Les progrès seront subtils avant d'être évidents.",
  "Célébrer les micro-victoires : Avoir conscience de sa respiration pendant 10 secondes EST une victoire. Ne minimise pas les petits pas."
];

const RECOMMENDATIONS = {
  matin: "Avant de sortir du lit : Check-in 2 min. Pieds sur le sol, ventre, mains, respiration. Pose la question : « Qu'est-ce que mon corps me dit ce matin ? »",
  journee: "3 micro-pauses de 30 secondes (alarmes). Respiration consciente. Scan rapide. Marche sans écran pour les 10000 pas.",
  soir: "Marche de 10 min sans écran avant de rentrer (ou après le travail). Rituel de transition corps-esprit. Étirements conscients avant le coucher."
};

const RESOURCES = {
  book: {
    title: "Waking the Tiger",
    author: "Peter Levine",
    why: "Ce livre explique pourquoi le corps se fige sous le stress (comme tu le décris) et comment le réactiver. C'est concret, pas ésotérique, et parfait pour un profil rationnel qui veut comprendre le mécanisme avant de pratiquer."
  },
  concepts: [
    "Marqueurs somatiques (Damasio) : Le corps 'pense' avant la tête. Nos décisions sont précédées de signaux physiques subtils.",
    "Théorie polyvagale (Porges) : Ton système nerveux évalue la sécurité en permanence. Les tensions chroniques signalent une activation de survie.",
    "Somatic Experiencing (Levine) : Le trauma (même mineur) se loge dans le corps. La réponse de 'fige et attends' est une réaction de survie.",
    "Focusing (Gendlin) : Technique simple pour apprendre à écouter le 'sens corporel' — cette vague intuition qui habite le corps."
  ],
  practitioner: "Somatic Experiencing Practitioner (SEP) — Pour travailler la réactivation du système instinctif et la déprogrammation de la réponse de fige."
};

export default function InstinctifReportSebastian({ onBack }) {
  const [openSections, setOpenSections] = useState({
    profil: true,
    dynamics: true,
    forces: true,
    axes: true,
    conseils: false,
    quotidien: false,
    ressources: false
  });

  // Calculer le score
  let total = 0;
  QUESTIONS.forEach(q => {
    total += REAL_ANSWERS[q.id]?.note || 0;
  });
  const scoreGlobal = Math.round((total / 60) * 100);
  const scoreLabel = scoreGlobal < 30 ? 'Profil à développer' : scoreGlobal < 60 ? 'Profil intermédiaire' : 'Profil affirmé';

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: '#FAF7F2', fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#1a1209' }}>🫀 Audit Instinctif & Corporel</h1>
          <p className="text-gray-600">Basé sur tes réponses réelles du 26 mars 2026</p>
          <p className="text-xs text-gray-500 mt-1">Source : Re-Boot Audit des 4 Registres — Registre Instinctif (Q6-Q10)</p>
        </div>

        {/* Score Global */}
        <div 
          className="rounded-2xl p-8 text-center mb-6"
          style={{ 
            background: 'linear-gradient(135deg, #C96442, #e07b39)', 
            color: 'white' 
          }}
        >
          <p className="text-sm opacity-90 mb-1">Score Global · Audit Instinctif</p>
          <p className="text-5xl font-bold my-2">{scoreGlobal}/100</p>
          <p className="text-lg opacity-90">{scoreLabel}</p>
        </div>

        {/* I. Profil Global */}
        <div className="bg-white rounded-2xl border p-6 mb-4" style={{ borderColor: '#e8e0d8' }}>
          <div 
            className="flex justify-between items-center cursor-pointer mb-4"
            onClick={() => toggleSection('profil')}
          >
            <h2 className="font-semibold text-lg" style={{ color: '#1a1209' }}>I. Profil Global — 12 Dimensions</h2>
            <span className="text-sm">{openSections.profil ? '▼' : '▶'}</span>
          </div>
          
          {openSections.profil && (
            <div>
              <div className="space-y-2 mb-6">
                {QUESTIONS.map(q => {
                  const note = REAL_ANSWERS[q.id]?.note || 0;
                  const pct = (note / 5) * 100;
                  const color = pct < 40 ? '#c0392b' : pct < 70 ? '#C96442' : '#4a7c59';
                  return (
                    <div key={q.id} className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#f0ebe4' }}>
                      <span className="text-sm">{q.dimension}</span>
                      <span className="font-bold text-sm" style={{ color }}>{note}/5</span>
                    </div>
                  );
                })}
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm">
                <p className="font-semibold mb-2">Synthèse :</p>
                <p className="text-gray-700">
                  Ton profil instinctif montre une déconnexion marquée du corps comme source d'information 
                  et d'intelligence. Tu perçois certains signaux (tensions physiques) mais tu ne leur donnes 
                  pas de crédit dans ta prise de décision. L'intuition est remise en cause suite à des 
                  expériences passées, et le refuge cognitif a remplacé l'ancrage somatique.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* II. Dynamiques */}
        <div className="bg-white rounded-2xl border p-6 mb-4" style={{ borderColor: '#e8e0d8' }}>
          <div 
            className="flex justify-between items-center cursor-pointer mb-4"
            onClick={() => toggleSection('dynamics')}
          >
            <h2 className="font-semibold text-lg" style={{ color: '#1a1209' }}>II. Dynamiques Identifiées</h2>
            <span className="text-sm">{openSections.dynamics ? '▼' : '▶'}</span>
          </div>
          
          {openSections.dynamics && (
            <div className="space-y-4">
              {DYNAMICS.map((dyn, idx) => (
                <div 
                  key={idx}
                  className="rounded-xl p-4 text-sm"
                  style={{ 
                    background: idx === 0 ? '#fef2f2' : idx === 1 ? '#fff7ed' : idx === 2 ? '#fefce8' : '#f3f4f6',
                    borderLeft: `4px solid ${idx === 0 ? '#ef4444' : idx === 1 ? '#f97316' : idx === 2 ? '#eab308' : '#6b7280'}`
                  }}
                >
                  <p className="font-semibold mb-2" style={{ color: idx === 0 ? '#991b1b' : idx === 1 ? '#9a3412' : idx === 2 ? '#854d0e' : '#374151' }}>
                    {dyn.title}
                  </p>
                  <p className="text-gray-700 mb-2 italic">
                    Citation : "{dyn.citation}"
                  </p>
                  <p className="text-gray-600">{dyn.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* III. Forces */}
        <div className="bg-white rounded-2xl border p-6 mb-4" style={{ borderColor: '#e8e0d8' }}>
          <div 
            className="flex justify-between items-center cursor-pointer mb-4"
            onClick={() => toggleSection('forces')}
          >
            <h2 className="font-semibold text-lg" style={{ color: '#1a1209' }}>III. Forces Détectées</h2>
            <span className="text-sm">{openSections.forces ? '▼' : '▶'}</span>
          </div>
          
          {openSections.forces && (
            <div className="space-y-3">
              {STRENGTHS.map((strength, idx) => (
                <div key={idx} className="bg-green-50 rounded-xl p-4 text-sm border-l-4 border-green-500">
                  <p className="font-semibold text-green-800 mb-1">✓ {strength.title}</p>
                  <p className="text-green-700">{strength.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* IV. Axes Prioritaires */}
        <div className="bg-white rounded-2xl border p-6 mb-4" style={{ borderColor: '#e8e0d8' }}>
          <div 
            className="flex justify-between items-center cursor-pointer mb-4"
            onClick={() => toggleSection('axes')}
          >
            <h2 className="font-semibold text-lg" style={{ color: '#1a1209' }}>IV. Axes Prioritaires — 3 Exercices</h2>
            <span className="text-sm">{openSections.axes ? '▼' : '▶'}</span>
          </div>
          
          {openSections.axes && (
            <div className="space-y-4">
              {EXERCISES.map((ex, idx) => (
                <div key={idx} className="rounded-xl p-4 text-sm border-l-4" style={{ background: '#fff7ed', borderLeftColor: '#f97316' }}>
                  <p className="font-bold text-orange-900 mb-2">{ex.title}</p>
                  <p className="text-gray-700 mb-3">{ex.description}</p>
                  <p className="text-xs text-gray-600">
                    <strong>Fréquence :</strong> {ex.frequency} · <strong>Durée :</strong> {ex.duration}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Signal de réussite :</strong> {ex.signal}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* V. Conseils */}
        <div className="bg-white rounded-2xl border p-6 mb-4" style={{ borderColor: '#e8e0d8' }}>
          <div 
            className="flex justify-between items-center cursor-pointer mb-4"
            onClick={() => toggleSection('conseils')}
          >
            <h2 className="font-semibold text-lg" style={{ color: '#1a1209' }}>V. Conseils Généraux</h2>
            <span className="text-sm">{openSections.conseils ? '▼' : '▶'}</span>
          </div>
          
          {openSections.conseils && (
            <ul className="space-y-3 text-sm">
              {ADVICE.map((advice, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold">→</span>
                  <span className="text-gray-700">{advice}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* VI. Recommandations Quotidiennes */}
        <div className="bg-white rounded-2xl border p-6 mb-4" style={{ borderColor: '#e8e0d8' }}>
          <div 
            className="flex justify-between items-center cursor-pointer mb-4"
            onClick={() => toggleSection('quotidien')}
          >
            <h2 className="font-semibold text-lg" style={{ color: '#1a1209' }}>VI. Recommandations Quotidiennes</h2>
            <span className="text-sm">{openSections.quotidien ? '▼' : '▶'}</span>
          </div>
          
          {openSections.quotidien && (
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="font-semibold text-blue-900 mb-1">🌅 Matin</p>
                <p className="text-blue-800 text-sm">{RECOMMENDATIONS.matin}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="font-semibold text-blue-900 mb-1">☀️ Journée</p>
                <p className="text-blue-800 text-sm">{RECOMMENDATIONS.journee}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="font-semibold text-blue-900 mb-1">🌙 Soir</p>
                <p className="text-blue-800 text-sm">{RECOMMENDATIONS.soir}</p>
              </div>
            </div>
          )}
        </div>

        {/* VII. Ressources */}
        <div className="bg-white rounded-2xl border p-6 mb-8" style={{ borderColor: '#e8e0d8' }}>
          <div 
            className="flex justify-between items-center cursor-pointer mb-4"
            onClick={() => toggleSection('ressources')}
          >
            <h2 className="font-semibold text-lg" style={{ color: '#1a1209' }}>VII. Ressources</h2>
            <span className="text-sm">{openSections.ressources ? '▼' : '▶'}</span>
          </div>
          
          {openSections.ressources && (
            <div className="space-y-4 text-sm">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="font-bold text-amber-900 mb-2">📚 Livre recommandé pour ton profil</p>
                <p className="text-lg font-semibold text-amber-800 mb-1">"{RESOURCES.book.title}" — {RESOURCES.book.author}</p>
                <p className="text-amber-700 text-xs mb-2">Fondateur du Somatic Experiencing</p>
                <p className="text-gray-700">{RESOURCES.book.why}</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold text-gray-900 mb-2">🎓 4 concepts clés à comprendre</p>
                <ul className="space-y-2">
                  {RESOURCES.concepts.map((concept, idx) => (
                    <li key={idx} className="text-gray-700">{concept}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold text-gray-900 mb-2">🤝 Type de praticien recommandé</p>
                <p className="text-gray-700">{RESOURCES.practitioner}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-4">
            Généré le {new Date().toLocaleDateString('fr-FR')} · Basé sur tes réponses Re-Boot du 26 mars 2026
          </p>
          {onBack && (
            <button 
              onClick={onBack}
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{ background: '#C96442' }}
            >
              ← Retour au Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
