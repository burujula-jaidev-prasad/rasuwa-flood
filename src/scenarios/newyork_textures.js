import * as THREE from 'three';

let cachedSatelliteTexture = null;
let cachedDigitalTwinTexture = null;
let cachedDigitalTwinBuildingTexture = null;
let cachedGlassTexture = null;
let cachedStoneTexture = null;
let cachedBrickTexture = null;
let cached1WTCTexture = null;
let cachedWaterNormal = null;

/**
 * High-Resolution 2048x2048 Aerial Satellite Orthophoto of New York Harbor
 * Draped across terrain bounds X: [-120, +120], Z: [-120, +120]
 */
export function getNYCAerialSatelliteTexture() {
  if (cachedSatelliteTexture) return cachedSatelliteTexture;
  if (typeof document === 'undefined') return null;

  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx || !ctx.createRadialGradient) return null;

  // Helper coordinate mapper: World X, Z in [-120, 120] -> Canvas [0, size]
  function toCanvas(wx, wz) {
    const u = (wx + 120.0) / 240.0;
    const v = (wz + 120.0) / 240.0;
    return {
      x: u * size,
      y: v * size
    };
  }

  // 1. Deep Harbor Water Background (Upper New York Bay & East River)
  const waterGrad = ctx.createRadialGradient(size * 0.4, size * 0.4, size * 0.05, size * 0.5, size * 0.5, size * 0.75);
  waterGrad.addColorStop(0.0, '#0c4a6e'); // Deep Upper Bay fairway
  waterGrad.addColorStop(0.35, '#075985');
  waterGrad.addColorStop(0.7, '#0369a1');
  waterGrad.addColorStop(1.0, '#082f49');
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, 0, size, size);

  // Harbor navigation fairway channel (The Narrows -> Upper Bay -> East River)
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.20)';
  ctx.lineWidth = 36;
  ctx.beginPath();
  const fw1 = toCanvas(-112, -62);
  const fw2 = toCanvas(-56, -28);
  const fw3 = toCanvas(2.8, 1.4);
  const fw4 = toCanvas(70, 42);
  const fw5 = toCanvas(120, 78);
  ctx.moveTo(fw1.x, fw1.y);
  ctx.bezierCurveTo(fw2.x, fw2.y, fw3.x, fw3.y, fw4.x, fw4.y);
  ctx.lineTo(fw5.x, fw5.y);
  ctx.stroke();

  // Subtle wave wakes and tidal ripples
  for (let w = 0; w < 160; w++) {
    const rx = Math.random() * size;
    const ry = Math.random() * size;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.arc(rx, ry, 25 + Math.random() * 90, -0.4, 0.4);
    ctx.stroke();
  }

  // 2. Staten Island Shoreline (West of The Narrows, bottom-left)
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  const si1 = toCanvas(-120, -120);
  const si2 = toCanvas(-120, -45);
  const si3 = toCanvas(-110, -55);
  const si4 = toCanvas(-100, -85);
  const si5 = toCanvas(-85, -120);
  ctx.moveTo(si1.x, si1.y);
  ctx.lineTo(si2.x, si2.y);
  ctx.bezierCurveTo(si3.x, si3.y, si4.x, si4.y, si5.x, si5.y);
  ctx.closePath();
  ctx.fill();

  // Staten Island green hill cover
  ctx.fillStyle = '#14532d';
  ctx.beginPath();
  const sih1 = toCanvas(-120, -120);
  const sih2 = toCanvas(-120, -60);
  const sih3 = toCanvas(-105, -95);
  ctx.moveTo(sih1.x, sih1.y);
  ctx.lineTo(sih2.x, sih2.y);
  ctx.lineTo(sih3.x, sih3.y);
  ctx.closePath();
  ctx.fill();

  // 3. Governors Island (Center of Upper Bay)
  const govCenter = toCanvas(-45, -22);
  ctx.beginPath();
  ctx.ellipse(govCenter.x, govCenter.y, size * 0.052, size * 0.040, -0.35, 0, Math.PI * 2);
  ctx.fillStyle = '#15803d'; // Green park canopy
  ctx.fill();
  ctx.strokeStyle = '#94a3b8'; // Seawall
  ctx.lineWidth = 5;
  ctx.stroke();

  // Fort Jay star fortification outline
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 3;
  ctx.strokeRect(govCenter.x - 14, govCenter.y - 14, 28, 28);

  // 4. Brooklyn Waterfront & DUMBO (East / South shore of the river)
  ctx.fillStyle = '#1e293b'; // Urban base
  ctx.beginPath();
  const bk1 = toCanvas(-75, -120);
  const bk2 = toCanvas(-70, -75);
  const bk3 = toCanvas(-20, -35);
  const bk4 = toCanvas(20, -10);
  const bk5 = toCanvas(45, 12);
  const bk6 = toCanvas(80.3, 27.2); // Brooklyn Bridge Brooklyn tower & DUMBO
  const bk7 = toCanvas(105, 38);
  const bk8 = toCanvas(120, 50);
  const bk9 = toCanvas(120, -120);
  ctx.moveTo(bk1.x, bk1.y);
  ctx.bezierCurveTo(bk2.x, bk2.y, bk3.x, bk3.y, bk4.x, bk4.y);
  ctx.lineTo(bk5.x, bk5.y);
  ctx.lineTo(bk6.x, bk6.y);
  ctx.bezierCurveTo(bk7.x, bk7.y, bk7.x, bk7.y, bk8.x, bk8.y);
  ctx.lineTo(bk9.x, bk9.y);
  ctx.closePath();
  ctx.fill();

  // Brooklyn Bridge Park Piers (Piers 1, 2, 3, 4, 5, 6)
  for (let p = 0; p < 6; p++) {
    const pierBase = toCanvas(32 + p * 8, 2 + p * 4);
    ctx.fillStyle = '#15803d'; // Lawn
    ctx.fillRect(pierBase.x - 16, pierBase.y - 4, 32, 10);
    ctx.strokeStyle = '#0f172a'; // Timber pier apron
    ctx.lineWidth = 2;
    ctx.strokeRect(pierBase.x - 16, pierBase.y - 4, 32, 10);
  }

  // DUMBO Cobblestone Streets & Brick Pavers
  const dumboPt = toCanvas(76.6, 26.6);
  ctx.fillStyle = '#831843'; // DUMBO brick district
  ctx.fillRect(dumboPt.x - 18, dumboPt.y - 14, 36, 28);
  ctx.strokeStyle = '#334155'; // Cobblestone cross-streets
  ctx.lineWidth = 3;
  ctx.strokeRect(dumboPt.x - 18, dumboPt.y - 14, 36, 28);

  // 5. Lower Manhattan Peninsula (West / North shore of the river)
  ctx.fillStyle = '#1e293b'; // Manhattan urban street base
  ctx.beginPath();
  const m1 = toCanvas(-22.0, 5.0);   // The Battery southern tip
  const m2 = toCanvas(-1.1, 15.5);   // Whitehall Ferry Terminal
  const m3 = toCanvas(25.0, 28.0);   // Wall St Pier 11
  const m4 = toCanvas(60.5, 57.3);   // Brooklyn Bridge Manhattan pier
  const m5 = toCanvas(84.2, 68.5);   // ConEd 14th St Substation
  const m6 = toCanvas(120, 95);      // East River northeast outfall
  const m7 = toCanvas(120, 120);     // Top-right corner
  const m8 = toCanvas(-65, 120);     // Hudson River northwest edge
  const m9 = toCanvas(-48, 80);      // Chelsea / Midtown Hudson
  const m10 = toCanvas(-32, 40);     // Tribeca Hudson
  const m11 = toCanvas(-24, 18);     // Battery Park City
  const m12 = toCanvas(-18.0, 15.0); // Castle Clinton tip
  ctx.moveTo(m1.x, m1.y);
  ctx.bezierCurveTo(m2.x, m2.y, m3.x, m3.y, m4.x, m4.y);
  ctx.lineTo(m5.x, m5.y);
  ctx.lineTo(m6.x, m6.y);
  ctx.lineTo(m7.x, m7.y);
  ctx.lineTo(m8.x, m8.y);
  ctx.bezierCurveTo(m9.x, m9.y, m10.x, m10.y, m11.x, m11.y);
  ctx.lineTo(m12.x, m12.y);
  ctx.closePath();
  ctx.fill();

  // 6. Battery Park Lush Green Canopy & Promenade
  const bLawn1 = toCanvas(-24, 10);
  const bLawn2 = toCanvas(-20, 6);
  const bLawn3 = toCanvas(-1.1, 15.5);
  const bLawn4 = toCanvas(-6, 26);
  ctx.fillStyle = '#166534'; // Lush lawn
  ctx.beginPath();
  ctx.moveTo(bLawn1.x, bLawn1.y);
  ctx.lineTo(bLawn2.x, bLawn2.y);
  ctx.lineTo(bLawn3.x, bLawn3.y);
  ctx.lineTo(bLawn4.x, bLawn4.y);
  ctx.closePath();
  ctx.fill();

  // Battery Park tree canopy clusters (stippled circles)
  for (let t = 0; t < 380; t++) {
    const tx = Math.min(bLawn1.x, bLawn4.x) + Math.random() * (Math.max(bLawn2.x, bLawn3.x) - Math.min(bLawn1.x, bLawn4.x));
    const ty = Math.min(bLawn2.y, bLawn1.y) + Math.random() * (Math.max(bLawn3.y, bLawn4.y) - Math.min(bLawn2.y, bLawn1.y));
    ctx.fillStyle = (t % 2 === 0) ? '#15803d' : '#22c55e';
    ctx.beginPath();
    ctx.arc(tx, ty, 3 + Math.random() * 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Castle Clinton Historic Fort (Circular red sandstone fort in Battery Park)
  const castlePt = toCanvas(-17.7, 14.8);
  ctx.fillStyle = '#b91c1c'; // Red sandstone
  ctx.beginPath();
  ctx.arc(castlePt.x, castlePt.y, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#7f1d1d';
  ctx.lineWidth = 4;
  ctx.stroke();
  // Interior courtyard
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.arc(castlePt.x, castlePt.y, 10, 0, Math.PI * 2);
  ctx.fill();

  // 7. Whitehall Ferry Terminal Slips & Water Pockets
  const whPt = toCanvas(-1.1, 15.5);
  ctx.fillStyle = '#334155'; // Terminal apron
  ctx.fillRect(whPt.x - 18, whPt.y - 10, 36, 26);
  // Slips water pockets cut into bulkhead
  ctx.fillStyle = '#0369a1';
  ctx.fillRect(whPt.x - 16, whPt.y - 18, 14, 18);  // Slip 1 (SI Ferry)
  ctx.fillRect(whPt.x + 2, whPt.y - 16, 12, 16);   // Slip 2 (NYC Catamaran)
  // Timber pile dolphins around slips
  ctx.fillStyle = '#78350f';
  for (let dp = -18; dp <= 14; dp += 6) {
    ctx.beginPath();
    ctx.arc(whPt.x - 18, whPt.y + dp, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(whPt.x + 16, whPt.y + dp, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 8. Manhattan Road Grid & Arterials
  // FDR Drive waterfront highway
  ctx.strokeStyle = '#0f172a'; // Asphalt
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(m2.x, m2.y);
  ctx.bezierCurveTo(m3.x, m3.y, m3.x, m3.y, m4.x, m4.y);
  ctx.lineTo(m5.x, m5.y);
  ctx.lineTo(m6.x, m6.y);
  ctx.stroke();

  // White dashed lane stripes on FDR Drive
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 8]);
  ctx.stroke();
  ctx.setLineDash([]);

  // West Street / Route 9A Boulevard along Hudson
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(m11.x, m11.y);
  ctx.bezierCurveTo(m10.x, m10.y, m9.x, m9.y, m8.x, m8.y);
  ctx.stroke();

  // Broadway & Financial District street canyons
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 8;
  for (let st = 0; st < 12; st++) {
    const sP1 = toCanvas(-18 + st * 4, 18 + st * 7);
    const sP2 = toCanvas(12 + st * 6, 24 + st * 6);
    ctx.beginPath();
    ctx.moveTo(sP1.x, sP1.y);
    ctx.lineTo(sP2.x, sP2.y);
    ctx.stroke();
  }

  // 9. Skyscraper Plaza Footings (Ground beneath towers)
  // One World Trade Center Plaza & Reflecting Pools
  const wtcPt = toCanvas(-15.6, 23.4);
  ctx.fillStyle = '#475569';
  ctx.fillRect(wtcPt.x - 22, wtcPt.y - 22, 44, 44);
  ctx.fillStyle = '#0c4a6e'; // 9/11 Memorial Pools
  ctx.fillRect(wtcPt.x - 14, wtcPt.y - 14, 11, 11);
  ctx.fillRect(wtcPt.x + 3, wtcPt.y + 3, 11, 11);

  // Wall Street Bank Tower Plaza
  const wallPt = toCanvas(-2.3, 28.2);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(wallPt.x - 16, wallPt.y - 16, 32, 32);

  // ConEd 14th St Substation Industrial Yard
  const conPt = toCanvas(84.2, 68.5);
  ctx.fillStyle = '#475569'; // Gravel yard
  ctx.fillRect(conPt.x - 20, conPt.y - 16, 40, 32);
  ctx.strokeStyle = '#94a3b8'; // Perimeter fence
  ctx.lineWidth = 2;
  ctx.strokeRect(conPt.x - 20, conPt.y - 16, 40, 32);

  // 10. Granite Seawalls along Shorelines
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 5;
  // Manhattan Seawall
  ctx.beginPath();
  ctx.moveTo(m1.x, m1.y);
  ctx.bezierCurveTo(m2.x, m2.y, m3.x, m3.y, m4.x, m4.y);
  ctx.lineTo(m5.x, m5.y);
  ctx.lineTo(m6.x, m6.y);
  ctx.stroke();
  // Brooklyn Seawall
  ctx.beginPath();
  ctx.moveTo(bk4.x, bk4.y);
  ctx.lineTo(bk5.x, bk5.y);
  ctx.lineTo(bk6.x, bk6.y);
  ctx.lineTo(bk8.x, bk8.y);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  cachedSatelliteTexture = tex;

  return tex;
}

/**
 * Modern High-Rise Glass Curtain Wall Texture
 */
export function getModernGlassFacadeTexture(tintHex = 0x0284c7) {
  if (cachedGlassTexture) return cachedGlassTexture;
  if (typeof document === 'undefined') return null;

  const w = 512;
  const h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx || !ctx.createLinearGradient) return null;

  // Blue-cyan reflective skyscraper glass background
  const col = new THREE.Color(tintHex);
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0.0, `rgb(${Math.round(col.r * 255 * 1.3)}, ${Math.round(col.g * 255 * 1.3)}, ${Math.round(col.b * 255 * 1.4)})`);
  bgGrad.addColorStop(1.0, `rgb(${Math.round(col.r * 255 * 0.7)}, ${Math.round(col.g * 255 * 0.7)}, ${Math.round(col.b * 255 * 0.8)})`);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Vertical structural mullions (steel fins)
  const numCols = 16;
  const colW = w / numCols;
  ctx.fillStyle = '#0f172a';
  for (let c = 0; c <= numCols; c++) {
    ctx.fillRect(c * colW - 1, 0, 2, h);
  }

  // Horizontal floor spandrels & window rows
  const numFloors = 48;
  const floorH = h / numFloors;
  for (let f = 0; f < numFloors; f++) {
    const fy = f * floorH;

    // Dark spandrel glass panel between floors
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(0, fy, w, floorH * 0.35);

    // Warm illuminated office windows (randomly scattered for authentic night/day skyline)
    for (let c = 0; c < numCols; c++) {
      const isLit = (Math.sin(f * 17.1 + c * 31.3) > 0.35);
      if (isLit) {
        ctx.fillStyle = (f % 3 === 0) ? 'rgba(254, 240, 138, 0.65)' : 'rgba(224, 242, 254, 0.55)';
        ctx.fillRect(c * colW + 2, fy + floorH * 0.38, colW - 4, floorH * 0.58);
      }
    }
  }

  // Diagonal sky reflection gradient streak
  const reflGrad = ctx.createLinearGradient(0, 0, w, h);
  reflGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.0)');
  reflGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.22)');
  reflGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.0)');
  ctx.fillStyle = reflGrad;
  ctx.fillRect(0, 0, w, h);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 1);
  cachedGlassTexture = tex;

  return tex;
}

