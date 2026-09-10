import { WAYPOINTS, TIMELINE_CONFIG, getTallyValues, getCurrentWaypoint, getCurrentNarration } from './data.js';

export class UIManager {
  constructor(options) {
    this.options = options;

    this.activeWaypointId = null;
    this.isPlaying = true;
    this.speed = 1.0;
    this.isGuided = true;
    this.rainActive = true;

    this.initDOMElements();
    this.attachEventListeners();
    this.renderWaypointNav();
  }

  initDOMElements() {
    this.elIntroCard = document.getElementById('intro-card');
    this.elIntroSkip = document.getElementById('intro-skip-btn');
    this.elIntroTimer = document.getElementById('intro-timer');

    this.elTallyDead = document.getElementById('tally-dead');
    this.elTallyMissing = document.getElementById('tally-missing');
    this.elTallyHydro = document.getElementById('tally-hydro');

    this.elWaypointList = document.getElementById('waypoint-list');
    this.elRightPanel = document.getElementById('analytics-card');

    this.elPlayBtn = document.getElementById('play-btn');
    this.elPlayIcon = document.getElementById('play-icon');
    this.elScrubber = document.getElementById('timeline-scrubber');
    this.elTimeDisplay = document.getElementById('time-display');
    this.elRealClock = document.getElementById('real-clock');

    this.elCaptionText = document.getElementById('caption-text');
    this.elGuidedBtn = document.getElementById('guided-btn');
    this.elRainBtn = document.getElementById('rain-btn');
    this.elSpeedBtn = document.getElementById('speed-btn');
  }

  renderWaypointNav() {
    this.elWaypointList.innerHTML = '';
    WAYPOINTS.forEach((wp) => {
      const item = document.createElement('button');
      item.className = 'waypoint-nav-item';
      item.dataset.id = wp.id;
      item.innerHTML = `
        <div class="wp-nav-marker">
          <span class="wp-dot"></span>
          <span class="wp-line"></span>
        </div>
        <div class="wp-nav-info">
          <div class="wp-nav-time">${wp.realTime}</div>
          <div class="wp-nav-name">${wp.name}</div>
        </div>
      `;
      item.addEventListener('click', () => {
        if (this.options.onSeek) {
          this.options.onSeek(wp.t);
        }
      });
      this.elWaypointList.appendChild(item);
    });
  }

  attachEventListeners() {
    this.elIntroSkip.addEventListener('click', () => {
      this.hideIntroCard();
    });

    this.elPlayBtn.addEventListener('click', () => {
      this.isPlaying = !this.isPlaying;
      this.updatePlayBtnState();
      if (this.options.onTogglePlay) {
        this.options.onTogglePlay(this.isPlaying);
      }
    });

    this.elScrubber.addEventListener('input', (e) => {
      const t = parseFloat(e.target.value);
      if (this.options.onSeek) {
        this.options.onSeek(t);
      }
    });

    this.elGuidedBtn.addEventListener('click', () => {
      this.isGuided = !this.isGuided;
      this.updateGuidedBtnState();
      if (this.options.onToggleGuided) {
        this.options.onToggleGuided(this.isGuided);
      }
    });

    this.elRainBtn.addEventListener('click', () => {
      this.rainActive = !this.rainActive;
      this.elRainBtn.classList.toggle('active', this.rainActive);
      this.elRainBtn.title = this.rainActive ? "Atmosphere: Rain & Mist ON" : "Atmosphere: Clear Sky (Realistic)";
      if (this.options.onToggleRain) {
        this.options.onToggleRain(this.rainActive);
      }
    });

    this.elSpeedBtn.addEventListener('click', () => {
      if (this.speed === 1.0) this.speed = 1.5;
      else if (this.speed === 1.5) this.speed = 2.0;
      else if (this.speed === 2.0) this.speed = 0.5;
      else this.speed = 1.0;
      this.elSpeedBtn.textContent = `${this.speed}x`;
      if (this.options.onSetSpeed) {
        this.options.onSetSpeed(this.speed);
      }
    });
  }

  updatePlayBtnState() {
    if (this.isPlaying) {
      this.elPlayIcon.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <rect x="5" y="4" width="4" height="16" rx="1"/>
          <rect x="15" y="4" width="4" height="16" rx="1"/>
        </svg>
      `;
      this.elPlayBtn.title = "Pause Simulation";
    } else {
      this.elPlayIcon.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="6 4 20 12 6 20 6 4"/>
        </svg>
      `;
      this.elPlayBtn.title = "Play Simulation";
    }
  }

  updateGuidedBtnState() {
    if (this.isGuided) {
      this.elGuidedBtn.classList.add('active');
      this.elGuidedBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        <span>DIRECTOR CAM</span>
      `;
    } else {
      this.elGuidedBtn.classList.remove('active');
      this.elGuidedBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
        </svg>
        <span>FREE ORBIT (SNAP BACK)</span>
      `;
    }
  }

