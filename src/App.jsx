import { useEffect } from 'react';
import { useAuthStore, useAuditStore, useUIStore } from './store/useStore';
import AuthScreen from './components/screens/AuthScreen';
import { REGISTERS, QUESTIONS } from './data/questions';
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

export { PREVIEW_DATA } from './lib/previewData';

function LoadingScreen({ message }) {
  return (
    <div className="min-h-screen bg-[#f5f0ea] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-orange-200 border-t-[#e07b39] rounded-full animate-spin" />
      <p className="text-[#2d1a0e]/60 text-sm">{message}</p>
    </div>
  );
}

export default function App() {
  // Auth
  const { user, authLoading, initAuth, signInWithGoogle, signInWithEmail, signOut } = useAuthStore();

  // Audit
  const {
    session, screen, currentRegisterIndex, currentQuestionIndex,
    isLoading, error,
    goToNextQuestion, goToPreviousQuestion, cancelAudit,
    confirmRegisterAndContinue, retryScoring, retryDiagnostic, setError,
  } = useAuditStore();

  // UI
  const {
    viewingSession, setViewingSession,
    activeTest, setActiveTest,
    showDemoReport, setShowDemoReport,
    pendingTest, checkingParams,
    handleStart,
  } = useUIStore();

  // Init auth + deep link
  useEffect(() => {
    const cleanup = initAuth();
    return cleanup;
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const testParam = params.get('test');
    const authParam = params.get('auth');
    const hasAuthCode = params.get('code');

    if (authParam === 'google' && !hasAuthCode) {
      signInWithGoogle();
    } else if (testParam && ['4-registres', 'instinctif', 'emotionnel', 'mental'].includes(testParam)) {
      useUIStore.getState().setPendingTest(testParam);
      localStorage.setItem('pendingTest', testParam);
    } else {
      const stored = localStorage.getItem('pendingTest');
      if (stored && ['4-registres', 'instinctif', 'emotionnel', 'mental'].includes(stored)) {
        useUIStore.getState().setPendingTest(stored);
      }
    }
    useUIStore.getState().setCheckingParams(false);
  }, []);

  // Lancer le test en attente après connexion
  useEffect(() => {
    if (user && pendingTest && !activeTest) {
      handleStart(pendingTest);
      useUIStore.getState().setPendingTest(null);
      localStorage.removeItem('pendingTest');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user, pendingTest, activeTest]);

  if (authLoading) return <LoadingScreen message="Chargement..." />;

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

  if (showDemoReport) {
    return <InstinctifReportSebastian onBack={() => setShowDemoReport(false)} />;
  }

  // Active tests
  if (activeTest) {
    const testProps = { user, onComplete: () => setActiveTest(null), onCancel: () => setActiveTest(null) };
    if (activeTest === 'instinctif') return <InstinctifTest {...testProps} />;
    if (activeTest === 'emotionnel') return <EmotionnelTest {...testProps} />;
    if (activeTest === 'mental') return <MentalTest {...testProps} />;
    if (activeTest === '4-registres') return <QuatreRegistresTest {...testProps} />;
  }

  // Audit flow
  const currentRegister = REGISTERS[currentRegisterIndex];
  const currentRegistreId = ['reptilien', 'instinctif', 'emotionnel', 'rationnel'][currentRegisterIndex];
  const globalQuestionIndex = currentRegisterIndex * 5 + currentQuestionIndex;
  const currentQuestion = QUESTIONS[globalQuestionIndex];
  const currentRegistreData = session?.registres?.[currentRegistreId];

  if (screen === 'home') {
    const isLocalDev = window.location.hostname === 'localhost';
    if (user || isLocalDev) {
      return (
        <>
          <DashboardScreen
            user={user}
            onSignOut={signOut}
            onStartAudit={handleStart}
            onViewSession={setViewingSession}
          />
          <ErrorToast message={error} onRetry={null} visible={!!error} />
        </>
      );
    }

    if (checkingParams) return <LoadingScreen message="Chargement..." />;

    const isDirectAuth = new URLSearchParams(window.location.search).get('auth') === 'google';
    if (isDirectAuth) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Connexion en cours...</p>
        </div>
      );
    }

    if (pendingTest) {
      return (
        <>
          <AuthScreen
            onSignInWithGoogle={signInWithGoogle}
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
        {(() => { window.location.href = '/landing.html'; return null; })()}
      </>
    );
  }

  if (screen === 'overview') return <AuditOverviewScreen onStart={() => useAuditStore.getState().startNewAudit()} />;

  if (screen === 'intro') {
    return (
      <IntroRegisterScreen
        register={currentRegister}
        registerIndex={currentRegisterIndex}
        onStart={() => useAuditStore.getState().startRegisterQuestions()}
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

  if (screen === 'loading_score') return <LoadingScreen message="Claude analyse tes réponses..." />;

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
