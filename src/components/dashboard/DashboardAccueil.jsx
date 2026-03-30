// src/components/dashboard/DashboardAccueil.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import RadarChart from '../ui/RadarChart';

const TEST_REGISTRY = [
  { id: 'audit-4-registres', label: 'Audit des 4 registres' },
  { id: 'test-sommeil',      label: 'Test du sommeil'       },
  { id: 'test-stress',       label: 'Test du stress'        },
  { id: 'test-relations',    label: 'Test des relations'    },
];

const REGISTRES = [
  { id: 'reptilien',  label: 'Reptilien'  },
  { id: 'instinctif', label: 'Instinctif' },
  { id: 'emotionnel', label: 'Émotionnel' },
  { id: 'rationnel',  label: 'Rationnel'  },
];

const TILES = [
  {
    id: 'doctor',
    label: 'Doctor Claude',
    desc: 'Parle à Doctor Claude pour faire un audit ou explorer tes résultats.',
    cta: 'Ouvrir',
  },
  {
    id: 'profile',
    label: 'Profil cognitif',
    desc: 'Tes scores, dynamiques, priorités et pratiques consolidés.',
    cta: 'Voir',
  },
  {
    id: 'audits',
    label: 'Mes audits',
    desc: 'Retrouve l\'historique détaillé de tous tes audits passés.',
    cta: 'Voir',
  },
  {
    id: 'science',
    label: 'Fondements scientifiques',
    desc: 'La science derrière les 4 registres cognitifs.',
    cta: 'Lire',
  },
];

function scoreColor(score) {
  const pct = score / 25;
  if (pct >= 0.72) return '#4a7c59';
  if (pct >= 0.48) return '#C96442';
  return '#c0392b';
}

