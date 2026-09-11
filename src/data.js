// Verified analytics, coordinates, and narrative data for "The 2026 Rasuwa–Bhotekoshi Flood"
// Source: ICIMOD, USGS, HiRISK, Nature, GFZ, Open Satellite Reconstructions

export const TIMELINE_CONFIG = {
  DUR: 85.0, // Slow, cinematic timeline duration (85s) for full detailing of every stage
  INTRO_CARD_DUR: 4.0, // Climate intro card duration
  REAL_START_TIME: "08:37",
  CORE_MESSAGE: "Ice–rock avalanche dammed and burst a river — NOT a classic GLOF. Climate change doubled ice loss since 2000, priming the slope."
};

export const PEAKS = [
  { name: "Langtang Lirung", x: -100, z: -94, h: 64, w: 22, realElev: "7,227 m", isMain: true },
  { name: "Ganesh Himal Range", x: -76, z: -26, h: 44, w: 20 },
  { name: "Northern Cirque Ridge", x: -24, z: -82, h: 36, w: 18 },
  { name: "Eastern Escarpment", x: 80, z: 6, h: 42, w: 20 },
  { name: "Southern Himalayan Range", x: 18, z: 78, h: 34, w: 18 },
  { name: "Western Foothill Ridge", x: -52, z: 60, h: 28, w: 16 }
];

export const RIVER_CONTROL_POINTS = [
  { x: -84, y: 30, z: -80, desc: "Source / Langtang Lirung base" },
  { x: -60, y: 22, z: -50 },
  { x: -36, y: 16, z: -32 },
  { x: -12, y: 11, z: -8 },
  { x: 12, y: 8, z: 12 },
  { x: 36, y: 5.5, z: 30 },
  { x: 62, y: 3.4, z: 52 },
  { x: 98, y: 2, z: 86, desc: "Outlet toward India" }
];

