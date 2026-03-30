import { REGISTERS } from '../../data/questions';

export default function AuditOverviewScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-[#fff8f0] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">

          {/* En-tête */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#2d1a0e] mb-3">
              Ton audit cognitif
            </h2>
            <p className="text-[#2d1a0e]/60 text-base">
              20 questions · 4 registres · ~20 min
            </p>
          </div>

          {/* Les 4 registres */}
          <div className="space-y-3 mb-10">
            {REGISTERS.map((register) => (
              <div
                key={register.id}
                className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm"
              >
                <span className="text-3xl">{register.icon}</span>
                <div>
                  <p className="font-semibold text-[#2d1a0e]">{register.label}</p>
                  <p className="text-sm text-[#2d1a0e]/55">{register.intro}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <p className="text-center text-sm text-[#2d1a0e]/45 mb-8">
            Réponds librement — il n'y a pas de bonnes ou mauvaises réponses.
            L'IA analyse ensuite tes réponses pour produire un profil personnalisé.
          </p>

          {/* CTA */}
          <button
            onClick={onStart}
            className="w-full bg-[#e07b39] hover:bg-[#c96a2a] text-white rounded-2xl py-4 text-lg font-bold transition-colors"
          >
            Commencer l'audit →
          </button>

        </div>
      </div>
    </div>
  );
}
