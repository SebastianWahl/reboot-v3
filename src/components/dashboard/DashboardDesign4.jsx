// Dashboard Design Proposition #4: Cards Immersives Magazine
// Grandes cartes avec images/icons, style magazine, storytelling visuel riche

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import doctorClaude from '../../assets/doctor-claude.jpg';

const REGISTRES = [
  { id: 'reptilien', label: 'Reptilien', icon: '🦎', color: '#e07b39', emoji: '🌱', desc: 'Ancrage & Sécurité' },
  { id: 'instinctif', label: 'Instinctif', icon: '🫀', color: '#c0392b', emoji: '🔥', desc: 'Corps & Intuition' },
  { id: 'emotionnel', label: 'Émotionnel', icon: '💛', color: '#e6a817', emoji: '💧', desc: 'Cœur & Relations' },
  { id: 'rationnel', label: 'Rationnel', icon: '🧠', color: '#2980b9', emoji: '💨', desc: 'Esprit & Stratégie' },
];

const TEST_CARDS = [
  {
    id: '4-registres',
    title: 'Audit des 4 Registres',
    subtitle: 'L\'exploration fondamentale',
    icon: '🧭',
    color: '#C96442',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #C96442 100%)',
    description: 'Un diagnostic complet de ton profil cognitif à travers 4 dimensions fondamentales de l\'existence.',
    duration: '30-40 min',
    questions: 20,
    image: '🏔️'
  },
  {
    id: 'instinctif',
    title: 'Audit Instinctif',
    subtitle: 'Corps & Présence',
    icon: '🫀',
    color: '#c0392b',
    gradient: 'linear-gradient(135deg, #FF8E8E 0%, #c0392b 100%)',
    description: 'Explore 12 dimensions de ta relation au corps : conscience, intuition, ancrage, régulation.',
    duration: '20-25 min',
    questions: 12,
    image: '🌊'
  },
  {
    id: 'emotionnel',
    title: 'Audit Émotionnel',
    subtitle: 'Cœur & Connexions',
    icon: '💞',
    color: '#e6a817',
    gradient: 'linear-gradient(135deg, #FFD966 0%, #e6a817 100%)',
    description: 'Découvre tes patterns relationnels : vocabulaire émotionnel, empathie, authenticité, conflits.',
    duration: '20-25 min',
    questions: 12,
    image: '☀️'
  },
  {
    id: 'mental',
    title: 'Audit Mental',
    subtitle: 'Esprit & Clarté',
    icon: '🧠',
    color: '#2980b9',
    gradient: 'linear-gradient(135deg, #6BB5FF 0%, #2980b9 100%)',
    description: 'Analyse tes processus de pensée : focus, mémoire, créativité, métacognition.',
    duration: '20-25 min',
    questions: 12,
    image: '❄️'
  }
];

