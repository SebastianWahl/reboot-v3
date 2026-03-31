import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveSession, loadSession, resetSession, createNewSession, updateCurrentStep } from '../../src/lib/storage';

// Mock crypto.randomUUID
vi.stubGlobal('crypto', {
  randomUUID: () => 'test-uuid-1234',
});

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveSession / loadSession', () => {
    it('saves and loads a session', () => {
      const session = { session_id: 'test', date: '2026-01-01', registres: {} };
      saveSession(session);
      expect(loadSession()).toEqual(session);
    });

    it('returns null when no session exists', () => {
      expect(loadSession()).toBeNull();
    });

    it('returns null for corrupted JSON', () => {
      localStorage.setItem('reboot_session', 'not json{{{');
      expect(loadSession()).toBeNull();
    });
  });

  describe('resetSession', () => {
    it('removes session from localStorage', () => {
      saveSession({ session_id: 'test' });
      resetSession();
      expect(loadSession()).toBeNull();
    });
  });

  describe('createNewSession', () => {
    it('creates a session with all required fields', () => {
      const session = createNewSession();
      expect(session.session_id).toBe('test-uuid-1234');
      expect(session.date).toBeTruthy();
      expect(session.current_step).toEqual({ registre: 1, question: 1 });
      expect(session.registres).toHaveProperty('reptilien');
      expect(session.registres).toHaveProperty('instinctif');
      expect(session.registres).toHaveProperty('emotionnel');
      expect(session.registres).toHaveProperty('rationnel');
      expect(session.diagnostic).toBeNull();
    });

    it('initializes registres as not completed', () => {
      const session = createNewSession();
      for (const reg of Object.values(session.registres)) {
        expect(reg.completed).toBe(false);
        expect(reg.questions).toEqual([]);
        expect(reg.score).toBeNull();
      }
    });

    it('saves session to localStorage', () => {
      createNewSession();
      expect(loadSession()).not.toBeNull();
    });
  });

  describe('updateCurrentStep', () => {
    it('updates current_step on existing session', () => {
      createNewSession();
      updateCurrentStep(2, 3);
      const session = loadSession();
      expect(session.current_step).toEqual({ registre: 2, question: 3 });
    });

    it('does nothing if no session exists', () => {
      updateCurrentStep(1, 1);
      expect(loadSession()).toBeNull();
    });
  });
});
