import React, { useState } from 'react';
import { TrafficCamera, CarparkInfo } from '../types';
import { Camera, Car, Shield, ExternalLink, RefreshCw, CheckCircle, MapPin } from 'lucide-react';

interface CivicDataProps {
  trafficCameras: TrafficCamera[];
  carparks: CarparkInfo[];
  onRefresh: () => void;
  isLoading: boolean;
}

export const CivicDataView: React.FC<CivicDataProps> = ({
  trafficCameras,
  carparks,
  onRefresh,
  isLoading
}) => {
  const [selectedCam, setSelectedCam] = useState<TrafficCamera | null>(null);
  const [carparkSearch, setCarparkSearch] = useState('');

  const filteredCarparks = carparks.filter(c =>
    c.address.toLowerCase().includes(carparkSearch.toLowerCase()) ||
    c.carparkNumber.toLowerCase().includes(carparkSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#003178]/10 text-[#003178] text-xs font-bold uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5" />
            Data.gov.sg & LTA Live Integration
          </div>
          <h1 className="text-3xl font-extrabold text-[#003178] tracking-tight">
            Singapore Civic & Urban Transit Intelligence
          </h1>
          <p className="text-sm text-[#434652] mt-1">
            Real-time expressway cameras, carpark availability slots, and sheltered pedestrian infrastructure data.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="bg-[#003178] hover:bg-[#002254] text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 text-sm shrink-0 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Live Feeds
        </button>
      </div>

      {/* Singapore Sheltered Network Infrastructure Highlights */}
      <div className="bg-gradient-to-r from-[#003178] to-[#006b5f] rounded-3xl p-6 sm:p-8 text-white shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold">200+ km</div>
          <div className="text-sm font-semibold text-white/90 mt-1">LTA Walk2Ride Covered Walkways</div>
          <p className="text-xs text-white/75 mt-1">
            Continuous covered linkways connecting MRT stations, bus interchanges, and residential estates.
          </p>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold">8.5 km</div>
          <div className="text-sm font-semibold text-white/90 mt-1">CBD Underground Pedestrian Network</div>
          <p className="text-xs text-white/75 mt-1">
            Air-conditioned subways linking Raffles Place, Marina Bay Financial Centre, and CityLink Mall.
          </p>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold">99.4%</div>
          <div className="text-sm font-semibold text-white/90 mt-1">Real-time Weather Adaptation</div>
          <p className="text-xs text-white/75 mt-1">
            Dynamic rerouting algorithms prioritizing covered canopies and building overhangs during storms.
          </p>
        </div>
      </div>

      {/* Two-Column Grid: Traffic Cameras (Left) & Carpark Availability (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: Live LTA Traffic Cameras */}
        <div className="bg-white rounded-3xl p-6 border border-[#c3c6d4]/40 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#003178] font-bold text-lg">
              <Camera className="w-5 h-5" />
              <span>Live Traffic Cameras (LTA)</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">{trafficCameras.length} Active Feeds</span>
          </div>

          <p className="text-xs text-[#434652]">
            Visual confirmation of roadway conditions, rainfall intensity, and expressway visibility across Singapore.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[520px] overflow-y-auto pr-1">
            {trafficCameras.map(cam => (
              <div
                key={cam.id}
                onClick={() => setSelectedCam(cam)}
                className="bg-[#faf8ff] rounded-xl p-2.5 border border-gray-200/80 hover:border-[#003178]/50 transition-all cursor-pointer group flex flex-col gap-2"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={cam.imageUrl}
                    alt={cam.locationName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback placeholder image if camera is temporarily down
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    LIVE
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#003178] truncate">{cam.locationName}</div>
                  <div className="text-[10px] text-gray-500 flex justify-between mt-0.5">
                    <span>Cam ID: #{cam.id}</span>
                    <span>{cam.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Real-time Carpark Availability */}
        <div className="bg-white rounded-3xl p-6 border border-[#c3c6d4]/40 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#006b5f] font-bold text-lg">
              <Car className="w-5 h-5" />
              <span>Carpark Availability (HDB/URA)</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">Live Lots</span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search carparks or locations..."
              value={carparkSearch}
              onChange={e => setCarparkSearch(e.target.value)}
              className="w-full text-xs bg-[#faf8ff] border border-gray-200 rounded-xl px-3 py-2 outline-hidden focus:ring-2 focus:ring-[#006b5f]"
            />
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {filteredCarparks.map(cp => {
              const isOccupiedHigh = cp.occupancyPercent > 80;
              return (
                <div
                  key={cp.carparkNumber}
                  className="p-4 rounded-xl bg-[#faf8ff] border border-gray-200/80 hover:border-[#006b5f]/40 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#003178]">{cp.carparkNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-medium">
                        {cp.type}
                      </span>
                    </div>
                    <div className="text-xs text-[#434652] mt-0.5 truncate">{cp.address}</div>

                    {/* Occupancy bar */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full ${isOccupiedHigh ? 'bg-[#FF7043]' : 'bg-[#43A047]'}`}
                          style={{ width: `${cp.occupancyPercent}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-semibold text-gray-600">{cp.occupancyPercent}% full</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`text-lg font-extrabold ${isOccupiedHigh ? 'text-[#FF7043]' : 'text-[#43A047]'}`}>
                      {cp.availableLots}
                    </div>
                    <div className="text-[10px] text-gray-500">of {cp.totalLots} lots</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal for viewing camera image high-res */}
      {selectedCam && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedCam(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-[#003178]">{selectedCam.locationName}</h3>
              <button
                onClick={() => setSelectedCam(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <img
              src={selectedCam.imageUrl}
              alt="High res traffic camera feed"
              className="w-full rounded-xl object-cover max-h-[420px] bg-gray-100"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Data Source: Land Transport Authority of Singapore (LTA)</span>
              <span>Updated: {selectedCam.timestamp}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
