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
    this.renderIntroFlyer(this.currentScenario?.config?.id || 'newyork');
  }

  initDOMElements() {
    this.elIntroCard = document.getElementById('intro-card');
    this.elIntroSkip = document.getElementById('intro-skip-btn');
    this.elIntroOrbitBtn = document.getElementById('intro-orbit-btn');
    this.elFlyerCloseBtn = document.getElementById('flyer-close-btn');
    this.elOpenFlyerBtn = document.getElementById('open-flyer-btn');

    this.elFlyerTag = document.getElementById('flyer-tag');
    this.elFlyerDocId = document.getElementById('flyer-doc-id');
    this.elFlyerTitle = document.getElementById('flyer-title');
    this.elFlyerSubtitle = document.getElementById('flyer-subtitle');
    this.elFlyerMetricsGrid = document.getElementById('flyer-metrics-grid');
    this.elFlyerTimeline = document.getElementById('flyer-timeline');
    this.elFlyerAlertText = document.getElementById('flyer-alert-text');

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
    if (this.elIntroSkip) {
      this.elIntroSkip.addEventListener('click', () => {
        this.hideIntroCard();
        if (this.options.onStartSimulation) {
          this.options.onStartSimulation();
        }
      });
    }

    if (this.elIntroOrbitBtn) {
      this.elIntroOrbitBtn.addEventListener('click', () => {
        this.hideIntroCard();
        this.setViewMode('free');
        if (this.options.onSelectViewMode) {
          this.options.onSelectViewMode('free');
        }
      });
    }

    if (this.elFlyerCloseBtn) {
      this.elFlyerCloseBtn.addEventListener('click', () => {
        this.hideIntroCard();
      });
    }

    if (this.elOpenFlyerBtn) {
      this.elOpenFlyerBtn.addEventListener('click', () => {
        this.showIntroCard();
      });
    }

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

    if (this.elGuidedBtn) {
      this.elGuidedBtn.addEventListener('click', () => {
        this.isGuided = !this.isGuided;
        this.updateGuidedBtnState();
        if (this.options.onToggleGuided) {
          this.options.onToggleGuided(this.isGuided);
        }
      });
    }

    // Multiple Director View Buttons (Top, Left, Chaser, Isometric, Free Orbit)
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-view');
        this.setViewMode(mode);
        if (this.options.onSelectViewMode) {
          this.options.onSelectViewMode(mode);
        }
      });
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
    if (!this.elGuidedBtn) return;
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

  setGuided(guided, mode = null) {
    this.isGuided = guided;
    this.updateGuidedBtnState();
    if (!guided) {
      this.setViewMode('free');
    } else if (mode) {
      this.setViewMode(mode);
    }
  }

  setViewMode(mode) {
    this.currentViewMode = mode;
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === mode);
    });
  }

  showIntroCard() {
    if (this.elIntroCard) {
      this.elIntroCard.classList.remove('hidden');
    }
  }

  hideIntroCard() {
    if (this.elIntroCard) {
      this.elIntroCard.classList.add('hidden');
    }
  }

  renderIntroFlyer(scenarioId) {
    if (!this.elFlyerTitle) return;

    const flyerData = {
      newyork: {
        tag: 'NOAA / NHC SLOSH SIMULATION',
        docId: 'DOC-ID: NY-SANDY2-2026',
        title: 'New York: Category-4 Hurricane Surge & Harbor Deluge',
        subtitle: 'Compound Astronomical High Tide, Atlantic Funneling & Lower Manhattan Inundation',
        metrics: [
          { label: 'Sudden Casualty Toll', val: '1,480 Fatalities', sub: '3,850 Missing / Trapped', color: 'red' },
          { label: 'Peak Surge Crest', val: '4.82 m <small>(15.8 ft)</small>', sub: 'NAVD88 High Watermark', color: 'amber' },
          { label: 'Peak Forward Speed', val: '13.2 m/s <small>(47.5 km/h)</small>', sub: 'Upper Bay Fairway', color: 'cyan' },
          { label: 'Transit Paralysis', val: '7 Transit Tubes', sub: '14.5M gal Brine Influx', color: 'yellow' }
        ],
        steps: [
          {
            num: '01',
            time: '06:30 AM',
            title: 'Atlantic Surge Funneling & Liberty Island',
            desc: 'A 15.8-foot storm surge funnels through The Narrows into Upper New York Bay at 48 km/h, sweeping past Liberty Island and battering the harbor piers.'
          },
          {
            num: '02',
            time: '07:15 AM',
            title: 'South Ferry & Vessels Torn Adrift',
            desc: 'Mooring hawsers snap under extreme hydrodynamic surge; the Staten Island Ferry and NYC Fast Catamaran break free from Whitehall slips, listing violently (44°–53°) as seawater inundates vehicle decks, radar masts snap, smokestacks dislodge, and passenger boarding aprons crash into the bay.'
          },
          {
            num: '03',
            time: '07:45 AM',
            title: 'The Battery & Financial District Seawall Breach',
            desc: 'A 14.9-ft surge crest overtops the Lower Manhattan perimeter granite seawall, inundating Battery Park promenade, Bowling Green, and Wall Street financial basements.'
          },
          {
            num: '04',
            time: '08:15 AM',
            title: 'Subterranean Transit Paralysis',
            desc: 'Seawater cascades down sidewalk ventilation grates and station entrances, completely submerging the South Ferry terminal and drowning 7 under-river subway tubes.'
          },
          {
            num: '05',
            time: '09:00 AM',
            title: 'ConEd 14th St Grid Explosion & Blackout',
            desc: 'East River floodwaters inundate the ConEd 14th St Substation, generating an explosive 345 kV transformer arc-flash and plunging Lower Manhattan into a total electrical blackout.'
          }
        ],
        alert: '<strong>Core Scientific Finding:</strong> A sudden rapid-onset surge during morning rush hour without 48-hour advance transit shutdown creates an unevacuated subterranean entrapment disaster. Inundating 7 subway tubes and low-lying coastal basements causes sudden catastrophic mass casualties (1,480 dead, 3,850 missing), comparable to the violent flash deluges of mountain outburst floods.'
      },
      delhi: {
        tag: 'CWC / DJB MONSOON MODEL',
        docId: 'DOC-ID: DL-YAMUNA-2023',
        title: 'Delhi: Yamuna River Record Monsoon Inundation',
        subtitle: 'Hathnikund Barrage Discharge, Floodplain Encroachment & ITO Barrage Siltation',
        metrics: [
          { label: 'Peak River Stage', val: '208.66 m', sub: 'Record Watermark (+3.33m Danger)', color: 'amber' },
          { label: 'Peak Discharge', val: '359,000 cusecs', sub: 'Hathnikund Release', color: 'cyan' },
          { label: 'Water Plants Offline', val: '3 Mega Works', sub: '234 MGD (25% Capital Supply)', color: 'red' },
          { label: 'Displaced Population', val: '27,000+ Evacuated', sub: 'Yamuna Floodplain Relief Camps', color: 'yellow' }
        ],
        steps: [
          {
            num: '01',
            time: 'Day 1 09:00',
            title: 'Hathnikund Barrage Discharge Surge',
            desc: 'Upper catchment cloudbursts in Himachal trigger 3.59 lakh cusecs emergency release down the Yamuna riverbed.'
          },
          {
            num: '02',
            time: 'Day 2 13:00',
            title: 'Old Railway Bridge Danger Mark Exceeded',
            desc: 'River crosses the 205.33m danger mark, halting railway transit and submerging low-lying agricultural floodplains.'
          },
          {
            num: '03',
            time: 'Day 3 07:00',
            title: 'Wazirabad & Chandrawal Water Works Flooded',
            desc: 'Submerged raw water pump houses force shutdown of key water treatment plants, cutting drinking water to Central Delhi.'
          },
          {
            num: '04',
            time: 'Day 3 16:30',
            title: 'ITO Barrage Silted Gates & Regulator Breach',
            desc: 'Jammed barrage gates back up floodwaters into Drain 12, inundating the Vikas Marg arterial corridor and Supreme Court.'
          },
          {
            num: '05',
            time: 'Day 4 10:00',
            title: 'Red Fort & Ring Road Submergence',
            desc: 'Floodwaters breach historical bastions around Red Fort and completely shut down Delhi’s Ring Road.'
          }
        ],
        alert: '<strong>Core Scientific Finding:</strong> Decades of heavy siltation and narrowed floodplain development reduced the Yamuna’s discharge cross-section by 42%, causing flash ponding at much lower discharge rates than 1978.'
      },
      rasuwa: {
        tag: 'DHM / ICIMOD GLOF MODEL',
        docId: 'DOC-ID: NP-BHOTEKOSHI-2026',
        title: 'Rasuwa: Langtang Avalanche & Dam-Burst',
        subtitle: 'Glacial Hanging Serac Calving, Transient Damming & Supercritical Debris Surge',
        metrics: [
          { label: 'Peak Wave Velocity', val: '28.5 m/s <small>(102 km/h)</small>', sub: 'Supercritical Chasm Flow', color: 'amber' },
          { label: 'Peak Discharge', val: '4,200 m³/s', sub: 'Trishuli Gorge Outburst', color: 'cyan' },
          { label: 'Hydro Capacity Lost', val: '111 MW Offline', sub: 'Trishuli & Chilime Cascades', color: 'red' },
          { label: 'Human Toll', val: '175 Dead / Missing', sub: 'Settlements & Trade Route Swept', color: 'yellow' }
        ],
        steps: [
          {
            num: '01',
            time: '08:37 AM',
            title: 'Glacial Hanging Serac Avalanche',
            desc: 'A massive 4.2M m³ ice and rock avalanche shears off Langtang Lirung, slamming into the upper river gorge.'
          },
          {
            num: '02',
            time: '08:44 AM',
            title: 'Transient Debris Dam Failure',
            desc: 'Landslide dam blocks the Bhotekoshi River for 7 minutes before bursting in an explosive debris wave.'
          },
          {
            num: '03',
            time: '08:50 AM',
            title: 'Supercritical Debris Torrent',
            desc: 'A 14-meter sediment-choked slurry wave roars down the steep canyon at over 100 km/h.'
          },
          {
            num: '04',
            time: '09:05 AM',
            title: 'Hydropower Headworks Destruction',
            desc: 'The surge completely obliterates diversion weirs, intake portals, and steel suspension bridges.'
          },
          {
            num: '05',
            time: '09:20 AM',
            title: 'Syabrubesi Settlement & Highway Swept',
            desc: 'The trade corridor to the China border is severed as riverside homes and piers are wiped away.'
          }
        ],
        alert: '<strong>Core Scientific Finding:</strong> Steep Himalayan gradients and high sediment load multiply dynamic impact pressures by 400%, pulverizing reinforced concrete structures in seconds.'
      },
      beijing: {
        tag: 'MEM / BEIJING WATER AUTHORITY',
        docId: 'DOC-ID: BJ-DOKSURI-2023',
        title: 'Beijing: Mentougou Mountain Flash Deluge & Yongding Flood',
        subtitle: 'Typhoon Doksuri Orographic Convergence & Western Mountain Ravine Flooding',
        metrics: [
          { label: 'Record Precipitation', val: '744.8 mm', sub: 'Wangjiayuan 40-hr Peak', color: 'amber' },
          { label: 'Mountain Surge Speed', val: '14.5 m/s <small>(52 km/h)</small>', sub: 'Mentougou Ravine Inflow', color: 'cyan' },
          { label: 'Bridges Severed', val: '12 Highway Spans', sub: 'National Highway G109 Cut', color: 'red' },
          { label: 'Evacuated Population', val: '127,000 People', sub: 'Western Mountain Outskirts', color: 'yellow' }
        ],
        steps: [
          {
            num: '01',
            time: 'Day 1 04:00',
            title: 'Orographic Convergence Cloudburst',
            desc: 'Moist Pacific airflow collides with the Taihang Mountains, dropping 140mm/hr rainfall across Mentougou.'
          },
          {
            num: '02',
            time: 'Day 1 10:30',
            title: 'Mentougou Mountain Ravines Flash Deluge',
            desc: 'Water rushes down dry ravines, sweeping away parked vehicles, communication towers, and riverside homes.'
          },
          {
            num: '03',
            time: 'Day 1 15:00',
            title: 'National Highway 109 & Rail Links Cut',
            desc: 'Mudslides and flash torrents sever key logistical lifelines into western mountain districts.'
          },
          {
            num: '04',
            time: 'Day 2 08:00',
            title: 'Yongding River Flood Detention Inundation',
            desc: 'Emergency diversion gates open into the Lugou Bridge detention basin to protect central Beijing.'
          },
          {
            num: '05',
            time: 'Day 2 18:00',
            title: 'Downstream Industrial Basin Inundation',
            desc: 'Surplus waters inundate farmland and industrial parks in Fangshan and Zhuozhou downstream.'
          }
        ],
        alert: '<strong>Core Scientific Finding:</strong> Steep mountain-to-plain transition zones concentrate cloudburst runoff into violent debris torrents with less than 45 minutes of hydrological warning time.'
      },
      tokyo: {
        tag: 'MLIT / TOKYO METRO DISASTER',
        docId: 'DOC-ID: TK-ARAKAWA-2026',
        title: 'Tokyo: Arakawa River Deluge & G-CANS Subterranean Defense',
        subtitle: 'Super Typhoon Inflow, Zero-Meter Lowland Shielding & Subterranean Diversion',
        metrics: [
          { label: '72-hr Typhoon Runoff', val: '1,200 mm', sub: 'Kanto Basin Precipitation', color: 'amber' },
          { label: 'G-CANS Diversion Rate', val: '200 m³/s', sub: 'Gas Turbine Pumping into Edo', color: 'cyan' },
          { label: 'Zero-Meter Shielding', val: '1.5M Residents', sub: 'Koto 5 Wards Protected', color: 'red' },
          { label: 'Edogawa Surge Crest', val: '5.2 m High Water', sub: 'Tokyo Bay Estuary', color: 'yellow' }
        ],
        steps: [
          {
            num: '01',
            time: '06:00 AM',
            title: 'Super Typhoon Landfall Over Kanto Plain',
            desc: 'Unprecedented rainfall saturates upper river basins; Arakawa discharge rises toward historic crest.'
          },
          {
            num: '02',
            time: '08:30 AM',
            title: 'G-CANS Underground Cathedral Activation',
            desc: 'Massive vertical intake shafts divert overflowing tributary rivers 50 meters below ground.'
          },
          {
            num: '03',
            time: '10:00 AM',
            title: 'Jet Pumping into Edo River Outfall',
            desc: 'Aviation-derivative gas turbine pumps expel 200 m³/s of floodwater directly into the wider Edo River.'
          },
          {
            num: '04',
            time: '11:45 AM',
            title: 'Super-Levees Tested Along Koto Lowlands',
            desc: 'High-elevation reinforced super-levees prevent breaches into Tokyo’s below-sea-level urban wards.'
          },
          {
            num: '05',
            time: '02:00 PM',
            title: 'Tokyo Metro Subway Flood Shielding',
            desc: 'Watertight subterranean bulkheads seal subway portals, ensuring zero inundation of the transit network.'
          }
        ],
        alert: '<strong>Core Scientific Finding:</strong> Coordinated subterranean engineering (G-CANS) and super-levees prevent a 10-meter catastrophic inundation of Eastern Tokyo where 1.5 million people reside below sea level.'
      },
      london: {
        tag: 'ENVIRONMENT AGENCY / TFL EMERGENCY',
        docId: 'DOC-ID: LD-THAMES-2026',
        title: 'London: North Sea Tidal Surge & Thames Barrier Defense',
        subtitle: 'Funneling North Sea Surge, Astronomical High Tide & Barrier Gate Emergency Seal',
        metrics: [
          { label: 'Barrier Gate Defense', val: '10 Sector Gates', sub: 'Rotating Hollow Steel Spans', color: 'amber' },
          { label: 'Protected Population', val: '1.4M People', sub: 'Central London Floodplain', color: 'cyan' },
          { label: 'Asset Value Defended', val: '£320 Billion', sub: 'Parliament, City & Docklands', color: 'red' },
          { label: 'Surge Watermark', val: '5.4 m Above ODN', sub: 'Silvertown Outer Estuary', color: 'yellow' }
        ],
        steps: [
          {
            num: '01',
            time: '05:30 AM',
            title: 'North Sea Surge Funneling into Thames Estuary',
            desc: 'A shallow Atlantic low-pressure depression drives a 3.8-meter tidal swell into the narrowing Thames funnel.'
          },
          {
            num: '02',
            time: '07:00 AM',
            title: 'Thames Barrier Emergency Closure Commences',
            desc: 'Hydraulic trunnions rotate 10 massive hollow steel gates into an upright defensive posture across 520 meters.'
          },
          {
            num: '03',
            time: '08:45 AM',
            title: 'Surge Crest Repelled at Silvertown',
            desc: 'The barrier holds back a 5.4m surge crest, creating a 3.2m water level differential between upstream and downstream.'
          },
          {
            num: '04',
            time: '10:00 AM',
            title: 'Central London Embankment Protection',
            desc: 'The Houses of Parliament, Westminster, and Tower Bridge embankments remain safely dry.'
          },
          {
            num: '05',
            time: '12:30 PM',
            title: 'Tide Ebb & Controlled Gate Recess',
            desc: 'As astronomical tide ebbs into the North Sea, barrier gates rotate back into their submerged riverbed recesses.'
          }
        ],
        alert: '<strong>Core Scientific Finding:</strong> The funnel geometry of the southern North Sea amplifies tidal surges by up to 200%. The Thames Barrier prevents overtopping of 42 London Underground stations and £320B in economic assets.'
      }
    };

    const d = flyerData[scenarioId] || flyerData.newyork;

    if (this.elFlyerTag) this.elFlyerTag.textContent = d.tag;
    if (this.elFlyerDocId) this.elFlyerDocId.textContent = d.docId;
    if (this.elFlyerTitle) this.elFlyerTitle.textContent = d.title;
    if (this.elFlyerSubtitle) this.elFlyerSubtitle.textContent = d.subtitle;

    if (this.elFlyerMetricsGrid) {
      this.elFlyerMetricsGrid.innerHTML = d.metrics.map(m => `
        <div class="flyer-metric-card">
          <span class="fmc-label">${m.label}</span>
          <span class="fmc-val ${m.color}">${m.val}</span>
          <span class="fmc-sub">${m.sub}</span>
        </div>
      `).join('');
    }

    if (this.elFlyerTimeline) {
      this.elFlyerTimeline.innerHTML = d.steps.map(s => `
        <div class="flyer-step">
          <span class="fstep-num">${s.num}</span>
          <div class="fstep-content">
            <span class="fstep-time">${s.time}</span>
            <strong>${s.title}:</strong>
            ${s.desc}
          </div>
        </div>
      `).join('');
    }

    if (this.elFlyerAlertText) {
      this.elFlyerAlertText.innerHTML = d.alert;
    }
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
    const isBeijing = (this.currentScenario.config.id === 'beijing');
    const isTokyo = (this.currentScenario.config.id === 'tokyo');
    const isLondon = (this.currentScenario.config.id === 'london');

    let clock = "08:37:00";
    if (isNewYork || isDelhi || isBeijing || isTokyo || isLondon) {
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
      const isMissingUnit = (this.elTallyMissingUnit && this.elTallyMissingUnit.textContent.trim().toLowerCase() === 'missing');
      const displayMissing = isMissingUnit
        ? (tallies.missing !== undefined ? tallies.missing : tallies.evacuated)
        : (tallies.evacuated !== undefined ? tallies.evacuated : tallies.missing);
      this.elTallyMissing.textContent = (displayMissing || 0).toLocaleString();
    }
    if (this.elTallyHumanRegion) {
      if (tallies.dead === 0) {
        if (tallies.evacuated > 0) {
          this.elTallyHumanRegion.textContent = 'Evacuating (0 Deaths)';
        } else {
          this.elTallyHumanRegion.textContent = 'Pre-Disaster (0 Deaths)';
        }
      } else {
        if (isNewYork) {
          this.elTallyHumanRegion.textContent = 'NYC Coastal Losses';
        } else if (isLondon) {
          this.elTallyHumanRegion.textContent = 'Thames Basin';
        } else if (isTokyo) {
          this.elTallyHumanRegion.textContent = 'Koto 5 Wards';
        } else if (isBeijing) {
          this.elTallyHumanRegion.textContent = 'Mentougou & Basin';
        } else if (isDelhi) {
          this.elTallyHumanRegion.textContent = 'Yamuna Corridor';
        } else {
          this.elTallyHumanRegion.textContent = 'Trishuli Corridor';
        }
      }
    }

    // Secondary Infrastructure (Tubes in London/NY vs Highways in Beijing vs G-CANS in Tokyo vs Water works in Delhi vs Hydropower in Rasuwa)
    if (this.elTallyHydro) {
      if (isLondon) {
        this.elTallyHydro.innerHTML = `${tallies.hydro} <small>Tubes</small>`;
      } else if (isTokyo) {
        this.elTallyHydro.innerHTML = `${tallies.hydro} <small>M m³</small>`;
      } else if (isNewYork) {
        this.elTallyHydro.innerHTML = `${tallies.hydro} <small>Tubes</small>`;
      } else if (isBeijing) {
        this.elTallyHydro.innerHTML = `${tallies.hydro} <small>km</small>`;
      } else if (isDelhi) {
        this.elTallyHydro.innerHTML = `${tallies.waterOfflineMGD} <small>MGD</small>`;
      } else {
        this.elTallyHydro.innerHTML = `${tallies.hydro} <small>MW</small>`;
      }
    }
    if (this.elTallyHydroSub) {
      this.elTallyHydroSub.textContent = isLondon ? '/ 16 Tubes' : (isTokyo ? '/ 14.5M m³' : (isNewYork ? '/ 7 Tubes' : (isBeijing ? '/ 1,050 km' : (isDelhi ? '/ 234 MGD' : '/ 431 MW'))));
    }
    if (this.elTallyHydroPct) {
      if (isLondon) {
        const pct = Math.round((tallies.hydro / 16) * 100);
        this.elTallyHydroPct.textContent = `${pct}% Sealed`;
      } else if (isTokyo) {
        const pct = Math.round((tallies.hydro / 14.5) * 100);
        this.elTallyHydroPct.textContent = `${pct}% Diverted`;
      } else if (isNewYork) {
        const pct = Math.round((tallies.hydro / 7) * 100);
        this.elTallyHydroPct.textContent = `${pct}% Submerged`;
      } else if (isBeijing) {
        const pct = Math.round((tallies.hydro / 1050) * 100);
        this.elTallyHydroPct.textContent = `${pct}% Severed`;
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
      if (isLondon || isTokyo || isNewYork || isBeijing) {
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

    if (id === 'london') {
      if (this.elTallyHydroLabel) this.elTallyHydroLabel.textContent = 'Tube Armor';
      if (this.elTallyHumanLabel) this.elTallyHumanLabel.textContent = 'Floodplain Impact';
      if (this.elTallyDeadUnit) this.elTallyDeadUnit.textContent = 'fatalities';
      if (this.elTallyMissingUnit) this.elTallyMissingUnit.textContent = 'evacuated';
      if (this.elTallyHumanRegion) this.elTallyHumanRegion.textContent = 'Thames Basin';
    } else if (id === 'tokyo') {
      if (this.elTallyHydroLabel) this.elTallyHydroLabel.textContent = 'G-CANS Diverted';
      if (this.elTallyHumanLabel) this.elTallyHumanLabel.textContent = 'Zero-Meter Impact';
      if (this.elTallyDeadUnit) this.elTallyDeadUnit.textContent = 'fatalities';
      if (this.elTallyMissingUnit) this.elTallyMissingUnit.textContent = 'evacuated';
      if (this.elTallyHumanRegion) this.elTallyHumanRegion.textContent = 'Koto 5 Wards';
    } else if (id === 'beijing') {
      if (this.elTallyHydroLabel) this.elTallyHydroLabel.textContent = 'Highways Cut';
      if (this.elTallyHumanLabel) this.elTallyHumanLabel.textContent = 'Capital Impact';
      if (this.elTallyDeadUnit) this.elTallyDeadUnit.textContent = 'fatalities';
      if (this.elTallyMissingUnit) this.elTallyMissingUnit.textContent = 'evacuated';
      if (this.elTallyHumanRegion) this.elTallyHumanRegion.textContent = 'Mentougou & Basin';
    } else if (id === 'newyork') {
      if (this.elTallyHydroLabel) this.elTallyHydroLabel.textContent = 'Subways Flooded';
      if (this.elTallyHumanLabel) this.elTallyHumanLabel.textContent = 'Sudden Deluge Toll';
      if (this.elTallyDeadUnit) this.elTallyDeadUnit.textContent = 'fatalities';
      if (this.elTallyMissingUnit) this.elTallyMissingUnit.textContent = 'missing';
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
    this.renderIntroFlyer(id);
    if (this.currentScenario.waypoints && this.currentScenario.waypoints.length > 0) {
      this.renderAnalytics(this.currentScenario.waypoints[0]);
    }

    // Update scenario button active states
    const scenarioBtns = document.querySelectorAll('.scenario-btn');
    scenarioBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.id === id);
    });

    // Reset and initialize UI to pre-disaster baseline (t = 0, uWave = 0)
    this.update(0.0, 0, 0);
  }

  getAgencyTagsHtml() {
    const id = this.currentScenario?.config?.id;
    if (id === 'london') {
      return `
        <span class="agency-badge">Environment Agency</span>
        <span class="agency-badge">TfL Emergency</span>
        <span class="agency-badge">Met Police Marine</span>
        <span class="agency-badge">Port of London</span>
        <span class="agency-badge">RNLI</span>
      `;
    } else if (id === 'tokyo') {
      return `
        <span class="agency-badge">MLIT</span>
        <span class="agency-badge">JSDF 1st Div</span>
        <span class="agency-badge">Tokyo Metro</span>
        <span class="agency-badge">Tokyo Fire Dept</span>
        <span class="agency-badge">JMA</span>
      `;
    } else if (id === 'beijing') {
      return `
        <span class="agency-badge">PLA Army</span>
        <span class="agency-badge">PAP</span>
        <span class="agency-badge">MEM</span>
        <span class="agency-badge">Beijing Water</span>
        <span class="agency-badge">China Railway</span>
      `;
    } else if (id === 'newyork') {
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
