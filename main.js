import * as THREE from 'three';
import { RiverSystem } from './src/river.js';
import { createTerrain } from './src/terrain.js';
import { FloodSimulation } from './src/simulation.js';
import { CameraDirector } from './src/camera.js';
import { UIManager } from './src/ui.js';
import { TIMELINE_CONFIG, getScenario, setCurrentScenarioId, getCurrentScenarioId } from './src/data.js';
import { Google3DTilesManager } from './src/scenarios/google_3dtiles.js';

class ExplainerApp {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.clock = new THREE.Clock();

    // Parse URL query parameter (e.g. ?scenario=newyork, ?scenario=delhi, ?scenario=nepal) or hash
    const urlParams = new URLSearchParams(window.location.search);
    const rawHash = window.location.hash.replace('#', '').toLowerCase();
    const rawParam = urlParams.get('scenario')?.toLowerCase();
    const aliasMap = { nepal: 'rasuwa', ny: 'newyork' };
    const resolvedInput = aliasMap[rawParam] || rawParam || aliasMap[rawHash] || rawHash;

    const validScenarios = ['delhi', 'newyork', 'rasuwa'];
    const requestedScenario = (resolvedInput && validScenarios.includes(resolvedInput))
      ? resolvedInput
      : 'delhi'; // Default to Delhi with direct one-click access to New York & Nepal

    this.currentScenarioId = requestedScenario;
    setCurrentScenarioId(requestedScenario);

    // Google Photorealistic 3D Tiles State
    this.isGoogle3DActive = false;
    this.google3DManager = null;

    // Timeline state
    this.t = 0.0;
    this.isPlaying = false; // Starts paused until intro card dismisses
    this.speed = 1.0;
    this.introElapsed = 0.0;
    this.introDismissed = false;

    this.initThree();
    this.initEnvironment();
    this.initSceneObjects();
    this.initUI();

