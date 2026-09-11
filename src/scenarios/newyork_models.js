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
      sinkScale: options.sinkScale !== undefined ? options.sinkScale : 0.25,
      material: options.primaryMat || null,
      materials: options.materials || null,
      maxProg: options.maxProg || 0.12
    });
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

    // Tower Crown Cornice & Saddle Cap
    const crown = new THREE.Mesh(new THREE.BoxGeometry(7.8, 2.2, 3.2), gothicStoneMat);
    crown.position.set(0, brTowerH + 4.8, 0);
    tower.add(crown);

    brGroup.add(tower);
  });

  // Suspended Stiffened Road Deck (Double roadway)
  const brDeckLen = brSpan * 1.40;
  const brDeck = new THREE.Mesh(new THREE.BoxGeometry(7.4, 1.2, brDeckLen), steelGreenMat);
  brDeck.position.set(0, 12.0, 0);
  brDeck.castShadow = true;
  brGroup.add(brDeck);

  // Elevated Central Pedestrian Timber Boardwalk
  const brBoardwalk = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, brDeckLen), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 }));
  brBoardwalk.position.set(0, 13.0, 0);
  brGroup.add(brBoardwalk);

  // Timber handrails flanking pedestrian boardwalk
  [-1.2, 1.2].forEach((rX) => {
    const handrail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, brDeckLen), new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 }));
    handrail.position.set(rX, 13.55, 0);
    brGroup.add(handrail);
  });

  // 4 Heavy 3D Catenary Main Cable Tubes (Outer & Inner pairs)
  const cableXPositions = [-3.0, -1.8, 1.8, 3.0];
  cableXPositions.forEach((cableX) => {
    const curvePts = [];
    curvePts.push(new THREE.Vector3(cableX, 6.5, -brAnchorZ));
    curvePts.push(new THREE.Vector3(cableX, 19.0, -brTowerZ * 1.3));
    curvePts.push(new THREE.Vector3(cableX, brTowerH + 5.2, -brTowerZ));

    for (let k = 1; k < 14; k++) {
      const uK = k / 14;
      const zK = -brTowerZ + uK * (2.0 * brTowerZ);
      const normZ = zK / brTowerZ;
      const yK = 13.6 + (brTowerH + 5.2 - 13.6) * (normZ * normZ);
      curvePts.push(new THREE.Vector3(cableX, yK, zK));
    }

    curvePts.push(new THREE.Vector3(cableX, brTowerH + 5.2, brTowerZ));
    curvePts.push(new THREE.Vector3(cableX, 19.0, brTowerZ * 1.3));
    curvePts.push(new THREE.Vector3(cableX, 6.5, brAnchorZ));

    const catCurve = new THREE.CatmullRomCurve3(curvePts);
    const cableTube = new THREE.Mesh(new THREE.TubeGeometry(catCurve, 48, 0.16, 8, false), steelCableMat);
    brGroup.add(cableTube);

    // Vertical Wire Rope Suspenders
    for (let sZ = -brTowerZ + 1.6; sZ <= brTowerZ - 1.6; sZ += 1.8) {
      const normZ = sZ / brTowerZ;
      const yCable = 13.6 + (brTowerH + 5.2 - 13.6) * (normZ * normZ);
      const suspH = Math.max(0.4, yCable - 12.6);
      const susp = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, suspH, 6), steelCableMat);
      susp.position.set(cableX, 12.6 + suspH * 0.5, sZ);
      brGroup.add(susp);
    }

    // John Roebling's Radiating Diagonal Steel Stay Cables
    const deckZTargets = [
      -brTowerZ * 0.85, -brTowerZ * 0.65, -brTowerZ * 0.45, -brTowerZ * 0.25, -brTowerZ * 0.08,
      brTowerZ * 0.08, brTowerZ * 0.25, brTowerZ * 0.45, brTowerZ * 0.65, brTowerZ * 0.85
    ];

    [-brTowerZ, brTowerZ].forEach((tZ) => {
      const saddlePos = new THREE.Vector3(cableX, brTowerH + 5.0, tZ);
      deckZTargets.forEach((dZ) => {
        if ((tZ < 0 && dZ > tZ) || (tZ > 0 && dZ < tZ)) {
          const deckPos = new THREE.Vector3(cableX, 12.8, dZ);
          const stayLen = saddlePos.distanceTo(deckPos);
          const stayMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, stayLen, 4), steelCableMat);
          stayMesh.position.copy(saddlePos).lerp(deckPos, 0.5);
          stayMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), deckPos.clone().sub(saddlePos).normalize());
          brGroup.add(stayMesh);
        }
      });
    });
  });
  group.add(brGroup);

  // Dynamic Collapsing Roadway Section & Yellow Cabs on Brooklyn Bridge (u = 0.74)
  {
    const cab = createYellowCab();
    const cabPos = fBr.pt.clone().addScaledVector(fBr.side, -4.0);
    cabPos.y = 13.2;
    cab.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fBr.side);

    registerWipeable(cab.group, 0.74, cabPos, fBr.tangent, fBr.side, {
      primaryMat: cab.primaryMat,
      materials: cab.materials,
      driftSpeed: 30.0,
      tumbleScale: 8.0,
      collapseTilt: 0.58,
      sinkScale: 0.22
    });

    const van = createDeliveryVan(0x047857);
    const vanPos = fBr.pt.clone().addScaledVector(fBr.side, 5.5);
    vanPos.y = 13.2;
    van.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fBr.side);

    registerWipeable(van.group, 0.745, vanPos, fBr.tangent, fBr.side, {
      primaryMat: van.primaryMat,
      materials: van.materials,
      driftSpeed: 29.0,
      tumbleScale: 7.5,
      collapseTilt: 0.52
    });
  }

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

  return {
    wipeableItems,
    dynamicWaterItems,
    arcLight,
    arcMesh
  };
}
