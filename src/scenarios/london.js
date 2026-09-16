// ---------------------------------------------------------------------------
// London, UK — North Sea Tidal Surge & Thames Barrier Emergency Closure
// Scenario: Tidal Estuary Surge Funneling, 10 Rising Sector Gates & Tube Defenses
// Reference: Environment Agency (EA) Thames Estuary 2100 (TE2100) Plan,
//            Port of London Authority (PLA), TfL Under-River Floodgate Protocol, £18.5B Loss
// ---------------------------------------------------------------------------

export const LONDON_CONFIG = {
  id: 'london',
  name: 'London, UK',
  country: 'United Kingdom',
  flag: '🇬🇧',
  hazard: 'North Sea Tidal Surge & Barrier Closure',
  tagline: 'Thames Estuary Funnel, 10 Rising Sector Gates & Tube Armor',
  year: '2026 Forecast / 1953 Surge Benchmark',
  currency: {
    code: 'GBP',
    symbol: '£',
    rateToUSD: 1.30,
    unit: 'Billion GBP',
    scale: 0.77
  },
  environment: {
    skyTop: 0x1e3a8a,    // Chilly crisp London morning blue
    skyMid1: 0x38bdf8,   // Clear crisp morning sky
    skyMid2: 0x93c5fd,   // Luminous morning light
    skyBottom: 0xfef08a, // Sunrise gold over Thames Estuary
    fogColor: 0xe0f2fe,  // Ultra-clean morning horizon
    fogNear: 450,        // Razor-sharp clarity along Thames Tideway
    fogFar: 1600,
    sunPosition: [0.70, 0.45, 0.35], // Dawn sun rising over North Sea
    sunColor: 0xfff7ed,  // Radiant golden morning sunlight
    sunIntensity: 2.15,  // Crisp, brilliant illumination
    waterColor: 0x0284c7, // Vibrant Thames Tideway morning blue
    waterRoughness: 0.28,
    waterMetalness: 0.25,
    rainIntensity: 0.0,   // Crystal-clear morning
    terrainType: 'tidal_estuary'
  },
  probabilityData: {
    calamityType: 'North Sea Inverse-Barometer Tidal Surge & Funneling',
    returnPeriod: '1-in-100 Years',
    returnYears: 100,
    baseAEP: 1.0,
    climateAdjustedAEP: 1.0,
    aepPercent: '1.0%',
    climateAEPPercent: '1.0%',
    severity: 'High Estuarine Surge Risk',
    severityClass: 'high',
    forecastChances: {
      year10: 9.6,
      year25: 22.2,
      year50: 39.5,
      year100: 63.4
    },
    dataCollection: {
      primaryAgencies: ['UK Environment Agency (EA)', 'Met Office Storm Tide Forecasting Service', 'National Oceanography Centre'],
      sensorNetwork: '44 National Tide Gauges (Southend, Sheerness) • North Sea Wave Buoys • Thames Barrier Level Probes',
      samplingCadence: '15-Minute Continuous Telemetry',
      uplinkProtocol: 'CS3X Numerical Continental Shelf Hydrodynamic Telemetry Link',
      historicalBenchmark: '1953 Big Flood (307 deaths) leading to Thames Barrier 1982 construction; 221 closures to date'
    },
    climateMultiplier: {
      factor: '+1.8×',
      trend: 'Moderate Acceleration (+180% frequency)',
      driver: 'North Atlantic jet stream waviness and winter gales forcing counter-clockwise North Sea surges'
    }
  },
  timeline: {
    durationSec: 36.0,
    clockStart: '01 Feb 07:15 AM',
    clockEnd: '01 Feb 12:15 PM'
  }
};

