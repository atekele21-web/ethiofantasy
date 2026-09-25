import React from 'react';

export const PromoBanner: React.FC = () => {
  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-b from-[#0a58ca] via-[#0b63dd] to-[#0448aa] pt-3 pb-6 px-4 select-none">
      {/* Background Star and Ray Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-2 left-6 text-white text-xs">★</div>
        <div className="absolute top-6 left-16 text-white text-base">★</div>
        <div className="absolute top-3 right-8 text-white text-xs">★</div>
        <div className="absolute top-8 right-20 text-white text-base">★</div>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-radial from-white/20 to-transparent rounded-full blur-xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* GoPlay / EthioFantasy Brand Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#1db954] shadow-md border border-emerald-300/40 mb-2">
          <span className="text-white font-black text-xl tracking-tight leading-none">
            Go<span className="text-emerald-100">Play</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-white ml-0.5 animate-pulse" />
        </div>

        {/* Subtitle Amharic Row: ሳምንታዊ (Weekly) & ወርሃዊ (Monthly) */}
        <div className="w-full max-w-xs flex items-center justify-between px-6 text-xs font-bold text-white/95 tracking-wide">
          <span>ሳምንታዊ</span>
          <span>ወርሃዊ</span>
        </div>

        {/* Big Bold Amharic Headline: ሽልማቶች (Prizes) */}
        <h2 className="text-4xl sm:text-5xl font-black text-white tracking-wider my-0.5 drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]">
          ሽልማቶች
        </h2>

        {/* Banknotes Stack Illustration */}
        <div className="relative w-64 h-24 mt-1 flex items-center justify-center">
          {/* Blue Curved Podium */}
          <div className="absolute bottom-0 w-60 h-10 bg-gradient-to-t from-[#023178] to-[#0d5ac9] rounded-[50%] border-t border-white/20 shadow-lg" />

          {/* Stacks of Ethiopian Birr Banknotes */}
          {/* Left Stack - 100 Birr purple notes */}
          <div className="absolute left-6 bottom-3 flex flex-col items-center rotate-[-8deg]">
            <div className="w-24 h-7 rounded bg-[#c084fc] border border-white/60 shadow-md flex items-center justify-between px-2 text-[8px] font-black text-purple-950 -mb-5">
              <span>100</span>
              <span className="text-[6px] tracking-tight">ETB</span>
              <span>100</span>
            </div>
            <div className="w-24 h-7 rounded bg-[#d8b4fe] border border-white/60 shadow-md flex items-center justify-between px-2 text-[8px] font-black text-purple-950 -mb-5">
              <span>100</span>
              <span className="text-[6px] tracking-tight">ETB</span>
              <span>100</span>
            </div>
            <div className="w-24 h-7 rounded bg-[#e9d5ff] border border-white/70 shadow-lg flex items-center justify-between px-2 text-[8px] font-black text-purple-950">
              <span className="font-mono">100</span>
              <span className="text-[7px] font-bold">ኢትዮጵያ ብር</span>
              <span className="font-mono">100</span>
            </div>
          </div>

          {/* Center Highest Stack - Bundles tied with band */}
          <div className="absolute z-10 bottom-4 flex flex-col items-center shadow-2xl">
            {/* Lower bundle layers */}
            <div className="w-28 h-7 rounded bg-[#e2e8f0] border border-white/80 shadow-md flex items-center justify-center -mb-5">
              <div className="w-8 h-full bg-slate-400/40" />
            </div>
            <div className="w-28 h-7 rounded bg-[#cbd5e1] border border-white/80 shadow-md flex items-center justify-center -mb-5">
              <div className="w-8 h-full bg-slate-400/40" />
            </div>
            {/* Top bundled stack with wrapper strap */}
            <div className="w-28 h-8 rounded bg-gradient-to-r from-[#f1f5f9] via-white to-[#f1f5f9] border border-white shadow-xl flex items-center justify-between px-2 relative overflow-hidden">
              <span className="text-[9px] font-black text-slate-900 font-mono">200</span>
              <div className="w-7 h-full bg-[#1e293b] text-white flex items-center justify-center text-[6px] font-bold uppercase tracking-tighter">
                ETB
              </div>
              <span className="text-[9px] font-black text-slate-900 font-mono">200</span>
            </div>
          </div>

          {/* Right Stack - 100/50 Birr notes */}
          <div className="absolute right-6 bottom-3 flex flex-col items-center rotate-[8deg]">
            <div className="w-24 h-7 rounded bg-[#c084fc] border border-white/60 shadow-md flex items-center justify-between px-2 text-[8px] font-black text-purple-950 -mb-5">
              <span>100</span>
              <span className="text-[6px]">ETB</span>
              <span>100</span>
            </div>
            <div className="w-24 h-7 rounded bg-[#d8b4fe] border border-white/60 shadow-md flex items-center justify-between px-2 text-[8px] font-black text-purple-950 -mb-5">
              <span>100</span>
              <span className="text-[6px]">ETB</span>
              <span>100</span>
            </div>
            <div className="w-24 h-7 rounded bg-[#e9d5ff] border border-white/70 shadow-lg flex items-center justify-between px-2 text-[8px] font-black text-purple-950">
              <span className="font-mono">100</span>
              <span className="text-[7px] font-bold">ኢትዮጵያ ብር</span>
              <span className="font-mono">100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
