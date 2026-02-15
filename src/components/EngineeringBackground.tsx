import { useEffect, useState } from 'react';

const EngineeringBackground = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const parallax = scrollY * 0.05;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Circuit trace SVGs */}
      <svg
        className="absolute inset-0 w-full h-full animate-pulse-glow"
        style={{ transform: `translateY(${parallax}px)` }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circuit traces */}
        <g stroke="#FFF2A8" strokeWidth="1" fill="none" opacity="0.14">
          {/* Horizontal traces */}
          <path d="M0 200 H200 L220 180 H400 L420 200 H600" />
          <path d="M100 400 H300 L320 420 H500 L520 400 H800" />
          <path d="M50 600 H250 L270 580 H450" />
          <path d="M200 100 H350 L370 120 H550 L570 100 H900" />

          {/* Vertical traces */}
          <path d="M300 0 V150 L320 170 V350" />
          <path d="M600 100 V300 L580 320 V500" />
          <path d="M150 200 V400 L170 420 V600" />

          {/* Nodes / connection points */}
          <circle cx="200" cy="200" r="4" fill="#FFF2A8" opacity="0.2" />
          <circle cx="400" cy="200" r="4" fill="#FFF2A8" opacity="0.2" />
          <circle cx="300" cy="350" r="4" fill="#FFF2A8" opacity="0.2" />
          <circle cx="600" cy="300" r="4" fill="#FFF2A8" opacity="0.2" />
          <circle cx="500" cy="400" r="4" fill="#FFF2A8" opacity="0.2" />
        </g>

        {/* Microchip */}
        <g stroke="#FFF2A8" strokeWidth="1" fill="none" opacity="0.12" transform="translate(700, 150)">
          <rect x="0" y="0" width="80" height="80" rx="4" />
          <rect x="15" y="15" width="50" height="50" rx="2" />
          {/* Pins */}
          {[10, 25, 40, 55, 70].map((x) => (
            <g key={`chip-${x}`}>
              <line x1={x} y1={0} x2={x} y2={-15} />
              <line x1={x} y1={80} x2={x} y2={95} />
            </g>
          ))}
          {[10, 25, 40, 55, 70].map((y) => (
            <g key={`chip-h-${y}`}>
              <line x1={0} y1={y} x2={-15} y2={y} />
              <line x1={80} y1={y} x2={95} y2={y} />
            </g>
          ))}
        </g>

        {/* Robot head outline */}
        <g stroke="#FFF2A8" strokeWidth="1" fill="none" opacity="0.1" transform="translate(900, 400)">
          <rect x="0" y="0" width="100" height="90" rx="12" />
          <circle cx="30" cy="35" r="12" />
          <circle cx="70" cy="35" r="12" />
          <line x1="35" y1="65" x2="65" y2="65" />
          <line x1="50" y1={-15} x2="50" y2="0" />
          <circle cx="50" cy={-20} r="5" />
          {/* Antenna */}
          <line x1={-10} y1="45" x2={-25} y2="45" />
          <line x1="110" y1="45" x2="125" y2="45" />
        </g>

        {/* Mechanical arm */}
        <g stroke="#FFF2A8" strokeWidth="1.5" fill="none" opacity="0.12" transform="translate(100, 700)">
          <line x1="0" y1="0" x2="60" y2={-80} />
          <line x1="60" y1={-80} x2="130" y2={-50} />
          <line x1="130" y1={-50} x2="160" y2={-90} />
          <circle cx="0" cy="0" r="8" />
          <circle cx="60" cy={-80} r="6" />
          <circle cx="130" cy={-50} r="6" />
          {/* Gripper */}
          <line x1="160" y1={-90} x2="150" y2={-110} />
          <line x1="160" y1={-90} x2="170" y2={-110} />
        </g>

        {/* AI Brain - right side */}
        <g stroke="#FFF2A8" strokeWidth="0.8" fill="none" opacity="0.1" transform="translate(1100, 600)">
          <ellipse cx="50" cy="40" rx="50" ry="40" />
          <path d="M20 30 Q35 15 50 30 Q65 15 80 30" />
          <path d="M15 45 Q35 55 50 45 Q65 55 85 45" />
          <line x1="50" y1="0" x2="50" y2="80" strokeDasharray="3,3" />
        </g>
      </svg>

      {/* Digital rain drip lines */}
      {[120, 340, 560, 780, 1000, 1200].map((x, i) => (
        <div
          key={i}
          className="absolute animate-drip"
          style={{
            left: `${x}px`,
            top: 0,
            width: '1px',
            height: '60px',
            background: 'linear-gradient(180deg, transparent, hsl(50, 100%, 83%, 0.3), transparent)',
            animationDelay: `${i * 1.3}s`,
            animationDuration: `${6 + i * 0.8}s`,
          }}
        />
      ))}

      {/* Ambient glow spots */}
      <div
        className="absolute rounded-full"
        style={{
          width: '400px',
          height: '400px',
          left: '10%',
          top: '20%',
          background: 'radial-gradient(circle, hsla(45, 100%, 70%, 0.03), transparent 70%)',
          transform: `translateY(${parallax * 0.5}px)`,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '500px',
          height: '500px',
          right: '5%',
          top: '50%',
          background: 'radial-gradient(circle, hsla(41, 100%, 50%, 0.03), transparent 70%)',
          transform: `translateY(${parallax * 0.3}px)`,
        }}
      />
    </div>
  );
};

export default EngineeringBackground;
