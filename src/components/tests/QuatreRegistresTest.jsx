import { useState, useEffect, useCallback } from 'react';
import TestQuestion from './TestQuestion';
import TestProgress from './TestProgress';
import TestRecap from './TestRecap';
import TestLoading from './TestLoading';
import TestReport from './TestReport';
import { QUATRE_REGISTRES_QUESTIONS, calculateQuatreRegistresScore } from '../../lib/quatreRegistresConfigs';
import { supabase } from '../../lib/supabase';
import { loadTestData } from '../../lib/testDataLoader';

const STORAGE_KEY = 'quatre-registres-test-draft';
const STORAGE_EXPIRY = 24 * 60 * 60 * 1000; // 24h

// Prompt système pour l'API Groq
const SYSTEM_PROMPT = `Tu es Doctor Claude, analyste cognitif spécialisé en évaluation des 4 registres de fonctionnement (Reptilien, Instinctif, Émotionnel, Rationnel).

MISSION: Générer un diagnostic complet des 4 registres basé sur les réponses d'un audit de 20 questions.

STRUCTURE DU RAPPORT (format JSON strict):
{
  "registres": {
    "reptilien": {
      "score": number,
      "points_forts": [string],
      "points_faibles": [string]
    },
    "instinctif": { ... },
    "emotionnel": { ... },
    "rationnel": { ... }
  },
  "diagnostic": {
    "resume_court": "Synthèse 1 phrase",
    "lecture_globale": "Analyse narrative détaillée (400-600 mots)",
    "dynamiques": [
      {
        "titre": "Nom de la dynamique",
        "description": "Explication"
      }
    ]
  },
  "priorites": {
    "intro": "Introduction aux priorités",
    "liste": [
      {
        "registre": "Nom du registre",
        "score": number,
        "but": "Objectif",
        "actions": [string]
      }
    ]
  },
  "conseils": {
    "pratiques_quotidiennes": {
      "matin": [string],
      "journee": [string],
      "soir": [string]
    },
    "conseils_generaux": [string],
    "concepts_a_etudier": [
      {"concept": "Nom", "pourquoi": "Explication"}
    ],
    "ressources": [
      {"titre": "Titre", "auteur": "Auteur", "type": "livre", "pourquoi": "Explication"}
    ]
  }
}

CONTRAINTES:
- Longueur: 1500-2000 mots
- Ton: bienveillant, empathique, actionnable, jamais moralisateur
- Personnalisation: CITER des extraits des réponses textuelles
- Actions: concrètes, courtes, réalisables
- Ordre des priorités: du registre le plus faible au plus fort
- Faire le lien entre les scores et les réponses textuelles détaillées

IMPORTANT: Retourne UNIQUEMENT le JSON valide, sans texte avant ou après, sans balises markdown.`;

