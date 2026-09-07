/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { OperationalModule, NerState } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { SpatialGisCommand } from './components/SpatialGisCommand';
import { TemporalLstmPredictor } from './components/TemporalLstmPredictor';
import { CrowdsourceCvVerification } from './components/CrowdsourceCvVerification';
import { BroadcastAndDispatch } from './components/BroadcastAndDispatch';
import { FieldReportModal } from './components/FieldReportModal';
import { ASSET_URLS } from './data/mockData';
import { PlusCircle, Shield, AlertTriangle, Radio, Phone, Zap } from 'lucide-react';

export default function App() {
  const [activeModule, setActiveModule] = useState<OperationalModule>('spatial-gis-command');
  const [selectedState, setSelectedState] = useState<NerState>('all');
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [globalToast, setGlobalToast] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('lews-theme');
      return saved === 'light' || saved === 'dark' ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('lews-theme', next);
      } catch {}
      return next;
    });
  };

  const triggerGlobalToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 4000);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        theme === 'light'
          ? 'theme-light bg-slate-50 text-slate-900 selection:bg-cyan-100 selection:text-cyan-900'
          : 'bg-[#051424] text-[#d4e4fa] selection:bg-[#0d5c75] selection:text-[#93d3ef]'
      }`}
    >
      {/* Institutional Top Header */}
      <Header
        selectedState={selectedState}
        onSelectState={setSelectedState}
        onOpenQuickEvac={() => setActiveModule('emergency-broadcast-and-dispatch')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Operational Module Navigation Tabs */}
      <Navigation
        activeModule={activeModule}
        onChangeModule={setActiveModule}
        reportCount={12}
      />

      {/* Main Screen Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-4">
        {activeModule === 'spatial-gis-command' && (
          <SpatialGisCommand
            selectedState={selectedState}
            onNavigateToLstm={(zoneId) => setActiveModule('temporal-lstm-predictor')}
            onNavigateToDispatch={(zoneId) =>
              setActiveModule('emergency-broadcast-and-dispatch')
            }
          />
        )}

        {activeModule === 'temporal-lstm-predictor' && (
          <TemporalLstmPredictor
            onArmEvacuation={() => setActiveModule('emergency-broadcast-and-dispatch')}
          />
        )}

        {activeModule === 'crowdsource-cv-verification' && (
          <CrowdsourceCvVerification
            onForwardToCap={(reportCode) => {
              setActiveModule('emergency-broadcast-and-dispatch');
              triggerGlobalToast(`CAP Alert pre-filled with incident parameters from ${reportCode}`);
            }}
          />
        )}

        {activeModule === 'emergency-broadcast-and-dispatch' && (
          <BroadcastAndDispatch
            onSirenTriggered={() =>
              triggerGlobalToast('Stage 3 High-Decibel Acoustic Warning Siren Active across 6 towers')
            }
          />
        )}
      </main>

      {/* Floating Action Button: Citizen Field Report Upload */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsFieldModalOpen(true)}
          className="flex items-center gap-2 bg-[#44d8f1] hover:bg-white text-[#00363e] px-3.5 py-2.5 rounded-full shadow-2xl shadow-cyan-950 font-bold text-xs sm:text-sm transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="font-mono">SUBMIT FIELD REPORT</span>
        </button>
      </div>

      {/* Global Toast Alert */}
      {globalToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#122131] text-[#90cfec] border border-[#44d8f1] px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 font-sans text-xs sm:text-sm animate-fade-in">
          <Zap className="w-4 h-4 text-[#ffb870] flex-shrink-0" />
          <span>{globalToast}</span>
        </div>
      )}

      {/* Citizen Field Report Submission Modal */}
      <FieldReportModal
        isOpen={isFieldModalOpen}
        onClose={() => setIsFieldModalOpen(false)}
        onSubmitSuccess={triggerGlobalToast}
      />

      {/* Institutional National Footer */}
      <footer className="border-t border-[#1c2b3c] bg-[#010f1f] py-6 px-3 sm:px-6 text-xs text-[#8a9297] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={ASSET_URLS.emblem}
              alt="Government of India"
              className="w-8 h-8 object-contain brightness-110"
            />
            <div>
              <div className="font-bold text-white uppercase text-[11px] font-sans">
                National Landslide Early Warning System (LEWS NER)
              </div>
              <div className="text-[10px] text-[#bfc8cd]">
                Ministry of Development of North Eastern Region (MDoNER) • Geological Survey of India (GSI)
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
            <span>GSAT-7A Telemetry Mesh</span>
            <span className="text-[#273647]">|</span>
            <span>IMD Doppler Influx Lock</span>
            <span className="text-[#273647]">|</span>
            <span>Sec 30 Disaster Mgmt Act 2005</span>
            <span className="text-[#273647]">|</span>
            <span className="text-[#ffb870]">Toll Free: 1070 / 1077</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
