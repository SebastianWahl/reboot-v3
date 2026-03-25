import ProgressBar from '../ui/ProgressBar';

// Props: register (objet avec id, label, icon, intro, color), registerIndex (0-3), onStart (fn)
export default function IntroRegisterScreen({ register, registerIndex, onStart }) {
  const progressValue = registerIndex * 25; // 0%, 25%, 50%, 75%

  return (
    <div className="min-h-screen bg-[#fff8f0] flex flex-col">
      <ProgressBar value={progressValue} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center">
          {/* Icône */}
          <div className="text-6xl mb-6">{register.icon}</div>

          {/* Nom du registre */}
          <h2 className="text-3xl font-bold text-[#2d1a0e] mb-4">
            {register.label}
          </h2>

          {/* Intro */}
          <p className="text-lg text-[#2d1a0e]/70 mb-2">{register.intro}</p>
          <p className="text-sm text-[#2d1a0e]/50 mb-10">
            5 questions à répondre librement
          </p>

          {/* Bouton */}
          <button
            onClick={onStart}
            className="w-full bg-[#e07b39] hover:bg-[#c96a2a] text-white rounded-2xl py-4 text-lg font-bold transition-colors"
          >
            C'est parti →
          </button>
        </div>
      </div>
    </div>
  );
}