// Waypoint positions precisely synced to wave front position: t = 0.20 + 0.80 * uWave
export const WAYPOINTS = [
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
    warningGap: "High-altitude cirque failure occurred unmonitored; no automated seismic or optical early warning telemetry existed."
  },
  {
    id: "rasuwagadhi",
    u: 0.10,
    t: 0.28,
    sceneSec: 23.8,
    realTime: "08:50",
    name: "Rasuwagadhi Border",
    subtitle: "Border Post & 111 MW Dam Destroyed",
    coords: "28.28° N, 85.38° E",
    badge: "Stage 2 • Infrastructure Destruction • 08:50",
    headline: "111 MW Dam Smashed & Freight Port Obliterated",
    stats: [
      { label: "Surge Arrival", value: "08:50 (7 min post-burst)" },
      { label: "Rasuwagadhi HEP", value: "111 MW generation completely destroyed" },
      { label: "International Bridge", value: "Border crossing bridge wiped out" },
      { label: "Freight Cargo & Vehicles", value: "~1,000 containers & vehicles washed away" },
      { label: "Gyirong / Kerung Port", value: "Customs facilities demolished" }
    ],
    scientificNote: "The dam burst generated a hyperconcentrated mud and boulder surge behaving as a dense battering ram.",
    warningGap: "Only 7 minutes elapsed between dam burst and border impact; cross-border channels had zero actionable advance warning."
  },
  {
    id: "gorge",
    u: 0.22,
    t: 0.376,
    sceneSec: 32.0,
    realTime: "08:56",
    name: "The Langtang Gorge",
    subtitle: "Bedrock Scour & 134m Trimlines",
    coords: "Bhotekoshi Canyon",
    badge: "Stage 3 • Extreme Geomorphology • 08:56",
    headline: "Violent Bedrock Scour & 134m High Water Trimlines",
    stats: [
      { label: "Bedrock Excavation", value: "8 – 12 m of solid riverbed scoured" },
      { label: "Peak Flow Depth", value: "Up to ~134 m trimlines on cliffs" },
      { label: "Flow Velocity", value: "Up to 52 m/s (187 km/h) in narrow chasm" },
      { label: "Erosion Regime", value: "Pure excavation; sediment flushed downstream" }
    ],
    scientificNote: "Extreme hydraulic gradient in the canyon converted suspended boulders into diamond-tipped bedrock chisels.",
    warningGap: "Remote, inaccessible canyon reach; satellite radar (Sentinel-1) provided only post-event damage mapping."
  },
  {
    id: "syabrubesi",
    u: 0.30,
    t: 0.44,
    sceneSec: 37.4,
    realTime: "09:00",
    name: "Syabrubesi",
    subtitle: "Trekking Gateway Town Destroyed",
    coords: "28.16° N, 85.33° E",
    badge: "Stage 4 • Settlement Inundation • 09:00",
    headline: "Settlements Swept Away; Toll Escalates",
    stats: [
      { label: "Town Damage", value: "Riverbank trekking lodges & homes obliterated" },
      { label: "Vehicles & Bridges", value: "Vehicles and footbridges swept downriver" },
      { label: "Local Gauge", value: "Station lost telemetry mid-wave" },
      { label: "Corridor Highway", value: "Main Trishuli highway severed" }
    ],
    scientificNote: "Valley bend geometry created localized surge reflections, causing water surface to slosh 20+ m above average stage.",
    warningGap: "Authorities received informal telephone notification 23 minutes after collapse, as water was already hitting homes."
  },
  {
    id: "hydro",
    u: 0.42,
    t: 0.536,
    sceneSec: 45.6,
    realTime: "09:05",
    name: "Hydropower Corridor",
    subtitle: "10% of Nepal's Power Grid Knocked Offline",
    coords: "Upper Trishuli Cascade",
    badge: "Stage 5 • National Grid Impact • 09:05",
    headline: "431 MW Hydro Generation Disconnected",
    stats: [
      { label: "Instant Grid Loss", value: "431.1 MW severed within minutes" },
      { label: "Total Plants Hit", value: "11 – 13 hydro plants damaged (~783 MW)" },
      { label: "Trishuli HEP", value: "24 MW powerhouse flooded" },
      { label: "Chilime HEP", value: "22 MW intake severed" },
      { label: "Langtang & Devighat", value: "20 MW & 14 MW disabled" }
    ],
    scientificNote: "Cascading infrastructure failure: high-velocity mud inundated turbine pits and knocked out transmission pylons.",
    warningGap: "Operators attempted emergency spillway gate lifts, but automated hydraulic controls were overwhelmed."
  },
  {
    id: "betrawati",
    u: 0.52,
    t: 0.616,
    sceneSec: 52.4,
    realTime: "09:20",
    name: "Betrawati",
    subtitle: "Sensors Destroyed Mid-Event",
    coords: "27.96° N, 85.18° E",
    badge: "Stage 6 • Sensors Lost • 09:20",
    headline: "National Gauges Destroyed; Delayed Public Alert",
    stats: [
      { label: "Department Gauge", value: "Demolished at 09:20 during surge" },
      { label: "Vehicular Bridge", value: "Concrete highway bridge sheared away" },
      { label: "Vehicles Swept", value: "Highway trucks and buses washed away" },
      { label: "Public Broadcast Alert", value: "09:15 (38 min after initial collapse)" }
    ],
    scientificNote: "The 38-minute warning latency: broadcast sirens activated after the flood had already traversed 40+ km downstream.",
    warningGap: "Physical destruction of upstream gauge telemetry prevented automated downstream siren triggers."
  },
  {
    id: "galchhi",
    u: 0.66,
    t: 0.728,
    sceneSec: 61.9,
    realTime: "09:40",
    name: "Galchhi (~50 km)",
    subtitle: "Downstream River Stage Jumps +9 Metres",
    coords: "27.83° N, 84.98° E (Prithvi Hwy)",
    badge: "Stage 7 • Downstream Surge • 09:40",
    headline: "Trishuli Rises +9 Metres in 30 Minutes",
    stats: [
      { label: "Measured Rise", value: "+9 m stage rise in 30 min (ICIMOD)" },
      { label: "Malekhu Station", value: "+7 m rise recorded downstream" },
      { label: "Debris Sheet", value: "12 – 18 m thick sediment blanket" },
      { label: "Surge Propagation", value: "Flow slows to ~75 km/h in wide valley" }
    ],
    scientificNote: "As the canyon opened into lower terraces, energy dissipated into widespread sediment deposition, burying floodplains.",
    warningGap: "Downstream communities had very limited evacuation windows despite being 50 km from the origin."
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
    warningGap: "Highlights the urgent imperative for automated satellite-seismic early warning networks across the Himalaya."
  }
];

