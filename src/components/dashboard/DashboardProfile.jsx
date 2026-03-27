// src/components/dashboard/DashboardProfile.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import RadarChart from '../ui/RadarChart';

const REGISTRES = [
  { id: 'reptilien',  label: 'Reptilien'  },
  { id: 'instinctif', label: 'Instinctif' },
  { id: 'emotionnel', label: 'Émotionnel' },
  { id: 'rationnel',  label: 'Rationnel'  },
];

const TEST_REGISTRY = [
  { id: 'audit-4-registres', label: 'Audit des 4 registres' },
  { id: 'test-sommeil',      label: 'Test du sommeil'       },
  { id: 'test-stress',       label: 'Test du stress'        },
  { id: 'test-relations',    label: 'Test des relations'    },
];

function scoreColor(score) {
  const pct = score / 25;
  if (pct >= 0.72) return '#4a7c59';
  if (pct >= 0.48) return '#C96442';
  return '#c0392b';
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-[#aaa] mb-3">
      {children}
    </p>
  );
}

export default function DashboardProfile({ user, onStartAudit }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (!session) {
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

  const registres = session.session_data?.registres ?? {};
  const diagnostic = session.session_data?.diagnostic ?? {};
  const values = REGISTRES.map(r => registres[r.id]?.score ?? 0);
  const labels = REGISTRES.map(r => r.label);
  const totalScore = values.reduce((a, b) => a + b, 0);
  const completedTests = 1; // only audit-4-registres for now
  const completionPct = Math.round((completedTests / TEST_REGISTRY.length) * 100);
  const dateFormatted = new Date(session.date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="max-w-3xl space-y-6">

      {/* Block 1 — Completeness */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e0d8' }}>
        <div className="px-6 py-5" style={{ backgroundColor: '#fdf6f2' }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <SectionLabel>Profil complété</SectionLabel>
              <p className="text-2xl font-bold" style={{ color: '#C96442' }}>
                {completionPct}%
                <span className="text-sm font-normal text-[#bbb] ml-2">
                  {completedTests} test sur {TEST_REGISTRY.length}
                </span>
              </p>
            </div>
            <p className="text-xs text-[#bbb] text-right">
              Dernière mise à jour<br />
              <span className="text-[#888]">{dateFormatted}</span>
            </p>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ backgroundColor: '#e8e0d8' }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${completionPct}%`, backgroundColor: '#C96442' }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {TEST_REGISTRY.map((test, i) => {
              const done = i === 0;
              return (
                <span
                  key={test.id}
                  className="text-xs px-3 py-1.5 rounded-lg border font-medium"
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

      {/* Block 2 — Snapshot */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e0d8' }}>
        <div className="p-6 grid grid-cols-2 gap-8 items-center">
          <div>
            <RadarChart labels={labels} values={values} />
          </div>
          <div>
            <SectionLabel>Score global</SectionLabel>
            <p className="text-4xl font-bold text-[#1a1209] mb-4">
              {totalScore.toFixed(0)}
              <span className="text-sm font-normal text-[#bbb]">/100</span>
            </p>
            <div className="space-y-2.5">
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
        </div>
      </div>

      {/* Block 3 — Qui je suis */}
      {diagnostic.resume_court && (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e0d8' }}>
          <div className="p-6">
            <SectionLabel>Qui je suis</SectionLabel>
            <div className="border-l-2 pl-4" style={{ borderColor: '#C96442' }}>
              <p className="text-sm text-[#444] leading-relaxed italic">{diagnostic.resume_court}</p>
            </div>
          </div>
        </div>
      )}

      {/* Block 4 — Dynamiques centrales */}
      {diagnostic.dynamiques?.length > 0 && (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e0d8' }}>
          <div className="p-6">
            <SectionLabel>Dynamiques centrales</SectionLabel>
            <div className="space-y-4">
              {diagnostic.dynamiques.map((d, i) => (
                <div key={i} className="flex gap-3">
                  <div
                    className="w-0.5 rounded-full shrink-0 self-stretch"
                    style={{ backgroundColor: i === 0 ? '#C96442' : '#e8e0d8' }}
                  />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide mb-1"
                      style={{ color: i === 0 ? '#C96442' : '#888' }}>
                      {d.titre}
                    </p>
                    <p className="text-sm text-[#555] leading-relaxed">{d.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Block 5 — Priorités */}
      {diagnostic.priorites?.length > 0 && (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e0d8' }}>
          <div className="p-6">
            <SectionLabel>Mes priorités maintenant</SectionLabel>
            <div className="space-y-3">
              {diagnostic.priorites.map((p, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-4"
                  style={i === 0
                    ? { borderColor: '#f5dfd5', backgroundColor: '#fdf6f2' }
                    : { borderColor: '#f0ebe4', backgroundColor: '#faf7f2', opacity: 0.75 }
                  }
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <p className="text-xs font-bold" style={{ color: i === 0 ? '#C96442' : '#888' }}>
                      {i + 1} · {p.registre} — {p.but}
                    </p>
                    <span className="text-xs font-bold tabular-nums"
                      style={{ color: i === 0 ? '#C96442' : '#bbb' }}>
                      {p.score?.toFixed(1)}/25
                    </span>
                  </div>
                  <div className="space-y-1">
                    {p.actions?.map((action, j) => (
                      <p key={j} className="text-xs text-[#666] flex items-start gap-1.5">
                        <span className="text-[#ccc] shrink-0 mt-0.5">›</span>{action}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Block 6 — Pratiques quotidiennes */}
      {diagnostic.conseils?.pratiques_quotidiennes && (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e0d8' }}>
          <div className="p-6">
            <SectionLabel>Mes pratiques du moment</SectionLabel>
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'matin',   label: 'Matin'   },
                { key: 'journee', label: 'Journée' },
                { key: 'soir',    label: 'Soir'    },
              ].map(({ key, label }) => {
                const items = diagnostic.conseils.pratiques_quotidiennes[key] ?? [];
                if (!items.length) return null;
                return (
                  <div key={key} className="rounded-xl p-4" style={{ backgroundColor: '#faf7f2' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-3"
                      style={{ color: '#C96442' }}>
                      {label}
                    </p>
                    <div className="space-y-1.5">
                      {items.map((item, i) => (
                        <p key={i} className="text-xs text-[#666] leading-snug">{item}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
