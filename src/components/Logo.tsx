import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 36, showText = true }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG Icon matching Image 1 Logo */}
      <svg
        width={size}
        height={(size * 44) / 36}
        viewBox="0 0 36 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
      >
        {/* Outer Pin Body */}
        <path
          d="M18 43C18 43 34 26.5 34 17C34 7.611 26.837 0 18 0C9.163 0 2 7.611 2 17C2 26.5 18 43 18 43Z"
          fill="#FAF8F0"
          stroke="#004D40"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />

        {/* Sun in top right */}
        <circle cx="23" cy="11" r="3.2" fill="#FFA726" />
        <path d="M23 6V7.5M23 14.5V16M18 11H19.5M26.5 11H28M19.5 7.5L20.5 8.5M25.5 13.5L26.5 14.5M19.5 14.5L20.5 13.5M25.5 8.5L26.5 7.5" stroke="#FFA726" strokeWidth="1" strokeLinecap="round" />

        {/* Background Green Foliage */}
        <path
          d="M23 23C23 19.5 26 17 28 17C30.5 17 32 19 32 22C32 26 27 28 24 28"
          fill="#A5D6A7"
          opacity="0.8"
        />

        {/* Shaded Canopy Walkway Structure */}
        <path
          d="M5 14C11 17 19 18 25 19L24 24C18 23 10 22 5 19Z"
          fill="#B0BEC5"
          opacity="0.6"
        />
        <path
          d="M5 14C11 17 19 18 25 19"
          stroke="#004D40"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Canopy Pillars */}
        <line x1="8" y1="16" x2="8" y2="28" stroke="#004D40" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="14" y1="17.5" x2="14" y2="26" stroke="#004D40" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="20" y1="18.5" x2="20" y2="25" stroke="#004D40" strokeWidth="1.8" strokeLinecap="round" />

        {/* Curved Path */}
        <path
          d="M9 30C15 28 20 25 26 24"
          stroke="#FAF8F0"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Stylized Walking Person in dark green */}
        {/* Head */}
        <circle cx="15" cy="22.5" r="1.5" fill="#004D40" />
        {/* Body & Walking Legs */}
        <path
          d="M15 24.5V28M15 25.5L13.5 27.5M15 25.5L16.5 27M15 28L13 31.5M15 28L16.5 31"
          stroke="#004D40"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Leaf / Botanical accent in bottom right */}
        <path
          d="M22 33C25 31 27 27 27 27C27 27 23 28 21 31Z"
          fill="#2E7D32"
        />
        <path
          d="M25 36C28 34 30 30 30 30C30 30 26 31 24 34Z"
          fill="#388E3C"
        />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-xl tracking-tight text-[#003178] leading-none flex items-center gap-1">
            RainRouter
          </span>
          <span className="text-[10px] font-semibold text-[#006b5f] uppercase tracking-wider mt-0.5">
            Singapore
          </span>
        </div>
      )}
    </div>
  );
};
