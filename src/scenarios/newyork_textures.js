import * as THREE from 'three';

let cachedSatelliteTexture = null;
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

