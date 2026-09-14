import * as THREE from 'three';

let cachedSandstoneTexture = null;
let cachedBrickTexture = null;
let cachedTinTexture = null;
let cachedTarpTexture = null;
let cachedAsphaltTexture = null;

/**
 * Authentic Mughal Red Sandstone Texture (Lal Qila / Red Fort Ramparts)
 * Rich terracotta red with subtle mortar joints, mineral weathering, and fine stone grain.
 */
export function getRedSandstoneTexture() {
  if (cachedSandstoneTexture) return cachedSandstoneTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx || typeof ctx.moveTo !== 'function' || typeof ctx.createLinearGradient !== 'function') return null;

  // Base red sandstone tone
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle mineral grain variation
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const s = 1 + Math.random() * 3;
    const shade = Math.random() > 0.5 ? 'rgba(185, 28, 28, 0.45)' : 'rgba(127, 29, 29, 0.5)';
    ctx.fillStyle = shade;
    ctx.fillRect(x, y, s, s);
  }

  // Horizontal and vertical stone block courses
  const blockH = 32;
  const blockW = 64;
  ctx.strokeStyle = 'rgba(69, 10, 10, 0.65)';
  ctx.lineWidth = 1.5;

  for (let y = 0; y < 512; y += blockH) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    const row = Math.floor(y / blockH);
    const xOffset = (row % 2) * (blockW * 0.5);
    for (let x = xOffset; x < 512 + blockW; x += blockW) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + blockH);
      ctx.stroke();
    }
  }

  // Weathering streaks (monsoon water runoff)
  for (let w = 0; w < 16; w++) {
    const wx = Math.random() * 512;
    const grad = ctx.createLinearGradient(wx, 0, wx, 512);
    grad.addColorStop(0, 'rgba(69, 10, 10, 0.3)');
    grad.addColorStop(0.5, 'rgba(69, 10, 10, 0.05)');
    grad.addColorStop(1, 'rgba(69, 10, 10, 0.2)');
    ctx.fillStyle = grad;
    ctx.fillRect(wx - 4, 0, 8, 512);
  }

  cachedSandstoneTexture = new THREE.CanvasTexture(canvas);
  cachedSandstoneTexture.wrapS = THREE.RepeatWrapping;
  cachedSandstoneTexture.wrapT = THREE.RepeatWrapping;
  cachedSandstoneTexture.repeat.set(4, 2);
  return cachedSandstoneTexture;
}

/**
 * 19th Century Alluvial Terracotta Brickwork (Old Yamuna Iron Bridge Piers & Kilns)
 */
export function getDelhiBrickTexture() {
  if (cachedBrickTexture) return cachedBrickTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx || typeof ctx.moveTo !== 'function' || typeof ctx.fillRect !== 'function') return null;

  ctx.fillStyle = '#b45309';
  ctx.fillRect(0, 0, 512, 512);

  // Individual bricks
  const bH = 16;
  const bW = 32;
  const mortarColor = 'rgba(214, 211, 209, 0.6)';

  for (let y = 0; y < 512; y += bH) {
    const row = Math.floor(y / bH);
    const xOff = (row % 2) * (bW * 0.5);

    for (let x = -bW + xOff; x < 512 + bW; x += bW) {
      // Brick hue variation
      const brickColors = ['#9a3412', '#c2410c', '#b45309', '#7c2d12', '#a16207'];
      ctx.fillStyle = brickColors[Math.floor(Math.random() * brickColors.length)];
      ctx.fillRect(x + 1, y + 1, bW - 2, bH - 2);
    }
  }

  // Mortar lines
  ctx.strokeStyle = mortarColor;
  ctx.lineWidth = 1.5;
  for (let y = 0; y < 512; y += bH) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    const row = Math.floor(y / bH);
    const xOff = (row % 2) * (bW * 0.5);
    for (let x = xOff; x < 512; x += bW) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + bH);
      ctx.stroke();
    }
  }

  cachedBrickTexture = new THREE.CanvasTexture(canvas);
  cachedBrickTexture.wrapS = THREE.RepeatWrapping;
  cachedBrickTexture.wrapT = THREE.RepeatWrapping;
  cachedBrickTexture.repeat.set(3, 3);
  return cachedBrickTexture;
}

