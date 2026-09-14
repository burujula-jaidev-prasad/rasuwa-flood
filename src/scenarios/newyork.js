// ---------------------------------------------------------------------------
// New York, USA — Category 4 Hurricane Storm Surge & Lower Manhattan Inundation
// Scenario: Extreme Compound Storm Surge & Tidal Basin Funneling (Sandy 2.0 Benchmark)
// Reference: NOAA National Hurricane Center SLOSH Model, USACE NYNJHAT Study,
//            Crest 4.82m (15.8 ft NAVD88) with 180M m³ Atlantic Surge Funneling
// ---------------------------------------------------------------------------

export const NEWYORK_CONFIG = {
  id: 'newyork',
  name: 'New York, USA',
  country: 'United States',
  flag: '🇺🇸',
  hazard: 'Morning Cat-4 Hurricane Surge & Manhattan Inundation',
  tagline: 'Atlantic Funneling, Subway Flooding & ConEd Grid Arc-Blast',
  year: '2026 Forecast / Sandy 2.0 (Morning)',
  currency: {
    code: 'USD',
    symbol: '$',
    rateToUSD: 1.0,
    unit: 'Billion USD',
    scale: 1.0
  },
  environment: {
    skyTop: 0x1d4ed8,    // Brilliant radiant morning blue zenith
    skyMid1: 0x38bdf8,   // Crisp cerulean morning sky
    skyMid2: 0x93c5fd,   // Luminous morning light
    skyBottom: 0xfef08a, // Warm golden sunrise horizon
    fogColor: 0xe0f2fe,  // Ultra-clean, luminous morning horizon
    fogNear: 450,        // Pushed far back for crystal-clear clarity across the harbor
    fogFar: 1600,
    sunPosition: [0.75, 0.55, 0.35], // Golden morning sun from east
    sunColor: 0xfff7ed,  // Radiant warm golden-white morning sunlight
    sunIntensity: 2.2,   // Bright, crisp high-clarity illumination
    waterColor: 0x0284c7, // Vibrant Atlantic / Upper NY Bay morning azure
    waterRoughness: 0.18,
    waterMetalness: 0.40,
    rainIntensity: 0.0,   // Crystal clear morning atmosphere
    terrainType: 'coastal_harbor'
  },
  timeline: {
    durationSec: 36.0,
    clockStart: '30 Oct 06:30 AM',
    clockEnd: '30 Oct 11:30 AM'
  }
};

// 3D River / Harbor Channel Spline Coordinates:
// The Narrows (South, x=-140) -> Upper NY Bay -> The Battery -> East River / FDR Drive -> Brooklyn Bridge -> ConEd 14th St (North, x=140)
export const NEWYORK_RIVER_POINTS = [
  { x: -140, y: 1.2, z: -80 }, // The Narrows (Atlantic entrance)
  { x: -105, y: 1.4, z: -58 }, // Upper New York Bay south fairway
  { x: -70,  y: 1.6, z: -36 }, // Governors Island / Upper Bay channel
  { x: -35,  y: 1.9, z: -16 }, // Approach to Lower Manhattan (The Battery)
  { x: 0,    y: 2.2, z: 0 },   // The Battery & Financial District waterfront
  { x: 35,   y: 2.4, z: 20 },  // East River corridor / FDR Drive ESCR sector
  { x: 70,   y: 2.5, z: 42 },  // Brooklyn Bridge & under-river subway tubes
  { x: 105,  y: 2.5, z: 66 },  // East River / ConEd 14th St Substation
  { x: 140,  y: 2.4, z: 92 }   // Upper East River / Hell Gate outfall
];

