import * as THREE from 'three';

/**
 * Procedural 3D Landmarks, Thames Barrier Rising Sector Gates, Canary Wharf,
 * London Underground Flood Doors, Tower Bridge, HMS Belfast, Westminster & Tideway Architecture
 * for London, UK (North Sea Tidal Surge & Barrier Closure Scenario)
 * 
 * Features 65+ dynamic collapsing structures, Victorian riverside brick warehouses, Thames houseboats,
 * timber wharves, London Black Cabs, Red Double-Decker Buses, and toppling embankment dolphin lamps
 * that physically fail, tilt, and wash down the Thames surge.
 */
export function buildLondonScene(group, river, terrain) {
  const wipeableItems = [];
  const dynamicWaterItems = [];

  // Helper to place objects on river tangents & bank normals
  function getRiverFrame(u) {
    const pt = river.getPointAt(u);
    const tangent = river.getTangentAt(u).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();
    return { pt, tangent, side, up };
  }

  // Common Materials
  const stainlessSteelMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.15, metalness: 0.85 });
  const pierConcreteMat   = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7, metalness: 0.1 });
  const sectorGateMat     = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4, metalness: 0.7 });
  const yellowHazardMat   = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4, metalness: 0.2 });
  const stoneGraniteMat   = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.85, metalness: 0.05 });
  const towerBridgeStone  = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.8, metalness: 0.1 });
  const towerBridgeBlue   = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.3 });
  const navyGreyMat       = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.6 });
  const glassTowerMat     = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.85 });
  const darkSpireMat      = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.4 });
  const policeBlueMat     = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3 });
  const rnliOrangeMat     = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.4 });
  const undergroundRed    = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });

  // -------------------------------------------------------------------------
  // PROCEDURAL BUILDERS FOR LONDON RIVERSIDE ARCHITECTURE & VEHICLES
  // -------------------------------------------------------------------------

  /**
   * Victorian Thameside Brick Warehouse / Historic Riverside Pub
   * Red/brown London stock brick walls, dark slate pitched roof, chimney pots,
   * multi-pane sash windows with stone lintels, and dockside timber hoist jib arm.
   */
  function createVictorianWarehouseOrPub(bw = 7.0, bh = 9.5, bd = 6.5, brickHex = 0x854d0e, isPub = false) {
    const bldgGroup = new THREE.Group();
    const materials = [];

    const brickMat = new THREE.MeshStandardMaterial({ color: brickHex, roughness: 0.85 });
    const slateMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const stoneTrimMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.6 });
    const darkWinMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.7 });
    const woodBeamMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    materials.push(brickMat, slateMat, stoneTrimMat, darkWinMat, woodBeamMat);

    // Main Brick Masonry Block
    const body = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), brickMat);
    body.position.y = bh * 0.5;
    body.castShadow = true;
    body.receiveShadow = true;
    bldgGroup.add(body);

    // Pitched Dark Slate Roof with eaves overhang
    const roofGeo = new THREE.ConeGeometry((bw + 0.8) * 0.72, 1.8, 4);
    const roof = new THREE.Mesh(roofGeo, slateMat);
    roof.rotation.y = Math.PI * 0.25;
    roof.position.set(0, bh + 0.9, 0);
    roof.scale.set(1.0, 1.0, (bd + 0.8) / (bw + 0.8));
    roof.castShadow = true;
    bldgGroup.add(roof);

    // Victorian Brick Chimney Stacks with Terracotta Pots
    [-bw * 0.35, bw * 0.35].forEach(cx => {
      const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.8, 0.8), brickMat);
      chimney.position.set(cx, bh + 1.6, 0);
      bldgGroup.add(chimney);

      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.6, 8), new THREE.MeshStandardMaterial({ color: 0xb45309 }));
      pot.position.set(cx, bh + 2.7, 0);
      bldgGroup.add(pot);
    });

    // Window Rows
    const numFloors = Math.floor(bh / 2.8);
    for (let fl = 1; fl < numFloors; fl++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.8, 1.0, bd + 0.04), darkWinMat);
      win.position.y = fl * 2.8 + 0.8;
      bldgGroup.add(win);
    }

    if (isPub) {
      // Hanging Pub Sign & Entrance Porch
      const signPost = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 6), woodBeamMat);
      signPost.rotation.z = Math.PI * 0.5;
      signPost.position.set(0, 3.2, bd * 0.5 + 0.7);
      bldgGroup.add(signPost);

      const signBoard = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.08), new THREE.MeshStandardMaterial({ color: 0x15803d }));
      signBoard.position.set(0, 2.7, bd * 0.5 + 0.7);
      bldgGroup.add(signBoard);
    } else {
      // Dockside Goods Hoist Jib Arm
      const jib = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 1.8), woodBeamMat);
      jib.rotation.x = -0.4;
      jib.position.set(0, bh - 0.2, bd * 0.5 + 0.8);
      bldgGroup.add(jib);
    }

    return { group: bldgGroup, materials, primaryMat: brickMat };
  }

  /**
   * Thames Houseboat / Dutch River Barge
   */
  function createThamesHouseboat() {
    const boatGroup = new THREE.Group();
    const materials = [];

    const hullMat  = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const deckMat  = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
    const roofMat  = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
    materials.push(hullMat, deckMat, cabinMat, roofMat);

    const hull = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 7.5), hullMat);
    hull.position.y = 0.45;
    hull.castShadow = true;
    boatGroup.add(hull);

    const deck = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.15, 7.2), deckMat);
    deck.position.y = 0.95;
    boatGroup.add(deck);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.2, 5.0), cabinMat);
    cabin.position.set(0, 1.6, -0.4);
    cabin.castShadow = true;
    boatGroup.add(cabin);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.15, 5.2), roofMat);
    roof.position.set(0, 2.25, -0.4);
    boatGroup.add(roof);

    // Stove chimney pipe
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 6), hullMat);
    pipe.position.set(0.6, 2.7, 0.8);
    boatGroup.add(pipe);

    return { group: boatGroup, materials, primaryMat: hullMat };
  }

  /**
   * London Black Cab (TX4 Hackney Carriage)
   */
  function createLondonBlackCab() {
    const cabGroup = new THREE.Group();
    const materials = [];

    const blackMat  = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.3, metalness: 0.4 });
    const glassMat  = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2, metalness: 0.7 });
    const taxiSign  = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const wheelMat  = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    materials.push(blackMat, glassMat, taxiSign, wheelMat);

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 3.6), blackMat);
    body.position.y = 0.55;
    body.castShadow = true;
    cabGroup.add(body);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.7, 2.0), glassMat);
    cabin.position.set(0, 1.1, -0.2);
    cabGroup.add(cabin);

    const sign = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.25), taxiSign);
    sign.position.set(0, 1.5, 0.6);
    cabGroup.add(sign);

    const wGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.22, 8);
    wGeo.rotateZ(Math.PI * 0.5);
    [-0.9, 0.9].forEach(wx => {
      [-1.05, 1.05].forEach(wz => {
        const wheel = new THREE.Mesh(wGeo, wheelMat);
        wheel.position.set(wx, 0.28, wz);
        cabGroup.add(wheel);
      });
    });

    return { group: cabGroup, materials, primaryMat: blackMat };
  }

  /**
   * Iconic London Red Double-Decker Bus
   */
  function createLondonDoubleDeckerBus() {
    const busGroup = new THREE.Group();
    const materials = [];

    const redMat   = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2, metalness: 0.7 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
    materials.push(redMat, whiteMat, glassMat, wheelMat);

    // Main 2-story bus body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.85, 2.4, 5.6), redMat);
    body.position.y = 1.45;
    body.castShadow = true;
    busGroup.add(body);

    // Lower deck windows
    const win1F = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.5, 4.8), glassMat);
    win1F.position.y = 1.15;
    busGroup.add(win1F);

    // Upper deck windows
    const win2F = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.5, 5.0), glassMat);
    win2F.position.y = 2.15;
    busGroup.add(win2F);

    // White roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 5.5), whiteMat);
    roof.position.y = 2.72;
    busGroup.add(roof);

    const wGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.22, 10);
    wGeo.rotateZ(Math.PI * 0.5);
    [-0.92, 0.92].forEach(wx => {
      [-1.7, 1.7].forEach(wz => {
        const wheel = new THREE.Mesh(wGeo, wheelMat);
        wheel.position.set(wx, 0.35, wz);
        busGroup.add(wheel);
      });
    });

    return { group: busGroup, materials, primaryMat: redMat };
  }

  /**
   * Thames Timber Wharf Dock / Landing Pontoon
   */
  function createTimberWharfDock(width = 4.5, length = 12.0) {
    const wharfGroup = new THREE.Group();
    const materials = [];

    const timberDeckMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const pileMat       = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.95 });
    const ironMat       = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.7 });
    materials.push(timberDeckMat, pileMat, ironMat);

    const deck = new THREE.Mesh(new THREE.BoxGeometry(width, 0.35, length), timberDeckMat);
    deck.position.y = 1.2;
    deck.castShadow = true;
    wharfGroup.add(deck);

    const pRows = Math.floor(length / 3.0);
    for (let r = 0; r <= pRows; r++) {
      const zOff = -length * 0.5 + r * (length / pRows);
      [-width * 0.42, width * 0.42].forEach(xOff => {
        const pile = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 3.2, 8), pileMat);
        pile.position.set(xOff, 0.0, zOff);
        wharfGroup.add(pile);
      });
    }

    [-length * 0.35, length * 0.35].forEach(bZ => {
      const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.4, 8), ironMat);
      bollard.position.set(width * 0.4, 1.55, bZ);
      wharfGroup.add(bollard);
    });

    return { group: wharfGroup, materials, primaryMat: timberDeckMat };
  }

  /**
   * Victorian Embankment Wall Segment & Cast-Iron Dolphin Lamp Post
   */
  function createVictorianEmbankmentWall(length = 6.0) {
    const wallGroup = new THREE.Group();
    const materials = [];

    const graniteMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.85 });
    const ironMat    = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.8 });
    const lampGlow   = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    materials.push(graniteMat, ironMat, lampGlow);

    // Granite wall parapet
    const wall = new THREE.Mesh(new THREE.BoxGeometry(1.4, 3.2, length), graniteMat);
    wall.position.y = 1.6;
    wall.castShadow = true;
    wallGroup.add(wall);

    // Cast-iron coiled dolphin lamp post
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.16, 3.8, 8), ironMat);
    post.position.set(0, 4.8, 0);
    wallGroup.add(post);

    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), lampGlow);
    globe.position.set(0, 6.7, 0);
    wallGroup.add(globe);

    return { group: wallGroup, materials, primaryMat: graniteMat };
  }

  /**
   * London Underground Entrance Sandbag Bund
   */
  function createUndergroundSandbagBund(length = 3.4) {
    const bundGroup = new THREE.Group();
    const materials = [];

    const sandbagMat = new THREE.MeshStandardMaterial({ color: 0xb59a72, roughness: 0.95 });
    materials.push(sandbagMat);

    const cols = Math.floor(length / 0.75);
    for (let row = 0; row < 3; row++) {
      for (let c = 0; c < cols; c++) {
        const bag = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.32, 0.45), sandbagMat);
        bag.position.set((c - cols * 0.5 + 0.5) * 0.75, 0.16 + row * 0.3, (row % 2) * 0.1);
        bundGroup.add(bag);
      }
    }

    return { group: bundGroup, materials, primaryMat: sandbagMat };
  }

  // Helper to register dynamic wipeable collapsing item
  function registerWipeable(itemGroup, uTrigger, initialPos, tangent, side, options = {}) {
    itemGroup.position.copy(initialPos);
    group.add(itemGroup);

    wipeableItems.push({
      mesh: itemGroup,
      uTrigger,
      initialPos: initialPos.clone(),
      initialRot: itemGroup.rotation.clone(),
      driftDir: tangent.clone().multiplyScalar(options.driftSpeed || 26.0),
      tumbleVel: new THREE.Vector3(
        (Math.random() - 0.5) * (options.tumbleScale || 6.5),
        (Math.random() - 0.5) * (options.tumbleScale || 5.5),
        (Math.random() - 0.5) * (options.tumbleScale || 6.5)
      ),
      collapseTilt: options.collapseTilt || ((Math.random() > 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.35)),
      sinkScale: options.sinkScale || 0.18,
      washSpeed: options.washSpeed || 38.0,
      maxProg: options.maxProg || 0.055,
      material: options.primaryMat,
      materials: options.materials
    });
  }

  // -------------------------------------------------------------------------
  // 1. THE THAMES BARRIER (Woolwich Reach, u = 0.35)
  // -------------------------------------------------------------------------
  const fBarrier = getRiverFrame(0.35);
  const barrierGroup = new THREE.Group();
  barrierGroup.position.copy(fBarrier.pt);

  const angleThames = Math.atan2(fBarrier.side.x, fBarrier.side.z);
  barrierGroup.rotation.y = angleThames;

  const pierOffsets = [-22.0, -13.0, -4.5, 4.5, 13.0, 22.0];
  const sectorGates = [];

  pierOffsets.forEach((xOff, idx) => {
    const pierSubGroup = new THREE.Group();
    pierSubGroup.position.set(xOff, 0, 0);

    const pierBase = new THREE.Mesh(new THREE.BoxGeometry(3.0, 6.0, 14.0), pierConcreteMat);
    pierBase.position.y = 3.0;
    pierBase.castShadow = true;
    pierSubGroup.add(pierBase);

    const foreCut = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6.0, 16), pierConcreteMat);
    foreCut.position.set(0, 3.0, 7.0);
    foreCut.scale.set(1.0, 1.0, 1.8);
    pierSubGroup.add(foreCut);

    const aftCut = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6.0, 16), pierConcreteMat);
    aftCut.position.set(0, 3.0, -7.0);
    aftCut.scale.set(1.0, 1.0, 1.8);
    pierSubGroup.add(aftCut);

    const roofGeom = new THREE.CylinderGeometry(1.8, 2.2, 10.0, 16, 1, false, 0, Math.PI);
    const roof = new THREE.Mesh(roofGeom, stainlessSteelMat);
    roof.rotation.x = Math.PI / 2;
    roof.rotation.z = Math.PI;
    roof.position.set(0, 6.5, 0);
    roof.scale.set(1.1, 1.2, 1.4);
    roof.castShadow = true;
    pierSubGroup.add(roof);

    const signalLight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 1.8, 8),
      new THREE.MeshBasicMaterial({ color: (idx % 2 === 0) ? 0xef4444 : 0x22c55e })
    );
    signalLight.position.set(0, 8.8, 5.0);
    pierSubGroup.add(signalLight);

    barrierGroup.add(pierSubGroup);
  });

  for (let g = 0; g < pierOffsets.length - 1; g++) {
    const xMid = (pierOffsets[g] + pierOffsets[g + 1]) / 2;
    const gateSpan = Math.abs(pierOffsets[g + 1] - pierOffsets[g]) - 3.2;

    const gateGroup = new THREE.Group();
    gateGroup.position.set(xMid, 1.0, 0);

    const gateCylinder = new THREE.CylinderGeometry(2.5, 2.5, gateSpan, 16, 1, false, 0, Math.PI * 0.55);
    const gateMesh = new THREE.Mesh(gateCylinder, sectorGateMat);
    gateMesh.rotation.z = Math.PI / 2;
    gateMesh.position.y = 1.0;
    gateMesh.castShadow = true;
    gateGroup.add(gateMesh);

    const hazardStripe = new THREE.Mesh(new THREE.BoxGeometry(gateSpan * 0.95, 0.4, 0.4), yellowHazardMat);
    hazardStripe.position.set(0, 2.8, 0.8);
    gateGroup.add(hazardStripe);

    barrierGroup.add(gateGroup);
    sectorGates.push(gateGroup);
  }
  group.add(barrierGroup);

  // -------------------------------------------------------------------------
  // ZONE 1: OUTER ESTUARY & WOOLWICH RIVERSIDE WHARVES (u = 0.10 - 0.25)
  // -------------------------------------------------------------------------
  const brickHues = [0x854d0e, 0x991b1b, 0x713f12, 0x78350f, 0x57534e];

  for (let i = 0; i < 8; i++) {
    const uW = 0.10 + i * 0.018;
    const fW = getRiverFrame(uW);
    const bankDir = (i % 2 === 0) ? 1 : -1;
    const dist = 9.0 + (i % 3) * 2.5;

    const warehouse = createVictorianWarehouseOrPub(
      6.8 + (i % 2) * 0.8,
      9.0 + (i % 3) * 1.5,
      6.2 + (i % 2) * 0.5,
      brickHues[i % brickHues.length],
      (i === 2 || i === 6)
    );

    const pos = fW.pt.clone().addScaledVector(fW.side, bankDir * dist);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    warehouse.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fW.tangent);
    warehouse.group.rotation.y += (i * 0.35);

    registerWipeable(warehouse.group, uW, pos, fW.tangent, fW.side, {
      primaryMat: warehouse.primaryMat,
      materials: warehouse.materials,
      driftSpeed: 25.0,
      tumbleScale: 6.0,
      collapseTilt: (bankDir > 0 ? -0.45 : 0.45)
    });
  }

  // Moored Thames houseboats in outer estuary
  [0.12, 0.18, 0.23].forEach((uB, bIdx) => {
    const fB = getRiverFrame(uB);
    const boat = createThamesHouseboat();
    const pos = fB.pt.clone().addScaledVector(fB.side, (bIdx % 2 === 0 ? 5.5 : -5.5));
    pos.y = fB.pt.y + 0.2;
    boat.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fB.tangent);

    registerWipeable(boat.group, uB, pos, fB.tangent, fB.side, {
      primaryMat: boat.primaryMat,
      materials: boat.materials,
      driftSpeed: 29.0,
      tumbleScale: 7.5,
      sinkScale: 0.22
    });
  });

  // Timber wharf docks in outer reach
  [0.14, 0.21].forEach((uW, wIdx) => {
    const fW = getRiverFrame(uW);
    const wharf = createTimberWharfDock(4.5, 12.0);
    const pos = fW.pt.clone().addScaledVector(fW.side, (wIdx === 0 ? 8.5 : -8.5));
    pos.y = fW.pt.y;
    wharf.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fW.side);

    registerWipeable(wharf.group, uW, pos, fW.tangent, fW.side, {
      primaryMat: wharf.primaryMat,
      materials: wharf.materials,
      driftSpeed: 24.0,
      tumbleScale: 5.0
    });
  });

  // -------------------------------------------------------------------------
  // ZONE 2: THAMES BARRIER APPROACH & WOOLWICH REACH (u = 0.26 - 0.38)
  // -------------------------------------------------------------------------
  for (let i = 0; i < 8; i++) {
    const uH = 0.26 + i * 0.015;
    const fH = getRiverFrame(uH);
    const bankDir = (i % 2 === 0) ? 1 : -1;
    const dist = 8.5 + (i % 3) * 2.0;

    const warehouse = createVictorianWarehouseOrPub(
      7.0 + (i % 2) * 0.6,
      9.5 + (i % 2) * 1.0,
      6.4 + (i % 3) * 0.4,
      brickHues[(i + 1) % brickHues.length],
      (i === 3)
    );

    const pos = fH.pt.clone().addScaledVector(fH.side, bankDir * dist);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    warehouse.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fH.tangent);
    warehouse.group.rotation.y += (i * 0.4);

    registerWipeable(warehouse.group, uH, pos, fH.tangent, fH.side, {
      primaryMat: warehouse.primaryMat,
      materials: warehouse.materials,
      driftSpeed: 26.0,
      tumbleScale: 6.5,
      collapseTilt: (bankDir > 0 ? -0.45 : 0.45)
    });
  }

  // London Black Cabs on Woolwich slipways
  [0.28, 0.34].forEach((uCab, cIdx) => {
    const fC = getRiverFrame(uCab);
    const cab = createLondonBlackCab();
    const pos = fC.pt.clone().addScaledVector(fC.side, (cIdx === 0 ? 8.0 : -8.5));
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.2;
    cab.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fC.tangent);

    registerWipeable(cab.group, uCab, pos, fC.tangent, fC.side, {
      primaryMat: cab.primaryMat,
      materials: cab.materials,
      driftSpeed: 30.0,
      tumbleScale: 8.0
    });
  });

  // Breaching sandbag flood defences in Woolwich
  for (let s = 0; s < 2; s++) {
    const bund = createUndergroundSandbagBund(4.2);
    const pos = fBarrier.pt.clone().addScaledVector(fBarrier.side, -16.0).addScaledVector(fBarrier.tangent, -4.0 + s * 8.0);
    pos.y = 1.8;
    bund.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fBarrier.tangent);

    registerWipeable(bund.group, 0.33 + s * 0.03, pos, fBarrier.tangent, fBarrier.side, {
      primaryMat: bund.primaryMat,
      materials: bund.materials,
      driftSpeed: 22.0,
      tumbleScale: 4.5,
      sinkScale: 0.25
    });
  }

  // -------------------------------------------------------------------------
  // 2. CANARY WHARF SKYLINE & DOCKS (u = 0.48)
  // -------------------------------------------------------------------------
  const fWharf = getRiverFrame(0.48);
  const wharfSkyGroup = new THREE.Group();
  wharfSkyGroup.position.copy(fWharf.pt);

  const angleWharf = Math.atan2(fWharf.side.x, fWharf.side.z);
  wharfSkyGroup.rotation.y = angleWharf;

  // One Canada Square (Iconic Pyramid Roof)
  const ocsHeight = 44.0;
  const ocsWidth  = 9.5;
  const ocsBody = new THREE.Mesh(new THREE.BoxGeometry(ocsWidth, ocsHeight, ocsWidth), glassTowerMat);
  ocsBody.position.set(-24.0, ocsHeight / 2 + 2.0, -10.0);
  ocsBody.castShadow = true;
  wharfSkyGroup.add(ocsBody);

  const pyramidGeom = new THREE.ConeGeometry(ocsWidth * 0.72, 7.5, 4);
  const pyramid = new THREE.Mesh(pyramidGeom, stainlessSteelMat);
  pyramid.rotation.y = Math.PI / 4;
  pyramid.position.set(-24.0, ocsHeight + 5.75, -10.0);
  wharfSkyGroup.add(pyramid);

  // Flanking Towers (HSBC & Citigroup)
  [-2.0, -18.0].forEach((zOff) => {
    const towerH = 34.0;
    const tower = new THREE.Mesh(new THREE.BoxGeometry(8.0, towerH, 8.0), glassTowerMat);
    tower.position.set(-36.0, towerH / 2 + 2.0, zOff);
    tower.castShadow = true;
    wharfSkyGroup.add(tower);
  });
  group.add(wharfSkyGroup);

  // -------------------------------------------------------------------------
  // ZONE 3: CANARY WHARF & ISLE OF DOGS DOCKS (u = 0.44 - 0.56)
  // -------------------------------------------------------------------------
  for (let i = 0; i < 10; i++) {
    const uCW = 0.44 + i * 0.012;
    const fCW = getRiverFrame(uCW);
    const bankDir = (i % 2 === 0) ? 1 : -1;
    const dist = 8.0 + (i % 3) * 2.2;

    const warehouse = createVictorianWarehouseOrPub(
      7.2 + (i % 3) * 0.5,
      9.8 + (i % 2) * 1.2,
      6.5 + (i % 2) * 0.4,
      brickHues[(i + 2) % brickHues.length],
      (i === 2)
    );

    const pos = fCW.pt.clone().addScaledVector(fCW.side, bankDir * dist);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    warehouse.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fCW.tangent);
    warehouse.group.rotation.y += (i * 0.4);

    registerWipeable(warehouse.group, uCW, pos, fCW.tangent, fCW.side, {
      primaryMat: warehouse.primaryMat,
      materials: warehouse.materials,
      driftSpeed: 25.0,
      tumbleScale: 6.0,
      collapseTilt: (bankDir > 0 ? -0.45 : 0.45)
    });
  }

  // Red Double-Decker Bus on flooded Docklands road
  {
    const bus = createLondonDoubleDeckerBus();
    const pos = fWharf.pt.clone().addScaledVector(fWharf.side, 12.0).addScaledVector(fWharf.tangent, 3.5);
    pos.y = 2.4;
    bus.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fWharf.tangent);
    bus.group.rotation.z = 0.18;

    registerWipeable(bus.group, 0.48, pos, fWharf.tangent, fWharf.side, {
      primaryMat: bus.primaryMat,
      materials: bus.materials,
      driftSpeed: 28.0,
      tumbleScale: 6.5,
      sinkScale: 0.22
    });
  }

  // -------------------------------------------------------------------------
  // 3. LONDON UNDERGROUND TUBE ENTRANCE & FLOOD DOORS (u = 0.60)
  // -------------------------------------------------------------------------
  const fTube = getRiverFrame(0.60);
  const tubeGroup = new THREE.Group();
  tubeGroup.position.copy(fTube.pt);

  const angleTube = Math.atan2(fTube.side.x, fTube.side.z);
  tubeGroup.rotation.y = angleTube;

  const tubePiazza = new THREE.Mesh(new THREE.BoxGeometry(10.0, 1.2, 12.0), stoneGraniteMat);
  tubePiazza.position.set(16.0, 1.6, 0);
  tubeGroup.add(tubePiazza);

  const kioskMesh = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.2, 5.5), stoneGraniteMat);
  kioskMesh.position.set(16.0, 3.6, 0);
  kioskMesh.castShadow = true;
  tubeGroup.add(kioskMesh);

  const totem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.0, 8), darkSpireMat);
  totem.position.set(13.2, 4.2, -3.2);
  tubeGroup.add(totem);

  const roundel = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.18, 8, 20), undergroundRed);
  roundel.position.set(13.2, 6.2, -3.2);
  tubeGroup.add(roundel);

  const roundelBar = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 0.22), policeBlueMat);
  roundelBar.position.set(13.2, 6.2, -3.2);
  tubeGroup.add(roundelBar);

  const floodDoor = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.8, 3.8), sectorGateMat);
  floodDoor.position.set(14.3, 3.4, 0);
  tubeGroup.add(floodDoor);
  group.add(tubeGroup);

  // Breaching sandbag bunds at Tube station
  for (let sb = 0; sb < 3; sb++) {
    const bund = createUndergroundSandbagBund(3.8);
    const pos = fTube.pt.clone().addScaledVector(fTube.side, 13.5).addScaledVector(fTube.tangent, -2.5 + sb * 2.2);
    pos.y = 2.4;
    bund.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fTube.tangent);

    registerWipeable(bund.group, 0.595 + sb * 0.01, pos, fTube.tangent, fTube.side, {
      primaryMat: bund.primaryMat,
      materials: bund.materials,
      driftSpeed: 24.0,
      tumbleScale: 5.5,
      sinkScale: 0.25
    });
  }

  // -------------------------------------------------------------------------
  // 4. HISTORIC TOWER BRIDGE (u = 0.74)
  // -------------------------------------------------------------------------
  const fTower = getRiverFrame(0.74);
  const towerBridgeGroup = new THREE.Group();
  towerBridgeGroup.position.copy(fTower.pt);

  const angleTower = Math.atan2(fTower.side.x, fTower.side.z);
  towerBridgeGroup.rotation.y = angleTower;

  const bridgeSpan = 38.0;
  const towerHeight = 25.0;

  [-bridgeSpan * 0.32, bridgeSpan * 0.32].forEach((xOff) => {
    const tower = new THREE.Group();
    tower.position.set(xOff, 0, 0);

    const pier = new THREE.Mesh(new THREE.BoxGeometry(5.2, 5.0, 11.0), towerBridgeStone);
    pier.position.y = 2.0;
    tower.add(pier);

    const shaft = new THREE.Mesh(new THREE.BoxGeometry(4.2, towerHeight, 7.5), towerBridgeStone);
    shaft.position.y = towerHeight / 2 + 3.0;
    shaft.castShadow = true;
    tower.add(shaft);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.4, 5.5, 4), darkSpireMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.y = towerHeight + 5.75;
    tower.add(roof);

    towerBridgeGroup.add(tower);
  });

  const highWalk1 = new THREE.Mesh(new THREE.BoxGeometry(bridgeSpan * 0.65, 0.8, 1.2), towerBridgeStone);
  highWalk1.position.set(0, towerHeight + 0.8, -2.4);
  const highWalk2 = new THREE.Mesh(new THREE.BoxGeometry(bridgeSpan * 0.65, 0.8, 1.2), towerBridgeStone);
  highWalk2.position.set(0, towerHeight + 0.8, 2.4);
  towerBridgeGroup.add(highWalk1);
  towerBridgeGroup.add(highWalk2);

  const basculeRoad = new THREE.Mesh(new THREE.BoxGeometry(bridgeSpan + 6.0, 0.9, 6.0), towerBridgeBlue);
  basculeRoad.position.set(0, 7.5, 0);
  towerBridgeGroup.add(basculeRoad);
  group.add(towerBridgeGroup);

  // -------------------------------------------------------------------------
  // ZONE 4: ROTHERHITHE & SOUTHWARK VICTORIAN PUBS & EMBANKMENTS (u = 0.66 - 0.78)
  // -------------------------------------------------------------------------
  for (let i = 0; i < 10; i++) {
    const uR = 0.66 + i * 0.012;
    const fR = getRiverFrame(uR);
    const bankDir = (i % 2 === 0) ? 1 : -1;
    const dist = 8.5 + (i % 3) * 2.2;

    const pub = createVictorianWarehouseOrPub(
      7.0 + (i % 2) * 0.5,
      9.5 + (i % 2) * 1.0,
      6.2 + (i % 3) * 0.4,
      brickHues[(i + 3) % brickHues.length],
      (i % 3 === 0)
    );

    const pos = fR.pt.clone().addScaledVector(fR.side, bankDir * dist);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    pub.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fR.tangent);
    pub.group.rotation.y += (i * 0.4);

    registerWipeable(pub.group, uR, pos, fR.tangent, fR.side, {
      primaryMat: pub.primaryMat,
      materials: pub.materials,
      driftSpeed: 25.0,
      tumbleScale: 6.0,
      collapseTilt: (bankDir > 0 ? -0.45 : 0.45)
    });
  }

  // Victorian Embankment wall segments with dolphin lamps that topple
  for (let w = 0; w < 3; w++) {
    const wall = createVictorianEmbankmentWall(6.5);
    const fW = getRiverFrame(0.68 + w * 0.04);
    const pos = fW.pt.clone().addScaledVector(fW.side, -11.0);
    pos.y = 1.8;
    wall.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fW.tangent);

    registerWipeable(wall.group, 0.68 + w * 0.04, pos, fW.tangent, fW.side, {
      primaryMat: wall.primaryMat,
      materials: wall.materials,
      driftSpeed: 22.0,
      tumbleScale: 5.0,
      collapseTilt: 0.6
    });
  }

  // Moored pleasure cruiser in Rotherhithe
  {
    const fB2 = getRiverFrame(0.72);
    const boat = createThamesHouseboat();
    const pos = fB2.pt.clone().addScaledVector(fB2.side, -5.5);
    pos.y = fB2.pt.y + 0.2;
    boat.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fB2.tangent);

    registerWipeable(boat.group, 0.72, pos, fB2.tangent, fB2.side, {
      primaryMat: boat.primaryMat,
      materials: boat.materials,
      driftSpeed: 28.0,
      tumbleScale: 7.0
    });
  }

  // -------------------------------------------------------------------------
  // 5. HMS BELFAST MOORED WARSHIP (u = 0.80)
  // -------------------------------------------------------------------------
  const fShip = getRiverFrame(0.80);
  const belfastGroup = new THREE.Group();
  belfastGroup.position.copy(fShip.pt);

  const hullMesh = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.2, 22.0), navyGreyMat);
  hullMesh.position.set(-fShip.side.x * 6.5, 1.8, -fShip.side.z * 6.5);
  hullMesh.castShadow = true;
  belfastGroup.add(hullMesh);

  const deckHouse = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.8, 14.0), navyGreyMat);
  deckHouse.position.set(-fShip.side.x * 6.5, 3.8, -fShip.side.z * 6.5);
  belfastGroup.add(deckHouse);

  [-3.0, 2.5].forEach(fZ => {
    const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 2.8, 8), darkSpireMat);
    funnel.rotation.x = 0.15;
    funnel.position.set(-fShip.side.x * 6.5, 5.4, -fShip.side.z * 6.5 + fZ);
    belfastGroup.add(funnel);
  });
  group.add(belfastGroup);

  // -------------------------------------------------------------------------
  // 6. VICTORIA EMBANKMENT & BIG BEN (ELIZABETH TOWER) (u = 0.90)
  // -------------------------------------------------------------------------
  const fWest = getRiverFrame(0.90);
  const westGroup = new THREE.Group();
  westGroup.position.copy(fWest.pt);

  const bigBen = new THREE.Group();
  bigBen.position.set(-fWest.side.x * 24.0, 0, -fWest.side.z * 24.0);

  const bbBase = new THREE.Mesh(new THREE.BoxGeometry(7.0, 28.0, 7.0), towerBridgeStone);
  bbBase.position.y = 14.0;
  bbBase.castShadow = true;
  bigBen.add(bbBase);

  const bbClockTier = new THREE.Mesh(new THREE.BoxGeometry(7.4, 6.0, 7.4), stoneGraniteMat);
  bbClockTier.position.y = 31.0;
  bigBen.add(bbClockTier);

  [-3.72, 3.72].forEach(fx => {
    const clock = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.2, 16), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    clock.rotation.z = Math.PI / 2;
    clock.position.set(fx, 31.0, 0);
    bigBen.add(clock);
  });

  const bbSpire = new THREE.Mesh(new THREE.ConeGeometry(4.2, 14.0, 4), darkSpireMat);
  bbSpire.rotation.y = Math.PI / 4;
  bbSpire.position.y = 41.0;
  bigBen.add(bbSpire);
  westGroup.add(bigBen);
  group.add(westGroup);

  // Low-lying riverside pontoons & sandbag defences near Westminster
  for (let s = 0; s < 3; s++) {
    const bund = createUndergroundSandbagBund(4.5);
    const pos = fWest.pt.clone().addScaledVector(fWest.side, -14.0).addScaledVector(fWest.tangent, (s - 1) * 4.5);
    pos.y = 2.4;
    bund.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fWest.tangent);

    registerWipeable(bund.group, 0.88 + s * 0.02, pos, fWest.tangent, fWest.side, {
      primaryMat: bund.primaryMat,
      materials: bund.materials,
      driftSpeed: 22.0,
      tumbleScale: 4.5
    });
  }

  return {
    wipeableItems,
    dynamicWaterItems,
    sectorGates
  };
}