export default function QuatreRegistresTest({ user, onComplete, onCancel }) {
  const [status, setStatus] = useState('intro'); // intro, question, recap, loading, report
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [report, setReport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Récupération du brouillon sauvegardé
  useEffect(() => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        const isRecent = Date.now() - parsed.timestamp < STORAGE_EXPIRY;
        if (isRecent && parsed.answers && Object.keys(parsed.answers).length > 0) {
          if (window.confirm('Vous avez un test en cours. Reprendre où vous en étiez ?')) {
            setAnswers(parsed.answers);
            setCurrentQuestion(parsed.currentQuestion || 0);
            setStatus('question');
          }
        }
      } catch (e) {
        console.error('Error parsing draft:', e);
      }
    }
  }, []);

  // Auto-save toutes les 30 secondes
  useEffect(() => {
    if (status === 'question') {
      const interval = setInterval(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          answers,
          currentQuestion,
          timestamp: Date.now()
        }));
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [answers, currentQuestion, status]);

  const handleAnswer = useCallback((questionId, data) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: data
    }));
  }, []);

  const handleNext = () => {
    if (currentQuestion < QUATRE_REGISTRES_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setStatus('recap');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStatus('loading');

    try {
      // Calcul des scores
      const scores = calculateQuatreRegistresScore(answers);
      
      // Préparer le message pour l'API
      const userMessage = formatUserMessage(answers, scores);
      
      // Appel Edge Function
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL || 'https://cfagrdqwmwnuspcuthjp.supabase.co'}/functions/v1/claude-proxy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            systemPrompt: SYSTEM_PROMPT,
            userMessage: userMessage,
            maxTokens: 4000
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const apiData = await response.json();
      
      // Parser la réponse JSON
      let reportData;
      try {
        let content = apiData.choices?.[0]?.message?.content || apiData.content?.[0]?.text;
        
        if (content.includes('```json')) {
          content = content.split('```json')[1].split('```')[0].trim();
        } else if (content.includes('```')) {
          content = content.split('```')[1].split('```')[0].trim();
        }
        
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          content = jsonMatch[0];
        }
        
        reportData = JSON.parse(content);
      } catch (parseError) {
        console.error('Erreur parsing rapport:', parseError);
        reportData = generateFallbackReport(scores);
      }
      
      setReport(reportData);
      
      // Sauvegarde dans reboot_sessions
      const sessionId = crypto.randomUUID();
      const { error: insertError } = await supabase
        .from('reboot_sessions')
        .insert({
          session_id: sessionId,
          user_id: user?.id,
          date: new Date().toISOString(),
          test_type: '4-registres',
          session_data: {
            type: '4-registres',
            scores: scores.registres,
            score_global: scores.scoreGlobal,
            answers: answers,
            diagnostic: reportData,
            status: 'completed',
            created_at: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Erreur sauvegarde:', insertError);
      }
      
      if (onComplete) {
        await onComplete({
          type: '4-registres',
          sessionId: sessionId,
          scores: scores,
          answers: answers,
          report: reportData,
          timestamp: new Date().toISOString()
        });
      }

      localStorage.removeItem(STORAGE_KEY);
      setStatus('report');
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Une erreur est survenue lors de l\'analyse. Veuillez réessayer.');
      setStatus('recap');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStart = () => {
    setStatus('question');
    setCurrentQuestion(0);
  };

  const handleExit = () => {
    if (Object.keys(answers).length > 0) {
      if (window.confirm('Vos réponses sont sauvegardées. Voulez-vous vraiment quitter ?')) {
        if (onCancel) onCancel();
      }
    } else {
      if (onCancel) onCancel();
    }
  };

  // Écran d'introduction
  if (status === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl border p-10 text-center shadow-lg" style={{ borderColor: '#E8E0D8' }}>
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl" style={{ backgroundColor: '#F5F0EA' }}>
              🧭
            </div>
            
            <h1 className="text-3xl font-semibold mb-4" style={{ fontFamily: "'EB Garamond', Georgia, serif", color: '#1A1209' }}>
              Audit des 4 Registres
            </h1>
            
            <p className="text-base mb-6 max-w-lg mx-auto" style={{ color: '#666' }}>
              Évalue ton profil cognitif complet à travers 4 registres : Reptilien (ancrage), Instinctif (corps), Émotionnel (relations), Rationnel (pensée).
            </p>
            
            <div className="grid grid-cols-4 gap-3 mb-8 text-sm">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF3E0' }}>
                <span className="text-2xl block mb-1">🦎</span>
                <span style={{ color: '#e07b39', fontWeight: 500 }}>Reptilien</span>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFEBEE' }}>
                <span className="text-2xl block mb-1">🫀</span>
                <span style={{ color: '#c0392b', fontWeight: 500 }}>Instinctif</span>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF8E1' }}>
                <span className="text-2xl block mb-1">💛</span>
                <span style={{ color: '#e6a817', fontWeight: 500 }}>Émotionnel</span>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#E3F2FD' }}>
                <span className="text-2xl block mb-1">🧠</span>
                <span style={{ color: '#2980b9', fontWeight: 500 }}>Rationnel</span>
              </div>
            </div>
            
            <div className="flex justify-center gap-6 mb-8 text-sm" style={{ color: '#888' }}>
              <span className="flex items-center gap-2">⏱️ 30-40 minutes</span>
              <span className="flex items-center gap-2">📝 20 questions</span>
              <span className="flex items-center gap-2">⭐ Note + réponses libres</span>
            </div>

            <div className="text-left p-4 rounded-lg mb-8 text-sm" style={{ backgroundColor: '#F5F0EA', borderLeft: '3px solid #C96442', color: '#666' }}>
              <strong>Important :</strong> Ce test explore comment tu fonctionnes dans 4 dimensions fondamentales de ton existence. Chaque question combine une note (1-5) avec des champs pour détailler ton vécu. Plus tu partages de détails, plus l'analyse sera précise et personnalisée.
            </div>

            <div className="flex gap-4 justify-center">
              <button 
                onClick={handleExit}
                className="px-6 py-3 rounded-xl font-medium transition-colors"
                style={{ border: '1px solid #E8E0D8', color: '#666' }}
              >
                Retour
              </button>
              <button 
                onClick={handleStart}
                className="px-8 py-3 rounded-xl font-medium text-white transition-colors"
                style={{ backgroundColor: '#C96442' }}
              >
                Commencer l'audit
              </button>
            </div>

            {/* Bouton développement : Charger données de test */}
            {import.meta.env.DEV && (
              <div className="mt-6 pt-6 border-t" style={{ borderColor: '#F0EBE4' }}>
                <p className="text-xs text-[#888] mb-3">Mode développement</p>
                <button 
                  onClick={() => {
                    loadTestData('4-registres');
                    alert('Données de test chargées ! Cliquez sur "Commencer l\'audit" pour voir le brouillon.');
                  }}
                  className="text-xs px-4 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: '#F5F0EA', color: '#666', border: '1px dashed #C96442' }}
                >
                  🧪 Charger données de test
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Écran de question
  if (status === 'question') {
    const question = QUATRE_REGISTRES_QUESTIONS[currentQuestion];
    const currentAnswer = answers[question.id] || { note: null, contexte: '', exemple: '', reaction: '' };

    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border p-8 shadow-lg" style={{ borderColor: '#E8E0D8' }}>
            <TestProgress 
              current={currentQuestion + 1} 
              total={QUATRE_REGISTRES_QUESTIONS.length}
              percent={((currentQuestion + 1) / QUATRE_REGISTRES_QUESTIONS.length) * 100}
            />

            <TestQuestion
              question={question}
              answer={currentAnswer}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isFirst={currentQuestion === 0}
              isLast={currentQuestion === QUATRE_REGISTRES_QUESTIONS.length - 1}
            />
          </div>
        </div>
      </div>
    );
  }

  // Écran de récapitulatif
  if (status === 'recap') {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border p-8 shadow-lg" style={{ borderColor: '#E8E0D8' }}>
            <TestRecap 
              answers={answers}
              questions={QUATRE_REGISTRES_QUESTIONS}
              onEdit={(index) => {
                setCurrentQuestion(index);
                setStatus('question');
              }}
              onSubmit={handleSubmit}
              onCancel={() => setStatus('question')}
            />
          </div>
        </div>
      </div>
    );
  }

  // Écran de chargement
  if (status === 'loading') {
    return <TestLoading />;
  }

  // Écran de rapport
  if (status === 'report' && report) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="max-w-4xl mx-auto">
          <TestReport 
            report={report}
            onDownloadPDF={() => {
              alert('Export PDF en préparation...');
            }}
            onChat={() => {
              if (onComplete) onComplete({ goToChat: true, report });
            }}
            onViewProfile={() => {
              if (onComplete) onComplete({ goToProfile: true });
            }}
          />
        </div>
      </div>
    );
  }

  return null;
}