export const NEWYORK_WAYPOINTS = [
  {
    id: 'narrows-funneling',
    u: 0.10,
    t: 0.08,
    sceneSec: 2.8,
    realTime: '30 Oct 06:30 AM',
    name: 'The Narrows & Verrazzano',
    subtitle: 'Morning Verrazzano Strait Funnel',
    coords: '40.60° N, 74.04° W',
    badge: 'Stage 1 • Morning Funneling • 4.8m Surge',
    headline: 'Cat-4 Storm Surge Funnels into Upper NY Harbor at Dawn (48 km/h)',
    stats: [
      { label: 'Peak Storm Surge', value: '4.82 m (15.8 ft NAVD88)' },
      { label: 'Forward Surge Velocity', value: '13.2 m/s (47.5 km/h)' },
      { label: 'Barometric Pressure', value: '940 hPa (Morning peak)' },
      { label: 'Tide Phase', value: 'Spring High Tide (+1.6 m astronomical)' },
      { label: 'Warning Lead Time', value: '36 hours advance NOAA NHC alert' }
    ],
    scientificNote: 'The shallow V-shaped wedge of the New York Bight concentrates offshore hurricane swell straight into the 1.6 km Narrows gorge, amplifying wave kinetic pressure by 140%.',
    warningGap: 'Offshore regional storm surge barriers (USACE Alternative 2/3) remain unconstructed; harbor mouth is fully open to the Atlantic.',
    countermeasure: {
      status: 'Zone A Mandatory Evacuation',
      action: 'NYC Emergency Management ordered mandatory evacuation for 375,000 residents in low-lying coastal zones.',
      readiness: '85%'
    }
  },
  {
    id: 'battery-park-overtopping',
    u: 0.48,
    t: 0.24,
    sceneSec: 8.6,
    realTime: '30 Oct 07:15 AM',
    name: 'The Battery & Financial District',
    subtitle: 'Lower Manhattan Tip Seawall Breach',
    coords: '40.70° N, 74.01° W',
    badge: 'Stage 2 • Seawall Overtopped • Flood Stage 14.9 ft',
    headline: 'Battery Park Seawall Overtopped in Morning Light: Water Inundates Bowling Green',
    stats: [
      { label: 'Surge Crest at Battery', value: '4.55 m (14.9 ft NAVD88)' },
      { label: 'Flow Velocity', value: '8.4 m/s (30.2 km/h)' },
      { label: 'Inundation Ingress', value: 'Water reaches State St & Broadway' },
      { label: 'Commercial Exposure', value: 'NYSE & Wall St data floors isolated' },
      { label: 'Evacuation Compliance', value: '78% evacuated; 42,000 shelter in place' }
    ],
    scientificNote: 'Reclaimed colonial land in Lower Manhattan sits at only 1.5–2.2m above mean high water; once the perimeter seawall is breached, water pools downhill into the urban basin.',
    warningGap: 'Temporary deployable HESCO sand barriers overtopped when wave run-up exceeded 3.8 meters.',
    countermeasure: {
      status: 'Deployable Tiger Dam Barriers',
      action: 'Crews deployed 2.4-meter water-filled Tiger Dams and aluminum stoplogs across West Street and tunnel portals.',
      readiness: '75%'
    }
  },
  {
    id: 'subway-inundation',
    u: 0.54,
    t: 0.38,
    sceneSec: 13.6,
    realTime: '30 Oct 08:00 AM',
    name: 'South Ferry & Subway Portals',
    subtitle: 'MTA Rush-Hour Subway Inundation',
    coords: '40.70° N, 74.01° W',
    badge: 'Stage 3 • Transit Paralysis • 7 Under-River Tubes Flooded',
    headline: 'Seawater Deluges South Ferry Subways during Morning Commute',
    stats: [
      { label: 'Submerged Subway Tubes', value: '7 under-river transit tunnels flooded' },
      { label: 'South Ferry Station', value: '14.5 million gallons of brine submerged tracks' },
      { label: 'Daily Commuters Disrupted', value: '5.4 Million transit riders halted' },
      { label: 'Required Dewatering', value: '250,000 GPM (USACE dewatering armada)' },
      { label: 'Signal System Damage', value: '$8.5 Billion electrical & relay corrosion' }
    ],
    scientificNote: 'Corrosive saltwater acts as an electrolyte, immediately destroying electro-pneumatic switch machines, copper relays, and third-rail traction power feeds.',
    warningGap: 'Sidewalk-level ventilation grates acted as vertical flumes directly channeling surface runoff into underground station mezzanines.',
    countermeasure: {
      status: 'MTA Inflatable Tunnel Plugs',
      action: 'MTA deployed massive Kevlar flex-gate covers and pressurized tunnel plugs at 4 key East River tube portals.',
      readiness: '80%'
    }
  },
  {
    id: 'fdr-drive-escr',
    u: 0.62,
    t: 0.52,
    sceneSec: 18.7,
    realTime: '30 Oct 08:45 AM',
    name: 'FDR Drive & East River',
    subtitle: 'East Side Coastal Resiliency (ESCR) Gate Closure',
    coords: '40.71° N, 73.98° W',
    badge: 'Stage 4 • Resiliency Test • 16.5-ft Steel Floodgates',
    headline: 'ESCR Roller Floodgates Close: Highway Converted to Storm Moat in Morning Light',
    stats: [
      { label: 'Floodgate Defense Height', value: '5.03 m (16.5 ft NAVD88)' },
      { label: 'FDR Drive Condition', value: 'Highway closed; 2.4 m surge on river side' },
      { label: 'Protected Inland Residents', value: '110,000 public housing residents shielded' },
      { label: 'Surge Differential', value: '3.1 m hydrostatic head held by gates' },
      { label: 'Structural Deflection', value: 'Gates holding at 68% maximum design shear' }
    ],
    scientificNote: 'The East Side Coastal Resiliency (ESCR) system utilizes sliding steel roller gates and reinforced floodwalls integrated into park berms to hold back the East River.',
    warningGap: 'Unprotected seams around older bridge anchorages and construction transitions still require continuous emergency sandbagging.',
    countermeasure: {
      status: 'ESCR Roller Gates Sealed',
      action: 'NYC Department of Design and Construction sealed all 18 swinging roller floodgates spanning FDR access ramps.',
      readiness: '95%'
    }
  },
  {
    id: 'brooklyn-bridge-waterfront',
    u: 0.74,
    t: 0.66,
    sceneSec: 23.8,
    realTime: '30 Oct 09:30 AM',
    name: 'Brooklyn Bridge & DUMBO',
    subtitle: 'East River Gothic Towers & Brooklyn Waterfront',
    coords: '40.70° N, 73.99° W',
    badge: 'Stage 5 • East River Convergence • Surge Bottleneck',
    headline: 'East River Surge Chokes Under Brooklyn Bridge: DUMBO Submerged Under Morning Sun',
    stats: [
      { label: 'Surge Velocity in Strait', value: '9.8 m/s (35.3 km/h)' },
      { label: 'Brooklyn Waterfront Flooding', value: '1.8 m depth along Water St & Old Fulton' },
      { label: 'Granite Pier Scour', value: 'Acoustic Doppler shows 0.8m bed erosion' },
      { label: 'Historic Warehouse Loss', value: '$3.4 Billion boutique & residential impact' },
      { label: 'Reverse Tidal Flow', value: 'Surge forces estuarine flow 7.2 knots upstream' }
    ],
    scientificNote: 'The East River is an estuarine tidal strait connecting Upper NY Bay to Long Island Sound; opposing surge waves create dangerous hydraulic seiches and standing waves.',
    warningGap: 'Cobblestone streets of DUMBO and Brooklyn Navy Yard sit on historical tidal marshes with gravity-drained combined sewers that back up.',
    countermeasure: {
      status: 'FDNY Marine Unit Deployment',
      action: 'FDNY 343 fireboat deployed with high-volume monitors; swiftwater rescue boats evacuated stranded waterfront buildings.',
      readiness: '85%'
    }
  },
  {
    id: 'coned-substation-arc',
    u: 0.86,
    t: 0.80,
    sceneSec: 28.8,
    realTime: '30 Oct 10:15 AM',
    name: 'ConEd 14th St Substation',
    subtitle: 'Manhattan Grid Transformer Explosions & Daylight Arc Flash',
    coords: '40.73° N, 73.97° W',
    badge: 'Stage 6 • Grid Collapse • Arc Flash Explosion',
    headline: 'Catastrophic Arc Flash at 14th Street: Lower Manhattan Power Grid Detonates',
    stats: [
      { label: 'Substation Inundation', value: '4.2 m saltwater breach over protection berm' },
      { label: 'High-Voltage Arc Blast', value: '345 kV transformer arc blast triggers blackout' },
      { label: 'Customers De-Energized', value: '850,000 customers dark from 34th St south' },
      { label: 'Critical Facilities Affected', value: '14 hospitals running on rooftop diesel generators' },
      { label: 'Power Restoration Est.', value: '5 to 10 days for transformer dry-out' }
    ],
    scientificNote: 'Brackish seawater infiltrated the transformer yard; dielectric insulating oil was breached, causing violent 3-phase phase-to-ground arcing and gas explosions.',
    warningGap: 'Perimeter flood wall was built to 100-year flood + 2 ft; Category 4 surge exceeded crest height by 0.65 meters.',
    countermeasure: {
      status: 'Pre-Emptive Grid Isolation',
      action: 'Con Edison dispatchers remotely de-energized Lower Manhattan underground networks to save high-voltage transformers from melting.',
      readiness: '90%'
    }
  },
  {
    id: 'usace-pump-fleet',
    u: 0.94,
    t: 0.92,
    sceneSec: 33.1,
    realTime: '30 Oct 11:00 AM',
    name: 'USACE Unwatering Armada',
    subtitle: 'Army Corps Dewatering & Critical Infrastructure Recovery',
    coords: '40.74° N, 73.97° W',
    badge: 'Stage 7 • Drainage Armada • 380,000 GPM Discharged',
    headline: 'Army Corps "Unwatering Task Force" Drains Flooded Subway Tubes',
    stats: [
      { label: 'Heavy Pumps Mobilized', value: '24 high-capacity submersible pump units' },
      { label: 'Drainage Discharge Rate', value: '380,000 Gallons/min back to East River' },
      { label: 'Mobile Power Deployed', value: '12 MW trailer turbine generators powering grid' },
      { label: 'Fuel Supply Flotilla', value: '500,000 gallons diesel ferried by harbor barge' },
      { label: 'Tunnels Unwatered', value: 'Queens-Midtown and Brooklyn-Battery tunnels cleared' }
    ],
    scientificNote: 'Submersible hydraulic pumps must overcome 30m of vertical head from the deepest subway inverts beneath the East River back to surface sea level.',
    warningGap: 'Regional fuel supply chains stalled due to flooded petroleum terminals in New Jersey.',
    countermeasure: {
      status: 'Federal Task Force Deployed',
      action: 'USACE, FEMA, and National Guard engineering battalions mobilized around the clock for tunnel dewatering.',
      readiness: '95%'
    }
  },
  {
    id: 'newyork-toll-summary',
    u: 1.00,
    t: 1.00,
    sceneSec: 36.0,
    realTime: '30 Oct 11:30 AM',
    name: 'New York Surge Summary',
    subtitle: 'NYC Metro Coastal Disaster & $42.5 Billion Toll',
    coords: '40.71° N, 74.00° W (Citywide)',
    badge: 'Stage 8 • Full Loss Metric • $42.5B Loss',
    headline: 'NYC Morning Surge Toll: $42.5 Billion Loss & 385,000 Displaced',
    stats: [
      { label: 'Total Economic Destruction', value: '$42.5 Billion USD' },
      { label: 'Population Displaced / Evacuated', value: '385,000 coastal residents' },
      { label: 'Subway System Offline', value: '7 under-river tunnels inundated for 6 days' },
      { label: 'Peak Recorded Surge', value: '4.82 m (15.8 ft NAVD88) at The Narrows' },
      { label: 'Total Water Pumped Out', value: '1.2 Billion gallons of seawater' }
    ],
    scientificNote: 'Compound coastal-estuarine disaster demonstrating extreme vulnerability of underground transit, power, and telecommunication networks to high-tide hurricane surges.',
    warningGap: 'Proves urgent necessity for regional outer-harbor storm gates (NYNJHAT Study Alternative 2/3) across the NY Bight.',
    countermeasure: {
      status: 'Long-Term Resiliency Activated',
      action: '$52 Billion USACE NYNJHAT outer-harbor storm surge barrier plan expedited through federal approval.',
      readiness: '100%'
    }
  }
];

