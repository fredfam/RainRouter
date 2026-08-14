import { LocationPreset, RouteOption, WeatherForecastItem, PsiData, TrafficCamera, CarparkInfo, BmcCard } from '../types';

export const SINGAPORE_LANDMARKS: LocationPreset[] = [
  { id: 'raffles_place', name: 'Raffles Place MRT', category: 'mrt', lat: 1.2839, lng: 103.8515, description: 'Direct underground MRT concourse link' },
  { id: 'mbs', name: 'Marina Bay Sands', category: 'landmark', lat: 1.2838, lng: 103.8591, description: 'Integrated resort & Shoppes at MBS' },
  { id: 'marina_bay_financial', name: 'Marina Bay Financial Centre (MBFC)', category: 'landmark', lat: 1.2798, lng: 103.8540, description: 'Underground pedestrian network' },
  { id: 'novena_mrt', name: 'Novena MRT Station', category: 'mrt', lat: 1.320981, lng: 103.844150, description: 'Connected to Velocity & Square 2' },
  { id: 'toa_payoh', name: 'Toa Payoh Bus Interchange', category: 'transport', lat: 1.326762, lng: 103.855900, description: 'Sheltered town hub & MRT connection' },
  { id: 'suntec_city', name: 'Suntec City Mall', category: 'mall', lat: 1.2934, lng: 103.8572, description: 'CityLink sheltered underpass network' },
  { id: 'city_hall', name: 'City Hall MRT', category: 'mrt', lat: 1.2931, lng: 103.8522, description: 'CityLink Mall & Capitol Piazza link' },
  { id: 'bugis_junction', name: 'Bugis Junction', category: 'mall', lat: 1.3006, lng: 103.8554, description: 'Covered glass arcade & Bugis+ link bridge' },
  { id: 'orchard_ion', name: 'ION Orchard', category: 'mall', lat: 1.3040, lng: 103.8318, description: 'Underground Orchard link network' },
  { id: 'tanjong_pagar', name: 'Tanjong Pagar Centre / Guoco Tower', category: 'landmark', lat: 1.2764, lng: 103.8458, description: 'Sheltered urban park & transit hub' },
  { id: 'chinatown', name: 'Chinatown Point', category: 'mall', lat: 1.2847, lng: 103.8446, description: 'Underground linkway to MRT & covered shophouse corridors' },
  { id: 'clarke_quay', name: 'Clarke Quay Central', category: 'mall', lat: 1.2889, lng: 103.8468, description: 'Riverside sheltered promenade' }
];

export const INITIAL_WEATHER_FORECAST: WeatherForecastItem[] = [
  { area: 'City / CBD', forecast: 'Partly Cloudy', icon: 'wb_sunny', temp: 31, humidity: 72 },
  { area: 'Marina Bay', forecast: 'Fair (Day)', icon: 'light_mode', temp: 32, humidity: 70 },
  { area: 'Novena & Central', forecast: 'Passing Showers', icon: 'rainy', temp: 29, humidity: 82 },
  { area: 'Orchard & Tanglin', forecast: 'Partly Cloudy', icon: 'cloud', temp: 30, humidity: 75 },
  { area: 'Jurong East', forecast: 'Moderate Rain', icon: 'thunderstorm', temp: 28, humidity: 88 },
  { area: 'Changi & East Coast', forecast: 'Fair (Day)', icon: 'wb_sunny', temp: 32, humidity: 68 },
  { area: 'Woodlands & North', forecast: 'Cloudy', icon: 'cloudy_snowing', temp: 29, humidity: 80 }
];

export const INITIAL_PSI_DATA: PsiData = {
  overallIndex: 44,
  status: 'Good',
  national: 44,
  regions: {
    central: 42,
    east: 45,
    west: 48,
    north: 41,
    south: 40
  },
  updateTime: '10 mins ago (Live NEA Feed)'
};

