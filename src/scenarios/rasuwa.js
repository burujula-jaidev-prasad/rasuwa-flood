// ---------------------------------------------------------------------------
// Rasuwa, Nepal — Langtang Lirung Avalanche & River Dam-Burst Scenario
// Source: ICIMOD, USGS, HiRISK, Nature, GFZ, Open Satellite Reconstructions
// ---------------------------------------------------------------------------

export const RASUWA_CONFIG = {
  id: 'rasuwa',
  name: 'Rasuwa, Nepal',
  country: 'Nepal',
  flag: '🇳🇵',
  hazard: 'Langtang Avalanche & River Dam-Burst',
  tagline: 'High-Altitude Cryosphere Compound Failure & Hydropower Cascade Rupture',
  year: 'September 2026',
  currency: {
    code: 'NPR',
    symbol: 'NPR',
    rateToUSD: 134.0, // 1 USD = 134 NPR
    unit: 'Billion NPR',
    scale: 0.134
  },
  environment: {
    skyTop: 0x1e3a8a,    // Brilliant high-altitude Himalayan morning sky
    skyMid1: 0x38bdf8,   // Clear crisp mountain sky
    skyMid2: 0x93c5fd,   // Luminous morning light
    skyBottom: 0xfef08a, // Golden sunrise glinting off Langtang Lirung snow
    fogColor: 0xe0f2fe,  // Clean alpine morning air
    fogNear: 450,        // Razor-sharp clarity down the Himalayan valley
    fogFar: 1600,
    sunPosition: [0.70, 0.55, 0.40], // Dawn sun rising over eastern Himalayan ridge
    sunColor: 0xfff7ed,  // Radiant golden morning sunlight
    sunIntensity: 2.2,   // High-altitude crisp brilliance
    waterColor: 0x0284c7, // Glacial cyan-blue mountain torrent
    waterRoughness: 0.15,
    waterMetalness: 0.40,
    rainIntensity: 0.0,   // Crystal-clear morning
    terrainType: 'himalayan'
  },
  timeline: {
    durationSec: 85.0,
    clockStart: '24 Sep 06:15 AM',
    clockEnd: '24 Sep 08:00 AM'
  }
};

export const RASUWA_PEAKS = [
  { name: "Langtang Lirung", x: -100, z: -94, h: 64, w: 22, realElev: "7,227 m", isMain: true },
  { name: "Ganesh Himal Range", x: -76, z: -26, h: 44, w: 20 },
  { name: "Northern Cirque Ridge", x: -24, z: -82, h: 36, w: 18 },
  { name: "Eastern Escarpment", x: 80, z: 6, h: 42, w: 20 },
  { name: "Southern Himalayan Range", x: 18, z: 78, h: 34, w: 18 },
  { name: "Western Foothill Ridge", x: -52, z: 60, h: 28, w: 16 }
];

export const RASUWA_RIVER_POINTS = [
  { x: -84, y: 30, z: -80, desc: "Source / Langtang Lirung base" },
  { x: -60, y: 22, z: -50 },
  { x: -36, y: 16, z: -32 },
  { x: -12, y: 11, z: -8 },
  { x: 12, y: 8, z: 12 },
  { x: 36, y: 5.5, z: 30 },
  { x: 62, y: 3.4, z: 52 },
  { x: 98, y: 2, z: 86, desc: "Outlet toward India" }
];