export const NEWYORK_NARRATION = [
  { tStart: 0.00, tEnd: 0.10, text: "October 30, 06:30 AM. A Category 4 hurricane tracks up the Atlantic seaboard at dawn, steering an enormous ocean storm surge straight into the New York Bight at astronomical high tide." },
  { tStart: 0.10, tEnd: 0.24, text: "At The Narrows, golden morning sunlight illuminates 180 million cubic metres of Atlantic surge funneling under the Verrazzano Bridge at 48 km/h, propelling a 4.8-metre wall of water into Upper New York Bay." },
  { tStart: 0.24, tEnd: 0.38, text: "The Battery seawall is overtopped at 14.9 feet NAVD88. Seawater inundates Lower Manhattan, cascading across Bowling Green and surrounding the Financial District and World Trade Center." },
  { tStart: 0.38, tEnd: 0.52, text: "Catastrophe strikes the morning rush-hour transit: 14 million gallons of saltwater deluge South Ferry station, flooding seven under-river subway tunnels and paralyzing 5.4 million daily commuters." },
  { tStart: 0.52, tEnd: 0.66, text: "Along the East River, 16.5-foot steel roller floodgates seal FDR Drive under the East Side Coastal Resiliency project, turning the highway into a defensive water barrier against the surging tide." },
  { tStart: 0.66, tEnd: 0.80, text: "The surge bottleneck chokes under the Gothic granite towers of the Brooklyn Bridge. DUMBO cobblestones, historic waterfront lofts, and timber piers are engulfed under 1.8 metres of raging brine." },
  { tStart: 0.80, tEnd: 0.92, text: "At 14th Street, a violent 345-kilovolt transformer arc flash explodes across the Con Edison substation, detonating transformer oil and plunging Lower Manhattan from 34th Street south into darkness." },
  { tStart: 0.92, tEnd: 1.00, text: "385,000 residents displaced, 7 subway tubes submerged, and $42.5 billion in total economic destruction. The USACE unwatering armada mobilizes around the clock to drain the city." }
];

