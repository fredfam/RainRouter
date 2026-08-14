export type NavTab = 'plan' | 'landing' | 'radar' | 'civic' | 'canvas' | 'faq';

export type RouteType = 'walk' | 'drive' | 'cycle' | 'pt';

export interface LocationPreset {
  id: string;
  name: string;
  category: 'mrt' | 'landmark' | 'mall' | 'transport' | 'address';
  lat: number;
  lng: number;
  description?: string;
  postalCode?: string;
  address?: string;
}

export interface OneMapSearchResult {
  SEARCHVAL: string;
  BLK_NO: string;
  ROAD_NAME: string;
  BUILDING: string;
  ADDRESS: string;
  POSTAL: string;
  X: string;
  Y: string;
  LATITUDE: string;
  LONGITUDE: string;
}

export interface OneMapRouteResponse {
  status_message?: string;
  route_geometry?: string;
  route_summary?: {
    total_distance: number;
    total_time: number;
    start_point: string;
    end_point: string;
  };
  route_instructions?: string[][];
  route_name?: string[];
  error?: string;
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
