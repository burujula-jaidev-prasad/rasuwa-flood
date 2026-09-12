import * as THREE from 'three';
import { TilesRenderer } from '3d-tiles-renderer';
import {
  GoogleCloudAuthPlugin,
  ReorientationPlugin,
  TileCompressionPlugin,
  TilesFadePlugin,
  GLTFExtensionsPlugin
} from '3d-tiles-renderer/plugins';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Battery Park / South Ferry, Lower Manhattan coordinates
const NYC_LAT = 40.7032;
const NYC_LON = -74.0170;
const DEG2RAD = Math.PI / 180.0;

export class Google3DTilesManager {
  constructor(scene, camera, renderer, options = {}) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.options = options;

    this.apiKey = options.apiKey || this.detectApiKey();
    this.tiles = null;
    this.googlePlugin = null;
    this.reorientPlugin = null;
    this.dracoLoader = null;

    this.group = new THREE.Group();
    this.group.name = 'Google3DTiles_Group';
    this.scene.add(this.group);

    this.waterMesh = null;
    this.vessels = null;
    this.attributionEl = null;

    this.isActive = false;
    this.isReady = false;
    this.needsKey = false;
    this.errorMsg = null;
    this.attributionCounter = 0;

    this.onStatusChange = options.onStatusChange || null;