export const INITIAL_TRAFFIC_CAMERAS: TrafficCamera[] = [
  {
    id: '4703',
    locationName: 'Marina Coastal Expressway (MCE) - Marina Blvd',
    latitude: 1.2741,
    longitude: 103.8562,
    imageUrl: 'https://images.data.gov.sg/api/traffic-images/2024/05/4703_142010.jpg',
    timestamp: 'Just now'
  },
  {
    id: '2701',
    locationName: 'East Coast Parkway (ECP) - Benjamin Sheares Bridge',
    latitude: 1.2915,
    longitude: 103.8643,
    imageUrl: 'https://images.data.gov.sg/api/traffic-images/2024/05/2701_142010.jpg',
    timestamp: '1 min ago'
  },
  {
    id: '1702',
    locationName: 'Central Expressway (CTE) - Moulmein Flyover (Novena)',
    latitude: 1.3204,
    longitude: 103.8471,
    imageUrl: 'https://images.data.gov.sg/api/traffic-images/2024/05/1702_142010.jpg',
    timestamp: '2 mins ago'
  },
  {
    id: '1704',
    locationName: 'Ayer Rajah Expressway (AYE) - Keppel Flyover',
    latitude: 1.2721,
    longitude: 103.8340,
    imageUrl: 'https://images.data.gov.sg/api/traffic-images/2024/05/1704_142010.jpg',
    timestamp: 'Just now'
  }
];

export const INITIAL_CARPARKS: CarparkInfo[] = [
  {
    carparkNumber: 'MB1',
    address: 'Marina Bay Sands Bayfront Ave',
    availableLots: 342,
    totalLots: 1200,
    occupancyPercent: 71,
    lat: 1.2831,
    lng: 103.8585,
    type: 'Basement Sheltered'
  },
  {
    carparkNumber: 'RP1',
    address: 'One Raffles Place Carpark',
    availableLots: 88,
    totalLots: 240,
    occupancyPercent: 63,
    lat: 1.2843,
    lng: 103.8512,
    type: 'Multi-Storey Direct Link'
  },
  {
    carparkNumber: 'SC3',
    address: 'Suntec City Basement 1',
    availableLots: 610,
    totalLots: 3100,
    occupancyPercent: 80,
    lat: 1.2941,
    lng: 103.8581,
    type: 'Underground Complex'
  },
  {
    carparkNumber: 'NV2',
    address: 'Velocity @ Novena Square',
    availableLots: 114,
    totalLots: 350,
    occupancyPercent: 67,
    lat: 1.3208,
    lng: 103.8439,
    type: 'Mall Podium'
  }
];

