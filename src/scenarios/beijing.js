// ---------------------------------------------------------------------------
// Beijing, China — Mentougou Mountain Flash Deluge & Yongding River Basin Deluge
// Scenario: Extreme Orographic Cloudburst & Sluice Gate Diversion (Typhoon Doksuri Benchmark)
// Reference: China Meteorological Administration (CMA), Beijing Flood Headquarters,
//            Record 1,029 mm at Miaofengshan, 4,649 m³/s Peak Discharge, ¥50.8B RMB Loss
// ---------------------------------------------------------------------------

export const BEIJING_CONFIG = {
  id: 'beijing',
  name: 'Beijing, China',
  country: 'China',
  flag: '🇨🇳',
  hazard: 'Mentougou Flash Deluge & Yongding River Flood',
  tagline: '1,029mm Mountain Cloudburst, K396 Train Rescue & Lugouqiao Gate Diversion',
  year: '2023 / 2026 Forecast',
  currency: {
    code: 'CNY',
    symbol: '¥',
    rateToUSD: 7.15,
    unit: 'Billion RMB',
    scale: 7.15
  },
  environment: {
    skyTop: 0x181e24,    // Dark monsoon trough cloud deck
    skyMid1: 0x2b3542,   // Heavy rainstorm squall shelf
    skyMid2: 0x434f5e,   // Mountain boundary fog layer
    skyBottom: 0x5b6878, // Saturated mist horizon
    fogColor: 0x2b3542,
    fogNear: 140,
    fogFar: 470,
    sunPosition: [-0.3, 0.7, -0.6],
    sunColor: 0xe0e7ff,  // Dim overcast diffused monsoonal daylight
    sunIntensity: 0.95,
    waterColor: 0x784a28, // Silt-laden turbid clay & loess mountain torrent
    waterRoughness: 0.40,
    waterMetalness: 0.10,
    rainIntensity: 2.4,   // Extreme orographic cloudburst rain
    terrainType: 'mountain_floodplain'
  },
  timeline: {
    durationSec: 36.0,
    clockStart: '31 Jul 08:00',
    clockEnd: '03 Aug 18:00'
  }
};

// 3D River / Canyon Spline Coordinates:
// Taihang Mountain Gorge (NW, x=-140) -> Luopoling Pass -> Highway G109 -> Sanjiadian Dam -> Lugouqiao (Marco Polo Bridge) -> Yongding Plain (SE, x=140)
export const BEIJING_RIVER_POINTS = [
  { x: -140, y: 16.0, z: -85 }, // Miaofengshan headwaters gorge (high altitude)
  { x: -105, y: 12.8, z: -62 }, // Luopoling mountain railway pass
  { x: -70,  y: 9.6,  z: -40 }, // Highway G109 canyon washout reach
  { x: -35,  y: 6.8,  z: -18 }, // Sanjiadian Reservoir dam gorge mouth
  { x: 0,    y: 4.5,  z: 0 },   // Mentougou urban entry & Shijingshan
  { x: 35,   y: 3.2,  z: 22 },  // Yongding River / Lugouqiao (Marco Polo Bridge)
  { x: 70,   y: 2.2,  z: 44 },  // Lugouqiao Flood Diversion Sluice Gates
  { x: 105,  y: 1.6,  z: 68 },  // Yongding River Ecological Wetland Basin
  { x: 140,  y: 1.2,  z: 92 }   // Downstream Liangxiang flood channel
];

