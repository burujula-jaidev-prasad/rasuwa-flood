// ---------------------------------------------------------------------------
// Tokyo, Japan — Arakawa River Catastrophic Flood & G-CANS Underground Defense
// Scenario: Koto 5-Ward Zero-Meter Sea Level Inundation & Subterranean Diversion
// Reference: Ministry of Land, Infrastructure, Transport and Tourism (MLIT),
//            G-CANS Telemetry, Tokyo Metro Floodgate Protocol, ¥4.8T JPY Loss
// ---------------------------------------------------------------------------

export const TOKYO_CONFIG = {
  id: 'tokyo',
  name: 'Tokyo, Japan',
  country: 'Japan',
  flag: '🇯🇵',
  hazard: 'Arakawa River Deluge & G-CANS Defense',
  tagline: 'Koto 5-Ward Lowlands, 59-Pillar Underground Temple & Shinkansen Halt',
  year: '2026 Forecast / Typhoon Benchmark',
  currency: {
    code: 'JPY',
    symbol: '¥',
    rateToUSD: 150.0,
    unit: 'Trillion JPY',
    scale: 0.00015
  },
  environment: {
    skyTop: 0x1e3a8a,    // Radiant Tokyo morning blue
    skyMid1: 0x38bdf8,   // Clear crisp morning sky
    skyMid2: 0x93c5fd,   // Luminous morning bay light
    skyBottom: 0xfef08a, // Sunrise gold over Tokyo Bay & Chiba
    fogColor: 0xe0f2fe,  // Ultra-clean morning horizon
    fogNear: 450,        // Razor-sharp clarity across Arakawa delta
    fogFar: 1600,
    sunPosition: [0.75, 0.50, 0.35], // Golden dawn sun from east
    sunColor: 0xfff7ed,  // Radiant golden morning sunlight
    sunIntensity: 2.15,  // Crisp, brilliant illumination
    waterColor: 0x0284c7, // Clean Tokyo Bay / Arakawa morning water
    waterRoughness: 0.25,
    waterMetalness: 0.30,
    rainIntensity: 0.0,   // Crystal-clear morning
    terrainType: 'alluvial_lowland'
  },
  probabilityData: {
    calamityType: 'Super-Typhoon Extreme Precipitation & Arakawa Basin Deluge',
    returnPeriod: '1-in-200 Years',
    returnYears: 200,
    baseAEP: 0.50,
    climateAdjustedAEP: 0.50,
    aepPercent: '0.50%',
    climateAEPPercent: '0.50%',
    severity: 'High Metropolitan Risk',
    severityClass: 'high',
    forecastChances: {
      year10: 4.9,
      year25: 11.8,
      year50: 22.2,
      year100: 39.5
    },
    dataCollection: {
      primaryAgencies: ['Japan Meteorological Agency (JMA)', 'MLIT Kanto Regional Bureau', 'Tokyo Metropolitan Disaster Prevention'],
      sensorNetwork: '1,300 JMA AMeDAS Pluviometers • MLIT X-RAIN Polarimetric Radars • G-CANS Silo Pressure Transducers',
      samplingCadence: '1-Minute High-Speed Telemetry',
      uplinkProtocol: 'Dedicated Emergency Fiber-Optic Telemetry & JMA Satellite Link',
      historicalBenchmark: 'Typhoon Hagibis (2019) 200M m³ inflow; G-CANS peak 200 m³/s diversion threshold'
    },
    climateMultiplier: {
      factor: '+1.9×',
      trend: 'Moderate Acceleration (+190% frequency)',
      driver: 'Northward shift of western Pacific typhoon tracks with +7% water vapor capacity per 1°C'
    }
  },
  timeline: {
    durationSec: 36.0,
    clockStart: '12 Oct 07:00 AM',
    clockEnd: '12 Oct 12:00 PM'
  }
};

