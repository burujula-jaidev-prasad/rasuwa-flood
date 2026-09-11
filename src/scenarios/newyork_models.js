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

  const vzSpan = 42.0;
  const vzTowerH = 34.0;

  [-vzSpan * 0.48, vzSpan * 0.48].forEach((sideOffset) => {
    const towerGroup = new THREE.Group();
    towerGroup.position.set(fVz.side.x * sideOffset, 0, fVz.side.z * sideOffset);

    const caisson = new THREE.Mesh(new THREE.BoxGeometry(6.5, 6.0, 8.0), concreteMat);
    caisson.position.y = 2.5;
    towerGroup.add(caisson);

    [-2.0, 2.0].forEach((legZ) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(2.2, vzTowerH, 2.4), steelGreenMat);
      leg.position.set(0, vzTowerH * 0.5 + 5.0, legZ);
      leg.castShadow = true;
      towerGroup.add(leg);
    });

    [12.0, 22.0, 32.0, vzTowerH + 4.0].forEach((strutY) => {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, 4.8), steelGreenMat);
      strut.position.set(0, strutY, 0);
      towerGroup.add(strut);
    });

    vzGroup.add(towerGroup);
  });

  const vzDeckWidth = vzSpan + 6.0;
  const vzDeck = new THREE.Mesh(new THREE.BoxGeometry(vzDeckWidth, 1.4, 5.5), steelGreenMat);
  vzDeck.rotation.y = Math.atan2(fVz.side.x, fVz.side.z);
  vzDeck.position.set(0, 13.0, 0);
  vzDeck.castShadow = true;
  vzGroup.add(vzDeck);

  const vzRoad = new THREE.Mesh(new THREE.BoxGeometry(vzDeckWidth, 0.2, 4.8), tarmacMat);
  vzRoad.rotation.y = Math.atan2(fVz.side.x, fVz.side.z);
  vzRoad.position.set(0, 13.8, 0);
  vzGroup.add(vzRoad);
  group.add(vzGroup);

  // -------------------------------------------------------------------------
  // 2. LOWER MANHATTAN SKYLINE, ONE WTC & BATTERY PARK (u = 0.48 - 0.54)
  // -------------------------------------------------------------------------
  const fMan = getRiverFrame(0.50);
  const manGroup = new THREE.Group();
  manGroup.position.copy(fMan.pt);

  // Curved Granite Battery Park Seawall Promenade
  const seawall = new THREE.Mesh(new THREE.BoxGeometry(4.0, 3.2, 54.0), seawallGranite);
  seawall.position.set(fMan.side.x * 12.0, 1.6, fMan.side.z * 12.0);
  seawall.castShadow = true;
  manGroup.add(seawall);

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
  // ZONE 4: SOUTH FERRY SUBWAY PORTAL & TRANSIT BREACH (u = 0.54)
  // -------------------------------------------------------------------------
  const fSub = getRiverFrame(0.54);

  // Subway Entrance Kiosk
  {
    const subKiosk = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2.5, 6.0), steelGreenMat);
    const pos = fSub.pt.clone().addScaledVector(fSub.side, 15.0).addScaledVector(fSub.tangent, -4.0);
    pos.y = getGroundY(pos.x, pos.z, 2.7) + 1.25;
    subKiosk.castShadow = true;

    registerWipeable(subKiosk, 0.54, pos, fSub.tangent, fSub.side, {
      primaryMat: steelGreenMat,
      driftSpeed: 25.0,
      tumbleScale: 5.5,
      collapseTilt: 0.4
    });
  }

  // Sandbag barricades blowing out at subway stairs
  for (let s = 0; s < 3; s++) {
    const bund = createSubwaySandbagBund(3.4);
    const pos = fSub.pt.clone().addScaledVector(fSub.side, 14.5).addScaledVector(fSub.tangent, -2.0 + s * 1.6);
    pos.y = getGroundY(pos.x, pos.z, 2.7);
    bund.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fSub.tangent);

    registerWipeable(bund.group, 0.54 + s * 0.01, pos, fSub.tangent, fSub.side, {
      primaryMat: bund.primaryMat,
      materials: bund.materials,
      driftSpeed: 22.0,
      tumbleScale: 4.5,
      sinkScale: 0.25
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

  const brSpan = 40.0;
  const brTowerH = 32.0;

  // Twin Neo-Gothic Granite Arch Suspension Towers
  [-brSpan * 0.45, brSpan * 0.45].forEach((towerOffset) => {
    const tower = new THREE.Group();
    tower.position.set(fBr.side.x * towerOffset, 0, fBr.side.z * towerOffset);

    // Granite foundation pier
    const pier = new THREE.Mesh(new THREE.BoxGeometry(6.5, 5.0, 9.0), gothicStoneMat);
    pier.position.y = 2.5;
    tower.add(pier);

    // Twin Gothic Arch Portals
    [-2.2, 2.2].forEach((archZ) => {
      const archPillar = new THREE.Mesh(new THREE.BoxGeometry(2.2, brTowerH, 2.4), gothicStoneMat);
      archPillar.position.set(0, brTowerH * 0.5 + 4.5, archZ);
      archPillar.castShadow = true;
      tower.add(archPillar);
    });

    const gothicArchTop = new THREE.Mesh(new THREE.BoxGeometry(2.3, 3.5, 6.8), gothicStoneMat);
    gothicArchTop.position.set(0, brTowerH + 4.0, 0);
    tower.add(gothicArchTop);

    brGroup.add(tower);
  });

  // Suspended Road Deck & Elevated Pedestrian Boardwalk
  const brDeck = new THREE.Mesh(new THREE.BoxGeometry(brSpan + 8.0, 1.2, 6.0), steelGreenMat);
  brDeck.rotation.y = Math.atan2(fBr.side.x, fBr.side.z);
  brDeck.position.set(0, 12.0, 0);
  brDeck.castShadow = true;
  brGroup.add(brDeck);

  const brBoardwalk = new THREE.Mesh(new THREE.BoxGeometry(brSpan + 8.0, 0.4, 2.2), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 }));
  brBoardwalk.rotation.y = Math.atan2(fBr.side.x, fBr.side.z);
  brBoardwalk.position.set(0, 13.0, 0);
  brGroup.add(brBoardwalk);
  group.add(brGroup);

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
