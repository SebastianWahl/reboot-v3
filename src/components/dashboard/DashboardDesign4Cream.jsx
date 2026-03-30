// Dashboard Design Proposition #4b: Cards Immersives Magazine - VARIANTE FOND CRÈME
// Même design que Design 4 mais avec fond crème chaleureux au lieu de fond sombre

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import doctorClaude from '../../assets/doctor-claude.jpg';
import FloatingChatbot from '../ui/FloatingChatbot';
import { PREVIEW_DATA } from '../../lib/previewData';
import { DEMO_INSTINCTIF_SESSION, DEMO_EMOTIONNEL_SESSION, DEMO_MENTAL_SESSION } from '../../lib/demoSessions';
import DiagnosticScreen from '../screens/DiagnosticScreen';
import SecondaryTestReport from './SecondaryTestReport';
import DashboardProfile from './DashboardProfile';

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

export default function DashboardDesign4Cream({ user, onSignOut, onStartAudit, onViewSession, onToggleTheme, isFuturistic, activeTab, setActiveTab }) {
  const [session, setSession] = useState(null);
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedAudit, setSelectedAudit] = useState(null);

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
      !s.isDemo // Exclure les données de démo
    );
    return found ? 'completed' : 'available';
  };

  const isTestLocked = (testId, index) => {
    if (index === 0) return false;
    const prevTest = TEST_CARDS[index - 1];
    return getTestStatus(prevTest.id) !== 'completed';
  };

  // Déterminer la prochaine étape recommandée
  const getNextStep = () => {
    // Compter précisément les audits complétés (sans les données de démo)
    const completedAudits = allSessions.filter(s => s.session_data?.status === 'completed' && !s.isDemo).length;
    const totalAudits = 4; // 4 Registres + Instinctif + Émotionnel + Mental
    
    // Si aucun audit ou moins de 4, commencer par les 4 registres
    if (completedAudits === 0) {
      return {
        testId: '4-registres',
        title: 'Audit des 4 Registres',
        subtitle: 'Première étape obligatoire',
        description: 'Commence par cet audit complet pour obtenir une vue d\'ensemble de ton profil cognitif. Doctor Claude analysera tes résultats et t\'orientera vers les audits spécifiques les plus pertinents.',
        icon: '🧭',
        color: '#C96442',
        gradient: 'linear-gradient(135deg, #FF6B6B 0%, #C96442 100%)',
        action: 'Commencer',
        isNewUser: true
      };
    }
    
    // Vérifier spécifiquement chaque test
    const has4Registres = getTestStatus('4-registres') === 'completed';
    const hasInstinctif = getTestStatus('instinctif') === 'completed';
    const hasEmotionnel = getTestStatus('emotionnel') === 'completed';
    const hasMental = getTestStatus('mental') === 'completed';
    
    // Si on a les 4 registres mais pas les 3 spécifiques
    if (has4Registres && (!hasInstinctif || !hasEmotionnel || !hasMental)) {
      const missingCount = [!hasInstinctif, !hasEmotionnel, !hasMental].filter(Boolean).length;
      
      // Déterminer le premier test manquant
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
        'Instinctif': { color: '#c0392b', gradient: 'linear-gradient(135deg, #FF8E8E 0%, #c0392b 100%)', icon: '🫀' },
        'Émotionnel': { color: '#e6a817', gradient: 'linear-gradient(135deg, #FFD966 0%, #e6a817 100%)', icon: '💞' },
        'Mental': { color: '#2980b9', gradient: 'linear-gradient(135deg, #6BB5FF 0%, #2980b9 100%)', icon: '🧠' }
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
    
    // Tous les audits sont complétés
    return null;
  };

  const nextStep = getNextStep();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      
      {/* Header avec effet glassmorphism sur fond crème */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{ 
          background: 'rgba(250, 247, 242, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(232, 224, 213, 0.5)'
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-[#E8E0D5]">
              <img src={doctorClaude} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="font-semibold text-lg" style={{ color: '#1A1209', fontFamily: "'EB Garamond', Georgia, serif" }}>
              Re-Boot
            </span>
          </div>
          
          <nav className="flex items-center gap-1 bg-white/60 rounded-full p-1 shadow-sm">
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
                  backgroundColor: activeTab === tab.id ? '#C96442' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : '#666'
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Toggle vers Futuriste - style Cyberpunk avec fond noir */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all mx-4 hover:shadow-lg"
            style={{
              backgroundColor: '#0a0a0f',
              border: '1px solid rgba(0, 245, 255, 0.5)',
              color: '#00f5ff',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '12px',
              boxShadow: '0 0 15px rgba(0, 245, 255, 0.3)'
            }}
            title="Passer en mode futuriste"
          >
            <span className="hidden lg:inline">Futuriste</span>
            <span className="lg:hidden">Fut.</span>
          </button>

          {/* Bouton de déconnexion dans le header */}
          <button 
            onClick={onSignOut}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ 
              backgroundColor: 'rgba(201, 100, 66, 0.1)',
              border: '1px solid rgba(201, 100, 66, 0.3)',
              color: '#C96442'
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

      {/* Styles pour l'animation pulse - couleur terracotta intensifiée */}
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
      `}</style>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        
        {activeTab === 'overview' && (
          <>
            {/* Hero Section - 3 colonnes: Titre / Prochaine étape / Progression */}
            <section className="mb-8">
              <div className="grid grid-cols-3 gap-6 items-start">
                {/* Colonne 1: Titre et description */}
                <div>
                  <p className="text-[#C96442] text-sm font-medium mb-2 tracking-wider uppercase">
                    Dashboard Personnel
                  </p>
                  <h1 className="text-4xl mb-4 leading-tight" style={{ color: '#1A1209', fontFamily: "'EB Garamond', Georgia, serif" }}>
                    Cartographie ton <br/>
                    <span style={{ color: '#C96442' }}>fonctionnement</span> cognitif
                  </h1>
                  <p className="text-gray-600 text-base">
                    4 audits progressifs pour comprendre et optimiser tes 4 registres de fonctionnement.
                  </p>
                </div>

                {/* Colonne 2: Ma prochaine étape */}
                <div>
                  {nextStep && (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-lg">🎯</span>
                        <h2 className="text-lg font-semibold" style={{ color: '#1A1209', fontFamily: "'EB Garamond', Georgia, serif" }}>
                          Ma prochaine étape
                        </h2>
                      </div>
                      
                      <div 
                        className="pulse-card"
                        style={{ 
                          backgroundImage: nextStep.gradient,
                          borderRadius: '16px',
                          padding: '16px',
                          cursor: 'pointer',
                          height: '160px'
                        }}
                        onClick={() => onStartAudit(nextStep.testId)}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          {/* Icon */}
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
                          
                          {/* Content */}
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
                    <h2 className="text-lg font-semibold" style={{ color: '#1A1209', fontFamily: "'EB Garamond', Georgia, serif" }}>
                      Ma progression
                    </h2>
                  </div>
                  
                  <div 
                    style={{ 
                      backgroundColor: 'white',
                      borderRadius: '16px',
                      padding: '16px',
                      border: '1px solid #E8E0D5',
                      height: '160px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center flex-1">
                        <p className="text-3xl font-bold" style={{ color: '#1A1209' }}>{allSessions.filter(s => s.session_data?.status === 'completed' && !s.isDemo).length}</p>
                        <p className="text-xs text-gray-500">Audits complétés</p>
                      </div>
                      <div className="w-px h-10 bg-[#E8E0D5]" />
                      <div className="text-center flex-1">
                        <p className="text-3xl font-bold" style={{ color: '#1A1209' }}>
                          {Math.round((allSessions.filter(s => s.session_data?.status === 'completed' && !s.isDemo).length / 4) * 100)}%
                        </p>
                        <p className="text-xs text-gray-500">Progression globale</p>
                      </div>
                    </div>
                    
                    {/* Barre de progression */}
                    <div className="w-full h-2 bg-[#F0EBE4] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.round((allSessions.filter(s => s.session_data?.status === 'completed' && !s.isDemo).length / 4) * 100)}%`,
                          backgroundColor: '#C96442'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section Résultats - Affichée si on a des données (réelles ou preview) */}
            {(session || !allSessions.length) && Object.keys(registres).length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xl">📈</span>
                  <h2 className="text-2xl font-semibold" style={{ color: '#1A1209', fontFamily: "'EB Garamond', Georgia, serif" }}>
                    Mes résultats
                  </h2>
                  <span className="text-sm text-gray-500">— Profil des 4 registres</span>
                </div>
                
                <div className="grid grid-cols-2 gap-8 items-center">
                  {/* Graphique visuel */}
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
                          background: 'linear-gradient(135deg, #C96442, #e07b39)',
                          boxShadow: '0 0 60px rgba(201, 100, 66, 0.3)'
                        }}
                      >
                        <span className="text-4xl">🧭</span>
                      </div>
                    </div>
                  </div>

                  {/* Scores détaillés */}
                  <div className="space-y-4">
                    {session && (
                      <div className="bg-white rounded-2xl p-5 border border-[#E8E0D5]">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-lg" style={{ color: '#1A1209' }}>
                            Score Global
                          </h3>
                          <span className="text-3xl font-bold" style={{ color: '#C96442' }}>
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
                                    <span className="text-sm font-medium" style={{ color: '#1A1209' }}>{reg.label}</span>
                                    <span className="text-sm font-bold" style={{ color: reg.color }}>
                                      {score.toFixed(1)}/25
                                    </span>
                                  </div>
                                  <div className="w-full h-2 bg-[#F0EBE4] rounded-full overflow-hidden">
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
              </section>
            )}

            {/* Section Cards d'audits */}
            <section>
              <h2 className="text-2xl mb-6" style={{ color: '#1A1209', fontFamily: "'EB Garamond', Georgia, serif" }}>
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
                        isLocked ? 'opacity-60' : 'cursor-pointer'
                      }`}
                      style={{ 
                        height: '280px',
                        background: isLocked ? '#E8E0D5' : test.gradient
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
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-black/20 text-gray-700">
                                🔒
                              </span>
                            )}
                          </div>
                          <p className={`text-xs font-medium mb-1 ${isLocked ? 'text-gray-600' : 'text-white/80'}`}>{test.subtitle}</p>
                          <h3 className={`text-lg font-bold mb-1 ${isLocked ? 'text-gray-800' : 'text-white'}`}>{test.title}</h3>
                          <p className={`text-xs leading-relaxed line-clamp-3 ${isLocked ? 'text-gray-600' : 'text-white/90'}`}>
                            {test.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className={`flex items-center gap-2 text-xs ${isLocked ? 'text-gray-500' : 'text-white/80'}`}>
                            <span>⏱️ {test.duration}</span>
                          </div>
                          <div 
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                              isHovered ? 'bg-white scale-110' : isLocked ? 'bg-gray-400/20' : 'bg-white/20'
                            }`}
                          >
                            <span className={isHovered ? 'text-gray-900' : isLocked ? 'text-gray-600' : 'text-white'}>→</span>
                          </div>
                        </div>
                      </div>

                      {/* Decorative element */}
                      <div 
                        className="absolute -bottom-12 -right-12 text-7xl opacity-20 transition-transform duration-500"
                        style={{ transform: isHovered ? 'scale(1.2) rotate(10deg)' : 'scale(1)' }}
                      >
                        {test.image}
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
                  background: 'linear-gradient(135deg, rgba(201, 100, 66, 0.08) 0%, rgba(224, 123, 57, 0.08) 100%)',
                  border: '1px solid rgba(201, 100, 66, 0.3)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: 'rgba(201, 100, 66, 0.15)',
                      border: '2px solid #C96442'
                    }}
                  >
                    <img src={doctorClaude} alt="Doctor Claude" className="w-14 h-14 rounded-full object-cover" />
                  </div>
                  <div>
                    <h3 
                      className="text-xl font-bold mb-1"
                      style={{ 
                        color: '#1A1209',
                        fontFamily: "'EB Garamond', Georgia, serif"
                      }}
                    >
                      Discuter avec Doctor Claude
                    </h3>
                    <p style={{ color: 'rgba(26, 18, 9, 0.6)' }}>
                      Pose tes questions sur tes résultats, demande des clarifications ou des conseils personnalisés.
                    </p>
                  </div>
                </div>
                <button
                  className="px-6 py-3 rounded-full font-medium transition-all hover:opacity-90"
                  style={{ 
                    backgroundColor: '#C96442',
                    color: '#fff',
                    fontFamily: "'EB Garamond', Georgia, serif"
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
            '4-registres': { label: 'Audit des 4 Registres', icon: '🧭', color: '#C96442', desc: 'Cartographie tes 4 modes de fonctionnement : besoins primaires (Reptilien), intuition corporelle (Instinctif), vie émotionnelle (Émotionnel) et pensée analytique (Rationnel).', max: 100 },
            instinctif:    { label: 'Audit Instinctif',      icon: '🫀', color: '#c0392b', desc: 'Explore ta relation au corps : conscience sensorielle, écoute de l\'intuition, ancrage somatique et capacité à faire confiance à tes ressentis physiques.', max: 100 },
            emotionnel:    { label: 'Audit Émotionnel',      icon: '💞', color: '#e6a817', desc: 'Évalue ton intelligence émotionnelle : vocabulaire des émotions, régulation, empathie, authenticité dans les relations et gestion des conflits.', max: 100 },
            mental:        { label: 'Audit Mental',          icon: '🧠', color: '#2980b9', desc: 'Analyse tes processus cognitifs : concentration, mémoire de travail, créativité, prise de décision et capacité à observer ta propre pensée.', max: 100 },
          };
          const REGISTRES_ABBR = [
            { id: 'reptilien',  abbr: 'REP', color: '#e07b39' },
            { id: 'instinctif', abbr: 'INS', color: '#c0392b' },
            { id: 'emotionnel', abbr: 'EMO', color: '#e6a817' },
            { id: 'rationnel',  abbr: 'RAT', color: '#2980b9' },
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

              {/* Colonne gauche — liste compacte */}
              <div className="w-72 flex-shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
                {allSessions.length === 0 && (
                  <p className="text-[10px] text-[#bbb] mb-1 px-1">Données de démo</p>
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
                        backgroundColor: isActive ? '#fff' : 'transparent',
                        border: isActive ? '1px solid #C96442' : '1px solid #E8E0D5',
                        boxShadow: isActive ? '0 2px 12px rgba(201,100,66,0.1)' : 'none',
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{meta.icon}</span>
                          <span className="text-xs font-semibold text-[#1A1209]">{meta.label}</span>
                        </div>
                        {total > 0 && (
                          <span className="text-sm font-bold tabular-nums" style={{ color: meta.color }}>
                            {total.toFixed(0)}<span className="text-[10px] font-normal text-[#bbb]">/{meta.max}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#aaa] mb-1">{dateStr}</p>
                      <p className="text-[10px] text-[#999] mb-2 leading-relaxed">{meta.desc}</p>
                      
                      {/* Barres de progression pour les 4 registres */}
                      {testType === '4-registres' && total > 0 && scores.length > 0 && (
                        <div className="grid grid-cols-4 gap-1">
                          {REGISTRES_ABBR.map((r, i) => (
                            <div key={r.id}>
                              <div className="h-1 bg-[#F0EBE4] rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${Math.round((scores[i] / 25) * 100)}%`, backgroundColor: r.color }} />
                              </div>
                              <p className="text-[8px] text-[#ccc] mt-0.5 text-center">{r.abbr}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Barre de progression simple pour les autres tests */}
                      {testType !== '4-registres' && total > 0 && (
                        <div>
                          <div className="h-1 bg-[#F0EBE4] rounded-full overflow-hidden">
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

              {/* Colonne droite — liseuse rapport */}
              <div className="flex-1 rounded-2xl overflow-hidden border" style={{ borderColor: '#E8E0D5' }}>
                {activeAudit ? (
                  <div className="h-full overflow-y-auto" style={{ backgroundColor: '#f0ede6' }}>
                    {(() => {
                      // Trouver le type de test
                      const currentSession = displaySessions.find(s => s.session_data === activeAudit || s === activeAudit);
                      const testType = currentSession?.test_type || 
                                      (activeAudit.registres ? '4-registres' : 'instinctif');
                      
                      console.log('Active audit:', activeAudit);
                      console.log('Test type:', testType);
                      console.log('Current session:', currentSession);
                      
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
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-[#bbb] text-sm">Sélectionne un audit pour voir le rapport</p>
                  </div>
                )}
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
                <h2 className="text-3xl" style={{ color: '#1A1209', fontFamily: "'EB Garamond', Georgia, serif" }}>
                  Recommandations personnalisées
                </h2>
                {isDemo && (
                  <span className="text-xs px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] text-[#999]">
                    Données de démo — complète un audit pour voir ton profil réel
                  </span>
                )}
              </div>

              {/* A — Pratiques quotidiennes */}
              {pq && (
                <section className="mb-8">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-4">A — Prescription quotidienne</p>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { key: 'matin', label: 'Matin', icon: '🌅' },
                      { key: 'journee', label: 'Journée', icon: '☀️' },
                      { key: 'soir', label: 'Soir', icon: '🌙' },
                    ].map(({ key, label, icon }) => {
                      const items = Array.isArray(pq) ? [] : (pq[key] || []);
                      return (
                        <div key={key} className="p-5 rounded-2xl bg-white border" style={{ borderColor: '#E8E0D5' }}>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">{icon}</span>
                            <p className="text-xs font-bold tracking-widest uppercase text-[#C96442]">{label}</p>
                          </div>
                          <ul className="space-y-2">
                            {items.map((item, i) => (
                              <li key={i} className="text-sm text-[#444] flex items-start gap-2">
                                <span className="text-[#C96442] mt-0.5 shrink-0">›</span>
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
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-4">B — Axes prioritaires</p>
                  {diagData.priorites_intro && (
                    <p className="text-sm text-[#555] leading-relaxed mb-4 italic">{diagData.priorites_intro}</p>
                  )}
                  <div className="space-y-4">
                    {diagData.priorites.map((p, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-white border" style={{ borderColor: '#E8E0D5' }}>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-bold text-[#1A1209] uppercase tracking-wide">
                            {p.registre}
                            {p.but && <span className="font-normal normal-case tracking-normal text-[#888] ml-2">— {p.but}</span>}
                          </p>
                          <span className="text-xs text-[#C96442] font-bold">{p.score?.toFixed(1)}/25</span>
                        </div>
                        <ul className="space-y-1.5">
                          {p.actions?.map((action, j) => (
                            <li key={j} className="text-sm text-[#444] flex items-start gap-2">
                              <span className="text-[#C96442] mt-0.5 shrink-0">›</span>
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
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-4">C — Conseils généraux</p>
                  <div className="p-5 rounded-2xl bg-white border" style={{ borderColor: '#E8E0D5' }}>
                    <ul className="space-y-3">
                      {conseils.conseils_generaux.map((c, i) => (
                        <li key={i} className="text-sm text-[#333] flex items-start gap-3">
                          <span className="text-[#C96442] font-bold mt-0.5 shrink-0">›</span>
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
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-4">D — Concepts à explorer</p>
                  <div className="rounded-2xl bg-white border overflow-hidden" style={{ borderColor: '#E8E0D5' }}>
                    <table className="w-full text-sm">
                      <tbody>
                        {conseils.concepts_a_etudier.map((c, i) => (
                          <tr key={i} className="border-b last:border-b-0" style={{ borderColor: '#F0EBE4' }}>
                            <td className="py-3 px-5 font-semibold text-[#1A1209] w-2/5">{c.concept}</td>
                            <td className="py-3 px-5 text-[#555]">{c.pourquoi}</td>
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
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-4">E — Ressources recommandées</p>
                  <div className="grid grid-cols-2 gap-4">
                    {conseils.ressources.map((r, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-white border" style={{ borderColor: '#E8E0D5' }}>
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">📚</span>
                          <div>
                            <p className="text-sm font-semibold text-[#1A1209]">{r.titre}</p>
                            {r.auteur && <p className="text-xs text-[#888] mt-0.5">{r.auteur}</p>}
                            {r.pourquoi && <p className="text-xs text-[#666] mt-2 leading-relaxed">{r.pourquoi}</p>}
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

        {activeTab === 'profile' && (
          <DashboardProfile
            user={user}
            onStartAudit={() => onStartAudit('4-registres')}
            fallbackData={PREVIEW_DATA}
            allSessions={allSessions}
          />
        )}
      </main>

      {/* Chatbot flottant Doctor Claude */}
      <FloatingChatbot 
        user={user}
        sessionData={session?.session_data}
      />
    </div>
  );
}
