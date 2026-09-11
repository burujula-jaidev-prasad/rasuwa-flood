import { WAYPOINTS, TIMELINE_CONFIG, getTallyValues, getCurrentWaypoint, getCurrentNarration, getScenario } from './data.js';

export class UIManager {
  constructor(options) {
    this.options = options;

    this.activeWaypointId = null;
    this.isPlaying = true;
    this.speed = 1.0;
    this.isGuided = true;
    this.rainActive = true;
    this.isSidebarOpen = true;
    this.activeTab = 'impact'; // 'impact' | 'countermeasures'
    this.currentScenario = getScenario();

    this.initDOMElements();
    this.attachEventListeners();
    this.renderWaypointNav();
  }

  initDOMElements() {
    this.elIntroCard = document.getElementById('intro-card');
    this.elIntroSkip = document.getElementById('intro-skip-btn');
    this.elIntroTimer = document.getElementById('intro-timer');

    this.elBrandBadge = document.getElementById('brand-badge');
    this.elBrandTitle = document.getElementById('brand-title');
    this.elBrandSubtitle = document.getElementById('brand-subtitle');

    // KPI Command Dashboard elements
    this.elTallyEconUsd = document.getElementById('tally-econ-usd');
    this.elTallyEconNpr = document.getElementById('tally-econ-npr');
    this.elTallyEconLevel = document.getElementById('tally-econ-level');

    this.elTallySpeedMs = document.getElementById('tally-speed-ms');
    this.elTallySpeedKmh = document.getElementById('tally-speed-kmh');
    this.elTallySpeedTag = document.getElementById('tally-speed-tag');

    this.elTallyIntensityVal = document.getElementById('tally-intensity-val');
    this.elTallyIntensityTag = document.getElementById('tally-intensity-tag');
    this.elTallyPressure = document.getElementById('tally-pressure');

    this.elTallyHydroLabel = document.getElementById('tally-hydro-label');
    this.elTallyHydro = document.getElementById('tally-hydro');
    this.elTallyHydroSub = document.getElementById('tally-hydro-sub');
    this.elTallyHydroPct = document.getElementById('tally-hydro-pct');

    this.elTallyHumanLabel = document.getElementById('tally-human-label');
    this.elTallyDead = document.getElementById('tally-dead');
    this.elTallyDeadUnit = document.getElementById('tally-dead-unit');
    this.elTallyMissing = document.getElementById('tally-missing');
    this.elTallyMissingUnit = document.getElementById('tally-missing-unit');
    this.elTallyHumanRegion = document.getElementById('tally-human-region');

    this.elWaypointList = document.getElementById('waypoint-list');
    this.elRightPanel = document.getElementById('analytics-card');
    this.elRightSidebar = document.querySelector('.right-sidebar');
    this.elToggleMetricsPill = document.getElementById('toggle-metrics-pill');

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
    const waypoints = this.currentScenario.waypoints || WAYPOINTS;
    waypoints.forEach((wp) => {
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

    if (this.elToggleMetricsPill) {
      this.elToggleMetricsPill.addEventListener('click', () => {
        this.toggleSidebar(true);
      });
    }

    // Scenario switcher buttons
    const scenarioBtns = document.querySelectorAll('.scenario-btn');
    scenarioBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('disabled')) return;
        const id = btn.dataset.id;
        scenarioBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.options.onSelectScenario) {
          this.options.onSelectScenario(id);
        }
      });
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
    const isDelhi = (this.currentScenario.config.id === 'delhi');
    const isNewYork = (this.currentScenario.config.id === 'newyork');

    let clock = "08:37:00";
    if (isNewYork || isDelhi) {
      const { waypoint } = getCurrentWaypoint(t, uWave);
      clock = waypoint.realTime;
    } else {
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
    }
    this.elRealClock.textContent = clock;

    // 2. Running Tallies & KPIs strictly synced to uWave!
    const tallies = getTallyValues(t, uWave);

    // Human Toll / Evacuees
    if (this.elTallyDead) this.elTallyDead.textContent = tallies.dead.toLocaleString();
    if (this.elTallyMissing) {
      const displayMissing = (tallies.evacuated !== undefined) ? tallies.evacuated : tallies.missing;
      this.elTallyMissing.textContent = displayMissing.toLocaleString();
    }

    // Secondary Infrastructure (Subway tubes in NY vs Water works in Delhi vs Hydropower in Rasuwa)
    if (this.elTallyHydro) {
      if (isNewYork) {
        this.elTallyHydro.innerHTML = `${tallies.hydro} <small>Tubes</small>`;
      } else if (isDelhi) {
        this.elTallyHydro.innerHTML = `${tallies.waterOfflineMGD} <small>MGD</small>`;
      } else {
        this.elTallyHydro.innerHTML = `${tallies.hydro} <small>MW</small>`;
      }
    }
    if (this.elTallyHydroSub) {
      this.elTallyHydroSub.textContent = isNewYork ? '/ 7 Tubes' : (isDelhi ? '/ 234 MGD' : '/ 431 MW');
    }
    if (this.elTallyHydroPct) {
      if (isNewYork) {
        const pct = Math.round((tallies.hydro / 7) * 100);
        this.elTallyHydroPct.textContent = `${pct}% Submerged`;
      } else if (isDelhi) {
        const pct = Math.round((tallies.waterOfflineMGD / 234) * 100);
        this.elTallyHydroPct.textContent = `${pct}% Water Cut`;
      } else {
        const pct = Math.round((parseFloat(tallies.hydro) / 431) * 100);
        this.elTallyHydroPct.textContent = `${pct}% Grid Lost`;
      }
    }

    // Water Speed
    if (this.elTallySpeedMs) this.elTallySpeedMs.innerHTML = `${tallies.speedMS} <small>m/s</small>`;
    if (this.elTallySpeedKmh) this.elTallySpeedKmh.textContent = `${tallies.speedKMH} km/h`;
    if (this.elTallySpeedTag) this.elTallySpeedTag.textContent = tallies.intensityTag;

    // Intensity & Kinetic Pressure
    if (this.elTallyIntensityVal) this.elTallyIntensityVal.innerHTML = tallies.intensityVal;
    if (this.elTallyPressure) this.elTallyPressure.textContent = `${tallies.pressureKPa} kPa`;
    if (this.elTallyIntensityTag) this.elTallyIntensityTag.textContent = tallies.intensityClass.toUpperCase();

    // Economic Destruction Level
    if (this.elTallyEconUsd) {
      if (isNewYork) {
        this.elTallyEconUsd.textContent = `$${(tallies.econUSD / 1000).toFixed(1)}B`;
      } else {
        this.elTallyEconUsd.textContent = `$${tallies.econUSD}M`;
      }
    }
    if (this.elTallyEconNpr) this.elTallyEconNpr.textContent = tallies.econLocal || `${tallies.econNPR}B`;
    if (this.elTallyEconLevel) {
      this.elTallyEconLevel.textContent = tallies.econLevel;
      this.elTallyEconLevel.className = `kpi-badge badge-econ level-${tallies.econClass}`;
    }

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
    if (!this.elRightPanel) return;
    this.elRightPanel.style.opacity = '0';

    setTimeout(() => {
      const statsHtml = wp.stats.map(s => `
        <div class="stat-row">
          <span class="stat-label">${s.label}</span>
          <span class="stat-value">${s.value}</span>
        </div>
      `).join('');

      let contentHtml = '';
      if (this.activeTab === 'impact') {
        contentHtml = `
          <div class="stats-container">
            <div class="section-label">VERIFIED METRICS & SENSOR READOUT</div>
            ${statsHtml}
          </div>

          <details class="compact-detail science-detail">
            <summary class="detail-summary">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 22h20L12 2zm0 4.2L18.8 19H5.2L12 6.2zM11 10h2v4h-2zm0 6h2v2h-2z"/>
              </svg>
              <span>Scientific Analysis</span>
            </summary>
            <p class="detail-body">${wp.scientificNote}</p>
          </details>

          <details class="compact-detail warning-detail">
            <summary class="detail-summary">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>Early Warning Gap</span>
            </summary>
            <p class="detail-body">${wp.warningGap}</p>
          </details>
        `;
      } else {
        // Countermeasures & Municipal Defense Telemetry
        const readiness = wp.countermeasure?.readiness || '75%';
        contentHtml = `
          <div class="countermeasure-container">
            <div class="countermeasure-status-row">
              <span class="defense-pulse"></span>
              <span class="defense-status-text">${wp.countermeasure?.status || 'Active Monitoring'}</span>
            </div>
            
            <div class="readiness-box">
              <div class="readiness-label-row">
                <span>Municipal Defense Readiness</span>
                <strong>${readiness}</strong>
              </div>
              <div class="readiness-track">
                <div class="readiness-fill" style="width: ${readiness};"></div>
              </div>
            </div>

            <div class="countermeasure-action-box">
              <div class="action-heading">EMERGENCY MITIGATION ACTION</div>
              <p class="action-text">${wp.countermeasure?.action || 'Coordinated emergency response deployed.'}</p>
            </div>

            <div class="agency-deployment-box">
              <div class="action-heading">AGENCIES DEPLOYED</div>
              <div class="agency-tags">
                ${this.getAgencyTagsHtml()}
              </div>
            </div>
          </div>
        `;
      }

      this.elRightPanel.innerHTML = `
        <div class="panel-header">
          <div class="header-top-row">
            <div class="badge-row">
              <span class="pulse-beacon"></span>
              <span class="badge-text">${wp.badge}</span>
            </div>
            <button class="panel-close-btn" id="panel-close-btn" title="Minimize Info Panel">✕</button>
          </div>
          <h2 class="panel-title">${wp.name}</h2>
          <div class="panel-subtitle">${wp.subtitle} • <code>${wp.coords}</code></div>

          <div class="panel-tabs">
            <button class="panel-tab ${this.activeTab === 'impact' ? 'active' : ''}" id="tab-impact-btn">Impact Readout</button>
            <button class="panel-tab ${this.activeTab === 'countermeasures' ? 'active' : ''}" id="tab-counter-btn">City Defenses 🛡️</button>
          </div>
        </div>

        ${contentHtml}
      `;

      // Re-attach close button listener
      const closeBtn = document.getElementById('panel-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          this.toggleSidebar(false);
        });
      }

      // Attach Tab Listeners
      const tabImpact = document.getElementById('tab-impact-btn');
      const tabCounter = document.getElementById('tab-counter-btn');

      if (tabImpact) {
        tabImpact.addEventListener('click', () => {
          this.activeTab = 'impact';
          this.renderAnalytics(wp);
        });
      }
      if (tabCounter) {
        tabCounter.addEventListener('click', () => {
          this.activeTab = 'countermeasures';
          this.renderAnalytics(wp);
        });
      }

      this.elRightPanel.style.opacity = '1';
    }, 80);
  }

  toggleSidebar(show) {
    this.isSidebarOpen = show;
    if (this.elRightSidebar) {
      this.elRightSidebar.style.display = show ? 'flex' : 'none';
    }
    if (this.elToggleMetricsPill) {
      this.elToggleMetricsPill.style.display = show ? 'none' : 'flex';
    }
  }

  setScenario(id) {
    this.currentScenario = getScenario(id);
    this.activeWaypointId = null;

    if (this.elBrandTitle) {
      this.elBrandTitle.textContent = this.currentScenario.config.name + ': ' + this.currentScenario.config.hazard;
    }
    if (this.elBrandSubtitle) {
      this.elBrandSubtitle.textContent = this.currentScenario.config.tagline;
    }
    if (this.elBrandBadge) {
      this.elBrandBadge.textContent = 'Forecasting Simulator';
    }

    if (id === 'newyork') {
      if (this.elTallyHydroLabel) this.elTallyHydroLabel.textContent = 'Subways Flooded';
      if (this.elTallyHumanLabel) this.elTallyHumanLabel.textContent = 'Coastal Impact';
      if (this.elTallyDeadUnit) this.elTallyDeadUnit.textContent = 'fatalities';
      if (this.elTallyMissingUnit) this.elTallyMissingUnit.textContent = 'displaced';
      if (this.elTallyHumanRegion) this.elTallyHumanRegion.textContent = 'NYC Metro & Harbor';
    } else if (id === 'delhi') {
      if (this.elTallyHydroLabel) this.elTallyHydroLabel.textContent = 'Works Offline';
      if (this.elTallyHumanLabel) this.elTallyHumanLabel.textContent = 'Human Impact';
      if (this.elTallyDeadUnit) this.elTallyDeadUnit.textContent = 'drowned';
      if (this.elTallyMissingUnit) this.elTallyMissingUnit.textContent = 'evacuated';
      if (this.elTallyHumanRegion) this.elTallyHumanRegion.textContent = 'Yamuna Corridor';
    } else {
      if (this.elTallyHydroLabel) this.elTallyHydroLabel.textContent = 'Hydro Offline';
      if (this.elTallyHumanLabel) this.elTallyHumanLabel.textContent = 'Human Toll';
      if (this.elTallyDeadUnit) this.elTallyDeadUnit.textContent = 'dead';
      if (this.elTallyMissingUnit) this.elTallyMissingUnit.textContent = 'missing';
      if (this.elTallyHumanRegion) this.elTallyHumanRegion.textContent = 'Trishuli Corridor';
    }

    this.renderWaypointNav();
    if (this.currentScenario.waypoints && this.currentScenario.waypoints.length > 0) {
      this.renderAnalytics(this.currentScenario.waypoints[0]);
    }
  }

  getAgencyTagsHtml() {
    const id = this.currentScenario?.config?.id;
    if (id === 'newyork') {
      return `
        <span class="agency-badge">USACE</span>
        <span class="agency-badge">FEMA</span>
        <span class="agency-badge">MTA</span>
        <span class="agency-badge">FDNY Marine</span>
        <span class="agency-badge">NYC OEM</span>
      `;
    } else if (id === 'delhi') {
      return `
        <span class="agency-badge">NDRF</span>
        <span class="agency-badge">Army Corps</span>
        <span class="agency-badge">DJB</span>
        <span class="agency-badge">CWC</span>
      `;
    } else {
      return `
        <span class="agency-badge">Nepal Army</span>
        <span class="agency-badge">APF</span>
        <span class="agency-badge">NEA</span>
        <span class="agency-badge">DHM</span>
      `;
    }
  }
}
