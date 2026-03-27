import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthScreen from './components/screens/AuthScreen';
import { useAudit } from './hooks/useAudit';
import { loadSession } from './lib/storage';
import { REGISTERS, QUESTIONS } from './data/questions';
import HomeScreen from './components/screens/HomeScreen';
import AuditOverviewScreen from './components/screens/AuditOverviewScreen';
import IntroRegisterScreen from './components/screens/IntroRegisterScreen';
import QuestionScreen from './components/screens/QuestionScreen';
import RegisterScoreScreen from './components/screens/RegisterScoreScreen';
import DiagnosticScreen from './components/screens/DiagnosticScreen';
import ErrorToast from './components/ui/ErrorToast';
import DashboardScreen from './components/screens/DashboardScreen';

export const PREVIEW_DATA = {
  registres: {
    reptilien: {
      score: 16.25,
      points_forts: ['Rythme de vie stable et maîtrisé', 'Alimentation solide et régulière', 'Espace de vie calme et sécurisé'],
      points_faibles: ['Sommeil très dégradé — ruminations, smartphone au lit, réveils multiples', 'Réaction au stress passive et énergivore', 'Hypervigilance préventive qui bloque la spontanéité'],
      questions: [
        { numero: 1, texte: 'Tes besoins de base sont-ils couverts de façon stable ? Parle-moi de ton sommeil, ton alimentation, et ta sécurité physique.', score_final: 3.25 },
        { numero: 2, texte: 'Prends-tu soin de ton corps de façon active et régulière ? Parle-moi de ton activité physique, de tes habitudes de récupération et de ton rapport au mouvement.', score_final: 3.0 },
        { numero: 3, texte: 'Face au stress intense ou au danger, comment réagis-tu ? Décris ta réaction dans l\'instant, comment tu récupères, et comment tu anticipes ces situations.', score_final: 2.0 },
        { numero: 4, texte: 'As-tu un espace de vie et de travail que tu maîtrises et qui te ressource ? Comment te sens-tu dans ton environnement quotidien ?', score_final: 3.5 },
        { numero: 5, texte: 'Ta vie a-t-elle un rythme prévisible et stable ? Décris comment se structure ta journée type et ta semaine.', score_final: 4.5 },
      ],
    },
    instinctif: {
      score: 6.0,
      points_forts: ['Perçoit les signaux physiques forts (dos, cou, yeux)'],
      points_faibles: ['Zéro pratique d\'ancrage réelle — marche avec smartphone', 'Intuition jugée non fiable, ignorée', 'Corps quasi absent comme source d\'information', 'Posture mauvaise, respiration inconsciente, toujours tendu'],
      questions: [
        { numero: 1, texte: 'Perçois-tu les signaux que t\'envoie ton corps (fatigue, tensions, faim, inconfort) ?', score_final: 2.0 },
        { numero: 2, texte: 'Fais-tu confiance à ton intuition, ton gut feeling, dans tes décisions quotidiennes ?', score_final: 1.0 },
        { numero: 3, texte: 'As-tu des pratiques d\'ancrage corporel (respiration, marche consciente, méditation, sport) ?', score_final: 0.75 },
        { numero: 4, texte: 'Arrives-tu à localiser tes émotions dans ton corps — où se manifestent-elles physiquement ?', score_final: 1.25 },
        { numero: 5, texte: 'Es-tu conscient de ta posture, ta respiration et tes zones de tension au quotidien ?', score_final: 1.0 },
      ],
    },
    emotionnel: {
      score: 7.25,
      points_forts: ['Empathie envers les autres réelle et active', 'Conscience que quelque chose se passe émotionnellement'],
      points_faibles: ['Vocabulaire émotionnel quasi absent', 'Régulation passive — attend que ça passe', 'Isolement relationnel depuis le deuil du père', 'Expression bloquée : retient, minimise, puis laisse déborder'],
      questions: [
        { numero: 1, texte: 'Es-tu capable de nommer précisément ce que tu ressens dans les moments importants ?', score_final: 1.0 },
        { numero: 2, texte: 'Comment gères-tu tes émotions quand elles surgissent — comment les régules-tu ?', score_final: 1.5 },
        { numero: 3, texte: 'As-tu des relations proches dans lesquelles tu te sens en sécurité émotionnellement ?', score_final: 1.25 },
        { numero: 4, texte: 'Es-tu capable de te mettre à la place des autres et de ressentir ce qu\'ils vivent ?', score_final: 2.5 },
        { numero: 5, texte: 'Arrives-tu à exprimer ce que tu ressens — verbalement ou autrement — aux personnes proches ?', score_final: 1.0 },
      ],
    },
    rationnel: {
      score: 15.5,
      points_forts: ['Structuration des problèmes solide et rigoureuse', 'Appétit d\'apprentissage exceptionnel', 'Feedback loop consciente à chaque étape'],
      points_faibles: ['Planification long terme sans actions concrètes', 'Remise en question défensive — "incarne trop les idées"', 'Apprentissage au détriment de la santé, des amis et des émotions'],
      questions: [
        { numero: 1, texte: 'Comment structures-tu un problème complexe quand il se présente à toi ?', score_final: 4.0 },
        { numero: 2, texte: 'Es-tu capable de planifier sur le long terme et de transformer tes intentions en actions concrètes ?', score_final: 2.5 },
        { numero: 3, texte: 'Comment réagis-tu quand on remet en question tes idées ou tes décisions ?', score_final: 2.0 },
        { numero: 4, texte: 'Arrives-tu à prendre des décisions en mettant tes émotions de côté quand c\'est nécessaire ?', score_final: 3.0 },
        { numero: 5, texte: 'As-tu une pratique active d\'apprentissage et de remise à jour de tes connaissances ?', score_final: 4.0 },
      ],
    },
  },
  diagnostic: {
    resume_court: 'Profil intelligent et sensible ayant construit une forteresse rationnelle pour traverser une période difficile. Le corps est fantôme, les émotions sous scellés, l\'instinct ignoré. La forteresse a bien tenu — mais elle commence à coûter plus qu\'elle ne protège.',
    lecture_globale: `Ce profil est celui d\'une personne qui a appris très tôt que comprendre le monde était plus sûr que le ressentir. Le rationnel est devenu votre langue maternelle — et vous la parlez couramment. Mais à mesure que les années ont passé, les autres langues ont été progressivement mises de côté : le corps, l\'instinct, les émotions. Pas par manque de capacité — mais parce que vous n\'en avez pas eu besoin, ou parce que le contexte ne les a pas encouragées.

Le résultat est un profil profondément déséquilibré vers le haut : Rationnel à 15.5/25, Reptilien à 16.25/25 — des ressources réelles, solides. Et en bas : Instinctif à 6/25, Émotionnel à 7.25/25 — deux registres qui existent, mais qui ne sont presque jamais consultés.

Ce que ce profil dit de votre quotidien est précis : vous analysez beaucoup, vous ressentez peu — ou du moins, vous ne savez pas nommer ce que vous ressentez. Votre corps parle, mais vous ne l\'écoutez pas : les signaux (dos, cou, sommeil, tensions) sont enregistrés comme des problèmes techniques à résoudre, pas comme de l\'information. Votre intuition existe — vous le savez — mais vous ne lui faites pas confiance, parce qu\'elle vous a parfois trompé. Et vos émotions ? Elles sont là, sous pression, alternant entre rétention et débordement, sans canal de sortie stable.

Il y a aussi une dimension que ce profil ne dit pas directement, mais que l\'on ressent entre les lignes : une période de deuil non terminée, un isolement relationnel progressif, une vie trop calme et trop contrôlée qui protège mais prive en même temps.

La bonne nouvelle — et elle est réelle — c\'est que vous avez toutes les ressources pour travailler cela. Votre rationnel, bien orienté, est un allié précieux pour comprendre ces mécanismes et construire les pratiques qui vont les débloquer. Mais cette fois, le travail ne se fera pas dans la tête. Il se fera dans le corps, dans les relations, dans les moments où vous choisirez de ressentir plutôt que d\'analyser.`,

    dynamiques: [
      {
        titre: 'Le rationnel comme refuge',
        description: 'L\'apprentissage compulsif, la structuration permanente, la réflexion avant chaque action — tout cela est une forme de contrôle du monde par la compréhension. C\'est une stratégie efficace et intelligente. Mais elle s\'est emballée : elle tourne en circuit fermé, beaucoup d\'input mais peu d\'output réel. Et elle occupe tout l\'espace, laissant peu de place aux autres modes d\'être.',
      },
      {
        titre: 'Le corps fantôme',
        description: 'Le corps existe comme source de problèmes (dos, cou, sommeil, tensions) mais pas comme ressource. Aucune pratique ne l\'écoute vraiment — même la marche, seul moment potentiellement corporel, est colonisée par le smartphone. Le corps porte des signaux importants que vous ne déchiffrez pas encore. C\'est le registre le plus à reconstruire, et le plus fondamental.',
      },
      {
        titre: 'L\'émotion sous scellés',
        description: 'Trois mécanismes simultanés et contradictoires : rétention, minimisation, débordement. Ce n\'est pas une absence d\'émotions — c\'est une incapacité à les canaliser. L\'empathie est réelle et solide, mais elle est tournée vers les autres, jamais vers soi. Le deuil du père en avril 2025 a amplifié et figé ce pattern d\'isolement émotionnel.',
      },
    ],

    points_solides: [
      'Capacité à structurer et résoudre des problèmes complexes — réelle et rare',
      'Appétit d\'apprentissage exceptionnel — ressource précieuse, mal orientée pour l\'instant',
      'Empathie envers les autres solide — atout relationnel fort quand il est activé',
      'Stabilité de vie et territoire maîtrisé — fondation saine sur laquelle construire',
      'Conscience de ses propres patterns — la lucidité est déjà là',
    ],

    priorites_intro: 'Le corps vient en premier — c\'est le fondement sur lequel tout le reste repose. Sans sommeil réparateur et sans activité physique, rien d\'autre ne peut vraiment progresser. La séquence est simple : d\'abord restaurer les fondamentaux (Reptilien), puis réintégrer le corps dans ses signaux fins (Instinctif), puis ouvrir le canal émotionnel (Émotionnel), et enfin corriger la boucle réflexion → action (Rationnel). Quatre chantiers distincts, mais qui se renforcent mutuellement dès que le premier démarre.',
    priorites: [
      {
        registre: 'Reptilien',
        score: 16.25,
        but: 'restaurer les fondamentaux',
        actions: [
          'Téléphone hors chambre chaque soir — sortir le smartphone du lit pour casser les ruminations nocturnes',
          'Heure de coucher fixe à 23h max, réveil à 7h30 — instaurer un rythme circadien stable',
          'Reprendre le sport 3x/semaine : footing, tennis ou padel — ancrage physique prioritaire',
        ],
      },
      {
        registre: 'Instinctif',
        score: 6.0,
        but: 'réintégrer le corps',
        actions: [
          'Marche sans smartphone 20 min/jour — laisser le corps exister sans occupation cognitive',
          'Cohérence cardiaque 5 min le matin avant le premier écran (app Respirelax)',
          'Body scan du soir — 5 min allongé, balayage tête → pieds sans chercher à comprendre',
        ],
      },
      {
        registre: 'Émotionnel',
        score: 7.25,
        but: 'ouvrir le canal émotionnel',
        actions: [
          'Journal émotionnel soir : émotion, intensité /10, déclencheur — 3 lignes maximum',
          'Roue des émotions de Plutchik — à portée pour nommer quand "c\'est flou"',
          'Une vraie conversation par semaine — appel ou rencontre physique, pas WhatsApp',
        ],
      },
      {
        registre: 'Rationnel',
        score: 15.5,
        but: 'débloquer la boucle action',
        actions: [
          'Règle du 2 minutes — si ça prend moins de 2 min à démarrer, le faire maintenant',
          'Une seule priorité par semaine — écrite sur papier le lundi matin',
          'Quand on remet en question une idée : respirer avant de répondre, chercher ce qui est juste dans la critique',
        ],
      },
    ],

    conseils: {
      pratiques_quotidiennes: {
        matin: [
          'Réveil à heure fixe — téléphone hors chambre ou mode avion, pas de YouTube nocturne',
          'Cohérence cardiaque 5 min (Respirelax) avant le premier écran — ancrer le corps avant la tête',
          'Sport 3x/semaine : reprendre ce qui était aimé — footing, tennis, padel',
        ],
        journee: [
          'Marche sans smartphone 20 min — laisser le corps exister, observer, ne rien produire',
          'Une seule priorité par jour identifiée le matin — tout le reste est secondaire',
          'En conversation : s\'autoriser à dire "je ne sais pas encore ce que je ressens" plutôt que d\'analyser',
        ],
        soir: [
          'Téléphone hors chambre à 22h — couper le grignotage cognitif nocturne',
          'Body scan 5 min allongé — balayage tête → pieds sans chercher à comprendre',
          'Journal émotionnel : émotion du jour, intensité /10, déclencheur — 3 lignes, pas plus',
        ],
      },
      conseils_generaux: [
        'Le travail n\'est pas de devenir moins rationnel — c\'est de rouvrir progressivement les registres fermés, en commençant par le plus concret : le corps',
        'Ne pas chercher à "comprendre" ses émotions avant de les ressentir — le comprendre vient après, pas avant',
        'L\'isolement relationnel se traite par de petits gestes répétés, pas par de grands changements — un appel par semaine suffit pour commencer',
        'L\'appétit d\'apprentissage est une ressource : le diriger vers la connaissance de soi (émotions, corps, relations) plutôt que vers le monde extérieur uniquement',
      ],
      concepts_a_etudier: [
        { concept: 'Théorie polyvagale (Porges)', pourquoi: 'Explique pourquoi le corps se fige sous stress et comment le système nerveux régule la sécurité — directement lié au profil reptilien/instinctif' },
        { concept: 'Alexithymie', pourquoi: 'Décrit précisément la difficulté à identifier et nommer ses émotions — reconnaître ce mécanisme est la première étape pour le désamorcer' },
        { concept: 'Intégration somatique (Levine, Somatic Experiencing)', pourquoi: 'Méthode concrète pour reconnecter corps et psyché — particulièrement adaptée aux profils à dominante cognitive' },
        { concept: 'Deuil et réorganisation du soi (Worden)', pourquoi: 'Le deuil du père n\'est pas terminé — comprendre les phases et les tâches du deuil peut débloquer l\'isolement émotionnel' },
      ],
      ressources: [
        { titre: 'Le corps n\'oublie rien', auteur: 'Bessel van der Kolk', type: 'livre', pourquoi: 'Montre comment les émotions non traitées se logent dans le corps — essentiel pour comprendre l\'instinctif à 6/25' },
        { titre: 'Waking the Tiger', auteur: 'Peter Levine', type: 'livre', pourquoi: 'Fondateur du Somatic Experiencing — méthode concrète pour réactiver le registre instinctif par le corps' },
        { titre: 'Emotional Intelligence', auteur: 'Daniel Goleman', type: 'livre', pourquoi: 'Cadre complet pour développer méthodiquement le registre émotionnel — accessible à un profil rationnel' },
        { titre: 'Focusing', auteur: 'Eugene Gendlin', type: 'livre', pourquoi: 'Technique simple et puissante pour apprendre à écouter le "sens corporel" — parfait pour commencer le travail instinctif' },
      ],
    },
  },
};

