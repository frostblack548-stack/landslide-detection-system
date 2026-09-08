import React, { useState, useEffect } from 'react';
import {
  HazardZone,
  SensorNode,
  NerState,
  HistoricalLandslideEvent,
  ZoneMlRiskEvaluation,
  MlHeatmapPoint,
} from '../types';
import { HAZARD_ZONES, SENSOR_NODES, ASSET_URLS } from '../data/mockData';
import { LandslideApi } from '../services/api';
import { GisMapContainer } from './GisMapContainer';
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
  Cpu,
  Sparkles,
  Flame,
} from 'lucide-react';

interface SpatialGisCommandProps {
  selectedState: NerState;
  onNavigateToLstm: (zoneId: string) => void;
  onNavigateToDispatch: (zoneId: string) => void;
  onNavigateToMlPipeline?: () => void;
}

export const SpatialGisCommand: React.FC<SpatialGisCommandProps> = ({
  selectedState,
  onNavigateToLstm,
  onNavigateToDispatch,
  onNavigateToMlPipeline,
}) => {
  const [selectedZone, setSelectedZone] = useState<HazardZone>(HAZARD_ZONES[0]);
  const [activeLayers, setActiveLayers] = useState({
    susceptibility: true,
    demContours: true,
    imdRadar: true,
    soilSaturation: true,
    sensorNodes: true,
    mlInference: true,
    trainingEvents: true,
    mlHeatmap: true,
  });
  const [is3DMode, setIs3DMode] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [zones, setZones] = useState<HazardZone[]>(HAZARD_ZONES);
  const [sensors, setSensors] = useState<SensorNode[]>(SENSOR_NODES);
  const [trainingEvents, setTrainingEvents] = useState<HistoricalLandslideEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalLandslideEvent | null>(null);
  const [zoneMlRisk, setZoneMlRisk] = useState<ZoneMlRiskEvaluation | null>(null);
  const [stressRainfall, setStressRainfall] = useState<number>(0);
  const [heatmapPoints, setHeatmapPoints] = useState<MlHeatmapPoint[]>([]);

  useEffect(() => {
    let active = true;
    LandslideApi.getHazardZones(selectedState).then((data) => {
      if (active && data && data.length > 0) {
        setZones(data);
        setSelectedZone(data[0]);
      }
    });
    LandslideApi.getSensors(selectedState).then((data) => {
      if (active && data && data.length > 0) {
        setSensors(data);
      }
    });
    LandslideApi.getHistoricalTrainingEvents(selectedState).then((events) => {
      if (active && events) {
        setTrainingEvents(events);
      }
    });
    return () => {
      active = false;
    };
  }, [selectedState]);

  // Live ML evaluation for the selected zone
  useEffect(() => {
    let active = true;
    if (selectedZone?.id) {
      LandslideApi.getZoneMlRisk(selectedZone.id, stressRainfall).then((res) => {
        if (active && res) {
          setZoneMlRisk(res);
        }
      });
    }
    return () => {
      active = false;
    };
  }, [selectedZone?.id, stressRainfall]);

  // Live ML Heatmap points synthesized from model patterns
  useEffect(() => {
    let active = true;
    LandslideApi.getMlHeatmapPoints(selectedState, stressRainfall).then((pts) => {
      if (active && pts) {
        setHeatmapPoints(pts);
      }
    });
    return () => {
      active = false;
    };
  }, [selectedState, stressRainfall]);

  // Filter hazard zones according to state
  const filteredZones =
    selectedState === 'all'
      ? zones
      : zones.filter((z) => z.state === selectedState);

  // Filter sensors
  const filteredSensors =
    selectedState === 'all'
      ? sensors
      : sensors.filter((s) => s.state === selectedState);

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
              <button
                onClick={() =>
                  setActiveLayers((p) => ({ ...p, mlInference: !p.mlInference }))
                }
                className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-all ${
                  activeLayers.mlInference
                    ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50'
                    : 'bg-transparent text-[#8a9297] border-[#273647]'
                }`}
              >
                ⚡ Random Forest ML
              </button>
              <button
                onClick={() =>
                  setActiveLayers((p) => ({ ...p, trainingEvents: !p.trainingEvents }))
                }
                className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-all ${
                  activeLayers.trainingEvents
                    ? 'bg-amber-950/70 text-amber-300 border-amber-500/50'
                    : 'bg-transparent text-[#8a9297] border-[#273647]'
                }`}
              >
                📍 Training Ground Truth ({trainingEvents.length})
              </button>
              <button
                onClick={() =>
                  setActiveLayers((p) => ({ ...p, mlHeatmap: !p.mlHeatmap }))
                }
                className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-all cursor-pointer ${
                  activeLayers.mlHeatmap
                    ? 'bg-gradient-to-r from-amber-600/50 to-red-600/50 text-amber-200 border-amber-400'
                    : 'bg-transparent text-[#8a9297] border-[#273647]'
                }`}
              >
                🔥 ML Heatmap ({heatmapPoints.length})
              </button>
            </div>

            {/* Interactive Google Earth & ML Pattern Heatmap GIS Canvas */}
            <GisMapContainer
              selectedZone={selectedZone}
              onSelectZone={(z) => setSelectedZone(z)}
              zones={filteredZones}
              sensors={filteredSensors}
              trainingEvents={trainingEvents}
              selectedEvent={selectedEvent}
              onSelectEvent={(evt) => setSelectedEvent(evt)}
              zoneMlRisk={zoneMlRisk}
              heatmapPoints={heatmapPoints}
              stressRainfall={stressRainfall}
              activeLayers={activeLayers}
              onToggleLayer={(key) =>
                setActiveLayers((prev: any) => ({ ...prev, [key]: !prev[key] }))
              }
              onShowToast={showToast}
            />

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

            {/* Selected Historical Event Banner (if user clicked on a training ground truth pin) */}
            {selectedEvent && (
              <div className="mt-4 bg-amber-950/40 border border-amber-500/50 rounded-lg p-3 text-xs shadow-md">
                <div className="flex items-center justify-between pb-1.5 border-b border-amber-500/30">
                  <span className="font-mono text-amber-300 font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    HISTORICAL EVENT #{selectedEvent.record_id}
                  </span>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-amber-400 hover:text-white text-[10px] font-mono cursor-pointer"
                  >
                    DISMISS [×]
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
                  <div>
                    <span className="text-[#8a9297] block text-[10px]">EVENT DATE</span>
                    <span className="text-white font-semibold">{selectedEvent.event_date}</span>
                  </div>
                  <div>
                    <span className="text-[#8a9297] block text-[10px]">3D RAINFALL</span>
                    <span className="text-cyan-300 font-semibold">{selectedEvent.rainfall_3d} mm</span>
                  </div>
                  <div>
                    <span className="text-[#8a9297] block text-[10px]">SLOPE / ELEV</span>
                    <span className="text-amber-200 font-semibold">{selectedEvent.slope}° / {selectedEvent.elevation}m</span>
                  </div>
                  <div>
                    <span className="text-[#8a9297] block text-[10px]">SOIL CODE</span>
                    <span className="text-emerald-300 font-semibold">{selectedEvent.soil_code}</span>
                  </div>
                </div>
                <p className="text-[9px] text-amber-300/80 mt-2 font-mono">
                  Ground truth verified training sample from NER Landslide Events database.
                </p>
              </div>
            )}

            {/* Random Forest ML Pipeline Real-Time Risk Score Widget */}
            <div className="mt-4 bg-[#0a1622] border border-[#00bcd4]/30 rounded-lg p-3 shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-[#1c2b3c]">
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[#44d8f1]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    ML Risk Inference Engine
                  </span>
                </div>
                <span className="text-[9px] font-mono text-[#44d8f1] bg-[#00363e] px-1.5 py-0.5 rounded border border-[#00bcd4]/40">
                  RF v1.2.0 (654 SAMPLES)
                </span>
              </div>

              {/* Model Output Probability Score */}
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#8a9297] uppercase font-mono block">
                    Calculated Susceptibility
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black font-mono text-white">
                      {zoneMlRisk ? `${zoneMlRisk.probability_percentage.toFixed(1)}%` : '84.0%'}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                        (zoneMlRisk?.risk_tier || '').includes('Severe') || (zoneMlRisk?.risk_tier || '').includes('High')
                          ? 'bg-[#93000a] text-[#ffdad6]'
                          : (zoneMlRisk?.risk_tier || '').includes('Moderate')
                          ? 'bg-[#7d4800] text-[#ffbc7a]'
                          : 'bg-[#00363e] text-[#44d8f1]'
                      }`}
                    >
                      {zoneMlRisk?.risk_tier || 'High Risk'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#8a9297] uppercase font-mono block">
                    Training Precedents
                  </span>
                  <span className="text-sm font-bold font-mono text-amber-300">
                    {zoneMlRisk?.historical_precedents_count ?? 18} Verified
                  </span>
                  <span className="text-[9px] text-[#8a9297] block">in 0.5° GIS radius</span>
                </div>
              </div>

              {/* Precipitation Stress Simulation Slider */}
              <div className="mt-3 pt-2.5 border-t border-[#1c2b3c]/60">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#8a9297] flex items-center gap-1">
                    <CloudRain className="w-3.5 h-3.5 text-[#44d8f1]" />
                    Rainfall Stress Test:
                  </span>
                  <span className="text-amber-300 font-bold">
                    +{stressRainfall} mm{' '}
                    <span className="text-[10px] text-[#8a9297] font-normal">
                      (Total: {(zoneMlRisk ? zoneMlRisk.actual_rainfall_3d + stressRainfall : 142 + stressRainfall).toFixed(1)} mm)
                    </span>
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="5"
                  value={stressRainfall}
                  onChange={(e) => setStressRainfall(Number(e.target.value))}
                  className="w-full mt-1.5 h-1.5 bg-[#122131] rounded-lg appearance-none cursor-pointer accent-[#44d8f1]"
                />
                <div className="flex justify-between text-[9px] font-mono text-[#8a9297] mt-1">
                  <span>Current Baseline (+0mm)</span>
                  <span>Extreme Cloudburst (+120mm)</span>
                </div>
              </div>

              {/* Top Model Contributing Features */}
              <div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                <div className="bg-[#122131] p-1.5 rounded border border-[#1c2b3c]">
                  <span className="text-[#8a9297] block text-[9px]">SOIL PROFILE CODE</span>
                  <span className="text-white truncate block font-bold">
                    {zoneMlRisk?.soil_type || 'Clay Loam (4276)'}
                  </span>
                </div>
                <div className="bg-[#122131] p-1.5 rounded border border-[#1c2b3c]">
                  <span className="text-[#8a9297] block text-[9px]">TERRAIN SLOPE</span>
                  <span className="text-amber-300 font-bold block">
                    {zoneMlRisk?.slope_gradient ? `${zoneMlRisk.slope_gradient}°` : '48.6°'}
                  </span>
                </div>
              </div>

              {/* Link to ML Pipeline Sandbox */}
              {onNavigateToMlPipeline && (
                <button
                  onClick={onNavigateToMlPipeline}
                  className="mt-2.5 w-full py-1.5 px-2 bg-[#00363e]/60 hover:bg-[#00363e] border border-[#00bcd4]/40 text-[#44d8f1] rounded text-[11px] font-mono flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Explore Feature Importance in ML Sandbox →</span>
                </button>
              )}
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
