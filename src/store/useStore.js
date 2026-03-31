import { create } from 'zustand';
import { loadSession, saveSession, resetSession, createNewSession, updateCurrentStep } from '../lib/storage';
import { calculateRegisterScore, adjustScore } from '../lib/scoring';
import { callScoringAPI, callDiagnosticAPI, validateDiagnostic } from '../lib/api';
import { generateFallbackDiagnostic } from '../lib/diagnosticFallback';
import { REGISTER_ORDER, QUESTIONS } from '../data/questions';
import { supabase } from '../lib/supabase';

// ─── Auth ──────────────────────────────────────────────

export const useAuthStore = create((set) => ({
  user: null,
  authLoading: true,

  setUser: (user) => set({ user }),
  setAuthLoading: (authLoading) => set({ authLoading }),

  initAuth: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ user: session?.user ?? null, authLoading: false });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, authLoading: false });
    });

    return () => subscription.unsubscribe();
  },

  signInWithGoogle: async () => {
    const pendingTest = new URLSearchParams(window.location.search).get('test') || localStorage.getItem('pendingTest');
    if (pendingTest) localStorage.setItem('pendingTest', pendingTest);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://reboot-v3.vercel.app/?auth=success' },
    });
    if (error) throw error;
    return data;
  },

  signInWithEmail: async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
  },

  signOut: () => supabase.auth.signOut(),
}));

// ─── Audit ─────────────────────────────────────────────

let pendingScoring = null; // mutation-safe ref

export const useAuditStore = create((set, get) => {
  const saved = loadSession();

  return {
    session: saved,
    screen: 'home',
    currentRegisterIndex: 0,
    currentQuestionIndex: 0,
    isLoading: false,
    error: null,

    setScreen: (screen) => set({ screen }),
    setError: (error) => set({ error }),

    startNewAudit: () => {
      resetSession();
      const newSession = createNewSession();
      set({ session: newSession, currentRegisterIndex: 0, currentQuestionIndex: 0, screen: 'intro', error: null });
    },

    resumeAudit: (savedSession) => {
      set({ session: savedSession });
      const { registre, question } = savedSession.current_step;
      set({ currentRegisterIndex: registre - 1, currentQuestionIndex: question - 1, screen: 'question' });
    },

    startRegisterQuestions: () => set({ screen: 'question' }),

    saveAnswer: (reponse, regIndex, qIndex) => {
      const registreId = REGISTER_ORDER[regIndex];
      const globalQuestionIndex = regIndex * 5 + qIndex;
      const questionMeta = QUESTIONS[globalQuestionIndex] || {};

      set((prev) => {
        const session = { ...prev.session };
        const questions = [...(session.registres[registreId].questions || [])];
        const localNumero = qIndex + 1;
        const existingIndex = questions.findIndex(q => q.numero === localNumero);
        const questionData = {
          numero: localNumero,
          texte: questionMeta.texte || '',
          dimensions: questionMeta.dimensions || [],
          reponse,
          sous_scores: [],
          score_claude: null,
          score_final: null,
          ajuste: false,
        };
        if (existingIndex >= 0) {
          questions[existingIndex] = questionData;
        } else {
          questions.push(questionData);
        }
        session.registres[registreId] = { ...session.registres[registreId], questions };
        session.current_step = { registre: regIndex + 1, question: localNumero };
        return { session };
      });
    },

    goToPreviousQuestion: () => {
      const { currentQuestionIndex } = get();
      if (currentQuestionIndex > 0) {
        set({ currentQuestionIndex: currentQuestionIndex - 1 });
      } else {
        set({ screen: 'intro' });
      }
    },

    cancelAudit: () => set({ screen: 'home' }),

    goToNextQuestion: async (reponse) => {
      const { currentQuestionIndex, currentRegisterIndex, saveAnswer } = get();
      saveAnswer(reponse, currentRegisterIndex, currentQuestionIndex);

      if (currentQuestionIndex < 4) {
        set({ currentQuestionIndex: currentQuestionIndex + 1 });
        updateCurrentStep(currentRegisterIndex + 1, currentQuestionIndex + 2);
      } else {
        set({ screen: 'loading_score' });
        pendingScoring = { registreIndex: currentRegisterIndex, lastReponse: reponse };
        await get()._scoreRegister();
      }
    },

    _scoreRegister: async () => {
      if (!pendingScoring) return;
      const { registreIndex, lastReponse } = pendingScoring;
      pendingScoring = null;

      set({ isLoading: true, error: null });
      const registreId = REGISTER_ORDER[registreIndex];
      const registreNames = ['Reptilien', 'Instinctif', 'Émotionnel', 'Rationnel'];
      const registreName = registreNames[registreIndex];

      try {
        const session = get().session;
        const registreQuestions = QUESTIONS.filter(q => q.registre === registreId);
        const sessionQuestions = session?.registres[registreId]?.questions || [];

        const questionsWithAnswers = registreQuestions.map((q, i) => {
          const localNumero = i + 1;
          const sessionQ = sessionQuestions.find(sq => sq.numero === localNumero);
          const reponse = sessionQ?.reponse ?? (i === 4 ? lastReponse : '');
          return { texte: q.texte, dimensions: q.dimensions, reponse };
        });

        let result;
        let attempts = 0;
        while (attempts < 3) {
          try {
            result = await callScoringAPI(registreName, questionsWithAnswers);
            break;
          } catch (e) {
            attempts++;
            if (attempts >= 3) throw e;
            await new Promise(r => setTimeout(r, 1000 * attempts));
          }
        }

        set((prev) => {
          const updated = { ...prev.session };
          const sessionQs = updated.registres[registreId].questions;
          const updatedQuestions = registreQuestions.map((q, i) => {
            const localNumero = i + 1;
            const sessionQ = sessionQs.find(sq => sq.numero === localNumero) || {};
            const scored = result.questions?.[i];
            return {
              ...sessionQ,
              numero: localNumero,
              texte: q.texte,
              dimensions: q.dimensions,
              sous_scores: scored?.sous_scores || [],
              score_claude: scored?.score_total ?? 0,
              score_final: scored?.score_total ?? 0,
              ajuste: false,
            };
          });
          updated.registres[registreId] = {
            ...updated.registres[registreId],
            questions: updatedQuestions,
            points_forts: result.points_forts || [],
            points_faibles: result.points_faibles || [],
            score: calculateRegisterScore(updatedQuestions),
            completed: true,
          };
          return { session: updated, screen: 'score' };
        });
      } catch (e) {
        set({ error: e.message || 'Erreur API', screen: 'question' });
      } finally {
        set({ isLoading: false });
      }
    },

    adjustQuestionScore: (registreId, questionNumero, delta) => {
      set((prev) => {
        const updated = { ...prev.session };
        const questions = updated.registres[registreId].questions.map(q => {
          if (q.numero === questionNumero) {
            const newScore = adjustScore(q.score_final, delta);
            return { ...q, score_final: newScore, ajuste: newScore !== q.score_claude };
          }
          return q;
        });
        updated.registres[registreId] = {
          ...updated.registres[registreId],
          questions,
          score: calculateRegisterScore(questions),
        };
        return { session: updated };
      });
    },

    confirmRegisterAndContinue: async () => {
      const { currentRegisterIndex } = get();
      if (currentRegisterIndex < 3) {
        set({ currentRegisterIndex: currentRegisterIndex + 1, currentQuestionIndex: 0, screen: 'intro' });
      } else {
        set({ screen: 'loading_diagnostic' });
        await get()._generateDiagnostic();
      }
    },

    _generateDiagnostic: async () => {
      set({ isLoading: true, error: null });
      try {
        const session = get().session;
        let result;
        let attempts = 0;
        let apiFailed = false;

        while (attempts < 3) {
          try {
            result = await callDiagnosticAPI(session.registres);
            if (validateDiagnostic(result)) break;
            throw new Error('Réponse API incomplète');
          } catch (e) {
            attempts++;
            if (attempts >= 3) { apiFailed = true; break; }
            await new Promise(r => setTimeout(r, 1000 * attempts));
          }
        }

        if (apiFailed || !validateDiagnostic(result)) {
          result = generateFallbackDiagnostic(session.registres);
        }

        set({ session: { ...session, diagnostic: result }, screen: 'diagnostic' });
      } catch (e) {
        set({ error: e.message || 'Erreur diagnostic', screen: 'score' });
      } finally {
        set({ isLoading: false });
      }
    },

    retryScoring: () => {
      set({ error: null, screen: 'loading_score' });
      const { session, currentRegisterIndex } = get();
      pendingScoring = { registreIndex: currentRegisterIndex, lastReponse: null };
      get()._scoreRegister();
    },

    retryDiagnostic: () => {
      set({ error: null, screen: 'loading_diagnostic' });
      get()._generateDiagnostic();
    },
  };
});

