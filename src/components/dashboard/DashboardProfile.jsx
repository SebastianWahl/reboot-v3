// src/components/dashboard/DashboardProfile.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import RadarChart from '../ui/RadarChart';
import { DEMO_INSTINCTIF_SESSION, DEMO_EMOTIONNEL_SESSION, DEMO_MENTAL_SESSION } from '../../lib/demoSessions';

const REGISTRES_4 = [
  { id: 'reptilien',  label: 'Reptilien',  icon: '🦎', color: '#e07b39' },
  { id: 'instinctif', label: 'Instinctif', icon: '🫀', color: '#c0392b' },
  { id: 'emotionnel', label: 'Émotionnel', icon: '💛', color: '#e6a817' },
  { id: 'rationnel',  label: 'Rationnel',  icon: '🧠', color: '#2980b9' },
];

const ALL_TESTS = [
  { id: '4-registres', label: 'Audit des 4 Registres', icon: '🧭', color: '#C96442', max: 100 },
  { id: 'instinctif',  label: 'Audit Instinctif',      icon: '🫀', color: '#c0392b', max: 60  },
  { id: 'emotionnel',  label: 'Audit Émotionnel',      icon: '💞', color: '#e6a817', max: 60  },
  { id: 'mental',      label: 'Audit Mental',          icon: '🧠', color: '#2980b9', max: 60  },
];

const OTHER_TESTS_META = {
  instinctif: { label: 'Instinctif', icon: '🫀', color: '#c0392b', max: 60, demo: DEMO_INSTINCTIF_SESSION },
  emotionnel:  { label: 'Émotionnel', icon: '💞', color: '#e6a817', max: 60, demo: DEMO_EMOTIONNEL_SESSION },
  mental:      { label: 'Mental',     icon: '🧠', color: '#2980b9', max: 60, demo: DEMO_MENTAL_SESSION   },
};

function getDiagnostic(sess) {
  return sess?.session_data?.diagnostic ?? sess?.diagnostic ?? null;
}

function scoreColor4R(score) {
  const pct = score / 25;
  if (pct >= 0.72) return '#4a7c59';
  if (pct >= 0.48) return '#C96442';
  return '#c0392b';
}