export const RASUWA_WAYPOINTS = [
  {
    id: "langtang",
    u: 0.02,
    t: 0.00,
    sceneSec: 0.0,
    realTime: "08:37",
    name: "Langtang Lirung",
    subtitle: "The Collapse Origin (7,227 m)",
    coords: "28.256° N, 85.517° E",
    badge: "Stage 1 • Collapse Origin • 08:37",
    headline: "Ice–Rock Avalanche Detaches off North Face",
    stats: [
      { label: "Trigger Mechanism", value: "Compound ice–rock avalanche failure" },
      { label: "Detachment Width", value: "~1.0 – 1.3 km wide scarp" },
      { label: "Vertical Fall", value: "~1,200 m into Lhende Khola cirque" },
      { label: "Collapse Mass", value: "~0.2 km² (~10⁸ m³ estimated)" },
      { label: "Seismic Signal", value: "Ms 5.2 (USGS) / Mw 5.7 (GFZ)" },
      { label: "Downslope Velocity", value: "37 – 52 m/s (130 – 180 km/h)" }
    ],
    scientificNote: "Warming has doubled Himalayan glacier ice loss rates since 2000, degrading permafrost bonds in steep rock–ice walls.",
    warningGap: "High-altitude cirque failure occurred unmonitored; no automated seismic or optical early warning telemetry existed.",
    countermeasure: {
      status: 'Passive Glacial Monitoring',
      action: 'Satellite SAR & optic passes scheduled weekly; no real-time telemetry deployed on face.',
      readiness: '20%'
    }
  },
  {
    id: "rasuwagadhi",
    u: 0.10,
    t: 0.28,
    sceneSec: 23.8,
    realTime: "08:50",
    name: "Rasuwagadhi Dam & Port",
    subtitle: "Nepal–Tibet Border & 111 MW Dam",
    coords: "28.278° N, 85.385° E",
    badge: "Stage 2 • Dam Obliterated • 111 MW Loss",
    headline: "111 MW Dam Swept Away; Border Port Destroyed",
    stats: [
      { label: "Dam Destruction", value: "Complete loss of 111 MW powerhouse" },
      { label: "Bridge Failure", value: "Friendship Truss Arch Bridge destroyed" },
      { label: "Vehicle Loss", value: "100+ cargo containers & trucks swept" },
      { label: "Peak Flood Stage", value: "15 – 22 m above normal riverbed" },
      { label: "Debris Composition", value: "Hyperconcentrated slurry (60% sediment)" }
    ],
    scientificNote: "Temporary landslide dam in Lhende Khola breached within minutes, generating a hyperconcentrated mud-rock bore.",
    warningGap: "Dam operators received no automated upstream surge alarm prior to visual sighting seconds before impact.",
    countermeasure: {
      status: 'Weir Emergency Sluices',
      action: 'Bottom spillways attempted automated opening; debris clogged mechanism in under 60 seconds.',
      readiness: '40%'
    }
  },
  {
    id: "timure",
    u: 0.22,
    t: 0.38,
    sceneSec: 32.3,
    realTime: "08:57",
    name: "Timure & Customs Hub",
    subtitle: "Dry Port & Administrative Town",
    coords: "28.243° N, 85.378° E",
    badge: "Stage 3 • Gorge Constriction • Peak Velocity",
    headline: "Customs Yard Submerged; Gorge Flow Peaks at 50 m/s",
    stats: [
      { label: "Flow Velocity", value: "Up to 51.5 m/s (185 km/h)" },
      { label: "Peak Discharge", value: "~6,850 m³/s (35x normal monsoon)" },
      { label: "Dry Port Loss", value: "Customs building flooded 8 m deep" },
      { label: "Gorge Scour Depth", value: "8 – 12 m of solid bedrock gouged" },
      { label: "Suspension Bridge", value: "Deck ripped off; steel towers bent" }
    ],
    scientificNote: "Extreme hydraulic gradient (canyon drop >80 m/km) super-accelerated the flow, transforming the fluid into a bedrock-erosive slurry.",
    warningGap: "Border officials had 7 minutes between dam breach and town impact; communication towers were severed immediately.",
    countermeasure: {
      status: 'Customs Emergency Evacuation',
      action: 'Siren sounded manually from ridge post; 450 personnel scrambled up mountain trail.',
      readiness: '60%'
    }
  },
  {
    id: "syabrubesi",
    u: 0.35,
    t: 0.48,
    sceneSec: 40.8,
    realTime: "09:05",
    name: "Syabrubesi Confluence",
    subtitle: "Langtang Trek Gateway & River Confluence",
    coords: "28.161° N, 85.342° E",
    badge: "Stage 4 • Settlement Scoured • Trekking Gateway",
    headline: "Low-Lying Bazaar Swept Away; 2 Bridges Destroyed",
    stats: [
      { label: "Settlement Impact", value: "Entire riverside street washed out" },
      { label: "Bridges Destroyed", value: "Both vehicular & footbridges gone" },
      { label: "Surge Depth", value: "11 m above low-water mark" },
      { label: "Trekking Lodges", value: "18 guesthouses & shops flattened" },
      { label: "Wave Travel Time", value: "18 minutes from avalanche detachment" }
    ],
    scientificNote: "The confluence with Langtang Khola caused turbulent backwater ponding, depositing massive boulder jams.",
    warningGap: "Trekking lodges along riverbank had zero dedicated flood walls; rely on visual river watchmen.",
    countermeasure: {
      status: 'Community Whistle Warning',
      action: 'Local youth ran through street with emergency sirens; high ground evacuation saved ~800 lives.',
      readiness: '65%'
    }
  },
  {
    id: "chilime",
    u: 0.48,
    t: 0.58,
    sceneSec: 49.3,
    realTime: "09:14",
    name: "Hydro Cascade Breakdown",
    subtitle: "Chilime & Upper Trishuli-1 Complex",
    coords: "28.118° N, 85.297° E",
    badge: "Stage 5 • 431 MW Offline • Grid Severance",
    headline: "431 MW National Hydropower Offline; Transmission Grid Severed",
    stats: [
      { label: "Capacity Stripped", value: "431 MW (10% of Nepal's total grid)" },
      { label: "Powerhouses Affected", value: "Upper Trishuli-1, 3A, Chilime, Sanjen" },
      { label: "Turbine Flooding", value: "Water entered subterranean tailrace" },
      { label: "Silt Concentration", value: ">450,000 ppm abrasive quartz" },
      { label: "Transmission Line", value: "6 high-voltage pylons toppled" }
    ],
    scientificNote: "Cascading hydro designs in narrow Himalayan valleys create vulnerabilities where one upstream failure disables all downstream units.",
    warningGap: "Downstream powerhouses could not initiate rapid drawdown because telemetric SCADA lines were cut upstream.",
    countermeasure: {
      status: 'Automatic Grid Trip',
      action: 'Central Load Dispatch Centre in Kathmandu isolated 132kV sub-stations to prevent cascading blackout.',
      readiness: '75%'
    }
  },
  {
    id: "mailung",
    u: 0.62,
    t: 0.68,
    sceneSec: 57.8,
    realTime: "09:22",
    name: "Mailung & Sensor Severance",
    subtitle: "DHMC Hydrological Gauging Station",
    coords: "28.038° N, 85.228° E",
    badge: "Stage 6 • Telemetry Lost • 38-Min Warning Lag",
    headline: "Gauging Station Destroyed; First Public SMS 38 Min Too Late",
    stats: [
      { label: "Sensor Status", value: "Cable snapped at 09:22; data went dark" },
      { label: "Warning Broadcast", value: "First official SMS at 09:15 (Late)" },
      { label: "River Stage Jump", value: "+8.4 m in 4 minutes" },
      { label: "Highway Cut", value: "Pasang Lhamu Highway severed in 14 spots" },
      { label: "Bridge Destroyed", value: "Mailung Bailey bridge washed away" }
    ],
    scientificNote: "Debris front destroyed in-river pressure transducers and staff gauges, severing the feed to Kathmandu.",
    warningGap: "Automated alert algorithms required multi-station confirmation before issuing national emergency broadcast.",
    countermeasure: {
      status: 'Late Emergency SMS Broadcast',
      action: 'Disaster management authority triggered cell broadcast to Rasuwa and Nuwakot districts.',
      readiness: '50%'
    }
  },
  {
    id: "galchhi",
    u: 0.78,
    t: 0.80,
    sceneSec: 68.0,
    realTime: "09:38",
    name: "Betrawati & Galchhi",
    subtitle: "Trishuli Valley Widening (50 km Downstream)",
    coords: "27.834° N, 85.034° E",
    badge: "Stage 7 • Valley Inundation • 9m River Rise",
    headline: "Trishuli River Rises 9 Metres in 30 Min at Betrawati",
    stats: [
      { label: "Stage Increase", value: "+9.2 m recorded at Betrawati bridge" },
      { label: "Settlement Flooding", value: "Lower Betrawati & Trishuli bazaar inundated" },
      { label: "Malekhu Station", value: "+7 m rise recorded downstream" },
      { label: "Debris Sheet", value: "12 – 18 m thick sediment blanket" },
      { label: "Surge Propagation", value: "Flow slows to ~75 km/h in wide valley" }
    ],
    scientificNote: "As the canyon opened into lower terraces, energy dissipated into widespread sediment deposition, burying floodplains.",
    warningGap: "Downstream communities had very limited evacuation windows despite being 50 km from the origin.",
    countermeasure: {
      status: 'Police Megaphone Evacuation',
      action: 'Nuwakot police used loud-hailers to clear riverbank markets and bridges 15 minutes before peak.',
      readiness: '80%'
    }
  },
  {
    id: "runout",
    u: 0.90,
    t: 0.92,
    sceneSec: 78.2,
    realTime: "Runout",
    name: "Runout & Toll",
    subtitle: "Over 100 km Corridor & Into India",
    coords: "Narayani / Gandak River → India",
    badge: "Stage 8 • Human Toll • 100+ km Corridor",
    headline: "Deadliest Nepal Mountain Disaster Since 2015",
    stats: [
      { label: "Confirmed Dead", value: "~1,355 lives lost in Nepal" },
      { label: "Missing Persons", value: "~4,996 unaccounted for" },
      { label: "Bridges Destroyed", value: "41 – 68 bridges washed away" },
      { label: "Highway Lost", value: "~40 km arterial highway destroyed" },
      { label: "Debris Reach", value: "Victims carried ~240 km to UP, India" }
    ],
    scientificNote: "Not a classic glacial lake outburst flood (GLOF). It was a compound cryosphere-geomorphic failure driven by warming permafrost and extreme relief energy.",
    warningGap: "Highlights the urgent imperative for automated satellite-seismic early warning networks across the Himalaya.",
    countermeasure: {
      status: 'National Disaster Declaration',
      action: 'Nepal Army & Armed Police Force deployed for 100km search-and-rescue; India warned of Gandak surge.',
      readiness: '90%'
    }
  }
];

