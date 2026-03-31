import TestQuestion from './TestQuestion';
import TestProgress from './TestProgress';
import TestRecap from './TestRecap';
import TestLoading from './TestLoading';
import TestReport from './TestReport';
import { MENTAL_QUESTIONS, calculateMentalScore } from '../../lib/mentalConfigs';
import { loadTestData } from '../../lib/testDataLoader';
import { useTestForm } from '../../hooks/useTestForm';

const SYSTEM_PROMPT = `Tu es Doctor Claude, analyste cognitif spécialisé en intelligence mentale et processus de pensée.

MISSION: Générer un rapport d'audit Mental & Cognitif structuré en 7 sections.

STRUCTURE DU RAPPORT (format JSON strict):
{
  "profil_global": {"score": number, "niveau": string, "dimensions": [{"nom": string, "score": number, "max": 5}], "synthese": string},
  "dynamiques": [{"titre": string, "citation": string, "description": string}],
  "forces": [{"titre": string, "description": string}],
  "axes_prioritaires": [{"titre": string, "exercice": string, "frequence": string, "duree": string, "signal_reussite": string}],
  "conseils_generaux": [string],
  "recommandations_quotidiennes": {"matin": string, "journee": string, "soir": string},
  "ressources": {"livre": {"titre": string, "auteur": string, "pourquoi": string}, "concepts": [string], "praticien": string}
}

CONTRAINTES:
- Longueur: 800-1200 mots
- Ton: bienveillant, précis, actionnable, jamais moralisateur
- Personnalisation: CITER des extraits des réponses textuelles
- Exercices: concrets, courts (1-10 min), avec fréquence+durée précises

IMPORTANT: Retourne UNIQUEMENT le JSON valide, sans texte avant ou après, sans balises markdown.`;

const DIMENSIONS = [
  'Structuration Cognitive', 'Planification & Exécution', 'Gestion du Feedback', 'Prise de Décision',
  'Apprentissage Continu', 'Pensée Critique', 'Mémoire de Travail', 'Flexibilité Mentale',
  'Focus & Concentration', 'Pensée Stratégique', 'Créativité Cognitive', 'Métacognition'
];

function formatUserMessage(answers, scores) {
  let message = `Génère le rapport d'Audit Mental & Cognitif.\n\nSCORES PAR DIMENSION (sur 5) :\n`;
  DIMENSIONS.forEach((dim, index) => {
    const questionId = `mental_${String(index + 1).padStart(2, '0')}`;
    message += `- ${dim}: ${scores.dimensions?.[dim] || 0}/5\n`;
  });
  message += `\nSCORE GLOBAL : ${scores.scoreSur100}/100\nINTERPRÉTATION : ${scores.interpretation}\n\nRÉPONSES TEXTUELLES DÉTAILLÉES :\n`;
  DIMENSIONS.forEach((dim, index) => {
    const questionId = `mental_${String(index + 1).padStart(2, '0')}`;
    const answer = answers?.[questionId];
    if (answer && (answer.contexte || answer.exemple || answer.reaction)) {
      message += `\n### ${dim.toUpperCase()} (Score: ${scores.dimensions?.[dim] || 0}/5)\n`;
      message += `Contexte: ${answer.contexte || 'Non renseigné'}\nExemple: ${answer.exemple || 'Non renseigné'}\nRéaction: ${answer.reaction || 'Non renseigné'}\n`;
    }
  });
  message += `\nGénère le rapport JSON avec les 7 sections demandées.`;
  return message;
}

function generateFallbackReport(scores) {
  const scoreValue = scores.scoreSur100 || 0;
  return {
    profil_global: {
      score: scoreValue,
      niveau: scoreValue < 30 ? 'Profil à construire' : scoreValue < 50 ? 'Profil intermédiaire' : 'Profil affirmé',
      dimensions: Object.entries(scores.dimensions || {}).map(([name, score]) => ({ nom: name, score, max: 5 })),
      synthese: `Votre profil mental montre des capacités cognitives ${(scores.interpretation || '').toLowerCase()}.`
    },
    dynamiques: [{ titre: "Analyse en cours", citation: "Vos réponses sont analysées.", description: "Une analyse approfondie est en préparation." }],
    forces: [{ titre: "Curiosité pour la connaissance de soi", description: "Votre participation montre une volonté de mieux comprendre votre fonctionnement mental." }],
    axes_prioritaires: [{ titre: "Structurer sa pensée", exercice: "Méthode des 5W pour structurer un problème chaque jour", frequence: "1×/jour", duree: "5 minutes", signal_reussite: "Décomposer un problème en 5 questions claires" }],
    conseils_generaux: ["Les capacités cognitives se développent avec la pratique", "Soyez patient et bienveillant envers vous-même"],
    recommandations_quotidiennes: { matin: "Identifier une décision à structurer en 3 étapes", journee: "Pause 5 min pour observer un pattern de pensée", soir: "Écrire 3 lignes : problème, méthode, résultat" },
    ressources: { livre: { titre: "Thinking, Fast and Slow", auteur: "Daniel Kahneman", pourquoi: "Le livre fondateur sur les deux systèmes de pensée" }, concepts: ["Système 1 vs Système 2", "Biais cognitifs", "Charge cognitive"], praticien: "Coaching cognitif ou thérapie métacognitive" }
  };
}

