// ---------------------------------------------------------------------------
// Delhi, India — Yamuna River Catastrophic Inundation Scenario
// Scenario: Historic Monsoonal Catchment Cloudburst & Barrage Overtopping
// Reference: CWC Record Stage 208.66m (breaching 205.33m Danger Mark by 3.33m)
// ---------------------------------------------------------------------------

let currentDelhiMode = 'warning'; // Default: 'warning' (48h CWC Warning: 11 deaths) | 'breach' (Nocturnal Regulator Breach: 420 deaths)

export function setDelhiForecastMode(mode) {
  if (mode === 'breach' || mode === 'warning') {
    currentDelhiMode = mode;
  }
  return currentDelhiMode;
}

export function getDelhiForecastMode() {
  return currentDelhiMode;
}

export const DELHI_CONFIG = {
  id: 'delhi',
  name: 'Delhi, India',
  country: 'India',
  flag: '🇮🇳',
  hazard: 'What If: Yamuna Record Inundation & Regulator Breach?',
  tagline: 'Predictive Hydrodynamic Simulation • Drain 12 Breach • Delhi Digital Twin',
  year: '2023-2026 What-If Simulation Model',
  currency: {
    code: 'INR',
    symbol: '₹',
    rateToUSD: 83.5, // 1 USD = 83.5 INR
    unit: 'Billion INR',
    scale: 0.0835
  },
  environment: {
    skyTop: 0x1e3a8a,    // Radiant golden morning blue
    skyMid1: 0x38bdf8,   // Vibrant cerulean morning sky
    skyMid2: 0x93c5fd,   // Luminous morning light
    skyBottom: 0xfef08a, // Warm golden sunrise horizon
    fogColor: 0xe0f2fe,  // Ultra-clean morning horizon
    fogNear: 450,        // Pushed back for crystal clarity across Yamuna corridor
    fogFar: 1600,
    sunPosition: [0.70, 0.55, 0.35], // Golden morning sun from east
    sunColor: 0xfff7ed,  // Radiant warm golden-white sunlight
    sunIntensity: 2.1,   // Bright crisp morning illumination
    waterColor: 0x854d0e, // Silt-heavy Gangetic golden alluvial torrent
    waterRoughness: 0.30,
    waterMetalness: 0.20,
    rainIntensity: 0.0,   // Crystal-clear morning atmosphere
    terrainType: 'alluvial'
  },
  probabilityData: {
    calamityType: 'Monsoonal Catchment Cloudburst & Barrage Overtopping',
    returnPeriod: '1-in-100 Years',
    returnYears: 100,
    baseAEP: 1.0,
    climateAdjustedAEP: 1.8,
    aepPercent: '1.0%',
    climateAEPPercent: '1.8%',
    severity: 'Extreme Hazard',
    severityClass: 'extreme',
    forecastChances: {
      year10: 16.6,
      year25: 36.5,
      year50: 59.7,
      year100: 83.8
    },
    dataCollection: {
      primaryAgencies: ['Central Water Commission (CWC)', 'India Meteorological Dept (IMD)', 'Upper Yamuna River Board (UYRB)'],
      sensorNetwork: '14 CWC Ultrasonic River Gauges • 3 IMD S-Band Doppler Radars • 28 Catchment Rain Stations',
      samplingCadence: '15-Minute Automated Telemetry',
      uplinkProtocol: 'INSAT-3DR Satellite & VHF Emergency Telemetry',
      historicalBenchmark: 'Record Stage 208.66m (Breaching 205.33m Danger Mark by 3.33m)'
    },
    climateMultiplier: {
      factor: '+2.1×',
      trend: 'Accelerating (+210% frequency by 2050)',
      driver: 'Monsoonal trough & Western Disturbance confluence over Upper Yamuna catchment'
    }
  },
  timeline: {
    durationSec: 36.0,
    clockStart: '11 July 06:30 AM',
    clockEnd: '11 July 11:30 AM'
  }
};