    // Check if real 3D photogrammetry is requested via URL (?3d=true or ?googleKey=...)
    if (urlParams.get('3d') === 'true' || urlParams.get('map') === 'google' || urlParams.has('googleKey')) {
      if (this.currentScenarioId === 'newyork') {
        this.enableGoogle3D();
      }
    }

    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }

  initThree() {
    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1.0,
      1200
    );

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);
  }

  initEnvironment() {
    // 1. Sky vertical gradient
    const skyGeo = new THREE.SphereGeometry(600, 32, 32);
    skyGeo.scale(-1, 1, 1);

    const initialScenario = getScenario(this.currentScenarioId);
    const env = initialScenario.config.environment;

    this.skyMat = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(env.skyTop) },
        midColor1: { value: new THREE.Color(env.skyMid1) },
        midColor2: { value: new THREE.Color(env.skyMid2) },
        bottomColor: { value: new THREE.Color(env.skyBottom) },
        sunPosition: { value: new THREE.Vector3(env.sunPosition[0], env.sunPosition[1], env.sunPosition[2]).normalize() }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 midColor1;
        uniform vec3 midColor2;
        uniform vec3 bottomColor;
        uniform vec3 sunPosition;
        varying vec3 vWorldPosition;

        void main() {
          vec3 dir = normalize(vWorldPosition);
          float y = clamp(dir.y, 0.0, 1.0);

          vec3 sky;
          if (y > 0.6) {
            sky = mix(midColor1, topColor, (y - 0.6) / 0.4);
          } else if (y > 0.25) {
            sky = mix(midColor2, midColor1, (y - 0.25) / 0.35);
          } else {
            sky = mix(bottomColor, midColor2, y / 0.25);
          }

          float sunDot = max(0.0, dot(dir, sunPosition));
          float sunGlow = pow(sunDot, 120.0) * 1.6;
          vec3 sunCol = vec3(1.0, 0.95, 0.85);

          gl_FragColor = vec4(sky + sunCol * sunGlow, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false
    });

    const skyMesh = new THREE.Mesh(skyGeo, this.skyMat);
    this.scene.add(skyMesh);

    // 2. Fog
    const fogColor = new THREE.Color(env.fogColor);
    this.scene.fog = new THREE.Fog(fogColor, env.fogNear, env.fogFar);

    // 3. Directional Sun Light
    this.sunLight = new THREE.DirectionalLight(env.sunColor, env.sunIntensity);
    this.sunLight.position.set(-180, 240, -120);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 50;
    this.sunLight.shadow.camera.far = 650;
    this.sunLight.shadow.camera.left = -160;
    this.sunLight.shadow.camera.right = 160;
    this.sunLight.shadow.camera.top = 160;
    this.sunLight.shadow.camera.bottom = -160;
    this.sunLight.shadow.bias = -0.0008;
    this.scene.add(this.sunLight);

    // 4. Ambient / Hemisphere Light
    this.hemiLight = new THREE.HemisphereLight(0x9fb3c0, 0x33513c, 0.85);
    this.scene.add(this.hemiLight);

    // 5. Fill Light
    this.fillLight = new THREE.DirectionalLight(0x6fc0ea, 0.4);
    this.fillLight.position.set(120, 80, 140);
    this.scene.add(this.fillLight);
  }

  updateEnvironmentForScenario(scenario) {
    const env = scenario.config.environment;
    const isNY = (scenario.config.id === 'newyork');

    if (this.skyMat) {
      this.skyMat.uniforms.topColor.value.setHex(env.skyTop);
      this.skyMat.uniforms.midColor1.value.setHex(env.skyMid1);
      this.skyMat.uniforms.midColor2.value.setHex(env.skyMid2);
      this.skyMat.uniforms.bottomColor.value.setHex(env.skyBottom);
      this.skyMat.uniforms.sunPosition.value.set(env.sunPosition[0], env.sunPosition[1], env.sunPosition[2]).normalize();
    }
    if (this.scene.fog) {
      this.scene.fog.color.setHex(env.fogColor);
      this.scene.fog.near = env.fogNear;
      this.scene.fog.far = env.fogFar;
    }
    if (this.sunLight) {
      this.sunLight.color.setHex(env.sunColor);
      this.sunLight.intensity = env.sunIntensity;
      this.sunLight.position.set(env.sunPosition[0] * 320, env.sunPosition[1] * 320, env.sunPosition[2] * 320);
    }
    if (this.hemiLight) {
      this.hemiLight.color.setHex(0xdbeafe);
      this.hemiLight.groundColor.setHex(0x64748b);
      this.hemiLight.intensity = 1.22;
    }
    if (this.fillLight) {
      this.fillLight.color.setHex(0x93c5fd);
      this.fillLight.intensity = 0.72;
      this.fillLight.position.set(-120, 100, 140);
    }
    if (this.renderer) {
      this.renderer.toneMappingExposure = 1.28;
    }
  }

  initSceneObjects() {
    const scenario = getScenario(this.currentScenarioId);

    // 1. River System
    this.riverSystem = new RiverSystem(scenario.riverPoints, { scenarioId: this.currentScenarioId });
    this.waterMesh = this.riverSystem.createWaterMesh();
    this.scene.add(this.waterMesh);

    // 2. Terrain System
    this.terrainSystem = createTerrain(this.riverSystem, this.currentScenarioId);
    this.scene.add(this.terrainSystem.mesh);

    // 3. Flood & Physics Simulation
    this.simulation = new FloodSimulation(this.scene, this.riverSystem, this.terrainSystem, this.currentScenarioId);

    // 4. Camera Choreography Director
    this.cameraDirector = new CameraDirector(this.camera, this.renderer.domElement, this.riverSystem, this.currentScenarioId);
    if (this.ui) {
      this.cameraDirector.onModeChange = (isGuided, mode) => {
        this.ui.setGuided(isGuided, mode);
      };
    }
  }

  initUI() {
    this.ui = new UIManager({
      onSeek: (newT) => {
        this.t = Math.max(0, Math.min(1, newT));
        this.updateSimulationState(0.016);
      },
      onTogglePlay: (isPlaying) => {
        this.isPlaying = isPlaying;
      },
      onToggleGuided: (isGuided) => {
        this.cameraDirector.setGuided(isGuided);
      },
      onToggleRain: (isRain) => {
        this.simulation.setRainVisible(isRain);
      },
      onSetSpeed: (speed) => {
        this.speed = speed;
      },
      onSelectScenario: (scenarioId) => {
        this.switchScenario(scenarioId);
      },
      onSelectViewMode: (mode) => {
        this.cameraDirector.setViewMode(mode);
      },
      onToggleGoogle3D: () => {
        this.toggleGoogle3D();
      },
      onSaveGoogleKey: (key) => {
        this.saveGoogleKey(key);
      },
      onFallbackLocal: () => {
        this.disableGoogle3D();
      },
      onStartSimulation: () => {
        this.dismissIntro(true);
      },
      onToggleDisasterMap: (enabled) => {
        if (this.terrainSystem && typeof this.terrainSystem.setDisasterMapMode === 'function') {
          this.terrainSystem.setDisasterMapMode(enabled);
        }
      }
    });

    this.cameraDirector.onModeChange = (isGuided, mode) => {
      this.ui.setGuided(isGuided, mode);
    };

    // Ensure UI elements and KPI cards reflect current starting scenario
    this.ui.setScenario(this.currentScenarioId);

    // Involuntary autoplay timer removed: simulation remains comfortably paused at t=0
    if (this.ui.elIntroTimer) {
      this.ui.elIntroTimer.style.display = 'none';
    }

    if (this.ui.elIntroSkip) {
      this.ui.elIntroSkip.addEventListener('click', () => {
        this.dismissIntro(true);
      });
    }
  }

  switchScenario(scenarioId) {
    if (this.currentScenarioId === scenarioId) return;
    this.currentScenarioId = scenarioId;
    setCurrentScenarioId(scenarioId);

    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', `?scenario=${scenarioId}`);
    }

    // 0. Clean up previous Google 3D Photogrammetry if active
    this.disableGoogle3D();

    // 1. Clean up previous camera director controls
    if (this.cameraDirector && this.cameraDirector.dispose) {
      this.cameraDirector.dispose();
    }

    // 2. Clean up existing objects
    if (this.waterMesh) this.scene.remove(this.waterMesh);
    if (this.terrainSystem && this.terrainSystem.mesh) this.scene.remove(this.terrainSystem.mesh);
    if (this.simulation) {
      if (this.simulation.dispose) this.simulation.dispose();
      if (this.simulation.group) this.scene.remove(this.simulation.group);
    }

    // 3. Re-create objects for new scenario
    this.initSceneObjects();

    // 4. Update environment (sky, fog, sun)
    this.updateEnvironmentForScenario(getScenario(scenarioId));

    // 5. Update UI & timeline (start paused at t=0 so user has full control)
    this.t = 0.0;
    this.introDismissed = true;
    this.ui.hideIntroCard();
    this.isPlaying = false;
    this.ui.isPlaying = false;
    this.ui.updatePlayBtnState();
    this.ui.setScenario(scenarioId);
    this.updateSimulationState(0.016);
  }

  toggleGoogle3D() {
    if (this.currentScenarioId !== 'newyork') return;
    if (this.isGoogle3DActive) {
      this.disableGoogle3D();
    } else {
      this.enableGoogle3D();
    }
  }

  enableGoogle3D() {
    if (this.currentScenarioId !== 'newyork') return;

    if (!this.google3DManager) {
      this.google3DManager = new Google3DTilesManager(this.scene, this.camera, this.renderer, {
        onStatusChange: (status) => {
          if (status.status === 'needs_key') {
            this.ui.showGoogleKeyModal();
          } else if (status.status === 'active') {
            this.ui.setGoogle3DActive(true);
          }
        }
      });
    }

    if (!this.google3DManager.apiKey) {
      this.ui.showGoogleKeyModal();
      return;
    }

    this.isGoogle3DActive = true;
    if (this.terrainSystem && this.terrainSystem.mesh) this.terrainSystem.mesh.visible = false;
    if (this.waterMesh) this.waterMesh.visible = false;
    if (this.simulation && this.simulation.group) this.simulation.group.visible = false;
    this.google3DManager.show();
    if (this.cameraDirector) this.cameraDirector.setGoogle3DActive(true);
    if (this.ui) this.ui.setGoogle3DActive(true);
  }

  disableGoogle3D() {
    this.isGoogle3DActive = false;
    if (this.google3DManager) {
      this.google3DManager.hide();
    }
    if (this.terrainSystem && this.terrainSystem.mesh) this.terrainSystem.mesh.visible = true;
    if (this.waterMesh) this.waterMesh.visible = true;
    if (this.simulation && this.simulation.group) this.simulation.group.visible = true;
    if (this.cameraDirector) this.cameraDirector.setGoogle3DActive(false);
    if (this.ui) this.ui.setGoogle3DActive(false);
  }

  saveGoogleKey(key) {
    if (!this.google3DManager) {
      this.google3DManager = new Google3DTilesManager(this.scene, this.camera, this.renderer);
    }
    this.google3DManager.setApiKey(key);
    if (key && key.length > 10) {
      this.enableGoogle3D();
    }
  }

  dismissIntro(startPlayback = true) {
    this.introDismissed = true;
    this.ui.hideIntroCard();
    if (startPlayback) {
      this.isPlaying = true;
      this.ui.isPlaying = true;
      this.ui.updatePlayBtnState();
    }
  }

  updateSimulationState(deltaSec) {
    try {
      const uWave = this.simulation.update(this.t, deltaSec);
      if (this.isGoogle3DActive && this.google3DManager) {
        this.google3DManager.update(this.t, deltaSec);
      }
      this.cameraDirector.update(this.t, deltaSec);
      this.ui.update(this.t, this.t * TIMELINE_CONFIG.DUR, uWave);
    } catch (err) {
      console.error('Error in simulation state update:', err);
    }
  }

  onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    if (this.google3DManager && this.google3DManager.tiles) {
      this.google3DManager.tiles.setResolutionFromRenderer(this.camera, this.renderer);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const effectiveDelta = Math.min(delta, 0.1);

    if (this.isPlaying) {
      const step = (effectiveDelta * this.speed) / TIMELINE_CONFIG.DUR;
      this.t += step;

      if (this.t >= 1.0) {
        this.t = 1.0;
        this.isPlaying = false;
        this.ui.isPlaying = false;
        this.ui.updatePlayBtnState();
      }
    }

    this.updateSimulationState(effectiveDelta);
    this.renderer.render(this.scene, this.camera);
  }
}

// Boot application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new ExplainerApp();
});
