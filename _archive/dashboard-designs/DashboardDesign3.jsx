// Dashboard Design Proposition #3: Timeline Verticale Narrative
// Progression chronologique, focus sur le parcours, storytelling visuel

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import doctorClaude from '../../assets/doctor-claude.jpg';

const REGISTRES = [
  { id: 'reptilien', label: 'Reptilien', icon: '🦎', color: '#e07b39' },
  { id: 'instinctif', label: 'Instinctif', icon: '🫀', color: '#c0392b' },
  { id: 'emotionnel', label: 'Émotionnel', icon: '💛', color: '#e6a817' },
  { id: 'rationnel', label: 'Rationnel', icon: '🧠', color: '#2980b9' },
];

const TEST_STEPS = [
  { 
    id: '4-registres', 
    label: 'Audit des 4 Registres', 
    icon: '🧭',
    description: 'L\'exploration fondamentale de ton profil cognitif',
    duration: '30-40 min',
    unlocks: 'instinctif'
  },
  { 
    id: 'instinctif', 
    label: 'Audit Instinctif', 
    icon: '🫀',
    description: '12 dimensions de ta relation au corps',
    duration: '20-25 min',
    unlocks: 'emotionnel'
  },
  { 
    id: 'emotionnel', 
    label: 'Audit Émotionnel', 
    icon: '💞',
    description: 'Tes patterns relationnels et émotionnels',
    duration: '20-25 min',
    unlocks: 'mental'
  },
  { 
    id: 'mental', 
    label: 'Audit Mental', 
    icon: '🧠',
    description: 'Tes processus de pensée et cognition',
    duration: '20-25 min',
    unlocks: null
  },
];

