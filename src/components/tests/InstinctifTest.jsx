import TestQuestion from './TestQuestion';
import TestProgress from './TestProgress';
import TestRecap from './TestRecap';
import TestLoading from './TestLoading';
import TestReport from './TestReport';
import { INSTINCTIF_QUESTIONS } from '../../lib/testConfigs';
import { calculateInstinctifScore } from '../../lib/testUtils';
import { loadTestData } from '../../lib/testDataLoader';
import { useTestForm } from '../../hooks/useTestForm';

const SYSTEM_PROMPT = `Tu es Doctor Claude, analyste cognitif spécialisé en conscience corporelle et intelligence somatique.

MISSION: Générer un rapport d'audit Instinctif & Corporel structuré en 7 sections.

STRUCTURE DU RAPPORT (format JSON strict):
{
  "profil_global": {
    "score": number,
    "niveau": "Profil à développer" | "Profil intermédiaire" | "Profil affirmé",
    "dimensions": [{"nom": string, "score": number, "max": 5}],
    "synthese": string
  },
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
- Exercices: concrets, courts (30sec-5min), avec fréquence+durée précises
- Adapter le livre au niveau (score <30=accessible, >50=avancé)

IMPORTANT: Retourne UNIQUEMENT le JSON valide, sans texte avant ou après, sans balises markdown.`;

function formatUserMessage(answers, scores) {
  const dimensions = [
    'noticing', 'not_distracting', 'attention_regulation', 'emotional_awareness',
    'trusting', 'self_regulation', 'body_listening', 'intuition',
    'interoceptive_clarity', 'self_compassion', 'embodied_presence', 'somatic_integration'
  ];

  let message = `Génère le rapport d'Audit Instinctif & Corporel.\n\nSCORES PAR DIMENSION (sur 5) :\n`;
  dimensions.forEach((dim, index) => {
    const questionId = `inst_${String(index + 1).padStart(2, '0')}`;
    message += `- ${dim}: ${scores.dimensions?.[dim] || 0}/5\n`;
  });
  message += `\nSCORE GLOBAL : ${scores.scoreSur100}/100\nINTERPRÉTATION : ${scores.interpretation}\n\nRÉPONSES TEXTUELLES DÉTAILLÉES :\n`;
  dimensions.forEach((dim, index) => {
    const questionId = `inst_${String(index + 1).padStart(2, '0')}`;
    const answer = answers?.[questionId];
    if (answer && (answer.contexte || answer.exemple || answer.reaction)) {
      message += `\n### ${dim.toUpperCase()} (Score: ${scores.dimensions?.[dim] || 0}/5)\n`;
      message += `Contexte: ${answer.contexte || 'Non renseigné'}\n`;
      message += `Exemple: ${answer.exemple || 'Non renseigné'}\n`;
      message += `Réaction: ${answer.reaction || 'Non renseigné'}\n`;
    }
  });
  message += `\nGénère le rapport JSON avec les 7 sections demandées.`;
  return message;
}

function generateFallbackReport(scores) {
  return {
    scoreGlobal: scores.scoreSur100 || 0,
    interpretation: scores.interpretation,
    synthese: `Votre profil montre une conscience corporelle ${(scores.interpretation || '').toLowerCase()}.`,
    dimensions: Object.entries(scores.dimensions || {}).map(([name, score]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' '),
      score,
      max: 5
    })),
    dynamiques: [{ titre: "Analyse personnalisée", description: "Une analyse approfondie est en cours.", extrait: "Vos réponses sont en cours d'analyse." }],
    forces: ["Vous avez complété l'audit avec honnêteté", "Votre curiosité est une ressource", "Les données permettront un suivi"],
    axes: [{ priorite: 1, dimension: "Conscience corporelle", exercice: "Pratiquez la conscience des sensations 3 fois par jour", frequence: "3×/jour", duree: "2 minutes" }],
    conseils: ["Le développement est progressif", "La régularité est plus efficace", "Soyez patient et bienveillant"],
    recommandationsQuotidiennes: { matin: "5 min de respiration consciente", journee: "3 pauses de 30 sec", soir: "5 min de détente allongé" },
    livre: { titre: "Waking the Tiger", auteur: "Peter Levine", description: "Méthode Somatic Experiencing pour reconnecter avec le corps." },
    concepts: [{ icon: "🧭", nom: "Théorie polyvagale", desc: "Réponses du système nerveux" }],
    praticien: "Thérapie somatique (Somatic Experiencing)."
  };
}