/**
 * Weathered Corrugated Galvanized Iron (CGI) Tin Roofing
 */
export function getTinRoofTexture() {
  if (cachedTinTexture) return cachedTinTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx || typeof ctx.fillRect !== 'function' || typeof ctx.createLinearGradient !== 'function') return null;

  ctx.fillStyle = '#64748b';
  ctx.fillRect(0, 0, 256, 256);

  // Corrugation ridges
  const ridgeW = 8;
  for (let x = 0; x < 256; x += ridgeW) {
    const grad = ctx.createLinearGradient(x, 0, x + ridgeW, 0);
    grad.addColorStop(0, '#475569');
    grad.addColorStop(0.5, '#94a3b8');
    grad.addColorStop(1, '#334155');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, ridgeW, 256);
  }

  // Rust stains
  for (let r = 0; r < 20; r++) {
    const rx = Math.random() * 256;
    const ry = Math.random() * 256;
    ctx.fillStyle = 'rgba(180, 83, 9, 0.4)';
    ctx.fillRect(rx, ry, 6 + Math.random() * 12, 10 + Math.random() * 30);
  }

  cachedTinTexture = new THREE.CanvasTexture(canvas);
  cachedTinTexture.wrapS = THREE.RepeatWrapping;
  cachedTinTexture.wrapT = THREE.RepeatWrapping;
  cachedTinTexture.repeat.set(2, 2);
  return cachedTinTexture;
}

/**
 * Woven Polyethylene Blue Tarpaulin Texture (Yamuna Floodplain Shanties)
 */
export function getTarpRoofTexture() {
  if (cachedTarpTexture) return cachedTarpTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx || typeof ctx.moveTo !== 'function' || typeof ctx.fillRect !== 'function') return null;

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, 256, 256);

  // Cross-weave pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  for (let p = 0; p < 256; p += 4) {
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, 256);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(256, p);
    ctx.stroke();
  }

  // Creases & folding highlights
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  for (let c = 0; c < 5; c++) {
    const cx = Math.random() * 256;
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx + (Math.random() - 0.5) * 40, 256);
    ctx.stroke();
  }

  cachedTarpTexture = new THREE.CanvasTexture(canvas);
  cachedTarpTexture.wrapS = THREE.RepeatWrapping;
  cachedTarpTexture.wrapT = THREE.RepeatWrapping;
  cachedTarpTexture.repeat.set(2, 2);
  return cachedTarpTexture;
}

/**
 * Ring Road (Mahatma Gandhi Marg) Asphalt with Lane Markings
 */
export function getAsphaltRoadTexture() {
  if (cachedAsphaltTexture) return cachedAsphaltTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx || typeof ctx.fillRect !== 'function') return null;

  // Dark bitumen
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 256, 512);

  // Asphalt grain noise
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 512;
    ctx.fillStyle = Math.random() > 0.5 ? '#334155' : '#0f172a';
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // White dashed center line
  ctx.fillStyle = '#f8fafc';
  for (let y = 0; y < 512; y += 48) {
    ctx.fillRect(125, y + 8, 6, 24);
  }

  // Yellow shoulder lines
  ctx.fillStyle = '#eab308';
  ctx.fillRect(16, 0, 5, 512);
  ctx.fillRect(235, 0, 5, 512);

  cachedAsphaltTexture = new THREE.CanvasTexture(canvas);
  cachedAsphaltTexture.wrapS = THREE.RepeatWrapping;
  cachedAsphaltTexture.wrapT = THREE.RepeatWrapping;
  cachedAsphaltTexture.repeat.set(1, 4);
  return cachedAsphaltTexture;
}

let cachedDelhiSatelliteTexture = null;
let cachedDelhiHeatmapTexture = null;

/**
 * High-Resolution 2048x2048 Aerial Satellite & CWC Disaster Inundation Orthophoto
 * Draped across Delhi terrain bounds X: [-120, +120], Z: [-120, +120]
 * Captures Old Delhi (Shahjahanabad), Red Fort, Ring Road, Kashmere Gate ISBT,
 * Yamuna floodplain bastis, and CWC/DDMA flood depth hazard contours.
 */
