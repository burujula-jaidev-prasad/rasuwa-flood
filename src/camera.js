import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class CameraDirector {
  constructor(camera, domElement, riverSystem) {
    this.camera = camera;
    this.domElement = domElement;
    this.river = riverSystem;

    this.isGuided = true;
    this.controls = new OrbitControls(this.camera, this.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 70;
    this.controls.maxDistance = 380;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.04;

    this.currentTarget = new THREE.Vector3(-96, 52, -88);
    this.spherical = new THREE.Spherical(125, 0.72, -1.15);

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
