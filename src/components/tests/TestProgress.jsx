export default function TestProgress({ current, total, percent }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium" style={{ color: '#666' }}>
          Progression
        </span>
        <span className="text-sm" style={{ color: '#888' }}>
          {current} / {total}
        </span>
      </div>
      
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F5F0EA' }}>
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ 
            backgroundColor: '#C96442',
            width: `${percent}%`
          }}
        />
      </div>
      
      <div className="text-xs mt-2" style={{ color: '#888' }}>
        Temps estimé restant : ~{Math.ceil((total - current) * 2)} minutes
      </div>
    </div>
  );
}
