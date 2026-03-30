import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
export { PREVIEW_DATA } from './lib/previewData';
import AuthScreen from './components/screens/AuthScreen';
import { useAudit } from './hooks/useAudit';
import { loadSession } from './lib/storage';
import { REGISTERS, QUESTIONS } from './data/questions';
import LandingPage from './components/screens/LandingPage';
import AuditOverviewScreen from './components/screens/AuditOverviewScreen';
import IntroRegisterScreen from './components/screens/IntroRegisterScreen';
import QuestionScreen from './components/screens/QuestionScreen';
import RegisterScoreScreen from './components/screens/RegisterScoreScreen';
import DiagnosticScreen from './components/screens/DiagnosticScreen';
import ErrorToast from './components/ui/ErrorToast';
import DashboardScreen from './components/screens/DashboardScreen';
import InstinctifTest from './components/tests/InstinctifTest';
import EmotionnelTest from './components/tests/EmotionnelTest';
import MentalTest from './components/tests/MentalTest';
import QuatreRegistresTest from './components/tests/QuatreRegistresTest';
import InstinctifReportSebastian from './components/tests/InstinctifReportSebastian';


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
  const [activeTest, setActiveTest] = useState(null); // '4-registres', 'instinctif', 'emotionnel'
  const [showDemoReport, setShowDemoReport] = useState(false); // Pour afficher le rapport de Sebastian
  const [pendingTest, setPendingTest] = useState(null); // Test à lancer après connexion
  const [checkingParams, setCheckingParams] = useState(true); // État de vérification des params

  // Lire le paramètre URL ou localStorage pour savoir quel test lancer ou si on doit lancer auth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const testParam = params.get('test');
    const authParam = params.get('auth');
    const storedTest = localStorage.getItem('pendingTest');
    
    // Si on vient de revenir d'une auth Google (avec code dans l'URL), ne pas relancer
    const hasAuthCode = params.get('code');
    
    if (authParam === 'google' && !hasAuthCode) {
      // Lancer directement l'auth Google si pas déjà en cours
      console.log('Auth parameter detected, launching Google sign in...');
      signInWithGoogle();
    } else if (testParam && ['4-registres', 'instinctif', 'emotionnel', 'mental'].includes(testParam)) {
      setPendingTest(testParam);
      localStorage.setItem('pendingTest', testParam);
    } else if (storedTest && ['4-registres', 'instinctif', 'emotionnel', 'mental'].includes(storedTest)) {
      setPendingTest(storedTest);
    }
    
    setCheckingParams(false); // Fin de la vérification
  }, []);

  // Lancer le test en attente après connexion
  useEffect(() => {
    if (user && pendingTest && !activeTest) {
      handleStart(pendingTest);
      setPendingTest(null);
      localStorage.removeItem('pendingTest');
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user, pendingTest, activeTest]);

  function handleSignOut() {
    signOut();
  }

  function handleStart(mode) {
    if (mode === 'instinctif') {
      setActiveTest('instinctif');
    } else if (mode === 'emotionnel') {
      setActiveTest('emotionnel');
    } else if (mode === 'mental') {
      setActiveTest('mental');
    } else if (mode === '4-registres') {
      setActiveTest('4-registres');
    } else if (mode === 'demo-report') {
      setShowDemoReport(true);
    } else if (mode === 'resume' && savedSession) {
      resumeAudit(savedSession);
    } else {
      // Default: nouvel audit 4-registres avec le nouveau composant
      setActiveTest('4-registres');
    }
  }
  
  function handleTestComplete() {
    setActiveTest(null);
  }
  
  function handleTestCancel() {
    setActiveTest(null);
  }
  
  function handleDemoReportClose() {
    setShowDemoReport(false);
  }

  if (authLoading) {
    return <LoadingScreen message="Chargement..." />;
  }

  if (viewingSession) {
    return (
      <DiagnosticScreen
        registres={viewingSession.registres}
        diagnostic={viewingSession.diagnostic}
        answers={viewingSession.answers || []}
        onBack={() => setViewingSession(null)}
      />
    );
  }
  
  // Afficher le rapport démo de Sebastian
  if (showDemoReport) {
    return (
      <InstinctifReportSebastian 
        onBack={handleDemoReportClose}
      />
    );
  }
  
  // Afficher le test instinctif si sélectionné
  if (activeTest === 'instinctif') {
    return (
      <InstinctifTest
        user={user}
        onComplete={handleTestComplete}
        onCancel={handleTestCancel}
      />
    );
  }
  
  // Afficher le test émotionnel si sélectionné
  if (activeTest === 'emotionnel') {
    return (
      <EmotionnelTest
        user={user}
        onComplete={handleTestComplete}
        onCancel={handleTestCancel}
      />
    );
  }
  
  // Afficher le test mental si sélectionné
  if (activeTest === 'mental') {
    return (
      <MentalTest
        user={user}
        onComplete={handleTestComplete}
        onCancel={handleTestCancel}
      />
    );
  }
  
  // Afficher le test des 4 registres si sélectionné
  if (activeTest === '4-registres') {
    return (
      <QuatreRegistresTest
        user={user}
        onComplete={handleTestComplete}
        onCancel={handleTestCancel}
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
            onStartAudit={handleStart}
            onViewSession={setViewingSession}
          />
          <ErrorToast message={error} onRetry={null} visible={!!error} />
        </>
      );
    }

    // Attendre la fin de la vérification des paramètres avant de rediriger
    if (checkingParams) {
      return <LoadingScreen message="Chargement..." />;
    }

    // Si on a demandé auth Google directement et qu'on est en cours de connexion
    const isDirectAuth = new URLSearchParams(window.location.search).get('auth') === 'google';
    
    if (isDirectAuth) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Connexion en cours...</p>
        </div>
      );
    }
    
    // Si un test est en attente, montrer l'écran d'auth
    if (pendingTest) {
      return (
        <>
          <AuthScreen
            onSignInWithGoogle={() => {
              console.log('Google sign in clicked, pendingTest:', pendingTest);
              signInWithGoogle();
            }}
            onSignInWithEmail={signInWithEmail}
          />
          <ErrorToast message={error} onRetry={null} visible={!!error} />
        </>
      );
    }

    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <p>Redirection vers la landing page...</p>
        </div>
        {(() => { 
          window.location.href = '/landing.html'; 
          return null; 
        })()}
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