export default function InstinctifTest({ user, onComplete, onCancel }) {
  const {
    status, currentQuestion, answers, report, isSubmitting,
    setCurrentQuestion, setStatus,
    handleAnswer, handleNext, handlePrevious, handleSubmit, handleStart, handleExit,
  } = useTestForm({
    questions: INSTINCTIF_QUESTIONS,
    calculateScore: calculateInstinctifScore,
    systemPrompt: SYSTEM_PROMPT,
    testType: 'instinctif',
    storageKey: 'instinctif-test-draft',
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
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl" style={{ backgroundColor: '#F5F0EA' }}>🫀</div>
            <h1 className="text-3xl font-semibold mb-4" style={{ fontFamily: "'EB Garamond', Georgia, serif", color: '#1A1209' }}>Audit Instinctif & Corporel</h1>
            <p className="text-base mb-6 max-w-lg mx-auto" style={{ color: '#666' }}>Évalue 12 dimensions de ta relation à ton corps : conscience, écoute, confiance, régulation, intuition...</p>
            <div className="flex justify-center gap-6 mb-8 text-sm" style={{ color: '#888' }}>
              <span>⏱️ 20-25 minutes</span>
              <span>📝 12 questions</span>
              <span>⭐ Note + réponses libres</span>
            </div>
            <div className="text-left p-4 rounded-lg mb-8 text-sm" style={{ backgroundColor: '#F5F0EA', borderLeft: '3px solid #C96442', color: '#666' }}>
              <strong>Important :</strong> Ce test débloque la prochaine étape de ton parcours Re-Boot. Sois honnête.
            </div>
            <div className="flex gap-4 justify-center">
              <button onClick={handleExit} className="px-6 py-3 rounded-xl font-medium" style={{ border: '1px solid #E8E0D8', color: '#666' }}>Retour</button>
              <button onClick={handleStart} className="px-8 py-3 rounded-xl font-medium text-white" style={{ backgroundColor: '#1A1209' }}>Commencer l'audit</button>
            </div>
            {import.meta.env.DEV && (
              <div className="mt-6 pt-6 border-t" style={{ borderColor: '#F0EBE4' }}>
                <p className="text-xs text-[#888] mb-3">Mode développement</p>
                <button onClick={() => { loadTestData('instinctif'); alert('Données de test chargées !'); }} className="text-xs px-4 py-2 rounded-lg" style={{ backgroundColor: '#F5F0EA', color: '#666', border: '1px dashed #C96442' }}>🧪 Charger données de test</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (status === 'question') {
    const question = INSTINCTIF_QUESTIONS[currentQuestion];
    const currentAnswer = answers[question.id] || { note: null, contexte: '', exemple: '', reaction: '' };
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border p-8 shadow-lg" style={{ borderColor: '#E8E0D8' }}>
            <TestProgress current={currentQuestion + 1} total={INSTINCTIF_QUESTIONS.length} percent={((currentQuestion + 1) / INSTINCTIF_QUESTIONS.length) * 100} />
            <TestQuestion question={question} answer={currentAnswer} onAnswer={handleAnswer} onNext={handleNext} onPrevious={handlePrevious} isFirst={currentQuestion === 0} isLast={currentQuestion === INSTINCTIF_QUESTIONS.length - 1} />
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
            <TestRecap answers={answers} questions={INSTINCTIF_QUESTIONS} onEdit={(index) => { setCurrentQuestion(index); setStatus('question'); }} onSubmit={handleSubmit} onCancel={() => setStatus('question')} />
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