export function getDelhiAerialDisasterMapTexture(isHeatmapMode = false) {
  if (isHeatmapMode && cachedDelhiHeatmapTexture) return cachedDelhiHeatmapTexture;
  if (!isHeatmapMode && cachedDelhiSatelliteTexture) return cachedDelhiSatelliteTexture;
  if (typeof document === 'undefined') return null;

  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx || typeof ctx.fillRect !== 'function' || typeof ctx.beginPath !== 'function') return null;

  // Helper coordinate mapper: World X, Z in [-120, 120] -> Canvas [0, size]
  function toCanvas(wx, wz) {
    const u = (wx + 120.0) / 240.0;
    const v = (wz + 120.0) / 240.0;
    return {
      x: u * size,
      y: v * size
    };
  }

  // 1. Base Alluvial Plain & Floodplain Soil
  ctx.fillStyle = isHeatmapMode ? '#0f172a' : '#2b3624'; // Dark GIS backdrop or rich Indo-Gangetic alluvial green
  ctx.fillRect(0, 0, size, size);

  // Agricultural fields & floodplain silt terraces (East Bank & North Floodplain)
  const fieldColors = isHeatmapMode ? ['#1e293b', '#1e293b', '#0f172a'] : ['#3f4f2c', '#4d5d36', '#59693e', '#78593a', '#8c6d48'];
  for (let fx = 0; fx < size; fx += 128) {
    for (let fy = 0; fy < size; fy += 96) {
      if (Math.random() > 0.4) {
        ctx.fillStyle = fieldColors[Math.floor(Math.random() * fieldColors.length)];
        ctx.fillRect(fx + 2, fy + 2, 124, 92);
        ctx.strokeStyle = isHeatmapMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(120, 89, 58, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(fx + 2, fy + 2, 124, 92);
      }
    }
  }

  // 2. Yamuna River Fairway & Braided Silt Sandbars
  // River trajectory: {-140, -85} -> {-105, -65} -> {-70, -40} -> {-35, -15} -> {0, 0} -> {35, 18} -> {70, 38} -> {105, 62} -> {140, 90}
  const riverPts = [
    toCanvas(-135, -85),
    toCanvas(-105, -65),
    toCanvas(-70, -40),
    toCanvas(-35, -15),
    toCanvas(0, 0),
    toCanvas(35, 18),
    toCanvas(70, 38),
    toCanvas(105, 62),
    toCanvas(135, 90)
  ];

  // Wide riverbed floodplain corridor
  ctx.strokeStyle = isHeatmapMode ? '#1e293b' : '#a38258';
  ctx.lineWidth = 180;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(riverPts[0].x, riverPts[0].y);
  for (let i = 1; i < riverPts.length; i++) {
    ctx.lineTo(riverPts[i].x, riverPts[i].y);
  }
  ctx.stroke();

  // Active Yamuna River channel
  ctx.strokeStyle = isHeatmapMode ? '#0284c7' : '#784c1f';
  ctx.lineWidth = 110;
  ctx.beginPath();
  ctx.moveTo(riverPts[0].x, riverPts[0].y);
  for (let i = 1; i < riverPts.length; i++) {
    ctx.lineTo(riverPts[i].x, riverPts[i].y);
  }
  ctx.stroke();

  // River silt sandbars inside channel
  const sandbarColors = isHeatmapMode ? ['#0369a1', '#0284c7'] : ['#c49a6c', '#b48348', '#a3753a'];
  for (let s = 0; s < 12; s++) {
    const uBar = 0.15 + s * 0.065;
    const idx = Math.min(riverPts.length - 2, Math.floor(uBar * (riverPts.length - 1)));
    const t = (uBar * (riverPts.length - 1)) - idx;
    const p1 = riverPts[idx];
    const p2 = riverPts[idx + 1];
    const bx = p1.x + (p2.x - p1.x) * t + (Math.sin(s * 2.5) * 24);
    const by = p1.y + (p2.y - p1.y) * t + (Math.cos(s * 2.5) * 16);

    ctx.fillStyle = sandbarColors[s % sandbarColors.length];
    ctx.beginPath();
    ctx.ellipse(bx, by, 32 + Math.random() * 20, 14 + Math.random() * 8, Math.PI * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Old Delhi (Shahjahanabad) Dense Urban Street Grid (West Bank)
  const shahWest = toCanvas(-110, -30);
  const shahEast = toCanvas(10, 20);
  const shahNorth = toCanvas(-40, -80);
  const shahSouth = toCanvas(50, 40);

  // Urban fabric backdrop
  ctx.fillStyle = isHeatmapMode ? '#1e293b' : '#475569';
  ctx.fillRect(shahWest.x, shahNorth.y, (shahEast.x - shahWest.x) * 0.95, (shahSouth.y - shahNorth.y) * 0.85);

  // Dense Old Delhi building blocks
  const bldgColors = isHeatmapMode
    ? ['#334155', '#1e293b', '#475569']
    : ['#78350f', '#9a3412', '#b45309', '#d97706', '#64748b', '#94a3b8', '#cbd5e1'];

  for (let bx = shahWest.x + 10; bx < shahEast.x - 20; bx += 36) {
    for (let by = shahNorth.y + 10; by < shahSouth.y - 20; by += 32) {
      ctx.fillStyle = bldgColors[Math.floor(Math.random() * bldgColors.length)];
      ctx.fillRect(bx, by, 28, 24);

      // Inner courtyard cutout
      if (Math.random() > 0.4) {
        ctx.fillStyle = isHeatmapMode ? '#0f172a' : '#1e293b';
        ctx.fillRect(bx + 7, by + 6, 14, 12);
      }

      // Rooftop water tank dot (black Sintex)
      ctx.fillStyle = '#09090b';
      ctx.fillRect(bx + 2, by + 2, 4, 4);
    }
  }

  // 4. Major Arterial Road Corridors
  // A. Ring Road (Mahatma Gandhi Marg) hugging the western riverbank
  ctx.strokeStyle = isHeatmapMode ? '#64748b' : '#1e293b';
  ctx.lineWidth = 26;
  ctx.beginPath();
  const ring1 = toCanvas(-130, -70);
  const ring2 = toCanvas(-95, -50);
  const ring3 = toCanvas(-60, -25);
  const ring4 = toCanvas(-20, -5);
  const ring5 = toCanvas(15, 12);
  const ring6 = toCanvas(55, 30);
  const ring7 = toCanvas(90, 52);
  const ring8 = toCanvas(125, 78);
  ctx.moveTo(ring1.x, ring1.y);
  ctx.bezierCurveTo(ring2.x, ring2.y, ring3.x, ring3.y, ring4.x, ring4.y);
  ctx.bezierCurveTo(ring5.x, ring5.y, ring6.x, ring6.y, ring7.x, ring7.y);
  ctx.lineTo(ring8.x, ring8.y);
  ctx.stroke();

  // White lane divider for Ring Road
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 2;
  ctx.setLineDash([12, 8]);
  ctx.stroke();
  ctx.setLineDash([]);

  // B. Chandni Chowk Grand Axis (leading west from Red Fort Lahori Gate)
  const ccStart = toCanvas(12, 8);
  const ccEnd = toCanvas(-75, -25);
  ctx.strokeStyle = isHeatmapMode ? '#94a3b8' : '#334155';
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(ccStart.x, ccStart.y);
  ctx.lineTo(ccEnd.x, ccEnd.y);
  ctx.stroke();

  // C. Grand Trunk Road / Loha Pul Rail Line (crossing at u=0.35)
  const lohaStart = toCanvas(-85, 35);
  const lohaEnd = toCanvas(20, -65);
  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(lohaStart.x, lohaStart.y);
  ctx.lineTo(lohaEnd.x, lohaEnd.y);
  ctx.stroke();

  // D. Vikas Marg & ITO Bridge (crossing at u=0.74)
  const itoStart = toCanvas(25, 80);
  const itoEnd = toCanvas(105, -5);
  ctx.strokeStyle = isHeatmapMode ? '#64748b' : '#1e293b';
  ctx.lineWidth = 22;
  ctx.beginPath();
  ctx.moveTo(itoStart.x, itoStart.y);
  ctx.lineTo(itoEnd.x, itoEnd.y);
  ctx.stroke();

  // 5. Red Fort (Lal Qila) Imperial Compound Ground Plan
  const fortCenter = toCanvas(22, 10);
  const fortW = size * 0.085; // ~174 px
  const fortH = size * 0.125; // ~256 px

  // Defensive Moat perimeter trench (dry or water-filled)
  ctx.fillStyle = isHeatmapMode ? 'rgba(239, 68, 68, 0.45)' : 'rgba(2, 132, 199, 0.65)'; // Water inundated moat
  ctx.beginPath();
  ctx.ellipse(fortCenter.x, fortCenter.y, fortW * 1.35, fortH * 1.25, Math.PI * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#7f1d1d';
  ctx.lineWidth = 8;
  ctx.stroke();

  // Massive Octagonal Red Sandstone Ramparts
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.ellipse(fortCenter.x, fortCenter.y, fortW, fortH, Math.PI * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#450a0a';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Inner Mughal Charbagh formal gardens
  ctx.fillStyle = '#15803d';
  for (let qx = -1; qx <= 1; qx += 2) {
    for (let qy = -1; qy <= 1; qy += 2) {
      ctx.fillRect(fortCenter.x + qx * 32 - 24, fortCenter.y + qy * 42 - 32, 48, 64);
    }
  }

  // Diwan-i-Aam & Diwan-i-Khas marble hall outlines
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(fortCenter.x - 14, fortCenter.y - 18, 28, 36);

  // Salimgarh Fort triangular rampart connected by bridge
  const salimCenter = toCanvas(36, -8);
  ctx.fillStyle = '#7f1d1d';
  ctx.beginPath();
  ctx.moveTo(salimCenter.x, salimCenter.y - 40);
  ctx.lineTo(salimCenter.x + 45, salimCenter.y + 35);
  ctx.lineTo(salimCenter.x - 35, salimCenter.y + 25);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#450a0a';
  ctx.lineWidth = 5;
  ctx.stroke();

  // Salimgarh arched causeway bridge
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(fortCenter.x + 20, fortCenter.y - 35);
  ctx.lineTo(salimCenter.x, salimCenter.y);
  ctx.stroke();

  // 6. Rajghat Memorial Complex Footprint (u = 0.88)
  const rajCenter = toCanvas(92, 54);
  ctx.fillStyle = '#15803d'; // Manicured lawns
  ctx.fillRect(rajCenter.x - 70, rajCenter.y - 70, 140, 140);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 4;
  ctx.strokeRect(rajCenter.x - 70, rajCenter.y - 70, 140, 140);

  // Central Black Marble Samadhi square
  ctx.fillStyle = '#09090b';
  ctx.fillRect(rajCenter.x - 14, rajCenter.y - 14, 28, 28);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.strokeRect(rajCenter.x - 14, rajCenter.y - 14, 28, 28);

  // 7. CWC / DDMA FLOOD INUNDATION HAZARD GIS LAYER
  // Zone 1: Severe Inundation (>2.5m Depth) — Red translucent polygon
  ctx.fillStyle = isHeatmapMode ? 'rgba(239, 68, 68, 0.55)' : 'rgba(220, 38, 38, 0.32)';
  ctx.beginPath();
  const fz1 = toCanvas(-125, -60);
  const fz2 = toCanvas(-55, -20);
  const fz3 = toCanvas(-15, 0);
  const fz4 = toCanvas(25, 20);
  const fz5 = toCanvas(75, 42);
  const fz6 = toCanvas(120, 75);
  const fz7 = toCanvas(95, 88);
  const fz8 = toCanvas(-85, -35);
  ctx.moveTo(fz1.x, fz1.y);
  ctx.lineTo(fz2.x, fz2.y);
  ctx.lineTo(fz3.x, fz3.y);
  ctx.lineTo(fz4.x, fz4.y);
  ctx.lineTo(fz5.x, fz5.y);
  ctx.lineTo(fz6.x, fz6.y);
  ctx.lineTo(fz7.x, fz7.y);
  ctx.lineTo(fz8.x, fz8.y);
  ctx.closePath();
  ctx.fill();

  // Zone 2: Moderate Waterlogging (1.0m - 2.5m) — Amber/Orange
  ctx.fillStyle = isHeatmapMode ? 'rgba(249, 115, 22, 0.45)' : 'rgba(245, 158, 11, 0.24)';
  ctx.beginPath();
  const fzA = toCanvas(-130, -50);
  const fzB = toCanvas(-25, 10);
  const fzC = toCanvas(20, 30);
  const fzD = toCanvas(80, 55);
  const fzE = toCanvas(130, 85);
  const fzF = toCanvas(85, 95);
  const fzG = toCanvas(-100, -25);
  ctx.moveTo(fzA.x, fzA.y);
  ctx.lineTo(fzB.x, fzB.y);
  ctx.lineTo(fzC.x, fzC.y);
  ctx.lineTo(fzD.x, fzD.y);
  ctx.lineTo(fzE.x, fzE.y);
  ctx.lineTo(fzF.x, fzF.y);
  ctx.lineTo(fzG.x, fzG.y);
  ctx.closePath();
  ctx.fill();

  // Inundation Depth Contour Lines
  // Red Solid: Peak Record Watermark 208.66m
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(toCanvas(-130, -55).x, toCanvas(-130, -55).y);
  ctx.bezierCurveTo(toCanvas(-60, -15).x, toCanvas(-60, -15).y, toCanvas(15, 18).x, toCanvas(15, 18).y, toCanvas(125, 80).x, toCanvas(125, 80).y);
  ctx.stroke();

  // Blue Dashed: CWC Danger Mark 205.33m
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.setLineDash([16, 10]);
  ctx.beginPath();
  ctx.moveTo(toCanvas(-125, -70).x, toCanvas(-125, -70).y);
  ctx.bezierCurveTo(toCanvas(-55, -28).x, toCanvas(-55, -28).y, toCanvas(20, 8).x, toCanvas(20, 8).y, toCanvas(120, 68).x, toCanvas(120, 68).y);
  ctx.stroke();
  ctx.setLineDash([]);

  // 8. Official CWC / DDMA Disaster Map Legend & Cartographic Stamp
  const legX = 36;
  const legY = size - 240;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.fillRect(legX, legY, 520, 200);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(legX, legY, 520, 200);

  // Legend Header
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('CWC / DDMA OFFICIAL FLOOD HAZARD ATLAS', legX + 16, legY + 34);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Yamuna River Basin • Record Crest 208.66m (+3.33m Danger)', legX + 16, legY + 60);

  // Color Swatches
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(legX + 16, legY + 80, 24, 16);
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('Zone 1: Deep Inundation (>2.5m) — Submerged Bastis & Ring Rd', legX + 48, legY + 94);

  ctx.fillStyle = '#f97316';
  ctx.fillRect(legX + 16, legY + 110, 24, 16);
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('Zone 2: Moderate Waterlogging (1.0m - 2.5m) — ISBT & Moat', legX + 48, legY + 124);

  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(legX + 16, legY + 148);
  ctx.lineTo(legX + 40, legY + 148);
  ctx.stroke();
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('Record Peak Watermark Contour: 208.66m', legX + 48, legY + 152);

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 4]);
  ctx.beginPath();
  ctx.moveTo(legX + 16, legY + 176);
  ctx.lineTo(legX + 40, legY + 176);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('CWC Danger Mark Contour: 205.33m', legX + 48, legY + 180);

  // Geographic Lat/Long grid annotations
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.font = '13px monospace';
  ctx.fillText('28°39\'45" N, 77°14\'20" E', size - 220, size - 24);
  ctx.fillText('SCALE: 1:12,500', size - 150, size - 44);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  if (isHeatmapMode) {
    cachedDelhiHeatmapTexture = texture;
    return cachedDelhiHeatmapTexture;
  } else {
    cachedDelhiSatelliteTexture = texture;
    return cachedDelhiSatelliteTexture;
  }
}

export function getDelhiDisasterHeatmapTexture() {
  return getDelhiAerialDisasterMapTexture(true);
}
