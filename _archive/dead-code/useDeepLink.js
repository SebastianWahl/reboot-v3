import { useState, useEffect } from 'react';

const VALID_TESTS = ['4-registres', 'instinctif', 'emotionnel', 'mental'];
const STORAGE_KEY = 'pendingTest';

/**
 * Gère le deep linking : lecture des params URL et localStorage
 * pour lancer automatiquement un test ou une auth après connexion.
 */
export function useDeepLink({ onAuthRequested }) {
  const [pendingTest, setPendingTest] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const testParam = params.get('test');
    const authParam = params.get('auth');
    const hasAuthCode = params.get('code');

    if (authParam === 'google' && !hasAuthCode) {
      onAuthRequested?.();
    } else if (testParam && VALID_TESTS.includes(testParam)) {
      setPendingTest(testParam);
      localStorage.setItem(STORAGE_KEY, testParam);
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && VALID_TESTS.includes(stored)) {
        setPendingTest(stored);
      }
    }

    setChecking(false);
  }, []);

  /** Appelé quand l'utilisateur lance le test en attente */
  function consumePendingTest() {
    if (!pendingTest) return null;
    const test = pendingTest;
    setPendingTest(null);
    localStorage.removeItem(STORAGE_KEY);
    window.history.replaceState({}, document.title, window.location.pathname);
    return test;
  }

  return { pendingTest, checking, consumePendingTest };
}