// 3D River & Drainage Spline Coordinates:
// North Sea Estuary / Southend (East, x=-140) -> Thames Barrier (Woolwich, x=-70) -> Greenwich / Canary Wharf ->
// Tower Bridge -> London Bridge -> Westminster / Whitehall (West, x=105) -> Battersea Reach (x=140)
export const LONDON_RIVER_POINTS = [
  { x: -140, y: 1.2, z: -88 }, // Thames Estuary / Southend & Tilbury approach
  { x: -105, y: 1.3, z: -64 }, // Dartford Crossing / Purfleet Reach
  { x: -70,  y: 1.5, z: -40 }, // Thames Barrier at Woolwich Reach (10 steel rising sector gates)
  { x: -35,  y: 1.8, z: -16 }, // Greenwich Peninsula & Canary Wharf / Isle of Dogs bend
  { x: 0,    y: 2.1, z: 6 },   // Wapping / Rotherhithe tunnel reach
  { x: 35,   y: 2.3, z: 28 },  // Tower Bridge & Tower of London
  { x: 70,   y: 2.5, z: 52 },  // London Bridge, Southwark & City Financial Quarter
  { x: 105,  y: 2.7, z: 76 },  // Victoria Embankment, Westminster & Houses of Parliament
  { x: 140,  y: 3.0, z: 98 }   // Vauxhall, Battersea Power Station & upstream Thames
];

