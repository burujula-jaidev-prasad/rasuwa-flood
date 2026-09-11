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

    const startPt = this.river.getPointAt(0.08);
    this.currentTarget = new THREE.Vector3(startPt.x, startPt.y + 12, startPt.z);
    this.spherical = new THREE.Spherical(125, 0.76, -1.15);

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
          // Establish on North Sea Estuary & Southend approach looking toward Woolwich Reach
          const p = this.river.getPointAt(0.12);
          desiredTarget.set(p.x + 8.0, p.y + 5.0, p.z);
          desiredRadius = 135;
          desiredPhi = 0.78;
          desiredTheta = -1.25;
        } else if (t <= 0.92) {
          // Follow-cam tracking the storm surge as it reaches Woolwich Reach,
          // witnesses the Thames Barrier 10 sector gates rising, passes Canary Wharf,
          // Tube tunnel flood doors, Tower Bridge, and HMS Belfast
          const uWave = Math.max(0, Math.min(1, (t - 0.18) / 0.78));
          const wavePos = this.river.getPointAt(uWave);
          desiredTarget.copy(wavePos).add(new THREE.Vector3(2.0, 4.0, 0));

          const followAlpha = (t - 0.20) / (0.92 - 0.20);
          desiredRadius = 115;
          desiredPhi = 0.82;
          desiredTheta = -1.22 + 1.15 * followAlpha;
        } else {
          // Pull back wide over Westminster, Victoria Embankment, and the Houses of Parliament
          const pullAlpha = (t - 0.92) / (1.0 - 0.92);
          const endTarget = this.river.getPointAt(0.75);
          desiredTarget.lerpVectors(endTarget, new THREE.Vector3(10, 6, 14), pullAlpha);
          desiredRadius = 115 + 120 * pullAlpha;
          desiredPhi = 0.82 + 0.10 * pullAlpha;
          desiredTheta = -0.07 - 0.35 * pullAlpha;
        }
      } else if (isTokyo) {
        if (t < 0.20) {
          // Establish on Upper Arakawa & Saitama catchment with Shinkansen viaduct and distant megalopolis horizon
          const p = this.river.getPointAt(0.12);
          desiredTarget.set(p.x, p.y + 6.0, p.z);
          desiredRadius = 135;
          desiredPhi = 0.78;
          desiredTheta = -1.25;
        } else if (t <= 0.92) {
          // Follow-cam tracking the torrential Arakawa surge past super-levees, G-CANS Silo No. 1 drop shaft,
          // the 59-pillar Underground Temple, subway watertight portals, and Tokyo Skytree / Sumida seawalls
          const uWave = Math.max(0, Math.min(1, (t - 0.18) / 0.78));
          const wavePos = this.river.getPointAt(uWave);
          desiredTarget.copy(wavePos).add(new THREE.Vector3(0, 4.0, 0));

          const followAlpha = (t - 0.20) / (0.92 - 0.20);
          desiredRadius = 115;
          desiredPhi = 0.82;
          desiredTheta = -1.22 + 1.15 * followAlpha;
        } else {
          // Pull back wide over Tokyo Bay, Edo River turbine pump outflow, and the vast zero-meter lowland protected basin
          const pullAlpha = (t - 0.92) / (1.0 - 0.92);
          const endTarget = this.river.getPointAt(0.75);
          desiredTarget.lerpVectors(endTarget, new THREE.Vector3(12, 6, 12), pullAlpha);
          desiredRadius = 115 + 120 * pullAlpha;
          desiredPhi = 0.82 + 0.10 * pullAlpha;
          desiredTheta = -0.07 - 0.35 * pullAlpha;
        }
      } else if (isBeijing) {
        if (t < 0.20) {
          // Establish high in the misty Taihang mountain gorge (Miaofengshan)
          const p = this.river.getPointAt(0.10);
          desiredTarget.set(p.x - 8.0, p.y + 8.0, p.z);
          desiredRadius = 135;
          desiredPhi = 0.76;
          desiredTheta = -1.18;
        } else if (t <= 0.92) {
          // Follow-cam tracking the torrential mountain deluge as it passes Luopoling train,
          // tears along G109, bursts through Sanjiadian Dam, and reaches Lugouqiao
          const uWave = Math.max(0, Math.min(1, (t - 0.18) / 0.78));
          const wavePos = this.river.getPointAt(uWave);
          desiredTarget.copy(wavePos).add(new THREE.Vector3(0, 4.0, 0));

          const followAlpha = (t - 0.20) / (0.92 - 0.20);
          desiredRadius = 112;
          desiredPhi = 0.82;
          desiredTheta = -1.22 + 1.10 * followAlpha;
        } else {
          // Pull back wide over western Beijing plain, Lugouqiao, and Yongding retention wetlands
          const pullAlpha = (t - 0.92) / (1.0 - 0.92);
          const endTarget = this.river.getPointAt(0.75);
          desiredTarget.lerpVectors(endTarget, new THREE.Vector3(12, 6, 15), pullAlpha);
          desiredRadius = 112 + 120 * pullAlpha;
          desiredPhi = 0.82 + 0.10 * pullAlpha;
          desiredTheta = -0.12 - 0.35 * pullAlpha;
        }
      } else if (isNewYork) {
        if (t < 0.20) {
          // Establish on The Narrows entrance & Lower Manhattan skyline in distance
          const p = this.river.getPointAt(0.12);
          desiredTarget.set(p.x + 8.0, p.y + 6.0, p.z);
          desiredRadius = 135;
          desiredPhi = 0.80;
          desiredTheta = -1.25;
        } else if (t <= 0.92) {
          // Follow-cam tracking the Atlantic storm surge as it rounds The Battery,
          // hits South Ferry subway, races along FDR Drive, passes under Brooklyn Bridge,
          // and strikes ConEd substation
          const uWave = Math.max(0, Math.min(1, (t - 0.18) / 0.78));
          const wavePos = this.river.getPointAt(uWave);
          desiredTarget.copy(wavePos).add(new THREE.Vector3(4.0, 4.5, 0));

          const followAlpha = (t - 0.20) / (0.92 - 0.20);
          desiredRadius = 115;
          desiredPhi = 0.82;
          desiredTheta = -1.25 + 1.15 * followAlpha;
        } else {
          // Pull back wide over entire flooded Lower Manhattan & East River basin
          const pullAlpha = (t - 0.92) / (1.0 - 0.92);
          const endTarget = this.river.getPointAt(0.70);
          desiredTarget.lerpVectors(endTarget, new THREE.Vector3(10, 8, 10), pullAlpha);
          desiredRadius = 115 + 125 * pullAlpha;
          desiredPhi = 0.82 + 0.10 * pullAlpha;
          desiredTheta = -0.10 - 0.40 * pullAlpha;
        }
      } else if (isDelhi) {
        if (t < 0.20) {
          // Establish on Hathnikund release & Wazirabad approach
          const p = this.river.getPointAt(0.12);
          desiredTarget.set(p.x, p.y + 4.0, p.z);
          desiredRadius = 130;
          desiredPhi = 0.82;
          desiredTheta = -1.25;
        } else if (t <= 0.92) {
          // Tracking camera following Yamuna wave front
          const uWave = Math.max(0, Math.min(1, (t - 0.18) / 0.78));
          const wavePos = this.river.getPointAt(uWave);
          desiredTarget.copy(wavePos).add(new THREE.Vector3(0, 3.5, 0));

          const followAlpha = (t - 0.20) / (0.92 - 0.20);
          desiredRadius = 110;
          desiredPhi = 0.84;
          desiredTheta = -1.20 + 1.05 * followAlpha;
        } else {
          // Pull back over Delhi National Capital Region
          const pullAlpha = (t - 0.92) / (1.0 - 0.92);
          const endTarget = this.river.getPointAt(0.95);
          desiredTarget.lerpVectors(endTarget, new THREE.Vector3(0, 4, 0), pullAlpha);
          desiredRadius = 110 + 110 * pullAlpha;
          desiredPhi = 0.84 + 0.08 * pullAlpha;
          desiredTheta = -0.15 - 0.35 * pullAlpha;
        }
      } else {
        if (t < 0.22) {
          // Slow cinematic establish on Langtang Lirung peak & avalanche descent
          const p2 = this.river.getPointAt(0.02);
          desiredTarget.set(p2.x - 6.0, p2.y + 18.0, p2.z - 4.0);
          desiredRadius = 125;
          desiredPhi = 0.72;
          desiredTheta = -1.15;
        } else if (t <= 0.94) {
          // Follow-cam tracking the surge wave head along the gorge
          const uWave = Math.max(0, Math.min(1, (t - 0.20) / 0.80));
          const wavePos = this.river.getPointAt(uWave);
          desiredTarget.copy(wavePos).add(new THREE.Vector3(0, 4.5, 0));

          const followAlpha = (t - 0.22) / (0.94 - 0.22);
          desiredRadius = 105;
          desiredPhi = 0.84;
          desiredTheta = -1.12 + (-0.07 - (-1.12)) * followAlpha;
        } else {
          // Pull back wide toward Indian border
          const pullAlpha = (t - 0.94) / (1.0 - 0.94);
          const startTarget = this.river.getPointAt(1.0);
          desiredTarget.lerpVectors(startTarget, new THREE.Vector3(24, 6, 34), pullAlpha);
          desiredRadius = 105 + (240 - 105) * pullAlpha;
          desiredPhi = 0.84 + (0.96 - 0.84) * pullAlpha;
          desiredTheta = -0.07 + (-0.5 - (-0.07)) * pullAlpha;
        }
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