export const BEIJING_WAYPOINTS = [
  {
    id: 'mentougou-cloudburst',
    u: 0.05,
    t: 0.06,
    sceneSec: 2.2,
    realTime: '31 Jul 08:00',
    name: 'Miaofengshan & Mentougou',
    subtitle: '1,029 mm Extreme Mountain Cloudburst',
    coords: '39.98° N, 116.02° E',
    badge: 'Stage 1 • Cloudburst • 1,029mm Record Rain',
    headline: 'Heaviest Rainfall in 140 Years Triggers Torrential Mountain Runoff',
    stats: [
      { label: '24-hr Catchment Rainfall', value: '1,029 mm at Miaofengshan (Record)' },
      { label: 'Runoff Generation', value: 'Instant flash flood in under 45 mins' },
      { label: 'Canyon Flow Velocity', value: '14.8 m/s (53.3 km/h) in gorges' },
      { label: 'Warning Lead Time', value: 'Red Rainstorm Warning issued by CMA' },
      { label: 'Debris Concentration', value: '38% volumetric rock & mud content' }
    ],
    scientificNote: 'Typhoon Doksuri moisture-laden low-level jet stalled against the steep southern slope of the Taihang Mountains, generating record-breaking continuous convective cloudbursts.',
    warningGap: 'Steep granite mountain slopes with minimal loess topsoil generated an instantaneous 92% runoff coefficient, overwhelming small tributaries.',
    countermeasure: {
      status: 'Red Rainstorm Warning Issued',
      action: 'Beijing Flood Control Headquarters activated Level I highest emergency disaster response protocol.',
      readiness: '85%'
    }
  },
  {
    id: 'luopoling-k396',
    u: 0.20,
    t: 0.22,
    sceneSec: 7.9,
    realTime: '31 Jul 14:00',
    name: 'Luopoling Mountain Pass',
    subtitle: 'Stranded K396 Train & Mudslide Severance',
    coords: '39.99° N, 115.93° E',
    badge: 'Stage 2 • Transit Trap • K396 Trapped',
    headline: 'K396 Passenger Train Stranded: Flash Mudslide Severs Railway',
    stats: [
      { label: 'Passengers Stranded', value: '976 passengers & crew aboard K396' },
      { label: 'Landslide Debris', value: '42,000 m³ mud & boulders over tracks' },
      { label: 'Telecommunications', value: 'Base station fiber severed (0 signal)' },
      { label: 'Community Evacuation', value: 'Passengers sheltered in Luopoling village' },
      { label: 'Torrent Velocity', value: '11.5 m/s (41.4 km/h) along railbed' }
    ],
    scientificNote: 'Saturated loess slopes liquefied under high pore water pressure, triggering multiple rotational slides that trapped three long-distance passenger trains.',
    warningGap: 'Mountain fiber optic transmission lines lacked redundant satellite uplinks, severing communication for 48 hours.',
    countermeasure: {
      status: 'Emergency Passenger Relocation',
      action: 'Train crew and village cadres evacuated all 976 passengers to Luopoling community centre and school.',
      readiness: '80%'
    }
  },
  {
    id: 'mountain-road-washout',
    u: 0.35,
    t: 0.36,
    sceneSec: 13.0,
    realTime: '31 Jul 21:00',
    name: 'National Highway G109',
    subtitle: 'Mentougou Mountain Highway Washout',
    coords: '39.95° N, 115.90° E',
    badge: 'Stage 3 • Arterial Severance • 1,050 km Cut',
    headline: 'Highway G109 Sheared Away: Hundreds of Vehicles Swept Downstream',
    stats: [
      { label: 'Mountain Roads Severed', value: '1,050 km of highway & rural roads' },
      { label: 'Vehicles Washed Away', value: '>850 private cars & utility vans' },
      { label: 'Flood Stage Rise', value: '+4.6 m water depth in 90 minutes' },
      { label: 'Isolated Mountain Villages', value: '148 villages completely cut off' },
      { label: 'Dynamic Impact Pressure', value: '55 kPa hydrodynamic boulder force' }
    ],
    scientificNote: 'Extreme riverbed shear stress undermined roadbed subgrades along the riverbend, causing instantaneous structural collapse of highway segments.',
    warningGap: 'Lack of elevated mountain bypass viaducts left narrow riverside valley roads directly exposed to debris flow gouging.',
    countermeasure: {
      status: 'Emergency Road-Clearing Units',
      action: 'Beijing PAP Engineering Corps deployed heavy bulldozers and excavator flotillas to carve temporary access paths.',
      readiness: '75%'
    }
  },
  {
    id: 'sanjiadian-reservoir',
    u: 0.48,
    t: 0.50,
    sceneSec: 18.0,
    realTime: '01 Aug 04:00',
    name: 'Sanjiadian Reservoir Dam',
    subtitle: 'Yongding River Gorge Control Sluice',
    coords: '39.96° N, 116.11° E',
    badge: 'Stage 4 • Gorge Gate Regulation • 4,650 m³/s',
    headline: 'Sanjiadian Dam Emergency Sluice Opens to Absorb Mountain Wave',
    stats: [
      { label: 'Peak Gorge Inflow', value: '4,649 m³/s (Historic peak flow)' },
      { label: 'Sluice Gate Aperture', value: '100% full gate clearance deployed' },
      { label: 'Trapped Sediment Volume', value: '7.8 Million m³ loess deposit' },
      { label: 'Dam Sensor Telemetry', value: 'Hydraulic head held below crest' },
      { label: 'Flood Wave Transit Time', value: '35 minutes travel to urban plain' }
    ],
    scientificNote: 'Sanjiadian Dam serves as the critical flood-throttling choke-point connecting the mountainous gorge to the flat Beijing metropolitan plain.',
    warningGap: 'Extreme boulder impacts caused minor wear on stilling basin concrete baffles during the 4,650 m³/s discharge peak.',
    countermeasure: {
      status: 'Controlled Gorge Release',
      action: 'Engineers regulated radial gate discharges to synchronize with downstream detention basin capacity.',
      readiness: '90%'
    }
  },
  {
    id: 'lugouqiao-sluice',
    u: 0.60,
    t: 0.62,
    sceneSec: 22.3,
    realTime: '01 Aug 12:00',
    name: 'Lugouqiao (Marco Polo Bridge)',
    subtitle: '835-Year-Old Bridge & Flood Diversion Sluice',
    coords: '39.85° N, 116.22° E',
    badge: 'Stage 5 • Diversion Opened • 1st Time in 25 Years',
    headline: 'Lugou Diversion Sluice Opened for First Time in 25 Years',
    stats: [
      { label: 'Historic Bridge Heritage', value: 'Built in 1189 AD (501 stone lions)' },
      { label: 'Diverted Discharge Volume', value: '2,500 m³/s into retention plain' },
      { label: 'Masonry Starling Resistance', value: 'Triangular stone cutwaters cleave surge' },
      { label: 'Urban Plain Protected', value: 'Fengtai & Daxing city districts shielded' },
      { label: 'Radial Gates Lifted', value: '16 heavy hydraulic steel gates open' }
    ],
    scientificNote: 'The 835-year-old bridge survived due to its triangular stone starlings that split hydraulic pressure, while modern diversion gates spared central Beijing.',
    warningGap: 'Temporary agricultural developments inside the historic floodway required rapid emergency clearing.',
    countermeasure: {
      status: 'Lugouqiao Sluice Diversion',
      action: 'Ministry of Water Resources ordered immediate opening of diversion sluice, diverting 2,500 m³/s into retention zones.',
      readiness: '95%'
    }
  },
  {
    id: 'pla-airdrop-rescue',
    u: 0.74,
    t: 0.76,
    sceneSec: 27.4,
    realTime: '02 Aug 08:00',
    name: 'PLA Air-Bridge & PAP Rescue',
    subtitle: 'Z-20 Airborne Relief Drops & Mountain Rescue',
    coords: '39.97° N, 115.95° E',
    badge: 'Stage 6 • Airborne Lifeline • 1,290,000 Rescued',
    headline: 'Military Helicopters Establish Aerial Lifeline to Isolated Valleys',
    stats: [
      { label: 'Helicopters Deployed', value: '26 PLA Z-20 & Mi-171 transport craft' },
      { label: 'Airdropped Emergency Food', value: '420 tonnes food, water & medicine' },
      { label: 'Rescue Troops Mobilized', value: '8,500 PLA, PAP & fire rescue personnel' },
      { label: 'Isolated Citizens Reached', value: '68,000 isolated villagers assisted' },
      { label: 'Satellite Communication', value: '50 Tiantong portable terminals dropped' }
    ],
    scientificNote: 'Extreme mountain valley turbulence and low cloud ceiling required tactical low-level hovering and winch delivery by military aviators.',
    warningGap: 'Severe rain squalls delayed initial visual flight rules (VFR) rotorcraft operations during the first 12 hours.',
    countermeasure: {
      status: 'Joint Military-Civil Rescue',
      action: 'Central Military Commission deployed air-ground joint task force to air-drop supplies and extract critically injured.',
      readiness: '95%'
    }
  },
  {
    id: 'sponge-city-retention',
    u: 0.88,
    t: 0.90,
    sceneSec: 32.4,
    realTime: '02 Aug 18:00',
    name: 'Yongding River Retention Basin',
    subtitle: 'Sponge City Flood Storage & Dewatering Armada',
    coords: '39.80° N, 116.25° E',
    badge: 'Stage 7 • Flood Absorption • 180M m³ Stored',
    headline: 'Sponge Retention Plains Absorb Millions of Cubic Metres of Runoff',
    stats: [
      { label: 'Flood Storage Absorbed', value: '180 Million m³ retained in wetlands' },
      { label: 'Heavy "Dragon Boat" Pumps', value: '48 high-volume municipal pump trucks' },
      { label: 'Drainage Pumping Rate', value: '520,000 m³/hr into detention aquifers' },
      { label: 'Groundwater Table Recharge', value: '+2.4 m rise in western aquifer' },
      { label: 'Water Diversion Canal', value: 'South-to-North canal safely protected' }
    ],
    scientificNote: 'Ecological wetlands and permeable parks along the Yongding corridor acted as a giant sponge, attenuating flood crests before reaching Tianjin downstream.',
    warningGap: 'Perimeter drainage pumps required diesel generator backup when local electrical substations were swamped.',
    countermeasure: {
      status: 'Sponge Wetland Storage Activated',
      action: 'Beijing Water Authority opened all ecological detention zones and deployed 48 high-volume pumping trucks.',
      readiness: '98%'
    }
  },
  {
    id: 'beijing-toll-summary',
    u: 0.98,
    t: 1.00,
    sceneSec: 36.0,
    realTime: '03 Aug 18:00',
    name: 'Beijing Deluge Toll & Recovery',
    subtitle: 'Full Basin Recovery & ¥50.8 Billion Impact',
    coords: '39.90° N, 116.40° E (Capital Region)',
    badge: 'Stage 8 • Final Toll • ¥50.8B ($7.1B USD)',
    headline: 'Beijing Deluge Recovered: ¥50.8B Loss & 1.29M People Protected',
    stats: [
      { label: 'Direct Economic Loss', value: '¥50.8 Billion RMB ($7.1 Billion USD)' },
      { label: 'Population Evacuated / Protected', value: '1,290,000 residents' },
      { label: 'Recorded Casualties', value: '33 fatalities, 18 missing' },
      { label: 'Highway & Bridge Rebuilt', value: '1,050 km roads & 147 bridges' },
      { label: 'Peak 24-hr Cloudburst', value: '1,029 mm at Miaofengshan (Record)' }
    ],
    scientificNote: 'A benchmark compound mountain-urban catastrophe demonstrating the vital necessity of integrated retention basins, gorge sluices, and aerial rescue capabilities.',
    warningGap: 'Emphasizes the urgent need for satellite-linked mountain valley sensor arrays and reinforced high-mountain bypass tunnels.',
    countermeasure: {
      status: 'Post-Disaster Reconstruction Fund',
      action: 'State Council approved ¥100 Billion resilient infrastructure redevelopment package across Beijing-Tianjin-Hebei.',
      readiness: '100%'
    }
  }
];

