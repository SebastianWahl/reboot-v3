import { useState, useRef, useEffect } from 'react';
import doctorClaude from '../../assets/doctor-claude.jpg';
import { supabase } from '../../lib/supabase';

export default function FloatingChatbot({ user, sessionData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Salut ! Je suis Doctor Claude, l\'IA qui te veut du bien. 👋\n\nJe peux t\'aider à comprendre ce que révèlent tes évaluations. Dis-moi sur quel aspect tu souhaites revenir, ou choisis un espace de discussion libre.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const messagesEndRef = useRef(null);

  const TEST_CONFIG = {
    '4-registres': {
      label: 'Audit des 4 Registres',
      color: '#C96442',
      emoji: '🧭',
      description: 'Ce test explore les 4 dimensions fondamentales de ton fonctionnement.',
      sections: ['Vue d\'ensemble', 'Forces', 'Axes de développement', 'Conseils généraux', 'Recommandations']
    },
    'instinctif': {
      label: 'Audit Instinctif & Corporel',
      color: '#c0392b',
      emoji: '🫀',
      description: 'Ce test approfondit ta relation avec ton corps et tes sensations.',
      sections: ['Profil instinctif', 'Points forts', 'Opportunités', 'Pratiques quotidiennes']
    },
    'emotionnel': {
      label: 'Audit Émotionnel & Relationnel',
      color: '#e6a817',
      emoji: '💞',
      description: 'Ce test explore ta vie relationnelle et émotionnelle.',
      sections: ['Profil émotionnel', 'Ressources', 'Progression', 'Exercices']
    },
    'mental': {
      label: 'Audit Mental & Cognitif',
      color: '#2980b9',
      emoji: '🧠',
      description: 'Ce test analyse tes processus de pensée.',
      sections: ['Profil cognitif', 'Forces mentales', 'Optimisation', 'Techniques']
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getCompletedTests = () => {
    const tests = [];
    if (sessionData?.registres) {
      tests.push('4-registres');
    }
    return tests;
  };

  const handleTestClick = (testId) => {
    const test = TEST_CONFIG[testId];
    const confirmationMessage = {
      role: 'assistant',
      content: `${test.emoji} D'accord, regardons ensemble ton ${test.label.toLowerCase()}.\n\n${test.description}\n\nTu as une idée de ce que tu aimerais explorer ?`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, confirmationMessage]);
    setSelectedTopic(testId);
  };

  const handleSectionClick = (sectionName) => {
    const isForcesSection = sectionName.toLowerCase().includes('force') || sectionName.toLowerCase().includes('points forts');
    const instruction = isForcesSection 
      ? `Developpe la section "${sectionName}" de mon rapport. Commence par valoriser mes points forts.`
      : `Explique-moi en détail la section "${sectionName}" de mon rapport en t'appuyant sur les résultats.`;
    sendAutoMessage(instruction, false, sectionName);
  };

  const handleFreeDiscussion = () => {
    const message = "J'aimerais explorer mon profil de manière plus libre";
    sendAutoMessage(message, true);
  };

  const sendAutoMessage = async (content, isTopicSelection = false, sectionName = null) => {
    const userMessage = {
      role: 'user',
      content: content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    if (isTopicSelection) {
      setSelectedTopic(content);
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL || 'https://cfagrdqwmwnuspcuthjp.supabase.co'}/functions/v1/claude-proxy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            systemPrompt: generateContext(sectionName),
            userMessage: content,
            maxTokens: 2000
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const apiData = await response.json();
      
      const assistantContent = apiData.choices?.[0]?.message?.content || 
                            apiData.content?.[0]?.text ||
                            "Je n'ai pas pu générer de réponse.";

      const messageParts = splitMessageIntoParts(assistantContent, sectionName);
      
      for (let i = 0; i < messageParts.length; i++) {
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 4000));
        }
        
        const assistantMessage = {
          role: 'assistant',
          content: messageParts[i],
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Erreur chatbot:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: "Un problème technique m'empêche de répondre pour l'instant. Peux-tu réessayer dans un moment ?",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateContext = (requestedSection = null) => {
    let context = "";
    
    // Données du profil
    if (sessionData?.registres) {
      const r = sessionData.registres;
      context += `Scores: Ancrage ${r.reptilien?.score ?? '?'}/25, Corps ${r.instinctif?.score ?? '?'}/25, Relations ${r.emotionnel?.score ?? '?'}/25, Pensée ${r.rationnel?.score ?? '?'}/25\n\n`;
    }
    
    if (sessionData?.diagnostic) {
      const d = sessionData.diagnostic;
      
      if (d.lecture_globale) {
        context += "Profil: " + (typeof d.lecture_globale === 'string' ? d.lecture_globale : JSON.stringify(d.lecture_globale)).substring(0, 800) + "\n\n";
      }
      
      if (d.forces?.length) {
        context += "Points forts: " + d.forces.join(", ") + "\n";
      }
      
      if (d.priorites?.liste?.length) {
        context += "À travailler: " + d.priorites.liste.map(p => p.but).join(", ") + "\n";
      }
      
      // Pour les recommandations, donner toutes les pratiques
      if (requestedSection === 'Recommandations' && d.conseils?.pratiques_quotidiennes) {
        const p = d.conseils.pratiques_quotidiennes;
        context += "\nConseils à partager:\n";
        if (p.matin?.length) context += "Matin: " + p.matin.join(" | ") + "\n";
        if (p.journee?.length) context += "Journée: " + p.journee.join(" | ") + "\n";
        if (p.soir?.length) context += "Soir: " + p.soir.join(" | ") + "\n";
      }
    }
    
    // Instructions simples
    context += "\n---\n\n";
    context += "Tu es Doctor Claude, une IA bienveillante (l'IA qui te veut du bien).\n\n";
    context += "Consignes:\n";
    context += "- Tutoyer (tu, ton, tes)\n";
    context += "- Ne pas mentionner le rapport ou les résultats\n";
    context += "- Parler naturellement, comme à un ami\n";
    
    if (requestedSection === 'Recommandations') {
      context += "- Dérouler tous les conseils : d'abord le matin, puis la journée, puis le soir\n";
    }
    
    if (requestedSection) {
      context += "\nSujet demandé: " + requestedSection + "\n";
    }
    
    return context;
  };

  const splitMessageIntoParts = (content, sectionName = null) => {
    // Ne pas découper si le message est court
    if (content.length < 350) {
      return [content];
    }

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
    
    if (currentPart.trim()) {
      parts.push(currentPart.trim());
    }
    
    // Pour les recommandations, laisser plus de bulles
    const maxParts = sectionName === 'Recommandations' ? 12 : 8;
    return parts.length > maxParts ? parts.slice(0, maxParts) : parts;
  };

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

  const renderTestBubbles = () => {
    const completedTests = getCompletedTests();
    
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600 font-medium">De quoi veux-tu parler ?</p>
        <div className="flex flex-wrap gap-2">
          {completedTests.map(testId => {
            const test = TEST_CONFIG[testId];
            return (
              <button
                key={testId}
                onClick={() => handleTestClick(testId)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 text-white"
                style={{ backgroundColor: test.color }}
              >
                <span className="mr-1">{test.emoji}</span>
                {test.label}
              </button>
            );
          })}
          <button
            onClick={handleFreeDiscussion}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 border-2"
            style={{ borderColor: '#C96442', color: '#C96442', backgroundColor: 'transparent' }}
          >
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
            <button
              key={idx}
              onClick={() => handleSectionClick(section)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 border"
              style={{ borderColor: test.color, color: test.color, backgroundColor: `${test.color}15` }}
            >
              {section}
            </button>
          ))}
          <button
            onClick={() => setSelectedTopic(null)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 border border-gray-300 text-gray-500"
          >
            ← Choisir un autre audit
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 transition-all hover:scale-110 flex items-center justify-center group"
          style={{ 
            filter: 'drop-shadow(0 8px 20px rgba(201, 100, 66, 0.4))',
            backgroundColor: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          {/* DESIGN BULLE BD (Comic Style) */}
          <div className="relative">
            {/* Bulle principale */}
            <div 
              className="bg-white border-3 flex items-center justify-center relative"
              style={{
                borderColor: '#C96442',
                borderWidth: '3px',
                borderRadius: '24px',
                padding: '12px',
                width: '72px',
                height: '72px',
              }}
            >
              <div className="w-14 h-14 rounded-full overflow-hidden shadow-md">
                <img src={doctorClaude} alt="Doctor Claude" className="w-full h-full object-cover" />
              </div>
            </div>
            
            {/* Queue de la bulle (triangle pointant vers le bas-droite) */}
            <div 
              className="absolute bottom-0 right-0"
              style={{
                width: 0,
                height: 0,
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderTop: '16px solid #C96442',
                transform: 'translate(4px, 12px) rotate(-15deg)',
              }}
            />
            {/* Queue blanche intérieure pour l'effet bordure */}
            <div 
              className="absolute bottom-0 right-0"
              style={{
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '12px solid white',
                transform: 'translate(6px, 10px) rotate(-15deg)',
              }}
            />
            
            {/* Badge AI */}
            <span 
              className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-3 border-white flex items-center justify-center text-xs text-white font-bold shadow-lg"
            >
              AI
            </span>
          </div>
          
          {/* Tooltip */}
          <span className="absolute right-full mr-4 px-4 py-2 bg-white rounded-xl shadow-md text-sm text-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity font-medium border border-gray-100">
            Parler avec Doctor Claude
          </span>
        </button>
      )}

      {isOpen && (
        <div 
          className="fixed bottom-8 right-8 z-50 w-[450px] rounded-2xl shadow-2xl overflow-hidden transition-all"
          style={{ 
            backgroundColor: '#fff',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
            maxHeight: '700px'
          }}
        >
          <div 
            className="flex items-center justify-between p-4"
            style={{ backgroundColor: '#C96442' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/50">
                <img src={doctorClaude} alt="Doctor Claude" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Doctor Claude</p>
                <p className="text-white/70 text-xs">L'IA qui te veut du bien</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setMessages([{
                    role: 'assistant',
                    content: 'On repart de zéro. Sur quoi veux-tu travailler ?',
                    timestamp: new Date()
                  }]);
                  setSelectedTopic(null);
                }}
                className="text-white/70 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors"
              >
                🗑️
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white text-xl px-2 py-1 rounded hover:bg-white/10 transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          <div 
            className="p-5 space-y-4 overflow-y-auto"
            style={{ height: '450px', backgroundColor: '#FAF7F2' }}
          >
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ${
                    message.role === 'user' ? 'bg-gray-200' : 'ring-2 ring-[#C96442]'
                  }`}>
                    {message.role === 'assistant' ? (
                      <img src={doctorClaude} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                        👤
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <div 
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        message.role === 'user' 
                          ? 'bg-[#C96442] text-white rounded-tr-sm' 
                          : 'bg-white border text-gray-700 rounded-tl-sm'
                      }`}
                      style={{ borderColor: message.role === 'assistant' ? '#E8E0D5' : 'transparent' }}
                    >
                      <RenderMessageContent content={message.content} />
                    </div>
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
                  <div className="flex flex-col gap-1">
                    <div className="px-4 py-3 rounded-2xl bg-white border rounded-tl-sm" style={{ borderColor: '#E8E0D5' }}>
                      <div className="flex gap-1 items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 ml-1">Doctor Claude écrit...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t" style={{ borderColor: '#E8E0D5' }}>
            <div className="flex gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Pose une question sur tes audits..."
                className="flex-1 px-4 py-3 rounded-xl border resize-none text-sm focus:outline-none focus:ring-2 focus:ring-[#C96442]"
                style={{ 
                  borderColor: '#E8E0D5', 
                  minHeight: '44px', 
                  maxHeight: '100px',
                  backgroundColor: '#FAF7F2'
                }}
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-2 rounded-xl font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{ backgroundColor: '#C96442' }}
              >
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
            const boldText = part.slice(2, -2);
            return <strong key={idx} className="font-semibold text-gray-900">{boldText}</strong>;
          }
          return <span key={idx}>{part}</span>;
        })}
      </span>
    );
  }
  
  return <span>{content}</span>;
}
