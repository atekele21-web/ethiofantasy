import React from 'react';

interface EthioTelecomLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const EthioTelecomLogo: React.FC<EthioTelecomLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Official Ethio Telecom curved swoosh / swirl symbol */}
      <svg
        viewBox="0 0 100 100"
        className={`${iconSizes[size]} shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer green arc */}
        <path
          d="M 50 12 A 38 38 0 0 1 85 55 C 80 48 70 42 56 42 C 40 42 28 50 22 62 A 38 38 0 0 1 50 12 Z"
          fill="#78b82a"
        />
        {/* Inner blue crescent */}
        <path
          d="M 22 62 C 28 50 40 42 56 42 C 70 42 80 48 85 55 A 38 38 0 0 1 50 88 A 38 38 0 0 1 22 62 Z"
          fill="#0072bc"
        />
        {/* Central white flowing curve */}
        <path
          d="M 25 58 C 35 48 48 45 60 46 C 72 47 80 52 83 55 C 75 50 65 47 52 48 C 38 49 29 55 25 58 Z"
          fill="#ffffff"
          opacity="0.9"
        />
      </svg>

      {/* Ethio Telecom typography */}
      <div className="flex flex-col text-left leading-none justify-center">
        <span
          className={`${textSizes[size]} font-black tracking-tight text-slate-900 font-sans`}
        >
          ethio telecom
        </span>
        {showSubtitle && (
          <span className="text-[9px] font-bold text-slate-500 font-sans tracking-tight -mt-0.5">
            ኢትዮ ቴሌኮም
          </span>
        )}
      </div>
    </div>
  );
};