// ─── KPI Tile ───────────────────────────────────────────────────────────────
function KpiTileBars({ test, score, niveau, isDemo }) {
  const pct = Math.round((score / test.max) * 100);
  return (
    <div
      className="bg-white rounded-2xl border p-5 flex flex-col gap-3"
      style={{ borderColor: '#e8e0d8' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{test.icon}</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#aaa]">
            {test.label}
          </span>
        </div>
        {isDemo && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] text-[#ccc]">
            démo
          </span>
        )}
      </div>
      <div>
        <span className="text-3xl font-bold" style={{ color: '#1a1209' }}>{pct}</span>
        <span className="text-sm text-[#bbb] ml-0.5">%</span>
      </div>
      <div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f0ebe4' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: test.color }}
          />
        </div>
        {niveau && (
          <p className="text-[11px] mt-1.5 font-medium" style={{ color: test.color }}>
            {niveau}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── KPI Tile avec Cercle / Dial (Style 2) ───────────────────────────────────
function KpiTileCircles({ test, score, niveau, isDemo }) {
  const pct = Math.round((score / test.max) * 100);
  const circumference = 2 * Math.PI * 32; // r=32
  const strokeDashoffset = circumference - (pct / 100) * circumference;
  
  return (
    <div
      className="bg-white rounded-2xl border p-5 flex flex-col items-center text-center"
      style={{ borderColor: '#e8e0d8' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{test.icon}</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#aaa]">
            {test.label}
          </span>
        </div>
        {isDemo && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] text-[#ccc]">
            démo
          </span>
        )}
      </div>
      
      {/* Cercle / Dial SVG */}
      <div className="relative w-20 h-20 mb-3">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          {/* Cercle de fond */}
          <circle
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke="#f0ebe4"
            strokeWidth="8"
          />
          {/* Cercle de progression */}
          <circle
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke={test.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Score au centre - NORMALISÉ SUR 100 (affichage %) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold" style={{ color: '#1a1209' }}>{pct}</span>
          <span className="text-[10px] text-[#bbb]">%</span>
        </div>
      </div>
      
      {/* Niveau */}
      {niveau && (
        <span 
          className="text-[11px] font-semibold px-3 py-1 rounded-full"
          style={{ 
            color: test.color, 
            backgroundColor: `${test.color}15` 
          }}
        >
          {niveau}
        </span>
      )}
    </div>
  );
}

// ─── Toggle Switch Component ────────────────────────────────────────────────
function StyleToggle({ style, onChange }) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-full border p-1" style={{ borderColor: '#e8e0d8' }}>
      <button
        onClick={() => onChange('bars')}
        className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
        style={{
          backgroundColor: style === 'bars' ? '#C96442' : 'transparent',
          color: style === 'bars' ? '#fff' : '#888'
        }}
      >
        Barres
      </button>
      <button
        onClick={() => onChange('circles')}
        className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
        style={{
          backgroundColor: style === 'circles' ? '#C96442' : 'transparent',
          color: style === 'circles' ? '#fff' : '#888'
        }}
      >
        Cercles
      </button>
    </div>
  );
}

// ─── Compact test detail card (bottom row) ──────────────────────────────────
function TestDetailCard({ meta, session, isDemo }) {
  const diag = getDiagnostic(session);
  const profil = diag?.profil_global;
  if (!profil) return null;

  const topDims = [...(profil.dimensions || [])]
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
  
  // Récupérer les réponses brutes si elles existent
  const reponses = session?.session_data?.reponses || session?.reponses || [];

  return (
    <div className="bg-white rounded-2xl border overflow-hidden flex flex-col h-full" style={{ borderColor: '#e8e0d8' }}>
      {/* Colour band */}
      <div className="h-1 w-full" style={{ backgroundColor: meta.color }} />
      <div className="p-5 flex flex-col gap-4 flex-1">

        {/* Synthèse */}
        {profil.synthese && (
          <p className="text-xs text-[#555] leading-relaxed">{profil.synthese}</p>
        )}

        {/* Dimensions */}
        {topDims.length > 0 && (
          <div className="space-y-2">
            {topDims.map((dim) => {
              const dpct = Math.round((dim.score / dim.max) * 100);
              return (
                <div key={dim.nom} className="flex items-center gap-2">
                  <span className="text-[11px] text-[#888] truncate" style={{ minWidth: 0, flex: '1 1 0' }}>
                    {dim.nom}
                  </span>
                  <div className="w-16 h-1 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: '#f0ebe4' }}>
                    <div className="h-full rounded-full" style={{ width: `${dpct}%`, backgroundColor: meta.color }} />
                  </div>
                  <span className="text-[10px] font-bold tabular-nums flex-shrink-0" style={{ color: meta.color }}>
                    {dim.score}/{dim.max}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Dynamiques — pill tags */}
        {diag?.dynamiques?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1 border-t" style={{ borderColor: '#f0ebe4' }}>
            {diag.dynamiques.slice(0, 3).map((d, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: `${meta.color}14`, color: meta.color }}
              >
                {d.titre}
              </span>
            ))}
          </div>
        )}
        
        {/* Extrait de réponses — montrer un aperçu des réponses brutes */}
        {reponses.length > 0 && (
          <div className="pt-2 border-t" style={{ borderColor: '#f0ebe4' }}>
            <p className="text-[10px] font-semibold text-[#aaa] uppercase tracking-wider mb-2">Extrait des réponses</p>
            <div className="space-y-2 max-h-24 overflow-y-auto">
              {reponses.slice(0, 2).map((rep, idx) => (
                <div key={idx} className="bg-[#FAF7F2] rounded-lg p-2">
                  <p className="text-[9px] text-[#888] italic mb-1 line-clamp-2">"{rep.reponse.substring(0, 120)}..."</p>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-[#aaa] mt-1 italic">{reponses.length} réponses au total</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function DashboardProfile({ user, onStartAudit, fallbackData, allSessions = [] }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kpiStyle, setKpiStyle] = useState('bars'); // 'bars' ou 'circles'

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase
      .from('reboot_sessions')
      .select('session_id, date, session_data')
      .order('date', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        setSession(data?.[0] ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8">
        <div className="w-4 h-4 border-2 border-[#e0ddd6] border-t-[#C96442] rounded-full animate-spin" />
        <span className="text-sm text-[#aaa]">Chargement…</span>
      </div>
    );
  }

  const isDemo = !session?.session_data?.diagnostic?.resume_court && !!fallbackData;

  if (!session && !fallbackData) {
    return (
      <div className="max-w-md">
        <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: '#e8e0d8' }}>
          <p className="text-sm text-[#888] mb-1">Ton profil cognitif est vide pour l'instant.</p>
          <p className="text-xs text-[#bbb] mb-4">Complète ton premier test pour le voir apparaître ici.</p>
          {onStartAudit && (
            <button
              onClick={onStartAudit}
              className="text-xs font-semibold px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: '#C96442' }}
            >
              Démarrer l'audit des 4 registres
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Data ────────────────────────────────────────────────────────────────
  const sessionData = session?.session_data ?? fallbackData;
  const registres   = sessionData?.registres ?? fallbackData?.registres ?? {};
  const diagnostic  = sessionData?.diagnostic?.resume_court
    ? sessionData.diagnostic
    : (fallbackData?.diagnostic ?? {});

  const reg4Values   = REGISTRES_4.map(r => registres[r.id]?.score ?? 0);
  const radarLabels  = REGISTRES_4.map(r => r.label);
  const totalScore   = reg4Values.reduce((a, b) => a + b, 0);

  const otherTests = Object.entries(OTHER_TESTS_META).map(([testId, meta]) => {
    const real = allSessions.find(s => s.test_type === testId);
    return { testId, meta, sess: real ?? meta.demo, isDemo: !real };
  });

  // Score for each KPI tile
  const kpiData = ALL_TESTS.map(t => {
    if (t.id === '4-registres') {
      const niveau = diagnostic?.lecture_globale ? null : null; // no explicit niveau in 4R data
      return { test: t, score: Math.round(totalScore), niveau: null, isDemo };
    }
    const entry = otherTests.find(o => o.testId === t.id);
    const diag  = getDiagnostic(entry?.sess);
    return {
      test:   t,
      score:  diag?.profil_global?.score ?? 0,
      niveau: diag?.profil_global?.niveau ?? null,
      isDemo: entry?.isDemo ?? true,
    };
  });

  return (
    <div className="w-full space-y-5">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      {isDemo && (
        <div className="flex justify-end">
          <span className="text-xs px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] text-[#999]">
            Données de démo
          </span>
        </div>
      )}

      {/* ── KPI Bar avec Toggle ─────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#aaa]">Scores des tests</p>
          <StyleToggle style={kpiStyle} onChange={setKpiStyle} />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {kpiData.map(({ test, score, niveau, isDemo: d }) => {
            const KpiComponent = kpiStyle === 'circles' ? KpiTileCircles : KpiTileBars;
            return (
              <KpiComponent key={test.id} test={test} score={score} niveau={niveau} isDemo={d} />
            );
          })}
        </div>
      </div>

      {/* ── Central Panel ─────────────────────────────────────────────────── */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1.4fr' }}>

        {/* Radar + scores par registre */}
        <div className="bg-white rounded-2xl border p-6 flex flex-col" style={{ borderColor: '#e8e0d8' }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#aaa] mb-3">Radarchart — 4 registres</p>
          <div className="flex-1" style={{ minHeight: '280px' }}>
            <RadarChart labels={radarLabels} values={reg4Values} />
          </div>
          <div className="mt-4 pt-4 border-t" style={{ borderColor: '#f0ebe4' }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#aaa] mb-3">Scores par registre</p>
            <div className="space-y-2">
              {REGISTRES_4.map((r) => {
                const score = registres[r.id]?.score ?? 0;
                const pct   = Math.round((score / 25) * 100);
                const color = scoreColor4R(score);
                return (
                  <div key={r.id} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                      style={{ backgroundColor: `${r.color}18`, border: `1px solid ${r.color}50` }}
                    >
                      {r.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-[#888]">{r.label}</span>
                        <span className="text-[11px] font-bold tabular-nums" style={{ color }}>
                          {score.toFixed(1)}<span className="text-[#ccc] font-normal">/25</span>
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f0ebe4' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Synthèse + dynamiques */}
        <div className="bg-white rounded-2xl border p-6 flex flex-col gap-5" style={{ borderColor: '#e8e0d8' }}>
          {diagnostic.resume_court && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#aaa] mb-2">Synthèse</p>
              <div className="border-l-2 pl-3" style={{ borderColor: '#C96442' }}>
                <p className="text-xs text-[#555] leading-relaxed italic">{diagnostic.resume_court}</p>
              </div>
            </div>
          )}
          {diagnostic.dynamiques?.length > 0 && (
            <div className="pt-4 border-t" style={{ borderColor: '#f0ebe4' }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#aaa] mb-3">Dynamiques centrales</p>
              <div className="space-y-3">
                {diagnostic.dynamiques.map((d, i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className="w-0.5 rounded-full shrink-0 self-stretch mt-0.5"
                      style={{ backgroundColor: i === 0 ? '#C96442' : '#e8e0d8' }}
                    />
                    <div>
                      <p className="text-xs font-bold mb-0.5"
                        style={{ color: i === 0 ? '#C96442' : '#888' }}>
                        {d.titre}
                      </p>
                      <p className="text-xs text-[#666] leading-relaxed">{d.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom row — 3 test detail cards ──────────────────────────────── */}
      <div className="grid grid-cols-3 gap-5 items-stretch">
        {otherTests.map(({ testId, meta, sess, isDemo: demoTest }) => (
          <div key={testId} className="flex flex-col">
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: meta.color }}>
                {meta.icon} {meta.label}
              </p>
              {demoTest && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] text-[#ccc]">
                  démo
                </span>
              )}
            </div>
            <div className="flex-1">
              <TestDetailCard meta={meta} session={sess} isDemo={demoTest} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