function LoadingScreen({ message }) {
  return (
    <div className="min-h-screen bg-[#f5f0ea] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-orange-200 border-t-[#e07b39] rounded-full animate-spin" />
      <p className="text-[#2d1a0e]/60 text-sm">{message}</p>
    </div>
  );
}

export default function App() {
  const {
    session,
    screen,
    currentRegisterIndex,
    currentQuestionIndex,
    isLoading,
    error,
    startNewAudit,
    startAuditFromOverview,
    resumeAudit,
    startRegisterQuestions,
    goToNextQuestion,
    goToPreviousQuestion,
    cancelAudit,
    adjustQuestionScore,
    confirmRegisterAndContinue,
    retryScoring,
    retryDiagnostic,
    setError,
  } = useAudit();

  const savedSession = loadSession();
  const { user, loading: authLoading, signInWithGoogle, signInWithEmail, signOut } = useAuth();
  const [viewingSession, setViewingSession] = useState(null);

  function handleSignOut() {
    signOut();
  }

  function handleStart(mode) {
    if (mode === 'resume' && savedSession) {
      resumeAudit(savedSession);
    } else {
      startNewAudit();
    }
  }

  if (authLoading) {
    return <LoadingScreen message="Chargement..." />;
  }

  if (viewingSession) {
    return (
      <DiagnosticScreen
        registres={viewingSession.registres}
        diagnostic={viewingSession.diagnostic}
        onBack={() => setViewingSession(null)}
      />
    );
  }

  const currentRegister = REGISTERS[currentRegisterIndex];
  const currentRegistreId = ['reptilien', 'instinctif', 'emotionnel', 'rationnel'][currentRegisterIndex];
  const globalQuestionIndex = currentRegisterIndex * 5 + currentQuestionIndex;
  const currentQuestion = QUESTIONS[globalQuestionIndex];
  const currentRegistreData = session?.registres?.[currentRegistreId];

  if (screen === 'home') {
    if (user) {
      return (
        <>
          <DashboardScreen
            user={user}
            onSignOut={handleSignOut}
            onStartAudit={() => handleStart('new')}
            onViewSession={setViewingSession}
          />
          <ErrorToast message={error} onRetry={null} visible={!!error} />
        </>
      );
    }

    return (
      <>
        <HomeScreen
          onSignInWithGoogle={signInWithGoogle}
          onSignInWithEmail={signInWithEmail}
        />
        <ErrorToast message={error} onRetry={null} visible={!!error} />
      </>
    );
  }

  if (screen === 'overview') {
    return <AuditOverviewScreen onStart={startAuditFromOverview} />;
  }

  if (screen === 'intro') {
    return (
      <IntroRegisterScreen
        register={currentRegister}
        registerIndex={currentRegisterIndex}
        onStart={startRegisterQuestions}
      />
    );
  }

  if (screen === 'question') {
    const savedAnswer = currentRegistreData?.questions?.find(
      q => q.numero === currentQuestionIndex + 1
    )?.reponse || '';
    return (
      <>
        <QuestionScreen
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          registerIndex={currentRegisterIndex}
          registerLabel={currentRegister?.label}
          onNext={goToNextQuestion}
          onBack={goToPreviousQuestion}
          onCancel={cancelAudit}
          savedAnswer={savedAnswer}
          isLoading={isLoading}
        />
        <ErrorToast message={error} onRetry={retryScoring} visible={!!error} />
      </>
    );
  }

  if (screen === 'loading_score') {
    return <LoadingScreen message="Claude analyse tes réponses..." />;
  }

  if (screen === 'score') {
    return (
      <>
        <RegisterScoreScreen
          register={currentRegister}
          questions={currentRegistreData?.questions || []}
          registerScore={currentRegistreData?.score}
          onConfirm={confirmRegisterAndContinue}
        />
        <ErrorToast message={error} onRetry={retryScoring} visible={!!error} />
      </>
    );
  }

  if (screen === 'loading_diagnostic') {
    return (
      <>
        <LoadingScreen message="Claude génère ton diagnostic final..." />
        <ErrorToast message={error} onRetry={retryDiagnostic} visible={!!error} />
      </>
    );
  }

  if (screen === 'diagnostic') {
    return (
      <DiagnosticScreen
        registres={session?.registres || {}}
        diagnostic={session?.diagnostic}
      />
    );
  }

  return null;
}