export default function MentalTest({ user, onComplete, onCancel }) {
  const {
    status, currentQuestion, answers, report,
    setCurrentQuestion, setStatus,
    handleAnswer, handleNext, handlePrevious, handleSubmit, handleStart, handleExit,
  } = useTestForm({
    questions: MENTAL_QUESTIONS,
    calculateScore: calculateMentalScore,
    systemPrompt: SYSTEM_PROMPT,
    testType: 'mental',
    storageKey: 'mental-test-draft',
    formatUserMessage,
    generateFallbackReport,
    user,
    onComplete,
    onCancel,
  });

  if (status === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl border p-10 text-center shadow-lg" style={{ borderColor: '#E8E0D8' }}>
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl" style={{ backgroundColor: '#F5F0EA' }}>🧠</div>
            <h1 className="text-3xl font-semibold mb-4" style={{ fontFamily: "'EB Garamond', Georgia, serif", color: '#1A1209' }}>Audit Mental & Cognitif</h1>
            <p className="text-base mb-6 max-w-lg mx-auto" style={{ color: '#666' }}>Évalue 12 dimensions de ton fonctionnement mental : structuration, planification, créativité, métacognition...</p>
            <div className="flex justify-center gap-6 mb-8 text-sm" style={{ color: '#888' }}>
              <span>⏱️ 20-25 minutes</span><span>📝 12 questions</span><span>⭐ Note + réponses libres</span>
            </div>
            <div className="text-left p-4 rounded-lg mb-8 text-sm" style={{ backgroundColor: '#F5F0EA', borderLeft: '3px solid #C96442', color: '#666' }}>
              <strong>Important :</strong> Ce test évalue comment tu penses, planifies et décides. Sois honnête.
            </div>
            <div className="flex gap-4 justify-center">
              <button onClick={handleExit} className="px-6 py-3 rounded-xl font-medium" style={{ border: '1px solid #E8E0D8', color: '#666' }}>Retour</button>
              <button onClick={handleStart} className="px-8 py-3 rounded-xl font-medium text-white" style={{ backgroundColor: '#1A1209' }}>Commencer l'audit</button>
            </div>
            {import.meta.env.DEV && (
              <div className="mt-6 pt-6 border-t" style={{ borderColor: '#F0EBE4' }}>
                <p className="text-xs text-[#888] mb-3">Mode développement</p>
                <button onClick={() => { loadTestData('mental'); alert('Données de test chargées !'); }} className="text-xs px-4 py-2 rounded-lg" style={{ backgroundColor: '#F5F0EA', color: '#666', border: '1px dashed #C96442' }}>🧪 Charger données de test</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (status === 'question') {
    const question = MENTAL_QUESTIONS[currentQuestion];
    const currentAnswer = answers[question.id] || { note: null, contexte: '', exemple: '', reaction: '' };
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border p-8 shadow-lg" style={{ borderColor: '#E8E0D8' }}>
            <TestProgress current={currentQuestion + 1} total={MENTAL_QUESTIONS.length} percent={((currentQuestion + 1) / MENTAL_QUESTIONS.length) * 100} />
            <TestQuestion question={question} answer={currentAnswer} onAnswer={handleAnswer} onNext={handleNext} onPrevious={handlePrevious} isFirst={currentQuestion === 0} isLast={currentQuestion === MENTAL_QUESTIONS.length - 1} />
          </div>
        </div>
      </div>
    );
  }

  if (status === 'recap') {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border p-8 shadow-lg" style={{ borderColor: '#E8E0D8' }}>
            <TestRecap answers={answers} questions={MENTAL_QUESTIONS} onEdit={(index) => { setCurrentQuestion(index); setStatus('question'); }} onSubmit={handleSubmit} onCancel={() => setStatus('question')} />
          </div>
        </div>
      </div>
    );
  }

  if (status === 'loading') return <TestLoading />;

  if (status === 'report' && report) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="max-w-4xl mx-auto">
          <TestReport report={report} onDownloadPDF={() => alert('Export PDF en préparation...')} onChat={() => onComplete?.({ goToChat: true, report })} onViewProfile={() => onComplete?.({ goToProfile: true })} />
        </div>
      </div>
    );
  }

  return null;
}
