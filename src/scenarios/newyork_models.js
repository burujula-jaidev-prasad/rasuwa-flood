import * as THREE from 'three';

/**
 * Procedural 3D Landmarks, Skyscrapers, Bridges, Transit Portals & Dynamic Collapsing Architecture
 * for New York City (Morning Hurricane Storm Surge Scenario)
 * 
 * Features:
 * - One World Trade Center (Freedom Tower) with 68m faceted glass curtain wall and 18m spire
 * - Classic Wall Street Art Deco limestone towers & modern reflective financial high-rises
 * - Historic Brooklyn Bridge with neo-gothic stone arches and elevated pedestrian boardwalk
 * - Verrazzano-Narrows monumental suspension bridge at the harbor throat
 * - Battery Park waterfront esplanade, Castle Clinton fort & Staten Island Ferry Terminal
 * - FDR Drive & East Side Coastal Resiliency (ESCR) 16.5-ft sliding roller floodgates
 * - ConEd 14th Street Substation with outdoor 345 kV transformer yard & electric arc flash
 * - USACE Unwatering Armada heavy trailer dewatering pump rigs
 * - 67+ dynamic collapsing structures (South St Seaport & DUMBO 19th-century brick lofts with
 *   classic rooftop wooden water tanks on stilts, timber docks, yellow cabs, NYPD cruisers)
 * - 100% grounded to terrain elevation (no subterranean clipping).
 */