export default function DashboardDesign4({ user, onSignOut, onStartAudit }) {
  const [session, setSession] = useState(null);
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredCard, setHoveredCard] = useState(null);

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
  const values = REGISTRES.map(r => registres[r.id]?.score ?? 0);
  const totalScore = values.reduce((a, b) => a + b, 0);

  const getTestStatus = (testId) => {
    const found = allSessions.find(s => 
      (testId === '4-registres' && (!s.test_type || s.test_type === '4-registres')) ||
      s.test_type === testId
    );
    return found ? 'completed' : 'available';
  };

  const isTestLocked = (testId, index) => {
    if (index === 0) return false;
    const prevTest = TEST_CARDS[index - 1];
    return getTestStatus(prevTest.id) !== 'completed';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F0D0A' }}>
      
      {/* Header avec effet glassmorphism */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{ 
          background: 'rgba(15, 13, 10, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white/20">
              <img src={doctorClaude} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="text-white font-semibold text-lg" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
              Re-Boot
            </span>
          </div>
          
          <nav className="flex items-center gap-1 bg-white/10 rounded-full p-1">
            {[
              { id: 'overview', label: 'Vue d\'ensemble' },
              { id: 'profile', label: 'Profil cognitif' },
              { id: 'recommandations', label: 'Recommandations' },
              { id: 'audits', label: 'Mes audits' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-5 py-2 rounded-full text-sm transition-all"
                style={{
                  backgroundColor: activeTab === tab.id ? 'rgba(201, 100, 66, 0.9)' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.6)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-sm text-white/50">{user?.email}</span>
            <button 
              onClick={onSignOut}
              className="text-sm text-white/30 hover:text-white/60 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        
        {activeTab === 'overview' && (
          <>
            {/* Hero Section */}
            <section className="mb-12">
              <div className="grid grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-[#C96442] text-sm font-medium mb-2 tracking-wider uppercase">
                    Dashboard Personnel
                  </p>
                  <h1 className="text-5xl text-white mb-4 leading-tight" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
                    Cartographie ton <br/>
                    <span style={{ color: '#C96442' }}>fonctionnement</span> cognitif
                  </h1>
                  <p className="text-white/60 text-lg mb-6 max-w-md">
                    4 audits progressifs pour comprendre et optimiser tes 4 registres de fonctionnement.
                  </p>
                  
                  {session && (
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-white">{totalScore}</p>
                        <p className="text-xs text-white/40">Score Global</p>
                      </div>
                      <div className="w-px h-12 bg-white/20" />
                      <div className="text-center">
                        <p className="text-4xl font-bold text-white">
                          {allSessions.filter(s => s.session_data?.status === 'completed').length}
                        </p>
                        <p className="text-xs text-white/40">Audits complétés</p>
                      </div>
                      <div className="w-px h-12 bg-white/20" />
                      <div className="text-center">
                        <p className="text-4xl font-bold text-white">
                          {Math.round((allSessions.filter(s => s.session_data?.status === 'completed').length / 4) * 100)}%
                        </p>
                        <p className="text-xs text-white/40">Progression</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Visual abstract representation */}
                <div className="relative h-80">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {REGISTRES.map((reg, idx) => {
                      const score = registres[reg.id]?.score ?? 0;
                      const size = 80 + (score / 25) * 100;
                      const angle = (idx / 4) * 2 * Math.PI - Math.PI / 2;
                      const distance = 100;
                      const x = Math.cos(angle) * distance;
                      const y = Math.sin(angle) * distance;
                      
                      return (
                        <div
                          key={reg.id}
                          className="absolute rounded-full flex items-center justify-center transition-all duration-1000"
                          style={{
                            width: size,
                            height: size,
                            backgroundColor: `${reg.color}20`,
                            border: `2px solid ${reg.color}`,
                            transform: `translate(${x}px, ${y}px)`,
                            boxShadow: `0 0 60px ${reg.color}30`
                          }}
                        >
                          <span className="text-3xl">{reg.emoji}</span>
                        </div>
                      );
                    })}
                    <div 
                      className="w-24 h-24 rounded-full flex items-center justify-center relative z-10"
                      style={{ 
                        background: 'linear-gradient(135deg, #C96442, #e07b39)',
                        boxShadow: '0 0 100px rgba(201, 100, 66, 0.5)'
                      }}
                    >
                      <span className="text-4xl">🧭</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section Cards d'audits */}
            <section>
              <h2 className="text-2xl text-white mb-6" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
                Les 4 audits
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                {TEST_CARDS.map((test, index) => {
                  const status = getTestStatus(test.id);
                  const isLocked = isTestLocked(test.id, index);
                  const isHovered = hoveredCard === test.id;
                  
                  return (
                    <div
                      key={test.id}
                      className={`group relative rounded-3xl overflow-hidden transition-all duration-500 ${
                        isLocked ? 'opacity-60' : 'cursor-pointer'
                      }`}
                      style={{ 
                        height: '320px',
                        background: isLocked ? '#1a1814' : test.gradient
                      }}
                      onMouseEnter={() => !isLocked && setHoveredCard(test.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => !isLocked && onStartAudit(test.id)}
                    >
                      {/* Background pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                          backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px)`,
                          backgroundSize: '40px 40px'
                        }} />
                      </div>

                      {/* Content */}
                      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-5xl">{test.icon}</span>
                            {status === 'completed' && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                                ✓ Complété
                              </span>
                            )}
                            {isLocked && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/30 text-white/60">
                                🔒 Verrouillé
                              </span>
                            )}
                          </div>
                          <p className="text-white/70 text-sm font-medium mb-1">{test.subtitle}</p>
                          <h3 className="text-2xl font-bold text-white mb-2">{test.title}</h3>
                          <p className="text-white/80 text-sm leading-relaxed max-w-xs">
                            {test.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-white/60 text-sm">
                            <span>⏱️ {test.duration}</span>
                            <span>📝 {test.questions} questions</span>
                          </div>
                          <div 
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                              isHovered ? 'bg-white scale-110' : 'bg-white/20'
                            }`}
                          >
                            <span className={isHovered ? 'text-gray-900' : 'text-white'}>→</span>
                          </div>
                        </div>
                      </div>

                      {/* Decorative element */}
                      <div 
                        className="absolute -bottom-20 -right-20 text-9xl opacity-20 transition-transform duration-500"
                        style={{ transform: isHovered ? 'scale(1.2) rotate(10deg)' : 'scale(1)' }}
                      >
                        {test.image}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Call to action */}
            <section className="mt-12 text-center">
              <div 
                className="inline-block p-8 rounded-3xl"
                style={{ backgroundColor: 'rgba(201, 100, 66, 0.1)', border: '1px solid rgba(201, 100, 66, 0.3)' }}
              >
                <p className="text-white/60 mb-4">Des questions sur tes résultats ?</p>
                <button className="px-8 py-4 rounded-full font-medium text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#C96442' }}>
                  💬 Discuter avec Doctor Claude
                </button>
              </div>
            </section>
          </>
        )}

        {activeTab === 'audits' && (
          <div className="text-center py-20">
            <p className="text-white/40 text-xl">Historique complet de tes audits</p>
            <p className="text-white/20 mt-2">Intégrer DashboardAudits ici</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="text-center py-20">
            <p className="text-white/40 text-xl">Profil cognitif détaillé</p>
            <p className="text-white/20 mt-2">Intégrer DashboardProfile ici</p>
          </div>
        )}
      </main>
    </div>
  );
}