export function generateRoutes(start: LocationPreset, end: LocationPreset, departTime: string, sunShadeMode: boolean): RouteOption[] {
  const isDefaultRafflesToMbs = (start.id === 'raffles_place' && end.id === 'mbs') || (start.name.toLowerCase().includes('raffles') && end.name.toLowerCase().includes('marina'));

  // Default Raffles Place to MBS realistic coordinate waypoints
  if (isDefaultRafflesToMbs) {
    const balancedCoords: [number, number][] = [
      [1.2839, 103.8515], // Raffles Place MRT
      [1.2831, 103.8528], // UOB Plaza Underpass
      [1.2822, 103.8540], // One Raffles Quay Link
      [1.2811, 103.8549], // Marina Bay Financial link
      [1.2818, 103.8565], // Waterfront covered canopy
      [1.2828, 103.8581], // Bayfront bridge sheltered
      [1.2838, 103.8591]  // Marina Bay Sands
    ];

    const shelterFirstCoords: [number, number][] = [
      [1.2839, 103.8515], // Raffles Place MRT
      [1.2852, 103.8528], // Fullerton Square link
      [1.2872, 103.8546], // Esplanade Underpass (CityLink)
      [1.2890, 103.8568], // The Float sheltered walkway
      [1.2862, 103.8598], // Helix Bridge Canopy
      [1.2838, 103.8591]  // Marina Bay Sands
    ];

    const fastestCoords: [number, number][] = [
      [1.2839, 103.8515], // Raffles Place MRT
      [1.2835, 103.8545], // Fullerton Heritage open walkway
      [1.2845, 103.8570], // Marina Promenade Open Path
      [1.2838, 103.8591]  // Marina Bay Sands
    ];

    return [
      {
        id: 'balanced',
        name: 'Balanced',
        subtitle: 'Shorter, partly shaded',
        badge: 'Komfy Pick',
        isKomfyPick: true,
        durationMins: 17,
        distanceKm: 1.3,
        shelteredPercentage: sunShadeMode ? 68 : 56,
        shadePercentage: 74,
        uvExposureIndex: 'Low',
        rainRisk: 'dry',
        weatherStripType: 'balanced',
        summary: 'Optimal balance of climate-controlled MRT underpass and waterfront canopy walkway.',
        features: ['56% sheltered', 'Shaded trees', 'Cool breeze', '2 escalators'],
        tags: [
          { label: 'Covered links', icon: 'storefront' },
          { label: 'MRT underpass', icon: 'subway' }
        ],
        coordinates: balancedCoords,
        segments: [
          {
            type: 'underpass',
            instruction: 'Enter Raffles Place MRT Exit J underground linkway to One Raffles Quay',
            distanceMeters: 380,
            durationMins: 5,
            coordinates: [balancedCoords[0], balancedCoords[1], balancedCoords[2]],
            shelterName: 'Raffles Place Underground Network (Air-conditioned)'
          },
          {
            type: 'sheltered',
            instruction: 'Walk along MBFC Tower 1 covered ground canopy toward Marina Boulevard',
            distanceMeters: 420,
            durationMins: 5,
            coordinates: [balancedCoords[2], balancedCoords[3], balancedCoords[4]],
            shelterName: 'MBFC Covered Linkway & Tree Canopy'
          },
          {
            type: 'sheltered',
            instruction: 'Cross Bayfront Avenue via the sheltered overhead pedestrian connector',
            distanceMeters: 300,
            durationMins: 4,
            coordinates: [balancedCoords[4], balancedCoords[5]],
            shelterName: 'Bayfront Covered Connector'
          },
          {
            type: 'open',
            instruction: 'Short 150m shaded promenade stroll into The Shoppes at Marina Bay Sands',
            distanceMeters: 200,
            durationMins: 3,
            coordinates: [balancedCoords[5], balancedCoords[6]],
            shelterName: 'Waterfront Tree-lined Promenade'
          }
        ]
      },
      {
        id: 'shelter-first',
        name: 'Shelter-first',
        subtitle: 'via Raffles Link & Marina Square Underpass',
        badge: 'Max Protection',
        isKomfyPick: false,
        durationMins: 18,
        distanceKm: 1.4,
        shelteredPercentage: sunShadeMode ? 82 : 72,
        shadePercentage: 88,
        uvExposureIndex: 'Low',
        rainRisk: 'dry',
        weatherStripType: 'dry',
        summary: 'Maximum rain and sun protection via CityLink Mall, Esplanade underground, and Helix bridge canopy.',
        features: ['72% sheltered', 'Fully dry in heavy downpour', 'Air conditioned corridors'],
        tags: [
          { label: 'Full canopy', icon: 'umbrella' },
          { label: 'CityLink air-con', icon: 'ac_unit' }
        ],
        coordinates: shelterFirstCoords,
        segments: [
          {
            type: 'underpass',
            instruction: 'Take CityLink Mall underground concourse toward Esplanade MRT',
            distanceMeters: 550,
            durationMins: 7,
            coordinates: [shelterFirstCoords[0], shelterFirstCoords[1], shelterFirstCoords[2]],
            shelterName: 'CityLink Air-conditioned Underground Mall'
          },
          {
            type: 'sheltered',
            instruction: 'Follow covered linkway through Youth Olympic Park canopy',
            distanceMeters: 450,
            durationMins: 6,
            coordinates: [shelterFirstCoords[2], shelterFirstCoords[3], shelterFirstCoords[4]],
            shelterName: 'Marina Bay Covered Canopy Way'
          },
          {
            type: 'sheltered',
            instruction: 'Cross via Helix Bridge glass canopy directly into Marina Bay Sands',
            distanceMeters: 400,
            durationMins: 5,
            coordinates: [shelterFirstCoords[4], shelterFirstCoords[5]],
            shelterName: 'Helix Bridge Protective Canopy'
          }
        ]
      },
      {
        id: 'fastest',
        name: 'Fastest',
        subtitle: 'Mostly open pavement along waterfront',
        badge: 'Fastest ETA',
        isKomfyPick: false,
        durationMins: 16,
        distanceKm: 1.1,
        shelteredPercentage: 38,
        shadePercentage: 42,
        uvExposureIndex: 'High',
        rainRisk: 'heavy',
        weatherStripType: 'rain',
        summary: 'Shortest linear distance across open pedestrian boulevards. High exposure to sun/rain.',
        features: ['16 min walking', 'Direct diagonal path', 'High sun exposure'],
        tags: [
          { label: 'Direct path', icon: 'bolt' },
          { label: 'Sun alert', icon: 'warning' }
        ],
        coordinates: fastestCoords,
        segments: [
          {
            type: 'open',
            instruction: 'Walk directly along Collyer Quay open pavement',
            distanceMeters: 450,
            durationMins: 6,
            coordinates: [fastestCoords[0], fastestCoords[1]],
            shelterName: 'Open Pavement (No Canopy)'
          },
          {
            type: 'open',
            instruction: 'Cross along Marina Boulevard open waterfront boardwalk',
            distanceMeters: 650,
            durationMins: 10,
            coordinates: [fastestCoords[1], fastestCoords[2], fastestCoords[3]],
            shelterName: 'Exposed Promenade'
          }
        ]
      }
    ];
  }

  // Generic dynamic path calculation between any two selected Singapore locations
  const latDiff = end.lat - start.lat;
  const lngDiff = end.lng - start.lng;
  const approxDistanceKm = Number((Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111).toFixed(1));
  const baseMinutes = Math.max(8, Math.round(approxDistanceKm * 12));

  // Balanced path coords
  const dynamicBalancedCoords: [number, number][] = [
    [start.lat, start.lng],
    [start.lat + latDiff * 0.3, start.lng + lngDiff * 0.15],
    [start.lat + latDiff * 0.65, start.lng + lngDiff * 0.6],
    [start.lat + latDiff * 0.85, start.lng + lngDiff * 0.9],
    [end.lat, end.lng]
  ];

  const dynamicShelterCoords: [number, number][] = [
    [start.lat, start.lng],
    [start.lat + latDiff * 0.2, start.lng + lngDiff * 0.4],
    [start.lat + latDiff * 0.5, start.lng + lngDiff * 0.75],
    [start.lat + latDiff * 0.8, start.lng + lngDiff * 0.95],
    [end.lat, end.lng]
  ];

  const dynamicDirectCoords: [number, number][] = [
    [start.lat, start.lng],
    [start.lat + latDiff * 0.5, start.lng + lngDiff * 0.5],
    [end.lat, end.lng]
  ];

  return [
    {
      id: 'balanced',
      name: 'Balanced',
      subtitle: `Via ${start.name} sheltered link & connector`,
      badge: 'Komfy Pick',
      isKomfyPick: true,
      durationMins: baseMinutes + 1,
      distanceKm: Number((approxDistanceKm * 1.15).toFixed(1)),
      shelteredPercentage: sunShadeMode ? 65 : 58,
      shadePercentage: 70,
      uvExposureIndex: 'Low',
      rainRisk: 'dry',
      weatherStripType: 'balanced',
      summary: `Comfort-optimized route prioritizing covered walkways and building overhangs near ${start.name}.`,
      features: ['58% sheltered', 'Shaded trees', 'Covered links'],
      tags: [
        { label: 'Covered linkway', icon: 'storefront' },
        { label: 'Tree canopy', icon: 'park' }
      ],
      coordinates: dynamicBalancedCoords,
      segments: [
        {
          type: 'sheltered',
          instruction: `Depart from ${start.name} through the sheltered entrance corridor`,
          distanceMeters: Math.round(approxDistanceKm * 400),
          durationMins: Math.round(baseMinutes * 0.4),
          coordinates: [dynamicBalancedCoords[0], dynamicBalancedCoords[1], dynamicBalancedCoords[2]],
          shelterName: 'LTA Covered Walkway'
        },
        {
          type: 'open',
          instruction: `Cross pedestrian crossing toward ${end.name}`,
          distanceMeters: Math.round(approxDistanceKm * 300),
          durationMins: Math.round(baseMinutes * 0.3),
          coordinates: [dynamicBalancedCoords[2], dynamicBalancedCoords[3]],
          shelterName: 'Pedestrian Crossing'
        },
        {
          type: 'sheltered',
          instruction: `Arrive at ${end.name} via sheltered arcade`,
          distanceMeters: Math.round(approxDistanceKm * 450),
          durationMins: Math.round(baseMinutes * 0.3),
          coordinates: [dynamicBalancedCoords[3], dynamicBalancedCoords[4]],
          shelterName: 'Building Arcade Linkway'
        }
      ]
    },
    {
      id: 'shelter-first',
      name: 'Shelter-first',
      subtitle: `Maximum coverage via HDB & Mall canopies`,
      badge: 'Max Protection',
      isKomfyPick: false,
      durationMins: baseMinutes + 3,
      distanceKm: Number((approxDistanceKm * 1.3).toFixed(1)),
      shelteredPercentage: sunShadeMode ? 85 : 78,
      shadePercentage: 86,
      uvExposureIndex: 'Low',
      rainRisk: 'dry',
      weatherStripType: 'dry',
      summary: `High shelter density using Singapore's extensive network of covered walkways.`,
      features: ['78% sheltered', 'Maximum rain protection'],
      tags: [
        { label: 'Continuous canopy', icon: 'umbrella' },
        { label: 'Safe from downpour', icon: 'verified' }
      ],
      coordinates: dynamicShelterCoords,
      segments: [
        {
          type: 'sheltered',
          instruction: `Navigate fully covered walkway network towards ${end.name}`,
          distanceMeters: Math.round(approxDistanceKm * 1300),
          durationMins: baseMinutes + 3,
          coordinates: dynamicShelterCoords,
          shelterName: 'Singapore Sheltered Walkway Grid'
        }
      ]
    },
    {
      id: 'fastest',
      name: 'Fastest',
      subtitle: `Direct street pavement`,
      badge: 'Fastest ETA',
      isKomfyPick: false,
      durationMins: baseMinutes,
      distanceKm: approxDistanceKm,
      shelteredPercentage: 32,
      shadePercentage: 35,
      uvExposureIndex: 'High',
      rainRisk: 'heavy',
      weatherStripType: 'rain',
      summary: `Direct straight-line walking on outdoor pavements with minimal shelter overhead.`,
      features: ['Shortest duration', 'High sun & rain exposure'],
      tags: [
        { label: 'Direct pavement', icon: 'directions_walk' },
        { label: 'Unsheltered', icon: 'wb_sunny' }
      ],
      coordinates: dynamicDirectCoords,
      segments: [
        {
          type: 'open',
          instruction: `Walk directly along main road pavement to ${end.name}`,
          distanceMeters: Math.round(approxDistanceKm * 1000),
          durationMins: baseMinutes,
          coordinates: dynamicDirectCoords,
          shelterName: 'Open Sidewalk'
        }
      ]
    }
  ];
}

