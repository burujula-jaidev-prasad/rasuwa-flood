import * as THREE from 'three';
import { PEAKS } from './data.js';

// Deterministic 2D noise generator
function hash2D(x, z) {
  const n = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453123;
  return n - Math.floor(n);
}

function valueNoise(x, z) {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;

  const ux = fx * fx * fx * (fx * (fx * 6 - 15) + 10);
  const uz = fz * fz * fz * (fz * (fz * 6 - 15) + 10);

  const a = hash2D(ix, iz);
  const b = hash2D(ix + 1, iz);
  const c = hash2D(ix, iz + 1);
  const d = hash2D(ix + 1, iz + 1);

  return a + (b - a) * ux + (c - a) * uz + (a - b - c + d) * ux * uz;
}

function ridgedNoise(x, z) {
  let val = 0;
  let amp = 1.0;
  let freq = 0.022;
  let maxAmp = 0;

  for (let o = 0; o < 4; o++) {
    const n = valueNoise(x * freq, z * freq);
    let r = 1.0 - Math.abs(2.0 * n - 1.0);
    r = r * r;
    val += r * amp;
    maxAmp += amp;
    amp *= 0.48;
    freq *= 2.1;
  }

  return val / maxAmp;
}

function rockCrags(x, z) {
  let n = 0;
  n += Math.sin(x * 0.18 + z * 0.12) * 1.2;
  n += Math.sin(x * 0.42 - z * 0.38) * 0.6;
  n += Math.cos(x * 0.85 + z * 0.92) * 0.25;
  return n;
}

