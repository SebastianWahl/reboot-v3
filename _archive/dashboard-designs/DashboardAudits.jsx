import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import DiagnosticScreen from '../screens/DiagnosticScreen';
import TestReportScreen from '../screens/TestReportScreen';
import { DEMO_INSTINCTIF_SESSION, DEMO_EMOTIONNEL_SESSION, DEMO_MENTAL_SESSION } from '../../lib/demoSessions';

// Métadonnées des tests
const TEST_META = {
  default: {
    nom: 'Audit des 4 registres',
    but: 'Cartographier les 4 registres cognitifs et identifier les priorités de travail personnalisées.',
  },
  instinctif: {
    nom: 'Audit Instinctif & Corporel',
    but: 'Évaluer l\'intelligence somatique, l\'intuition et l\'ancrage corporel.',
  },
  emotionnel: {
    nom: 'Audit Émotionnel & Relationnel',
    but: 'Évaluer l\'intelligence émotionnelle et la qualité des relations.',
  },
  mental: {
    nom: 'Audit Mental & Cognitif',
    but: 'Évaluer le fonctionnement mental, la pensée stratégique et le focus.',
  },
};


export default function DashboardAudits({ user, onViewSession }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [demoSession, setDemoSession] = useState(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('reboot_sessions')
      .select('session_id, date, session_data, test_type')
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

  if (sessions.length === 0 && !demoSession) {
    return (
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl border p-8 text-center mb-6" style={{ borderColor: '#e8e0d8' }}>
          <p className="text-sm text-[#888] mb-1">Aucun audit pour l'instant.</p>
          <p className="text-xs text-[#bbb] mb-6">Tes audits apparaîtront ici une fois complétés.</p>
          
          <p className="text-xs font-semibold text-[#999] uppercase tracking-wide mb-4">Voir un exemple de rapport</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setDemoSession({ type: 'instinctif', data: DEMO_INSTINCTIF_SESSION })}
              className="bg-[#C96442] text-white rounded-xl p-4 text-left hover:bg-[#b55338] transition-colors"
            >
              <span className="text-2xl mb-2 block">🫀</span>
              <p className="font-semibold text-sm">Audit Instinctif</p>
              <p className="text-xs opacity-90 mt-1">Score: 28/100</p>
              <p className="text-xs opacity-75">Clique pour voir le rapport complet</p>
            </button>
            
            <button
              onClick={() => setDemoSession({ type: 'emotionnel', data: DEMO_EMOTIONNEL_SESSION })}
              className="bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-xl p-4 text-left hover:opacity-90 transition-opacity"
            >
              <span className="text-2xl mb-2 block">💞</span>
              <p className="font-semibold text-sm">Audit Émotionnel</p>
              <p className="text-xs opacity-90 mt-1">Score: 35/100</p>
              <p className="text-xs opacity-75">Clique pour voir le rapport complet</p>
            </button>
            
            <button
              onClick={() => setDemoSession({ type: 'mental', data: DEMO_MENTAL_SESSION })}
              className="bg-gradient-to-br from-orange-400 to-amber-500 text-white rounded-xl p-4 text-left hover:opacity-90 transition-opacity"
            >
              <span className="text-2xl mb-2 block">🧠</span>
              <p className="font-semibold text-sm">Audit Mental</p>
              <p className="text-xs opacity-90 mt-1">Score: 52/100</p>
              <p className="text-xs opacity-75">Clique pour voir le rapport complet</p>
            </button>
          </div>
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
            const sessionData = s.session_data || {};
            const testType = s.test_type || sessionData.test_type;
            const registres = sessionData.registres ?? {};
            const scoreGlobal = sessionData.score_global || 
                               Object.values(registres).reduce((acc, r) => acc + (r.score ?? 0), 0);
            const isActive = selected === s.session_id;
            const test = TEST_META[testType] || TEST_META.default;
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
                  <span className="text-xs font-bold text-[#1a1209]">{Math.round(scoreGlobal)}</span>
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
        {demoSession ? (
          // Afficher la session démo
          <div>
            <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{ borderColor: '#e8e0d8' }}>
              <div>
                <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded mb-1">
                  🧪 MODE DÉMO
                </span>
                <p className="text-sm text-[#888]">Ceci est un rapport d'exemple généré avec des données de test</p>
              </div>
              <button
                onClick={() => setDemoSession(null)}
                className="text-sm text-[#C96442] hover:text-[#a55338] font-medium"
              >
                ✕ Fermer la démo
              </button>
            </div>
            <TestReportScreen
              sessionData={demoSession.data}
              testType={demoSession.type}
            />
          </div>
        ) : selectedSession ? (
          (() => {
            const testType = selectedSession.test_type || selectedSession.session_data?.test_type;
            const sessionData = selectedSession.session_data || selectedSession;
            
            // Pour les nouveaux tests (instinctif, emotionnel, mental)
            if (testType && ['instinctif', 'emotionnel', 'mental'].includes(testType)) {
              return (
                <TestReportScreen
                  key={selected}
                  sessionData={sessionData}
                  testType={testType}
                />
              );
            }
            
            // Pour l'audit des 4 registres (par défaut)
            return (
              <DiagnosticScreen
                key={selected}
                registres={sessionData?.registres || {}}
                diagnostic={sessionData?.diagnostic || {}}
                answers={sessionData?.answers || []}
              />
            );
          })()
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-[#bbb]">
            Sélectionne un audit à gauche.
          </div>
        )}
      </div>

    </div>
  );
}
