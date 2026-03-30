import { useState, useEffect } from 'react';

export default function TestLoading() {
  const [step, setStep] = useState(0);
  
  const steps = [
    'Analyse des patterns détectés...',
    'Identification des forces...',
    'Génération des recommandations...',
    'Préparation du rapport personnalisé...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev + 1) % steps.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="text-center max-w-md">
        {/* Spinner animé */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div 
            className="absolute inset-0 rounded-full border-4"
            style={{ borderColor: '#F5F0EA' }}
          />
          <div 
            className="absolute inset-0 rounded-full border-4 border-t-[#C96442] animate-spin"
            style={{ 
              borderColor: 'transparent',
              borderTopColor: '#C96442'
            }}
          />
        </div>

        <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "'EB Garamond', Georgia, serif", color: '#1A1209' }}>
          Doctor Claude analyse tes réponses...
        </h2>
        
        <p className="text-sm mb-8" style={{ color: '#888' }}>
          Cela prend 10-20 secondes
        </p>

        {/* Étapes progressives */}
        <div className="space-y-3 text-left">
          {steps.map((text, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 text-sm transition-all duration-500"
              style={{ 
                color: index <= step ? '#1A1209' : '#888',
                opacity: index <= step ? 1 : 0.5,
                transform: index === step ? 'translateX(8px)' : 'translateX(0)'
              }}
            >
              <span 
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ 
                  backgroundColor: index < step ? '#C96442' : (index === step ? '#C96442' : '#E8E0D8'),
                  color: index <= step ? 'white' : '#888'
                }}
              >
                {index < step ? '✓' : (index + 1)}
              </span>
              <span className={index === step ? 'font-medium' : ''}>
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* Barre de progression indéterminée */}
        <div className="mt-8 h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#F5F0EA' }}>
          <div 
            className="h-full rounded-full animate-pulse"
            style={{ 
              backgroundColor: '#C96442',
              width: '60%',
              animation: 'slide 2s infinite'
            }}
          />
        </div>

        <style>{`
          @keyframes slide {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    </div>
  );
}
