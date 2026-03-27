import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import doctorClaude from '../../assets/doctor-claude.jpg';

const DOMAIN_MAP = {
  'Reptilien':  'Ancrage et régulation du système de base',
  'Instinctif': 'Reconnexion au signal corporel',
  'Émotionnel': 'Fluidité et ouverture émotionnelle',
  'Rationnel':  'Clarté mentale et passage à l\'action',
};

const REGISTER_META = {
  'reptilien':  { label: 'Reptilien',  color: '#e07b39', bg: '#fef3ea' },
  'instinctif': { label: 'Instinctif', color: '#c0392b', bg: '#fef0ee' },
  'emotionnel': { label: 'Émotionnel', color: '#c8890a', bg: '#fef8e7' },
  'rationnel':  { label: 'Rationnel',  color: '#2472a4', bg: '#eaf3fb' },
};

// Axes du radar dans l'ordre : haut, droite, bas, gauche
const RADAR_AXES = [
  { key: 'reptilien',  angle: -90 },
  { key: 'rationnel',  angle:   0 },
  { key: 'emotionnel', angle:  90 },
  { key: 'instinctif', angle: 180 },
];

const NEXT_TEST_MAP = {
  'Reptilien': {
    titre: 'Audit Corps & Ancrage',
    accroche: 'Ton système de base régule tout le reste.',
    description:
      'Ce test explore en profondeur ton rapport au corps, au sommeil, à l\'alimentation et à l\'espace physique. Il identifie les patterns d\'activation et de décharge du système nerveux autonome — la fondation sur laquelle tout développement personnel repose.',
    benefice: 'À l\'issue : un protocole de régulation quotidien sur mesure, des pratiques corporelles adaptées à ton profil de stress, et une feuille de route pour renforcer l\'ancrage physique.',
  },
  'Instinctif': {
    titre: 'Audit Intuition & Signal Interne',
    accroche: 'Ton intelligence corporelle a beaucoup à te dire.',
    description:
      'Ce test mesure ta capacité à détecter, faire confiance et intégrer tes signaux internes — le gut-feeling, les micro-réactions, les résistances spontanées. Il distingue l\'intuition authentique de l\'anxiété projetée.',
    benefice: 'À l\'issue : des exercices pour affiner ton écoute interne, des protocoles de décision intégrant l\'intelligence non-verbale, et un plan pour réduire la sur-analyse paralysante.',
  },
  'Émotionnel': {
    titre: 'Audit Vie Émotionnelle & Relationnelle',
    accroche: 'Les émotions non nommées dirigent en silence.',
    description:
      'Ce test cartographie ta vie affective : comment tu ressens, nommes, exprimes et régules tes émotions. Il explore aussi tes patterns relationnels — attachement, frontières, communication dans les moments de tension.',
    benefice: 'À l\'issue : un vocabulaire émotionnel élargi, des techniques de régulation adaptées à ton profil, et des stratégies concrètes pour améliorer tes relations les plus importantes.',
  },
  'Rationnel': {
    titre: 'Audit Mental & Passage à l\'Action',
    accroche: 'Beaucoup pensent, peu ancrent dans le réel.',
    description:
      'Ce test analyse ta façon de traiter l\'information, de prendre des décisions et de passer de l\'idée à l\'exécution. Il identifie les biais cognitifs dominants, les patterns de procrastination et les blocages entre pensée et action.',
    benefice: 'À l\'issue : des frameworks de décision adaptés à ton profil, des systèmes d\'organisation qui respectent ton mode de fonctionnement, et des techniques pour court-circuiter les boucles mentales.',
  },
};

const PAYMENT_URL = import.meta.env.VITE_PAYMENT_URL || null;

