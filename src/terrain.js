import * as THREE from 'three';
import { PEAKS, getScenario } from './data.js';
import { getNYCAerialSatelliteTexture, getNYCDigitalTwinTexture } from './scenarios/newyork_textures.js';

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

export function createTerrain(riverSystem, scenarioId = null) {
  const activeScenarioId = scenarioId || getScenario().config.id;
  const isDelhi = (activeScenarioId === 'delhi');

  const GRID_SIZE = 168; // 168 quads per side
  const AREA = 120;      // 240x240 unit plane, bounds [-120, +120]

  const geometry = new THREE.PlaneGeometry(AREA * 2, AREA * 2, GRID_SIZE, GRID_SIZE);
  geometry.rotateX(-Math.PI / 2);

  const posAttr = geometry.attributes.position;
  const count = posAttr.count;
  const colors = new Float32Array(count * 3);

  if (isDelhi) {
    // ----------------------------------------------------
    // ALLUVIAL FLOODPLAIN TERRAIN (DELHI YAMUNA CORRIDOR)
    // ----------------------------------------------------
    const colMud        = new THREE.Color(0x735c42); // Yamuna silt & wet mud
    const colFloodplain = new THREE.Color(0x425732); // Alluvial green floodplain
    const colUrban      = new THREE.Color(0x615c54); // Urban soil & tarmac
    const colBund       = new THREE.Color(0x857766); // Stone embankment / retaining wall
    const colSandstone  = new THREE.Color(0x873e2d); // Red sandstone soil & ramparts

    for (let i = 0; i < count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);

      const riverInfo = riverSystem.getClosestRiverInfo(x, z);
      const riverDist = riverInfo.distance;
      const bedWidth = 12.0;
      const bankWidth = 24.0;

      // Base flat urban topography (elevation ~2.5 - 4.5m)
      let h = 3.2 + valueNoise(x * 0.04, z * 0.04) * 1.6;

      // Northern Delhi Ridge spur (far northwest x < -60, z < -20)
      if (x < -60 && z < -20) {
        const ridgeDist = Math.sqrt((x + 85) * (x + 85) + (z + 45) * (z + 45));
        if (ridgeDist < 45) {
          h += (1.0 - ridgeDist / 45) * 8.5;
        }
      }

      // Riverbed channel & riverbanks
      if (riverDist <= bedWidth) {
        h = riverInfo.riverY - 1.2;
      } else if (riverDist < bankWidth) {
        const t = (riverDist - bedWidth) / (bankWidth - bedWidth);
        const bedFloor = riverInfo.riverY - 1.2;
        const bankTop = riverInfo.riverY + 1.6;
        h = bedFloor + (bankTop - bedFloor) * Math.sin(t * Math.PI * 0.5);
      }

      posAttr.setY(i, h);
    }
    posAttr.needsUpdate = true;
    geometry.computeVertexNormals();

    // Color assignment for Delhi
    for (let i = 0; i < count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const riverInfo = riverSystem.getClosestRiverInfo(x, z);
      const d = riverInfo.distance;

      const vertexCol = new THREE.Color();
      if (d < 14.0) {
        vertexCol.copy(colMud);
      } else if (d < 28.0) {
        const t = (d - 14.0) / 14.0;
        vertexCol.copy(colMud).lerp(colBund, t);
      } else if (d < 45.0) {
        const t = (d - 28.0) / 17.0;
        vertexCol.copy(colBund).lerp(colFloodplain, t);
      } else {
        vertexCol.copy(colFloodplain).lerp(colUrban, 0.45);
      }

      // Red Fort vicinity sandstone accent
      const distToRedFort = Math.sqrt(x * x + z * z);
      if (distToRedFort < 24.0 && x > 4.0) {
        vertexCol.lerp(colSandstone, 0.65);
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
      const bedWidth = 12.0;
      const bankWidth = 24.0;
      let h = 3.2 + valueNoise(x * 0.04, z * 0.04) * 1.6;
      if (x < -60 && z < -20) {
        const ridgeDist = Math.sqrt((x + 85) * (x + 85) + (z + 45) * (z + 45));
        if (ridgeDist < 45) h += (1.0 - ridgeDist / 45) * 8.5;
      }
      if (riverDist <= bedWidth) {
        h = riverInfo.riverY - 1.2;
      } else if (riverDist < bankWidth) {
        const t = (riverDist - bedWidth) / (bankWidth - bedWidth);
        const bedFloor = riverInfo.riverY - 1.2;
        const bankTop = riverInfo.riverY + 1.6;
        h = bedFloor + (bankTop - bedFloor) * Math.sin(t * Math.PI * 0.5);
      }
      return h;
    }

    return { mesh: terrainMesh, geometry, getTerrainHeight };
  }

  const isNewYork = (activeScenarioId === 'newyork');
  if (isNewYork) {
    // ----------------------------------------------------
    // COASTAL HARBOR & TIDAL STRAIT TERRAIN (NEW YORK CITY)
    // ----------------------------------------------------
    const colHarborMud  = new THREE.Color(0x0f283d); // Clean deep harbor floor
    const colSeawall    = new THREE.Color(0x94a3b8); // Bright granite seawall / rip-rap
    const colAsphalt    = new THREE.Color(0x374151); // Clean Manhattan street grid asphalt
    const colSidewalk   = new THREE.Color(0xcbd5e1); // Bright clean concrete sidewalk
    const colParkLawn   = new THREE.Color(0x22c55e); // Vibrant lush Battery Park & Brooklyn lawn

    for (let i = 0; i < count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);

      const riverInfo = riverSystem.getClosestRiverInfo(x, z);
      const riverDist = riverInfo.distance;
      const bedWidth = 18.0; // Wide Upper NY Bay & East River fairway
      const bankWidth = 28.0;

      // Base urban coastal topography
      let h = 2.4 + valueNoise(x * 0.04, z * 0.04) * 1.2;

      // Staten Island & Bay Ridge hills at southwest (x < -50, z < -30)
      if (x < -50 && z < -30) {
        const hillDist = Math.sqrt((x + 80) * (x + 80) + (z + 60) * (z + 60));
        if (hillDist < 50) {
          h += (1.0 - hillDist / 50) * 9.5;
        }
      }

      // Harbor fairway & coastal seawall transition
      if (riverDist <= bedWidth) {
        h = riverInfo.riverY - 1.4;
      } else if (riverDist < bankWidth) {
        const t = (riverDist - bedWidth) / (bankWidth - bedWidth);
        const bedFloor = riverInfo.riverY - 1.4;
        const bankTop = riverInfo.riverY + 1.2;
        h = bedFloor + (bankTop - bedFloor) * Math.sin(t * Math.PI * 0.5);
      }

      posAttr.setY(i, h);
    }
    posAttr.needsUpdate = true;
    geometry.computeVertexNormals();

    // Vertex color assignment for New York Harbor
    for (let i = 0; i < count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const riverInfo = riverSystem.getClosestRiverInfo(x, z);
      const d = riverInfo.distance;

      const vertexCol = new THREE.Color();
      if (d < 18.0) {
        vertexCol.copy(colHarborMud);
      } else if (d < 28.0) {
        const t = (d - 18.0) / 10.0;
        vertexCol.copy(colHarborMud).lerp(colSeawall, t);
      } else if (d < 38.0) {
        const t = (d - 28.0) / 10.0;
        // Battery Park and waterfront parks greenery
        if (z > -25 && z < 25 && x > 0) {
          vertexCol.copy(colSeawall).lerp(colParkLawn, t * 0.85);
        } else {
          vertexCol.copy(colSeawall).lerp(colSidewalk, t);
        }
      } else {
        vertexCol.copy(colSidewalk).lerp(colAsphalt, 0.65);
      }

      colors[i * 3 + 0] = vertexCol.r;
      colors[i * 3 + 1] = vertexCol.g;
      colors[i * 3 + 2] = vertexCol.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const satelliteTex = getNYCAerialSatelliteTexture();
    const digitalTwinTex = getNYCDigitalTwinTexture();

    const material = satelliteTex ? new THREE.MeshStandardMaterial({
      map: satelliteTex,
      roughness: 0.68,
      metalness: 0.12,
      flatShading: false
    }) : new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.65,
      metalness: 0.05,
      flatShading: false
    });

    const terrainMesh = new THREE.Mesh(geometry, material);
    terrainMesh.name = "TerrainMesh";
    terrainMesh.receiveShadow = true;
    terrainMesh.castShadow = true;

    function setTwinMode(mode) {
      if (activeScenarioId !== 'newyork') return;
      if (mode === 'digital_twin') {
        if (digitalTwinTex) {
          material.map = digitalTwinTex;
          material.roughness = 0.45;
          material.metalness = 0.35;
          material.needsUpdate = true;
        }
      } else {
        if (satelliteTex) {
          material.map = satelliteTex;
          material.roughness = 0.68;
          material.metalness = 0.12;
          material.needsUpdate = true;
        }
      }
    }

    function getTerrainHeight(x, z) {
      const riverInfo = riverSystem.getClosestRiverInfo(x, z);
      const riverDist = riverInfo.distance;
      const bedWidth = 18.0;
      const bankWidth = 28.0;
      let h = 2.4 + valueNoise(x * 0.04, z * 0.04) * 1.2;
      if (x < -50 && z < -30) {
        const hillDist = Math.sqrt((x + 80) * (x + 80) + (z + 60) * (z + 60));
        if (hillDist < 50) h += (1.0 - hillDist / 50) * 9.5;
      }
      if (riverDist <= bedWidth) {
        h = riverInfo.riverY - 1.4;
      } else if (riverDist < bankWidth) {
        const t = (riverDist - bedWidth) / (bankWidth - bedWidth);
        const bedFloor = riverInfo.riverY - 1.4;
        const bankTop = riverInfo.riverY + 1.2;
        h = bedFloor + (bankTop - bedFloor) * Math.sin(t * Math.PI * 0.5);
      }
      return h;
    }

    return { mesh: terrainMesh, geometry, getTerrainHeight, setTwinMode };
  }

  const isBeijing = (activeScenarioId === 'beijing');
  if (isBeijing) {
    // ----------------------------------------------------
    // MOUNTAIN GORGE TO URBAN PLAIN (BEIJING MENTOUGOU)
    // ----------------------------------------------------
    const colGorgeRock  = new THREE.Color(0x3e444d); // Taihang dark granite crags
    const colLoessMud   = new THREE.Color(0x7c532e); // Yellow-brown loess & flood silt
    const colMountainVeg= new THREE.Color(0x2f462e); // Taihang pine & shrub
    const colPlain      = new THREE.Color(0x445338); // Western Beijing alluvial green
    const colUrbanTarmac= new THREE.Color(0x292524); // Highway G109 tarmac & urban ground

    for (let i = 0; i < count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);

      const riverInfo = riverSystem.getClosestRiverInfo(x, z);
      const riverDist = riverInfo.distance;
      const u = riverInfo.u;

      // Canyon gorge width expands from 8m in mountains to 18m on plain
      const bedWidth = 8.0 + u * 10.0;
      const bankWidth = 18.0 + u * 12.0;

      // Base elevation: High Taihang mountains in northwest (x < 15), flat plain in southeast (x >= 15)
      let h = 3.0 + valueNoise(x * 0.04, z * 0.04) * 1.5;

      // Grand Taihang Mountain canyon walls flanking the northwest (smooth natural frequencies)
      if (x < 15) {
        const mountainFactor = Math.min(1.0, Math.max(0, (15 - x) / 75));
        const ridgeH = (ridgedNoise(x * 0.16, z * 0.16) * 16.0 + 6.0) * mountainFactor;
        // Clean gorge fluvial terrace corridor: completely flat terraces within 26m of river channel
        const gorgeSuppression = Math.min(1.0, Math.max(0, (riverDist - bedWidth) / (bankWidth + 10.0)));
        const smoothGorge = Math.pow(gorgeSuppression, 2.2);
        h += ridgeH * smoothGorge;
      }

      // Gorge riverbed floor & riverbank cutting
      if (riverDist <= bedWidth) {
        h = riverInfo.riverY - 1.2;
      } else if (riverDist < bankWidth) {
        const t = (riverDist - bedWidth) / (bankWidth - bedWidth);
        const bedFloor = riverInfo.riverY - 1.2;
        const bankTop = riverInfo.riverY + (x < 0 ? 2.6 : 1.2);
        h = bedFloor + (bankTop - bedFloor) * Math.sin(t * Math.PI * 0.5);
      }

      posAttr.setY(i, h);
    }
    posAttr.needsUpdate = true;
    geometry.computeVertexNormals();

    // Vertex colors for Beijing Mentougou
    for (let i = 0; i < count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const riverInfo = riverSystem.getClosestRiverInfo(x, z);
      const d = riverInfo.distance;
      const u = riverInfo.u;

      const vertexCol = new THREE.Color();
      if (d < 10.0 + u * 6.0) {
        vertexCol.copy(colLoessMud);
      } else if (d < 22.0) {
        const t = (d - 10.0) / 12.0;
        if (x < 0) {
          vertexCol.copy(colLoessMud).lerp(colGorgeRock, t);
        } else {
          vertexCol.copy(colLoessMud).lerp(colPlain, t);
        }
      } else if (x < 0) {
        // High mountain slopes
        const t = Math.min(1.0, (d - 22.0) / 25.0);
        vertexCol.copy(colGorgeRock).lerp(colMountainVeg, t * 0.7);
      } else {
        // Urban plain & retention basin
        vertexCol.copy(colPlain).lerp(colUrbanTarmac, 0.4);
      }

      colors[i * 3 + 0] = vertexCol.r;
      colors[i * 3 + 1] = vertexCol.g;
      colors[i * 3 + 2] = vertexCol.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.85,
      metalness: 0.1,
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
      const bedWidth = 8.0 + u * 10.0;
      const bankWidth = 18.0 + u * 12.0;
      let h = 3.0 + valueNoise(x * 0.04, z * 0.04) * 1.5;
      if (x < 15) {
        const mountainFactor = Math.min(1.0, Math.max(0, (15 - x) / 75));
        const ridgeH = (ridgedNoise(x * 0.16, z * 0.16) * 16.0 + 6.0) * mountainFactor;
        const gorgeSuppression = Math.min(1.0, Math.max(0, (riverDist - bedWidth) / (bankWidth + 10.0)));
        const smoothGorge = Math.pow(gorgeSuppression, 2.2);
        h += ridgeH * smoothGorge;
      }
      if (riverDist <= bedWidth) {
        h = riverInfo.riverY - 1.2;
      } else if (riverDist < bankWidth) {
        const t = (riverDist - bedWidth) / (bankWidth - bedWidth);
        const bedFloor = riverInfo.riverY - 1.2;
        const bankTop = riverInfo.riverY + (x < 0 ? 2.6 : 1.2);
        h = bedFloor + (bankTop - bedFloor) * Math.sin(t * Math.PI * 0.5);
      }
      return h;
    }

    return { mesh: terrainMesh, geometry, getTerrainHeight };
  }

  const isTokyo = (activeScenarioId === 'tokyo');
  if (isTokyo) {
    // ----------------------------------------------------
    // KANTO ALLUVIAL PLAIN & SUPER-LEVEE (TOKYO ARAKAWA)
    // ----------------------------------------------------
    const colRiverSilt    = new THREE.Color(0x334155); // Arakawa riverbed dark silt
    const colLeveeGrass   = new THREE.Color(0x365314); // Super-levee manicured embankment grass
    const colRiversidePark= new THREE.Color(0x2d5a27); // Riverside baseball fields & turf
    const colTokyoAsphalt = new THREE.Color(0x27272a); // Tokyo metropolitan street grid
    const colUrbanConcrete= new THREE.Color(0x52525b); // Concrete retaining walls & seawalls

    for (let i = 0; i < count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);

      const riverInfo = riverSystem.getClosestRiverInfo(x, z);
      const riverDist = riverInfo.distance;
      const bedWidth = 14.0;
      const leveeToe = 20.0;
      const leveeCrown = 28.0;

      // Base plain elevation (slight slope from NW to SE Tokyo Bay)
      let h = 2.4 + valueNoise(x * 0.04, z * 0.04) * 0.8;

      // East Tokyo Koto 5-Ward Zero-Meter Zone depression (x > 15, z > -10)
      if (x > 15 && z > -10) {
        h = Math.max(1.2, h - 0.9);
      }

      // Riverbed channel & Super-Levee embankment
      if (riverDist <= bedWidth) {
        h = riverInfo.riverY - 1.2;
      } else if (riverDist < leveeToe) {
        const t = (riverDist - bedWidth) / (leveeToe - bedWidth);
        const bedFloor = riverInfo.riverY - 1.2;
        const leveeTop = riverInfo.riverY + 2.2;
        h = bedFloor + (leveeTop - bedFloor) * Math.sin(t * Math.PI * 0.5);
      } else if (riverDist < leveeCrown) {
        const t = (riverDist - leveeToe) / (leveeCrown - leveeToe);
        const leveeTop = riverInfo.riverY + 2.2;
        const plainH = 2.4;
        h = leveeTop - (leveeTop - plainH) * Math.sin(t * Math.PI * 0.5);
      }

      posAttr.setY(i, h);
    }
    posAttr.needsUpdate = true;
    geometry.computeVertexNormals();

    // Vertex colors for Tokyo
    for (let i = 0; i < count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const riverInfo = riverSystem.getClosestRiverInfo(x, z);
      const d = riverInfo.distance;

      const vertexCol = new THREE.Color();
      if (d < 14.0) {
        vertexCol.copy(colRiverSilt);
      } else if (d < 22.0) {
        const t = (d - 14.0) / 8.0;
        vertexCol.copy(colRiverSilt).lerp(colLeveeGrass, t);
      } else if (d < 30.0) {
        const t = (d - 22.0) / 8.0;
        vertexCol.copy(colLeveeGrass).lerp(colRiversidePark, t);
      } else if (d < 40.0) {
        const t = (d - 30.0) / 10.0;
        vertexCol.copy(colRiversidePark).lerp(colUrbanConcrete, t);
      } else {
        vertexCol.copy(colUrbanConcrete).lerp(colTokyoAsphalt, 0.65);
      }

      colors[i * 3 + 0] = vertexCol.r;
      colors[i * 3 + 1] = vertexCol.g;
      colors[i * 3 + 2] = vertexCol.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.78,
      metalness: 0.12,
      flatShading: false
    });

    const terrainMesh = new THREE.Mesh(geometry, material);
    terrainMesh.name = "TerrainMesh";
    terrainMesh.receiveShadow = true;
    terrainMesh.castShadow = true;

    function getTerrainHeight(x, z) {
      const riverInfo = riverSystem.getClosestRiverInfo(x, z);
      const riverDist = riverInfo.distance;
      const bedWidth = 14.0;
      const leveeToe = 20.0;
      const leveeCrown = 28.0;
      let h = 2.4 + valueNoise(x * 0.04, z * 0.04) * 0.8;
      if (x > 15 && z > -10) {
        h = Math.max(1.2, h - 0.9);
      }
      if (riverDist <= bedWidth) {
        h = riverInfo.riverY - 1.2;
      } else if (riverDist < leveeToe) {
        const t = (riverDist - bedWidth) / (leveeToe - bedWidth);
        const bedFloor = riverInfo.riverY - 1.2;
        const leveeTop = riverInfo.riverY + 2.2;
        h = bedFloor + (leveeTop - bedFloor) * Math.sin(t * Math.PI * 0.5);
      } else if (riverDist < leveeCrown) {
        const t = (riverDist - leveeToe) / (leveeCrown - leveeToe);
        const leveeTop = riverInfo.riverY + 2.2;
        const plainH = 2.4;
        h = leveeTop - (leveeTop - plainH) * Math.sin(t * Math.PI * 0.5);
      }
      return h;
    }

    return { mesh: terrainMesh, geometry, getTerrainHeight };
  }

  const isLondon = (activeScenarioId === 'london');
  if (isLondon) {
    // ----------------------------------------------------
    // TIDAL ESTUARY & EMBANKMENTS (LONDON THAMES CORRIDOR)
    // ----------------------------------------------------
    const colThamesMud   = new THREE.Color(0x3e3730); // Brackish tidal silt & riverbed mud
    const colGraniteWall = new THREE.Color(0x64748b); // Victorian Bazalgette stone river walls
    const colEmbankment  = new THREE.Color(0x3f532a); // Victoria Embankment gardens & park turf
    const colLondonPave  = new THREE.Color(0x475569); // Whitehall & City granite flagstones
    const colAsphalt     = new THREE.Color(0x27272a); // London road network & docks

    for (let i = 0; i < count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);

      const riverInfo = riverSystem.getClosestRiverInfo(x, z);
      const riverDist = riverInfo.distance;
      const bedWidth = 15.0;
      const wallToe = 22.0;
      const terraceDist = 30.0;

      // Base undulating London Basin clay plain (gentle 1.8 - 3.2m elevation)
      let h = 2.2 + valueNoise(x * 0.035, z * 0.035) * 1.0;

      // Docklands cut-ins / impounded basins near Canary Wharf (x in [-50, -10], z in [-30, 0])
      if (x > -50 && x < -10 && z > -30 && z < 0 && riverDist > 16.0 && riverDist < 26.0) {
        h = 1.4;
      }

      // Riverbed channel & Stone Embankments
      if (riverDist <= bedWidth) {
        h = riverInfo.riverY - 1.4;
      } else if (riverDist < wallToe) {
        const t = (riverDist - bedWidth) / (wallToe - bedWidth);
        const bedFloor = riverInfo.riverY - 1.4;
        const wallTop = riverInfo.riverY + 2.0;
        h = bedFloor + (wallTop - bedFloor) * Math.sin(t * Math.PI * 0.5);
      } else if (riverDist < terraceDist) {
        const t = (riverDist - wallToe) / (terraceDist - wallToe);
        const wallTop = riverInfo.riverY + 2.0;
        const plainH = 2.2;
        h = wallTop - (wallTop - plainH) * Math.sin(t * Math.PI * 0.5);
      }

      posAttr.setY(i, h);
    }
    posAttr.needsUpdate = true;
    geometry.computeVertexNormals();

    // Vertex colors for London
    for (let i = 0; i < count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const riverInfo = riverSystem.getClosestRiverInfo(x, z);
      const d = riverInfo.distance;

      const vertexCol = new THREE.Color();
      if (d < 15.0) {
        vertexCol.copy(colThamesMud);
      } else if (d < 22.0) {
        const t = (d - 15.0) / 7.0;
        vertexCol.copy(colThamesMud).lerp(colGraniteWall, t);
      } else if (d < 30.0) {
        const t = (d - 22.0) / 8.0;
        vertexCol.copy(colGraniteWall).lerp(colEmbankment, t);
      } else if (d < 42.0) {
        const t = (d - 30.0) / 12.0;
        vertexCol.copy(colEmbankment).lerp(colLondonPave, t);
      } else {
        vertexCol.copy(colLondonPave).lerp(colAsphalt, 0.60);
      }

      colors[i * 3 + 0] = vertexCol.r;
      colors[i * 3 + 1] = vertexCol.g;
      colors[i * 3 + 2] = vertexCol.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.80,
      metalness: 0.10,
      flatShading: false
    });

    const terrainMesh = new THREE.Mesh(geometry, material);
    terrainMesh.name = "TerrainMesh";
    terrainMesh.receiveShadow = true;
    terrainMesh.castShadow = true;

    function getTerrainHeight(x, z) {
      const riverInfo = riverSystem.getClosestRiverInfo(x, z);
      const riverDist = riverInfo.distance;
      const bedWidth = 15.0;
      const wallToe = 22.0;
      const terraceDist = 30.0;
      let h = 2.2 + valueNoise(x * 0.035, z * 0.035) * 1.0;
      if (x > -50 && x < -10 && z > -30 && z < 0 && riverDist > 16.0 && riverDist < 26.0) {
        return 1.4;
      }
      if (riverDist <= bedWidth) {
        h = riverInfo.riverY - 1.4;
      } else if (riverDist < wallToe) {
        const t = (riverDist - bedWidth) / (wallToe - bedWidth);
        const bedFloor = riverInfo.riverY - 1.4;
        const wallTop = riverInfo.riverY + 2.0;
        h = bedFloor + (wallTop - bedFloor) * Math.sin(t * Math.PI * 0.5);
      } else if (riverDist < terraceDist) {
        const t = (riverDist - wallToe) / (terraceDist - wallToe);
        const wallTop = riverInfo.riverY + 2.0;
        const plainH = 2.2;
        h = wallTop - (wallTop - plainH) * Math.sin(t * Math.PI * 0.5);
      }
      return h;
    }

    return { mesh: terrainMesh, geometry, getTerrainHeight };
  }

  // ----------------------------------------------------
  // HIMALAYAN ALPINE GORGE TERRAIN (RASUWA SCENARIO)
  // ----------------------------------------------------
  const colValley    = new THREE.Color(0x2d4a34); // Valley greenery
  const colForest    = new THREE.Color(0x3a5d3b); // Subalpine forest
  const colAlpine    = new THREE.Color(0x5f5f44); // Alpine meadows
  const colMoraine   = new THREE.Color(0x736954); // Scree/moraine
  const colDarkRock  = new THREE.Color(0x292c30); // Sheer granite cliff face
  const colLightRock = new THREE.Color(0x63676e); // Exposed rocky crests
  const colIceBlue   = new THREE.Color(0x9eccdf); // Hanging glacier / blue serac ice
  const colSnow      = new THREE.Color(0xf5f8fa); // Pure Himalayan snow
  const colGorgeRock = new THREE.Color(0x45423c); // Scoured canyon bedrock

  for (let i = 0; i < count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);

    const riverInfo = riverSystem.getClosestRiverInfo(x, z);
    const riverDist = riverInfo.distance;
    const u = riverInfo.u;

    const bedWidth = 7.0 + u * 6.0;
    const valleyWidth = 24.0 + u * 28.0;

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
