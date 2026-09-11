import * as THREE from 'three';

/**
 * Procedural 3D Landmarks, Bridges, Skyscrapers, Transit Portals & Countermeasures
 * for New York City (Hurricane Storm Surge Scenario)
 * 
 * Features 65+ dynamic collapsing structures, waterfront brick buildings with rooftop water tanks,
 * wooden pier docks, floating yellow cabs, NYPD cruisers, tugboats, and breached flood barriers
 * that physically fail, tilt, and wash into the East River/Harbor as the 14.9-ft storm surge hits.
 */
export function buildNewYorkScene(group, river, terrain) {
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
  const steelGreenMat   = new THREE.MeshStandardMaterial({ color: 0x22553b, roughness: 0.45, metalness: 0.65 });
  const steelCableMat   = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.85 });
  const tarmacMat       = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
  const concreteMat     = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.75, metalness: 0.1 });
  const seawallGranite  = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85 });
  const glassTowerMat1  = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.15, metalness: 0.85 });
  const glassTowerMat2  = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.2, metalness: 0.75 });
  const stoneTowerMat   = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.85 });
  const escrSteelMat    = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4, metalness: 0.5 });
  const floodgateGrayMat= new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.7 });
  const gothicStoneMat  = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.9 });
  const transformerMat  = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.6 });
  const ceramicMat      = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.3 });
  const usaceArmyMat    = new THREE.MeshStandardMaterial({ color: 0x3f6212, roughness: 0.6 });
  const hoseMat         = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });

  // -------------------------------------------------------------------------
  // PROCEDURAL BUILDERS FOR NEW YORK COLLAPSING ARCHITECTURE & VEHICLES
  // -------------------------------------------------------------------------

  /**
   * Authentic 19th-Century Lower Manhattan / South Street Seaport / DUMBO Brick Building
   * 3-4 stories, red/brown weathered brick facade, window grids, storefront canopy,
   * roof cornice, and classic NYC wooden water tower on steel stilt legs!
   */
  function createWaterfrontBrickBuilding(bw = 8.0, bh = 14.0, bd = 7.5, brickHex = 0x991b1b) {
    const bldgGroup = new THREE.Group();
    const materials = [];

    const brickMat = new THREE.MeshStandardMaterial({ color: brickHex, roughness: 0.85 });
    const stoneTrimMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.7 });
    const darkWindowMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.6 });
    const woodTankMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const steelStiltMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.7 });
    materials.push(brickMat, stoneTrimMat, darkWindowMat, woodTankMat, steelStiltMat);

    // Main Brick Facade Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), brickMat);
    body.position.y = bh * 0.5;
    body.castShadow = true;
    body.receiveShadow = true;
    bldgGroup.add(body);

    // Ground-Floor Commercial Storefront Awning / Trim
    const storefront = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.3, 0.4, bd + 0.3), stoneTrimMat);
    storefront.position.y = 3.2;
    bldgGroup.add(storefront);

    // Roof Cornice Overhang
    const cornice = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.6, 0.6, bd + 0.6), stoneTrimMat);
    cornice.position.y = bh + 0.3;
    bldgGroup.add(cornice);

    // Window Aperture Strips
    const numFloors = Math.floor(bh / 3.2);
    for (let fl = 1; fl < numFloors; fl++) {
      const winStrip = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.85, 1.2, bd + 0.04), darkWindowMat);
      winStrip.position.y = fl * 3.2 + 1.2;
      bldgGroup.add(winStrip);
    }

    // Classic NYC Rooftop Wooden Water Storage Tank on Steel Stilts
    const tankStilts = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 2.2), steelStiltMat);
    tankStilts.position.set(0, bh + 1.5, 0);
    bldgGroup.add(tankStilts);

    const waterTank = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.2, 12), woodTankMat);
    waterTank.position.set(0, bh + 3.4, 0);
    waterTank.castShadow = true;
    bldgGroup.add(waterTank);

    const tankRoof = new THREE.Mesh(new THREE.ConeGeometry(1.3, 0.9, 12), steelStiltMat);
    tankRoof.position.set(0, bh + 4.95, 0);
    bldgGroup.add(tankRoof);

    return { group: bldgGroup, materials, primaryMat: brickMat };
  }

  /**
   * Wooden Harbor Timber Pier / Boat Dock
   */
  function createHarborTimberPier(width = 4.5, length = 12.0) {
    const pierGroup = new THREE.Group();
    const materials = [];

    const timberDeckMat = new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.9 });
    const pileMat = new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.95 });
    const bollardMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.4, metalness: 0.8 });
    materials.push(timberDeckMat, pileMat, bollardMat);

    // Deck planking
    const deck = new THREE.Mesh(new THREE.BoxGeometry(width, 0.35, length), timberDeckMat);
    deck.position.y = 1.2;
    deck.castShadow = true;
    pierGroup.add(deck);

    // Heavy timber piles into seabed
    const pRows = Math.floor(length / 3.0);
    for (let r = 0; r <= pRows; r++) {
      const zOff = -length * 0.5 + r * (length / pRows);
      [-width * 0.42, width * 0.42].forEach(xOff => {
        const pile = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 3.2, 8), pileMat);
        pile.position.set(xOff, 0.0, zOff);
        pierGroup.add(pile);
      });
    }

    // Cast-iron mooring bollards
    [-length * 0.4, 0, length * 0.4].forEach(bZ => {
      const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.4, 8), bollardMat);
      bollard.position.set(width * 0.4, 1.55, bZ);
      pierGroup.add(bollard);
    });

    return { group: pierGroup, materials, primaryMat: timberDeckMat };
  }

  /**
   * Ferry Ticket Kiosk / Harbor Master Marine Shed
   */
  function createMaritimeKiosk(width = 3.2, height = 2.8, depth = 3.6, colorHex = 0x0284c7) {
    const kioskGroup = new THREE.Group();
    const materials = [];

    const wallMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.7 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.8 });
    const buoyMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });
    materials.push(wallMat, roofMat, glassMat, buoyMat);

    const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), wallMat);
    body.position.y = height * 0.5;
    body.castShadow = true;
    kioskGroup.add(body);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(width + 0.5, 0.25, depth + 0.5), roofMat);
    roof.position.y = height + 0.12;
    kioskGroup.add(roof);

    // Ticket service window
    const ticketWin = new THREE.Mesh(new THREE.BoxGeometry(width * 0.6, 0.9, 0.08), glassMat);
    ticketWin.position.set(0, height * 0.55, depth * 0.5 + 0.02);
    kioskGroup.add(ticketWin);

    // Orange lifebuoy on exterior wall
    const buoy = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.1, 8, 16), buoyMat);
    buoy.position.set(width * 0.5 + 0.02, height * 0.6, 0);
    buoy.rotation.y = Math.PI * 0.5;
    kioskGroup.add(buoy);

    return { group: kioskGroup, materials, primaryMat: wallMat };
  }

  /**
   * NYC Medallion Yellow Taxi Cab
   */
  function createYellowCab() {
    const cabGroup = new THREE.Group();
    const materials = [];

    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35, metalness: 0.2 });
    const glassMat  = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2, metalness: 0.7 });
    const blackMat  = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
    materials.push(yellowMat, glassMat, blackMat);

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.65, 3.8), yellowMat);
    body.position.y = 0.55;
    body.castShadow = true;
    cabGroup.add(body);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.55, 1.9), glassMat);
    cabin.position.set(0, 0.95, -0.2);
    cabGroup.add(cabin);

    const sign = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.85), yellowMat);
    sign.position.set(0, 1.35, -0.2);
    cabGroup.add(sign);

    const wGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.22, 8);
    wGeo.rotateZ(Math.PI * 0.5);
    [-0.92, 0.92].forEach(wx => {
      [-1.1, 1.1].forEach(wz => {
        const wheel = new THREE.Mesh(wGeo, blackMat);
        wheel.position.set(wx, 0.28, wz);
        cabGroup.add(wheel);
      });
    });

    return { group: cabGroup, materials, primaryMat: yellowMat };
  }

  /**
   * NYPD Highway Patrol Cruiser
   */
  function createNYPDCruiser() {
    const copGroup = new THREE.Group();
    const materials = [];

    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
    const blueMat  = new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.4 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2, metalness: 0.7 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
    const redLight = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const blueLight= new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
    materials.push(whiteMat, blueMat, glassMat, blackMat, redLight, blueLight);

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.65, 4.0), whiteMat);
    body.position.y = 0.55;
    body.castShadow = true;
    copGroup.add(body);

    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.24, 3.2), blueMat);
    stripe.position.y = 0.55;
    copGroup.add(stripe);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.55, 2.0), glassMat);
    cabin.position.set(0, 0.95, -0.2);
    copGroup.add(cabin);

    // Lightbar
    const rBar = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.14, 0.28), redLight);
    rBar.position.set(-0.35, 1.3, -0.2);
    const bBar = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.14, 0.28), blueLight);
    bBar.position.set(0.35, 1.3, -0.2);
    copGroup.add(rBar);
    copGroup.add(bBar);

    const wGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.22, 8);
    wGeo.rotateZ(Math.PI * 0.5);
    [-0.92, 0.92].forEach(wx => {
      [-1.1, 1.1].forEach(wz => {
        const wheel = new THREE.Mesh(wGeo, blackMat);
        wheel.position.set(wx, 0.28, wz);
        copGroup.add(wheel);
      });
    });

    return { group: copGroup, materials, primaryMat: whiteMat };
  }

  /**
   * Commercial Delivery Box Van / Cargo Truck
   */
  function createDeliveryVan(colorHex = 0x94a3b8) {
    const vanGroup = new THREE.Group();
    const materials = [];

    const vanMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.5 });
    const cabMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
    materials.push(vanMat, cabMat, blackMat);

    const cab = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.2, 1.6), cabMat);
    cab.position.set(0, 0.9, 1.6);
    vanGroup.add(cab);

    const box = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.8, 3.4), vanMat);
    box.position.set(0, 1.3, -0.8);
    box.castShadow = true;
    vanGroup.add(box);

    const wGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 8);
    wGeo.rotateZ(Math.PI * 0.5);
    [-0.95, 0.95].forEach(wx => {
      [-1.2, 1.2].forEach(wz => {
        const wheel = new THREE.Mesh(wGeo, blackMat);
        wheel.position.set(wx, 0.32, wz);
        vanGroup.add(wheel);
      });
    });

    return { group: vanGroup, materials, primaryMat: vanMat };
  }

  /**
   * New York Harbor Tugboat
   */
  function createHarborTugboat() {
    const tugGroup = new THREE.Group();
    const materials = [];

    const hullMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.7 });
    const houseMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
    const stackMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.5 });
    const bandMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    materials.push(hullMat, deckMat, houseMat, stackMat, bandMat);

    const hull = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.1, 6.5), hullMat);
    hull.position.y = 0.55;
    hull.castShadow = true;
    tugGroup.add(hull);

    const deck = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 6.2), deckMat);
    deck.position.y = 1.15;
    tugGroup.add(deck);

    const wheelhouse = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.5, 2.8), houseMat);
    wheelhouse.position.set(0, 1.9, 0.4);
    tugGroup.add(wheelhouse);

    const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 1.6, 10), stackMat);
    stack.position.set(0, 2.6, -1.2);
    tugGroup.add(stack);

    const redBand = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.35, 10), bandMat);
    redBand.position.set(0, 3.1, -1.2);
    tugGroup.add(redBand);

    return { group: tugGroup, materials, primaryMat: hullMat };
  }

  /**
   * Subway Entrance Sandbag Bund Segment
   */
  function createSubwaySandbagBund(length = 3.2) {
    const bundGroup = new THREE.Group();
    const materials = [];

    const sandbagMat = new THREE.MeshStandardMaterial({ color: 0xb59a72, roughness: 0.95 });
    materials.push(sandbagMat);

    const cols = Math.floor(length / 0.75);
    for (let row = 0; row < 3; row++) {
      for (let c = 0; c < cols; c++) {
        const bag = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.32, 0.45), sandbagMat);
        bag.position.set((c - cols * 0.5 + 0.5) * 0.75, 0.16 + row * 0.3, (row % 2) * 0.1);
        bundGroup.add(bag);
      }
    }

    return { group: bundGroup, materials, primaryMat: sandbagMat };
  }

  /**
   * Cast-Iron Promenade Lamp Post & Park Bench
   */
  function createParkBenchAndLamp() {
    const assetGroup = new THREE.Group();
    const materials = [];

    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.8 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
    const lampGlow = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    materials.push(ironMat, woodMat, lampGlow);

    // Lamp post
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 3.6, 8), ironMat);
    post.position.set(0, 1.8, 0);
    assetGroup.add(post);

    const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), lampGlow);
    lantern.position.set(0, 3.6, 0);
    assetGroup.add(lantern);

    // Bench
    const bench = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.5), woodMat);
    bench.position.set(1.4, 0.25, 0);
    assetGroup.add(bench);

    return { group: assetGroup, materials, primaryMat: ironMat };
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
        (Math.random() - 0.5) * (options.tumbleScale || 6.0),
        (Math.random() - 0.5) * (options.tumbleScale || 5.0),
        (Math.random() - 0.5) * (options.tumbleScale || 6.0)
      ),
      collapseTilt: options.collapseTilt || ((Math.random() > 0.5 ? 1 : -1) * (0.35 + Math.random() * 0.35)),
      sinkScale: options.sinkScale || 0.18,
      washSpeed: options.washSpeed || 38.0,
      maxProg: options.maxProg || 0.055,
      material: options.primaryMat,
      materials: options.materials
    });
  }

  // -------------------------------------------------------------------------
  // 1. THE NARROWS & VERRAZZANO-NARROWS SUSPENSION BRIDGE (u = 0.10)
  // -------------------------------------------------------------------------
  const fVz = getRiverFrame(0.10);
  const vzGroup = new THREE.Group();
  vzGroup.position.copy(fVz.pt);

  const vzSpan = 38.0;
  const towerHeight = 28.0;

  [-vzSpan * 0.48, vzSpan * 0.48].forEach((sideOffset) => {
    const towerGroup = new THREE.Group();
    towerGroup.position.set(fVz.side.x * sideOffset, 0, fVz.side.z * sideOffset);

    const caisson = new THREE.Mesh(new THREE.BoxGeometry(6.0, 5.0, 7.0), concreteMat);
    caisson.position.y = 1.5;
    towerGroup.add(caisson);

    [-1.8, 1.8].forEach((legZ) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(2.0, towerHeight, 2.2), steelGreenMat);
      leg.position.set(0, towerHeight * 0.5 + 4.0, legZ);
      leg.castShadow = true;
      towerGroup.add(leg);
    });

    [10.0, 18.0, 26.0, towerHeight + 3.0].forEach((strutY) => {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.4, 4.4), steelGreenMat);
      strut.position.set(0, strutY, 0);
      towerGroup.add(strut);
    });

    vzGroup.add(towerGroup);
  });

  const deckWidth = vzSpan + 6.0;
  const deck = new THREE.Mesh(new THREE.BoxGeometry(deckWidth, 1.2, 5.0), steelGreenMat);
  deck.rotation.y = Math.atan2(fVz.side.x, fVz.side.z);
  deck.position.set(0, 11.0, 0);
  deck.castShadow = true;
  vzGroup.add(deck);

  const vzRoad = new THREE.Mesh(new THREE.BoxGeometry(deckWidth, 0.2, 4.2), tarmacMat);
  vzRoad.rotation.y = Math.atan2(fVz.side.x, fVz.side.z);
  vzRoad.position.set(0, 11.7, 0);
  vzGroup.add(vzRoad);

  [-1.8, 1.8].forEach((cableZ) => {
    const cableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-vzSpan * 0.55, 6.0, cableZ),
      new THREE.Vector3(-vzSpan * 0.48, towerHeight + 3.5, cableZ),
      new THREE.Vector3(0, 12.2, cableZ),
      new THREE.Vector3(vzSpan * 0.48, towerHeight + 3.5, cableZ),
      new THREE.Vector3(vzSpan * 0.55, 6.0, cableZ)
    ]);
    const cableGeo = new THREE.TubeGeometry(cableCurve, 32, 0.25, 8, false);
    const cableMesh = new THREE.Mesh(cableGeo, steelCableMat);
    vzGroup.add(cableMesh);
  });
  group.add(vzGroup);

  // -------------------------------------------------------------------------
  // ZONE 1: UPPER NEW YORK BAY HARBOR TUGS, DOCKS & BUOYS (u = 0.12 - 0.22)
  // -------------------------------------------------------------------------
  [0.13, 0.17, 0.21].forEach((uTug, tIdx) => {
    const fTug = getRiverFrame(uTug);
    const tug = createHarborTugboat();
    const pos = fTug.pt.clone().addScaledVector(fTug.side, (tIdx % 2 === 0 ? 5.5 : -5.5));
    pos.y = fTug.pt.y + 0.2;
    tug.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fTug.tangent);
    tug.group.rotation.y += (tIdx * 0.4);

    registerWipeable(tug.group, uTug, pos, fTug.tangent, fTug.side, {
      primaryMat: tug.primaryMat,
      materials: tug.materials,
      driftSpeed: 30.0,
      tumbleScale: 7.0,
      sinkScale: 0.25
    });
  });

  // Shoreline wooden pier docks in Upper Bay
  [0.15, 0.19].forEach((uPier, pIdx) => {
    const fP = getRiverFrame(uPier);
    const pier = createHarborTimberPier(4.2, 11.0);
    const pos = fP.pt.clone().addScaledVector(fP.side, (pIdx === 0 ? 9.5 : -9.5));
    pos.y = fP.pt.y;
    pier.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fP.side);

    registerWipeable(pier.group, uPier, pos, fP.tangent, fP.side, {
      primaryMat: pier.primaryMat,
      materials: pier.materials,
      driftSpeed: 24.0,
      tumbleScale: 5.0
    });
  });

  // -------------------------------------------------------------------------
  // 2. LOWER MANHATTAN FINANCIAL DISTRICT & BATTERY SEAWALL (u = 0.35)
  // -------------------------------------------------------------------------
  const fMan = getRiverFrame(0.35);
  const manGroup = new THREE.Group();
  manGroup.position.copy(fMan.pt);

  const seawall = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.8, 48.0), seawallGranite);
  seawall.position.set(fMan.side.x * 12.0, 1.4, 0);
  seawall.castShadow = true;
  manGroup.add(seawall);

  const lawn = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.4, 46.0), new THREE.MeshStandardMaterial({ color: 0x2e5436, roughness: 0.9 }));
  lawn.position.set(fMan.side.x * 17.5, 1.7, 0);
  manGroup.add(lawn);

  // Skyscraper Cluster (Lower Manhattan Skyline)
  const towerDefs = [
    { xOff: 26, zOff: -14, w: 8, d: 8, h: 42, mat: glassTowerMat1, spire: true },
    { xOff: 34, zOff: -4,  w: 9, d: 9, h: 32, mat: glassTowerMat2, spire: false },
    { xOff: 25, zOff: 6,   w: 7, d: 7, h: 28, mat: stoneTowerMat,  spire: false },
    { xOff: 36, zOff: 15,  w: 8, d: 8, h: 36, mat: glassTowerMat1, spire: true },
    { xOff: 28, zOff: 24,  w: 9, d: 7, h: 24, mat: stoneTowerMat,  spire: false },
    { xOff: 44, zOff: -10, w: 10, d: 10, h: 48, mat: glassTowerMat2, spire: true },
    { xOff: 42, zOff: 8,   w: 8, d: 8, h: 30, mat: glassTowerMat1, spire: false }
  ];

  towerDefs.forEach((t) => {
    const towerGroup = new THREE.Group();
    towerGroup.position.set(fMan.side.x * t.xOff, 1.8, t.zOff);

    const bldg = new THREE.Mesh(new THREE.BoxGeometry(t.w, t.h, t.d), t.mat);
    bldg.position.y = t.h * 0.5;
    bldg.castShadow = true;
    bldg.receiveShadow = true;
    towerGroup.add(bldg);

    const crown = new THREE.Mesh(new THREE.BoxGeometry(t.w * 0.7, 4.0, t.d * 0.7), t.mat);
    crown.position.y = t.h + 2.0;
    towerGroup.add(crown);

    if (t.spire) {
      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.6, 9.0, 8), steelCableMat);
      spire.position.y = t.h + 8.5;
      towerGroup.add(spire);
    }
    manGroup.add(towerGroup);
  });
  group.add(manGroup);

  // -------------------------------------------------------------------------
  // ZONE 2: BATTERY PARK COLLAPSING PIERS, KIOSKS & VEHICLES (u = 0.24 - 0.36)
  // -------------------------------------------------------------------------
  // Harbor Timber Piers at Battery waterfront
  for (let p = 0; p < 4; p++) {
    const uP = 0.24 + p * 0.03;
    const fP = getRiverFrame(uP);
    const pier = createHarborTimberPier(4.5, 14.0);
    const pos = fP.pt.clone().addScaledVector(fP.side, 9.0).addScaledVector(fP.tangent, (p - 1.5) * 3.5);
    pos.y = fP.pt.y;
    pier.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fP.side);

    registerWipeable(pier.group, uP, pos, fP.tangent, fP.side, {
      primaryMat: pier.primaryMat,
      materials: pier.materials,
      driftSpeed: 25.0,
      tumbleScale: 5.5,
      collapseTilt: 0.45
    });
  }

  // Maritime ticket kiosks & harbor sheds
  for (let k = 0; k < 3; k++) {
    const uK = 0.26 + k * 0.035;
    const fK = getRiverFrame(uK);
    const kiosk = createMaritimeKiosk(3.4, 2.8, 3.8, (k % 2 === 0 ? 0x0284c7 : 0xd97706));
    const pos = fK.pt.clone().addScaledVector(fK.side, 13.5).addScaledVector(fK.tangent, -4.0 + k * 4.0);
    pos.y = 2.1;
    kiosk.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fK.tangent);

    registerWipeable(kiosk.group, uK, pos, fK.tangent, fK.side, {
      primaryMat: kiosk.primaryMat,
      materials: kiosk.materials,
      driftSpeed: 27.0,
      tumbleScale: 7.0
    });
  }

  // Battery Park promenade lamp posts and benches
  for (let l = 0; l < 5; l++) {
    const uL = 0.25 + l * 0.025;
    const fL = getRiverFrame(uL);
    const lamp = createParkBenchAndLamp();
    const pos = fL.pt.clone().addScaledVector(fL.side, 15.0).addScaledVector(fL.tangent, -6.0 + l * 3.2);
    pos.y = 2.0;
    lamp.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fL.tangent);

    registerWipeable(lamp.group, uL, pos, fL.tangent, fL.side, {
      primaryMat: lamp.primaryMat,
      materials: lamp.materials,
      driftSpeed: 24.0,
      tumbleScale: 6.0
    });
  }

  // Yellow Cabs on West Street that float and drift
  [-8, 2, 12].forEach((cz, idx) => {
    const cab = createYellowCab();
    const pos = fMan.pt.clone().addScaledVector(fMan.side, 21.0).addScaledVector(fMan.tangent, cz);
    pos.y = 2.1;
    cab.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMan.tangent);
    cab.group.rotation.y += (idx % 2 === 0 ? 0.3 : -0.2);

    registerWipeable(cab.group, 0.32 + idx * 0.015, pos, fMan.tangent, fMan.side, {
      primaryMat: cab.primaryMat,
      materials: cab.materials,
      driftSpeed: 30.0,
      tumbleScale: 8.0,
      sinkScale: 0.22
    });
  });

  // NYPD Cruiser drifting
  {
    const copCar = createNYPDCruiser();
    const pos = fMan.pt.clone().addScaledVector(fMan.side, 23.5).addScaledVector(fMan.tangent, 5.0);
    pos.y = 2.1;
    copCar.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMan.tangent);
    copCar.group.rotation.y = -0.5;

    registerWipeable(copCar.group, 0.34, pos, fMan.tangent, fMan.side, {
      primaryMat: copCar.primaryMat,
      materials: copCar.materials,
      driftSpeed: 31.0,
      tumbleScale: 8.5
    });
  }

  // -------------------------------------------------------------------------
  // ZONE 3: SOUTH FERRY SUBWAY PORTAL & SANDBAG BREACH (u = 0.35 - 0.40)
  // -------------------------------------------------------------------------
  // Subway Kiosk enclosure
  {
    const subKiosk = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2.4, 6.0), steelGreenMat);
    const pos = fMan.pt.clone().addScaledVector(fMan.side, 14.5).addScaledVector(fMan.tangent, -6.0);
    pos.y = 2.9;
    subKiosk.castShadow = true;

    registerWipeable(subKiosk, 0.36, pos, fMan.tangent, fMan.side, {
      primaryMat: steelGreenMat,
      driftSpeed: 26.0,
      tumbleScale: 6.0,
      collapseTilt: 0.4
    });
  }

  // Breaching sandbag bund segments at subway stairs
  for (let s = 0; s < 3; s++) {
    const bund = createSubwaySandbagBund(3.4);
    const pos = fMan.pt.clone().addScaledVector(fMan.side, 14.0).addScaledVector(fMan.tangent, -4.0 + s * 1.5);
    pos.y = 2.0;
    bund.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMan.tangent);

    registerWipeable(bund.group, 0.355 + s * 0.008, pos, fMan.tangent, fMan.side, {
      primaryMat: bund.primaryMat,
      materials: bund.materials,
      driftSpeed: 22.0,
      tumbleScale: 4.5,
      sinkScale: 0.25
    });
  }

  // Delivery van caught in subway plaza
  {
    const van = createDeliveryVan(0x0284c7);
    const pos = fMan.pt.clone().addScaledVector(fMan.side, 18.0).addScaledVector(fMan.tangent, -2.0);
    pos.y = 2.1;
    van.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMan.tangent);

    registerWipeable(van.group, 0.37, pos, fMan.tangent, fMan.side, {
      primaryMat: van.primaryMat,
      materials: van.materials,
      driftSpeed: 28.0,
      tumbleScale: 7.0
    });
  }

  // -------------------------------------------------------------------------
  // ZONE 4: SOUTH STREET SEAPORT WATERFRONT BRICK BUILDINGS (u = 0.42 - 0.54)
  // -------------------------------------------------------------------------
  const brickColors = [0x991b1b, 0x854d0e, 0x7f1d1d, 0x713f12, 0x9a3412];
  for (let b = 0; b < 8; b++) {
    const uBldg = 0.42 + b * 0.015;
    const fBldg = getRiverFrame(uBldg);
    const bldg = createWaterfrontBrickBuilding(
      7.5 + (b % 3) * 0.6,
      12.0 + (b % 4) * 1.8,
      7.0 + (b % 2) * 0.5,
      brickColors[b % brickColors.length]
    );
    const pos = fBldg.pt.clone().addScaledVector(fBldg.side, 15.5 + (b % 2) * 2.5);
    pos.y = 1.8;
    bldg.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fBldg.tangent);
    bldg.group.rotation.y += (b * 0.3);

    registerWipeable(bldg.group, uBldg, pos, fBldg.tangent, fBldg.side, {
      primaryMat: bldg.primaryMat,
      materials: bldg.materials,
      driftSpeed: 24.0,
      tumbleScale: 5.0,
      collapseTilt: (b % 2 === 0 ? 0.45 : -0.45)
    });
  }

  // Floating cabs & vans on FDR Drive corridor
  [0.44, 0.48, 0.52].forEach((uVeh, vIdx) => {
    const fV = getRiverFrame(uVeh);
    const veh = (vIdx === 1 ? createDeliveryVan(0xd97706) : createYellowCab());
    const pos = fV.pt.clone().addScaledVector(fV.side, 11.5).addScaledVector(fV.tangent, (vIdx - 1) * 3.0);
    pos.y = 2.4;
    veh.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fV.tangent);

    registerWipeable(veh.group, uVeh, pos, fV.tangent, fV.side, {
      primaryMat: veh.primaryMat,
      materials: veh.materials,
      driftSpeed: 30.0,
      tumbleScale: 7.5,
      sinkScale: 0.22
    });
  });

  // -------------------------------------------------------------------------
  // 4. FDR DRIVE & ESCR FLOODGATES (u = 0.50)
  // -------------------------------------------------------------------------
  const fFDR = getRiverFrame(0.50);
  const fdrGroup = new THREE.Group();
  fdrGroup.position.copy(fFDR.pt);

  const highwayLen = 36.0;
  const highway = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.8, highwayLen), tarmacMat);
  highway.position.set(fFDR.side.x * 14.0, 2.6, 0);
  highway.castShadow = true;
  fdrGroup.add(highway);

  const median = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, highwayLen), concreteMat);
  median.position.set(fFDR.side.x * 14.0, 3.2, 0);
  fdrGroup.add(median);

  const escrBerm = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.8, highwayLen), concreteMat);
  escrBerm.position.set(fFDR.side.x * 10.0, 1.9, 0);
  fdrGroup.add(escrBerm);
  group.add(fdrGroup);

  // Dynamic ESCR Floodwall Panels that fail and tilt into East River
  [-8.0, 8.0].forEach((gateZ, gIdx) => {
    const gateGroup = new THREE.Group();
    const gateFrame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.2, 4.8), floodgateGrayMat);
    gateGroup.add(gateFrame);
    const hazardStrip = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.5, 4.4), escrSteelMat);
    gateGroup.add(hazardStrip);

    const pos = fFDR.pt.clone().addScaledVector(fFDR.side, 10.0).addScaledVector(fFDR.tangent, gateZ);
    pos.y = 3.2;

    registerWipeable(gateGroup, 0.495 + gIdx * 0.02, pos, fFDR.tangent, fFDR.side, {
      primaryMat: floodgateGrayMat,
      driftSpeed: 22.0,
      tumbleScale: 5.0,
      collapseTilt: 0.55
    });
  });

  // -------------------------------------------------------------------------
  // 5. BROOKLYN BRIDGE & GOTHIC TOWERS (u = 0.65)
  // -------------------------------------------------------------------------
  const fBr = getRiverFrame(0.65);
  const brGroup = new THREE.Group();
  brGroup.position.copy(fBr.pt);

  const brSpan = 34.0;
  const brTowerH = 26.0;

  [-brSpan * 0.45, brSpan * 0.45].forEach((towerOffset) => {
    const bTower = new THREE.Group();
    bTower.position.set(fBr.side.x * towerOffset, 0, fBr.side.z * towerOffset);

    const pierBlock = new THREE.Mesh(new THREE.BoxGeometry(6.5, 6.0, 8.0), gothicStoneMat);
    pierBlock.position.y = 2.0;
    bTower.add(pierBlock);

    [-2.2, 0, 2.2].forEach(pZ => {
      const pilaster = new THREE.Mesh(new THREE.BoxGeometry(2.2, brTowerH, 1.4), gothicStoneMat);
      pilaster.position.set(0, brTowerH * 0.5 + 4.0, pZ);
      pilaster.castShadow = true;
      bTower.add(pilaster);
    });

    const topCap = new THREE.Mesh(new THREE.BoxGeometry(6.6, 2.2, 7.8), gothicStoneMat);
    topCap.position.set(0, brTowerH + 4.8, 0);
    bTower.add(topCap);
    brGroup.add(bTower);
  });

  const brDeck = new THREE.Mesh(new THREE.BoxGeometry(brSpan + 6.0, 0.8, 6.5), tarmacMat);
  brDeck.rotation.y = Math.atan2(fBr.side.x, fBr.side.z);
  brDeck.position.set(0, 9.5, 0);
  brDeck.castShadow = true;
  brGroup.add(brDeck);

  [-2.6, 2.6].forEach(cZ => {
    const brCableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-brSpan * 0.55, 4.0, cZ),
      new THREE.Vector3(-brSpan * 0.45, brTowerH + 4.0, cZ),
      new THREE.Vector3(0, 10.4, cZ),
      new THREE.Vector3(brSpan * 0.45, brTowerH + 4.0, cZ),
      new THREE.Vector3(brSpan * 0.55, 4.0, cZ)
    ]);
    const brCableGeo = new THREE.TubeGeometry(brCableCurve, 32, 0.18, 6, false);
    const brCableMesh = new THREE.Mesh(brCableGeo, steelCableMat);
    brGroup.add(brCableMesh);
  });
  group.add(brGroup);

  // -------------------------------------------------------------------------
  // ZONE 5: DUMBO WATERFRONT BUILDINGS & BARGES (u = 0.58 - 0.70)
  // -------------------------------------------------------------------------
  for (let d = 0; d < 6; d++) {
    const uDumbo = 0.58 + d * 0.02;
    const fDumbo = getRiverFrame(uDumbo);
    const bldg = createWaterfrontBrickBuilding(
      8.5 + (d % 2) * 0.8,
      13.5 + (d % 3) * 1.5,
      8.0,
      brickColors[(d + 2) % brickColors.length]
    );
    const pos = fDumbo.pt.clone().addScaledVector(fDumbo.side, -16.0 - (d % 2) * 2.0);
    pos.y = 1.8;
    bldg.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fDumbo.tangent);
    bldg.group.rotation.y += (d * 0.4);

    registerWipeable(bldg.group, uDumbo, pos, fDumbo.tangent, fDumbo.side, {
      primaryMat: bldg.primaryMat,
      materials: bldg.materials,
      driftSpeed: 25.0,
      tumbleScale: 5.5,
      collapseTilt: 0.5
    });
  }

  // Moored work barge in East River
  {
    const fTug = getRiverFrame(0.64);
    const tug = createHarborTugboat();
    const pos = fTug.pt.clone().addScaledVector(fTug.side, -6.5);
    pos.y = fTug.pt.y + 0.2;
    tug.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fTug.tangent);

    registerWipeable(tug.group, 0.64, pos, fTug.tangent, fTug.side, {
      primaryMat: tug.primaryMat,
      materials: tug.materials,
      driftSpeed: 28.0,
      tumbleScale: 7.0
    });
  }

  // -------------------------------------------------------------------------
  // 6. CON EDISON 14TH STREET SUBSTATION & ARC FLASH EXPLOSION (u = 0.78)
  // -------------------------------------------------------------------------
  const fConEd = getRiverFrame(0.78);
  const conEdGroup = new THREE.Group();
  conEdGroup.position.copy(fConEd.pt);

  const subYard = new THREE.Mesh(new THREE.BoxGeometry(18.0, 1.2, 26.0), concreteMat);
  subYard.position.set(fConEd.side.x * 18.0, 1.6, 0);
  subYard.receiveShadow = true;
  conEdGroup.add(subYard);

  for (let tr = 0; tr < 3; tr++) {
    const trGroup = new THREE.Group();
    const trTank = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.2, 4.2), transformerMat);
    trTank.position.y = 2.4;
    trTank.castShadow = true;
    trGroup.add(trTank);

    for (let f = -1.6; f <= 1.6; f += 0.8) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.4, 4.4), transformerMat);
      fin.position.set(f, 2.4, 0);
      trGroup.add(fin);
    }

    [-1.0, 0, 1.0].forEach(bZ => {
      const bushing = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 2.2, 8), ceramicMat);
      bushing.position.set(0, 4.8, bZ);
      trGroup.add(bushing);
    });

    trGroup.position.set(fConEd.side.x * 18.0, 1.0, -8.0 + tr * 8.0);
    conEdGroup.add(trGroup);
  }

  [-11.0, 11.0].forEach(tZ => {
    const gTower = new THREE.Mesh(new THREE.BoxGeometry(1.8, 12.0, 1.8), darkSteelGantry());
    gTower.position.set(fConEd.side.x * 13.0, 7.0, tZ);
    conEdGroup.add(gTower);
  });

  const arcLight = new THREE.PointLight(0x60a5fa, 0.0, 60);
  arcLight.position.set(fConEd.side.x * 18.0, 7.0, 0);
  conEdGroup.add(arcLight);

  const arcGeo = new THREE.SphereGeometry(2.4, 8, 8);
  const arcMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.0 });
  const arcMesh = new THREE.Mesh(arcGeo, arcMat);
  arcMesh.position.copy(arcLight.position);
  conEdGroup.add(arcMesh);
  group.add(conEdGroup);

  // Substation perimeter blast barrier panels that buckle
  for (let sb = 0; sb < 3; sb++) {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.4, 5.0), concreteMat);
    const pos = fConEd.pt.clone().addScaledVector(fConEd.side, 10.5).addScaledVector(fConEd.tangent, (sb - 1) * 5.2);
    pos.y = 2.4;
    panel.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fConEd.tangent);

    registerWipeable(panel, 0.76 + sb * 0.015, pos, fConEd.tangent, fConEd.side, {
      primaryMat: concreteMat,
      driftSpeed: 20.0,
      tumbleScale: 4.5,
      collapseTilt: 0.6
    });
  }

  // -------------------------------------------------------------------------
  // 7. USACE UNWATERING ARMADA & HIGH-VOLUME MOBILE PUMPS (u = 0.92)
  // -------------------------------------------------------------------------
  const fArmy = getRiverFrame(0.92);
  const armyGroup = new THREE.Group();
  armyGroup.position.copy(fArmy.pt);

  for (let p = 0; p < 3; p++) {
    const pumpRig = new THREE.Group();
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 4.4), usaceArmyMat);
    chassis.position.y = 1.0;
    pumpRig.add(chassis);

    const engine = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.6, 2.8), new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.5, metalness: 0.5 }));
    engine.position.set(0, 2.0, -0.4);
    pumpRig.add(engine);

    const hose = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 10.0, 12), hoseMat);
    hose.rotation.z = Math.PI * 0.44;
    hose.position.set(-4.5, 0.8, 0);
    pumpRig.add(hose);

    const lightMast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.5, 6), steelCableMat);
    lightMast.position.set(0.8, 3.2, 1.6);
    const floodlight = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.3), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    floodlight.position.set(0.8, 5.5, 1.6);
    pumpRig.add(lightMast);
    pumpRig.add(floodlight);

    pumpRig.position.set(fArmy.side.x * 14.0, 1.8, -7.0 + p * 7.0);
    armyGroup.add(pumpRig);
  }
  group.add(armyGroup);

  function darkSteelGantry() {
    return new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.7 });
  }

  return {
    wipeableItems,
    dynamicWaterItems,
    arcLight,
    arcMesh
  };
}
