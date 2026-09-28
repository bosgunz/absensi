import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, BookOpen, UserCheck, Users, HelpCircle } from 'lucide-react';
import { getWitaTimeString } from '../data/initialData';

interface HeaderProps {
  activeTab: 'form' | 'rekap' | 'students' | 'info';
  setActiveTab: (tab: 'form' | 'rekap' | 'students' | 'info') => void;
  onOpenPantun: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenPantun
}) => {
  const [witaTime, setWitaTime] = useState<string>(getWitaTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setWitaTime(getWitaTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/70 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm font-fun font-bold text-lg">
              6
            </div>
            <div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('form');
                }}
                className="text-base sm:text-lg font-bold tracking-tight text-slate-900 block leading-tight font-fun hover:text-amber-600 transition-colors"
              >
                SDN 001 Sangatta Selatan
              </a>
              <span className="text-[11px] text-amber-800/80 font-medium block">
                Bahasa Indonesia · Kelas 6 PJJ
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'form'
                  ? 'bg-amber-100 text-amber-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-4 h-4 text-amber-600" />
              <span>Formulir Absen</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rekap')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'rekap'
                  ? 'bg-amber-100 text-amber-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Rekap Kehadiran</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('students')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'students'
                  ? 'bg-amber-100 text-amber-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4 text-amber-600" />
              <span>Daftar Siswa</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'info'
                  ? 'bg-amber-100 text-amber-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Petunjuk PJJ</span>
            </button>
          </nav>

          {/* Zone 3: Primary Actions (WITA Time & Pantun Launcher) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-bold">{witaTime}</span>
              <span className="text-[10px] text-slate-400">WITA</span>
            </div>

            <button
              type="button"
              onClick={onOpenPantun}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Pantun Semangat 📜</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`py-1 px-2 font-semibold rounded-lg ${
              activeTab === 'form' ? 'text-amber-700 font-bold bg-amber-50' : 'text-slate-600'
            }`}
          >
            Form Absen
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rekap')}
            className={`py-1 px-2 font-semibold rounded-lg ${
              activeTab === 'rekap' ? 'text-amber-700 font-bold bg-amber-50' : 'text-slate-600'
            }`}
          >
            Rekap Hadir
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('students')}
            className={`py-1 px-2 font-semibold rounded-lg ${
              activeTab === 'students' ? 'text-amber-700 font-bold bg-amber-50' : 'text-slate-600'
            }`}
          >
            Daftar Siswa
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-1 px-2 font-semibold rounded-lg ${
              activeTab === 'info' ? 'text-amber-700 font-bold bg-amber-50' : 'text-slate-600'
            }`}
          >
            Info PJJ
          </button>
        </div>
      </div>
    </header>
  );
};
