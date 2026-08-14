import React, { useState } from 'react';
import { WeatherForecastItem, PsiData } from '../types';
import { CloudRain, Sun, Wind, Droplets, AlertTriangle, Bell, ShieldCheck, Thermometer, ArrowRight } from 'lucide-react';

interface WeatherRadarProps {
  weather: WeatherForecastItem[];
  psi: PsiData | null;
  onPlanShelteredRoute: () => void;
}

export const WeatherRadarDashboard: React.FC<WeatherRadarProps> = ({
  weather,
  psi,
  onPlanShelteredRoute
}) => {
  const [activeRegion, setActiveRegion] = useState<string>('all');
  const [simulatedRainAlert, setSimulatedRainAlert] = useState<boolean>(true);

  const filteredWeather =
    activeRegion === 'all'
      ? weather
      : weather.filter(w => w.area.toLowerCase().includes(activeRegion.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006b5f]/10 text-[#006b5f] text-xs font-bold uppercase tracking-wider mb-1">
            <CloudRain className="w-3.5 h-3.5" />
            NEA Data.gov.sg Live Weather Feed
          </div>
          <h1 className="text-3xl font-extrabold text-[#003178] tracking-tight">
            Singapore Weather Radar & Commute Alerts
          </h1>
          <p className="text-sm text-[#434652] mt-1">
            Real-time tropical downpour tracking, 24-hr PSI air quality, and dynamic sheltered rerouting recommendations.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onPlanShelteredRoute}
          className="bg-[#003178] hover:bg-[#002254] text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm shrink-0 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          Plan Sheltered Route
        </button>
      </div>

      {/* Real-time Predictive Rain Alert Banner (BMC Customer Relationship Feature) */}
      {simulatedRainAlert && (
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border-l-4 border-[#FF7043] rounded-2xl p-5 shadow-xs relative overflow-hidden bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FF7043]/15 text-[#FF7043] flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF7043] bg-[#FF7043]/10 px-2 py-0.5 rounded">
                    Smart Rain Warning
                  </span>
                  <span className="text-xs text-gray-500">Predicted via NEA Radar vector</span>
                </div>
                <h3 className="text-base font-bold text-[#1a1b21] mt-1">
                  Passing rain cell arriving in ~10 mins at Central CBD / Marina Bay
                </h3>
                <p className="text-xs text-[#434652] mt-0.5">
                  RainRouter recommends taking <strong>Shelter-First Route via Raffles Link Underpass</strong> instead of open waterfront boardwalk.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onPlanShelteredRoute}
                className="bg-[#003178] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#002254] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                Apply Sheltered Route
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSimulatedRainAlert(false)}
                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Row: 24h PSI + UV Index + Heat Index */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: 24-hr PSI */}
        <div className="bg-white rounded-2xl p-5 border border-[#c3c6d4]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">24-hr PSI Reading</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {psi ? psi.status : 'Good'}
            </span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold text-[#003178]">{psi ? psi.overallIndex : 44}</div>
            <div className="text-xs text-[#434652] mt-1">National Air Quality Index</div>
          </div>
          <div className="text-[11px] text-gray-400 border-t border-gray-100 pt-2 flex justify-between">
            <span>Central: {psi?.regions.central || 42}</span>
            <span>East: {psi?.regions.east || 45}</span>
            <span>West: {psi?.regions.west || 48}</span>
          </div>
        </div>

        {/* Metric 2: Midday UV Index */}
        <div className="bg-white rounded-2xl p-5 border border-[#c3c6d4]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Midday UV Index</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold text-amber-600">6.8</div>
            <div className="text-xs text-[#434652] mt-1">High UV Exposure (11 AM - 3 PM)</div>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium border-t border-gray-100 pt-2">
            ✓ Sun-Shade routes reduce UV by 85%
          </div>
        </div>

        {/* Metric 3: Average Humidity */}
        <div className="bg-white rounded-2xl p-5 border border-[#c3c6d4]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Island Humidity</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold text-[#006b5f]">76%</div>
            <div className="text-xs text-[#434652] mt-1">Typical tropical humid conditions</div>
          </div>
          <div className="text-[11px] text-blue-600 font-medium border-t border-gray-100 pt-2">
            Air-con MRT underpasses recommended
          </div>
        </div>

        {/* Metric 4: Ambient Temperature */}
        <div className="bg-white rounded-2xl p-5 border border-[#c3c6d4]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Temperature</span>
            <Thermometer className="w-4 h-4 text-rose-500" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold text-[#1a1b21]">31.5°C</div>
            <div className="text-xs text-[#434652] mt-1">Real-feel in sun: 37°C</div>
          </div>
          <div className="text-[11px] text-gray-500 border-t border-gray-100 pt-2">
            Sheltered tree canopies feel ~4°C cooler
          </div>
        </div>
      </div>

      {/* 2-Hour Weather Forecast Regional Grid */}
      <div className="bg-white rounded-3xl p-6 border border-[#c3c6d4]/40 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#003178]">2-Hour Singapore Weather Forecast</h2>
            <p className="text-xs text-[#434652]">Updated every 15 minutes from National Environment Agency (NEA)</p>
          </div>

          {/* Region filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['all', 'Central', 'Marina', 'Novena', 'Orchard', 'Jurong', 'Changi'].map(reg => (
              <button
                key={reg}
                onClick={() => setActiveRegion(reg)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeRegion === reg
                    ? 'bg-[#003178] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {reg === 'all' ? 'All Areas' : reg}
              </button>
            ))}
          </div>
        </div>

        {/* Forecast Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredWeather.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#faf8ff] border border-[#c3c6d4]/30 hover:border-[#003178]/40 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#003178]">{item.area}</span>
                <span className="text-xl">
                  {item.forecast.toLowerCase().includes('rain')
                    ? '🌧️'
                    : item.forecast.toLowerCase().includes('thunder')
                    ? '⛈️'
                    : item.forecast.toLowerCase().includes('cloud')
                    ? '⛅'
                    : '☀️'}
                </span>
              </div>

              <div className="my-3">
                <div className="text-lg font-bold text-[#1a1b21]">{item.forecast}</div>
                <div className="text-xs text-[#434652] mt-0.5">Est. {item.temp || 31}°C · Humidity {item.humidity || 75}%</div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 text-[11px]">
                <span className={item.forecast.toLowerCase().includes('rain') ? 'text-[#FF7043] font-bold' : 'text-[#43A047] font-semibold'}>
                  {item.forecast.toLowerCase().includes('rain') ? '⚠️ Rain Expected' : '✓ Good walking'}
                </span>
                <span className="text-gray-400">2-hr window</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
