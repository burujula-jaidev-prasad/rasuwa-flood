import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getScenario } from './data.js';

export class CameraDirector {
  constructor(camera, domElement, riverSystem, scenarioId = null) {
    this.camera = camera;
    this.domElement = domElement;
    this.river = riverSystem;
    this.scenarioId = scenarioId || getScenario().config.id;

    this.isGuided = true;
    this.viewMode = 'top'; // Default to Top View (Bird's Eye / Map) as requested
    this.controls = new OrbitControls(this.camera, this.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 50;
    this.controls.maxDistance = 420;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.04;

    const startPt = this.river.getPointAt(0.04);
    this.currentTarget = new THREE.Vector3(startPt.x, startPt.y + 8, startPt.z);
    this.spherical = new THREE.Spherical(155, 0.38, -1.15);
    this.initialized = false;

    this.controls.addEventListener('start', () => {
      if (this.isGuided) {
        this.setGuided(false);
      }
    });

    this.onModeChange = null;
    this.isGoogle3D = false;
  }

  setGoogle3DActive(isActive) {
    this.isGoogle3D = Boolean(isActive);
    if (this.controls) {
      if (this.isGoogle3D) {
        this.controls.minDistance = 20;
        this.controls.maxDistance = 850;
      } else {
        this.controls.minDistance = 50;
        this.controls.maxDistance = 420;
      }
    }
  }

  setViewMode(mode) {
    this.viewMode = mode;
    if (mode === 'free') {
      this.setGuided(false);
    } else {
      this.setGuided(true);
    }
  }

  setGuided(guided) {
    this.isGuided = guided;
    this.controls.enabled = !guided;
    if (this.onModeChange) {
      this.onModeChange(this.isGuided, this.viewMode);
    }
  }

  dispose() {
    if (this.controls) {
      this.controls.dispose();
    }
  }

  jumpToWaypoint(u) {
    const pt = this.river.getPointAt(u);
    this.currentTarget.copy(pt).add(new THREE.Vector3(0, 10, 0));
    this.spherical.radius = 110;
    this.spherical.phi = 0.82;
    this.setGuided(false);
  }

  update(t, deltaSec = 0.016) {
    if (this.isGuided) {
      const isDelhi = (this.scenarioId === 'delhi');
      const isNewYork = (this.scenarioId === 'newyork');
      const isBeijing = (this.scenarioId === 'beijing');
      const isTokyo = (this.scenarioId === 'tokyo');
      const isLondon = (this.scenarioId === 'london');

      const desiredTarget = new THREE.Vector3();
      let desiredRadius = 120;
      let desiredPhi = 0.74;
      let desiredTheta = -1.15;

      if (isLondon) {
        if (t < 0.20) {
          // Establish directly on Outer Thames Estuary sea defense wall breach
          const p = this.river.getPointAt(0.04);
          desiredTarget.set(p.x, p.y + 4.0, p.z);
          desiredRadius = 135;
          desiredPhi = 0.74;
          desiredTheta = -1.25;
        } else if (t <= 0.92) {
          const uWave = Math.max(0, Math.min(1, (t - 0.18) / 0.78));
          const wavePos = this.river.getPointAt(uWave);
          desiredTarget.copy(wavePos).add(new THREE.Vector3(2.0, 4.0, 0));

          const followAlpha = (t - 0.20) / (0.92 - 0.20);
          desiredRadius = 125;
          desiredPhi = 0.74;
          desiredTheta = -1.22 + 1.15 * followAlpha;
        } else {
          const pullAlpha = (t - 0.92) / (1.0 - 0.92);
          const endTarget = this.river.getPointAt(0.75);
          desiredTarget.lerpVectors(endTarget, new THREE.Vector3(10, 8, 14), pullAlpha);
          desiredRadius = 125 + 90 * pullAlpha;
          desiredPhi = 0.74 + 0.12 * pullAlpha;
          desiredTheta = -0.07 - 0.35 * pullAlpha;
        }
      } else if (isTokyo) {
        if (t < 0.20) {
          // Establish directly on Saitama Arakawa super-levee blowout
          const p = this.river.getPointAt(0.04);
          desiredTarget.set(p.x, p.y + 4.0, p.z);
          desiredRadius = 135;
          desiredPhi = 0.74;
          desiredTheta = -1.25;
        } else if (t <= 0.92) {
          const uWave = Math.max(0, Math.min(1, (t - 0.18) / 0.78));
          const wavePos = this.river.getPointAt(uWave);
          desiredTarget.copy(wavePos).add(new THREE.Vector3(0, 4.0, 0));

          const followAlpha = (t - 0.20) / (0.92 - 0.20);
          desiredRadius = 125;
          desiredPhi = 0.74;
          desiredTheta = -1.22 + 1.15 * followAlpha;
        } else {
          const pullAlpha = (t - 0.92) / (1.0 - 0.92);
          const endTarget = this.river.getPointAt(0.75);
          desiredTarget.lerpVectors(endTarget, new THREE.Vector3(12, 8, 12), pullAlpha);
          desiredRadius = 125 + 90 * pullAlpha;
          desiredPhi = 0.74 + 0.12 * pullAlpha;
          desiredTheta = -0.07 - 0.35 * pullAlpha;
        }
      } else if (isBeijing) {
        if (t < 0.20) {
          // Establish high in the misty Taihang mountain gorge (Miaofengshan rockslide)
          const p = this.river.getPointAt(0.04);
          desiredTarget.set(p.x - 4.0, p.y + 6.0, p.z);
          desiredRadius = 135;
          desiredPhi = 0.72;
          desiredTheta = -1.18;
        } else if (t <= 0.92) {
          const uWave = Math.max(0, Math.min(1, (t - 0.18) / 0.78));
          const wavePos = this.river.getPointAt(uWave);
          desiredTarget.copy(wavePos).add(new THREE.Vector3(0, 4.0, 0));

          const followAlpha = (t - 0.20) / (0.92 - 0.20);
          desiredRadius = 125;
          desiredPhi = 0.74;
          desiredTheta = -1.22 + 1.10 * followAlpha;
        } else {
          const pullAlpha = (t - 0.92) / (1.0 - 0.92);
          const endTarget = this.river.getPointAt(0.75);
          desiredTarget.lerpVectors(endTarget, new THREE.Vector3(12, 8, 15), pullAlpha);
          desiredRadius = 125 + 90 * pullAlpha;
          desiredPhi = 0.74 + 0.12 * pullAlpha;
          desiredTheta = -0.12 - 0.35 * pullAlpha;
        }
      } else if (isNewYork) {
        if (t < 0.20) {
          // Establish on The Narrows entrance, Verrazzano Bridge & Atlantic seawall breach
          const p = this.river.getPointAt(0.04);
          desiredTarget.set(p.x + 6.0, p.y + 6.0, p.z);
          desiredRadius = 135;
          desiredPhi = 0.72; // Normal elevated top-view like Nepal
          desiredTheta = -1.22;
        } else if (t <= 0.92) {
          const uWave = Math.max(0, Math.min(1, (t - 0.18) / 0.78));
          const wavePos = this.river.getPointAt(uWave);
          desiredTarget.copy(wavePos).add(new THREE.Vector3(4.0, 5.0, 0));

          const followAlpha = (t - 0.20) / (0.92 - 0.20);
          desiredRadius = 125;
          desiredPhi = 0.74; // Normal elevated top-view like Nepal
          desiredTheta = -1.22 + 1.15 * followAlpha;
        } else {
          const pullAlpha = (t - 0.92) / (1.0 - 0.92);
          const endTarget = this.river.getPointAt(0.70);
          desiredTarget.lerpVectors(endTarget, new THREE.Vector3(12, 10, 12), pullAlpha);
          desiredRadius = 125 + 110 * pullAlpha;
          desiredPhi = 0.74 + 0.12 * pullAlpha;
          desiredTheta = -0.10 - 0.40 * pullAlpha;
        }
      } else if (isDelhi) {
        if (t < 0.20) {
          // Establish on Hathnikund Barrage sluice blowout & guide bund collapse
          const p = this.river.getPointAt(0.04);
          desiredTarget.set(p.x, p.y + 4.0, p.z);
          desiredRadius = 135;
          desiredPhi = 0.74;
          desiredTheta = -1.25;
        } else if (t <= 0.92) {
          const uWave = Math.max(0, Math.min(1, (t - 0.18) / 0.78));
          const wavePos = this.river.getPointAt(uWave);
          desiredTarget.copy(wavePos).add(new THREE.Vector3(0, 4.0, 0));

          const followAlpha = (t - 0.20) / (0.92 - 0.20);
          desiredRadius = 125;
          desiredPhi = 0.74;
          desiredTheta = -1.20 + 1.05 * followAlpha;
        } else {
          const pullAlpha = (t - 0.92) / (1.0 - 0.92);
          const endTarget = this.river.getPointAt(0.95);
          desiredTarget.lerpVectors(endTarget, new THREE.Vector3(0, 6, 0), pullAlpha);
          desiredRadius = 125 + 90 * pullAlpha;
          desiredPhi = 0.74 + 0.10 * pullAlpha;
          desiredTheta = -0.15 - 0.35 * pullAlpha;
        }
      } else {
        // Nepal / Rasuwa standard
        if (t < 0.22) {
          const p2 = this.river.getPointAt(0.02);
          desiredTarget.set(p2.x - 6.0, p2.y + 16.0, p2.z - 4.0);
          desiredRadius = 125;
          desiredPhi = 0.72;
          desiredTheta = -1.15;
        } else if (t <= 0.94) {
          const uWave = Math.max(0, Math.min(1, (t - 0.20) / 0.80));
          const wavePos = this.river.getPointAt(uWave);
          desiredTarget.copy(wavePos).add(new THREE.Vector3(0, 4.5, 0));

          const followAlpha = (t - 0.22) / (0.94 - 0.22);
          desiredRadius = 120;
          desiredPhi = 0.74;
          desiredTheta = -1.12 + (-0.07 - (-1.12)) * followAlpha;
        } else {
          const pullAlpha = (t - 0.94) / (1.0 - 0.94);
          const startTarget = this.river.getPointAt(1.0);
          desiredTarget.lerpVectors(startTarget, new THREE.Vector3(24, 6, 34), pullAlpha);
          desiredRadius = 120 + 120 * pullAlpha;
          desiredPhi = 0.74 + 0.14 * pullAlpha;
          desiredTheta = -0.07 + (-0.5 - (-0.07)) * pullAlpha;
        }
      }

      // Multiple Director View Angle Overrides (Top, Left, Right/Opposite, Chaser, Isometric)
      if (this.isGoogle3D) {
        desiredTarget.set(20, 2.5, 20); // Focus on Battery Park / South Ferry
        if (this.viewMode === 'top') {
          desiredPhi = 0.28;
          desiredRadius = 380;
          desiredTheta = -1.15;
        } else if (this.viewMode === 'left') {
          desiredPhi = 0.85;
          desiredRadius = 260;
          desiredTheta = -2.25;
        } else if (this.viewMode === 'right') {
          desiredPhi = 0.85;
          desiredRadius = 260;
          desiredTheta = 0.90;
        } else if (this.viewMode === 'chaser') {
          desiredPhi = 0.90;
          desiredRadius = 140;
          desiredTheta = -1.15;
        } else if (this.viewMode === 'iso') {
          desiredPhi = 0.65;
          desiredRadius = 340;
          desiredTheta = -0.85;
        }
      } else {
        if (this.viewMode === 'top') {
          desiredPhi = 0.38;   // Elevated bird's-eye map view with clear 3D architectural relief
          desiredRadius = 155;
          desiredTheta = -1.15;
        } else if (this.viewMode === 'left') {
          desiredPhi = 0.70;   // West-bank cinematic perspective
          desiredRadius = 135;
          desiredTheta = -2.35;
        } else if (this.viewMode === 'right') {
          desiredPhi = 0.68;   // East-bank / Brooklyn / Harbor frontal perspective (Opposite View)
          desiredRadius = 135;
          desiredTheta = 0.85; // Directly opposite left view, looking across the river with zero occlusion
        } else if (this.viewMode === 'chaser') {
          desiredPhi = 0.72;
          desiredRadius = 90;
        } else if (this.viewMode === 'iso') {
          desiredPhi = 0.58;   // 3D Isometric overview
          desiredRadius = 140;
          desiredTheta = -0.90;
        }
      }

      if (!this.initialized) {
        this.currentTarget.copy(desiredTarget);
        this.spherical.radius = desiredRadius;
        this.spherical.phi = desiredPhi;
        this.spherical.theta = desiredTheta;
        const initEye = new THREE.Vector3().setFromSpherical(this.spherical).add(this.currentTarget);
        this.camera.position.copy(initEye);
        this.camera.lookAt(this.currentTarget);
        this.controls.target.copy(this.currentTarget);
        this.initialized = true;
        return;
      }

      const lerpFactor = 0.05;
      this.currentTarget.lerp(desiredTarget, lerpFactor);

      this.spherical.radius += (desiredRadius - this.spherical.radius) * lerpFactor;
      this.spherical.phi += (desiredPhi - this.spherical.phi) * lerpFactor;
      this.spherical.theta += (desiredTheta - this.spherical.theta) * lerpFactor;

      const eyePos = new THREE.Vector3().setFromSpherical(this.spherical).add(this.currentTarget);
      this.camera.position.copy(eyePos);
      this.camera.lookAt(this.currentTarget);

      this.controls.target.copy(this.currentTarget);
    } else {
      this.controls.update();
    }
  }
}
