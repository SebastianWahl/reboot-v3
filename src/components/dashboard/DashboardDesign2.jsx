// Dashboard Design Proposition #2: Grille Dynamique Bento
// Style Bento avec des blocs de tailles variées, couleurs par registre, visuellement dense mais organisé

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import doctorClaude from '../../assets/doctor-claude.jpg';

const REGISTRES = [
  { id: 'reptilien', label: 'Reptilien', icon: '🦎', color: '#e07b39', gradient: 'from-orange-400 to-orange-600' },
  { id: 'instinctif', label: 'Instinctif', icon: '🫀', color: '#c0392b', gradient: 'from-red-400 to-red-600' },
  { id: 'emotionnel', label: 'Émotionnel', icon: '💛', color: '#e6a817', gradient: 'from-yellow-400 to-yellow-600' },
  { id: 'rationnel', label: 'Rationnel', icon: '🧠', color: '#2980b9', gradient: 'from-blue-400 to-blue-600' },
];

export default function DashboardDesign2({ user, onSignOut, onStartAudit }) {
  const [session, setSession] = useState(null);
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
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
  
  const completedTests = allSessions.filter(s => s.session_data?.status === 'completed').length;
  const hasInstinctif = allSessions.some(s => s.test_type === 'instinctif');
  const hasEmotionnel = allSessions.some(s => s.test_type === 'emotionnel');
  const hasMental = allSessions.some(s => s.test_type === 'mental');

  // Trouver le registre dominant
  const dominantReg = session ? REGISTRES.reduce((best, r) => 
    (registres[r.id]?.score ?? 0) > (registres[best.id]?.score ?? 0) ? r : best
  , REGISTRES[0]) : null;

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#1A1209' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white/20">
              <img src={doctorClaude} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-white font-semibold" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>Re-Boot</h1>
              <p className="text-xs text-white/50">Dashboard Bento</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60">{user?.email}</span>
            <button onClick={onSignOut} className="text-sm text-white/40 hover:text-white transition-colors">
              Déconnexion
            </button>
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-4 grid-rows-3 gap-4 h-[calc(100vh-140px)] min-h-[600px]">
          
          {/* Score Global - Grande carte centrale */}
          <div 
            className="col-span-2 row-span-2 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group"
            style={{ backgroundColor: '#2A2019' }}
            onMouseEnter={() => setHoveredCard('score')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 400 400">
                {values.map((val, idx) => {
                  const angle = (idx / 4) * 2 * Math.PI - Math.PI / 2;
                  const r = 80 + (val / 25) * 60;
                  const x = 200 + Math.cos(angle) * r;
                  const y = 200 + Math.sin(angle) * r;
                  return (
                    <circle key={idx} cx={x} cy={y} r={6} fill={REGISTRES[idx].color} />
                  );
                })}
                <polygon 
                  points={values.map((val, idx) => {
                    const angle = (idx / 4) * 2 * Math.PI - Math.PI / 2;
                    const r = 80 + (val / 25) * 60;
                    const x = 200 + Math.cos(angle) * r;
                    const y = 200 + Math.sin(angle) * r;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="rgba(201, 100, 66, 0.2)"
                  stroke="#C96442"
                  strokeWidth="2"
                />
              </svg>
            </div>
            
            <div className="relative z-10">
              <p className="text-white/50 text-sm mb-2">Score Global</p>
              <p className="text-6xl font-bold text-white">{session ? totalScore : '—'}</p>
              <p className="text-white/40 text-sm">/100</p>
            </div>
            
            {session && dominantReg && (
              <div className="relative z-10">
                <p className="text-white/50 text-sm mb-1">Profil dominant</p>
                <p className="text-xl font-medium" style={{ color: dominantReg.color }}>
                  {dominantReg.icon} {dominantReg.label}
                </p>
                <p className="text-white/60 text-sm mt-1">
                  {registres[dominantReg.id]?.score?.toFixed(1) || 0}/25
                </p>
              </div>
            )}

            {!session && (
              <button
                onClick={() => onStartAudit('4-registres')}
                className="relative z-10 mt-4 px-6 py-3 rounded-xl font-medium transition-all hover:scale-105"
                style={{ backgroundColor: '#C96442', color: '#fff' }}
              >
                Commencer l'audit →
              </button>
            )}
          </div>

          {/* 4 Petites cartes - Un registre chacune */}
          {REGISTRES.map((reg, idx) => {
            const score = registres[reg.id]?.score ?? 0;
            const pct = (score / 25) * 100;
            return (
              <div
                key={reg.id}
                className="rounded-2xl p-5 flex flex-col justify-between transition-transform hover:scale-105 cursor-pointer"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{reg.icon}</span>
                  <span className="text-xs text-white/60 font-medium">{reg.label}</span>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{score.toFixed(1)}</p>
                  <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: reg.color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Tests complémentaires */}
          <div 
            className="col-span-2 rounded-2xl p-5 overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
          >
            <p className="text-white/50 text-sm mb-3">Tests complémentaires</p>
            <div className="flex gap-3">
              {!hasInstinctif && session && (
                <button
                  onClick={() => onStartAudit('instinctif')}
                  className="flex-1 p-4 rounded-xl text-left transition-all hover:scale-105"
                  style={{ backgroundColor: '#c0392b' }}
                >
                  <span className="text-2xl block mb-2">🫀</span>
                  <p className="text-white text-sm font-medium">Instinctif</p>
                  <p className="text-white/70 text-xs">12 dimensions</p>
                </button>
              )}
              
              {hasInstinctif && !hasEmotionnel && (
                <button
                  onClick={() => onStartAudit('emotionnel')}
                  className="flex-1 p-4 rounded-xl text-left transition-all hover:scale-105"
                  style={{ backgroundColor: '#e6a817' }}
                >
                  <span className="text-2xl block mb-2">💞</span>
                  <p className="text-white text-sm font-medium">Émotionnel</p>
                  <p className="text-white/70 text-xs">12 dimensions</p>
                </button>
              )}

              {hasEmotionnel && !hasMental && (
                <button
                  onClick={() => onStartAudit('mental')}
                  className="flex-1 p-4 rounded-xl text-left transition-all hover:scale-105"
                  style={{ backgroundColor: '#2980b9' }}
                >
                  <span className="text-2xl block mb-2">🧠</span>
                  <p className="text-white text-sm font-medium">Mental</p>
                  <p className="text-white/70 text-xs">12 dimensions</p>
                </button>
              )}

              {hasMental && (
                <div className="flex-1 p-4 rounded-xl text-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <span className="text-2xl block mb-2">🎉</span>
                  <p className="text-white text-sm font-medium">Parcours complet !</p>
                </div>
              )}

              <div className="flex-1 p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <p className="text-white/60 text-sm">Tests complétés</p>
                <p className="text-white text-2xl font-bold">{completedTests}</p>
              </div>
            </div>
          </div>

          {/* Historique / Résumé */}
          <div 
            className="col-span-2 rounded-2xl p-5 overflow-y-auto"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
          >
            <p className="text-white/50 text-sm mb-3">Derniers audits</p>
            <div className="space-y-2">
              {allSessions.slice(0, 5).map((s, idx) => (
                <div 
                  key={s.session_id}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {s.test_type === 'instinctif' ? '🫀' : 
                       s.test_type === 'emotionnel' ? '💞' :
                       s.test_type === 'mental' ? '🧠' : '🧭'}
                    </span>
                    <div>
                      <p className="text-white text-sm">
                        {s.test_type === 'instinctif' ? 'Audit Instinctif' :
                         s.test_type === 'emotionnel' ? 'Audit Émotionnel' :
                         s.test_type === 'mental' ? 'Audit Mental' : 'Audit 4 Registres'}
                      </p>
                      <p className="text-white/40 text-xs">
                        {new Date(s.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <span className="text-white/60 text-sm">Voir →</span>
                </div>
              ))}
              {allSessions.length === 0 && (
                <p className="text-white/40 text-sm text-center py-4">Aucun audit complété</p>
              )}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="col-span-2 grid grid-cols-2 gap-3">
            <button className="p-4 rounded-xl text-left hover:opacity-80 transition-opacity" style={{ backgroundColor: 'rgba(201, 100, 66, 0.2)', border: '1px solid rgba(201, 100, 66, 0.3)' }}>
              <span className="text-2xl block mb-2">📊</span>
              <p className="text-white text-sm">Rapport détaillé</p>
            </button>
            <button className="p-4 rounded-xl text-left hover:opacity-80 transition-opacity" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <span className="text-2xl block mb-2">🎯</span>
              <p className="text-white text-sm">Pratiques quotidiennes</p>
            </button>
            <button className="p-4 rounded-xl text-left hover:opacity-80 transition-opacity" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <span className="text-2xl block mb-2">📚</span>
              <p className="text-white text-sm">Ressources recommandées</p>
            </button>
            <button className="p-4 rounded-xl text-left hover:opacity-80 transition-opacity" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <span className="text-2xl block mb-2">💬</span>
              <p className="text-white text-sm">Parler à Doctor Claude</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