export function getNewYorkTallyValues(t, uWave = 0) {
  // Pre-disaster baseline: strictly zero casualties, zero damage before storm arrives
  if (t <= 0.0001 || uWave <= 0.0001) {
    return {
      dead: 0,
      missing: 0,
      evacuated: 0,
      popAffectedMillions: "0.00",
      waterOfflineMGD: 0,
      hydro: 0,
      stageMeters: 0.0,
      speedMS: 0.0,
      speedKMH: 0,
      intensityVal: "0.0m Normal Sea",
      intensityTag: "Pre-Surge Normal",
      intensityClass: "low",
      pressureKPa: 0,
      econUSD: 0,
      econLocal: "$0.0B",
      econLevel: "Pre-Disaster Baseline",
      econClass: "low"
    };
  }

  // 1. Data-backed Dynamic Fatalities (0 -> 44 official CDC / NYC Medical Examiner benchmark)
  let dead = 0;
  if (uWave < 0.14) {
    // Storm surge approaches offshore; mandatory Zone A evacuation active; 0 direct coastal flood drownings
    dead = 0;
  } else if (uWave < 0.35) {
    // Outer shoreline breach: Staten Island & Rockaways outer seawalls overtopped
    const f = (uWave - 0.14) / (0.35 - 0.14);
    dead = Math.round(f * 14); // 0 -> 14
  } else if (uWave < 0.60) {
    // Seawall breach: The Battery & Financial District street-level / basement inundation
    const f = (uWave - 0.35) / (0.60 - 0.35);
    dead = Math.round(14 + f * 18); // 14 -> 32
  } else {
    // Peak inundation, subway tunnels submerged, ConEd 14th St explosion
    const f = Math.min(1.0, (uWave - 0.60) / 0.40);
    dead = Math.round(32 + f * 12); // 32 -> 44
  }

  // 2. Population Affected & Displaced (0 -> 385,000 Zone A Mandatory Evacuees)
  const popFactor = Math.min(Math.max((uWave - 0.05) / 0.85, 0), 1);
  const evacuated = Math.round(385000 * popFactor);
  const popAffectedMillions = (1.85 * popFactor).toFixed(2);

  // 3. Flooded Subway Tubes (0 -> 7 under-river transit tubes)
  const tunnelFactor = Math.min(Math.max((uWave - 0.25) / 0.45, 0), 1);
  const floodedTubes = Math.round(7 * tunnelFactor);

  // 4. Water Speed & Surge Intensity (NOAA The Battery gauge & SLOSH hydrodynamic model)
  let speedMS = 3.5;
  let intensityVal = "1.2m Tide";
  let intensityClass = "low";
  let intensityTag = "High Tide Ingress";
  let pressureKPa = 8;
  let stageMeters = 1.6;

  if (uWave < 0.10) {
    const f = uWave / 0.10;
    speedMS = +(3.5 + f * 4.7).toFixed(1); // 3.5 -> 8.2 m/s
    intensityVal = "2.4m Surge";
    intensityTag = "Lower Bay Funnel";
    intensityClass = "low";
    pressureKPa = Math.round(8 + f * 16); // 8 -> 24 kPa
    stageMeters = +(1.6 + f * 1.2).toFixed(2); // 1.6 -> 2.8m
  } else if (uWave < 0.25) {
    // Funneling through The Narrows into Upper Bay (highest velocity)
    const f = (uWave - 0.10) / 0.15;
    speedMS = +(8.2 + f * 5.0).toFixed(1); // 8.2 -> 13.2 m/s (47.5 km/h)
    intensityVal = "4.82m Surge Crest";
    intensityTag = "Narrows Funneling";
    intensityClass = "severe";
    pressureKPa = Math.round(24 + f * 21); // up to 45 kPa
    stageMeters = +(2.8 + f * 2.02).toFixed(2); // up to 4.82 m
  } else if (uWave < 0.65) {
    // Battery overtopping & East River constriction past Brooklyn Bridge
    const f = (uWave - 0.25) / 0.40;
    speedMS = +(9.8 + Math.sin(f * Math.PI) * 2.2).toFixed(1); // 9.8 -> 12.0 m/s
    intensityVal = "4.55m NAVD88 Crest";
    intensityTag = "Battery Overtopped";
    intensityClass = "catastrophic";
    pressureKPa = Math.round(38 + Math.sin(f * Math.PI) * 12); // up to 50 kPa
    stageMeters = +(4.55 + Math.sin(f * Math.PI) * 0.27).toFixed(2);
  } else if (uWave < 0.85) {
    // FDR Drive & ConEd 14th St Substation arc flash
    const f = (uWave - 0.65) / 0.20;
    speedMS = +(8.5 - f * 2.1).toFixed(1); // 8.5 -> 6.4 m/s
    intensityVal = "4.2m Substation Crest";
    intensityTag = "Grid Arc-Flash";
    intensityClass = "extreme";
    pressureKPa = Math.round(42 - f * 14);
    stageMeters = +(4.40 - f * 0.5).toFixed(2);
  } else {
    // USACE pumping & surge recession
    const f = Math.min(1.0, (uWave - 0.85) / 0.15);
    speedMS = +(5.8 - f * 1.8).toFixed(1); // 5.8 -> 4.0 m/s
    intensityVal = "380k GPM Pumping";
    intensityTag = "Receding Tide";
    intensityClass = "high";
    pressureKPa = Math.round(25 - f * 12);
    stageMeters = +(3.80 - f * 1.2).toFixed(2);
  }

  const speedKMH = Math.round(speedMS * 3.6);

  // 5. Economic Destruction in USD ($ Billion, SIRR $42.5B benchmark)
  let econUSD = 0;
  let econLevel = "Normal Operations";
  let econClass = "low";

  if (uWave >= 0.08) {
    if (uWave < 0.25) {
      // Shoreline overtopping along Staten Island, Brooklyn & Battery seawall
      const f = (uWave - 0.08) / 0.17;
      econUSD = Math.round(3200 + f * 5600); // up to $8.8B
      econLevel = "Coastal Seawalls Breached";
      econClass = "severe";
    } else if (uWave < 0.60) {
      // 7 Subway tunnels flooded + South Ferry + DUMBO waterfront
      const f = (uWave - 0.25) / 0.35;
      econUSD = Math.round(8800 + f * 14200); // up to $23.0B
      econLevel = "Subway Tunnels Flooded";
      econClass = "extreme";
    } else if (uWave < 0.85) {
      // ConEd 14th St substation explosion + Lower Manhattan blackout
      const f = (uWave - 0.60) / 0.25;
      econUSD = Math.round(23000 + f * 14500); // up to $37.5B
      econLevel = "Manhattan Power Grid Lost";
      econClass = "catastrophic";
    } else {
      // Full metro toll & commercial interruption
      const f = Math.min(1.0, (uWave - 0.85) / 0.15);
      econUSD = Math.round(37500 + f * 5000); // up to $42.5B ($42,500M)
      econLevel = "Catastrophic Disaster ($42.5B)";
      econClass = "catastrophic";
    }
  }

  const econBillionUSD = (econUSD / 1000).toFixed(1);

  return {
    dead,
    missing: evacuated, // Displaced / evacuated count
    evacuated,
    popAffectedMillions,
    waterOfflineMGD: floodedTubes, // Submerged subway tunnels
    hydro: floodedTubes,           // Secondary KPI badge: Submerged Subway Tubes
    stageMeters,
    speedMS,
    speedKMH,
    intensityVal,
    intensityTag,
    intensityClass,
    pressureKPa,
    econUSD,
    econLocal: `$${econBillionUSD}B USD`,
    econLevel,
    econClass
  };
}