// 3D River Spline Coordinates for Yamuna Corridor through Delhi
// Wazirabad (North, x=-140) -> Old Iron Bridge -> Red Fort / Kashmere Gate -> ITO Barrage -> Okhla (South, x=140)
export const DELHI_RIVER_POINTS = [
  { x: -140, y: 3.5, z: -85 },
  { x: -105, y: 3.2, z: -65 },
  { x: -70,  y: 2.8, z: -40 },
  { x: -35,  y: 2.5, z: -15 },
  { x: 0,    y: 2.2, z: 0 },
  { x: 35,   y: 1.9, z: 18 },
  { x: 70,   y: 1.6, z: 38 },
  { x: 105,  y: 1.3, z: 62 },
  { x: 140,  y: 1.0, z: 90 }
];

export const DELHI_WAYPOINTS = [
  {
    id: 'hathnikund-surge',
    u: 0.05,
    t: 0.06,
    sceneSec: 2.2,
    realTime: '10 Jul 06:00',
    name: 'Hathnikund Discharge',
    subtitle: '120 km Upstream Haryana Catchment',
    coords: '30.31° N, 77.58° E',
    badge: 'Stage 1 • Upstream Release • 360,000+ cusecs',
    headline: 'Monsoon Cloudburst Releases 10,200 m³/s into Yamuna Basin',
    stats: [
      { label: 'Catchment Rainfall', value: '380 mm in 24 hrs (HP & UK)' },
      { label: 'Peak Barrage Discharge', value: '360,000 cusecs (10,194 m³/s)' },
      { label: 'Downstream Velocity', value: '4.2 m/s (15.1 km/h)' },
      { label: 'Warning Lead Time', value: '48 to 72 hours travel to Delhi' },
      { label: 'Water Level Trend', value: '+1.8 m/day upstream rise' }
    ],
    scientificNote: 'Torrential Western Disturbance and monsoon trough confluence dumped historic precipitation over Himachal and Uttarakhand, forcing emergency barrage release.',
    warningGap: 'While CWC provided discharge telemetry, silt sedimentation in the downstream riverbed significantly reduced hydraulic carrying capacity.',
    countermeasure: {
      status: 'CWC Telemetry Alert Issued',
      action: '48-hour advance warning sent to Delhi Govt & DDMA; downstream barrages notified.',
      readiness: '80%'
    }
  },
  {
    id: 'wazirabad-submergence',
    u: 0.20,
    t: 0.22,
    sceneSec: 7.9,
    realTime: '11 Jul 18:00',
    name: 'Wazirabad Barrage & WTP',
    subtitle: 'North Delhi Drinking Water Intake',
    coords: '28.71° N, 77.23° E',
    badge: 'Stage 2 • Water Plant Inundation • 25% Grid Cut',
    headline: 'Water Treatment Plants Inundated: 4M Citizens Face Water Cuts',
    stats: [
      { label: 'Barrage Stage', value: '207.25 m (Overtopping gates)' },
      { label: 'WTP Submergence', value: 'Water intake pumps 3.2 m underwater' },
      { label: 'Capacity Offline', value: '234 MGD (Wazirabad & Chandrawal)' },
      { label: 'Turbidity Level', value: '>9,500 NTU (Unfilterable heavy silt)' },
      { label: 'Citizens Impacted', value: '~4.2 Million without piped water' }
    ],
    scientificNote: 'Extreme sediment load clogged intake raw water pumps while the surging river overtopped retaining bunds, flooding the primary electrical switchboards.',
    warningGap: 'No auxiliary upland bypass intakes were in place, forcing simultaneous shutdown of both Chandrawal and Wazirabad treatment plants.',
    countermeasure: {
      status: 'Emergency Pump Shutdown',
      action: 'Delhi Jal Board de-energized sub-stations to prevent motor burnouts; 800 water tankers deployed.',
      readiness: '65%'
    }
  },
  {
    id: 'loha-pul',
    u: 0.35,
    t: 0.36,
    sceneSec: 13.0,
    realTime: '12 Jul 14:00',
    name: 'Old Yamuna Iron Bridge',
    subtitle: 'Historic 1866 Rail-Cum-Road Bridge (Loha Pul)',
    coords: '28.66° N, 77.25° E',
    badge: 'Stage 3 • Transportation Severance • Stage 208.08m',
    headline: 'Northern Railway Suspends All Rail & Road Traffic Over Bridge',
    stats: [
      { label: 'Bridge Clearance', value: '0.4 m below bottom girder' },
      { label: 'Recorded Stage', value: '208.08 m (Danger Mark: 205.33 m)' },
      { label: 'Flow Velocity', value: '5.8 m/s (20.9 km/h)' },
      { label: 'Trains Diverted', value: '142 passenger & freight trains' },
      { label: 'Riverbank Evacuation', value: '12,500 people relocated to tents' }
    ],
    scientificNote: 'Built in 1866, the bridge was designed for 207.5m extreme flood stage; backwater pressure created dangerous scouring around masonry pier foundations.',
    warningGap: 'Informal dairy farmers and boatmen along the riverbed delayed evacuation until river was within 30cm of their settlements.',
    countermeasure: {
      status: 'Section 144 Imposed',
      action: 'Delhi Police cordoned bridge; NDRF deployed 18 rescue boats along low-lying shanties.',
      readiness: '75%'
    }
  },
  {
    id: 'kashmere-gate-ringroad',
    u: 0.48,
    t: 0.50,
    sceneSec: 18.0,
    realTime: '13 Jul 04:00',
    name: 'Kashmere Gate & Monastery',
    subtitle: 'Ring Road & Inter-State Bus Terminus (ISBT)',
    coords: '28.67° N, 77.23° E',
    badge: 'Stage 4 • Arterial Submergence • Ring Road Cut',
    headline: 'Yamuna Swallows Ring Road: Monastery Market 2m Deep',
    stats: [
      { label: 'Flood Depth on Road', value: '1.8 – 2.4 m on Mahatma Gandhi Marg' },
      { label: 'ISBT Operations', value: '100% suspended (Buses halted)' },
      { label: 'Vehicles Stranded', value: '>1,800 cars, buses & auto-rickshaws' },
      { label: 'Refugee Settlement', value: 'Tibetan Monastery completely submerged' },
      { label: 'Economic Loss', value: '₹4.2 Billion (~$50M USD) commercial' }
    ],
    scientificNote: 'A breach in the river embankment near Monastery Market allowed floodwaters to surge downhill into the low-lying Ring Road trench.',
    warningGap: 'Stormwater backflow through unsealed discharge outfalls exacerbated urban pooling faster than river overtopping alone.',
    countermeasure: {
      status: 'NDRF Inflatable Raft Rescue',
      action: 'Over 2,500 residents evacuated by boat; elevated bypass roads designated as relief camps.',
      readiness: '70%'
    }
  },
  {
    id: 'red-fort-ramparts',
    u: 0.60,
    t: 0.62,
    sceneSec: 22.3,
    realTime: '13 Jul 11:00',
    name: 'Red Fort & Salimgarh',
    subtitle: '17th Century UNESCO Heritage Ramparts',
    coords: '28.65° N, 77.24° E',
    badge: 'Stage 5 • Historic Extent • River Reclaims Ancient Bed',
    headline: 'Yamuna Reaches the Walls of the Red Fort for First Time in 45 Years',
    stats: [
      { label: 'Historical Stage', value: '208.66 m (All-Time Record Peak)' },
      { label: 'Historical Comparison', value: 'Matches 1978 great Delhi flood' },
      { label: 'Fort Moat Condition', value: 'Outer moat submerged under 1.5 m water' },
      { label: 'Tourism & ASI Site', value: 'Monument shut to public' },
      { label: 'Soil Saturation', value: '100% saturation of foundational sandstone' }
    ],
    scientificNote: 'In Mughal times, the Yamuna flowed directly past the fort before shifting east over 300 years; extreme backwater reclaimed its historical paleo-channel.',
    warningGap: 'Heritage retaining walls lacked integrated floodgate barriers along the perimeter gardens.',
    countermeasure: {
      status: 'ASI Heritage Protection',
      action: 'Sandbag bunding around monument gates; dewatering pumps deployed around Salimgarh underpass.',
      readiness: '85%'
    }
  },
  {
    id: 'ito-regulator-breach',
    u: 0.74,
    t: 0.76,
    sceneSec: 27.4,
    realTime: '13 Jul 22:00',
    name: 'ITO Barrage & Drain 12 Breach',
    subtitle: 'Central Civic & Judicial District',
    coords: '28.63° N, 77.25° E',
    badge: 'Stage 6 • Infrastructure Crisis • Regulator No. 12 Collapse',
    headline: 'Regulator 12 Breached: River Surges into Supreme Court & ITO',
    stats: [
      { label: 'Regulator Failure', value: 'Gate 12 sheared off by reverse surge' },
      { label: 'Barrage Gate Siltation', value: '5 of 32 barrage gates stuck in silt' },
      { label: 'Inundation Target', value: 'Supreme Court, Vikas Bhawan, IP Estate' },
      { label: 'Power Substation', value: 'IP Power Station grid offline' },
      { label: 'Discharge Velocity', value: '6.4 m/s (23 km/h) into city drains' }
    ],
    scientificNote: 'River level (208.6m) exceeded stormwater drain level (204.8m); hydraulic head blew out the sluice regulator, reversing drainage back into central Delhi.',
    warningGap: 'The 32 barrage gates had not been desilted before monsoon, severely restricting flood discharge capacity downriver.',
    countermeasure: {
      status: 'Indian Army Corps Deployment',
      action: 'Engineers deployed heavy metallic sheet piles and 15,000 sandbags to build a temporary bund.',
      readiness: '90%'
    }
  },
  {
    id: 'rajghat-inundation',
    u: 0.88,
    t: 0.90,
    sceneSec: 32.4,
    realTime: '14 Jul 10:00',
    name: 'Rajghat & Central Floodplain',
    subtitle: 'Mahatma Gandhi Memorial & Ring Road South',
    coords: '28.64° N, 77.25° E',
    badge: 'Stage 7 • Memorial Inundation • 1,000 HP Pumping',
    headline: 'National Memorials Submerged: Massive Dewatering Mobilization',
    stats: [
      { label: 'Memorial Water Depth', value: '1.2 m inside Rajghat complex' },
      { label: 'Pumping Mobilized', value: '12 heavy 1,000 HP dewatering pumps' },
      { label: 'Drainage Velocity', value: 'Pumping 450,000 L/min back to river' },
      { label: 'Groundwater Saturation', value: '0 m depth to water table' },
      { label: 'Public Health Alert', value: 'Dengue & vector surveillance mobilized' }
    ],
    scientificNote: 'Low-lying depression between the Ring Road and Yamuna acted as a giant retention basin, with silty clay preventing natural percolation.',
    warningGap: 'Permanent high-capacity pump installations were non-operational due to submerged transformers.',
    countermeasure: {
      status: 'Navy & PWD Joint Dewatering',
      action: 'Indian Navy divers opened jammed sluices; high-capacity diesel pumps drained the complex.',
      readiness: '95%'
    }
  },
  {
    id: 'delhi-toll-summary',
    u: 0.98,
    t: 1.00,
    sceneSec: 36.0,
    realTime: '14 Jul 18:00',
    name: 'Deluge Summary & Toll',
    subtitle: 'Full Yamuna Corridor (Wazirabad to Okhla)',
    coords: '28.53° N, 77.30° E (Okhla Outflow)',
    badge: 'Stage 8 • Total Impact • 2.8M Affected',
    get headline() {
      return currentDelhiMode === 'warning'
        ? 'What-If Projection A (48-Hr Warning): 11 Fatalities, 27,000 Evacuated & ₹28.4B Loss'
        : 'What-If Projection B (Nocturnal Breach): 420 Fatalities, 1,850 Missing & ₹28.4B Loss';
    },
    get stats() {
      return currentDelhiMode === 'warning'
        ? [
            { label: 'Projected Fatalities', value: '11 deaths (isolated drain drownings, 27k safely evacuated)' },
            { label: 'Floodplain Evacuees', value: '27,000+ residents in 47 elevated relief camps' },
            { label: 'Water Plants Offline', value: '3 Mega Works (Wazirabad, Chandrawal, Okhla: 234 MGD)' },
            { label: 'Total Economic Destruction', value: '₹28.4 Billion INR (~$340M USD)' },
            { label: 'All-Time Peak Stage', value: '208.66 m (3.33 m above Danger Mark)' },
            { label: 'Peak River Discharge', value: '12,500 m³/s (441,400 cusecs)' }
          ]
        : [
            { label: 'Projected Fatalities', value: '420 deaths (nocturnal regulator collapse & slum flash deluge)' },
            { label: 'Missing / Trapped', value: '1,850 residents in submerged Yamuna floodplains' },
            { label: 'Displaced Population', value: '250,000 residents across Ring Road & Kashmere Gate' },
            { label: 'Water Plants Offline', value: '3 Mega Works (Wazirabad, Chandrawal, Okhla: 234 MGD)' },
            { label: 'Total Economic Destruction', value: '₹28.4 Billion INR (~$340M USD)' },
            { label: 'All-Time Peak Stage', value: '208.66 m (3.33 m above Danger Mark)' },
            { label: 'Peak River Discharge', value: '12,500 m³/s (441,400 cusecs)' }
          ];
    },
    get scientificNote() {
      return currentDelhiMode === 'warning'
        ? 'What-If Model Finding A: When 48-hour advance CWC discharge warnings enable pre-emptive evacuation of Yamuna floodplains, human life is largely safeguarded (fatalities held to 11) despite 234 MGD water cuts and ₹28.4B in civic flooding.'
        : 'What-If Model Finding B: If ITO Drain 12 regulator collapses at midnight while river is at record 208.66m, the hydraulic head reverses drainage into low-lying bastis without warning, producing sudden flash casualties (420 dead, 1,850 missing) comparable to mountain flash floods.';
    },
    warningGap: 'Highlights urgent need for an automated Yamuna Basin flood management authority spanning Haryana, Delhi, and Uttar Pradesh.',
    countermeasure: {
      status: 'Post-Disaster Recovery Activated',
      action: '208m flood wall enhancement proposed; desilting of all 32 ITO barrage gates commissioned.',
      readiness: '100%'
    }
  }
];

