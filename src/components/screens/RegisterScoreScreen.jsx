// Props:
// register: { label, icon, color }
// registerScore: number
// onConfirm: fn()
export default function RegisterScoreScreen({ register, registerScore, onConfirm }) {
  const pct = Math.round(((registerScore ?? 0) / 25) * 100);

  return (
    <div className="min-h-screen bg-[#fff8f0] flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full text-center space-y-8">
        {/* Icône + registre */}
        <div>
          <div className="text-6xl mb-3">{register.icon}</div>
          <h2 className="text-2xl font-bold text-[#2d1a0e]">Registre {register.label}</h2>
          <p className="text-sm text-[#2d1a0e]/50 mt-1">terminé</p>
        </div>

        {/* Score */}
        <div className="bg-white rounded-2xl shadow-sm py-8 px-6">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-6xl font-bold" style={{ color: register.color }}>
              {registerScore?.toFixed(1) ?? '—'}
            </span>
            <span className="text-xl text-[#2d1a0e]/40">/25</span>
          </div>
          <div className="mt-4 h-2 bg-orange-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, backgroundColor: register.color }}
            />
          </div>
          <p className="text-xs text-[#2d1a0e]/40 mt-2">{pct}%</p>
        </div>

        <p className="text-sm text-[#2d1a0e]/60">
          L'analyse détaillée de ce registre apparaîtra dans ton diagnostic final.
        </p>

        <button
          onClick={onConfirm}
          className="w-full bg-[#e07b39] hover:bg-[#c96a2a] text-white rounded-2xl py-4 text-lg font-bold transition-colors"
        >
          Continuer →
        </button>
      </div>
    </div>
  );
}
