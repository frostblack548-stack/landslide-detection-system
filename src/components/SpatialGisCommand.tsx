import React, { useState } from 'react';
import { HazardZone, SensorNode, NerState } from '../types';
import { HAZARD_ZONES, SENSOR_NODES, ASSET_URLS } from '../data/mockData';
import {
  Layers,
  Crosshair,
  AlertTriangle,
  Radio,
  Sliders,
  Maximize2,
  Minimize2,
  Compass,
  Zap,
  TrendingUp,
  CloudRain,
  ShieldAlert,
  Send,
  Download,
  Info,
  ChevronRight,
  MapPin,
} from 'lucide-react';

interface SpatialGisCommandProps {
  selectedState: NerState;
  onNavigateToLstm: (zoneId: string) => void;
  onNavigateToDispatch: (zoneId: string) => void;
}

export const SpatialGisCommand: React.FC<SpatialGisCommandProps> = ({
  selectedState,
  onNavigateToLstm,
  onNavigateToDispatch,
}) => {
  const [selectedZone, setSelectedZone] = useState<HazardZone>(HAZARD_ZONES[0]);
  const [activeLayers, setActiveLayers] = useState({
    susceptibility: true,
    demContours: true,
    imdRadar: true,
    soilSaturation: true,
    sensorNodes: true,
  });
  const [is3DMode, setIs3DMode] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter hazard zones according to state
  const filteredZones =
    selectedState === 'all'
      ? HAZARD_ZONES
      : HAZARD_ZONES.filter((z) => z.state === selectedState);

  // Filter sensors
  const filteredSensors =
    selectedState === 'all'
      ? SENSOR_NODES
      : SENSOR_NODES.filter((s) => s.state === selectedState);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDroneDispatch = () => {
    showToast(`Drone Reconnaissance Flight Quad-402 dispatched to coordinates ${selectedZone.coords}. Realtime optical telemetry stream initializing.`);
  };

  const handleExportGeoJson = () => {
    const data = {
      type: 'FeatureCollection',
      name: selectedZone.name,
      properties: {
        riskStatus: selectedZone.riskStatus,
        displacementRate: selectedZone.displacementRate,
        soilPoreSaturation: selectedZone.soilPoreSaturation,
        coordinates: selectedZone.coords,
      },
      geometry: {
        type: 'Point',
        coordinates: [88.5134, 27.5312],
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedZone.id}-geotechnical-threat-vector.geojson`;
    a.click();
    showToast(`Exported GIS GeoJSON vector dataset for ${selectedZone.name}`);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#122131] text-[#90cfec] border border-[#44d8f1] px-4 py-3 rounded-lg shadow-xl shadow-cyan-950/80 flex items-center gap-3 font-sans text-xs sm:text-sm animate-bounce">
          <Zap className="w-4 h-4 text-[#ffb870] flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* KPI Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Metric 1 */}
        <div className="bg-[#0d1c2d] border border-[#1c2b3c] rounded-xl p-3 sm:p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8a9297] text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider">Active Threat Matrix</span>
            <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#ffb4ab]">4 RED ZONES</span>
            <span className="text-[11px] text-[#ffdad6] font-medium bg-[#93000a]/50 px-1.5 py-0.5 rounded">
              High Runout
            </span>
          </div>
          <p className="text-[11px] text-[#bfc8cd] mt-1 truncate">
            NH-10 Km 38.4 • Sohra Rim • Dima Hasao
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0d1c2d] border border-[#1c2b3c] rounded-xl p-3 sm:p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8a9297] text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider">24h Neural Trigger</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#ffb870]" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#ffb870]">89.4%</span>
            <span className="text-[11px] text-[#ffbc7a] font-medium bg-[#7d4800]/50 px-1.5 py-0.5 rounded">
              +14.2% Surge
            </span>
          </div>
          <p className="text-[11px] text-[#bfc8cd] mt-1 truncate">
            Rainfall threshold breach in Sikkim & Meghalaya
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0d1c2d] border border-[#1c2b3c] rounded-xl p-3 sm:p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8a9297] text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider">In-Situ IoT Mesh</span>
            <Radio className="w-3.5 h-3.5 text-[#44d8f1]" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#44d8f1]">148 Nodes</span>
            <span className="text-[11px] text-[#00363e] font-semibold bg-[#44d8f1] px-1.5 py-0.5 rounded">
              99.8% Online
            </span>
          </div>
          <p className="text-[11px] text-[#bfc8cd] mt-1 truncate">
            GSAT-7A / LoRa mesh sync active
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#0d1c2d] border border-[#1c2b3c] rounded-xl p-3 sm:p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8a9297] text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider">Doppler Radar Ingest</span>
            <CloudRain className="w-3.5 h-3.5 text-[#90cfec]" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#90cfec]">142 mm/24h</span>
            <span className="text-[11px] text-[#003546] font-semibold bg-[#90cfec] px-1.5 py-0.5 rounded">
              Severe Cell
            </span>
          </div>
          <p className="text-[11px] text-[#bfc8cd] mt-1 truncate">
            Mangan Doppler (IMD) lock • cloudburst cell
          </p>
        </div>
      </div>

      {/* Main Map & Geotechnical Readout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Interactive GIS Map Canvas (8 cols on large screen) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-[#0d1c2d] border border-[#1c2b3c] rounded-xl overflow-hidden relative shadow-lg">
            {/* Map Header Toolbar */}
            <div className="px-3.5 py-2.5 bg-[#122131]/90 border-b border-[#1c2b3c] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#44d8f1] animate-spin-slow" />
                <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                  Topographic GIS Vector Mesh (North Eastern Region)
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono text-[#44d8f1] bg-[#00363e] border border-[#00bcd4]/30 px-1.5 py-0.5 rounded">
                  DEM 30M ALOS PALSAR
                </span>
              </div>

              {/* Map Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIs3DMode(!is3DMode)}
                  className={`text-[11px] font-mono px-2 py-1 rounded border transition-all ${
                    is3DMode
                      ? 'bg-[#0d5c75] text-[#93d3ef] border-[#44d8f1]'
                      : 'bg-[#051424] text-[#8a9297] border-[#273647] hover:text-white'
                  }`}
                >
                  {is3DMode ? '3D OBLIQUE' : '2D TOP-DOWN'}
                </button>
                <button
                  onClick={() => setMapZoom(mapZoom === 1 ? 1.25 : 1)}
                  aria-label="Toggle map zoom magnification"
                  className="p-1 rounded bg-[#051424] text-[#8a9297] hover:text-white border border-[#273647]"
                >
                  {mapZoom > 1 ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Layer Toggles Strip */}
            <div className="px-3 py-1.5 bg-[#051424]/80 border-b border-[#1c2b3c] flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
              <span className="text-[10px] font-mono text-[#8a9297] flex items-center gap-1">
                <Layers className="w-3 h-3" /> LAYERS:
              </span>
              <button
                onClick={() =>
                  setActiveLayers((p) => ({ ...p, susceptibility: !p.susceptibility }))
                }
                className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-all ${
                  activeLayers.susceptibility
                    ? 'bg-[#93000a]/30 text-[#ffb4ab] border-[#93000a]'
                    : 'bg-transparent text-[#8a9297] border-[#273647]'
                }`}
              >
                Susceptibility AI
              </button>
              <button
                onClick={() =>
                  setActiveLayers((p) => ({ ...p, demContours: !p.demContours }))
                }
                className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-all ${
                  activeLayers.demContours
                    ? 'bg-[#0d5c75]/40 text-[#93d3ef] border-[#0d5c75]'
                    : 'bg-transparent text-[#8a9297] border-[#273647]'
                }`}
              >
                DEM Contours
              </button>
              <button
                onClick={() =>
                  setActiveLayers((p) => ({ ...p, imdRadar: !p.imdRadar }))
                }
                className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-all ${
                  activeLayers.imdRadar
                    ? 'bg-[#7d4800]/40 text-[#ffb870] border-[#7d4800]'
                    : 'bg-transparent text-[#8a9297] border-[#273647]'
                }`}
              >
                IMD Radar Influx
              </button>
              <button
                onClick={() =>
                  setActiveLayers((p) => ({ ...p, sensorNodes: !p.sensorNodes }))
                }
                className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-all ${
                  activeLayers.sensorNodes
                    ? 'bg-[#00363e]/40 text-[#44d8f1] border-[#00bcd4]/30'
                    : 'bg-transparent text-[#8a9297] border-[#273647]'
                }`}
              >
                IoT Boreholes (148)
              </button>
            </div>

            {/* Simulated Satellite GIS Canvas with Vector Overlays */}
            <div
              className={`relative h-[340px] sm:h-[420px] bg-[#051424] overflow-hidden transition-all duration-500 select-none ${
                is3DMode ? 'perspective-1000 rotate-x-6' : ''
              }`}
            >
              {/* Satellite Background Image */}
              <img
                src={ASSET_URLS.gisSatelliteMap}
                alt="Satellite Topography"
                className="w-full h-full object-cover opacity-60 mix-blend-luminosity filter contrast-125"
                style={{
                  transform: `scale(${mapZoom})`,
                  transition: 'transform 0.4s ease',
                }}
              />

              {/* Vector Grid & Coordinate HUD */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c2b3c22_1px,transparent_1px),linear-gradient(to_bottom,#1c2b3c22_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

              {/* Radar Doppler Precipitation Overlay (if enabled) */}
              {activeLayers.imdRadar && (
                <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_40%_35%,#ffb4ab55_0%,#ffb87033_45%,transparent_75%)] animate-pulse" />
              )}

              {/* Contour Elevation Isolines (SVG Vector) */}
              {activeLayers.demContours && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 50 120 Q 200 80 400 130 T 700 90"
                    fill="none"
                    stroke="#44d8f1"
                    strokeWidth="1"
                    strokeDasharray="4 3"
                  />
                  <path
                    d="M 80 160 Q 250 110 430 170 T 750 140"
                    fill="none"
                    stroke="#44d8f1"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M 120 220 Q 300 160 480 230 T 800 200"
                    fill="none"
                    stroke="#90cfec"
                    strokeWidth="1"
                  />
                  <path
                    d="M 160 280 Q 350 220 540 290 T 850 260"
                    fill="none"
                    stroke="#8a9297"
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                  />
                  {/* Road Corridor vector (NH-10) */}
                  <path
                    d="M 220 30 C 260 120 320 200 380 320 C 420 380 470 420 520 450"
                    fill="none"
                    stroke="#ffb870"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                  <text
                    x="250"
                    y="150"
                    fill="#ffb870"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    NH-10 TEESTA ARTERY
                  </text>
                </svg>
              )}

              {/* Interactive Hazard Zone Pins */}
              {filteredZones.map((zone) => {
                const isSelected = selectedZone.id === zone.id;
                return (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    style={{ top: zone.top, left: zone.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  >
                    {/* Pulsing Alert Waves */}
                    <div className="relative flex items-center justify-center">
                      <span
                        className={`animate-ping absolute inline-flex h-8 w-8 rounded-full opacity-75 ${
                          zone.isCritical ? 'bg-[#ffb4ab]' : 'bg-[#ffb870]'
                        }`}
                      />
                      <div
                        className={`relative w-7 h-7 rounded-full flex items-center justify-center border-2 transition-transform transform group-hover:scale-125 shadow-lg ${
                          isSelected
                            ? 'bg-white text-[#051424] border-[#44d8f1] scale-110'
                            : zone.isCritical
                            ? 'bg-[#93000a] text-white border-[#ffb4ab]'
                            : 'bg-[#7d4800] text-white border-[#ffb870]'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Zone Pin Tag */}
                    <div
                      className={`absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-tight shadow-md border ${
                        isSelected
                          ? 'bg-[#122131] text-[#44d8f1] border-[#44d8f1]'
                          : 'bg-[#051424]/90 text-white border-[#273647]'
                      }`}
                    >
                      {zone.name.split('(')[0]}
                    </div>
                  </div>
                );
              })}

              {/* Crosshair coordinate HUD overlay */}
              <div className="absolute bottom-3 left-3 bg-[#051424]/90 border border-[#1c2b3c] rounded px-2.5 py-1 text-[10px] font-mono text-[#bfc8cd] flex items-center gap-3 pointer-events-none">
                <span className="flex items-center gap-1">
                  <Crosshair className="w-3 h-3 text-[#44d8f1]" />
                  <span>TARGET LOCK: {selectedZone.coords}</span>
                </span>
                <span className="text-[#8a9297]">|</span>
                <span>ELEV: {selectedZone.elevation}</span>
                <span className="text-[#8a9297]">|</span>
                <span className="text-[#ffb870]">SLOPE: {selectedZone.slopeGradient}</span>
              </div>

              {/* North Arrow & Scale Bar */}
              <div className="absolute top-3 right-3 bg-[#051424]/90 border border-[#1c2b3c] rounded px-2 py-1 text-[10px] font-mono text-[#8a9297] flex flex-col items-center pointer-events-none">
                <div className="text-white font-bold text-xs">N ↑</div>
                <div className="w-12 h-1 bg-[#44d8f1] mt-1" />
                <span className="text-[9px] mt-0.5">2.5 km</span>
              </div>
            </div>

            {/* Bottom Status bar under map */}
            <div className="px-3.5 py-2 bg-[#0d1c2d] border-t border-[#1c2b3c] flex flex-wrap items-center justify-between text-xs text-[#8a9297] gap-2">
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-[#ffb4ab]">
                  <span className="w-2 h-2 rounded-full bg-[#ffb4ab]" />
                  CRITICAL RED: {filteredZones.filter((z) => z.isCritical).length}
                </span>
                <span className="flex items-center gap-1 text-[#ffb870]">
                  <span className="w-2 h-2 rounded-full bg-[#ffb870]" />
                  ADVISORY ORANGE: {filteredZones.filter((z) => !z.isCritical).length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#bfc8cd]">
                  Click zone pin to inspect geotechnical parameters
                </span>
              </div>
            </div>
          </div>

          {/* Subsurface Sensor Telemetry Stream Cards */}
          <div className="bg-[#0d1c2d] border border-[#1c2b3c] rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#44d8f1]" />
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  In-Situ Subsurface Telemetry Feed ({filteredSensors.length} Nodes)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#90cfec] bg-[#0d5c75]/40 px-2 py-0.5 rounded border border-[#0d5c75]">
                REFRESH: REAL-TIME (10s)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {filteredSensors.slice(0, 4).map((sensor) => (
                <div
                  key={sensor.id}
                  className="bg-[#122131] border border-[#1c2b3c] rounded-lg p-3 hover:border-[#44d8f1]/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-white">
                        {sensor.id}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1 rounded uppercase font-bold ${
                          sensor.status === 'critical'
                            ? 'bg-[#93000a] text-[#ffdad6]'
                            : sensor.status === 'torrential'
                            ? 'bg-[#7d4800] text-[#ffbc7a]'
                            : 'bg-[#00363e] text-[#44d8f1]'
                        }`}
                      >
                        {sensor.status}
                      </span>
                    </div>

                    <p className="text-[10px] text-[#8a9297] truncate mt-0.5">
                      {sensor.typeLabel}
                    </p>

                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-base font-bold font-mono text-[#d4e4fa]">
                        {sensor.currentValue}
                      </span>
                      <span className="text-[10px] font-mono text-[#8a9297]">
                        Warn: {sensor.warningThreshold}
                      </span>
                    </div>

                    {/* Progress Threshold bar */}
                    <div className="w-full h-1.5 bg-[#051424] rounded-full overflow-hidden mt-1.5">
                      <div
                        className={`h-full rounded-full ${
                          sensor.thresholdPercentage >= 100
                            ? 'bg-[#ffb4ab]'
                            : 'bg-[#44d8f1]'
                        }`}
                        style={{
                          width: `${Math.min(sensor.thresholdPercentage, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#1c2b3c] flex items-center justify-between text-[9px] font-mono text-[#8a9297]">
                    <span>Bat: {sensor.battery}</span>
                    <span>Sync: {sensor.lastSync}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Geotechnical Hazard Zone Inspector Drawer (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-[#0d1c2d] border border-[#1c2b3c] rounded-xl p-4 shadow-xl relative overflow-hidden">
            {/* Top Indicator */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2b3c]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab] animate-ping" />
                <span className="text-xs font-mono font-bold uppercase text-[#ffb4ab] tracking-wider">
                  {selectedZone.riskStatus}
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#44d8f1] bg-[#00363e] px-2 py-0.5 rounded border border-[#00bcd4]/30">
                {selectedZone.subDivision}
              </span>
            </div>

            {/* Title & Corridor */}
            <div className="mt-3">
              <h3 className="text-base font-bold text-white font-sans">
                {selectedZone.name}
              </h3>
              <p className="text-xs text-[#bfc8cd] flex items-center gap-1 mt-1 font-mono">
                <MapPin className="w-3.5 h-3.5 text-[#ffb870]" />
                {selectedZone.highwaySegment}
              </p>
            </div>

            {/* Geotechnical Parameters Matrix */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-[#122131] border border-[#1c2b3c] p-2.5 rounded-lg">
                <span className="text-[10px] font-mono text-[#8a9297] block uppercase">
                  Slope Gradient
                </span>
                <span className="text-base font-bold font-mono text-white">
                  {selectedZone.slopeGradient}
                </span>
                <span className="text-[9px] text-[#ffb4ab] block">Severe Incline</span>
              </div>

              <div className="bg-[#122131] border border-[#1c2b3c] p-2.5 rounded-lg">
                <span className="text-[10px] font-mono text-[#8a9297] block uppercase">
                  Pore Saturation
                </span>
                <span className="text-base font-bold font-mono text-[#ffb4ab]">
                  {selectedZone.soilPoreSaturation}
                </span>
                <span className="text-[9px] text-[#ffdad6] block">Critical Overpressure</span>
              </div>

              <div className="bg-[#122131] border border-[#1c2b3c] p-2.5 rounded-lg">
                <span className="text-[10px] font-mono text-[#8a9297] block uppercase">
                  Displacement Velocity
                </span>
                <span className="text-base font-bold font-mono text-[#ffb870]">
                  {selectedZone.displacementRate}
                </span>
                <span className="text-[9px] text-[#ffbc7a] block">Accelerating</span>
              </div>

              <div className="bg-[#122131] border border-[#1c2b3c] p-2.5 rounded-lg">
                <span className="text-[10px] font-mono text-[#8a9297] block uppercase">
                  AI Lead-Time Evac
                </span>
                <span className="text-base font-bold font-mono text-[#90cfec]">
                  {selectedZone.lstmEvac}
                </span>
                <span className="text-[9px] text-[#93d3ef] block">Confidence: {selectedZone.rfConfidence}</span>
              </div>
            </div>

            {/* Exposed Vulnerabilities Breakdown */}
            <div className="mt-4 bg-[#122131]/60 border border-[#1c2b3c] p-3 rounded-lg space-y-2 text-xs">
              <div className="flex items-start justify-between">
                <span className="text-[#8a9297] text-[11px]">Runout Impact Area:</span>
                <span className="font-semibold text-white text-right">
                  {selectedZone.populationRunout}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-[#8a9297] text-[11px]">Bridges / Arteries:</span>
                <span className="font-medium text-[#ffb870] text-right">
                  {selectedZone.bridgesExposed}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-[#8a9297] text-[11px]">GPS Centroid:</span>
                <span className="font-mono text-[#44d8f1] text-[11px]">
                  {selectedZone.coords}
                </span>
              </div>
            </div>

            {/* Drone Aerial Recon Preview */}
            <div className="mt-4 relative rounded-lg overflow-hidden border border-[#1c2b3c] group">
              <img
                src={ASSET_URLS.terrainOptical}
                alt="High-resolution Optical Drone Scan"
                className="w-full h-32 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#051424] via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-white">
                <span className="bg-[#051424]/80 px-1.5 py-0.5 rounded border border-[#273647]">
                  UAV QUAD-402 LIVE FEED
                </span>
                <span className="text-[#ffb4ab] font-bold">TENSION CRACK: 1.8M</span>
              </div>
            </div>

            {/* Fast Action Buttons */}
            <div className="mt-4 space-y-2">
              <button
                onClick={() => onNavigateToDispatch(selectedZone.id)}
                className="w-full py-2.5 px-3 bg-[#93000a] hover:bg-[#b00020] text-white font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>EXECUTE STAGE 3 EVACUATION</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDroneDispatch}
                  className="py-2 px-2 bg-[#122131] hover:bg-[#1c2b3c] text-[#44d8f1] border border-[#00bcd4]/40 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>DISPATCH DRONE</span>
                </button>

                <button
                  onClick={handleExportGeoJson}
                  className="py-2 px-2 bg-[#122131] hover:bg-[#1c2b3c] text-[#d4e4fa] border border-[#273647] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>EXPORT GEOJSON</span>
                </button>
              </div>

              <button
                onClick={() => onNavigateToLstm(selectedZone.id)}
                className="w-full py-2 px-3 bg-[#0d5c75] hover:bg-[#147492] text-[#93d3ef] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>OPEN TEMPORAL LSTM PREDICTOR</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