  setGuided(guided) {
    this.isGuided = guided;
    this.updateGuidedBtnState();
  }

  hideIntroCard() {
    this.elIntroCard.classList.add('hidden');
  }

  // Zero-lag update synchronized with actual wave front position uWave!
  update(t, elapsedSec, uWave = 0) {
    // 1. Scrubber & Time
    this.elScrubber.value = t.toFixed(4);
    const sceneSeconds = (t * TIMELINE_CONFIG.DUR).toFixed(1);
    this.elTimeDisplay.textContent = `${sceneSeconds}s / ${TIMELINE_CONFIG.DUR}s`;

    // Real Clock mapping
    let clock = "08:37:00";
    if (t < 0.20) {
      const frac = t / 0.20;
      const sec = Math.floor(frac * 7 * 60);
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      clock = `08:${String(37 + m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    } else if (uWave < 0.10) {
      const frac = uWave / 0.10;
      const sec = Math.floor(frac * 6 * 60);
      const m = 44 + Math.floor(sec / 60);
      const s = sec % 60;
      clock = `08:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    } else if (uWave < 0.30) {
      const frac = (uWave - 0.10) / (0.30 - 0.10);
      const sec = Math.floor(frac * 10 * 60);
      const m = 50 + Math.floor(sec / 60);
      const s = sec % 60;
      clock = `08:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    } else if (uWave < 0.42) {
      const frac = (uWave - 0.30) / (0.42 - 0.30);
      const sec = Math.floor(frac * 5 * 60);
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      clock = `09:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    } else if (uWave < 0.52) {
      const frac = (uWave - 0.42) / (0.52 - 0.42);
      const sec = Math.floor(frac * 15 * 60);
      const m = 5 + Math.floor(sec / 60);
      const s = sec % 60;
      clock = `09:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    } else {
      const frac = Math.min(1.0, (uWave - 0.52) / 0.48);
      const sec = Math.floor(frac * 35 * 60);
      const m = 20 + Math.floor(sec / 60);
      const s = sec % 60;
      clock = `09:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    this.elRealClock.textContent = clock;

    // 2. Running Tallies strictly synced to uWave!
    const tallies = getTallyValues(t, uWave);
    this.elTallyDead.textContent = tallies.dead.toLocaleString();
    this.elTallyMissing.textContent = tallies.missing.toLocaleString();
    this.elTallyHydro.textContent = `${tallies.hydro} MW`;

    // 3. Active Waypoint & Analytics Panel synced with ZERO latency to uWave
    const { index, waypoint } = getCurrentWaypoint(t, uWave);
    if (this.activeWaypointId !== waypoint.id) {
      this.activeWaypointId = waypoint.id;
      this.renderAnalytics(waypoint);
      this.updateWaypointNavHighlight(waypoint.id);
    }

    // 4. Captions
    const caption = getCurrentNarration(t);
    this.elCaptionText.textContent = caption;
  }

  updateWaypointNavHighlight(id) {
    const items = this.elWaypointList.querySelectorAll('.waypoint-nav-item');
    items.forEach(el => {
      if (el.dataset.id === id) {
        el.classList.add('active');
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        el.classList.remove('active');
      }
    });
  }

  renderAnalytics(wp) {
    this.elRightPanel.style.opacity = '0';

    setTimeout(() => {
      const statsHtml = wp.stats.map(s => `
        <div class="stat-row">
          <span class="stat-label">${s.label}</span>
          <span class="stat-value">${s.value}</span>
        </div>
      `).join('');

      this.elRightPanel.innerHTML = `
        <div class="panel-header">
          <div class="badge-row">
            <span class="pulse-beacon"></span>
            <span class="badge-text">${wp.badge}</span>
          </div>
          <h2 class="panel-title">${wp.name}</h2>
          <div class="panel-subtitle">${wp.subtitle} • <code>${wp.coords}</code></div>
        </div>

        <div class="stats-container">
          <div class="section-label">VERIFIED SATELLITE & SENSOR METRICS</div>
          ${statsHtml}
        </div>

        <div class="science-card">
          <div class="science-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 22h20L12 2zm0 4.2L18.8 19H5.2L12 6.2zM11 10h2v4h-2zm0 6h2v2h-2z"/>
            </svg>
            SCIENTIFIC ANALYSIS
          </div>
          <p class="science-body">${wp.scientificNote}</p>
        </div>

        <div class="warning-gap-card">
          <div class="warning-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            LATENCY & WARNING GAP
          </div>
          <p class="warning-body">${wp.warningGap}</p>
        </div>
      `;

      this.elRightPanel.style.opacity = '1';
    }, 120);
  }
}
