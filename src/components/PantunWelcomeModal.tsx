import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, ArrowRight, RefreshCw, HeartHandshake } from 'lucide-react';
import { PANTUN_COLLECTION } from '../data/initialData';
import { speakTextIndonesian, stopSpeaking } from '../utils/audio';

interface PantunWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PantunWelcomeModal: React.FC<PantunWelcomeModalProps> = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const pantun = PANTUN_COLLECTION[currentIndex];

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  if (!isOpen) return null;

  const handleNextPantun = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setCurrentIndex((prev) => (prev + 1) % PANTUN_COLLECTION.length);
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToSpeak = `Selamat datang di PJJ Bahasa Indonesia kelas enam SDN 001 Sangatta Selatan. Dengarkan pantun ini: ${pantun.bait.join('. ')}. Mari kita absen hari ini dengan penuh semangat!`;
      speakTextIndonesian(textToSpeak, () => setIsSpeaking(false));
    }
  };

  const handleStartAttendance = () => {
    stopSpeaking();
    setIsSpeaking(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden text-slate-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pantun-title"
      >
        {/* Decorative Top Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-5 text-white text-center relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-sm" />
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-sm" />
          
          <div className="inline-flex items-center gap-2 bg-amber-400/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
            <span>Sambutan PJJ Ceria</span>
          </div>

          <h2 id="pantun-title" className="text-2xl font-bold font-fun tracking-wide text-white drop-shadow-sm">
            Selamat Pagi, Kelas 6!
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-0.5 font-medium">
            SDN 001 Sangatta Selatan · Bahasa Indonesia
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Pantun Frame */}
          <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-yellow-50/80 border-2 border-dashed border-amber-300 rounded-2xl p-5 text-center shadow-inner relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-0.5 rounded-full shadow-sm">
              {pantun.judul}
            </div>

            <div className="space-y-2 mt-2">
              {pantun.bait.map((baris, idx) => (
                <p 
                  key={idx} 
                  className={`text-base sm:text-lg font-medium tracking-tight ${
                    idx % 2 === 0 ? 'text-slate-800' : 'text-amber-800 font-semibold italic'
                  }`}
                >
                  "{baris}"
                </p>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-center gap-1.5 text-xs text-amber-800/80 font-medium">
              <HeartHandshake className="w-4 h-4 text-amber-600" />
              <span>{pantun.makna}</span>
            </div>
          </div>

          {/* Action Row: Listen voice & change pantun */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleToggleSpeak}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all border ${
                isSpeaking 
                  ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse' 
                  : 'bg-slate-100 hover:bg-amber-100 text-slate-700 border-slate-200'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-rose-600" />
                  <span>Hentikan Suara</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>Dengarkan Pantun</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNextPantun}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Pantun Lainnya</span>
            </button>
          </div>

          {/* Primary CTA: Start Attendance */}
          <button
            type="button"
            onClick={handleStartAttendance}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-base shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
          >
            <span>Mulai Isi Absensi Sekarang!</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Footer Note */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Siapkan senyum terbaikmu untuk foto kehadiran hari ini ya! 📸
          </p>
        </div>
      </div>
    </div>
  );
};
