import { useState, useRef } from 'react';
import doctorClaudeImg from '../../assets/doctor-claude.jpg';

const TESTS = [
  {
    id: '4-registres',
    icon: '📖',
    name: '4 Registres',
    subtitle: 'Audit complet',
    color: '#00f5ff',
    scientificColor: '#C96442',
    bg: 'rgba(0, 245, 255, 0.05)',
    border: 'rgba(0, 245, 255, 0.2)',
    desc: 'Cartographie complète de tes 4 registres cognitifs — le test d\'entrée pour identifier tes zones à travailler.',
    detail: '20 questions libres pour évaluer Reptilien, Instinctif, Émotionnel et Rationnel. Idéal pour une première approche.',
    features: ['20 questions · 15-20 min', 'Analyse par sous-dimension', 'PDF personnalisé', '3 priorités actionnables'],
    refs: 'MacLean · Damasio · Goleman · Kahneman',
  },
  {
    id: 'instinctif',
    icon: '🫀',
    name: 'Instinctif',
    subtitle: 'Corps & Intuition',
    color: '#ff00ff',
    scientificColor: '#C96442',
    bg: 'rgba(255, 0, 255, 0.05)',
    border: 'rgba(255, 0, 255, 0.2)',
    desc: 'Explore ta connexion corps-esprit — signaux somatiques, ancrage, intuition physiologique.',
    detail: 'Approfondissement du registre instinctif. Analyse de ta capacité à écouter les marqueurs somatiques de Damasio.',
    features: ['12 questions · 10-12 min', 'Marqueurs somatiques', 'Ancrage émotionnel', 'Plan de régulation'],
    refs: 'Damasio · Levine · Porges',
  },
  {
    id: 'emotionnel',
    icon: '💛',
    name: 'Émotionnel',
    subtitle: 'Régulation & Liens',
    color: '#e6a817',
    scientificColor: '#D4A03D',
    bg: 'rgba(230, 168, 23, 0.05)',
    border: 'rgba(230, 168, 23, 0.2)',
    desc: 'Cartographie ta conscience émotionnelle — identification, régulation, patterns relationnels.',
    detail: 'Deep-dive sur le registre émotionnel. Évalue ta capacité à identifier, nommer et réguler tes émotions.',
    features: ['15 questions · 12-15 min', 'Intelligence émotionnelle', 'Styles d\'attachement', 'Stratégies de régulation'],
    refs: 'Goleman · Barrett · Bowlby',
  },
  {
    id: 'mental',
    icon: '🧠',
    name: 'Mental',
    subtitle: 'Structure & Décision',
    color: '#2980b9',
    scientificColor: '#2472a4',
    bg: 'rgba(41, 128, 185, 0.05)',
    border: 'rgba(41, 128, 185, 0.2)',
    desc: 'Analyse ta cognition consciente — structuration, planification, biais, prise de décision.',
    detail: 'Exploration du registre rationnel. Évalue ta maîtrise du Système 2 de Kahneman et ton auto-efficacité.',
    features: ['15 questions · 12-15 min', 'Biais cognitifs', 'Prise de décision', 'Plan d\'action structuré'],
    refs: 'Kahneman · Bandura · Stanovich',
  },
];

const REGISTERS = [
  {
    icon: '🦎',
    name: 'Reptilien',
    color: '#00ff88',
    scientificColor: '#C96442',
    desc: 'Besoins de base, sécurité physique, routines corporelles',
    refs: 'Porges · MacLean',
  },
  {
    icon: '🫀',
    name: 'Instinctif',
    color: '#ff00ff',
    scientificColor: '#C96442',
    desc: 'Signaux du corps, intuition, ancrage somatique',
    refs: 'Damasio · Levine',
  },
  {
    icon: '💛',
    name: 'Émotionnel',
    color: '#e6a817',
    scientificColor: '#D4A03D',
    desc: 'Conscience émotionnelle, régulation, liens aux autres',
    refs: 'Goleman · Bowlby · Barrett',
  },
  {
    icon: '🧠',
    name: 'Rationnel',
    color: '#00f5ff',
    scientificColor: '#2472a4',
    desc: 'Structuration, planification, décision consciente',
    refs: 'Kahneman · Bandura',
  },
];

