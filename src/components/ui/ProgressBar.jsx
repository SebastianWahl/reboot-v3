// Props: value (0-100), color (string, default '#e07b39')
export default function ProgressBar({ value, color = '#e07b39' }) {
  return (
    <div className="w-full h-1 bg-orange-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
      />
    </div>
  );
}
