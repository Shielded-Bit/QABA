export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 1920 1080" 
        xmlns="http://www.w3.org/2000/svg" 
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
          {/* Enhanced gradients with better visibility */}
          <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#014d98", stopOpacity:0.6}} />
            <stop offset="30%" style={{stopColor:"#1e40af", stopOpacity:0.4}} />
            <stop offset="70%" style={{stopColor:"#2563eb", stopOpacity:0.5}} />
            <stop offset="100%" style={{stopColor:"#3ab7b1", stopOpacity:0.6}} />
          </linearGradient>
          
          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{stopColor:"#60a5fa", stopOpacity:0.9}} />
            <stop offset="30%" style={{stopColor:"#3ab7b1", stopOpacity:0.7}} />
            <stop offset="70%" style={{stopColor:"#2563eb", stopOpacity:0.4}} />
            <stop offset="100%" style={{stopColor:"#014d98", stopOpacity:0}} />
          </radialGradient>
          
          <radialGradient id="glowGradient2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{stopColor:"#22d3ee", stopOpacity:0.8}} />
            <stop offset="40%" style={{stopColor:"#06b6d4", stopOpacity:0.6}} />
            <stop offset="80%" style={{stopColor:"#0891b2", stopOpacity:0.3}} />
            <stop offset="100%" style={{stopColor:"#0c4a6e", stopOpacity:0}} />
          </radialGradient>
          
          <radialGradient id="brightGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{stopColor:"#a78bfa", stopOpacity:0.8}} />
            <stop offset="40%" style={{stopColor:"#8b5cf6", stopOpacity:0.6}} />
            <stop offset="80%" style={{stopColor:"#7c3aed", stopOpacity:0.3}} />
            <stop offset="100%" style={{stopColor:"#581c87", stopOpacity:0}} />
          </radialGradient>

          <radialGradient id="warmGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{stopColor:"#f59e0b", stopOpacity:0.7}} />
            <stop offset="40%" style={{stopColor:"#d97706", stopOpacity:0.5}} />
            <stop offset="80%" style={{stopColor:"#b45309", stopOpacity:0.2}} />
            <stop offset="100%" style={{stopColor:"#78350f", stopOpacity:0}} />
          </radialGradient>
          
          {/* Enhanced glow filters */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="strongGlow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="25" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="ultraGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="35" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Base dark background with enhanced gradient */}
        <rect width="100%" height="100%" fill="#0f172a"/>
        <rect width="100%" height="100%" fill="url(#primaryGradient)"/>
        
        {/* Large glowing orbs - much more visible */}
        <g opacity="1.0">
          <circle r="250" fill="url(#glowGradient)" filter="url(#ultraGlow)">
            <animateMotion dur="30s" repeatCount="indefinite">
              <path d="M200,300 Q800,100 1400,400 Q1600,700 1000,900 Q400,800 200,300"/>
            </animateMotion>
            <animate attributeName="r" values="220;300;220" dur="10s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.7;1.0;0.7" dur="8s" repeatCount="indefinite"/>
          </circle>
          
          <circle r="200" fill="url(#glowGradient2)" filter="url(#ultraGlow)">
            <animateMotion dur="35s" repeatCount="indefinite">
              <path d="M1500,200 Q500,300 300,700 Q600,1000 1200,800 Q1700,500 1500,200"/>
            </animateMotion>
            <animate attributeName="r" values="180;250;180" dur="14s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.6;0.9;0.6" dur="11s" repeatCount="indefinite"/>
          </circle>

          <circle r="180" fill="url(#brightGlow)" filter="url(#ultraGlow)">
            <animateMotion dur="28s" repeatCount="indefinite">
              <path d="M960,100 Q1600,400 1200,800 Q400,900 300,400 Q600,150 960,100"/>
            </animateMotion>
            <animate attributeName="r" values="150;220;150" dur="12s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="9s" repeatCount="indefinite"/>
          </circle>

          <circle r="160" fill="url(#warmGlow)" filter="url(#strongGlow)">
            <animateMotion dur="26s" repeatCount="indefinite">
              <path d="M500,800 Q1300,600 1600,200 Q900,100 400,500 Q200,700 500,800"/>
            </animateMotion>
            <animate attributeName="r" values="140;200;140" dur="15s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur="10s" repeatCount="indefinite"/>
          </circle>
        </g>
        
        {/* Medium floating particles - enhanced visibility */}
        <g opacity="0.9">
          <circle r="100" fill="#60a5fa" opacity="0.8" filter="url(#strongGlow)">
            <animateMotion dur="22s" repeatCount="indefinite">
              <path d="M100,600 Q900,200 1600,600 Q1400,900 600,1000 Q200,700 100,600"/>
            </animateMotion>
            <animate attributeName="opacity" values="0.6;1.0;0.6" dur="7s" repeatCount="indefinite"/>
            <animate attributeName="r" values="80;120;80" dur="8s" repeatCount="indefinite"/>
          </circle>
          
          <circle r="80" fill="#22d3ee" opacity="0.7" filter="url(#strongGlow)">
            <animateMotion dur="20s" repeatCount="indefinite">
              <path d="M1700,100 Q400,400 200,800 Q800,1100 1500,700 Q1800,300 1700,100"/>
            </animateMotion>
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="10s" repeatCount="indefinite"/>
            <animate attributeName="r" values="60;100;60" dur="12s" repeatCount="indefinite"/>
          </circle>
          
          <circle r="70" fill="#a78bfa" opacity="0.7" filter="url(#strongGlow)">
            <animateMotion dur="18s" repeatCount="indefinite">
              <path d="M800,50 Q1300,400 900,800 Q300,900 500,300 Q700,100 800,50"/>
            </animateMotion>
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="6s" repeatCount="indefinite"/>
            <animate attributeName="r" values="60;90;60" dur="9s" repeatCount="indefinite"/>
          </circle>

          <circle r="60" fill="#06b6d4" opacity="0.8" filter="url(#strongGlow)">
            <animateMotion dur="16s" repeatCount="indefinite">
              <path d="M1200,900 Q600,700 400,300 Q1000,200 1600,500 Q1400,800 1200,900"/>
            </animateMotion>
            <animate attributeName="opacity" values="0.6;1.0;0.6" dur="8s" repeatCount="indefinite"/>
            <animate attributeName="r" values="50;80;50" dur="11s" repeatCount="indefinite"/>
          </circle>

          <circle r="90" fill="#f59e0b" opacity="0.6" filter="url(#strongGlow)">
            <animateMotion dur="24s" repeatCount="indefinite">
              <path d="M300,500 Q1100,300 1400,800 Q800,1000 200,600 Q100,400 300,500"/>
            </animateMotion>
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="13s" repeatCount="indefinite"/>
            <animate attributeName="r" values="70;110;70" dur="16s" repeatCount="indefinite"/>
          </circle>
        </g>
        
        {/* Geometric shapes - much more visible */}
        <g opacity="0.8">
          <polygon points="0,-50 43,-25 43,25 0,50 -43,25 -43,-25" fill="none" stroke="#60a5fa" strokeWidth="4" filter="url(#glow)">
            <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0" to="360" dur="20s" repeatCount="indefinite"/>
            <animateMotion dur="25s" repeatCount="indefinite">
              <path d="M400,150 Q1200,300 1400,700 Q800,950 300,600 Q200,250 400,150"/>
            </animateMotion>
            <animate attributeName="opacity" values="0.6;1.0;0.6" dur="9s" repeatCount="indefinite"/>
            <animate attributeName="stroke-width" values="3;6;3" dur="7s" repeatCount="indefinite"/>
          </polygon>
          
          <polygon points="0,-40 35,-20 35,20 0,40 -35,20 -35,-20" fill="none" stroke="#22d3ee" strokeWidth="3.5" filter="url(#glow)">
            <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="360" to="0" dur="25s" repeatCount="indefinite"/>
            <animateMotion dur="28s" repeatCount="indefinite">
              <path d="M1400,800 Q600,900 300,400 Q700,100 1500,300 Q1600,600 1400,800"/>
            </animateMotion>
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="8s" repeatCount="indefinite"/>
            <animate attributeName="stroke-width" values="2.5;5;2.5" dur="10s" repeatCount="indefinite"/>
          </polygon>
          
          <rect x="-35" y="-35" width="70" height="70" fill="none" stroke="#a78bfa" strokeWidth="4" opacity="0.8" filter="url(#glow)">
            <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0" to="360" dur="22s" repeatCount="indefinite"/>
            <animateMotion dur="26s" repeatCount="indefinite">
              <path d="M500,100 Q1400,300 1200,900 Q400,1000 200,500 Q300,200 500,100"/>
            </animateMotion>
            <animate attributeName="opacity" values="0.6;1.0;0.6" dur="12s" repeatCount="indefinite"/>
            <animate attributeName="stroke-width" values="3;6;3" dur="8s" repeatCount="indefinite"/>
          </rect>
          
          <polygon points="0,-35 25,0 0,35 -25,0" fill="none" stroke="#06b6d4" strokeWidth="3.5" filter="url(#glow)">
            <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0" to="360" dur="24s" repeatCount="indefinite"/>
            <animateMotion dur="30s" repeatCount="indefinite">
              <path d="M800,200 Q1500,600 1100,1000 Q500,800 400,400 Q600,150 800,200"/>
            </animateMotion>
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="11s" repeatCount="indefinite"/>
            <animate attributeName="stroke-width" values="2.5;5;2.5" dur="9s" repeatCount="indefinite"/>
          </polygon>

          <polygon points="0,-30 52,-15 30,25 -30,25 -52,-15" fill="none" stroke="#f59e0b" strokeWidth="3" filter="url(#glow)">
            <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0" to="360" dur="18s" repeatCount="indefinite"/>
            <animateMotion dur="23s" repeatCount="indefinite">
              <path d="M1000,50 Q200,350 600,900 Q1300,750 1600,400 Q1200,150 1000,50"/>
            </animateMotion>
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="10s" repeatCount="indefinite"/>
            <animate attributeName="stroke-width" values="2;5;2" dur="7s" repeatCount="indefinite"/>
          </polygon>
        </g>
        
        {/* Enhanced grid overlay */}
        <g opacity="0.25">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#3ab7b1" strokeWidth="0.8" opacity="0.6"/>
              <circle cx="0" cy="0" r="2" fill="#60a5fa" opacity="0.4"/>
              <circle cx="100" cy="0" r="2" fill="#60a5fa" opacity="0.4"/>
              <circle cx="0" cy="100" r="2" fill="#60a5fa" opacity="0.4"/>
              <circle cx="100" cy="100" r="2" fill="#60a5fa" opacity="0.4"/>
            </pattern>
            <pattern id="dots" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill="#22d3ee" opacity="0.3">
                <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite"/>
              </circle>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#dots)" />
        </g>

        {/* Animated lines connecting elements */}
        <g opacity="0.3">
          <line x1="0" y1="0" x2="1920" y2="1080" stroke="#3ab7b1" strokeWidth="1" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="6s" repeatCount="indefinite"/>
            <animate attributeName="stroke-dasharray" values="0,2000;100,1900;0,2000" dur="8s" repeatCount="indefinite"/>
          </line>
          <line x1="1920" y1="0" x2="0" y2="1080" stroke="#60a5fa" strokeWidth="1" opacity="0.4">
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="7s" repeatCount="indefinite"/>
            <animate attributeName="stroke-dasharray" values="0,2000;100,1900;0,2000" dur="10s" repeatCount="indefinite"/>
          </line>
          <line x1="960" y1="0" x2="960" y2="1080" stroke="#a78bfa" strokeWidth="1" opacity="0.3">
            <animate attributeName="opacity" values="0.1;0.5;0.1" dur="9s" repeatCount="indefinite"/>
            <animate attributeName="stroke-dasharray" values="0,1080;50,1030;0,1080" dur="12s" repeatCount="indefinite"/>
          </line>
        </g>

        {/* Subtle noise texture - enhanced */}
        <g opacity="0.08">
          <filter id="noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence baseFrequency="0.9" numOctaves="2" seed="2" stitchTiles="stitch"/>
            <feColorMatrix values="0 0 0 0 0.2 0 0 0 0 0.6 0 0 0 0 0.8 0 0 0 1 0"/>
            <feComposite in2="SourceGraphic" operator="multiply"/>
          </filter>
          <rect width="100%" height="100%" fill="#60a5fa" filter="url(#noise)"/>
        </g>

        {/* Pulsing border effect */}
        <g opacity="0.4">
          <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="url(#primaryGradient)" strokeWidth="2">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="5s" repeatCount="indefinite"/>
            <animate attributeName="stroke-width" values="1;4;1" dur="7s" repeatCount="indefinite"/>
          </rect>
        </g>
      </svg>
    </div>
  );
}