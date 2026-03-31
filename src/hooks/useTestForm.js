import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const STORAGE_EXPIRY = 24 * 60 * 60 * 1000; // 24h

export function useTestForm(config) {
  const {
    questions,
    calculateScore,
    systemPrompt,
    testType,
    storageKey,
    formatUserMessage,
    generateFallbackReport,
    user,
    onComplete,
    onCancel,
  } = config;

  const [status, setStatus] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [report, setReport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Draft recovery
  useEffect(() => {
    const draft = localStorage.getItem(storageKey);
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
      } catch {
        // Silently ignore corrupted drafts
      }
    }
  }, [storageKey]);

  // Auto-save every 30s
  useEffect(() => {
    if (status === 'question') {
      const interval = setInterval(() => {
        localStorage.setItem(storageKey, JSON.stringify({
          answers,
          currentQuestion,
          timestamp: Date.now(),
        }));
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [answers, currentQuestion, status, storageKey]);

  const handleAnswer = useCallback((questionId, data) => {
    setAnswers(prev => ({ ...prev, [questionId]: data }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setStatus('recap');
    }
  }, [currentQuestion, questions.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentQuestion]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setStatus('loading');

    try {
      const scores = calculateScore(answers);
      const userMessage = formatUserMessage(answers, scores);

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      if (!accessToken) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/claude-proxy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            systemPrompt,
            userMessage,
            maxTokens: 4000,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const apiData = await response.json();

      let reportData;
      try {
        let content = apiData.choices?.[0]?.message?.content || apiData.content?.[0]?.text;
        content = content.replace(/```json\s*/gi, '').replace(/``*\s*$/g, '').trim();
        const firstBrace = content.indexOf('{');
        const lastBrace = content.lastIndexOf('}');
        if (firstBrace >= 0 && lastBrace > firstBrace) {
          content = content.substring(firstBrace, lastBrace + 1);
        }
        reportData = JSON.parse(content);
      } catch {
        reportData = generateFallbackReport(scores);
      }

      setReport(reportData);

      const sessionId = crypto.randomUUID();
      const { error: insertError } = await supabase
        .from('reboot_sessions')
        .insert({
          session_id: sessionId,
          user_id: user?.id,
          date: new Date().toISOString(),
          test_type: testType,
          session_data: {
            type: testType,
            scores: scores.dimensions,
            score_global: scores.scoreSur100,
            answers,
            interpretation: scores.interpretation,
            diagnostic: reportData,
            status: 'completed',
            created_at: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Erreur sauvegarde:', insertError);
      }

      if (onComplete) {
        await onComplete({
          type: testType,
          sessionId,
          scores,
          answers,
          report: reportData,
          timestamp: new Date().toISOString(),
        });
      }

      localStorage.removeItem(storageKey);
      setStatus('report');
    } catch (error) {
      console.error('Error submitting test:', error);
      alert(error.message || 'Une erreur est survenue. Veuillez réessayer.');
      setStatus('recap');
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, calculateScore, formatUserMessage, generateFallbackReport, systemPrompt, testType, user, onComplete, storageKey]);

  const handleStart = useCallback(() => {
    setStatus('question');
    setCurrentQuestion(0);
  }, []);

  const handleExit = useCallback(() => {
    if (Object.keys(answers).length > 0) {
      if (window.confirm('Vos réponses sont sauvegardées. Voulez-vous vraiment quitter ?')) {
        onCancel?.();
      }
    } else {
      onCancel?.();
    }
  }, [answers, onCancel]);

  return {
    status,
    currentQuestion,
    answers,
    report,
    isSubmitting,
    setCurrentQuestion,
    setStatus,
    handleAnswer,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleStart,
    handleExit,
  };
}