const THEME_STYLES = {
  futuristic: {
    bg: 'bg-[#0a0a0f]',
    text: 'text-gray-200',
    heading: 'text-white',
    accent: '#00f5ff',
    font: "font-['Orbitron']",
    button: 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black',
  },
  scientific: {
    bg: 'bg-[#FDF8F3]',
    text: 'text-[#3D2914]',
    heading: 'text-[#3D2914]',
    accent: '#C96442',
    font: "font-['EB_Garamond']",
    button: 'border-[#C96442] text-[#C96442] hover:bg-[#C96442] hover:text-white',
  },
};

export default function LandingPage({ onStartTest, onSignIn }) {
  const [theme, setTheme] = useState('futuristic');
  const ctaRef = useRef(null);
  const isScientific = theme === 'scientific';
  const styles = THEME_STYLES[theme];

  function toggleTheme() {
    setTheme(prev => prev === 'futuristic' ? 'scientific' : 'futuristic');
  }

  function scrollToTests() {
    ctaRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${isScientific ? 'bg-[#FDF8F3]' : 'bg-[#0a0a0f]'}`}>
      {/* Scanlines overlay for futuristic theme */}
      {!isScientific && (
        <div 
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 245, 255, 0.015) 2px, rgba(0, 245, 255, 0.015) 4px)',
          }}
        />
      )}
      
      {/* Subtle grid background for scientific theme */}
      {isScientific && (
        <div 
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(201, 100, 66, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201, 100, 66, 0.03) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      )}

      {/* NAVBAR */}
      <nav className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-500 ${
        isScientific 
          ? 'bg-[rgba(253,248,243,0.95)] border-[rgba(201,100,66,0.2)]' 
          : 'bg-[rgba(10,10,15,0.9)] border-cyan-900/30'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {isScientific ? (
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white shadow-md border-2 border-[#C96442]/20 flex items-center justify-center">
                <img 
                  src={doctorClaudeImg} 
                  alt="Doctor Claude" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                style={{ 
                  border: '2px solid #00f5ff',
                  color: '#00f5ff',
                  textShadow: '0 0 10px rgba(0, 245, 255, 0.5)',
                  boxShadow: '0 0 20px rgba(0, 245, 255, 0.2), inset 0 0 20px rgba(0, 245, 255, 0.1)',
                }}
              >
                DC
              </div>
            )}
            <div>
              <span className={`font-semibold block text-xl tracking-tight ${isScientific ? 'text-[#3D2914]' : 'text-white'}`}
                style={{ fontFamily: isScientific ? "'EB Garamond', Georgia, serif" : "'Orbitron', sans-serif" }}>
                Re-Boot
              </span>
              <span className={`text-sm ${isScientific ? 'text-[#C96442] italic' : 'text-cyan-400'}`}
                style={{ fontFamily: isScientific ? "'EB Garamond', Georgia, serif" : "'Inter', sans-serif" }}>
                with Doctor Claude
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Les 4 tests', 'Les registres', 'Théorie'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                className={`text-sm font-medium transition-all duration-300 relative group ${
                  isScientific ? 'text-[#3D2914]/80 hover:text-[#C96442]' : 'text-gray-400 hover:text-cyan-400'
                }`}
              >
                {link}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                  isScientific ? 'bg-[#C96442]' : 'bg-cyan-400'
                }`} />
              </a>
            ))}
          </div>

          {/* Right side: Theme Toggle + CTA */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isScientific 
                  ? 'hover:bg-[#C96442]/10 text-[#C96442]' 
                  : 'hover:bg-cyan-400/10 text-cyan-400'
              }`}
              title={`Mode ${isScientific ? 'scientifique' : 'futuriste'} (cliquer pour changer)`}
            >
              {isScientific ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className={`relative py-20 lg:py-28 overflow-hidden ${
        isScientific 
          ? 'bg-[#FDF8F3]'
          : ''
      }`}>
        {/* Futuristic grid overlay */}
        {!isScientific && (
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
                isScientific 
                  ? 'bg-[#C96442]/10 text-[#3D2914]' 
                  : 'bg-cyan-400/10 border border-cyan-400/30 text-cyan-400'
              }`}>
                <span>✦</span>
                <span>Audit cognitif · Propulsé par Claude</span>
              </div>

              {/* Title */}
              <h1 className={`text-4xl lg:text-5xl leading-tight ${isScientific ? 'text-[#3D2914]' : 'text-white'}`}
                style={{ fontFamily: isScientific ? "'EB Garamond', Georgia, serif" : "'Orbitron', sans-serif" }}>
                Comprends comment<br />
                <em className={isScientific ? 'text-[#C96442]' : 'text-cyan-400'}>tu fonctionnes</em><br />
                vraiment.
              </h1>

              {/* Description */}
              <p className={`text-base lg:text-lg leading-relaxed max-w-lg ${
                isScientific ? 'text-[#3D2914]/80' : 'text-gray-400'
              }`}>
                20 questions libres pour cartographier tes 4 registres cognitifs. Claude analyse tes réponses en profondeur et produit un profil personnalisé avec tes priorités d'amélioration.
              </p>

              {/* Features */}
              <div className="space-y-3">
                {[
                  '20 questions libres — pas de cases à cocher ni de notes à donner',
                  'Analyse IA nuancée par sous-dimension',
                  'Résultat PDF avec 3 actions concrètes pour aller mieux',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isScientific ? 'bg-[#C96442]/20' : 'bg-cyan-400/20'
                    }`}>
                      <svg className="w-3 h-3" viewBox="0 0 10 8" fill="none">
                        <path 
                          d="M1 4L3.5 6.5L9 1" 
                          stroke={isScientific ? '#C96442' : '#00f5ff'} 
                          strokeWidth="1.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className={`text-sm ${isScientific ? 'text-[#3D2914]/90' : 'text-gray-300'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={scrollToTests}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    isScientific 
                      ? 'bg-[#C96442] text-white hover:bg-[#B85C3D] shadow-lg hover:shadow-xl' 
                      : 'bg-cyan-400 text-black hover:bg-cyan-300'
                  }`}
                >
                  Découvrir les tests →
                </button>
                <span className={`text-sm ${isScientific ? 'text-[#3D2914]/60' : 'text-gray-500'}`}>
                  ⏱ 10-20 min par test
                </span>
              </div>
            </div>

            {/* Right Content - Preview Card */}
            <div className="flex justify-center">
              <div className={`p-6 rounded-2xl border backdrop-blur-sm ${
                isScientific 
                  ? 'bg-white/90 border-[#C96442]/20 shadow-xl' 
                  : 'bg-[#0f0f14]/80 border-cyan-400/20'
              }`} style={{ width: '320px' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${
                    isScientific ? 'text-[#3D2914]/40' : 'text-gray-500'
                  }`}>
                    Profil cognitif
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isScientific ? 'bg-[#C96442]/10 text-[#C96442]' : 'bg-cyan-400/10 text-cyan-400'
                  }`}>
                    Exemple
                  </span>
                </div>

                {/* Mini Register Bars */}
                <div className="space-y-3 mb-4">
                  {REGISTERS.map((reg) => (
                    <div key={reg.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{reg.icon}</span>
                          <span className={`text-xs font-medium ${isScientific ? 'text-[#3D2914]' : 'text-gray-300'}`}>
                            {reg.name}
                          </span>
                        </div>
                        <span 
                          className="text-xs font-bold"
                          style={{ color: isScientific ? reg.scientificColor : reg.color }}
                        >
                          {reg.name === 'Reptilien' ? '7.2' : reg.name === 'Instinctif' ? '3.8' : reg.name === 'Émotionnel' ? '4.5' : '6.1'}/10
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${reg.name === 'Reptilien' ? 72 : reg.name === 'Instinctif' ? 38 : reg.name === 'Émotionnel' ? 45 : 61}%`,
                            backgroundColor: isScientific ? reg.scientificColor : reg.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Priority Card */}
                <div className={`p-3 rounded-xl ${
                  isScientific ? 'bg-[#F5EDE4]' : 'bg-cyan-400/5'
                }`}>
                  <div className="flex items-start gap-2">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: isScientific ? '#C96442' : '#ff00ff' }}
                    >
                      <span className="text-white text-xs">✦</span>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${isScientific ? 'text-[#3D2914]' : 'text-gray-200'}`}>
                        Priorité identifiée
                      </p>
                      <p className={`text-xs ${isScientific ? 'text-[#3D2914]/60' : 'text-gray-500'}`}>
                        Registre instinctif — Recommandations personnalisées
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 TESTS SECTION */}
      <section 
        id="les-4-tests"
        ref={ctaRef}
        className={`py-20 lg:py-28 relative ${isScientific ? 'bg-[#FAF7F2]' : 'bg-[#0d0d12]'}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className={`text-sm font-semibold uppercase tracking-widest mb-3 ${
              isScientific ? 'text-[#C96442]' : 'text-cyan-400'
            }`}>
              4 audits cognitifs
            </p>
            <h2 className={`text-3xl lg:text-4xl mb-4 ${isScientific ? 'text-[#3D2914]' : 'text-white'}`}
              style={{ fontFamily: isScientific ? "'EB Garamond', Georgia, serif" : "'Orbitron', sans-serif" }}>
              Choisis ton audit
            </h2>
            <p className={`text-base max-w-2xl mx-auto ${isScientific ? 'text-[#3D2914]/70' : 'text-gray-400'}`}>
              Chaque test explore un aspect spécifique de ton fonctionnement cognitif. 
              Commence par le test des 4 Registres pour une vue d'ensemble.
            </p>
          </div>

          {/* Tests Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {TESTS.map((test) => (
              <div 
                key={test.id}
                className={`group p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                  isScientific 
                    ? 'bg-white/90 border-[#C96442]/10 hover:border-[#C96442]/30 hover:shadow-lg' 
                    : 'bg-[#0f0f14]/80 border-cyan-400/10 hover:border-cyan-400/30'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ 
                        backgroundColor: isScientific 
                          ? `${test.scientificColor}15` 
                          : `${test.color}15`,
                      }}
                    >
                      {test.icon}
                    </div>
                    <div>
                      <h3 className={`font-semibold text-lg ${isScientific ? 'text-[#3D2914]' : 'text-white'}`}>
                        {test.name}
                      </h3>
                      <p className={`text-xs ${isScientific ? 'text-[#C96442]' : 'text-gray-500'}`}>
                        {test.subtitle}
                      </p>
                    </div>
                  </div>
                  <span 
                    className="text-xs px-2 py-1 rounded-full border"
                    style={{ 
                      borderColor: isScientific ? test.scientificColor : test.color,
                      color: isScientific ? test.scientificColor : test.color,
                    }}
                  >
                    {test.features[0].split('·')[0].trim()}
                  </span>
                </div>

                {/* Description */}
                <p className={`text-sm mb-3 ${isScientific ? 'text-[#3D2914]/80' : 'text-gray-300'}`}>
                  {test.desc}
                </p>
                <p className={`text-xs mb-4 ${isScientific ? 'text-[#3D2914]/60' : 'text-gray-500'}`}>
                  {test.detail}
                </p>

                {/* Features */}
                <ul className="space-y-1 mb-4">
                  {test.features.slice(1).map((feature, i) => (
                    <li 
                      key={i} 
                      className={`text-xs flex items-center gap-2 ${
                        isScientific ? 'text-[#3D2914]/70' : 'text-gray-400'
                      }`}
                    >
                      <span style={{ color: isScientific ? test.scientificColor : test.color }}>→</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200/10">
                  <span className={`text-xs ${isScientific ? 'text-[#3D2914]/50' : 'text-gray-600'}`}>
                    {test.refs}
                  </span>
                  <button
                    onClick={() => onStartTest(test.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isScientific 
                        ? 'border-2 hover:bg-[#C96442] hover:text-white hover:border-[#C96442]' 
                        : 'border hover:bg-cyan-400 hover:text-black hover:border-cyan-400'
                    }`}
                    style={{ 
                      borderColor: isScientific ? test.scientificColor : test.color,
                      color: isScientific ? test.scientificColor : test.color,
                    }}
                  >
                    Commencer →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 REGISTRES SECTION */}
      <section 
        id="les-registres" 
        className={`py-20 lg:py-28 ${
          isScientific 
            ? 'bg-gradient-to-br from-[#C96442] to-[#B85C3D]' 
            : 'bg-gradient-to-br from-[#050508] via-[#0a0a0f] to-[#050508]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className={`text-sm font-semibold uppercase tracking-widest mb-3 ${
              isScientific ? 'text-white/70' : 'text-cyan-400'
            }`}>
              Le modèle Re-Boot
            </p>
            <h2 className={`text-3xl lg:text-4xl mb-4 ${isScientific ? 'text-white' : 'text-white'}`}
              style={{ fontFamily: isScientific ? "'EB Garamond', Georgia, serif" : "'Orbitron', sans-serif" }}>
              Les 4 registres cognitifs
            </h2>
            <p className={`text-base max-w-3xl mx-auto leading-relaxed ${
              isScientific ? 'text-white/80' : 'text-gray-400'
            }`}>
              Inspiré du cerveau triunique de Paul MacLean et enrichi par les neurosciences contemporaines, 
              le modèle Re-Boot distingue 4 registres qui coexistent et interagissent en permanence dans ton fonctionnement.
            </p>
          </div>

          {/* Registers Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REGISTERS.map((reg) => (
              <div 
                key={reg.name}
                className={`p-5 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                  isScientific 
                    ? 'bg-white/10 border-white/20 hover:bg-white/15' 
                    : 'bg-[#0f0f14]/80 border-cyan-400/10 hover:border-cyan-400/30'
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                  style={{ 
                    backgroundColor: isScientific 
                      ? `${reg.scientificColor}30` 
                      : `${reg.color}20`,
                  }}
                >
                  {reg.icon}
                </div>
                <h3 className={`font-semibold mb-2 ${isScientific ? 'text-white' : 'text-white'}`}>
                  {reg.name}
                </h3>
                <p className={`text-xs leading-relaxed mb-3 ${
                  isScientific ? 'text-white/70' : 'text-gray-400'
                }`}>
                  {reg.desc}
                </p>
                <p className={`text-xs font-medium ${
                  isScientific ? 'text-white/50' : 'text-gray-600'
                }`}>
                  {reg.refs}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THEORY SECTION */}
      <section 
        id="theorie" 
        className={`py-20 lg:py-28 ${isScientific ? 'bg-[#FDF8F3]' : 'bg-[#0a0a0f]'}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <p className={`text-sm font-semibold uppercase tracking-widest mb-3 ${
                isScientific ? 'text-[#C96442]' : 'text-cyan-400'
              }`}>
                Fondements scientifiques
              </p>
              <h2 className={`text-3xl lg:text-4xl mb-6 ${isScientific ? 'text-[#3D2914]' : 'text-white'}`}
                style={{ fontFamily: isScientific ? "'EB Garamond', Georgia, serif" : "'Orbitron', sans-serif" }}>
                Pas un test de personnalité.<br />
                <em className={isScientific ? 'text-[#C96442]' : 'text-cyan-400'}>Un audit cognitif.</em>
              </h2>
              <div className={`space-y-4 text-sm leading-relaxed ${
                isScientific ? 'text-[#3D2914]/80' : 'text-gray-400'
              }`}>
                <p>
                  Re-Boot s'appuie sur 9 références en neurosciences et psychologie cognitive — 
                  de la théorie polyvagale de Porges aux marqueurs somatiques de Damasio, 
                  en passant par les systèmes 1 & 2 de Kahneman.
                </p>
                <p>
                  Chaque réponse est analysée sur 3 sous-dimensions. Le résultat n'est pas un type 
                  ("tu es INTJ") mais une <strong className={isScientific ? 'text-[#3D2914]' : 'text-white'}>cartographie fonctionnelle</strong> : 
                  dans quels registres tu es solide, où tu es limité, et quoi faire en priorité.
                </p>
              </div>
            </div>

            {/* Right Content - References */}
            <div className={`p-6 rounded-2xl border ${
              isScientific 
                ? 'bg-[#C96442]/5 border-[#C96442]/20' 
                : 'bg-[#0f0f14]/80 border-cyan-400/10'
            }`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-4 ${
                isScientific ? 'text-[#C96442]/60' : 'text-gray-500'
              }`}>
                Références théoriques
              </p>
              <div className="space-y-2">
                {[
                  { author: 'Paul MacLean', work: 'Cerveau triunique', tag: 'Général' },
                  { author: 'Antonio Damasio', work: 'Marqueurs somatiques', tag: 'Instinctif' },
                  { author: 'Stephen Porges', work: 'Théorie polyvagale', tag: 'Reptilien' },
                  { author: 'Peter Levine', work: 'Somatic Experiencing', tag: 'Instinctif' },
                  { author: 'Daniel Goleman', work: 'Intelligence émotionnelle', tag: 'Émotionnel' },
                  { author: 'Lisa Feldman Barrett', work: 'Construction des émotions', tag: 'Émotionnel' },
                  { author: 'Daniel Kahneman', work: 'Systèmes 1 & 2', tag: 'Rationnel' },
                  { author: 'Albert Bandura', work: 'Auto-efficacité', tag: 'Rationnel' },
                ].map((ref) => (
                  <div 
                    key={ref.author}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${
                      isScientific 
                        ? 'bg-white/50' 
                        : 'bg-[#0a0a0f]/50'
                    }`}
                  >
                    <div>
                      <span className={`text-xs font-semibold ${isScientific ? 'text-[#3D2914]' : 'text-gray-300'}`}>
                        {ref.author}
                      </span>
                      <span className={`text-xs ml-2 ${isScientific ? 'text-[#3D2914]/60' : 'text-gray-500'}`}>
                        — {ref.work}
                      </span>
                    </div>
                    <span className={`text-xs ${isScientific ? 'text-[#C96442]' : 'text-gray-600'}`}>
                      {ref.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOCTOR CLAUDE SECTION */}
      <section className={`py-20 lg:py-28 ${
        isScientific 
          ? 'bg-gradient-to-br from-[#F5EDE4] to-[#FDF8F3]' 
          : 'bg-gradient-to-br from-[#050508] to-[#0a0a0f]'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Doctor Claude Card */}
            <div className={`p-6 rounded-2xl border ${
              isScientific 
                ? 'bg-white border-[#C96442]/10 shadow-lg' 
                : 'bg-[#0f0f14]/80 border-cyan-400/20'
            }`}>
              <div className="flex items-center gap-4 mb-4">
                {isScientific ? (
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-white shadow-md border-2 border-[#C96442]/20">
                    <img 
                      src={doctorClaudeImg} 
                      alt="Doctor Claude" 
                      className="w-full h-full object-cover"
                      style={{ transform: 'scale(1.6)', transformOrigin: 'center 55%' }}
                    />
                  </div>
                ) : (
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0"
                    style={{ 
                      border: '2px solid #00f5ff',
                      color: '#00f5ff',
                      textShadow: '0 0 20px rgba(0, 245, 255, 0.5)',
                      boxShadow: '0 0 30px rgba(0, 245, 255, 0.2), inset 0 0 30px rgba(0, 245, 255, 0.1)',
                    }}
                  >
                    DC
                  </div>
                )}
                <div>
                  <p className={`font-bold text-base ${isScientific ? 'text-[#3D2914]' : 'text-white'}`}>
                    Doctor Claude
                  </p>
                  <p className={`text-xs mt-0.5 ${isScientific ? 'text-gray-400' : 'text-gray-500'}`}>
                    claude-sonnet-4-6 · Anthropic
                  </p>
                </div>
              </div>
              <div className={`rounded-xl p-4 mb-4 ${
                isScientific ? 'bg-[#F5EDE4]' : 'bg-cyan-400/5'
              }`}>
                <p className={`text-xs leading-relaxed italic ${
                  isScientific ? 'text-[#3D2914]/70' : 'text-gray-400'
                }`}>
                  "Registre Instinctif : 3.8/10. Tes réponses révèlent une déconnexion marquée du corps. 
                  Les signaux de fatigue sont perçus mais ignorés. Priorité : 20 min de marche sans écrans 
                  chaque matin pour réactiver la boucle corps-esprit."
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-400">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className={isScientific ? 'text-gray-400' : 'text-gray-500'}>
                  Analyse en direct · Aucune donnée stockée
                </span>
              </div>
            </div>

            {/* Right - Description */}
            <div>
              <p className={`text-sm font-semibold uppercase tracking-widest mb-3 ${
                isScientific ? 'text-[#C96442]' : 'text-cyan-400'
              }`}>
                Propulsé par l'IA
              </p>
              <h2 className={`text-3xl lg:text-4xl mb-6 ${isScientific ? 'text-[#3D2914]' : 'text-white'}`}
                style={{ fontFamily: isScientific ? "'EB Garamond', Georgia, serif" : "'Orbitron', sans-serif" }}>
                Meet Doctor Claude —<br />
                <em className={isScientific ? 'text-[#C96442]' : 'text-cyan-400'}>ton analyste cognitif.</em>
              </h2>
              <div className={`space-y-4 text-sm leading-relaxed ${
                isScientific ? 'text-[#3D2914]/80' : 'text-gray-400'
              }`}>
                <p>
                  Re-Boot est construit sur <strong className={isScientific ? 'text-[#3D2914]' : 'text-white'}>Claude</strong>, 
                  le modèle d'IA d'Anthropic.
                </p>
                <p>
                  Contrairement à un questionnaire avec des cases à cocher ou des notes à donner, 
                  ici tu réponds librement. Claude lit entre les lignes, détecte les nuances et 
                  produit une analyse qui ressemble à ce qu'un bon coach formulerait après une longue conversation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={`py-20 lg:py-28 ${
        isScientific 
          ? 'bg-[#C96442]' 
          : 'bg-gradient-to-br from-[#0a0a0f] to-[#050508]'
      }`}>
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className={`text-sm font-semibold uppercase tracking-widest mb-3 ${
            isScientific ? 'text-white/70' : 'text-cyan-400'
          }`}>
            Prêt à démarrer ?
          </p>
          <h2 className={`text-3xl lg:text-4xl mb-4 ${isScientific ? 'text-white' : 'text-white'}`}
            style={{ fontFamily: isScientific ? "'EB Garamond', Georgia, serif" : "'Orbitron', sans-serif" }}>
            Lance ton audit
          </h2>
          <p className={`text-base mb-8 ${isScientific ? 'text-white/80' : 'text-gray-400'}`}>
            10-20 min · Résultat personnalisé · Gratuit
          </p>

          <div className={`p-6 rounded-2xl ${isScientific ? 'bg-white' : 'bg-[#0f0f14]/80 border border-cyan-400/20'}`}>
            {/* Google Sign In */}
            <button
              onClick={onSignIn}
              className={`w-full flex items-center justify-center gap-3 border rounded-xl py-3 text-sm font-semibold transition-colors mb-4 ${
                isScientific 
                  ? 'border-gray-200 text-[#3D2914] hover:bg-gray-50' 
                  : 'border-gray-700 text-gray-300 hover:bg-gray-800'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continuer avec Google
            </button>

            <p className={`text-xs ${isScientific ? 'text-gray-400' : 'text-gray-600'}`}>
              En continuant, tu acceptes nos conditions d'utilisation et notre politique de confidentialité.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-8 ${
        isScientific 
          ? 'bg-[#3D2914]' 
          : 'bg-[#050508]'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {isScientific ? (
              <div className="w-6 h-6 rounded-lg overflow-hidden flex-shrink-0 border border-[#C96442]/30">
                <img 
                  src={doctorClaudeImg} 
                  alt="Doctor Claude" 
                  className="w-full h-full object-cover"
                  style={{ transform: 'scale(1.6)', transformOrigin: 'center 55%' }}
                />
              </div>
            ) : (
              <div 
                className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ 
                  border: '1px solid #00f5ff',
                  color: '#00f5ff',
                }}
              >
                DC
              </div>
            )}
            <span className="text-xs font-semibold text-white">Re-Boot</span>
            <span className={`text-xs ${isScientific ? 'text-[#C96442]' : 'text-cyan-400'}`}>
              with Doctor Claude
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Propulsé par Claude (Anthropic) · Données sécurisées par Supabase
          </p>
        </div>
      </footer>
    </div>
  );
}
