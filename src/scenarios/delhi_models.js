import * as THREE from 'three';

/**
 * Procedural 3D Landmarks, Bridges, Vehicles & Countermeasures for Delhi Scenario
 */
export function buildDelhiScene(group, river, terrain) {
  const wipeableItems = [];
  const dynamicWaterItems = [];

  // Helper to place objects on river tangents
  function getRiverFrame(u) {
    const pt = river.getPointAt(u);
    const tangent = river.getTangentAt(u);
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();
    return { pt, tangent, side, up };
  }

  // ----------------------------------------------------
  // 1. WAZIRABAD BARRAGE & WATER TREATMENT PLANT (u = 0.20)
  // ----------------------------------------------------
  const fWazir = getRiverFrame(0.20);
  const wazirGroup = new THREE.Group();
  wazirGroup.position.copy(fWazir.pt);

  const concreteMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.7, metalness: 0.1 });
  const darkSteel = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.6 });
  const siltMat = new THREE.MeshStandardMaterial({ color: 0x785336, roughness: 0.9 });
  const pipeMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.4 }); // Blue intake pipes

  // Barrage structure spanning 24m across river
  const barrageSpan = 24.0;
  const barragePiers = 8;
  const pierSpacing = barrageSpan / barragePiers;

  for (let i = 0; i <= barragePiers; i++) {
    const offset = (i - barragePiers * 0.5) * pierSpacing;
    const pier = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5.5, 3.8), concreteMat);
    pier.position.set(fWazir.side.x * offset, 1.8, fWazir.side.z * offset);
    pier.castShadow = true;
    wazirGroup.add(pier);

    if (i < barragePiers) {
      // Sluice gate
      const gate = new THREE.Mesh(new THREE.BoxGeometry(pierSpacing * 0.85, 2.8, 0.3), darkSteel);
      const gateOffset = offset + pierSpacing * 0.5;
      gate.position.set(fWazir.side.x * gateOffset, 1.4, fWazir.side.z * gateOffset);
      wazirGroup.add(gate);
    }
  }

  // Overhead gantry roadway
  const gantry = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, barrageSpan + 2), darkSteel);
  gantry.rotation.y = Math.atan2(fWazir.side.x, fWazir.side.z);
  gantry.position.set(0, 4.8, 0);
  wazirGroup.add(gantry);

  // WTP Pump House on Western Bank
  const pumpHouse = new THREE.Group();
  const pumpBuilding = new THREE.Mesh(new THREE.BoxGeometry(10.0, 4.5, 8.0), concreteMat);
  pumpBuilding.castShadow = true;
  pumpHouse.add(pumpBuilding);

  // Intake pipes leading into river
  for (let p = 0; p < 3; p++) {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 6.0, 12), pipeMat);
    pipe.rotation.z = Math.PI * 0.35;
    pipe.position.set(3.5 + p * 1.5, -1.0, 0);
    pumpHouse.add(pipe);
  }

  // Silt mound at intake
  const siltMound = new THREE.Mesh(new THREE.ConeGeometry(4.0, 1.8, 16), siltMat);
  siltMound.position.set(4.0, -1.2, 0);
  pumpHouse.add(siltMound);

  pumpHouse.position.set(-fWazir.side.x * 16.0, 2.2, -fWazir.side.z * 16.0);
  wazirGroup.add(pumpHouse);
  group.add(wazirGroup);

  // ----------------------------------------------------
  // 2. OLD YAMUNA IRON BRIDGE (LOHA PUL - 1866) (u = 0.35)
  // ----------------------------------------------------
  const fLoha = getRiverFrame(0.35);
  const lohaGroup = new THREE.Group();
  lohaGroup.position.copy(fLoha.pt);

  const brickPierMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.85 }); // Red brick masonry
  const ironTrussMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.6, metalness: 0.7 });
  const railMat = new THREE.MeshStandardMaterial({ color: 0x71717a, roughness: 0.4, metalness: 0.8 });
  const locoMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.5 }); // WAP-7 Blue
  const coachMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 }); // ICF Brown/Rust

  const bridgeSpan = 26.0;
  const numSpans = 4;
  const spanLength = bridgeSpan / numSpans;

  for (let s = 0; s <= numSpans; s++) {
    const offset = (s - numSpans * 0.5) * spanLength;
    // Oval brick masonry river pier
    const pier = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.6, 6.5, 16), brickPierMat);
    pier.scale.set(1.4, 1.0, 0.8);
    pier.position.set(fLoha.side.x * offset, 2.0, fLoha.side.z * offset);
    pier.castShadow = true;
    lohaGroup.add(pier);

    if (s < numSpans) {
      const spanCenter = offset + spanLength * 0.5;
      const trussGroup = new THREE.Group();
      trussGroup.position.set(fLoha.side.x * spanCenter, 5.2, fLoha.side.z * spanCenter);

      // Lower Road Deck
      const lowerDeck = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, spanLength * 0.95), ironTrussMat);
      lowerDeck.position.y = -1.2;
      trussGroup.add(lowerDeck);

      // Upper Rail Deck
      const upperDeck = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, spanLength * 0.95), ironTrussMat);
      upperDeck.position.y = 1.2;
      trussGroup.add(upperDeck);

      // Steel Pratt Truss Diagonals
      const trussSide1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.4, spanLength * 0.92), ironTrussMat);
      trussSide1.position.x = 0.4;
      trussGroup.add(trussSide1);

      const trussSide2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.4, spanLength * 0.92), ironTrussMat);
      trussSide2.position.x = -0.4;
      trussGroup.add(trussSide2);

      lohaGroup.add(trussGroup);
    }
  }

  // WAP-7 Locomotive & Train halted on upper deck
  const trainGroup = new THREE.Group();
  const loco = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 3.2), locoMat);
  loco.position.set(0, 7.0, 2.0);
  trainGroup.add(loco);

  for (let c = 0; c < 3; c++) {
    const coach = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.85, 3.8), coachMat);
    coach.position.set(0, 6.95, -2.2 - c * 4.1);
    trainGroup.add(coach);
  }
  lohaGroup.add(trainGroup);
  group.add(lohaGroup);

  // ----------------------------------------------------
  // 3. KASHMERE GATE & SUBMERGED RING ROAD (u = 0.48)
  // ----------------------------------------------------
  const fKash = getRiverFrame(0.48);
  const kashGroup = new THREE.Group();
  kashGroup.position.copy(fKash.pt);

  const tarmacMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
  const barrierMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
  const busGreenMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 }); // DTC Green
  const autoYellowMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.4 });
  const autoGreenMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.5 });

  // Elevated 4-lane Ring Road flyover running along riverbank
  const roadLength = 38.0;
  const ringRoad = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.5, roadLength), tarmacMat);
  ringRoad.position.set(-fKash.side.x * 12.0, 3.2, -fKash.side.z * 12.0);
  ringRoad.castShadow = true;
  kashGroup.add(ringRoad);

  // Concrete pillars under flyover
  for (let p = -3; p <= 3; p++) {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3.0, 12), concreteMat);
    col.position.set(-fKash.side.x * 12.0, 1.5, -fKash.side.z * 12.0 + p * 5.5);
    kashGroup.add(col);
  }

  // Submerged Vehicles in low-lying depression
  // DTC Bus submerged to windows
  const busGroup = new THREE.Group();
  const busBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 4.2), busGreenMat);
  busGroup.add(busBody);
  const busRoof = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.2, 4.15), concreteMat);
  busRoof.position.y = 0.8;
  busGroup.add(busRoof);
  busGroup.position.set(-fKash.side.x * 9.5, 2.2, 4.0);
  busGroup.rotation.z = 0.12; // tilted in water
  kashGroup.add(busGroup);

  // Auto-rickshaw floating/tilted
  const autoGroup = new THREE.Group();
  const autoLower = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 1.4), autoGreenMat);
  const autoHood = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.5, 1.1), autoYellowMat);
  autoHood.position.set(0, 0.45, -0.1);
  autoGroup.add(autoLower);
  autoGroup.add(autoHood);
  autoGroup.position.set(-fKash.side.x * 8.2, 1.9, -2.5);
  autoGroup.rotation.x = -0.15;
  kashGroup.add(autoGroup);

  // Tibetan Monastery Market Stalls
  for (let m = 0; m < 5; m++) {
    const stall = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.8, 2.2), new THREE.MeshStandardMaterial({
      color: m % 2 === 0 ? 0x92400e : 0x0369a1,
      roughness: 0.8
    }));
    stall.position.set(-fKash.side.x * 17.0 + (m % 2) * 2.2, 2.5, -6.0 + m * 3.2);
    kashGroup.add(stall);
  }

  group.add(kashGroup);

  // ----------------------------------------------------
  // 4. RED FORT (LAL QILA) & SALIMGARH RAMPARTS (u = 0.60)
  // ----------------------------------------------------
  const fFort = getRiverFrame(0.60);
  const fortGroup = new THREE.Group();
  fortGroup.position.copy(fFort.pt);

  const redSandstoneMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.85 }); // Red Fort Sandstone
  const whiteMarbleMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 }); // White Marble Chhatris

  // Main Rampart Curtain Wall
  const wallLength = 48.0;
  const wallHeight = 7.5;
  const rampart = new THREE.Mesh(new THREE.BoxGeometry(2.4, wallHeight, wallLength), redSandstoneMat);
  rampart.position.set(-fFort.side.x * 18.0, 4.2, -fFort.side.z * 18.0);
  rampart.castShadow = true;
  fortGroup.add(rampart);

  // Crenellated Battlements
  for (let c = 0; c < 24; c++) {
    const battlement = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 1.2), redSandstoneMat);
    battlement.position.set(-fFort.side.x * 18.0, wallHeight + 1.0, -wallLength * 0.5 + c * 2.0);
    fortGroup.add(battlement);
  }

  // Octagonal Corner Turrets (Burj) with White Marble Chhatris
  for (const end of [-wallLength * 0.5, wallLength * 0.5]) {
    const burj = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.4, wallHeight + 2.0, 8), redSandstoneMat);
    burj.position.set(-fFort.side.x * 18.0, 5.0, end);
    fortGroup.add(burj);

    // Marble Domed Chhatri on top
    const chhatriDome = new THREE.Mesh(new THREE.SphereGeometry(1.4, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), whiteMarbleMat);
    chhatriDome.position.set(-fFort.side.x * 18.0, wallHeight + 6.2, end);
    fortGroup.add(chhatriDome);
  }

  // Salimgarh Arched Bridge
  const salimBridge = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.2, 12.0), redSandstoneMat);
  salimBridge.position.set(-fFort.side.x * 12.0, 3.2, 14.0);
  fortGroup.add(salimBridge);

  group.add(fortGroup);

  // ----------------------------------------------------
  // 5. ITO BARRAGE & DRAIN 12 REGULATOR BREACH (u = 0.74)
  // ----------------------------------------------------
  const fIto = getRiverFrame(0.74);
  const itoGroup = new THREE.Group();
  itoGroup.position.copy(fIto.pt);

  const sandbagMat = new THREE.MeshStandardMaterial({ color: 0xd4b996, roughness: 0.95 }); // Khaki Sandbags
  const armyGreenMat = new THREE.MeshStandardMaterial({ color: 0x3f4f2c, roughness: 0.7 }); // Indian Army Olive
  const steelSheetMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.7 });

  // ITO Barrage Piers
  for (let i = -5; i <= 5; i++) {
    const pier = new THREE.Mesh(new THREE.BoxGeometry(0.7, 4.8, 3.2), concreteMat);
    pier.position.set(fIto.side.x * i * 2.2, 1.5, fIto.side.z * i * 2.2);
    itoGroup.add(pier);
  }

  // Breached Drain 12 Regulator Headwall
  const drainHeadwall = new THREE.Mesh(new THREE.BoxGeometry(4.0, 3.2, 1.8), concreteMat);
  drainHeadwall.position.set(-fIto.side.x * 12.0, 1.8, 0);
  itoGroup.add(drainHeadwall);

  // Broken gate tilted in water
  const brokenGate = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.8, 0.2), darkSteel);
  brokenGate.position.set(-fIto.side.x * 12.0, 1.0, 0.6);
  brokenGate.rotation.z = -0.35;
  itoGroup.add(brokenGate);

  // Emergency Sandbag Bund Ramparts
  for (let row = 0; row < 4; row++) {
    for (let col = -4; col <= 4; col++) {
      const bag = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 0.45), sandbagMat);
      bag.position.set(-fIto.side.x * 14.5 + col * 0.72, 1.2 + row * 0.36, row * 0.2);
      itoGroup.add(bag);
    }
  }

  // Indian Army Tatra 8x8 Truck on bund
  const armyTruck = new THREE.Group();
  const truckBody = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.5, 4.8), armyGreenMat);
  armyTruck.add(truckBody);
  const craneArm = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.8, 0.4), steelSheetMat);
  craneArm.rotation.x = 0.5;
  craneArm.position.set(0, 1.8, -1.0);
  armyTruck.add(craneArm);
  armyTruck.position.set(-fIto.side.x * 17.5, 3.5, -4.0);
  itoGroup.add(armyTruck);

  // Modern Secretariat / Vikas Minar silhouette
  const vikasTower = new THREE.Mesh(new THREE.BoxGeometry(8.0, 22.0, 8.0), new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.4,
    metalness: 0.3
  }));
  vikasTower.position.set(-fIto.side.x * 28.0, 11.0, -12.0);
  itoGroup.add(vikasTower);

  group.add(itoGroup);

  // ----------------------------------------------------
  // 6. RAJGHAT MEMORIAL & DISASTER RELIEF CAMP (u = 0.88)
  // ----------------------------------------------------
  const fRaj = getRiverFrame(0.88);
  const rajGroup = new THREE.Group();
  rajGroup.position.copy(fRaj.pt);

  const blackMarbleMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2, metalness: 0.2 });
  const grassMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });
  const pumpGreenMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.5 });
  const trailerYellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
  const tentOrangeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.8 });
  const tentBlueMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.8 });

  // Rajghat Memorial Enclosure
  const rajWall = new THREE.Mesh(new THREE.BoxGeometry(14.0, 1.8, 14.0), concreteMat);
  rajWall.position.set(-fRaj.side.x * 16.0, 2.2, 0);
  rajGroup.add(rajWall);

  const rajLawn = new THREE.Mesh(new THREE.BoxGeometry(12.0, 0.4, 12.0), grassMat);
  rajLawn.position.set(-fRaj.side.x * 16.0, 2.3, 0);
  rajGroup.add(rajLawn);

  // Central Black Marble Samadhi Plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 2.4), blackMarbleMat);
  plinth.position.set(-fRaj.side.x * 16.0, 2.8, 0);
  rajGroup.add(plinth);

  // Mobile 1,000 HP Dewatering Pump Units
  for (let p = 0; p < 3; p++) {
    const pumpUnit = new THREE.Group();
    const trailer = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 2.4), trailerYellowMat);
    const pumpEngine = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.1, 1.8), pumpGreenMat);
    pumpEngine.position.y = 0.85;
    pumpUnit.add(trailer);
    pumpUnit.add(pumpEngine);

    // Thick flexible dewatering hose running to river
    const hose = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 7.5, 12), new THREE.MeshStandardMaterial({ color: 0x14532d }));
    hose.rotation.z = Math.PI * 0.42;
    hose.position.set(3.5, 0.5, 0);
    pumpUnit.add(hose);

    pumpUnit.position.set(-fRaj.side.x * 11.0, 2.5, -5.0 + p * 4.5);
    rajGroup.add(pumpUnit);
  }

  // Disaster Relief Tent Camp on Elevated Bypass
  const tentFlyover = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.6, 24.0), tarmacMat);
  tentFlyover.position.set(fRaj.side.x * 16.0, 4.2, 0);
  rajGroup.add(tentFlyover);

  for (let t = 0; t < 8; t++) {
    const tentGeo = new THREE.ConeGeometry(1.1, 1.4, 4);
    const tentMat = (t % 2 === 0) ? tentOrangeMat : tentBlueMat;
    const tent = new THREE.Mesh(tentGeo, tentMat);
    tent.rotation.y = Math.PI * 0.25;
    tent.position.set(fRaj.side.x * 16.0 + ((t % 2) - 0.5) * 1.5, 5.2, -10.0 + t * 2.8);
    rajGroup.add(tent);
  }

  group.add(rajGroup);

  return {
    wipeableItems,
    dynamicWaterItems
  };
}