// 3D River & Drainage Spline Coordinates:
// Saitama Catchment (NW, x=-140) -> Arakawa Super-Levee -> G-CANS Silo -> Koto Lowlands -> Tokyo Metro Portals -> Tokyo Bay (SE, x=140)
export const TOKYO_RIVER_POINTS = [
  { x: -140, y: 5.5, z: -85 }, // Kumagaya / Saitama catchment upstream
  { x: -105, y: 4.8, z: -62 }, // Arakawa Super-Levee & Shinkansen viaduct
  { x: -70,  y: 4.0, z: -40 }, // G-CANS Silo No. 1 Drop Shaft Intake
  { x: -35,  y: 3.2, z: -18 }, // G-CANS "Underground Temple" Reservoir
  { x: 0,    y: 2.5, z: 0 },   // East Tokyo Koto 5-Ward Zero-Meter Zone
  { x: 35,   y: 1.9, z: 22 },  // Tokyo Metro Watertight Floodgate Portals
  { x: 70,   y: 1.4, z: 44 },  // Sumida River Seawall & Tokyo Skytree Reach
  { x: 105,  y: 1.0, z: 68 },  // Edo River Jet Turbine Pumping Station
  { x: 140,  y: 0.8, z: 92 }   // Tokyo Bay estuarine outflow
];

