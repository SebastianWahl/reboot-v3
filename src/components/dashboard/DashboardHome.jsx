import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import doctorClaude from '../../assets/doctor-claude.jpg';

const DOMAIN_MAP = {
  'Reptilien':  'Ancrage et régulation du système de base',
  'Instinctif': 'Reconnexion au signal corporel',
  'Émotionnel': 'Fluidité et ouverture émotionnelle',
  'Rationnel':  'Clarté mentale et passage à l\'action',
};

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

const NEXT_TEST_MAP = {
  'Reptilien': {
    titre: 'Audit Corps & Ancrage',
    accroche: 'Ton système de base régule tout le reste.',
    description: 'Ce test explore ton rapport au corps, au sommeil, à l\'alimentation et à l\'espace physique. Il identifie les patterns d\'activation et de décharge du système nerveux autonome — la fondation sur laquelle tout développement personnel repose.',
    benefice: 'À l\'issue : un protocole de régulation quotidien sur mesure, des pratiques corporelles adaptées à ton profil de stress, et une feuille de route pour renforcer l\'ancrage physique.',
  },
  'Instinctif': {
    titre: 'Audit Intuition & Signal Interne',
    accroche: 'Ton intelligence corporelle a beaucoup à te dire.',
    description: 'Ce test mesure ta capacité à détecter, faire confiance et intégrer tes signaux internes — le gut-feeling, les micro-réactions, les résistances spontanées.',
    benefice: 'À l\'issue : des exercices pour affiner ton écoute interne, des protocoles de décision intégrant l\'intelligence non-verbale, et un plan pour réduire la sur-analyse paralysante.',
  },
  'Émotionnel': {
    titre: 'Audit Vie Émotionnelle & Relationnelle',
    accroche: 'Les émotions non nommées dirigent en silence.',
    description: 'Ce test cartographie ta vie affective : comment tu ressens, nommes, exprimes et régules tes émotions. Il explore aussi tes patterns relationnels — attachement, frontières, communication sous tension.',
    benefice: 'À l\'issue : un vocabulaire émotionnel élargi, des techniques de régulation adaptées à ton profil, et des stratégies pour améliorer tes relations les plus importantes.',
  },
  'Rationnel': {
    titre: 'Audit Mental & Passage à l\'Action',
    accroche: 'Beaucoup pensent, peu ancrent dans le réel.',
    description: 'Ce test analyse ta façon de traiter l\'information, de prendre des décisions et de passer de l\'idée à l\'exécution. Il identifie les biais cognitifs dominants et les blocages entre pensée et action.',
    benefice: 'À l\'issue : des frameworks de décision adaptés à ton profil, des systèmes d\'organisation qui respectent ton mode de fonctionnement, et des techniques pour court-circuiter les boucles mentales.',
  },
};

const PAYMENT_URL = import.meta.env.VITE_PAYMENT_URL || null;

// — Avatar Doctor Claude —
function DCAvatar({ size = 'md' }) {
  const s = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';
  return (
    <div className={`${s} rounded-xl overflow-hidden flex-shrink-0 shadow-sm`}>
      <img src={doctorClaude} alt="Doctor Claude" className="w-full h-full object-cover"
        style={{ transform: 'scale(1.6)', transformOrigin: 'center 55%' }} />
    </div>
  );
}

// — Bulle Doctor Claude —
function DCBubble({ children, showName = false, className = '' }) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <DCAvatar />
      <div className="flex-1 max-w-lg min-w-0">
        {showName && (
          <p className="text-xs font-semibold text-[#1a1209] mb-1.5" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
            Doctor Claude
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

// — Texte dans une bulle —
function BubbleText({ children }) {
  return (
    <div className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-[#1a1209]"
      style={{ backgroundColor: '#fff', border: '1px solid #e8e0d8' }}>
      {children}
    </div>
  );
}

// — Action utilisateur (droite) —
function UserAction({ children }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-sm">
        {children}
      </div>
    </div>
  );
}

// — Séparateur de section —
function ChatDivider() {
  return <div className="h-2" />;
}

// — Radar chart SVG —
function RadarChart({ registres }) {
  const cx = 100, cy = 100, maxR = 70;
  function toXY(angleDeg, pct) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + pct * maxR * Math.cos(rad), y: cy + pct * maxR * Math.sin(rad) };
  }
  const dataPoints = RADAR_AXES.map(({ key, angle }) => toXY(angle, Math.min(1, (registres[key]?.score ?? 0) / 25)));
  const polygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');
  const gridPcts = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox="0 0 200 200" className="w-full">
      {gridPcts.map((pct, i) => (
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
        const pos = toXY(angle, 1.3);
        return <text key={key} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
          fontSize={9} fill={meta.color} fontWeight="600">{meta.label}</text>;
      })}
    </svg>
  );
}