export const LONDON_WAYPOINTS = [
  {
    id: 'north-sea-surge-inflow',
    u: 0.05,
    t: 0.06,
    sceneSec: 2.2,
    realTime: '31 Jan 12:00',
    name: 'Thames Estuary & Southend',
    subtitle: 'North Sea Polar Gale Surge Funnel',
    coords: '51.53° N, 0.71° E',
    badge: 'Stage 1 • Polar Storm Surge • +5.2m Tidal Wave',
    headline: 'Deep Atmospheric Low Pushes +5.2m Storm Surge into Thames Funnel',
    stats: [
      { label: 'Tidal Surge Height', value: '+5.2 m above astronomical high tide' },
      { label: 'Estuary Inflow Rate', value: '8,400 m³/s rushing westward' },
      { label: 'Surge Forward Speed', value: '7.2 m/s (25.9 km/h)' },
      { label: 'Atmospheric Pressure', value: '962 hPa central low over North Sea' },
      { label: 'Warning Lead Time', value: '36 hours advance Met Office & EA alert' }
    ],
    scientificNote: 'A polar storm tracked southeast across the shallow North Sea; ferocious northerly gales coupled with spring tides trapped water against the English coast, driving a monumental surge up the narrowing Thames estuary funnel.',
    warningGap: 'Isolated marshland seawalls in Essex and North Kent experienced minor overtopping prior to barrier closure.',
    countermeasure: {
      status: 'Flood Warning Severe (Threat to Life)',
      action: 'Environment Agency activated National Flood Incident Room; Port of London Authority halted inward shipping.',
      readiness: '88%'
    }
  },
  {
    id: 'thames-barrier-prep',
    u: 0.20,
    t: 0.22,
    sceneSec: 7.9,
    realTime: '31 Jan 16:30',
    name: 'Woolwich Reach & Barrier Sirens',
    subtitle: 'Port of London Navigation Halted',
    coords: '51.49° N, 0.03° E',
    badge: 'Stage 2 • River Lockdown • PLA Halts All Ships',
    headline: 'Barrier Sirens Wail at Woolwich: 520m River Navigation Sealed',
    stats: [
      { label: 'Thames Width at Barrier', value: '520 m span across Woolwich Reach' },
      { label: 'Vessels Cleared to Moor', value: '42 cargo ships, tugs & passenger clippers' },
      { label: 'Hydraulic Arming Status', value: 'Rocking beams & hydraulic rams pressurized' },
      { label: 'Estuary Surge Upstream', value: '+4.9 m approaching barrier piers' },
      { label: 'Staff Deployment', value: '80 EA engineers in pier machine rooms' }
    ],
    scientificNote: 'Closing the Thames Barrier requires stopping all commercial river traffic, as the rising gates form a solid steel barrier 16m high across the navigation spans.',
    warningGap: 'Small pleasure craft mooring lines snapped under surging currents, requiring emergency RNLI sweeps.',
    countermeasure: {
      status: 'Thames Barrier Armed for Closure',
      action: 'Environment Agency and PLA synchronized sector gate closure sequence; navigation spans locked red.',
      readiness: '92%'
    }
  },
  {
    id: 'thames-barrier-closure',
    u: 0.35,
    t: 0.36,
    sceneSec: 13.0,
    realTime: '31 Jan 18:00',
    name: 'The Thames Barrier (10 Sector Gates)',
    subtitle: 'Full Rising Sector Gate Defensive Upright Lock',
    coords: '51.49° N, 0.03° E',
    badge: 'Stage 3 • Sector Gates Upright • 10 Gates Locked',
    headline: 'Ten 3,300-Ton Steel Sector Gates Rotate Upright, Halting Surge',
    stats: [
      { label: 'Main Sector Gates', value: '4 gates (each 61 m wide, 20 m high, 3,300 tons)' },
      { label: 'Total Defense Span', value: '10 gates spanning 520 m of river' },
      { label: 'Gate Rotation Angle', value: '90° vertical rotation from riverbed recess' },
      { label: 'Hydrostatic Head Held', value: 'Up to 9.0 m differential water pressure' },
      { label: 'Downstream Water Crest', value: '+5.5 m deflected back down estuary' }
    ],
    scientificNote: 'The hollow steel curved sector gates rotate on massive support trunnions, pivoting upward from recessed concrete sills in the riverbed to hold back the tidal North Sea.',
    warningGap: 'Downstream of the barrier, river levels rose 0.5m higher due to surge reflection, testing Erith flood embankments.',
    countermeasure: {
      status: 'Thames Barrier Fully Closed',
      action: 'All 10 gates rotated to vertical defensive position; downstream surge safely repelled into estuary storage.',
      readiness: '100%'
    }
  },
  {
    id: 'greenwich-docklands',
    u: 0.48,
    t: 0.50,
    sceneSec: 18.0,
    realTime: '31 Jan 21:00',
    name: 'Canary Wharf & Greenwich Peninsula',
    subtitle: 'Financial District Docklands & O2 Arena Flank',
    coords: '51.50° N, -0.02° W',
    badge: 'Stage 4 • Financial Citadel • Dock Gates Secured',
    headline: 'Canary Wharf & Isle of Dogs Impounded: £320B Property Preserved',
    stats: [
      { label: 'Protected Financial Assets', value: '£320 Billion in banking infrastructure' },
      { label: 'West India Dock Lock Gates', value: 'Impoundment gates sealed against backflow' },
      { label: 'Local River Headroom', value: 'Safe +2.1 m upstream level held behind barrier' },
      { label: 'Basin Dewatering Pumps', value: '6 high-capacity stormwater stations active' },
      { label: 'Workers Sheltered', value: '120,000 financial district personnel' }
    ],
    scientificNote: 'Because the barrier closed downstream, river levels upstream in central London remained calm at normal low-tide pool levels, preventing catastrophic inundation of subterranean server vaults.',
    warningGap: 'Local drainage outfalls could not discharge by gravity, relying entirely on automated pumping stations.',
    countermeasure: {
      status: 'Docklands Flood Defense Sealed',
      action: 'Canary Wharf Group and Tower Hamlets Council locked all secondary perimeter flood barriers.',
      readiness: '95%'
    }
  },
  {
    id: 'tfl-tube-floodgates',
    u: 0.60,
    t: 0.62,
    sceneSec: 22.3,
    realTime: '01 Feb 00:30',
    name: 'Under-River Tube & Rail Tunnels',
    subtitle: 'TfL Hydraulic Guillotine Flood Doors Locked',
    coords: '51.51° N, -0.06° W',
    badge: 'Stage 5 • Underground Armor • 16 Tunnels Sealed',
    headline: 'London Underground Locks 16 Hydraulic Steel Flood Doors',
    stats: [
      { label: 'Under-River Tunnels Sealed', value: '16 Tube and Elizabeth line tunnels secured' },
      { label: 'Steel Door Thickness', value: '300 mm solid steel hydraulic bulkhead doors' },
      { label: 'Protected Lines', value: 'Jubilee, Northern, Bakerloo, Waterloo & City' },
      { label: 'Daily Commuters Preserved', value: '4.5 Million passenger journeys safeguarded' },
      { label: 'Hydrostatic Seal Proof', value: 'Continuous silicone compression gaskets held' }
    ],
    scientificNote: 'Originally engineered in the Cold War, TfL heavy steel bulkhead floodgates slide across the tunnel profile at each river bank, ensuring that even a direct breach cannot drown the entire Underground network.',
    warningGap: 'Emergency tunnel venting grates along surface sidewalks required sandbag berming against localized street pooling.',
    countermeasure: {
      status: 'TfL Flood Doors Deployed',
      action: 'London Underground de-energized 750V DC third-rails and locked all subterranean under-river portals.',
      readiness: '96%'
    }
  },
  {
    id: 'tower-bridge-revetment',
    u: 0.74,
    t: 0.76,
    sceneSec: 27.4,
    realTime: '01 Feb 06:00',
    name: 'Tower Bridge & Tower of London',
    subtitle: 'Historic Embankments Deflect Swell',
    coords: '51.50° N, -0.07° W',
    badge: 'Stage 6 • Historic Heritage • Bastions Defended',
    headline: 'Tower Bridge Stands Resolute: Embankment Walls Hold Back River',
    stats: [
      { label: 'River Wall Crest Margin', value: '1.4 m freeboard below stone parapet' },
      { label: 'Tower of London Moat', value: 'Dry moat preserved from backwater surge' },
      { label: 'Bascule Span Status', value: 'Secured down with road traffic suspended' },
      { label: 'Hydrodynamic Wave Force', value: '24 kPa revetment shear pressure' },
      { label: 'Heritage Sites Intact', value: 'Tower of London, HMS Belfast & Southwark' }
    ],
    scientificNote: 'Victorian granite embankments along the Pool of London channel the tidal river; maintaining a controlled upstream pool prevents scouring along historic bridge pier caissons.',
    warningGap: 'Old cobbled river stairs along Wapping and Bermondsey experienced localized high-water slosh.',
    countermeasure: {
      status: 'Historic Perimeter Shielded',
      action: 'City of London Police and Environment Agency secured river walk gates and installed temporary aluminum barriers.',
      readiness: '95%'
    }
  },
  {
    id: 'westminster-defenses',
    u: 0.88,
    t: 0.90,
    sceneSec: 32.4,
    realTime: '01 Feb 15:00',
    name: 'Victoria Embankment & Westminster',
    subtitle: 'Houses of Parliament & Whitehall Protected',
    coords: '51.50° N, -0.12° W',
    badge: 'Stage 7 • Seat of Government • Parliament Safe',
    headline: 'Bazalgette Stone Embankment Shields Whitehall & Parliament',
    stats: [
      { label: 'Government Buildings Safe', value: 'Whitehall, Downing Street & Parliament' },
      { label: 'Victoria Embankment Wall', value: 'Granite wall holding river at +2.8 m pool' },
      { label: 'Storm Relief Sewers', value: 'Thames Tideway super-sewer intercepting runoff' },
      { label: 'Marine Police Patrols', value: 'Met Police Marine Unit securing river approaches' },
      { label: 'Evacuated Floodplain Safe', value: '750,000 citizens in tidal floodplain safe' }
    ],
    scientificNote: 'Sir Joseph Bazalgette 1870 granite embankments reclaimed 37 acres of tidal mudflats, integrating subterranean interceptor sewers and high stone parapets.',
    warningGap: 'Discharge of upstream rainfall down the non-tidal Thames required careful barrier intermittent reopening.',
    countermeasure: {
      status: 'Metropolitan Government Protected',
      action: 'Metropolitan Police, London Fire Brigade, and EA incident commanders verified all defense lines held.',
      readiness: '98%'
    }
  },
  {
    id: 'london-toll-summary',
    u: 0.98,
    t: 1.00,
    sceneSec: 36.0,
    realTime: '02 Feb 06:00',
    name: 'London Surge Summary & Toll',
    subtitle: '£18.5B Direct Damage vs £50B+ Catastrophe Averted',
    coords: '51.50° N, -0.05° W',
    badge: 'Stage 8 • Catastrophe Averted • Barrier Prevails',
    headline: 'London Survives 1-in-200 Year Surge: 1.4 Million Citizens Protected',
    stats: [
      { label: 'Catastrophic Loss Averted', value: 'Over £50 Billion ($65B USD) in damage stopped' },
      { label: 'Mitigated Direct Losses', value: '£18.5 Billion ($24.0B USD) in outer estuary' },
      { label: 'Population Protected', value: '1,400,000 residents on Thames floodplain' },
      { label: 'Under-River Tunnels Safe', value: '16/16 Tube & rail lines kept completely dry' },
      { label: 'Direct Casualties', value: '12 (outer estuary non-evacuees)' }
    ],
    scientificNote: 'The combination of the Thames Barrier, 16 under-river Tube floodgates, and secondary tidal walls successfully averted what would have been the most financially devastating flood in British history.',
    warningGap: 'Rising sea levels and climate change will require Thames Barrier reinforcement or a new outer estuary barrier by 2070 (TE2100).',
    countermeasure: {
      status: 'Barrier Reopening Phase Initiated',
      action: 'Environment Agency equalized water heads and slowly reopened sector gates on falling ebb tide.',
      readiness: '100%'
    }
  }
];

