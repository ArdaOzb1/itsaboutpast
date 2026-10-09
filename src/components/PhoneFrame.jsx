import React from 'react';

export default function PhoneFrame({ children }) {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-neutral-950 p-0 sm:p-4">
      {/* Telefon Gövdesi */}
      <div className="relative w-full h-full sm:w-[390px] sm:h-[844px] bg-black sm:rounded-[50px] shadow-2xl sm:ring-[12px] sm:ring-neutral-800 overflow-hidden flex flex-col border border-neutral-800/60">
        
        {/* Dynamic Island / Üst Hoparlör Barı (Sadece masaüstü çerçevede şık durur) */}
        <div className="hidden sm:flex absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 items-center justify-between px-3">
          <div className="w-3 h-3 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-950/60"></div>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800"></div>
        </div>

        {/* Ekran İçeriği */}
        <div className="w-full h-full flex flex-col relative overflow-hidden">
          {children}
        </div>

        {/* Alt Home Çizgisi */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-36 h-1 bg-white/30 rounded-full pointer-events-none z-50"></div>
      </div>
    </div>
  );
}