import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import DiagnosticScreen from '../screens/DiagnosticScreen';

// Pour l'instant tous les tests sont "Audit des 4 registres"
const TEST_META = {
  default: {
    nom: 'Audit des 4 registres',
    but: 'Cartographier les 4 registres cognitifs et identifier les priorités de travail personnalisées.',
  },
};


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
          setSelected(data[0].session_id);
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

      {/* — COLONNE GAUCHE — liste des tests — */}
      <div className="w-[220px] flex-shrink-0 pr-5 border-r overflow-y-auto" style={{ borderColor: '#e8e0d8' }}>
        <p className="text-xs font-semibold text-[#aaa] uppercase tracking-wide mb-3">Mes audits</p>
        <div className="space-y-2">
          {sessions.map((s) => {
            const registres = s.session_data?.registres ?? {};
            const total = Object.values(registres).reduce((acc, r) => acc + (r.score ?? 0), 0);
            const isActive = selected === s.session_id;
            const test = TEST_META.default;
            const dateFormatted = new Date(s.date).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'short', year: 'numeric',
            });

            return (
              <button
                key={s.session_id}
                onClick={() => setSelected(s.session_id)}
                className="w-full text-left rounded-xl border px-3 py-3.5 transition-all"
                style={{
                  borderColor: isActive ? '#C96442' : '#e8e0d8',
                  backgroundColor: isActive ? '#fdf6f2' : '#fff',
                }}
              >
                {/* Nom du test */}
                <p className="text-xs font-semibold text-[#1a1209] leading-tight">{test.nom}</p>

                {/* Date */}
                <p className="text-xs text-[#aaa] mt-1">{dateFormatted}</p>

                {/* But du test */}
                <div className="mt-2 pt-2 border-t" style={{ borderColor: isActive ? '#f5dfd5' : '#f0ebe4' }}>
                  <p className="text-xs text-[#888] leading-snug">
                    <span className="font-semibold text-[#999]">But · </span>
                    {test.but}
                  </p>
                </div>

                {/* Score */}
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-xs font-bold text-[#1a1209]">{total.toFixed(0)}</span>
                  <span className="text-xs text-[#ccc]">/100</span>
                  {isActive && (
                    <span className="ml-auto text-xs font-semibold" style={{ color: '#C96442' }}>Affiché →</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* — COLONNE DROITE — résultats — */}
      <div className="flex-1 pl-8 overflow-y-auto">
        {selectedSession ? (
          <DiagnosticScreen
            key={selected}
            registres={selectedSession.session_data?.registres ?? {}}
            diagnostic={selectedSession.session_data?.diagnostic ?? {}}
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