export function createTerrain(riverSystem) {
  const GRID_SIZE = 168; // 168 quads per side
  const AREA = 120;      // 240x240 unit plane, bounds [-120, +120]

  const geometry = new THREE.PlaneGeometry(AREA * 2, AREA * 2, GRID_SIZE, GRID_SIZE);
  geometry.rotateX(-Math.PI / 2);

  const posAttr = geometry.attributes.position;
  const count = posAttr.count;

  // Elevation color palette
  const colValley    = new THREE.Color(0x2d4a34); // Valley greenery
  const colForest    = new THREE.Color(0x3a5d3b); // Subalpine forest
  const colAlpine    = new THREE.Color(0x5f5f44); // Alpine meadows
  const colMoraine   = new THREE.Color(0x736954); // Scree/moraine
  const colDarkRock  = new THREE.Color(0x292c30); // Sheer granite cliff face
  const colLightRock = new THREE.Color(0x63676e); // Exposed rocky crests
  const colIceBlue   = new THREE.Color(0x9eccdf); // Hanging glacier / blue serac ice
  const colSnow      = new THREE.Color(0xf5f8fa); // Pure Himalayan snow
  const colGorgeRock = new THREE.Color(0x45423c); // Scoured canyon bedrock

  const colors = new Float32Array(count * 3);

  // 1. Calculate heights with ZERO hills in the river path
  for (let i = 0; i < count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);

    const riverInfo = riverSystem.getClosestRiverInfo(x, z);
    const riverDist = riverInfo.distance;
    const u = riverInfo.u;

    // Valley widens downstream as the river flows from the gorge into open plains
    const bedWidth = 7.0 + u * 6.0;      // 7.0 at source -> 13.0 downstream
    const valleyWidth = 24.0 + u * 28.0; // 24.0 at source -> 52.0 downstream

    // Base relief: suppress noise bumps inside the river valley corridor
    const valleyNoiseSuppression = Math.min(1.0, Math.pow(riverDist / valleyWidth, 1.5));
    let h = (ridgedNoise(x, z) * 14.0 + 3.0) * (0.2 + 0.8 * valleyNoiseSuppression);

    // Procedural Himalayan peaks
    for (const peak of PEAKS) {
      const dx = x - peak.x;
      const dz = z - peak.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < peak.w * 2.5) {
        if (peak.isMain) {
          // Realistic pyramidal horn for Langtang Lirung (7,227 m)
          const angle = Math.atan2(dz, dx);
          const ridgeMod = Math.pow(Math.abs(Math.cos(angle * 1.5 + 0.3)), 2.2);
          const ridgeSharpness = 0.65 + ridgeMod * 0.75;
          const normDist = dist / peak.w;
          const pyramid = Math.max(0, 1.0 - normDist);
          const hornShape = Math.pow(pyramid, 1.35) * peak.h;
          const crags = rockCrags(x, z) * (pyramid * 3.5);
          h += (hornShape * ridgeSharpness) + crags;
        } else {
          const gaussian = peak.h * Math.exp(-(dist * dist) / (2.0 * peak.w * peak.w));
          const crags = rockCrags(x, z) * 1.4;
          h += gaussian + crags;
        }
      }
    }

    // COMPLETE CANYON & VALLEY CLEARANCE: NO HILLS IN RIVER PATH
    if (riverDist < valleyWidth) {
      const bedFloor = riverInfo.riverY - 1.4;

      if (riverDist <= bedWidth) {
        // Flat, clear riverbed strictly below water level
        h = Math.min(h, bedFloor);
      } else {
        // Smoothly graded valley walls rising out of the canyon to mountain slopes
        const t = (riverDist - bedWidth) / (valleyWidth - bedWidth);
        const wallProfile = t * t * (3.0 - 2.0 * t); // Smooth hermite step
        const maxAllowedHeight = bedFloor + Math.min(Math.max(0, h - bedFloor), 28.0) * wallProfile;
        h = Math.min(h, maxAllowedHeight);
      }
    }

    posAttr.setY(i, h);
  }

  posAttr.needsUpdate = true;
  geometry.computeVertexNormals();

  // 2. Slope-Dependent Alpine Shading
  const normAttr = geometry.attributes.normal;

  for (let i = 0; i < count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);

    const ny = normAttr.getY(i);
    const steepness = Math.max(0, Math.min(1, 1.0 - ny));

    const vertexCol = new THREE.Color();

    if (y < 6.0) {
      vertexCol.copy(colValley);
    } else if (y < 12.0) {
      const t = (y - 6.0) / 6.0;
      vertexCol.copy(colValley).lerp(colForest, t);
    } else if (y < 20.0) {
      const t = (y - 12.0) / 8.0;
      vertexCol.copy(colForest).lerp(colAlpine, t);
    } else if (y < 30.0) {
      const t = (y - 20.0) / 10.0;
      const baseRock = new THREE.Color().copy(colMoraine).lerp(colLightRock, t);
      if (steepness > 0.45) {
        baseRock.lerp(colDarkRock, (steepness - 0.45) * 1.5);
      }
      vertexCol.copy(baseRock);
    } else {
      if (steepness > 0.52) {
        // Sheer rock cliff: dark fractured granite exposed
        const cliffT = Math.min(1.0, (steepness - 0.52) * 2.2);
        vertexCol.copy(colLightRock).lerp(colDarkRock, cliffT);
      } else if (steepness > 0.35) {
        // Serac blue ice
        const iceT = (steepness - 0.35) / 0.17;
        vertexCol.copy(colSnow).lerp(colIceBlue, iceT * 0.7);
      } else {
        // Deep pure snowpack
        vertexCol.copy(colSnow);
      }
    }

    // High cirque glacier blue ice
    const dxL = x - (-100);
    const dzL = z - (-94);
    const distToLangtang = Math.sqrt(dxL * dxL + dzL * dzL);
    if (distToLangtang < 34.0 && y > 26.0 && steepness < 0.48) {
      vertexCol.lerp(colIceBlue, 0.55);
    }

    // Canyon scoured bedrock tint
    const riverInfo = riverSystem.getClosestRiverInfo(x, z);
    if (riverInfo.distance < 20.0) {
      const canyonT = 1.0 - (riverInfo.distance / 20.0);
      vertexCol.lerp(colGorgeRock, canyonT * 0.65);
    }

    colors[i * 3 + 0] = vertexCol.r;
    colors[i * 3 + 1] = vertexCol.g;
    colors[i * 3 + 2] = vertexCol.b;
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.85,
    metalness: 0.08,
    flatShading: false
  });

  const terrainMesh = new THREE.Mesh(geometry, material);
  terrainMesh.name = "TerrainMesh";
  terrainMesh.receiveShadow = true;
  terrainMesh.castShadow = true;

  function getTerrainHeight(x, z) {
    const riverInfo = riverSystem.getClosestRiverInfo(x, z);
    const riverDist = riverInfo.distance;
    const u = riverInfo.u;

    const bedWidth = 7.0 + u * 6.0;
    const valleyWidth = 24.0 + u * 28.0;

    const valleyNoiseSuppression = Math.min(1.0, Math.pow(riverDist / valleyWidth, 1.5));
    let h = (ridgedNoise(x, z) * 14.0 + 3.0) * (0.2 + 0.8 * valleyNoiseSuppression);

    for (const peak of PEAKS) {
      const dx = x - peak.x;
      const dz = z - peak.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < peak.w * 2.5) {
        if (peak.isMain) {
          const angle = Math.atan2(dz, dx);
          const ridgeMod = Math.pow(Math.abs(Math.cos(angle * 1.5 + 0.3)), 2.2);
          const ridgeSharpness = 0.65 + ridgeMod * 0.75;
          const normDist = dist / peak.w;
          const pyramid = Math.max(0, 1.0 - normDist);
          const hornShape = Math.pow(pyramid, 1.35) * peak.h;
          const crags = rockCrags(x, z) * (pyramid * 3.5);
          h += (hornShape * ridgeSharpness) + crags;
        } else {
          const gaussian = peak.h * Math.exp(-(dist * dist) / (2.0 * peak.w * peak.w));
          const crags = rockCrags(x, z) * 1.4;
          h += gaussian + crags;
        }
      }
    }

    if (riverDist < valleyWidth) {
      const bedFloor = riverInfo.riverY - 1.4;
      if (riverDist <= bedWidth) {
        h = Math.min(h, bedFloor);
      } else {
        const t = (riverDist - bedWidth) / (valleyWidth - bedWidth);
        const wallProfile = t * t * (3.0 - 2.0 * t);
        const maxAllowedHeight = bedFloor + Math.min(Math.max(0, h - bedFloor), 28.0) * wallProfile;
        h = Math.min(h, maxAllowedHeight);
      }
    }
    return h;
  }

  return { mesh: terrainMesh, geometry, getTerrainHeight };
}
