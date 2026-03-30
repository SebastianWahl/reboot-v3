import { useState, useEffect, useCallback } from 'react';
import TestQuestion from './TestQuestion';
import TestProgress from './TestProgress';
import TestRecap from './TestRecap';
import TestLoading from './TestLoading';
import TestReport from './TestReport';
import { EMOTIONNEL_QUESTIONS } from '../../lib/emotionnelConfigs';
import { calculateEmotionnelScore } from '../../lib/emotionnelConfigs';
import { supabase } from '../../lib/supabase';
import { loadTestData } from '../../lib/testDataLoader';

const STORAGE_KEY = 'emotionnel-test-draft';
const STORAGE_EXPIRY = 24 * 60 * 60 * 1000; // 24h

// Prompt système pour l'API Groq (adapté pour Llama 3.3)
const SYSTEM_PROMPT = `Tu es Doctor Claude, analyste cognitif spécialisé en intelligence émotionnelle et relations interpersonnelles.

MISSION: Générer un rapport d'audit Émotionnel & Relationnel structuré en 7 sections.

STRUCTURE DU RAPPORT (format JSON strict):
{
  "profil_global": {
    "score": number,
    "niveau": "Profil à construire" | "Profil intermédiaire" | "Profil affirmé" | "Profil maîtrisé",
    "dimensions": [
      {"nom": string, "score": number, "max": 5}
    ],
    "synthese": string
  },
  "dynamiques": [
    {
      "titre": string,
      "citation": string,
      "description": string
    }
  ],
  "forces": [
    {
      "titre": string,
      "description": string
    }
  ],
  "axes_prioritaires": [
    {
      "titre": string,
      "exercice": string,
      "frequence": string,
      "duree": string,
      "signal_reussite": string
    }
  ],
  "conseils_generaux": [string],
  "recommandations_quotidiennes": {
    "matin": string,
    "journee": string,
    "soir": string
  },
  "ressources": {
    "livre": {
      "titre": string,
      "auteur": string,
      "pourquoi": string
    },
    "concepts": [string],
    "praticien": string
  }
}

CONTRAINTES:
- Longueur: 800-1200 mots
- Ton: bienveillant, empathique, actionnable, jamais moralisateur
- Personnalisation: CITER des extraits des réponses textuelles
- Exercices: concrets, courts (1-10 min), avec fréquence+durée précises
- Adapter le livre au niveau (score <30=accessible, >50=approfondi)
- Inclure des exercices de régulation émotionnelle (respiration, naming, etc.)
- Recommander des livres sur l'intelligence émotionnelle (Goleman, etc.)
- Proposer un type de thérapie adapté (TCC, analyse transactionnelle, etc.)

IMPORTANT: Retourne UNIQUEMENT le JSON valide, sans texte avant ou après, sans balises markdown.`;