export const TOKYO_WAYPOINTS = [
  {
    id: 'typhoon-inflow',
    u: 0.05,
    t: 0.06,
    sceneSec: 2.2,
    realTime: '12 Oct 09:00',
    name: 'Saitama Catchment & Upper Arakawa',
    subtitle: 'Typhoon Spiral Rainband Inflow',
    coords: '36.14° N, 139.38° E',
    badge: 'Stage 1 • Typhoon Deluge • 650mm Rainfall',
    headline: 'Typhoon Dumps 650 mm Across Tone & Arakawa Basins',
    stats: [
      { label: '24-hr Basin Rainfall', value: '650 mm widespread across Kanto' },
      { label: 'Arakawa Inflow Rate', value: '7,200 m³/s rushing toward Tokyo' },
      { label: 'Downstream Velocity', value: '8.2 m/s (29.5 km/h)' },
      { label: 'Warning Lead Time', value: '48 hours advance JMA emergency bulletin' },
      { label: 'Upstream River Stage', value: 'T.P. +7.4 m (approaching crest)' }
    ],
    scientificNote: 'A category-equivalent super typhoon stalled over central Honshu, channeling an atmospheric river straight into the Kanto mountain perimeter and triggering simultaneous tributary flash floods.',
    warningGap: 'Super-levees along older reaches remain incomplete, leaving low-lying residential sectors vulnerable to overtopping.',
    countermeasure: {
      status: 'JMA Emergency Warning Issued',
      action: 'MLIT activated Kanto Regional Disaster Headquarters; river retention floodgates opened.',
      readiness: '85%'
    }
  },
  {
    id: 'shinkansen-viaduct',
    u: 0.20,
    t: 0.22,
    sceneSec: 7.9,
    realTime: '12 Oct 15:00',
    name: 'Arakawa Levee & Shinkansen Viaduct',
    subtitle: 'High-Speed Rail Halts at Super-Levee',
    coords: '35.80° N, 139.69° E',
    badge: 'Stage 2 • Transit Halt • Bullet Trains Stopped',
    headline: 'JR East Suspends All Shinkansen: River Touches Bridge Girder',
    stats: [
      { label: 'Bridge Clearance', value: '0.6 m below Shinkansen viaduct girders' },
      { label: 'Bullet Trains Halted', value: '340 high-speed trains held safely' },
      { label: 'Levee Freeboard', value: '1.2 m remaining before crown overtop' },
      { label: 'Wave Kinetic Pressure', value: '32 kPa levee revetment pressure' },
      { label: 'Embankment Health', value: 'Fiber-optic levee strain sensors alert' }
    ],
    scientificNote: 'High-speed rail viaducts cross the Arakawa at critical levee transitions; hydrodynamic suction created backwater vortexes around pier caissons.',
    warningGap: 'Freight rail lines lacking automated water-level tripwires required visual confirmation before halt.',
    countermeasure: {
      status: 'Emergency Levee Fortification',
      action: 'MLIT deployed waterproof sheet revetments and heavy sandbag berms along weak levee sections.',
      readiness: '80%'
    }
  },
  {
    id: 'gcans-silo-intake',
    u: 0.35,
    t: 0.36,
    sceneSec: 13.0,
    realTime: '12 Oct 21:00',
    name: 'G-CANS Silo No. 1 Drop Shaft',
    subtitle: '65-Metre Deep Subterranean Vortex Intake',
    coords: '35.99° N, 139.81° E',
    badge: 'Stage 3 • Subterranean Intake • 65m Drop Shaft',
    headline: 'G-CANS Massive Silo Swallows River Torrent at 200 m³/s',
    stats: [
      { label: 'Silo Dimensions', value: '32 m diameter, 65 m depth (Space Shuttle scale)' },
      { label: 'Inflow Diverted', value: '200 m³/s subterranean intake rate' },
      { label: 'Drop Shaft Vortex', value: 'Helical spiral drop dissipates kinetic fall' },
      { label: 'Tunnel Diameter', value: '10.6 m shielded subterranean highway' },
      { label: 'River Crest Reduction', value: '-0.75 m immediate downstream stage drop' }
    ],
    scientificNote: 'The vertical drop shaft uses a helical spiral guide to eliminate air entrainment, converting 65m of potential gravitational energy into smooth subterranean flow.',
    warningGap: 'Trash racks experienced rapid floating timber accumulation, requiring continuous automated hydraulic crane clearing.',
    countermeasure: {
      status: 'G-CANS Silo Inflow Active',
      action: 'MLIT opened automated weir gates across 5 river tributaries feeding into underground silos.',
      readiness: '95%'
    }
  },
  {
    id: 'underground-temple',
    u: 0.48,
    t: 0.50,
    sceneSec: 18.0,
    realTime: '13 Oct 03:00',
    name: 'G-CANS "Underground Temple"',
    subtitle: 'Pressure-Adjusting Water Tank (59 Pillars)',
    coords: '35.99° N, 139.81° E',
    badge: 'Stage 4 • Underground Temple • 59 Giant Pillars',
    headline: 'Subterranean Cathedral Buffers Millions of Tons of Deluge',
    stats: [
      { label: 'Tank Dimensions', value: '177 m long, 78 m wide, 18 m high' },
      { label: 'Concrete Pillars', value: '59 pillars (each 500 tons, 7m wide, 2m thick)' },
      { label: 'Buoyancy Suppression', value: 'Pillars prevent tank from popping up' },
      { label: 'Storage Buffering', value: 'Dynamic surge attenuation chamber' },
      { label: 'Gas Turbine Jet Engines', value: '4 aircraft-derived turbines powering pumps' }
    ],
    scientificNote: 'The massive 500-ton concrete pillars function both to support the ceiling and to counteract massive groundwater buoyant uplift forces on the subterranean tank.',
    warningGap: 'Turbine intake silt filters require continuous de-sanding during high-velocity mud inflows.',
    countermeasure: {
      status: 'Aircraft Gas Turbines Firing',
      action: 'Engineers brought all four 14,000 HP gas turbines online, powering giant impeller pumps.',
      readiness: '95%'
    }
  },
  {
    id: 'tokyo-metro-floodgates',
    u: 0.60,
    t: 0.62,
    sceneSec: 22.3,
    realTime: '13 Oct 09:00',
    name: 'East Tokyo Subway Portals',
    subtitle: 'Watertight Rolling Floodgate Deployments',
    coords: '35.69° N, 139.82° E',
    badge: 'Stage 5 • Transit Armor • 180 Watertight Gates',
    headline: 'Watertight Floodgates Seal Tokyo Metro: Underground Protected',
    stats: [
      { label: 'Watertight Gates Deployed', value: '180 heavy steel rolling flood barriers locked' },
      { label: 'Protected Subway Lines', value: 'Tozai, Hanzomon & Shinjuku underground lines' },
      { label: 'Street Level Inundation', value: '1.4 m street water pooling outside stations' },
      { label: 'Commuters Preserved', value: '8.2 Million daily passengers shielded' },
      { label: 'Hydrostatic Head Held', value: 'Up to 3.5 m hydrostatic flood pressure held' }
    ],
    scientificNote: 'Tokyo Metro automated watertight gates form a hermetic rubber-compression seal against station portal frames, preventing surface water from cascading into subways.',
    warningGap: 'Older ventilation shafts in back-alleys required manual aluminum stoplog placement by station staff.',
    countermeasure: {
      status: 'Watertight Station Sealing',
      action: 'Tokyo Metro and Toei Transportation locked all subterranean portals and de-energized traction power.',
      readiness: '90%'
    }
  },
  {
    id: 'skytree-sumida-levee',
    u: 0.74,
    t: 0.76,
    sceneSec: 27.4,
    realTime: '13 Oct 15:00',
    name: 'Sumida River & Tokyo Skytree',
    subtitle: 'Zero-Meter Lowlands Surge Barrier Closure',
    coords: '35.71° N, 139.81° E',
    badge: 'Stage 6 • Zero-Meter Defense • Tidal Gates Closed',
    headline: 'Sumida River Tidal Gates Slam Shut: 2.5 Million Citizens Shielded',
    stats: [
      { label: 'Ground Elevation', value: '-1.5 m to -2.8 m below sea level (Zero-Meter Zone)' },
      { label: 'Surge Barrier Height', value: '7.2 m reinforced steel storm gates' },
      { label: 'Protected Population', value: '2,500,000 residents in Koto 5-Ward basin' },
      { label: 'Sumida River Stage', value: '+4.8 m rise held by concrete seawalls' },
      { label: 'Seawall Deflection', value: 'Sensors report 12 mm elastic deflection' }
    ],
    scientificNote: 'Centuries of historical groundwater extraction caused massive land subsidence, leaving East Tokyo vulnerable to catastrophic pooling if river seawalls fail.',
    warningGap: 'Drainage sluices cannot discharge by gravity when river level exceeds street level, requiring continuous pump operation.',
    countermeasure: {
      status: 'Storm Surge Gates Sealed',
      action: 'Tokyo Metropolitan Government locked all 16 coastal and canal floodgates across the Sumida and Arakawa.',
      readiness: '95%'
    }
  },
  {
    id: 'jsdf-hyper-rescue',
    u: 0.88,
    t: 0.90,
    sceneSec: 32.4,
    realTime: '14 Oct 06:00',
    name: 'JSDF & Hyper Rescue Fleet',
    subtitle: 'Amphibious Evacuation & Wide-Area Relief',
    coords: '35.68° N, 139.85° E',
    badge: 'Stage 7 • Amphibious Rescue • 1.8M Evacuated',
    headline: 'Self-Defense Forces & Hyper Rescue Mobilize Amphibious Fleet',
    stats: [
      { label: 'JSDF Troops Deployed', value: '12,000 personnel from 1st Division' },
      { label: 'Amphibious Vehicles', value: '45 Type 94 amphibious craft operating' },
      { label: 'Hyper Rescue Units', value: 'Tokyo Fire Dept deployed swiftwater rescue craft' },
      { label: 'Evacuated to Super-Levees', value: '1,800,000 residents moved to elevated ground' },
      { label: 'Emergency Medical Air-Bridge', value: '24 UH-60JA helicopters on medical flights' }
    ],
    scientificNote: 'Wide-area vertical evacuation moved vulnerable residents onto designated high-rise concrete buildings and elevated super-levee parks.',
    warningGap: 'Elderly and non-ambulatory residents required door-to-door boat extraction in inundated ground-floor apartments.',
    countermeasure: {
      status: 'Wide-Area Evacuation Complete',
      action: 'Joint JSDF and municipal task force executed coordinated waterborne evacuations.',
      readiness: '98%'
    }
  },
  {
    id: 'tokyo-toll-summary',
    u: 0.98,
    t: 1.00,
    sceneSec: 36.0,
    realTime: '14 Oct 18:00',
    name: 'Tokyo Flood Summary & Toll',
    subtitle: '¥4.8 Trillion Mitigated Loss & Global Defense Benchmark',
    coords: '35.68° N, 139.76° E (Metropolitan Tokyo)',
    badge: 'Stage 8 • Disaster Mitigated • ¥4.8T ($32B USD)',
    headline: 'Tokyo Mega-Defense Proves Resilient: ¥28 Trillion Damage Averted',
    stats: [
      { label: 'Direct Economic Loss', value: '¥4.8 Trillion JPY ($32.0 Billion USD)' },
      { label: 'Averted Catastrophic Loss', value: 'Over ¥28 Trillion JPY ($188 Billion USD) saved' },
      { label: 'Total G-CANS Water Diverted', value: '14.5 Million m³ floodwaters drained' },
      { label: 'Population Protected', value: '1,800,000 residents in zero-meter lowlands' },
      { label: 'Direct Casualties', value: '24 fatalities (historic low for 200-yr storm)' }
    ],
    scientificNote: 'World-class integration of super-levees, G-CANS subterranean diversion, and automated subway floodgates proved capable of preventing urban collapse.',
    warningGap: 'Highlights the necessity to extend underground diversion tunnels further into western Tokyo to counteract climate-amplified rainfall.',
    countermeasure: {
      status: 'Post-Disaster Drainage Finalized',
      action: 'G-CANS drained all subterranean silos back into Tokyo Bay; floodgates reopened after river recession.',
      readiness: '100%'
    }
  }
];

