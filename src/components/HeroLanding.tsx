import React, { useState } from 'react';
import { Umbrella, Sun, Radar, ArrowRight, Shield, Footprints, Sparkles } from 'lucide-react';
import { WeatherForecastItem, PsiData } from '../types';

interface HeroLandingProps {
  onPlanRoute: () => void;
  weather: WeatherForecastItem[];
  psi: PsiData | null;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({ onPlanRoute, weather, psi }) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState(false);

  const sunnyImageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCezTBR-50JdYXvnvbjmIOUzz9DjfbXVVKMfXVkX7cZeslGRhMWeR4Xxcy3tY1WDqrP9IvOzfgLDt9cyZD5T3_sSM0bk3N2CZgnD1k6_CkjIEgmDHIh0tLQTO6wPcUdDepXV6BJab2EeKswsXw6Ckrq6UdpjLMD2W0Jd7QgW2ilZ8Fk71c16Uu4yzD-6Zj3LGtHIzpYT2nxVl4PY-GFbojFC1bd3TM9krhZbkGnXxwzjTGvgIvclQk';
  const shelteredImageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3jfg1xeHNAj3nskzZpvq6rtx2GGZ1qjI2reCt6ZtKbCXZuxvAIuwUAuQc-MQvALOv-032ZeWRGF0U0Fcmn3wVh7MRONc5i4NNql_8fZDiGxWOh4eotcKFCsGK1xfSfs0ewcJPwmZUtnetO16CWu-no6GcE42zfeU9gcIzV2TTfDZxPb9ag6rJjii05_z7x2y2_C78ikrLmHjmO-wfLDTDFarQIKP6y14_rPkaAHITVr4hqDxsGjQ';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div className="w-full flex flex-col bg-[#faf8ff]">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-8 md:py-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Copy Column */}
        <div className="lg:col-span-6 flex flex-col gap-5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#006b5f]/10 text-[#006b5f] text-xs font-bold tracking-wider uppercase w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            Comfort-First Walking · Singapore
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#003178] tracking-tight leading-[1.15]">
            The fastest route can feel like the longest.
          </h1>

