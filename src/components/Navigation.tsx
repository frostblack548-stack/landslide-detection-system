import React from 'react';
import { OperationalModule } from '../types';
import { Map, Activity, Camera, BellRing, ChevronRight, Cpu } from 'lucide-react';

interface NavigationProps {
  activeModule: OperationalModule;
  onChangeModule: (module: OperationalModule) => void;
  reportCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeModule,
  onChangeModule,
  reportCount = 12,
}) => {
  const modules = [
    {
      id: 'spatial-gis-command' as OperationalModule,
      title: 'Spatial GIS Command',
      shortTitle: 'GIS Map',
      tag: 'GEO-MESH',
      icon: Map,
      badge: 'Live Vector',
      badgeColor: 'text-[#44d8f1] bg-[#00363e]/60 border-[#00bcd4]/30',
    },
    {
      id: 'temporal-lstm-predictor' as OperationalModule,
      title: 'Temporal LSTM Predictor',
      shortTitle: 'AI Predictor',
      tag: 'FoS 0.98 CRITICAL',
      icon: Activity,
      badge: 'Lead: 04h 31m',
      badgeColor: 'text-[#ffb4ab] bg-[#93000a]/40 border-[#ffb4ab]/30 animate-pulse',
    },
    {
      id: 'ml-models-pipeline' as OperationalModule,
      title: 'ML Models & Pipeline',
      shortTitle: 'ML Models',
      tag: 'RF ROC-AUC 0.896',
      icon: Cpu,
      badge: '19 Datasets',
      badgeColor: 'text-[#53e8a6] bg-[#003822]/50 border-[#53e8a6]/30',
    },
    {
      id: 'crowdsource-cv-verification' as OperationalModule,
      title: 'Crowdsource CV Verification',
      shortTitle: 'Crowd CV',
      tag: 'YOLOv8 + Bhashini',
      icon: Camera,
      badge: `${reportCount} Pending`,
      badgeColor: 'text-[#ffb870] bg-[#7d4800]/40 border-[#ffb870]/30',
    },
    {
      id: 'emergency-broadcast-and-dispatch' as OperationalModule,
      title: 'Emergency Broadcast & Dispatch',
      shortTitle: 'CAP Alert',
      tag: 'CAP SMS • SDMA',
      icon: BellRing,
      badge: '7 Lang Matrix',
      badgeColor: 'text-[#90cfec] bg-[#0d5c75]/50 border-[#90cfec]/30',
    },
  ];

  return (
    <nav className="bg-[#0d1c2d] border-b border-[#1c2b3c] sticky top-[73px] z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-1.5 gap-1.5 sm:gap-2">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onChangeModule(m.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all relative cursor-pointer ${
                  isActive
                    ? 'bg-[#1c2b3c] text-white border border-[#44d8f1]/40 shadow-sm shadow-cyan-950/50'
                    : 'text-[#bfc8cd] hover:text-white hover:bg-[#122131] border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-transform ${
                    isActive ? 'text-[#44d8f1] scale-110' : 'text-[#8a9297]'
                  }`}
                />
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-semibold whitespace-nowrap hidden sm:inline">
                    {m.title}
                  </span>
                  <span className="font-semibold whitespace-nowrap sm:hidden">
                    {m.shortTitle}
                  </span>
                  <span className="text-[10px] text-[#8a9297] font-mono whitespace-nowrap hidden md:inline">
                    {m.tag}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border whitespace-nowrap ml-1 ${m.badgeColor}`}
                >
                  {m.badge}
                </span>

                {isActive && (
                  <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-8 h-[2px] bg-[#44d8f1] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