export function buildNewYorkScene(group, river, terrain) {
  const wipeableItems = [];
  const dynamicWaterItems = [];
  const tubesList = [];
  let metroStation = null;

  // Helper to place objects on river tangents & bank normals
  function getRiverFrame(u) {
    const pt = river.getPointAt(u);
    const tangent = river.getTangentAt(u).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();
    return { pt, tangent, side, up };
  }

  function getGroundY(x, z, fallbackY = 2.4) {
    if (terrain && typeof terrain.getTerrainHeight === 'function') {
      return terrain.getTerrainHeight(x, z) + 0.1;
    }
    return fallbackY;
  }

  // Common Materials with crisp morning reflections & specular highlights
  const steelGreenMat   = new THREE.MeshStandardMaterial({ color: 0x1e3a2b, roughness: 0.35, metalness: 0.7 });
  const steelCableMat   = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, roughness: 0.25, metalness: 0.85 });
  const tarmacMat       = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.8 });
  const concreteMat     = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.7, metalness: 0.1 });
  const seawallGranite  = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.75 });
  const glassTowerMat1  = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.9 });
  const glassTowerMat2  = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.12, metalness: 0.85, transparent: true, opacity: 0.9 });
  const stoneTowerMat   = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.75 });
  const copperRoofMat   = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6, metalness: 0.3 });
  const escrSteelMat    = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4, metalness: 0.6 });
  const floodgateGrayMat= new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.45, metalness: 0.7 });
  const gothicStoneMat  = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.85 });
  const transformerMat  = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.6 });
  const ceramicMat      = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.3 });
  const usaceArmyMat    = new THREE.MeshStandardMaterial({ color: 0x3f6212, roughness: 0.6 });
  const hoseMat         = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 });
  const castIronMat     = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8, metalness: 0.6 });
  const tubeCutawayMat  = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.38, depthWrite: false });
  const subwaySteelMat  = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.25, metalness: 0.85 });
  const thirdRailCoverMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });
  const tubeWaterMat    = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.12, metalness: 0.35, transparent: true, opacity: 0.88, depthWrite: false });

  // -------------------------------------------------------------------------
  // PROCEDURAL BUILDERS FOR NEW YORK ARCHITECTURE & VEHICLES
  // -------------------------------------------------------------------------

  /**
   * 19th-Century Lower Manhattan / South Street Seaport / DUMBO Brick Building
   * With authentic NYC rooftop wooden water tank on steel stilts!
   */
  function createWaterfrontBrickBuilding(bw = 8.0, bh = 14.0, bd = 7.5, brickHex = 0x991b1b) {
    const bldgGroup = new THREE.Group();
    const materials = [];

    const brickMat = new THREE.MeshStandardMaterial({ color: brickHex, roughness: 0.85 });
    const stoneTrimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 });
    const darkWindowMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.15, metalness: 0.7 });
    const woodTankMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const steelStiltMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.7 });
    materials.push(brickMat, stoneTrimMat, darkWindowMat, woodTankMat, steelStiltMat);

    // Main Brick Facade Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), brickMat);
    body.position.y = bh * 0.5;
    body.castShadow = true;
    body.receiveShadow = true;
    bldgGroup.add(body);

    // Storefront Trim
    const storefront = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.3, 0.4, bd + 0.3), stoneTrimMat);
    storefront.position.y = 3.2;
    bldgGroup.add(storefront);

    // Roof Cornice
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

    // NYC Rooftop Wooden Water Tank on Steel Stilts
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

  // Harbor Timber Pier / Boarding Dock
  function createTimberPier(pLen = 16.0, pWidth = 4.5) {
    const pierGroup = new THREE.Group();
    const materials = [];

    const deckWood = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const pileMat = new THREE.MeshStandardMaterial({ color: 0x271a0c, roughness: 0.95 });
    materials.push(deckWood, pileMat);

    const deck = new THREE.Mesh(new THREE.BoxGeometry(pWidth, 0.5, pLen), deckWood);
    deck.position.set(0, 1.8, pLen * 0.5);
    deck.castShadow = true;
    pierGroup.add(deck);

    const numPiles = Math.floor(pLen / 3.5);
    for (let i = 0; i <= numPiles; i++) {
      [-pWidth * 0.42, pWidth * 0.42].forEach(pX => {
        const pile = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 4.0, 8), pileMat);
        pile.position.set(pX, 0.2, i * 3.5);
        pierGroup.add(pile);
      });
    }

    const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    bollard.position.set(pWidth * 0.35, 2.2, pLen * 0.9);
    pierGroup.add(bollard);

    return { group: pierGroup, materials, primaryMat: deckWood };
  }

  // Maritime Ticket Kiosk / Harbor Master Booth
  function createMaritimeKiosk(kw = 3.2, kh = 2.8, kd = 3.6, roofHex = 0x0284c7) {
    const kioskGroup = new THREE.Group();
    const materials = [];

    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.6 });
    const roofMat = new THREE.MeshStandardMaterial({ color: roofHex, roughness: 0.4 });
    const darkWinMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.7 });
    materials.push(wallMat, roofMat, darkWinMat);

    const walls = new THREE.Mesh(new THREE.BoxGeometry(kw, kh, kd), wallMat);
    walls.position.y = kh * 0.5;
    walls.castShadow = true;
    kioskGroup.add(walls);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(kw * 0.75, 1.4, 4), roofMat);
    roof.position.y = kh + 0.7;
    roof.rotation.y = Math.PI * 0.25;
    kioskGroup.add(roof);

    const windowCut = new THREE.Mesh(new THREE.BoxGeometry(kw * 0.7, kh * 0.35, kd + 0.04), darkWinMat);
    windowCut.position.y = kh * 0.6;
    kioskGroup.add(windowCut);

    return { group: kioskGroup, materials, primaryMat: wallMat };
  }

  // Yellow Medallion NYC Taxi Cab
  function createYellowCab() {
    const cabGroup = new THREE.Group();
    const materials = [];

    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.25, metalness: 0.4 });
    const darkWinMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.15, metalness: 0.8 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.9 });
    materials.push(yellowMat, darkWinMat, wheelMat, chromeMat);

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.85, 4.4), yellowMat);
    chassis.position.y = 0.65;
    chassis.castShadow = true;
    cabGroup.add(chassis);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.75, 2.4), darkWinMat);
    cabin.position.set(0, 1.4, -0.2);
    cabGroup.add(cabin);

    const taxiSign = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.3), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    taxiSign.position.set(0, 1.9, -0.2);
    cabGroup.add(taxiSign);

    [[-0.95, -1.3], [0.95, -1.3], [-0.95, 1.3], [0.95, 1.3]].forEach(([wX, wZ]) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.3, 10), wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wX, 0.35, wZ);
      cabGroup.add(wheel);
    });

    return { group: cabGroup, materials, primaryMat: yellowMat };
  }

  // NYPD Highway Patrol Squad Cruiser
  function createNYPDCruiser() {
    const copGroup = new THREE.Group();
    const materials = [];

    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3 });
    const darkWinMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.15, metalness: 0.8 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    materials.push(whiteMat, blueMat, darkWinMat, wheelMat);

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.85, 4.4), whiteMat);
    chassis.position.y = 0.65;
    copGroup.add(chassis);

    const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.02, 0.25, 4.42), blueMat);
    stripe.position.y = 0.65;
    copGroup.add(stripe);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.75, 2.4), darkWinMat);
    cabin.position.set(0, 1.4, -0.2);
    copGroup.add(cabin);

    const lightbar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 0.3), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    lightbar.position.set(0, 1.88, -0.2);
    copGroup.add(lightbar);

    [[-0.95, -1.3], [0.95, -1.3], [-0.95, 1.3], [0.95, 1.3]].forEach(([wX, wZ]) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.3, 10), wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wX, 0.35, wZ);
      copGroup.add(wheel);
    });

    return { group: copGroup, materials, primaryMat: whiteMat };
  }

  // Commercial Delivery Van
  function createDeliveryVan(vanHex = 0x2563eb) {
    const vanGroup = new THREE.Group();
    const materials = [];

    const vanMat = new THREE.MeshStandardMaterial({ color: vanHex, roughness: 0.4 });
    const darkWinMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.7 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    materials.push(vanMat, darkWinMat, wheelMat);

    const cargo = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 4.2), vanMat);
    cargo.position.set(0, 1.4, 0.2);
    cargo.castShadow = true;
    vanGroup.add(cargo);

    const cab = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.4, 1.4), vanMat);
    cab.position.set(0, 1.2, -1.9);
    vanGroup.add(cab);

    const win = new THREE.Mesh(new THREE.BoxGeometry(2.12, 0.6, 1.0), darkWinMat);
    win.position.set(0, 1.45, -1.8);
    vanGroup.add(win);

    [[-1.05, -1.4], [1.05, -1.4], [-1.05, 1.4], [1.05, 1.4]].forEach(([wX, wZ]) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.35, 10), wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wX, 0.38, wZ);
      vanGroup.add(wheel);
    });

    return { group: vanGroup, materials, primaryMat: vanMat };
  }

  // Harbor Tugboat
  function createHarborTugboat() {
    const boatGroup = new THREE.Group();
    const materials = [];

    const hullMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.4 });
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const funnelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
    materials.push(hullMat, cabinMat, deckMat, funnelMat);

    const hull = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.6, 9.0), hullMat);
    hull.position.y = 0.8;
    hull.castShadow = true;
    boatGroup.add(hull);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 3.8), cabinMat);
    cabin.position.set(0, 2.2, -0.6);
    boatGroup.add(cabin);

    const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.8, 8), funnelMat);
    funnel.position.set(0, 3.8, 0.6);
    boatGroup.add(funnel);

    return { group: boatGroup, materials, primaryMat: hullMat };
  }

  // Subway Sandbag Barrier Bund
  function createSubwaySandbagBund(len = 4.0) {
    const bundGroup = new THREE.Group();
    const sandbagMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.95 });
    const materials = [sandbagMat];

    const numBags = Math.floor(len / 0.8);
    for (let r = 0; r < 3; r++) {
      for (let i = 0; i < numBags - r; i++) {
        const bag = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.35, 0.5), sandbagMat);
        bag.position.set((i - (numBags - r) * 0.5) * 0.8, r * 0.32 + 0.18, 0);
        bundGroup.add(bag);
      }
    }
    return { group: bundGroup, materials, primaryMat: sandbagMat };
  }

  /**
   * Authentic NYC Subway Station Entrance (South Ferry / 1 Train)
   * With ornate cast-iron hood, illuminated MTA green/red globe lamps,
   * mosaic station sign, descending tiled stairs, and cascading floodwater.
   */
  function createNYCSubwayEntrance() {
    const subGroup = new THREE.Group();
    const materials = [];

    const ironMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.45, metalness: 0.6 });
    const tileMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    const darkTunnelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const greenGlobeMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x15803d, emissiveIntensity: 0.8, roughness: 0.2 });
    const redGlobeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.8, roughness: 0.2 });
    const signMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 });
    const signTextMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const mtaRedBullet = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 });
    const waterSheetMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.82 });
    const brassRodMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.8 });

    materials.push(ironMat, tileMat, darkTunnelMat, greenGlobeMat, redGlobeMat, signMat, signTextMat, mtaRedBullet, waterSheetMat, brassRodMat);

    const w = 4.2;
    const d = 6.4;

    // 1. Granite Street Curb Perimeter
    const curb = new THREE.Mesh(new THREE.BoxGeometry(w + 0.6, 0.4, d + 0.6), concreteMat);
    curb.position.y = 0.2;
    curb.castShadow = true;
    subGroup.add(curb);

    // 2. Descending Stairwell Cavity into Ground
    const cavity = new THREE.Mesh(new THREE.BoxGeometry(w - 0.4, 2.8, d - 0.4), darkTunnelMat);
    cavity.position.y = -1.4;
    subGroup.add(cavity);

    // Stair Steps descending down toward negative Z
    const numSteps = 7;
    for (let s = 0; s < numSteps; s++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(w - 0.8, 0.3, (d - 1.0) / numSteps), concreteMat);
      step.position.set(0, -0.2 - s * 0.35, -d * 0.38 + s * ((d - 1.2) / numSteps));
      subGroup.add(step);
    }

    // White ceramic tiled sidewalls
    [-w * 0.5 + 0.15, w * 0.5 - 0.15].forEach(wx => {
      const tileWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.4, d - 0.8), tileMat);
      tileWall.position.set(wx, -1.0, 0);
      subGroup.add(tileWall);
    });

    // 3. Ornate Cast-Iron Perimeter Railings (sides and back)
    [-w * 0.5 + 0.05, w * 0.5 - 0.05].forEach(rx => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, d), ironMat);
      rail.position.set(rx, 1.0, 0);
      rail.castShadow = true;
      subGroup.add(rail);
    });
    const backRail = new THREE.Mesh(new THREE.BoxGeometry(w, 1.2, 0.12), ironMat);
    backRail.position.set(0, 1.0, -d * 0.5 + 0.05);
    backRail.castShadow = true;
    subGroup.add(backRail);

    // 4. Arched Cast-Iron Entrance Hood & Overhead Marquee (front entrance)
    const postGeo = new THREE.BoxGeometry(0.22, 2.8, 0.22);
    [-w * 0.5 + 0.1, w * 0.5 - 0.1].forEach((px, pIdx) => {
      const post = new THREE.Mesh(postGeo, ironMat);
      post.position.set(px, 1.4, d * 0.5 - 0.1);
      post.castShadow = true;
      subGroup.add(post);

      // Brass lamp stanchion extending upward
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 6), brassRodMat);
      rod.position.set(px, 3.0, d * 0.5 - 0.1);
      subGroup.add(rod);

      // Globe lamp (Green on left for 24/7 entrance, Red on right)
      const globe = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), (pIdx === 0 ? greenGlobeMat : redGlobeMat));
      globe.position.set(px, 3.4, d * 0.5 - 0.1);
      subGroup.add(globe);
    });

    // Decorative Cast-Iron Overhead Arch
    const archBar = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 0.25, 0.35), ironMat);
    archBar.position.set(0, 2.7, d * 0.5 - 0.1);
    archBar.castShadow = true;
    subGroup.add(archBar);

    // 5. Crisp Illuminated Subway Station Nameplate: "SUBWAY • SOUTH FERRY • (1)"
    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(w * 0.88, 0.65, 0.14), signMat);
    signBoard.position.set(0, 2.2, d * 0.5 - 0.08);
    subGroup.add(signBoard);

    const signStripe = new THREE.Mesh(new THREE.BoxGeometry(w * 0.82, 0.32, 0.16), signTextMat);
    signStripe.position.set(-0.35, 2.2, d * 0.5 - 0.07);
    subGroup.add(signStripe);

    // Red MTA (1) Train Bullet circle
    const bullet = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.18, 12), mtaRedBullet);
    bullet.rotation.x = Math.PI * 0.5;
    bullet.position.set(w * 0.35, 2.2, d * 0.5 - 0.06);
    subGroup.add(bullet);

    // 6. Cascading Inundation Waterfall Sheet pouring down into stairs
    const cascadeWater = new THREE.Mesh(new THREE.BoxGeometry(w - 0.7, 0.35, d * 0.75), waterSheetMat);
    cascadeWater.rotation.x = -0.32;
    cascadeWater.position.set(0, -0.4, 0.2);
    subGroup.add(cascadeWater);

    return { group: subGroup, materials, primaryMat: ironMat };
  }

  /**
   * Sidewalk Subway Ventilation Grates (Heavy cast-iron sidewalk grates flush with pavement)
   */
  function createSidewalkSubwayGrate(gw = 2.4, gd = 4.8) {
    const grateGroup = new THREE.Group();
    const materials = [];
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8, metalness: 0.7 });
    const barMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85, metalness: 0.8 });
    const holeMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.95 });
    materials.push(frameMat, barMat, holeMat);

    // Subterranean void cavity
    const voidMesh = new THREE.Mesh(new THREE.BoxGeometry(gw, 0.4, gd), holeMat);
    voidMesh.position.y = -0.15;
    grateGroup.add(voidMesh);

    // Cast-iron perimeter frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(gw + 0.3, 0.12, gd + 0.3), frameMat);
    frame.position.y = 0.06;
    grateGroup.add(frame);

    // Parallel slatted grate bars
    const numBars = Math.floor(gd / 0.32);
    for (let b = 0; b < numBars; b++) {
      const bZ = (b - numBars * 0.5 + 0.5) * 0.32;
      const bar = new THREE.Mesh(new THREE.BoxGeometry(gw * 0.92, 0.08, 0.14), barMat);
      bar.position.set(0, 0.08, bZ);
      grateGroup.add(bar);
    }

    return { group: grateGroup, materials, primaryMat: frameMat };
  }

  /**
   * Historic Bowling Green Beaux-Arts Subway Station Control House (Heins & LaFarge Kiosk)
   */
  function createBowlingGreenSubwayKiosk() {
    const bgGroup = new THREE.Group();
    const materials = [];
    const brickMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.8 });
    const limestoneMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.6 });
    const copperRoof = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.4, metalness: 0.3 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.4, metalness: 0.6 });
    const mtaGreen = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.3 });
    const globeMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x15803d, emissiveIntensity: 0.8, roughness: 0.2 });
    materials.push(brickMat, limestoneMat, copperRoof, ironMat, mtaGreen, globeMat);

    const kw = 8.0;
    const kh = 4.6;
    const kd = 6.0;

    // Beaux-Arts limestone foundation plinth
    const base = new THREE.Mesh(new THREE.BoxGeometry(kw, 1.0, kd), limestoneMat);
    base.position.y = 0.5;
    bgGroup.add(base);

    // Red brick wall envelope with decorative quoins
    const body = new THREE.Mesh(new THREE.BoxGeometry(kw * 0.95, kh * 0.6, kd * 0.95), brickMat);
    body.position.y = 1.0 + kh * 0.3;
    body.castShadow = true;
    bgGroup.add(body);

    // Twin Arched Entry Portals with descending tiled stairs
    [-kw * 0.25, kw * 0.25].forEach((px, idx) => {
      const archFrame = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.6, kd + 0.08), limestoneMat);
      archFrame.position.set(px, 2.3, 0);
      bgGroup.add(archFrame);

      // Descending stairs
      for (let s = 0; s < 5; s++) {
        const step = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.22, 0.7), limestoneMat);
        step.position.set(px, 0.2 - s * 0.22, -kd * 0.3 + s * 0.55);
        bgGroup.add(step);
      }

      // MTA Globe Lamp atop portal
      const globe = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 10), globeMat);
      globe.position.set(px, 4.0, kd * 0.5 + 0.1);
      bgGroup.add(globe);
    });

    // Copper Mansard Hip Roof
    const roof = new THREE.Mesh(new THREE.ConeGeometry(kw * 0.68, 2.2, 4), copperRoof);
    roof.position.y = kh + 0.7;
    roof.rotation.y = Math.PI * 0.25;
    roof.castShadow = true;
    bgGroup.add(roof);

    // Historic Subway Nameplate: "BOWLING GREEN • (4)(5)"
    const sign = new THREE.Mesh(new THREE.BoxGeometry(kw * 0.65, 0.55, 0.15), ironMat);
    sign.position.set(0, 3.6, kd * 0.5 + 0.1);
    bgGroup.add(sign);

    const bullet = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.18, 12), mtaGreen);
    bullet.rotation.x = Math.PI * 0.5;
    bullet.position.set(kw * 0.24, 3.6, kd * 0.5 + 0.14);
    bgGroup.add(bullet);

    return { group: bgGroup, materials, primaryMat: brickMat };
  }

  // Classic NYC Double-Luminaire Teardrop Streetlamp
  function createNYCStreetLamp() {
    const lampGroup = new THREE.Group();
    const materials = [];
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e3a2b, roughness: 0.4, metalness: 0.65 });
    const glowMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.8, roughness: 0.2 });
    materials.push(ironMat, glowMat);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 1.1, 8), ironMat);
    base.position.y = 0.55;
    lampGroup.add(base);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.18, 5.0, 8), ironMat);
    pole.position.y = 3.5;
    pole.castShadow = true;
    lampGroup.add(pole);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 0.16), ironMat);
    arm.position.y = 5.6;
    lampGroup.add(arm);

    [-0.95, 0.95].forEach(lx => {
      const shade = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.28, 8), ironMat);
      shade.position.set(lx, 5.5, 0);
      lampGroup.add(shade);

      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), glowMat);
      bulb.position.set(lx, 5.28, 0);
      lampGroup.add(bulb);
    });

    return { group: lampGroup, materials, primaryMat: ironMat };
  }

  // NYC Cantilever Traffic Signal Mast Arm
  function createTrafficSignal() {
    const sigGroup = new THREE.Group();
    const materials = [];
    const yellowSteel = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4, metalness: 0.5 });
    const headMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 });
    const redLight = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const amberLight = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const greenLight = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    materials.push(yellowSteel, headMat, redLight, amberLight, greenLight);

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 6.2, 8), yellowSteel);
    mast.position.y = 3.1;
    sigGroup.add(mast);

    const cantArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 5.0, 8), yellowSteel);
    cantArm.rotation.z = Math.PI / 2;
    cantArm.position.set(2.4, 5.8, 0);
    sigGroup.add(cantArm);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.4, 0.38), headMat);
    head.position.set(3.8, 5.3, 0);
    sigGroup.add(head);

    const rL = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), redLight);
    rL.position.set(3.8, 5.7, 0.2);
    sigGroup.add(rL);

    const aL = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), amberLight);
    aL.position.set(3.8, 5.3, 0.2);
    sigGroup.add(aL);

    const gL = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), greenLight);
    gL.position.set(3.8, 4.9, 0.2);
    sigGroup.add(gL);

    return { group: sigGroup, materials, primaryMat: yellowSteel };
  }

  // Classic NYC Fire Hydrant
  function createNYCFireHydrant() {
    const hydGroup = new THREE.Group();
    const materials = [];
    const redBody = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
    const silverCap = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.25, metalness: 0.85 });
    materials.push(redBody, silverCap);

    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.9, 10), redBody);
    barrel.position.y = 0.45;
    barrel.castShadow = true;
    hydGroup.add(barrel);

    const bonnet = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.2, 10), silverCap);
    bonnet.position.y = 0.95;
    hydGroup.add(bonnet);

    const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 5), silverCap);
    nut.position.y = 1.08;
    hydGroup.add(nut);

    [-0.22, 0.22].forEach(nx => {
      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2, 8), silverCap);
      nozzle.rotation.z = Math.PI / 2;
      nozzle.position.set(nx, 0.55, 0);
      hydGroup.add(nozzle);
    });

    return { group: hydGroup, materials, primaryMat: redBody };
  }

  // World's Fair Cast-Iron & Wood Park Bench
  function createParkBench() {
    const benchGroup = new THREE.Group();
    const materials = [];
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.5, metalness: 0.6 });
    materials.push(woodMat, ironMat);

    [-1.0, 1.0].forEach(bx => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.8, 0.9), ironMat);
      leg.position.set(bx, 0.4, 0);
      benchGroup.add(leg);
    });

    for (let s = 0; s < 4; s++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.18), woodMat);
      slat.position.set(0, 0.45, -0.3 + s * 0.2);
      benchGroup.add(slat);
    }
    for (let bs = 0; bs < 3; bs++) {
      const bSlat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.18, 0.08), woodMat);
      bSlat.position.set(0, 0.6 + bs * 0.2, -0.38);
      benchGroup.add(bSlat);
    }

    return { group: benchGroup, materials, primaryMat: woodMat };
  }

  // Paved Asphalt Road Grid with double-yellow lines & pedestrian zebra crosswalks
  function createPavedRoadGrid(roadW = 9.0, roadL = 44.0, hasCrosswalk = true) {
    const roadGroup = new THREE.Group();
    const materials = [];
    const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.85 });
    const doubleYellow = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const whitePaint = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 });
    materials.push(asphaltMat, doubleYellow, whitePaint, curbMat);

    // Asphalt surface
    const asphalt = new THREE.Mesh(new THREE.BoxGeometry(roadW, 0.2, roadL), asphaltMat);
    asphalt.position.y = 0.1;
    asphalt.receiveShadow = true;
    roadGroup.add(asphalt);

    // Double-yellow center lines
    [-0.15, 0.15].forEach(dyX => {
      const yLine = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, roadL * 0.88), doubleYellow);
      yLine.position.set(dyX, 0.22, 0);
      roadGroup.add(yLine);
    });

    // White dashed lane markers
    [-roadW * 0.25, roadW * 0.25].forEach(dlX => {
      const numDashes = Math.floor(roadL / 4.0);
      for (let d = 0; d < numDashes; d++) {
        const dZ = (d - numDashes * 0.5 + 0.5) * 4.0;
        const dash = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.02, 2.0), whitePaint);
        dash.position.set(dlX, 0.22, dZ);
        roadGroup.add(dash);
      }
    });

    // Pedestrian zebra crosswalks
    if (hasCrosswalk) {
      [-roadL * 0.42, roadL * 0.42].forEach(crossZ => {
        const numBars = Math.floor(roadW / 1.0);
        for (let b = 0; b < numBars; b++) {
          const bX = (b - numBars * 0.5 + 0.5) * 1.0;
          const zebra = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.02, 3.2), whitePaint);
          zebra.position.set(bX, 0.23, crossZ);
          roadGroup.add(zebra);
        }
      });
    }

    // Flanking concrete curbs
    [-roadW * 0.5 - 0.25, roadW * 0.5 + 0.25].forEach(cX => {
      const curb = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, roadL), curbMat);
      curb.position.set(cX, 0.25, 0);
      roadGroup.add(curb);
    });

    return { group: roadGroup, materials, primaryMat: asphaltMat };
  }

  /**
   * Wall Street Neoclassical Bank / Stock Exchange Facade
   * Grand Greek-Revival facade with 6 fluted limestone Corinthian columns,
   * pediment frieze, bronze double entry doors, and carved entablature.
   */
  function createWallStreetBank() {
    const bankGroup = new THREE.Group();
    const materials = [];

    const stonePodiumMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.85 });
    const colMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f4, roughness: 0.65 });
    const pedimentMat = new THREE.MeshStandardMaterial({ color: 0xe7e5e4, roughness: 0.7 });
    const bronzeDoorMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.3, metalness: 0.85 });
    const darkWinMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.15, metalness: 0.8 });
    const goldLetterMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.8 });
    materials.push(stonePodiumMat, colMat, pedimentMat, bronzeDoorMat, darkWinMat, goldLetterMat);

    const bw = 16.0;
    const bh = 15.0;
    const bd = 11.0;

    // 1. Raised Granite Base & Approach Steps
    const base = new THREE.Mesh(new THREE.BoxGeometry(bw, 1.8, bd), stonePodiumMat);
    base.position.y = 0.9;
    base.castShadow = true;
    base.receiveShadow = true;
    bankGroup.add(base);

    // Approach Steps on front
    for (let st = 0; st < 4; st++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.9, 0.3, 1.0), stonePodiumMat);
      step.position.set(0, 0.15 + st * 0.3, bd * 0.5 + 0.5 + (3 - st) * 0.6);
      bankGroup.add(step);
    }

    // 2. Main Building Core Wall behind colonnade
    const core = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.95, bh, bd * 0.75), stonePodiumMat);
    core.position.set(0, bh * 0.5 + 1.8, -bd * 0.12);
    core.castShadow = true;
    bankGroup.add(core);

    // 3. Colonnade of 6 Massive Fluted Classical Columns along the portico
    const numCols = 6;
    const colSpacing = (bw - 2.8) / (numCols - 1);
    const colH = 9.8;
    for (let c = 0; c < numCols; c++) {
      const cX = -((bw - 2.8) * 0.5) + c * colSpacing;
      // Column Base
      const cBase = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.45, 1.5), colMat);
      cBase.position.set(cX, 2.0, bd * 0.4);
      bankGroup.add(cBase);

      // Fluted Shaft
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, colH, 12), colMat);
      shaft.position.set(cX, 2.0 + colH * 0.5, bd * 0.4);
      shaft.castShadow = true;
      bankGroup.add(shaft);

      // Capital
      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.55, 1.4), colMat);
      cap.position.set(cX, 2.0 + colH + 0.25, bd * 0.4);
      bankGroup.add(cap);
    }

    // 4. Grand Entablature Beam across the columns
    const entablature = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.6, 1.4, 3.2), pedimentMat);
    entablature.position.set(0, 2.0 + colH + 1.1, bd * 0.35);
    entablature.castShadow = true;
    bankGroup.add(entablature);

    // Inscribed Frieze Gold Strip
    const frieze = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.75, 0.5, 0.1), goldLetterMat);
    frieze.position.set(0, 2.0 + colH + 1.1, bd * 0.35 + 1.62);
    bankGroup.add(frieze);

    // 5. Grand Triangular Pediment with carved cornice
    const pedW = bw + 0.8;
    const pedH = 3.6;
    const pedD = 3.0;
    const pedSlopeLen = (pedW * 0.5) / Math.cos(0.42);
    [-1, 1].forEach(sideDir => {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(pedSlopeLen, 0.3, pedD), pedimentMat);
      slab.position.set(sideDir * pedW * 0.25, 2.0 + colH + 1.8 + pedH * 0.48, bd * 0.35);
      slab.rotation.z = -sideDir * 0.42;
      slab.castShadow = true;
      bankGroup.add(slab);
    });
    // Pediment Tympanum infill wall
    const tympanum = new THREE.Mesh(new THREE.BoxGeometry(pedW * 0.85, pedH * 0.85, 0.4), pedimentMat);
    tympanum.position.set(0, 2.0 + colH + 1.8 + pedH * 0.4, bd * 0.35 + 0.8);
    bankGroup.add(tympanum);

    // 6. Bronze Double Entry Portals & Lofty Windows
    const doors = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.4, 0.2), bronzeDoorMat);
    doors.position.set(0, 4.0, bd * 0.25 + 0.1);
    bankGroup.add(doors);

    [-4.5, 4.5].forEach(wx => {
      const win = new THREE.Mesh(new THREE.BoxGeometry(2.0, 5.0, 0.15), darkWinMat);
      win.position.set(wx, 4.5, bd * 0.25 + 0.1);
      bankGroup.add(win);
    });

    return { group: bankGroup, materials, primaryMat: stonePodiumMat };
  }

  /**
   * Financial District Modern Reflective Glass High-Rise / Trading Pavilion
   * Blue curtain wall, dark steel spaceframe cross-bracing, ground-floor atrium.
   */
  function createFinancialGlassPavilion() {
    const pavGroup = new THREE.Group();
    const materials = [];

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.08,
      metalness: 0.92,
      transparent: true,
      opacity: 0.90
    });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.8 });
    const atriumGlass = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      roughness: 0.05,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85
    });
    materials.push(glassMat, steelMat, atriumGlass);

    const w = 13.0;
    const h = 26.0;
    const d = 11.0;

    // Main Reflective Blue Glass Tower
    const tower = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), glassMat);
    tower.position.y = h * 0.5;
    tower.castShadow = true;
    tower.receiveShadow = true;
    pavGroup.add(tower);

    // Structural Steel Corner Columns
    [[-w * 0.5, -d * 0.5], [w * 0.5, -d * 0.5], [-w * 0.5, d * 0.5], [w * 0.5, d * 0.5]].forEach(([cx, cz]) => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.6, h, 0.6), steelMat);
      col.position.set(cx, h * 0.5, cz);
      col.castShadow = true;
      pavGroup.add(col);
    });

    // Horizontal Steel Floor Bands
    const numFloors = 7;
    for (let f = 1; f < numFloors; f++) {
      const band = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 0.4, d + 0.2), steelMat);
      band.position.y = f * (h / numFloors);
      pavGroup.add(band);
    }

    // Ground Floor Double-Height Atrium
    const atrium = new THREE.Mesh(new THREE.BoxGeometry(w * 0.92, 4.5, d * 0.92), atriumGlass);
    atrium.position.y = 2.25;
    pavGroup.add(atrium);

    // Rooftop Mechanical Penthouse
    const penthouse = new THREE.Mesh(new THREE.BoxGeometry(w * 0.65, 3.2, d * 0.65), steelMat);
    penthouse.position.y = h + 1.6;
    pavGroup.add(penthouse);

    return { group: pavGroup, materials, primaryMat: glassMat };
  }

  /**
   * Iconic Bowling Green Charging Bull Bronze Monument
   * Sculpted bronze bull on polished black granite plinth with dedication plaque.
   */
  function createChargingBullMonument() {
    const bullGroup = new THREE.Group();
    const materials = [];

    const plinthMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25 });
    const bronzeMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.35, metalness: 0.85 });
    const plaqueMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.8 });
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.6 });
    materials.push(plinthMat, bronzeMat, plaqueMat, barrierMat);

    // 1. Polished Black Granite Plinth
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.2, 5.2), plinthMat);
    plinth.position.y = 0.6;
    plinth.castShadow = true;
    bullGroup.add(plinth);

    // Brass Plaque
    const plaque = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.08), plaqueMat);
    plaque.position.set(0, 0.6, 2.64);
    bullGroup.add(plaque);

    // 2. Sculpted Bronze Bull
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.5, 3.2), bronzeMat);
    body.position.set(0, 2.1, 0);
    body.castShadow = true;
    bullGroup.add(body);

    const shoulder = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.2, 1.4), bronzeMat);
    shoulder.position.set(0, 2.4, 0.7);
    shoulder.castShadow = true;
    bullGroup.add(shoulder);

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.1, 1.5), bronzeMat);
    head.position.set(0, 1.7, 2.0);
    head.rotation.x = 0.28;
    head.castShadow = true;
    bullGroup.add(head);

    [-0.8, 0.8].forEach((hx, hIdx) => {
      const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.16, 1.2, 8), bronzeMat);
      horn.rotation.z = (hIdx === 0 ? 0.7 : -0.7);
      horn.rotation.x = -0.5;
      horn.position.set(hx, 2.2, 2.3);
      bullGroup.add(horn);
    });

    [[-0.65, -0.9], [0.65, -0.9], [-0.65, 0.9], [0.65, 0.9]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.1, 0.45), bronzeMat);
      leg.position.set(lx, 1.4, lz);
      bullGroup.add(leg);
    });

    // 3. Perimeter Blue Crowd Control Barricades
    [-2.2, 2.2].forEach(bx => {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 5.0), barrierMat);
      bar.position.set(bx, 0.45, 0);
      bullGroup.add(bar);
    });

    return { group: bullGroup, materials, primaryMat: bronzeMat };
  }

  /**
   * Historic Wall Street & Broad Street Corner Signpost
   */
  function createWallStreetSignpost() {
    const postGroup = new THREE.Group();
    const materials = [];

    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.7 });
    const greenEnamel = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.3 });
    const whiteLetter = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    materials.push(ironMat, greenEnamel, whiteLetter);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 4.4, 8), ironMat);
    pole.position.y = 2.2;
    pole.castShadow = true;
    postGroup.add(pole);

    const wallSign = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.38, 0.08), greenEnamel);
    wallSign.position.set(0.65, 3.8, 0);
    postGroup.add(wallSign);
    const wallText = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.18, 0.1), whiteLetter);
    wallText.position.set(0.65, 3.8, 0);
    postGroup.add(wallText);

    const broadSign = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.38, 1.8), greenEnamel);
    broadSign.position.set(0, 4.15, 0.65);
    postGroup.add(broadSign);
    const broadText = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 1.5), whiteLetter);
    broadText.position.set(0, 4.15, 0.65);
    postGroup.add(broadText);

    return { group: postGroup, materials, primaryMat: greenEnamel };
  }

  /**
   * Battery Park Breached Granite Seawall Section
   */
  function createBatterySeawallBreachSegment(length = 22.0) {
    const wallGroup = new THREE.Group();
    const materials = [];

    const graniteMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.75 });
    const railMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.7 });
    materials.push(graniteMat, railMat);

    const wall = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.2, length), graniteMat);
    wall.position.y = 1.6;
    wall.castShadow = true;
    wallGroup.add(wall);

    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, length), railMat);
    rail.position.set(0, 3.6, 0);
    wallGroup.add(rail);

    return { group: wallGroup, materials, primaryMat: graniteMat };
  }

  function registerWipeable(mesh, uTrigger, pos, tangent, side, options = {}) {
    mesh.position.copy(pos);
    group.add(mesh);

    const driftDir = options.driftDir || tangent.clone().normalize().multiplyScalar(options.driftSpeed || 28.0);
    const tumbleVel = options.tumbleVel || new THREE.Vector3(
      (Math.random() - 0.5) * (options.tumbleScale || 6.0),
      (Math.random() - 0.5) * (options.tumbleScale || 6.0),
      (Math.random() - 0.5) * (options.tumbleScale || 6.0)
    );

    wipeableItems.push({
      mesh,
      uTrigger,
      initialPos: pos.clone(),
      initialRot: mesh.rotation.clone(),
      driftDir,
      tumbleVel,
      collapseTilt: options.collapseTilt || 0.55,
      collapseTiltX: options.collapseTiltX || 0.0,
      sinkScale: options.sinkScale !== undefined ? options.sinkScale : 0.25,
      material: options.primaryMat || null,
      materials: options.materials || null,
      maxProg: options.maxProg || 0.12
    });
  }

  /**
   * 3D Billboard Status Badges for Submerged Under-River Tubes
   * Generates crisp dual canvas textures for Active (Dry) vs Submerged (Flooded) states
   */
  function createTubeBadgeTextures(title, bullets, tubeDesc) {
    if (typeof document === 'undefined' || !document.createElement) {
      const dummyTex = new THREE.Texture();
      return { texDry: dummyTex, texSub: dummyTex };
    }

    function renderBadge(isSubmerged) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 140;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return new THREE.Texture();
      }

      ctx.fillStyle = isSubmerged ? 'rgba(69, 10, 10, 0.92)' : 'rgba(15, 23, 42, 0.90)';
      ctx.strokeStyle = isSubmerged ? '#ef4444' : '#10b981';
      ctx.lineWidth = 4;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(10, 10, 492, 120, 16);
      } else {
        ctx.rect(10, 10, 492, 120);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isSubmerged ? '#ef4444' : '#10b981';
      ctx.beginPath();
      ctx.arc(36, 44, 11, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 30px -apple-system, sans-serif';
      ctx.fillText(title, 58, 54);

      ctx.fillStyle = isSubmerged ? '#fca5a5' : '#86efac';
      ctx.font = 'bold 22px monospace';
      const statusText = isSubmerged ? '[ SUBMERGED • 100% INUNDATED ]' : '[ ACTIVE / DRY • PUMPS RUNNING ]';
      ctx.fillText(statusText, 58, 92);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '18px -apple-system, sans-serif';
      ctx.fillText(tubeDesc, 58, 118);

      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      return tex;
    }

    return { texDry: renderBadge(false), texSub: renderBadge(true) };
  }

  /**
   * Under-River Transit Tube (East River & Upper NY Bay crossing)
   * High-fidelity 3D cutaway tube with tracks, stalled subway train / cars,
   * cast-iron segmental ring flanges, bulkhead lights, and dynamic floodwater volume.
   */
  function buildUnderRiverSubwayTube(cfg) {
    const fTube = getRiverFrame(cfg.u);
    const tubeGroup = new THREE.Group();
    tubeGroup.position.copy(fTube.pt);
    tubeGroup.position.y = 1.0;

    const basis = new THREE.Matrix4().makeBasis(fTube.tangent, fTube.up, fTube.side);
    tubeGroup.quaternion.setFromRotationMatrix(basis);

    const span = cfg.tubeSpan || 36.0;
    const r = cfg.radius || 2.4;
    const lights = [];

    if (cfg.isVehicular) {
      // Twin vehicular tubes (Brooklyn-Battery Tunnel) at X = -2.5 and X = +2.5
      [-2.5, 2.5].forEach((tubX) => {
        const subTube = new THREE.Group();
        subTube.position.set(tubX, 0, 0);

        // Lower half cylindrical cast-iron shell
        const lowerGeo = new THREE.CylinderGeometry(r, r, span, 24, 1, true, 0, Math.PI);
        const lowerMesh = new THREE.Mesh(lowerGeo, castIronMat);
        lowerMesh.rotation.x = Math.PI * 0.5;
        subTube.add(lowerMesh);

        // Upper half translucent cutaway shell
        const upperGeo = new THREE.CylinderGeometry(r, r, span, 24, 1, true, Math.PI, Math.PI);
        const upperMesh = new THREE.Mesh(upperGeo, tubeCutawayMat);
        upperMesh.rotation.x = Math.PI * 0.5;
        subTube.add(upperMesh);

        // Segmental cast-iron ring ribs every 2.8m
        for (let rz = -span * 0.48; rz <= span * 0.48; rz += 2.8) {
          const rib = new THREE.Mesh(new THREE.TorusGeometry(r, 0.08, 8, 24, Math.PI), castIronMat);
          rib.rotation.y = Math.PI * 0.5;
          rib.position.set(0, 0, rz);
          subTube.add(rib);
        }

        // Paved asphalt roadway bed
        const road = new THREE.Mesh(new THREE.BoxGeometry(r * 1.6, 0.25, span), tarmacMat);
        road.position.set(0, -r * 0.55, 0);
        subTube.add(road);

        // Double yellow center line
        const yellowLine = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.04, span * 0.96),
          new THREE.MeshBasicMaterial({ color: 0xfacc15 })
        );
        yellowLine.position.set(0, -r * 0.55 + 0.14, 0);
        subTube.add(yellowLine);

        // Overhead ceiling tunnel lights
        for (let lz = -span * 0.4; lz <= span * 0.4; lz += 4.5) {
          const lampMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.85 });
          const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), lampMat);
          lamp.position.set(0, r * 0.75, lz);
          subTube.add(lamp);
          lights.push(lamp);
        }

        tubeGroup.add(subTube);
      });

      // Stalled vehicles inside the tubes
      const cab = createYellowCab();
      cab.group.position.set(-2.5, -r * 0.55 + 0.14, -4.0);
      tubeGroup.add(cab.group);

      const van = createDeliveryVan(0x0284c7);
      van.group.position.set(2.5, -r * 0.55 + 0.14, 3.0);
      tubeGroup.add(van.group);

      const cab2 = createYellowCab();
      cab2.group.position.set(-2.5, -r * 0.55 + 0.14, 9.0);
      tubeGroup.add(cab2.group);

    } else {
      // Subway tube with tracks, ties, third rail, and stalled MTA train
      const lowerGeo = new THREE.CylinderGeometry(r, r, span, 24, 1, true, 0, Math.PI);
      const lowerMesh = new THREE.Mesh(lowerGeo, castIronMat);
      lowerMesh.rotation.x = Math.PI * 0.5;
      tubeGroup.add(lowerMesh);

      const upperGeo = new THREE.CylinderGeometry(r, r, span, 24, 1, true, Math.PI, Math.PI);
      const upperMesh = new THREE.Mesh(upperGeo, tubeCutawayMat);
      upperMesh.rotation.x = Math.PI * 0.5;
      tubeGroup.add(upperMesh);

      for (let rz = -span * 0.48; rz <= span * 0.48; rz += 2.6) {
        const rib = new THREE.Mesh(new THREE.TorusGeometry(r, 0.09, 8, 24, Math.PI), castIronMat);
        rib.rotation.y = Math.PI * 0.5;
        rib.position.set(0, 0, rz);
        tubeGroup.add(rib);
      }

      const trackbed = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.3, span), concreteMat);
      trackbed.position.set(0, -r * 0.55, 0);
      tubeGroup.add(trackbed);

      [-0.75, 0.75].forEach((rx) => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, span), steelCableMat);
        rail.position.set(rx, -r * 0.55 + 0.22, 0);
        tubeGroup.add(rail);
      });

      const tieMat = new THREE.MeshStandardMaterial({ color: 0x5a3825, roughness: 0.9 });
      for (let tz = -span * 0.48; tz <= span * 0.48; tz += 0.8) {
        const tie = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.09, 0.26), tieMat);
        tie.position.set(0, -r * 0.55 + 0.16, tz);
        tubeGroup.add(tie);
      }

      const thirdRail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, span), thirdRailCoverMat);
      thirdRail.position.set(1.1, -r * 0.55 + 0.24, 0);
      tubeGroup.add(thirdRail);

      for (let lz = -span * 0.42; lz <= span * 0.42; lz += 3.8) {
        const lampMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.85 });
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), lampMat);
        lamp.position.set(0, r * 0.75, lz);
        tubeGroup.add(lamp);
        lights.push(lamp);
      }

      // Stalled 2-car R160/R188 MTA Subway Train
      [-4.5, 4.8].forEach((carZ) => {
        const trainCar = new THREE.Group();
        trainCar.position.set(0, -r * 0.55 + 1.25, carZ);

        const carBody = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.8, 8.4), subwaySteelMat);
        carBody.castShadow = true;
        trainCar.add(carBody);

        const winMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 });
        const winStrip = new THREE.Mesh(new THREE.BoxGeometry(2.34, 0.6, 7.2), winMat);
        winStrip.position.y = 0.15;
        trainCar.add(winStrip);

        const stripeMat = new THREE.MeshBasicMaterial({ color: cfg.lineColor || 0x16a34a });
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.14, 8.2), stripeMat);
        stripe.position.y = -0.3;
        trainCar.add(stripe);

        const acPod1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.3, 1.8), concreteMat);
        acPod1.position.set(0, 1.02, -2.0);
        trainCar.add(acPod1);

        const acPod2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.3, 1.8), concreteMat);
        acPod2.position.set(0, 1.02, 2.0);
        trainCar.add(acPod2);

        const headLamp1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        headLamp1.position.set(-0.6, -0.2, -4.22);
        trainCar.add(headLamp1);

        const headLamp2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        headLamp2.position.set(0.6, -0.2, -4.22);
        trainCar.add(headLamp2);

        tubeGroup.add(trainCar);
      });
    }

    // Dynamic internal floodwater volume
    const floodWidth = cfg.isVehicular ? 7.6 : 4.2;
    const floodMesh = new THREE.Mesh(
      new THREE.BoxGeometry(floodWidth, 2.4, span * 0.98),
      tubeWaterMat.clone()
    );
    floodMesh.position.set(0, -1.3, 0);
    floodMesh.scale.set(1.0, 0.001, 1.0);
    floodMesh.visible = false;
    tubeGroup.add(floodMesh);

    // Concrete Shore Portal Headwalls at both banks
    [-span * 0.5, span * 0.5].forEach((pz) => {
      const portal = new THREE.Group();
      portal.position.set(0, 0, pz);

      const headwall = new THREE.Mesh(new THREE.BoxGeometry(r * 2.6, r * 2.2, 1.8), concreteMat);
      portal.add(headwall);

      const portalArch = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.85, r * 0.85, 2.0, 16, 1, false, 0, Math.PI), castIronMat);
      portalArch.rotation.x = Math.PI * 0.5;
      portal.add(portalArch);

      tubeGroup.add(portal);
    });

    // Shore Breach Foam Meshes
    const foamMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.85 });
    const foamBrooklyn = new THREE.Mesh(new THREE.SphereGeometry(2.4, 10, 8), foamMat);
    foamBrooklyn.position.set(0, -0.2, -span * 0.5);
    foamBrooklyn.scale.set(1.4, 0.6, 1.4);
    foamBrooklyn.visible = false;
    tubeGroup.add(foamBrooklyn);

    const foamManhattan = new THREE.Mesh(new THREE.SphereGeometry(2.4, 10, 8), foamMat);
    foamManhattan.position.set(0, -0.2, span * 0.5);
    foamManhattan.scale.set(1.4, 0.6, 1.4);
    foamManhattan.visible = false;
    tubeGroup.add(foamManhattan);

    // 3D Floating Billboard Badge
    const badgeTextures = createTubeBadgeTextures(cfg.name, cfg.bullets, cfg.desc);
    const spriteMat = new THREE.SpriteMaterial({
      map: badgeTextures.texDry,
      transparent: true,
      depthTest: false
    });
    const badgeSprite = new THREE.Sprite(spriteMat);
    badgeSprite.scale.set(15, 4.1, 1);
    badgeSprite.position.set(0, 11.5, 0);
    tubeGroup.add(badgeSprite);

    group.add(tubeGroup);

    return {
      id: cfg.id,
      uTrigger: cfg.uTrigger,
      tubeGroup,
      floodMesh,
      lights,
      foamManhattan,
      foamBrooklyn,
      badgeSprite,
      badgeTextures
    };
  }

  /**
   * Subterranean Cutaway Metro Station Vault (South Ferry / 1 Train)
   * Featuring white glazed subway tiles, blue mosaic trim, elevated passenger platforms,
   * turnstiles, docked 2-car subway train, descending stairwell with cascading floodwater,
   * and rising internal station inundation that submerges the tracks and platform.
   */
  function buildSubsurfaceMetroStationCutaway(fSub) {
    const stationGroup = new THREE.Group();
    const pos = fSub.pt.clone().addScaledVector(fSub.side, 19.5).addScaledVector(fSub.tangent, -4.5);
    stationGroup.position.set(pos.x, -1.2, pos.z);
    stationGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fSub.tangent);

    const sLen = 22.0;
    const sWid = 13.0;
    const sH = 5.6;

    const tileMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.2 });
    const mosaicBlueMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4 });
    const yellowEdgeMat = new THREE.MeshBasicMaterial({ color: 0xeab308 });

    const floor = new THREE.Mesh(new THREE.BoxGeometry(sWid, 0.4, sLen), concreteMat);
    floor.position.y = -sH * 0.5;
    stationGroup.add(floor);

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, sH, sLen), tileMat);
    backWall.position.set(-sWid * 0.5, 0, 0);
    stationGroup.add(backWall);

    const mosaicTrim = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.6, sLen * 0.92), mosaicBlueMat);
    mosaicTrim.position.set(-sWid * 0.5, 1.2, 0);
    stationGroup.add(mosaicTrim);

    const endWall1 = new THREE.Mesh(new THREE.BoxGeometry(sWid, sH, 0.5), tileMat);
    endWall1.position.set(0, 0, -sLen * 0.5);
    stationGroup.add(endWall1);

    const endWall2 = new THREE.Mesh(new THREE.BoxGeometry(sWid, sH, 0.5), tileMat);
    endWall2.position.set(0, 0, sLen * 0.5);
    stationGroup.add(endWall2);

    const platH = 1.3;
    const platW = 4.8;
    const platform = new THREE.Mesh(new THREE.BoxGeometry(platW, platH, sLen * 0.88), concreteMat);
    platform.position.set(0, -sH * 0.5 + platH * 0.5, 0);
    stationGroup.add(platform);

    [-platW * 0.5 + 0.1, platW * 0.5 - 0.1].forEach((px) => {
      const edgeStrip = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, sLen * 0.88), yellowEdgeMat);
      edgeStrip.position.set(px, -sH * 0.5 + platH + 0.03, 0);
      stationGroup.add(edgeStrip);
    });

    [-3.8, 3.8].forEach((tx) => {
      [-0.7, 0.7].forEach((rx) => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, sLen * 0.95), steelCableMat);
        rail.position.set(tx + rx, -sH * 0.5 + 0.2, 0);
        stationGroup.add(rail);
      });
      const tr = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.2, sLen * 0.95), thirdRailCoverMat);
      tr.position.set(tx + (tx > 0 ? 1.0 : -1.0), -sH * 0.5 + 0.25, 0);
      stationGroup.add(tr);
    });

    const columnMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5, metalness: 0.6 });
    for (let cz = -sLen * 0.35; cz <= sLen * 0.35; cz += 3.2) {
      [-platW * 0.38, platW * 0.38].forEach((cx) => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.25, sH, 0.25), columnMat);
        col.position.set(cx, 0, cz);
        stationGroup.add(col);
      });
    }

    for (let tn = 0; tn < 4; tn++) {
      const tst = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.9, 0.8), subwaySteelMat);
      tst.position.set(-1.2 + tn * 0.8, -sH * 0.5 + platH + 0.45, -sLen * 0.32);
      stationGroup.add(tst);
    }

    const trainGroup = new THREE.Group();
    trainGroup.position.set(3.8, -sH * 0.5 + 1.25, 0);
    const car1 = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.8, 8.5), subwaySteelMat);
    trainGroup.add(car1);
    const win1 = new THREE.Mesh(new THREE.BoxGeometry(2.34, 0.6, 7.2), new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.85 }));
    win1.position.y = 0.15;
    trainGroup.add(win1);
    const stripe1 = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.15, 8.2), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
    stripe1.position.y = -0.3;
    trainGroup.add(stripe1);
    stationGroup.add(trainGroup);

    const stairGroup = new THREE.Group();
    stairGroup.position.set(0, -sH * 0.5 + platH + 0.8, sLen * 0.38);
    const stairGeo = new THREE.BoxGeometry(2.6, 2.2, 4.2);
    const stairRamp = new THREE.Mesh(stairGeo, concreteMat);
    stairRamp.rotation.x = -0.42;
    stairGroup.add(stairRamp);
    stationGroup.add(stairGroup);

    const cascadeGeo = new THREE.PlaneGeometry(2.5, 4.4, 8, 8);
    const cascadeMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const stairCascade = new THREE.Mesh(cascadeGeo, cascadeMat);
    stairCascade.position.set(0, -sH * 0.5 + platH + 1.2, sLen * 0.38);
    stairCascade.rotation.x = Math.PI * 0.5 - 0.42;
    stairCascade.visible = false;
    stationGroup.add(stairCascade);

    const waterGeo = new THREE.BoxGeometry(sWid * 0.98, 3.4, sLen * 0.98);
    const stationWaterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.12,
      metalness: 0.3,
      transparent: true,
      opacity: 0.88,
      depthWrite: false
    });
    const stationWaterMesh = new THREE.Mesh(waterGeo, stationWaterMat);
    stationWaterMesh.position.set(0, -sH * 0.5 + 0.1, 0);
    stationWaterMesh.scale.set(1.0, 0.001, 1.0);
    stationWaterMesh.visible = false;
    stationGroup.add(stationWaterMesh);

    const alarmLight = new THREE.PointLight(0xef4444, 0.0, 25);
    alarmLight.position.set(0, sH * 0.4, 0);
    stationGroup.add(alarmLight);

    group.add(stationGroup);

    return {
      stationGroup,
      sH,
      waterMesh: stationWaterMesh,
      stairCascade,
      alarmLight
    };
  }

  // -------------------------------------------------------------------------
  // 1. THE NARROWS & VERRAZZANO-NARROWS SUSPENSION BRIDGE (u = 0.10)
  // -------------------------------------------------------------------------
  const fVz = getRiverFrame(0.10);
  const vzGroup = new THREE.Group();
  vzGroup.position.copy(fVz.pt);

  const vzBasis = new THREE.Matrix4().makeBasis(fVz.tangent, fVz.up, fVz.side);
  vzGroup.quaternion.setFromRotationMatrix(vzBasis);

  const vzSpan = 48.0;
  const vzTowerH = 36.0;
  const vzTowerZ = vzSpan * 0.40;
  const vzAnchorZ = vzSpan * 0.65;

  // Staten Island (-Z) & Brooklyn (+Z) Concrete Shore Anchorages
  [-vzAnchorZ, vzAnchorZ].forEach((aZ) => {
    const anchor = new THREE.Mesh(new THREE.BoxGeometry(9.0, 11.0, 10.0), concreteMat);
    anchor.position.set(0, 5.5, aZ);
    anchor.castShadow = true;
    vzGroup.add(anchor);

    const buttress = new THREE.Mesh(new THREE.BoxGeometry(10.0, 3.0, 4.0), concreteMat);
    buttress.position.set(0, 1.5, aZ + (aZ > 0 ? -4.0 : 4.0));
    vzGroup.add(buttress);
  });

  // Monumental Double-Legged Steel Towers
  [-vzTowerZ, vzTowerZ].forEach((tZ) => {
    const tower = new THREE.Group();
    tower.position.set(0, 0, tZ);

    // Deep water concrete pier caisson
    const caisson = new THREE.Mesh(new THREE.BoxGeometry(9.0, 6.5, 6.0), concreteMat);
    caisson.position.y = 2.5;
    tower.add(caisson);

    // Twin tapered steel tower legs
    [-2.6, 2.6].forEach((legX) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(2.4, vzTowerH, 2.6), steelGreenMat);
      leg.position.set(legX, vzTowerH * 0.5 + 4.5, 0);
      leg.castShadow = true;
      tower.add(leg);
    });

    // Deep structural portal cross struts
    [12.0, 22.0, 32.0, vzTowerH + 4.2].forEach((strutY) => {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.8, 2.4), steelGreenMat);
      strut.position.set(0, strutY, 0);
      tower.add(strut);
    });

    // Tower saddle caps for main suspension cables
    [-2.6, 2.6].forEach((saddleX) => {
      const saddle = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 2.8), steelCableMat);
      saddle.position.set(saddleX, vzTowerH + 5.2, 0);
      tower.add(saddle);
    });

    vzGroup.add(tower);
  });

  // Double-Deck Truss Roadway
  const vzDeckLen = vzSpan * 1.35;
  const vzDeck = new THREE.Mesh(new THREE.BoxGeometry(7.6, 2.2, vzDeckLen), steelGreenMat);
  vzDeck.position.set(0, 13.0, 0);
  vzDeck.castShadow = true;
  vzGroup.add(vzDeck);

  // Upper Roadway Tarmac with lane striping
  const vzRoad = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.2, vzDeckLen), tarmacMat);
  vzRoad.position.set(0, 14.15, 0);
  vzGroup.add(vzRoad);

  // Sweeping 3D Catenary Main Suspension Cables (North & South cables)
  [-2.6, 2.6].forEach((cableX) => {
    const curvePts = [];
    curvePts.push(new THREE.Vector3(cableX, 7.0, -vzAnchorZ));
    curvePts.push(new THREE.Vector3(cableX, 20.0, -vzTowerZ * 1.3));
    curvePts.push(new THREE.Vector3(cableX, vzTowerH + 5.2, -vzTowerZ));

    for (let k = 1; k < 12; k++) {
      const uK = k / 12;
      const zK = -vzTowerZ + uK * (2.0 * vzTowerZ);
      const normZ = zK / vzTowerZ;
      const yK = 14.5 + (vzTowerH + 5.2 - 14.5) * (normZ * normZ);
      curvePts.push(new THREE.Vector3(cableX, yK, zK));
    }

    curvePts.push(new THREE.Vector3(cableX, vzTowerH + 5.2, vzTowerZ));
    curvePts.push(new THREE.Vector3(cableX, 20.0, vzTowerZ * 1.3));
    curvePts.push(new THREE.Vector3(cableX, 7.0, vzAnchorZ));

    const catCurve = new THREE.CatmullRomCurve3(curvePts);
    const cableTube = new THREE.Mesh(new THREE.TubeGeometry(catCurve, 40, 0.22, 8, false), steelCableMat);
    vzGroup.add(cableTube);

    // Vertical Wire Rope Suspenders
    for (let sZ = -vzTowerZ + 2.0; sZ <= vzTowerZ - 2.0; sZ += 2.2) {
      const normZ = sZ / vzTowerZ;
      const yCable = 14.5 + (vzTowerH + 5.2 - 14.5) * (normZ * normZ);
      const suspH = Math.max(0.4, yCable - 14.15);
      const susp = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, suspH, 6), steelCableMat);
      susp.position.set(cableX, 14.15 + suspH * 0.5, sZ);
      vzGroup.add(susp);
    }
  });
  group.add(vzGroup);

  // Dynamic Collapsing Elements on Verrazzano Approach (u = 0.10)
  {
    const dotTruck = createDeliveryVan(0xf59e0b);
    const truckPos = fVz.pt.clone().addScaledVector(fVz.side, -14.0);
    truckPos.y = 14.4;
    dotTruck.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fVz.side);

    registerWipeable(dotTruck.group, 0.10, truckPos, fVz.tangent, fVz.side, {
      primaryMat: dotTruck.primaryMat,
      materials: dotTruck.materials,
      driftSpeed: 32.0,
      tumbleScale: 7.5,
      collapseTilt: 0.6,
      sinkScale: 0.25
    });
  }

  // -------------------------------------------------------------------------
  // 2. LOWER MANHATTAN SKYLINE, ONE WTC & BATTERY PARK (u = 0.48 - 0.54)
  // -------------------------------------------------------------------------
  const fMan = getRiverFrame(0.50);
  const manGroup = new THREE.Group();
  manGroup.position.copy(fMan.pt);

  // Flanking Granite Battery Park Seawall Promenade Sections
  const seawallSouth = new THREE.Mesh(new THREE.BoxGeometry(4.0, 3.2, 16.0), seawallGranite);
  seawallSouth.position.set(fMan.side.x * 12.0, 1.6, -18.0);
  seawallSouth.castShadow = true;
  manGroup.add(seawallSouth);

  const seawallNorth = new THREE.Mesh(new THREE.BoxGeometry(4.0, 3.2, 16.0), seawallGranite);
  seawallNorth.position.set(fMan.side.x * 12.0, 1.6, 18.0);
  seawallNorth.castShadow = true;
  manGroup.add(seawallNorth);

  // Dynamic Breached Granite Battery Park Seawall Segment that shears and collapses into harbor
  {
    const breachSeawall = createBatterySeawallBreachSegment(22.0);
    const swPos = fMan.pt.clone().addScaledVector(fMan.side, 11.5);
    swPos.y = getGroundY(swPos.x, swPos.z, 2.0);
    breachSeawall.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMan.tangent);

    registerWipeable(breachSeawall.group, 0.48, swPos, fMan.tangent, fMan.side, {
      primaryMat: breachSeawall.primaryMat,
      materials: breachSeawall.materials,
      driftSpeed: 22.0,
      tumbleScale: 4.5,
      collapseTilt: 0.55,
      sinkScale: 0.28,
      washSpeed: 26.0
    });
  }

  // Lush Battery Park Green Lawns
  const lawn = new THREE.Mesh(new THREE.BoxGeometry(14.0, 0.5, 52.0), new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.85 }));
  lawn.position.set(fMan.side.x * 19.5, 1.85, fMan.side.z * 19.5);
  manGroup.add(lawn);

  // Historic Castle Clinton Sandstone Fort in Battery Park
  const castleClinton = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 7.0, 3.2, 24), new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.85 }));
  castleClinton.position.set(fMan.side.x * 18.0, 2.5, -12.0);
  manGroup.add(castleClinton);

  // Staten Island Ferry Whitehall Terminal Slip & Moored Ferry Boat
  const ferrySlip = new THREE.Mesh(new THREE.BoxGeometry(8.0, 2.8, 12.0), concreteMat);
  ferrySlip.position.set(fMan.side.x * 11.0, 1.8, 22.0);
  manGroup.add(ferrySlip);

  const siFerry = new THREE.Mesh(new THREE.BoxGeometry(5.0, 3.5, 14.0), new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.4 }));
  siFerry.position.set(fMan.side.x * 7.5, 2.2, 22.0);
  siFerry.castShadow = true;
  manGroup.add(siFerry);

  // -------------------------------------------------------------------------
  // FINANCIAL DISTRICT / WALL STREET WATERFRONT DYNAMIC COLLAPSING STRUCTURES (u = 0.49 - 0.52)
  // -------------------------------------------------------------------------
  // 1. Wall Street Neoclassical Bank / Stock Exchange Facade (u = 0.49)
  {
    const bank = createWallStreetBank();
    const bankPos = fMan.pt.clone().addScaledVector(fMan.side, 15.2).addScaledVector(fMan.tangent, 5.0);
    bankPos.y = getGroundY(bankPos.x, bankPos.z, 2.8);
    bank.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMan.tangent);
    bank.group.rotation.y += 0.12;

    registerWipeable(bank.group, 0.49, bankPos, fMan.tangent, fMan.side, {
      primaryMat: bank.primaryMat,
      materials: bank.materials,
      driftSpeed: 20.0,
      tumbleScale: 3.8,
      collapseTilt: 0.52,
      sinkScale: 0.28,
      washSpeed: 26.0,
      maxProg: 0.10
    });
  }

  // 2. Historic Wall Street & Broad Street Corner Signpost (u = 0.50)
  {
    const signpost = createWallStreetSignpost();
    const signPos = fMan.pt.clone().addScaledVector(fMan.side, 14.5).addScaledVector(fMan.tangent, 1.8);
    signPos.y = getGroundY(signPos.x, signPos.z, 2.8);
    signpost.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMan.tangent);

    registerWipeable(signpost.group, 0.50, signPos, fMan.tangent, fMan.side, {
      primaryMat: signpost.primaryMat,
      materials: signpost.materials,
      driftSpeed: 29.0,
      tumbleScale: 7.5
    });
  }

  // 3. Bowling Green Charging Bull Bronze Monument (u = 0.50)
  {
    const bull = createChargingBullMonument();
    const bullPos = fMan.pt.clone().addScaledVector(fMan.side, 16.5).addScaledVector(fMan.tangent, -2.5);
    bullPos.y = getGroundY(bullPos.x, bullPos.z, 2.8);
    bull.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMan.tangent);

    registerWipeable(bull.group, 0.50, bullPos, fMan.tangent, fMan.side, {
      primaryMat: bull.primaryMat,
      materials: bull.materials,
      driftSpeed: 22.0,
      tumbleScale: 4.5,
      collapseTilt: 0.48,
      sinkScale: 0.25
    });
  }

  // 4. Financial District Modern Reflective Glass High-Rise / Trading Pavilion (u = 0.51)
  {
    const glassPav = createFinancialGlassPavilion();
    const pavPos = fMan.pt.clone().addScaledVector(fMan.side, 17.5).addScaledVector(fMan.tangent, 15.0);
    pavPos.y = getGroundY(pavPos.x, pavPos.z, 2.8);
    glassPav.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMan.tangent);

    registerWipeable(glassPav.group, 0.51, pavPos, fMan.tangent, fMan.side, {
      primaryMat: glassPav.primaryMat,
      materials: glassPav.materials,
      driftSpeed: 22.0,
      tumbleScale: 4.0,
      collapseTilt: 0.56,
      sinkScale: 0.28,
      washSpeed: 25.0,
      maxProg: 0.09
    });
  }

  // 5. Bowling Green Historic Beaux-Arts Subway Station Control House (4/5 Trains) (u = 0.50)
  {
    const bgKiosk = createBowlingGreenSubwayKiosk();
    const bgPos = fMan.pt.clone().addScaledVector(fMan.side, 20.0).addScaledVector(fMan.tangent, -5.5);
    bgPos.y = getGroundY(bgPos.x, bgPos.z, 2.8);
    bgKiosk.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMan.tangent);

    registerWipeable(bgKiosk.group, 0.50, bgPos, fMan.tangent, fMan.side, {
      primaryMat: bgKiosk.primaryMat,
      materials: bgKiosk.materials,
      driftSpeed: 21.0,
      tumbleScale: 4.0,
      collapseTilt: 0.46,
      sinkScale: 0.28,
      washSpeed: 25.0
    });

    // Bowling Green Sidewalk Subway Ventilation Grate
    const bgGrate = createSidewalkSubwayGrate(2.4, 5.2);
    const bgGratePos = fMan.pt.clone().addScaledVector(fMan.side, 18.0).addScaledVector(fMan.tangent, -8.5);
    bgGratePos.y = getGroundY(bgGratePos.x, bgGratePos.z, 2.8);
    bgGrate.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMan.tangent);

    registerWipeable(bgGrate.group, 0.495, bgGratePos, fMan.tangent, fMan.side, {
      primaryMat: bgGrate.primaryMat,
      materials: bgGrate.materials,
      driftSpeed: 25.0,
      tumbleScale: 5.0
    });
  }

  // 6. Wall Street & Broad Street Subway Entrance Portal (2/3/4/5 Trains) (u = 0.51)
  {
    const wsSubway = createNYCSubwayEntrance();
    const wsSubPos = fMan.pt.clone().addScaledVector(fMan.side, 14.8).addScaledVector(fMan.tangent, 9.5);
    wsSubPos.y = getGroundY(wsSubPos.x, wsSubPos.z, 2.8);
    wsSubway.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMan.tangent);

    registerWipeable(wsSubway.group, 0.51, wsSubPos, fMan.tangent, fMan.side, {
      primaryMat: wsSubway.primaryMat,
      materials: wsSubway.materials,
      driftSpeed: 22.0,
      tumbleScale: 4.2,
      collapseTilt: 0.48,
      sinkScale: 0.30,
      washSpeed: 27.0
    });

    // Wall Street Sidewalk Subway Ventilation Grate
    const wsGrate = createSidewalkSubwayGrate(2.2, 4.6);
    const wsGratePos = fMan.pt.clone().addScaledVector(fMan.side, 13.2).addScaledVector(fMan.tangent, 12.5);
    wsGratePos.y = getGroundY(wsGratePos.x, wsGratePos.z, 2.8);
    wsGrate.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMan.tangent);

    registerWipeable(wsGrate.group, 0.51, wsGratePos, fMan.tangent, fMan.side, {
      primaryMat: wsGrate.primaryMat,
      materials: wsGrate.materials,
      driftSpeed: 26.0,
      tumbleScale: 5.5
    });
  }

  // 7. Paved Asphalt Road Grid (West Street / Battery Place & Broad Street)
  {
    // Main North-South Coastal Boulevard with double-yellow center line & zebra crosswalks
    const road1 = createPavedRoadGrid(9.5, 52.0, true);
    const r1Pos = fMan.pt.clone().addScaledVector(fMan.side, 21.5);
    r1Pos.y = getGroundY(r1Pos.x, r1Pos.z, 2.75);
    road1.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMan.tangent);
    manGroup.add(road1.group);

    // East-West Connecting Avenue toward Wall Street
    const road2 = createPavedRoadGrid(8.5, 36.0, true);
    const r2Pos = fMan.pt.clone().addScaledVector(fMan.side, 25.5).addScaledVector(fMan.tangent, 7.5);
    r2Pos.y = getGroundY(r2Pos.x, r2Pos.z, 2.75);
    road2.group.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), fMan.tangent);
    manGroup.add(road2.group);
  }

  // 8. Municipal Infrastructure: NYC Streetlamps, Traffic Signals, Hydrants & Benches
  {
    // Classic Cast-Iron Double-Luminaire NYC Streetlamps along sidewalks
    [-18.0, -6.0, 6.0, 18.0].forEach((lampZ) => {
      const lamp = createNYCStreetLamp();
      const lPos = fMan.pt.clone().addScaledVector(fMan.side, 16.5).addScaledVector(fMan.tangent, lampZ);
      lPos.y = getGroundY(lPos.x, lPos.z, 2.8);
      lamp.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMan.tangent);
      manGroup.add(lamp.group);
    });

    // Traffic Signal Mast Arms at intersections
    [-14.0, 14.0].forEach((sigZ) => {
      const signal = createTrafficSignal();
      const sPos = fMan.pt.clone().addScaledVector(fMan.side, 26.5).addScaledVector(fMan.tangent, sigZ);
      sPos.y = getGroundY(sPos.x, sPos.z, 2.8);
      signal.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMan.tangent);
      manGroup.add(signal.group);
    });

    // Classic Red/Silver NYC Fire Hydrants on curb corners
    [-12.0, 12.0].forEach((hydZ) => {
      const hyd = createNYCFireHydrant();
      const hPos = fMan.pt.clone().addScaledVector(fMan.side, 17.0).addScaledVector(fMan.tangent, hydZ);
      hPos.y = getGroundY(hPos.x, hPos.z, 2.8);
      hyd.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMan.tangent);
      manGroup.add(hyd.group);
    });

    // World's Fair Cast-Iron & Wood Park Benches along Battery Park esplanade
    [-15.0, -5.0, 5.0, 15.0].forEach((benchZ) => {
      const bench = createParkBench();
      const bPos = fMan.pt.clone().addScaledVector(fMan.side, 13.5).addScaledVector(fMan.tangent, benchZ);
      bPos.y = getGroundY(bPos.x, bPos.z, 2.4);
      bench.group.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), fMan.side);
      manGroup.add(bench.group);
    });
  }

  // LOWER MANHATTAN SKYSCRAPER SKYLINE (Accurately offset along bank normal)
  // Featuring One World Trade Center, Art Deco classic towers & modern glass high-rises
  const towerDefs = [
    // ONE WORLD TRADE CENTER (Freedom Tower): 68m tall soaring faceted glass spire
    { offSide: 28.0, offTan: -6.0, w: 11, d: 11, h: 68, mat: glassTowerMat1, is1WTC: true },
    // 3 World Trade Center: Modern reflective tower
    { offSide: 38.0, offTan: -12.0, w: 9, d: 9, h: 48, mat: glassTowerMat2, spire: true },
    // 40 Wall Street: Classic Art Deco limestone bank tower with green copper pyramidal roof
    { offSide: 26.0, offTan: 8.0,  w: 9, d: 9, h: 42, mat: stoneTowerMat, isArtDeco: true },
    // 28 Liberty / Chase Manhattan Plaza: Stainless steel & glass skyscraper
    { offSide: 36.0, offTan: 6.0,  w: 10, d: 10, h: 44, mat: glassTowerMat1, spire: false },
    // Woolworth Building style gothic setback tower
    { offSide: 44.0, offTan: 2.0,  w: 8, d: 8, h: 38, mat: stoneTowerMat, isArtDeco: true },
    // Standard Oil / Broadway classic stone tower
    { offSide: 26.0, offTan: 18.0, w: 8, d: 8, h: 32, mat: stoneTowerMat, isArtDeco: false },
    // 7 World Trade Center modern glass slab
    { offSide: 46.0, offTan: -20.0, w: 10, d: 8, h: 40, mat: glassTowerMat2, spire: true }
  ];

  towerDefs.forEach((t) => {
    const towerGroup = new THREE.Group();
    const pos = fMan.pt.clone().addScaledVector(fMan.side, t.offSide).addScaledVector(fMan.tangent, t.offTan);
    pos.y = getGroundY(pos.x, pos.z, 2.8);
    towerGroup.position.copy(pos);

    // Main Tower Body
    const bldg = new THREE.Mesh(new THREE.BoxGeometry(t.w, t.h, t.d), t.mat);
    bldg.position.y = t.h * 0.5;
    bldg.castShadow = true;
    bldg.receiveShadow = true;
    towerGroup.add(bldg);

    if (t.is1WTC) {
      // 1 WTC Chamfered Triangular Facets (Octagonal transition crown)
      const chamferCrown = new THREE.Mesh(new THREE.CylinderGeometry(t.w * 0.35, t.w * 0.5, 6.0, 8), glassTowerMat1);
      chamferCrown.position.y = t.h + 3.0;
      towerGroup.add(chamferCrown);

      // Observation Ring
      const obsRing = new THREE.Mesh(new THREE.TorusGeometry(t.w * 0.32, 0.4, 8, 24), steelCableMat);
      obsRing.rotation.x = Math.PI / 2;
      obsRing.position.y = t.h + 6.2;
      towerGroup.add(obsRing);

      // 18m Communications Spire
      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.7, 18.0, 8), steelCableMat);
      spire.position.y = t.h + 15.0;
      towerGroup.add(spire);

      // Spire flashing aviation beacon
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      beacon.position.y = t.h + 24.2;
      towerGroup.add(beacon);
    } else if (t.isArtDeco) {
      // Tiered setbacks with green copper pyramidal roof
      const setback = new THREE.Mesh(new THREE.BoxGeometry(t.w * 0.75, 5.0, t.d * 0.75), stoneTowerMat);
      setback.position.y = t.h + 2.5;
      towerGroup.add(setback);

      const pyramidRoof = new THREE.Mesh(new THREE.ConeGeometry(t.w * 0.6, 7.0, 4), copperRoofMat);
      pyramidRoof.position.y = t.h + 8.5;
      pyramidRoof.rotation.y = Math.PI * 0.25;
      towerGroup.add(pyramidRoof);

      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.4, 6.0, 6), steelCableMat);
      spire.position.y = t.h + 15.0;
      towerGroup.add(spire);
    } else {
      const crown = new THREE.Mesh(new THREE.BoxGeometry(t.w * 0.8, 3.5, t.d * 0.8), t.mat);
      crown.position.y = t.h + 1.75;
      towerGroup.add(crown);
      if (t.spire) {
        const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.5, 9.0, 8), steelCableMat);
        spire.position.y = t.h + 8.0;
        towerGroup.add(spire);
      }
    }
    group.add(towerGroup);
  });
  group.add(manGroup);

  // -------------------------------------------------------------------------
  // ZONE 3: BATTERY PARK COLLAPSING PIERS, KIOSKS & CARS (u = 0.44 - 0.54)
  // -------------------------------------------------------------------------
  // Harbor Timber Piers along Battery waterfront
  for (let p = 0; p < 4; p++) {
    const uP = 0.46 + p * 0.025;
    const fP = getRiverFrame(uP);
    const pier = createTimberPier(14.0, 4.2);
    const pos = fP.pt.clone().addScaledVector(fP.side, 7.5).addScaledVector(fP.tangent, -3.0 + p * 3.5);
    pos.y = getGroundY(pos.x, pos.z, 2.0);
    pier.group.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), fP.side);

    registerWipeable(pier.group, uP, pos, fP.tangent, fP.side, {
      primaryMat: pier.primaryMat,
      materials: pier.materials,
      driftSpeed: 24.0,
      tumbleScale: 5.0,
      collapseTilt: 0.45
    });
  }

  // Maritime ticket kiosks & harbor sheds
  for (let k = 0; k < 3; k++) {
    const uK = 0.47 + k * 0.03;
    const fK = getRiverFrame(uK);
    const kiosk = createMaritimeKiosk(3.4, 2.8, 3.8, (k % 2 === 0 ? 0x0284c7 : 0xd97706));
    const pos = fK.pt.clone().addScaledVector(fK.side, 13.5).addScaledVector(fK.tangent, -4.0 + k * 4.0);
    pos.y = getGroundY(pos.x, pos.z, 2.6);
    kiosk.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fK.tangent);

    registerWipeable(kiosk.group, uK, pos, fK.tangent, fK.side, {
      primaryMat: kiosk.primaryMat,
      materials: kiosk.materials,
      driftSpeed: 26.0,
      tumbleScale: 6.5
    });
  }

  // Yellow Cabs on West Street & Battery Place
  [-8, 2, 12].forEach((cz, idx) => {
    const cab = createYellowCab();
    const pos = fMan.pt.clone().addScaledVector(fMan.side, 21.0).addScaledVector(fMan.tangent, cz);
    pos.y = getGroundY(pos.x, pos.z, 2.8);
    cab.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMan.tangent);
    cab.group.rotation.y += (idx % 2 === 0 ? 0.3 : -0.2);

    registerWipeable(cab.group, 0.48 + idx * 0.02, pos, fMan.tangent, fMan.side, {
      primaryMat: cab.primaryMat,
      materials: cab.materials,
      driftSpeed: 30.0,
      tumbleScale: 8.0,
      sinkScale: 0.22
    });
  });

  // NYPD Cruiser drifting near Bowling Green
  {
    const copCar = createNYPDCruiser();
    const pos = fMan.pt.clone().addScaledVector(fMan.side, 23.5).addScaledVector(fMan.tangent, 5.0);
    pos.y = getGroundY(pos.x, pos.z, 2.8);
    copCar.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMan.tangent);
    copCar.group.rotation.y = -0.5;

    registerWipeable(copCar.group, 0.50, pos, fMan.tangent, fMan.side, {
      primaryMat: copCar.primaryMat,
      materials: copCar.materials,
      driftSpeed: 31.0,
      tumbleScale: 8.5
    });
  }

  // -------------------------------------------------------------------------
  // ZONE 4: SOUTH FERRY SUBWAY PORTAL & TRANSIT INUNDATION (u = 0.54)
  // -------------------------------------------------------------------------
  const fSub = getRiverFrame(0.54);

  // Authentic NYC Subway Station Entrance (South Ferry / 1 Train)
  // Featuring ornate cast-iron hood, illuminated MTA green/red globes,
  // station sign, descending tiled stairs, and cascading flood torrent.
  {
    const subPortal = createNYCSubwayEntrance();
    const pos = fSub.pt.clone().addScaledVector(fSub.side, 13.5).addScaledVector(fSub.tangent, -3.5);
    pos.y = getGroundY(pos.x, pos.z, 2.7);
    subPortal.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fSub.tangent);
    subPortal.group.rotation.y += 0.2;

    registerWipeable(subPortal.group, 0.54, pos, fSub.tangent, fSub.side, {
      primaryMat: subPortal.primaryMat,
      materials: subPortal.materials,
      driftSpeed: 20.0,
      tumbleScale: 4.2,
      collapseTilt: 0.45,
      sinkScale: 0.32,
      washSpeed: 28.0,
      maxProg: 0.08
    });
  }

  // South Ferry Sidewalk Subway Ventilation Grate
  {
    const sfGrate = createSidewalkSubwayGrate(2.4, 4.8);
    const sfGratePos = fSub.pt.clone().addScaledVector(fSub.side, 15.5).addScaledVector(fSub.tangent, -6.5);
    sfGratePos.y = getGroundY(sfGratePos.x, sfGratePos.z, 2.7);
    sfGrate.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fSub.tangent);

    registerWipeable(sfGrate.group, 0.535, sfGratePos, fSub.tangent, fSub.side, {
      primaryMat: sfGrate.primaryMat,
      materials: sfGrate.materials,
      driftSpeed: 28.0,
      tumbleScale: 6.0
    });
  }

  // Sandbag protective ring blowing out under hydrostatic head
  for (let s = 0; s < 4; s++) {
    const bund = createSubwaySandbagBund(3.8);
    const pos = fSub.pt.clone().addScaledVector(fSub.side, 12.8 + (s % 2) * 1.8).addScaledVector(fSub.tangent, -5.5 + s * 1.5);
    pos.y = getGroundY(pos.x, pos.z, 2.7);
    bund.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fSub.tangent);

    registerWipeable(bund.group, 0.535 + s * 0.008, pos, fSub.tangent, fSub.side, {
      primaryMat: bund.primaryMat,
      materials: bund.materials,
      driftSpeed: 28.0,
      tumbleScale: 5.5,
      sinkScale: 0.22,
      washSpeed: 35.0
    });
  }

  // Delivery van caught in morning rush hour
  {
    const van = createDeliveryVan(0x0284c7);
    const pos = fSub.pt.clone().addScaledVector(fSub.side, 18.5).addScaledVector(fSub.tangent, 1.5);
    pos.y = getGroundY(pos.x, pos.z, 2.8);
    van.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fSub.tangent);

    registerWipeable(van.group, 0.55, pos, fSub.tangent, fSub.side, {
      primaryMat: van.primaryMat,
      materials: van.materials,
      driftSpeed: 28.0,
      tumbleScale: 7.0
    });
  }

  // -------------------------------------------------------------------------
  // SUBTERRANEAN METRO STATION & 7 UNDER-RIVER TRANSIT TUBES
  // -------------------------------------------------------------------------
  // Subsurface Cutaway Metro Station Vault at South Ferry (u = 0.54)
  metroStation = buildSubsurfaceMetroStationCutaway(fSub);

  // The 7 Historical Under-River Transit Tubes Crossing Upper NY Bay & East River
  const tubeConfigs = [
    {
      id: 'battery_tunnel',
      name: 'Hugh L. Carey (Battery) Tunnel',
      bullets: 'VEHICULAR',
      desc: 'Twin Road Tubes • 86M Gal Inundation',
      u: 0.50,
      uTrigger: 0.50,
      isVehicular: true,
      lineColor: 0x0284c7,
      tubeSpan: 36.0,
      radius: 2.5
    },
    {
      id: 'joralemon_tube',
      name: 'Joralemon Street Tube',
      bullets: '(4)(5)',
      desc: '4/5 Subway • 1908 Historic River Crossing',
      u: 0.51,
      uTrigger: 0.51,
      isVehicular: false,
      lineColor: 0x16a34a,
      tubeSpan: 34.0,
      radius: 2.4
    },
    {
      id: 'clark_tube',
      name: 'Clark Street Tube',
      bullets: '(2)(3)',
      desc: '2/3 Subway • Clark St / William St Bore',
      u: 0.525,
      uTrigger: 0.525,
      isVehicular: false,
      lineColor: 0xdc2626,
      tubeSpan: 34.0,
      radius: 2.4
    },
    {
      id: 'south_ferry_tube',
      name: 'South Ferry Loop Tube',
      bullets: '(1)',
      desc: '1 Subway • 14.5M Gal Terminal Flooding',
      u: 0.54,
      uTrigger: 0.54,
      isVehicular: false,
      lineColor: 0xdc2626,
      tubeSpan: 32.0,
      radius: 2.4
    },
    {
      id: 'montague_tube',
      name: 'Montague Street Tube',
      bullets: '(N)(R)',
      desc: 'N/R Subway • 27M Gal Saltwater Breach',
      u: 0.57,
      uTrigger: 0.57,
      isVehicular: false,
      lineColor: 0xca8a04,
      tubeSpan: 35.0,
      radius: 2.4
    },
    {
      id: 'cranberry_tube',
      name: 'Cranberry Street Tube',
      bullets: '(A)(C)',
      desc: 'A/C Subway • Deep Rock Bore Inundation',
      u: 0.66,
      uTrigger: 0.66,
      isVehicular: false,
      lineColor: 0x2563eb,
      tubeSpan: 35.0,
      radius: 2.4
    },
    {
      id: 'rutgers_tube',
      name: 'Rutgers Street Tube',
      bullets: '(F)',
      desc: 'F Subway • Lower East Side River Crossing',
      u: 0.71,
      uTrigger: 0.71,
      isVehicular: false,
      lineColor: 0xea580c,
      tubeSpan: 35.0,
      radius: 2.4
    }
  ];

  tubeConfigs.forEach((cfg) => {
    tubesList.push(buildUnderRiverSubwayTube(cfg));
  });

  // -------------------------------------------------------------------------
  // ZONE 5: SOUTH STREET SEAPORT WATERFRONT BRICK LOFTS (u = 0.56 - 0.62)
  // -------------------------------------------------------------------------
  const brickColors = [0x991b1b, 0x854d0e, 0x7f1d1d, 0x713f12, 0x9a3412];
  for (let b = 0; b < 8; b++) {
    const uBldg = 0.56 + b * 0.012;
    const fBldg = getRiverFrame(uBldg);
    const bldg = createWaterfrontBrickBuilding(
      7.5 + (b % 3) * 0.6,
      12.0 + (b % 4) * 1.8,
      7.0 + (b % 2) * 0.5,
      brickColors[b % brickColors.length]
    );
    const pos = fBldg.pt.clone().addScaledVector(fBldg.side, 16.0 + (b % 2) * 2.5);
    pos.y = getGroundY(pos.x, pos.z, 2.6);
    bldg.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fBldg.tangent);
    bldg.group.rotation.y += (b * 0.3);

    registerWipeable(bldg.group, uBldg, pos, fBldg.tangent, fBldg.side, {
      primaryMat: bldg.primaryMat,
      materials: bldg.materials,
      driftSpeed: 25.0,
      tumbleScale: 5.5,
      collapseTilt: (b % 2 === 0 ? 0.5 : -0.5)
    });
  }

  // -------------------------------------------------------------------------
  // 4. FDR DRIVE & ESCR FLOODGATES (u = 0.62)
  // -------------------------------------------------------------------------
  const fFDR = getRiverFrame(0.62);
  const fdrGroup = new THREE.Group();
  fdrGroup.position.copy(fFDR.pt);

  const highwayLen = 38.0;
  const highway = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.8, highwayLen), tarmacMat);
  highway.position.set(fFDR.side.x * 14.0, 2.8, 0);
  highway.castShadow = true;
  fdrGroup.add(highway);

  const median = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, highwayLen), concreteMat);
  median.position.set(fFDR.side.x * 14.0, 3.5, 0);
  fdrGroup.add(median);

  const escrBerm = new THREE.Mesh(new THREE.BoxGeometry(3.5, 4.0, highwayLen), concreteMat);
  escrBerm.position.set(fFDR.side.x * 10.0, 2.2, 0);
  fdrGroup.add(escrBerm);
  group.add(fdrGroup);

  // ESCR Sliding Roller Gates (Red steel flood barriers)
  [-8.0, 8.0].forEach((gZ, gIdx) => {
    const gateMesh = new THREE.Mesh(new THREE.BoxGeometry(1.0, 5.0, 7.5), escrSteelMat);
    const pos = fFDR.pt.clone().addScaledVector(fFDR.side, 10.0).addScaledVector(fFDR.tangent, gZ);
    pos.y = getGroundY(pos.x, pos.z, 2.8) + 2.5;
    gateMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fFDR.tangent);

    registerWipeable(gateMesh, 0.62 + gIdx * 0.015, pos, fFDR.tangent, fFDR.side, {
      primaryMat: escrSteelMat,
      driftSpeed: 24.0,
      tumbleScale: 5.0,
      collapseTilt: 0.55
    });
  });

  // -------------------------------------------------------------------------
  // 5. HISTORIC BROOKLYN BRIDGE & DUMBO (u = 0.74)
  // -------------------------------------------------------------------------
  const fBr = getRiverFrame(0.74);
  const brGroup = new THREE.Group();
  brGroup.position.copy(fBr.pt);

  const brBasis = new THREE.Matrix4().makeBasis(fBr.tangent, fBr.up, fBr.side);
  brGroup.quaternion.setFromRotationMatrix(brBasis);

  const brSpan = 44.0;
  const brTowerH = 34.0;
  const brTowerZ = brSpan * 0.40;
  const brAnchorZ = brSpan * 0.68;

  // Manhattan (-Z) & Brooklyn (+Z) Massive Stepped Granite Anchorages
  [-brAnchorZ, brAnchorZ].forEach((aZ) => {
    const anchorage = new THREE.Group();
    anchorage.position.set(0, 0, aZ);

    const baseBlock = new THREE.Mesh(new THREE.BoxGeometry(9.5, 10.0, 9.5), gothicStoneMat);
    baseBlock.position.y = 5.0;
    baseBlock.castShadow = true;
    anchorage.add(baseBlock);

    const cornice = new THREE.Mesh(new THREE.BoxGeometry(10.2, 1.2, 10.2), gothicStoneMat);
    cornice.position.y = 10.6;
    anchorage.add(cornice);

    const parapet = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.8, 9.2), gothicStoneMat);
    parapet.position.y = 11.6;
    anchorage.add(parapet);

    brGroup.add(anchorage);
  });

  // Twin Neo-Gothic Granite Arch Suspension Towers
  [-brTowerZ, brTowerZ].forEach((tZ) => {
    const tower = new THREE.Group();
    tower.position.set(0, 0, tZ);

    // Submerged granite caisson foundation
    const caisson = new THREE.Mesh(new THREE.BoxGeometry(8.5, 6.0, 5.5), gothicStoneMat);
    caisson.position.y = 2.5;
    tower.add(caisson);

    // Triple Arch Pillars (Left, Center, Right) creating twin pointed gothic arches
    [-2.6, 0, 2.6].forEach((pX) => {
      const archPillar = new THREE.Mesh(new THREE.BoxGeometry(1.9, brTowerH, 2.4), gothicStoneMat);
      archPillar.position.set(pX, brTowerH * 0.5 + 4.0, 0);
      archPillar.castShadow = true;
      tower.add(archPillar);
    });

    // Pointed Gothic Arch Portal Tops
    [-1.3, 1.3].forEach((aX) => {
      const archTop = new THREE.Mesh(new THREE.BoxGeometry(2.1, 3.2, 2.4), gothicStoneMat);
      archTop.position.set(aX, brTowerH + 2.8, 0);
      tower.add(archTop);
    });

    // Lower tower saddle base
    const saddleBase = new THREE.Mesh(new THREE.BoxGeometry(7.6, 1.4, 3.0), gothicStoneMat);
    saddleBase.position.set(0, brTowerH + 3.8, 0);
    tower.add(saddleBase);

    brGroup.add(tower);
  });

  const brQuat = new THREE.Quaternion().setFromRotationMatrix(brBasis);

  // Tower Arch Portal Keystones & Decorative Cornices (uTrigger = 0.743, 0.745)
  // Fracture and topple into the East River when the central span collapses
  [-brTowerZ, brTowerZ].forEach((tZ, idx) => {
    const crown = new THREE.Mesh(new THREE.BoxGeometry(7.8, 2.2, 3.2), gothicStoneMat.clone());
    const pos = fBr.pt.clone().addScaledVector(fBr.side, tZ).addScaledVector(fBr.up, brTowerH + 4.8);
    crown.quaternion.copy(brQuat);
    registerWipeable(crown, 0.743 + idx * 0.002, pos, fBr.tangent, fBr.side, {
      primaryMat: crown.material,
      collapseTilt: idx === 0 ? 0.58 : -0.58,
      tumbleScale: 6.5,
      sinkScale: 0.35,
      driftSpeed: 24.0
    });
  });

  // APPROACH ROADWAY DECKS & BOARDWALKS (Rooted to shores & anchorages in brGroup)
  const appLen = brAnchorZ - brTowerZ; // 12.32m
  [-1, 1].forEach((sign) => {
    const centerZ = sign * (brTowerZ + appLen * 0.5);

    const appDeck = new THREE.Mesh(new THREE.BoxGeometry(7.4, 1.2, appLen), steelGreenMat);
    appDeck.position.set(0, 12.0, centerZ);
    appDeck.castShadow = true;
    brGroup.add(appDeck);

    const appBoardwalk = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, appLen), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 }));
    appBoardwalk.position.set(0, 13.0, centerZ);
    brGroup.add(appBoardwalk);

    [-1.2, 1.2].forEach((rX) => {
      const handrail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, appLen), new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 }));
      handrail.position.set(rX, 13.55, centerZ);
      brGroup.add(handrail);
    });
  });

  // SHORE SUSPENSION CABLES & STAY RAYS (Anchorage to Tower in brGroup)
  const cableXPositions = [-3.0, -1.8, 1.8, 3.0];
  cableXPositions.forEach((cableX) => {
    // Manhattan Shore Cable: -brAnchorZ to -brTowerZ
    const ptsMan = [];
    ptsMan.push(new THREE.Vector3(cableX, 6.5, -brAnchorZ));
    ptsMan.push(new THREE.Vector3(cableX, 19.0, -brTowerZ * 1.3));
    ptsMan.push(new THREE.Vector3(cableX, brTowerH + 5.2, -brTowerZ));
    const catMan = new THREE.CatmullRomCurve3(ptsMan);
    brGroup.add(new THREE.Mesh(new THREE.TubeGeometry(catMan, 24, 0.16, 8, false), steelCableMat));

    // Brooklyn Shore Cable: brTowerZ to brAnchorZ
    const ptsBrk = [];
    ptsBrk.push(new THREE.Vector3(cableX, brTowerH + 5.2, brTowerZ));
    ptsBrk.push(new THREE.Vector3(cableX, 19.0, brTowerZ * 1.3));
    ptsBrk.push(new THREE.Vector3(cableX, 6.5, brAnchorZ));
    const catBrk = new THREE.CatmullRomCurve3(ptsBrk);
    brGroup.add(new THREE.Mesh(new THREE.TubeGeometry(catBrk, 24, 0.16, 8, false), steelCableMat));

    // Shore approach diagonal stay cables
    [-brTowerZ, brTowerZ].forEach((tZ) => {
      const saddlePos = new THREE.Vector3(cableX, brTowerH + 5.0, tZ);
      [-22.0, -25.0, 22.0, 25.0].forEach((dZ) => {
        if ((tZ < 0 && dZ < tZ) || (tZ > 0 && dZ > tZ)) {
          const deckPos = new THREE.Vector3(cableX, 12.8, dZ);
          const stayLen = saddlePos.distanceTo(deckPos);
          const stay = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, stayLen, 4), steelCableMat);
          stay.position.copy(saddlePos).lerp(deckPos, 0.5);
          stay.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), deckPos.clone().sub(saddlePos).normalize());
          brGroup.add(stay);
        }
      });
    });
  });

  group.add(brGroup);

  // -------------------------------------------------------------------------
  // CATASTROPHIC BROOKLYN BRIDGE COLLAPSE (u = 0.74)
  // Dynamic Center Roadway Spans, Boardwalks, Snapped Cables, & Stalled Vehicles
  // -------------------------------------------------------------------------
  const centerSpanLen = brTowerZ; // 17.6m for each half-span

  // 1. Manhattan Center Suspended Span Half (Z in [-17.6, 0])
  {
    const centerSpanMan = new THREE.Group();
    const manPos = fBr.pt.clone().addScaledVector(fBr.side, -centerSpanLen * 0.5).addScaledVector(fBr.up, 12.0);
    centerSpanMan.quaternion.copy(brQuat);

    const deckMatMan = steelGreenMat.clone();
    const bdwMatMan = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const cableMatMan = steelCableMat.clone();
    const trussMatMan = steelGreenMat.clone();
    const matsMan = [deckMatMan, bdwMatMan, cableMatMan, trussMatMan];

    // Double Roadway Deck Half
    const deck = new THREE.Mesh(new THREE.BoxGeometry(7.4, 1.2, centerSpanLen), deckMatMan);
    deck.castShadow = true;
    centerSpanMan.add(deck);

    // Stiffening Steel Trusses
    [-3.6, 3.6].forEach((tx) => {
      const truss = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.6, centerSpanLen), trussMatMan);
      truss.position.set(tx, 0.6, 0);
      centerSpanMan.add(truss);
    });

    // Elevated Central Pedestrian Timber Boardwalk
    const bdw = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, centerSpanLen), bdwMatMan);
    bdw.position.set(0, 1.0, 0);
    centerSpanMan.add(bdw);

    [-1.2, 1.2].forEach((rx) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, centerSpanLen), bdwMatMan);
      rail.position.set(rx, 1.55, 0);
      centerSpanMan.add(rail);
    });

    // 4 Catenary Cable Halves (Saddle at local Z = -8.8, Y = 27.2 down to Midspan at local Z = +8.8, Y = 1.6)
    cableXPositions.forEach((cx) => {
      const pts = [];
      for (let k = 0; k <= 12; k++) {
        const frac = k / 12;
        const lz = -8.8 + frac * 17.6;
        const norm = (8.8 - lz) / 17.6;
        const ly = 1.6 + 25.6 * (norm * norm);
        pts.push(new THREE.Vector3(cx, ly, lz));
      }
      const cable = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.16, 8, false), cableMatMan);
      centerSpanMan.add(cable);

      // Vertical wire suspenders
      for (let lz = -7.2; lz <= 7.2; lz += 1.8) {
        const norm = (8.8 - lz) / 17.6;
        const lyCable = 1.6 + 25.6 * (norm * norm);
        const suspH = Math.max(0.4, lyCable - 0.6);
        const susp = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, suspH, 6), cableMatMan);
        susp.position.set(cx, 0.6 + suspH * 0.5, lz);
        centerSpanMan.add(susp);
      }

      // John Roebling diagonal stay cables radiating from tower saddle
      const saddleLocal = new THREE.Vector3(cx, 27.2, -8.8);
      [-6.5, -4.0, -1.5, 1.5, 4.5, 7.0].forEach((dz) => {
        const deckLocal = new THREE.Vector3(cx, 0.8, dz);
        const stayLen = saddleLocal.distanceTo(deckLocal);
        const stay = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, stayLen, 4), cableMatMan);
        stay.position.copy(saddleLocal).lerp(deckLocal, 0.5);
        stay.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), deckLocal.clone().sub(saddleLocal).normalize());
        centerSpanMan.add(stay);
      });
    });

    registerWipeable(centerSpanMan, 0.738, manPos, fBr.tangent, fBr.side, {
      materials: matsMan,
      collapseTilt: 0.65,
      collapseTiltX: -0.22,
      driftSpeed: 32.0,
      tumbleScale: 4.5,
      sinkScale: 0.38,
      maxProg: 0.16
    });
  }

  // 2. Brooklyn Center Suspended Span Half (Z in [0, +17.6])
  {
    const centerSpanBr = new THREE.Group();
    const brkPos = fBr.pt.clone().addScaledVector(fBr.side, centerSpanLen * 0.5).addScaledVector(fBr.up, 12.0);
    centerSpanBr.quaternion.copy(brQuat);

    const deckMatBr = steelGreenMat.clone();
    const bdwMatBr = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const cableMatBr = steelCableMat.clone();
    const trussMatBr = steelGreenMat.clone();
    const matsBr = [deckMatBr, bdwMatBr, cableMatBr, trussMatBr];

    // Double Roadway Deck Half
    const deck = new THREE.Mesh(new THREE.BoxGeometry(7.4, 1.2, centerSpanLen), deckMatBr);
    deck.castShadow = true;
    centerSpanBr.add(deck);

    // Stiffening Steel Trusses
    [-3.6, 3.6].forEach((tx) => {
      const truss = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.6, centerSpanLen), trussMatBr);
      truss.position.set(tx, 0.6, 0);
      centerSpanBr.add(truss);
    });

    // Elevated Central Pedestrian Timber Boardwalk
    const bdw = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, centerSpanLen), bdwMatBr);
    bdw.position.set(0, 1.0, 0);
    centerSpanBr.add(bdw);

    [-1.2, 1.2].forEach((rx) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, centerSpanLen), bdwMatBr);
      rail.position.set(rx, 1.55, 0);
      centerSpanBr.add(rail);
    });

    // 4 Catenary Cable Halves (Midspan at local Z = -8.8, Y = 1.6 up to Tower Saddle at local Z = +8.8, Y = 27.2)
    cableXPositions.forEach((cx) => {
      const pts = [];
      for (let k = 0; k <= 12; k++) {
        const frac = k / 12;
        const lz = -8.8 + frac * 17.6;
        const norm = (lz + 8.8) / 17.6;
        const ly = 1.6 + 25.6 * (norm * norm);
        pts.push(new THREE.Vector3(cx, ly, lz));
      }
      const cable = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.16, 8, false), cableMatBr);
      centerSpanBr.add(cable);

      // Vertical wire suspenders
      for (let lz = -7.2; lz <= 7.2; lz += 1.8) {
        const norm = (lz + 8.8) / 17.6;
        const lyCable = 1.6 + 25.6 * (norm * norm);
        const suspH = Math.max(0.4, lyCable - 0.6);
        const susp = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, suspH, 6), cableMatBr);
        susp.position.set(cx, 0.6 + suspH * 0.5, lz);
        centerSpanBr.add(susp);
      }

      // John Roebling diagonal stay cables radiating from Brooklyn tower saddle
      const saddleLocal = new THREE.Vector3(cx, 27.2, 8.8);
      [-7.0, -4.5, -1.5, 1.5, 4.0, 6.5].forEach((dz) => {
        const deckLocal = new THREE.Vector3(cx, 0.8, dz);
        const stayLen = saddleLocal.distanceTo(deckLocal);
        const stay = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, stayLen, 4), cableMatBr);
        stay.position.copy(saddleLocal).lerp(deckLocal, 0.5);
        stay.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), deckLocal.clone().sub(saddleLocal).normalize());
        centerSpanBr.add(stay);
      });
    });

    registerWipeable(centerSpanBr, 0.742, brkPos, fBr.tangent, fBr.side, {
      materials: matsBr,
      collapseTilt: -0.65,
      collapseTiltX: 0.22,
      driftSpeed: 30.0,
      tumbleScale: 4.5,
      sinkScale: 0.38,
      maxProg: 0.16
    });
  }

  // 3. Stalled Morning Traffic Caught in Brooklyn Bridge Collapse (uTrigger = 0.738 - 0.743)
  const bridgeVehicles = [
    { type: 'cab',   sideZ: -13.0, offX: -1.8, uTrig: 0.738, tilt: 0.62 },
    { type: 'van',   sideZ: -6.5,  offX:  1.8, uTrig: 0.739, tilt: 0.58 },
    { type: 'cab',   sideZ: -1.0,  offX: -1.8, uTrig: 0.740, tilt: 0.65 },
    { type: 'van',   sideZ:  4.0,  offX:  1.8, uTrig: 0.741, tilt: -0.58 },
    { type: 'cab',   sideZ: 10.5,  offX: -1.8, uTrig: 0.742, tilt: -0.62 },
    { type: 'van',   sideZ: 14.5,  offX:  1.8, uTrig: 0.743, tilt: -0.55 }
  ];

  bridgeVehicles.forEach((v) => {
    const veh = v.type === 'cab' ? createYellowCab() : createDeliveryVan(v.sideZ > 0 ? 0x0284c7 : 0x047857);
    const pos = fBr.pt.clone()
      .addScaledVector(fBr.side, v.sideZ)
      .addScaledVector(fBr.tangent, v.offX);
    pos.y = 13.2;
    veh.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fBr.side);

    registerWipeable(veh.group, v.uTrig, pos, fBr.tangent, fBr.side, {
      primaryMat: veh.primaryMat,
      materials: veh.materials,
      driftSpeed: 30.0,
      tumbleScale: 8.0,
      collapseTilt: v.tilt,
      sinkScale: 0.28
    });
  });

  // DUMBO Waterfront 19th-Century Warehouses with Rooftop Water Tanks
  for (let d = 0; d < 6; d++) {
    const uDumbo = 0.72 + d * 0.015;
    const fDumbo = getRiverFrame(uDumbo);
    const bldg = createWaterfrontBrickBuilding(
      8.5 + (d % 2) * 0.8,
      13.5 + (d % 3) * 1.5,
      8.0,
      brickColors[(d + 2) % brickColors.length]
    );
    const pos = fDumbo.pt.clone().addScaledVector(fDumbo.side, -16.5 - (d % 2) * 2.5);
    pos.y = getGroundY(pos.x, pos.z, 2.8);
    bldg.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fDumbo.tangent);
    bldg.group.rotation.y += (d * 0.4);

    registerWipeable(bldg.group, uDumbo, pos, fDumbo.tangent, fDumbo.side, {
      primaryMat: bldg.primaryMat,
      materials: bldg.materials,
      driftSpeed: 26.0,
      tumbleScale: 5.5,
      collapseTilt: 0.5
    });
  }

  // Moored East River Work Barge & Tugboat
  {
    const fTug = getRiverFrame(0.70);
    const tug = createHarborTugboat();
    const pos = fTug.pt.clone().addScaledVector(fTug.side, -7.5);
    pos.y = fTug.pt.y + 0.2;
    tug.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fTug.tangent);

    registerWipeable(tug.group, 0.70, pos, fTug.tangent, fTug.side, {
      primaryMat: tug.primaryMat,
      materials: tug.materials,
      driftSpeed: 28.0,
      tumbleScale: 7.0
    });
  }

  // -------------------------------------------------------------------------
  // 6. CON EDISON 14TH STREET GENERATING STATION & TRANSFORMER YARD (u = 0.86)
  // -------------------------------------------------------------------------
  const fConEd = getRiverFrame(0.86);
  const conEdGroup = new THREE.Group();
  conEdGroup.position.copy(fConEd.pt);

  // Brick Powerhouse Building
  const powerhouse = new THREE.Mesh(new THREE.BoxGeometry(14.0, 16.0, 22.0), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 }));
  powerhouse.position.set(fConEd.side.x * 24.0, 8.0, 0);
  powerhouse.castShadow = true;
  conEdGroup.add(powerhouse);

  // Twin Industrial Smokestacks
  [-5.0, 5.0].forEach(sZ => {
    const stack = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.6, 26.0, 12), concreteMat);
    stack.position.set(fConEd.side.x * 24.0, 21.0, sZ);
    stack.castShadow = true;
    conEdGroup.add(stack);
  });

  // Outdoor 345 kV High-Voltage Transformer Banks
  for (let tr = 0; tr < 3; tr++) {
    const trGroup = new THREE.Group();
    const core = new THREE.Mesh(new THREE.BoxGeometry(3.5, 4.0, 5.0), transformerMat);
    core.position.y = 2.0;
    trGroup.add(core);

    [-1.2, 0, 1.2].forEach(bZ => {
      const bushing = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 2.2, 8), ceramicMat);
      bushing.position.set(0, 4.8, bZ);
      trGroup.add(bushing);
    });

    trGroup.position.set(fConEd.side.x * 16.0, 1.0, -8.0 + tr * 8.0);
    conEdGroup.add(trGroup);
  }

  const arcLight = new THREE.PointLight(0x60a5fa, 0.0, 70);
  arcLight.position.set(fConEd.side.x * 16.0, 7.0, 0);
  conEdGroup.add(arcLight);

  const arcGeo = new THREE.SphereGeometry(3.0, 12, 12);
  const arcMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.0 });
  const arcMesh = new THREE.Mesh(arcGeo, arcMat);
  arcMesh.position.copy(arcLight.position);
  conEdGroup.add(arcMesh);
  group.add(conEdGroup);

  // Substation perimeter blast barriers that fail under surge
  for (let sb = 0; sb < 3; sb++) {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.4, 5.0), concreteMat);
    const pos = fConEd.pt.clone().addScaledVector(fConEd.side, 10.5).addScaledVector(fConEd.tangent, (sb - 1) * 5.2);
    pos.y = getGroundY(pos.x, pos.z, 2.4);
    panel.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fConEd.tangent);

    registerWipeable(panel, 0.86 + sb * 0.015, pos, fConEd.tangent, fConEd.side, {
      primaryMat: concreteMat,
      driftSpeed: 20.0,
      tumbleScale: 4.5,
      collapseTilt: 0.6
    });
  }

  // -------------------------------------------------------------------------
  // 7. USACE UNWATERING ARMADA & HIGH-VOLUME MOBILE PUMPS (u = 0.94)
  // -------------------------------------------------------------------------
  const fArmy = getRiverFrame(0.94);
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

    pumpRig.position.set(fArmy.side.x * 14.0, 1.8, -7.0 + p * 7.0);
    armyGroup.add(pumpRig);
  }
  group.add(armyGroup);

  function updateTubes(uWave) {
    // 1. Update 7 Under-River Transit Tubes
    for (let i = 0; i < tubesList.length; i++) {
      const tube = tubesList[i];
      if (!tube) continue;

      if (uWave < tube.uTrigger) {
        // Pristine / Dry state
        tube.floodMesh.visible = false;
        tube.floodMesh.scale.y = 0.001;
        tube.floodMesh.position.y = -1.3;
        tube.foamManhattan.visible = false;
        tube.foamBrooklyn.visible = false;

        if (tube.badgeSprite && tube.badgeTextures && tube.badgeTextures.texDry) {
          tube.badgeSprite.material.map = tube.badgeTextures.texDry;
          tube.badgeSprite.material.needsUpdate = true;
        }

        for (let j = 0; j < tube.lights.length; j++) {
          const l = tube.lights[j];
          l.material.color.setHex(0xf59e0b);
          l.material.opacity = 0.85;
        }
      } else {
        // Inundated / Submerged state
        const prog = Math.min(1.0, (uWave - tube.uTrigger) / 0.045);
        tube.floodMesh.visible = true;
        tube.floodMesh.scale.y = 0.05 + prog * 0.95;
        tube.floodMesh.position.y = -1.3 + prog * 1.15;

        // Foamy portal spray at tunnel breach points
        const pulse = Math.sin(Date.now() * 0.02) * 0.2 + 0.8;
        tube.foamManhattan.visible = true;
        tube.foamManhattan.scale.set(1.0 + pulse * 0.3, 1.0 + pulse * 0.3, 1.0 + pulse * 0.3);
        tube.foamBrooklyn.visible = true;
        tube.foamBrooklyn.scale.set(1.0 + pulse * 0.3, 1.0 + pulse * 0.3, 1.0 + pulse * 0.3);

        if (tube.badgeSprite && tube.badgeTextures && tube.badgeTextures.texSub) {
          tube.badgeSprite.material.map = tube.badgeTextures.texSub;
          tube.badgeSprite.material.needsUpdate = true;
        }

        // Electrical short-circuit & emergency red flashing strobe
        const strobe = (Math.sin(Date.now() * 0.04 + tube.uTrigger * 20.0) > 0.0);
        for (let j = 0; j < tube.lights.length; j++) {
          const l = tube.lights[j];
          if (prog < 0.25) {
            l.material.color.setHex(0xf59e0b);
            l.material.opacity = 0.85;
          } else {
            l.material.color.setHex(strobe ? 0xef4444 : 0x38bdf8);
            l.material.opacity = strobe ? 0.95 : 0.2;
          }
        }
      }
    }

    // 2. Update South Ferry Subsurface Metro Station Cutaway
    if (metroStation) {
      if (uWave < 0.53) {
        metroStation.waterMesh.visible = false;
        metroStation.waterMesh.scale.y = 0.001;
        metroStation.waterMesh.position.y = -metroStation.sH * 0.5 + 0.1;
        metroStation.stairCascade.visible = false;
        metroStation.alarmLight.intensity = 0.0;
      } else {
        const stProg = Math.min(1.0, (uWave - 0.53) / 0.045);
        metroStation.waterMesh.visible = true;
        metroStation.waterMesh.scale.y = 0.05 + stProg * 0.95;
        metroStation.waterMesh.position.y = -metroStation.sH * 0.5 + 0.1 + stProg * (metroStation.sH * 0.55);
        metroStation.stairCascade.visible = true;
        metroStation.stairCascade.material.opacity = 0.75 + Math.sin(Date.now() * 0.03) * 0.15;
        const alarmPulse = Math.sin(Date.now() * 0.05) > 0.0 ? 1.0 : 0.0;
        metroStation.alarmLight.intensity = alarmPulse * 5.0;
      }
    }
  }

  return {
    wipeableItems,
    dynamicWaterItems,
    arcLight,
    arcMesh,
    updateTubes
  };
}
