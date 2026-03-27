import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import doctorClaude from '../../assets/doctor-claude.jpg';

const REGISTER_META = {
  'reptilien':  { label: 'Reptilien',  color: '#e07b39' },
  'instinctif': { label: 'Instinctif', color: '#c0392b' },
  'emotionnel': { label: 'Émotionnel', color: '#c8890a' },
  'rationnel':  { label: 'Rationnel',  color: '#2472a4' },
};

const RADAR_AXES = [
  { key: 'reptilien',  angle: -90 },
  { key: 'rationnel',  angle:   0 },
  { key: 'emotionnel', angle:  90 },
  { key: 'instinctif', angle: 180 },
];

// — Avatar Doctor Claude —
function DCAvatar() {
  return (
    <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
      <img src={doctorClaude} alt="Doctor Claude" className="w-full h-full object-cover"
        style={{ transform: 'scale(1.6)', transformOrigin: 'center 55%' }} />
    </div>
  );
}

function DCBubble({ children, showName = false }) {
  return (
    <div className="flex items-start gap-3">
      <DCAvatar />
      <div className="flex-1 min-w-0">
        {showName && (
          <p className="text-xs font-semibold text-[#1a1209] mb-1.5"
            style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
            Doctor Claude
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

function BubbleText({ children }) {
  return (
    <div className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
      style={{ backgroundColor: '#fff', border: '1px solid #e8e0d8' }}>
      {children}
    </div>
  );
}

function UserAction({ children }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-sm">{children}</div>
    </div>
  );
}

function RadarChart({ registres }) {
  const cx = 100, cy = 100, maxR = 70;
  function toXY(angleDeg, pct) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + pct * maxR * Math.cos(rad), y: cy + pct * maxR * Math.sin(rad) };
  }
  const dataPoints = RADAR_AXES.map(({ key, angle }) => toXY(angle, Math.min(1, (registres[key]?.score ?? 0) / 25)));
  const polygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');
  return (
    <svg viewBox="0 0 200 200" className="w-full">
      {[0.25, 0.5, 0.75, 1].map((pct, i) => (
        <polygon key={i}
          points={RADAR_AXES.map(({ angle }) => toXY(angle, pct)).map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none" stroke="#e8e0d8" strokeWidth={i === 3 ? 1.5 : 0.8} />
      ))}
      {RADAR_AXES.map(({ key, angle }) => {
        const end = toXY(angle, 1);
        return <line key={key} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#e8e0d8" strokeWidth={0.8} />;
      })}
      <polygon points={polygon} fill="#C96442" fillOpacity={0.15} stroke="#C96442" strokeWidth={2} strokeLinejoin="round" />
      {dataPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#C96442" />)}
      {RADAR_AXES.map(({ key, angle }) => {
        const meta = REGISTER_META[key];
        const pos = toXY(angle, 1.32);
        return <text key={key} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
          fontSize={9} fill={meta.color} fontWeight="600">{meta.label}</text>;
      })}
    </svg>
  );
}

// — Panneau droit : chat Doctor Claude pour une session —
function SessionPanel({ session, onViewFull }) {
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [showRecs, setShowRecs] = useState(false);

  const registres = session.session_data?.registres ?? {};
  const diagnostic = session.session_data?.diagnostic ?? {};
  const total = Object.values(registres).reduce((acc, r) => acc + (r.score ?? 0), 0);
  const priorites = diagnostic.priorites ?? [];
  const dominantLabel = priorites[0]?.registre ?? '—';
  const resumeCourt = diagnostic.resume_court ?? null;
  const prioritesIntro = diagnostic.priorites_intro ?? null;
  const lectureGlobale = diagnostic.lecture_globale ?? null;
  const pratiques = diagnostic.conseils?.pratiques_quotidiennes ?? null;
  const conseilsGeneraux = diagnostic.conseils?.conseils_generaux ?? [];

  const dateFormatted = new Date(session.date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="space-y-4">

      {/* Message 1 — profil */}
      <DCBubble showName>
        <BubbleText>
          {resumeCourt
            ? <span className="italic text-[#444]">"{resumeCourt}"</span>
            : <span className="text-[#444]">Voici les résultats de cet audit.</span>}
        </BubbleText>
      </DCBubble>

      {/* Message 2 — cartographie */}
      <DCBubble>
        <div className="rounded-2xl rounded-tl-sm overflow-hidden border" style={{ borderColor: '#e8e0d8', backgroundColor: '#fff' }}>
          <div className="px-4 pt-4 pb-2 border-b" style={{ borderColor: '#f0ebe4' }}>
            <p className="text-xs font-semibold text-[#888] uppercase tracking-wide">Audit des 4 registres · {dateFormatted}</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-[#1a1209]">{total.toFixed(0)}</span>
              <span className="text-sm text-[#bbb]">/100</span>
              <span className="text-xs text-[#999] ml-2">· Dominant : {dominantLabel}</span>
            </div>
          </div>
          <div className="flex gap-4 items-center px-4 py-4">
            <div className="w-[120px] flex-shrink-0">
              <RadarChart registres={registres} />
            </div>
            <div className="flex-1 space-y-2.5 min-w-0">
              {Object.entries(registres).map(([key, data]) => {
                const meta = REGISTER_META[key];
                if (!meta) return null;
                const pct = Math.min(100, ((data.score ?? 0) / 25) * 100);
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[#1a1209]">{meta.label}</span>
                      <span className="text-xs font-bold" style={{ color: meta.color }}>
                        {(data.score ?? 0).toFixed(1)}<span className="font-normal text-[#ccc]">/25</span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f0ebe4' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: meta.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DCBubble>

      {/* Action — rapport complet */}
      <UserAction>
        <button onClick={() => onViewFull(session.session_data)}
          className="px-5 py-2.5 rounded-xl border text-sm font-semibold"
          style={{ borderColor: '#e0ddd6', color: '#1a1209', backgroundColor: '#fff' }}>
          Consulter le rapport complet →
        </button>
      </UserAction>

      {/* Message 3 — analyse */}
      {lectureGlobale && (
        <DCBubble>
          <BubbleText>
            <p className="text-sm leading-relaxed text-[#444]">
              {showFullAnalysis ? lectureGlobale : `${lectureGlobale.slice(0, 300)}…`}
            </p>
            <button onClick={() => setShowFullAnalysis((v) => !v)}
              className="mt-2 text-xs font-semibold block" style={{ color: '#C96442' }}>
              {showFullAnalysis ? 'Réduire ↑' : 'Lire l\'analyse complète ↓'}
            </button>
          </BubbleText>
        </DCBubble>
      )}

      {/* Message 4 — séquence */}
      {prioritesIntro && (
        <DCBubble>
          <BubbleText>
            <p className="text-xs font-semibold text-[#888] uppercase tracking-wide mb-2">Séquence de travail</p>
            <p className="text-sm leading-relaxed text-[#444]">{prioritesIntro}</p>
          </BubbleText>
        </DCBubble>
      )}

      {/* Message 5 — recommandations */}
      {pratiques && (
        <>
          <DCBubble>
            <BubbleText>
              <span className="text-[#444]">Voici les prescriptions quotidiennes pour ce profil.</span>
            </BubbleText>
          </DCBubble>

          <DCBubble>
            <div className="rounded-2xl rounded-tl-sm overflow-hidden border" style={{ borderColor: '#e8e0d8', backgroundColor: '#fff' }}>
              {[
                { key: 'matin',   label: 'Matin',   icon: '☀️', items: pratiques.matin   ?? [] },
                { key: 'journee', label: 'Journée', icon: '⚡', items: pratiques.journee ?? [] },
                { key: 'soir',    label: 'Soir',    icon: '🌙', items: pratiques.soir    ?? [] },
              ].filter(({ items }) => items.length > 0).map(({ key, label, icon, items }, idx, arr) => (
                <div key={key} className={`px-4 py-3 ${idx < arr.length - 1 ? 'border-b' : ''}`} style={{ borderColor: '#f0ebe4' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">{icon}</span>
                    <p className="text-xs font-semibold text-[#1a1209] uppercase tracking-wide">{label}</p>
                  </div>
                  <ul className="space-y-1.5">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 opacity-60" style={{ backgroundColor: '#C96442' }} />
                        <span className="text-sm leading-relaxed text-[#555]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </DCBubble>

          {conseilsGeneraux.length > 0 && (
            <>
              <UserAction>
                <button onClick={() => setShowRecs((v) => !v)}
                  className="px-5 py-2.5 rounded-xl border text-sm font-semibold"
                  style={{ borderColor: '#e0ddd6', color: '#1a1209', backgroundColor: '#fff' }}>
                  {showRecs ? 'Masquer les conseils ↑' : 'Voir les conseils généraux ↓'}
                </button>
              </UserAction>

              {showRecs && (
                <DCBubble>
                  <div className="rounded-2xl rounded-tl-sm overflow-hidden border" style={{ borderColor: '#e8e0d8', backgroundColor: '#fff' }}>
                    <div className="px-4 pt-3 pb-1 border-b" style={{ borderColor: '#f0ebe4' }}>
                      <p className="text-xs font-semibold text-[#888] uppercase tracking-wide">Conseils généraux</p>
                    </div>
                    <ul className="divide-y" style={{ borderColor: '#f0ebe4' }}>
                      {conseilsGeneraux.map((conseil, i) => (
                        <li key={i} className="flex items-start gap-3 px-4 py-3">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                            style={{ backgroundColor: '#C96442', opacity: 0.8 }}>
                            {i + 1}
                          </span>
                          <span className="text-sm leading-relaxed text-[#444]">{conseil}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </DCBubble>
              )}
            </>
          )}
        </>
      )}

      <div className="h-8" />
    </div>
  );
}

export default function DashboardAudits({ user, onViewSession }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('reboot_sessions')
      .select('session_id, date, session_data')
      .order('date', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSessions(data);
          setSelected(data[0].session_id); // sélectionne le plus récent par défaut
        }
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

  if (sessions.length === 0) {
    return (
      <div className="max-w-md">
        <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: '#e8e0d8' }}>
          <p className="text-sm text-[#888] mb-1">Aucun audit pour l'instant.</p>
          <p className="text-xs text-[#bbb]">Tes audits apparaîtront ici une fois complétés.</p>
        </div>
      </div>
    );
  }

  const selectedSession = sessions.find((s) => s.session_id === selected);

  return (
    <div className="flex h-full gap-0" style={{ minHeight: 'calc(100vh - 64px)' }}>

      {/* — COLONNE GAUCHE 20% — liste des audits — */}
      <div className="w-[200px] flex-shrink-0 pr-5 border-r overflow-y-auto" style={{ borderColor: '#e8e0d8' }}>
        <p className="text-xs font-semibold text-[#aaa] uppercase tracking-wide mb-3">Historique</p>
        <div className="space-y-1.5">
          {sessions.map((s) => {
            const registres = s.session_data?.registres ?? {};
            const total = Object.values(registres).reduce((acc, r) => acc + (r.score ?? 0), 0);
            const dominant = s.session_data?.diagnostic?.priorites?.[0]?.registre ?? '—';
            const isActive = selected === s.session_id;
            const dateFormatted = new Date(s.date).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'short', year: 'numeric',
            });

            return (
              <button
                key={s.session_id}
                onClick={() => setSelected(s.session_id)}
                className="w-full text-left rounded-xl border px-3 py-3 transition-all"
                style={{
                  borderColor: isActive ? '#C96442' : '#e8e0d8',
                  backgroundColor: isActive ? '#fdf6f2' : '#fff',
                }}
              >
                <p className="text-xs font-semibold text-[#1a1209] leading-tight">Audit des 4 registres</p>
                <p className="text-xs text-[#aaa] mt-0.5">{dateFormatted}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-[#888]">
                    <span className="font-bold text-[#1a1209]">{total.toFixed(0)}</span>
                    <span className="text-[#ccc]">/100</span>
                  </span>
                  <span className="text-xs" style={{ color: '#C96442' }}>{dominant}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* — COLONNE DROITE 80% — panneau chat — */}
      <div className="flex-1 pl-8 overflow-y-auto">
        {selectedSession ? (
          <SessionPanel
            key={selected}
            session={selectedSession}
            onViewFull={onViewSession}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-[#bbb]">
            Sélectionne un audit à gauche.
          </div>
        )}
      </div>

    </div>
  );
}