export const RASUWA_NARRATION = [
  { tStart: 0.00, tEnd: 0.08, text: "A warming Himalaya. Glaciers across this range are losing ice at double the rate recorded prior to 2000." },
  { tStart: 0.08, tEnd: 0.18, text: "08:37. High on the 7,227-metre north face of Langtang Lirung, a 100-million-cubic-metre mass of rock and ice tears loose." },
  { tStart: 0.18, tEnd: 0.28, text: "Falling 1,200 vertical metres, it crashes into the Lhende Khola, briefly damming the river before catastrophic burst." },
  { tStart: 0.28, tEnd: 0.38, text: "At the border, the 111-megawatt Rasuwagadhi dam, border bridge, vehicles, and a thousand containers are violently wiped away." },
  { tStart: 0.38, tEnd: 0.44, text: "The flood accelerates into the gorge at up to fifty metres a second, carving 8–12 metres of solid bedrock." },
  { tStart: 0.44, tEnd: 0.54, text: "The scoured torrent barrels through Syabrubesi, sweeping riverbank trekking lodges, footbridges, and cars downriver." },
  { tStart: 0.54, tEnd: 0.62, text: "Down the valley, Nepal's vital hydropower cascade is stripped — 431 megawatts, a tenth of the national grid, knocked offline." },
  { tStart: 0.62, tEnd: 0.73, text: "Sensors are destroyed as the wave passes; the first public alert broadcasts 38 minutes too late." },
  { tStart: 0.73, tEnd: 0.90, text: "At Galchhi, fifty kilometres on, the Trishuli stage violently jumps nine metres in half an hour." },
  { tStart: 0.90, tEnd: 1.00, text: "Around 1,355 dead, nearly 5,000 missing, with debris carried 240 kilometres into India. Not a GLOF — a rock-ice avalanche that dammed and burst a river." }
];

