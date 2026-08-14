export type NavTab = 'plan' | 'landing' | 'radar' | 'civic' | 'canvas' | 'faq';

export interface LocationPreset {
  id: string;
  name: string;
  category: 'mrt' | 'landmark' | 'mall' | 'transport';
  lat: number;
  lng: number;
  description?: string;
}

export interface RouteSegment {
  type: 'sheltered' | 'underpass' | 'open' | 'mall_link';
  instruction: string;
  distanceMeters: number;
  durationMins: number;
  coordinates: [number, number][];
  shelterName?: string;
}

export interface RouteOption {
  id: string;
  name: string;
  subtitle: string;
  badge?: string;
  isKomfyPick?: boolean;
  durationMins: number;
  distanceKm: number;
  shelteredPercentage: number;
  shadePercentage?: number;
  uvExposureIndex: 'Low' | 'Moderate' | 'High';
  rainRisk: 'dry' | 'light' | 'heavy';
  weatherStripType: 'dry' | 'balanced' | 'rain';
  features: string[];
  tags: { label: string; icon: string }[];
  coordinates: [number, number][];
  segments: RouteSegment[];
  summary: string;
}

export interface WeatherForecastItem {
  area: string;
  forecast: string;
  icon: string;
  temp?: number;
  humidity?: number;
}

export interface PsiData {
  overallIndex: number;
  status: string;
  national: number;
  regions: {
    central: number;
    east: number;
    west: number;
    north: number;
    south: number;
  };
  updateTime: string;
}

export interface TrafficCamera {
  id: string;
  locationName: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  timestamp: string;
}

export interface CarparkInfo {
  carparkNumber: string;
  address: string;
  availableLots: number;
  totalLots: number;
  occupancyPercent: number;
  lat: number;
  lng: number;
  type: string;
}

export interface BmcCard {
  title: string;
  subtitle: string;
  color: string;
  bulletPoints: string[];
}
