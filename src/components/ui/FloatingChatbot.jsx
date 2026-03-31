import { useState, useRef, useEffect, useCallback } from 'react';
import doctorClaude from '../../assets/doctor-claude.jpg';
import { supabase } from '../../lib/supabase';

const DEFAULT_BUBBLE_DELAY_MS = 4000;
const STORAGE_KEY_PREFIX = 'doctor-claude-';
const MAX_RAW_MESSAGES = 20; // avant synthèse
const SUMMARY_TRIGGER_COUNT = 24; // déclenche la synthèse après N messages

function getStorageKey(userId) {
  return `${STORAGE_KEY_PREFIX}${userId || 'anon'}`;
}

function loadConversation(userId) {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return { messages: [], summary: '' };
    return JSON.parse(raw);
  } catch {
    return { messages: [], summary: '' };
  }
}

function saveConversation(userId, data) {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(data));
  } catch { /* quota exceeded — silent */ }
}

function clearConversation(userId) {
  localStorage.removeItem(getStorageKey(userId));
}

export default function FloatingChatbot({ user, sessionData }) {
  const userId = user?.id || 'anon';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [summary, setSummary] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [bubbleDelay, setBubbleDelay] = useState(DEFAULT_BUBBLE_DELAY_MS);
  const [showSpeedPanel, setShowSpeedPanel] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const messagesEndRef = useRef(null);
  const abortRef = useRef(null);
  const messageTimersRef = useRef([]);

  const WELCOME_MSG = {
    role: 'assistant',
    content: 'Salut ! Je suis Doctor Claude, l\'IA qui te veut du bien. 👋\n\nJe peux t\'aider à comprendre ce que révèlent tes évaluations. Dis-moi sur quel aspect tu souhaites revenir, ou choisis un espace de discussion libre.',
    timestamp: new Date()
  };

  // Charger la conversation sauvegardée au montage
  useEffect(() => {
    const saved = loadConversation(userId);
    if (saved.messages.length > 0) {
      setMessages(saved.messages);
      setSummary(saved.summary || '');
    } else {
      setMessages([WELCOME_MSG]);
    }
    setHasLoaded(true);
  }, [userId]);

  // Sauvegarder à chaque changement de messages ou summary
  useEffect(() => {
    if (!hasLoaded) return;
    saveConversation(userId, { messages, summary });
  }, [messages, summary, userId, hasLoaded]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup
  useEffect(() => {
    return () => cancelPending();
  }, []);

  // ─── Helpers ──────────────────────────────────────────

  function cancelPending() {
    abortRef.current?.abort();
    abortRef.current = null;
    messageTimersRef.current.forEach(clearTimeout);
    messageTimersRef.current = [];
  }

  function handleClose() {
    cancelPending();
    setIsLoading(false);
    setIsOpen(false);
  }

  function handleReset() {
    cancelPending();
    clearConversation(userId);
    setMessages([WELCOME_MSG]);
    setSummary('');
    setSelectedTopic(null);
    setIsLoading(false);
  }

  // ─── Synthèse du contexte ────────────────────────────

  async function synthesizeConversation(currentMessages) {
    // Garder les 6 derniers messages bruts, synthétiser le reste
    const keepRecent = 6;
    const toSummarize = currentMessages.slice(0, -keepRecent);
    const recent = currentMessages.slice(-keepRecent);

    const historyText = toSummarize
      .map(m => `${m.role === 'user' ? 'Utilisateur' : 'Claude'}: ${m.content.substring(0, 200)}`)
      .join('\n');

    const existingSummary = summary ? `Résumé précédent:\n${summary}\n\n` : '';

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/claude-proxy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            systemPrompt: `Tu es un assistant qui synthétise des conversations. Résume de manière concise et structurée les échanges suivants en gardant les points clés, les décisions prises, les sujets abordés et les préférences exprimées par l'utilisateur. Ton résumé sera utilisé comme contexte pour continuer la conversation. Maximum 300 mots. Pas de formatage markdown.`,
            userMessage: `${existingSummary}Conversation à synthétiser:\n${historyText}`,
            maxTokens: 500
          })
        }
      );

      if (!response.ok) throw new Error('Synthèse échouée');

      const apiData = await response.json();
      const newSummary = apiData.choices?.[0]?.message?.content || summary;

      setSummary(newSummary);
      setMessages(recent);

      return newSummary;
    } catch (e) {
      console.warn('Synthèse échouée, on garde les messages bruts:', e);
      return summary;
    }
  }

  // ─── Envoi de messages ───────────────────────────────

  const sendAutoMessage = async (content, isTopicSelection = false, sectionName = null) => {
    const userMessage = { role: 'user', content, timestamp: new Date() };

    setMessages(prev => {
      const updated = [...prev, userMessage];

      // Déclencher la synthèse si trop de messages
      if (updated.length >= SUMMARY_TRIGGER_COUNT) {
        // On capture avant synthèse pour le contexte de l'API
        const forSynthesis = [...updated];
        setTimeout(() => synthesizeConversation(forSynthesis), 0);
      }

      return updated;
    });

    setIsLoading(true);
    if (isTopicSelection) setSelectedTopic(content);

    // Snapshot pour l'historique envoyé à l'IA
    const historySnapshot = [...messages, userMessage];

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/claude-proxy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            systemPrompt: generateContext(sectionName, historySnapshot),
            userMessage: content,
            maxTokens: 2000
          }),
          signal: controller.signal,
        }
      );

      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);

      const apiData = await response.json();
      const assistantContent = apiData.choices?.[0]?.message?.content ||
                              apiData.content?.[0]?.text ||
                              "Je n'ai pas pu générer de réponse.";

      const messageParts = splitMessageIntoParts(assistantContent, sectionName);

      for (let i = 0; i < messageParts.length; i++) {
        if (controller.signal.aborted) return;

        if (i > 0) {
          await new Promise((resolve, reject) => {
            const timer = setTimeout(resolve, bubbleDelay);
            messageTimersRef.current.push(timer);
            controller.signal.addEventListener('abort', () => {
              clearTimeout(timer);
              reject(new DOMException('Aborted', 'AbortError'));
            }, { once: true });
          });
        }

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: messageParts[i],
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Erreur chatbot:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Un problème technique m'empêche de répondre pour l'instant. Peux-tu réessayer dans un moment ?",
        timestamp: new Date()
      }]);
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
      abortRef.current = null;
    }
  };

  // ─── Contexte pour l'IA ──────────────────────────────

  function buildConversationHistory(currentMessages) {
    const relevant = currentMessages.slice(-12);
    return relevant
      .filter(m => m.role === 'user' || m.content.length < 500)
      .map(m => `${m.role === 'user' ? 'Utilisateur' : 'Doctor Claude'}: ${m.content}`)
      .join('\n');
  }

  const generateContext = (requestedSection = null, historyMessages = []) => {
    let context = "";

    if (sessionData?.registres) {
      const r = sessionData.registres;
      context += `Scores: Ancrage ${r.reptilien?.score ?? '?'}/25, Corps ${r.instinctif?.score ?? '?'}/25, Relations ${r.emotionnel?.score ?? '?'}/25, Pensée ${r.rationnel?.score ?? '?'}/25\n\n`;
    }

    if (sessionData?.diagnostic) {
      const d = sessionData.diagnostic;
      if (d.lecture_globale) {
        context += "Profil: " + (typeof d.lecture_globale === 'string' ? d.lecture_globale : JSON.stringify(d.lecture_globale)).substring(0, 800) + "\n\n";
      }
      if (d.forces?.length) context += "Points forts: " + d.forces.join(", ") + "\n";
      if (d.priorites?.liste?.length) context += "À travailler: " + d.priorites.liste.map(p => p.but).join(", ") + "\n";

      if (requestedSection === 'Recommandations' && d.conseils?.pratiques_quotidiennes) {
        const p = d.conseils.pratiques_quotidiennes;
        context += "\nConseils à partager:\n";
        if (p.matin?.length) context += "Matin: " + p.matin.join(" | ") + "\n";
        if (p.journee?.length) context += "Journée: " + p.journee.join(" | ") + "\n";
        if (p.soir?.length) context += "Soir: " + p.soir.join(" | ") + "\n";
      }
    }

    // Résumé des échanges passés (si synthétisé)
    if (summary) {
      context += "\n---\nRésumé des échanges précédents:\n" + summary + "\n";
    }

    // Historique récent
    const history = buildConversationHistory(historyMessages);
    if (history) {
      context += "\n---\nÉchanges récents:\n" + history + "\n";
    }

    context += "\n---\n\nTu es Doctor Claude, une IA bienveillante (l'IA qui te veut du bien).\n\n";
    context += "Consignes:\n";
    context += "- Tutoyer (tu, ton, tes)\n";
    context += "- Ne pas mentionner le rapport ou les résultats de façon mécanique\n";
    context += "- Parler naturellement, comme à un ami\n";
    context += "- Tu as accès à l'historique complet de la conversation — t'y référer si pertinent\n";
    context += "- Si l'utilisateur fait référence à un échange précédent, utilise le résumé et l'historique pour comprendre\n";

    if (requestedSection === 'Recommandations') {
      context += "- Dérouler tous les conseils : d'abord le matin, puis la journée, puis le soir\n";
    }

    if (requestedSection) context += "\nSujet demandé: " + requestedSection + "\n";

    return context;
  };

  const splitMessageIntoParts = (content, sectionName = null) => {
    if (content.length < 350) return [content];
    const parts = [];
    const sentences = content.match(/[^.!?]+[.!?]+\s*/g) || [content];
    let currentPart = '';
    sentences.forEach(sentence => {
      const trimmed = sentence.trim();
      if ((currentPart + ' ' + trimmed).length > 300 && currentPart) {
        parts.push(currentPart.trim());
        currentPart = trimmed;
      } else {
        currentPart += (currentPart ? ' ' : '') + trimmed;
      }
    });
    if (currentPart.trim()) parts.push(currentPart.trim());
    const maxParts = sectionName === 'Recommandations' ? 12 : 8;
    return parts.length > maxParts ? parts.slice(0, maxParts) : parts;
  };

  // ─── Handlers UI ─────────────────────────────────────

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    await sendAutoMessage(inputValue, false);
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCompletedTests = () => {
    const tests = [];
    if (sessionData?.registres) tests.push('4-registres');
    return tests;
  };

  const handleTestClick = (testId) => {
    const test = TEST_CONFIG[testId];
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `${test.emoji} D'accord, regardons ensemble ton ${test.label.toLowerCase()}.\n\n${test.description}\n\nTu as une idée de ce que tu aimerais explorer ?`,
      timestamp: new Date()
    }]);
    setSelectedTopic(testId);
  };

  const handleSectionClick = (sectionName) => {
    const isForces = sectionName.toLowerCase().includes('force') || sectionName.toLowerCase().includes('points forts');
    const instruction = isForces
      ? `Developpe la section "${sectionName}" de mon rapport. Commence par valoriser mes points forts.`
      : `Explique-moi en détail la section "${sectionName}" de mon rapport en t'appuyant sur les résultats.`;
    sendAutoMessage(instruction, false, sectionName);
  };

  const handleFreeDiscussion = () => {
    sendAutoMessage("J'aimerais explorer mon profil de manière plus libre", true);
  };

  // ─── Config ──────────────────────────────────────────

  const TEST_CONFIG = {
    '4-registres': {
      label: 'Audit des 4 Registres', color: '#C96442', emoji: '🧭',
      description: 'Ce test explore les 4 dimensions fondamentales de ton fonctionnement.',
      sections: ['Vue d\'ensemble', 'Forces', 'Axes de développement', 'Conseils généraux', 'Recommandations']
    },
    'instinctif': {
      label: 'Audit Instinctif & Corporel', color: '#c0392b', emoji: '🫀',
      description: 'Ce test approfondit ta relation avec ton corps et tes sensations.',
      sections: ['Profil instinctif', 'Points forts', 'Opportunités', 'Pratiques quotidiennes']
    },
    'emotionnel': {
      label: 'Audit Émotionnel & Relationnel', color: '#e6a817', emoji: '💞',
      description: 'Ce test explore ta vie relationnelle et émotionnelle.',
      sections: ['Profil émotionnel', 'Ressources', 'Progression', 'Exercices']
    },
    'mental': {
      label: 'Audit Mental & Cognitif', color: '#2980b9', emoji: '🧠',
      description: 'Ce test analyse tes processus de pensée.',
      sections: ['Profil cognitif', 'Forces mentales', 'Optimisation', 'Techniques']
    }
  };

  // ─── Render helpers ──────────────────────────────────

  const renderTestBubbles = () => {
    const completedTests = getCompletedTests();
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600 font-medium">De quoi veux-tu parler ?</p>
        <div className="flex flex-wrap gap-2">
          {completedTests.map(testId => {
            const test = TEST_CONFIG[testId];
            return (
              <button key={testId} onClick={() => handleTestClick(testId)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 text-white"
                style={{ backgroundColor: test.color }}>
                <span className="mr-1">{test.emoji}</span>{test.label}
              </button>
            );
          })}
          <button onClick={handleFreeDiscussion}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 border-2"
            style={{ borderColor: '#C96442', color: '#C96442', backgroundColor: 'transparent' }}>
            💬 Discussion libre
          </button>
        </div>
      </div>
    );
  };

  const renderContextualBubbles = () => {
    if (!selectedTopic || !TEST_CONFIG[selectedTopic]) return null;
    const test = TEST_CONFIG[selectedTopic];
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600 font-medium">Quel aspect souhaites-tu explorer ?</p>
        <div className="flex flex-wrap gap-2">
          {test.sections.map((section, idx) => (
            <button key={idx} onClick={() => handleSectionClick(section)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 border"
              style={{ borderColor: test.color, color: test.color, backgroundColor: `${test.color}15` }}>
              {section}
            </button>
          ))}
          <button onClick={() => setSelectedTopic(null)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 border border-gray-300 text-gray-500">
            ← Choisir un autre audit
          </button>
        </div>
      </div>
    );
  };

  // ─── Main render ─────────────────────────────────────

  return (
    <>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 transition-all hover:scale-110 flex items-center justify-center group"
          style={{ filter: 'drop-shadow(0 8px 20px rgba(201, 100, 66, 0.4))', backgroundColor: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
          <div className="relative">
            <div className="bg-white flex items-center justify-center relative"
              style={{ borderColor: '#C96442', borderWidth: '3px', borderStyle: 'solid', borderRadius: '24px', padding: '12px', width: '72px', height: '72px' }}>
              <div className="w-14 h-14 rounded-full overflow-hidden shadow-md">
                <img src={doctorClaude} alt="Doctor Claude" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="absolute bottom-0 right-0"
              style={{ width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '16px solid #C96442', transform: 'translate(4px, 12px) rotate(-15deg)' }} />
            <div className="absolute bottom-0 right-0"
              style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '12px solid white', transform: 'translate(6px, 10px) rotate(-15deg)' }} />
            <span className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-lg"
              style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: 'white' }}>AI</span>
          </div>
          <span className="absolute right-full mr-4 px-4 py-2 bg-white rounded-xl shadow-md text-sm text-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity font-medium border border-gray-100">
            Parler avec Doctor Claude
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-8 right-8 z-50 w-[450px] rounded-2xl shadow-2xl overflow-hidden transition-all"
          style={{ backgroundColor: '#fff', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)', maxHeight: '700px' }}>

          {/* Header */}
          <div className="flex items-center justify-between p-4" style={{ backgroundColor: '#C96442' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/50">
                <img src={doctorClaude} alt="Doctor Claude" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Doctor Claude</p>
                <p className="text-white/70 text-xs">L'IA qui te veut du bien</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setShowSpeedPanel(!showSpeedPanel)}
                className="text-white/70 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors"
                title="Vitesse d'affichage">
                ⚡
              </button>
              <button onClick={handleReset}
                className="text-white/70 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors"
                title="Nouvelle conversation">
                🗑️
              </button>
              <button onClick={handleClose}
                className="text-white/70 hover:text-white text-xl px-2 py-1 rounded hover:bg-white/10 transition-colors">
                ×
              </button>
            </div>
          </div>

          {/* Speed panel */}
          {showSpeedPanel && (
            <div className="px-4 py-3 border-b flex items-center gap-3" style={{ backgroundColor: '#faf7f2', borderColor: '#E8E0D5' }}>
              <span className="text-xs text-gray-500 whitespace-nowrap">Vitesse :</span>
              <input
                type="range"
                min={1000}
                max={6000}
                step={500}
                value={bubbleDelay}
                onChange={(e) => setBubbleDelay(Number(e.target.value))}
                className="flex-1 h-1 accent-[#C96442]"
              />
              <span className="text-xs text-gray-600 font-medium w-10 text-right tabular-nums">
                {(bubbleDelay / 1000).toFixed(1)}s
              </span>
            </div>
          )}

          {/* Messages */}
          <div className="p-5 space-y-4 overflow-y-auto" style={{ height: '450px', backgroundColor: '#FAF7F2' }}>
            {/* Indicateur contexte rechargé */}
            {summary && (
              <div className="text-center">
                <span className="text-[10px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  Contexte de vos échanges précédents chargé
                </span>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ${message.role === 'user' ? 'bg-gray-200' : 'ring-2 ring-[#C96442]'}`}>
                    {message.role === 'assistant' ? (
                      <img src={doctorClaude} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">👤</div>
                    )}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${message.role === 'user' ? 'bg-[#C96442] text-white rounded-tr-sm' : 'bg-white border text-gray-700 rounded-tl-sm'}`}
                    style={{ borderColor: message.role === 'assistant' ? '#E8E0D5' : 'transparent' }}>
                    <RenderMessageContent content={message.content} />
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#C96442]">
                    <img src={doctorClaude} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white border rounded-tl-sm" style={{ borderColor: '#E8E0D5' }}>
                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t" style={{ borderColor: '#E8E0D5' }}>
            <div className="flex gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Pose une question sur tes audits..."
                className="flex-1 px-4 py-3 rounded-xl border resize-none text-sm focus:outline-none focus:ring-2 focus:ring-[#C96442]"
                style={{ borderColor: '#E8E0D5', minHeight: '44px', maxHeight: '100px', backgroundColor: '#FAF7F2' }}
                rows={1}
              />
              <button onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-2 rounded-xl font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{ backgroundColor: '#C96442' }}>
                {isLoading ? '...' : '→'}
              </button>
            </div>
            {!isLoading && (
              <div className="mt-3">
                {selectedTopic ? renderContextualBubbles() : renderTestBubbles()}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function RenderMessageContent({ content }) {
  if (!content) return null;
  if (content.includes('**')) {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span>
        {parts.map((part, idx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={idx} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
          }
          return <span key={idx}>{part}</span>;
        })}
      </span>
    );
  }
  return <span>{content}</span>;
}
