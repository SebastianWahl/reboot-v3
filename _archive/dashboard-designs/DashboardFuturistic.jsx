// Dashboard Design Futuriste - Version Cyberpunk/Néon
// Fond sombre avec accents cyan et néon

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import doctorClaude from '../../assets/doctor-claude.jpg';
import FloatingChatbot from '../ui/FloatingChatbot';
import RadarChartFuturistic from '../ui/RadarChartFuturistic';
import { PREVIEW_DATA } from '../../lib/previewData';
import { DEMO_INSTINCTIF_SESSION, DEMO_EMOTIONNEL_SESSION, DEMO_MENTAL_SESSION } from '../../lib/demoSessions';
import DiagnosticScreen from '../screens/DiagnosticScreen';
import SecondaryTestReport from './SecondaryTestReport';
import DashboardProfile from './DashboardProfile';

const REGISTRES = [
  { id: 'reptilien', label: 'Reptilien', icon: '🦎', color: '#00ff88', desc: 'Ancrage & Sécurité' },
  { id: 'instinctif', label: 'Instinctif', icon: '🫀', color: '#ff00ff', desc: 'Corps & Intuition' },
  { id: 'emotionnel', label: 'Émotionnel', icon: '💛', color: '#e6a817', desc: 'Cœur & Relations' },
  { id: 'rationnel', label: 'Rationnel', icon: '🧠', color: '#00f5ff', desc: 'Esprit & Stratégie' },
];

const TEST_CARDS = [
  {
    id: '4-registres',
    title: 'Audit des 4 Registres',
    subtitle: 'L\'exploration fondamentale',
    icon: '🧭',
    color: '#00f5ff',
    gradient: 'linear-gradient(135deg, #00f5ff 0%, #0088ff 100%)',
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
    color: '#ff00ff',
    gradient: 'linear-gradient(135deg, #ff00ff 0%, #cc00cc 100%)',
    description: 'Explore 10 dimensions de ta relation au corps : conscience, intuition, ancrage, régulation.',
    duration: '20-25 min',
    questions: 10,
    image: '🌊'
  },
  {
    id: 'emotionnel',
    title: 'Audit Émotionnel',
    subtitle: 'Cœur & Connexions',
    icon: '💞',
    color: '#e6a817',
    gradient: 'linear-gradient(135deg, #ffd700 0%, #e6a817 100%)',
    description: 'Découvre tes patterns relationnels : vocabulaire émotionnel, empathie, authenticité, conflits.',
    duration: '20-25 min',
    questions: 10,
    image: '☀️'
  },
  {
    id: 'mental',
    title: 'Audit Mental',
    subtitle: 'Esprit & Clarté',
    icon: '🧠',
    color: '#00f5ff',
    gradient: 'linear-gradient(135deg, #00f5ff 0%, #0088ff 100%)',
    description: 'Analyse tes processus de pensée : focus, mémoire, créativité, métacognition.',
    duration: '20-25 min',
    questions: 10,
    image: '❄️'
  }
];

