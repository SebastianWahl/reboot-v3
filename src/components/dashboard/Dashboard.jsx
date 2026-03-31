// Dashboard - Unified component with Scientific and Futuristic themes
// Combines the logic from DashboardDesign4Cream with conditional styling

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

const REGISTRES_SCIENTIFIC = [
  { id: 'reptilien', label: 'Reptilien', icon: '🦎', color: '#e07b39', emoji: '🌱', desc: 'Ancrage & Sécurité' },
  { id: 'instinctif', label: 'Instinctif', icon: '🫀', color: '#c0392b', emoji: '🔥', desc: 'Corps & Intuition' },
  { id: 'emotionnel', label: 'Émotionnel', icon: '💛', color: '#e6a817', emoji: '💧', desc: 'Cœur & Relations' },
  { id: 'rationnel', label: 'Rationnel', icon: '🧠', color: '#2980b9', emoji: '💨', desc: 'Esprit & Stratégie' },
];

const REGISTRES_FUTURISTIC = [
  { id: 'reptilien', label: 'Reptilien', icon: '🦎', color: '#00ff88', desc: 'Ancrage & Sécurité' },
  { id: 'instinctif', label: 'Instinctif', icon: '🫀', color: '#ff00ff', desc: 'Corps & Intuition' },
  { id: 'emotionnel', label: 'Émotionnel', icon: '💛', color: '#e6a817', desc: 'Cœur & Relations' },
  { id: 'rationnel', label: 'Rationnel', icon: '🧠', color: '#00f5ff', desc: 'Esprit & Stratégie' },
];

const TEST_CARDS_SCIENTIFIC = [
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
    gradient: 'linear-gradient(135deg, #FFD966 0%, #e6a817 100%)',
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
    color: '#2980b9',
    gradient: 'linear-gradient(135deg, #6BB5FF 0%, #2980b9 100%)',
    description: 'Analyse tes processus de pensée : focus, mémoire, créativité, métacognition.',
    duration: '20-25 min',
    questions: 10,
    image: '❄️'
  }
];

