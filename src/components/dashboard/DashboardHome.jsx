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

const PAYMENT_URL = import.meta.env.VITE_PAYMENT_URL || null;

export default function DashboardHome({ user, onStartAudit, onViewSession }) {
  const [lastSession, setLastSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
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
  }, [user]);

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
  const dateFormatted = new Date(lastSession.date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const domains = priorites
    .slice(0, 3)
    .map((p) => DOMAIN_MAP[p.registre])
    .filter(Boolean);

  return (
    <div className="max-w-xl space-y-5">

      {/* Header compact */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={doctorClaude}
            alt="Doctor Claude"
            className="w-full h-full object-cover"
            style={{ transform: 'scale(1.6)', transformOrigin: 'center 55%' }}
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1a1209]">Bonjour,</p>
          <p className="text-xs text-[#999]">Voici où vous en êtes.</p>
        </div>
      </div>

      {/* Dernier audit — scores par registre */}
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

        {/* Barres par registre */}
        <div className="px-5 py-4 space-y-3">
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

    </div>
  );
}
