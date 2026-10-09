import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Wifi, Battery, Signal } from 'lucide-react';

export default function HomeScreen({ onOpenApp }) {
  const currentTime = new Date().toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-b from-slate-900 via-neutral-900 to-black text-white select-none">
      
      {/* Status Bar */}
      <div className="flex justify-between items-center text-xs font-semibold px-2 pt-2 opacity-80">
        <span>{currentTime}</span>
        <div className="flex items-center gap-2">
          <Signal size={14} />
          <Wifi size={14} />
          <Battery size={16} />
        </div>
      </div>

      {/* Clock Widget */}
      <div className="flex flex-col items-center justify-center text-center mt-12">
        <h1 className="text-6xl font-extralight tracking-tight">{currentTime}</h1>
        <p className="text-neutral-400 text-sm mt-2">1 yeni mesajınız var</p>
      </div>

      {/* WhatsApp App Icon */}
      <div className="mb-12 flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenApp}
          className="relative flex flex-col items-center cursor-pointer"
        >
          <div className="w-16 h-16 rounded-[20px] bg-gradient-to-tr from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-lg shadow-emerald-950/50 relative">
            <MessageCircle size={36} className="text-white fill-white" />

            {/* Notification Badge */}
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center ring-2 ring-neutral-900 shadow"
            >
              1
            </motion.div>
          </div>

          <span className="text-xs font-medium text-neutral-200 mt-2">
            WhatsApp
          </span>
        </motion.div>

        <p className="text-[11px] text-neutral-500 mt-6 animate-pulse">
          Mesajı okumak için dokunun
        </p>
      </div>

    </div>
  );
}