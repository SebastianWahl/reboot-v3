import TestQuestion from './TestQuestion';
import TestProgress from './TestProgress';
import TestRecap from './TestRecap';
import TestLoading from './TestLoading';
import TestReport from './TestReport';
import { QUATRE_REGISTRES_QUESTIONS, calculateQuatreRegistresScore } from '../../lib/quatreRegistresConfigs';
import { loadTestData } from '../../lib/testDataLoader';
import { useTestForm } from '../../hooks/useTestForm';

const SYSTEM_PROMPT = `Tu es Doctor Claude, analyste cognitif spécialisé en évaluation des 4 registres de fonctionnement (Reptilien, Instinctif, Émotionnel, Rationnel).

MISSION: Générer un diagnostic complet des 4 registres basé sur les réponses d'un audit de 20 questions.

STRUCTURE DU RAPPORT (format JSON strict):
{
  "registres": {"reptilien": {"score": number, "points_forts": [string], "points_faibles": [string]}, "instinctif": {...}, "emotionnel": {...}, "rationnel": {...}},
  "diagnostic": {"resume_court": string, "lecture_globale": string, "dynamiques": [{"titre": string, "description": string}]},
  "priorites": {"intro": string, "liste": [{"registre": string, "score": number, "but": string, "actions": [string]}]},
  "conseils": {"pratiques_quotidiennes": {"matin": [string], "journee": [string], "soir": [string]}, "conseils_generaux": [string], "concepts_a_etudier": [{"concept": string, "pourquoi": string}], "ressources": [{"titre": string, "auteur": string, "type": string, "pourquoi": string}]}
}

CONTRAINTES:
- Longueur: 1500-2000 mots
- Ton: bienveillant, empathique, actionnable, jamais moralisateur
- Personnalisation: CITER des extraits des réponses textuelles
- Ordre des priorités: du registre le plus faible au plus fort

IMPORTANT: Retourne UNIQUEMENT le JSON valide, sans texte avant ou après, sans balises markdown.`;

function formatUserMessage(answers, scores) {
  const registerLabels = { reptilien: '🦎 Reptilien', instinctif: '🫀 Instinctif', emotionnel: '💛 Émotionnel', rationnel: '🧠 Rationnel' };
  let message = `Génère le diagnostic des 4 Registres.\n\nSCORES PAR REGISTRE (sur 25) :\n`;
  Object.keys(registerLabels).forEach(reg => { message += `- ${registerLabels[reg]}: ${scores.registres[reg]}/25\n`; });
  message += `\nSCORE GLOBAL : ${scores.scoreGlobal}/100\n\nRÉPONSES DÉTAILLÉES PAR QUESTION :\n`;
  QUATRE_REGISTRES_QUESTIONS.forEach(q => {
    const answer = answers?.[q.id];
    if (answer) {
      message += `\n### ${registerLabels[q.registre]} - Q${q.ordre}: ${q.dimension_label}\n`;
      message += `Note: ${answer.note || 'Non renseigné'}/5\nContexte: ${answer.contexte || 'Non renseigné'}\nExemple: ${answer.exemple || 'Non renseigné'}\nRéaction: ${answer.reaction || 'Non renseigné'}\n`;
    }
  });
  message += `\nGénère le diagnostic JSON complet.`;
  return message;
}

function generateFallbackReport(scores) {
  return {
    registres: {
      reptilien: { score: scores.registres.reptilien || 12.5, points_forts: ['Conscience des besoins de base'], points_faibles: ['Espace d\'amélioration'] },
      instinctif: { score: scores.registres.instinctif || 12.5, points_forts: ['Potentiel de développement'], points_faibles: ['Pratiques à instaurer'] },
      emotionnel: { score: scores.registres.emotionnel || 12.5, points_forts: ['Conscience émotionnelle présente'], points_faibles: ['Outils à développer'] },
      rationnel: { score: scores.registres.rationnel || 12.5, points_forts: ['Capacité d\'analyse'], points_faibles: ['Passage à l\'action à renforcer'] }
    },
    diagnostic: { resume_court: 'Profil en développement avec potentiel dans tous les registres.', lecture_globale: 'Votre profil montre des ressources réparties sur les 4 registres.', dynamiques: [{ titre: 'Équilibre à construire', description: 'Les quatre registres présentent des opportunités de développement.' }] },
    priorites: { intro: 'Priorisez le registre avec le score le plus bas.', liste: [{ registre: 'Reptilien', score: scores.registres.reptilien || 12.5, but: 'Stabiliser les fondamentaux', actions: ['Routines de sommeil régulières', 'Repas équilibrés'] }] },
    conseils: { pratiques_quotidiennes: { matin: ['Vérifier son énergie au réveil'], journee: ['Pauses actives toutes les 2h'], soir: ['Rituel de déconnexion'] }, conseils_generaux: ['Le développement est progressif', 'La régularité prime sur l\'intensité'], concepts_a_etudier: [{ concept: 'Théorie polyvagale', pourquoi: 'Comprendre la régulation nerveuse' }], ressources: [{ titre: 'Le corps n\'oublie rien', auteur: 'Bessel van der Kolk', type: 'livre', pourquoi: 'Comprendre le lien corps-esprit' }] }
  };
}