export default function DashboardHome({ user, onStartAudit, onViewSession, previewSession }) {
  const [lastSession, setLastSession] = useState(previewSession ?? null);
  const [loading, setLoading] = useState(!previewSession);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [showDailyRecs, setShowDailyRecs] = useState(false);
  const bottomRef = useRef(null);

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

  // Scroll vers le bas dès que le contenu est prêt
  useEffect(() => {
    if (!loading && lastSession && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'instant' });
    }
  }, [loading, lastSession]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8">
        <div className="w-4 h-4 border-2 border-[#e0ddd6] border-t-[#C96442] rounded-full animate-spin" />
        <span className="text-sm text-[#aaa]">Chargement…</span>
      </div>
    );
  }

  // ——————————————————————————————
  // CAS 1 : aucun audit — onboarding chat
  // ——————————————————————————————
  if (!lastSession) {
    return (
      <div className="max-w-2xl space-y-4 py-2">

        <DCBubble showName>
          <BubbleText>
            Bonjour ! Je suis Doctor Claude, ton analyste cognitif.
          </BubbleText>
        </DCBubble>

        <DCBubble>
          <BubbleText>
            Pour t'accompagner efficacement, j'ai besoin de mieux te connaître.
            L'<strong>Audit des 4 Registres</strong> est mon point de départ — 20 questions libres
            qui me permettent de cartographier comment tu fonctionnes vraiment : tes forces,
            tes angles morts, et les leviers sur lesquels agir en priorité.
          </BubbleText>
        </DCBubble>

        <DCBubble>
          <BubbleText>
            <p className="mb-3">Voici ce que l'audit te donnera :</p>
            <ul className="space-y-2">
              {[
                { icon: '🗺️', text: 'La cartographie de tes 4 registres cognitifs — Reptilien, Instinctif, Émotionnel, Rationnel' },
                { icon: '⚡', text: '3 actions concrètes adaptées à ton profil, à mettre en place dès maintenant' },
                { icon: '📚', text: 'Des pistes de lecture et concepts clés à explorer à ton rythme' },
                { icon: '🧭', text: 'La base de ton programme personnalisé Re-Boot' },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="text-sm leading-relaxed text-[#444]">{item.text}</span>
                </li>
              ))}
            </ul>
          </BubbleText>
        </DCBubble>

        <DCBubble>
          <BubbleText>
            Prêt à commencer ? L'audit prend 15 à 20 minutes. C'est gratuit.
          </BubbleText>
        </DCBubble>

        <UserAction>
          <button onClick={onStartAudit}
            className="w-full px-6 py-3.5 rounded-2xl text-sm font-semibold transition-colors"
            style={{ backgroundColor: '#C96442', color: '#fff' }}>
            Commencer l'audit des 4 registres →
          </button>
        </UserAction>

      </div>
    );
  }

  // ——————————————————————————————
  // CAS 2 : audit existant — conversation post-audit
  // ——————————————————————————————
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
  const nextTestKey = priorites[0]?.registre ?? null;
  const nextTest = nextTestKey ? NEXT_TEST_MAP[nextTestKey] : null;
  const domains = priorites.slice(0, 3).map((p) => DOMAIN_MAP[p.registre]).filter(Boolean);

  return (
    <div className="max-w-2xl space-y-4 py-2">

      {/* — Message 1 : accueil + profil — */}
      <DCBubble showName>
        <BubbleText>
          {resumeCourt
            ? <span className="italic">"{resumeCourt}"</span>
            : 'Ton audit est terminé. Voici ce que j\'ai identifié.'}
        </BubbleText>
      </DCBubble>

      <ChatDivider />

      {/* — Message 2 : cartographie — */}
      <DCBubble>
        <div className="rounded-2xl rounded-tl-sm overflow-hidden border" style={{ borderColor: '#e8e0d8', backgroundColor: '#fff' }}>
          {/* Header carte résultats */}
          <div className="px-4 pt-4 pb-2 border-b" style={{ borderColor: '#f0ebe4' }}>
            <p className="text-xs font-semibold text-[#888] uppercase tracking-wide">Cartographie des 4 registres</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-[#1a1209]">{total.toFixed(0)}</span>
              <span className="text-sm text-[#bbb]">/100</span>
              <span className="text-xs text-[#999] ml-2">· Dominant : {dominantLabel}</span>
            </div>
          </div>

          {/* Radar + barres */}
          <div className="flex gap-4 items-center px-4 py-4">
            <div className="w-[130px] flex-shrink-0">
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

      {/* Action : voir rapport */}
      <UserAction>
        <button onClick={() => onViewSession(lastSession.session_data)}
          className="px-5 py-2.5 rounded-xl border text-sm font-semibold transition-colors"
          style={{ borderColor: '#e0ddd6', color: '#1a1209', backgroundColor: '#fff' }}>
          Consulter le rapport complet →
        </button>
      </UserAction>

      <ChatDivider />

      {/* — Message 3 : analyse — */}
      {lectureGlobale && (
        <DCBubble>
          <BubbleText>
            <p className="text-sm leading-relaxed text-[#444]">
              {showFullAnalysis ? lectureGlobale : `${lectureGlobale.slice(0, 320)}…`}
            </p>
            <button onClick={() => setShowFullAnalysis((v) => !v)}
              className="mt-2 text-xs font-semibold block" style={{ color: '#C96442' }}>
              {showFullAnalysis ? 'Réduire ↑' : 'Lire l\'analyse complète ↓'}
            </button>
          </BubbleText>
        </DCBubble>
      )}

      {/* — Message 4 : séquence de travail — */}
      {prioritesIntro && (
        <DCBubble>
          <BubbleText>
            <p className="text-xs font-semibold text-[#888] uppercase tracking-wide mb-2">Ta séquence de travail</p>
            <p className="text-sm leading-relaxed text-[#444]">{prioritesIntro}</p>
          </BubbleText>
        </DCBubble>
      )}

      <ChatDivider />

      {/* — Message 5 : recommandations quotidiennes — */}
      {pratiques && (
        <>
          <DCBubble>
            <BubbleText>
              En attendant la suite, voici les pratiques quotidiennes que je te prescris en priorité.
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

          {/* Conseils généraux — toggle */}
          {conseilsGeneraux.length > 0 && (
            <>
              <UserAction>
                <button onClick={() => setShowDailyRecs((v) => !v)}
                  className="px-5 py-2.5 rounded-xl border text-sm font-semibold"
                  style={{ borderColor: '#e0ddd6', color: '#1a1209', backgroundColor: '#fff' }}>
                  {showDailyRecs ? 'Masquer les conseils ↑' : 'Voir les conseils généraux ↓'}
                </button>
              </UserAction>

              {showDailyRecs && (
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

      <ChatDivider />

      {/* — Message 6 : prochain test — */}
      {nextTest && (
        <>
          <DCBubble>
            <BubbleText>
              En me basant sur tes résultats, ton registre <strong>{nextTestKey}</strong> est celui
              qui mérite d'être investigué en priorité. C'est là que se trouve le plus grand levier
              de progression pour ton profil.
            </BubbleText>
          </DCBubble>

          <DCBubble>
            <BubbleText>
              Je te propose de passer l'<strong>{nextTest.titre}</strong>.{' '}
              {nextTest.accroche}
            </BubbleText>
          </DCBubble>

          <DCBubble>
            <div className="rounded-2xl rounded-tl-sm overflow-hidden border" style={{ borderColor: '#e8e0d8', backgroundColor: '#fff' }}>
              <div className="px-4 py-4 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-[#1a1209] mb-1">{nextTest.titre}</p>
                  <p className="text-sm leading-relaxed text-[#555]">{nextTest.description}</p>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: '#fdf6f2', borderLeft: '3px solid #C96442' }}>
                  <p className="text-xs font-semibold text-[#888] uppercase tracking-wide mb-1">Ce que ça t'apporte</p>
                  <p className="text-sm leading-relaxed text-[#444]">{nextTest.benefice}</p>
                </div>
              </div>
            </div>
          </DCBubble>

          <DCBubble>
            <BubbleText>
              <p className="text-sm leading-relaxed text-[#444]">
                La suite de ton programme couvre {domains.length} domaines identifiés pour ton profil :
              </p>
              <ul className="mt-2 space-y-1">
                {domains.map((domain, i) => (
                  <li key={domain} className="flex items-center gap-2 text-sm text-[#444]">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: i === 0 ? '#C96442' : '#f0ebe4', color: i === 0 ? '#fff' : '#aaa' }}>
                      {i + 1}
                    </span>
                    {domain}
                  </li>
                ))}
              </ul>
            </BubbleText>
          </DCBubble>

          <UserAction>
            {PAYMENT_URL ? (
              <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer"
                className="block px-6 py-3.5 rounded-2xl text-sm font-semibold text-center"
                style={{ backgroundColor: '#C96442', color: '#fff' }}>
                Débloquer mon programme →
              </a>
            ) : (
              <button disabled className="px-6 py-3.5 rounded-2xl text-sm font-semibold opacity-50 cursor-not-allowed"
                style={{ backgroundColor: '#C96442', color: '#fff' }}>
                Bientôt disponible
              </button>
            )}
          </UserAction>
        </>
      )}

      {/* Ancre de scroll — dernier message toujours visible au chargement */}
      <div ref={bottomRef} className="h-8" />
    </div>
  );
}
