// RadarChart Futuristic - SVG custom with neon blue glow effect
export default function RadarChartFuturistic({ labels, values, totalScore }) {
  const center = { x: 100, y: 100 };
  const maxRadius = 80;
  
  const getPoint = (value, index, total) => {
    const angle = (index * 2 * Math.PI / total) - Math.PI / 2;
    const radius = (value / 25) * maxRadius;
    return {
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle)
    };
  };
  
  const points = values.map((val, i) => getPoint(val, i, values.length));
  const polygonPoints = points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  
  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '320px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Animation pulse style */}
      <style>{`
        @keyframes radarPulse {
          0%, 100% { 
            filter: drop-shadow(0 0 10px rgba(0, 245, 255, 0.5)) drop-shadow(0 0 20px rgba(0, 245, 255, 0.3));
          }
          50% { 
            filter: drop-shadow(0 0 20px rgba(0, 245, 255, 0.8)) drop-shadow(0 0 40px rgba(0, 245, 255, 0.5));
          }
        }
        .radar-container {
          animation: radarPulse 2s ease-in-out infinite;
        }
      `}</style>
      
      <svg 
        viewBox="0 0 200 200" 
        className="radar-container"
        style={{ 
          width: '280px', 
          height: '280px',
        }}
      >
        {/* Grid circles - all in neon blue */}
        <circle cx="100" cy="100" r="20" fill="none" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.3" />
        <circle cx="100" cy="100" r="40" fill="none" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.3" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.3" />
        <circle cx="100" cy="100" r="80" fill="none" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.4" />
        
        {/* Axes - all in neon blue */}
        <line x1="100" y1="20" x2="100" y2="180" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="20" y1="100" x2="180" y2="100" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="43" y1="43" x2="157" y2="157" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="43" y1="157" x2="157" y2="43" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.3" />
        
        {/* Data polygon with strong neon glow */}
        <polygon 
          points={polygonPoints}
          fill="rgba(0, 245, 255, 0.2)"
          stroke="#00f5ff"
          strokeWidth="2.5"
          style={{
            filter: 'drop-shadow(0 0 15px rgba(0, 245, 255, 1)) drop-shadow(0 0 30px rgba(0, 245, 255, 0.6))'
          }}
        />
        
        {/* Data points with glow */}
        {points.map((p, i) => (
          <circle 
            key={i}
            cx={p.x} 
            cy={p.y} 
            r="5" 
            fill="#00f5ff"
            stroke="#fff"
            strokeWidth="1.5"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(0, 245, 255, 1))'
            }}
          />
        ))}
      </svg>
      
      {/* Labels */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: "'Orbitron', sans-serif",
        fontSize: '12px',
        color: '#00f5ff',
        textAlign: 'center',
        textShadow: '0 0 10px rgba(0, 245, 255, 0.8)'
      }}>
        {labels[0] || 'Registre 1'}
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: "'Orbitron', sans-serif",
        fontSize: '12px',
        color: '#00f5ff',
        textAlign: 'center',
        textShadow: '0 0 10px rgba(0, 245, 255, 0.8)'
      }}>
        {labels[2] || 'Registre 3'}
      </div>
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '10px',
        transform: 'translateY(-50%)',
        fontFamily: "'Orbitron', sans-serif",
        fontSize: '12px',
        color: '#00f5ff',
        textAlign: 'left',
        textShadow: '0 0 10px rgba(0, 245, 255, 0.8)'
      }}>
        {labels[3] || 'Registre 4'}
      </div>
      
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '10px',
        transform: 'translateY(-50%)',
        fontFamily: "'Orbitron', sans-serif",
        fontSize: '12px',
        color: '#00f5ff',
        textAlign: 'right',
        textShadow: '0 0 10px rgba(0, 245, 255, 0.8)'
      }}>
        {labels[1] || 'Registre 2'}
      </div>
      
      {/* Center score */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <div style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '40px',
          fontWeight: '700',
          color: '#00f5ff',
          textShadow: '0 0 20px rgba(0, 245, 255, 1), 0 0 40px rgba(0, 245, 255, 0.6)'
        }}>
          {totalScore?.toFixed(1) || '0'}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#00f5ff',
          marginTop: '4px',
          textShadow: '0 0 10px rgba(0, 245, 255, 0.6)'
        }}>
          Score global
        </div>
      </div>
    </div>
  );
}