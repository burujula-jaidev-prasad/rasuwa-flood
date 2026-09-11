import * as THREE from 'three';

/**
 * Procedural 3D Landmarks, Bridges, Stranded Trains, Sluice Gates & Helicopters
 * for Beijing, China (Mentougou Mountain Flash Deluge Scenario)
 */
export function buildBeijingScene(group, river, terrain) {
  const wipeableItems = [];
  const dynamicWaterItems = [];
  const animatedRotors = [];

  // Helper to place objects on river tangents & bank normals
  function getRiverFrame(u) {
    const pt = river.getPointAt(u);
    const tangent = river.getTangentAt(u);
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();
    return { pt, tangent, side, up };
  }

  // Common Materials
  const darkGreenTrainMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.4, metalness: 0.2 }); // Classic Type 25G Green
  const trainYellowStripe = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
  const railSteelMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.3, metalness: 0.8 });
  const ballastGravelMat = new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.9 });
  const mudslideMat = new THREE.MeshStandardMaterial({ color: 0x713f12, roughness: 0.95 });
  const boulderMat = new THREE.MeshStandardMaterial({ color: 0x44403c, roughness: 0.9 });
  const tarmacMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.8 });
  const guardrailMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4, metalness: 0.6 });
  const concreteDamMat = new THREE.MeshStandardMaterial({ color: 0xa8a29e, roughness: 0.75, metalness: 0.1 });
  const steelGateMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.7 });
  const marcoPoloStoneMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.85 }); // Ancient white marble/limestone
  const plaOliveMat = new THREE.MeshStandardMaterial({ color: 0x2e4027, roughness: 0.5, metalness: 0.3 }); // PLA Army Olive
  const rotorBladeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
  const rescueTentMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.85 });
  const redFlagMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 });
  const municipalYellowMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
  const drainHoseMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.6 });

  // -------------------------------------------------------------------------
  // 1. LUOPOLING MOUNTAIN PASS & STRANDED K396 TRAIN (u = 0.20)
  // -------------------------------------------------------------------------
  const fLuo = getRiverFrame(0.20);
  const luoGroup = new THREE.Group();
  luoGroup.position.copy(fLuo.pt);

  // Railway Embankment elevated above gorge floor
  const railEmbankment = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.2, 42.0), ballastGravelMat);
  railEmbankment.position.set(-fLuo.side.x * 12.0, 1.6, 0);
  railEmbankment.castShadow = true;
  luoGroup.add(railEmbankment);

  // Dual Steel Train Tracks
  [-0.8, 0.8].forEach(trackX => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.15, 42.0), railSteelMat);
    rail.position.set(-fLuo.side.x * 12.0 + trackX, 3.3, 0);
    luoGroup.add(rail);
  });

  // Stranded K396 Classic Green Train (Locomotive + 3 Passenger Coaches)
  const trainCarDefs = [
    { z: -13.0, isLoco: true },
    { z: -2.0,  isLoco: false },
    { z: 9.0,   isLoco: false },
    { z: 20.0,  isLoco: false }
  ];

  trainCarDefs.forEach(car => {
    const carGroup = new THREE.Group();
    carGroup.position.set(-fLuo.side.x * 12.0, 3.4, car.z);

    // Car Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 9.5), darkGreenTrainMat);
    body.position.y = 1.5;
    body.castShadow = true;
    carGroup.add(body);

    // Iconic Yellow Waistline Stripe
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.25, 9.5), trainYellowStripe);
    stripe.position.y = 1.2;
    carGroup.add(stripe);

    // Roof curve
    const roof = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 9.5, 12, 1, false, 0, Math.PI), darkGreenTrainMat);
    roof.rotation.z = Math.PI * 0.5;
    roof.rotation.y = Math.PI * 0.5;
    roof.position.y = 2.8;
    carGroup.add(roof);

    // Windows band
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.1, metalness: 0.8 });
    const windows = new THREE.Mesh(new THREE.BoxGeometry(2.44, 0.7, 8.5), windowMat);
    windows.position.y = 1.8;
    carGroup.add(windows);

    luoGroup.add(carGroup);
  });

  // Massive Mudslide & Boulder Debris Cone engulfing the tracks in front of the train
  const debrisCone = new THREE.Mesh(new THREE.ConeGeometry(7.5, 4.5, 16), mudslideMat);
  debrisCone.position.set(-fLuo.side.x * 12.0, 2.8, -20.0);
  debrisCone.rotation.z = Math.PI * 0.1;
  debrisCone.castShadow = true;
  luoGroup.add(debrisCone);

  // Scattered boulders along track and riverbed
  for (let b = 0; b < 10; b++) {
    const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8 + Math.random() * 0.7), boulderMat);
    boulder.position.set(
      -fLuo.side.x * 12.0 + (Math.random() - 0.5) * 5.0,
      3.2 + Math.random() * 1.5,
      -26.0 + b * 4.5
    );
    boulder.rotation.set(Math.random() * 3, Math.random() * 3, 0);
    luoGroup.add(boulder);
  }

  group.add(luoGroup);

  // -------------------------------------------------------------------------
  // 2. HIGHWAY G109 MOUNTAIN WASHOUT & SWEPT CARS (u = 0.35)
  // -------------------------------------------------------------------------
  const fG109 = getRiverFrame(0.35);
  const g109Group = new THREE.Group();
  g109Group.position.copy(fG109.pt);

  // Highway road hugging the mountain rockface (partially collapsed)
  const roadSegment1 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.8, 14.0), tarmacMat);
  roadSegment1.position.set(fG109.side.x * 11.0, 3.2, -14.0);
  g109Group.add(roadSegment1);

  // Collapsed / Sheared section: road tilted down into riverbed
  const shearedRoad = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.7, 10.0), tarmacMat);
  shearedRoad.position.set(fG109.side.x * 7.5, 1.4, -2.0);
  shearedRoad.rotation.x = Math.PI * 0.16;
  shearedRoad.rotation.z = -Math.PI * 0.12;
  g109Group.add(shearedRoad);

  const roadSegment2 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.8, 14.0), tarmacMat);
  roadSegment2.position.set(fG109.side.x * 11.0, 3.2, 12.0);
  g109Group.add(roadSegment2);

  // Twisted / torn guardrails
  const rail1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 14.0), guardrailMat);
  rail1.position.set(fG109.side.x * 8.4, 3.8, -14.0);
  g109Group.add(rail1);

  // Swept private vehicles floating/stranded in the mud torrent
  const carColors = [0xdc2626, 0x2563eb, 0xf8fafc, 0x475569];
  for (let c = 0; c < 4; c++) {
    const car = new THREE.Group();
    const carMat = new THREE.MeshStandardMaterial({ color: carColors[c], roughness: 0.4 });
    const cBody = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 3.6), carMat);
    cBody.position.y = 0.4;
    car.add(cBody);

    const cCabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.55, 1.9), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2 }));
    cCabin.position.set(0, 0.9, -0.2);
    car.add(cCabin);

    // Random tilt and partial submergence
    car.position.set(fG109.side.x * (1.0 + (c % 2) * 3.5), 0.6, -6.0 + c * 5.0);
    car.rotation.set(0.35 + c * 0.15, c * 0.6, -0.25);
    g109Group.add(car);
  }

  group.add(g109Group);

  // -------------------------------------------------------------------------
  // 3. SANJIADIAN RESERVOIR DAM & GORGE CONTROL GATES (u = 0.48)
  // -------------------------------------------------------------------------
  const fDam = getRiverFrame(0.48);
  const damGroup = new THREE.Group();
  damGroup.position.copy(fDam.pt);

  const damSpan = 26.0;
  const damHeight = 8.5;

  // Massive concrete gravity dam structure spanning gorge
  const damWall = new THREE.Mesh(new THREE.BoxGeometry(damSpan, damHeight, 5.0), concreteDamMat);
  damWall.rotation.y = Math.atan2(fDam.side.x, fDam.side.z);
  damWall.position.set(0, damHeight * 0.5, 0);
  damWall.castShadow = true;
  damGroup.add(damWall);

  // 6 Radial steel sluice gate spillways
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

  // Overhead inspection bridge & hoist gantry
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
  const numArches = 7; // Representing the historic 11-arch span
  const archSpacing = bridgeSpan / numArches;

  // Historic stone masonry arch bridge
  for (let a = 0; a <= numArches; a++) {
    const offset = (a - numArches * 0.5) * archSpacing;
    const pier = new THREE.Group();
    pier.position.set(fLugou.side.x * offset, 1.2, fLugou.side.z * offset);

    // Stone Pier
    const pierBody = new THREE.Mesh(new THREE.BoxGeometry(1.4, 4.2, 5.5), marcoPoloStoneMat);
    pierBody.castShadow = true;
    pier.add(pierBody);

    // Triangular Stone Starling / Cutwater (Fenshuijian) facing upstream
    const starling = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 1.4, 4.2, 3), marcoPoloStoneMat);
    starling.rotation.y = Math.PI * 0.5;
    starling.position.set(0, 0, -3.2);
    pier.add(starling);

    // Miniature carved Stone Lion Finials along balustrade posts
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

  // Stone Bridge Roadway Deck
  const stoneDeck = new THREE.Mesh(new THREE.BoxGeometry(bridgeSpan + 2.0, 0.6, 4.8), marcoPoloStoneMat);
  stoneDeck.rotation.y = Math.atan2(fLugou.side.x, fLugou.side.z);
  stoneDeck.position.set(0, 3.4, 0);
  stoneDeck.castShadow = true;
  lugouGroup.add(stoneDeck);

  // Modern Flood Diversion Sluice Gate Complex (Adjacent south bank)
  const sluiceGroup = new THREE.Group();
  sluiceGroup.position.set(fLugou.side.x * 20.0, 0, 0);
  const sluiceWall = new THREE.Mesh(new THREE.BoxGeometry(12.0, 6.5, 4.0), concreteDamMat);
  sluiceWall.position.y = 3.2;
  sluiceGroup.add(sluiceWall);

  // Raised diversion gates with rushing water channel
  [-3.5, 0, 3.5].forEach(gX => {
    const gateMesh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 4.0, 0.4), steelGateMat);
    gateMesh.position.set(gX, 3.8, 0);
    sluiceGroup.add(gateMesh);
  });
  lugouGroup.add(sluiceGroup);

  group.add(lugouGroup);

  // -------------------------------------------------------------------------
  // 5. PLA AIR-BRIDGE RESCUE HELICOPTERS & RELIEF STAGING (u = 0.75)
  // -------------------------------------------------------------------------
  const fPla = getRiverFrame(0.75);
  const plaGroup = new THREE.Group();
  plaGroup.position.copy(fPla.pt);

  // Two PLA Z-20 / Mi-171 Utility Transport Helicopters hovering
  [-14.0, 14.0].forEach((heliZ, idx) => {
    const heli = new THREE.Group();
    heli.position.set(-fPla.side.x * 16.0, 14.0 + idx * 3.0, heliZ);

    // Fuselage
    const fuselage = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 7.5), plaOliveMat);
    fuselage.castShadow = true;
    heli.add(fuselage);

    // Cockpit nose slope
    const nose = new THREE.Mesh(new THREE.ConeGeometry(1.3, 2.0, 8), plaOliveMat);
    nose.rotation.x = Math.PI * 0.5;
    nose.position.set(0, -0.2, 4.4);
    heli.add(nose);

    // Tail boom
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 6.0), plaOliveMat);
    tail.position.set(0, 0.5, -6.0);
    heli.add(tail);

    // Vertical fin
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.8, 1.2), plaOliveMat);
    fin.position.set(0, 1.2, -8.8);
    heli.add(fin);

    // Main 5-blade spinning rotor
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

    // Suspended Rescue Hoist Cable with Relief Crate
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 7.0, 4), guardrailMat);
    cable.position.set(1.1, -3.5, 0);
    heli.add(cable);

    const reliefCrate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 1.2), municipalYellowMat);
    reliefCrate.position.set(1.1, -7.2, 0);
    heli.add(reliefCrate);

    plaGroup.add(heli);
  });

  // Mountain Relief Staging Camp on Ridge
  const campGround = new THREE.Mesh(new THREE.BoxGeometry(18.0, 0.6, 22.0), ballastGravelMat);
  campGround.position.set(fPla.side.x * 18.0, 3.8, 0);
  plaGroup.add(campGround);

  // Command Tents
  [-6.0, 0, 6.0].forEach(tZ => {
    const tent = new THREE.Mesh(new THREE.ConeGeometry(2.2, 2.2, 4), rescueTentMat);
    tent.rotation.y = Math.PI * 0.25;
    tent.position.set(fPla.side.x * 18.0, 5.0, tZ);
    plaGroup.add(tent);
  });

  // Red Rescue Banner / Flag Mast
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

  // Retention wetland revetment wall
  const revetment = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.8, 38.0), concreteDamMat);
  revetment.position.set(-fBasin.side.x * 14.0, 1.6, 0);
  basinGroup.add(revetment);

  // Wetland sponge greenery
  const wetland = new THREE.Mesh(new THREE.BoxGeometry(16.0, 0.4, 36.0), new THREE.MeshStandardMaterial({ color: 0x2e4f2f, roughness: 0.9 }));
  wetland.position.set(-fBasin.side.x * 22.0, 1.8, 0);
  basinGroup.add(wetland);

  // Municipal "Dragon Boat" High-Volume Emergency Pump Trucks
  for (let pt = 0; pt < 3; pt++) {
    const truck = new THREE.Group();
    // Chassis
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 5.5), municipalYellowMat);
    chassis.position.y = 1.0;
    truck.add(chassis);

    // High-capacity pump engine & suction housing
    const pumpBody = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.8, 3.2), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 }));
    pumpBody.position.set(0, 2.2, -0.6);
    truck.add(pumpBody);

    // Dual flexible discharge hoses leading to wetland aquifer
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
