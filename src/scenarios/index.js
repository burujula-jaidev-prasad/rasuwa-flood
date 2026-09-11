// ---------------------------------------------------------------------------
// Global Scenario Registry
// ---------------------------------------------------------------------------

import {
  DELHI_CONFIG,
  DELHI_RIVER_POINTS,
  DELHI_WAYPOINTS,
  DELHI_NARRATION,
  getDelhiTallyValues
} from './delhi.js';

import {
  RASUWA_CONFIG,
  RASUWA_PEAKS,
  RASUWA_RIVER_POINTS,
  RASUWA_WAYPOINTS,
  RASUWA_NARRATION,
  getRasuwaTallyValues
} from './rasuwa.js';

import {
  NEWYORK_CONFIG,
  NEWYORK_RIVER_POINTS,
  NEWYORK_WAYPOINTS,
  NEWYORK_NARRATION,
  getNewYorkTallyValues
} from './newyork.js';

export const SCENARIOS = {
  delhi: {
    config: DELHI_CONFIG,
    riverPoints: DELHI_RIVER_POINTS,
    waypoints: DELHI_WAYPOINTS,
    narration: DELHI_NARRATION,
    getTallyValues: getDelhiTallyValues,
    peaks: []
  },
  rasuwa: {
    config: RASUWA_CONFIG,
    riverPoints: RASUWA_RIVER_POINTS,
    waypoints: RASUWA_WAYPOINTS,
    narration: RASUWA_NARRATION,
    getTallyValues: getRasuwaTallyValues,
    peaks: RASUWA_PEAKS
  },
  newyork: {
    config: NEWYORK_CONFIG,
    riverPoints: NEWYORK_RIVER_POINTS,
    waypoints: NEWYORK_WAYPOINTS,
    narration: NEWYORK_NARRATION,
    getTallyValues: getNewYorkTallyValues,
    peaks: []
  }
};

export const AVAILABLE_SCENARIOS = [
  { id: 'delhi', name: 'Delhi, India', flag: '🇮🇳', hazard: 'Yamuna River Record Inundation', active: true },
  { id: 'newyork', name: 'New York, USA', flag: '🇺🇸', hazard: 'Cat-4 Hurricane Storm Surge', active: true },
  { id: 'rasuwa', name: 'Rasuwa, Nepal', flag: '🇳🇵', hazard: 'Langtang Avalanche Dam-Burst', active: true },
  { id: 'beijing', name: 'Beijing, China', flag: '🇨🇳', hazard: 'Mentougou Flash Deluge', active: false, comingSoon: true },
  { id: 'tokyo', name: 'Tokyo, Japan', flag: '🇯🇵', hazard: 'Arakawa Flood & G-CANS Defense', active: false, comingSoon: true },
  { id: 'london', name: 'London, UK', flag: '🇬🇧', hazard: 'North Sea Tidal Surge & Barrier', active: false, comingSoon: true }
];

let currentScenarioId = 'delhi'; // Start with Delhi as requested!

export function getCurrentScenarioId() {
  return currentScenarioId;
}

export function setCurrentScenarioId(id) {
  if (SCENARIOS[id]) {
    currentScenarioId = id;
  }
}

export function getScenario(id = currentScenarioId) {
  return SCENARIOS[id] || SCENARIOS.delhi;
}

export function getCurrentWaypoint(t, uWave = 0, scenarioId = currentScenarioId) {
  const scenario = getScenario(scenarioId);
  const waypoints = scenario.waypoints;

  if (t < 0.15) {
    return { index: 0, waypoint: waypoints[0] };
  }

  for (let i = waypoints.length - 1; i >= 1; i--) {
    if (uWave >= (waypoints[i].u - 0.02)) {
      return { index: i, waypoint: waypoints[i] };
    }
  }

  return { index: 0, waypoint: waypoints[0] };
}

export function getCurrentNarration(t, scenarioId = currentScenarioId) {
  const scenario = getScenario(scenarioId);
  const narration = scenario.narration;

  for (const item of narration) {
    if (t >= item.tStart && t <= item.tEnd) {
      return item.text;
    }
  }
  return narration[narration.length - 1].text;
}