// — Radar Chart SVG (4 axes, diamond) —
function RadarChart({ registres }) {
  const cx = 100;
  const cy = 100;
  const maxR = 75;
  const levels = [25, 50, 75, 100];

  function toXY(angleDeg, pct) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + pct * maxR * Math.cos(rad),
      y: cy + pct * maxR * Math.sin(rad),
    };
  }

  const dataPoints = RADAR_AXES.map(({ key, angle }) => {
    const score = registres[key]?.score ?? 0;
    const pct = Math.min(1, score / 25);
    return toXY(angle, pct);
  });

  const polygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  const gridLines = levels.map((pct) => {
    const pts = RADAR_AXES.map(({ angle }) => toXY(angle, pct / 100));
    return pts.map((p) => `${p.x},${p.y}`).join(' ');
  });

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
      {/* Grid polygons */}
      {gridLines.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="none"
          stroke="#e8e0d8"
          strokeWidth={i === gridLines.length - 1 ? 1.5 : 0.8}
        />
      ))}

      {/* Axis lines */}
      {RADAR_AXES.map(({ key, angle }) => {
        const end = toXY(angle, 1);
        return (
          <line
            key={key}
            x1={cx} y1={cy}
            x2={end.x} y2={end.y}
            stroke="#e8e0d8"
            strokeWidth={0.8}
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={polygon}
        fill="#C96442"
        fillOpacity={0.18}
        stroke="#C96442"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="#C96442" />
      ))}

      {/* Labels */}
      {RADAR_AXES.map(({ key, angle }) => {
        const meta = REGISTER_META[key];
        const pos = toXY(angle, 1.28);
        return (
          <text
            key={key}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9}
            fill={meta.color}
            fontWeight="600"
          >
            {meta.label}
          </text>
        );
      })}

      {/* Center dot */}
      <circle cx={cx} cy={cy} r={2} fill="#e8e0d8" />
    </svg>
  );
}

