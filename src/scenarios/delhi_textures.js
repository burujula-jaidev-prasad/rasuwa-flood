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