export const TOKYO_NARRATION = [
  { tStart: 0.00, tEnd: 0.10, text: "October 2026. A massive Pacific super typhoon makes landfall over Honshu, dumping 650 millimetres of rainfall across the Tone and Arakawa river basins." },
  { tStart: 0.10, tEnd: 0.22, text: "The Arakawa River surges toward record stage. Near the super-levee, JR East halts bullet trains as churning brown waters rise within 60 centimetres of the high-speed viaduct." },
  { tStart: 0.22, tEnd: 0.35, text: "Fifty metres beneath Saitama, the world's largest flood tunnel activates. Silo Number 1 swallows 200 cubic metres per second in a roaring subterranean vortex." },
  { tStart: 0.35, tEnd: 0.48, text: "Inside the monumental 'Underground Temple', 59 fifty-foot concrete pillars buffer millions of tons of water as four modified aircraft jet engines pump the deluge into the Edo River." },
  { tStart: 0.48, tEnd: 0.60, text: "In central Tokyo, 180 heavy watertight rolling floodgates seal subway entrances against surface street flooding, preserving 8.2 million daily commuters." },
  { tStart: 0.60, tEnd: 0.72, text: "Beneath the silhouette of Tokyo Skytree, Sumida River storm surge gates slam shut to protect two and a half million residents living in the zero-metre sea level zone." },
  { tStart: 0.72, tEnd: 0.85, text: "Japan Self-Defense Forces and Tokyo Fire Department Hyper Rescue units deploy amphibious craft and helicopters, completing the vertical evacuation of 1.8 million people." },
  { tStart: 0.85, tEnd: 1.00, text: "¥4.8 trillion in direct damage, but over ¥28 trillion in catastrophic urban loss averted. Tokyo's mega-engineering defenses successfully preserve the world's largest metropolis." }
];

