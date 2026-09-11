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
    this.controls = new OrbitControls(this.camera, this.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 50;
    this.controls.maxDistance = 420;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.04;

    const startPt = this.river.getPointAt(0.04);
    this.currentTarget = new THREE.Vector3(startPt.x, startPt.y + 8, startPt.z);
    this.spherical = new THREE.Spherical(125, 0.76, -1.15);
    this.initialized = false;

    this.controls.addEventListener('start', () => {
      if (this.isGuided) {
        this.setGuided(false);
      }
    });

    this.onModeChange = null;
  }

  setGuided(guided) {
    this.isGuided = guided;
    this.controls.enabled = !guided;
    if (this.onModeChange) {
      this.onModeChange(this.isGuided);
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

  update(t, delta = 0.016) {
    if (this.isGuided) {
      let desiredTarget = new THREE.Vector3();
      let desiredRadius = 125;
      let desiredPhi = 0.72;
      let desiredTheta = -1.15;

      const isDelhi = (this.scenarioId === 'delhi');
      const isNewYork = (this.scenarioId === 'newyork');
      const isBeijing = (this.scenarioId === 'beijing');
      const isTokyo = (this.scenarioId === 'tokyo');
      const isLondon = (this.scenarioId === 'london');

      if (isLondon) {
        if (t < 0.20) {
          // Establish directly on Outer Thames Estuary sea defense wall breach
          const p = this.river.getPointAt(0.04);
          desiredTarget.set(p.x + 4.0, p.y + 4.0, p.z);
          desiredRadius = 125;
          desiredPhi = 0.80;
          desiredTheta = -1.25;
        } else if (t <= 0.92) {
          const uWave = Math.max(0, Math.min(1, (t - 0.18) / 0.78));
          const wavePos = this.river.getPointAt(uWave);
          desiredTarget.copy(wavePos).add(new THREE.Vector3(2.0, 4.0, 0));

          const followAlpha = (t - 0.20) / (0.92 - 0.20);
          desiredRadius = 115;
          desiredPhi = 0.82;
          desiredTheta = -1.22 + 1.15 * followAlpha;
        } else {
          const pullAlpha = (t - 0.92) / (1.0 - 0.92);
          const endTarget = this.river.getPointAt(0.75);
          desiredTarget.lerpVectors(endTarget, new THREE.Vector3(10, 6, 14), pullAlpha);
          desiredRadius = 115 + 120 * pullAlpha;
          desiredPhi = 0.82 + 0.10 * pullAlpha;
          desiredTheta = -0.07 - 0.35 * pullAlpha;
        }
      } else if (isTokyo) {
        if (t < 0.20) {
          // Establish directly on Saitama Arakawa super-levee blowout
          const p = this.river.getPointAt(0.04);
          desiredTarget.set(p.x, p.y + 4.0, p.z);
          desiredRadius = 125;
          desiredPhi = 0.80;
          desiredTheta = -1.25;
        } else if (t <= 0.92) {
          const uWave = Math.max(0, Math.min(1, (t - 0.18) / 0.78));
          const wavePos = this.river.getPointAt(uWave);
          desiredTarget.copy(wavePos).add(new THREE.Vector3(0, 4.0, 0));

          const followAlpha = (t - 0.20) / (0.92 - 0.20);
          desiredRadius = 115;
          desiredPhi = 0.82;
          desiredTheta = -1.22 + 1.15 * followAlpha;
        } else {
          const pullAlpha = (t - 0.92) / (1.0 - 0.92);
          const endTarget = this.river.getPointAt(0.75);
          desiredTarget.lerpVectors(endTarget, new THREE.Vector3(12, 6, 12), pullAlpha);
          desiredRadius = 115 + 120 * pullAlpha;
          desiredPhi = 0.82 + 0.10 * pullAlpha;
          desiredTheta = -0.07 - 0.35 * pullAlpha;
        }
      } else if (isBeijing) {
        if (t < 0.20) {
          // Establish high in the misty Taihang mountain gorge (Miaofengshan rockslide)
          const p = this.river.getPointAt(0.04);
          desiredTarget.set(p.x - 6.0, p.y + 8.0, p.z);
          desiredRadius = 125;
          desiredPhi = 0.74;
          desiredTheta = -1.18;
        } else if (t <= 0.92) {
          const uWave = Math.max(0, Math.min(1, (t - 0.18) / 0.78));
          const wavePos = this.river.getPointAt(uWave);
          desiredTarget.copy(wavePos).add(new THREE.Vector3(0, 4.0, 0));

          const followAlpha = (t - 0.20) / (0.92 - 0.20);
          desiredRadius = 112;
          desiredPhi = 0.82;
          desiredTheta = -1.22 + 1.10 * followAlpha;
        } else {
          const pullAlpha = (t - 0.92) / (1.0 - 0.92);
          const endTarget = this.river.getPointAt(0.75);
          desiredTarget.lerpVectors(endTarget, new THREE.Vector3(12, 6, 15), pullAlpha);
          desiredRadius = 112 + 120 * pullAlpha;
          desiredPhi = 0.82 + 0.10 * pullAlpha;
          desiredTheta = -0.12 - 0.35 * pullAlpha;
        }
      } else if (isNewYork) {
        if (t < 0.20) {
          // Establish on The Narrows entrance, Verrazzano Bridge & Atlantic seawall breach
          const p = this.river.getPointAt(0.04);
          desiredTarget.set(p.x + 4.0, p.y + 4.0, p.z);
          desiredRadius = 125;
          desiredPhi = 0.80;
          desiredTheta = -1.25;
        } else if (t <= 0.92) {
          const uWave = Math.max(0, Math.min(1, (t - 0.18) / 0.78));
          const wavePos = this.river.getPointAt(uWave);
          desiredTarget.copy(wavePos).add(new THREE.Vector3(4.0, 4.5, 0));

          const followAlpha = (t - 0.20) / (0.92 - 0.20);
          desiredRadius = 115;
          desiredPhi = 0.82;
          desiredTheta = -1.25 + 1.15 * followAlpha;
        } else {
          const pullAlpha = (t - 0.92) / (1.0 - 0.92);
          const endTarget = this.river.getPointAt(0.70);
          desiredTarget.lerpVectors(endTarget, new THREE.Vector3(10, 8, 10), pullAlpha);
          desiredRadius = 115 + 125 * pullAlpha;
          desiredPhi = 0.82 + 0.10 * pullAlpha;
          desiredTheta = -0.10 - 0.40 * pullAlpha;
        }
      } else if (isDelhi) {
        if (t < 0.20) {
          // Establish on Hathnikund Barrage sluice blowout & guide bund collapse
          const p = this.river.getPointAt(0.04);
          desiredTarget.set(p.x, p.y + 4.0, p.z);
          desiredRadius = 125;
          desiredPhi = 0.80;
          desiredTheta = -1.25;
        } else if (t <= 0.92) {
          const uWave = Math.max(0, Math.min(1, (t - 0.18) / 0.78));
          const wavePos = this.river.getPointAt(uWave);
          desiredTarget.copy(wavePos).add(new THREE.Vector3(0, 3.5, 0));

          const followAlpha = (t - 0.20) / (0.92 - 0.20);
          desiredRadius = 110;
          desiredPhi = 0.84;
          desiredTheta = -1.20 + 1.05 * followAlpha;
        } else {
          const pullAlpha = (t - 0.92) / (1.0 - 0.92);
          const endTarget = this.river.getPointAt(0.95);
          desiredTarget.lerpVectors(endTarget, new THREE.Vector3(0, 4, 0), pullAlpha);
          desiredRadius = 110 + 110 * pullAlpha;
          desiredPhi = 0.84 + 0.08 * pullAlpha;
          desiredTheta = -0.15 - 0.35 * pullAlpha;
        }
      } else {
        if (t < 0.22) {
          const p2 = this.river.getPointAt(0.02);
          desiredTarget.set(p2.x - 6.0, p2.y + 18.0, p2.z - 4.0);
          desiredRadius = 125;
          desiredPhi = 0.72;
          desiredTheta = -1.15;
        } else if (t <= 0.94) {
          const uWave = Math.max(0, Math.min(1, (t - 0.20) / 0.80));
          const wavePos = this.river.getPointAt(uWave);
          desiredTarget.copy(wavePos).add(new THREE.Vector3(0, 4.5, 0));

          const followAlpha = (t - 0.22) / (0.94 - 0.22);
          desiredRadius = 105;
          desiredPhi = 0.84;
          desiredTheta = -1.12 + (-0.07 - (-1.12)) * followAlpha;
        } else {
          const pullAlpha = (t - 0.94) / (1.0 - 0.94);
          const startTarget = this.river.getPointAt(1.0);
          desiredTarget.lerpVectors(startTarget, new THREE.Vector3(24, 6, 34), pullAlpha);
          desiredRadius = 105 + (240 - 105) * pullAlpha;
          desiredPhi = 0.84 + (0.96 - 0.84) * pullAlpha;
          desiredTheta = -0.07 + (-0.5 - (-0.07)) * pullAlpha;
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