export const BMC_DATA: { [key: string]: BmcCard } = {
  keyPartners: {
    title: 'Key Partners',
    subtitle: 'What are your key partners to get competitive advantage?',
    color: 'bg-blue-100 border-blue-300 text-blue-900',
    bulletPoints: [
      'Singapore Government (Data.gov.sg, NEA, LTA, SLA)',
      'API Providers (OneMap REST API, Real-Time Weather V2)',
      'Property & Transport Partners (Malls, MRT stations, SMRT/SBS, JTC)',
      'Sheltered-walkway & underground pedestrian network dataset providers'
    ]
  },
  keyActivities: {
    title: 'Key Activities',
    subtitle: 'What are the key steps to move ahead to your customers?',
    color: 'bg-blue-100 border-blue-300 text-blue-900',
    bulletPoints: [
      'Route optimisation: Calculating micro-routes with minimum rain exposure',
      'Real-time data integration: continuously fusing rainfall/radar + map/location data',
      'Shelter infrastructure graph mapping & shade vector modeling',
      'Smart proactive notification engine'
    ]
  },
  keyPropositions: {
    title: 'Key Propositions',
    subtitle: 'How will you make your customers\' life happier?',
    color: 'bg-amber-100 border-amber-300 text-amber-900',
    bulletPoints: [
      'Stay Dry - find the walking route with the least unsheltered exposure',
      'Real-time intelligent routing - automatically adapt routes based on current rain/cloud conditions',
      'Sun Shade Mode - avoid intense Singapore tropical UV and midday heat',
      'Comfort-First navigation vs raw distance'
    ]
  },
  customerRelationships: {
    title: 'Customer Relationships',
    subtitle: 'How often will you interact with your customers?',
    color: 'bg-orange-100 border-orange-300 text-orange-900',
    bulletPoints: [
      'Self-service web & mobile app: enter destination and instantly receive a rainroute',
      'Personalised alerts: "Rain arriving in 10 mins, leave now or take sheltered route B"',
      'Community crowdsourced shelter condition updates & feedback loops'
    ]
  },
  customerSegments: {
    title: 'Customer Segments',
    subtitle: 'Who are your customers? Describe your target audience.',
    color: 'bg-rose-100 border-rose-300 text-rose-900',
    bulletPoints: [
      'Pedestrians and public transport commuters in Singapore (CBD workers, students, families)',
      'Tourists navigating Singapore without umbrellas',
      'Last-mile food delivery & courier riders on foot/PMDs',
      'Elderly commuters requiring elevator & covered passage access'
    ]
  },
  keyResources: {
    title: 'Key Resources',
    subtitle: 'What resources do you need to make your idea work?',
    color: 'bg-blue-100 border-blue-300 text-blue-900',
    bulletPoints: [
      'OneMap API + Real-time Data.gov.sg Weather APIs',
      'Shelter-graph routing algorithm & AI Agent engine',
      'High-performance web & mobile interactive platform',
      'Geospatial vector dataset of Singapore covered linkways'
    ]
  },
  channels: {
    title: 'Channels',
    subtitle: 'How are you going to reach your customers?',
    color: 'bg-orange-100 border-orange-300 text-orange-900',
    bulletPoints: [
      'RainRouter Progressive Web App (rainroute website)',
      'Google Search, SEO for "sheltered walking Singapore"',
      'Word of mouth & social media commuters community',
      'QR codes placed at MRT station exits during rainy season'
    ]
  },
  costStructure: {
    title: 'Cost Structure',
    subtitle: 'How much are you planning to spend on development & ops?',
    color: 'bg-emerald-100 border-emerald-300 text-emerald-900',
    bulletPoints: [
      'API cloud hosting & serverless compute infrastructure',
      'Development, GIS data maintenance, and routing algorithm tuning',
      'Marketing, user acquisition & commuter partnerships'
    ]
  },
  revenueStreams: {
    title: 'Revenue Streams',
    subtitle: 'How are you planning to earn? Compare costs and revenues.',
    color: 'bg-emerald-100 border-emerald-300 text-emerald-900',
    bulletPoints: [
      'Freemium model: Free basic sheltered routing, premium real-time rain alerts & commute scheduler',
      'B2B / API Revenue: Routing SDK licensed to shopping malls, tourism apps, and delivery platforms',
      'Sponsored mall passageway promotions & dry-zone retail highlights'
    ]
  }
};
