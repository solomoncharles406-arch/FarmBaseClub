import React from 'react';
import logoImg from '../assets/images/farm_base_club_3d_logo_1792792455668.jpg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  theme?: 'emerald' | 'red';
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '', theme = 'emerald' }) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const isRed = theme === 'red';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative shrink-0 ${sizeMap[size]} rounded-full p-[2px] ${
        isRed
          ? 'bg-gradient-to-br from-red-500 via-rose-600 to-red-800 shadow-lg shadow-red-950/80'
          : 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 shadow-lg shadow-black/80'
      }`}>
        <div className={`w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center border ${
          isRed ? 'border-red-500/40' : 'border-emerald-500/40'
        }`}>
          <img
            src={logoImg}
            alt="Farm Base Club Official Emblem"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Graceful high-fidelity SVG fallback if image fails to render
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <svg viewBox="0 0 100 100" class="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="46" stroke="${isRed ? '#ef4444' : '#10b981'}" stroke-width="2" fill="#000000"/>
                    <path d="M50 16L76 28V52C76 68 50 82 50 82C50 82 24 68 24 52V28L50 16Z" fill="${isRed ? '#991b1b' : '#15803d'}" stroke="${isRed ? '#ef4444' : '#10b981'}" stroke-width="2"/>
                    <path d="M50 30V66M40 44L50 34L60 44M36 56L50 42L64 56" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
                  </svg>
                `;
              }
            }}
          />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-base sm:text-lg font-black tracking-wider text-white uppercase flex items-center gap-1.5">
            Farm Base <span className={isRed ? 'text-red-500' : 'text-emerald-500'}>Club</span>
          </span>
          <span className="text-[10px] tracking-widest text-neutral-400 uppercase font-medium">
            Empowering Farmers · Harvesting Yields
          </span>
        </div>
      )}
    </div>
  );
};