export default function DashboardDesign3({ user, onSignOut, onStartAudit }) {
  const [session, setSession] = useState(null);
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedStep, setExpandedStep] = useState(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase
      .from('reboot_sessions')
      .select('session_id, date, session_data, test_type')
      .order('date', { ascending: false })
      .then(({ data }) => {
        setAllSessions(data || []);
        const mainSession = data?.find(s => s.test_type === '4-registres' || !s.test_type) || data?.[0];
        setSession(mainSession || null);
        setLoading(false);
      });
  }, [user]);

  const registres = session?.session_data?.registres ?? {};
  
  const getStepStatus = (stepId) => {
    const session = allSessions.find(s => 
      (stepId === '4-registres' && (!s.test_type || s.test_type === '4-registres')) ||
      s.test_type === stepId
    );
    return session ? 'completed' : 'locked';
  };

  const isStepAvailable = (stepId, index) => {
    if (index === 0) return true;
    const prevStep = TEST_STEPS[index - 1];
    return getStepStatus(prevStep.id) === 'completed';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      {/* Header */}
      <header className="px-8 py-6 border-b sticky top-0 z-50" style={{ backgroundColor: 'rgba(250, 247, 242, 0.95)', borderColor: '#E8E0D5', backdropFilter: 'blur(10px)' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#E8E0D5]">
              <img src={doctorClaude} alt="" className="w-full h-full object-cover" style={{ transform: 'scale(1.3)', transformOrigin: 'center' }} />
            </div>
            <h1 className="text-xl font-semibold" style={{ color: '#1A1209', fontFamily: "'EB Garamond', Georgia, serif" }}>
              Re-Boot
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user?.email}</span>
            <button onClick={onSignOut} className="text-sm text-gray-400 hover:text-gray-600">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-12">
        
        {/* Hero - Progression globale */}
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4" style={{ color: '#1A1209', fontFamily: "'EB Garamond', Georgia, serif" }}>
            Ton parcours de transformation
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            4 audits progressifs pour cartographier ton fonctionnement cognitif et t'accompagner vers un meilleur équilibre.
          </p>
          
          {/* Progress bar globale */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Progression</span>
              <span className="text-sm font-medium" style={{ color: '#C96442' }}>
                {allSessions.filter(s => s.session_data?.status === 'completed').length}/4 audits
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E8E0D5' }}>
              <div 
                className="h-full rounded-full transition-all duration-1000"
                style={{ 
                  width: `${(allSessions.filter(s => s.session_data?.status === 'completed').length / 4) * 100}%`,
                  background: 'linear-gradient(to right, #e07b39, #c0392b, #e6a817, #2980b9)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Timeline verticale */}
        <div className="relative">
          {/* Ligne verticale */}
          <div 
            className="absolute left-8 top-0 bottom-0 w-0.5"
            style={{ backgroundColor: '#E8E0D5' }}
          />

          {/* Étapes */}
          <div className="space-y-8">
            {TEST_STEPS.map((step, index) => {
              const status = getStepStatus(step.id);
              const isAvailable = isStepAvailable(step.id, index);
              const isExpanded = expandedStep === step.id;
              const session = allSessions.find(s => 
                (step.id === '4-registres' && (!s.test_type || s.test_type === '4-registres')) ||
                s.test_type === step.id
              );

              return (
                <div key={step.id} className="relative pl-20">
                  {/* Point sur la timeline */}
                  <div 
                    className="absolute left-6 w-5 h-5 rounded-full border-4 transition-all cursor-pointer"
                    style={{ 
                      backgroundColor: status === 'completed' ? '#C96442' : '#fff',
                      borderColor: isAvailable ? '#C96442' : '#E8E0D5',
                      top: '24px'
                    }}
                    onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  />

                  {/* Card */}
                  <div 
                    className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                      status === 'completed' ? 'bg-white' : 
                      isAvailable ? 'bg-white hover:shadow-md' : 'bg-gray-50'
                    }`}
                    style={{ borderColor: status === 'completed' ? '#C96442' : isAvailable ? '#E8E0D5' : '#F0EBE4' }}
                    onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{step.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg" style={{ color: '#1A1209' }}>
                              {step.label}
                            </h3>
                            {status === 'completed' && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                Complété
                              </span>
                            )}
                            {!isAvailable && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                🔒 Verrouillé
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{step.duration}</p>
                        <span className="text-lg">{isExpanded ? '▼' : '▶'}</span>
                      </div>
                    </div>

                    {/* Contenu expansé */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t" style={{ borderColor: '#F0EBE4' }}>
                        {status === 'completed' && step.id === '4-registres' && session ? (
                          <div className="grid grid-cols-4 gap-4 mb-6">
                            {REGISTRES.map(reg => {
                              const score = session.session_data?.registres?.[reg.id]?.score ?? 0;
                              return (
                                <div key={reg.id} className="text-center p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}>
                                  <span className="text-xl block mb-1">{reg.icon}</span>
                                  <p className="text-xs text-gray-500">{reg.label}</p>
                                  <p className="font-semibold" style={{ color: reg.color }}>{score.toFixed(1)}/25</p>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}

                        {isAvailable && status !== 'completed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartAudit(step.id);
                            }}
                            className="w-full py-3 rounded-xl font-medium text-white transition-all hover:opacity-90"
                            style={{ backgroundColor: '#C96442' }}
                          >
                            Commencer l'audit →
                          </button>
                        )}

                        {status === 'completed' && (
                          <div className="flex gap-3">
                            <button className="flex-1 py-3 rounded-xl border font-medium text-gray-700 hover:bg-gray-50">
                              Voir le rapport
                            </button>
                            <button className="flex-1 py-3 rounded-xl font-medium text-white hover:opacity-90" style={{ backgroundColor: '#C96442' }}>
                              Refaire l'audit
                            </button>
                          </div>
                        )}

                        {!isAvailable && (
                          <p className="text-sm text-gray-400 text-center py-4">
                            🔒 Termine "{TEST_STEPS[index - 1]?.label}" pour débloquer cet audit
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Résumé rapide si des audits sont complétés */}
        {allSessions.length > 0 && (
          <div className="mt-16 p-6 rounded-2xl border" style={{ backgroundColor: '#fff', borderColor: '#E8E0D5' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#1A1209' }}>Résumé de ton profil</h3>
            <div className="grid grid-cols-4 gap-4">
              {REGISTRES.map(reg => {
                const score = registres[reg.id]?.score ?? 0;
                return (
                  <div key={reg.id} className="text-center">
                    <span className="text-2xl block mb-2">{reg.icon}</span>
                    <p className="text-xs text-gray-500">{reg.label}</p>
                    <p className="font-bold" style={{ color: reg.color }}>{score > 0 ? score.toFixed(1) : '—'}/25</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Call to action final */}
        <div className="mt-12 text-center p-8 rounded-2xl" style={{ backgroundColor: '#F5F0EA' }}>
          <p className="text-gray-600 mb-4">
            Besoin d'aide pour interpréter tes résultats ou poursuivre ton parcours ?
          </p>
          <button className="px-6 py-3 rounded-xl font-medium text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#1A1209' }}>
            💬 Parler à Doctor Claude
          </button>
        </div>
      </main>
    </div>
  );
}