          <p className="text-base sm:text-lg text-[#434652] leading-relaxed max-w-xl">
            Most maps optimise for raw time. RainRouter finds a more comfortable walk with more shade, shelter, and MRT underpass cover when you need it.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onPlanRoute}
              className="bg-[#003178] hover:bg-[#002254] text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center gap-2.5 text-base cursor-pointer"
            >
              <Footprints className="w-5 h-5" />
              Plan a Walk
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <div className="flex items-center gap-2 text-xs text-[#434652] px-3 py-2 bg-white/70 rounded-lg border border-gray-200">
              <Shield className="w-4 h-4 text-[#006b5f]" />
              <span>Singapore Covered Walkways Grid</span>
            </div>
          </div>

          {/* Quick Weather Status Preview */}
          {weather.length > 0 && (
            <div className="mt-4 p-3.5 rounded-xl bg-white border border-[#c3c6d4]/40 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-semibold text-[#003178]">Live NEA Forecast:</span>
                <span className="text-[#434652]">{weather[0]?.area}: {weather[0]?.forecast} ({weather[0]?.temp}°C)</span>
              </div>
              {psi && (
                <div className="text-[#006b5f] font-medium bg-[#006b5f]/10 px-2 py-0.5 rounded">
                  24h PSI: {psi.overallIndex} ({psi.status})
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Interactive Image Slider (Scorching Sun vs Covered Canopy) */}
        <div className="lg:col-span-6 relative w-full">
          <div
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/60 select-none cursor-ew-resize"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {/* Background: Open Sun-drenched Path */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${sunnyImageUrl})` }}
            >
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Exposed Pavement · 33°C Heat</span>
              </div>
            </div>

            {/* Foreground: Sheltered Walkway (Clipped by slider position) */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-none"
              style={{
                backgroundImage: `url(${shelteredImageUrl})`,
                clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)`
              }}
            >
              <div className="absolute top-4 right-4 bg-[#003178]/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <Umbrella className="w-3.5 h-3.5 text-sky-300" />
                <span>Covered Link · Shaded & Dry</span>
              </div>
            </div>

            {/* Drag Divider Bar */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none flex items-center justify-center"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-white text-[#003178] shadow-md flex items-center justify-center text-xs font-bold -ml-3.5 border border-[#003178]/20">
                ↔
              </div>
            </div>

            {/* Floating RainRouter Route Card Preview (Matching Image 6 visual) */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 glass-card rounded-xl p-4 shadow-[0_8px_32px_rgba(0,49,120,0.18)] flex flex-col gap-2.5 pointer-events-none">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-[#003178] leading-tight">RainRouter Pick</h4>
                  <p className="text-xs text-[#434652]">via Covered Links + Underpass</p>
                </div>
                <span className="bg-[#003178] text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Umbrella className="w-3 h-3" />
                  72% Sheltered
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
                <div className="h-full bg-[#006b5f]" style={{ width: '72%' }}></div>
                <div className="h-full bg-[#FF7043]/40" style={{ width: '28%' }}></div>
              </div>

              <div className="flex justify-between text-xs text-[#434652] font-medium">
                <span className="font-semibold text-[#1a1b21]">18 min</span>
                <span>1.4 km</span>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-2">
            Drag the slider to compare unshaded walking vs. sheltered walking in Singapore
          </p>
        </div>
      </section>

      {/* Value Proposition Bento Grid */}
      <section className="bg-[#f3f3fb] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-b border-[#c3c6d4]/30">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#003178] mb-3">
              Intelligent routing for unpredictable weather.
            </h2>
            <p className="text-[#434652] text-sm sm:text-base">
              We combine live Data.gov.sg weather feeds with a comprehensive database of Singapore's sheltered network to keep you dry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Prop 1: Shelter-first */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 border border-[#c3c6d4]/30 flex flex-col gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-[#E3F2FD] flex items-center justify-center text-[#003178] mb-1 group-hover:scale-105 transition-transform">
                <Umbrella className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1b21]">Shelter-first</h3>
              <p className="text-sm text-[#434652] leading-relaxed">
                Prioritizes covered walkways, mall links, and MRT underpasses to maximize your protection from sudden tropical downpours.
              </p>
            </div>

            {/* Prop 2: Shade-aware */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 border border-[#c3c6d4]/30 flex flex-col gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-[#ffdbcd] flex items-center justify-center text-[#602100] mb-1 group-hover:scale-105 transition-transform">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1b21]">Shade-aware</h3>
              <p className="text-sm text-[#434652] leading-relaxed">
                When it's not raining, find routes that utilize building shadows and dense tree canopies to stay cool under Singapore's midday UV.
              </p>
            </div>

            {/* Prop 3: Real-time Weather */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 border border-[#c3c6d4]/30 flex flex-col gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-[#8df5e4]/60 flex items-center justify-center text-[#006b5f] mb-1 group-hover:scale-105 transition-transform">
                <Radar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1b21]">Real-time Weather</h3>
              <p className="text-sm text-[#434652] leading-relaxed">
                Live rainfall radar, 24-hr PSI, and temperature feeds actively influence route rankings and rerouting suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Launch CTA Banner */}
      <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-r from-[#003178] to-[#00429c] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col items-center gap-5">
          <h3 className="text-2xl sm:text-3xl font-bold">Ready to walk Singapore without breaking a sweat?</h3>
          <p className="text-white/80 max-w-xl text-sm sm:text-base">
            Search any destination in Singapore and explore sheltered routes via OneMap and live Data.gov.sg feeds.
          </p>
          <button
            onClick={onPlanRoute}
            className="bg-white text-[#003178] hover:bg-white/90 font-bold px-8 py-3.5 rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Footprints className="w-5 h-5" />
            Launch Route Planner
          </button>
        </div>
      </section>
    </div>
  );
};