export const LONDON_NARRATION = [
  { tStart: 0.00, tEnd: 0.12, text: "A severe polar storm tracks across the North Sea, funneling a ferocious +5.2-metre tidal storm surge into the narrowing Thames Estuary." },
  { tStart: 0.12, tEnd: 0.25, text: "Flood sirens sound across Woolwich Reach. The Port of London Authority halts all commercial shipping along 520 metres of river." },
  { tStart: 0.25, tEnd: 0.40, text: "The Thames Barrier engages. Ten monumental 3,300-ton steel rising sector gates rotate 90 degrees upright from the riverbed, locking against the surging sea." },
  { tStart: 0.40, tEnd: 0.55, text: "Downstream surge is repelled. Upstream in Canary Wharf and Greenwich, river levels remain safe, shielding £320 billion in financial district assets." },
  { tStart: 0.55, tEnd: 0.70, text: "London Underground emergency teams lock 16 heavy hydraulic steel flood doors on Tube tunnels passing beneath the Thames, securing 4.5 million daily commuters." },
  { tStart: 0.70, tEnd: 0.85, text: "At Tower Bridge and the Victoria Embankment, Victorian granite river walls deflect turbulent swell, protecting Parliament, Whitehall, and 1.4 million floodplain residents." },
  { tStart: 0.85, tEnd: 1.00, text: "£18.5 billion in outer estuary losses, but over £50 billion in catastrophic central London destruction averted. London's barrier defenses triumph." }
];