    if (this.apiKey) {
      this.initTiles();
    } else {
      this.needsKey = true;
    }
  }

  detectApiKey() {
    // 1. Check URL query params (?googleKey=AIza...)
    if (typeof window !== 'undefined' && window.location) {
      const params = new URLSearchParams(window.location.search);
      const urlKey = params.get('googleKey') || params.get('googleApiKey') || params.get('key');
      if (urlKey && urlKey.trim().length > 10) {
        localStorage.setItem('google_3d_tiles_api_key', urlKey.trim());
        return urlKey.trim();
      }
    }

    // 2. Check localStorage
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('google_3d_tiles_api_key');
      if (stored && stored.trim().length > 10) {
        return stored.trim();
      }
    }

    return '';
  }

  setApiKey(key) {
    if (!key || typeof key !== 'string') return;
    const cleanKey = key.trim();
    this.apiKey = cleanKey;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('google_3d_tiles_api_key', cleanKey);
    }
    this.needsKey = false;
    this.errorMsg = null;
    this.disposeTiles();
    this.initTiles();
  }

  clearApiKey() {
    this.apiKey = '';
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('google_3d_tiles_api_key');
    }
    this.needsKey = true;
    this.disposeTiles();
    if (this.onStatusChange) {
      this.onStatusChange({ status: 'needs_key' });
    }
  }

  initTiles() {
    if (!this.apiKey) {
      this.needsKey = true;
      if (this.onStatusChange) this.onStatusChange({ status: 'needs_key' });
      return;
    }

    try {
      this.dracoLoader = new DRACOLoader();
      this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

      this.tiles = new TilesRenderer();

      // Configure Google Photorealistic 3D Tiles Authentication
      this.googlePlugin = new GoogleCloudAuthPlugin({
        apiToken: this.apiKey,
        autoRefreshToken: true
      });
      this.tiles.registerPlugin(this.googlePlugin);

      // DRACO compressed binary glTF mesh decompression
      this.tiles.registerPlugin(new GLTFExtensionsPlugin({
        dracoLoader: this.dracoLoader
      }));

      // High-performance tile compression & LOD fade
      this.tiles.registerPlugin(new TileCompressionPlugin());
      this.tiles.registerPlugin(new TilesFadePlugin());

      // Georeference origin (0, 0, 0) at South Ferry / Battery Park, NYC
      this.reorientPlugin = new ReorientationPlugin({
        lat: NYC_LAT * DEG2RAD,
        lon: NYC_LON * DEG2RAD,
        height: 0.0,
        recenter: true
      });
      this.tiles.registerPlugin(this.reorientPlugin);

      // Optimize tile loading performance
      this.tiles.errorTarget = 18;
      this.tiles.maxDepth = 30;

      this.group.add(this.tiles.group);

      // Create dynamic storm surge water & real-scale vessels
      this.createDynamicWater();
      this.createRealScaleVessels();
      this.createAttributionDOM();

      this.isActive = true;
      this.isReady = true;
      this.needsKey = false;
      this.errorMsg = null;

      if (this.onStatusChange) {
        this.onStatusChange({ status: 'active' });
      }
    } catch (err) {
      console.error('Failed to initialize Google 3D Tiles Renderer:', err);
      this.errorMsg = err.message;
      if (this.onStatusChange) {
        this.onStatusChange({ status: 'error', error: err.message });
      }
    }
  }

  createDynamicWater() {
    if (this.waterMesh) {
      this.group.remove(this.waterMesh);
      if (this.waterMesh.geometry) this.waterMesh.geometry.dispose();
      if (this.waterMesh.material) this.waterMesh.material.dispose();
    }

    // High-resolution physical water surface plane covering Upper NY Bay & East River
    const waterGeo = new THREE.PlaneGeometry(3200, 3200, 64, 64);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      roughness: 0.12,
      metalness: 0.35,
      transparent: true,
      opacity: 0.88
    });

    this.waterMesh = new THREE.Mesh(waterGeo, waterMat);
    this.waterMesh.rotation.x = -Math.PI * 0.5;
    this.waterMesh.position.set(0, 0.1, 0); // mean sea level at baseline
    this.waterMesh.receiveShadow = true;
    this.group.add(this.waterMesh);

    // Deep water harbor bed volume for refraction & depth
    const harborBedGeo = new THREE.PlaneGeometry(3200, 3200);
    const harborBedMat = new THREE.MeshBasicMaterial({ color: 0x082f49, transparent: true, opacity: 0.5 });
    const bedMesh = new THREE.Mesh(harborBedGeo, harborBedMat);
    bedMesh.rotation.x = -Math.PI * 0.5;
    bedMesh.position.set(0, -8.0, 0);
    this.group.add(bedMesh);
  }

  createRealScaleVessels() {
    if (this.vessels) {
      this.group.remove(this.vessels.group);
    }

    const vesselsGroup = new THREE.Group();
    vesselsGroup.name = 'RealScale_Vessels';

    // 1. Staten Island Ferry (Real 24m double-ended passenger ferry at Whitehall Terminal)
    const ferryGroup = new THREE.Group();
    const ferryHull = new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 3.2, 24.0),
      new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.35 }) // NYC DOT Orange
    );
    ferryHull.position.y = 1.6;
    ferryGroup.add(ferryHull);

    const ferryCabin = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 2.8, 20.0),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 })
    );
    ferryCabin.position.y = 4.0;
    ferryGroup.add(ferryCabin);

    const ferryWindows = new THREE.Mesh(
      new THREE.BoxGeometry(6.5, 0.9, 18.0),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 })
    );
    ferryWindows.position.y = 4.2;
    ferryGroup.add(ferryWindows);

    // Positioned at Whitehall Terminal slip (east of Battery Park lawn)
    ferryGroup.position.set(160, 1.2, 110);
    vesselsGroup.add(ferryGroup);

    // 2. NYC Ferry Fast Catamaran
    const catGroup = new THREE.Group();
    [-2.2, 2.2].forEach(hx => {
      const pontoon = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.6, 17.0),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2 })
      );
      pontoon.position.set(hx, 0.8, 0);
      catGroup.add(pontoon);
    });

    const catCabin = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 2.2, 14.0),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
    );
    catCabin.position.y = 2.4;
    catGroup.add(catCabin);

    const catStripe = new THREE.Mesh(
      new THREE.BoxGeometry(5.25, 0.35, 14.2),
      new THREE.MeshBasicMaterial({ color: 0x1d4ed8 }) // NYC Ferry Blue
    );
    catStripe.position.y = 2.0;
    catGroup.add(catStripe);

    catGroup.position.set(190, 1.1, 130);
    vesselsGroup.add(catGroup);

    // 3. Adrift Tanker Barge ("John B. Caddell" Benchmark)
    const bargeGroup = new THREE.Group();
    const bargeHull = new THREE.Mesh(
      new THREE.BoxGeometry(8.5, 2.4, 28.0),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.5 })
    );
    bargeHull.position.y = 1.2;
    bargeGroup.add(bargeHull);

    const bargeKeel = new THREE.Mesh(
      new THREE.BoxGeometry(8.6, 0.8, 28.2),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.7 })
    );
    bargeKeel.position.y = 0.4;
    bargeGroup.add(bargeKeel);

    // Anchored out in Upper NY Bay channel
    bargeGroup.position.set(-60, 1.0, 240);
    vesselsGroup.add(bargeGroup);

    this.group.add(vesselsGroup);

    this.vessels = {
      group: vesselsGroup,
      ferry: ferryGroup,
      baseFerryPos: ferryGroup.position.clone(),
      catamaran: catGroup,
      baseCatPos: catGroup.position.clone(),
      barge: bargeGroup,
      baseBargePos: bargeGroup.position.clone()
    };
  }

  createAttributionDOM() {
    if (typeof document === 'undefined') return;

    if (!this.attributionEl) {
      this.attributionEl = document.createElement('div');
      this.attributionEl.id = 'google-3dtiles-attribution';
      this.attributionEl.style.cssText = `
        position: absolute;
        bottom: 74px;
        right: 16px;
        background: rgba(15, 23, 42, 0.75);
        backdrop-filter: blur(8px);
        padding: 4px 10px;
        border-radius: 6px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 11px;
        color: #e2e8f0;
        z-index: 80;
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      `;

      const logoImg = document.createElement('img');
      logoImg.src = 'https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg';
      logoImg.alt = 'Google';
      logoImg.style.cssText = 'height: 14px; opacity: 0.95;';
      this.attributionEl.appendChild(logoImg);

      const textSpan = document.createElement('span');
      textSpan.id = 'google-3dtiles-text';
      textSpan.innerText = '© 2026 Google | Photorealistic 3D Tiles';
      this.attributionEl.appendChild(textSpan);

      document.body.appendChild(this.attributionEl);
    }
  }

  update(t, deltaSec = 0.016) {
    if (!this.isActive || !this.tiles) return;

    // 1. Update 3D Tiles Camera & LOD
    this.tiles.setResolutionFromRenderer(this.camera, this.renderer);
    this.tiles.setCamera(this.camera);
    this.tiles.update();

    // 2. Dynamic Storm Surge Inundation Physics (Sandy 14.06 ft / 4.28m Peak Crest)
    // Water level rises over Battery Park and Whitehall Terminal
    const surgeProg = Math.max(0.0, Math.min(1.0, (t - 0.15) / 0.80));
    const smoothSurge = surgeProg * surgeProg * (3.0 - 2.0 * surgeProg);
    const surgeCrestHeight = smoothSurge * 4.28; // meters

    const waveTime = Date.now() * 0.0025;
    const waveHeave = Math.sin(waveTime * 3.0) * (0.08 + smoothSurge * 0.25);

    if (this.waterMesh) {
      this.waterMesh.position.y = surgeCrestHeight + waveHeave;
      // Change color to storm-churned brackish flood water at peak surge
      const calmCol = new THREE.Color(0x0284c7);
      const surgeCol = new THREE.Color(0x1e3a5f);
      this.waterMesh.material.color.lerpColors(calmCol, surgeCol, smoothSurge);
      this.waterMesh.material.opacity = 0.82 + smoothSurge * 0.12;
    }

    // 3. Realistic Vessel Floating & Drift Mechanics
    if (this.vessels) {
      const { ferry, baseFerryPos, catamaran, baseCatPos, barge, baseBargePos } = this.vessels;

      // Staten Island Ferry heaving at Whitehall slip
      ferry.position.y = baseFerryPos.y + surgeCrestHeight + Math.sin(waveTime * 2.8) * (0.12 + smoothSurge * 0.35);
      ferry.rotation.z = Math.sin(waveTime * 2.1) * (0.015 + smoothSurge * 0.045);
      ferry.rotation.x = Math.cos(waveTime * 1.8) * (0.012 + smoothSurge * 0.035);

      // NYC Fast Catamaran dynamic wave response
      catamaran.position.y = baseCatPos.y + surgeCrestHeight + Math.sin(waveTime * 3.4 + 1.0) * (0.15 + smoothSurge * 0.42);
      catamaran.rotation.z = Math.cos(waveTime * 2.5) * (0.02 + smoothSurge * 0.06);

      // Tanker Barge breaks free at surgeProg >= 0.45 and drifts down current
      barge.position.y = baseBargePos.y + surgeCrestHeight + Math.sin(waveTime * 2.2) * (0.18 + smoothSurge * 0.45);
      if (surgeProg > 0.45) {
        const driftAlpha = (surgeProg - 0.45) / 0.55;
        const driftDist = driftAlpha * 180.0; // meters drifting along Upper Bay
        barge.position.z = baseBargePos.z + driftDist * 0.85;
        barge.position.x = baseBargePos.x - driftDist * 0.35;
        barge.rotation.z = 0.18 + Math.sin(waveTime * 3.0) * 0.05; // 10-12 degree listing
        barge.rotation.y = Math.PI * 0.12 * driftAlpha;
      } else {
        barge.position.copy(baseBargePos);
        barge.rotation.set(0, 0, 0);
      }
    }

    // 4. Update Attributions periodically (every 60 frames)
    this.attributionCounter++;
    if (this.attributionCounter % 60 === 0 && this.attributionEl) {
      const attributions = [];
      this.tiles.getAttributions(attributions);
      if (attributions.length > 0) {
        const textSpan = document.getElementById('google-3dtiles-text');
        if (textSpan) {
          const stringAtts = attributions.filter(a => typeof a.value === 'string' && a.value.length > 0);
          if (stringAtts.length > 0) {
            textSpan.innerText = stringAtts.map(a => a.value).join(' • ');
          }
        }
      }
    }
  }

  hide() {
    this.group.visible = false;
    if (this.attributionEl) {
      this.attributionEl.style.display = 'none';
    }
    this.isActive = false;
  }

  show() {
    this.group.visible = true;
    if (this.attributionEl) {
      this.attributionEl.style.display = 'flex';
    }
    this.isActive = true;
    if (!this.tiles && this.apiKey) {
      this.initTiles();
    }
  }

  disposeTiles() {
    if (this.tiles) {
      this.group.remove(this.tiles.group);
      this.tiles.dispose();
      this.tiles = null;
    }
    if (this.dracoLoader) {
      this.dracoLoader.dispose();
      this.dracoLoader = null;
    }
    this.isReady = false;
  }

  dispose() {
    this.disposeTiles();
    if (this.waterMesh) {
      this.group.remove(this.waterMesh);
      if (this.waterMesh.geometry) this.waterMesh.geometry.dispose();
      if (this.waterMesh.material) this.waterMesh.material.dispose();
      this.waterMesh = null;
    }
    if (this.vessels) {
      this.group.remove(this.vessels.group);
      this.vessels = null;
    }
    if (this.attributionEl && this.attributionEl.parentNode) {
      this.attributionEl.parentNode.removeChild(this.attributionEl);
      this.attributionEl = null;
    }
    this.scene.remove(this.group);
    this.isActive = false;
  }
}