export const DELHI_NARRATION = [
  { tStart: 0.00, tEnd: 0.10, text: "July 2023 / 2026. A hyper-active monsoon trough confluences over northern India, dumping over 380mm of rain on the upper Himalayan catchment." },
  { tStart: 0.10, tEnd: 0.22, text: "120 km north in Haryana, Hathnikund Barrage releases an unprecedented 360,000 cusecs, propelling a 10,000-cubic-metre-per-second wave toward Delhi." },
  { tStart: 0.22, tEnd: 0.35, text: "At Wazirabad in north Delhi, floodwaters submerge primary water intake pumps. Both Chandrawal and Wazirabad plants shut down, cutting drinking water to 4 million people." },
  { tStart: 0.35, tEnd: 0.48, text: "The river breaches its danger mark by over three metres. Traffic across the historic 1866 Old Iron Bridge is suspended as waters touch the iron girders." },
  { tStart: 0.48, tEnd: 0.60, text: "Torrential backwater bursts onto Mahatma Gandhi Marg. Kashmere Gate ISBT, the Tibetan Monastery market, and low-lying flyovers are submerged under two metres of water." },
  { tStart: 0.60, tEnd: 0.72, text: "At 208.66 metres, the Yamuna reaches its highest level in recorded history, reclaiming its ancient Mughal bed right against the red sandstone ramparts of the Red Fort." },
  { tStart: 0.72, tEnd: 0.85, text: "Disaster strikes the civic core: Drain 12 regulator collapses, flooding ITO intersection, the Supreme Court, and key government secretariats." },
  {
    tStart: 0.85,
    tEnd: 1.00,
    get text() {
      return currentDelhiMode === 'warning'
        ? "What-If Simulation Outcome A: 11 direct drownings, 27,000 evacuated, and 234 MGD water offline under ₹28.4 billion in damage. 48-hour CWC advance alerts prevented catastrophic human loss."
        : "What-If Simulation Outcome B: 420 fatalities, 1,850 missing, and 250,000 displaced in a sudden nocturnal regulator breach causing ₹28.4 billion in civic destruction. Indian Army engineers mobilize sheet-piles around the clock.";
    }
  }
];