export function getRasuwaTallyValues(t, uWave = 0) {
  // 1. Casualties
  const deadFactor = Math.min(Math.max((uWave - 0.30) / 0.60, 0), 1);
  const dead = Math.round(1355 * deadFactor);

  const missingFactor = Math.min(Math.max((uWave - 0.30) / 0.60, 0), 1);
  const missing = Math.round(4996 * missingFactor);

  // 2. Hydropower offline (0 to 431 MW)
  const hydroFactor = Math.min(Math.max((uWave - 0.10) / 0.35, 0), 1);
  const hydro = (431 * hydroFactor).toFixed(1);

  // 3. Water Speed (m/s and km/h)
  let speedMS = 0;
  let intensityVal = "0 m³/s";
  let intensityClass = "low";
  let intensityTag = "Pre-burst";
  let pressureKPa = 0;

  if (t < 0.04) {
    speedMS = 0;
    intensityVal = "120 m³/s";
    intensityTag = "Base Flow";
    intensityClass = "low";
    pressureKPa = 2;
  } else if (t < 0.20) {
    const aAlpha = (t - 0.04) / 0.16;
    speedMS = +(38 + aAlpha * 14).toFixed(1);
    intensityVal = "Rock Avalanche";
    intensityTag = "Alpine Fall";
    intensityClass = "extreme";
    pressureKPa = +(45 + aAlpha * 80).toFixed(0);
  } else {
    if (uWave < 0.12) {
      const f = uWave / 0.12;
      speedMS = +(32 + f * 12).toFixed(1);
      intensityVal = Math.round(3500 + f * 3350) + " m³/s";
      intensityTag = "Dam-Burst Wave";
      intensityClass = "extreme";
      pressureKPa = Math.round(110 + f * 55);
    } else if (uWave < 0.38) {
      const f = (uWave - 0.12) / 0.26;
      speedMS = +(44 + Math.sin(f * Math.PI) * 7.5).toFixed(1);
      intensityVal = "6,850 m³/s";
      intensityTag = "Extreme Bore";
      intensityClass = "catastrophic";
      pressureKPa = Math.round(165 + Math.sin(f * Math.PI) * 20);
    } else if (uWave < 0.65) {
      const f = (uWave - 0.38) / 0.27;
      speedMS = +(42 - f * 14).toFixed(1);
      intensityVal = Math.round(6850 - f * 2400) + " m³/s";
      intensityTag = "Debris Torrent";
      intensityClass = "severe";
      pressureKPa = Math.round(150 - f * 60);
    } else {
      const f = Math.min(1.0, (uWave - 0.65) / 0.35);
      speedMS = +(28 - f * 13).toFixed(1);
      intensityVal = Math.round(4450 - f * 1950) + " m³/s";
      intensityTag = "Major Inundation";
      intensityClass = "high";
      pressureKPa = Math.round(90 - f * 45);
    }
  }

  const speedKMH = Math.round(speedMS * 3.6);

  // 4. Economic Destruction Level ($0 -> $482M USD / ~64.5 Billion NPR)
  let econUSD = 0;
  let econLevel = "Normal";
  let econClass = "low";

  if (uWave >= 0.05) {
    if (uWave < 0.15) {
      const f = (uWave - 0.05) / 0.10;
      econUSD = Math.round(15 + f * 135);
      econLevel = "Dam & Port Obliterated";
      econClass = "severe";
    } else if (uWave < 0.45) {
      const f = (uWave - 0.15) / 0.30;
      econUSD = Math.round(150 + f * 130);
      econLevel = "Infrastructure Failure";
      econClass = "extreme";
    } else if (uWave < 0.75) {
      const f = (uWave - 0.45) / 0.30;
      econUSD = Math.round(280 + f * 125);
      econLevel = "Grid & Highway Severance";
      econClass = "catastrophic";
    } else {
      const f = Math.min(1.0, (uWave - 0.75) / 0.25);
      econUSD = Math.round(405 + f * 77);
      econLevel = "National Disaster ($482M+)";
      econClass = "catastrophic";
    }
  }

  const econNPR = (econUSD * 0.134).toFixed(1);

  return {
    dead,
    missing,
    evacuated: missing,
    popAffectedMillions: '0.04',
    waterOfflineMGD: 0,
    hydro,
    stageMeters: 22.0,
    speedMS,
    speedKMH,
    intensityVal,
    intensityTag,
    intensityClass,
    pressureKPa,
    econUSD,
    econLocal: `${econNPR}B NPR`,
    econLevel,
    econClass
  };
}
