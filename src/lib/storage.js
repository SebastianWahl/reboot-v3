const STORAGE_KEY = 'reboot_session';

function emptyRegistres() {
  return {
    reptilien:  { completed: false, questions: [], score: null, points_forts: [], points_faibles: [] },
    instinctif: { completed: false, questions: [], score: null, points_forts: [], points_faibles: [] },
    emotionnel: { completed: false, questions: [], score: null, points_forts: [], points_faibles: [] },
    rationnel:  { completed: false, questions: [], score: null, points_forts: [], points_faibles: [] },
  };
}

export function saveSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function resetSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function updateCurrentStep(registre, question) {
  const session = loadSession();
  if (!session) return;
  session.current_step = { registre, question };
  saveSession(session);
}

export function createNewSession() {
  const session = {
    session_id: crypto.randomUUID(),
    date: new Date().toISOString(),
    current_step: { registre: 1, question: 1 },
    registres: emptyRegistres(),
    diagnostic: null,
  };
  saveSession(session);
  return session;
}