export function getDelhiTallyValues(t, uWave = 0, mode = currentDelhiMode) {
  // Pre-disaster baseline: strictly zero casualties, zero damage before flood wave arrives
  if (t <= 0.0001 || uWave <= 0.0001) {
    return {
      dead: 0,
      missing: 0,
      evacuated: 0,
      popAffectedMillions: "0.00",
      waterOfflineMGD: 0,
      hydro: 0,
      stageMeters: 204.5,
      speedMS: 0,
      speedKMH: 0,
      intensityVal: "850 m³/s",
      intensityTag: "Monsoon Normal",
      intensityClass: "low",
      pressureKPa: 0,
      econUSD: 0,
      econINR: "0.0",
      econLocal: "₹0.0B",
      econLevel: "Baseline",
      econClass: "low"
    };
  }

  // 1. Casualties based on active mode
  let dead = 0;
  let missing = 0;
  let evacuated = 0;
  let popAffectedMillions = "0.00";

  if (mode === 'warning') {
    // Mode A: 48-hr CWC Warning & Embankment Defense (Historical 2023 Benchmark)
    // Evacuation: 0 -> 27,000 people. Fatalities: 0 -> 11 isolated drownings. Missing: 0.
    if (uWave < 0.15) {
      dead = 0;
      missing = 0;
      evacuated = 0;
    } else if (uWave < 0.40) {
      const f = (uWave - 0.15) / 0.25;
      dead = Math.round(f * 3); // 0 -> 3
      missing = 0;
      evacuated = Math.round(f * 12500); // 0 -> 12,500
    } else if (uWave < 0.75) {
      const f = (uWave - 0.40) / 0.35;
      dead = Math.round(3 + f * 5); // 3 -> 8
      missing = 0;
      evacuated = Math.round(12500 + f * 11500); // 12,500 -> 24,000
    } else {
      const f = Math.min(1.0, (uWave - 0.75) / 0.25);
      dead = Math.round(8 + f * 3); // 8 -> 11
      missing = 0;
      evacuated = Math.round(24000 + f * 3000); // 24,000 -> 27,000
    }
    popAffectedMillions = (2.8 * Math.min(1.0, uWave / 0.85)).toFixed(2);
  } else {
    // Mode B: Nocturnal Regulator Breach & Fast-Mover Deluge (Worst-Case Stress Test)
    // Fatalities: 0 -> 420. Missing: 0 -> 1,850. Evacuated/Displaced: 0 -> 250,000.
    if (uWave < 0.15) {
      dead = 0;
      missing = 0;
      evacuated = 0;
    } else if (uWave < 0.40) {
      const f = (uWave - 0.15) / 0.25;
      dead = Math.round(f * 85); // 0 -> 85
      missing = Math.round(f * 320); // 0 -> 320
      evacuated = Math.round(f * 65000); // 0 -> 65,000
    } else if (uWave < 0.75) {
      const f = (uWave - 0.40) / 0.35;
      dead = Math.round(85 + f * 215); // 85 -> 300
      missing = Math.round(320 + f * 980); // 320 -> 1,300
      evacuated = Math.round(65000 + f * 125000); // 65,000 -> 190,000
    } else {
      const f = Math.min(1.0, (uWave - 0.75) / 0.25);
      dead = Math.round(300 + f * 120); // 300 -> 420
      missing = Math.round(1300 + f * 550); // 1,300 -> 1,850
      evacuated = Math.round(190000 + f * 60000); // 190,000 -> 250,000
    }
    popAffectedMillions = (2.8 * Math.min(1.0, uWave / 0.85)).toFixed(2);
  }

  // 2. Drinking Water Deficit (0 -> 234 MGD offline / 4.2M people)
  const waterFactor = Math.min(Math.max((uWave - 0.15) / 0.30, 0), 1);
  const waterOfflineMGD = Math.round(234 * waterFactor);

  // 3. Water Speed & Intensity
  let speedMS = 1.2;
  let intensityVal = "850 m³/s";
  let intensityClass = "low";
  let intensityTag = "Monsoon Normal";
  let pressureKPa = 4;
  let stageMeters = 204.5;

  if (t < 0.08) {
    speedMS = 1.8;
    intensityVal = "1,850 m³/s";
    intensityTag = "Catchment Rain";
    intensityClass = "low";
    pressureKPa = 8;
    stageMeters = 205.1;
  } else if (uWave < 0.25) {
    // Barrage surge approaching Wazirabad
    const f = uWave / 0.25;
    speedMS = +(3.2 + f * 1.6).toFixed(1); // 3.2 -> 4.8 m/s
    intensityVal = Math.round(4500 + f * 4200) + " m³/s";
    intensityTag = "Barrage Wave";
    intensityClass = "severe";
    pressureKPa = Math.round(18 + f * 22);
    stageMeters = +(205.5 + f * 1.8).toFixed(2);
  } else if (uWave < 0.65) {
    // Gorge & bridge constriction past Kashmere Gate & Red Fort (highest stage)
    const f = (uWave - 0.25) / 0.40;
    speedMS = +(4.8 + Math.sin(f * Math.PI) * 1.8).toFixed(1); // Up to 6.6 m/s
    intensityVal = Math.round(8700 + Math.sin(f * Math.PI) * 3800) + " m³/s"; // Up to 12,500 m³/s
    intensityTag = "Record Crest (208.66m)";
    intensityClass = "catastrophic";
    pressureKPa = Math.round(40 + Math.sin(f * Math.PI) * 35); // Up to 75 kPa
    stageMeters = +(207.3 + Math.sin(f * Math.PI) * 1.36).toFixed(2); // Up to 208.66 m
  } else if (uWave < 0.85) {
    // ITO breach & Drain 12 backflow
    const f = (uWave - 0.65) / 0.20;
    speedMS = +(5.2 - f * 1.4).toFixed(1); // 5.2 -> 3.8 m/s
    intensityVal = Math.round(12500 - f * 3500) + " m³/s";
    intensityTag = "Regulator Breach";
    intensityClass = "extreme";
    pressureKPa = Math.round(65 - f * 25);
    stageMeters = +(208.66 - f * 1.2).toFixed(2);
  } else {
    // Flow past Rajghat towards Okhla barrage
    const f = Math.min(1.0, (uWave - 0.85) / 0.15);
    speedMS = +(3.8 - f * 1.2).toFixed(1); // 3.8 -> 2.6 m/s
    intensityVal = Math.round(9000 - f * 2500) + " m³/s";
    intensityTag = "Okhla Sluice Release";
    intensityClass = "high";
    pressureKPa = Math.round(40 - f * 20);
    stageMeters = +(207.46 - f * 1.5).toFixed(2);
  }

  const speedKMH = Math.round(speedMS * 3.6);

  // 4. Economic Destruction in USD ($M) & INR (₹ Billion)
  let econUSD = 0;
  let econLevel = "Normal";
  let econClass = "low";

  if (uWave >= 0.08) {
    if (uWave < 0.25) {
      // WTP submergence + northern farms
      const f = (uWave - 0.08) / 0.17;
      econUSD = Math.round(15 + f * 55); // up to $70M (₹5.8B)
      econLevel = "Water Works Submerged";
      econClass = "severe";
    } else if (uWave < 0.60) {
      // Old Iron Bridge rail diversion + Kashmere Gate ISBT + Monastery
      const f = (uWave - 0.25) / 0.35;
      econUSD = Math.round(70 + f * 110); // up to $180M (₹15B)
      econLevel = "Ring Road Severance";
      econClass = "extreme";
    } else if (uWave < 0.85) {
      // ITO regulator breach + Supreme Court / Secretariat / Power substation
      const f = (uWave - 0.60) / 0.25;
      econUSD = Math.round(180 + f * 115); // up to $295M (₹24.6B)
      econLevel = "Civic Core Flooding";
      econClass = "catastrophic";
    } else {
      // Total Delhi corridor impact
      const f = Math.min(1.0, (uWave - 0.85) / 0.15);
      econUSD = Math.round(295 + f * 45); // up to $340M (₹28.4B)
      econLevel = "State Disaster (₹28.4B)";
      econClass = "catastrophic";
    }
  }

  const econINR = (econUSD * 0.0835).toFixed(1); // in Billion INR (₹)

  return {
    probAEP: DELHI_CONFIG.probabilityData.aepPercent,
    probReturn: DELHI_CONFIG.probabilityData.returnPeriod,
    probForecast10Y: `${DELHI_CONFIG.probabilityData.forecastChances.year10}%`,
    probSeverity: DELHI_CONFIG.probabilityData.severity,
    probDataNetwork: 'CWC / IMD Telemetry',
    dead,
    missing,
    evacuated,
    popAffectedMillions,
    waterOfflineMGD,
    hydro: waterOfflineMGD, // maps to secondary infrastructure KPI (MGD water)
    stageMeters,
    speedMS,
    speedKMH,
    intensityVal,
    intensityTag,
    intensityClass,
    pressureKPa,
    econUSD,
    econINR,
    econLocal: `₹${econINR}B`,
    econLevel,
    econClass
  };
}
