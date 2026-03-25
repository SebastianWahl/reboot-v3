import { useAudit } from './hooks/useAudit';
import { loadSession } from './lib/storage';
import { REGISTERS, QUESTIONS } from './data/questions';
import HomeScreen from './components/screens/HomeScreen';
import IntroRegisterScreen from './components/screens/IntroRegisterScreen';
import QuestionScreen from './components/screens/QuestionScreen';
import RegisterScoreScreen from './components/screens/RegisterScoreScreen';
import DiagnosticScreen from './components/screens/DiagnosticScreen';
import ErrorToast from './components/ui/ErrorToast';

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
    resumeAudit,
    startRegisterQuestions,
    goToNextQuestion,
    adjustQuestionScore,
    confirmRegisterAndContinue,
    retryScoring,
    setError,
  } = useAudit();

  const savedSession = loadSession();

  function handleStart(mode) {
    if (mode === 'resume' && savedSession) {
      resumeAudit(savedSession);
    } else {
      startNewAudit();
    }
  }

  const currentRegister = REGISTERS[currentRegisterIndex];
  const currentRegistreId = ['reptilien', 'instinctif', 'emotionnel', 'rationnel'][currentRegisterIndex];
  const globalQuestionIndex = currentRegisterIndex * 5 + currentQuestionIndex;
  const currentQuestion = QUESTIONS[globalQuestionIndex];
  const currentRegistreData = session?.registres?.[currentRegistreId];

  if (screen === 'home') {
    return (
      <>
        <HomeScreen onStart={handleStart} savedSession={savedSession} />
        <ErrorToast message={error} onRetry={null} visible={!!error} />
      </>
    );
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
    return (
      <>
        <QuestionScreen
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          registerIndex={currentRegisterIndex}
          registerLabel={currentRegister?.label}
          onNext={goToNextQuestion}
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
          pointsForts={currentRegistreData?.points_forts || []}
          pointsFaibles={currentRegistreData?.points_faibles || []}
          onAdjust={(questionNumero, delta) =>
            adjustQuestionScore(currentRegistreId, questionNumero, delta)
          }
          onConfirm={confirmRegisterAndContinue}
        />
        <ErrorToast message={error} onRetry={retryScoring} visible={!!error} />
      </>
    );
  }

  if (screen === 'loading_diagnostic') {
    return <LoadingScreen message="Claude génère ton diagnostic final..." />;
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
