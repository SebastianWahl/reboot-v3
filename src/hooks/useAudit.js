import { useState, useEffect, useRef } from 'react';
import { loadSession, saveSession, resetSession, createNewSession, updateCurrentStep } from '../lib/storage';
import { calculateRegisterScore, adjustScore } from '../lib/scoring';
import { callScoringAPI, callDiagnosticAPI } from '../lib/api';
import { REGISTER_ORDER, QUESTIONS } from '../data/questions';

export function useAudit() {
  const [session, setSession] = useState(null);
  const [screen, setScreen] = useState('home');
  const [currentRegisterIndex, setCurrentRegisterIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref to hold the latest session value for async operations
  const sessionRef = useRef(null);
  // Pending scoring: holds the last answer if we need to trigger scoring after state flush
  const pendingScoringRef = useRef(null);

  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      setSession(saved);
      sessionRef.current = saved;
    }
  }, []);

  useEffect(() => {
    if (session) {
      saveSession(session);
      sessionRef.current = session;
    }
  }, [session]);

  // Trigger scoring when pendingScoringRef is set and session is updated
  useEffect(() => {
    if (pendingScoringRef.current && session) {
      const { registreIndex, lastReponse } = pendingScoringRef.current;
      pendingScoringRef.current = null;
      _scoreRegister(registreIndex, session, lastReponse);
    }
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  function startNewAudit() {
    resetSession();
    const newSession = createNewSession();
    setSession(newSession);
    sessionRef.current = newSession;
    setCurrentRegisterIndex(0);
    setCurrentQuestionIndex(0);
    setScreen('intro');
    setError(null);
  }

  function resumeAudit(savedSession) {
    setSession(savedSession);
    sessionRef.current = savedSession;
    const { registre, question } = savedSession.current_step;
    setCurrentRegisterIndex(registre - 1);
    setCurrentQuestionIndex(question - 1);
    setScreen('question');
  }

  function startRegisterQuestions() {
    setScreen('question');
  }

  function saveAnswerToSession(reponse, regIndex, qIndex) {
    const registreId = REGISTER_ORDER[regIndex];
    const globalQuestionIndex = regIndex * 5 + qIndex;
    const questionMeta = QUESTIONS[globalQuestionIndex] || {};

    setSession(prev => {
      const updated = { ...prev };
      const questions = [...(updated.registres[registreId].questions || [])];
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
      updated.registres[registreId] = { ...updated.registres[registreId], questions };
      updated.current_step = { registre: regIndex + 1, question: localNumero };
      return updated;
    });
  }

  function goToNextQuestion(reponse) {
    saveAnswerToSession(reponse, currentRegisterIndex, currentQuestionIndex);

    if (currentQuestionIndex < 4) {
      setCurrentQuestionIndex(prev => prev + 1);
      updateCurrentStep(currentRegisterIndex + 1, currentQuestionIndex + 2);
    } else {
      // Last question — trigger scoring after state is flushed
      setScreen('loading_score');
      pendingScoringRef.current = { registreIndex: currentRegisterIndex, lastReponse: reponse };
    }
  }

  async function _scoreRegister(regIndex, currentSession, lastReponse) {
    setIsLoading(true);
    setError(null);
    const registreId = REGISTER_ORDER[regIndex];
    const registreNames = ['Reptilien', 'Instinctif', 'Émotionnel', 'Rationnel'];
    const registreName = registreNames[regIndex];

    try {
      const registreQuestions = QUESTIONS.filter(q => q.registre === registreId);
      const sessionQuestions = currentSession?.registres[registreId]?.questions || [];

      const questionsWithAnswers = registreQuestions.map((q, i) => {
        const localNumero = i + 1;
        const sessionQ = sessionQuestions.find(sq => sq.numero === localNumero);
        // Use lastReponse for Q5 if it hasn't been saved yet
        const reponse = sessionQ?.reponse || (i === 4 ? lastReponse : '');
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
        }
      }

      setSession(prev => {
        const updated = { ...prev };
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
        return updated;
      });

      setScreen('score');
    } catch (e) {
      setError(e.message || 'Erreur API');
      setScreen('question');
    } finally {
      setIsLoading(false);
    }
  }

  function adjustQuestionScore(registreId, questionNumero, delta) {
    setSession(prev => {
      const updated = { ...prev };
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
      return updated;
    });
  }

  function confirmRegisterAndContinue() {
    if (currentRegisterIndex < 3) {
      setCurrentRegisterIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
      setScreen('intro');
    } else {
      setScreen('loading_diagnostic');
      _generateDiagnostic();
    }
  }

  async function _generateDiagnostic() {
    setIsLoading(true);
    setError(null);
    try {
      const currentSession = sessionRef.current;
      let result;
      let attempts = 0;
      while (attempts < 3) {
        try {
          result = await callDiagnosticAPI(currentSession.registres);
          break;
        } catch (e) {
          attempts++;
          if (attempts >= 3) throw e;
        }
      }
      setSession(prev => ({ ...prev, diagnostic: result }));
      setScreen('diagnostic');
    } catch (e) {
      setError(e.message || 'Erreur diagnostic');
      setScreen('score');
    } finally {
      setIsLoading(false);
    }
  }

  function retryScoring() {
    setError(null);
    setScreen('loading_score');
    _scoreRegister(currentRegisterIndex, sessionRef.current, null);
  }

  return {
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
  };
}
