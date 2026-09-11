// Dynamic scenario data delegation layer
export * from './scenarios/index.js';
import {
  getScenario,
  getCurrentScenarioId,
  getCurrentWaypoint as getScenarioWaypoint,
  getCurrentNarration as getScenarioNarration,
  SCENARIOS
} from './scenarios/index.js';

export const TIMELINE_CONFIG = {
  get DUR() {
    return getScenario().config.timeline.durationSec;
  },
  INTRO_CARD_DUR: 4.0,
  get REAL_START_TIME() {
    return getScenario().config.timeline.clockStart;
  },
  get CORE_MESSAGE() {
    return getScenario().config.tagline;
  }
};

export const PEAKS = SCENARIOS.rasuwa.peaks;
export const RIVER_CONTROL_POINTS = SCENARIOS.rasuwa.riverPoints;
export const WAYPOINTS = SCENARIOS.delhi.waypoints;
export const NARRATION_SCRIPT = SCENARIOS.delhi.narration;

export function getTallyValues(t, uWave = 0) {
  const scenario = getScenario();
  return scenario.getTallyValues(t, uWave);
}

export function getCurrentWaypoint(t, uWave = 0) {
  return getScenarioWaypoint(t, uWave);
}

export function getCurrentNarration(t) {
  return getScenarioNarration(t);
}
