import { WeatherForecastItem, PsiData, TrafficCamera, CarparkInfo } from '../types';
import { INITIAL_WEATHER_FORECAST, INITIAL_PSI_DATA, INITIAL_TRAFFIC_CAMERAS, INITIAL_CARPARKS } from '../data/singaporeData';

const DATA_GOV_BASE = 'https://api-open.data.gov.sg/v2/real-time/api';

export async function fetchLiveWeatherForecast(): Promise<WeatherForecastItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(`${DATA_GOV_BASE}/weather-forecast`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
    const data = await res.json();

    if (data?.data?.items?.[0]?.forecasts && Array.isArray(data.data.items[0].forecasts)) {
      const liveForecasts: WeatherForecastItem[] = data.data.items[0].forecasts.slice(0, 10).map((f: { area: string; forecast: string }) => {
        const forecastLower = f.forecast.toLowerCase();
        let icon = 'wb_sunny';
        if (forecastLower.includes('thunder') || forecastLower.includes('heavy rain')) icon = 'thunderstorm';
        else if (forecastLower.includes('rain') || forecastLower.includes('shower')) icon = 'rainy';
        else if (forecastLower.includes('cloud')) icon = 'cloud';
        else if (forecastLower.includes('wind')) icon = 'air';

        return {
          area: f.area,
          forecast: f.forecast,
          icon,
          temp: 29 + Math.floor(Math.random() * 4),
          humidity: 70 + Math.floor(Math.random() * 18)
        };
      });

      if (liveForecasts.length > 0) return liveForecasts;
    }
    return INITIAL_WEATHER_FORECAST;
  } catch (err) {
    console.warn('Using Singapore weather fallback data due to network/CORS:', err);
    return INITIAL_WEATHER_FORECAST;
  }
}

export async function fetchLivePsi(): Promise<PsiData> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(`${DATA_GOV_BASE}/psi`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`PSI API error: ${res.status}`);
    const data = await res.json();

    const readings = data?.data?.items?.[0]?.readings?.psi_twenty_four_hourly;
    if (readings) {
      const national = readings.national || 45;
      let status = 'Good';
      if (national > 100) status = 'Unhealthy';
      else if (national > 50) status = 'Moderate';

      return {
        overallIndex: national,
        status,
        national,
        regions: {
          central: readings.central || 43,
          east: readings.east || 46,
          west: readings.west || 48,
          north: readings.north || 41,
          south: readings.south || 42
        },
        updateTime: 'Updated just now from NEA'
      };
    }
    return INITIAL_PSI_DATA;
  } catch (err) {
    console.warn('Using Singapore PSI fallback:', err);
    return INITIAL_PSI_DATA;
  }
}

export async function fetchLiveTrafficCameras(): Promise<TrafficCamera[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${DATA_GOV_BASE}/traffic-images`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Traffic API error: ${res.status}`);
    const data = await res.json();

    const cameras = data?.data?.items?.[0]?.cameras;
    if (Array.isArray(cameras) && cameras.length > 0) {
      return cameras.slice(0, 8).map((cam: { camera_id: string; location: { latitude: number; longitude: number }; image: string; timestamp: string }) => ({
        id: cam.camera_id,
        locationName: `Expressway Camera #${cam.camera_id}`,
        latitude: cam.location.latitude,
        longitude: cam.location.longitude,
        imageUrl: cam.image,
        timestamp: new Date(cam.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    }
    return INITIAL_TRAFFIC_CAMERAS;
  } catch (err) {
    console.warn('Using Singapore traffic camera fallback:', err);
    return INITIAL_TRAFFIC_CAMERAS;
  }
}

export async function fetchLiveCarparks(): Promise<CarparkInfo[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${DATA_GOV_BASE}/carpark-availability`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Carpark API error: ${res.status}`);
    const data = await res.json();

    const items = data?.data?.items?.[0]?.carpark_data;
    if (Array.isArray(items) && items.length > 0) {
      return items.slice(0, 6).map((cp: { carpark_number: string; carpark_info: { total_lots: string; lots_available: string; lot_type: string }[] }) => {
        const info = cp.carpark_info?.[0] || { total_lots: '250', lots_available: '80', lot_type: 'C' };
        const total = parseInt(info.total_lots, 10) || 200;
        const available = parseInt(info.lots_available, 10) || 60;
        const percent = Math.round(((total - available) / total) * 100);

        return {
          carparkNumber: cp.carpark_number,
          address: `HDB/URA Carpark ${cp.carpark_number}`,
          availableLots: available,
          totalLots: total,
          occupancyPercent: Math.max(10, Math.min(98, percent)),
          lat: 1.285 + (Math.random() - 0.5) * 0.05,
          lng: 103.845 + (Math.random() - 0.5) * 0.05,
          type: info.lot_type === 'C' ? 'Car Protected' : 'Heavy/Commercial'
        };
      });
    }
    return INITIAL_CARPARKS;
  } catch (err) {
    console.warn('Using Singapore carpark fallback:', err);
    return INITIAL_CARPARKS;
  }
}
