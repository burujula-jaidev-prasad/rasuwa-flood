// ---------------------------------------------------------------------------
// Global Scenario Registry
// ---------------------------------------------------------------------------

import {
  DELHI_CONFIG,
  DELHI_RIVER_POINTS,
  DELHI_WAYPOINTS,
  DELHI_NARRATION,
  getDelhiTallyValues,
  setDelhiForecastMode,
  getDelhiForecastMode
} from './delhi.js';

export { setDelhiForecastMode, getDelhiForecastMode };

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
  getNewYorkTallyValues,
  setNYForecastMode,
  getNYForecastMode
} from './newyork.js';

export { setNYForecastMode, getNYForecastMode };

import {
  BEIJING_CONFIG,
  BEIJING_RIVER_POINTS,
  BEIJING_WAYPOINTS,
  BEIJING_NARRATION,
  getBeijingTallyValues
} from './beijing.js';

import {
  TOKYO_CONFIG,
  TOKYO_RIVER_POINTS,
  TOKYO_WAYPOINTS,
  TOKYO_NARRATION,
  getTokyoTallyValues
} from './tokyo.js';

import {
  LONDON_CONFIG,
  LONDON_RIVER_POINTS,
  LONDON_WAYPOINTS,
  LONDON_NARRATION,
  getLondonTallyValues
} from './london.js';

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
  },
  beijing: {
    config: BEIJING_CONFIG,
    riverPoints: BEIJING_RIVER_POINTS,
    waypoints: BEIJING_WAYPOINTS,
    narration: BEIJING_NARRATION,
    getTallyValues: getBeijingTallyValues,
    peaks: []
  },
  tokyo: {
    config: TOKYO_CONFIG,
    riverPoints: TOKYO_RIVER_POINTS,
    waypoints: TOKYO_WAYPOINTS,
    narration: TOKYO_NARRATION,
    getTallyValues: getTokyoTallyValues,
    peaks: []
  },
  london: {
    config: LONDON_CONFIG,
    riverPoints: LONDON_RIVER_POINTS,
    waypoints: LONDON_WAYPOINTS,
    narration: LONDON_NARRATION,
    getTallyValues: getLondonTallyValues,
    peaks: []
  }
};

export const AVAILABLE_SCENARIOS = [
  { id: 'delhi', name: 'Delhi, India', flag: '🇮🇳', hazard: 'Yamuna River Record Inundation', active: true },
  { id: 'newyork', name: 'New York, USA', flag: '🇺🇸', hazard: 'Cat-4 Hurricane Storm Surge', active: true },
  { id: 'rasuwa', name: 'Nepal (Rasuwa)', flag: '🇳🇵', hazard: 'Langtang Cryospheric GLOF', active: true }
];

SCENARIOS.nepal = SCENARIOS.rasuwa;
SCENARIOS.ny = SCENARIOS.newyork;

let currentScenarioId = 'delhi';

export function getCurrentScenarioId() {
  return currentScenarioId;
}

export function setCurrentScenarioId(id) {
  const resolved = (id === 'nepal' ? 'rasuwa' : id === 'ny' ? 'newyork' : id);
  if (SCENARIOS[resolved]) {
    currentScenarioId = resolved;
  }
}

export function getScenario(id = currentScenarioId) {
  const resolved = (id === 'nepal' ? 'rasuwa' : id === 'ny' ? 'newyork' : id);
  return SCENARIOS[resolved] || SCENARIOS.delhi;
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