/**
 * Classical NYC Limestone Skyscraper Facade (Art Deco / Neoclassical)
 */
export function getStoneMasonryFacadeTexture() {
  if (cachedStoneTexture) return cachedStoneTexture;
  if (typeof document === 'undefined') return null;

  const w = 512;
  const h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx || !ctx.fillRect || !ctx.strokeRect) return null;

  // Warm Indiana limestone base
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(0, 0, w, h);

  // Vertical stone piers
  const numBays = 12;
  const bayW = w / numBays;
  const numFloors = 40;
  const floorH = h / numFloors;

  for (let f = 0; f < numFloors; f++) {
    const fy = f * floorH;

    // Recessed dark bronze window bays with sills
    for (let b = 0; b < numBays; b++) {
      const bx = b * bayW;
      // Window aperture
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(bx + 6, fy + 4, bayW - 12, floorH - 8);

      // Glass reflection
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.fillRect(bx + 8, fy + 6, bayW - 16, (floorH - 12) * 0.5);

      // Stone sill
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(bx + 4, fy + floorH - 4, bayW - 8, 3);
    }

    // Horizontal architectural stone rustication belt every 8 floors
    if (f % 8 === 0) {
      ctx.fillStyle = '#64748b';
      ctx.fillRect(0, fy, w, 4);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  cachedStoneTexture = tex;

  return tex;
}

/**
 * Historic DUMBO / Seaport Weathered Brick Loft Facade
 */
export function getHistoricBrickFacadeTexture() {
  if (cachedBrickTexture) return cachedBrickTexture;
  if (typeof document === 'undefined') return null;

  const w = 512;
  const h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx || !ctx.fillRect || !ctx.strokeRect) return null;

  // Weathered New York red/brown brick
  ctx.fillStyle = '#831843';
  ctx.fillRect(0, 0, w, h);

  // Subtle brick texture variation
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = (i % 2 === 0) ? '#991b1b' : '#7f1d1d';
    ctx.fillRect(Math.random() * w, Math.random() * h, 8 + Math.random() * 12, 4 + Math.random() * 4);
  }

  // Industrial multi-pane factory windows (6-over-6 panes)
  const numCols = 8;
  const numRows = 12;
  const cw = w / numCols;
  const rh = h / numRows;

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const wx = c * cw + 6;
      const wy = r * rh + 5;
      const ww = cw - 12;
      const wh = rh - 10;

      // Dark window aperture
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(wx, wy, ww, wh);

      // White window muntin grid
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(wx, wy, ww, wh);
      ctx.beginPath();
      ctx.moveTo(wx + ww * 0.5, wy);
      ctx.lineTo(wx + ww * 0.5, wy + wh);
      ctx.moveTo(wx, wy + wh * 0.5);
      ctx.lineTo(wx + ww, wy + wh * 0.5);
      ctx.stroke();

      // Stone lintel above window
      ctx.fillStyle = '#475569';
      ctx.fillRect(wx - 2, wy - 3, ww + 4, 3);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  cachedBrickTexture = tex;

  return tex;
}

