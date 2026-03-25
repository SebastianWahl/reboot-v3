// Props: score (number), onChange (fn(delta)), min=0, max=10
export default function ScoreAdjuster({ score, onChange, min = 0, max = 10 }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(-0.5)}
        disabled={score <= min}
        className="w-8 h-8 rounded-full border border-orange-300 text-orange-600 font-bold disabled:opacity-30 hover:bg-orange-50 transition-colors"
      >
        −
      </button>
      <span className="text-2xl font-bold text-[#2d1a0e] min-w-[3rem] text-center">
        {score.toFixed(1)}
      </span>
      <button
        onClick={() => onChange(0.5)}
        disabled={score >= max}
        className="w-8 h-8 rounded-full border border-orange-300 text-orange-600 font-bold disabled:opacity-30 hover:bg-orange-50 transition-colors"
      >
        +
      </button>
    </div>
  );
}
