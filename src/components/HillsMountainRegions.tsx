import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  CloudRain,
  Droplets,
  Loader2,
  Mountain,
  Search,
  ShieldCheck,
  Thermometer,
  Wind,
} from 'lucide-react';
import { HILLS_AND_MOUNTAIN_REGIONS, HillsRegion } from '../data/hillsData';
import { LandslideApi, LiveWeather } from '../services/api';

interface HillsMountainRegionsProps {
  theme?: 'dark' | 'light';
  onNavigateToMap?: (region: HillsRegion) => void;
}

const WEATHER_STATE_BY_REGION: Record<string, string> = {
  'Arunachal Pradesh': 'arunachal',
  Assam: 'assam',
  Meghalaya: 'meghalaya',
  Nagaland: 'nagaland',
  Manipur: 'manipur',
  Mizoram: 'mizoram',
  Tripura: 'tripura',
  Sikkim: 'sikkim',
};

const weatherDescription = (code: number | null) => {
  if (code === null || code === undefined) return 'Forecast unavailable';
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Foggy conditions';
  if (code <= 67) return 'Rain expected';
  if (code <= 77) return 'Snow or ice';
  if (code <= 82) return 'Rain showers';
  return 'Storm risk';
};

export const HillsMountainRegions: React.FC<HillsMountainRegionsProps> = ({
  theme = 'dark',
  onNavigateToMap,
}) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<HillsRegion | null>(null);
  const [collapsedStates, setCollapsedStates] = useState<Record<string, boolean>>({});
  const [weather, setWeather] = useState<LiveWeather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const groupedRegions = useMemo(() => {
    const groups = new Map<string, HillsRegion[]>();
    HILLS_AND_MOUNTAIN_REGIONS.forEach((region) => {
      if (
        normalizedSearch &&
        !region.name.toLowerCase().includes(normalizedSearch) &&
        !region.state.toLowerCase().includes(normalizedSearch)
      ) {
        return;
      }
      const current = groups.get(region.state) ?? [];
      current.push(region);
      groups.set(region.state, current);
    });
    return Array.from(groups.entries());
  }, [normalizedSearch]);

  const toggleState = (state: string) => {
    setCollapsedStates((previous) => ({
      ...previous,
      [state]: !previous[state],
    }));
  };

  const panelClass = isDark
    ? 'border-[#263b50] bg-[#132131] text-slate-100'
    : 'border-slate-200 bg-white text-slate-900 shadow-sm';
  const mutedTextClass = isDark ? 'text-slate-400' : 'text-slate-600';

  const weatherState = selectedRegion
    ? WEATHER_STATE_BY_REGION[selectedRegion.state]
    : null;

  useEffect(() => {
    let active = true;
    if (!weatherState) {
      setWeather(null);
      return () => {
        active = false;
      };
    }

    setWeatherLoading(true);
    LandslideApi.getLiveWeather(weatherState)
      .then((data) => {
        if (active) setWeather(data);
      })
      .finally(() => {
        if (active) setWeatherLoading(false);
      });

    return () => {
      active = false;
    };
  }, [weatherState]);

  return (
    <div className="mx-auto max-w-7xl px-3 pb-12 pt-4 sm:px-6">
      <section className={`overflow-hidden rounded-2xl border ${panelClass}`}>
        <div
          className={`border-b px-5 py-6 sm:px-7 ${
            isDark
              ? 'border-[#263b50] bg-[#101b29]'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                <Mountain className="h-4 w-4" />
                North Eastern terrain reference
              </div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Hills &amp; Mountain Regions
              </h1>
              <p className={`mt-2 max-w-2xl text-sm leading-6 ${mutedTextClass}`}>
                Browse major hill systems and mountain regions by state. Geographic coordinates are added only when verified by the project data sources.
              </p>
            </div>
            <div className="shrink-0 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[10px] font-mono text-emerald-300">
              {HILLS_AND_MOUNTAIN_REGIONS.length} REFERENCE REGIONS
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search hill or state..."
                aria-label="Search hills and mountain regions"
                className={`w-full rounded-xl border py-3 pl-10 pr-3 text-sm outline-none transition-all focus:border-cyan-400 ${
                  isDark
                    ? 'border-slate-700 bg-slate-900/70 text-white'
                    : 'border-slate-300 bg-slate-50 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-3">
              {groupedRegions.length === 0 && (
                <div className={`rounded-xl border border-dashed p-6 text-center text-sm ${mutedTextClass}`}>
                  No hills or states match this search.
                </div>
              )}
              {groupedRegions.map(([state, regions]) => {
                const isCollapsed = collapsedStates[state];
                return (
                  <section
                    key={state}
                    className={`overflow-hidden rounded-xl border ${
                      isDark ? 'border-slate-700 bg-slate-900/40' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleState(state)}
                      aria-expanded={!isCollapsed}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-bold transition-colors hover:bg-cyan-500/10"
                    >
                      <span>{state}</span>
                      <span className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                        {regions.length} regions
                        <ChevronDown className={`h-4 w-4 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                      </span>
                    </button>
                    {!isCollapsed && (
                      <div className={`grid gap-2 border-t p-3 sm:grid-cols-2 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                        {regions.map((region) => {
                          const selected = selectedRegion?.id === region.id;
                          return (
                            <button
                              type="button"
                              key={region.id}
                              onClick={() => setSelectedRegion(region)}
                              className={`rounded-lg border px-3 py-3 text-left transition-all ${
                                selected
                                  ? 'border-cyan-400 bg-cyan-500/15 text-cyan-100 shadow-md shadow-cyan-950/30'
                                  : isDark
                                  ? 'border-slate-800 bg-slate-950/30 text-slate-300 hover:border-cyan-500/50 hover:text-white'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-400 hover:text-slate-900'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <span className="text-sm font-semibold">{region.name}</span>
                                {selected && <ShieldCheck className="h-4 w-4 shrink-0 text-cyan-300" />}
                              </div>
                              <span className={`mt-1 block text-[10px] font-mono uppercase tracking-wider ${mutedTextClass}`}>
                                {region.category}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </div>

          <aside className={`h-fit rounded-xl border p-5 ${isDark ? 'border-cyan-400/20 bg-[#0d1c2d]' : 'border-cyan-200 bg-cyan-50/50'}`}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <Mountain className="h-4 w-4" />
              Region selection
            </div>
            {selectedRegion ? (
              <div className="mt-5">
                <h2 className="text-xl font-black">{selectedRegion.name}</h2>
                <p className={`mt-1 text-sm ${mutedTextClass}`}>{selectedRegion.state}</p>
                <div className={`mt-4 rounded-lg border p-3 text-xs leading-5 ${
                  selectedRegion.coordinatesVerified
                    ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
                    : 'border-amber-400/25 bg-amber-400/10 text-amber-200'
                }`}>
                  {selectedRegion.coordinatesVerified
                    ? 'Verified representative coordinates available. The existing Risk Map can focus this region.'
                    : 'No verified project coordinates are available for this entry yet. GIS focus remains unchanged.'}
                </div>
                {onNavigateToMap && (
                  <button
                    type="button"
                    onClick={() => onNavigateToMap(selectedRegion)}
                    className="mt-4 w-full rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-3 py-2.5 text-sm font-bold text-emerald-200 transition-colors hover:bg-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  >
                    View Risk Map →
                  </button>
                )}

                <div className={`mt-5 border-t pt-5 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                      <CloudRain className="h-4 w-4" />
                      Live weather coverage
                    </div>
                    {weatherLoading && <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />}
                  </div>

                  {weather && (
                    <>
                      <div className={`mt-3 text-[10px] font-mono ${mutedTextClass}`}>
                        {weather.station_name} • {weather.district}
                      </div>
                      <div className={`mt-1 text-[10px] font-mono ${mutedTextClass}`}>
                        Station {weather.latitude.toFixed(2)}° N, {weather.longitude.toFixed(2)}° E • {weather.is_live_feed ? 'LIVE' : 'CACHED'}
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                        <div className={`rounded-lg border p-2 ${isDark ? 'border-slate-700 bg-slate-950/30' : 'border-slate-200 bg-white'}`}>
                          <Thermometer className="h-3.5 w-3.5 text-orange-400" />
                          <div className="mt-1 font-bold">{weather.current_temperature_c.toFixed(1)}°C</div>
                          <div className={mutedTextClass}>Current</div>
                        </div>
                        <div className={`rounded-lg border p-2 ${isDark ? 'border-slate-700 bg-slate-950/30' : 'border-slate-200 bg-white'}`}>
                          <Droplets className="h-3.5 w-3.5 text-cyan-400" />
                          <div className="mt-1 font-bold">{weather.relative_humidity_pct.toFixed(0)}%</div>
                          <div className={mutedTextClass}>Humidity</div>
                        </div>
                        <div className={`rounded-lg border p-2 ${isDark ? 'border-slate-700 bg-slate-950/30' : 'border-slate-200 bg-white'}`}>
                          <CloudRain className="h-3.5 w-3.5 text-blue-400" />
                          <div className="mt-1 font-bold">{weather.current_rainfall_mm_hr.toFixed(1)} mm/h</div>
                          <div className={mutedTextClass}>Rain now</div>
                        </div>
                        <div className={`rounded-lg border p-2 ${isDark ? 'border-slate-700 bg-slate-950/30' : 'border-slate-200 bg-white'}`}>
                          <Wind className="h-3.5 w-3.5 text-emerald-400" />
                          <div className="mt-1 font-bold">{weather.wind_speed_kmh.toFixed(1)} km/h</div>
                          <div className={mutedTextClass}>Wind</div>
                        </div>
                      </div>

                      {weather.forecast && weather.forecast.length > 0 && (
                        <div className="mt-4">
                          <div className={`text-[10px] font-mono uppercase tracking-wider ${mutedTextClass}`}>
                            3-day forecast
                          </div>
                          <div className="mt-2 space-y-2">
                            {weather.forecast.map((day) => (
                              <div
                                key={day.date}
                                className={`flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-[11px] ${isDark ? 'border-slate-700 bg-slate-950/30' : 'border-slate-200 bg-white'}`}
                              >
                                <div>
                                  <div className="font-bold">{day.date}</div>
                                  <div className={mutedTextClass}>{weatherDescription(day.weather_code)}</div>
                                </div>
                                <div className="text-right font-mono">
                                  <div>{day.temperature_max_c ?? '--'}° / {day.temperature_min_c ?? '--'}°C</div>
                                  <div className="text-cyan-300">{day.precipitation_mm ?? '--'} mm rain</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <p className={`mt-5 text-sm leading-6 ${mutedTextClass}`}>
                Select a region to inspect its reference category and verification status.
              </p>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
};

export default HillsMountainRegions;