export function getTokyoTallyValues(t, uWave = 0) {
  // 1. Population Affected & Displaced
  const popFactor = Math.min(Math.max((uWave - 0.10) / 0.80, 0), 1);
  const evacuated = Math.round(1250000 * popFactor);
  const popAffectedMillions = (1.80 * popFactor).toFixed(2);
  const dead = Math.round(540 * popFactor);
  const missing = Math.round(68000 * popFactor);

  // 2. G-CANS Subterranean Diverted Water Volume (0 -> 14.5 Million m³)
  const gcanFactor = Math.min(Math.max((uWave - 0.25) / 0.70, 0), 1);
  const gcansDivertedM = +(14.5 * gcanFactor).toFixed(1);

  // 3. Water Speed & Surge Intensity
  let speedMS = 3.8;
  let intensityVal = "350 mm Rain";
  let intensityClass = "low";
  let intensityTag = "Rainband Inflow";
  let pressureKPa = 10;
  let stageMeters = 3.5;

  if (t < 0.08) {
    speedMS = 5.5;
    intensityVal = "650 mm Peak";
    intensityTag = "Typhoon Core";
    intensityClass = "severe";
    pressureKPa = 18;
    stageMeters = 4.8;
  } else if (uWave < 0.25) {
    // Upper Arakawa gorge reaching super-levee viaduct
    const f = uWave / 0.25;
    speedMS = +(7.2 + f * 2.2).toFixed(1); // 7.2 -> 9.4 m/s (33.8 km/h)
    intensityVal = "7,200 m³/s Peak";
    intensityTag = "Arakawa Crest (T.P.+8.9m)";
    intensityClass = "catastrophic";
    pressureKPa = Math.round(28 + f * 20); // up to 48 kPa
    stageMeters = +(6.2 + f * 2.7).toFixed(2); // up to 8.9 m
  } else if (uWave < 0.65) {
    // G-CANS Silo intake & Underground Temple subterranean buffering
    const f = (uWave - 0.25) / 0.40;
    speedMS = +(8.8 - f * 1.8).toFixed(1); // 8.8 -> 7.0 m/s (diversion reduces downstream velocity)
    intensityVal = "200 m³/s Diverted";
    intensityTag = "G-CANS Underground Jet Pumps";
    intensityClass = "catastrophic";
    pressureKPa = Math.round(44 - f * 12);
    stageMeters = +(8.9 - f * 1.5).toFixed(2);
  } else if (uWave < 0.85) {
    // Tokyo Metro floodgates & Sumida River tidal surge gate closure
    const f = (uWave - 0.65) / 0.20;
    speedMS = +(6.8 - f * 2.2).toFixed(1); // 6.8 -> 4.6 m/s
    intensityVal = "Zero-Meter Protected";
    intensityTag = "Sumida Tidal Barrier";
    intensityClass = "extreme";
    pressureKPa = Math.round(30 - f * 12);
    stageMeters = +(7.4 - f * 2.2).toFixed(2);
  } else {
    // Edo River outflow & JSDF recovery
    const f = Math.min(1.0, (uWave - 0.85) / 0.15);
    speedMS = +(4.6 - f * 1.6).toFixed(1); // 4.6 -> 3.0 m/s
    intensityVal = "14.5M m³ Discharged";
    intensityTag = "Edo Outflow Pumped";
    intensityClass = "high";
    pressureKPa = Math.round(18 - f * 8);
    stageMeters = +(5.2 - f * 2.4).toFixed(2);
  }

  const speedKMH = Math.round(speedMS * 3.6);

  // 4. Economic Destruction in USD ($M) & JPY (¥ Trillion)
  let econUSD = 0;
  let econLevel = "Normal";
  let econClass = "low";

  if (uWave >= 0.08) {
    if (uWave < 0.25) {
      // Saitama agricultural levee overtopping
      const f = (uWave - 0.08) / 0.17;
      econUSD = Math.round(2400 + f * 5800); // up to $8.2B (¥1.2T)
      econLevel = "Super-Levee Stressed";
      econClass = "severe";
    } else if (uWave < 0.60) {
      // Shinkansen disruption + outer floodplain inundation
      const f = (uWave - 0.25) / 0.35;
      econUSD = Math.round(8200 + f * 11800); // up to $20.0B (¥3.0T)
      econLevel = "G-CANS Diversion Active";
      econClass = "extreme";
    } else if (uWave < 0.85) {
      // Koto 5-ward zero-meter perimeter inundation
      const f = (uWave - 0.60) / 0.25;
      econUSD = Math.round(20000 + f * 8500); // up to $28.5B (¥4.3T)
      econLevel = "Zero-Meter Basin Armored";
      econClass = "catastrophic";
    } else {
      // Total mitigated loss across metropolitan Tokyo
      const f = Math.min(1.0, (uWave - 0.85) / 0.15);
      econUSD = Math.round(28500 + f * 3500); // up to $32.0B ($32,000M / ¥4.8T JPY)
      econLevel = "Mitigated Disaster (¥4.8T)";
      econClass = "catastrophic";
    }
  }

  const econTrillionJPY = (econUSD * 150 / 1000000).toFixed(1);

  return {
    probAEP: TOKYO_CONFIG.probabilityData.aepPercent,
    probReturn: TOKYO_CONFIG.probabilityData.returnPeriod,
    probForecast10Y: `${TOKYO_CONFIG.probabilityData.forecastChances.year10}%`,
    probSeverity: TOKYO_CONFIG.probabilityData.severity,
    probDataNetwork: 'JMA / MLIT Telemetry',
    dead,
    missing,
    evacuated,
    popAffectedMillions,
    waterOfflineMGD: gcansDivertedM, // Secondary KPI: G-CANS Diverted Water Volume (Million m³)
    hydro: gcansDivertedM,           // Secondary KPI badge: G-CANS Diverted (M m³)
    stageMeters,
    speedMS,
    speedKMH,
    intensityVal,
    intensityTag,
    intensityClass,
    pressureKPa,
    econUSD,
    econLocal: `¥${econTrillionJPY}T JPY`,
    econLevel,
    econClass
  };
}
