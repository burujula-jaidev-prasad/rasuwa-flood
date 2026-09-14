import * as THREE from 'three';
import {
  getRedSandstoneTexture,
  getDelhiBrickTexture,
  getTinRoofTexture,
  getTarpRoofTexture,
  getAsphaltRoadTexture
} from './delhi_textures.js';

/**
 * Procedural 3D Landmarks, Bridges, Floodplain Settlements, Vehicles & Countermeasures
 * for Delhi, India (Yamuna River Catastrophic Inundation Scenario)
 * 
 * Features 60+ dynamic collapsing structures, basti shanties, vehicles, and breached bunds
 * that physically fail, tilt, and wash down the Yamuna torrent as the flood crest advances.
 */
export function buildDelhiScene(group, river, terrain) {
  const wipeableItems = [];
  const dynamicWaterItems = [];

  // Procedural canvas textures for Delhi
  const redSandstoneTex = getRedSandstoneTexture();
  const delhiBrickTex = getDelhiBrickTexture();
  const tinRoofTex = getTinRoofTexture();
  const tarpRoofTex = getTarpRoofTexture();
  const asphaltRoadTex = getAsphaltRoadTexture();

  // Helper to place objects on river tangents & bank normals
  function getRiverFrame(u) {
    const pt = river.getPointAt(u);
    const tangent = river.getTangentAt(u).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();
    return { pt, tangent, side, up };
  }

  // -------------------------------------------------------------------------
  // PROCEDURAL BUILDERS FOR DETAILED COLLAPSING ARCHITECTURE & VEHICLES
  // -------------------------------------------------------------------------

  /**
   * Authentic Delhi Yamuna Floodplain Jhuggi / Basti Shanty Dwelling
   * Brick masonry / mud-plaster walls, sloped CGI tin / blue-orange tarpaulin roof,
   * wooden support poles, rooftop water tank / terracotta pots, door & window apertures.
   */
  function createBastiHut(bw = 3.2, bh = 2.4, bd = 3.6, wallHex = 0xb45309, roofHex = 0x64748b, roofType = 'cgi') {
    const hutGroup = new THREE.Group();
    const materials = [];

    // Walls with brick texture
    const wallMat = new THREE.MeshStandardMaterial({
      color: wallHex,
      map: delhiBrickTex || null,
      roughness: 0.85
    });
    materials.push(wallMat);
    const wallGeo = new THREE.BoxGeometry(bw, bh, bd);
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.y = bh * 0.5;
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    hutGroup.add(wallMesh);

    // Door cutout panel (dark recessed wood)
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 });
    materials.push(doorMat);
    const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.4, 0.1), doorMat);
    doorMesh.position.set(0, 0.7, bd * 0.5 + 0.02);
    hutGroup.add(doorMesh);

    // Window aperture
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.6 });
    materials.push(windowMat);
    const winMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.1), windowMat);
    winMesh.position.set(bw * 0.5 + 0.02, bh * 0.6, 0);
    winMesh.rotation.y = Math.PI * 0.5;
    hutGroup.add(winMesh);

    // Corner timber poles
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.9 });
    materials.push(poleMat);
    [
      [-bw * 0.5, -bd * 0.5],
      [ bw * 0.5, -bd * 0.5],
      [-bw * 0.5,  bd * 0.5],
      [ bw * 0.5,  bd * 0.5]
    ].forEach(([px, pz]) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, bh + 0.3, 6), poleMat);
      pole.position.set(px, (bh + 0.3) * 0.5, pz);
      hutGroup.add(pole);
    });

    // Roof construction with CGI tin or blue/orange tarpaulin texture
    const roofTex = (roofType === 'cgi') ? tinRoofTex : ((roofType === 'tarp') ? tarpRoofTex : null);
    const roofMat = new THREE.MeshStandardMaterial({
      color: roofHex,
      map: roofTex || null,
      roughness: 0.7,
      metalness: roofType === 'cgi' ? 0.35 : 0.05
    });
    materials.push(roofMat);

    if (roofType === 'cgi') {
      const roofMesh = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.5, 0.15, bd + 0.6), roofMat);
      roofMesh.position.set(0, bh + 0.1, 0);
      roofMesh.rotation.x = 0.08;
      roofMesh.castShadow = true;
      hutGroup.add(roofMesh);

      const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
      materials.push(tireMat);
      const tire = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.1, 8, 12), tireMat);
      tire.rotation.x = Math.PI * 0.5;
      tire.position.set(0.4, bh + 0.26, 0.2);
      hutGroup.add(tire);
    } else if (roofType === 'tarp') {
      const ridgeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, bd + 0.4), poleMat);
      ridgeMesh.position.set(0, bh + 0.5, 0);
      hutGroup.add(ridgeMesh);

      const tarpGeo = new THREE.ConeGeometry((bw + 0.4) * 0.7, 0.6, 4);
      const tarpMesh = new THREE.Mesh(tarpGeo, roofMat);
      tarpMesh.rotation.y = Math.PI * 0.25;
      tarpMesh.position.set(0, bh + 0.3, 0);
      tarpMesh.scale.set(1.0, 1.0, (bd + 0.4) / (bw + 0.4));
      hutGroup.add(tarpMesh);
    } else {
      const slabMesh = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.2, 0.2, bd + 0.2), roofMat);
      slabMesh.position.set(0, bh + 0.1, 0);
      hutGroup.add(slabMesh);

      const tankMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
      materials.push(tankMat);
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.7, 10), tankMat);
      tank.position.set(-bw * 0.25, bh + 0.55, -bd * 0.25);
      hutGroup.add(tank);
    }

    return { group: hutGroup, materials, primaryMat: wallMat };
  }

  /**
   * Detailed Delhi Auto-Rickshaw (Tuk-Tuk)
   */
  function createAutoRickshaw() {
    const rickGroup = new THREE.Group();
    const materials = [];

    const autoGreenMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.5 });
    const autoYellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    materials.push(autoGreenMat, autoYellowMat, blackMat);

    const lower = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 1.6), autoGreenMat);
    lower.position.y = 0.4;
    lower.castShadow = true;
    rickGroup.add(lower);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.8, 4), autoYellowMat);
    nose.rotation.x = Math.PI * 0.5;
    nose.rotation.y = Math.PI * 0.25;
    nose.position.set(0, 0.55, 0.8);
    rickGroup.add(nose);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.12, 1.2), autoYellowMat);
    roof.position.set(0, 1.15, -0.1);
    rickGroup.add(roof);

    const drape = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.6, 0.3), blackMat);
    drape.position.set(0, 0.85, -0.65);
    rickGroup.add(drape);

    const wheelGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.12, 8);
    wheelGeo.rotateZ(Math.PI * 0.5);

    const fWheel = new THREE.Mesh(wheelGeo, blackMat);
    fWheel.position.set(0, 0.2, 0.7);
    rickGroup.add(fWheel);

    [-0.45, 0.45].forEach(wx => {
      const rWheel = new THREE.Mesh(wheelGeo, blackMat);
      rWheel.position.set(wx, 0.2, -0.45);
      rickGroup.add(rWheel);
    });

    return { group: rickGroup, materials, primaryMat: autoGreenMat };
  }

  /**
   * Detailed Delhi Transport Corporation (DTC) Low-Floor Green Bus
   */
  function createDTCBus() {
    const busGroup = new THREE.Group();
    const materials = [];

    const busGreen = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 });
    const whiteRoof = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
    const glassDark = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2, metalness: 0.7 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
    const ledAmber = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });
    materials.push(busGreen, whiteRoof, glassDark, wheelMat, ledAmber);

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 5.4), busGreen);
    body.position.y = 0.8;
    body.castShadow = true;
    busGroup.add(body);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.25, 5.3), whiteRoof);
    roof.position.y = 1.5;
    busGroup.add(roof);

    const win = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.45, 4.8), glassDark);
    win.position.y = 1.15;
    busGroup.add(win);

    const dest = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.2, 0.08), ledAmber);
    dest.position.set(0, 1.45, 2.71);
    busGroup.add(dest);

    const wGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.22, 10);
    wGeo.rotateZ(Math.PI * 0.5);
    [-0.9, 0.9].forEach(wx => {
      [-1.6, 1.6].forEach(wz => {
        const wheel = new THREE.Mesh(wGeo, wheelMat);
        wheel.position.set(wx, 0.35, wz);
        busGroup.add(wheel);
      });
    });

    return { group: busGroup, materials, primaryMat: busGreen };
  }

  /**
   * Compact Passenger Car / Delivery Tempo
   */
  function createPassengerCar(colorHex = 0xe2e8f0) {
    const carGroup = new THREE.Group();
    const materials = [];

    const carMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.4, metalness: 0.3 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.8 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    materials.push(carMat, glassMat, wheelMat);

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.55, 2.8), carMat);
    body.position.y = 0.45;
    carGroup.add(body);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 1.5), glassMat);
    cabin.position.set(0, 0.85, -0.2);
    carGroup.add(cabin);

    const wGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.15, 8);
    wGeo.rotateZ(Math.PI * 0.5);
    [-0.7, 0.7].forEach(wx => {
      [-0.8, 0.8].forEach(wz => {
        const wheel = new THREE.Mesh(wGeo, wheelMat);
        wheel.position.set(wx, 0.24, wz);
        carGroup.add(wheel);
      });
    });

    return { group: carGroup, materials, primaryMat: carMat };
  }

  /**
   * Traditional Yamuna Flat-Bottomed Country Boat (Naav)
   */
  function createCountryBoat() {
    const boatGroup = new THREE.Group();
    const materials = [];

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.85 });
    materials.push(woodMat);

    const hull = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 3.4), woodMat);
    hull.position.y = 0.25;
    hull.castShadow = true;
    boatGroup.add(hull);

    for (let s = -1; s <= 1; s++) {
      const bench = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 0.3), woodMat);
      bench.position.set(0, 0.4, s * 0.9);
      boatGroup.add(bench);
    }

    const oar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 6), woodMat);
    oar.rotation.z = Math.PI * 0.35;
    oar.position.set(0.6, 0.5, 0.3);
    boatGroup.add(oar);

    return { group: boatGroup, materials, primaryMat: woodMat };
  }

  /**
   * Roadside Tea Stall / Dhaba with Tarpaulin Awning
   */
  function createTeaStall() {
    const stallGroup = new THREE.Group();
    const materials = [];

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const tarpMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.7 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.3, metalness: 0.8 });
    materials.push(woodMat, tarpMat, metalMat);

    const counter = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.85, 0.9), woodMat);
    counter.position.y = 0.42;
    counter.castShadow = true;
    stallGroup.add(counter);

    [[-0.85, -0.4], [0.85, -0.4], [-0.85, 0.4], [0.85, 0.4]].forEach(([px, pz]) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.1, 6), woodMat);
      post.position.set(px, 1.05, pz);
      stallGroup.add(post);
    });

    const awning = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 1.3), tarpMat);
    awning.position.set(0, 2.1, 0);
    awning.rotation.x = 0.12;
    stallGroup.add(awning);

    const kettle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.3, 8), metalMat);
    kettle.position.set(0.4, 0.95, 0);
    stallGroup.add(kettle);

    const bench = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.35), woodMat);
    bench.position.set(0, 0.2, 0.85);
    stallGroup.add(bench);

    return { group: stallGroup, materials, primaryMat: woodMat };
  }

  /**
   * Indo-Gangetic Brick Kiln (Bhatta) with Terracotta Chimney
   */
  function createBrickKiln() {
    const kilnGroup = new THREE.Group();
    const materials = [];

    const brickMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.9 });
    const earthMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.95 });
    materials.push(brickMat, earthMat);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.4, 1.8, 16), earthMat);
    base.position.y = 0.9;
    base.scale.set(1.4, 1.0, 0.9);
    base.castShadow = true;
    kilnGroup.add(base);

    const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.3, 11.0, 12), brickMat);
    chimney.position.set(0, 6.5, 0);
    chimney.castShadow = true;
    kilnGroup.add(chimney);

    for (let p = 0; p < 4; p++) {
      const pallet = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 0.9), brickMat);
      pallet.position.set(3.5 + (p % 2) * 1.5, 0.3, (p > 1 ? 1 : -1) * 1.2);
      kilnGroup.add(pallet);
    }

    return { group: kilnGroup, materials, primaryMat: brickMat };
  }

  /**
   * Dynamic Breachable Sandbag Embankment Bund Segment
   */
  function createSandbagBundSegment(length = 3.6) {
    const bundGroup = new THREE.Group();
    const materials = [];

    const sandbagMat = new THREE.MeshStandardMaterial({ color: 0xd4b996, roughness: 0.95 });
    materials.push(sandbagMat);

    const cols = Math.floor(length / 0.7);
    for (let row = 0; row < 3; row++) {
      for (let c = 0; c < cols; c++) {
        const bag = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.32, 0.42), sandbagMat);
        bag.position.set((c - cols * 0.5 + 0.5) * 0.7, 0.16 + row * 0.3, (row % 2) * 0.1);
        bundGroup.add(bag);
      }
    }

    return { group: bundGroup, materials, primaryMat: sandbagMat };
  }

  /**
   * High-Fidelity National Disaster Response Force (NDRF) Motorized Rescue Boat
   * Inflatable Zodiac dinghy with heavy-duty orange pontoon sponsons, rigid hull floor,
   * outboard Yamaha motor with propeller cowl, bow searchlight, lifebuoys, and 2 relief personnel.
   */
  function createNDRFRescueBoat() {
    const boatGroup = new THREE.Group();
    const materials = [];

    const orangePontoons = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.45, metalness: 0.1 });
    const rubberBlack = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85 });
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7, metalness: 0.2 });
    const motorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.6 });
    const ndrfBlue = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.7 });
    const lifeVestOrange = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 });
    const helmetWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const spotlightMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.8 });
    materials.push(orangePontoons, rubberBlack, deckMat, motorMat, ndrfBlue, lifeVestOrange, helmetWhite, spotlightMat);

    // Rigid deck base
    const deck = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.15, 3.4), deckMat);
    deck.position.y = 0.15;
    boatGroup.add(deck);

    // Port & Starboard inflatable tubes (cylinders with conical ends)
    [-0.8, 0.8].forEach(sideX => {
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 3.2, 12), orangePontoons);
      tube.rotation.x = Math.PI * 0.5;
      tube.position.set(sideX, 0.32, 0);
      boatGroup.add(tube);

      // Black rub-strake bumper
      const bumper = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 3.2, 12), rubberBlack);
      bumper.rotation.x = Math.PI * 0.5;
      bumper.scale.set(1.02, 1.0, 0.15);
      bumper.position.set(sideX * 1.01, 0.32, 0);
      boatGroup.add(bumper);

      // Conical cone ends at stern
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.6, 12), orangePontoons);
      cone.rotation.x = -Math.PI * 0.5;
      cone.position.set(sideX, 0.32, -1.9);
      boatGroup.add(cone);
    });

    // Bow curved pontoon cross-section
    const bowTube = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.6, 12), orangePontoons);
    bowTube.rotation.z = Math.PI * 0.5;
    bowTube.position.set(0, 0.38, 1.6);
    boatGroup.add(bowTube);

    // Bow spray splash guard
    const bowNose = new THREE.Mesh(new THREE.ConeGeometry(0.7, 0.8, 4), orangePontoons);
    bowNose.rotation.x = Math.PI * 0.5;
    bowNose.position.set(0, 0.38, 1.9);
    boatGroup.add(bowNose);

    // Stern Transom Board
    const transom = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.6, 0.15), rubberBlack);
    transom.position.set(0, 0.45, -1.55);
    boatGroup.add(transom);

    // Outboard Motor Assembly
    const motorGroup = new THREE.Group();
    motorGroup.position.set(0, 0.6, -1.75);
    const motorCowling = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.55, 0.5), motorMat);
    motorCowling.position.y = 0.2;
    motorGroup.add(motorCowling);

    const motorShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 8), motorMat);
    motorShaft.position.set(0, -0.3, -0.05);
    motorGroup.add(motorShaft);

    const prop = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.06), rubberBlack);
    prop.position.set(0, -0.7, -0.05);
    motorGroup.add(prop);

    const tiller = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 6), rubberBlack);
    tiller.rotation.x = Math.PI * 0.4;
    tiller.position.set(0.15, 0.35, 0.25);
    motorGroup.add(tiller);
    boatGroup.add(motorGroup);

    // Bow Searchlight & Spotlight
    const spotlight = new THREE.Group();
    spotlight.position.set(0, 0.72, 1.55);
    const lightHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.25, 10), rubberBlack);
    lightHousing.rotation.x = Math.PI * 0.5;
    spotlight.add(lightHousing);

    const lightLens = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 10), spotlightMat);
    lightLens.rotation.x = Math.PI * 0.5;
    lightLens.position.set(0, 0, 0.13);
    spotlight.add(lightLens);
    boatGroup.add(spotlight);

    // Lifebuoy ring attached to starboard tube
    const buoyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    materials.push(buoyMat);
    const buoy = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.08, 8, 16), buoyMat);
    buoy.rotation.y = Math.PI * 0.5;
    buoy.position.set(0.85, 0.5, 0.4);
    boatGroup.add(buoy);

    // 2 NDRF Personnel (Coxswain at motor + Spotter with binoculars)
    [-0.2, 0.2].forEach((xOff, pIdx) => {
      const personGroup = new THREE.Group();
      personGroup.position.set(xOff, 0.25, (pIdx === 0 ? -1.1 : 0.6));

      // Legs / Seated Lower Body
      const legs = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.35, 0.45), ndrfBlue);
      legs.position.y = 0.2;
      personGroup.add(legs);

      // Torso with NDRF Lifejacket
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.48, 0.32), lifeVestOrange);
      torso.position.y = 0.58;
      personGroup.add(torso);

      // Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), new THREE.MeshStandardMaterial({ color: 0x8d5b4c }));
      head.position.y = 0.92;
      personGroup.add(head);

      // White Rescue Helmet
      const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.6), helmetWhite);
      helmet.position.y = 0.94;
      personGroup.add(helmet);

      boatGroup.add(personGroup);
    });

    boatGroup.castShadow = true;
    return { group: boatGroup, materials, primaryMat: orangePontoons, motorGroup, spotlight };
  }

  /**
   * Floating Urban Chemical / Fuel Barrels
   */
  function createFloatingBarrelCluster() {
    const cluster = new THREE.Group();
    const materials = [];

    const barrelColors = [0x0284c7, 0xdc2626, 0xeab308];
    const drumGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.9, 10);

    for (let b = 0; b < 3; b++) {
      const mat = new THREE.MeshStandardMaterial({ color: barrelColors[b % barrelColors.length], roughness: 0.5, metalness: 0.4 });
      materials.push(mat);
      const drum = new THREE.Mesh(drumGeo, mat);
      drum.position.set((b - 1) * 0.45, 0.2, (b % 2 === 0 ? 0.2 : -0.2));
      drum.rotation.z = (Math.random() - 0.5) * 0.4;
      cluster.add(drum);
    }
    return { group: cluster, materials, primaryMat: materials[0] };
  }

  /**
   * Floating Timber Planks & Bamboo Raft Debris
   */
  function createFloatingTimberRaft() {
    const raft = new THREE.Group();
    const materials = [];

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    materials.push(woodMat);

    for (let p = 0; p < 5; p++) {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 2.8), woodMat);
      plank.position.set((p - 2) * 0.38, 0.1, (Math.random() - 0.5) * 0.3);
      raft.add(plank);
    }
    return { group: raft, materials, primaryMat: woodMat };
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
      driftDir: tangent.clone().multiplyScalar(options.driftSpeed || 24.0),
      tumbleVel: new THREE.Vector3(
        (Math.random() - 0.5) * (options.tumbleScale || 6.0),
        (Math.random() - 0.5) * (options.tumbleScale || 5.0),
        (Math.random() - 0.5) * (options.tumbleScale || 6.0)
      ),
      collapseTilt: options.collapseTilt || ((Math.random() > 0.5 ? 1 : -1) * (0.35 + Math.random() * 0.35)),
      sinkScale: options.sinkScale || 0.18,
      washSpeed: options.washSpeed || 38.0,
      maxProg: options.maxProg || 0.055,
      material: options.primaryMat,
      materials: options.materials
    });
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
  const pipeMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.4 });

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
      const gate = new THREE.Mesh(new THREE.BoxGeometry(pierSpacing * 0.85, 2.8, 0.3), darkSteel);
      const gateOffset = offset + pierSpacing * 0.5;
      gate.position.set(fWazir.side.x * gateOffset, 1.4, fWazir.side.z * gateOffset);
      wazirGroup.add(gate);
    }
  }

  const gantry = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, barrageSpan + 2), darkSteel);
  gantry.rotation.y = Math.atan2(fWazir.side.x, fWazir.side.z);
  gantry.position.set(0, 4.8, 0);
  wazirGroup.add(gantry);

  // WTP Pump House on Western Bank
  const pumpHouse = new THREE.Group();
  const pumpBuilding = new THREE.Mesh(new THREE.BoxGeometry(10.0, 4.5, 8.0), concreteMat);
  pumpBuilding.castShadow = true;
  pumpHouse.add(pumpBuilding);

  for (let p = 0; p < 3; p++) {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 6.0, 12), pipeMat);
    pipe.rotation.z = Math.PI * 0.35;
    pipe.position.set(3.5 + p * 1.5, -1.0, 0);
    pumpHouse.add(pipe);
  }

  const siltMound = new THREE.Mesh(new THREE.ConeGeometry(4.0, 1.8, 16), siltMat);
  siltMound.position.set(4.0, -1.2, 0);
  pumpHouse.add(siltMound);

  pumpHouse.position.set(-fWazir.side.x * 16.0, 2.2, -fWazir.side.z * 16.0);
  wazirGroup.add(pumpHouse);
  group.add(wazirGroup);

  // ----------------------------------------------------
  // CLUSTER 1: WAZIRABAD & MAJNU KA TILA FLOODPLAIN BASTI (u = 0.22 - 0.29)
  // ----------------------------------------------------
  const hutWallColors = [0x991b1b, 0xb45309, 0xd97706, 0x4b5563, 0x78350f, 0xa16207];
  const hutRoofColors = [0x475569, 0x0284c7, 0xea580c, 0x64748b, 0x0f766e];
  const roofTypes = ['cgi', 'tarp', 'flat'];

  for (let i = 0; i < 10; i++) {
    const uHut = 0.22 + i * 0.007;
    const fHut = getRiverFrame(uHut);
    const bankDir = (i % 2 === 0) ? -1 : 1;
    const dist = 7.5 + (i % 3) * 2.2;

    const hut = createBastiHut(
      3.0 + (i % 3) * 0.4,
      2.2 + (i % 2) * 0.3,
      3.4 + (i % 2) * 0.4,
      hutWallColors[i % hutWallColors.length],
      hutRoofColors[i % hutRoofColors.length],
      roofTypes[i % roofTypes.length]
    );

    const pos = fHut.pt.clone().addScaledVector(fHut.side, bankDir * dist);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    hut.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fHut.tangent);
    hut.group.rotation.y += (i * 0.5);

    registerWipeable(hut.group, uHut, pos, fHut.tangent, fHut.side, {
      primaryMat: hut.primaryMat,
      materials: hut.materials,
      driftSpeed: 25.0,
      tumbleScale: 6.5
    });
  }

  // Country boats moored at Majnu Ka Tila ghats
  [0.23, 0.26].forEach((uBoat, bIdx) => {
    const fBoat = getRiverFrame(uBoat);
    const boat = createCountryBoat();
    const pos = fBoat.pt.clone().addScaledVector(fBoat.side, (bIdx === 0 ? 4.2 : -4.2));
    pos.y = fBoat.pt.y + 0.2;
    boat.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fBoat.tangent);

    registerWipeable(boat.group, uBoat, pos, fBoat.tangent, fBoat.side, {
      primaryMat: boat.primaryMat,
      materials: boat.materials,
      driftSpeed: 30.0,
      tumbleScale: 8.0
    });
  });

  // Tea stall on floodplain edge
  {
    const fChai = getRiverFrame(0.25);
    const chai = createTeaStall();
    const pos = fChai.pt.clone().addScaledVector(fChai.side, -8.0);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    chai.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fChai.tangent);

    registerWipeable(chai.group, 0.25, pos, fChai.tangent, fChai.side, {
      primaryMat: chai.primaryMat,
      materials: chai.materials,
      driftSpeed: 26.0
    });
  }

  // Brick Kiln (Bhatta) on East Bank sandbar
  {
    const fKiln = getRiverFrame(0.27);
    const kiln = createBrickKiln();
    const pos = fKiln.pt.clone().addScaledVector(fKiln.side, 14.5);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z);
    kiln.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fKiln.tangent);

    registerWipeable(kiln.group, 0.27, pos, fKiln.tangent, fKiln.side, {
      primaryMat: kiln.primaryMat,
      materials: kiln.materials,
      driftSpeed: 18.0,
      tumbleScale: 3.0,
      collapseTilt: 0.4
    });
  }

  // ----------------------------------------------------
  // 2. OLD YAMUNA IRON BRIDGE (LOHA PUL - 1866) (u = 0.35)
  // ----------------------------------------------------
  const fLoha = getRiverFrame(0.35);
  const lohaGroup = new THREE.Group();
  lohaGroup.position.copy(fLoha.pt);

  const brickPierMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    map: delhiBrickTex || null,
    roughness: 0.85
  });
  const ironTrussMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.6, metalness: 0.7 });
  const locoMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.5 });
  const coachMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 });

  const bridgeSpan = 26.0;
  const numSpans = 4;
  const spanLength = bridgeSpan / numSpans;

  for (let s = 0; s <= numSpans; s++) {
    const offset = (s - numSpans * 0.5) * spanLength;
    const pier = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.6, 6.5, 16), brickPierMat);
    pier.scale.set(1.4, 1.0, 0.8);
    pier.position.set(fLoha.side.x * offset, 2.0, fLoha.side.z * offset);
    pier.castShadow = true;
    lohaGroup.add(pier);

    if (s < numSpans) {
      const spanCenter = offset + spanLength * 0.5;
      const trussGroup = new THREE.Group();
      trussGroup.position.set(fLoha.side.x * spanCenter, 5.2, fLoha.side.z * spanCenter);

      const lowerDeck = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, spanLength * 0.95), ironTrussMat);
      lowerDeck.position.y = -1.2;
      trussGroup.add(lowerDeck);

      const upperDeck = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, spanLength * 0.95), ironTrussMat);
      upperDeck.position.y = 1.2;
      trussGroup.add(upperDeck);

      const trussSide1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.4, spanLength * 0.92), ironTrussMat);
      trussSide1.position.x = 0.4;
      trussGroup.add(trussSide1);

      const trussSide2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.4, spanLength * 0.92), ironTrussMat);
      trussSide2.position.x = -0.4;
      trussGroup.add(trussSide2);

      lohaGroup.add(trussGroup);
    }
  }

  // WAP-7 Locomotive & Passenger Train halted on bridge upper deck
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
  // CLUSTER 2: YAMUNA BAZAR & LOHA PUL RIVERBED BASTI (u = 0.36 - 0.44)
  // ----------------------------------------------------
  for (let i = 0; i < 12; i++) {
    const uBasti = 0.36 + i * 0.0065;
    const fBasti = getRiverFrame(uBasti);
    const bankDir = (i % 3 === 0) ? 1 : -1;
    const dist = 6.8 + (i % 4) * 1.8;

    const hut = createBastiHut(
      2.8 + (i % 3) * 0.5,
      2.1 + (i % 2) * 0.4,
      3.2 + (i % 3) * 0.3,
      hutWallColors[(i + 2) % hutWallColors.length],
      hutRoofColors[(i + 1) % hutRoofColors.length],
      roofTypes[(i + 1) % roofTypes.length]
    );

    const pos = fBasti.pt.clone().addScaledVector(fBasti.side, bankDir * dist);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    hut.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fBasti.tangent);
    hut.group.rotation.y += (i * 0.4);

    registerWipeable(hut.group, uBasti, pos, fBasti.tangent, fBasti.side, {
      primaryMat: hut.primaryMat,
      materials: hut.materials,
      driftSpeed: 26.0,
      tumbleScale: 7.0
    });
  }

  // Moored Yamuna Bazar country boats & roadside dhabas
  [0.37, 0.41].forEach((uB, bIdx) => {
    const fBoat = getRiverFrame(uB);
    const boat = createCountryBoat();
    const pos = fBoat.pt.clone().addScaledVector(fBoat.side, (bIdx === 0 ? -4.5 : 4.5));
    pos.y = fBoat.pt.y + 0.2;
    boat.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fBoat.tangent);

    registerWipeable(boat.group, uB, pos, fBoat.tangent, fBoat.side, {
      primaryMat: boat.primaryMat,
      materials: boat.materials,
      driftSpeed: 28.0
    });
  });

  [0.39, 0.43].forEach((uChai, cIdx) => {
    const fChai = getRiverFrame(uChai);
    const chai = createTeaStall();
    const pos = fChai.pt.clone().addScaledVector(fChai.side, (cIdx === 0 ? -7.8 : 7.2));
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    chai.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fChai.tangent);

    registerWipeable(chai.group, uChai, pos, fChai.tangent, fChai.side, {
      primaryMat: chai.primaryMat,
      materials: chai.materials,
      driftSpeed: 24.0
    });
  });

  // ----------------------------------------------------
  // 3. KASHMERE GATE & SUBMERGED RING ROAD (u = 0.48)
  // ----------------------------------------------------
  const fKash = getRiverFrame(0.48);
  const kashGroup = new THREE.Group();
  kashGroup.position.copy(fKash.pt);

  const tarmacMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    map: asphaltRoadTex || null,
    roughness: 0.9
  });

  const roadLength = 38.0;
  const ringRoad = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.5, roadLength), tarmacMat);
  ringRoad.position.set(-fKash.side.x * 12.0, 3.2, -fKash.side.z * 12.0);
  ringRoad.castShadow = true;
  kashGroup.add(ringRoad);

  for (let p = -3; p <= 3; p++) {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3.0, 12), concreteMat);
    col.position.set(-fKash.side.x * 12.0, 1.5, -fKash.side.z * 12.0 + p * 5.5);
    kashGroup.add(col);
  }
  group.add(kashGroup);

  // ----------------------------------------------------
  // CLUSTER 3: KASHMERE GATE COLLAPSING VEHICLES & MARKET (u = 0.47 - 0.50)
  // ----------------------------------------------------
  // DTC Bus on low-lying Ring Road ramp that floats and washes away
  {
    const bus = createDTCBus();
    const pos = fKash.pt.clone().addScaledVector(fKash.side, -9.5).addScaledVector(fKash.tangent, 3.0);
    pos.y = 2.4;
    bus.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fKash.tangent);
    bus.group.rotation.z = 0.14;

    registerWipeable(bus.group, 0.48, pos, fKash.tangent, fKash.side, {
      primaryMat: bus.primaryMat,
      materials: bus.materials,
      driftSpeed: 30.0,
      tumbleScale: 6.0,
      sinkScale: 0.22
    });
  }

  // Auto-rickshaws drifting in floodwaters
  [-2.5, 6.5].forEach((zOff, aIdx) => {
    const auto = createAutoRickshaw();
    const pos = fKash.pt.clone().addScaledVector(fKash.side, -8.2 + aIdx * 1.5).addScaledVector(fKash.tangent, zOff);
    pos.y = 2.1;
    auto.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fKash.tangent);
    auto.group.rotation.x = -0.18;

    registerWipeable(auto.group, 0.475 + aIdx * 0.01, pos, fKash.tangent, fKash.side, {
      primaryMat: auto.primaryMat,
      materials: auto.materials,
      driftSpeed: 32.0,
      tumbleScale: 9.0
    });
  });

  // Stranded cars on flooded Ring Road ramp
  [0xe2e8f0, 0xdc2626].forEach((carCol, cIdx) => {
    const car = createPassengerCar(carCol);
    const pos = fKash.pt.clone().addScaledVector(fKash.side, -11.0 + cIdx * 2.0).addScaledVector(fKash.tangent, -6.0 + cIdx * 4.5);
    pos.y = 2.3;
    car.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fKash.tangent);

    registerWipeable(car.group, 0.485 + cIdx * 0.008, pos, fKash.tangent, fKash.side, {
      primaryMat: car.primaryMat,
      materials: car.materials,
      driftSpeed: 28.0,
      tumbleScale: 7.0
    });
  });

  // Tibetan Monastery Market Stalls
  for (let m = 0; m < 5; m++) {
    const stall = createTeaStall();
    const pos = fKash.pt.clone().addScaledVector(fKash.side, -16.0 + (m % 2) * 2.5).addScaledVector(fKash.tangent, -8.0 + m * 3.6);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    stall.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fKash.tangent);

    registerWipeable(stall.group, 0.475 + m * 0.005, pos, fKash.tangent, fKash.side, {
      primaryMat: stall.primaryMat,
      materials: stall.materials,
      driftSpeed: 27.0,
      tumbleScale: 8.0
    });
  }

  // ----------------------------------------------------
  // 4. RED FORT (LAL QILA) & SALIMGARH RAMPARTS (u = 0.60)
  // ----------------------------------------------------
  const fFort = getRiverFrame(0.60);
  const fortGroup = new THREE.Group();
  fortGroup.position.copy(fFort.pt);

  const redSandstoneMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    map: redSandstoneTex || null,
    roughness: 0.85
  });
  const whiteMarbleMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 });

  const wallLength = 48.0;
  const wallHeight = 7.5;
  const rampart = new THREE.Mesh(new THREE.BoxGeometry(2.4, wallHeight, wallLength), redSandstoneMat);
  rampart.position.set(-fFort.side.x * 18.0, 4.2, -fFort.side.z * 18.0);
  rampart.castShadow = true;
  fortGroup.add(rampart);

  for (let c = 0; c < 24; c++) {
    const battlement = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 1.2), redSandstoneMat);
    battlement.position.set(-fFort.side.x * 18.0, wallHeight + 1.0, -wallLength * 0.5 + c * 2.0);
    fortGroup.add(battlement);
  }

  for (const end of [-wallLength * 0.5, wallLength * 0.5]) {
    const burj = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.4, wallHeight + 2.0, 8), redSandstoneMat);
    burj.position.set(-fFort.side.x * 18.0, 5.0, end);
    fortGroup.add(burj);

    const chhatriDome = new THREE.Mesh(new THREE.SphereGeometry(1.4, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), whiteMarbleMat);
    chhatriDome.position.set(-fFort.side.x * 18.0, wallHeight + 6.2, end);
    fortGroup.add(chhatriDome);
  }

  const salimBridge = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.2, 12.0), redSandstoneMat);
  salimBridge.position.set(-fFort.side.x * 12.0, 3.2, 14.0);
  fortGroup.add(salimBridge);
  group.add(fortGroup);

  // ----------------------------------------------------
  // CLUSTER 4: BELA ESTATE & GEETA COLONY FLOODPLAIN (u = 0.62 - 0.70)
  // ----------------------------------------------------
  for (let i = 0; i < 12; i++) {
    const uBela = 0.62 + i * 0.0065;
    const fBela = getRiverFrame(uBela);
    const bankDir = (i % 2 === 0) ? 1 : -1;
    const dist = 7.0 + (i % 3) * 2.0;

    const hut = createBastiHut(
      3.2 + (i % 3) * 0.3,
      2.3 + (i % 2) * 0.3,
      3.5 + (i % 3) * 0.3,
      hutWallColors[(i + 3) % hutWallColors.length],
      hutRoofColors[(i + 2) % hutRoofColors.length],
      roofTypes[i % roofTypes.length]
    );

    const pos = fBela.pt.clone().addScaledVector(fBela.side, bankDir * dist);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    hut.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fBela.tangent);
    hut.group.rotation.y += (i * 0.45);

    registerWipeable(hut.group, uBela, pos, fBela.tangent, fBela.side, {
      primaryMat: hut.primaryMat,
      materials: hut.materials,
      driftSpeed: 25.0,
      tumbleScale: 6.0
    });
  }

  // Country boats at Bela Estate
  [0.64, 0.68].forEach((uB, bIdx) => {
    const fBoat = getRiverFrame(uB);
    const boat = createCountryBoat();
    const pos = fBoat.pt.clone().addScaledVector(fBoat.side, (bIdx === 0 ? 4.5 : -4.5));
    pos.y = fBoat.pt.y + 0.2;
    boat.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fBoat.tangent);

    registerWipeable(boat.group, uB, pos, fBoat.tangent, fBoat.side, {
      primaryMat: boat.primaryMat,
      materials: boat.materials,
      driftSpeed: 28.0
    });
  });

  // ----------------------------------------------------
  // 5. ITO BARRAGE & DRAIN 12 REGULATOR BREACH (u = 0.74)
  // ----------------------------------------------------
  const fIto = getRiverFrame(0.74);
  const itoGroup = new THREE.Group();
  itoGroup.position.copy(fIto.pt);

  const armyGreenMat = new THREE.MeshStandardMaterial({ color: 0x3f4f2c, roughness: 0.7 });
  const steelSheetMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.7 });

  for (let i = -5; i <= 5; i++) {
    const pier = new THREE.Mesh(new THREE.BoxGeometry(0.7, 4.8, 3.2), concreteMat);
    pier.position.set(fIto.side.x * i * 2.2, 1.5, fIto.side.z * i * 2.2);
    itoGroup.add(pier);
  }

  const drainHeadwall = new THREE.Mesh(new THREE.BoxGeometry(4.0, 3.2, 1.8), concreteMat);
  drainHeadwall.position.set(-fIto.side.x * 12.0, 1.8, 0);
  itoGroup.add(drainHeadwall);

  const brokenGate = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.8, 0.2), darkSteel);
  brokenGate.position.set(-fIto.side.x * 12.0, 1.0, 0.6);
  brokenGate.rotation.z = -0.35;
  itoGroup.add(brokenGate);

  const armyTruck = new THREE.Group();
  const truckBody = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.5, 4.8), armyGreenMat);
  armyTruck.add(truckBody);
  const craneArm = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.8, 0.4), steelSheetMat);
  craneArm.rotation.x = 0.5;
  craneArm.position.set(0, 1.8, -1.0);
  armyTruck.add(craneArm);
  armyTruck.position.set(-fIto.side.x * 17.5, 3.5, -4.0);
  itoGroup.add(armyTruck);

  const vikasTower = new THREE.Mesh(new THREE.BoxGeometry(8.0, 22.0, 8.0), new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.4,
    metalness: 0.3
  }));
  vikasTower.position.set(-fIto.side.x * 28.0, 11.0, -12.0);
  itoGroup.add(vikasTower);
  group.add(itoGroup);

  // ----------------------------------------------------
  // CLUSTER 5: DYNAMIC BREACHING SANDBAG BUNDS AT ITO DRAIN 12 (u = 0.73 - 0.76)
  // ----------------------------------------------------
  for (let s = 0; s < 3; s++) {
    const bund = createSandbagBundSegment(4.2);
    const pos = fIto.pt.clone().addScaledVector(fIto.side, -14.0).addScaledVector(fIto.tangent, (s - 1) * 4.2);
    pos.y = 1.4;
    bund.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fIto.tangent);

    registerWipeable(bund.group, 0.735 + s * 0.01, pos, fIto.tangent, fIto.side, {
      primaryMat: bund.primaryMat,
      materials: bund.materials,
      driftSpeed: 22.0,
      tumbleScale: 5.0,
      sinkScale: 0.25,
      collapseTilt: 0.6
    });
  }

  // Overturned delivery tempo near Drain 12 breach
  {
    const tempo = createPassengerCar(0xd97706);
    const pos = fIto.pt.clone().addScaledVector(fIto.side, -12.5).addScaledVector(fIto.tangent, 2.5);
    pos.y = 1.8;
    tempo.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fIto.tangent);
    tempo.group.rotation.z = 0.45;

    registerWipeable(tempo.group, 0.745, pos, fIto.tangent, fIto.side, {
      primaryMat: tempo.primaryMat,
      materials: tempo.materials,
      driftSpeed: 28.0,
      tumbleScale: 7.5
    });
  }

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

  const rajWall = new THREE.Mesh(new THREE.BoxGeometry(14.0, 1.8, 14.0), concreteMat);
  rajWall.position.set(-fRaj.side.x * 16.0, 2.2, 0);
  rajGroup.add(rajWall);

  const rajLawn = new THREE.Mesh(new THREE.BoxGeometry(12.0, 0.4, 12.0), grassMat);
  rajLawn.position.set(-fRaj.side.x * 16.0, 2.3, 0);
  rajGroup.add(rajLawn);

  const plinth = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 2.4), blackMarbleMat);
  plinth.position.set(-fRaj.side.x * 16.0, 2.8, 0);
  rajGroup.add(plinth);

  for (let p = 0; p < 3; p++) {
    const pumpUnit = new THREE.Group();
    const trailer = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 2.4), trailerYellowMat);
    const pumpEngine = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.1, 1.8), pumpGreenMat);
    pumpEngine.position.y = 0.85;
    pumpUnit.add(trailer);
    pumpUnit.add(pumpEngine);

    const hose = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 7.5, 12), new THREE.MeshStandardMaterial({ color: 0x14532d }));
    hose.rotation.z = Math.PI * 0.42;
    hose.position.set(3.5, 0.5, 0);
    pumpUnit.add(hose);

    pumpUnit.position.set(-fRaj.side.x * 11.0, 2.5, -5.0 + p * 4.5);
    rajGroup.add(pumpUnit);
  }

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

  for (let r = 0; r < 3; r++) {
    const bund = createSandbagBundSegment(3.5);
    const pos = fRaj.pt.clone().addScaledVector(fRaj.side, -10.5).addScaledVector(fRaj.tangent, (r - 1) * 3.8);
    pos.y = 1.6;
    bund.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fRaj.tangent);

    registerWipeable(bund.group, 0.86 + r * 0.01, pos, fRaj.tangent, fRaj.side, {
      primaryMat: bund.primaryMat,
      materials: bund.materials,
      driftSpeed: 20.0,
      tumbleScale: 4.5
    });
  }

  // ----------------------------------------------------
  // 7. NDRF MOTORIZED RESCUE BOATS PATROL FLEET
  // ----------------------------------------------------
  const ndrfRescueFleet = [];

  const boatDefs = [
    { u: 0.24, side: -6.8, patrolSpan: 8.0, desc: 'Wazirabad & Majnu Ka Tila Floodplain Rescue' },
    { u: 0.38, side: 5.5, patrolSpan: 10.0, desc: 'Loha Pul & Yamuna Bazar Evacuation Patrol' },
    { u: 0.48, side: -10.2, patrolSpan: 12.0, desc: 'Kashmere Gate ISBT Submerged Ring Road Evac' },
    { u: 0.63, side: -8.0, patrolSpan: 9.0, desc: 'Red Fort & Salimgarh Ancient Bed Patrol' },
    { u: 0.76, side: -13.5, patrolSpan: 7.0, desc: 'ITO Drain 12 Regulator Breach Response' },
    { u: 0.86, side: 7.5, patrolSpan: 11.0, desc: 'Rajghat Relief Corridor Shuttling' }
  ];

  boatDefs.forEach((bDef, idx) => {
    const boat = createNDRFRescueBoat();
    const f = getRiverFrame(bDef.u);
    const pos = f.pt.clone().addScaledVector(f.side, bDef.side);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.35;
    boat.group.position.copy(pos);
    boat.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), f.tangent);
    group.add(boat.group);

    ndrfRescueFleet.push({
      group: boat.group,
      motorGroup: boat.motorGroup,
      spotlight: boat.spotlight,
      uTrigger: bDef.u - 0.04,
      uCenter: bDef.u,
      sideOffset: bDef.side,
      patrolSpan: bDef.patrolSpan,
      basePos: pos.clone(),
      phase: idx * 1.35
    });
  });

  function updateRescueBoats(clampedT, uWave) {
    const timeSec = Date.now() * 0.001;
    for (let i = 0; i < ndrfRescueFleet.length; i++) {
      const boat = ndrfRescueFleet[i];
      if (uWave < boat.uTrigger) {
        // Moored on standby prior to flood crest reaching sector
        boat.group.position.copy(boat.basePos);
        const f = getRiverFrame(boat.uCenter);
        boat.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), f.tangent);
        if (boat.spotlight) boat.spotlight.rotation.y = 0;
        if (boat.motorGroup) boat.motorGroup.rotation.y = 0;
      } else {
        // Active flood response: navigate dynamic floodwaters
        const waveIntensity = Math.min(1.0, (uWave - boat.uTrigger) / 0.15);
        const patrol = Math.sin(timeSec * 0.75 + boat.phase) * boat.patrolSpan * 0.002;
        const currentU = Math.min(0.96, Math.max(0.05, boat.uCenter + patrol));
        const f = getRiverFrame(currentU);

        // Water level elevation
        const waterHeight = Math.max(terrain.getTerrainHeight(f.pt.x, f.pt.z) + 0.3, f.pt.y + 0.5 + waveIntensity * 1.8);
        const heave = Math.sin(timeSec * 2.8 + boat.phase) * 0.14;
        const roll = Math.cos(timeSec * 2.2 + boat.phase) * 0.10;
        const pitch = Math.sin(timeSec * 1.9 + boat.phase) * 0.08;

        const pos = f.pt.clone().addScaledVector(f.side, boat.sideOffset);
        pos.y = waterHeight + heave;
        boat.group.position.copy(pos);

        boat.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), f.tangent);
        boat.group.rotateZ(roll);
        boat.group.rotateX(pitch);

        // Dynamic tiller & searchlight sweeping
        if (boat.motorGroup) {
          boat.motorGroup.rotation.y = Math.sin(timeSec * 2.2 + boat.phase) * 0.28;
        }
        if (boat.spotlight) {
          boat.spotlight.rotation.y = Math.sin(timeSec * 1.6 + boat.phase) * 0.48;
          boat.spotlight.rotation.x = Math.PI * 0.5 + Math.sin(timeSec * 1.2 + boat.phase) * 0.12;
        }
      }
    }
  }

  // ----------------------------------------------------
  // 8. FLOATING URBAN DEBRIS FLOTILLA (Chemical Drums, Timber Rafts)
  // ----------------------------------------------------
  const floatingFlotilla = [];
  const debrisDefs = [
    { type: 'barrels', u: 0.23, side: 3.5, driftRate: 0.25 },
    { type: 'timber',  u: 0.27, side: -4.0, driftRate: 0.28 },
    { type: 'barrels', u: 0.36, side: 4.2, driftRate: 0.30 },
    { type: 'timber',  u: 0.42, side: -3.8, driftRate: 0.26 },
    { type: 'barrels', u: 0.49, side: -8.5, driftRate: 0.32 },
    { type: 'timber',  u: 0.53, side: 3.0, driftRate: 0.27 },
    { type: 'barrels', u: 0.63, side: -5.0, driftRate: 0.34 },
    { type: 'timber',  u: 0.69, side: 4.5, driftRate: 0.29 },
    { type: 'barrels', u: 0.75, side: -9.0, driftRate: 0.33 },
    { type: 'timber',  u: 0.81, side: 3.2, driftRate: 0.28 }
  ];

  debrisDefs.forEach((dDef, dIdx) => {
    const itemObj = (dDef.type === 'barrels') ? createFloatingBarrelCluster() : createFloatingTimberRaft();
    const f = getRiverFrame(dDef.u);
    const startPos = f.pt.clone().addScaledVector(f.side, dDef.side);
    startPos.y = f.pt.y + 0.4;
    itemObj.group.position.copy(startPos);
    itemObj.group.visible = false;
    group.add(itemObj.group);

    floatingFlotilla.push({
      mesh: itemObj.group,
      uTrigger: dDef.u,
      baseSide: dDef.side,
      driftRate: dDef.driftRate,
      pristinePos: startPos.clone(),
      phase: dIdx * 1.8
    });
  });

  function updateFloatingDebris(uWave) {
    const timeSec = Date.now() * 0.001;
    for (let i = 0; i < floatingFlotilla.length; i++) {
      const item = floatingFlotilla[i];
      if (uWave <= item.uTrigger) {
        item.mesh.visible = false;
        item.mesh.position.copy(item.pristinePos);
      } else {
        item.mesh.visible = true;
        const prog = Math.min(1.0, (uWave - item.uTrigger) / (1.0 - item.uTrigger + 0.001));
        const currU = Math.min(0.98, item.uTrigger + prog * item.driftRate * (1.0 - item.uTrigger) * 2.0);
        const f = getRiverFrame(currU);

        const wander = Math.sin(timeSec * 1.2 + item.phase) * 1.2;
        const heave = Math.sin(timeSec * 3.2 + item.phase) * 0.16;
        const pos = f.pt.clone().addScaledVector(f.side, item.baseSide + wander);
        pos.y = f.pt.y + 0.5 + heave;
        item.mesh.position.copy(pos);

        item.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), f.tangent);
        item.mesh.rotateY(prog * 8.0 + item.phase);
        item.mesh.rotateX(Math.sin(timeSec * 2.5 + item.phase) * 0.2);
        item.mesh.rotateZ(Math.cos(timeSec * 2.0 + item.phase) * 0.15);
      }
    }
  }

  return {
    wipeableItems,
    dynamicWaterItems,
    updateDelhiDynamic: (clampedT, uWave) => {
      updateRescueBoats(clampedT, uWave);
      updateFloatingDebris(uWave);
    }
  };
}