export default function DashboardFuturistic({ user, onSignOut, onStartAudit, onViewSession, onToggleTheme, isFuturistic, activeTab, setActiveTab }) {
  const [session, setSession] = useState(null);
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [kpiStyle, setKpiStyle] = useState('bars');

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

  const registres = session?.session_data?.registres ?? PREVIEW_DATA.registres ?? {};
  const values = REGISTRES.map(r => registres[r.id]?.score ?? 0);
  const totalScore = values.reduce((a, b) => a + b, 0);

  const getTestStatus = (testId) => {
    const found = allSessions.find(s => 
      ((testId === '4-registres' && (!s.test_type || s.test_type === '4-registres')) ||
      s.test_type === testId) && 
      s.session_data?.status === 'completed' &&
      !s.isDemo
    );
    return found ? 'completed' : 'available';
  };

  const isTestLocked = (testId, index) => {
    if (index === 0) return false;
    const prevTest = TEST_CARDS[index - 1];
    return getTestStatus(prevTest.id) !== 'completed';
  };

  const getNextStep = () => {
    const completedAudits = allSessions.filter(s => s.session_data?.status === 'completed' && !s.isDemo).length;
    
    if (completedAudits === 0) {
      return {
        testId: '4-registres',
        title: 'Audit des 4 Registres',
        subtitle: 'Première étape obligatoire',
        description: 'Commence par cet audit complet pour obtenir une vue d\'ensemble de ton profil cognitif.',
        icon: '🧭',
        color: '#00f5ff',
        gradient: 'linear-gradient(135deg, #00f5ff 0%, #0088ff 100%)',
        action: 'Commencer',
        isNewUser: true
      };
    }
    
    const has4Registres = getTestStatus('4-registres') === 'completed';
    const hasInstinctif = getTestStatus('instinctif') === 'completed';
    const hasEmotionnel = getTestStatus('emotionnel') === 'completed';
    const hasMental = getTestStatus('mental') === 'completed';
    
    if (has4Registres && (!hasInstinctif || !hasEmotionnel || !hasMental)) {
      const missingCount = [!hasInstinctif, !hasEmotionnel, !hasMental].filter(Boolean).length;
      
      let firstMissing, firstMissingLower;
      if (!hasInstinctif) {
        firstMissing = 'Instinctif';
        firstMissingLower = 'instinctif';
      } else if (!hasEmotionnel) {
        firstMissing = 'Émotionnel';
        firstMissingLower = 'emotionnel';
      } else {
        firstMissing = 'Mental';
        firstMissingLower = 'mental';
      }
      
      const testColors = {
        'Instinctif': { color: '#ff00ff', gradient: 'linear-gradient(135deg, #ff00ff 0%, #cc00cc 100%)', icon: '🫀' },
        'Émotionnel': { color: '#e6a817', gradient: 'linear-gradient(135deg, #ffd700 0%, #e6a817 100%)', icon: '💞' },
        'Mental': { color: '#00f5ff', gradient: 'linear-gradient(135deg, #00f5ff 0%, #0088ff 100%)', icon: '🧠' }
      };
      
      const colors = testColors[firstMissing];
      
      return {
        testId: firstMissingLower,
        title: missingCount === 1 ? `Audit ${firstMissing}` : `Audit ${firstMissing} (encore ${missingCount} à faire)`,
        subtitle: missingCount === 1 ? 'Dernier audit recommandé' : 'Prochain audit recommandé',
        description: missingCount === 1 
          ? `Approfondis ta connaissance du registre ${firstMissingLower}. C'est le dernier audit recommandé pour compléter ton profil.`
          : `Doctor Claude recommande d'approfondir le registre ${firstMissingLower} en priorité. Il te reste ${missingCount} audits à compléter.`,
        icon: colors.icon,
        color: colors.color,
        gradient: colors.gradient,
        action: missingCount === 1 ? 'Terminer' : 'Continuer',
        isNewUser: false
      };
    }
    
    return null;
  };

  const nextStep = getNextStep();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0f' }}>
      {/* Scanlines overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 245, 255, 0.015) 2px, rgba(0, 245, 255, 0.015) 4px)',
        }}
      />
      
      {/* Grid background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-40 px-6 py-4"
        style={{ 
          background: 'rgba(10, 10, 15, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 245, 255, 0.2)'
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
              style={{ 
                border: '2px solid #00f5ff',
                color: '#00f5ff',
                textShadow: '0 0 10px rgba(0, 245, 255, 0.5)',
                boxShadow: '0 0 20px rgba(0, 245, 255, 0.2), inset 0 0 20px rgba(0, 245, 255, 0.1)',
              }}
            >
              DC
            </div>
            <span 
              className="font-semibold text-lg" 
              style={{ 
                color: '#fff', 
                fontFamily: "'Orbitron', sans-serif",
                textShadow: '0 0 10px rgba(0, 245, 255, 0.3)'
              }}
            >
              Re-Boot
            </span>
          </div>
          
          <nav className="flex items-center gap-1 rounded-full p-1" style={{ background: 'rgba(0, 245, 255, 0.1)' }}>
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
                  backgroundColor: activeTab === tab.id ? '#00f5ff' : 'transparent',
                  color: activeTab === tab.id ? '#000' : '#00f5ff',
                  fontFamily: "'Orbitron', sans-serif",
                  boxShadow: activeTab === tab.id ? '0 0 20px rgba(0, 245, 255, 0.5)' : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Toggle vers Scientifique */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all mx-4 hover:shadow-lg"
            style={{
              backgroundColor: '#FAF7F2',
              border: '1px solid rgba(201, 100, 66, 0.5)',
              color: '#C96442',
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: '13px',
              letterSpacing: '0.5px',
              boxShadow: '0 0 15px rgba(201, 100, 66, 0.3)'
            }}
            title="Passer en mode scientifique"
          >
            <span className="hidden lg:inline">Scientifique</span>
            <span className="lg:hidden">Sci.</span>
          </button>

          {/* Logout button in header */}
          <button 
            onClick={onSignOut}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ 
              backgroundColor: 'rgba(0, 245, 255, 0.1)',
              border: '1px solid rgba(0, 245, 255, 0.3)',
              color: '#00f5ff'
            }}
            title="Déconnexion"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
        
        {activeTab === 'overview' && (
          <>
            {/* Hero Section - 3 colonnes */}
            <section className="mb-8">
              <div className="grid grid-cols-3 gap-6 items-start">
                {/* Colonne 1: Titre */}
                <div>
                  <p className="text-sm font-medium mb-2 tracking-wider uppercase" style={{ color: '#00f5ff' }}>
                    Dashboard Personnel
                  </p>
                  <h1 
                    className="text-4xl mb-4 leading-tight" 
                    style={{ 
                      color: '#fff', 
                      fontFamily: "'Orbitron', sans-serif",
                      textShadow: '0 0 20px rgba(0, 245, 255, 0.3)'
                    }}
                  >
                    Cartographie ton <br/>
                    <span style={{ color: '#00f5ff' }}>fonctionnement</span> cognitif
                  </h1>
                  <p className="text-base" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    4 audits progressifs pour comprendre et optimiser tes 4 registres de fonctionnement.
                  </p>
                </div>

                {/* Column 2: My next step */}
                <div>
                  {nextStep && (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-lg">🎯</span>
                        <h2 
                          className="text-lg font-semibold" 
                          style={{ 
                            color: '#fff', 
                            fontFamily: "'Orbitron', sans-serif" 
                          }}
                        >
                          Ma prochaine étape
                        </h2>
                      </div>
                      
                      <div 
                        className="pulse-card-futuristic"
                        style={{ 
                          backgroundImage: nextStep.gradient,
                          borderRadius: '16px',
                          padding: '16px',
                          cursor: 'pointer',
                          height: '160px',
                          boxShadow: '0 0 30px rgba(0, 245, 255, 0.3)',
                        }}
                        onClick={() => onStartAudit(nextStep.testId)}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div 
                            style={{ 
                              width: '40px', 
                              height: '40px', 
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '20px',
                              flexShrink: 0,
                              backgroundColor: 'rgba(255,255,255,0.2)' 
                            }}
                          >
                            {nextStep.icon}
                          </div>
                          
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px', flexWrap: 'wrap' }}>
                              <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                                {nextStep.subtitle}
                              </span>
                              {nextStep.isNewUser && (
                                <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500, backgroundColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
                                  Obligatoire
                                </span>
                              )}
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
                              {nextStep.title}
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', lineHeight: 1.5, marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                              {nextStep.description}
                            </p>
                            
                            <button 
                              style={{ 
                                padding: '6px 12px', 
                                borderRadius: '8px', 
                                fontWeight: 600, 
                                fontSize: '12px',
                                backgroundColor: 'white', 
                                color: nextStep.color,
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              {nextStep.action} →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Colonne 3: Ma progression */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-lg">📊</span>
                    <h2 
                      className="text-lg font-semibold" 
                      style={{ 
                        color: '#fff', 
                        fontFamily: "'Orbitron', sans-serif" 
                      }}
                    >
                      Ma progression
                    </h2>
                  </div>
                  
                  <div 
                    style={{ 
                      backgroundColor: 'rgba(0, 245, 255, 0.05)',
                      borderRadius: '16px',
                      padding: '16px',
                      border: '1px solid rgba(0, 245, 255, 0.2)',
                      height: '160px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center flex-1">
                        <p className="text-3xl font-bold" style={{ color: '#fff' }}>
                          {allSessions.filter(s => s.session_data?.status === 'completed' && !s.isDemo).length}
                        </p>
                        <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Audits complétés</p>
                      </div>
                      <div className="w-px h-10" style={{ backgroundColor: 'rgba(0, 245, 255, 0.2)' }} />
                      <div className="text-center flex-1">
                        <p className="text-3xl font-bold" style={{ color: '#fff' }}>
                          {Math.round((allSessions.filter(s => s.session_data?.status === 'completed' && !s.isDemo).length / 4) * 100)}%
                        </p>
                        <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Progression globale</p>
                      </div>
                    </div>
                    
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0, 245, 255, 0.1)' }}>
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.round((allSessions.filter(s => s.session_data?.status === 'completed' && !s.isDemo).length / 4) * 100)}%`,
                          backgroundColor: '#00f5ff',
                          boxShadow: '0 0 10px rgba(0, 245, 255, 0.5)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section Results */}
            {(session || !allSessions.length) && Object.keys(registres).length > 0 && (
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">📊</span>
                  <h2 
                    className="text-2xl font-semibold" 
                    style={{ 
                      color: '#fff', 
                      fontFamily: "'Orbitron', sans-serif",
                      textShadow: '0 0 10px rgba(0, 245, 255, 0.3)'
                    }}
                  >
                    Mes résultats
                  </h2>
                </div>
                
                <div className="flex gap-6 items-start">
                  {/* Graphique bulles */}
                  <div 
                    className="flex-1 rounded-2xl p-6"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div className="flex items-center justify-center gap-4 mb-6">
                      {REGISTRES.map((r) => {
                        const score = registres[r.id]?.score ?? 0;
                        const size = Math.max(60, (score / 25) * 100);
                        return (
                          <div key={r.id} className="flex flex-col items-center">
                            <div
                              className="rounded-full flex items-center justify-center text-2xl transition-all"
                              style={{
                                width: size,
                                height: size,
                                backgroundColor: `${r.color}20`,
                                border: `2px solid ${r.color}`,
                                boxShadow: `0 0 20px ${r.color}40`,
                              }}
                            >
                              {r.icon}
                            </div>
                            <p className="text-xs mt-2 text-white/60" style={{ fontFamily: "'Orbitron', sans-serif" }}>{r.label}</p>
                            <p className="text-sm font-bold" style={{ color: r.color }}>{score.toFixed(1)}</p>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-center text-sm text-white/50">
                      Score total: <span className="font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>{totalScore.toFixed(1)}</span>/100
                    </p>
                  </div>
                  
                  {/* Score details */}
                  <div 
                    className="w-80 rounded-2xl p-6"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <h3 
                      className="text-sm font-bold mb-4 uppercase tracking-wider"
                      style={{ color: 'rgba(0, 245, 255, 0.7)', fontFamily: "'Orbitron', sans-serif" }}
                    >
                      Détail par registre
                    </h3>
                    <div className="space-y-3">
                      {REGISTRES.map((r) => {
                        const score = registres[r.id]?.score ?? 0;
                        return (
                          <div key={r.id}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-white/80">{r.label}</span>
                              <span className="text-sm font-bold" style={{ color: r.color }}>{score.toFixed(1)}/25</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all"
                                style={{ 
                                  width: `${(score / 25) * 100}%`,
                                  backgroundColor: r.color
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Section Cards d'audits */}
            <section>
              <h2 
                className="text-2xl mb-6" 
                style={{ 
                  color: '#fff', 
                  fontFamily: "'Orbitron', sans-serif",
                  textShadow: '0 0 10px rgba(0, 245, 255, 0.3)'
                }}
              >
                Les 4 audits
              </h2>
              
              <div className="grid grid-cols-4 gap-4">
                {TEST_CARDS.map((test, index) => {
                  const status = getTestStatus(test.id);
                  const isLocked = isTestLocked(test.id, index);
                  const isHovered = hoveredCard === test.id;
                  
                  return (
                    <div
                      key={test.id}
                      className={`group relative rounded-2xl overflow-hidden transition-all duration-500 ${
                        status === 'completed' ? 'opacity-80' : isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      style={{ 
                        height: '280px',
                        background: isLocked ? 'linear-gradient(135deg, #333 0%, #444 100%)' : test.gradient,
                        boxShadow: isHovered && !isLocked ? '0 0 40px rgba(0, 245, 255, 0.4)' : '0 4px 20px rgba(0, 0, 0, 0.3)',
                        transform: isHovered && !isLocked ? 'scale(1.02)' : 'scale(1)'
                      }}
                      onMouseEnter={() => setHoveredCard(test.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => !isLocked && status !== 'completed' && onStartAudit(test.id)}
                    >
                      <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-3xl">{test.icon}</span>
                            {status === 'completed' && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/30 text-white">
                                ✓
                              </span>
                            )}
                            {isLocked && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-black/50 text-white">
                                🔒
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium mb-1 text-white/80">{test.subtitle}</p>
                          <h3 className="text-lg font-bold mb-1 text-white">{test.title}</h3>
                          <p className="text-xs leading-relaxed line-clamp-3 text-white/90">
                            {isLocked ? 'Complète l\'audit précédent pour débloquer celui-ci.' : test.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 text-xs text-white/80">
                            {!isLocked && <span>⏱️ {test.duration}</span>}
                          </div>
                          {!isLocked && (
                            <div 
                              className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                              style={{ backgroundColor: isHovered ? 'white' : 'rgba(255, 255, 255, 0.2)' }}
                            >
                              <span style={{ color: isHovered ? test.color : 'white' }}>→</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div 
                        className="absolute -bottom-12 -right-12 text-7xl opacity-20 transition-transform duration-500"
                        style={{ transform: isHovered ? 'scale(1.2) rotate(10deg)' : 'scale(1)' }}
                      >
                        {isLocked ? '🔒' : test.image}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section Discuter avec Doctor Claude */}
            <section className="mt-12">
              <div 
                className="rounded-2xl p-8 flex items-center justify-between"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(255, 0, 255, 0.1) 100%)',
                  border: '1px solid rgba(0, 245, 255, 0.3)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: 'rgba(0, 245, 255, 0.2)',
                      border: '2px solid #00f5ff'
                    }}
                  >
                    <img src={doctorClaude} alt="Doctor Claude" className="w-14 h-14 rounded-full object-cover" />
                  </div>
                  <div>
                    <h3 
                      className="text-xl font-bold mb-1"
                      style={{ 
                        color: '#fff',
                        fontFamily: "'Orbitron', sans-serif"
                      }}
                    >
                      Discuter avec Doctor Claude
                    </h3>
                    <p className="text-white/60">
                      Pose tes questions sur tes résultats, demande des clarifications ou des conseils personnalisés.
                    </p>
                  </div>
                </div>
                <button
                  className="px-6 py-3 rounded-full font-medium transition-all hover:opacity-90"
                  style={{ 
                    backgroundColor: '#00f5ff',
                    color: '#000',
                    fontFamily: "'Orbitron', sans-serif"
                  }}
                >
                  Ouvrir le chat →
                </button>
              </div>
            </section>
          </>
        )}

        {activeTab === 'audits' && (() => {
          const TEST_META = {
            '4-registres': { label: 'Audit des 4 Registres', icon: '🧭', color: '#00f5ff', desc: 'Cartographie tes 4 modes de fonctionnement : besoins primaires (Reptilien), intuition corporelle (Instinctif), vie émotionnelle (Émotionnel) et pensée analytique (Rationnel).', max: 100 },
            instinctif:    { label: 'Audit Instinctif',      icon: '🫀', color: '#ff00ff', desc: 'Explore ta relation au corps : conscience sensorielle, écoute de l\'intuition, ancrage somatique et capacité à faire confiance à tes ressentis physiques.', max: 100 },
            emotionnel:    { label: 'Audit Émotionnel',      icon: '💞', color: '#e6a817', desc: 'Évalue ton intelligence émotionnelle : vocabulaire des émotions, régulation, empathie, authenticité dans les relations et gestion des conflits.', max: 100 },
            mental:        { label: 'Audit Mental',          icon: '🧠', color: '#00f5ff', desc: 'Analyse tes processus cognitifs : concentration, mémoire de travail, créativité, prise de décision et capacité à observer ta propre pensée.', max: 100 },
          };
          const REGISTRES_ABBR = [
            { id: 'reptilien',  abbr: 'REP', color: '#00ff88' },
            { id: 'instinctif', abbr: 'INS', color: '#ff00ff' },
            { id: 'emotionnel', abbr: 'EMO', color: '#e6a817' },
            { id: 'rationnel',  abbr: 'RAT', color: '#00f5ff' },
          ];
          
          // Déduplication des sessions par test_type (garde la plus récente)
          const uniqueSessionsMap = new Map();
          allSessions.forEach(s => {
            const testType = s.test_type || '4-registres';
            const existing = uniqueSessionsMap.get(testType);
            if (!existing || new Date(s.date) > new Date(existing.date)) {
              uniqueSessionsMap.set(testType, s);
            }
          });
          
          // Ajouter les données de démo pour les tests manquants
          const demoSessions = [
            { type: '4-registres', data: { session_id: 'demo-4r', date: new Date().toISOString(), test_type: '4-registres', isDemo: true, session_data: { ...PREVIEW_DATA, status: 'completed' } } },
            { type: 'instinctif', data: { session_id: 'demo-inst', date: new Date(Date.now() - 86400000).toISOString(), test_type: 'instinctif', isDemo: true, session_data: { ...DEMO_INSTINCTIF_SESSION, status: 'completed' } } },
            { type: 'emotionnel', data: { session_id: 'demo-emo', date: new Date(Date.now() - 172800000).toISOString(), test_type: 'emotionnel', isDemo: true, session_data: { ...DEMO_EMOTIONNEL_SESSION, status: 'completed' } } },
            { type: 'mental', data: { session_id: 'demo-mental', date: new Date(Date.now() - 259200000).toISOString(), test_type: 'mental', isDemo: true, session_data: { ...DEMO_MENTAL_SESSION, status: 'completed' } } },
          ];
          
          demoSessions.forEach(({ type, data }) => {
            if (!uniqueSessionsMap.has(type)) {
              uniqueSessionsMap.set(type, data);
            }
          });
          
          const uniqueSessions = Array.from(uniqueSessionsMap.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
          
          const displaySessions = uniqueSessions;

          const activeAudit = selectedAudit ?? displaySessions[0]?.session_data;

          return (
            <div className="flex gap-5" style={{ height: 'calc(100vh - 160px)' }}>

              {/* Left column - compact list */}
              <div className="w-72 flex-shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
                {allSessions.length === 0 && (
                  <p className="text-[10px] text-white/50 mb-1 px-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>Données de démo</p>
                )}
                {displaySessions.map((s) => {
                  const testType = s.test_type || '4-registres';
                  const meta = TEST_META[testType] || TEST_META['4-registres'];
                  const data = s.session_data;
                  
                  // Calculer le score selon le type de test
                  let total = 0;
                  let scores = [];
                  
                  if (testType === '4-registres') {
                    const registresData = data?.registres ?? {};
                    scores = REGISTRES_ABBR.map(r => registresData[r.id]?.score ?? 0);
                    total = scores.reduce((a, b) => a + b, 0);
                  } else {
                    // Pour les tests secondaires, utiliser score_global
                    total = data?.score_global ?? data?.score ?? 0;
                  }
                  
                  const dateStr = new Date(s.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
                  const isActive = activeAudit === data;

                  return (
                    <button
                      key={s.session_id}
                      onClick={() => setSelectedAudit(data)}
                      className="w-full text-left p-4 rounded-xl transition-all"
                      style={{
                        backgroundColor: isActive ? 'rgba(0, 245, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        border: isActive ? '1px solid rgba(0, 245, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: isActive ? '0 0 20px rgba(0, 245, 255, 0.3)' : 'none',
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{meta.icon}</span>
                          <span className="text-xs font-semibold text-white">{meta.label}</span>
                        </div>
                        {total > 0 && (
                          <span className="text-sm font-bold tabular-nums" style={{ color: meta.color, fontFamily: "'Orbitron', sans-serif" }}>
                            {total.toFixed(0)}<span className="text-[10px] font-normal text-white/50">/{meta.max}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-white/50 mb-1">{dateStr}</p>
                      <p className="text-[10px] text-white/40 mb-2 leading-relaxed">{meta.desc}</p>
                      
                      {/* Barres de progression pour les 4 registres */}
                      {testType === '4-registres' && total > 0 && scores.length > 0 && (
                        <div className="grid grid-cols-4 gap-1">
                          {REGISTRES_ABBR.map((r, i) => (
                            <div key={r.id}>
                              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${Math.round((scores[i] / 25) * 100)}%`, backgroundColor: r.color }} />
                              </div>
                              <p className="text-[8px] text-white/40 mt-0.5 text-center" style={{ fontFamily: "'Orbitron', sans-serif" }}>{r.abbr}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Barre de progression simple pour les autres tests */}
                      {testType !== '4-registres' && total > 0 && (
                        <div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full" 
                              style={{ 
                                width: `${Math.round((total / meta.max) * 100)}%`, 
                                backgroundColor: meta.color 
                              }} 
                            />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right column - report reader with black background */}
              <div 
                className="flex-1 rounded-2xl overflow-hidden border flex flex-col"
                style={{ 
                  borderColor: 'rgba(0, 245, 255, 0.3)', 
                  backgroundColor: '#0a0a0f',
                  boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.5)'
                }}
              >
                {/* Header de la liseuse */}
                <div 
                  className="px-4 py-3 border-b flex items-center justify-between"
                  style={{ 
                    borderColor: 'rgba(0, 245, 255, 0.2)',
                    backgroundColor: 'rgba(0, 245, 255, 0.05)'
                  }}
                >
                  <span className="text-xs text-white/60" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    📄 Liseuse de rapport
                  </span>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ff5f56' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ffbd2e' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#27c93f' }} />
                  </div>
                </div>
                
                {/* Contenu du rapport */}
                {activeAudit ? (
                  <div className="flex-1 overflow-y-auto p-4">
                    <div 
                      className="rounded-xl overflow-hidden"
                      style={{ 
                        backgroundColor: '#fff',
                        boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)'
                      }}
                    >
                      {(() => {
                        // Trouver le type de test
                        const currentSession = displaySessions.find(s => s.session_data === activeAudit || s === activeAudit);
                        const testType = currentSession?.test_type || 
                                        (activeAudit.registres ? '4-registres' : 'instinctif');
                        
                        // Pour les tests secondaires (instinctif, emotionnel, mental)
                        if (['instinctif', 'emotionnel', 'mental'].includes(testType)) {
                          return (
                            <SecondaryTestReport 
                              session={{ session_data: activeAudit }} 
                              testType={testType}
                            />
                          );
                        }
                        
                        // Pour le test des 4 registres
                        return (
                          <DiagnosticScreen
                            registres={activeAudit.registres ?? {}}
                            diagnostic={activeAudit.diagnostic}
                            answers={activeAudit.answers || []}
                          />
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div 
                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ 
                          backgroundColor: 'rgba(0, 245, 255, 0.1)',
                          border: '1px solid rgba(0, 245, 255, 0.3)'
                        }}
                      >
                        <span className="text-3xl">📄</span>
                      </div>
                      <p className="text-white/50 text-sm">Sélectionne un audit dans la liste</p>
                      <p className="text-white/30 text-xs mt-1">pour voir le rapport détaillé</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          );
        })()}
        
        {activeTab === 'profile' && (() => {
          // Profil futuriste - recréé avec le style cyberpunk
          const sessionData = session?.session_data ?? PREVIEW_DATA;
          const registresData = sessionData?.registres ?? PREVIEW_DATA.registres ?? {};
          const diagnostic = sessionData?.diagnostic ?? PREVIEW_DATA.diagnostic ?? {};
          
          const reg4Values = REGISTRES.map(r => registresData[r.id]?.score ?? 0);
          const totalScore = reg4Values.reduce((a, b) => a + b, 0);
          const isDemo = !session?.session_data?.diagnostic;
          
          const otherTests = [
            { id: 'instinctif', meta: { label: 'Instinctif', icon: '🫀', color: '#ff00ff', max: 100 }, demo: DEMO_INSTINCTIF_SESSION },
            { id: 'emotionnel', meta: { label: 'Émotionnel', icon: '💞', color: '#e6a817', max: 100 }, demo: DEMO_EMOTIONNEL_SESSION },
            { id: 'mental', meta: { label: 'Mental', icon: '🧠', color: '#00f5ff', max: 100 }, demo: DEMO_MENTAL_SESSION },
          ].map(({ id, meta, demo }) => {
            const real = allSessions.find(s => s.test_type === id);
            return { testId: id, meta, sess: real ?? { session_data: demo }, isDemo: !real };
          });
          
          if (!session && !PREVIEW_DATA) {
            return (
              <div className="max-w-md mx-auto">
                <div 
                  className="rounded-2xl border p-8 text-center"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(0, 245, 255, 0.3)'
                  }}
                >
                  <p className="text-white/70 mb-1">Ton profil cognitif est vide pour l'instant.</p>
                  <p className="text-white/50 text-xs mb-4">Complète ton premier test pour le voir apparaître ici.</p>
                  {onStartAudit && (
                    <button
                      onClick={() => onStartAudit('4-registres')}
                      className="px-4 py-2 rounded-lg text-sm font-semibold"
                      style={{ backgroundColor: '#00f5ff', color: '#000' }}
                    >
                      Démarrer l'audit →
                    </button>
                  )}
                </div>
              </div>
            );
          }
          
          return (
            <div className="w-full space-y-5">
              {/* Header */}
              {isDemo && (
                <div className="flex justify-end">
                  <span 
                    className="text-xs px-3 py-1 rounded-full border"
                    style={{ 
                      backgroundColor: 'rgba(0, 245, 255, 0.1)',
                      borderColor: 'rgba(0, 245, 255, 0.3)',
                      color: '#00f5ff'
                    }}
                  >
                    Données de démo
                  </span>
                </div>
              )}
              
              {/* KPI Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(0, 245, 255, 0.7)' }}>
                    Scores des tests
                  </p>
                  {/* Toggle Barres/Cercles */}
                  <div className="flex items-center gap-1 rounded-full p-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <button
                      onClick={() => setKpiStyle('bars')}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                      style={{
                        backgroundColor: kpiStyle === 'bars' ? '#00f5ff' : 'transparent',
                        color: kpiStyle === 'bars' ? '#000' : 'rgba(255, 255, 255, 0.5)'
                      }}
                    >
                      Barres
                    </button>
                    <button
                      onClick={() => setKpiStyle('circles')}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                      style={{
                        backgroundColor: kpiStyle === 'circles' ? '#00f5ff' : 'transparent',
                        color: kpiStyle === 'circles' ? '#000' : 'rgba(255, 255, 255, 0.5)'
                      }}
                    >
                      Cercles
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {/* 4 Registres - Version Barres ou Cercles selon kpiStyle */}
                  {kpiStyle === 'bars' ? (
                    // Version Barres
                    <div
                      className="rounded-2xl border p-5 flex flex-col gap-3"
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(0, 245, 255, 0.2)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🧭</span>
                          <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                            4 Registres
                          </span>
                        </div>
                        {isDemo && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50">démo</span>}
                      </div>
                      <div>
                        <span className="text-3xl font-bold" style={{ color: '#00f5ff' }}>{Math.round((totalScore / 100) * 100)}</span>
                        <span className="text-sm text-white/40 ml-0.5">%</span>
                      </div>
                      <div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${totalScore}%`, backgroundColor: '#00f5ff' }} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Version Cercle
                    <div
                      className="rounded-2xl border p-5 flex flex-col items-center text-center gap-3"
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(0, 245, 255, 0.2)'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🧭</span>
                        <span className="text-xs font-semibold uppercase tracking-widest text-white/50">4 Registres</span>
                        {isDemo && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50">démo</span>}
                      </div>
                      <div className="relative w-20 h-20">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                          <circle 
                            cx="40" cy="40" r="35" fill="none" stroke="#00f5ff" strokeWidth="6"
                            strokeDasharray={`${2 * Math.PI * 35}`}
                            strokeDashoffset={`${2 * Math.PI * 35 * (1 - totalScore / 100)}`}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold" style={{ color: '#00f5ff' }}>{Math.round((totalScore / 100) * 100)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Autres tests - Version Barres ou Cercles selon kpiStyle */}
                  {otherTests.map(({ testId, meta, sess, isDemo: d }) => {
                    const diag = sess?.session_data?.diagnostic;
                    const score = diag?.profil_global?.score ?? 0;
                    const pct = Math.round((score / meta.max) * 100);
                    return kpiStyle === 'bars' ? (
                      // Version Barres
                      <div
                        key={testId}
                        className="rounded-2xl border p-5 flex flex-col gap-3"
                        style={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderColor: `${meta.color}40`
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{meta.icon}</span>
                            <span className="text-xs font-semibold uppercase tracking-widest text-white/50">{meta.label}</span>
                          </div>
                          {d && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50">démo</span>}
                        </div>
                        <div>
                          <span className="text-3xl font-bold" style={{ color: meta.color }}>{pct}</span>
                          <span className="text-sm text-white/40 ml-0.5">%</span>
                        </div>
                        <div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: meta.color }} />
                          </div>
                          {diag?.profil_global?.niveau && (
                            <p className="text-[11px] mt-1.5 font-medium" style={{ color: meta.color }}>{diag.profil_global.niveau}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      // Version Cercle
                      <div
                        key={testId}
                        className="rounded-2xl border p-5 flex flex-col items-center text-center gap-3"
                        style={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderColor: `${meta.color}40`
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{meta.icon}</span>
                          <span className="text-xs font-semibold uppercase tracking-widest text-white/50">{meta.label}</span>
                          {d && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50">démo</span>}
                        </div>
                        <div className="relative w-20 h-20">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                            <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                            <circle 
                              cx="40" cy="40" r="35" fill="none" stroke={meta.color} strokeWidth="6"
                              strokeDasharray={`${2 * Math.PI * 35}`}
                              strokeDashoffset={`${2 * Math.PI * 35 * (1 - pct / 100)}`}
                              strokeLinecap="round"
                              className="transition-all duration-1000"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold" style={{ color: meta.color }}>{pct}</span>
                          </div>
                        </div>
                        {diag?.profil_global?.niveau && (
                          <span 
                            className="text-[11px] font-medium px-2 py-0.5 rounded-full border"
                            style={{ 
                              color: meta.color, 
                              backgroundColor: `${meta.color}15`,
                              borderColor: `${meta.color}40`
                            }}
                          >
                            {diag.profil_global.niveau}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Main Content Grid */}
              <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1.4fr' }}>
                {/* Radar + synthèse */}
                <div 
                  className="rounded-2xl border p-6 flex flex-col"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(0, 245, 255, 0.2)'
                  }}
                >
                  <div className="flex-1" style={{ minHeight: '320px' }}>
                    <RadarChartFuturistic 
                      labels={REGISTRES.map(r => r.label)} 
                      values={reg4Values}
                      totalScore={totalScore}
                    />
                  </div>
                  {diagnostic?.resume_court && (
                    <div className="border-l-2 pl-4 mt-4 pt-4" style={{ borderColor: '#00f5ff', borderTopColor: 'rgba(0, 245, 255, 0.2)' }}>
                      <p className="text-xs text-white/70 leading-relaxed italic">{diagnostic.resume_court}</p>
                    </div>
                  )}
                </div>
                
                {/* Scores par registre */}
                <div 
                  className="rounded-2xl border p-6 flex flex-col gap-5"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(0, 245, 255, 0.2)'
                  }}
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(0, 245, 255, 0.7)' }}>Scores par registre</p>
                    <div className="space-y-3">
                      {REGISTRES.map((r) => {
                        const score = registresData[r.id]?.score ?? 0;
                        const pct = Math.round((score / 25) * 100);
                        return (
                          <div key={r.id} className="flex items-center gap-4">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                              style={{ 
                                backgroundColor: `${r.color}20`,
                                border: `1px solid ${r.color}60`
                              }}
                            >
                              {r.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-white/80">{r.label}</span>
                                <span className="text-sm font-bold" style={{ color: r.color }}>{score.toFixed(1)}/25</span>
                              </div>
                              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: r.color }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {diagnostic?.dynamiques?.length > 0 && (
                    <div className="pt-4 border-t" style={{ borderColor: 'rgba(0, 245, 255, 0.2)' }}>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(0, 245, 255, 0.7)' }}>Dynamiques centrales</p>
                      <div className="space-y-3">
                        {diagnostic.dynamiques.map((d, i) => (
                          <div key={i} className="flex gap-3">
                            <div
                              className="w-0.5 rounded-full shrink-0 self-stretch mt-0.5"
                              style={{ backgroundColor: i === 0 ? '#00f5ff' : 'rgba(255, 255, 255, 0.2)' }}
                            />
                            <div>
                              <p className="text-xs font-bold mb-0.5" style={{ color: i === 0 ? '#00f5ff' : 'rgba(255, 255, 255, 0.7)' }}>
                                {d.titre}
                              </p>
                              <p className="text-xs text-white/60 leading-relaxed">{d.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
        
        {activeTab === 'recommandations' && (() => {
          const diagData = session?.session_data?.diagnostic ?? PREVIEW_DATA.diagnostic;
          const conseils = diagData?.conseils;
          const isDemo = !session?.session_data?.diagnostic;
          const pq = conseils?.pratiques_quotidiennes;

          return (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 
                  className="text-3xl" 
                  style={{ 
                    color: '#fff', 
                    fontFamily: "'Orbitron', sans-serif",
                    textShadow: '0 0 20px rgba(0, 245, 255, 0.3)'
                  }}
                >
                  Recommandations personnalisées
                </h2>
                {isDemo && (
                  <span 
                    className="text-xs px-3 py-1 rounded-full border"
                    style={{ 
                      backgroundColor: 'rgba(0, 245, 255, 0.1)',
                      borderColor: 'rgba(0, 245, 255, 0.3)',
                      color: '#00f5ff',
                      fontFamily: "'Orbitron', sans-serif"
                    }}
                  >
                    Données de démo — complète un audit pour voir ton profil réel
                  </span>
                )}
              </div>

              {/* A — Pratiques quotidiennes */}
              {pq && (
                <section className="mb-8">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(0, 245, 255, 0.7)', fontFamily: "'Orbitron', sans-serif" }}>A — Prescription quotidienne</p>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { key: 'matin', label: 'Matin', icon: '🌅' },
                      { key: 'journee', label: 'Journée', icon: '☀️' },
                      { key: 'soir', label: 'Soir', icon: '🌙' },
                    ].map(({ key, label, icon }) => {
                      const items = Array.isArray(pq) ? [] : (pq[key] || []);
                      return (
                        <div 
                          key={key} 
                          className="p-5 rounded-2xl border"
                          style={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderColor: 'rgba(0, 245, 255, 0.2)'
                          }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">{icon}</span>
                            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#00f5ff', fontFamily: "'Orbitron', sans-serif" }}>{label}</p>
                          </div>
                          <ul className="space-y-2">
                            {items.map((item, i) => (
                              <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                                <span className="mt-0.5 shrink-0" style={{ color: '#00f5ff' }}>›</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* B — Axes prioritaires */}
              {diagData?.priorites?.length > 0 && (
                <section className="mb-8">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(0, 245, 255, 0.7)', fontFamily: "'Orbitron', sans-serif" }}>B — Axes prioritaires</p>
                  {diagData.priorites_intro && (
                    <p className="text-sm text-white/60 leading-relaxed mb-4 italic">{diagData.priorites_intro}</p>
                  )}
                  <div className="space-y-4">
                    {diagData.priorites.map((p, i) => (
                      <div 
                        key={i} 
                        className="p-5 rounded-2xl border"
                        style={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderColor: 'rgba(0, 245, 255, 0.2)'
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-bold text-white uppercase tracking-wide">
                            {p.registre}
                            {p.but && <span className="font-normal normal-case tracking-normal text-white/60 ml-2">— {p.but}</span>}
                          </p>
                          <span className="text-xs font-bold" style={{ color: '#00f5ff', fontFamily: "'Orbitron', sans-serif" }}>{p.score?.toFixed(1)}/25</span>
                        </div>
                        <ul className="space-y-1.5">
                          {p.actions?.map((action, j) => (
                            <li key={j} className="text-sm text-white/70 flex items-start gap-2">
                              <span className="mt-0.5 shrink-0" style={{ color: '#00f5ff' }}>›</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* C — Conseils généraux */}
              {conseils?.conseils_generaux?.length > 0 && (
                <section className="mb-8">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(0, 245, 255, 0.7)', fontFamily: "'Orbitron', sans-serif" }}>C — Conseils généraux</p>
                  <div 
                    className="p-5 rounded-2xl border"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(0, 245, 255, 0.2)'
                    }}
                  >
                    <ul className="space-y-3">
                      {conseils.conseils_generaux.map((c, i) => (
                        <li key={i} className="text-sm text-white/80 flex items-start gap-3">
                          <span className="font-bold mt-0.5 shrink-0" style={{ color: '#00f5ff' }}>›</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* D — Concepts à explorer */}
              {conseils?.concepts_a_etudier?.length > 0 && (
                <section className="mb-8">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(0, 245, 255, 0.7)', fontFamily: "'Orbitron', sans-serif" }}>D — Concepts à explorer</p>
                  <div 
                    className="rounded-2xl border overflow-hidden"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(0, 245, 255, 0.2)'
                    }}
                  >
                    <table className="w-full text-sm">
                      <tbody>
                        {conseils.concepts_a_etudier.map((c, i) => (
                          <tr 
                            key={i} 
                            className="border-b last:border-b-0"
                            style={{ borderColor: 'rgba(0, 245, 255, 0.1)' }}
                          >
                            <td className="py-3 px-5 font-semibold text-white w-2/5">{c.concept}</td>
                            <td className="py-3 px-5 text-white/60">{c.pourquoi}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* E — Ressources */}
              {conseils?.ressources?.length > 0 && (
                <section className="mb-8">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(0, 245, 255, 0.7)', fontFamily: "'Orbitron', sans-serif" }}>E — Ressources recommandées</p>
                  <div className="grid grid-cols-2 gap-4">
                    {conseils.ressources.map((r, i) => (
                      <div 
                        key={i} 
                        className="p-5 rounded-2xl border"
                        style={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderColor: 'rgba(0, 245, 255, 0.2)'
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">📚</span>
                          <div>
                            <p className="text-sm font-semibold text-white">{r.titre}</p>
                            {r.auteur && <p className="text-xs text-white/50 mt-0.5">{r.auteur}</p>}
                            {r.pourquoi && <p className="text-xs text-white/60 mt-2 leading-relaxed">{r.pourquoi}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          );
        })()}
      </main>

      <FloatingChatbot user={user} sessionData={session?.session_data} />
      
      {/* Animation pulse - intensifiée */}
      <style>{`
        @keyframes pulse-shadow-futuristic {
          0%, 100% {
            box-shadow: 0 0 30px rgba(0, 245, 255, 0.6), 0 0 60px rgba(0, 245, 255, 0.3), 0 4px 20px rgba(0, 0, 0, 0.3);
            border-color: rgba(0, 245, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 50px rgba(0, 245, 255, 1), 0 0 100px rgba(0, 245, 255, 0.5), 0 6px 30px rgba(0, 0, 0, 0.4);
            border-color: rgba(0, 245, 255, 0.8);
          }
        }
        
        .pulse-card-futuristic {
          animation: pulse-shadow-futuristic 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
