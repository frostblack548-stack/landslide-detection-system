import React, { useState, useEffect } from 'react';
import { NerState } from '../types';
import { ASSET_URLS } from '../data/mockData';
import { sirenPlayer } from '../utils/audioSiren';
import { Volume2, VolumeX, ShieldAlert, Radio, Clock, PhoneCall, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  selectedState: NerState;
  onSelectState: (state: NerState) => void;
  onOpenQuickEvac?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedState,
  onSelectState,
  onOpenQuickEvac,
  theme,
  onToggleTheme,
}) => {
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-IN', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Kolkata',
        }) + ' IST'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return sirenPlayer.subscribe((playing) => setIsSirenActive(playing));
  }, []);

  const handleToggleSiren = () => {
    sirenPlayer.toggle();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#1c2b3c] bg-[#051424]/95 backdrop-blur-md">
      {/* Top Emergency Action Marquee */}
      <div className="flex items-center justify-between px-3 md:px-6 py-1 bg-[#93000a]/30 border-b border-[#93000a]/40 text-xs">
        <div className="flex items-center gap-2 text-[#ffb4ab] font-mono tracking-wide truncate">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb4ab] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffb4ab]"></span>
          </span>
          <span className="font-bold uppercase tracking-wider text-[11px] text-white bg-[#93000a] px-1.5 py-0.5 rounded">
            STAGE 3 CRITICAL
          </span>
          <span className="truncate hidden sm:inline">
            NH-10 MANGAN (Km 38.4) • PORE SATURATION 92.4% • FOILING RESISTANCE AT CRITICAL LIMIT (FoS 0.98)
          </span>
          <span className="truncate sm:hidden">
            NH-10 Km 38.4 • FoS 0.98 CRITICAL
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#90cfec] flex-shrink-0">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-[#bfc8cd]">
            <PhoneCall className="w-3.5 h-3.5 text-[#ffb870]" />
            <span className="font-mono text-[11px]">
              SDMA: <strong className="text-white">1077</strong> | NDMA: <strong className="text-white">1070</strong>
            </span>
          </div>

          <button
            onClick={onOpenQuickEvac}
            className="text-[11px] font-semibold text-[#003546] bg-[#90cfec] hover:bg-white px-2.5 py-0.5 rounded transition-all flex items-center gap-1 shadow-sm"
          >
            <ShieldAlert className="w-3 h-3" />
            <span>DISPATCH CAP</span>
          </button>
        </div>
      </div>

      {/* Main Command Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Emblem & Branding */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <img
            src={ASSET_URLS.emblem}
            alt="National Emblem of India"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain brightness-110 drop-shadow flex-shrink-0"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-wide leading-tight uppercase font-sans">
                LEWS NER
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-mono uppercase bg-[#1c2b3c] text-[#44d8f1] border border-[#00bcd4]/30 px-1.5 py-0.5 rounded">
                COMMAND HQ
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#bfc8cd] font-medium leading-none tracking-normal">
              Landslide Early Warning System • MDoNER / Govt of India
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* State Filter Selector */}
          <div className="relative hidden lg:block">
            <select
              value={selectedState}
              onChange={(e) => onSelectState(e.target.value as NerState)}
              aria-label="Filter command sector by state"
              className="bg-[#122131] text-xs font-semibold text-[#d4e4fa] border border-[#273647] rounded-md px-2.5 py-1.5 pr-7 appearance-none cursor-pointer hover:border-[#44d8f1]/50 focus:outline-none focus:border-[#44d8f1]"
            >
              <option value="all">ALL NER STATES (8 SECTORS)</option>
              <option value="sikkim">SIKKIM (TEESTA BASIN)</option>
              <option value="assam">ASSAM (DIMA HASAO)</option>
              <option value="meghalaya">MEGHALAYA (SOHRA RIM)</option>
              <option value="arunachal">ARUNACHAL PRADESH (KAMENG)</option>
              <option value="manipur">MANIPUR (TUPUL / NONEY)</option>
              <option value="mizoram">MIZORAM (AIZAWL HILLS)</option>
              <option value="nagaland">NAGALAND (KOHIMA ESCARPMENT)</option>
              <option value="tripura">TRIPURA (JAMPUI HILLS)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#8a9297]">
              <span className="text-[10px]">▼</span>
            </div>
          </div>

          {/* Telemetry Status badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#0d1c2d] border border-[#1c2b3c] px-2.5 py-1 rounded-md text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-[#44d8f1] animate-pulse" />
            <span className="text-[11px] text-[#bfc8cd]">GSAT-7A</span>
            <span className="text-[10px] text-[#44d8f1] bg-[#00363e] px-1 rounded font-bold">LOCKED</span>
          </div>

          {/* Live UTC+5:30 Clock */}
          <div className="hidden md:flex items-center gap-1 text-xs font-mono text-[#8a9297] bg-[#122131] border border-[#1c2b3c] px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5 text-[#90cfec]" />
            <span className="text-[11px] text-[#d4e4fa]">{timeString || '11:46:20 IST'}</span>
          </div>

          {/* Theme Toggle Button (Dark / Light) */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle visual theme mode"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md border transition-all cursor-pointer shadow-sm ${
              theme === 'light'
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                : 'bg-[#122131] hover:bg-[#1c2b3c] text-[#ffb870] border-[#273647]'
            }`}
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
                <span className="text-[11px] font-mono tracking-tight font-bold text-amber-900">LIGHT</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#44d8f1]" />
                <span className="text-[11px] font-mono tracking-tight text-[#d4e4fa]">DARK</span>
              </>
            )}
          </button>

          {/* Audio Siren Simulation Button */}
          <button
            onClick={handleToggleSiren}
            title={isSirenActive ? 'Stop Emergency Acoustic Siren' : 'Trigger Acoustic Siren Simulation'}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md border transition-all ${
              isSirenActive
                ? 'bg-[#93000a] text-white border-red-400 animate-pulse shadow-lg shadow-red-900/50'
                : 'bg-[#122131] hover:bg-[#1c2b3c] text-[#ffb870] border-[#7d4800]/50'
            }`}
          >
            {isSirenActive ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="text-[11px] font-mono tracking-tight">SIREN WAILING</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span className="text-[11px] font-mono tracking-tight hidden sm:inline">TEST SIREN</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
