import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function DashboardAudits({ user, onViewSession }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('reboot_sessions')
      .select('session_id, date, session_data')
      .order('date', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setSessions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold text-[#1a1209] mb-6">Mes audits</h2>

      {loading && (
        <p className="text-sm text-[#aaa]">Chargement…</p>
      )}

      {!loading && sessions.length === 0 && (
        <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: '#e8e0d8' }}>
          <p className="text-sm text-[#aaa]">Tes audits apparaîtront ici une fois complétés.</p>
        </div>
      )}

      {!loading && sessions.length > 0 && (
        <div className="space-y-3">
          {sessions.map((s) => {
            const registres = s.session_data?.registres ?? {};
            const total = Object.values(registres).reduce((acc, r) => acc + (r.score ?? 0), 0);
            const dominant = s.session_data?.diagnostic?.priorites?.[0]?.registre ?? '—';
            const dateFormatted = new Date(s.date).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric',
            });
            return (
              <div
                key={s.session_id}
                className="bg-white rounded-2xl border p-4 flex items-center justify-between gap-4"
                style={{ borderColor: '#e8e0d8' }}
              >
                <div>
                  <p className="text-xs text-[#888]">{dateFormatted}</p>
                  <p className="text-base font-bold text-[#1a1209] mt-0.5">
                    {total.toFixed(0)}<span className="text-xs font-normal text-[#bbb]">/100</span>
                  </p>
                  <p className="text-xs text-[#888] mt-0.5">Priorité : {dominant}</p>
                </div>
                <button
                  onClick={() => onViewSession(s.session_data)}
                  className="text-xs font-semibold px-4 py-2 rounded-full transition-colors flex-shrink-0"
                  style={{ backgroundColor: '#1a1209', color: '#fff' }}
                >
                  Consulter →
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
