// Dashboard Design Proposition #1: Épuré & Organique
// Minimaliste, beaucoup d'espace, formes organiques, palette terre éclaircie

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import doctorClaude from '../../assets/doctor-claude.jpg';

const REGISTRES = [
  { id: 'reptilien', label: 'Reptilien', icon: '🦎', color: '#e07b39', bg: 'rgba(224, 123, 57, 0.1)' },
  { id: 'instinctif', label: 'Instinctif', icon: '🫀', color: '#c0392b', bg: 'rgba(192, 57, 43, 0.1)' },
  { id: 'emotionnel', label: 'Émotionnel', icon: '💛', color: '#e6a817', bg: 'rgba(230, 168, 23, 0.1)' },
  { id: 'rationnel', label: 'Rationnel', icon: '🧠', color: '#2980b9', bg: 'rgba(41, 128, 185, 0.1)' },
];

const NAV_ITEMS = [
  { id: 'home', label: 'Accueil', icon: '🏠' },
  { id: 'audits', label: 'Mes audits', icon: '📊' },
  { id: 'profile', label: 'Profil', icon: '👤' },
  { id: 'settings', label: 'Paramètres', icon: '⚙️' },
];

export default function DashboardDesign1({ user, onSignOut, onStartAudit }) {
  const [activeTab, setActiveTab] = useState('home');
  const [session, setSession] = useState(null);
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const avgScore = values.length > 0 ? (totalScore / values.length) : 0;

  const completedTests = allSessions.filter(s => s.session_data?.status === 'completed').length;
  const hasInstinctif = allSessions.some(s => s.test_type === 'instinctif');
  const hasEmotionnel = allSessions.some(s => s.test_type === 'emotionnel');
  const hasMental = allSessions.some(s => s.test_type === 'mental');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDFBF7' }}>
      {/* Header flottant */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div 
          className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3 rounded-full"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(232, 224, 213, 0.5)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden" style={{ border: '2px solid #E8E0D5' }}>
              <img src={doctorClaude} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="font-semibold text-sm" style={{ color: '#1A1209', fontFamily: "'EB Garamond', Georgia, serif" }}>
              Re-Boot
            </span>
          </div>
          
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="px-4 py-2 rounded-full text-sm transition-all"
                style={{
                  backgroundColor: activeTab === item.id ? '#1A1209' : 'transparent',
                  color: activeTab === item.id ? '#fff' : '#666'
                }}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">{user?.email}</span>
            <button 
              onClick={onSignOut}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-28 pb-12 px-6 max-w-6xl mx-auto">
        {activeTab === 'home' && (
          <div className="space-y-8">
            
            {/* Hero section - Score global circulaire */}
            <section className="text-center py-12">
              <h1 className="text-4xl mb-4" style={{ color: '#1A1209', fontFamily: "'EB Garamond', Georgia, serif" }}>
                Ton profil cognitif
              </h1>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Explore tes 4 registres de fonctionnement et découvre ton potentiel de développement.
              </p>
              
              {session ? (
                <div className="inline-flex flex-col items-center">
                  <div 
                    className="w-40 h-40 rounded-full flex items-center justify-center mb-4"
                    style={{ 
                      background: `conic-gradient(from 0deg, #e07b39 0%, #e07b39 ${values[0]/25*25}%, #c0392b ${values[0]/25*25}%, #c0392b ${(values[0]+values[1])/25*25}%, #e6a817 ${(values[0]+values[1])/25*25}%, #e6a817 ${(values[0]+values[1]+values[2])/25*25}%, #2980b9 ${(values[0]+values[1]+values[2])/25*25}%, #2980b9 100%)`,
                      padding: '8px'
                    }}
                  >
                    <div 
                      className="w-full h-full rounded-full flex flex-col items-center justify-center"
                      style={{ backgroundColor: '#FDFBF7' }}
                    >
                      <span className="text-4xl font-bold" style={{ color: '#1A1209' }}>{totalScore}</span>
                      <span className="text-xs text-gray-400">/100</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Score global</p>
                </div>
              ) : (
                <button
                  onClick={() => onStartAudit('4-registres')}
                  className="px-8 py-4 rounded-full text-white font-medium"
                  style={{ backgroundColor: '#C96442' }}
                >
                  Commencer mon premier audit →
                </button>
              )}
            </section>

            {/* 4 Registres - Cards organiques */}
            {session && (
              <section className="grid grid-cols-4 gap-4">
                {REGISTRES.map((reg, idx) => {
                  const score = registres[reg.id]?.score ?? 0;
                  const pct = (score / 25) * 100;
                  return (
                    <div
                      key={reg.id}
                      className="p-5 rounded-3xl transition-transform hover:scale-[1.02]"
                      style={{ backgroundColor: reg.bg, border: '1px solid rgba(0,0,0,0.05)' }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{reg.icon}</span>
                        <span className="text-sm font-medium" style={{ color: reg.color }}>{reg.label}</span>
                      </div>
                      <div className="flex items-end gap-1 mb-2">
                        <span className="text-3xl font-bold" style={{ color: '#1A1209' }}>{score.toFixed(1)}</span>
                        <span className="text-sm text-gray-400 mb-1">/25</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                        <div 
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${pct}%`, backgroundColor: reg.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </section>
            )}

            {/* Tests débloqués */}
            <section className="grid grid-cols-3 gap-4">
              {!hasInstinctif && session && (
                <button
                  onClick={() => onStartAudit('instinctif')}
                  className="p-6 rounded-3xl text-left transition-all hover:shadow-lg group"
                  style={{ backgroundColor: '#C96442', color: '#fff' }}
                >
                  <span className="text-3xl mb-3 block">🫀</span>
                  <p className="font-semibold mb-1">Audit Instinctif</p>
                  <p className="text-sm opacity-80">12 dimensions de ta relation au corps</p>
                  <span className="text-sm mt-3 inline-block group-hover:translate-x-1 transition-transform">Commencer →</span>
                </button>
              )}
              
              {hasInstinctif && !hasEmotionnel && (
                <button
                  onClick={() => onStartAudit('emotionnel')}
                  className="p-6 rounded-3xl text-left transition-all hover:shadow-lg group"
                  style={{ backgroundColor: '#C8890A', color: '#fff' }}
                >
                  <span className="text-3xl mb-3 block">💞</span>
                  <p className="font-semibold mb-1">Audit Émotionnel</p>
                  <p className="text-sm opacity-80">Explore tes patterns relationnels</p>
                  <span className="text-sm mt-3 inline-block group-hover:translate-x-1 transition-transform">Commencer →</span>
                </button>
              )}

              {hasEmotionnel && !hasMental && (
                <button
                  onClick={() => onStartAudit('mental')}
                  className="p-6 rounded-3xl text-left transition-all hover:shadow-lg group"
                  style={{ backgroundColor: '#2980B9', color: '#fff' }}
                >
                  <span className="text-3xl mb-3 block">🧠</span>
                  <p className="font-semibold mb-1">Audit Mental</p>
                  <p className="text-sm opacity-80">Tes processus de pensée</p>
                  <span className="text-sm mt-3 inline-block group-hover:translate-x-1 transition-transform">Commencer →</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('audits')}
                className="p-6 rounded-3xl text-left transition-all hover:shadow-lg border"
                style={{ backgroundColor: '#fff', borderColor: '#E8E0D5' }}
              >
                <span className="text-3xl mb-3 block">📊</span>
                <p className="font-semibold mb-1 text-gray-900">Mes audits</p>
                <p className="text-sm text-gray-500">{completedTests} tests complétés</p>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className="p-6 rounded-3xl text-left transition-all hover:shadow-lg border"
                style={{ backgroundColor: '#fff', borderColor: '#E8E0D5' }}
              >
                <span className="text-3xl mb-3 block">👤</span>
                <p className="font-semibold mb-1 text-gray-900">Profil complet</p>
                <p className="text-sm text-gray-500">Analyse détaillée et recommandations</p>
              </button>
            </section>
          </div>
        )}

        {activeTab === 'audits' && (
          <div className="text-center py-20 text-gray-400">
            Section "Mes audits" - Intégrer DashboardAudits ici
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="text-center py-20 text-gray-400">
            Section "Profil" - Intégrer DashboardProfile ici
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-md mx-auto py-12">
            <h2 className="text-2xl mb-6" style={{ color: '#1A1209', fontFamily: "'EB Garamond', Georgia, serif" }}>
              Paramètres
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border" style={{ backgroundColor: '#fff', borderColor: '#E8E0D5' }}>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <button 
                onClick={onSignOut}
                className="w-full py-3 rounded-xl text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