export const BEIJING_NARRATION = [
  { tStart: 0.00, tEnd: 0.10, text: "July 2023 / 2026. Typhoon Doksuri's moisture spiral slams against the Taihang Mountains, unleashing an unprecedented 1,029mm of rain on Beijing's Mentougou district." },
  { tStart: 0.10, tEnd: 0.22, text: "High in the Taihang gorge, torrential mudslides bury the mountain railway, stranding 976 passengers aboard the K396 train at Luopoling with all communications severed." },
  { tStart: 0.22, tEnd: 0.35, text: "Flash floods rip down National Highway G109 at 53 km/h. Over a thousand kilometres of mountain roads are sheared away as hundreds of vehicles are swept into the raging silt." },
  { tStart: 0.35, tEnd: 0.48, text: "At Sanjiadian Dam, engineers lift radial gates under immense pressure to absorb a historic 4,650-cubic-metre-per-second mountain wave heading directly for urban Beijing." },
  { tStart: 0.48, tEnd: 0.60, text: "Downstream at the 835-year-old Lugouqiao (Marco Polo Bridge), modern flood diversion gates are opened for the first time in 25 years to divert 2,500 m³/s into retention plains." },
  { tStart: 0.60, tEnd: 0.72, text: "The People's Liberation Army and PAP launch an aerial lifeline: Z-20 helicopters brave mountain squalls to drop 420 tonnes of food and satellite communications." },
  { tStart: 0.72, tEnd: 0.85, text: "Across western Beijing, 180 million cubic metres of floodwaters are safely absorbed into Sponge City ecological wetlands and pumped into deep aquifers." },
  { tStart: 0.85, tEnd: 1.00, text: "1.29 million citizens evacuated and ¥50.8 billion in total economic loss. Beijing's integrated mountain-to-basin defenses successfully shield the capital core." }
];

