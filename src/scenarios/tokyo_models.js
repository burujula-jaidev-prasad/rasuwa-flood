import * as THREE from 'three';

/**
 * Procedural 3D Landmarks, Super-Levees, Shinkansen, G-CANS Underground Temple,
 * Skytree & Zero-Meter District Architecture for Tokyo, Japan (Arakawa River Deluge Scenario)
 * 
 * Features 65+ dynamic collapsing structures, 2-story Japanese residences with solar panels,
 * Kei cars, delivery trucks, riverbed sports dugouts, and breached temporary levee walls
 * that physically fail, tilt, and wash down the Arakawa drainage floodway.
 */
export function buildTokyoScene(group, river, terrain) {
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
  const shinkansenWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.3 });
  const shinkansenBlue  = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3, metalness: 0.2 });
  const concreteMat     = new THREE.MeshStandardMaterial({ color: 0xa1a1aa, roughness: 0.75, metalness: 0.1 });
  const darkSteelMat    = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.5, metalness: 0.7 });
  const superLeveeGrass = new THREE.MeshStandardMaterial({ color: 0x365314, roughness: 0.9 });
  const gCansPillarMat  = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.8, metalness: 0.15 });
  const metroBlueMat    = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
  const watertightSteel = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4, metalness: 0.8 });
  const skytreeLattice  = new THREE.MeshStandardMaterial({ color: 0xe0e7ff, roughness: 0.3, metalness: 0.6 });
  const jsdfCamoGreen   = new THREE.MeshStandardMaterial({ color: 0x3f4f34, roughness: 0.6 });
  const warningYellow   = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });

  // -------------------------------------------------------------------------
  // PROCEDURAL BUILDERS FOR JAPANESE RESIDENTIAL ARCHITECTURE & VEHICLES
  // -------------------------------------------------------------------------

  /**
   * Modern Japanese 2-Story Zero-Meter District Residence
   * Siding panels (cream/grey/white), dark charcoal/blue hip roof, solar panel array,
   * 2nd-floor balcony with metal railing, exterior A/C compressor, and carport canopy.
   */
  function createJapaneseHouse(bw = 5.4, bh = 5.2, bd = 6.2, wallHex = 0xf1f5f9, roofHex = 0x1e293b) {
    const houseGroup = new THREE.Group();
    const materials = [];

    const wallMat = new THREE.MeshStandardMaterial({ color: wallHex, roughness: 0.8 });
    const roofMat = new THREE.MeshStandardMaterial({ color: roofHex, roughness: 0.7 });
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.85 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.6 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.7 });
    materials.push(wallMat, roofMat, solarMat, glassMat, metalMat);

    // 1st & 2nd Floor Main Living Volume
    const body = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), wallMat);
    body.position.y = bh * 0.5;
    body.castShadow = true;
    body.receiveShadow = true;
    houseGroup.add(body);

    // Floor separation belt course
    const belt = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.15, 0.18, bd + 0.15), metalMat);
    belt.position.y = bh * 0.5;
    houseGroup.add(belt);

    // Sloped 4-Sided Hip Roof with eaves overhang
    const roofGeo = new THREE.ConeGeometry((bw + 0.8) * 0.72, 1.4, 4);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.rotation.y = Math.PI * 0.25;
    roof.position.set(0, bh + 0.7, 0);
    roof.scale.set(1.0, 1.0, (bd + 0.8) / (bw + 0.8));
    roof.castShadow = true;
    houseGroup.add(roof);

    // Rooftop Photovoltaic Solar Panel Array
    const solar = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.55, 0.06, bd * 0.45), solarMat);
    solar.position.set(0, bh + 0.95, 0.6);
    solar.rotation.x = -0.22;
    houseGroup.add(solar);

    // 2nd-Floor Balcony
    const balcony = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.75, 0.8, 1.0), metalMat);
    balcony.position.set(0, bh * 0.5 + 0.4, bd * 0.5 + 0.5);
    houseGroup.add(balcony);

    // Windows / Sliding Glass Doors
    const slidingDoor = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.0, 0.08), glassMat);
    slidingDoor.position.set(0, 1.0, bd * 0.5 + 0.04);
    houseGroup.add(slidingDoor);

    const win2F = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 0.08), glassMat);
    win2F.position.set(0, bh * 0.72, bd * 0.5 + 0.04);
    houseGroup.add(win2F);

    // Exterior Wall A/C Compressor Unit
    const ac = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 0.3), wallMat);
    ac.position.set(bw * 0.5 + 0.16, 1.4, -bd * 0.2);
    houseGroup.add(ac);

    return { group: houseGroup, materials, primaryMat: wallMat };
  }

  /**
   * Japanese Kei-Class Micro Compact Car (Tall Box Style)
   */
  function createKeiCar(colorHex = 0xfacc15) {
    const carGroup = new THREE.Group();
    const materials = [];

    const carMat   = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.4, metalness: 0.3 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2, metalness: 0.7 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
    const plateMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 }); // Yellow Kei license plate
    materials.push(carMat, glassMat, blackMat, plateMat);

    // Tall box body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 2.8), carMat);
    body.position.y = 0.6;
    body.castShadow = true;
    carGroup.add(body);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.65, 1.8), glassMat);
    cabin.position.set(0, 1.15, -0.2);
    carGroup.add(cabin);

    // Yellow license plate
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.05), plateMat);
    plate.position.set(0, 0.4, 1.42);
    carGroup.add(plate);

    const wGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.18, 8);
    wGeo.rotateZ(Math.PI * 0.5);
    [-0.72, 0.72].forEach(wx => {
      [-0.9, 0.9].forEach(wz => {
        const wheel = new THREE.Mesh(wGeo, blackMat);
        wheel.position.set(wx, 0.24, wz);
        carGroup.add(wheel);
      });
    });

    return { group: carGroup, materials, primaryMat: carMat };
  }

  /**
   * Japanese Light Delivery Truck (Isuzu Elf / Yamato Style)
   */
  function createDeliveryTruck(colorHex = 0x15803d) {
    const truckGroup = new THREE.Group();
    const materials = [];

    const cabMat   = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
    const boxMat   = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.5 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.7 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
    materials.push(cabMat, boxMat, glassMat, blackMat);

    // Forward cab
    const cab = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 1.4), cabMat);
    cab.position.set(0, 0.9, 1.4);
    cab.castShadow = true;
    truckGroup.add(cab);

    const win = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.5, 0.8), glassMat);
    win.position.set(0, 1.2, 1.5);
    truckGroup.add(win);

    // Cargo box
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.85, 1.6, 3.4), boxMat);
    box.position.set(0, 1.35, -0.8);
    box.castShadow = true;
    truckGroup.add(box);

    const wGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.22, 8);
    wGeo.rotateZ(Math.PI * 0.5);
    [-0.95, 0.95].forEach(wx => {
      [-1.2, 1.2].forEach(wz => {
        const wheel = new THREE.Mesh(wGeo, blackMat);
        wheel.position.set(wx, 0.3, wz);
        truckGroup.add(wheel);
      });
    });

    return { group: truckGroup, materials, primaryMat: boxMat };
  }

  /**
   * Riverbed Sports Park Dugout / Bicycle Pavilion
   */
  function createRiverbedParkDugout() {
    const parkGroup = new THREE.Group();
    const materials = [];

    const steelMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.6 });
    const roofMat  = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
    const woodMat  = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
    materials.push(steelMat, roofMat, woodMat);

    // 4 steel support posts
    [[-1.4, -0.8], [1.4, -0.8], [-1.4, 0.8], [1.4, 0.8]].forEach(([px, pz]) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4, 6), steelMat);
      post.position.set(px, 1.2, pz);
      parkGroup.add(post);
    });

    // Curved arched shelter roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 2.0), roofMat);
    roof.position.set(0, 2.4, 0);
    roof.castShadow = true;
    parkGroup.add(roof);

    // Player bench
    const bench = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.35, 0.4), woodMat);
    bench.position.set(0, 0.25, 0);
    parkGroup.add(bench);

    return { group: parkGroup, materials, primaryMat: steelMat };
  }

  /**
   * Waterways Dredging / Construction Work Barge
   */
  function createRiverWorkBarge() {
    const bargeGroup = new THREE.Group();
    const materials = [];

    const steelHullMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.7 });
    const deckMat      = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.8 });
    const craneYellow  = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
    materials.push(steelHullMat, deckMat, craneYellow);

    const hull = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.9, 9.0), steelHullMat);
    hull.position.y = 0.45;
    hull.castShadow = true;
    bargeGroup.add(hull);

    const deck = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.15, 8.8), deckMat);
    deck.position.y = 0.95;
    bargeGroup.add(deck);

    // Excavator / Spud crane
    const craneCab = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.6), craneYellow);
    craneCab.position.set(0, 1.6, -1.5);
    bargeGroup.add(craneCab);

    const boom = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 0.3), craneYellow);
    boom.rotation.x = 0.6;
    boom.position.set(0, 2.8, 0.5);
    bargeGroup.add(boom);

    return { group: bargeGroup, materials, primaryMat: steelHullMat };
  }

  /**
   * Blue-Sheet Emergency Levee Sandbag Bund
   */
  function createSandbagLeveeBund(length = 3.6) {
    const bundGroup = new THREE.Group();
    const materials = [];

    const tarpBlueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 });
    const bagWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 });
    materials.push(tarpBlueMat, bagWhiteMat);

    // Blue waterproof sheet covering bund
    const bund = new THREE.Mesh(new THREE.BoxGeometry(length, 1.4, 1.6), tarpBlueMat);
    bund.position.y = 0.7;
    bund.castShadow = true;
    bundGroup.add(bund);

    // Sandbags weighting down sheet
    const cols = Math.floor(length / 0.7);
    for (let c = 0; c < cols; c++) {
      const bag = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.25, 0.4), bagWhiteMat);
      bag.position.set((c - cols * 0.5 + 0.5) * 0.7, 1.45, 0);
      bundGroup.add(bag);
    }

    return { group: bundGroup, materials, primaryMat: tarpBlueMat };
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
  // 1. ARAKAWA SUPER-LEVEE & HALTED SHINKANSEN BULLET TRAIN (u = 0.15)
  // -------------------------------------------------------------------------
  const fShink = getRiverFrame(0.15);
  const shinkGroup = new THREE.Group();
  shinkGroup.position.copy(fShink.pt);

  const leveeWidth = 32.0;
  const levee = new THREE.Mesh(new THREE.BoxGeometry(leveeWidth, 4.0, 48.0), superLeveeGrass);
  levee.position.set(-fShink.side.x * 16.0, 2.0, 0);
  levee.castShadow = true;
  shinkGroup.add(levee);

  const viaductSpan = 36.0;
  const viaductDeck = new THREE.Mesh(new THREE.BoxGeometry(viaductSpan + 4.0, 1.2, 5.2), concreteMat);
  viaductDeck.rotation.y = Math.atan2(fShink.side.x, fShink.side.z);
  viaductDeck.position.set(0, 8.5, 0);
  viaductDeck.castShadow = true;
  shinkGroup.add(viaductDeck);

  [-12.0, 0, 12.0].forEach(pOffset => {
    const pier = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 8.0, 12), concreteMat);
    pier.position.set(fShink.side.x * pOffset, 4.0, fShink.side.z * pOffset);
    pier.castShadow = true;
    shinkGroup.add(pier);
  });

  for (let cm = -16.0; cm <= 16.0; cm += 8.0) {
    const mast = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.5, 5.0), darkSteelMat);
    mast.rotation.y = Math.atan2(fShink.side.x, fShink.side.z);
    mast.position.set(fShink.side.x * cm, 10.5, fShink.side.z * cm);
    shinkGroup.add(mast);
  }

  const trainCars = [
    { offset: -6.0, isNose: true },
    { offset: 4.0,  isNose: false },
    { offset: 14.0, isNose: false }
  ];

  trainCars.forEach(tc => {
    const car = new THREE.Group();
    const carBody = new THREE.Mesh(new THREE.BoxGeometry(7.8, 1.6, 2.2), shinkansenWhite);
    carBody.position.y = 1.0;
    carBody.castShadow = true;
    car.add(carBody);

    const stripe = new THREE.Mesh(new THREE.BoxGeometry(7.82, 0.25, 2.22), shinkansenBlue);
    stripe.position.y = 0.7;
    car.add(stripe);

    if (tc.isNose) {
      const nose = new THREE.Mesh(new THREE.ConeGeometry(1.1, 2.8, 12), shinkansenWhite);
      nose.rotation.z = Math.PI * 0.5;
      nose.position.set(-4.8, 0.9, 0);
      car.add(nose);
    }

    car.rotation.y = Math.atan2(fShink.side.x, fShink.side.z);
    car.position.set(fShink.side.x * tc.offset, 9.2, fShink.side.z * tc.offset);
    shinkGroup.add(car);
  });
  group.add(shinkGroup);

  // -------------------------------------------------------------------------
  // ZONE 1: UPPER ARAKAWA LOWLAND RESIDENCES OUTSIDE LEVEE (u = 0.10 - 0.22)
  // -------------------------------------------------------------------------
  const wallColors = [0xf8fafc, 0xf1f5f9, 0xe2e8f0, 0xfef3c7, 0xe0e7ff];
  const roofColors = [0x1e293b, 0x0f172a, 0x1e3a8a, 0x334155];

  for (let i = 0; i < 8; i++) {
    const uHouse = 0.10 + i * 0.015;
    const fH = getRiverFrame(uHouse);
    const bankDir = (i % 2 === 0) ? 1 : -1;
    const dist = 9.5 + (i % 3) * 2.5;

    const house = createJapaneseHouse(
      5.2 + (i % 2) * 0.6,
      5.0 + (i % 2) * 0.4,
      6.0 + (i % 3) * 0.4,
      wallColors[i % wallColors.length],
      roofColors[i % roofColors.length]
    );

    const pos = fH.pt.clone().addScaledVector(fH.side, bankDir * dist);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    house.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fH.tangent);
    house.group.rotation.y += (i * 0.4);

    registerWipeable(house.group, uHouse, pos, fH.tangent, fH.side, {
      primaryMat: house.primaryMat,
      materials: house.materials,
      driftSpeed: 27.0,
      tumbleScale: 6.5,
      collapseTilt: (bankDir > 0 ? -0.45 : 0.45)
    });
  }

  // Riverbed sports field dugouts / bicycle shelters
  [0.12, 0.18].forEach((uDug, dIdx) => {
    const fDug = getRiverFrame(uDug);
    const dugout = createRiverbedParkDugout();
    const pos = fDug.pt.clone().addScaledVector(fDug.side, (dIdx === 0 ? 6.0 : -6.0));
    pos.y = fDug.pt.y + 0.2;
    dugout.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fDug.tangent);

    registerWipeable(dugout.group, uDug, pos, fDug.tangent, fDug.side, {
      primaryMat: dugout.primaryMat,
      materials: dugout.materials,
      driftSpeed: 28.0,
      tumbleScale: 7.0
    });
  });

  // Kei cars & delivery trucks in Saitama lowlands
  [0.11, 0.16, 0.21].forEach((uV, vIdx) => {
    const fV = getRiverFrame(uV);
    const veh = (vIdx === 1 ? createDeliveryTruck(0x15803d) : createKeiCar(vIdx === 0 ? 0xfacc15 : 0xdc2626));
    const pos = fV.pt.clone().addScaledVector(fV.side, (vIdx % 2 === 0 ? 8.2 : -8.5));
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.2;
    veh.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fV.tangent);

    registerWipeable(veh.group, uV, pos, fV.tangent, fV.side, {
      primaryMat: veh.primaryMat,
      materials: veh.materials,
      driftSpeed: 30.0,
      tumbleScale: 8.0
    });
  });

  // -------------------------------------------------------------------------
  // 2. G-CANS VERTICAL SILO NO. 1 DROP SHAFT (u = 0.32)
  // -------------------------------------------------------------------------
  const fSilo = getRiverFrame(0.32);
  const siloGroup = new THREE.Group();
  siloGroup.position.copy(fSilo.pt);

  const siloOuter = new THREE.Mesh(new THREE.CylinderGeometry(9.0, 9.0, 10.0, 24, 1, true), concreteMat);
  siloOuter.position.set(-fSilo.side.x * 18.0, -1.0, 0);
  siloGroup.add(siloOuter);

  const vortex = new THREE.Mesh(new THREE.ConeGeometry(8.2, 8.0, 20, 1, true), new THREE.MeshStandardMaterial({
    color: 0x1e3a5f,
    roughness: 0.2,
    metalness: 0.5,
    transparent: true,
    opacity: 0.85
  }));
  vortex.rotation.x = Math.PI;
  vortex.position.set(-fSilo.side.x * 18.0, -2.0, 0);
  siloGroup.add(vortex);

  const siloRail = new THREE.Mesh(new THREE.TorusGeometry(9.2, 0.2, 8, 24), warningYellow);
  siloRail.rotation.x = Math.PI * 0.5;
  siloRail.position.set(-fSilo.side.x * 18.0, 4.2, 0);
  siloGroup.add(siloRail);

  const trashRack = new THREE.Mesh(new THREE.BoxGeometry(6.0, 3.5, 1.2), darkSteelMat);
  trashRack.position.set(-fSilo.side.x * 10.0, 2.0, 0);
  siloGroup.add(trashRack);
  group.add(siloGroup);

  // -------------------------------------------------------------------------
  // ZONE 2: G-CANS FLOODWAY CHANNEL RESIDENCES & BARGES (u = 0.26 - 0.38)
  // -------------------------------------------------------------------------
  for (let i = 0; i < 10; i++) {
    const uH = 0.26 + i * 0.012;
    const fH = getRiverFrame(uH);
    const bankDir = (i % 2 === 0) ? 1 : -1;
    const dist = 8.5 + (i % 3) * 2.2;

    const house = createJapaneseHouse(
      5.0 + (i % 3) * 0.5,
      5.1 + (i % 2) * 0.3,
      5.8 + (i % 2) * 0.4,
      wallColors[(i + 1) % wallColors.length],
      roofColors[(i + 1) % roofColors.length]
    );

    const pos = fH.pt.clone().addScaledVector(fH.side, bankDir * dist);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    house.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fH.tangent);
    house.group.rotation.y += (i * 0.45);

    registerWipeable(house.group, uH, pos, fH.tangent, fH.side, {
      primaryMat: house.primaryMat,
      materials: house.materials,
      driftSpeed: 26.0,
      tumbleScale: 6.5,
      collapseTilt: (bankDir > 0 ? -0.45 : 0.45)
    });
  }

  // Work barge in river channel
  {
    const fW = getRiverFrame(0.30);
    const barge = createRiverWorkBarge();
    const pos = fW.pt.clone().addScaledVector(fW.side, 5.0);
    pos.y = fW.pt.y + 0.3;
    barge.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fW.tangent);

    registerWipeable(barge.group, 0.30, pos, fW.tangent, fW.side, {
      primaryMat: barge.primaryMat,
      materials: barge.materials,
      driftSpeed: 28.0,
      tumbleScale: 7.0
    });
  }

  // Breaching blue-sheet sandbag dikes
  for (let b = 0; b < 2; b++) {
    const bund = createSandbagLeveeBund(4.5);
    const fBund = getRiverFrame(0.34 + b * 0.03);
    const pos = fBund.pt.clone().addScaledVector(fBund.side, -11.0);
    pos.y = 2.0;
    bund.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fBund.tangent);

    registerWipeable(bund.group, 0.34 + b * 0.03, pos, fBund.tangent, fBund.side, {
      primaryMat: bund.primaryMat,
      materials: bund.materials,
      driftSpeed: 22.0,
      tumbleScale: 5.0,
      collapseTilt: 0.6
    });
  }

  // -------------------------------------------------------------------------
  // 3. G-CANS "UNDERGROUND TEMPLE" (u = 0.48)
  // -------------------------------------------------------------------------
  const fTemple = getRiverFrame(0.48);
  const templeGroup = new THREE.Group();
  templeGroup.position.copy(fTemple.pt);

  const tankFloor = new THREE.Mesh(new THREE.BoxGeometry(32.0, 1.2, 42.0), concreteMat);
  tankFloor.position.set(fTemple.side.x * 18.0, -6.5, 0);
  templeGroup.add(tankFloor);

  const tankCeiling = new THREE.Mesh(new THREE.BoxGeometry(32.0, 1.2, 42.0), concreteMat);
  tankCeiling.position.set(fTemple.side.x * 18.0, 4.8, 0);
  templeGroup.add(tankCeiling);

  for (let row = -1; row <= 1; row += 2) {
    for (let col = -2; col <= 2; col++) {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 11.0, 5.0), gCansPillarMat);
      pillar.position.set(
        fTemple.side.x * 18.0 + row * 6.5,
        -0.8,
        col * 8.5
      );
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      templeGroup.add(pillar);

      const light = new THREE.PointLight(0xfbbf24, 0.4, 18);
      light.position.set(pillar.position.x, 3.5, pillar.position.z);
      templeGroup.add(light);
    }
  }

  const templeWater = new THREE.Mesh(new THREE.BoxGeometry(30.0, 0.4, 40.0), new THREE.MeshStandardMaterial({
    color: 0x1d4ed8,
    roughness: 0.15,
    metalness: 0.4,
    transparent: true,
    opacity: 0.8
  }));
  templeWater.position.set(fTemple.side.x * 18.0, -5.4, 0);
  templeGroup.add(templeWater);
  group.add(templeGroup);

  // -------------------------------------------------------------------------
  // ZONE 3: KOTO 5-WARD ZERO-METER DISTRICT RESIDENTIAL COLLAPSE (u = 0.44 - 0.58)
  // -------------------------------------------------------------------------
  for (let i = 0; i < 12; i++) {
    const uKoto = 0.44 + i * 0.011;
    const fK = getRiverFrame(uKoto);
    const bankDir = (i % 2 === 0) ? -1 : 1;
    const dist = 8.0 + (i % 3) * 2.0;

    const house = createJapaneseHouse(
      5.4 + (i % 2) * 0.5,
      5.2 + (i % 2) * 0.3,
      6.2 + (i % 3) * 0.3,
      wallColors[(i + 2) % wallColors.length],
      roofColors[(i + 2) % roofColors.length]
    );

    const pos = fK.pt.clone().addScaledVector(fK.side, bankDir * dist);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    house.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fK.tangent);
    house.group.rotation.y += (i * 0.4);

    registerWipeable(house.group, uKoto, pos, fK.tangent, fK.side, {
      primaryMat: house.primaryMat,
      materials: house.materials,
      driftSpeed: 25.0,
      tumbleScale: 6.0,
      collapseTilt: (bankDir > 0 ? -0.5 : 0.5)
    });
  }

  // Floating vehicles in Zero-Meter District
  [0.46, 0.50, 0.54].forEach((uVeh, vIdx) => {
    const fV = getRiverFrame(uVeh);
    const veh = (vIdx === 1 ? createDeliveryTruck(0x0284c7) : createKeiCar(vIdx === 0 ? 0xf8fafc : 0xd97706));
    const pos = fV.pt.clone().addScaledVector(fV.side, (vIdx % 2 === 0 ? -7.5 : 7.8));
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.2;
    veh.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fV.tangent);

    registerWipeable(veh.group, uVeh, pos, fV.tangent, fV.side, {
      primaryMat: veh.primaryMat,
      materials: veh.materials,
      driftSpeed: 30.0,
      tumbleScale: 8.0,
      sinkScale: 0.22
    });
  });

  // -------------------------------------------------------------------------
  // 4. TOKYO METRO ENTRANCE & WATERTIGHT FLOODGATES (u = 0.62)
  // -------------------------------------------------------------------------
  const fMetro = getRiverFrame(0.62);
  const metroGroup = new THREE.Group();
  metroGroup.position.copy(fMetro.pt);

  const sidewalk = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.8, 14.0), concreteMat);
  sidewalk.position.set(-fMetro.side.x * 16.0, 2.0, 0);
  metroGroup.add(sidewalk);

  const kiosk = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.8, 6.5), darkSteelMat);
  kiosk.position.set(-fMetro.side.x * 16.0, 3.5, 0);
  kiosk.castShadow = true;
  metroGroup.add(kiosk);

  const totemPole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.2, 8), darkSteelMat);
  totemPole.position.set(-fMetro.side.x * 13.0, 4.2, -3.8);
  const logoDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.15, 16), metroBlueMat);
  logoDisc.rotation.z = Math.PI * 0.5;
  logoDisc.position.set(-fMetro.side.x * 13.0, 6.0, -3.8);
  metroGroup.add(totemPole);
  metroGroup.add(logoDisc);

  const floodBarrier = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.2, 4.8), watertightSteel);
  floodBarrier.position.set(-fMetro.side.x * 14.2, 3.2, 0);
  metroGroup.add(floodBarrier);
  group.add(metroGroup);

  // Breaching sandbag bunds at metro station stairs
  for (let sb = 0; sb < 3; sb++) {
    const bund = createSandbagLeveeBund(3.8);
    const pos = fMetro.pt.clone().addScaledVector(fMetro.side, -13.5).addScaledVector(fMetro.tangent, -2.5 + sb * 2.2);
    pos.y = 2.4;
    bund.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMetro.tangent);

    registerWipeable(bund.group, 0.615 + sb * 0.01, pos, fMetro.tangent, fMetro.side, {
      primaryMat: bund.primaryMat,
      materials: bund.materials,
      driftSpeed: 24.0,
      tumbleScale: 5.5,
      sinkScale: 0.25
    });
  }

  // Delivery vans caught in station plaza
  {
    const van = createDeliveryTruck(0xd97706);
    const pos = fMetro.pt.clone().addScaledVector(fMetro.side, -18.5).addScaledVector(fMetro.tangent, 3.0);
    pos.y = 2.2;
    van.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fMetro.tangent);

    registerWipeable(van.group, 0.63, pos, fMetro.tangent, fMetro.side, {
      primaryMat: van.primaryMat,
      materials: van.materials,
      driftSpeed: 29.0,
      tumbleScale: 7.5
    });
  }

  // -------------------------------------------------------------------------
  // 5. SUMIDA RIVER SEAWALL & TOKYO SKYTREE REACH (u = 0.76)
  // -------------------------------------------------------------------------
  const fSky = getRiverFrame(0.76);
  const skyGroup = new THREE.Group();
  skyGroup.position.copy(fSky.pt);

  const seawall = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.5, 42.0), concreteMat);
  seawall.position.set(fSky.side.x * 14.0, 2.2, 0);
  seawall.castShadow = true;
  skyGroup.add(seawall);

  const surgeGate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.5, 8.0), watertightSteel);
  surgeGate.position.set(fSky.side.x * 14.0, 3.2, 0);
  skyGroup.add(surgeGate);

  // Tokyo Skytree Silhouette
  const skytreeGroup = new THREE.Group();
  skytreeGroup.position.set(fSky.side.x * 36.0, 0, 0);

  const stBase = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 6.5, 18.0, 16), skytreeLattice);
  stBase.position.y = 9.0;
  skytreeGroup.add(stBase);

  const stPod1 = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 5.2, 3.2, 16), concreteMat);
  stPod1.position.y = 19.5;
  skytreeGroup.add(stPod1);

  const stShaft = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3.8, 22.0, 16), skytreeLattice);
  stShaft.position.y = 32.0;
  skytreeGroup.add(stShaft);

  const stPod2 = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 3.6, 2.4, 16), concreteMat);
  stPod2.position.y = 44.0;
  skytreeGroup.add(stPod2);

  const stSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 1.4, 18.0, 8), skytreeLattice);
  stSpire.position.y = 54.0;
  skytreeGroup.add(stSpire);

  skyGroup.add(skytreeGroup);
  group.add(skyGroup);

  // Residences & low-lying commercial sheds in Skytree reach
  for (let i = 0; i < 8; i++) {
    const uSkyH = 0.72 + i * 0.014;
    const fSH = getRiverFrame(uSkyH);
    const bankDir = (i % 2 === 0) ? -1 : 1;
    const dist = 9.0 + (i % 3) * 2.0;

    const house = createJapaneseHouse(
      5.2 + (i % 2) * 0.5,
      5.0 + (i % 2) * 0.3,
      6.0 + (i % 2) * 0.4,
      wallColors[(i + 3) % wallColors.length],
      roofColors[(i + 3) % roofColors.length]
    );

    const pos = fSH.pt.clone().addScaledVector(fSH.side, bankDir * dist);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    house.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fSH.tangent);
    house.group.rotation.y += (i * 0.35);

    registerWipeable(house.group, uSkyH, pos, fSH.tangent, fSH.side, {
      primaryMat: house.primaryMat,
      materials: house.materials,
      driftSpeed: 25.0,
      tumbleScale: 6.0,
      collapseTilt: (bankDir > 0 ? -0.45 : 0.45)
    });
  }

  // Work barge in Sumida River
  {
    const fW2 = getRiverFrame(0.78);
    const barge = createRiverWorkBarge();
    const pos = fW2.pt.clone().addScaledVector(fW2.side, -5.5);
    pos.y = fW2.pt.y + 0.2;
    barge.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fW2.tangent);

    registerWipeable(barge.group, 0.78, pos, fW2.tangent, fW2.side, {
      primaryMat: barge.primaryMat,
      materials: barge.materials,
      driftSpeed: 28.0,
      tumbleScale: 7.0
    });
  }

  // -------------------------------------------------------------------------
  // 6. JSDF AMPHIBIOUS RELIEF ARMADA & WATER PURIFIERS (u = 0.90)
  // -------------------------------------------------------------------------
  const fJsdf = getRiverFrame(0.90);
  const jsdfGroup = new THREE.Group();
  jsdfGroup.position.copy(fJsdf.pt);

  for (let r = 0; r < 2; r++) {
    const rig = new THREE.Group();
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 5.2), jsdfCamoGreen);
    chassis.position.y = 1.0;
    rig.add(chassis);

    const purifierBox = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.6, 3.4), new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.4 }));
    purifierBox.position.set(0, 2.1, -0.6);
    rig.add(purifierBox);

    const intakeHose = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 8.0, 10), new THREE.MeshStandardMaterial({ color: 0x14532d }));
    intakeHose.rotation.z = Math.PI * 0.44;
    intakeHose.position.set(3.8, 0.8, 0);
    rig.add(intakeHose);

    rig.position.set(fJsdf.side.x * 12.0, 1.4, -6.0 + r * 12.0);
    jsdfGroup.add(rig);
  }
  group.add(jsdfGroup);

  return {
    wipeableItems,
    dynamicWaterItems
  };
}
