import React from 'react';
import { NavTab } from '../types';
import { Home, Navigation, CloudRain, ShieldCheck, HelpCircle } from 'lucide-react';

interface FooterProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentTab, onTabChange }) => {
  return (
    <>
      {/* Desktop Footer (Hidden on mobile when in map mode to preserve screen space) */}
      <footer className="bg-[#f3f3fb] border-t border-[#c3c6d4]/30 w-full px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#434652] z-20">
        <div className="text-[#006b5f] font-medium flex items-center gap-2">
          <span>© 2024 RainRouter SG. Stay dry, walk smart.</span>
          <span className="hidden sm:inline text-gray-400">·</span>
          <span className="hidden sm:inline text-gray-500">Singapore Civic Tech & OneMap Powered</span>
        </div>

        <nav className="flex flex-wrap justify-center gap-4 text-xs">
          <button
            onClick={() => onTabChange('plan')}
            className="hover:text-[#003178] hover:underline cursor-pointer"
          >
            Route Planner
          </button>
          <button
            onClick={() => onTabChange('radar')}
            className="hover:text-[#003178] hover:underline cursor-pointer"
          >
            NEA Radar & Weather
          </button>
          <button
            onClick={() => onTabChange('civic')}
            className="hover:text-[#003178] hover:underline cursor-pointer"
          >
            LTA Traffic & Carparks
          </button>
          <button
            onClick={() => onTabChange('canvas')}
            className="hover:text-[#003178] hover:underline cursor-pointer"
          >
            Business Model
          </button>
          <button
            onClick={() => onTabChange('faq')}
            className="hover:text-[#003178] hover:underline cursor-pointer"
          >
            FAQ & Support
          </button>
        </nav>
      </footer>

      {/* Mobile Bottom Navigation Bar (Matching Image 4 & 5 & HTML) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-white/95 backdrop-blur-lg shadow-[0_-4px_16px_rgba(0,49,120,0.1)] rounded-t-2xl border-t border-[#c3c6d4]/30 md:hidden pb-safe">
        {/* Home / Story */}
        <button
          onClick={() => onTabChange('landing')}
          className={`flex flex-col items-center justify-center px-2 py-1 rounded-xl transition-all cursor-pointer ${
            currentTab === 'landing'
              ? 'text-[#003178] font-bold'
              : 'text-[#434652] hover:text-[#003178]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* Routes (Primary) */}
        <button
          onClick={() => onTabChange('plan')}
          className={`flex flex-col items-center justify-center px-3.5 py-1 rounded-full transition-all cursor-pointer ${
            currentTab === 'plan'
              ? 'bg-[#003178] text-white font-bold shadow-md scale-105'
              : 'text-[#434652] hover:text-[#003178]'
          }`}
        >
          <Navigation className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Routes</span>
        </button>

        {/* Radar */}
        <button
          onClick={() => onTabChange('radar')}
          className={`flex flex-col items-center justify-center px-2 py-1 rounded-xl transition-all cursor-pointer ${
            currentTab === 'radar'
              ? 'text-[#003178] font-bold'
              : 'text-[#434652] hover:text-[#003178]'
          }`}
        >
          <CloudRain className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Radar</span>
        </button>

        {/* Canvas / Support */}
        <button
          onClick={() => onTabChange('canvas')}
          className={`flex flex-col items-center justify-center px-2 py-1 rounded-xl transition-all cursor-pointer ${
            currentTab === 'canvas'
              ? 'text-[#003178] font-bold'
              : 'text-[#434652] hover:text-[#003178]'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Canvas</span>
        </button>
      </nav>
    </>
  );
};