export default function DashboardAccueil({ user, onNavigate, onStartAudit }) {
  const [session, setSession] = useState(null);
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    
    // Récupérer toutes les sessions pour voir la progression
    supabase
      .from('reboot_sessions')
      .select('session_id, date, session_data, test_type')
      .order('date', { ascending: false })
      .then(({ data }) => {
        const sessions = data || [];
        setAllSessions(sessions);
        
        // Dernière session (audit 4 registres ou test complémentaire)
        const mainSession = sessions.find(s => 
          s.test_type === '4-registres' || !s.test_type
        ) || sessions[0];
        
        setSession(mainSession || null);
        setLoading(false);
        
        // Vérifier si un nouveau test a été débloqué récemment
        const instinctifSession = sessions.find(s => s.test_type === 'instinctif');
        const has4Registres = sessions.some(s => s.test_type === '4-registres' || !s.test_type);
        
        if (has4Registres && !instinctifSession && !sessionStorage.getItem('toast-instinctif-shown')) {
          // Afficher le toast une seule fois
          setShowToast(true);
          sessionStorage.setItem('toast-instinctif-shown', 'true');
        }
      })
      .catch(() => setLoading(false));
  }, [user]);

  const completedTests = allSessions.filter(s => s.session_data?.status === 'completed').length;
  const hasInstinctifAvailable = () => {
    const has4Registres = allSessions.some(s => s.test_type === '4-registres' || !s.test_type);
    const hasInstinctifDone = allSessions.some(s => s.test_type === 'instinctif');
    return has4Registres && !hasInstinctifDone;
  };
  
  const hasEmotionnelAvailable = () => {
    const hasInstinctifDone = allSessions.some(s => s.test_type === 'instinctif');
    const hasEmotionnelDone = allSessions.some(s => s.test_type === 'emotionnel');
    return hasInstinctifDone && !hasEmotionnelDone;
  };
  
  const hasMentalAvailable = () => {
    const hasEmotionnelDone = allSessions.some(s => s.test_type === 'emotionnel');
    const hasMentalDone = allSessions.some(s => s.test_type === 'mental');
    return hasEmotionnelDone && !hasMentalDone;
  };

  const completionPct = Math.round((completedTests / TEST_REGISTRY.length) * 100);

  const registres = session?.session_data?.registres ?? {};
  const diagnostic = session?.session_data?.diagnostic ?? {};
  const values = REGISTRES.map(r => registres[r.id]?.score ?? 0);
  const labels = REGISTRES.map(r => r.label);
  const totalScore = values.reduce((a, b) => a + b, 0);
  const dominant = session
    ? REGISTRES.reduce((best, r) =>
        (registres[r.id]?.score ?? 0) > (registres[best.id]?.score ?? 0) ? r : best
      , REGISTRES[0])
    : null;

  const dateFormatted = session
    ? new Date(session.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8">
        <div className="w-4 h-4 border-2 border-[#e0ddd6] border-t-[#C96442] rounded-full animate-spin" />
        <span className="text-sm text-[#aaa]">Chargement…</span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">

      {/* ── Toast notification : Nouveau test débloqué ── */}
      {showToast && hasInstinctifAvailable() && (
        <div 
          className="bg-[#C96442] text-white rounded-2xl p-4 flex items-center justify-between animate-pulse"
          style={{ boxShadow: '0 4px 20px rgba(201, 100, 66, 0.3)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-semibold">Nouveau test débloqué !</p>
              <p className="text-sm opacity-90">L'Audit Instinctif & Corporel est maintenant disponible.</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setShowToast(false);
              onStartAudit('instinctif');
            }}
            className="bg-white text-[#C96442] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            Commencer →
          </button>
          <button 
            onClick={() => setShowToast(false)}
            className="text-white opacity-70 hover:opacity-100 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Row 1 : Stat cards ── */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Score global',
            value: session ? `${totalScore.toFixed(0)}` : '—',
            sub: session ? '/100' : '',
            color: '#C96442',
          },
          {
            label: 'Profil complété',
            value: `${completionPct}%`,
            sub: `${completedTests} / ${TEST_REGISTRY.length} tests`,
            color: '#C96442',
          },
          {
            label: 'Registre dominant',
            value: dominant?.label ?? '—',
            sub: dominant ? `${(registres[dominant.id]?.score ?? 0).toFixed(1)} / 25` : '',
            color: '#1a1209',
          },
          {
            label: 'Dernière session',
            value: dateFormatted,
            sub: '',
            color: '#1a1209',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border px-5 py-4"
            style={{ borderColor: '#e8e0d8' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[#aaa] mb-2">
              {stat.label}
            </p>
            <p className="text-xl font-bold leading-tight" style={{ color: stat.color }}>
              {stat.value}
              {stat.sub && (
                <span className="text-xs font-normal text-[#bbb] ml-1">{stat.sub}</span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* ── Row 2 : Radar + Résumé cognitif ── */}
      {session ? (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e0d8' }}>
          <div className="p-6 grid grid-cols-2 gap-8 items-start">

            {/* Left : radar + score bars */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#aaa] mb-4">
                Snapshot cognitif
              </p>
              <RadarChart labels={labels} values={values} />
              <div className="space-y-2 mt-4">
                {REGISTRES.map((r) => {
                  const score = registres[r.id]?.score ?? 0;
                  const pct = Math.round((score / 25) * 100);
                  const color = scoreColor(score);
                  return (
                    <div key={r.id} className="flex items-center gap-3">
                      <span className="text-xs text-[#888] w-20 shrink-0">{r.label}</span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f0ebe4' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                      <span className="text-xs font-bold w-8 text-right tabular-nums" style={{ color }}>
                        {score.toFixed(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right : résumé + completeness */}
            <div className="space-y-5">
              {diagnostic.resume_court && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#aaa] mb-3">
                    Qui je suis
                  </p>
                  <div className="border-l-2 pl-4" style={{ borderColor: '#C96442' }}>
                    <p className="text-sm text-[#444] leading-relaxed italic">
                      {diagnostic.resume_court}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#aaa] mb-3">
                  Progression du profil
                </p>
                <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ backgroundColor: '#e8e0d8' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${completionPct}%`, backgroundColor: '#C96442' }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {TEST_REGISTRY.map((test, i) => {
                    const done = i < completedTests;
                    return (
                      <span
                        key={test.id}
                        className="text-xs px-2.5 py-1 rounded-lg border font-medium"
                        style={done
                          ? { borderColor: '#C96442', color: '#C96442', backgroundColor: 'white' }
                          : { borderColor: '#e8e0d8', color: '#bbb', backgroundColor: 'white' }
                        }
                      >
                        {done ? '✓' : '○'} {test.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* No session yet — simplified completeness block */
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e8e0d8' }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#aaa] mb-3">
            Progression du profil
          </p>
          <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ backgroundColor: '#e8e0d8' }}>
            <div className="h-full rounded-full" style={{ width: '0%', backgroundColor: '#C96442' }} />
          </div>
          <p className="text-sm text-[#888] mb-4">
            Ton profil cognitif est vide. Commence ton premier test pour le voir apparaître ici.
          </p>
          <button
            onClick={() => onNavigate('doctor')}
            className="text-xs font-semibold px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: '#C96442' }}
          >
            Démarrer l'audit des 4 registres
          </button>
        </div>
      )}

      {/* ── Row 3 : Navigation tiles ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Tuile conditionnelle : Audit Instinctif débloqué */}
        {hasInstinctifAvailable() && (
          <button
            onClick={() => onStartAudit('instinctif')}
            className="bg-[#C96442] rounded-2xl border p-5 text-left flex items-start justify-between gap-4 hover:bg-[#b55338] transition-colors group"
            style={{ borderColor: '#C96442' }}
          >
            <div>
              <p className="text-sm font-semibold mb-1 text-white">
                🫀 Audit Instinctif & Corporel
              </p>
              <p className="text-xs text-white opacity-90 leading-relaxed">
                Débloqué ! Évalue 12 dimensions de ta relation au corps.
              </p>
            </div>
            <span className="text-xs font-semibold shrink-0 mt-0.5 text-white">
              Commencer →
            </span>
          </button>
        )}
        
        {/* Tuile conditionnelle : Audit Émotionnel débloqué */}
        {hasEmotionnelAvailable() && (
          <button
            onClick={() => onStartAudit('emotionnel')}
            className="bg-[#C96442] rounded-2xl border p-5 text-left flex items-start justify-between gap-4 hover:bg-[#b55338] transition-colors group"
            style={{ borderColor: '#C96442' }}
          >
            <div>
              <p className="text-sm font-semibold mb-1 text-white">
                💞 Audit Émotionnel & Relationnel
              </p>
              <p className="text-xs text-white opacity-90 leading-relaxed">
                Débloqué ! Explore tes patterns relationnels.
              </p>
            </div>
            <span className="text-xs font-semibold shrink-0 mt-0.5 text-white">
              Commencer →
            </span>
          </button>
        )}
        
        {/* Tuile conditionnelle : Audit Mental débloqué */}
        {hasMentalAvailable() && (
          <button
            onClick={() => onStartAudit('mental')}
            className="bg-[#C96442] rounded-2xl border p-5 text-left flex items-start justify-between gap-4 hover:bg-[#b55338] transition-colors group"
            style={{ borderColor: '#C96442' }}
          >
            <div>
              <p className="text-sm font-semibold mb-1 text-white">
                🧠 Audit Mental & Cognitif
              </p>
              <p className="text-xs text-white opacity-90 leading-relaxed">
                Débloqué ! Explore tes processus de pensée.
              </p>
            </div>
            <span className="text-xs font-semibold shrink-0 mt-0.5 text-white">
              Commencer →
            </span>
          </button>
        )}
        
        {TILES.map((tile) => (
          <button
            key={tile.id}
            onClick={() => onNavigate(tile.id)}
            className="bg-white rounded-2xl border p-5 text-left flex items-start justify-between gap-4 hover:border-[#C96442] transition-colors group"
            style={{ borderColor: '#e8e0d8' }}
          >
            <div>
              <p
                className="text-sm font-semibold mb-1 group-hover:text-[#C96442] transition-colors"
                style={{ color: '#1a1209' }}
              >
                {tile.label}
              </p>
              <p className="text-xs text-[#888] leading-relaxed">{tile.desc}</p>
            </div>
            <span
              className="text-xs font-semibold shrink-0 mt-0.5 group-hover:text-[#C96442] transition-colors"
              style={{ color: '#bbb' }}
            >
              {tile.cta} →
            </span>
          </button>
        ))}
        
        {/* Tuile démo : Rapport de Sebastian */}
        <button
          onClick={() => onStartAudit('demo-report')}
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-dashed border-orange-300 p-5 text-left flex items-start justify-between gap-4 hover:border-orange-500 transition-colors group"
        >
          <div>
            <p className="text-sm font-semibold mb-1 text-orange-800 group-hover:text-orange-900">
              🧪 Voir un exemple de rapport
            </p>
            <p className="text-xs text-orange-600 leading-relaxed">
              Rapport généré avec les vraies réponses de Sebastian (28/100)
            </p>
          </div>
          <span className="text-xs font-semibold shrink-0 mt-0.5 text-orange-400 group-hover:text-orange-600">
            Découvrir →
          </span>
        </button>
      </div>

    </div>
  );
}