export default function QuatreRegistresTest({ user, onComplete, onCancel }) {
  const {
    status, currentQuestion, answers, report,
    setCurrentQuestion, setStatus,
    handleAnswer, handleNext, handlePrevious, handleSubmit, handleStart, handleExit,
  } = useTestForm({
    questions: QUATRE_REGISTRES_QUESTIONS,
    calculateScore: calculateQuatreRegistresScore,
    systemPrompt: SYSTEM_PROMPT,
    testType: '4-registres',
    storageKey: 'quatre-registres-test-draft',
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
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl" style={{ backgroundColor: '#F5F0EA' }}>🧭</div>
            <h1 className="text-3xl font-semibold mb-4" style={{ fontFamily: "'EB Garamond', Georgia, serif", color: '#1A1209' }}>Audit des 4 Registres</h1>
            <p className="text-base mb-6 max-w-lg mx-auto" style={{ color: '#666' }}>Évalue tes 4 registres de fonctionnement : Reptilien, Instinctif, Émotionnel et Rationnel — 20 questions au total.</p>
            <div className="flex justify-center gap-6 mb-8 text-sm" style={{ color: '#888' }}>
              <span>⏱️ 30-40 minutes</span><span>📝 20 questions</span><span>⭐ Note + réponses libres</span>
            </div>
            <div className="text-left p-4 rounded-lg mb-8 text-sm" style={{ backgroundColor: '#F5F0EA', borderLeft: '3px solid #C96442', color: '#666' }}>
              <strong>Important :</strong> Cet audit complet donne une vision à 360° de ton fonctionnement cognitif. Sois honnête.
            </div>
            <div className="flex gap-4 justify-center">
              <button onClick={handleExit} className="px-6 py-3 rounded-xl font-medium" style={{ border: '1px solid #E8E0D8', color: '#666' }}>Retour</button>
              <button onClick={handleStart} className="px-8 py-3 rounded-xl font-medium text-white" style={{ backgroundColor: '#1A1209' }}>Commencer l'audit</button>
            </div>
            {import.meta.env.DEV && (
              <div className="mt-6 pt-6 border-t" style={{ borderColor: '#F0EBE4' }}>
                <p className="text-xs text-[#888] mb-3">Mode développement</p>
                <button onClick={() => { loadTestData('4-registres'); alert('Données de test chargées !'); }} className="text-xs px-4 py-2 rounded-lg" style={{ backgroundColor: '#F5F0EA', color: '#666', border: '1px dashed #C96442' }}>🧪 Charger données de test</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (status === 'question') {
    const question = QUATRE_REGISTRES_QUESTIONS[currentQuestion];
    const currentAnswer = answers[question.id] || { note: null, contexte: '', exemple: '', reaction: '' };
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border p-8 shadow-lg" style={{ borderColor: '#E8E0D8' }}>
            <TestProgress current={currentQuestion + 1} total={QUATRE_REGISTRES_QUESTIONS.length} percent={((currentQuestion + 1) / QUATRE_REGISTRES_QUESTIONS.length) * 100} />
            <TestQuestion question={question} answer={currentAnswer} onAnswer={handleAnswer} onNext={handleNext} onPrevious={handlePrevious} isFirst={currentQuestion === 0} isLast={currentQuestion === QUATRE_REGISTRES_QUESTIONS.length - 1} />
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
            <TestRecap answers={answers} questions={QUATRE_REGISTRES_QUESTIONS} onEdit={(index) => { setCurrentQuestion(index); setStatus('question'); }} onSubmit={handleSubmit} onCancel={() => setStatus('question')} />
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