export default function DashboardHome({ user, onStartAudit, onViewSession, previewSession }) {
  const [lastSession, setLastSession] = useState(previewSession ?? null);
  const [loading, setLoading] = useState(!previewSession);
  const [showFullLecture, setShowFullLecture] = useState(false);

  useEffect(() => {
    if (previewSession || !user) return;
    supabase
      .from('reboot_sessions')
      .select('session_id, date, session_data')
      .order('date', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setLastSession(data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, previewSession]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8">
        <div className="w-4 h-4 border-2 border-[#e0ddd6] border-t-[#C96442] rounded-full animate-spin" />
        <span className="text-sm text-[#aaa]">Chargement…</span>
      </div>
    );
  }

  // — CAS 1 : aucun audit —
  if (!lastSession) {
    return (
      <div className="max-w-xl">

        {/* Header Doctor Claude */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
            <img
              src={doctorClaude}
              alt="Doctor Claude"
              className="w-full h-full object-cover"
              style={{ transform: 'scale(1.6)', transformOrigin: 'center 55%' }}
            />
          </div>
          <div>
            <p className="font-semibold text-[#1a1209]" style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: '20px' }}>
              Doctor Claude
            </p>
            <p className="text-xs" style={{ color: '#C96442', fontFamily: "'EB Garamond', Georgia, serif", fontStyle: 'italic' }}>
              ton analyste cognitif
            </p>
          </div>
        </div>

        {/* Message principal */}
        <div className="mb-8">
          <h1
            className="font-display mb-4 leading-snug"
            style={{ color: '#1a1209', fontSize: '28px' }}
          >
            L'audit des 4 registres est<br />
            <em style={{ color: '#C96442' }}>ton point de départ.</em>
          </h1>

          <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#555' }}>
            <p>
              En 20 questions libres, Doctor Claude cartographie comment tu fonctionnes vraiment —
              tes forces, tes angles morts, et les 3 actions concrètes à mettre en place dès maintenant.
            </p>
            <p>
              C'est la base sur laquelle Re-Boot construit la suite : un programme personnalisé,
              conçu spécifiquement pour ton profil.
            </p>
          </div>
        </div>

        {/* Ce que tu obtiens */}
        <div className="bg-white rounded-2xl border p-5 mb-6" style={{ borderColor: '#e8e0d8' }}>
          <p className="text-xs font-semibold text-[#888] uppercase tracking-wide mb-4">Ce que tu obtiens</p>
          <div className="space-y-3">
            {[
              { icon: '🗺️', label: 'Cartographie de tes 4 registres cognitifs', sub: 'Reptilien · Instinctif · Émotionnel · Rationnel' },
              { icon: '⚡', label: '3 actions concrètes à mettre en place dès maintenant', sub: 'Adaptées à ton profil spécifique' },
              { icon: '📚', label: 'Pistes de lecture et concepts à explorer', sub: 'Pour aller plus loin à ton rythme' },
              { icon: '🧭', label: 'La base de ton programme personnalisé', sub: 'Re-Boot construit la suite sur ce premier audit' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium text-[#1a1209]">{item.label}</p>
                  <p className="text-xs text-[#999]">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onStartAudit}
          className="w-full py-4 rounded-2xl text-sm font-semibold transition-colors"
          style={{ backgroundColor: '#C96442', color: '#fff' }}
        >
          Commencer l'audit des 4 registres →
        </button>
        <p className="text-xs text-center text-[#bbb] mt-3">⏱ 15–20 min · Gratuit</p>
      </div>
    );
  }

  // — CAS 2 : audit existant —
  const registres = lastSession.session_data?.registres ?? {};
  const diagnostic = lastSession.session_data?.diagnostic ?? {};
  const total = Object.values(registres).reduce((acc, r) => acc + (r.score ?? 0), 0);
  const priorites = diagnostic.priorites ?? [];
  const dominantLabel = priorites[0]?.registre ?? '—';
  const resumeCourt = diagnostic.resume_court ?? null;
  const prioritesIntro = diagnostic.priorites_intro ?? null;
  const lectureGlobale = diagnostic.lecture_globale ?? null;
  const pratiques = diagnostic.conseils?.pratiques_quotidiennes ?? null;
  const conseilsGeneraux = diagnostic.conseils?.conseils_generaux ?? [];

  const domains = priorites
    .slice(0, 3)
    .map((p) => DOMAIN_MAP[p.registre])
    .filter(Boolean);

  const nextTestKey = priorites[0]?.registre ?? null;
  const nextTest = nextTestKey ? NEXT_TEST_MAP[nextTestKey] : null;

  const dateFormatted = new Date(lastSession.date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="max-w-xl space-y-5">

      {/* Header Doctor Claude */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
          <img
            src={doctorClaude}
            alt="Doctor Claude"
            className="w-full h-full object-cover"
            style={{ transform: 'scale(1.6)', transformOrigin: 'center 55%' }}
          />
        </div>
        <div>
          <p className="font-semibold text-[#1a1209]" style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: '18px' }}>
            Doctor Claude
          </p>
          <p className="text-xs" style={{ color: '#C96442', fontFamily: "'EB Garamond', Georgia, serif", fontStyle: 'italic' }}>
            ton analyste cognitif · {dateFormatted}
          </p>
        </div>
      </div>

      {/* Résumé de profil */}
      {resumeCourt && (
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#e8e0d8' }}>
          <p className="text-xs font-semibold text-[#888] uppercase tracking-wide mb-3">Ton profil</p>
          <p className="text-sm leading-relaxed text-[#444] italic">"{resumeCourt}"</p>
        </div>
      )}

      {/* Radar chart + scores */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e0d8' }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#f0ebe4' }}>
          <div>
            <p className="text-xs font-semibold text-[#888] uppercase tracking-wide">Ton dernier audit</p>
            <p className="text-xs text-[#bbb] mt-0.5">{dateFormatted}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#1a1209]">
              {total.toFixed(0)}<span className="text-sm font-normal text-[#bbb]">/100</span>
            </p>
            <p className="text-xs text-[#999]">Dominant : {dominantLabel}</p>
          </div>
        </div>

        {/* Radar + barres côte à côte */}
        <div className="px-5 py-5 flex gap-5 items-center">
          <div className="flex-shrink-0 w-[140px]">
            <RadarChart registres={registres} />
          </div>
          <div className="flex-1 space-y-3 min-w-0">
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
                  <div className="h-1.5 rounded-full bg-[#f0ebe4] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: meta.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-5 pb-4">
          <button
            onClick={() => onViewSession(lastSession.session_data)}
            className="text-xs font-semibold px-4 py-2 rounded-full border transition-colors"
            style={{ borderColor: '#e0ddd6', color: '#1a1209' }}
          >
            Voir le rapport complet →
          </button>
        </div>
      </div>

      {/* Lecture globale */}
      {lectureGlobale && (
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#e8e0d8' }}>
          <p className="text-xs font-semibold text-[#888] uppercase tracking-wide mb-3">Analyse de Doctor Claude</p>
          <p className="text-sm leading-relaxed text-[#444]">
            {showFullLecture ? lectureGlobale : `${lectureGlobale.slice(0, 280)}…`}
          </p>
          <button
            onClick={() => setShowFullLecture((v) => !v)}
            className="mt-3 text-xs font-semibold"
            style={{ color: '#C96442' }}
          >
            {showFullLecture ? 'Réduire ↑' : 'Lire l\'analyse complète ↓'}
          </button>
        </div>
      )}

      {/* Séquence de travail */}
      {prioritesIntro && (
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#e8e0d8' }}>
          <p className="text-xs font-semibold text-[#888] uppercase tracking-wide mb-3">Ta séquence de travail</p>
          <p className="text-sm leading-relaxed text-[#444]">{prioritesIntro}</p>
        </div>
      )}

      {/* Recommandations quotidiennes */}
      {pratiques && (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e0d8' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: '#f0ebe4' }}>
            <p className="text-xs font-semibold text-[#888] uppercase tracking-wide">Recommandations quotidiennes</p>
            <p className="text-xs text-[#bbb] mt-0.5">Prescriptions de Doctor Claude pour ton profil</p>
          </div>

          {[
            { key: 'matin',   label: 'Matin',   icon: '☀️', items: pratiques.matin   ?? [] },
            { key: 'journee', label: 'Journée', icon: '⚡', items: pratiques.journee ?? [] },
            { key: 'soir',    label: 'Soir',    icon: '🌙', items: pratiques.soir    ?? [] },
          ].map(({ key, label, icon, items }) => items.length > 0 && (
            <div key={key} className="px-5 py-4 border-b last:border-0" style={{ borderColor: '#f0ebe4' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">{icon}</span>
                <p className="text-xs font-semibold text-[#1a1209] uppercase tracking-wide">{label}</p>
              </div>
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C96442] flex-shrink-0 mt-1.5 opacity-70" />
                    <span className="text-sm leading-relaxed text-[#444]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Conseils généraux */}
      {conseilsGeneraux.length > 0 && (
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#e8e0d8' }}>
          <p className="text-xs font-semibold text-[#888] uppercase tracking-wide mb-4">Conseils généraux</p>
          <ul className="space-y-3">
            {conseilsGeneraux.map((conseil, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                  style={{ backgroundColor: '#C96442', opacity: 0.85 }}
                >
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-[#444]">{conseil}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Programme personnalisé teaser */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: '#C96442' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Ton programme personnalisé
        </p>
        <p className="font-semibold text-white mb-3" style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: '18px' }}>
          Re-Boot a identifié {domains.length} domaines prioritaires pour toi.
        </p>

        <ul className="space-y-2 mb-5">
          {domains.map((domain) => (
            <li key={domain} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-white opacity-70" />
              {domain}
            </li>
          ))}
        </ul>

        {PAYMENT_URL ? (
          <a
            href={PAYMENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
            style={{ backgroundColor: '#1a1209', color: '#fff' }}
          >
            Débloquer mon programme →
          </a>
        ) : (
          <button
            disabled
            className="font-semibold px-5 py-2.5 rounded-full text-sm opacity-60 cursor-not-allowed"
            style={{ backgroundColor: '#1a1209', color: '#fff' }}
          >
            Bientôt disponible
          </button>
        )}
      </div>

      {/* Prochain test — teaser */}
      {nextTest && (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e0d8' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: '#f0ebe4', backgroundColor: '#fdf6f2' }}>
            <p className="text-xs font-semibold text-[#888] uppercase tracking-wide">Prochaine étape</p>
            <p className="font-semibold text-[#1a1209] mt-1" style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: '17px' }}>
              {nextTest.titre}
            </p>
            <p className="text-xs mt-0.5 font-medium" style={{ color: '#C96442' }}>{nextTest.accroche}</p>
          </div>

          <div className="px-5 py-4 space-y-3">
            <p className="text-sm leading-relaxed text-[#555]">{nextTest.description}</p>

            <div className="rounded-xl p-3" style={{ backgroundColor: '#fdf6f2', borderLeft: '3px solid #C96442' }}>
              <p className="text-xs font-semibold text-[#888] uppercase tracking-wide mb-1">Ce que ça t'apporte</p>
              <p className="text-sm leading-relaxed text-[#444]">{nextTest.benefice}</p>
            </div>

            {PAYMENT_URL ? (
              <a
                href={PAYMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center font-semibold py-3 rounded-xl text-sm transition-colors"
                style={{ backgroundColor: '#C96442', color: '#fff' }}
              >
                Accéder à ce test →
              </a>
            ) : (
              <button
                disabled
                className="w-full font-semibold py-3 rounded-xl text-sm opacity-50 cursor-not-allowed"
                style={{ backgroundColor: '#C96442', color: '#fff' }}
              >
                Bientôt disponible
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
