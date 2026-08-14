import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import {
  LocationPreset,
  RouteOption,
  RouteType,
  WeatherForecastItem,
  TrafficCamera,
  CarparkInfo
} from '../types';
import { SINGAPORE_LANDMARKS } from '../data/singaporeData';
import {
  searchOneMap,
  reverseGeocodeOneMap,
  computeComfortRoutes,
  getOneMapToken,
  setManualOneMapToken
} from '../services/oneMapService';
import {
  Search,
  ArrowUpDown,
  Sun,
  Clock,
  Footprints,
  Umbrella,
  Shield,
  Layers,
  Locate,
  CloudRain,
  Camera,
  Car,
  Bike,
  Bus,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  AlertTriangle,
  Key,
  Navigation,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface RoutePlannerProps {
  weather: WeatherForecastItem[];
  trafficCameras: TrafficCamera[];
  carparks: CarparkInfo[];
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  weather,
  trafficCameras,
  carparks
}) => {
  // Route selection states
  const [startQuery, setStartQuery] = useState('Novena MRT Station');
  const [endQuery, setEndQuery] = useState('Toa Payoh Bus Interchange');
  const [selectedStart, setSelectedStart] = useState<LocationPreset>(SINGAPORE_LANDMARKS[3]); // Novena
  const [selectedEnd, setSelectedEnd] = useState<LocationPreset>(SINGAPORE_LANDMARKS[4]); // Toa Payoh

  // Route type: walk | drive | cycle | pt
  const [routeType, setRouteType] = useState<RouteType>('walk');

  const [sunShadeActive, setSunShadeActive] = useState(true);
  const [departTime, setDepartTime] = useState<'Now' | '12 PM' | '1 PM' | 'Custom'>('Now');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('balanced');
  const [showSteps, setShowSteps] = useState(false);

  // Computed routes state
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [isLiveOneMap, setIsLiveOneMap] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Map layer controls
  const [activeBaseLayer, setActiveBaseLayer] = useState<'onemap' | 'carto' | 'osm'>('onemap');
  const [showRadarOverlay, setShowRadarOverlay] = useState(false);
  const [showCameras, setShowCameras] = useState(true);
  const [showCarparks, setShowCarparks] = useState(false);

  // Mobile bottom sheet expanded state
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  // Autocomplete suggestions
  const [startSuggestions, setStartSuggestions] = useState<LocationPreset[]>(SINGAPORE_LANDMARKS.slice(0, 5));
  const [endSuggestions, setEndSuggestions] = useState<LocationPreset[]>(SINGAPORE_LANDMARKS.slice(0, 5));
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const [isSearchingStart, setIsSearchingStart] = useState(false);
  const [isSearchingEnd, setIsSearchingEnd] = useState(false);

  // OneMap Token Modal
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenEmail, setTokenEmail] = useState('');
  const [tokenPassword, setTokenPassword] = useState('');
  const [manualTokenInput, setManualTokenInput] = useState('');
  const [hasActiveToken, setHasActiveToken] = useState(false);
  const [tokenStatusMessage, setTokenStatusMessage] = useState<string | null>(null);

  // Leaflet map refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayersRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const overlayLayerRef = useRef<L.LayerGroup | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);

  // Check token on mount
  useEffect(() => {
    getOneMapToken().then(tok => {
      if (tok) setHasActiveToken(true);
    });
  }, []);

  // Compute routes asynchronously using OneMap routing engine
  const calculateRoutes = useCallback(async () => {
    setIsCalculating(true);
    try {
      const result = await computeComfortRoutes(selectedStart, selectedEnd, routeType, sunShadeActive, departTime);
      setRoutes(result.routes);
      setIsLiveOneMap(result.isLiveOneMap);
      if (!result.routes.some(r => r.id === selectedRouteId)) {
        setSelectedRouteId('balanced');
      }
    } catch (err) {
      console.warn('Error calculating routes:', err);
    } finally {
      setIsCalculating(false);
    }
  }, [selectedStart, selectedEnd, routeType, sunShadeActive, departTime, selectedRouteId]);

  useEffect(() => {
    calculateRoutes();
  }, [calculateRoutes]);

  const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0] || null;

  // Debounced search for Start
  useEffect(() => {
    if (!startQuery || startQuery.trim().length < 2) {
      setStartSuggestions(SINGAPORE_LANDMARKS.slice(0, 5));
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingStart(true);
      const results = await searchOneMap(startQuery);
      setStartSuggestions(results.length > 0 ? results : SINGAPORE_LANDMARKS.slice(0, 5));
      setIsSearchingStart(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [startQuery]);

  // Debounced search for End
  useEffect(() => {
    if (!endQuery || endQuery.trim().length < 2) {
      setEndSuggestions(SINGAPORE_LANDMARKS.slice(0, 5));
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingEnd(true);
      const results = await searchOneMap(endQuery);
      setEndSuggestions(results.length > 0 ? results : SINGAPORE_LANDMARKS.slice(0, 5));
      setIsSearchingEnd(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [endQuery]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [1.3238, 103.8500],
      zoom: 14,
      zoomControl: false
    });

    // Base Tile Layer (OneMap default)
    const onemapTile = L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 11,
      attribution: '<a href="https://www.onemap.gov.sg/" target="_blank">OneMap</a> | &copy; SLA'
    });

    onemapTile.addTo(map);
    baseTileLayerRef.current = onemapTile;

    // Layer groups
    const routeLayers = L.layerGroup().addTo(map);
    const markersLayer = L.layerGroup().addTo(map);
    const overlayLayer = L.layerGroup().addTo(map);

    routeLayersRef.current = routeLayers;
    markersLayerRef.current = markersLayer;
    overlayLayerRef.current = overlayLayer;
    mapInstanceRef.current = map;

    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Map Click to Set Destination via Reverse Geocoding
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const reversePreset = await reverseGeocodeOneMap(lat, lng);
      if (reversePreset) {
        setSelectedEnd(reversePreset);
        setEndQuery(reversePreset.name);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !baseTileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(baseTileLayerRef.current);

    let newUrl = 'https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png';
    let attribution = '<a href="https://www.onemap.gov.sg/">OneMap</a> | SLA';

    if (activeBaseLayer === 'carto') {
      newUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      attribution = '&copy; CARTO &copy; OpenStreetMap';
    } else if (activeBaseLayer === 'osm') {
      newUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; OpenStreetMap contributors';
    }

    const newLayer = L.tileLayer(newUrl, { maxZoom: 19, attribution });
    newLayer.addTo(mapInstanceRef.current);
    baseTileLayerRef.current = newLayer;
  }, [activeBaseLayer]);

  // Render Routes and Waypoints on Map
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayersRef.current || !markersLayerRef.current) return;
    if (!activeRoute) return;

    routeLayersRef.current.clearLayers();
    markersLayerRef.current.clearLayers();

    // 1. Render All Routes with Inactive & Active Styles
    routes.forEach(route => {
      const isSelected = route.id === selectedRouteId;
      const coords = route.coordinates;
      if (!coords || coords.length === 0) return;

      if (isSelected) {
        // Active Route Outline (Glow)
        L.polyline(coords, {
          color: '#ffffff',
          weight: 9,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(routeLayersRef.current!);

        // Draw segmented colors (Sheltered = Green, Underpass = Blue, Open = Orange)
        if (route.segments && route.segments.length > 0) {
          route.segments.forEach(segment => {
            let segColor = '#43A047'; // Sheltered green
            let segDash: string | undefined = undefined;

            if (segment.type === 'underpass') {
              segColor = '#003178'; // Underpass navy
            } else if (segment.type === 'open') {
              segColor = '#FF7043'; // Open coral/orange
              segDash = '6, 6';
            }

            if (segment.coordinates && segment.coordinates.length > 0) {
              L.polyline(segment.coordinates, {
                color: segColor,
                weight: 6,
                opacity: 1,
                dashArray: segDash,
                lineCap: 'round'
              }).bindTooltip(`<strong>${segment.shelterName || segment.instruction}</strong><br/>${segment.type.toUpperCase()} · ${segment.distanceMeters}m`, {
                sticky: true,
                className: 'text-xs'
              }).addTo(routeLayersRef.current!);
            }
          });
        } else {
          L.polyline(coords, {
            color: route.weatherStripType === 'dry' ? '#43A047' : route.weatherStripType === 'balanced' ? '#006b5f' : '#FF7043',
            weight: 6,
            opacity: 1
          }).addTo(routeLayersRef.current!);
        }
      } else {
        // Inactive Route (Gray translucent)
        L.polyline(coords, {
          color: '#737783',
          weight: 4,
          opacity: 0.45,
          dashArray: '4, 6'
        }).addTo(routeLayersRef.current!);
      }
    });

    // 2. Start Marker (Custom Pulse Blue Pin)
    const startIcon = L.divIcon({
      className: 'custom-start-marker',
      html: `
        <div style="background: #003178; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,49,120,0.3); border: 2.5px solid white;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="8"/></svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    L.marker([selectedStart.lat, selectedStart.lng], { icon: startIcon })
      .bindPopup(`<div class="p-1"><strong>Start:</strong> ${selectedStart.name}<br/><span class="text-xs text-gray-500">${selectedStart.description || 'Singapore'}</span></div>`)
      .addTo(markersLayerRef.current);

    // 3. End Marker (Custom Teal Destination Pin)
    const endIcon = L.divIcon({
      className: 'custom-end-marker',
      html: `
        <div style="background: #006b5f; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,107,95,0.35); border: 2.5px solid white;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 34]
    });

    L.marker([selectedEnd.lat, selectedEnd.lng], { icon: endIcon })
      .bindPopup(`<div class="p-1"><strong>Destination:</strong> ${selectedEnd.name}<br/><span class="text-xs text-gray-500">${selectedEnd.description || 'Singapore'}</span></div>`)
      .addTo(markersLayerRef.current);

    // Fit map bounds
    if (activeRoute.coordinates && activeRoute.coordinates.length > 0) {
      const group = L.featureGroup([
        L.marker([selectedStart.lat, selectedStart.lng]),
        L.marker([selectedEnd.lat, selectedEnd.lng]),
        ...activeRoute.coordinates.map(c => L.marker(c))
      ]);
      mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [60, 60], maxZoom: 16 });
    }
  }, [selectedStart, selectedEnd, selectedRouteId, activeRoute, routes]);

  // Traffic Cameras & Carpark Pins Overlay
  useEffect(() => {
    if (!mapInstanceRef.current || !overlayLayerRef.current) return;
    overlayLayerRef.current.clearLayers();

    // 1. Traffic Cameras
    if (showCameras && trafficCameras.length > 0) {
      trafficCameras.forEach(cam => {
        const camIcon = L.divIcon({
          className: 'cam-marker',
          html: `
            <div style="background: #ffffff; color: #003178; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.25); border: 2px solid #003178;">
              <span style="font-size: 13px;">📷</span>
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = L.marker([cam.latitude, cam.longitude], { icon: camIcon });
        marker.bindPopup(`
          <div style="width: 220px; font-family: sans-serif;">
            <div style="font-size: 12px; font-weight: bold; color: #003178; margin-bottom: 4px;">${cam.locationName}</div>
            <img src="${cam.imageUrl}" alt="Traffic view" style="width: 100%; border-radius: 6px; height: 120px; object-fit: cover; background: #eee;" />
            <div style="font-size: 10px; color: #666; margin-top: 4px; display: flex; justify-content: space-between;">
              <span>Live LTA Feed</span>
              <span>${cam.timestamp}</span>
            </div>
          </div>
        `);
        overlayLayerRef.current?.addLayer(marker);
      });
    }

    // 2. Carparks
    if (showCarparks && carparks.length > 0) {
      carparks.forEach(cp => {
        const isLotsLow = cp.occupancyPercent > 80;
        const color = isLotsLow ? '#FF7043' : '#43A047';

        const cpIcon = L.divIcon({
          className: 'cp-marker',
          html: `
            <div style="background: ${color}; color: white; padding: 2px 6px; border-radius: 12px; font-size: 10px; font-weight: bold; box-shadow: 0 2px 6px rgba(0,0,0,0.2); white-space: nowrap; border: 1.5px solid white;">
              🅿️ ${cp.availableLots} lots
            </div>
          `,
          iconSize: [60, 20],
          iconAnchor: [30, 10]
        });

        const marker = L.marker([cp.lat, cp.lng], { icon: cpIcon });
        marker.bindPopup(`
          <div style="font-size: 12px;">
            <strong>${cp.address}</strong><br/>
            <span style="color: ${color}; font-weight: bold;">${cp.availableLots} / ${cp.totalLots} Lots Available (${100 - cp.occupancyPercent}% vacant)</span><br/>
            <span style="color: #666; font-size: 10px;">Type: ${cp.type}</span>
          </div>
        `);
        overlayLayerRef.current?.addLayer(marker);
      });
    }

    // 3. Simulated NEA Weather Rain Clouds Overlay
    if (showRadarOverlay) {
      const rainCloudCircle = L.circle([1.325, 103.85], {
        color: '#00bcd4',
        fillColor: '#03a9f4',
        fillOpacity: 0.35,
        radius: 2000
      }).bindPopup('<strong>NEA Live Rain Cell</strong><br/>Passing shower cell detected near Novena/Toa Payoh.');

      overlayLayerRef.current?.addLayer(rainCloudCircle);
    }
  }, [showCameras, showCarparks, showRadarOverlay, trafficCameras, carparks]);

  const handleSwapLocations = () => {
    const tempPreset = selectedStart;
    const tempQuery = startQuery;
    setSelectedStart(selectedEnd);
    setStartQuery(endQuery);
    setSelectedEnd(tempPreset);
    setEndQuery(tempQuery);
  };

  const handleSelectStart = (preset: LocationPreset) => {
    setSelectedStart(preset);
    setStartQuery(preset.name);
    setShowStartSuggestions(false);
  };

  const handleSelectEnd = (preset: LocationPreset) => {
    setSelectedEnd(preset);
    setEndQuery(preset.name);
    setShowEndSuggestions(false);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition(
        async pos => {
          const { latitude, longitude } = pos.coords;
          mapInstanceRef.current?.setView([latitude, longitude], 16);
          const rev = await reverseGeocodeOneMap(latitude, longitude);
          if (rev) {
            setSelectedStart(rev);
            setStartQuery(rev.name);
          } else {
            setSelectedStart({
              id: 'current_loc',
              name: 'My Current Location',
              category: 'landmark',
              lat: latitude,
              lng: longitude
            });
            setStartQuery('My Current Location');
          }
        },
        () => {
          // Fallback to Singapore Novena
          mapInstanceRef.current?.setView([1.320981, 103.844150], 16);
        }
      );
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([1.320981, 103.844150], 16);
    }
  };

  const handleMintToken = async () => {
    if (!tokenEmail || !tokenPassword) {
      setTokenStatusMessage('Please enter OneMap email and password.');
      return;
    }
    setTokenStatusMessage('Minting 3-day OneMap token...');
    const tok = await getOneMapToken(tokenEmail, tokenPassword);
    if (tok) {
      setHasActiveToken(true);
      setTokenStatusMessage('✓ OneMap token minted successfully (valid 3 days)!');
      setTimeout(() => {
        setShowTokenModal(false);
        setTokenStatusMessage(null);
        calculateRoutes();
      }, 1200);
    } else {
      setTokenStatusMessage('Failed to mint token. Please verify credentials with SLA OneMap.');
    }
  };

  const handleSaveManualToken = () => {
    if (manualTokenInput.trim()) {
      setManualOneMapToken(manualTokenInput.trim());
      setHasActiveToken(true);
      setTokenStatusMessage('✓ Bearer token saved!');
      setTimeout(() => {
        setShowTokenModal(false);
        setTokenStatusMessage(null);
        calculateRoutes();
      }, 1000);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden bg-[#e8ecf4]">
      {/* 1. Leaflet Interactive Map Canvas (Full Background) */}
      <div className="absolute inset-0 z-0">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* 2. Floating Action Controls on Map (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* Recenter button */}
        <button
          onClick={handleLocateMe}
          title="Locate Current Position"
          className="w-10 h-10 rounded-full bg-white text-[#003178] shadow-md hover:bg-gray-50 flex items-center justify-center transition-transform active:scale-90 border border-gray-200 cursor-pointer"
        >
          <Locate className="w-5 h-5" />
        </button>

        {/* Base Layer Switcher */}
        <div className="relative group">
          <button
            title="Switch Map Tiles"
            className="w-10 h-10 rounded-full bg-white text-[#003178] shadow-md hover:bg-gray-50 flex items-center justify-center transition-transform active:scale-90 border border-gray-200 cursor-pointer"
          >
            <Layers className="w-5 h-5" />
          </button>
          <div className="absolute right-0 top-12 hidden group-hover:flex flex-col gap-1 bg-white p-2 rounded-xl shadow-xl border border-gray-200 w-36 text-xs z-30">
            <span className="font-bold text-[#003178] px-2 py-1">Map Layer:</span>
            <button
              onClick={() => setActiveBaseLayer('onemap')}
              className={`text-left px-2 py-1.5 rounded-lg ${activeBaseLayer === 'onemap' ? 'bg-[#003178] text-white font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              OneMap SG (Official)
            </button>
            <button
              onClick={() => setActiveBaseLayer('carto')}
              className={`text-left px-2 py-1.5 rounded-lg ${activeBaseLayer === 'carto' ? 'bg-[#003178] text-white font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              Carto Clean
            </button>
            <button
              onClick={() => setActiveBaseLayer('osm')}
              className={`text-left px-2 py-1.5 rounded-lg ${activeBaseLayer === 'osm' ? 'bg-[#003178] text-white font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              OpenStreetMap
            </button>
          </div>
        </div>

        {/* Rain Radar Toggle */}
        <button
          onClick={() => setShowRadarOverlay(!showRadarOverlay)}
          title="Toggle NEA Rain Clouds Overlay"
          className={`w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all active:scale-90 border ${
            showRadarOverlay
              ? 'bg-[#00bcd4] text-white border-[#00bcd4]'
              : 'bg-white text-[#434652] hover:bg-gray-50 border-gray-200'
          } cursor-pointer`}
        >
          <CloudRain className="w-5 h-5" />
        </button>

        {/* Traffic Cameras Toggle */}
        <button
          onClick={() => setShowCameras(!showCameras)}
          title="Toggle LTA Traffic Cameras"
          className={`w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all active:scale-90 border ${
            showCameras
              ? 'bg-[#003178] text-white border-[#003178]'
              : 'bg-white text-[#434652] hover:bg-gray-50 border-gray-200'
          } cursor-pointer`}
        >
          <Camera className="w-5 h-5" />
        </button>

        {/* Carparks Toggle */}
        <button
          onClick={() => setShowCarparks(!showCarparks)}
          title="Toggle Carpark Availability"
          className={`w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all active:scale-90 border ${
            showCarparks
              ? 'bg-[#006b5f] text-white border-[#006b5f]'
              : 'bg-white text-[#434652] hover:bg-gray-50 border-gray-200'
          } cursor-pointer`}
        >
          <Car className="w-5 h-5" />
        </button>

        {/* OneMap Token Settings */}
        <button
          onClick={() => setShowTokenModal(true)}
          title="OneMap API Token & Auth"
          className={`w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all active:scale-90 border ${
            hasActiveToken
              ? 'bg-[#003178] text-amber-300 border-[#003178]'
              : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
          } cursor-pointer`}
        >
          <Key className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Left Planning Sidebar (Desktop) / Bottom Sheet (Mobile) */}
      <aside
        className={`relative z-10 w-full md:w-[420px] glass-panel md:m-4 md:rounded-2xl flex flex-col shadow-[0_8px_32px_rgba(0,49,120,0.12)] border border-white/60 transition-all duration-300 ${
          isMobileExpanded
            ? 'h-[85vh] mt-auto rounded-t-3xl'
            : 'h-[380px] md:h-[calc(100%-32px)] mt-auto md:mt-0 rounded-t-3xl md:rounded-2xl'
        }`}
      >
        {/* Mobile Pull Handle */}
        <div
          className="w-full flex flex-col items-center pt-2.5 pb-1 md:hidden cursor-pointer"
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
        >
          <div className="w-12 h-1.5 bg-[#c3c6d4] rounded-full mb-1"></div>
          <span className="text-[10px] text-gray-500 font-medium">
            {isMobileExpanded ? 'Tap to minimize' : 'Tap or drag to expand'}
          </span>
        </div>

        {/* Scrollable Content Container */}
        <div className="p-4 sm:p-5 flex flex-col gap-3.5 overflow-y-auto flex-1">
          {/* Header Title & OneMap Engine Indicator */}
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[#003178] tracking-tight">Route Planner</h1>
              <div className="flex items-center gap-1.5">
                {isLiveOneMap ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    OneMap Live
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold flex items-center gap-1">
                    OneMap API Ready
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-[#434652] mt-0.5">Singapore OneMap REST API & Sheltered Path Engine</p>
          </div>

          {/* Mode Selector: Walk | Drive | PT | Cycle */}
          <div className="grid grid-cols-4 gap-1.5 bg-gray-100/80 p-1 rounded-xl border border-gray-200/60">
            <button
              onClick={() => setRouteType('walk')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                routeType === 'walk'
                  ? 'bg-[#003178] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Walk</span>
            </button>
            <button
              onClick={() => setRouteType('drive')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                routeType === 'drive'
                  ? 'bg-[#003178] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Drive</span>
            </button>
            <button
              onClick={() => setRouteType('cycle')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                routeType === 'cycle'
                  ? 'bg-[#003178] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Cycle</span>
            </button>
            <button
              onClick={() => setRouteType('pt')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                routeType === 'pt'
                  ? 'bg-[#003178] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Bus className="w-3.5 h-3.5" />
              <span>Transit</span>
            </button>
          </div>

          {/* Start and Destination Input Box with Live OneMap Search */}
          <div className="flex flex-col gap-2 relative">
            {/* Connecting Vertical Line */}
            <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-[#c3c6d4]/40 z-0"></div>

            {/* Start Input */}
            <div className="relative z-10">
              <div className="flex items-center bg-white border border-[#c3c6d4]/60 rounded-xl px-3 py-2 shadow-xs focus-within:ring-2 focus-within:ring-[#003178]">
                <div className="w-6 flex justify-center text-[#003178] mr-2">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#003178] bg-white"></div>
                </div>
                <input
                  type="text"
                  value={startQuery}
                  onChange={e => {
                    setStartQuery(e.target.value);
                    setShowStartSuggestions(true);
                  }}
                  onFocus={() => setShowStartSuggestions(true)}
                  placeholder="Search start address / MRT in OneMap..."
                  className="flex-1 text-xs sm:text-sm font-medium text-[#1a1b21] bg-transparent outline-hidden"
                />
                {isSearchingStart && <RefreshCw className="w-3 h-3 text-gray-400 animate-spin mr-1" />}
              </div>

              {/* Start Suggestions Dropdown */}
              {showStartSuggestions && (
                <div className="absolute top-11 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-40 max-h-52 overflow-y-auto">
                  <div className="text-[10px] font-bold text-gray-400 px-3 py-1 uppercase flex justify-between">
                    <span>OneMap Singapore Results</span>
                    <span className="text-[#003178]">Live</span>
                  </div>
                  {startSuggestions.map(l => (
                    <button
                      key={l.id}
                      onClick={() => handleSelectStart(l)}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#003178]/5 text-xs text-gray-800 flex flex-col justify-start cursor-pointer border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold text-[#003178]">{l.name}</span>
                        <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded uppercase">{l.category}</span>
                      </div>
                      {l.description && <span className="text-[10px] text-gray-500 truncate w-full">{l.description}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button in middle */}
            <div className="flex justify-end -my-1 mr-3 z-10">
              <button
                onClick={handleSwapLocations}
                title="Swap Start & Destination"
                className="w-7 h-7 rounded-full bg-white shadow-xs border border-gray-200 text-[#003178] hover:bg-gray-100 flex items-center justify-center transition-transform active:rotate-180 cursor-pointer"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Destination Input */}
            <div className="relative z-10">
              <div className="flex items-center bg-white border border-[#c3c6d4]/60 rounded-xl px-3 py-2 shadow-xs focus-within:ring-2 focus-within:ring-[#003178]">
                <div className="w-6 flex justify-center text-[#006b5f] mr-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#006b5f]"></div>
                </div>
                <input
                  type="text"
                  value={endQuery}
                  onChange={e => {
                    setEndQuery(e.target.value);
                    setShowEndSuggestions(true);
                  }}
                  onFocus={() => setShowEndSuggestions(true)}
                  placeholder="Search destination in OneMap..."
                  className="flex-1 text-xs sm:text-sm font-medium text-[#1a1b21] bg-transparent outline-hidden"
                />
                {isSearchingEnd && <RefreshCw className="w-3 h-3 text-gray-400 animate-spin mr-1" />}
              </div>

              {/* End Suggestions Dropdown */}
              {showEndSuggestions && (
                <div className="absolute top-11 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-40 max-h-52 overflow-y-auto">
                  <div className="text-[10px] font-bold text-gray-400 px-3 py-1 uppercase flex justify-between">
                    <span>OneMap Singapore Results</span>
                    <span className="text-[#006b5f]">Live</span>
                  </div>
                  {endSuggestions.map(l => (
                    <button
                      key={l.id}
                      onClick={() => handleSelectEnd(l)}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#006b5f]/5 text-xs text-gray-800 flex flex-col justify-start cursor-pointer border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold text-[#006b5f]">{l.name}</span>
                        <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded uppercase">{l.category}</span>
                      </div>
                      {l.description && <span className="text-[10px] text-gray-500 truncate w-full">{l.description}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Preset Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-gray-400 text-[10px] font-medium shrink-0 uppercase">Presets:</span>
            <button
              onClick={() => {
                handleSelectStart(SINGAPORE_LANDMARKS[3]);
                handleSelectEnd(SINGAPORE_LANDMARKS[4]);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-[#003178] border border-gray-200 shrink-0 font-medium cursor-pointer text-xs"
            >
              Novena ➔ Toa Payoh (Default)
            </button>
            <button
              onClick={() => {
                handleSelectStart(SINGAPORE_LANDMARKS[0]);
                handleSelectEnd(SINGAPORE_LANDMARKS[1]);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-[#003178] border border-gray-200 shrink-0 font-medium cursor-pointer text-xs"
            >
              Raffles ➔ MBS
            </button>
            <button
              onClick={() => {
                handleSelectStart(SINGAPORE_LANDMARKS[6]);
                handleSelectEnd(SINGAPORE_LANDMARKS[5]);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-[#003178] border border-gray-200 shrink-0 font-medium cursor-pointer text-xs"
            >
              City Hall ➔ Suntec
            </button>
          </div>

          {/* Controls: Weather Sun Shade Toggle & Depart Time Selector */}
          <div className="flex flex-col gap-2.5 bg-white/70 p-3 rounded-xl border border-[#c3c6d4]/40 shadow-xs">
            {/* Sun Shade Mode Toggle */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#FF7043]" />
                <span className="text-xs font-semibold text-[#1a1b21]">Sun shade mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sunShadeActive}
                  onChange={e => setSunShadeActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#003178]"></div>
              </label>
            </div>

            {/* Depart At Time */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200/60">
              <div className="flex items-center gap-1.5 text-[#434652] text-xs font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Depart at</span>
              </div>
              <div className="flex gap-1.5">
                {(['Now', '12 PM', '1 PM'] as const).map(time => (
                  <button
                    key={time}
                    onClick={() => setDepartTime(time)}
                    className={`px-2.5 py-0.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      departTime === time
                        ? 'bg-[#003178] text-white shadow-xs'
                        : 'bg-white text-[#1a1b21] border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={calculateRoutes}
            disabled={isCalculating}
            className="w-full bg-[#003178] hover:bg-[#002254] text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-75"
          >
            {isCalculating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Computing OneMap Route...</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                <span>Calculate OneMap Route</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="h-px w-full bg-[#c3c6d4]/30 my-0.5"></div>

          {/* Route Options List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-[#1a1b21]">Route options</h2>
              <span className="text-[11px] text-gray-500 font-medium">Ranked by comfort & shelter</span>
            </div>

            <div className="flex flex-col gap-2">
              {routes.map(route => {
                const isSelected = route.id === selectedRouteId;
                const weatherStripClass =
                  route.weatherStripType === 'dry'
                    ? 'weather-strip-dry'
                    : route.weatherStripType === 'balanced'
                    ? 'weather-strip-balanced'
                    : 'weather-strip-rain';

                return (
                  <div
                    key={route.id}
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`bg-white rounded-xl p-3 transition-all cursor-pointer relative overflow-hidden border ${weatherStripClass} ${
                      isSelected
                        ? 'active-card-shadow border-[#003178]/30 ring-1 ring-[#003178]/30'
                        : 'border-[#c3c6d4]/40 hover:bg-gray-50/80 opacity-90'
                    }`}
                  >
                    {/* Komfy Pick Top Right Badge */}
                    {route.isKomfyPick && (
                      <div className="absolute top-0 right-0 bg-[#003178] text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                        Komfy Pick
                      </div>
                    )}

                    {/* Title & ETA */}
                    <div className="flex justify-between items-start mb-1 mt-0.5">
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-[#003178] flex items-center gap-1">
                          {route.name}
                          {route.isKomfyPick && <CheckCircle2 className="w-3.5 h-3.5 text-[#003178]" />}
                        </h3>
                        <p className="text-[11px] text-[#434652] truncate max-w-[200px]">{route.subtitle}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#1a1b21] block leading-tight">{route.durationMins} min</span>
                        <span className="text-[10px] text-gray-500">{route.distanceKm} km</span>
                      </div>
                    </div>

                    {/* Sheltered Progress Meter */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden flex">
                        <div
                          className={`h-full ${
                            route.weatherStripType === 'dry'
                              ? 'bg-[#43A047]'
                              : route.weatherStripType === 'balanced'
                              ? 'bg-[#006b5f]'
                              : 'bg-[#FF7043]'
                          }`}
                          style={{ width: `${route.shelteredPercentage}%` }}
                        ></div>
                      </div>
                      <span
                        className={`text-[11px] font-bold ${
                          route.weatherStripType === 'dry'
                            ? 'text-[#43A047]'
                            : route.weatherStripType === 'balanced'
                            ? 'text-[#006b5f]'
                            : 'text-[#FF7043]'
                        }`}
                      >
                        {route.shelteredPercentage}% sheltered
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {route.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-[#E3F2FD] text-[#003178] px-1.5 py-0.5 rounded text-[9px] font-semibold flex items-center gap-1"
                        >
                          <Shield className="w-2.5 h-2.5" />
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Turn-by-Turn Directions Toggle */}
          {activeRoute && (
            <div className="bg-white/80 rounded-xl p-3 border border-[#c3c6d4]/40">
              <button
                onClick={() => setShowSteps(!showSteps)}
                className="w-full flex items-center justify-between text-xs font-bold text-[#003178] cursor-pointer"
              >
                <span>Step-by-step OneMap directions ({activeRoute.segments?.length || 0} legs)</span>
                {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showSteps && activeRoute.segments && (
                <div className="mt-3 space-y-2 pt-2 border-t border-gray-100 text-xs text-[#434652]">
                  {activeRoute.segments.map((seg, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="w-4 h-4 rounded-full bg-[#003178]/10 text-[#003178] font-bold flex items-center justify-center shrink-0 text-[9px]">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-[#1a1b21]">{seg.instruction}</div>
                        <div className="text-[10px] text-gray-500 flex items-center gap-2 mt-0.5">
                          <span className={`font-medium ${seg.type === 'sheltered' ? 'text-emerald-700' : seg.type === 'underpass' ? 'text-blue-700' : 'text-orange-700'}`}>
                            {seg.shelterName || seg.type}
                          </span>
                          <span>•</span>
                          <span>{seg.distanceMeters}m ({seg.durationMins} min)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* OneMap Token & API Credentials Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#003178]" />
                <h3 className="font-bold text-lg text-[#003178]">OneMap API Setup</h3>
              </div>
              <button
                onClick={() => setShowTokenModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Official OneMap REST API endpoints embedded:
              <br />
              • <strong>Mint Token:</strong> <code className="text-[10px] bg-gray-100 px-1 py-0.5 rounded">/api/auth/post/getToken</code> (valid 3 days)
              <br />
              • <strong>Search/Geocode:</strong> <code className="text-[10px] bg-gray-100 px-1 py-0.5 rounded">/api/common/elastic/search</code>
              <br />
              • <strong>Reverse Geocode:</strong> <code className="text-[10px] bg-gray-100 px-1 py-0.5 rounded">/api/public/revgeocode</code>
              <br />
              • <strong>Routing (walk/drive/pt/cycle):</strong> <code className="text-[10px] bg-gray-100 px-1 py-0.5 rounded">/api/public/routingsvc/route</code>
            </p>

            {tokenStatusMessage && (
              <div className="mb-4 p-2.5 rounded-lg bg-blue-50 text-blue-900 text-xs font-semibold border border-blue-200">
                {tokenStatusMessage}
              </div>
            )}

            <div className="space-y-3">
              <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                <div className="text-xs font-bold text-[#003178] mb-2">Option A: Mint 3-day Token (POST /getToken)</div>
                <input
                  type="email"
                  placeholder="OneMap Registered Email"
                  value={tokenEmail}
                  onChange={e => setTokenEmail(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-gray-300 mb-2 bg-white"
                />
                <input
                  type="password"
                  placeholder="OneMap Password"
                  value={tokenPassword}
                  onChange={e => setTokenPassword(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-gray-300 mb-2 bg-white"
                />
                <button
                  onClick={handleMintToken}
                  className="w-full bg-[#003178] hover:bg-[#002254] text-white text-xs font-semibold py-2 rounded-lg cursor-pointer"
                >
                  Mint New 3-Day Token
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                <div className="text-xs font-bold text-[#003178] mb-2">Option B: Enter Existing Token Directly</div>
                <input
                  type="text"
                  placeholder="Paste Bearer Access Token..."
                  value={manualTokenInput}
                  onChange={e => setManualTokenInput(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-gray-300 mb-2 bg-white"
                />
                <button
                  onClick={handleSaveManualToken}
                  className="w-full bg-[#006b5f] hover:bg-[#005249] text-white text-xs font-semibold py-2 rounded-lg cursor-pointer"
                >
                  Save Token to Local Storage
                </button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-500">
              <span>Auto-caches token for 72 hours</span>
              <button
                onClick={() => setShowTokenModal(false)}
                className="text-[#003178] font-bold hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
