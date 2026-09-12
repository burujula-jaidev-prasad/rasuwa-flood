import * as THREE from 'three';
import {
  getModernGlassFacadeTexture,
  getStoneMasonryFacadeTexture,
  getHistoricBrickFacadeTexture,
  get1WTCFacadeTexture
} from './newyork_textures.js';

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
  let vesselsObj = null;

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
  const glassTex1 = getModernGlassFacadeTexture(0x0284c7);
  const glassTex2 = getModernGlassFacadeTexture(0x0369a1);
  const stoneTex  = getStoneMasonryFacadeTexture();
  const wtcTex    = get1WTCFacadeTexture();
  const brickTex  = getHistoricBrickFacadeTexture();

  const glassTowerMat1  = new THREE.MeshStandardMaterial({
    map: glassTex1,
    color: 0xffffff,
    roughness: 0.16,
    metalness: 0.75,
    transparent: true,
    opacity: 0.94
  });
  const glassTowerMat2  = new THREE.MeshStandardMaterial({
    map: glassTex2,
    color: 0xffffff,
    roughness: 0.18,
    metalness: 0.70,
    transparent: true,
    opacity: 0.94
  });
  const stoneTowerMat   = new THREE.MeshStandardMaterial({
    map: stoneTex,
    color: 0xffffff,
    roughness: 0.75,
    metalness: 0.10
  });
  const oneWtcMat       = new THREE.MeshStandardMaterial({
    map: wtcTex,
    color: 0xffffff,
    roughness: 0.12,
    metalness: 0.85,
    transparent: true,
    opacity: 0.98
  });
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

    const brickMat = new THREE.MeshStandardMaterial({
      map: brickTex,
      color: brickHex,
      roughness: 0.82
    });
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

    return { group: copGroup, materials, primaryMat: whiteMat, lightbar };
  }

  // Civilian Sedan Car
  function createSedanCar(colorHex = 0x94a3b8) {
    const carGroup = new THREE.Group();
    const materials = [];

    const bodyMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.35, metalness: 0.5 });
    const darkWinMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.15, metalness: 0.8 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    materials.push(bodyMat, darkWinMat, wheelMat);

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.75, 4.2), bodyMat);
    chassis.position.y = 0.6;
    chassis.castShadow = true;
    carGroup.add(chassis);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.7, 2.2), darkWinMat);
    cabin.position.set(0, 1.3, -0.15);
    carGroup.add(cabin);

    [[-0.92, -1.25], [0.92, -1.25], [-0.92, 1.25], [0.92, 1.25]].forEach(([wX, wZ]) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.28, 10), wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wX, 0.32, wZ);
      carGroup.add(wheel);
    });

    return { group: carGroup, materials, primaryMat: bodyMat };
  }

  // 20-ft Intermodal Cargo Shipping Container
  function createShippingContainer(boxHex = 0x0284c7) {
    const contGroup = new THREE.Group();
    const materials = [];

    const boxMat = new THREE.MeshStandardMaterial({ color: boxHex, roughness: 0.5, metalness: 0.4 });
    const cornerMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7, metalness: 0.8 });
    const hazardMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    materials.push(boxMat, cornerMat, hazardMat);

    // Main corrugated cargo box (6.0m x 2.4m x 2.5m)
    const box = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.5, 6.0), boxMat);
    box.position.y = 1.25;
    box.castShadow = true;
    contGroup.add(box);

    // Subtle corrugated side rib trims
    for (let r = -2.5; r <= 2.5; r += 0.8) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(2.46, 2.4, 0.12), boxMat);
      rib.position.set(0, 1.25, r);
      contGroup.add(rib);
    }

    // Heavy steel corner castings
    [[-1.2, 1.2], [1.2, 1.2]].forEach(([cx, cz]) => {
      [0.05, 2.45].forEach(cy => {
        const corner = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), cornerMat);
        corner.position.set(cx, cy, cz);
        contGroup.add(corner);
      });
    });

    // Hazmat / shipping placard
    const placard = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.4, 0.8), hazardMat);
    placard.position.set(1.22, 1.4, 0);
    contGroup.add(placard);

    return { group: contGroup, materials, primaryMat: boxMat };
  }

  // Heavy Industrial Wood Cargo Pallet
  function createTimberPallet() {
    const palletGroup = new THREE.Group();
    const materials = [];

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    materials.push(woodMat);

    // 3 bottom skids
    [-0.7, 0, 0.7].forEach(sx => {
      const skid = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 1.6), woodMat);
      skid.position.set(sx, 0.06, 0);
      palletGroup.add(skid);
    });

    // Top deck slats
    for (let s = 0; s < 6; s++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.2), woodMat);
      slat.position.set(0, 0.16, -0.7 + s * 0.28);
      palletGroup.add(slat);
    }

    return { group: palletGroup, materials, primaryMat: woodMat };
  }

  // 55-Gallon Steel Oil / Chemical Drum Cluster
  function createSteelDrumCluster() {
    const clusterGroup = new THREE.Group();
    const materials = [];

    const yellowDrumMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4, metalness: 0.6 });
    const blueDrumMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.35, metalness: 0.7 });
    const redDrumMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4, metalness: 0.5 });
    materials.push(yellowDrumMat, blueDrumMat, redDrumMat);

    // Upright Yellow Hazmat Drum
    const drum1 = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 1.05, 12), yellowDrumMat);
    drum1.position.set(-0.35, 0.52, -0.2);
    drum1.castShadow = true;
    clusterGroup.add(drum1);

    // Floating/Knocked Blue Petroleum Drum
    const drum2 = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 1.05, 12), blueDrumMat);
    drum2.rotation.z = Math.PI * 0.45;
    drum2.position.set(0.4, 0.35, 0.1);
    drum2.castShadow = true;
    clusterGroup.add(drum2);

    // Red Flammable Drum
    const drum3 = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 1.05, 12), redDrumMat);
    drum3.rotation.x = Math.PI * 0.4;
    drum3.position.set(-0.1, 0.32, 0.45);
    drum3.castShadow = true;
    clusterGroup.add(drum3);

    return { group: clusterGroup, materials, primaryMat: yellowDrumMat };
  }

  // Driftwood Piling / Creosote Wharf Timber Beam
  function createDriftwoodBeam() {
    const beamGroup = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.95 });
    const materials = [woodMat];

    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 4.8, 10), woodMat);
    log.rotation.z = Math.PI * 0.5;
    log.position.y = 0.25;
    log.castShadow = true;
    beamGroup.add(log);

    return { group: beamGroup, materials, primaryMat: woodMat };
  }

  // 4-Car MTA Stainless-Steel Subway Train Set (R160 / R211 Style)
  function createMTASubwayTrain() {
    const trainGroup = new THREE.Group();
    const materials = [];

    const carSteelMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.22, metalness: 0.85 });
    const darkWinMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.15, metalness: 0.8 });
    const litWinMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: 0.85,
      roughness: 0.2
    });
    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8, metalness: 0.9 });
    const gangwayMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const redTailMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const routeBulletMat = new THREE.MeshBasicMaterial({ color: 0x2563eb }); // MTA Blue (A) Eighth Ave Express Bullet
    materials.push(carSteelMat, darkWinMat, litWinMat, doorFrameMat, wheelMat, gangwayMat, headlightMat, redTailMat, routeBulletMat);

    const carLen = 13.5;
    const carW = 2.8;
    const carH = 2.8;
    const numCars = 2;

    for (let c = 0; c < numCars; c++) {
      const carGroup = new THREE.Group();
      const carZ = (c - (numCars - 1) * 0.5) * (carLen + 0.8);
      carGroup.position.z = carZ;

      // Stainless Steel Carbody
      const body = new THREE.Mesh(new THREE.BoxGeometry(carW, carH * 0.85, carLen), carSteelMat);
      body.position.y = carH * 0.5 + 0.35;
      body.castShadow = true;
      carGroup.add(body);

      // Curved Silver Roof Cap
      const roof = new THREE.Mesh(new THREE.BoxGeometry(carW * 0.94, 0.35, carLen - 0.2), carSteelMat);
      roof.position.y = carH + 0.35;
      carGroup.add(roof);

      // Fluted Stainless Steel Rib Accents along lower sides
      const fluting = new THREE.Mesh(new THREE.BoxGeometry(carW + 0.04, 0.45, carLen - 0.4), new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.9 }));
      fluting.position.y = 0.9;
      carGroup.add(fluting);

      // Warm Illuminated Passenger Cabin Windows (Glows from within!)
      const winL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.95, carLen * 0.78), litWinMat);
      winL.position.set(-carW * 0.5 - 0.02, carH * 0.55 + 0.35, 0);
      carGroup.add(winL);

      const winR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.95, carLen * 0.78), litWinMat);
      winR.position.set(carW * 0.5 + 0.02, carH * 0.55 + 0.35, 0);
      carGroup.add(winR);

      // 3 Sets of Double Sliding Passenger Doors per side
      [-carLen * 0.32, 0, carLen * 0.32].forEach(dz => {
        [-carW * 0.5 - 0.03, carW * 0.5 + 0.03].forEach(dx => {
          const door = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.9, 1.4), doorFrameMat);
          door.position.set(dx, 1.45, dz);
          carGroup.add(door);
        });
      });

      // Dual Roof-Mounted HVAC Pods
      [-carLen * 0.25, carLen * 0.25].forEach(hz => {
        const hvac = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 2.6), doorFrameMat);
        hvac.position.set(0, carH + 0.65, hz);
        carGroup.add(hvac);
      });

      // 2 Bogie Wheel Trucks per car
      [-carLen * 0.35, carLen * 0.35].forEach(bz => {
        const bogie = new THREE.Group();
        bogie.position.set(0, 0.38, bz);

        const frame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.25, 2.2), wheelMat);
        bogie.add(frame);

        // 4 Steel Wheels
        [-1.1, 1.1].forEach(wx => {
          [-0.8, 0.8].forEach(wz => {
            const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.22, 12), wheelMat);
            wheel.rotation.z = Math.PI * 0.5;
            wheel.position.set(wx, 0, wz);
            bogie.add(wheel);
          });
        });
        carGroup.add(bogie);
      });

      // Articulated Gangway Bellows between cars
      if (c < numCars - 1) {
        const bellows = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.4, 0.82), gangwayMat);
        bellows.position.set(0, carH * 0.5 + 0.35, carLen * 0.5 + 0.41);
        carGroup.add(bellows);
      }

      // Lead Car Front End Features (car 0 facing front, positive Z)
      if (c === 0) {
        // Angled Cab Windshield
        const cabWin = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 0.15), darkWinMat);
        cabWin.position.set(0, carH * 0.6 + 0.35, -carLen * 0.5 - 0.05);
        carGroup.add(cabWin);

        // Lit Route Sign & Blue "A" Express Bullet
        const signBox = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 0.18), darkWinMat);
        signBox.position.set(0, carH + 0.15, -carLen * 0.5 - 0.05);
        carGroup.add(signBox);

        const bullet = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.2, 12), routeBulletMat);
        bullet.rotation.x = Math.PI * 0.5;
        bullet.position.set(-0.45, carH + 0.15, -carLen * 0.5 - 0.06);
        carGroup.add(bullet);

        // Twin Headlights
        [-0.75, 0.75].forEach(hx => {
          const headlight = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), headlightMat);
          headlight.position.set(hx, 0.85, -carLen * 0.5 - 0.05);
          carGroup.add(headlight);
        });

        // Red Tail/Marker Lights on roof corners
        [-1.3, 1.3].forEach(rx => {
          const marker = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), redTailMat);
          marker.position.set(rx, carH + 0.25, -carLen * 0.5 - 0.05);
          carGroup.add(marker);
        });
      }

      // Rear Car End Marker Lights (car numCars - 1)
      if (c === numCars - 1) {
        [-1.1, 1.1].forEach(rx => {
          const rearMarker = new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 6), redTailMat);
          rearMarker.position.set(rx, carH + 0.25, carLen * 0.5 + 0.05);
          carGroup.add(rearMarker);
        });
      }

      trainGroup.add(carGroup);
    }

    return { group: trainGroup, materials, primaryMat: carSteelMat };
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

  // -------------------------------------------------------------------------
  // STATEN ISLAND FERRY (Double-Ended 24m Passenger Ferry)
  // -------------------------------------------------------------------------
  function createStatenIslandFerry() {
    const ferryGroup = new THREE.Group();
    const materials = [];

    // Classic Staten Island Ferry Orange & Navy Blue
    const orangeHullMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.35, metalness: 0.2 });
    const navyStripeMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4 });
    const whiteDeckMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.28 });
    const darkDeckMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.75 });
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.6, emissive: 0xfef08a, emissiveIntensity: 0.18 });
    const funnelMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.35 });
    const blackCapMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.5 });
    const railingMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
    materials.push(orangeHullMat, navyStripeMat, whiteDeckMat, darkDeckMat, windowMat, funnelMat, blackCapMat, railingMat);

    // 1. Double-ended symmetrical main hull
    const mainHull = new THREE.Mesh(new THREE.BoxGeometry(6.6, 2.6, 17.0), orangeHullMat);
    mainHull.position.y = 1.3;
    mainHull.castShadow = true;
    ferryGroup.add(mainHull);

    // Tapered double-ended bow and stern wedges
    [-9.5, 9.5].forEach(zPos => {
      const wedge = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 3.3, 2.6, 16, 1, false, 0, Math.PI), orangeHullMat);
      wedge.rotation.y = zPos > 0 ? 0 : Math.PI;
      wedge.position.set(0, 1.3, zPos);
      wedge.scale.set(1.0, 1.0, 0.7);
      wedge.castShadow = true;
      ferryGroup.add(wedge);
    });

    // Waterline boot-topping navy blue stripe
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(6.75, 0.45, 20.0), navyStripeMat);
    stripe.position.y = 0.35;
    ferryGroup.add(stripe);

    // Vehicle loading portals & gate bars at ends
    [-9.2, 9.2].forEach(zPos => {
      const gate = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.2, 0.4), darkDeckMat);
      gate.position.set(0, 1.9, zPos);
      ferryGroup.add(gate);
    });

    // 2. Lower Passenger Saloon Deck (Tier 1)
    const saloon1 = new THREE.Mesh(new THREE.BoxGeometry(5.8, 1.8, 16.0), whiteDeckMat);
    saloon1.position.y = 3.5;
    saloon1.castShadow = true;
    ferryGroup.add(saloon1);

    // Continuous passenger window ribbons (port & starboard)
    [-3.0, 3.0].forEach(xSide => {
      const winRibbon = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.75, 14.5), windowMat);
      winRibbon.position.set(xSide, 3.6, 0);
      ferryGroup.add(winRibbon);
    });

    // 3. Upper Hurricane / Observation Deck (Tier 2)
    const saloon2 = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.6, 12.0), whiteDeckMat);
    saloon2.position.y = 5.2;
    saloon2.castShadow = true;
    ferryGroup.add(saloon2);

    [-2.5, 2.5].forEach(xSide => {
      const winRibbon2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.65, 10.5), windowMat);
      winRibbon2.position.set(xSide, 5.3, 0);
      ferryGroup.add(winRibbon2);
    });

    // 4. Dual Symmetrical Pilothouses (Forward & Aft Wheelhouses)
    [-6.8, 6.8].forEach(zPos => {
      const wheelhouse = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.4, 2.4), whiteDeckMat);
      wheelhouse.position.set(0, 6.7, zPos);
      ferryGroup.add(wheelhouse);

      const bridgeWin = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.65, 2.5), windowMat);
      bridgeWin.position.set(0, 6.85, zPos);
      ferryGroup.add(bridgeWin);

      const bridgeRoof = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.25, 2.6), darkDeckMat);
      bridgeRoof.position.set(0, 7.5, zPos);
      ferryGroup.add(bridgeRoof);
    });

    // 5. Twin Classic Orange Funnels (Smokestacks)
    [-2.2, 2.2].forEach(zPos => {
      const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 2.2, 12), funnelMat);
      funnel.position.set(0, 7.1, zPos);
      funnel.scale.set(1.4, 1.0, 0.9);
      ferryGroup.add(funnel);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.4, 12), blackCapMat);
      cap.position.set(0, 8.2, zPos);
      cap.scale.set(1.4, 1.0, 0.9);
      ferryGroup.add(cap);
    });

    // 6. Navigation Radar Mast & Running Lights
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 3.2, 8), railingMat);
    mast.position.set(0, 7.6, 0);
    ferryGroup.add(mast);

    const radarBar = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 0.25), darkDeckMat);
    radarBar.position.set(0, 9.2, 0);
    ferryGroup.add(radarBar);

    // Red & Green Navigation Running Lights
    const portLight = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    portLight.position.set(-2.5, 6.9, 0);
    ferryGroup.add(portLight);

    const stbdLight = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
    stbdLight.position.set(2.5, 6.9, 0);
    ferryGroup.add(stbdLight);

    return { group: ferryGroup, materials, primaryMat: orangeHullMat };
  }

  // -------------------------------------------------------------------------
  // NYC FERRY FAST HIGH-SPEED CATAMARAN (Twin-Hull 14m Passenger Boat)
  // -------------------------------------------------------------------------
  function createNYCFerryCatamaran() {
    const catGroup = new THREE.Group();
    const materials = [];

    const alumHullMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.65, roughness: 0.28 });
    const nycFerryBlueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.35 });
    const whiteCabinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });
    const darkGlassMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.15, metalness: 0.5 });
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 });
    const railingMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 });
    materials.push(alumHullMat, nycFerryBlueMat, whiteCabinMat, darkGlassMat, deckMat, railingMat);

    // Twin Aluminum Pontoons (Port & Starboard)
    [-1.8, 1.8].forEach(xOff => {
      const pontoon = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 12.0), alumHullMat);
      pontoon.position.set(xOff, 0.7, 0);
      pontoon.castShadow = true;
      catGroup.add(pontoon);

      // Wave-piercing bow wedge
      const bow = new THREE.Mesh(new THREE.ConeGeometry(0.8, 2.2, 4), alumHullMat);
      bow.rotation.x = Math.PI * 0.5;
      bow.rotation.y = Math.PI * 0.25;
      bow.position.set(xOff, 0.7, -6.8);
      bow.scale.set(0.9, 1.2, 0.8);
      bow.castShadow = true;
      catGroup.add(bow);
    });

    // Bridging Cross-Deck
    const crossDeck = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.3, 11.5), deckMat);
    crossDeck.position.set(0, 1.45, -0.2);
    catGroup.add(crossDeck);

    // Aerodynamic Passenger Salon Cabin
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.6, 9.0), whiteCabinMat);
    cabin.position.set(0, 2.35, 0.2);
    cabin.castShadow = true;
    catGroup.add(cabin);

    // Slanted aerodynamic bow cabin profile
    const cabinBow = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 1.6, 16, 1, false, Math.PI, Math.PI), whiteCabinMat);
    cabinBow.position.set(0, 2.35, -4.3);
    cabinBow.scale.set(1.0, 1.0, 0.6);
    catGroup.add(cabinBow);

    // NYC Ferry Royal Blue Stripe
    const blueStripe = new THREE.Mesh(new THREE.BoxGeometry(4.28, 0.35, 9.5), nycFerryBlueMat);
    blueStripe.position.set(0, 1.8, 0.0);
    catGroup.add(blueStripe);

    // Panoramic Dark Glass Windows
    [-2.15, 2.15].forEach(xSide => {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.7, 7.8), darkGlassMat);
      win.position.set(xSide, 2.45, 0.3);
      catGroup.add(win);
    });

    // Wheelhouse Windshield
    const bridgeWin = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.6, 0.8), darkGlassMat);
    bridgeWin.position.set(0, 2.65, -4.2);
    bridgeWin.rotation.x = -0.3;
    catGroup.add(bridgeWin);

    // Upper Sun Deck Railings & Radar Dome
    const sunDeck = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.15, 6.0), deckMat);
    sunDeck.position.set(0, 3.2, 1.2);
    catGroup.add(sunDeck);

    const radome = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.35, 12), whiteCabinMat);
    radome.position.set(0, 3.5, -1.8);
    catGroup.add(radome);

    return { group: catGroup, materials, primaryMat: alumHullMat };
  }

  // -------------------------------------------------------------------------
  // WHITEHALL FERRY TERMINAL SLIPS & TIMBER PILE DOLPHINS
  // -------------------------------------------------------------------------
  function createWhitehallFerrySlips() {
    const slipsGroup = new THREE.Group();
    const materials = [];

    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
    const woodCreosoteMat = new THREE.MeshStandardMaterial({ color: 0x3b2314, roughness: 0.95 });
    const woodPlankMat = new THREE.MeshStandardMaterial({ color: 0x5a3825, roughness: 0.9 });
    const steelGantryMat = new THREE.MeshStandardMaterial({ color: 0x14532d, metalness: 0.6, roughness: 0.4 });
    const metalBandMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
    const bollardMat = new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.9, roughness: 0.2 });
    materials.push(concreteMat, woodCreosoteMat, woodPlankMat, steelGantryMat, metalBandMat, bollardMat);

    // 1. Concrete Terminal Bulkhead Promenade (along shore)
    const mainBulkhead = new THREE.Mesh(new THREE.BoxGeometry(6.0, 2.8, 38.0), concreteMat);
    mainBulkhead.position.set(0, 1.4, 0);
    mainBulkhead.receiveShadow = true;
    slipsGroup.add(mainBulkhead);

    // 2. Center Dividing Pier (4m wide, separating Berth 1 and Berth 2)
    const centerPier = new THREE.Mesh(new THREE.BoxGeometry(24.0, 2.2, 4.0), concreteMat);
    centerPier.position.set(-12.0, 1.1, 0);
    centerPier.castShadow = true;
    centerPier.receiveShadow = true;
    slipsGroup.add(centerPier);

    // 3. Flanking outer slip piers
    // Outer West Pier (Berth 1 Staten Island Ferry)
    const outerWestPier = new THREE.Mesh(new THREE.BoxGeometry(26.0, 2.2, 2.6), concreteMat);
    outerWestPier.position.set(-13.0, 1.1, -16.0);
    outerWestPier.castShadow = true;
    outerWestPier.receiveShadow = true;
    slipsGroup.add(outerWestPier);

    // Outer East Pier (Berth 2 NYC Catamaran)
    const outerEastPier = new THREE.Mesh(new THREE.BoxGeometry(20.0, 2.2, 2.4), concreteMat);
    outerEastPier.position.set(-10.0, 1.1, 14.5);
    outerEastPier.castShadow = true;
    outerEastPier.receiveShadow = true;
    slipsGroup.add(outerEastPier);

    // 4. Clustered Timber Pile Fender Dolphins (6 clusters at pier heads)
    const dolphinPositions = [
      [-26.5, -16.0], // West outer pier head
      [-24.5, -2.0],  // Center pier west head
      [-20.5, 2.0],   // Center pier east head
      [-20.5, 14.5],  // East outer pier head
      [-13.0, -16.0], // Mid west fender
      [-10.0, 14.5]   // Mid east fender
    ];

    dolphinPositions.forEach(([dx, dz]) => {
      const dolphinGroup = new THREE.Group();
      dolphinGroup.position.set(dx, 0, dz);

      const pileOffsets = [
        [0, 0], [0.42, 0], [-0.42, 0],
        [0.21, 0.38], [-0.21, 0.38], [0.21, -0.38], [-0.21, -0.38]
      ];

      pileOffsets.forEach(([px, pz]) => {
        const log = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 5.5, 8), woodCreosoteMat);
        log.position.set(px, 2.2 + (Math.sin(px * 10 + pz) * 0.15), pz);
        log.castShadow = true;
        dolphinGroup.add(log);
      });

      [1.5, 2.8, 4.2].forEach(by => {
        const band = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.16, 12), metalBandMat);
        band.position.y = by;
        dolphinGroup.add(band);
      });

      slipsGroup.add(dolphinGroup);
    });

    // 5. Wooden Slip Guide Walls / Rubbing Strakes
    // Berth 1 guides (z = -14.6 and z = -2.1)
    const rackW1 = new THREE.Mesh(new THREE.BoxGeometry(22.0, 1.8, 0.35), woodPlankMat);
    rackW1.position.set(-11.0, 1.5, -14.6);
    slipsGroup.add(rackW1);

    const rackW2 = new THREE.Mesh(new THREE.BoxGeometry(20.0, 1.8, 0.35), woodPlankMat);
    rackW2.position.set(-10.0, 1.5, -2.1);
    slipsGroup.add(rackW2);

    // Berth 2 guides (z = +2.1 and z = +13.2)
    const rackE1 = new THREE.Mesh(new THREE.BoxGeometry(18.0, 1.8, 0.35), woodPlankMat);
    rackE1.position.set(-9.0, 1.5, 2.1);
    slipsGroup.add(rackE1);

    const rackE2 = new THREE.Mesh(new THREE.BoxGeometry(16.0, 1.8, 0.35), woodPlankMat);
    rackE2.position.set(-8.0, 1.5, 13.2);
    slipsGroup.add(rackE2);

    // 6. Overhead Hydraulic Apron Gantries
    let apron1 = null;
    let apron2 = null;

    [[-8.5, 12.0], [8.0, 9.0]].forEach(([slipZ, spanW], idx) => {
      const gantry = new THREE.Group();
      gantry.position.set(-2.5, 0, slipZ);

      [-spanW * 0.45, spanW * 0.45].forEach(zCol => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.6, 6.5, 0.6), steelGantryMat);
        col.position.set(0, 3.25, zCol);
        col.castShadow = true;
        gantry.add(col);
      });

      const beam = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.8, spanW), steelGantryMat);
      beam.position.set(0, 6.2, 0);
      gantry.add(beam);

      const winch = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 1.8), metalBandMat);
      winch.position.set(0, 6.9, 0);
      gantry.add(winch);

      const apron = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.35, spanW * 0.6), steelGantryMat);
      apron.position.set(-2.5, 1.8, 0);
      apron.rotation.z = -0.12;
      gantry.add(apron);

      if (idx === 0) apron1 = apron;
      else apron2 = apron;

      slipsGroup.add(gantry);
    });

    // 7. Dock Bollards
    [-15.0, -8.5, 0, 8.0, 15.0].forEach(bz => {
      const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.65, 8), bollardMat);
      bollard.position.set(1.5, 2.9, bz);
      slipsGroup.add(bollard);
    });

    return { group: slipsGroup, materials, primaryMat: concreteMat, apron1, apron2 };
  }

  // -------------------------------------------------------------------------
  // ADRIFT HARBOR TANKER BARGE (Sandy "John B. Caddell" Benchmark)
  // -------------------------------------------------------------------------
  function createHarborTankerBarge() {
    const bargeGroup = new THREE.Group();
    const materials = [];

    const hullSteelMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.45, metalness: 0.55 });
    const redBottomMat = new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.5 });
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.3 });
    const deckhouseMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.6 });
    materials.push(hullSteelMat, redBottomMat, pipeMat, deckhouseMat, blackMat);

    // Heavy steel barge hull (18m x 5.8m x 2.0m)
    const hull = new THREE.Mesh(new THREE.BoxGeometry(5.8, 2.0, 18.0), hullSteelMat);
    hull.position.y = 1.0;
    hull.castShadow = true;
    bargeGroup.add(hull);

    // Red anti-fouling lower keel
    const keel = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.5, 17.6), redBottomMat);
    keel.position.y = 0.2;
    bargeGroup.add(keel);

    // Raked bow wedge
    const bow = new THREE.Mesh(new THREE.BoxGeometry(5.8, 1.4, 2.4), hullSteelMat);
    bow.position.set(0, 1.3, -9.8);
    bow.rotation.x = -0.35;
    bargeGroup.add(bow);

    // Cylindrical cargo expansion domes (4 tanks)
    [-5.5, -1.8, 1.8, 5.5].forEach(zTank => {
      const dome = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.8, 14), hullSteelMat);
      dome.position.set(0, 2.3, zTank);
      dome.castShadow = true;
      bargeGroup.add(dome);

      const hatch = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.25, 8), blackMat);
      hatch.position.set(0, 2.8, zTank);
      bargeGroup.add(hatch);
    });

    // Longitudinal deck piping manifold
    [-1.3, 1.3].forEach(xPipe => {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 13.0, 8), pipeMat);
      pipe.rotation.x = Math.PI * 0.5;
      pipe.position.set(xPipe, 2.15, 0);
      bargeGroup.add(pipe);
    });

    // Aft Operator Deckhouse & Exhaust Mast
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.8, 3.0), deckhouseMat);
    cabin.position.set(0, 2.8, 7.0);
    cabin.castShadow = true;
    bargeGroup.add(cabin);

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.8, 8), blackMat);
    mast.position.set(0, 4.6, 6.8);
    bargeGroup.add(mast);

    return { group: bargeGroup, materials, primaryMat: hullSteelMat };
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

  // Approach Roadway Decks (Staten Island & Brooklyn remain rooted to shore anchorages in vzGroup)
  const vzAppLen = vzAnchorZ - vzTowerZ; // 12.0m
  [-1, 1].forEach((sign) => {
    const centerZ = sign * (vzTowerZ + vzAppLen * 0.5);
    const appDeck = new THREE.Mesh(new THREE.BoxGeometry(7.6, 2.2, vzAppLen), steelGreenMat);
    appDeck.position.set(0, 13.0, centerZ);
    appDeck.castShadow = true;
    vzGroup.add(appDeck);

    const appRoad = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.2, vzAppLen), tarmacMat);
    appRoad.position.set(0, 14.15, centerZ);
    vzGroup.add(appRoad);
  });

  // Shore Catenary Suspension Cables (Anchorage to Tower in vzGroup)
  [-2.6, 2.6].forEach((cableX) => {
    // Staten Island Shore Cable: -vzAnchorZ to -vzTowerZ
    const ptsSI = [];
    ptsSI.push(new THREE.Vector3(cableX, 7.0, -vzAnchorZ));
    ptsSI.push(new THREE.Vector3(cableX, 20.0, -vzTowerZ * 1.3));
    ptsSI.push(new THREE.Vector3(cableX, vzTowerH + 5.2, -vzTowerZ));
    const catSI = new THREE.CatmullRomCurve3(ptsSI);
    vzGroup.add(new THREE.Mesh(new THREE.TubeGeometry(catSI, 20, 0.22, 8, false), steelCableMat));

    // Brooklyn Shore Cable: vzTowerZ to vzAnchorZ
    const ptsBK = [];
    ptsBK.push(new THREE.Vector3(cableX, vzTowerH + 5.2, vzTowerZ));
    ptsBK.push(new THREE.Vector3(cableX, 20.0, vzTowerZ * 1.3));
    ptsBK.push(new THREE.Vector3(cableX, 7.0, vzAnchorZ));
    const catBK = new THREE.CatmullRomCurve3(ptsBK);
    vzGroup.add(new THREE.Mesh(new THREE.TubeGeometry(catBK, 20, 0.22, 8, false), steelCableMat));
  });

  const vzQuat = new THREE.Quaternion().setFromRotationMatrix(vzBasis);

  // Tower Upper Cross-Struts Fracture and topple into The Narrows (uTrigger = 0.112, 0.116)
  [-vzTowerZ, vzTowerZ].forEach((tZ, idx) => {
    const strutMesh = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.8, 2.4), steelGreenMat.clone());
    const pos = fVz.pt.clone().addScaledVector(fVz.side, tZ).addScaledVector(fVz.up, 32.0);
    strutMesh.quaternion.copy(vzQuat);
    registerWipeable(strutMesh, 0.112 + idx * 0.004, pos, fVz.tangent, fVz.side, {
      primaryMat: strutMesh.material,
      collapseTilt: idx === 0 ? 0.65 : -0.65,
      tumbleScale: 6.0,
      sinkScale: 0.35,
      driftSpeed: 30.0
    });
  });

  // CATASTROPHIC VERRAZZANO SUSPENSION BRIDGE SHATTERING & COLLAPSE (uTrigger = 0.108 - 0.114)
  const vzCenterHalfLen = vzTowerZ; // 19.2m

  // 1. Staten Island Center Suspended Half-Span (Z in [-19.2, 0])
  {
    const spanSI = new THREE.Group();
    const posSI = fVz.pt.clone().addScaledVector(fVz.side, -vzCenterHalfLen * 0.5).addScaledVector(fVz.up, 13.0);
    spanSI.quaternion.copy(vzQuat);

    const deckSI = new THREE.Mesh(new THREE.BoxGeometry(7.6, 2.2, vzCenterHalfLen), steelGreenMat.clone());
    deckSI.castShadow = true;
    spanSI.add(deckSI);

    const roadSI = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.2, vzCenterHalfLen), tarmacMat.clone());
    roadSI.position.y = 1.15;
    spanSI.add(roadSI);

    // Snapped Catenary Main Suspension Cables (North & South)
    [-2.6, 2.6].forEach((cX) => {
      const pts = [];
      pts.push(new THREE.Vector3(cX, vzTowerH + 5.2 - 13.0, -vzCenterHalfLen * 0.5));
      pts.push(new THREE.Vector3(cX, 14.5 - 13.0, vzCenterHalfLen * 0.5));
      const cat = new THREE.CatmullRomCurve3(pts);
      spanSI.add(new THREE.Mesh(new THREE.TubeGeometry(cat, 16, 0.20, 8, false), steelCableMat.clone()));

      for (let sZ = -vzCenterHalfLen * 0.45; sZ <= vzCenterHalfLen * 0.45; sZ += 2.4) {
        const norm = (sZ + vzCenterHalfLen * 0.5) / vzCenterHalfLen;
        const yCab = (1.0 - norm) * (vzTowerH + 5.2 - 13.0) + norm * 1.5;
        const sH = Math.max(0.4, yCab - 1.15);
        const susp = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, sH, 6), steelCableMat.clone());
        susp.position.set(cX, 1.15 + sH * 0.5, sZ);
        spanSI.add(susp);
      }
    });

    [-3.6, 3.6].forEach((gX) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.9, vzCenterHalfLen), steelGreenMat.clone());
      rail.position.set(gX, 1.55, 0);
      spanSI.add(rail);
    });

    registerWipeable(spanSI, 0.108, posSI, fVz.tangent, fVz.side, {
      collapseTilt: -0.64,
      collapseTiltX: 0.22,
      driftSpeed: 35.0,
      tumbleScale: 5.0,
      sinkScale: 0.40,
      maxProg: 0.16
    });
  }

  // 2. Brooklyn Center Suspended Half-Span (Z in [0, 19.2])
  {
    const spanBK = new THREE.Group();
    const posBK = fVz.pt.clone().addScaledVector(fVz.side, vzCenterHalfLen * 0.5).addScaledVector(fVz.up, 13.0);
    spanBK.quaternion.copy(vzQuat);

    const deckBK = new THREE.Mesh(new THREE.BoxGeometry(7.6, 2.2, vzCenterHalfLen), steelGreenMat.clone());
    deckBK.castShadow = true;
    spanBK.add(deckBK);

    const roadBK = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.2, vzCenterHalfLen), tarmacMat.clone());
    roadBK.position.y = 1.15;
    spanBK.add(roadBK);

    [-2.6, 2.6].forEach((cX) => {
      const pts = [];
      pts.push(new THREE.Vector3(cX, 14.5 - 13.0, -vzCenterHalfLen * 0.5));
      pts.push(new THREE.Vector3(cX, vzTowerH + 5.2 - 13.0, vzCenterHalfLen * 0.5));
      const cat = new THREE.CatmullRomCurve3(pts);
      spanBK.add(new THREE.Mesh(new THREE.TubeGeometry(cat, 16, 0.20, 8, false), steelCableMat.clone()));

      for (let sZ = -vzCenterHalfLen * 0.45; sZ <= vzCenterHalfLen * 0.45; sZ += 2.4) {
        const norm = (sZ + vzCenterHalfLen * 0.5) / vzCenterHalfLen;
        const yCab = norm * (vzTowerH + 5.2 - 13.0) + (1.0 - norm) * 1.5;
        const sH = Math.max(0.4, yCab - 1.15);
        const susp = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, sH, 6), steelCableMat.clone());
        susp.position.set(cX, 1.15 + sH * 0.5, sZ);
        spanBK.add(susp);
      }
    });

    [-3.6, 3.6].forEach((gX) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.9, vzCenterHalfLen), steelGreenMat.clone());
      rail.position.set(gX, 1.55, 0);
      spanBK.add(rail);
    });

    registerWipeable(spanBK, 0.114, posBK, fVz.tangent, fVz.side, {
      collapseTilt: 0.64,
      collapseTiltX: -0.22,
      driftSpeed: 35.0,
      tumbleScale: 5.0,
      sinkScale: 0.40,
      maxProg: 0.16
    });
  }

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

  // -------------------------------------------------------------------------
  // STATEN ISLAND FERRY WHITEHALL TERMINAL SLIPS & VESSELS (u = 0.50 - 0.54)
  // -------------------------------------------------------------------------
  const whitehallSlips = createWhitehallFerrySlips();
  whitehallSlips.group.position.set(fMan.side.x * 11.0, 1.2, 22.0);
  manGroup.add(whitehallSlips.group);

  // 1. Staten Island Ferry (Moored in Berth 1 at z = 22.0 - 8.5 = 13.5, oriented along slip pocket)
  const siFerryObj = createStatenIslandFerry();
  siFerryObj.group.position.set(fMan.side.x * 11.0 - 13.0, 1.8, 22.0 - 8.5);
  siFerryObj.group.rotation.y = Math.PI * 0.5;
  manGroup.add(siFerryObj.group);

  // 2. NYC Fast Catamaran (Moored in Berth 2 at z = 22.0 + 8.0 = 30.0, oriented along slip pocket)
  const catamaranObj = createNYCFerryCatamaran();
  catamaranObj.group.position.set(fMan.side.x * 11.0 - 10.0, 1.7, 22.0 + 8.0);
  catamaranObj.group.rotation.y = Math.PI * 0.5;
  manGroup.add(catamaranObj.group);

  // 3. Adrift Commercial Tanker Barge ("John B. Caddell" Benchmark in Upper Bay fairway)
  const tankerBargeObj = createHarborTankerBarge();
  const fTanker = getRiverFrame(0.40);
  const tankerPos = fTanker.pt.clone().addScaledVector(fTanker.side, -14.0);
  tankerPos.y = 1.6;
  tankerBargeObj.group.position.copy(tankerPos);
  tankerBargeObj.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fTanker.tangent);
  group.add(tankerBargeObj.group);

  vesselsObj = {
    siFerry: {
      group: siFerryObj.group,
      basePos: siFerryObj.group.position.clone(),
      baseRot: siFerryObj.group.rotation.clone(),
      materials: siFerryObj.materials
    },
    catamaran: {
      group: catamaranObj.group,
      basePos: catamaranObj.group.position.clone(),
      baseRot: catamaranObj.group.rotation.clone(),
      materials: catamaranObj.materials
    },
    tankerBarge: {
      group: tankerBargeObj.group,
      basePos: tankerBargeObj.group.position.clone(),
      baseRot: tankerBargeObj.group.rotation.clone(),
      materials: tankerBargeObj.materials
    },
    slipAprons: {
      apron1: whitehallSlips.apron1,
      apron2: whitehallSlips.apron2,
      baseApron1Y: whitehallSlips.apron1 ? whitehallSlips.apron1.position.y : 1.8,
      baseApron2Y: whitehallSlips.apron2 ? whitehallSlips.apron2.position.y : 1.8
    }
  };

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
    { offSide: 28.0, offTan: -6.0, w: 11, d: 11, h: 68, mat: oneWtcMat, is1WTC: true },
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
      const chamferCrown = new THREE.Mesh(new THREE.CylinderGeometry(t.w * 0.35, t.w * 0.5, 6.0, 8), oneWtcMat);
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
  // Subsurface Cutaway Metro Station Vault relocated to open Battery Park lawn near Castle Clinton (u = 0.47)
  const fSubVault = getRiverFrame(0.47);
  metroStation = buildSubsurfaceMetroStationCutaway(fSubVault);

  // The 7 Historical Under-River Transit Tubes Crossing Upper NY Bay & East River (evenly spaced, non-overlapping)
  const tubeConfigs = [
    {
      id: 'battery_tunnel',
      name: 'Hugh L. Carey (Battery) Tunnel',
      bullets: 'VEHICULAR',
      desc: 'Twin Road Tubes • 86M Gal Inundation',
      u: 0.45,
      uTrigger: 0.45,
      isVehicular: true,
      lineColor: 0x0284c7,
      tubeSpan: 36.0,
      radius: 2.5
    },
    {
      id: 'south_ferry_tube',
      name: 'South Ferry Loop Tube',
      bullets: '(1)',
      desc: '1 Subway • 14.5M Gal Terminal Flooding',
      u: 0.49,
      uTrigger: 0.49,
      isVehicular: false,
      lineColor: 0xdc2626,
      tubeSpan: 32.0,
      radius: 2.4
    },
    {
      id: 'joralemon_tube',
      name: 'Joralemon Street Tube',
      bullets: '(4)(5)',
      desc: '4/5 Subway • 1908 Historic River Crossing',
      u: 0.55,
      uTrigger: 0.55,
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
      u: 0.61,
      uTrigger: 0.61,
      isVehicular: false,
      lineColor: 0xdc2626,
      tubeSpan: 34.0,
      radius: 2.4
    },
    {
      id: 'montague_tube',
      name: 'Montague Street Tube',
      bullets: '(N)(R)',
      desc: 'N/R Subway • 27M Gal Saltwater Breach',
      u: 0.67,
      uTrigger: 0.67,
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
      u: 0.73,
      uTrigger: 0.73,
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
      u: 0.81,
      uTrigger: 0.81,
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

  // -------------------------------------------------------------------------
  // 8. ELEVATED METRO VIADUCT, SOUTH FERRY TERMINAL & 4-CAR MTA SUBWAY TRAIN
  // -------------------------------------------------------------------------
  const viaductGroup = new THREE.Group();
  const numBents = 14;
  const bentFrames = [];

  const viadSteelMat  = new THREE.MeshStandardMaterial({ color: 0x1e3a2b, roughness: 0.45, metalness: 0.75 }); // NYC transit dark green steel
  const trackBedMat   = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
  const sleeperMat    = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 });
  const railSteelMat  = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.95 });
  const thirdRailMat  = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.45 });
  const platformMat   = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.6 });
  const yellowEdgeMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35 });
  const stationRoofMat= new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.4, metalness: 0.5 });
  const stationSignMat= new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });

  for (let b = 0; b < numBents; b++) {
    const uViad = 0.46 + b * 0.015; // spans u = 0.46 to 0.655
    const fV = getRiverFrame(uViad);
    const deckCenter = fV.pt.clone().addScaledVector(fV.side, 18.2);
    const groundY = getGroundY(deckCenter.x, deckCenter.z, 2.7);
    const deckY = 11.2;
    deckCenter.y = deckY;
    bentFrames.push({ u: uViad, deckCenter, f: fV, groundY, deckY });

    // Steel Trestle Bents (Twin heavy H-columns with cross lacing)
    const colH = deckY - groundY;
    const colY = groundY + colH * 0.5;

    // Dual columns spaced 6.2m apart laterally
    [-3.1, 3.1].forEach(colOff => {
      const colPos = deckCenter.clone().addScaledVector(fV.side, colOff);
      colPos.y = colY;

      const col = new THREE.Mesh(new THREE.BoxGeometry(0.7, colH, 0.7), viadSteelMat);
      col.position.copy(colPos);
      col.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fV.tangent);
      col.castShadow = true;
      col.receiveShadow = true;
      viaductGroup.add(col);

      // Heavy concrete footing block at ground level
      const footing = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 1.4), concreteMat);
      footing.position.copy(colPos);
      footing.position.y = groundY + 0.3;
      viaductGroup.add(footing);
    });

    // Transverse Heavy Cross Girder at top of bent
    const crossGirder = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.7, 0.8), viadSteelMat);
    crossGirder.position.copy(deckCenter);
    crossGirder.position.y = deckY - 0.35;
    crossGirder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fV.tangent);
    crossGirder.rotateY(Math.PI * 0.5);
    crossGirder.castShadow = true;
    viaductGroup.add(crossGirder);

    // Diagonal Cross Bracing (X-struts) between twin columns
    const braceLen = Math.sqrt(6.2 * 6.2 + colH * colH * 0.6 * 0.6);
    const braceAng = Math.atan2(colH * 0.6, 6.2);
    [-1, 1].forEach(dir => {
      const brace = new THREE.Mesh(new THREE.BoxGeometry(braceLen, 0.22, 0.22), viadSteelMat);
      brace.position.copy(deckCenter);
      brace.position.y = colY;
      brace.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fV.tangent);
      brace.rotateY(Math.PI * 0.5);
      brace.rotateZ(dir * braceAng);
      viaductGroup.add(brace);
    });
  }

  // Longitudinal Spans: Girders, Track Deck, Ties, Rails & Third Rails
  for (let b = 0; b < numBents - 1; b++) {
    const b1 = bentFrames[b];
    const b2 = bentFrames[b + 1];
    const spanCenter = b1.deckCenter.clone().add(b2.deckCenter).multiplyScalar(0.5);
    const spanVec = b2.deckCenter.clone().sub(b1.deckCenter);
    const spanLen = spanVec.length();
    const spanDir = spanVec.clone().normalize();

    // 4 Longitudinal Plate Girders carrying the deck
    [-2.8, -1.0, 1.0, 2.8].forEach(gOff => {
      const gPos = spanCenter.clone().addScaledVector(b1.f.side, gOff);
      gPos.y = b1.deckY - 0.45;
      const girder = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.9, spanLen), viadSteelMat);
      girder.position.copy(gPos);
      girder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), spanDir);
      girder.castShadow = true;
      viaductGroup.add(girder);
    });

    // Solid Deck Bed Slab
    const deckSlab = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.25, spanLen), trackBedMat);
    deckSlab.position.copy(spanCenter);
    deckSlab.position.y = b1.deckY;
    deckSlab.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), spanDir);
    viaductGroup.add(deckSlab);

    // Track Cross-Ties (Sleepers) along the span
    const numTies = Math.floor(spanLen / 0.85);
    for (let ti = 0; ti < numTies; ti++) {
      const alpha = (ti + 0.5) / numTies;
      const tiePos = b1.deckCenter.clone().lerp(b2.deckCenter, alpha);
      tiePos.y = b1.deckY + 0.18;

      // Inbound track tie
      const tie1 = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.16, 0.28), sleeperMat);
      tie1.position.copy(tiePos).addScaledVector(b1.f.side, -1.9);
      tie1.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), spanDir);
      tie1.rotateY(Math.PI * 0.5);
      viaductGroup.add(tie1);

      // Outbound track tie
      const tie2 = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.16, 0.28), sleeperMat);
      tie2.position.copy(tiePos).addScaledVector(b1.f.side, 1.9);
      tie2.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), spanDir);
      tie2.rotateY(Math.PI * 0.5);
      viaductGroup.add(tie2);
    }

    // Dual Running Rails (Track 1: side -1.9 ± 0.75, Track 2: side +1.9 ± 0.75)
    [-2.65, -1.15, 1.15, 2.65].forEach(rOff => {
      const railPos = spanCenter.clone().addScaledVector(b1.f.side, rOff);
      railPos.y = b1.deckY + 0.32;
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, spanLen), railSteelMat);
      rail.position.copy(railPos);
      rail.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), spanDir);
      viaductGroup.add(rail);
    });

    // Outer Third Rails (600V DC Conductor Rail with safety timber cover)
    [-3.3, 3.3].forEach(trOff => {
      const trPos = spanCenter.clone().addScaledVector(b1.f.side, trOff);
      trPos.y = b1.deckY + 0.38;
      const tr = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, spanLen), thirdRailMat);
      tr.position.copy(trPos);
      tr.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), spanDir);
      viaductGroup.add(tr);
    });

    // Safety Walkway Handrails along both edges
    [-3.65, 3.65].forEach(hrOff => {
      const hrPos = spanCenter.clone().addScaledVector(b1.f.side, hrOff);
      hrPos.y = b1.deckY + 0.65;
      const hr = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, spanLen), viadSteelMat);
      hr.position.copy(hrPos);
      hr.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), spanDir);
      viaductGroup.add(hr);
    });
  }

  // Elevated Station ("South Ferry Elevated Viaduct Terminal") at bents 5 - 7
  {
    const stBent1 = bentFrames[5];
    const stBent2 = bentFrames[7];
    const stCenter = stBent1.deckCenter.clone().lerp(stBent2.deckCenter, 0.5);
    const stVec = stBent2.deckCenter.clone().sub(stBent1.deckCenter);
    const stLen = stVec.length() + 4.0;
    const stDir = stVec.clone().normalize();

    // Raised Concrete Platform (adjacent to outbound track at side +1.9, train right edge at +3.3)
    const platW = 2.7;
    const platSideOff = 4.75; // inner edge at 4.75 - 1.35 = 3.40 (0.1m clearance from 2.8m train)
    const stPlat = new THREE.Mesh(new THREE.BoxGeometry(platW, 0.45, stLen), platformMat);
    stPlat.position.copy(stCenter).addScaledVector(stBent1.f.side, platSideOff);
    stPlat.position.y = stBent1.deckY + 0.5;
    stPlat.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), stDir);
    stPlat.castShadow = true;
    stPlat.receiveShadow = true;
    viaductGroup.add(stPlat);

    // Yellow Tactile Safety Warning Strip along platform edge facing the track
    const tactileStrip = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.47, stLen), yellowEdgeMat);
    tactileStrip.position.copy(stPlat.position).addScaledVector(stBent1.f.side, -1.18);
    tactileStrip.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), stDir);
    viaductGroup.add(tactileStrip);

    // Arched Station Canopy Roof & Steel Trusses
    const canopyRoof = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.25, stLen), stationRoofMat);
    canopyRoof.position.copy(stPlat.position);
    canopyRoof.position.y = stBent1.deckY + 4.2;
    canopyRoof.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), stDir);
    canopyRoof.castShadow = true;
    viaductGroup.add(canopyRoof);

    // Station Canopy Columns (along centerline of platform)
    for (let cp = -stLen * 0.4; cp <= stLen * 0.4; cp += 6.0) {
      const cPost = new THREE.Mesh(new THREE.BoxGeometry(0.24, 3.8, 0.24), viadSteelMat);
      cPost.position.copy(stPlat.position).addScaledVector(stDir, cp);
      cPost.position.y = stBent1.deckY + 2.4;
      viaductGroup.add(cPost);
    }

    // MTA Enamel Station Nameplate: "SOUTH FERRY ELEVATED TERMINAL"
    const stSign = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.6, 6.5), stationSignMat);
    stSign.position.copy(stPlat.position);
    stSign.position.y = stBent1.deckY + 3.2;
    stSign.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), stDir);
    viaductGroup.add(stSign);

    const stSignText = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.35, 6.0), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    stSignText.position.copy(stSign.position);
    viaductGroup.add(stSignText);

    // Mezzanine Covered Stairway Tower descending to street level
    const stairH = stBent1.deckY - stBent1.groundY;
    const stairTower = new THREE.Mesh(new THREE.BoxGeometry(2.8, stairH, 4.2), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 }));
    stairTower.position.copy(stPlat.position).addScaledVector(stBent1.f.side, 2.2);
    stairTower.position.y = stBent1.groundY + stairH * 0.5;
    stairTower.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), stDir);
    stairTower.castShadow = true;
    viaductGroup.add(stairTower);
  }

  // 2-Car MTA Stainless Steel Subway Train Set docked along elevated outbound track at platform
  {
    const trainSet = createMTASubwayTrain();
    const stBent1 = bentFrames[5];
    const stBent2 = bentFrames[7];
    const stCenter = stBent1.deckCenter.clone().lerp(stBent2.deckCenter, 0.5);
    const stDir = stBent2.deckCenter.clone().sub(stBent1.deckCenter).normalize();
    const trainPos = stCenter.clone().addScaledVector(stBent1.f.side, 1.9);
    trainPos.y = stBent1.deckY + 0.32;

    trainSet.group.position.copy(trainPos);
    trainSet.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), stDir);
    viaductGroup.add(trainSet.group);
  }

  group.add(viaductGroup);

  // -------------------------------------------------------------------------
  // 9. ACTIVE BUOYANT FLOATING CARS & MARITIME DEBRIS FLOTILLA
  // -------------------------------------------------------------------------
  const floatingFlotilla = [];

  const flotillaSpecs = [
    // 10 Buoyant Vehicles (Yellow Cabs, NYPD Patrol Cruisers, Sedans, Delivery Vans)
    { kind: 'vehicle', sub: 'cab',    u: 0.22, side:  6.5, rotY:  0.35, drift: 0.52, bAmp: 0.32, bFreq: 3.2, pFreq: 2.1, rFreq: 1.8 },
    { kind: 'vehicle', sub: 'cop',    u: 0.28, side: -8.0, rotY: -0.25, drift: 0.58, bAmp: 0.35, bFreq: 3.5, pFreq: 2.3, rFreq: 2.0 },
    { kind: 'vehicle', sub: 'van',    u: 0.34, side:  7.5, rotY:  0.45, drift: 0.48, bAmp: 0.28, bFreq: 2.8, pFreq: 1.9, rFreq: 1.6, hex: 0x0284c7 },
    { kind: 'vehicle', sub: 'sedan',  u: 0.42, side: -9.0, rotY: -0.60, drift: 0.55, bAmp: 0.30, bFreq: 3.1, pFreq: 2.2, rFreq: 1.9, hex: 0x94a3b8 },
    { kind: 'vehicle', sub: 'cab',    u: 0.47, side: -6.5, rotY:  0.20, drift: 0.50, bAmp: 0.34, bFreq: 3.4, pFreq: 2.4, rFreq: 1.7 },
    { kind: 'vehicle', sub: 'cop',    u: 0.53, side: -8.5, rotY:  0.75, drift: 0.60, bAmp: 0.36, bFreq: 3.6, pFreq: 2.5, rFreq: 2.1 },
    { kind: 'vehicle', sub: 'van',    u: 0.58, side: -7.0, rotY: -0.40, drift: 0.46, bAmp: 0.26, bFreq: 2.7, pFreq: 1.8, rFreq: 1.5, hex: 0x15803d },
    { kind: 'vehicle', sub: 'sedan',  u: 0.64, side:  8.5, rotY:  0.55, drift: 0.54, bAmp: 0.32, bFreq: 3.3, pFreq: 2.2, rFreq: 1.8, hex: 0xb91c1c },
    { kind: 'vehicle', sub: 'cab',    u: 0.70, side: -6.5, rotY: -0.30, drift: 0.52, bAmp: 0.33, bFreq: 3.2, pFreq: 2.1, rFreq: 1.9 },
    { kind: 'vehicle', sub: 'sedan',  u: 0.78, side:  7.0, rotY:  0.40, drift: 0.56, bAmp: 0.30, bFreq: 3.0, pFreq: 2.0, rFreq: 1.7, hex: 0x1e3a8a },

    // 14 Floating Maritime & Urban Debris (Shipping Containers, Pallets, Steel Drums, Logs)
    { kind: 'debris', sub: 'container', u: 0.18, side: -5.0, rotY:  0.50, drift: 0.62, bAmp: 0.25, bFreq: 2.4, pFreq: 1.6, rFreq: 1.4, hex: 0x0284c7 },
    { kind: 'debris', sub: 'pallet',    u: 0.24, side:  4.0, rotY: -0.80, drift: 0.68, bAmp: 0.42, bFreq: 4.2, pFreq: 2.8, rFreq: 2.5 },
    { kind: 'debris', sub: 'drums',     u: 0.30, side: -6.5, rotY:  0.30, drift: 0.65, bAmp: 0.38, bFreq: 3.8, pFreq: 2.6, rFreq: 2.2 },
    { kind: 'debris', sub: 'log',       u: 0.36, side:  5.5, rotY:  0.90, drift: 0.60, bAmp: 0.35, bFreq: 3.5, pFreq: 2.4, rFreq: 2.0 },
    { kind: 'debris', sub: 'container', u: 0.44, side: -7.5, rotY: -0.45, drift: 0.58, bAmp: 0.24, bFreq: 2.3, pFreq: 1.5, rFreq: 1.3, hex: 0x065f46 },
    { kind: 'debris', sub: 'pallet',    u: 0.49, side: -4.5, rotY:  0.65, drift: 0.70, bAmp: 0.44, bFreq: 4.4, pFreq: 3.0, rFreq: 2.6 },
    { kind: 'debris', sub: 'drums',     u: 0.55, side: -5.0, rotY: -0.55, drift: 0.64, bAmp: 0.37, bFreq: 3.7, pFreq: 2.5, rFreq: 2.3 },
    { kind: 'debris', sub: 'container', u: 0.60, side: -8.0, rotY:  0.35, drift: 0.60, bAmp: 0.26, bFreq: 2.5, pFreq: 1.7, rFreq: 1.4, hex: 0xea580c },
    { kind: 'debris', sub: 'log',       u: 0.66, side:  4.0, rotY: -0.70, drift: 0.62, bAmp: 0.36, bFreq: 3.6, pFreq: 2.3, rFreq: 2.1 },
    { kind: 'debris', sub: 'pallet',    u: 0.72, side: -5.5, rotY:  0.40, drift: 0.69, bAmp: 0.41, bFreq: 4.1, pFreq: 2.9, rFreq: 2.4 },
    { kind: 'debris', sub: 'container', u: 0.76, side:  5.0, rotY: -0.60, drift: 0.59, bAmp: 0.25, bFreq: 2.4, pFreq: 1.6, rFreq: 1.3, hex: 0x1e3a8a },
    { kind: 'debris', sub: 'drums',     u: 0.80, side: -4.0, rotY:  0.85, drift: 0.66, bAmp: 0.38, bFreq: 3.9, pFreq: 2.7, rFreq: 2.3 },
    { kind: 'debris', sub: 'pallet',    u: 0.83, side:  3.5, rotY: -0.35, drift: 0.67, bAmp: 0.43, bFreq: 4.3, pFreq: 2.8, rFreq: 2.5 },
    { kind: 'debris', sub: 'log',       u: 0.87, side: -5.0, rotY:  0.50, drift: 0.61, bAmp: 0.35, bFreq: 3.5, pFreq: 2.4, rFreq: 2.0 }
  ];

  flotillaSpecs.forEach((spec, sIdx) => {
    let itemObj = null;
    let isCop = false;
    let lightbarMesh = null;

    if (spec.kind === 'vehicle') {
      if (spec.sub === 'cab') {
        itemObj = createYellowCab();
      } else if (spec.sub === 'cop') {
        itemObj = createNYPDCruiser();
        isCop = true;
        lightbarMesh = itemObj.lightbar;
      } else if (spec.sub === 'van') {
        itemObj = createDeliveryVan(spec.hex || 0x2563eb);
      } else if (spec.sub === 'sedan') {
        itemObj = createSedanCar(spec.hex || 0x94a3b8);
      }
    } else {
      if (spec.sub === 'container') {
        itemObj = createShippingContainer(spec.hex || 0x0284c7);
      } else if (spec.sub === 'pallet') {
        itemObj = createTimberPallet();
      } else if (spec.sub === 'drums') {
        itemObj = createSteelDrumCluster();
      } else if (spec.sub === 'log') {
        itemObj = createDriftwoodBeam();
      }
    }

    if (!itemObj) return;

    const fInit = getRiverFrame(spec.u);
    const startPos = fInit.pt.clone().addScaledVector(fInit.side, spec.side);
    startPos.y = fInit.pt.y + 0.3;

    itemObj.group.position.copy(startPos);
    itemObj.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fInit.tangent);
    itemObj.group.rotateY(spec.rotY);

    group.add(itemObj.group);

    floatingFlotilla.push({
      mesh: itemObj.group,
      uTrigger: spec.u,
      baseSide: spec.side,
      baseRotY: spec.rotY,
      driftRate: spec.drift,
      bobAmp: spec.bAmp,
      bobFreq: spec.bFreq,
      pitchFreq: spec.pFreq,
      rollFreq: spec.rFreq,
      pitchAmp: 0.16,
      rollAmp: 0.14,
      yawRate: 1.2,
      phase: sIdx * 1.37,
      isCop,
      lightbarMesh,
      pristinePos: startPos.clone(),
      pristineQuat: itemObj.group.quaternion.clone()
    });
  });

  function updateFloatingItems(uWave) {
    const timeSec = Date.now() * 0.001;

    for (let i = 0; i < floatingFlotilla.length; i++) {
      const item = floatingFlotilla[i];
      if (uWave <= item.uTrigger) {
        // Pristine resting coordinates & orientation
        item.mesh.position.copy(item.pristinePos);
        item.mesh.quaternion.copy(item.pristineQuat);
        if (item.isCop && item.lightbarMesh) {
          item.lightbarMesh.material.color.setHex(0xef4444);
        }
      } else {
        // Surge arrival! Dynamic hydrodynamic drift & wave bobbing
        const surgeProg = Math.min(1.0, (uWave - item.uTrigger) / (1.0 - item.uTrigger + 0.001));
        const currU = Math.min(0.97, item.uTrigger + surgeProg * item.driftRate * (1.0 - item.uTrigger));
        const f = getRiverFrame(currU);

        // Lateral wander in turbulent current
        const wander = Math.sin(timeSec * 0.8 + item.phase) * 1.5;
        const currSide = item.baseSide + wander;

        // Hydrodynamic vertical heave
        const waterBaseY = f.pt.y + 0.7;
        const bob = Math.sin(timeSec * item.bobFreq + item.phase) * item.bobAmp;

        const pos = f.pt.clone().addScaledVector(f.side, currSide);
        pos.y = waterBaseY + bob;
        item.mesh.position.copy(pos);

        // Hydrodynamic pitch & roll along wave slope
        item.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), f.tangent);
        const pitch = Math.sin(timeSec * item.pitchFreq + item.phase) * item.pitchAmp;
        const roll = Math.cos(timeSec * item.rollFreq + item.phase) * item.rollAmp;
        const yaw = item.baseRotY + surgeProg * item.yawRate;

        item.mesh.rotateY(yaw);
        item.mesh.rotateX(pitch);
        item.mesh.rotateZ(roll);

        // Emergency flashing lightbar for police cruiser
        if (item.isCop && item.lightbarMesh) {
          const strobe = Math.sin(timeSec * 16.0 + item.phase) > 0;
          item.lightbarMesh.material.color.setHex(strobe ? 0xef4444 : 0x3b82f6);
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // 10. ACTIVE PASSING TRAFFIC ON BRIDGES (Verrazzano-Narrows & Brooklyn Bridges)
  // -------------------------------------------------------------------------
  const activeBridgeVehicles = [];

  // Verrazzano Bridge Traffic (10 passing vehicles)
  const vzTrafficDefs = [
    { type: 'cab',   dir:  1, laneX: -1.8, initZ: -28.0, speed: 22.0 },
    { type: 'sedan', dir:  1, laneX: -1.8, initZ: -14.0, speed: 25.0, hex: 0xf8fafc },
    { type: 'van',   dir:  1, laneX: -1.8, initZ:   2.0, speed: 20.0, hex: 0x0284c7 },
    { type: 'sedan', dir:  1, laneX: -1.8, initZ:  16.0, speed: 24.0, hex: 0x3b82f6 },
    { type: 'cab',   dir:  1, laneX: -1.8, initZ: -20.0, speed: 23.0 },

    { type: 'cab',   dir: -1, laneX:  1.8, initZ:  28.0, speed: 22.0 },
    { type: 'sedan', dir: -1, laneX:  1.8, initZ:  12.0, speed: 26.0, hex: 0xb91c1c },
    { type: 'van',   dir: -1, laneX:  1.8, initZ:  -4.0, speed: 19.0, hex: 0x16a34a },
    { type: 'sedan', dir: -1, laneX:  1.8, initZ: -18.0, speed: 24.0, hex: 0x94a3b8 },
    { type: 'cab',   dir: -1, laneX:  1.8, initZ:  20.0, speed: 23.0 }
  ];

  vzTrafficDefs.forEach((def) => {
    const veh = def.type === 'cab' ? createYellowCab() :
                def.type === 'van' ? createDeliveryVan(def.hex) :
                createSedanCar(def.hex);
    group.add(veh.group);

    activeBridgeVehicles.push({
      bridge: 'verrazzano',
      mesh: veh.group,
      dir: def.dir,
      laneX: def.laneX,
      initZ: def.initZ,
      speed: def.speed,
      spanLen: vzSpan * 1.35,
      deckY: 14.3,
      f: fVz,
      basis: vzBasis,
      quat: vzQuat,
      uBreachW: 0.108,
      uBreachE: 0.114,
      plungeZRange: vzTowerZ
    });
  });

  // Brooklyn Bridge Traffic (8 passing vehicles)
  const brTrafficDefs = [
    { type: 'cab',   dir:  1, laneX: -1.9, initZ: -24.0, speed: 18.0 },
    { type: 'sedan', dir:  1, laneX: -1.9, initZ: -10.0, speed: 20.0, hex: 0xf8fafc },
    { type: 'van',   dir:  1, laneX: -1.9, initZ:   6.0, speed: 17.0, hex: 0x0369a1 },
    { type: 'cab',   dir:  1, laneX: -1.9, initZ:  18.0, speed: 19.0 },

    { type: 'cab',   dir: -1, laneX:  1.9, initZ:  24.0, speed: 18.0 },
    { type: 'sedan', dir: -1, laneX:  1.9, initZ:   8.0, speed: 21.0, hex: 0xb91c1c },
    { type: 'van',   dir: -1, laneX:  1.9, initZ:  -8.0, speed: 17.0, hex: 0xd97706 },
    { type: 'sedan', dir: -1, laneX:  1.9, initZ: -20.0, speed: 19.0, hex: 0x334155 }
  ];

  brTrafficDefs.forEach((def) => {
    const veh = def.type === 'cab' ? createYellowCab() :
                def.type === 'van' ? createDeliveryVan(def.hex) :
                createSedanCar(def.hex);
    group.add(veh.group);

    activeBridgeVehicles.push({
      bridge: 'brooklyn',
      mesh: veh.group,
      dir: def.dir,
      laneX: def.laneX,
      initZ: def.initZ,
      speed: def.speed,
      spanLen: brSpan * 1.36,
      deckY: 13.2,
      f: fBr,
      basis: brBasis,
      quat: brQuat,
      uBreachW: 0.738,
      uBreachE: 0.742,
      plungeZRange: brTowerZ
    });
  });

  function updateBridgeTraffic(t, uWave) {
    for (let i = 0; i < activeBridgeVehicles.length; i++) {
      const v = activeBridgeVehicles[i];
      const spanHalf = v.spanLen * 0.5;

      const dist = v.initZ + v.dir * v.speed * (t * 36.0);
      let localZ = ((dist % v.spanLen) + v.spanLen) % v.spanLen - spanHalf;

      const worldPos = v.f.pt.clone()
        .addScaledVector(v.f.side, localZ)
        .addScaledVector(v.f.tangent, v.laneX);
      worldPos.y = v.deckY;

      let isPlunging = false;
      let plungeProg = 0.0;
      let plungeSign = 1.0;

      if (Math.abs(localZ) <= v.plungeZRange) {
        if (localZ < 0 && uWave >= v.uBreachW) {
          isPlunging = true;
          plungeProg = Math.min(1.0, (uWave - v.uBreachW) / 0.045);
          plungeSign = -1.0;
        } else if (localZ >= 0 && uWave >= v.uBreachE) {
          isPlunging = true;
          plungeProg = Math.min(1.0, (uWave - v.uBreachE) / 0.045);
          plungeSign = 1.0;
        }
      }

      if (isPlunging) {
        worldPos.y -= plungeProg * 14.0;
        worldPos.addScaledVector(v.f.tangent, plungeProg * 3.0 * (v.laneX > 0 ? 1 : -1));
        v.mesh.position.copy(worldPos);
        v.mesh.quaternion.copy(v.quat);
        v.mesh.rotateZ(plungeSign * plungeProg * 1.2);
        v.mesh.rotateX(plungeProg * 0.8);
      } else {
        v.mesh.position.copy(worldPos);
        v.mesh.quaternion.copy(v.quat);
        if (v.dir < 0) {
          v.mesh.rotateY(Math.PI);
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // 11. DENSE WATERFRONT BANK BUILDINGS (MANHATTAN & BROOKLYN SHORELINES)
  // -------------------------------------------------------------------------
  const bankBuildingsGroup = new THREE.Group();

  const bankBuildingSpecs = [
    // --- MANHATTAN EAST RIVER & FDR DRIVE WATERFRONT (u = 0.58 - 0.84) ---
    { u: 0.58, side: 29.0, tan:  4.0, w: 10.0, d: 9.0, h: 36.0, mat: stoneTowerMat, isArtDeco: true },
    { u: 0.60, side: 33.0, tan: -6.0, w: 12.0, d: 10.0, h: 42.0, mat: glassTowerMat1 },
    { u: 0.63, side: 30.0, tan:  8.0, w: 9.0,  d: 8.5, h: 34.0, mat: stoneTowerMat },
    { u: 0.65, side: 35.0, tan: -4.0, w: 11.0, d: 11.0, h: 46.0, mat: glassTowerMat2 },
    { u: 0.68, side: 29.0, tan:  6.0, w: 9.5,  d: 9.0, h: 32.0, mat: stoneTowerMat, isArtDeco: true },
    { u: 0.70, side: 31.0, tan: -8.0, w: 10.0, d: 9.0, h: 40.0, mat: glassTowerMat1 },
    { u: 0.75, side: 28.0, tan: 12.0, w: 12.0, d: 10.0, h: 44.0, mat: glassTowerMat2 },
    { u: 0.78, side: 34.0, tan: -2.0, w: 10.5, d: 9.5, h: 38.0, mat: stoneTowerMat },
    { u: 0.82, side: 28.0, tan:  5.0, w: 11.0, d: 10.0, h: 36.0, mat: stoneTowerMat },
    { u: 0.84, side: 36.0, tan: -6.0, w: 12.0, d: 11.0, h: 42.0, mat: glassTowerMat1 },

    // --- MANHATTAN BATTERY & FINANCIAL DISTRICT WATERFRONT (u = 0.44 - 0.54) ---
    { u: 0.44, side: 28.0, tan:  6.0, w: 11.0, d: 10.0, h: 38.0, mat: stoneTowerMat, isArtDeco: true },
    { u: 0.46, side: 33.0, tan: -4.0, w: 12.0, d: 11.0, h: 44.0, mat: glassTowerMat2 },
    { u: 0.48, side: 36.0, tan: 12.0, w: 10.0, d: 9.0,  h: 40.0, mat: glassTowerMat1 },
    { u: 0.52, side: 29.0, tan: -8.0, w: 9.5,  d: 9.0,  h: 36.0, mat: stoneTowerMat, isArtDeco: true },
    { u: 0.54, side: 38.0, tan:  6.0, w: 11.5, d: 10.5, h: 48.0, mat: glassTowerMat2 },

    // --- BROOKLYN / DUMBO / BROOKLYN HEIGHTS WATERFRONT (u = 0.56 - 0.88) ---
    { u: 0.58, side: -24.0, tan: -4.0, w: 10.0, d: 9.0, h: 30.0, mat: stoneTowerMat, isArtDeco: true },
    { u: 0.61, side: -30.0, tan:  6.0, w: 11.0, d: 10.0, h: 36.0, mat: stoneTowerMat },
    { u: 0.64, side: -22.0, tan: -8.0, w: 9.0,  d: 8.5, h: 28.0, mat: stoneTowerMat },
    { u: 0.67, side: -28.0, tan:  4.0, w: 10.5, d: 9.5, h: 34.0, mat: glassTowerMat1 },
    { u: 0.70, side: -20.0, tan: -6.0, w: 8.5,  d: 8.0, h: 24.0, mat: stoneTowerMat },
    { u: 0.73, side: -26.0, tan:  8.0, w: 11.0, d: 9.5, h: 32.0, mat: stoneTowerMat, isArtDeco: true },
    { u: 0.77, side: -22.0, tan: -4.0, w: 9.5,  d: 9.0, h: 26.0, mat: stoneTowerMat },
    { u: 0.81, side: -30.0, tan:  5.0, w: 10.0, d: 9.0, h: 30.0, mat: glassTowerMat2 },
    { u: 0.85, side: -24.0, tan: -6.0, w: 12.0, d: 10.0, h: 28.0, mat: stoneTowerMat },
    { u: 0.88, side: -28.0, tan:  4.0, w: 11.0, d: 9.5, h: 32.0, mat: glassTowerMat1 },

    // --- THE NARROWS / STATEN ISLAND & BAY RIDGE WATERFRONT (u = 0.06 - 0.14) ---
    { u: 0.06, side:  22.0, tan:  4.0, w: 9.0,  d: 8.5, h: 22.0, mat: stoneTowerMat },
    { u: 0.08, side:  28.0, tan: -6.0, w: 10.0, d: 9.0, h: 26.0, mat: stoneTowerMat },
    { u: 0.12, side:  24.0, tan:  5.0, w: 9.5,  d: 8.5, h: 24.0, mat: stoneTowerMat },
    { u: 0.06, side: -22.0, tan: -4.0, w: 9.0,  d: 8.5, h: 22.0, mat: stoneTowerMat },
    { u: 0.08, side: -28.0, tan:  6.0, w: 10.0, d: 9.0, h: 26.0, mat: stoneTowerMat },
    { u: 0.12, side: -24.0, tan: -5.0, w: 9.5,  d: 8.5, h: 24.0, mat: stoneTowerMat }
  ];

  bankBuildingSpecs.forEach((b) => {
    const f = getRiverFrame(b.u);
    const bPos = f.pt.clone().addScaledVector(f.side, b.side).addScaledVector(f.tangent, b.tan);
    bPos.y = getGroundY(bPos.x, bPos.z, 2.8);

    const bGroup = new THREE.Group();
    bGroup.position.copy(bPos);
    bGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), f.tangent);

    const bldgMesh = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), b.mat);
    bldgMesh.position.y = b.h * 0.5;
    bldgMesh.castShadow = true;
    bldgMesh.receiveShadow = true;
    bGroup.add(bldgMesh);

    if (b.isArtDeco) {
      const setback = new THREE.Mesh(new THREE.BoxGeometry(b.w * 0.75, 4.0, b.d * 0.75), stoneTowerMat);
      setback.position.y = b.h + 2.0;
      bGroup.add(setback);

      const crown = new THREE.Mesh(new THREE.ConeGeometry(b.w * 0.5, 6.0, 4), copperRoofMat);
      crown.position.y = b.h + 7.0;
      bGroup.add(crown);
    } else {
      const bulkhead = new THREE.Mesh(new THREE.BoxGeometry(b.w * 0.45, 3.2, b.d * 0.45), concreteMat);
      bulkhead.position.y = b.h + 1.6;
      bGroup.add(bulkhead);

      const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.2, 10), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 }));
      tank.position.set(b.w * 0.2, b.h + 2.5, b.d * 0.2);
      bGroup.add(tank);
    }

    bankBuildingsGroup.add(bGroup);
  });

  // Also add 6 historic brick lofts with water tanks in Brooklyn Heights & DUMBO (u = 0.62 - 0.74)
  for (let bk = 0; bk < 6; bk++) {
    const uBk = 0.62 + bk * 0.022;
    const fBk = getRiverFrame(uBk);
    const loft = createWaterfrontBrickBuilding(9.0, 15.0, 8.5, brickColors[bk % brickColors.length]);
    const lPos = fBk.pt.clone().addScaledVector(fBk.side, -16.0 - (bk % 2) * 4.0);
    lPos.y = getGroundY(lPos.x, lPos.z, 2.8);
    loft.group.position.copy(lPos);
    loft.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fBk.tangent);
    bankBuildingsGroup.add(loft.group);
  }

  group.add(bankBuildingsGroup);

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

    // 2. Update Battery Park Subsurface Metro Station Cutaway (u = 0.47)
    if (metroStation) {
      if (uWave < 0.47) {
        metroStation.waterMesh.visible = false;
        metroStation.waterMesh.scale.y = 0.001;
        metroStation.waterMesh.position.y = -metroStation.sH * 0.5 + 0.1;
        metroStation.stairCascade.visible = false;
        metroStation.alarmLight.intensity = 0.0;
      } else {
        const stProg = Math.min(1.0, (uWave - 0.47) / 0.045);
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

  // -------------------------------------------------------------------------
  // UPDATE STATEN ISLAND FERRY, NYC CATAMARAN & ADRIFT TANKER BARGE
  // -------------------------------------------------------------------------
  function updateFerryTerminalVessels(t, uWave) {
    if (!vesselsObj) return;
    const { siFerry, catamaran, tankerBarge, slipAprons } = vesselsObj;

    if (t <= 0.0001 || uWave <= 0.0001) {
      // Pristine baseline reset
      siFerry.group.position.copy(siFerry.basePos);
      siFerry.group.rotation.copy(siFerry.baseRot);
      catamaran.group.position.copy(catamaran.basePos);
      catamaran.group.rotation.copy(catamaran.baseRot);
      tankerBarge.group.position.copy(tankerBarge.basePos);
      tankerBarge.group.rotation.copy(tankerBarge.baseRot);
      if (slipAprons && slipAprons.apron1) slipAprons.apron1.position.y = slipAprons.baseApron1Y;
      if (slipAprons && slipAprons.apron2) slipAprons.apron2.position.y = slipAprons.baseApron2Y;
      return;
    }

    if (uWave < 0.42) {
      // Normal harbor state with gentle water rocking
      const calmPhase = t * 7.0;
      siFerry.group.position.copy(siFerry.basePos);
      siFerry.group.position.y = siFerry.basePos.y + Math.sin(calmPhase) * 0.06;
      siFerry.group.rotation.copy(siFerry.baseRot);
      siFerry.group.rotation.z = siFerry.baseRot.z + Math.cos(calmPhase * 0.8) * 0.012;

      catamaran.group.position.copy(catamaran.basePos);
      catamaran.group.position.y = catamaran.basePos.y + Math.sin(calmPhase * 1.2 + 0.5) * 0.08;
      catamaran.group.rotation.copy(catamaran.baseRot);
      catamaran.group.rotation.z = catamaran.baseRot.z + Math.cos(calmPhase * 1.1) * 0.018;

      tankerBarge.group.position.copy(tankerBarge.basePos);
      tankerBarge.group.position.y = tankerBarge.basePos.y + Math.sin(calmPhase * 0.6) * 0.05;
      tankerBarge.group.rotation.copy(tankerBarge.baseRot);
      tankerBarge.group.rotation.z = tankerBarge.baseRot.z + Math.sin(calmPhase * 0.7) * 0.01;

      if (slipAprons && slipAprons.apron1) slipAprons.apron1.position.y = slipAprons.baseApron1Y;
      if (slipAprons && slipAprons.apron2) slipAprons.apron2.position.y = slipAprons.baseApron2Y;
    } else {
      // Storm Surge Inundation at South Ferry (u = 0.42 - 1.0)
      const surgeLocal = Math.min(1.0, (uWave - 0.42) / 0.12);
      const surgeRise = surgeLocal * 2.85; // 2.85m surge crest (~14.9 ft NAVD88)

      // 1. Staten Island Ferry dynamic storm reaction
      const stormPhase = t * 18.0;
      const stormHeave = Math.sin(stormPhase) * 0.32 * surgeLocal;
      const stormPitch = Math.sin(stormPhase * 0.8) * 0.065 * surgeLocal;
      const stormRoll = Math.cos(stormPhase * 0.9) * 0.11 * surgeLocal;
      const surgeSway = Math.sin(stormPhase * 0.7) * 0.35 * surgeLocal;

      siFerry.group.position.copy(siFerry.basePos);
      siFerry.group.position.y = siFerry.basePos.y + surgeRise + stormHeave;
      siFerry.group.position.x = siFerry.basePos.x + surgeSway;
      siFerry.group.rotation.copy(siFerry.baseRot);
      siFerry.group.rotation.x = siFerry.baseRot.x + stormPitch;
      siFerry.group.rotation.z = siFerry.baseRot.z + stormRoll;

      // 2. NYC Fast Catamaran dynamic storm reaction
      const catStormPhase = t * 22.0;
      const catHeave = Math.sin(catStormPhase + 1.2) * 0.38 * surgeLocal;
      const catPitch = Math.cos(catStormPhase * 0.85) * 0.095 * surgeLocal;
      const catRoll = Math.sin(catStormPhase * 0.95) * 0.15 * surgeLocal;
      const catSway = Math.cos(catStormPhase * 0.75) * 0.42 * surgeLocal;

      catamaran.group.position.copy(catamaran.basePos);
      catamaran.group.position.y = catamaran.basePos.y + surgeRise + catHeave;
      catamaran.group.position.x = catamaran.basePos.x + catSway;
      catamaran.group.rotation.copy(catamaran.baseRot);
      catamaran.group.rotation.x = catamaran.baseRot.x + catPitch;
      catamaran.group.rotation.z = catamaran.baseRot.z + catRoll;

      // 3. Adrift Industrial Tanker Barge (Sandy "John B. Caddell" Benchmark)
      if (uWave < 0.48) {
        tankerBarge.group.position.copy(tankerBarge.basePos);
        tankerBarge.group.position.y = tankerBarge.basePos.y + surgeRise * 0.5 + Math.sin(t * 12.0) * 0.15;
        tankerBarge.group.rotation.copy(tankerBarge.baseRot);
      } else {
        const driftProg = Math.min(1.0, (uWave - 0.48) / 0.45);
        const driftDist = driftProg * 38.0; // meters drifting along current
        const bargeHeave = Math.sin(t * 14.0 + 2.0) * 0.42;
        const listAngle = 0.20 + Math.sin(t * 10.0) * 0.04; // 12-14 degrees listing
        const pitchAngle = Math.cos(t * 12.0) * 0.07;

        tankerBarge.group.position.copy(tankerBarge.basePos);
        tankerBarge.group.position.z += driftDist * 0.92;
        tankerBarge.group.position.x += -driftDist * 0.38;
        tankerBarge.group.position.y = tankerBarge.basePos.y + surgeRise + bargeHeave;

        tankerBarge.group.rotation.copy(tankerBarge.baseRot);
        tankerBarge.group.rotation.z += listAngle;
        tankerBarge.group.rotation.x += pitchAngle;
      }

      // 4. Loading aprons ride up with ferry deck
      if (slipAprons && slipAprons.apron1) {
        slipAprons.apron1.position.y = slipAprons.baseApron1Y + surgeRise * 0.8;
      }
      if (slipAprons && slipAprons.apron2) {
        slipAprons.apron2.position.y = slipAprons.baseApron2Y + surgeRise * 0.8;
      }
    }
  }

  return {
    wipeableItems,
    dynamicWaterItems,
    arcLight,
    arcMesh,
    updateTubes,
    updateFloatingItems,
    updateBridgeTraffic,
    updateFerryTerminalVessels
  };
}
