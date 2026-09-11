import * as THREE from 'three';

/**
 * Procedural 3D Landmarks, Bridges, Skyscrapers, Transit Portals & Countermeasures
 * for New York City (Hurricane Storm Surge Scenario)
 */
export function buildNewYorkScene(group, river, terrain) {
  const wipeableItems = [];
  const dynamicWaterItems = [];

  // Helper to place objects on river tangents & bank normals
  function getRiverFrame(u) {
    const pt = river.getPointAt(u);
    const tangent = river.getTangentAt(u);
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();
    return { pt, tangent, side, up };
  }

  // Common Materials
  const steelGreenMat = new THREE.MeshStandardMaterial({ color: 0x22553b, roughness: 0.45, metalness: 0.65 }); // Verrazzano green
  const steelCableMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.85 });
  const tarmacMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
  const concreteMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.75, metalness: 0.1 });
  const seawallGranite = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85 });
  const glassTowerMat1 = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.15, metalness: 0.85 });
  const glassTowerMat2 = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.2, metalness: 0.75 });
  const stoneTowerMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.85 });
  const yellowCabMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35, metalness: 0.2 });
  const nypdBlueMat = new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.4 });
  const nypdWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
  const escrSteelMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4, metalness: 0.5 }); // High-vis red/steel
  const floodgateGrayMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.7 });
  const gothicStoneMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.9 }); // Brooklyn Bridge limestone
  const brickWarehouseMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.9 }); // DUMBO brick
  const transformerMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.6 });
  const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.3 }); // Brown porcelain insulator
  const usaceArmyMat = new THREE.MeshStandardMaterial({ color: 0x3f6212, roughness: 0.6 }); // Olive drab
  const hoseMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });

  // -------------------------------------------------------------------------
  // 1. THE NARROWS & VERRAZZANO-NARROWS SUSPENSION BRIDGE (u = 0.10)
  // -------------------------------------------------------------------------
  const fVz = getRiverFrame(0.10);
  const vzGroup = new THREE.Group();
  vzGroup.position.copy(fVz.pt);

  const vzSpan = 38.0;
  const towerHeight = 28.0;

  // Two monumental suspension towers flanking the strait
  [-vzSpan * 0.48, vzSpan * 0.48].forEach((sideOffset) => {
    const towerGroup = new THREE.Group();
    towerGroup.position.set(fVz.side.x * sideOffset, 0, fVz.side.z * sideOffset);

    // Tower base footing (concrete caisson)
    const caisson = new THREE.Mesh(new THREE.BoxGeometry(6.0, 5.0, 7.0), concreteMat);
    caisson.position.y = 1.5;
    towerGroup.add(caisson);

    // Two vertical steel tower legs
    [-1.8, 1.8].forEach((legZ) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(2.0, towerHeight, 2.2), steelGreenMat);
      leg.position.set(0, towerHeight * 0.5 + 4.0, legZ);
      leg.castShadow = true;
      towerGroup.add(leg);
    });

    // Horizontal cross-struts
    [10.0, 18.0, 26.0, towerHeight + 3.0].forEach((strutY) => {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.4, 4.4), steelGreenMat);
      strut.position.set(0, strutY, 0);
      towerGroup.add(strut);
    });

    vzGroup.add(towerGroup);
  });

  // Suspended double-deck highway
  const deckWidth = vzSpan + 6.0;
  const deck = new THREE.Mesh(new THREE.BoxGeometry(deckWidth, 1.2, 5.0), steelGreenMat);
  deck.rotation.y = Math.atan2(fVz.side.x, fVz.side.z);
  deck.position.set(0, 11.0, 0);
  deck.castShadow = true;
  vzGroup.add(deck);

  // Road surface
  const vzRoad = new THREE.Mesh(new THREE.BoxGeometry(deckWidth, 0.2, 4.2), tarmacMat);
  vzRoad.rotation.y = Math.atan2(fVz.side.x, fVz.side.z);
  vzRoad.position.set(0, 11.7, 0);
  vzGroup.add(vzRoad);

  // Main suspension cables (Catenary curve approximation)
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
  // 2. LOWER MANHATTAN FINANCIAL DISTRICT & BATTERY SEAWALL (u = 0.35)
  // -------------------------------------------------------------------------
  const fMan = getRiverFrame(0.35);
  const manGroup = new THREE.Group();
  manGroup.position.copy(fMan.pt);

  // Granite Seawall along Battery Promenade
  const seawall = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.8, 48.0), seawallGranite);
  seawall.position.set(fMan.side.x * 12.0, 1.4, 0);
  seawall.castShadow = true;
  manGroup.add(seawall);

  // Battery Park Esplanade Lawn
  const lawn = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.4, 46.0), new THREE.MeshStandardMaterial({ color: 0x2e5436, roughness: 0.9 }));
  lawn.position.set(fMan.side.x * 17.5, 1.7, 0);
  manGroup.add(lawn);

  // Park Trees
  for (let tr = -18; tr <= 18; tr += 6) {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 2.5, 6), new THREE.MeshStandardMaterial({ color: 0x4a3525 }));
    trunk.position.set(fMan.side.x * 17.0, 2.8, tr);
    const foliage = new THREE.Mesh(new THREE.SphereGeometry(1.6, 8, 8), new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.8 }));
    foliage.position.set(fMan.side.x * 17.0, 4.4, tr);
    manGroup.add(trunk);
    manGroup.add(foliage);
  }

  // Skyscraper Cluster (Lower Manhattan Financial District)
  const towerDefs = [
    { xOff: 26, zOff: -14, w: 8, d: 8, h: 42, mat: glassTowerMat1, spire: true }, // One World Trade tribute
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

    // Main tower block
    const bldg = new THREE.Mesh(new THREE.BoxGeometry(t.w, t.h, t.d), t.mat);
    bldg.position.y = t.h * 0.5;
    bldg.castShadow = true;
    bldg.receiveShadow = true;
    towerGroup.add(bldg);

    // Art Deco / modern crown tier
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

  // Stranded Yellow NYC Medallion Taxi Cabs on West Street
  [-8, 2, 12].forEach((cz, idx) => {
    const cab = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.7, 3.8), yellowCabMat);
    body.position.y = 0.55;
    cab.add(body);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 2.0), glassTowerMat2);
    cabin.position.set(0, 1.0, -0.2);
    cab.add(cabin);

    const roofSign = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.25, 0.9), yellowCabMat);
    roofSign.position.set(0, 1.4, -0.2);
    cab.add(roofSign);

    // Wheels
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    [-0.95, 0.95].forEach(wx => {
      [-1.1, 1.1].forEach(wz => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.25, 8), wheelMat);
        wheel.rotation.z = Math.PI * 0.5;
        wheel.position.set(wx, 0.3, wz);
        cab.add(wheel);
      });
    });

    cab.position.set(fMan.side.x * 21.0, 1.9, cz);
    cab.rotation.y = (idx % 2 === 0) ? 0.3 : -0.2;
    manGroup.add(cab);
  });

  // NYPD Highway Patrol Cruiser with lightbar
  const copCar = new THREE.Group();
  const copBody = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.7, 4.0), nypdWhiteMat);
  copBody.position.y = 0.55;
  copCar.add(copBody);
  const copStripe = new THREE.Mesh(new THREE.BoxGeometry(2.02, 0.25, 3.2), nypdBlueMat);
  copStripe.position.y = 0.55;
  copCar.add(copStripe);
  const copCabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.6, 2.1), glassTowerMat2);
  copCabin.position.set(0, 1.0, -0.2);
  copCar.add(copCabin);
  // Red/Blue lightbar
  const redLight = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.3), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
  redLight.position.set(-0.35, 1.35, -0.2);
  const blueLight = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.3), new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
  blueLight.position.set(0.35, 1.35, -0.2);
  copCar.add(redLight);
  copCar.add(blueLight);

  copCar.position.set(fMan.side.x * 23.5, 1.9, 5.0);
  copCar.rotation.y = -0.5;
  manGroup.add(copCar);

  group.add(manGroup);

  // -------------------------------------------------------------------------
  // 3. SOUTH FERRY SUBWAY PORTAL INUNDATION (u = 0.35 - closer to edge)
  // -------------------------------------------------------------------------
  const subEntrance = new THREE.Group();
  // Subway Kiosk enclosure
  const subKiosk = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2.4, 6.0), steelGreenMat);
  subKiosk.position.set(fMan.side.x * 14.5, 2.9, -6.0);
  subEntrance.add(subKiosk);

  // Green Subway Entrance Globe Lamps
  [-1.8, 1.8].forEach(lampX => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.2, 6), steelGreenMat);
    post.position.set(fMan.side.x * 14.5 + lampX, 2.8, -3.2);
    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
    globe.position.set(fMan.side.x * 14.5 + lampX, 4.0, -3.2);
    subEntrance.add(post);
    subEntrance.add(globe);
  });

  // Sandbag bund surrounding the stairs
  for (let sb = 0; sb < 8; sb++) {
    const sandbag = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.5), new THREE.MeshStandardMaterial({ color: 0xb59a72, roughness: 0.9 }));
    sandbag.position.set(fMan.side.x * 14.5 + ((sb % 4) - 1.5) * 0.9, 2.0 + Math.floor(sb / 4) * 0.35, -3.0);
    subEntrance.add(sandbag);
  }
  group.add(subEntrance);

  // -------------------------------------------------------------------------
  // 4. FDR DRIVE & EAST SIDE COASTAL RESILIENCY (ESCR) FLOODGATES (u = 0.50)
  // -------------------------------------------------------------------------
  const fFDR = getRiverFrame(0.50);
  const fdrGroup = new THREE.Group();
  fdrGroup.position.copy(fFDR.pt);

  // FDR Drive Elevated Shoreline Highway
  const highwayLen = 36.0;
  const highway = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.8, highwayLen), tarmacMat);
  highway.position.set(fFDR.side.x * 14.0, 2.6, 0);
  highway.castShadow = true;
  fdrGroup.add(highway);

  // Concrete Highway Median Barrier
  const median = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, highwayLen), concreteMat);
  median.position.set(fFDR.side.x * 14.0, 3.2, 0);
  fdrGroup.add(median);

  // Overhead Green Highway Sign Gantry
  const gantryPost1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5.0, 8), darkSteelGantry());
  gantryPost1.position.set(fFDR.side.x * 10.8, 3.5, 0);
  const gantryPost2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5.0, 8), darkSteelGantry());
  gantryPost2.position.set(fFDR.side.x * 17.2, 3.5, 0);
  const gantryBeam = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.3, 0.3), darkSteelGantry());
  gantryBeam.position.set(fFDR.side.x * 14.0, 5.9, 0);

  const signBoard = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.4, 0.1), new THREE.MeshStandardMaterial({ color: 0x15803d }));
  signBoard.position.set(fFDR.side.x * 14.0, 5.8, 0.15);

  fdrGroup.add(gantryPost1);
  fdrGroup.add(gantryPost2);
  fdrGroup.add(gantryBeam);
  fdrGroup.add(signBoard);

  // ESCR 16.5-ft Roller Floodgates & Reinforced Berm
  const escrBerm = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.8, highwayLen), concreteMat);
  escrBerm.position.set(fFDR.side.x * 10.0, 1.9, 0);
  fdrGroup.add(escrBerm);

  // Massive Sliding Steel Roller Gates
  [-8.0, 8.0].forEach(gateZ => {
    const gateFrame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.2, 4.8), floodgateGrayMat);
    gateFrame.position.set(fFDR.side.x * 10.0, 3.2, gateZ);
    gateFrame.castShadow = true;

    // High-visibility hazard stripes
    const hazardStrip = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.5, 4.4), escrSteelMat);
    hazardStrip.position.set(fFDR.side.x * 10.0, 3.2, gateZ);

    // Rotating yellow warning beacon
    const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.4, 8), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
    beacon.position.set(fFDR.side.x * 10.0, 5.9, gateZ);

    fdrGroup.add(gateFrame);
    fdrGroup.add(hazardStrip);
    fdrGroup.add(beacon);
  });

  group.add(fdrGroup);

  // -------------------------------------------------------------------------
  // 5. BROOKLYN BRIDGE & GOTHIC TOWERS (u = 0.65)
  // -------------------------------------------------------------------------
  const fBr = getRiverFrame(0.65);
  const brGroup = new THREE.Group();
  brGroup.position.copy(fBr.pt);

  const brSpan = 34.0;
  const brTowerH = 26.0;

  // Two Neo-Gothic Dual-Arch Masonry Towers
  [-brSpan * 0.45, brSpan * 0.45].forEach((towerOffset) => {
    const bTower = new THREE.Group();
    bTower.position.set(fBr.side.x * towerOffset, 0, fBr.side.z * towerOffset);

    // Main masonry pier block
    const pierBlock = new THREE.Mesh(new THREE.BoxGeometry(6.5, 6.0, 8.0), gothicStoneMat);
    pierBlock.position.y = 2.0;
    bTower.add(pierBlock);

    // Dual Gothic Arch cutout effect: two vertical pilasters and central pillar
    [-2.2, 0, 2.2].forEach(pZ => {
      const pilaster = new THREE.Mesh(new THREE.BoxGeometry(2.2, brTowerH, 1.4), gothicStoneMat);
      pilaster.position.set(0, brTowerH * 0.5 + 4.0, pZ);
      pilaster.castShadow = true;
      bTower.add(pilaster);
    });

    // Arch top crown cap
    const topCap = new THREE.Mesh(new THREE.BoxGeometry(6.6, 2.2, 7.8), gothicStoneMat);
    topCap.position.set(0, brTowerH + 4.8, 0);
    bTower.add(topCap);

    brGroup.add(bTower);
  });

  // Brooklyn Bridge Suspended Roadway & Boardwalk
  const brDeck = new THREE.Mesh(new THREE.BoxGeometry(brSpan + 6.0, 0.8, 6.5), tarmacMat);
  brDeck.rotation.y = Math.atan2(fBr.side.x, fBr.side.z);
  brDeck.position.set(0, 9.5, 0);
  brDeck.castShadow = true;
  brGroup.add(brDeck);

  // Elevated central timber pedestrian promenade
  const boardwalk = new THREE.Mesh(new THREE.BoxGeometry(brSpan + 6.0, 0.3, 2.2), new THREE.MeshStandardMaterial({ color: 0x785336, roughness: 0.8 }));
  boardwalk.rotation.y = Math.atan2(fBr.side.x, fBr.side.z);
  boardwalk.position.set(0, 10.1, 0);
  brGroup.add(boardwalk);

  // Diagonal stay cables & vertical suspenders
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

  // DUMBO Brick Warehouses on Brooklyn Bank
  [-12, 0, 12].forEach(wZ => {
    const warehouse = new THREE.Mesh(new THREE.BoxGeometry(10.0, 9.0, 9.0), brickWarehouseMat);
    warehouse.position.set(-fBr.side.x * 25.0, 4.5, wZ);
    warehouse.castShadow = true;
    brGroup.add(warehouse);
  });

  group.add(brGroup);

  // -------------------------------------------------------------------------
  // 6. CON EDISON 14TH STREET SUBSTATION & ARC FLASH EXPLOSION (u = 0.78)
  // -------------------------------------------------------------------------
  const fConEd = getRiverFrame(0.78);
  const conEdGroup = new THREE.Group();
  conEdGroup.position.copy(fConEd.pt);

  // Substation Concrete Yard Platform
  const subYard = new THREE.Mesh(new THREE.BoxGeometry(18.0, 1.2, 26.0), concreteMat);
  subYard.position.set(fConEd.side.x * 18.0, 1.6, 0);
  subYard.receiveShadow = true;
  conEdGroup.add(subYard);

  // High-Voltage 345 kV Transformers & Radiator Coolers
  for (let tr = 0; tr < 3; tr++) {
    const trGroup = new THREE.Group();
    const trTank = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.2, 4.2), transformerMat);
    trTank.position.y = 2.4;
    trTank.castShadow = true;
    trGroup.add(trTank);

    // Radiator cooling fins
    for (let f = -1.6; f <= 1.6; f += 0.8) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.4, 4.4), transformerMat);
      fin.position.set(f, 2.4, 0);
      trGroup.add(fin);
    }

    // High-Voltage Ceramic Bushings on roof
    [-1.0, 0, 1.0].forEach(bZ => {
      const bushing = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 2.2, 8), ceramicMat);
      bushing.position.set(0, 4.8, bZ);
      trGroup.add(bushing);
    });

    trGroup.position.set(fConEd.side.x * 18.0, 1.0, -8.0 + tr * 8.0);
    conEdGroup.add(trGroup);
  }

  // Steel Gantry Transmission Towers
  [-11.0, 11.0].forEach(tZ => {
    const gTower = new THREE.Mesh(new THREE.BoxGeometry(1.8, 12.0, 1.8), darkSteelGantry());
    gTower.position.set(fConEd.side.x * 13.0, 7.0, tZ);
    conEdGroup.add(gTower);
  });

  // Dynamic High-Voltage Arc Flash Burst Mesh (activated during surge hit)
  const arcLight = new THREE.PointLight(0x60a5fa, 0.0, 60);
  arcLight.position.set(fConEd.side.x * 18.0, 7.0, 0);
  conEdGroup.add(arcLight);

  const arcGeo = new THREE.SphereGeometry(2.4, 8, 8);
  const arcMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.0 });
  const arcMesh = new THREE.Mesh(arcGeo, arcMat);
  arcMesh.position.copy(arcLight.position);
  conEdGroup.add(arcMesh);

  group.add(conEdGroup);

  // -------------------------------------------------------------------------
  // 7. USACE UNWATERING ARMADA & HIGH-VOLUME MOBILE PUMPS (u = 0.92)
  // -------------------------------------------------------------------------
  const fArmy = getRiverFrame(0.92);
  const armyGroup = new THREE.Group();
  armyGroup.position.copy(fArmy.pt);

  // USACE Command & Heavy Dewatering Trucks
  for (let p = 0; p < 3; p++) {
    const pumpRig = new THREE.Group();
    // Trailer chassis
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 4.4), usaceArmyMat);
    chassis.position.y = 1.0;
    pumpRig.add(chassis);

    // Industrial turbine pump engine
    const engine = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.6, 2.8), new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.5, metalness: 0.5 }));
    engine.position.set(0, 2.0, -0.4);
    pumpRig.add(engine);

    // Large flexible dewatering discharge hose leading directly into East River
    const hose = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 10.0, 12), hoseMat);
    hose.rotation.z = Math.PI * 0.44;
    hose.position.set(-4.5, 0.8, 0);
    pumpRig.add(hose);

    // Emergency mobile light tower
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
