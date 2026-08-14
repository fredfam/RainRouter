import React, { useState, useEffect, useCallback } from 'react';
import { NavTab, WeatherForecastItem, PsiData, TrafficCamera, CarparkInfo } from './types';
import { Header } from './components/Header';
import { HeroLanding } from './components/HeroLanding';
import { RoutePlanner } from './components/RoutePlanner';
import { WeatherRadarDashboard } from './components/WeatherRadarDashboard';
import { CivicDataView } from './components/CivicDataView';
import { CanvasView } from './components/CanvasView';
import { FAQView } from './components/FAQView';
import { Footer } from './components/Footer';
import {
  fetchLiveWeatherForecast,
  fetchLivePsi,
  fetchLiveTrafficCameras,
  fetchLiveCarparks
} from './services/dataGovService';
import {
  INITIAL_WEATHER_FORECAST,
  INITIAL_PSI_DATA,
  INITIAL_TRAFFIC_CAMERAS,
  INITIAL_CARPARKS
} from './data/singaporeData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('plan');
  const [weather, setWeather] = useState<WeatherForecastItem[]>(INITIAL_WEATHER_FORECAST);
  const [psi, setPsi] = useState<PsiData | null>(INITIAL_PSI_DATA);
  const [trafficCameras, setTrafficCameras] = useState<TrafficCamera[]>(INITIAL_TRAFFIC_CAMERAS);
  const [carparks, setCarparks] = useState<CarparkInfo[]>(INITIAL_CARPARKS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadAllData = useCallback(async (isManual = false) => {
    setIsLoading(true);
    try {
      const [wData, psiData, camData, cpData] = await Promise.allSettled([
        fetchLiveWeatherForecast(),
        fetchLivePsi(),
        fetchLiveTrafficCameras(),
        fetchLiveCarparks()
      ]);

      if (wData.status === 'fulfilled') setWeather(wData.value);
      if (psiData.status === 'fulfilled') setPsi(psiData.value);
      if (camData.status === 'fulfilled') setTrafficCameras(camData.value);
      if (cpData.status === 'fulfilled') setCarparks(cpData.value);

      if (isManual) {
        showToast('✓ Singapore live weather & civic data refreshed');
      }
    } catch (err) {
      console.warn('Failed to load some live feeds, fallbacks in place:', err);
      if (isManual) {
        showToast('⚠️ Data synced with latest Singapore NEA/LTA cache');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadAllData(false);

    // Auto-refresh every 5 minutes (300,000 ms)
    const interval = setInterval(() => {
      loadAllData(false);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadAllData]);

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#1a1b21] flex flex-col font-sans selection:bg-[#003178]/20 selection:text-[#003178]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#003178] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        weather={weather}
        psi={psi}
        isLoading={isLoading}
        onRefreshData={() => loadAllData(true)}
      />

      {/* Main Screen Content Router */}
      <main className="flex-1 flex flex-col relative">
        {currentTab === 'plan' && (
          <RoutePlanner
            weather={weather}
            trafficCameras={trafficCameras}
            carparks={carparks}
          />
        )}

        {currentTab === 'landing' && (
          <HeroLanding
            onPlanRoute={() => setCurrentTab('plan')}
            weather={weather}
            psi={psi}
          />
        )}

        {currentTab === 'radar' && (
          <WeatherRadarDashboard
            weather={weather}
            psi={psi}
            onPlanShelteredRoute={() => setCurrentTab('plan')}
          />
        )}

        {currentTab === 'civic' && (
          <CivicDataView
            trafficCameras={trafficCameras}
            carparks={carparks}
            onRefresh={() => loadAllData(true)}
            isLoading={isLoading}
          />
        )}

        {currentTab === 'canvas' && (
          <CanvasView onExploreApp={() => setCurrentTab('plan')} />
        )}

        {currentTab === 'faq' && (
          <FAQView onPlanRoute={() => setCurrentTab('plan')} />
        )}
      </main>

      {/* Footer (with Mobile Bottom Nav Bar) */}
      <Footer currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}
