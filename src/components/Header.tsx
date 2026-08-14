import React from 'react';
import { Logo } from './Logo';
import { NavTab, PsiData, WeatherForecastItem } from '../types';
import { CloudRain, Navigation, ShieldCheck, RefreshCw, Layers, Sparkles, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  weather: WeatherForecastItem[];
  psi: PsiData | null;
  isLoading: boolean;
  onRefreshData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  weather,
  psi,
  isLoading,
  onRefreshData
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const cbdWeather = weather.find(w => w.area.includes('CBD') || w.area.includes('City')) || weather[0];

  const handleNav = (tab: NavTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#c3c6d4]/30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('plan')}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity text-left cursor-pointer"
        >
          <Logo size={32} />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          <button
            onClick={() => handleNav('plan')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'plan'
                ? 'text-[#003178] bg-[#003178]/10 font-semibold shadow-xs'
                : 'text-[#434652] hover:text-[#003178] hover:bg-[#003178]/5'
            }`}
          >
            <Navigation className="w-4 h-4" />
            Plan Route
          </button>

          <button
            onClick={() => handleNav('landing')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'landing'
                ? 'text-[#003178] bg-[#003178]/10 font-semibold shadow-xs'
                : 'text-[#434652] hover:text-[#003178] hover:bg-[#003178]/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Story & Benefits
          </button>

          <button
            onClick={() => handleNav('radar')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'radar'
                ? 'text-[#003178] bg-[#003178]/10 font-semibold shadow-xs'
                : 'text-[#434652] hover:text-[#003178] hover:bg-[#003178]/5'
            }`}
          >
            <CloudRain className="w-4 h-4" />
            Weather Radar
          </button>

          <button
            onClick={() => handleNav('civic')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'civic'
                ? 'text-[#003178] bg-[#003178]/10 font-semibold shadow-xs'
                : 'text-[#434652] hover:text-[#003178] hover:bg-[#003178]/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            Live Civic Data
          </button>
        </nav>

        {/* Right Side Info & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Live Singapore Weather Pill */}
          <div className="hidden lg:flex items-center gap-2 bg-[#f3f3fb] border border-[#c3c6d4]/40 px-3 py-1 rounded-full text-xs font-medium text-[#1a1b21]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SG CBD: <strong>{cbdWeather ? cbdWeather.forecast : 'Fair'}</strong> · {cbdWeather?.temp || 31}°C</span>
            {psi && (
              <span className="text-[#006b5f] border-l border-gray-300 pl-2">
                PSI {psi.overallIndex} ({psi.status})
              </span>
            )}
          </div>

          {/* Refresh Data Button */}
          <button
            onClick={onRefreshData}
            title="Refresh Live Data.gov.sg Feeds"
            disabled={isLoading}
            className="p-2 text-[#434652] hover:text-[#003178] hover:bg-[#003178]/5 rounded-full transition-colors active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#003178]' : ''}`} />
          </button>

          {/* Primary CTA button */}
          <button
            onClick={() => handleNav('plan')}
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#003178] hover:bg-[#002254] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            Plan a Walk
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1a1b21] hover:bg-gray-100 rounded-lg cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#c3c6d4]/30 bg-white px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          <button
            onClick={() => handleNav('plan')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentTab === 'plan' ? 'bg-[#003178]/10 text-[#003178] font-bold' : 'text-[#434652]'
            }`}
          >
            <Navigation className="w-4 h-4" />
            Plan Route (Interactive Map)
          </button>
          <button
            onClick={() => handleNav('landing')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentTab === 'landing' ? 'bg-[#003178]/10 text-[#003178] font-bold' : 'text-[#434652]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Story & Value Proposition
          </button>
          <button
            onClick={() => handleNav('radar')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentTab === 'radar' ? 'bg-[#003178]/10 text-[#003178] font-bold' : 'text-[#434652]'
            }`}
          >
            <CloudRain className="w-4 h-4" />
            Live Weather Radar & Rain Alerts
          </button>
          <button
            onClick={() => handleNav('civic')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentTab === 'civic' ? 'bg-[#003178]/10 text-[#003178] font-bold' : 'text-[#434652]'
            }`}
          >
            <Layers className="w-4 h-4" />
            Civic Data (Traffic & Carparks)
          </button>
        </div>
      )}
    </header>
  );
};
