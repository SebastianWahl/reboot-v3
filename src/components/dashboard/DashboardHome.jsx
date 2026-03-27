import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const DOMAIN_MAP = {
  'Reptilien':  'Ancrage et régulation du système de base',
  'Instinctif': 'Reconnexion au signal corporel',
  'Émotionnel': 'Fluidité et ouverture émotionnelle',
  'Rationnel':  'Clarté mentale et passage à l\'action',
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
    return <p className="text-sm text-[#aaa]">Chargement…</p>;
  }

  // Cas 1 : aucun audit
  if (!lastSession) {
    return (
      <div className="max-w-lg">
        <h2 className="text-xl font-semibold text-[#1a1209] mb-2">Bienvenue sur Re-Boot.</h2>
        <p className="text-sm text-[#888] mb-8 leading-relaxed">
          Commence par l'audit des 4 registres pour cartographier ton profil cognitif.
        </p>
        <button
          onClick={onStartAudit}
          className="font-semibold px-6 py-3 rounded-full text-sm transition-colors"
          style={{ backgroundColor: '#1a1209', color: '#fff' }}
        >
          Commencer mon premier audit →
        </button>
      </div>
    );
  }

  // Extraire données du dernier audit
  const registres = lastSession.session_data?.registres ?? {};
  const diagnostic = lastSession.session_data?.diagnostic ?? {};
  const total = Object.values(registres).reduce((acc, r) => acc + (r.score ?? 0), 0);
  const priorites = diagnostic.priorites ?? [];
  const dominantLabel = priorites[0]?.registre ?? '—';
  const dateFormatted = new Date(lastSession.date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  // Domaines pour le teaser (2-3 premiers registres prioritaires)
  const domains = priorites
    .slice(0, 3)
    .map((p) => DOMAIN_MAP[p.registre])
    .filter(Boolean);

  return (
    <div className="max-w-lg space-y-6">
      {/* Résumé dernier audit */}
      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#e8e0d8' }}>
        <p className="text-xs font-semibold text-[#888] uppercase tracking-wide mb-3">Ton dernier audit</p>
        <p className="text-xs text-[#aaa] mb-1">{dateFormatted}</p>
        <p className="text-2xl font-bold text-[#1a1209]">
          {total.toFixed(0)}<span className="text-sm font-normal text-[#bbb]">/100</span>
        </p>
        <p className="text-xs text-[#888] mt-1 mb-4">Profil dominant : {dominantLabel}</p>
        <button
          onClick={() => onViewSession(lastSession.session_data)}
          className="text-xs font-semibold px-4 py-2 rounded-full border transition-colors"
          style={{ borderColor: '#e0ddd6', color: '#1a1209' }}
        >
          Voir le rapport complet →
        </button>
      </div>

      {/* Programme personnalisé teaser */}
      <div
        className="rounded-2xl border-2 p-5"
        style={{ borderColor: '#C96442', backgroundColor: '#fdf6f2' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#C96442' }}>
          Ton programme personnalisé est prêt.
        </p>
        <p className="text-sm text-[#555] mb-4 leading-relaxed">
          Re-Boot a identifié {domains.length} domaines prioritaires pour ton profil cognitif :
        </p>

        <ul className="space-y-2 mb-5">
          {domains.map((domain) => (
            <li key={domain} className="flex items-center gap-2 text-sm text-[#444]">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#C96442' }} />
              {domain}
            </li>
          ))}
        </ul>

        {PAYMENT_URL ? (
          <a
            href={PAYMENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-semibold px-6 py-3 rounded-full text-sm transition-colors"
            style={{ backgroundColor: '#C96442', color: '#fff' }}
          >
            Débloquer mon programme →
          </a>
        ) : (
          <button
            disabled
            className="font-semibold px-6 py-3 rounded-full text-sm opacity-50 cursor-not-allowed"
            style={{ backgroundColor: '#C96442', color: '#fff' }}
          >
            Bientôt disponible
          </button>
        )}
      </div>
    </div>
  );
}
