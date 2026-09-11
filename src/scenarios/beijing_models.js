import * as THREE from 'three';

/**
 * Procedural 3D Landmarks, Bridges, Stranded Trains, Sluice Gates, Helicopters &
 * Mountain Village Architecture for Beijing, China (Mentougou Mountain Flash Deluge Scenario)
 * 
 * Features 65+ dynamic collapsing structures, traditional stone-and-tile mountain village dwellings,
 * stone arch footbridges, Highway G109 sheared retaining walls, and swept vehicles that
 * physically tilt, fracture, and wash down the roaring Yongding River torrent.
 */
export function buildBeijingScene(group, river, terrain) {
  const wipeableItems = [];
  const dynamicWaterItems = [];
  const animatedRotors = [];

  // Helper to place objects on river tangents & bank normals
  function getRiverFrame(u) {
    const pt = river.getPointAt(u);
    const tangent = river.getTangentAt(u).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();
    return { pt, tangent, side, up };
  }

  // Common Materials
  const darkGreenTrainMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.4, metalness: 0.2 });
  const trainYellowStripe = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
  const railSteelMat      = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.3, metalness: 0.8 });
  const ballastGravelMat  = new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.9 });
  const mudslideMat       = new THREE.MeshStandardMaterial({ color: 0x713f12, roughness: 0.95 });
  const boulderMat        = new THREE.MeshStandardMaterial({ color: 0x44403c, roughness: 0.9 });
  const tarmacMat         = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.8 });
  const guardrailMat      = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4, metalness: 0.6 });
  const concreteDamMat    = new THREE.MeshStandardMaterial({ color: 0xa8a29e, roughness: 0.75, metalness: 0.1 });
  const steelGateMat      = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.7 });
  const marcoPoloStoneMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.85 });
  const plaOliveMat       = new THREE.MeshStandardMaterial({ color: 0x2e4027, roughness: 0.5, metalness: 0.3 });
  const rotorBladeMat     = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
  const rescueTentMat     = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.85 });
  const redFlagMat        = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 });
  const municipalYellowMat= new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
  const drainHoseMat      = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.6 });

  // -------------------------------------------------------------------------
  // PROCEDURAL BUILDERS FOR NORTHERN CHINESE MOUNTAIN ARCHITECTURE & VEHICLES
  // -------------------------------------------------------------------------

  /**
   * Traditional Mentougou Mountain Village Dwelling (Siheyuan / Stone Cottage)
   * Heavy mountain quarry stone / red-brick base walls, dark grey pitched tile roof
   * with curved upturned eaves, red timber courtyard gate, and stone chimney.
   */
  function createSiheyuanDwelling(bw = 5.2, bh = 3.2, bd = 4.8, wallHex = 0x57534e, roofHex = 0x292524) {
    const homeGroup = new THREE.Group();
    const materials = [];

    const wallMat = new THREE.MeshStandardMaterial({ color: wallHex, roughness: 0.9 });
    const roofTileMat = new THREE.MeshStandardMaterial({ color: roofHex, roughness: 0.8 });
    const redGateMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.6 });
    const woodBeamMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.85 });
    materials.push(wallMat, roofTileMat, redGateMat, woodBeamMat);

    // Stone / brick main dwelling block
    const body = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), wallMat);
    body.position.y = bh * 0.5;
    body.castShadow = true;
    body.receiveShadow = true;
    homeGroup.add(body);

    // Traditional Pitched Chinese Tile Roof with eaves overhang
    const rw = bw + 1.4;
    const rd = bd + 1.4;
    const pitchAngle = 0.44; // ~25 deg
    const slopeLen = (rd * 0.5) / Math.cos(pitchAngle);
    const ridgeH = Math.sin(pitchAngle) * slopeLen;

    const slopeGeo = new THREE.BoxGeometry(rw, 0.16, slopeLen);
    const frontSlope = new THREE.Mesh(slopeGeo, roofTileMat);
    frontSlope.position.set(0, bh + ridgeH * 0.48, rd * 0.24);
    frontSlope.rotation.x = pitchAngle;
    frontSlope.castShadow = true;
    homeGroup.add(frontSlope);

    const backSlope = new THREE.Mesh(slopeGeo, roofTileMat);
    backSlope.position.set(0, bh + ridgeH * 0.48, -rd * 0.24);
    backSlope.rotation.x = -pitchAngle;
    backSlope.castShadow = true;
    homeGroup.add(backSlope);

    // Chinese horizontal ridge beam (Zhengji)
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(rw + 0.3, 0.32, 0.42), roofTileMat);
    ridge.position.set(0, bh + ridgeH + 0.08, 0);
    ridge.castShadow = true;
    homeGroup.add(ridge);

    // Gable triangular side masonry
    [-bw * 0.48, bw * 0.48].forEach(gx => {
      const gable = new THREE.Mesh(new THREE.BoxGeometry(0.18, ridgeH * 0.85, bd * 0.9), wallMat);
      gable.position.set(gx, bh + ridgeH * 0.42, 0);
      homeGroup.add(gable);
    });

    // Red Wooden Entrance Gate / Portico
    const gate = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.6, 0.15), redGateMat);
    gate.position.set(0, 0.8, bd * 0.5 + 0.08);
    homeGroup.add(gate);

    // Timber eave bracket accents
    [-bw * 0.4, bw * 0.4].forEach(bx => {
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.35, 0.4), woodBeamMat);
      bracket.position.set(bx, bh - 0.1, bd * 0.5 + 0.1);
      homeGroup.add(bracket);
    });

    // Small stone chimney on roof
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 0.6), wallMat);
    chimney.position.set(bw * 0.3, bh + 1.0, -bd * 0.25);
    homeGroup.add(chimney);

    return { group: homeGroup, materials, primaryMat: wallMat };
  }

  /**
   * Historic Mountain Village Stone Arched Footbridge
   */
  function createStoneArchFootbridge(span = 14.0, width = 3.0) {
    const bridgeGroup = new THREE.Group();
    const materials = [];

    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.9 });
    materials.push(stoneMat);

    // Main Arched Deck
    const archDeck = new THREE.Mesh(new THREE.BoxGeometry(span, 0.6, width), stoneMat);
    archDeck.position.y = 2.4;
    archDeck.castShadow = true;
    bridgeGroup.add(archDeck);

    // Stone Pier Abutments
    [-span * 0.45, span * 0.45].forEach(ax => {
      const pier = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.2, width * 1.2), stoneMat);
      pier.position.set(ax, 1.6, 0);
      pier.castShadow = true;
      bridgeGroup.add(pier);
    });

    // Stone Parapet Railings
    [-width * 0.48, width * 0.48].forEach(pz => {
      const parapet = new THREE.Mesh(new THREE.BoxGeometry(span, 0.7, 0.25), stoneMat);
      parapet.position.set(0, 3.0, pz);
      bridgeGroup.add(parapet);
    });

    return { group: bridgeGroup, materials, primaryMat: stoneMat };
  }

  /**
   * Chinese Rural Minivan (Wuling Hongguang Style)
   */
  function createWulingMinivan(colorHex = 0xe2e8f0) {
    const vanGroup = new THREE.Group();
    const materials = [];

    const vanMat   = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.4, metalness: 0.2 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.7 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    materials.push(vanMat, glassMat, wheelMat);

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 3.6), vanMat);
    body.position.y = 0.65;
    body.castShadow = true;
    vanGroup.add(body);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.65, 2.4), glassMat);
    cabin.position.set(0, 1.15, -0.2);
    vanGroup.add(cabin);

    const wGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.2, 8);
    wGeo.rotateZ(Math.PI * 0.5);
    [-0.8, 0.8].forEach(wx => {
      [-1.1, 1.1].forEach(wz => {
        const wheel = new THREE.Mesh(wGeo, wheelMat);
        wheel.position.set(wx, 0.26, wz);
        vanGroup.add(wheel);
      });
    });

    return { group: vanGroup, materials, primaryMat: vanMat };
  }

  /**
   * Mountain Farm Tractor / Great Wall Rural Pickup
   */
  function createMountainFarmVehicle(isTractor = false) {
    const vehGroup = new THREE.Group();
    const materials = [];

    const bodyMat  = new THREE.MeshStandardMaterial({ color: isTractor ? 0x15803d : 0x1d4ed8, roughness: 0.5 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.6 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    materials.push(bodyMat, metalMat, wheelMat);

    if (isTractor) {
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 2.4), bodyMat);
      chassis.position.y = 0.55;
      vehGroup.add(chassis);

      const engine = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 1.2), metalMat);
      engine.position.set(0, 0.95, 0.5);
      vehGroup.add(engine);

      const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 6), metalMat);
      exhaust.position.set(0.35, 1.6, 0.3);
      vehGroup.add(exhaust);

      // Large rear wheels, small front wheels
      const rWheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.32, 10);
      rWheelGeo.rotateZ(Math.PI * 0.5);
      [-0.8, 0.8].forEach(wx => {
        const wheel = new THREE.Mesh(rWheelGeo, wheelMat);
        wheel.position.set(wx, 0.48, -0.6);
        vehGroup.add(wheel);
      });

      const fWheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.22, 8);
      fWheelGeo.rotateZ(Math.PI * 0.5);
      [-0.7, 0.7].forEach(wx => {
        const wheel = new THREE.Mesh(fWheelGeo, wheelMat);
        wheel.position.set(wx, 0.28, 0.7);
        vehGroup.add(wheel);
      });
    } else {
      // Pickup truck
      const cab = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.85, 1.8), bodyMat);
      cab.position.set(0, 0.75, 0.6);
      vehGroup.add(cab);

      const bed = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.5, 1.8), metalMat);
      bed.position.set(0, 0.55, -0.9);
      vehGroup.add(bed);

      const wGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.22, 8);
      wGeo.rotateZ(Math.PI * 0.5);
      [-0.85, 0.85].forEach(wx => {
        [-1.0, 1.0].forEach(wz => {
          const wheel = new THREE.Mesh(wGeo, wheelMat);
          wheel.position.set(wx, 0.3, wz);
          vehGroup.add(wheel);
        });
      });
    }

    return { group: vehGroup, materials, primaryMat: bodyMat };
  }

  /**
   * Rural Electric Power Transmission Pylon
   */
  function createRuralPowerPylon() {
    const pylonGroup = new THREE.Group();
    const materials = [];

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const insulMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    materials.push(woodMat, insulMat);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 7.5, 8), woodMat);
    pole.position.y = 3.75;
    pole.castShadow = true;
    pylonGroup.add(pole);

    const crossArm = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 0.15), woodMat);
    crossArm.position.set(0, 6.8, 0);
    pylonGroup.add(crossArm);

    [-1.0, 0, 1.0].forEach(ix => {
      const insul = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.25, 6), insulMat);
      insul.position.set(ix, 6.6, 0);
      pylonGroup.add(insul);
    });

    return { group: pylonGroup, materials, primaryMat: woodMat };
  }

  /**
   * Highway G109 Sheared Embankment & Retaining Wall Segment
   */
  function createHighwayRetainingWall(length = 6.0, height = 3.5) {
    const wallGroup = new THREE.Group();
    const materials = [];

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.85 });
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.8 });
    const railMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4, metalness: 0.6 });
    materials.push(wallMat, roadMat, railMat);

    const masonry = new THREE.Mesh(new THREE.BoxGeometry(1.8, height, length), wallMat);
    masonry.position.y = height * 0.5;
    masonry.castShadow = true;
    wallGroup.add(masonry);

    const road = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.4, length), roadMat);
    road.position.set(1.4, height + 0.2, 0);
    wallGroup.add(road);

    const guardrail = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.6, length), railMat);
    guardrail.position.set(0.0, height + 0.6, 0);
    wallGroup.add(guardrail);

    return { group: wallGroup, materials, primaryMat: wallMat };
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
      driftDir: tangent.clone().multiplyScalar(options.driftSpeed || 28.0),
      tumbleVel: new THREE.Vector3(
        (Math.random() - 0.5) * (options.tumbleScale || 7.0),
        (Math.random() - 0.5) * (options.tumbleScale || 6.0),
        (Math.random() - 0.5) * (options.tumbleScale || 7.0)
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
  // 1. LUOPOLING MOUNTAIN PASS & STRANDED K396 TRAIN (u = 0.20)
  // -------------------------------------------------------------------------
  const fLuo = getRiverFrame(0.20);
  const luoGroup = new THREE.Group();
  luoGroup.position.copy(fLuo.pt);

  const railEmbankment = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.2, 42.0), ballastGravelMat);
  railEmbankment.position.set(-fLuo.side.x * 12.0, 1.6, 0);
  railEmbankment.castShadow = true;
  luoGroup.add(railEmbankment);

  [-0.8, 0.8].forEach(trackX => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.15, 42.0), railSteelMat);
    rail.position.set(-fLuo.side.x * 12.0 + trackX, 3.3, 0);
    luoGroup.add(rail);
  });

  const trainCarDefs = [
    { z: -13.0, isLoco: true },
    { z: -2.0,  isLoco: false },
    { z: 9.0,   isLoco: false },
    { z: 20.0,  isLoco: false }
  ];

  trainCarDefs.forEach((car, ci) => {
    const carGroup = new THREE.Group();
    const carMaterials = [darkGreenTrainMat, trainYellowStripe, railSteelMat];

    const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 9.5), darkGreenTrainMat);
    body.position.y = 1.5;
    body.castShadow = true;
    carGroup.add(body);

    const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.25, 9.5), trainYellowStripe);
    stripe.position.y = 1.2;
    carGroup.add(stripe);

    const roof = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 9.5, 12, 1, false, 0, Math.PI), darkGreenTrainMat);
    roof.rotation.z = Math.PI * 0.5;
    roof.rotation.y = Math.PI * 0.5;
    roof.position.y = 2.8;
    carGroup.add(roof);

    const windowMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.1, metalness: 0.8 });
    carMaterials.push(windowMat);
    const windows = new THREE.Mesh(new THREE.BoxGeometry(2.44, 0.7, 8.5), windowMat);
    windows.position.y = 1.8;
    carGroup.add(windows);

    // Car world position along Luopoling siding
    const carPos = fLuo.pt.clone()
      .add(new THREE.Vector3(-fLuo.side.x * 12.0, 0, 0))
      .addScaledVector(fLuo.tangent, car.z);
    carPos.y = terrain.getTerrainHeight(carPos.x, carPos.z) + 3.4;

    carGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fLuo.tangent);

    registerWipeable(carGroup, 0.20 + ci * 0.005, carPos, fLuo.tangent, fLuo.side, {
      primaryMat: darkGreenTrainMat,
      materials: carMaterials,
      driftSpeed: 18.0,
      tumbleScale: 3.2,
      collapseTilt: 0.62,
      sinkScale: 0.22,
      washSpeed: 24.0,
      maxProg: 0.08
    });
  });

  const mudBank = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 10.5, 2.6, 16), mudslideMat);
  mudBank.position.set(-fLuo.side.x * 12.0, 1.4, -20.0);
  mudBank.scale.set(1.2, 1.0, 1.8);
  mudBank.castShadow = true;
  luoGroup.add(mudBank);

  for (let b = 0; b < 10; b++) {
    const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8 + Math.random() * 0.7), boulderMat);
    boulder.position.set(
      -fLuo.side.x * 12.0 + (Math.random() - 0.5) * 5.0,
      2.6 + Math.random() * 1.5,
      -26.0 + b * 4.5
    );
    boulder.rotation.set(Math.random() * 3, Math.random() * 3, 0);
    luoGroup.add(boulder);
  }
  group.add(luoGroup);

  // -------------------------------------------------------------------------
  // CLUSTER 1: MIAOFENGSHAN GORGE HEADWATERS & VILLAGES (u = 0.08 - 0.18)
  // -------------------------------------------------------------------------
  const stoneColors = [0x57534e, 0x44403c, 0x78716c, 0x991b1b, 0x713f12];
  const tileColors  = [0x292524, 0x1c1917, 0x3f3f46, 0x1e293b];

  for (let i = 0; i < 10; i++) {
    const uHut = 0.08 + i * 0.01;
    const fHut = getRiverFrame(uHut);
    const bankDir = (i % 2 === 0) ? -1 : 1;
    const dist = 6.5 + (i % 3) * 1.5;

    const home = createSiheyuanDwelling(
      4.8 + (i % 3) * 0.6,
      2.8 + (i % 2) * 0.4,
      4.4 + (i % 2) * 0.5,
      stoneColors[i % stoneColors.length],
      tileColors[i % tileColors.length]
    );

    const pos = fHut.pt.clone().addScaledVector(fHut.side, bankDir * dist);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    home.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fHut.tangent);
    home.group.rotation.y += (i * 0.5);

    registerWipeable(home.group, uHut, pos, fHut.tangent, fHut.side, {
      primaryMat: home.primaryMat,
      materials: home.materials,
      driftSpeed: 28.0,
      tumbleScale: 6.5,
      collapseTilt: (bankDir > 0 ? -0.45 : 0.45)
    });
  }

  // Stone Arch Footbridge at Miaofengshan Headwaters
  {
    const fBridge = getRiverFrame(0.12);
    const bridge = createStoneArchFootbridge(14.0, 3.2);
    const pos = fBridge.pt.clone();
    pos.y = fBridge.pt.y + 0.8;
    bridge.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fBridge.side);

    registerWipeable(bridge.group, 0.12, pos, fBridge.tangent, fBridge.side, {
      primaryMat: bridge.primaryMat,
      materials: bridge.materials,
      driftSpeed: 24.0,
      tumbleScale: 5.5,
      collapseTilt: 0.5
    });
  }

  // Rural Minivans & Tractors in Miaofengshan
  [0.10, 0.15].forEach((uV, vIdx) => {
    const fV = getRiverFrame(uV);
    const van = (vIdx === 0 ? createWulingMinivan(0xe2e8f0) : createMountainFarmVehicle(true));
    const pos = fV.pt.clone().addScaledVector(fV.side, (vIdx === 0 ? -6.5 : 7.0));
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.2;
    van.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fV.tangent);

    registerWipeable(van.group, uV, pos, fV.tangent, fV.side, {
      primaryMat: van.primaryMat,
      materials: van.materials,
      driftSpeed: 30.0,
      tumbleScale: 8.0
    });
  });

  // Rural electric power transmission poles along gorge
  for (let p = 0; p < 3; p++) {
    const uP = 0.09 + p * 0.04;
    const fP = getRiverFrame(uP);
    const pylon = createRuralPowerPylon();
    const pos = fP.pt.clone().addScaledVector(fP.side, -10.5);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z);
    pylon.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fP.tangent);

    registerWipeable(pylon.group, uP, pos, fP.tangent, fP.side, {
      primaryMat: pylon.primaryMat,
      materials: pylon.materials,
      driftSpeed: 25.0,
      tumbleScale: 7.0,
      collapseTilt: 0.7
    });
  }

  // -------------------------------------------------------------------------
  // CLUSTER 2: LUOPOLING GORGE HAMLET (u = 0.22 - 0.32)
  // -------------------------------------------------------------------------
  for (let i = 0; i < 8; i++) {
    const uLuoHut = 0.22 + i * 0.012;
    const fLuoHut = getRiverFrame(uLuoHut);
    const bankDir = (i % 2 === 0) ? 1 : -1;
    const dist = 6.2 + (i % 3) * 1.5;

    const home = createSiheyuanDwelling(
      5.0 + (i % 2) * 0.5,
      2.9 + (i % 2) * 0.3,
      4.2 + (i % 3) * 0.4,
      stoneColors[(i + 1) % stoneColors.length],
      tileColors[(i + 1) % tileColors.length]
    );

    const pos = fLuoHut.pt.clone().addScaledVector(fLuoHut.side, bankDir * dist);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    home.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fLuoHut.tangent);
    home.group.rotation.y += (i * 0.4);

    registerWipeable(home.group, uLuoHut, pos, fLuoHut.tangent, fLuoHut.side, {
      primaryMat: home.primaryMat,
      materials: home.materials,
      driftSpeed: 27.0,
      tumbleScale: 6.0,
      collapseTilt: (bankDir > 0 ? -0.4 : 0.4)
    });
  }

  // Vehicles near Luopoling siding
  [0.24, 0.29].forEach((uV, vIdx) => {
    const fV = getRiverFrame(uV);
    const pickup = createMountainFarmVehicle(false);
    const pos = fV.pt.clone().addScaledVector(fV.side, -8.0);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.2;
    pickup.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fV.tangent);

    registerWipeable(pickup.group, uV, pos, fV.tangent, fV.side, {
      primaryMat: pickup.primaryMat,
      materials: pickup.materials,
      driftSpeed: 30.0,
      tumbleScale: 7.5
    });
  });

  // -------------------------------------------------------------------------
  // 2. HIGHWAY G109 MOUNTAIN WASHOUT & SWEPT CARS (u = 0.35)
  // -------------------------------------------------------------------------
  const fG109 = getRiverFrame(0.35);
  const g109Group = new THREE.Group();
  g109Group.position.copy(fG109.pt);

  const roadSegment1 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.8, 14.0), tarmacMat);
  roadSegment1.position.set(fG109.side.x * 11.0, 3.2, -14.0);
  g109Group.add(roadSegment1);

  const roadSegment2 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.8, 14.0), tarmacMat);
  roadSegment2.position.set(fG109.side.x * 11.0, 3.2, 12.0);
  g109Group.add(roadSegment2);

  const rail1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 14.0), guardrailMat);
  rail1.position.set(fG109.side.x * 8.4, 3.8, -14.0);
  g109Group.add(rail1);
  group.add(g109Group);

  // Dynamic Highway G109 Sheared Retaining Wall Segment that collapses into gorge
  for (let rw = 0; rw < 3; rw++) {
    const retWall = createHighwayRetainingWall(5.5, 3.8);
    const pos = fG109.pt.clone().addScaledVector(fG109.side, 8.5).addScaledVector(fG109.tangent, -6.0 + rw * 5.5);
    pos.y = 1.6;
    retWall.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fG109.tangent);

    registerWipeable(retWall.group, 0.34 + rw * 0.015, pos, fG109.tangent, fG109.side, {
      primaryMat: retWall.primaryMat,
      materials: retWall.materials,
      driftSpeed: 22.0,
      tumbleScale: 5.0,
      collapseTilt: 0.65
    });
  }

  // Swept private vehicles floating and tumbling in the flood torrent
  const carColors = [0xdc2626, 0x2563eb, 0xf8fafc, 0x475569];
  for (let c = 0; c < 4; c++) {
    const car = createWulingMinivan(carColors[c]);
    const pos = fG109.pt.clone().addScaledVector(fG109.side, 1.0 + (c % 2) * 3.5).addScaledVector(fG109.tangent, -6.0 + c * 5.0);
    pos.y = 0.8;
    car.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fG109.tangent);
    car.group.rotation.set(0.35 + c * 0.15, c * 0.6, -0.25);

    registerWipeable(car.group, 0.345 + c * 0.01, pos, fG109.tangent, fG109.side, {
      primaryMat: car.primaryMat,
      materials: car.materials,
      driftSpeed: 32.0,
      tumbleScale: 8.5,
      sinkScale: 0.24
    });
  }

  // -------------------------------------------------------------------------
  // CLUSTER 3: DINGJIATAN & SANJIADIAN GORGE VILLAGE (u = 0.42 - 0.54)
  // -------------------------------------------------------------------------
  for (let i = 0; i < 10; i++) {
    const uDing = 0.42 + i * 0.012;
    const fDing = getRiverFrame(uDing);
    const bankDir = (i % 2 === 0) ? -1 : 1;
    const dist = 6.2 + (i % 3) * 1.5;

    const home = createSiheyuanDwelling(
      5.2 + (i % 3) * 0.5,
      3.0 + (i % 2) * 0.4,
      4.6 + (i % 2) * 0.4,
      stoneColors[(i + 2) % stoneColors.length],
      tileColors[(i + 2) % tileColors.length]
    );

    const pos = fDing.pt.clone().addScaledVector(fDing.side, bankDir * dist);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    home.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fDing.tangent);
    home.group.rotation.y += (i * 0.45);

    registerWipeable(home.group, uDing, pos, fDing.tangent, fDing.side, {
      primaryMat: home.primaryMat,
      materials: home.materials,
      driftSpeed: 27.0,
      tumbleScale: 6.5,
      collapseTilt: (bankDir > 0 ? -0.45 : 0.45)
    });
  }

  // Dingjiatan stone arch bridge across gorge
  {
    const fBridge = getRiverFrame(0.46);
    const bridge = createStoneArchFootbridge(15.0, 3.4);
    const pos = fBridge.pt.clone();
    pos.y = fBridge.pt.y + 0.8;
    bridge.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fBridge.side);

    registerWipeable(bridge.group, 0.46, pos, fBridge.tangent, fBridge.side, {
      primaryMat: bridge.primaryMat,
      materials: bridge.materials,
      driftSpeed: 24.0,
      tumbleScale: 5.5,
      collapseTilt: 0.55
    });
  }

  // -------------------------------------------------------------------------
  // 3. SANJIADIAN RESERVOIR DAM & GORGE CONTROL GATES (u = 0.48)
  // -------------------------------------------------------------------------
  const fDam = getRiverFrame(0.48);
  const damGroup = new THREE.Group();
  damGroup.position.copy(fDam.pt);

  const damSpan = 26.0;
  const damHeight = 8.5;

  const damWall = new THREE.Mesh(new THREE.BoxGeometry(damSpan, damHeight, 5.0), concreteDamMat);
  damWall.rotation.y = Math.atan2(fDam.side.x, fDam.side.z);
  damWall.position.set(0, damHeight * 0.5, 0);
  damWall.castShadow = true;
  damGroup.add(damWall);

  for (let g = 0; g < 6; g++) {
    const gX = (g - 2.5) * 3.6;
    const gatePillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 10.0, 6.0), concreteDamMat);
    gatePillar.rotation.y = Math.atan2(fDam.side.x, fDam.side.z);
    gatePillar.position.set(fDam.side.x * gX, 5.0, fDam.side.z * gX);
    damGroup.add(gatePillar);

    const radialGate = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 2.6, 8, 1, false, 0, Math.PI * 0.6), steelGateMat);
    radialGate.rotation.z = Math.PI * 0.5;
    radialGate.position.set(fDam.side.x * gX, 4.2, fDam.side.z * gX);
    damGroup.add(radialGate);
  }

  const damBridge = new THREE.Mesh(new THREE.BoxGeometry(damSpan + 2, 0.8, 3.2), concreteDamMat);
  damBridge.rotation.y = Math.atan2(fDam.side.x, fDam.side.z);
  damBridge.position.set(0, damHeight + 0.4, 0);
  damGroup.add(damBridge);
  group.add(damGroup);

  // -------------------------------------------------------------------------
  // 4. HISTORIC LUGOU BRIDGE (MARCO POLO BRIDGE - 1189 AD) & SLUICE (u = 0.60)
  // -------------------------------------------------------------------------
  const fLugou = getRiverFrame(0.60);
  const lugouGroup = new THREE.Group();
  lugouGroup.position.copy(fLugou.pt);

  const bridgeSpan = 30.0;
  const numArches = 7;
  const archSpacing = bridgeSpan / numArches;

  for (let a = 0; a <= numArches; a++) {
    const offset = (a - numArches * 0.5) * archSpacing;
    const pier = new THREE.Group();
    pier.position.set(fLugou.side.x * offset, 1.2, fLugou.side.z * offset);

    const pierBody = new THREE.Mesh(new THREE.BoxGeometry(1.4, 4.2, 5.5), marcoPoloStoneMat);
    pierBody.castShadow = true;
    pier.add(pierBody);

    const starling = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 1.4, 4.2, 3), marcoPoloStoneMat);
    starling.rotation.y = Math.PI * 0.5;
    starling.position.set(0, 0, -3.2);
    pier.add(starling);

    [-2.2, 2.2].forEach(lionZ => {
      const lionPost = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.3), marcoPoloStoneMat);
      lionPost.position.set(0, 2.6, lionZ);
      const lion = new THREE.Mesh(new THREE.SphereGeometry(0.22, 6, 6), marcoPoloStoneMat);
      lion.position.set(0, 3.3, lionZ);
      pier.add(lionPost);
      pier.add(lion);
    });

    lugouGroup.add(pier);
  }

  const stoneDeck = new THREE.Mesh(new THREE.BoxGeometry(bridgeSpan + 2.0, 0.6, 4.8), marcoPoloStoneMat);
  stoneDeck.rotation.y = Math.atan2(fLugou.side.x, fLugou.side.z);
  stoneDeck.position.set(0, 3.4, 0);
  stoneDeck.castShadow = true;
  lugouGroup.add(stoneDeck);

  const sluiceGroup = new THREE.Group();
  sluiceGroup.position.set(fLugou.side.x * 20.0, 0, 0);
  const sluiceWall = new THREE.Mesh(new THREE.BoxGeometry(12.0, 6.5, 4.0), concreteDamMat);
  sluiceWall.position.y = 3.2;
  sluiceGroup.add(sluiceWall);

  [-3.5, 0, 3.5].forEach(gX => {
    const gateMesh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 4.0, 0.4), steelGateMat);
    gateMesh.position.set(gX, 3.8, 0);
    sluiceGroup.add(gateMesh);
  });
  lugouGroup.add(sluiceGroup);
  group.add(lugouGroup);

  // -------------------------------------------------------------------------
  // CLUSTER 4: LUGOUQIAO FLOODPLAIN HOMES & DIKES (u = 0.62 - 0.72)
  // -------------------------------------------------------------------------
  for (let i = 0; i < 8; i++) {
    const uLug = 0.62 + i * 0.012;
    const fLug = getRiverFrame(uLug);
    const bankDir = (i % 2 === 0) ? -1 : 1;
    const dist = 8.5 + (i % 3) * 2.0;

    const home = createSiheyuanDwelling(
      5.4 + (i % 2) * 0.5,
      3.1 + (i % 2) * 0.3,
      4.5 + (i % 3) * 0.4,
      stoneColors[(i + 3) % stoneColors.length],
      tileColors[(i + 3) % tileColors.length]
    );

    const pos = fLug.pt.clone().addScaledVector(fLug.side, bankDir * dist);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    home.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fLug.tangent);
    home.group.rotation.y += (i * 0.4);

    registerWipeable(home.group, uLug, pos, fLug.tangent, fLug.side, {
      primaryMat: home.primaryMat,
      materials: home.materials,
      driftSpeed: 26.0,
      tumbleScale: 6.0,
      collapseTilt: (bankDir > 0 ? -0.4 : 0.4)
    });
  }

  // Temporary earthen/sandbag flood protection dikes that breach
  for (let d = 0; d < 3; d++) {
    const dike = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 5.5), ballastGravelMat);
    const fDike = getRiverFrame(0.66 + d * 0.02);
    const pos = fDike.pt.clone().addScaledVector(fDike.side, -11.0);
    pos.y = 1.8;
    dike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fDike.tangent);

    registerWipeable(dike, 0.66 + d * 0.02, pos, fDike.tangent, fDike.side, {
      primaryMat: ballastGravelMat,
      driftSpeed: 22.0,
      tumbleScale: 4.5,
      collapseTilt: 0.6
    });
  }

  // -------------------------------------------------------------------------
  // 5. PLA AIR-BRIDGE RESCUE HELICOPTERS & RELIEF STAGING (u = 0.75)
  // -------------------------------------------------------------------------
  const fPla = getRiverFrame(0.75);
  const plaGroup = new THREE.Group();
  plaGroup.position.copy(fPla.pt);

  [-14.0, 14.0].forEach((heliZ, idx) => {
    const heli = new THREE.Group();
    heli.position.set(-fPla.side.x * 16.0, 14.0 + idx * 3.0, heliZ);

    const fuselage = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 7.5), plaOliveMat);
    fuselage.castShadow = true;
    heli.add(fuselage);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(1.3, 2.0, 8), plaOliveMat);
    nose.rotation.x = Math.PI * 0.5;
    nose.position.set(0, -0.2, 4.4);
    heli.add(nose);

    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 6.0), plaOliveMat);
    tail.position.set(0, 0.5, -6.0);
    heli.add(tail);

    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.8, 1.2), plaOliveMat);
    fin.position.set(0, 1.2, -8.8);
    heli.add(fin);

    const rotorHub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 8), rotorBladeMat);
    rotorHub.position.y = 1.3;
    heli.add(rotorHub);

    const rotorBlades = new THREE.Group();
    rotorBlades.position.y = 1.4;
    for (let b = 0; b < 5; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.05, 5.2), rotorBladeMat);
      blade.rotation.y = (b / 5) * Math.PI * 2;
      blade.position.set(Math.sin(blade.rotation.y) * 2.5, 0, Math.cos(blade.rotation.y) * 2.5);
      rotorBlades.add(blade);
    }
    heli.add(rotorBlades);
    animatedRotors.push(rotorBlades);

    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 7.0, 4), guardrailMat);
    cable.position.set(1.1, -3.5, 0);
    heli.add(cable);

    const reliefCrate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 1.2), municipalYellowMat);
    reliefCrate.position.set(1.1, -7.2, 0);
    heli.add(reliefCrate);

    plaGroup.add(heli);
  });

  const campGround = new THREE.Mesh(new THREE.BoxGeometry(18.0, 0.6, 22.0), ballastGravelMat);
  campGround.position.set(fPla.side.x * 18.0, 3.8, 0);
  plaGroup.add(campGround);

  [-6.0, 0, 6.0].forEach(tZ => {
    // Ridge Disaster Relief Command Tent
    const tentBody = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.0, 3.8), rescueTentMat);
    tentBody.position.set(fPla.side.x * 18.0, 4.8, tZ);
    tentBody.castShadow = true;
    plaGroup.add(tentBody);

    const tentRoof = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 3.8, 12, 1, false, 0, Math.PI), rescueTentMat);
    tentRoof.rotation.z = Math.PI * 0.5;
    tentRoof.rotation.y = Math.PI * 0.5;
    tentRoof.position.set(fPla.side.x * 18.0, 5.8, tZ);
    tentRoof.castShadow = true;
    plaGroup.add(tentRoof);
  });

  const flagMast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 6.0, 6), railSteelMat);
  flagMast.position.set(fPla.side.x * 18.0, 6.8, -8.0);
  const flag = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.2, 1.8), redFlagMat);
  flag.position.set(fPla.side.x * 18.0, 9.2, -7.0);
  plaGroup.add(flagMast);
  plaGroup.add(flag);
  group.add(plaGroup);

  // -------------------------------------------------------------------------
  // 6. YONGDING RETENTION BASIN & MUNICIPAL PUMP TRUCKS (u = 0.90)
  // -------------------------------------------------------------------------
  const fBasin = getRiverFrame(0.90);
  const basinGroup = new THREE.Group();
  basinGroup.position.copy(fBasin.pt);

  const revetment = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.8, 38.0), concreteDamMat);
  revetment.position.set(-fBasin.side.x * 14.0, 1.6, 0);
  basinGroup.add(revetment);

  const wetland = new THREE.Mesh(new THREE.BoxGeometry(16.0, 0.4, 36.0), new THREE.MeshStandardMaterial({ color: 0x2e4f2f, roughness: 0.9 }));
  wetland.position.set(-fBasin.side.x * 22.0, 1.8, 0);
  basinGroup.add(wetland);

  for (let pt = 0; pt < 3; pt++) {
    const truck = new THREE.Group();
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 5.5), municipalYellowMat);
    chassis.position.y = 1.0;
    truck.add(chassis);

    const pumpBody = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.8, 3.2), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 }));
    pumpBody.position.set(0, 2.2, -0.6);
    truck.add(pumpBody);

    [-0.7, 0.7].forEach(hX => {
      const hose = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 8.5, 10), drainHoseMat);
      hose.rotation.z = Math.PI * 0.42;
      hose.position.set(-3.5 + hX * 0.4, 1.0, 0);
      truck.add(hose);
    });

    truck.position.set(-fBasin.side.x * 11.0, 1.6, -9.0 + pt * 9.0);
    basinGroup.add(truck);
  }
  group.add(basinGroup);

  return {
    wipeableItems,
    dynamicWaterItems,
    animatedRotors
  };
}