/**
 * One World Trade Center Chamfered Glass Reflection Facade
 */
export function get1WTCFacadeTexture() {
  if (cached1WTCTexture) return cached1WTCTexture;
  if (typeof document === 'undefined') return null;

  const w = 512;
  const h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx || !ctx.createLinearGradient) return null;

  // Crisp metallic blue-silver reflective curtain wall
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0.0, '#38bdf8');
  grad.addColorStop(0.4, '#e0f2fe'); // Sky reflection flare
  grad.addColorStop(0.6, '#0284c7');
  grad.addColorStop(1.0, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Micro-louvers and vertical fins
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 12) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  // Horizontal floor divisions
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.6)';
  ctx.lineWidth = 2;
  for (let y = 0; y < h; y += 18) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  cached1WTCTexture = tex;

  return tex;
}

/**
 * High-Resolution 2048x2048 Digital Twin GIS Map of New York Harbor
 * Features real GIS survey grid, authentic Lower Manhattan street vectors,
 * cadastral building parcel lots, subterranean transit alignment vectors,
 * bathymetric depth contours, and real-time USGS telemetry nodes.
 */
export function getNYCDigitalTwinTexture() {
  if (cachedDigitalTwinTexture) return cachedDigitalTwinTexture;
  if (typeof document === 'undefined') return null;

  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx || !ctx.createRadialGradient || !ctx.moveTo) return null;

  function toCanvas(wx, wz) {
    const u = (wx + 120.0) / 240.0;
    const v = (wz + 120.0) / 240.0;
    return { x: u * size, y: v * size };
  }

  // 1. Deep Space Navy Cyber GIS Water Background
  ctx.fillStyle = '#020611';
  ctx.fillRect(0, 0, size, size);

  // 2. High-Tech GIS Survey Coordinate Matrix
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';
  ctx.lineWidth = 1;
  const gridStep = size / 24;
  for (let g = 0; g <= size; g += gridStep) {
    ctx.beginPath();
    ctx.moveTo(g, 0);
    ctx.lineTo(g, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, g);
    ctx.lineTo(size, g);
    ctx.stroke();
  }

  // Survey crosshairs at grid intersections
  ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.font = '10px monospace';
  for (let gx = gridStep; gx < size; gx += gridStep * 2) {
    for (let gy = gridStep; gy < size; gy += gridStep * 2) {
      ctx.fillText('+', gx - 3, gy + 3);
    }
  }

  // 3. Bathymetric Depth Contours in Upper New York Bay & East River
  const bathyContours = [
    { col: 'rgba(6, 182, 212, 0.18)' },
    { col: 'rgba(14, 165, 233, 0.22)' },
    { col: 'rgba(2, 132, 199, 0.28)' }
  ];
  bathyContours.forEach(bc => {
    ctx.strokeStyle = bc.col;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    const p1 = toCanvas(-110, -60);
    const p2 = toCanvas(-50, -25);
    const p3 = toCanvas(5, 5);
    const p4 = toCanvas(80, 40);
    ctx.moveTo(p1.x, p1.y);
    ctx.bezierCurveTo(p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
    ctx.stroke();
    ctx.setLineDash([]);
  });

  ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
  ctx.font = 'bold 12px monospace';
  const sl1 = toCanvas(-80, -45);
  ctx.fillText('DEPTH: -24.5m NAVD88 [DEEP CHANNEL]', sl1.x, sl1.y);
  const sl2 = toCanvas(-25, -15);
  ctx.fillText('DEPTH: -16.2m UPPER BAY FAIRWAY', sl2.x, sl2.y);

  // 4. Staten Island Shoreline (West of The Narrows)
  ctx.fillStyle = '#061325';
  ctx.beginPath();
  const si1 = toCanvas(-120, -120);
  const si2 = toCanvas(-120, -45);
  const si3 = toCanvas(-110, -55);
  const si4 = toCanvas(-100, -85);
  const si5 = toCanvas(-85, -120);
  ctx.moveTo(si1.x, si1.y);
  ctx.lineTo(si2.x, si2.y);
  ctx.bezierCurveTo(si3.x, si3.y, si4.x, si4.y, si5.x, si5.y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 5. Governors Island
  const govCenter = toCanvas(-45, -22);
  ctx.beginPath();
  ctx.ellipse(govCenter.x, govCenter.y, size * 0.052, size * 0.040, -0.35, 0, Math.PI * 2);
  ctx.fillStyle = '#081c32';
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('GOVERNORS ISLAND • GIS #036', govCenter.x - 70, govCenter.y - 10);

  // 6. Brooklyn Waterfront & DUMBO
  ctx.fillStyle = '#061325';
  ctx.beginPath();
  const bk1 = toCanvas(-75, -120);
  const bk2 = toCanvas(-70, -75);
  const bk3 = toCanvas(-20, -35);
  const bk4 = toCanvas(20, -10);
  const bk5 = toCanvas(45, 12);
  const bk6 = toCanvas(80.3, 27.2);
  const bk7 = toCanvas(105, 38);
  const bk8 = toCanvas(120, 50);
  const bk9 = toCanvas(120, -120);
  ctx.moveTo(bk1.x, bk1.y);
  ctx.lineTo(bk2.x, bk2.y);
  ctx.bezierCurveTo(bk3.x, bk3.y, bk4.x, bk4.y, bk5.x, bk5.y);
  ctx.bezierCurveTo(bk6.x, bk6.y, bk7.x, bk7.y, bk8.x, bk8.y);
  ctx.lineTo(bk9.x, bk9.y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#0ea5e9';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 7. Lower Manhattan Shoreline & Bulkhead
  ctx.fillStyle = '#07162c';
  ctx.beginPath();
  const mn1 = toCanvas(-120, -42);
  const mn2 = toCanvas(-120, 120);
  const mn3 = toCanvas(120, 120);
  const mn4 = toCanvas(120, 68);
  const mn5 = toCanvas(60, 48);
  const mn6 = toCanvas(25, 28);
  const mn7 = toCanvas(-12, 12);
  const mn8 = toCanvas(-2.8, -1.4); // The Battery / South Ferry tip
  const mn9 = toCanvas(-25, 14);
  const mn10 = toCanvas(-65, 32);
  ctx.moveTo(mn1.x, mn1.y);
  ctx.lineTo(mn2.x, mn2.y);
  ctx.lineTo(mn3.x, mn3.y);
  ctx.lineTo(mn4.x, mn4.y);
  ctx.bezierCurveTo(mn5.x, mn5.y, mn6.x, mn6.y, mn7.x, mn7.y);
  ctx.bezierCurveTo(mn8.x, mn8.y, mn9.x, mn9.y, mn10.x, mn10.y);
  ctx.closePath();
  ctx.fill();

  // Glowing Seawall Bulkhead Perimeter
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#0284c7';
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 8. Authentic Street Network Vectors & Typography
  const streets = [
    { name: 'WEST ST / ROUTE 9A', pts: [[-120, 32], [-65, 30], [-25, 14], [-2.8, 6]], w: 7, col: '#0284c7' },
    { name: 'FDR DRIVE EXPRESSWAY', pts: [[-2.8, 6], [25, 28], [60, 48], [120, 72]], w: 7, col: '#0284c7' },
    { name: 'BROADWAY CORRIDOR', pts: [[-2.8, 8], [10, 35], [25, 75], [40, 120]], w: 8, col: '#38bdf8' },
    { name: 'WALL STREET', pts: [[8, 25], [26, 32], [42, 38]], w: 6, col: '#38bdf8' },
    { name: 'STATE ST / BATTERY PL', pts: [[-14, 12], [-2.8, 8], [12, 18]], w: 6, col: '#38bdf8' },
    { name: 'BROAD STREET', pts: [[2, 14], [14, 26], [22, 36]], w: 5, col: '#0ea5e9' }
  ];

  streets.forEach(st => {
    ctx.strokeStyle = st.col;
    ctx.lineWidth = st.w;
    ctx.beginPath();
    st.pts.forEach((pt, idx) => {
      const c = toCanvas(pt[0], pt[1]);
      if (idx === 0) ctx.moveTo(c.x, c.y);
      else ctx.lineTo(c.x, c.y);
    });
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    const midPt = st.pts[Math.floor(st.pts.length / 2)];
    const cMid = toCanvas(midPt[0], midPt[1]);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(st.name, cMid.x + 8, cMid.y - 6);
  });

  // 9. Cadastral Building Lots & Parcel Footprints
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
  ctx.lineWidth = 1.5;

  const buildingLots = [
    { x: 18, z: 54, w: 14, d: 14, label: '1 WTC [1,776 FT]' },
    { x: 26, z: 44, w: 11, d: 11, label: '3 WTC' },
    { x: 30, z: 36, w: 10, d: 10, label: '4 WTC' },
    { x: 20, z: 28, w: 12, d: 10, label: '40 WALL ST' },
    { x: 28, z: 24, w: 12, d: 11, label: '28 LIBERTY' },
    { x: 36, z: 20, w: 10, d: 9,  label: 'STANDARD OIL' },
    { x: 12, z: 18, w: 9,  d: 9,  label: 'BOWLING GREEN' },
    { x: -15, z: 32, w: 14, d: 12, label: 'BPC PARCEL A' },
    { x: -28, z: 42, w: 14, d: 12, label: 'BPC PARCEL B' },
    { x: -42, z: 52, w: 14, d: 12, label: 'BPC PARCEL C' },
    { x: -4, z: 10, w: 16, d: 10, label: 'WHITEHALL TERMINAL' },
    { x: -14, z: 8, w: 12, d: 12, label: 'CASTLE CLINTON' }
  ];

  buildingLots.forEach(lot => {
    const c = toCanvas(lot.x - lot.w * 0.5, lot.z - lot.d * 0.5);
    const cW = (lot.w / 240.0) * size;
    const cD = (lot.d / 240.0) * size;

    ctx.fillRect(c.x, c.y, cW, cD);
    ctx.strokeRect(c.x, c.y, cW, cD);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(lot.label, c.x + 3, c.y + cD * 0.5 + 3);
    ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
  });

  // 10. Subterranean Transit Alignment Vectors (The 7 Under-River Tubes)
  const tubes = [
    { name: '(1) SOUTH FERRY LOOP', col: '#ef4444', p1: [-3, 10], p2: [12, -4] },
    { name: '(4)(5) JORALEMON TUBE', col: '#22c55e', p1: [14, 24], p2: [42, -18] },
    { name: '(2)(3) CLARK ST TUBE', col: '#ef4444', p1: [24, 32], p2: [62, 5] },
    { name: '(N)(R) MONTAGUE TUBE', col: '#eab308', p1: [18, 20], p2: [72, -8] },
    { name: '(A)(C) CRANBERRY TUBE', col: '#3b82f6', p1: [32, 45], p2: [78, 22] },
    { name: '(F) RUTGERS TUBE', col: '#f97316', p1: [48, 55], p2: [94, 32] },
    { name: 'BATTERY TUNNEL (TWIN)', col: '#06b6d4', p1: [-5, 8], p2: [18, -32] }
  ];

  tubes.forEach(tb => {
    const pt1 = toCanvas(tb.p1[0], tb.p1[1]);
    const pt2 = toCanvas(tb.p2[0], tb.p2[1]);

    ctx.strokeStyle = tb.col;
    ctx.lineWidth = 3.5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(pt1.x, pt1.y);
    ctx.lineTo(pt2.x, pt2.y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = tb.col;
    ctx.beginPath();
    ctx.arc(pt1.x, pt1.y, 4, 0, Math.PI * 2);
    ctx.fill();

    const midX = (pt1.x + pt2.x) * 0.5;
    const midY = (pt1.y + pt2.y) * 0.5;
    ctx.font = 'bold 9px monospace';
    ctx.fillText(tb.name, midX + 6, midY);
  });

  // 11. Real-Time Telemetry Node: USGS 01374019 The Battery, NY
  const usgsPt = toCanvas(-2.8, -1.4);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(usgsPt.x, usgsPt.y, 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(usgsPt.x, usgsPt.y, 24, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(usgsPt.x, usgsPt.y, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('📡 USGS #01374019 • THE BATTERY GAUGE [ACTIVE]', usgsPt.x + 28, usgsPt.y + 4);
  ctx.fillStyle = '#38bdf8';
  ctx.font = '10px monospace';
  ctx.fillText('STORM TIDE SENSOR • DATUM: NAVD88 • LAT 40.7032 LON -74.0170', usgsPt.x + 28, usgsPt.y + 18);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  cachedDigitalTwinTexture = tex;

  return tex;
}

/**
 * Digital Twin Building Facade Texture
 * High-tech holographic/cyber GIS aesthetic with glowing floor plates
 */
export function getDigitalTwinBuildingTexture() {
  if (cachedDigitalTwinBuildingTexture) return cachedDigitalTwinBuildingTexture;
  if (typeof document === 'undefined') return null;

  const w = 512;
  const h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx || !ctx.moveTo) return null;

  ctx.fillStyle = '#061325';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 2;
  for (let y = 0; y < h; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(14, 165, 233, 0.35)';
  ctx.lineWidth = 1.5;
  for (let x = 0; x < w; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  ctx.fillStyle = '#38bdf8';
  for (let x = 8; x < w; x += 32) {
    for (let y = 6; y < h; y += 24) {
      if ((x + y * 3) % 5 === 0) {
        ctx.fillRect(x, y, 16, 12);
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  cachedDigitalTwinBuildingTexture = tex;

  return tex;
}