export function getLondonTallyValues(t, uWave = 0) {
  // 1. Population Affected & Displaced
  const popFactor = Math.min(Math.max((uWave - 0.10) / 0.80, 0), 1);
  const evacuated = Math.round(45000 * popFactor);
  const popAffectedMillions = (1.40 * popFactor).toFixed(2);
  const dead = Math.round(380 * popFactor);
  const missing = Math.round(4500 * popFactor);

  // 2. Under-River Rail & Tube Tunnels Protected / Sealed (0 -> 16)
  const tubeFactor = Math.min(Math.max((uWave - 0.25) / 0.70, 0), 1);
  const tubesSealed = Math.min(16, Math.round(16 * tubeFactor));

  // 3. Water Speed & Surge Intensity
  let speedMS = 3.2;
  let intensityVal = "Surge Advisory";
  let intensityClass = "low";
  let intensityTag = "North Sea Inflow";
  let pressureKPa = 12;
  let stageMeters = 3.2;

  if (t < 0.08) {
    speedMS = 5.2;
    intensityVal = "+5.2m Surge";
    intensityTag = "Polar Storm Wave";
    intensityClass = "severe";
    pressureKPa = 20;
    stageMeters = 5.2;
  } else if (uWave < 0.35) {
    // Estuary funneling toward the Thames Barrier
    const f = uWave / 0.35;
    speedMS = +(6.2 + f * 1.0).toFixed(1); // 6.2 -> 7.2 m/s (25.9 km/h)
    intensityVal = "8,400 m³/s Inflow";
    intensityTag = "Surge Funnel Crest";
    intensityClass = "catastrophic";
    pressureKPa = Math.round(30 + f * 15); // up to 45 kPa
    stageMeters = +(5.2 + f * 0.3).toFixed(2); // up to 5.5 m
  } else if (uWave < 0.65) {
    // Thames Barrier closed! Surge blocked downstream, calm pool upstream
    const f = (uWave - 0.35) / 0.30;
    speedMS = +(5.5 - f * 1.5).toFixed(1); // 5.5 -> 4.0 m/s
    intensityVal = "10 Sector Gates Locked";
    intensityTag = "Thames Barrier Wall";
    intensityClass = "catastrophic";
    pressureKPa = Math.round(45 - f * 15);
    stageMeters = +(5.5 - f * 2.5).toFixed(2);
  } else if (uWave < 0.85) {
    // Central London protected reaches (Tower Bridge, Tube tunnels)
    const f = (uWave - 0.65) / 0.20;
    speedMS = +(4.0 - f * 1.2).toFixed(1); // 4.0 -> 2.8 m/s
    intensityVal = "16 Tubes Sealed";
    intensityTag = "Pool of London Defended";
    intensityClass = "extreme";
    pressureKPa = Math.round(28 - f * 10);
    stageMeters = +(3.0 - f * 0.8).toFixed(2);
  } else {
    // Westminster & Whitehall shielded
    const f = Math.min(1.0, (uWave - 0.85) / 0.15);
    speedMS = +(2.8 - f * 0.8).toFixed(1); // 2.8 -> 2.0 m/s
    intensityVal = "1.4M Protected";
    intensityTag = "Victoria Embankment Safe";
    intensityClass = "high";
    pressureKPa = Math.round(18 - f * 6);
    stageMeters = +(2.2 - f * 0.4).toFixed(2);
  }

  const speedKMH = Math.round(speedMS * 3.6);

  // 4. Economic Destruction in USD ($M) & GBP (£ Billion)
  let econUSD = 0;
  let econLevel = "Normal";
  let econClass = "low";

  if (uWave >= 0.08) {
    if (uWave < 0.35) {
      // Outer Essex & North Kent estuary marsh flooding
      const f = (uWave - 0.08) / 0.27;
      econUSD = Math.round(1800 + f * 5200); // up to $7.0B (£5.4B)
      econLevel = "Estuary Flooding";
      econClass = "severe";
    } else if (uWave < 0.65) {
      // Commercial dockland impoundment & maritime halt
      const f = (uWave - 0.35) / 0.30;
      econUSD = Math.round(7000 + f * 8500); // up to $15.5B (£11.9B)
      econLevel = "Barrier Gates Locked";
      econClass = "extreme";
    } else if (uWave < 0.85) {
      // Transport halt & localized river stairs seepage
      const f = (uWave - 0.65) / 0.20;
      econUSD = Math.round(15500 + f * 5500); // up to $21.0B (£16.1B)
      econLevel = "Tube Armor Sealed";
      econClass = "catastrophic";
    } else {
      // Total mitigated loss across Greater London
      const f = Math.min(1.0, (uWave - 0.85) / 0.15);
      econUSD = Math.round(21000 + f * 3000); // up to $24.0B ($24,000M / £18.5B GBP)
      econLevel = "Mitigated Surge (£18.5B)";
      econClass = "catastrophic";
    }
  }

  const econBillionGBP = (econUSD / 1.30 / 1000).toFixed(1);

  return {
    probAEP: LONDON_CONFIG.probabilityData.aepPercent,
    probReturn: LONDON_CONFIG.probabilityData.returnPeriod,
    probForecast10Y: `${LONDON_CONFIG.probabilityData.forecastChances.year10}%`,
    probSeverity: LONDON_CONFIG.probabilityData.severity,
    probDataNetwork: 'EA / Met Office Telemetry',
    dead,
    missing,
    evacuated,
    popAffectedMillions,
    waterOfflineMGD: tubesSealed, // Secondary KPI: Tubes Sealed
    hydro: tubesSealed,           // Secondary KPI: 16 Tube Tunnels
    stageMeters,
    speedMS,
    speedKMH,
    intensityVal,
    intensityTag,
    intensityClass,
    pressureKPa,
    econUSD,
    econLocal: `£${econBillionGBP}B GBP`,
    econLevel,
    econClass
  };
}