const TEST_CARDS_FUTURISTIC = [
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

export default function Dashboard({ user, onSignOut, onStartAudit, onViewSession, onToggleTheme, isFuturistic, activeTab, setActiveTab }) {
  const [session, setSession] = useState(null);
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [kpiStyle, setKpiStyle] = useState('bars');

  // Theme colors
  const theme = {
    background: isFuturistic ? '#0a0a0f' : '#FAF7F2',
    primary: isFuturistic ? '#00f5ff' : '#C96442',
    textPrimary: isFuturistic ? '#fff' : '#1A1209',
    textSecondary: isFuturistic ? 'rgba(255, 255, 255, 0.6)' : '#666',
    textMuted: isFuturistic ? 'rgba(255, 255, 255, 0.5)' : '#999',
    border: isFuturistic ? 'rgba(0, 245, 255, 0.2)' : '#E8E0D5',
    borderLight: isFuturistic ? 'rgba(0, 245, 255, 0.1)' : '#F0EBE4',
    cardBg: isFuturistic ? 'rgba(255, 255, 255, 0.05)' : '#fff',
    headerBg: isFuturistic ? 'rgba(10, 10, 15, 0.9)' : 'rgba(250, 247, 242, 0.9)',
    navBg: isFuturistic ? 'rgba(0, 245, 255, 0.1)' : 'rgba(255, 255, 255, 0.6)',
    fontPrimary: isFuturistic ? "'Orbitron', sans-serif" : "'EB Garamond', Georgia, serif",
    fontSecondary: isFuturistic ? "'Orbitron', sans-serif" : "system-ui, sans-serif",
    shadow: isFuturistic ? '0 0 20px rgba(0, 245, 255, 0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
    glow: isFuturistic ? '0 0 10px rgba(0, 245, 255, 0.5)' : 'none',
  };

  const REGISTRES = isFuturistic ? REGISTRES_FUTURISTIC : REGISTRES_SCIENTIFIC;
  const TEST_CARDS = isFuturistic ? TEST_CARDS_FUTURISTIC : TEST_CARDS_SCIENTIFIC;

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
        description: 'Commence par cet audit complet pour obtenir une vue d\'ensemble de ton profil cognitif. Doctor Claude analysera tes résultats et t\'orientera vers les audits spécifiques les plus pertinents.',
        icon: '🧭',
        color: theme.primary,
        gradient: TEST_CARDS[0].gradient,
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
      
      const testIndex = firstMissingLower === 'instinctif' ? 1 : firstMissingLower === 'emotionnel' ? 2 : 3;
      
      return {
        testId: firstMissingLower,
        title: missingCount === 1 ? `Audit ${firstMissing}` : `Audit ${firstMissing} (encore ${missingCount} à faire)`,
        subtitle: missingCount === 1 ? 'Dernier audit recommandé' : 'Prochain audit recommandé',
        description: missingCount === 1 
          ? `Approfondis ta connaissance du registre ${firstMissingLower}. C'est le dernier audit recommandé pour compléter ton profil.`
          : `Doctor Claude recommande d'approfondir le registre ${firstMissingLower} en priorité. Il te reste ${missingCount} audits à compléter.`,
        icon: TEST_CARDS[testIndex].icon,
        color: TEST_CARDS[testIndex].color,
        gradient: TEST_CARDS[testIndex].gradient,
        action: missingCount === 1 ? 'Terminer' : 'Continuer',
        isNewUser: false
      };
    }
    
    return null;
  };

  const nextStep = getNextStep();
  const completedCount = allSessions.filter(s => s.session_data?.status === 'completed' && !s.isDemo).length;
  const progressPercent = Math.round((completedCount / 4) * 100);

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.background }}>
      
      {/* Futuristic overlays */}
      {isFuturistic && (
        <>
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
        </>
      )}

      {/* Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-40 px-6 py-4"
        style={{ 
          background: theme.headerBg,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${theme.border}`
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {isFuturistic ? (
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                style={{ 
                  border: `2px solid ${theme.primary}`,
                  color: theme.primary,
                  textShadow: '0 0 10px rgba(0, 245, 255, 0.5)',
                  boxShadow: `0 0 20px ${theme.primary}33, inset 0 0 20px ${theme.primary}1a`,
                }}
              >
                DC
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-[#E8E0D5]">
                <img src={doctorClaude} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <span 
              className="font-semibold text-lg" 
              style={{ 
                color: theme.textPrimary, 
                fontFamily: theme.fontPrimary,
                textShadow: isFuturistic ? '0 0 10px rgba(0, 245, 255, 0.3)' : 'none'
              }}
            >
              Re-Boot
            </span>
          </div>
          
          {/* Navigation */}
          <nav 
            className="flex items-center gap-1 rounded-full p-1"
            style={{ background: theme.navBg }}
          >
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
                  backgroundColor: activeTab === tab.id ? theme.primary : 'transparent',
                  color: activeTab === tab.id ? (isFuturistic ? '#000' : '#fff') : theme.textSecondary,
                  fontFamily: theme.fontPrimary,
                  boxShadow: activeTab === tab.id && isFuturistic ? theme.shadow : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all mx-4 hover:shadow-lg"
            style={{
              backgroundColor: isFuturistic ? '#FAF7F2' : '#0a0a0f',
              border: isFuturistic ? '1px solid rgba(201, 100, 66, 0.5)' : `1px solid ${theme.primary}80`,
              color: isFuturistic ? '#C96442' : theme.primary,
              fontFamily: isFuturistic ? "'EB Garamond', Georgia, serif" : "'Orbitron', sans-serif",
              fontSize: isFuturistic ? '13px' : '12px',
              letterSpacing: isFuturistic ? '0.5px' : '0',
              boxShadow: `0 0 15px ${isFuturistic ? 'rgba(201, 100, 66, 0.3)' : 'rgba(0, 245, 255, 0.3)'}`
            }}
            title={isFuturistic ? "Passer en mode scientifique" : "Passer en mode futuriste"}
          >
            <span className="hidden lg:inline">{isFuturistic ? 'Scientifique' : 'Futuriste'}</span>
            <span className="lg:hidden">{isFuturistic ? 'Sci.' : 'Fut.'}</span>
          </button>

          {/* Logout button */}
          <button 
            onClick={onSignOut}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ 
              backgroundColor: `${theme.primary}1a`,
              border: `1px solid ${theme.primary}4d`,
              color: theme.primary
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

      <main 
        className="pt-24 pb-12 px-6 max-w-7xl mx-auto"
        style={{ position: 'relative', zIndex: 1 }}
      >
        
        {activeTab === 'overview' && (
          <>
            {/* Hero Section - 3 columns */}
            <section className="mb-8">
              <div className="grid grid-cols-3 gap-6 items-start">
                {/* Column 1: Title */}
                <div>
                  <p 
                    className="text-sm font-medium mb-2 tracking-wider uppercase"
                    style={{ color: theme.primary }}
                  >
                    Dashboard Personnel
                  </p>
                  <h1 
                    className="text-4xl mb-4 leading-tight"
                    style={{ 
                      color: theme.textPrimary, 
                      fontFamily: theme.fontPrimary,
                      textShadow: isFuturistic ? '0 0 20px rgba(0, 245, 255, 0.3)' : 'none'
                    }}
                  >
                    Cartographie ton <br/>
                    <span style={{ color: theme.primary }}>fonctionnement</span> cognitif
                  </h1>
                  <p style={{ color: theme.textSecondary }}>
                    4 audits progressifs pour comprendre et optimiser tes 4 registres de fonctionnement.
                  </p>
                </div>

                {/* Column 2: Next Step */}
                <div>
                  {nextStep && (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-lg">🎯</span>
                        <h2 
                          className="text-lg font-semibold"
                          style={{ 
                            color: theme.textPrimary, 
                            fontFamily: theme.fontPrimary 
                          }}
                        >
                          Ma prochaine étape
                        </h2>
                      </div>
                      
                      <div 
                        className={isFuturistic ? 'pulse-card-futuristic' : 'pulse-card'}
                        style={{ 
                          backgroundImage: nextStep.gradient,
                          borderRadius: '16px',
                          padding: '16px',
                          cursor: 'pointer',
                          height: '160px',
                          boxShadow: isFuturistic ? '0 0 30px rgba(0, 245, 255, 0.3)' : undefined,
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

                {/* Column 3: Progress */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-lg">📊</span>
                    <h2 
                      className="text-lg font-semibold"
                      style={{ 
                        color: theme.textPrimary, 
                        fontFamily: theme.fontPrimary 
                      }}
                    >
                      Ma progression
                    </h2>
                  </div>
                  
                  <div 
                    style={{ 
                      backgroundColor: theme.cardBg,
                      borderRadius: '16px',
                      padding: '16px',
                      border: `1px solid ${theme.border}`,
                      height: '160px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center flex-1">
                        <p className="text-3xl font-bold" style={{ color: theme.textPrimary }}>{completedCount}</p>
                        <p style={{ color: theme.textMuted, fontSize: '12px' }}>Audits complétés</p>
                      </div>
                      <div className="w-px h-10" style={{ backgroundColor: theme.border }} />
                      <div className="text-center flex-1">
                        <p className="text-3xl font-bold" style={{ color: theme.textPrimary }}>{progressPercent}%</p>
                        <p style={{ color: theme.textMuted, fontSize: '12px' }}>Progression globale</p>
                      </div>
                    </div>
                    
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.borderLight }}>
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${progressPercent}%`,
                          backgroundColor: theme.primary,
                          boxShadow: isFuturistic ? '0 0 10px rgba(0, 245, 255, 0.5)' : 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Results Section */}
            {(session || !allSessions.length) && Object.keys(registres).length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xl">📈</span>
                  <h2 
                    className="text-2xl font-semibold"
                    style={{ 
                      color: theme.textPrimary, 
                      fontFamily: theme.fontPrimary,
                      textShadow: isFuturistic ? '0 0 10px rgba(0, 245, 255, 0.3)' : 'none'
                    }}
                  >
                    Mes résultats
                  </h2>
                  <span style={{ color: theme.textMuted, fontSize: '14px' }}>— Profil des 4 registres</span>
                </div>
                
                {isFuturistic ? (
                  // Futuristic results view
                  <div className="flex gap-6 items-start">
                    {/* Bubbles chart */}
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
                              <p className="text-xs mt-2 text-white/60" style={{ fontFamily: theme.fontPrimary }}>{r.label}</p>
                              <p className="text-sm font-bold" style={{ color: r.color }}>{score.toFixed(1)}</p>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-center text-sm text-white/50">
                        Score total: <span className="font-bold text-white" style={{ fontFamily: theme.fontPrimary }}>{totalScore.toFixed(1)}</span>/100
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
                        style={{ color: 'rgba(0, 245, 255, 0.7)', fontFamily: theme.fontPrimary }}
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
                ) : (
                  // Scientific results view
                  <div className="grid grid-cols-2 gap-8 items-center">
                    {/* Visual chart */}
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
                                backgroundColor: `${reg.color}15`,
                                border: `2px solid ${reg.color}`,
                                transform: `translate(${x}px, ${y}px)`,
                                boxShadow: `0 0 40px ${reg.color}20`
                              }}
                            >
                              <span className="text-3xl">{reg.icon}</span>
                            </div>
                          );
                        })}
                        <div 
                          className="w-24 h-24 rounded-full flex items-center justify-center relative z-10"
                          style={{ 
                            background: `linear-gradient(135deg, ${theme.primary}, ${isFuturistic ? '#0088ff' : '#e07b39'})`,
                            boxShadow: `0 0 60px ${theme.primary}4d`
                          }}
                        >
                          <span className="text-4xl">🧭</span>
                        </div>
                      </div>
                    </div>

                    {/* Detailed scores */}
                    <div className="space-y-4">
                      {session && (
                        <div 
                          className="rounded-2xl p-5"
                          style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg" style={{ color: theme.textPrimary }}>
                              Score Global
                            </h3>
                            <span className="text-3xl font-bold" style={{ color: theme.primary }}>
                              {totalScore}<span className="text-lg text-gray-400">/100</span>
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            {REGISTRES.map((reg) => {
                              const score = registres[reg.id]?.score ?? 0;
                              return (
                                <div key={reg.id} className="flex items-center gap-3">
                                  <span className="text-xl">{reg.icon}</span>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>{reg.label}</span>
                                      <span className="text-sm font-bold" style={{ color: reg.color }}>
                                        {score.toFixed(1)}/25
                                      </span>
                                    </div>
                                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.borderLight }}>
                                      <div 
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ 
                                          width: `${(score / 25) * 100}%`,
                                          backgroundColor: reg.color
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Test Cards Section */}
            <section>
              <h2 
                className="text-2xl mb-6"
                style={{ 
                  color: theme.textPrimary, 
                  fontFamily: theme.fontPrimary,
                  textShadow: isFuturistic ? '0 0 10px rgba(0, 245, 255, 0.3)' : 'none'
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
                        isFuturistic 
                          ? (status === 'completed' ? 'opacity-80' : isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer')
                          : (isLocked ? 'opacity-60' : 'cursor-pointer')
                      }`}
                      style={{ 
                        height: '280px',
                        background: isLocked 
                          ? (isFuturistic ? 'linear-gradient(135deg, #333 0%, #444 100%)' : '#E8E0D5')
                          : test.gradient,
                        boxShadow: isFuturistic && isHovered && !isLocked 
                          ? '0 0 40px rgba(0, 245, 255, 0.4)' 
                          : isFuturistic ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
                        transform: isFuturistic && isHovered && !isLocked ? 'scale(1.02)' : 'scale(1)'
                      }}
                      onMouseEnter={() => setHoveredCard(test.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => !isLocked && (!isFuturistic || status !== 'completed') && onStartAudit(test.id)}
                    >
                      {/* Background pattern - scientific only */}
                      {!isFuturistic && (
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                          }} />
                        </div>
                      )}

                      {/* Content */}
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
                              <span 
                                className="px-2 py-1 rounded-full text-xs font-medium"
                                style={{ 
                                  backgroundColor: isFuturistic ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)',
                                  color: isFuturistic ? 'white' : 'rgba(0,0,0,0.6)'
                                }}
                              >
                                🔒
                              </span>
                            )}
                          </div>
                          <p className={`text-xs font-medium mb-1 ${isLocked ? (isFuturistic ? 'text-white/60' : 'text-gray-600') : 'text-white/80'}`}>{test.subtitle}</p>
                          <h3 className={`text-lg font-bold mb-1 ${isLocked ? (isFuturistic ? 'text-white/80' : 'text-gray-800') : 'text-white'}`}>{test.title}</h3>
                          <p className={`text-xs leading-relaxed line-clamp-3 ${isLocked ? (isFuturistic ? 'text-white/60' : 'text-gray-600') : 'text-white/90'}`}>
                            {isLocked ? 'Complète l\'audit précédent pour débloquer celui-ci.' : test.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className={`flex items-center gap-2 text-xs ${isLocked ? (isFuturistic ? 'text-white/50' : 'text-gray-500') : 'text-white/80'}`}>
                            {!isLocked && <span>⏱️ {test.duration}</span>}
                          </div>
                          {!isLocked && (
                            <div 
                              className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                              style={{ 
                                backgroundColor: isHovered ? 'white' : 'rgba(255, 255, 255, 0.2)',
                                transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                              }}
                            >
                              <span style={{ color: isHovered ? test.color : 'white' }}>→</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Decorative element */}
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

            {/* Chat with Doctor Claude Section */}
            <section className="mt-12">
              <div 
                className="rounded-2xl p-8 flex items-center justify-between"
                style={{ 
                  background: isFuturistic 
                    ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(255, 0, 255, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(201, 100, 66, 0.08) 0%, rgba(224, 123, 57, 0.08) 100%)',
                  border: `1px solid ${isFuturistic ? 'rgba(0, 245, 255, 0.3)' : 'rgba(201, 100, 66, 0.3)'}`
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: isFuturistic ? 'rgba(0, 245, 255, 0.2)' : 'rgba(201, 100, 66, 0.15)',
                      border: `2px solid ${theme.primary}`
                    }}
                  >
                    <img src={doctorClaude} alt="Doctor Claude" className="w-14 h-14 rounded-full object-cover" />
                  </div>
                  <div>
                    <h3 
                      className="text-xl font-bold mb-1"
                      style={{ 
                        color: theme.textPrimary,
                        fontFamily: theme.fontPrimary
                      }}
                    >
                      Discuter avec Doctor Claude
                    </h3>
                    <p style={{ color: isFuturistic ? 'rgba(255,255,255,0.6)' : 'rgba(26, 18, 9, 0.6)' }}>
                      Pose tes questions sur tes résultats, demande des clarifications ou des conseils personnalisés.
                    </p>
                  </div>
                </div>
                <button
                  className="px-6 py-3 rounded-full font-medium transition-all hover:opacity-90"
                  style={{ 
                    backgroundColor: theme.primary,
                    color: isFuturistic ? '#000' : '#fff',
                    fontFamily: theme.fontPrimary,
                    boxShadow: isFuturistic ? theme.glow : 'none'
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
            '4-registres': { 
              label: 'Audit des 4 Registres', 
              icon: '🧭', 
              color: isFuturistic ? '#00f5ff' : '#C96442', 
              desc: 'Cartographie tes 4 modes de fonctionnement : besoins primaires (Reptilien), intuition corporelle (Instinctif), vie émotionnelle (Émotionnel) et pensée analytique (Rationnel).', 
              max: 100 
            },
            instinctif: { 
              label: 'Audit Instinctif', 
              icon: '🫀', 
              color: isFuturistic ? '#ff00ff' : '#c0392b', 
              desc: 'Explore ta relation au corps : conscience sensorielle, écoute de l\'intuition, ancrage somatique et capacité à faire confiance à tes ressentis physiques.', 
              max: 100 
            },
            emotionnel: { 
              label: 'Audit Émotionnel', 
              icon: '💞', 
              color: '#e6a817', 
              desc: 'Évalue ton intelligence émotionnelle : vocabulaire des émotions, régulation, empathie, authenticité dans les relations et gestion des conflits.', 
              max: 100 
            },
            mental: { 
              label: 'Audit Mental', 
              icon: '🧠', 
              color: isFuturistic ? '#00f5ff' : '#2980b9', 
              desc: 'Analyse tes processus cognitifs : concentration, mémoire de travail, créativité, prise de décision et capacité à observer ta propre pensée.', 
              max: 100 
            },
          };
          const REGISTRES_ABBR = isFuturistic
            ? [
                { id: 'reptilien', abbr: 'REP', color: '#00ff88' },
                { id: 'instinctif', abbr: 'INS', color: '#ff00ff' },
                { id: 'emotionnel', abbr: 'EMO', color: '#e6a817' },
                { id: 'rationnel', abbr: 'RAT', color: '#00f5ff' },
              ]
            : [
                { id: 'reptilien', abbr: 'REP', color: '#e07b39' },
                { id: 'instinctif', abbr: 'INS', color: '#c0392b' },
                { id: 'emotionnel', abbr: 'EMO', color: '#e6a817' },
                { id: 'rationnel', abbr: 'RAT', color: '#2980b9' },
              ];
          
          // Deduplicate sessions by test_type (keep most recent)
          const uniqueSessionsMap = new Map();
          allSessions.forEach(s => {
            const testType = s.test_type || '4-registres';
            const existing = uniqueSessionsMap.get(testType);
            if (!existing || new Date(s.date) > new Date(existing.date)) {
              uniqueSessionsMap.set(testType, s);
            }
          });
          
          // Add demo data for missing tests
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
                  <p 
                    className="text-[10px] mb-1 px-1"
                    style={{ 
                      color: theme.textMuted,
                      fontFamily: isFuturistic ? theme.fontPrimary : 'inherit'
                    }}
                  >
                    Données de démo
                  </p>
                )}
                {displaySessions.map((s) => {
                  const testType = s.test_type || '4-registres';
                  const meta = TEST_META[testType] || TEST_META['4-registres'];
                  const data = s.session_data;
                  
                  // Calculate score based on test type
                  let total = 0;
                  let scores = [];
                  
                  if (testType === '4-registres') {
                    const registresData = data?.registres ?? {};
                    scores = REGISTRES_ABBR.map(r => registresData[r.id]?.score ?? 0);
                    total = scores.reduce((a, b) => a + b, 0);
                  } else {
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
                        backgroundColor: isActive 
                          ? (isFuturistic ? 'rgba(0, 245, 255, 0.15)' : '#fff')
                          : (isFuturistic ? 'rgba(255, 255, 255, 0.05)' : 'transparent'),
                        border: isActive 
                          ? `1px solid ${isFuturistic ? 'rgba(0, 245, 255, 0.5)' : theme.primary}`
                          : `1px solid ${theme.border}`,
                        boxShadow: isActive && isFuturistic ? '0 0 20px rgba(0, 245, 255, 0.3)' : 'none',
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{meta.icon}</span>
                          <span 
                            className="text-xs font-semibold"
                            style={{ color: isFuturistic ? '#fff' : theme.textPrimary }}
                          >
                            {meta.label}
                          </span>
                        </div>
                        {total > 0 && (
                          <span 
                            className="text-sm font-bold tabular-nums"
                            style={{ 
                              color: meta.color,
                              fontFamily: isFuturistic ? theme.fontPrimary : 'inherit'
                            }}
                          >
                            {total.toFixed(0)}<span style={{ fontSize: '10px', fontWeight: 'normal', color: isFuturistic ? 'rgba(255,255,255,0.5)' : '#bbb' }}>/{meta.max}</span>
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '10px', color: theme.textMuted, marginBottom: '4px' }}>{dateStr}</p>
                      <p style={{ fontSize: '10px', color: isFuturistic ? 'rgba(255,255,255,0.4)' : '#999', marginBottom: '8px', lineHeight: 1.4 }}>{meta.desc}</p>
                      
                      {/* Progress bars for 4 registres */}
                      {testType === '4-registres' && total > 0 && scores.length > 0 && (
                        <div className="grid grid-cols-4 gap-1">
                          {REGISTRES_ABBR.map((r, i) => (
                            <div key={r.id}>
                              <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: isFuturistic ? 'rgba(255,255,255,0.1)' : '#F0EBE4' }}>
                                <div className="h-full rounded-full" style={{ width: `${Math.round((scores[i] / 25) * 100)}%`, backgroundColor: r.color }} />
                              </div>
                              <p 
                                className="text-[8px] mt-0.5 text-center"
                                style={{ 
                                  color: isFuturistic ? 'rgba(255,255,255,0.4)' : '#ccc',
                                  fontFamily: isFuturistic ? theme.fontPrimary : 'inherit'
                                }}
                              >
                                {r.abbr}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Simple progress bar for other tests */}
                      {testType !== '4-registres' && total > 0 && (
                        <div>
                          <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: isFuturistic ? 'rgba(255,255,255,0.1)' : '#F0EBE4' }}>
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

              {/* Right column - report reader */}
              <div 
                className="flex-1 rounded-2xl overflow-hidden border flex flex-col"
                style={{ 
                  borderColor: theme.border,
                  backgroundColor: isFuturistic ? '#0a0a0f' : '#f0ede6',
                  boxShadow: isFuturistic ? 'inset 0 0 40px rgba(0, 0, 0, 0.5)' : 'none'
                }}
              >
                {/* Reader header */}
                {isFuturistic && (
                  <div 
                    className="px-4 py-3 border-b flex items-center justify-between"
                    style={{ 
                      borderColor: 'rgba(0, 245, 255, 0.2)',
                      backgroundColor: 'rgba(0, 245, 255, 0.05)'
                    }}
                  >
                    <span 
                      className="text-xs"
                      style={{ 
                        color: 'rgba(255,255,255,0.6)',
                        fontFamily: theme.fontPrimary
                      }}
                    >
                      📄 Liseuse de rapport
                    </span>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ff5f56' }} />
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ffbd2e' }} />
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#27c93f' }} />
                    </div>
                  </div>
                )}
                
                {/* Report content */}
                {activeAudit ? (
                  <div className="flex-1 overflow-y-auto p-4">
                    <div 
                      className="rounded-xl overflow-hidden"
                      style={{ 
                        backgroundColor: '#fff',
                        boxShadow: isFuturistic ? '0 0 30px rgba(0, 0, 0, 0.5)' : 'none'
                      }}
                    >
                      {(() => {
                        // Find test type
                        const currentSession = displaySessions.find(s => s.session_data === activeAudit || s === activeAudit);
                        const testType = currentSession?.test_type || 
                                        (activeAudit.registres ? '4-registres' : 'instinctif');
                        
                        // For secondary tests
                        if (['instinctif', 'emotionnel', 'mental'].includes(testType)) {
                          return (
                            <SecondaryTestReport 
                              session={{ session_data: activeAudit }} 
                              testType={testType}
                            />
                          );
                        }
                        
                        // For 4 registres test
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
                    {isFuturistic ? (
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
                    ) : (
                      <p style={{ color: '#bbb' }}>Sélectionne un audit pour voir le rapport</p>
                    )}
                  </div>
                )}
              </div>

            </div>
          );
        })()}

        {activeTab === 'profile' && (() => {
          // Futuristic profile view
          if (isFuturistic) {
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
                    {/* Toggle Bars/Circles */}
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
                    {/* 4 Registres - Bars or Circles version */}
                    {kpiStyle === 'bars' ? (
                      // Bars version
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
                      // Circle version
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
                    
                    {/* Other tests - Bars or Circles version */}
                    {otherTests.map(({ testId, meta, sess, isDemo: d }) => {
                      const diag = sess?.session_data?.diagnostic;
                      const score = diag?.profil_global?.score ?? 0;
                      const pct = Math.round((score / meta.max) * 100);
                      return kpiStyle === 'bars' ? (
                        // Bars version
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
                        // Circle version
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
                  {/* Radar + scores par registre */}
                  <div
                    className="rounded-2xl border p-6 flex flex-col"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(0, 245, 255, 0.2)'
                    }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(0,245,255,0.7)' }}>Radarchart — 4 registres</p>
                    <div className="flex-1" style={{ minHeight: '280px' }}>
                      <RadarChartFuturistic
                        labels={REGISTRES.map(r => r.label)}
                        values={reg4Values}
                        totalScore={totalScore}
                      />
                    </div>
                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(0,245,255,0.15)' }}>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(0,245,255,0.7)' }}>Scores par registre</p>
                      <div className="space-y-2">
                        {REGISTRES.map((r) => {
                          const score = registresData[r.id]?.score ?? 0;
                          const pct = Math.round((score / 25) * 100);
                          return (
                            <div key={r.id} className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                                style={{ backgroundColor: `${r.color}20`, border: `1px solid ${r.color}60` }}
                              >
                                {r.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{r.label}</span>
                                  <span className="text-[11px] font-bold tabular-nums" style={{ color: r.color }}>
                                    {score.toFixed(1)}<span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 'normal' }}>/25</span>
                                  </span>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: r.color }} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Synthèse + scores détaillés + dynamiques */}
                  <div
                    className="rounded-2xl border p-6 flex flex-col gap-5"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(0, 245, 255, 0.2)'
                    }}
                  >
                    {diagnostic?.resume_court && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(0,245,255,0.7)' }}>Synthèse</p>
                        <div className="border-l-2 pl-3" style={{ borderColor: '#00f5ff' }}>
                          <p className="text-xs text-white/70 leading-relaxed italic">{diagnostic.resume_court}</p>
                        </div>
                      </div>
                    )}
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

                {/* Bottom row — 3 test detail cards */}
                <div className="grid grid-cols-3 gap-5">
                  {otherTests.map(({ testId, meta, sess, isDemo: demoTest }) => {
                    const diag = sess?.session_data?.diagnostic ?? sess?.diagnostic;
                    const profil = diag?.profil_global;
                    if (!profil) return null;
                    const topDims = [...(profil.dimensions || [])].sort((a, b) => b.score - a.score).slice(0, 4);
                    return (
                      <div key={testId} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: `${meta.color}40` }}>
                        <div className="h-0.5 w-full" style={{ backgroundColor: meta.color }} />
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: meta.color }}>
                              {meta.icon} {meta.label}
                            </p>
                            <div className="flex items-center gap-2">
                              {demoTest && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/40">démo</span>}
                              <span className="text-sm font-bold" style={{ color: meta.color }}>{profil.score}/{meta.max}</span>
                            </div>
                          </div>
                          {profil.synthese && (
                            <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>{profil.synthese}</p>
                          )}
                          <div className="space-y-2 mb-3">
                            {topDims.map((dim) => {
                              const pct = Math.round((dim.score / dim.max) * 100);
                              return (
                                <div key={dim.nom} className="flex items-center gap-2">
                                  <span className="text-[11px] truncate flex-1 min-w-0" style={{ color: 'rgba(255,255,255,0.4)' }}>{dim.nom}</span>
                                  <div className="w-14 h-1 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: meta.color }} />
                                  </div>
                                  <span className="text-[10px] font-bold flex-shrink-0" style={{ color: meta.color }}>{dim.score}/{dim.max}</span>
                                </div>
                              );
                            })}
                          </div>
                          {diag?.dynamiques?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                              {diag.dynamiques.slice(0, 3).map((d, i) => (
                                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${meta.color}20`, color: meta.color }}>
                                  {d.titre}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          }

          // Scientific profile view - use DashboardProfile component
          return (
            <DashboardProfile
              user={user}
              onStartAudit={() => onStartAudit('4-registres')}
              fallbackData={PREVIEW_DATA}
              allSessions={allSessions}
            />
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
                    color: theme.textPrimary, 
                    fontFamily: theme.fontPrimary,
                    textShadow: isFuturistic ? '0 0 20px rgba(0, 245, 255, 0.3)' : 'none'
                  }}
                >
                  Recommandations personnalisées
                </h2>
                {isDemo && (
                  <span 
                    className="text-xs px-3 py-1 rounded-full border"
                    style={{ 
                      backgroundColor: isFuturistic ? 'rgba(0, 245, 255, 0.1)' : theme.background,
                      borderColor: isFuturistic ? 'rgba(0, 245, 255, 0.3)' : theme.border,
                      color: isFuturistic ? '#00f5ff' : '#999',
                      fontFamily: isFuturistic ? theme.fontPrimary : 'inherit'
                    }}
                  >
                    Données de démo — complète un audit pour voir ton profil réel
                  </span>
                )}
              </div>

              {/* A — Daily practices */}
              {pq && (
                <section className="mb-8">
                  <p 
                    className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4"
                    style={{ 
                      color: isFuturistic ? 'rgba(0, 245, 255, 0.7)' : '#888',
                      fontFamily: isFuturistic ? theme.fontPrimary : 'inherit'
                    }}
                  >
                    A — Prescription quotidienne
                  </p>
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
                          className="p-5 rounded-2xl"
                          style={{ 
                            backgroundColor: theme.cardBg,
                            border: `1px solid ${theme.border}`
                          }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">{icon}</span>
                            <p 
                              className="text-xs font-bold tracking-widest uppercase"
                              style={{ 
                                color: theme.primary,
                                fontFamily: isFuturistic ? theme.fontPrimary : 'inherit'
                              }}
                            >
                              {label}
                            </p>
                          </div>
                          <ul className="space-y-2">
                            {items.map((item, i) => (
                              <li 
                                key={i} 
                                className="text-sm flex items-start gap-2"
                                style={{ color: isFuturistic ? 'rgba(255,255,255,0.7)' : '#444' }}
                              >
                                <span style={{ color: theme.primary }}>›</span>
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

              {/* B — Priority axes */}
              {diagData?.priorites?.length > 0 && (
                <section className="mb-8">
                  <p 
                    className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4"
                    style={{ 
                      color: isFuturistic ? 'rgba(0, 245, 255, 0.7)' : '#888',
                      fontFamily: isFuturistic ? theme.fontPrimary : 'inherit'
                    }}
                  >
                    B — Axes prioritaires
                  </p>
                  {diagData.priorites_intro && (
                    <p className="text-sm leading-relaxed mb-4 italic" style={{ color: isFuturistic ? 'rgba(255,255,255,0.6)' : '#555' }}>
                      {diagData.priorites_intro}
                    </p>
                  )}
                  <div className="space-y-4">
                    {diagData.priorites.map((p, i) => (
                      <div 
                        key={i} 
                        className="p-5 rounded-2xl"
                        style={{ 
                          backgroundColor: theme.cardBg,
                          border: `1px solid ${theme.border}`
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-bold uppercase tracking-wide" style={{ color: isFuturistic ? '#fff' : theme.textPrimary }}>
                            {p.registre}
                            {p.but && <span className="font-normal normal-case tracking-normal ml-2" style={{ color: isFuturistic ? 'rgba(255,255,255,0.6)' : '#888' }}>— {p.but}</span>}
                          </p>
                          <span 
                            className="text-xs font-bold"
                            style={{ 
                              color: theme.primary,
                              fontFamily: isFuturistic ? theme.fontPrimary : 'inherit'
                            }}
                          >
                            {p.score?.toFixed(1)}/25
                          </span>
                        </div>
                        <ul className="space-y-1.5">
                          {p.actions?.map((action, j) => (
                            <li 
                              key={j} 
                              className="text-sm flex items-start gap-2"
                              style={{ color: isFuturistic ? 'rgba(255,255,255,0.7)' : '#444' }}
                            >
                              <span style={{ color: theme.primary }}>›</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* C — General advice */}
              {conseils?.conseils_generaux?.length > 0 && (
                <section className="mb-8">
                  <p 
                    className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4"
                    style={{ 
                      color: isFuturistic ? 'rgba(0, 245, 255, 0.7)' : '#888',
                      fontFamily: isFuturistic ? theme.fontPrimary : 'inherit'
                    }}
                  >
                    C — Conseils généraux
                  </p>
                  <div 
                    className="p-5 rounded-2xl"
                    style={{ 
                      backgroundColor: theme.cardBg,
                      border: `1px solid ${theme.border}`
                    }}
                  >
                    <ul className="space-y-3">
                      {conseils.conseils_generaux.map((c, i) => (
                        <li 
                          key={i} 
                          className="text-sm flex items-start gap-3"
                          style={{ color: isFuturistic ? 'rgba(255,255,255,0.8)' : '#333' }}
                        >
                          <span style={{ color: theme.primary, fontWeight: 'bold' }}>›</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* D — Concepts to explore */}
              {conseils?.concepts_a_etudier?.length > 0 && (
                <section className="mb-8">
                  <p 
                    className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4"
                    style={{ 
                      color: isFuturistic ? 'rgba(0, 245, 255, 0.7)' : '#888',
                      fontFamily: isFuturistic ? theme.fontPrimary : 'inherit'
                    }}
                  >
                    D — Concepts à explorer
                  </p>
                  <div 
                    className="rounded-2xl border overflow-hidden"
                    style={{ 
                      backgroundColor: theme.cardBg,
                      borderColor: theme.border
                    }}
                  >
                    <table className="w-full text-sm">
                      <tbody>
                        {conseils.concepts_a_etudier.map((c, i) => (
                          <tr 
                            key={i} 
                            className="border-b last:border-b-0"
                            style={{ borderColor: isFuturistic ? 'rgba(0, 245, 255, 0.1)' : '#F0EBE4' }}
                          >
                            <td className="py-3 px-5 font-semibold w-2/5" style={{ color: isFuturistic ? '#fff' : theme.textPrimary }}>{c.concept}</td>
                            <td className="py-3 px-5" style={{ color: isFuturistic ? 'rgba(255,255,255,0.6)' : '#555' }}>{c.pourquoi}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* E — Resources */}
              {conseils?.ressources?.length > 0 && (
                <section className="mb-8">
                  <p 
                    className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4"
                    style={{ 
                      color: isFuturistic ? 'rgba(0, 245, 255, 0.7)' : '#888',
                      fontFamily: isFuturistic ? theme.fontPrimary : 'inherit'
                    }}
                  >
                    E — Ressources recommandées
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {conseils.ressources.map((r, i) => (
                      <div 
                        key={i} 
                        className="p-5 rounded-2xl"
                        style={{ 
                          backgroundColor: theme.cardBg,
                          border: `1px solid ${theme.border}`
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">📚</span>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: isFuturistic ? '#fff' : theme.textPrimary }}>{r.titre}</p>
                            {r.auteur && <p className="text-xs mt-0.5" style={{ color: isFuturistic ? 'rgba(255,255,255,0.5)' : '#888' }}>{r.auteur}</p>}
                            {r.pourquoi && <p className="text-xs mt-2 leading-relaxed" style={{ color: isFuturistic ? 'rgba(255,255,255,0.6)' : '#666' }}>{r.pourquoi}</p>}
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

      {/* Floating Chatbot */}
      <FloatingChatbot user={user} sessionData={session?.session_data} />
      
      {/* Animations */}
      <style>{`
        @keyframes pulse-shadow {
          0%, 100% {
            box-shadow: 0 0 25px rgba(201, 100, 66, 0.5), 0 0 50px rgba(201, 100, 66, 0.2), 0 4px 20px rgba(0,0,0,0.1);
          }
          50% {
            box-shadow: 0 0 45px rgba(201, 100, 66, 0.8), 0 0 80px rgba(201, 100, 66, 0.4), 0 6px 30px rgba(0,0,0,0.15);
          }
        }
        
        .pulse-card {
          animation: pulse-shadow 2s ease-in-out infinite;
        }
        
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