// Helper: Formate les données pour le prompt
function formatUserMessage(answers, scores) {
  const registers = ['reptilien', 'instinctif', 'emotionnel', 'rationnel'];
  const registerLabels = {
    reptilien: '🦎 Reptilien',
    instinctif: '🫀 Instinctif',
    emotionnel: '💛 Émotionnel',
    rationnel: '🧠 Rationnel'
  };

  let message = `Génère le diagnostic des 4 Registres.\n\n`;
  
  message += `SCORES PAR REGISTRE (sur 25) :\n`;
  registers.forEach((reg) => {
    message += `- ${registerLabels[reg]}: ${scores.registres[reg]}/25\n`;
  });
  message += `\nSCORE GLOBAL : ${scores.scoreGlobal}/100\n\n`;

  message += `RÉPONSES DÉTAILLÉES PAR QUESTION :\n`;
  QUATRE_REGISTRES_QUESTIONS.forEach((q) => {
    const answer = answers?.[q.id];
    if (answer) {
      message += `\n### ${registerLabels[q.registre]} - Q${q.ordre}: ${q.dimension_label}\n`;
      message += `Note: ${answer.note || 'Non renseigné'}/5\n`;
      message += `Contexte: ${answer.contexte || 'Non renseigné'}\n`;
      message += `Exemple: ${answer.exemple || 'Non renseigné'}\n`;
      message += `Réaction: ${answer.reaction || 'Non renseigné'}\n`;
    }
  });

  message += `\nGénère le diagnostic JSON complet avec toutes les sections demandées.`;

  return message;
}

