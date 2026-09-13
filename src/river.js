import * as THREE from 'three';
import { getScenario } from './data.js';

export class RiverSystem {
  constructor(controlPoints = null, options = {}) {
    const scenario = getScenario();
    const pts = controlPoints || scenario.riverPoints;
    this.options = options;
    this.scenarioId = options.scenarioId || scenario.config.id;

    const vectors = pts.map(p => new THREE.Vector3(p.x, p.y, p.z));
    this.curve = new THREE.CatmullRomCurve3(vectors, false, 'catmullrom', 0.5);

    this.sampleCount = 420;
    this.points = this.curve.getSpacedPoints(this.sampleCount);

    this.tangents = [];
    this.sides = [];
    const up = new THREE.Vector3(0, 1, 0);

    for (let i = 0; i <= this.sampleCount; i++) {
      const u = i / this.sampleCount;
      const tangent = this.curve.getTangent(u);
      this.tangents.push(tangent);
      const side = new THREE.Vector3().crossVectors(tangent, up).normalize();
      this.sides.push(side);
    }
  }

  getPointAt(u) {
    const clampedU = Math.max(0, Math.min(1, u));
    return this.curve.getPointAt(clampedU);
  }

  getTangentAt(u) {
    const clampedU = Math.max(0, Math.min(1, u));
    return this.curve.getTangentAt(clampedU);
  }

  getClosestRiverInfo(x, z) {
    let minDistSq = Infinity;
    let closestIndex = 0;

    // Coarse search
    let bestStep = 0;
    for (let i = 0; i <= this.sampleCount; i += 4) {
      const pt = this.points[i];
      const dx = x - pt.x;
      const dz = z - pt.z;
      const dsq = dx * dx + dz * dz;
      if (dsq < minDistSq) {
        minDistSq = dsq;
        bestStep = i;
      }
    }

    // Fine search
    const start = Math.max(0, bestStep - 4);
    const end = Math.min(this.sampleCount, bestStep + 4);
    for (let i = start; i <= end; i++) {
      const pt = this.points[i];
      const dx = x - pt.x;
      const dz = z - pt.z;
      const dsq = dx * dx + dz * dz;
      if (dsq < minDistSq) {
        minDistSq = dsq;
        closestIndex = i;
      }
    }

    const closest = this.points[closestIndex];
    return {
      distance: Math.sqrt(minDistSq),
      riverY: closest.y,
      riverX: closest.x,
      riverZ: closest.z,
      u: closestIndex / this.sampleCount
    };
  }