export function getBeijingTallyValues(t, uWave = 0) {
  // 1. Population Affected & Displaced
  const popFactor = Math.min(Math.max((uWave - 0.10) / 0.80, 0), 1);
  const evacuated = Math.round(1290000 * popFactor);
  const popAffectedMillions = (1.29 * popFactor).toFixed(2);

  // 2. Mountain Highway Severance (0 -> 1,050 km)
  const roadFactor = Math.min(Math.max((uWave - 0.15) / 0.50, 0), 1);
  const roadsSeveredKM = Math.round(1050 * roadFactor);

  // 3. Water Speed & Surge Intensity
  let speedMS = 4.5;
  let intensityVal = "380 mm Rain";
  let intensityClass = "low";
  let intensityTag = "Cloudburst Runoff";
  let pressureKPa = 12;
  let stageMeters = 3.2;

  if (t < 0.08) {
    speedMS = 6.8;
    intensityVal = "1,029 mm Record";
    intensityTag = "Miaofengshan Peak";
    intensityClass = "severe";
    pressureKPa = 22;
    stageMeters = 4.5;
  } else if (uWave < 0.25) {
    // Gorge flash torrent past Luopoling (highest velocity down canyon)
    const f = uWave / 0.25;
    speedMS = +(10.5 + f * 4.3).toFixed(1); // 10.5 -> 14.8 m/s (53.3 km/h)
    intensityVal = "4,650 m³/s Peak";
    intensityTag = "Gorge Torrent Wave";
    intensityClass = "catastrophic";
    pressureKPa = Math.round(35 + f * 30); // up to 65 kPa
    stageMeters = +(4.8 + f * 3.4).toFixed(2); // up to 8.2 m
  } else if (uWave < 0.65) {
    // Highway G109 washout & Sanjiadian dam entry
    const f = (uWave - 0.25) / 0.40;
    speedMS = +(12.8 + Math.sin(f * Math.PI) * 1.8).toFixed(1); // up to 14.6 m/s
    intensityVal = "4,649 m³/s Discharge";
    intensityTag = "Sanjiadian Gorge Inflow";
    intensityClass = "catastrophic";
    pressureKPa = Math.round(52 + Math.sin(f * Math.PI) * 13);
    stageMeters = +(7.5 + Math.sin(f * Math.PI) * 1.5).toFixed(2);
  } else if (uWave < 0.85) {
    // Lugouqiao flood diversion & plain expansion
    const f = (uWave - 0.65) / 0.20;
    speedMS = +(9.2 - f * 3.4).toFixed(1); // 9.2 -> 5.8 m/s
    intensityVal = "2,500 m³/s Diverted";
    intensityTag = "Lugou Sluice Diversion";
    intensityClass = "extreme";
    pressureKPa = Math.round(45 - f * 18);
    stageMeters = +(6.8 - f * 2.2).toFixed(2);
  } else {
    // Retention wetland absorption & dewatering
    const f = Math.min(1.0, (uWave - 0.85) / 0.15);
    speedMS = +(5.2 - f * 2.0).toFixed(1); // 5.2 -> 3.2 m/s
    intensityVal = "180M m³ Stored";
    intensityTag = "Sponge City Absorption";
    intensityClass = "high";
    pressureKPa = Math.round(25 - f * 12);
    stageMeters = +(4.2 - f * 1.8).toFixed(2);
  }

  const speedKMH = Math.round(speedMS * 3.6);

  // 4. Economic Destruction in USD ($M) & RMB (¥ Billion)
  let econUSD = 0;
  let econLevel = "Normal";
  let econClass = "low";

  if (uWave >= 0.08) {
    if (uWave < 0.25) {
      // Mentougou mountain roadbed & rural village washouts
      const f = (uWave - 0.08) / 0.17;
      econUSD = Math.round(450 + f * 1150); // up to $1.6B (¥11.4B)
      econLevel = "Mountain Highway Washed";
      econClass = "severe";
    } else if (uWave < 0.60) {
      // Highway G109 severed + railway mudslides + 850 swept cars
      const f = (uWave - 0.25) / 0.35;
      econUSD = Math.round(1600 + f * 2400); // up to $4.0B (¥28.6B)
      econLevel = "Railway & G109 Severed";
      econClass = "extreme";
    } else if (uWave < 0.85) {
      // Shijingshan / Lugouqiao diversion & agricultural inundation
      const f = (uWave - 0.60) / 0.25;
      econUSD = Math.round(4000 + f * 2200); // up to $6.2B (¥44.3B)
      econLevel = "Basin Sluice Diversion";
      econClass = "catastrophic";
    } else {
      // Full Beijing-Tianjin-Hebei regional deluge total
      const f = Math.min(1.0, (uWave - 0.85) / 0.15);
      econUSD = Math.round(6200 + f * 900); // up to $7.1B ($7,100M / ¥50.8B)
      econLevel = "Regional Catastrophe (¥50.8B)";
      econClass = "catastrophic";
    }
  }

  const econBillionRMB = (econUSD * 7.15 / 1000).toFixed(1);

  return {
    dead: 33, // Confirmed fatalities
    missing: evacuated, // Displaced / evacuated count
    evacuated,
    popAffectedMillions,
    waterOfflineMGD: roadsSeveredKM, // Secondary KPI: Severed Mountain Highways
    hydro: roadsSeveredKM,           // Secondary KPI badge: Severed Highways (km)
    stageMeters,
    speedMS,
    speedKMH,
    intensityVal,
    intensityTag,
    intensityClass,
    pressureKPa,
    econUSD,
    econLocal: `¥${econBillionRMB}B RMB`,
    econLevel,
    econClass
  };
}