// Helper: Fallback si parsing échoue
function generateFallbackReport(scores) {
  return {
    registres: {
      reptilien: {
        score: scores.registres.reptilen || 12.5,
        points_forts: ['Conscience des besoins de base'],
        points_faibles: ['Espace d\'amélioration disponible']
      },
      instinctif: {
        score: scores.registres.instinctif || 12.5,
        points_forts: ['Potentiel de développement'],
        points_faibles: ['Pratiques à instaurer']
      },
      emotionnel: {
        score: scores.registres.emotionnel || 12.5,
        points_forts: ['Conscience émotionnelle présente'],
        points_faibles: ['Outils de régulation à développer']
      },
      rationnel: {
        score: scores.registres.rationnel || 12.5,
        points_forts: ['Capacité d\'analyse'],
        points_faibles: ['Passage à l\'action à renforcer']
      }
    },
    diagnostic: {
      resume_court: 'Profil en développement avec potentiel dans tous les registres.',
      lecture_globale: 'Votre profil montre des ressources réparties sur les 4 registres avec des marges de progression dans chacun.',
      dynamiques: [
        {
          titre: 'Équilibre à construire',
          description: 'Les quatre registres présentent des opportunités de développement. Le travail sur un registre bénéficie aux autres.'
        }
      ]
    },
    priorites: {
      intro: 'Priorisez le registre avec le score le plus bas pour créer un effet de levier.',
      liste: [
        {
          registre: 'Reptilien',
          score: scores.registres.reptilen || 12.5,
          but: 'Stabiliser les fondamentaux',
          actions: ['Instaurer des routines de sommeil régulières', 'Planifier des repas équilibrés']
        }
      ]
    },
    conseils: {
      pratiques_quotidiennes: {
        matin: ['Vérifier son énergie au réveil', 'Hydratation consciente'],
        journee: ['Pauses actives toutes les 2h', 'Vérification corporelle rapide'],
        soir: ['Rituel de déconnexion', 'Réflexion sur la journée']
      },
      conseils_generaux: [
        'Le développement des registres est progressif',
        'Chaque petit pas compte',
        'La régularité prime sur l\'intensité'
      ],
      concepts_a_etudier: [
        { concept: 'Théorie polyvagale', pourquoi: 'Comprendre la régulation nerveuse' }
      ],
      ressources: [
        { titre: 'Le corps n\'oublie rien', auteur: 'Bessel van der Kolk', type: 'livre', pourquoi: 'Comprendre le lien corps-esprit' }
      ]
    }
  };
}