export default function EmotionnelTest({ user, onComplete, onCancel }) {
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
          // Proposer de reprendre
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
    if (currentQuestion < EMOTIONNEL_QUESTIONS.length - 1) {
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
      const scores = calculateEmotionnelScore(answers);
      
      // Préparer le message pour l'API
      const userMessage = formatUserMessage(answers, scores);
      
      // Appel Edge Function claude-proxy existante
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
      
      // Parser la réponse JSON du rapport avec extraction robuste
      let reportData;
      try {
        // Groq retourne la réponse dans choices[0].message.content
        let content = apiData.choices?.[0]?.message?.content || apiData.content?.[0]?.text;
        
        // Nettoyer le contenu : enlever les balises markdown ```json ... ```
        if (content.includes('```json')) {
          content = content.split('```json')[1].split('```')[0].trim();
        } else if (content.includes('```')) {
          content = content.split('```')[1].split('```')[0].trim();
        }
        
        // Chercher un objet JSON dans le texte
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          content = jsonMatch[0];
        }
        
        reportData = JSON.parse(content);
      } catch (parseError) {
        console.error('Erreur parsing rapport:', parseError);
        console.error('Contenu reçu:', apiData.choices?.[0]?.message?.content);
        // Fallback si le parsing échoue
        reportData = generateFallbackReport(scores);
      }
      
      setReport(reportData);
      
      // Sauvegarde dans reboot_sessions (table existante)
      const sessionId = crypto.randomUUID();
      const { error: insertError } = await supabase
        .from('reboot_sessions')
        .insert({
          session_id: sessionId,
          user_id: user?.id,
          date: new Date().toISOString(),
          test_type: 'emotionnel', // Identifier comme test emotionnel
          session_data: {
            type: 'emotionnel',
            scores: scores.dimensions,
            score_global: scores.scoreSur100,
            answers: answers,
            interpretation: scores.interpretation,
            diagnostic: reportData,
            status: 'completed',
            created_at: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Erreur sauvegarde:', insertError);
        // Continuer quand même, le rapport est affiché
      }
      
      // Notification au parent
      if (onComplete) {
        await onComplete({
          type: 'emotionnel',
          sessionId: sessionId,
          scores: scores,
          answers: answers,
          report: reportData,
          timestamp: new Date().toISOString()
        });
      }

      // Nettoyage du brouillon
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
              💞
            </div>
            
            <h1 className="text-3xl font-semibold mb-4" style={{ fontFamily: "'EB Garamond', Georgia, serif", color: '#1A1209' }}>
              Audit Émotionnel & Relationnel
            </h1>
            
            <p className="text-base mb-6 max-w-lg mx-auto" style={{ color: '#666' }}>
              Évalue 12 dimensions de ton intelligence émotionnelle : vocabulaire, régulation, empathie, expression, conflits...
            </p>
            
            <div className="flex justify-center gap-6 mb-8 text-sm" style={{ color: '#888' }}>
              <span className="flex items-center gap-2">⏱️ 20-25 minutes</span>
              <span className="flex items-center gap-2">📝 12 questions</span>
              <span className="flex items-center gap-2">⭐ Note + réponses libres</span>
            </div>

            <div className="text-left p-4 rounded-lg mb-8 text-sm" style={{ backgroundColor: '#F5F0EA', borderLeft: '3px solid #C96442', color: '#666' }}>
              <strong>Important :</strong> Ce test explore comment tu nommes, gères et exprimes tes émotions — et comment tu te connectes aux autres. Sois honnête — il n'y a pas de bonne réponse, seulement ta vérité. Plus tu détailles tes réponses, plus l'analyse sera précise.
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
                    loadTestData();
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
    const question = EMOTIONNEL_QUESTIONS[currentQuestion];
    const currentAnswer = answers[question.id] || { note: null, contexte: '', exemple: '', reaction: '' };

    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border p-8 shadow-lg" style={{ borderColor: '#E8E0D8' }}>
            <TestProgress 
              current={currentQuestion + 1} 
              total={EMOTIONNEL_QUESTIONS.length}
              percent={((currentQuestion + 1) / EMOTIONNEL_QUESTIONS.length) * 100}
            />

            <TestQuestion
              question={question}
              answer={currentAnswer}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isFirst={currentQuestion === 0}
              isLast={currentQuestion === EMOTIONNEL_QUESTIONS.length - 1}
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
              questions={EMOTIONNEL_QUESTIONS}
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
              // Logique export PDF
              alert('Export PDF en préparation...');
            }}
            onChat={() => {
              // Navigation vers Doctor Chat avec contexte
              if (onComplete) onComplete({ goToChat: true, report });
            }}
            onViewProfile={() => {
              // Navigation vers Profil Cognitif
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
  const dimensions = [
    'Vocabulaire Émotionnel', 'Régulation Émotionnelle', 'Sécurité Relationnelle', 'Empathie Réciproque',
    'Expression Émotionnelle', 'Gestion des Conflits', 'Intimité Émotionnelle', 'Réparation Relationnelle',
    'Boundaries Émotionnelles', 'Soutien Émotionnel', 'Authenticité Relationnelle', 'Cohérence Émotionnelle'
  ];

  let message = `Génère le rapport d'Audit Émotionnel & Relationnel.\n\n`;
  
  message += `SCORES PAR DIMENSION (sur 5) :\n`;
  dimensions.forEach((dim, index) => {
    const questionId = `emo_${String(index + 1).padStart(2, '0')}`;
    const score = scores.dimensions?.[dim] || 0;
    message += `- ${dim}: ${score}/5\n`;
  });

  message += `\nSCORE GLOBAL : ${scores.scoreSur100}/100\n`;
  message += `INTERPRÉTATION : ${scores.interpretation}\n\n`;

  message += `RÉPONSES TEXTUELLES DÉTAILLÉES :\n`;
  dimensions.forEach((dim, index) => {
    const questionId = `emo_${String(index + 1).padStart(2, '0')}`;
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

// Helper: Fallback si parsing échoue
function generateFallbackReport(scores) {
  const scoreValue = scores.scoreSur100 || 0;
  
  return {
    profil_global: {
      score: scoreValue,
      niveau: scoreValue < 30 ? 'Profil à construire' : scoreValue < 50 ? 'Profil intermédiaire' : 'Profil affirmé',
      dimensions: Object.entries(scores.dimensions || {}).map(([name, score]) => ({
        nom: name,
        score,
        max: 5
      })),
      synthese: `Votre profil émotionnel montre une intelligence émotionnelle ${scores.interpretation.toLowerCase()}. Une analyse personnalisée sera disponible prochainement.`
    },
    dynamiques: [
      {
        titre: "Analyse personnalisée en cours",
        citation: "Vos réponses sont en cours d'analyse par notre système.",
        description: "Une analyse approfondie de vos patterns émotionnels et relationnels est en préparation."
      }
    ],
    forces: [
      {
        titre: "Curiosité pour la connaissance de soi",
        description: "Votre participation à cet audit montre une volonté réelle de mieux vous comprendre émotionnellement."
      },
      {
        titre: "Conscience initiale",
        description: "Le fait de répondre honnêtement à ces questions est déjà une ressource précieuse pour votre développement."
      }
    ],
    axes_prioritaires: [
      {
        titre: "Développer le vocabulaire émotionnel",
        exercice: "Utiliser la roue des émotions de Plutchik pour nommer précisément ce que vous ressentez 3 fois par jour",
        frequence: "3×/jour",
        duree: "2 minutes",
        signal_reussite: "Vous arrivez à nommer votre émotion en 3 mots précis ou moins"
      }
    ],
    conseils_generaux: [
      "L'intelligence émotionnelle se développe progressivement avec la pratique régulière",
      "La régulation émotionnelle est une compétence qui s'apprend, comme une langue étrangère",
      "Soyez patient et bienveillant envers vous-même dans ce processus",
      "N'hésitez pas à consulter un thérapeute spécialisé pour un accompagnement personnalisé"
    ],
    recommandations_quotidiennes: {
      matin: "Identifier une émotion au réveil et la nommer précisément (3 mots)",
      journee: "Faire 3 pauses de 1 minute pour vérifier son état émotionnel",
      soir: "Écrire 3 lignes dans un journal émotionnel : émotion, intensité /10, déclencheur"
    },
    ressources: {
      livre: {
        titre: "Emotional Intelligence",
        auteur: "Daniel Goleman",
        pourquoi: "Le livre fondateur sur l'intelligence émotionnelle — accessible et méthodique"
      },
      concepts: [
        "Roue des émotions de Plutchik (pour nommer précisément)",
        "Régulation émotionnelle (stratégies de gestion)",
        "Théorie de l'attachement (compréhension des patterns relationnels)",
        "Intelligence relationnelle (connexion authentique)"
      ],
      praticien: "Thérapie cognitivo-comportementale (TCC) ou psychothérapie humaniste pour le travail émotionnel"
    }
  };
}
