import TestQuestion from './TestQuestion';
import TestProgress from './TestProgress';
import TestRecap from './TestRecap';
import TestLoading from './TestLoading';
import TestReport from './TestReport';
import { EMOTIONNEL_QUESTIONS, calculateEmotionnelScore } from '../../lib/emotionnelConfigs';
import { loadTestData } from '../../lib/testDataLoader';
import { useTestForm } from '../../hooks/useTestForm';

const SYSTEM_PROMPT = `Tu es Doctor Claude, analyste cognitif spécialisé en intelligence émotionnelle et relations interpersonnelles.

MISSION: Générer un rapport d'audit Émotionnel & Relationnel structuré en 7 sections.

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
- Ton: bienveillant, empathique, actionnable, jamais moralisateur
- Personnalisation: CITER des extraits des réponses textuelles
- Exercices: concrets, courts (1-10 min), avec fréquence+durée précises
- Inclure des exercices de régulation émotionnelle

IMPORTANT: Retourne UNIQUEMENT le JSON valide, sans texte avant ou après, sans balises markdown.`;

const DIMENSIONS = [
  'Vocabulaire Émotionnel', 'Régulation Émotionnelle', 'Sécurité Relationnelle', 'Empathie Réciproque',
  'Expression Émotionnelle', 'Gestion des Conflits', 'Intimité Émotionnelle', 'Réparation Relationnelle',
  'Boundaries Émotionnelles', 'Soutien Émotionnel', 'Authenticité Relationnelle', 'Cohérence Émotionnelle'
];

function formatUserMessage(answers, scores) {
  let message = `Génère le rapport d'Audit Émotionnel & Relationnel.\n\nSCORES PAR DIMENSION (sur 5) :\n`;
  DIMENSIONS.forEach((dim, index) => {
    const questionId = `emo_${String(index + 1).padStart(2, '0')}`;
    message += `- ${dim}: ${scores.dimensions?.[dim] || 0}/5\n`;
  });
  message += `\nSCORE GLOBAL : ${scores.scoreSur100}/100\nINTERPRÉTATION : ${scores.interpretation}\n\nRÉPONSES TEXTUELLES DÉTAILLÉES :\n`;
  DIMENSIONS.forEach((dim, index) => {
    const questionId = `emo_${String(index + 1).padStart(2, '0')}`;
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
      synthese: `Votre profil émotionnel montre une intelligence émotionnelle ${(scores.interpretation || '').toLowerCase()}.`
    },
    dynamiques: [{ titre: "Analyse personnalisée en cours", citation: "Vos réponses sont en cours d'analyse.", description: "Une analyse approfondie est en préparation." }],
    forces: [{ titre: "Curiosité pour la connaissance de soi", description: "Votre participation montre une volonté de mieux vous comprendre." }],
    axes_prioritaires: [{ titre: "Développer le vocabulaire émotionnel", exercice: "Utiliser la roue des émotions de Plutchik 3 fois par jour", frequence: "3×/jour", duree: "2 minutes", signal_reussite: "Nommer précisément une émotion" }],
    conseils_generaux: ["L'intelligence émotionnelle se développe avec la pratique", "Soyez patient et bienveillant envers vous-même"],
    recommandations_quotidiennes: { matin: "Identifier une émotion au réveil", journee: "3 pauses de 1 min pour vérifier son état", soir: "Écrire 3 lignes dans un journal émotionnel" },
    ressources: { livre: { titre: "Emotional Intelligence", auteur: "Daniel Goleman", pourquoi: "Le livre fondateur sur l'intelligence émotionnelle" }, concepts: ["Roue des émotions de Plutchik", "Régulation émotionnelle"], praticien: "TCC ou psychothérapie humaniste" }
  };
}

export default function EmotionnelTest({ user, onComplete, onCancel }) {
  const {
    status, currentQuestion, answers, report, isSubmitting,
    setCurrentQuestion, setStatus,
    handleAnswer, handleNext, handlePrevious, handleSubmit, handleStart, handleExit,
  } = useTestForm({
    questions: EMOTIONNEL_QUESTIONS,
    calculateScore: calculateEmotionnelScore,
    systemPrompt: SYSTEM_PROMPT,
    testType: 'emotionnel',
    storageKey: 'emotionnel-test-draft',
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
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl" style={{ backgroundColor: '#F5F0EA' }}>💞</div>
            <h1 className="text-3xl font-semibold mb-4" style={{ fontFamily: "'EB Garamond', Georgia, serif", color: '#1A1209' }}>Audit Émotionnel & Relationnel</h1>
            <p className="text-base mb-6 max-w-lg mx-auto" style={{ color: '#666' }}>Évalue 12 dimensions de ton intelligence émotionnelle : vocabulaire, régulation, empathie, expression, conflits...</p>
            <div className="flex justify-center gap-6 mb-8 text-sm" style={{ color: '#888' }}>
              <span>⏱️ 20-25 minutes</span><span>📝 12 questions</span><span>⭐ Note + réponses libres</span>
            </div>
            <div className="text-left p-4 rounded-lg mb-8 text-sm" style={{ backgroundColor: '#F5F0EA', borderLeft: '3px solid #C96442', color: '#666' }}>
              <strong>Important :</strong> Ce test explore comment tu nommes, gères et exprimes tes émotions. Sois honnête.
            </div>
            <div className="flex gap-4 justify-center">
              <button onClick={handleExit} className="px-6 py-3 rounded-xl font-medium" style={{ border: '1px solid #E8E0D8', color: '#666' }}>Retour</button>
              <button onClick={handleStart} className="px-8 py-3 rounded-xl font-medium text-white" style={{ backgroundColor: '#C96442' }}>Commencer l'audit</button>
            </div>
            {import.meta.env.DEV && (
              <div className="mt-6 pt-6 border-t" style={{ borderColor: '#F0EBE4' }}>
                <p className="text-xs text-[#888] mb-3">Mode développement</p>
                <button onClick={() => { loadTestData('emotionnel'); alert('Données de test chargées !'); }} className="text-xs px-4 py-2 rounded-lg" style={{ backgroundColor: '#F5F0EA', color: '#666', border: '1px dashed #C96442' }}>🧪 Charger données de test</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (status === 'question') {
    const question = EMOTIONNEL_QUESTIONS[currentQuestion];
    const currentAnswer = answers[question.id] || { note: null, contexte: '', exemple: '', reaction: '' };
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border p-8 shadow-lg" style={{ borderColor: '#E8E0D8' }}>
            <TestProgress current={currentQuestion + 1} total={EMOTIONNEL_QUESTIONS.length} percent={((currentQuestion + 1) / EMOTIONNEL_QUESTIONS.length) * 100} />
            <TestQuestion question={question} answer={currentAnswer} onAnswer={handleAnswer} onNext={handleNext} onPrevious={handlePrevious} isFirst={currentQuestion === 0} isLast={currentQuestion === EMOTIONNEL_QUESTIONS.length - 1} />
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
            <TestRecap answers={answers} questions={EMOTIONNEL_QUESTIONS} onEdit={(index) => { setCurrentQuestion(index); setStatus('question'); }} onSubmit={handleSubmit} onCancel={() => setStatus('question')} />
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