// Persister la session dans localStorage
useAuditStore.subscribe((state) => {
  if (state.session) saveSession(state.session);
});

// ─── UI ────────────────────────────────────────────────

export const useUIStore = create((set) => ({
  viewingSession: null,
  activeTest: null,
  showDemoReport: false,
  isFuturistic: typeof window !== 'undefined' && localStorage.getItem('reboot-theme') === 'futuristic',
  activeTab: typeof window !== 'undefined' ? localStorage.getItem('reboot-active-tab') || 'overview' : 'overview',
  pendingTest: null,
  checkingParams: true,

  setViewingSession: (session) => set({ viewingSession: session }),
  setActiveTest: (test) => set({ activeTest: test }),
  setShowDemoReport: (show) => set({ showDemoReport: show }),
  setPendingTest: (test) => set({ pendingTest: test }),
  setCheckingParams: (checking) => set({ checkingParams: checking }),

  setIsFuturistic: (isFuturistic) => {
    localStorage.setItem('reboot-theme', isFuturistic ? 'futuristic' : 'scientific');
    set({ isFuturistic });
  },

  setActiveTab: (tab) => {
    localStorage.setItem('reboot-active-tab', tab);
    set({ activeTab: tab });
  },

  handleStart: (mode) => {
    const { setActiveTest, setShowDemoReport } = useUIStore.getState();
    const { resumeAudit } = useAuditStore.getState();
    const saved = loadSession();

    if (['4-registres', 'instinctif', 'emotionnel', 'mental'].includes(mode)) {
      setActiveTest(mode);
    } else if (mode === 'demo-report') {
      setShowDemoReport(true);
    } else if (mode === 'resume' && saved) {
      resumeAudit(saved);
    } else {
      setActiveTest('4-registres');
    }
  },
}));