  // River water ribbon
  createWaterMesh() {
    const isDelhi = (this.scenarioId === 'delhi');
    const isNewYork = (this.scenarioId === 'newyork');
    const isBeijing = (this.scenarioId === 'beijing');
    const isTokyo = (this.scenarioId === 'tokyo');
    const isLondon = (this.scenarioId === 'london');
    const width = isLondon ? 17.5 : (isNewYork ? 28.0 : (isTokyo ? 15.5 : (isBeijing ? 12.5 : (isDelhi ? 11.5 : 5.2))));
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const uvs = [];
    const indices = [];

    for (let i = 0; i <= this.sampleCount; i++) {
      const pt = this.points[i];
      const side = this.sides[i];

      const left = new THREE.Vector3().copy(pt).addScaledVector(side, -width * 0.5);
      const right = new THREE.Vector3().copy(pt).addScaledVector(side, width * 0.5);

      // Elevated slightly above floor
      left.y += 0.2;
      right.y += 0.2;

      vertices.push(left.x, left.y, left.z);
      vertices.push(right.x, right.y, right.z);

      const vU = i / this.sampleCount;
      uvs.push(0, vU);
      uvs.push(1, vU);

      if (i < this.sampleCount) {
        const row = i * 2;
        indices.push(row, row + 1, row + 2);
        indices.push(row + 1, row + 3, row + 2);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    let waterColor = 0x22809e; // Glacial cyan default
    if (isLondon) {
      waterColor = 0x2a3d4d; // Brackish, cold tidal Thames estuarine grey-blue
    } else if (isNewYork) {
      waterColor = 0x0284c7; // Vibrant morning Atlantic / Upper NY Bay azure blue
    } else if (isTokyo) {
      waterColor = 0x2c4355; // Turbid estuarine storm water
    } else if (isBeijing) {
      waterColor = 0x6b4528; // Turbid loess & mountain silt clay
    } else if (isDelhi) {
      waterColor = 0x5a4835; // Silt monsoonal mud
    }

    const material = new THREE.MeshStandardMaterial({
      color: waterColor,
      roughness: isLondon ? 0.32 : (isNewYork ? 0.22 : (isTokyo ? 0.28 : (isBeijing ? 0.38 : (isDelhi ? 0.35 : 0.18)))),
      metalness: isLondon ? 0.20 : (isNewYork ? 0.25 : (isTokyo ? 0.20 : 0.15)),
      transparent: true,
      opacity: 0.94,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = "RiverWater";
    return mesh;
  }

  // Dynamic muddy, churning flood surge ribbon that inundates the riverbed & floodplain
  createFloodTrail() {
    const maxPoints = this.sampleCount + 1;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(maxPoints * 2 * 3);
    const colors = new Float32Array(maxPoints * 2 * 3);
    const indices = [];

    for (let i = 0; i < maxPoints - 1; i++) {
      const row = i * 2;
      indices.push(row, row + 1, row + 2);
      indices.push(row + 1, row + 3, row + 2);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setIndex(indices);

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.45,
      metalness: 0.1,
      transparent: true,
      opacity: 0.96,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    mesh.name = "FloodSurge";
    return { mesh, geometry, positions, colors };
  }

  updateFloodTrail(trailObj, uFront) {
    if (uFront <= 0.001) {
      trailObj.mesh.visible = false;
      return;
    }

    trailObj.mesh.visible = true;
    const targetIdx = Math.min(Math.floor(uFront * this.sampleCount), this.sampleCount);
    const pos = trailObj.positions;
    const col = trailObj.colors;

    const isDelhi = (this.scenarioId === 'delhi');
    const isNewYork = (this.scenarioId === 'newyork');
    const isBeijing = (this.scenarioId === 'beijing');
    const isTokyo = (this.scenarioId === 'tokyo');
    const isLondon = (this.scenarioId === 'london');
    const baseWidth = isLondon ? 24.0 : (isNewYork ? 26.0 : (isTokyo ? 22.0 : (isBeijing ? 20.0 : (isDelhi ? 22.0 : 8.5))));
    const surgeStage = isLondon ? 2.0 : (isNewYork ? 2.2 : (isTokyo ? 1.8 : (isBeijing ? 1.9 : (isDelhi ? 1.5 : 1.8))));

    let colMud = new THREE.Color(0xb0581e);
    let colFoam = new THREE.Color(0xffaa44);
    if (isLondon) {
      colMud = new THREE.Color(0x324757);   // Cold brackish North Sea storm brine
      colFoam = new THREE.Color(0xa4c6db);  // Frothing grey-white estuarine tidal foam crest
    } else if (isNewYork) {
      colMud = new THREE.Color(0x0284c7);   // Sparkling clear morning ocean surge
      colFoam = new THREE.Color(0xe0f2fe);  // Frothing white/cyan wave crest
    } else if (isTokyo) {
      colMud = new THREE.Color(0x354859);   // Estuarine storm water
      colFoam = new THREE.Color(0x93b7cc);  // Frothing river wave crest
    } else if (isBeijing) {
      colMud = new THREE.Color(0x733f1c);   // Heavy yellow-brown loess & clay torrent
      colFoam = new THREE.Color(0xd49b55);  // Frothing silt spray
    } else if (isDelhi) {
      colMud = new THREE.Color(0x7a4d25);
      colFoam = new THREE.Color(0xdca358);
    }

    for (let i = 0; i <= targetIdx; i++) {
      const pt = this.points[i];
      const side = this.sides[i];

      // Taper slightly at the very front
      const isFront = (i >= targetIdx - 3);
      const w = isFront ? baseWidth * 1.15 : baseWidth;
      const h = isFront ? pt.y + surgeStage + 0.6 : pt.y + surgeStage;

      const lx = pt.x - side.x * (w * 0.5);
      const ly = h;
      const lz = pt.z - side.z * (w * 0.5);

      const rx = pt.x + side.x * (w * 0.5);
      const ry = h;
      const rz = pt.z + side.z * (w * 0.5);

      const idx = i * 6;
      pos[idx + 0] = lx; pos[idx + 1] = ly; pos[idx + 2] = lz;
      pos[idx + 3] = rx; pos[idx + 4] = ry; pos[idx + 5] = rz;

      // Color variation: foaming edges and muddy core
      const c = isFront ? colFoam : colMud;
      const cIdx = i * 6;
      col[cIdx + 0] = c.r; col[cIdx + 1] = c.g; col[cIdx + 2] = c.b;
      col[cIdx + 3] = c.r; col[cIdx + 4] = c.g; col[cIdx + 5] = c.b;
    }

    // Collapse trailing unused vertices
    const lastIdx = targetIdx * 6;
    const lx = pos[lastIdx]; const ly = pos[lastIdx + 1]; const lz = pos[lastIdx + 2];
    const rx = pos[lastIdx + 3]; const ry = pos[lastIdx + 4]; const rz = pos[lastIdx + 5];

    for (let i = targetIdx + 1; i <= this.sampleCount; i++) {
      const idx = i * 6;
      pos[idx + 0] = lx; pos[idx + 1] = ly; pos[idx + 2] = lz;
      pos[idx + 3] = rx; pos[idx + 4] = ry; pos[idx + 5] = rz;
    }

    trailObj.geometry.attributes.position.needsUpdate = true;
    trailObj.geometry.attributes.color.needsUpdate = true;
    trailObj.geometry.setDrawRange(0, Math.max(0, targetIdx) * 6);
  }
}