export const NARRATION_SCRIPT = [
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

export function getTallyValues(t, uWave = 0) {
  // 1. Casualties
  const deadFactor = Math.min(Math.max((uWave - 0.30) / 0.60, 0), 1);
  const dead = Math.round(1355 * deadFactor);

  const missingFactor = Math.min(Math.max((uWave - 0.30) / 0.60, 0), 1);
  const missing = Math.round(4996 * missingFactor);

  // 2. Hydropower offline (0 to 431 MW)
  const hydroFactor = Math.min(Math.max((uWave - 0.10) / 0.35, 0), 1);
  const hydro = (431 * hydroFactor).toFixed(1);

  // 3. Water Speed (m/s and km/h) dynamically based on gorge gradient & constriction
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
    // Avalanche falling down mountain face
    const aAlpha = (t - 0.04) / 0.16;
    speedMS = +(38 + aAlpha * 14).toFixed(1); // 38 - 52 m/s rock-ice plunge
    intensityVal = "Rock Avalanche";
    intensityTag = "Alpine Fall";
    intensityClass = "extreme";
    pressureKPa = +(45 + aAlpha * 80).toFixed(0);
  } else {
    // Flood wave along river
    if (uWave < 0.12) {
      // Dam burst at Rasuwagadhi
      const f = uWave / 0.12;
      speedMS = +(32 + f * 12).toFixed(1); // 32 -> 44 m/s
      intensityVal = Math.round(3500 + f * 3350) + " m³/s";
      intensityTag = "Dam-Burst Wave";
      intensityClass = "extreme";
      pressureKPa = Math.round(110 + f * 55);
    } else if (uWave < 0.38) {
      // Deep Langtang / Bhotekoshi Gorge constriction (highest velocity & scour)
      const f = (uWave - 0.12) / 0.26;
      speedMS = +(44 + Math.sin(f * Math.PI) * 7.5).toFixed(1); // Peaks at ~51.5 m/s (185 km/h)
      intensityVal = "6,850 m³/s";
      intensityTag = "Extreme Bore";
      intensityClass = "catastrophic";
      pressureKPa = Math.round(165 + Math.sin(f * Math.PI) * 20); // up to 185 kPa
    } else if (uWave < 0.65) {
      // Syabrubesi & hydro cascade
      const f = (uWave - 0.38) / 0.27;
      speedMS = +(42 - f * 14).toFixed(1); // 42 -> 28 m/s
      intensityVal = Math.round(6850 - f * 2400) + " m³/s";
      intensityTag = "Debris Torrent";
      intensityClass = "severe";
      pressureKPa = Math.round(150 - f * 60);
    } else {
      // Alluvial widening at Betrawati / Galchhi
      const f = Math.min(1.0, (uWave - 0.65) / 0.35);
      speedMS = +(28 - f * 13).toFixed(1); // 28 -> 15 m/s
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
      // Rasuwagadhi dam (111 MW) + customs dry port + friendship bridge
      const f = (uWave - 0.05) / 0.10;
      econUSD = Math.round(15 + f * 135); // up to $150M
      econLevel = "Dam & Port Obliterated";
      econClass = "severe";
    } else if (uWave < 0.45) {
      // Gorge scour + Syabrubesi lodges + footbridges + road corridors
      const f = (uWave - 0.15) / 0.30;
      econUSD = Math.round(150 + f * 130); // up to $280M
      econLevel = "Infrastructure Failure";
      econClass = "extreme";
    } else if (uWave < 0.75) {
      // Trishuli cascade powerhouses + Mailung Bailey bridge + Betrawati shophouses
      const f = (uWave - 0.45) / 0.30;
      econUSD = Math.round(280 + f * 125); // up to $405M
      econLevel = "Grid & Highway Severance";
      econClass = "catastrophic";
    } else {
      // Lower Trishuli & regional disruption
      const f = Math.min(1.0, (uWave - 0.75) / 0.25);
      econUSD = Math.round(405 + f * 77); // up to $482M
      econLevel = "National Disaster ($482M+)";
      econClass = "catastrophic";
    }
  }

  const econNPR = (econUSD * 0.134).toFixed(1); // 1 USD ~ 134 NPR in Billion NPR

  return {
    dead,
    missing,
    hydro,
    speedMS,
    speedKMH,
    intensityVal,
    intensityTag,
    intensityClass,
    pressureKPa,
    econUSD,
    econNPR,
    econLevel,
    econClass
  };
}

// ZERO-LAG ACTIVE WAYPOINT: Triggers directly based on the wave front position uWave!
export function getCurrentWaypoint(t, uWave = 0) {
  if (t < 0.20) {
    return { index: 0, waypoint: WAYPOINTS[0] };
  }

  // Check which waypoint the wave has reached along the river
  for (let i = WAYPOINTS.length - 1; i >= 1; i--) {
    if (uWave >= (WAYPOINTS[i].u - 0.02)) {
      return { index: i, waypoint: WAYPOINTS[i] };
    }
  }

  return { index: 0, waypoint: WAYPOINTS[0] };
}

export function getCurrentNarration(t) {
  for (const item of NARRATION_SCRIPT) {
    if (t >= item.tStart && t <= item.tEnd) {
      return item.text;
    }
  }
  return NARRATION_SCRIPT[NARRATION_SCRIPT.length - 1].text;
}
