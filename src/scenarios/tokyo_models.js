import * as THREE from 'three';

/**
 * Procedural 3D Landmarks, Super-Levees, Shinkansen, G-CANS Underground Temple & Skytree
 * for Tokyo, Japan (Arakawa River Deluge & Subterranean Defense Scenario)
 */
export function buildTokyoScene(group, river, terrain) {
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
  const shinkansenWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.3 });
  const shinkansenBlue  = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3, metalness: 0.2 });
  const concreteMat     = new THREE.MeshStandardMaterial({ color: 0xa1a1aa, roughness: 0.75, metalness: 0.1 });
  const darkSteelMat    = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.5, metalness: 0.7 });
  const superLeveeGrass = new THREE.MeshStandardMaterial({ color: 0x365314, roughness: 0.9 });
  const gCansPillarMat  = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.8, metalness: 0.15 }); // Massive smooth concrete
  const metroBlueMat    = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
  const watertightSteel = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4, metalness: 0.8 });
  const skytreeLattice  = new THREE.MeshStandardMaterial({ color: 0xe0e7ff, roughness: 0.3, metalness: 0.6 });
  const jsdfCamoGreen   = new THREE.MeshStandardMaterial({ color: 0x3f4f34, roughness: 0.6 });
  const warningYellow   = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });

  // -------------------------------------------------------------------------
  // 1. ARAKAWA SUPER-LEVEE & HALTED SHINKANSEN BULLET TRAIN (u = 0.15)
  // -------------------------------------------------------------------------
  const fShink = getRiverFrame(0.15);
  const shinkGroup = new THREE.Group();
  shinkGroup.position.copy(fShink.pt);

  // Super-Levee Broad Sloped Embankment
  const leveeWidth = 32.0;
  const levee = new THREE.Mesh(new THREE.BoxGeometry(leveeWidth, 4.0, 48.0), superLeveeGrass);
  levee.position.set(-fShink.side.x * 16.0, 2.0, 0);
  levee.castShadow = true;
  shinkGroup.add(levee);

  // Elevated Concrete High-Speed Rail Viaduct spanning river
  const viaductSpan = 36.0;
  const viaductDeck = new THREE.Mesh(new THREE.BoxGeometry(viaductSpan + 4.0, 1.2, 5.2), concreteMat);
  viaductDeck.rotation.y = Math.atan2(fShink.side.x, fShink.side.z);
  viaductDeck.position.set(0, 8.5, 0);
  viaductDeck.castShadow = true;
  shinkGroup.add(viaductDeck);

  // Concrete Piers
  [-12.0, 0, 12.0].forEach(pOffset => {
    const pier = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 8.0, 12), concreteMat);
    pier.position.set(fShink.side.x * pOffset, 4.0, fShink.side.z * pOffset);
    pier.castShadow = true;
    shinkGroup.add(pier);
  });

  // Catenary Masts
  for (let cm = -16.0; cm <= 16.0; cm += 8.0) {
    const mast = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.5, 5.0), darkSteelMat);
    mast.rotation.y = Math.atan2(fShink.side.x, fShink.side.z);
    mast.position.set(fShink.side.x * cm, 10.5, fShink.side.z * cm);
    shinkGroup.add(mast);
  }

  // Shinkansen N700S Bullet Train (Nose + 2 Coaches halted safely on viaduct)
  const trainCars = [
    { offset: -6.0, isNose: true },
    { offset: 4.0,  isNose: false },
    { offset: 14.0, isNose: false }
  ];

  trainCars.forEach(tc => {
    const car = new THREE.Group();
    // Aerodynamic Streamlined Body
    const carBody = new THREE.Mesh(new THREE.BoxGeometry(7.8, 1.6, 2.2), shinkansenWhite);
    carBody.position.y = 1.0;
    carBody.castShadow = true;
    car.add(carBody);

    // Blue Line Stripe
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(7.82, 0.25, 2.22), shinkansenBlue);
    stripe.position.y = 0.7;
    car.add(stripe);

    if (tc.isNose) {
      // Streamlined Nose Cone
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
  // 2. G-CANS VERTICAL SILO NO. 1 DROP SHAFT (u = 0.32)
  // -------------------------------------------------------------------------
  const fSilo = getRiverFrame(0.32);
  const siloGroup = new THREE.Group();
  siloGroup.position.copy(fSilo.pt);

  // Massive Cylindrical Concrete Drop Shaft (32m scale representation)
  const siloOuter = new THREE.Mesh(new THREE.CylinderGeometry(9.0, 9.0, 10.0, 24, 1, true), concreteMat);
  siloOuter.position.set(-fSilo.side.x * 18.0, -1.0, 0);
  siloGroup.add(siloOuter);

  // Internal Inflow Vortex Swirl Cone
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

  // Yellow Perimeter Safety Railing & Intake Crane
  const siloRail = new THREE.Mesh(new THREE.TorusGeometry(9.2, 0.2, 8, 24), warningYellow);
  siloRail.rotation.x = Math.PI * 0.5;
  siloRail.position.set(-fSilo.side.x * 18.0, 4.2, 0);
  siloGroup.add(siloRail);

  // Trash rack intake weir
  const trashRack = new THREE.Mesh(new THREE.BoxGeometry(6.0, 3.5, 1.2), darkSteelMat);
  trashRack.position.set(-fSilo.side.x * 10.0, 2.0, 0);
  siloGroup.add(trashRack);

  group.add(siloGroup);

  // -------------------------------------------------------------------------
  // 3. G-CANS "UNDERGROUND TEMPLE" (PRESSURE-ADJUSTING TANK) (u = 0.48)
  // -------------------------------------------------------------------------
  const fTemple = getRiverFrame(0.48);
  const templeGroup = new THREE.Group();
  templeGroup.position.copy(fTemple.pt);

  // Subterranean Chamber Enclosure (rendered directly under terrain surface)
  const tankFloor = new THREE.Mesh(new THREE.BoxGeometry(32.0, 1.2, 42.0), concreteMat);
  tankFloor.position.set(fTemple.side.x * 18.0, -6.5, 0);
  templeGroup.add(tankFloor);

  const tankCeiling = new THREE.Mesh(new THREE.BoxGeometry(32.0, 1.2, 42.0), concreteMat);
  tankCeiling.position.set(fTemple.side.x * 18.0, 4.8, 0);
  templeGroup.add(tankCeiling);

  // 10 Monumental Rectangular Concrete Pillars (2 rows of 5 pillars)
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

      // Amber subterranean inspection floodlight on pillar top
      const light = new THREE.PointLight(0xfbbf24, 0.4, 18);
      light.position.set(pillar.position.x, 3.5, pillar.position.z);
      templeGroup.add(light);
    }
  }

  // Churning subterranean water pool inside temple
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
  // 4. TOKYO METRO ENTRANCE & WATERTIGHT FLOODGATES (u = 0.62)
  // -------------------------------------------------------------------------
  const fMetro = getRiverFrame(0.62);
  const metroGroup = new THREE.Group();
  metroGroup.position.copy(fMetro.pt);

  // Sidewalk street block
  const sidewalk = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.8, 14.0), concreteMat);
  sidewalk.position.set(-fMetro.side.x * 16.0, 2.0, 0);
  metroGroup.add(sidewalk);

  // Subway Entrance Kiosk
  const kiosk = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.8, 6.5), darkSteelMat);
  kiosk.position.set(-fMetro.side.x * 16.0, 3.5, 0);
  kiosk.castShadow = true;
  metroGroup.add(kiosk);

  // Tokyo Metro Blue Logo Totem
  const totemPole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.2, 8), darkSteelMat);
  totemPole.position.set(-fMetro.side.x * 13.0, 4.2, -3.8);
  const logoDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.15, 16), metroBlueMat);
  logoDisc.rotation.z = Math.PI * 0.5;
  logoDisc.position.set(-fMetro.side.x * 13.0, 6.0, -3.8);
  metroGroup.add(totemPole);
  metroGroup.add(logoDisc);

  // Heavy Steel Watertight Flood Barrier (deployed across stairs)
  const floodBarrier = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.2, 4.8), watertightSteel);
  floodBarrier.position.set(-fMetro.side.x * 14.2, 3.2, 0);
  metroGroup.add(floodBarrier);

  // Sandbag perimeter bund
  for (let sb = 0; sb < 8; sb++) {
    const bag = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.5), new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 }));
    bag.position.set(-fMetro.side.x * 13.6, 2.4, -2.5 + sb * 0.7);
    metroGroup.add(bag);
  }

  group.add(metroGroup);

  // -------------------------------------------------------------------------
  // 5. SUMIDA RIVER SEAWALL & TOKYO SKYTREE SILHOUETTE (u = 0.76)
  // -------------------------------------------------------------------------
  const fSky = getRiverFrame(0.76);
  const skyGroup = new THREE.Group();
  skyGroup.position.copy(fSky.pt);

  // Reinforced Concrete Flood Seawall
  const seawall = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.5, 42.0), concreteMat);
  seawall.position.set(fSky.side.x * 14.0, 2.2, 0);
  seawall.castShadow = true;
  skyGroup.add(seawall);

  // Heavy Hydraulic Sliding Tidal Surge Gate
  const surgeGate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.5, 8.0), watertightSteel);
  surgeGate.position.set(fSky.side.x * 14.0, 3.2, 0);
  skyGroup.add(surgeGate);

  // Tokyo Skytree Tower (Iconic soaring lattice spire in the eastern backdrop)
  const skytree = new THREE.Group();
  skytree.position.set(fSky.side.x * 45.0, 0, -10.0);

  // Tripod Base tapering upwards
  const baseSpire = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 5.5, 42.0, 6, 1, true), skytreeLattice);
  baseSpire.position.y = 21.0;
  skytree.add(baseSpire);

  // Lower Observation Deck (Tembo Deck)
  const deck1 = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 3.6, 4.0, 16), darkSteelMat);
  deck1.position.y = 42.0;
  skytree.add(deck1);

  // Upper Observation Deck (Tembo Galleria)
  const upperSpire = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 20.0, 6), skytreeLattice);
  upperSpire.position.y = 52.0;
  skytree.add(upperSpire);

  const deck2 = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 2.8, 3.0, 16), darkSteelMat);
  deck2.position.y = 62.0;
  skytree.add(deck2);

  // Top Spire & Antenna Mast
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.8, 18.0, 8), darkSteelMat);
  antenna.position.y = 72.0;
  skytree.add(antenna);

  // Flashing Red Aircraft Obstruction Beacon
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
  beacon.position.y = 81.0;
  skytree.add(beacon);

  skyGroup.add(skytree);
  group.add(skyGroup);

  // -------------------------------------------------------------------------
  // 6. EDO RIVER JET TURBINE PUMP STATION & JSDF AMPHIBIOUS FLEET (u = 0.92)
  // -------------------------------------------------------------------------
  const fEdo = getRiverFrame(0.92);
  const edoGroup = new THREE.Group();
  edoGroup.position.copy(fEdo.pt);

  // G-CANS Jet Turbine Pumping Station House
  const pumpHouse = new THREE.Mesh(new THREE.BoxGeometry(18.0, 8.0, 24.0), concreteMat);
  pumpHouse.position.set(-fEdo.side.x * 18.0, 4.0, 0);
  pumpHouse.castShadow = true;
  edoGroup.add(pumpHouse);

  // 4 Aircraft Gas Turbine Exhaust Stacks
  for (let es = 0; es < 4; es++) {
    const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 5.0, 12), darkSteelMat);
    stack.position.set(-fEdo.side.x * 18.0 + (es - 1.5) * 3.5, 10.5, 0);
    edoGroup.add(stack);
  }

  // High-volume discharge sluice flume into Edo River
  const flume = new THREE.Mesh(new THREE.BoxGeometry(8.0, 3.0, 12.0), concreteMat);
  flume.position.set(-fEdo.side.x * 10.0, 1.5, 0);
  edoGroup.add(flume);

  // JSDF Type 94 Amphibious Rescue Craft Operating in River
  for (let a = 0; a < 2; a++) {
    const craft = new THREE.Group();
    // Hull
    const hull = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 5.5), jsdfCamoGreen);
    hull.position.y = 0.5;
    craft.add(hull);

    // Cab
    const cab = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.9, 2.0), jsdfCamoGreen);
    cab.position.set(0, 1.3, -1.0);
    craft.add(cab);

    craft.position.set(fEdo.side.x * (4.0 + a * 6.0), 0.8, -8.0 + a * 14.0);
    craft.rotation.y = (a === 0) ? -0.4 : 0.6;
    edoGroup.add(craft);
  }

  group.add(edoGroup);

  return {
    wipeableItems,
    dynamicWaterItems
  };
}
