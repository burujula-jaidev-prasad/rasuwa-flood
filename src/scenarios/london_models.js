import * as THREE from 'three';

/**
 * Procedural 3D Landmarks, Thames Barrier Rising Sector Gates, Canary Wharf,
 * London Underground Flood Doors, Tower Bridge, HMS Belfast & Westminster
 * for London, UK (North Sea Tidal Surge & Barrier Closure Scenario)
 */
export function buildLondonScene(group, river, terrain) {
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
  const stainlessSteelMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.15, metalness: 0.85 }); // Barrier roofs
  const pierConcreteMat   = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7, metalness: 0.1 });  // Barrier piers
  const sectorGateMat     = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4, metalness: 0.7 });  // Steel sector gates
  const yellowHazardMat   = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4, metalness: 0.2 });
  const stoneGraniteMat   = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.85, metalness: 0.05 }); // Victorian river walls
  const towerBridgeStone  = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.8, metalness: 0.1 });  // Gothic limestone
  const towerBridgeBlue   = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.3 });  // Suspension blue
  const navyGreyMat       = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.6 });  // HMS Belfast
  const glassTowerMat     = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.85 });
  const darkSpireMat      = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.4 });  // Big Ben gothic roof
  const policeBlueMat     = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3 });
  const rnliOrangeMat     = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.4 });
  const undergroundRed    = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });

  // -------------------------------------------------------------------------
  // 1. THE THAMES BARRIER (Woolwich Reach, u = 0.35)
  // -------------------------------------------------------------------------
  const fBarrier = getRiverFrame(0.35);
  const barrierGroup = new THREE.Group();
  barrierGroup.position.copy(fBarrier.pt);

  const angleThames = Math.atan2(fBarrier.side.x, fBarrier.side.z);
  barrierGroup.rotation.y = angleThames;

  // 6 Iconic Concrete Piers with Stainless Steel Scallop Roofs across the 520m river
  const pierOffsets = [-22.0, -13.0, -4.5, 4.5, 13.0, 22.0];
  const sectorGates = [];

  pierOffsets.forEach((xOff, idx) => {
    const pierSubGroup = new THREE.Group();
    pierSubGroup.position.set(xOff, 0, 0);

    // Concrete Base Pier (boat-shaped streamline)
    const pierBase = new THREE.Mesh(new THREE.BoxGeometry(3.0, 6.0, 14.0), pierConcreteMat);
    pierBase.position.y = 3.0;
    pierBase.castShadow = true;
    pierSubGroup.add(pierBase);

    // Rounded cutwaters fore and aft
    const foreCut = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6.0, 16), pierConcreteMat);
    foreCut.position.set(0, 3.0, 7.0);
    foreCut.scale.set(1.0, 1.0, 1.8);
    pierSubGroup.add(foreCut);

    const aftCut = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6.0, 16), pierConcreteMat);
    aftCut.position.set(0, 3.0, -7.0);
    aftCut.scale.set(1.0, 1.0, 1.8);
    pierSubGroup.add(aftCut);

    // Iconic Stainless Steel Shell/Scallop Pier Roof (Armadillo silhouette)
    const roofGeom = new THREE.CylinderGeometry(1.8, 2.2, 10.0, 16, 1, false, 0, Math.PI);
    const roof = new THREE.Mesh(roofGeom, stainlessSteelMat);
    roof.rotation.x = Math.PI / 2;
    roof.rotation.z = Math.PI;
    roof.position.set(0, 6.5, 0);
    roof.scale.set(1.1, 1.2, 1.4);
    roof.castShadow = true;
    pierSubGroup.add(roof);

    // Navigation light signal mast (red/green)
    const signalLight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 1.8, 8),
      new THREE.MeshBasicMaterial({ color: (idx % 2 === 0) ? 0xef4444 : 0x22c55e })
    );
    signalLight.position.set(0, 8.8, 5.0);
    pierSubGroup.add(signalLight);

    barrierGroup.add(pierSubGroup);
  });

  // 5 Massive Steel Rising Sector Gates between the piers
  for (let g = 0; g < pierOffsets.length - 1; g++) {
    const xMid = (pierOffsets[g] + pierOffsets[g + 1]) / 2;
    const gateSpan = Math.abs(pierOffsets[g + 1] - pierOffsets[g]) - 3.2;

    const gateGroup = new THREE.Group();
    gateGroup.position.set(xMid, 1.0, 0);

    // Cylindrical curved sector gate leaf in defensive upright lock
    const gateLeaf = new THREE.Mesh(
      new THREE.CylinderGeometry(gateSpan * 0.45, gateSpan * 0.45, gateSpan, 16, 1, false, -Math.PI * 0.35, Math.PI * 0.7),
      sectorGateMat
    );
    gateLeaf.rotation.z = Math.PI / 2;
    gateLeaf.rotation.y = Math.PI / 2;
    gateLeaf.position.y = 2.8;
    gateLeaf.castShadow = true;
    gateGroup.add(gateLeaf);

    // Trunnion support arm
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.2, 0.8), sectorGateMat);
    armL.position.set(-gateSpan / 2 + 0.2, 1.8, 0);
    gateGroup.add(armL);
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.2, 0.8), sectorGateMat);
    armR.position.set(gateSpan / 2 - 0.2, 1.8, 0);
    gateGroup.add(armR);

    barrierGroup.add(gateGroup);
    sectorGates.push(gateGroup);
  }

  group.add(barrierGroup);

  // -------------------------------------------------------------------------
  // 2. CANARY WHARF SKYLINE & ISLE OF DOGS DOCKS (u = 0.48)
  // -------------------------------------------------------------------------
  const fWharf = getRiverFrame(0.48);
  const wharfGroup = new THREE.Group();
  wharfGroup.position.copy(fWharf.pt);

  // Docklands Stone Quay Wall
  const quay = new THREE.Mesh(new THREE.BoxGeometry(4.0, 4.0, 42.0), stoneGraniteMat);
  quay.position.set(-fWharf.side.x * 16.0, 2.0, -fWharf.side.z * 16.0);
  wharfGroup.add(quay);

  // One Canada Square (Iconic Pyramid Skyscraper)
  const ocsGroup = new THREE.Group();
  ocsGroup.position.set(-fWharf.side.x * 28.0, 0, -fWharf.side.z * 28.0 - 4.0);

  // Tower body
  const ocsTower = new THREE.Mesh(new THREE.BoxGeometry(9.0, 42.0, 9.0), glassTowerMat);
  ocsTower.position.y = 21.0;
  ocsTower.castShadow = true;
  ocsGroup.add(ocsTower);

  // Pyramid roof
  const ocsPyramid = new THREE.Mesh(new THREE.ConeGeometry(5.8, 7.0, 4), stainlessSteelMat);
  ocsPyramid.position.y = 45.5;
  ocsPyramid.rotation.y = Math.PI / 4;
  ocsGroup.add(ocsPyramid);

  // Flanking Canary Wharf towers (HSBC & Citigroup)
  [-12.0, 12.0].forEach((zOff, i) => {
    const fTower = new THREE.Mesh(
      new THREE.BoxGeometry(8.0, 32.0 + i * 4.0, 7.0),
      new THREE.MeshStandardMaterial({ color: (i === 0) ? 0x0284c7 : 0x0f766e, roughness: 0.2, metalness: 0.8 })
    );
    fTower.position.set(0, (32.0 + i * 4.0) / 2, zOff);
    fTower.castShadow = true;
    ocsGroup.add(fTower);
  });

  wharfGroup.add(ocsGroup);

  // West India Dock Closed Sluice Gates
  const lockGate = new THREE.Mesh(new THREE.BoxGeometry(2.0, 4.8, 8.0), yellowHazardMat);
  lockGate.position.set(-fWharf.side.x * 14.5, 2.4, -fWharf.side.z * 14.5 + 8.0);
  wharfGroup.add(lockGate);

  group.add(wharfGroup);

  // -------------------------------------------------------------------------
  // 3. TfL UNDERGROUND PORTAL & HYDRAULIC FLOOD DOORS (u = 0.60)
  // -------------------------------------------------------------------------
  const fTube = getRiverFrame(0.60);
  const tubeGroup = new THREE.Group();
  tubeGroup.position.copy(fTube.pt);

  // Embankment Walkway Plaza
  const plaza = new THREE.Mesh(new THREE.BoxGeometry(16.0, 1.2, 16.0), stoneGraniteMat);
  plaza.position.set(-fTube.side.x * 15.0, 0.6, -fTube.side.z * 15.0);
  tubeGroup.add(plaza);

  // Station Portal Headhouse
  const stationHouse = new THREE.Mesh(new THREE.BoxGeometry(7.0, 4.5, 6.0), pierConcreteMat);
  stationHouse.position.set(-fTube.side.x * 15.0, 3.2, -fTube.side.z * 15.0);
  tubeGroup.add(stationHouse);

  // Underground Roundel Emblem Totem
  const roundelPole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.5, 8), darkSpireMat);
  roundelPole.position.set(-fTube.side.x * 15.0 + 3.8, 2.8, -fTube.side.z * 15.0);
  tubeGroup.add(roundelPole);

  const roundelCircle = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.12, 8, 20), undergroundRed);
  roundelCircle.position.set(-fTube.side.x * 15.0 + 3.8, 4.2, -fTube.side.z * 15.0);
  roundelCircle.rotation.y = Math.PI / 2;
  tubeGroup.add(roundelCircle);

  const roundelBar = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.35, 1.6), towerBridgeBlue);
  roundelBar.position.set(-fTube.side.x * 15.0 + 3.8, 4.2, -fTube.side.z * 15.0);
  tubeGroup.add(roundelBar);

  // Heavy Hydraulic Solid Steel Bulkhead Flood Door (Locked shut with hazard stripes)
  const floodDoor = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.6, 0.6), sectorGateMat);
  floodDoor.position.set(-fTube.side.x * 15.0, 2.0, -fTube.side.z * 15.0 + 3.1);
  tubeGroup.add(floodDoor);

  const hazardStripe = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.4, 0.7), yellowHazardMat);
  hazardStripe.position.set(-fTube.side.x * 15.0, 3.4, -fTube.side.z * 15.0 + 3.1);
  tubeGroup.add(hazardStripe);

  // Dual Amber Emergency Warning Beacons
  [-1.8, 1.8].forEach(xStrobe => {
    const beacon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.35, 8),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    );
    beacon.position.set(-fTube.side.x * 15.0 + xStrobe, 4.0, -fTube.side.z * 15.0 + 3.1);
    tubeGroup.add(beacon);
  });

  group.add(tubeGroup);

  // -------------------------------------------------------------------------
  // 4. HISTORIC TOWER BRIDGE (u = 0.74)
  // -------------------------------------------------------------------------
  const fTB = getRiverFrame(0.74);
  const tbGroup = new THREE.Group();
  tbGroup.position.copy(fTB.pt);

  const angleTB = Math.atan2(fTB.side.x, fTB.side.z);
  tbGroup.rotation.y = angleTB;

  // Twin Gothic Stone Towers (North & South)
  [-11.0, 11.0].forEach(xT => {
    const towerSub = new THREE.Group();
    towerSub.position.set(xT, 0, 0);

    // Stone Pier Foundation
    const pier = new THREE.Mesh(new THREE.BoxGeometry(5.0, 5.0, 10.0), towerBridgeStone);
    pier.position.y = 2.5;
    towerSub.add(pier);

    // Main Gothic Tower Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(4.2, 16.0, 6.0), towerBridgeStone);
    body.position.y = 12.0;
    body.castShadow = true;
    towerSub.add(body);

    // 4 Corner Turrets & Spire Roofs
    [[-1.8, -2.6], [-1.8, 2.6], [1.8, -2.6], [1.8, 2.6]].forEach(([tx, tz]) => {
      const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 4.0, 8), towerBridgeStone);
      turret.position.set(tx, 20.0, tz);
      towerSub.add(turret);

      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.65, 2.5, 8), darkSpireMat);
      spire.position.set(tx, 23.0, tz);
      towerSub.add(spire);
    });

    tbGroup.add(towerSub);
  });

  // High-Level Walkway Spans
  const walkway1 = new THREE.Mesh(new THREE.BoxGeometry(22.0, 1.2, 1.6), towerBridgeBlue);
  walkway1.position.set(0, 18.0, 1.5);
  walkway1.castShadow = true;
  tbGroup.add(walkway1);

  const walkway2 = new THREE.Mesh(new THREE.BoxGeometry(22.0, 1.2, 1.6), towerBridgeBlue);
  walkway2.position.set(0, 18.0, -1.5);
  walkway2.castShadow = true;
  tbGroup.add(walkway2);

  // Central Bascule Road Deck (spanning between the twin towers)
  const roadDeck = new THREE.Mesh(new THREE.BoxGeometry(20.0, 0.8, 4.5), darkSpireMat);
  roadDeck.position.set(0, 6.0, 0);
  roadDeck.castShadow = true;
  tbGroup.add(roadDeck);

  // Blue Suspension Cables sloping to banks
  [-22.0, 22.0].forEach(xApproach => {
    const approachDeck = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.8, 4.5), darkSpireMat);
    approachDeck.position.set(xApproach * 0.75, 6.0, 0);
    tbGroup.add(approachDeck);
  });

  group.add(tbGroup);

  // -------------------------------------------------------------------------
  // 5. HMS BELFAST HISTORIC CRUISER MOORED (u = 0.80)
  // -------------------------------------------------------------------------
  const fBelfast = getRiverFrame(0.80);
  const belfastGroup = new THREE.Group();
  belfastGroup.position.copy(fBelfast.pt);

  // Ship position along the south bank
  const shipAngle = Math.atan2(fBelfast.tangent.x, fBelfast.tangent.z);
  belfastGroup.rotation.y = shipAngle;

  const shipOffset = new THREE.Vector3(fBelfast.side.x * 11.0, 0.5, fBelfast.side.z * 11.0);
  belfastGroup.position.add(shipOffset);

  // Hull (Warship streamline)
  const hull = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.4, 26.0), navyGreyMat);
  hull.position.y = 1.2;
  hull.castShadow = true;
  belfastGroup.add(hull);

  // Bow wedge
  const bow = new THREE.Mesh(new THREE.ConeGeometry(2.0, 4.0, 4), navyGreyMat);
  bow.rotation.x = -Math.PI / 2;
  bow.rotation.y = Math.PI / 4;
  bow.position.set(0, 1.2, 14.5);
  belfastGroup.add(bow);

  // Multi-tier Bridge Superstructure
  const bridgeHouse = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.2, 8.0), navyGreyMat);
  bridgeHouse.position.set(0, 3.8, 1.0);
  belfastGroup.add(bridgeHouse);

  // Twin Funnels
  [-1.5, 2.5].forEach(zF => {
    const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.65, 3.0, 12), darkSpireMat);
    funnel.position.set(0, 4.8, zF);
    funnel.rotation.x = -0.15; // raked funnel
    belfastGroup.add(funnel);
  });

  // Gun Turrets (Forward & Aft Triple 6-inch Barrels)
  [7.5, -8.0].forEach(zTurret => {
    const turretHouse = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 2.8), navyGreyMat);
    turretHouse.position.set(0, 2.8, zTurret);

    // Barrels
    [-0.5, 0, 0.5].forEach(xBar => {
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.5, 8), darkSpireMat);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(xBar, 0.2, (zTurret > 0) ? 2.5 : -2.5);
      turretHouse.add(barrel);
    });

    belfastGroup.add(turretHouse);
  });

  // Radar Lattice Mast
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 7.0, 8), stainlessSteelMat);
  mast.position.set(0, 7.0, 2.0);
  belfastGroup.add(mast);

  group.add(belfastGroup);

  // -------------------------------------------------------------------------
  // 6. VICTORIA EMBANKMENT & BIG BEN (ELIZABETH TOWER) SILHOUETTE (u = 0.90)
  // -------------------------------------------------------------------------
  const fWest = getRiverFrame(0.90);
  const westGroup = new THREE.Group();
  westGroup.position.copy(fWest.pt);

  // Victoria Embankment Solid Granite Parapet Wall
  const embankmentWall = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.2, 36.0), stoneGraniteMat);
  embankmentWall.position.set(-fWest.side.x * 14.0, 1.6, -fWest.side.z * 14.0);
  westGroup.add(embankmentWall);

  // Bazalgette Cast-Iron Dolphin Lamp Posts
  [-12.0, 0, 12.0].forEach(zL => {
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 3.2, 8), darkSpireMat);
    lamp.position.set(-fWest.side.x * 14.0, 3.8, -fWest.side.z * 14.0 + zL);

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    bulb.position.set(0, 1.8, 0);
    lamp.add(bulb);

    westGroup.add(lamp);
  });

  // Palace of Westminster / Elizabeth Tower (Big Ben) Silhouette
  const benGroup = new THREE.Group();
  benGroup.position.set(-fWest.side.x * 24.0, 0, -fWest.side.z * 24.0);

  // Tower Base & Shaft
  const towerShaft = new THREE.Mesh(new THREE.BoxGeometry(6.5, 36.0, 6.5), towerBridgeStone);
  towerShaft.position.y = 18.0;
  towerShaft.castShadow = true;
  benGroup.add(towerShaft);

  // Clock Stage with 4 Clock Faces
  const clockStage = new THREE.Mesh(new THREE.BoxGeometry(7.2, 5.0, 7.2), towerBridgeStone);
  clockStage.position.y = 38.5;
  benGroup.add(clockStage);

  // Illuminated Clock Face
  const clockFace = new THREE.Mesh(new THREE.CircleGeometry(1.8, 16), new THREE.MeshBasicMaterial({ color: 0xfef9c3 }));
  clockFace.position.set(fWest.side.x * 3.65, 38.5, fWest.side.z * 3.65);
  clockFace.rotation.y = Math.atan2(fWest.side.x, fWest.side.z) + Math.PI / 2;
  benGroup.add(clockFace);

  // Gothic Spire & Lantern
  const spireBase = new THREE.Mesh(new THREE.BoxGeometry(5.8, 4.0, 5.8), darkSpireMat);
  spireBase.position.y = 43.0;
  benGroup.add(spireBase);

  const mainSpire = new THREE.Mesh(new THREE.ConeGeometry(3.2, 12.0, 4), darkSpireMat);
  mainSpire.position.y = 51.0;
  mainSpire.rotation.y = Math.PI / 4;
  benGroup.add(mainSpire);

  westGroup.add(benGroup);

  // -------------------------------------------------------------------------
  // 7. EMERGENCY RESPONSE PATROL CRAFT (Met Police & RNLI Lifeboat)
  // -------------------------------------------------------------------------
  // Met Police Marine Policing Unit Catamaran
  const policeBoat = new THREE.Group();
  const pB1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 5.5), policeBlueMat);
  pB1.position.set(-1.0, 0.4, 0);
  policeBoat.add(pB1);
  const pB2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 5.5), policeBlueMat);
  pB2.position.set(1.0, 0.4, 0);
  policeBoat.add(pB2);
  const pDeck = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.4, 4.8), stainlessSteelMat);
  pDeck.position.set(0, 0.8, 0);
  policeBoat.add(pDeck);
  const pCabin = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.0, 2.2), policeBlueMat);
  pCabin.position.set(0, 1.5, -0.4);
  policeBoat.add(pCabin);
  // Blue flashing beacon
  const pBeacon = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.3, 8), new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
  pBeacon.position.set(0, 2.2, -0.4);
  policeBoat.add(pBeacon);

  policeBoat.position.set(fWest.side.x * 4.0, 0.8, -12.0);
  policeBoat.rotation.y = Math.atan2(fWest.tangent.x, fWest.tangent.z) + 0.3;
  westGroup.add(policeBoat);

  // RNLI Atlantic 85 Lifeboat
  const rnliBoat = new THREE.Group();
  const rHull = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 4.2), rnliOrangeMat);
  rHull.position.y = 0.3;
  rnliBoat.add(rHull);
  const rConsole = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.8, 1.2), darkSpireMat);
  rConsole.position.set(0, 0.8, -0.2);
  rnliBoat.add(rConsole);
  const rRollBar = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.1, 8, 12, Math.PI), rnliOrangeMat);
  rRollBar.position.set(0, 1.2, -1.6);
  rnliBoat.add(rRollBar);

  rnliBoat.position.set(-fWest.side.x * 4.0, 0.8, 10.0);
  rnliBoat.rotation.y = Math.atan2(fWest.tangent.x, fWest.tangent.z) - 0.4;
  westGroup.add(rnliBoat);

  group.add(westGroup);

  return {
    wipeableItems,
    dynamicWaterItems,
    sectorGates
  };
}
