import React, { useEffect, useState } from 'react';
import { Activity, Clock3, ExternalLink, MapPin, Radio, RefreshCw, ShieldCheck, TriangleAlert } from 'lucide-react';
import { EarthquakeEvent, EarthquakeResponse, HazardZone } from '../types';
import { LandslideApi } from '../services/api';

interface EarthquakeMonitorProps {
  selectedZone: HazardZone;
  theme: 'dark' | 'light';
}

const parseCoordinates = (coordinates: string): [number, number] | undefined => {
  const match = coordinates.match(/(-?\d+(?:\.\d+)?)[^,]*,\s*(-?\d+(?:\.\d+)?)/);
  return match ? [Number(match[1]), Number(match[2])] : undefined;
};

const formatEventTime = (event: EarthquakeEvent) => {
  const date = new Date(event.event_time);
  return Number.isNaN(date.getTime()) ? 'Time unavailable' : date.toLocaleString();
};

export const EarthquakeMonitor: React.FC<EarthquakeMonitorProps> = ({ selectedZone, theme }) => {
  const [data, setData] = useState<EarthquakeResponse | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isDark = theme === 'dark';
  const coordinates = parseCoordinates(selectedZone.coords);

  const loadEarthquakes = async () => {
    setIsRefreshing(true);
    const response = await LandslideApi.getEarthquakes(coordinates?.[0], coordinates?.[1]);
    setData(response);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadEarthquakes();
  }, [selectedZone.coords]);

  const events = data?.events ?? [];
  const panelClass = isDark
    ? 'border-[#1c2b3c] bg-[#0d1c2d]'
    : 'border-slate-200 bg-white shadow-sm';
  const mutedClass = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`mx-auto max-w-7xl space-y-5 px-3 pb-12 pt-5 sm:px-6 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      <section className={`relative overflow-hidden rounded-2xl border p-5 sm:p-7 ${isDark ? 'border-orange-400/20 bg-[radial-gradient(circle_at_85%_10%,rgba(249,115,22,0.16),transparent_34%),linear-gradient(120deg,#0d1c2d,#171b25)]' : 'border-orange-200 bg-[radial-gradient(circle_at_85%_10%,rgba(249,115,22,0.12),transparent_34%),linear-gradient(120deg,#ffffff,#fff7ed)]'}`}>
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-300" />
              Official seismic intelligence
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Earthquake Monitor</h1>
            <p className={`mt-2 max-w-2xl text-sm leading-6 ${mutedClass}`}>
              Near-real-time events from the National Center for Seismology, Ministry of Earth Sciences. This view is an independent trigger layer and does not alter landslide predictions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3 py-1.5 text-[11px] font-mono ${isDark ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
              <ShieldCheck className="mr-1.5 inline h-3.5 w-3.5" />
              {data?.source_status === 'available' ? 'NCS FEED ONLINE' : 'NCS FEED CHECKING'}
            </span>
            <button
              type="button"
              onClick={loadEarthquakes}
              disabled={isRefreshing}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60 ${isDark ? 'border-slate-700 bg-slate-800 text-slate-200 hover:border-orange-400' : 'border-slate-300 bg-white text-slate-700 hover:border-orange-400'}`}
            >
              <RefreshCw className={isRefreshing ? 'h-3.5 w-3.5 animate-spin' : 'h-3.5 w-3.5'} />
              Refresh feed
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className={`rounded-xl border p-4 ${panelClass}`}>
          <div className={`text-[10px] font-bold uppercase tracking-wider ${mutedClass}`}>Events in 500 km</div>
          <div className="mt-2 flex items-center gap-2 text-2xl font-black font-mono"><Activity className="h-5 w-5 text-orange-400" />{events.length}</div>
        </div>
        <div className={`rounded-xl border p-4 ${panelClass}`}>
          <div className={`text-[10px] font-bold uppercase tracking-wider ${mutedClass}`}>Earthquake trigger</div>
          <div className="mt-2 text-2xl font-black font-mono text-orange-400">{Math.round((data?.earthquake_trigger_score ?? 0) * 100)}%</div>
        </div>
        <div className={`rounded-xl border p-4 ${panelClass}`}>
          <div className={`text-[10px] font-bold uppercase tracking-wider ${mutedClass}`}>Monitoring location</div>
          <div className="mt-2 flex items-center gap-2 truncate text-sm font-bold"><MapPin className="h-4 w-4 shrink-0 text-orange-400" />{selectedZone.name}</div>
        </div>
      </div>

      <section className={`rounded-2xl border ${panelClass}`}>
        <div className="flex flex-col gap-3 border-b border-inherit p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-base font-bold"><Radio className="h-4 w-4 text-orange-400" />Recent official events</h2>
            <p className={`mt-1 text-xs ${mutedClass}`}>{data?.message ?? 'Loading the official NCS feed...'}</p>
          </div>
          <a className="flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300" href={data?.source_url ?? 'https://seismo.gov.in/'} target="_blank" rel="noreferrer">
            Open NCS source <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {data?.earthquake_data_available === false ? (
          <div className={`flex items-center gap-3 p-6 text-sm ${mutedClass}`}><TriangleAlert className="h-5 w-5 text-amber-400" />Live earthquake data is temporarily unavailable. Other TerraGuard modules continue independently.</div>
        ) : events.length === 0 ? (
          <div className={`p-8 text-center text-sm ${mutedClass}`}>No NCS events are currently within 500 km of {selectedZone.name}.</div>
        ) : (
          <div className="divide-y divide-slate-200/10">
            {events.map((event) => (
              <div key={event.id} className="grid grid-cols-[auto_1fr] gap-4 p-4 sm:grid-cols-[76px_1fr_auto] sm:items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-orange-400/60 bg-orange-500/10 text-lg font-black font-mono text-orange-300">{event.magnitude.toFixed(1)}</div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold">{event.location}</div>
                  <div className={`mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono ${mutedClass}`}>
                    <span>{event.latitude.toFixed(3)}, {event.longitude.toFixed(3)}</span>
                    <span>{event.depth_km.toFixed(0)} km deep</span>
                    <span className="capitalize">{event.status}</span>
                  </div>
                </div>
                <div className={`col-start-2 flex items-center gap-1.5 text-[11px] font-mono sm:col-start-auto ${mutedClass}`}><Clock3 className="h-3.5 w-3.5 text-orange-400" />{formatEventTime(event)}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
