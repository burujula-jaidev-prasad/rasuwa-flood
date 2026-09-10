import * as THREE from 'three';
import { RiverSystem } from './src/river.js';
import { createTerrain } from './src/terrain.js';
import { FloodSimulation } from './src/simulation.js';
import { CameraDirector } from './src/camera.js';
import { UIManager } from './src/ui.js';
import { TIMELINE_CONFIG } from './src/data.js';

class ExplainerApp {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.clock = new THREE.Clock();

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
    // 1. Sky vertical gradient (§9: #0a2036 -> #2b5f80 -> #7aa6bf -> #dfe9ee)
    const skyGeo = new THREE.SphereGeometry(600, 32, 32);
    // Invert geometry faces inside
    skyGeo.scale(-1, 1, 1);

    // Custom shader for vertical gradient sky
    const skyMat = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x0a2036) },
        midColor1: { value: new THREE.Color(0x2b5f80) },
        midColor2: { value: new THREE.Color(0x7aa6bf) },
        bottomColor: { value: new THREE.Color(0xdfe9ee) },
        sunPosition: { value: new THREE.Vector3(-0.7, 0.8, -0.6).normalize() }
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

          // Subtle sun glow disc top-left
          float sunDot = max(0.0, dot(dir, sunPosition));
          float sunGlow = pow(sunDot, 120.0) * 1.6;
          vec3 sunCol = vec3(1.0, 0.95, 0.85);

          gl_FragColor = vec4(sky + sunCol * sunGlow, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false
    });

    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(skyMesh);

    // 2. Fog (§9: fog 220–520)
    const fogColor = new THREE.Color(0x2b5f80);
    this.scene.fog = new THREE.Fog(fogColor, 220, 520);

    // 3. Directional Sun Light top-left
    this.sunLight = new THREE.DirectionalLight(0xfff6ea, 1.8);
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
    const hemiLight = new THREE.HemisphereLight(0x9fb3c0, 0x33513c, 0.85);
    this.scene.add(hemiLight);

    // 5. Subtle fill light for valley shadows
    const fillLight = new THREE.DirectionalLight(0x6fc0ea, 0.4);
    fillLight.position.set(120, 80, 140);
    this.scene.add(fillLight);
  }

  initSceneObjects() {
    // 1. River System
    this.riverSystem = new RiverSystem();
    this.waterMesh = this.riverSystem.createWaterMesh();
    this.scene.add(this.waterMesh);

    // 2. Terrain System
    this.terrainSystem = createTerrain(this.riverSystem);
    this.scene.add(this.terrainSystem.mesh);

    // 3. Flood & Physics Simulation
    this.simulation = new FloodSimulation(this.scene, this.riverSystem, this.terrainSystem);

    // 4. Camera Choreography Director
    this.cameraDirector = new CameraDirector(this.camera, this.renderer.domElement, this.riverSystem);
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
      }
    });

    this.cameraDirector.onModeChange = (isGuided) => {
      this.ui.setGuided(isGuided);
    };

    // Auto-start timer for intro card (3.4s)
    const introTimerInterval = setInterval(() => {
      if (this.introDismissed) {
        clearInterval(introTimerInterval);
        return;
      }
      this.introElapsed += 0.2;
      const remaining = Math.max(0, (TIMELINE_CONFIG.INTRO_CARD_DUR - this.introElapsed)).toFixed(1);
      if (this.ui.elIntroTimer) {
        this.ui.elIntroTimer.textContent = `Autoplaying in ${remaining}s...`;
      }
      if (this.introElapsed >= TIMELINE_CONFIG.INTRO_CARD_DUR) {
        clearInterval(introTimerInterval);
        this.dismissIntro();
      }
    }, 200);

    this.ui.elIntroSkip.addEventListener('click', () => {
      this.dismissIntro();
    });
  }

  dismissIntro() {
    if (this.introDismissed) return;
    this.introDismissed = true;
    this.ui.hideIntroCard();
    this.isPlaying = true;
    this.ui.updatePlayBtnState();
  }

  updateSimulationState(deltaSec) {
    const uWave = this.simulation.update(this.t, deltaSec);
    this.cameraDirector.update(this.t, deltaSec);
    this.ui.update(this.t, this.t * TIMELINE_CONFIG.DUR, uWave);
  }

  onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const effectiveDelta = Math.min(delta, 0.1);

    if (this.isPlaying) {
      // Step timeline forward: t in [0, 1] over DUR = 34s
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
