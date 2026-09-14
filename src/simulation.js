import * as THREE from 'three';
import { WAYPOINTS, getScenario } from './data.js';
import { buildDelhiScene } from './scenarios/delhi_models.js';
import { buildNewYorkScene } from './scenarios/newyork_models.js';
import { buildBeijingScene } from './scenarios/beijing_models.js';
import { buildTokyoScene } from './scenarios/tokyo_models.js';
import { buildLondonScene } from './scenarios/london_models.js';

export class FloodSimulation {
  constructor(scene, riverSystem, terrainSystem, scenarioId = null) {
    this.scene = scene;
    this.river = riverSystem;
    this.terrain = terrainSystem;
    this.scenarioId = scenarioId || getScenario().config.id;

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.uWave = 0;

    if (this.scenarioId === 'delhi') {
      this.initDelhiSimulation();
    } else if (this.scenarioId === 'newyork') {
      this.initNewYorkSimulation();
    } else if (this.scenarioId === 'beijing') {
      this.initBeijingSimulation();
    } else if (this.scenarioId === 'tokyo') {
      this.initTokyoSimulation();
    } else if (this.scenarioId === 'london') {
      this.initLondonSimulation();
    } else {
      this.initCollapse();
      this.initFloodFront();
      this.initHighwaySystem();
      this.initStructuresAndVehicles();
      this.initLandmarkBadges();
      this.initWaypointMarker();
      this.initAtmosphere();
      this.initRealisticClouds();
    }
  }

  initDelhiSimulation() {
    this.wipeableItems = [];
    this.bridges = [];

    // Realistic 3D hydrodynamic flood wave front
    this.initFloodFront();
    this.initWaypointMarker();
    this.initAtmosphere();

    // Hathnikund Barrage sluice blowout & guide bund collapse genesis event
    this.initDelhiGenesis();

    // Procedural Delhi landmarks, bridges, vehicles, and countermeasures
    const { wipeableItems, updateDelhiDynamic } = buildDelhiScene(this.group, this.river, this.terrain);
    this.wipeableItems = wipeableItems;
    this.delhiUpdateDynamic = updateDelhiDynamic;

    // Delhi landmark badges
    this.initDelhiLandmarkBadges();
  }

  initDelhiLandmarkBadges() {
    this.landmarkBadges = [];
    const landmarks = [
      { name: "Wazirabad Barrage", sub: "Water Works Submerged", u: 0.20, offset: new THREE.Vector3(0, 18, 0) },
      { name: "Old Iron Bridge", sub: "Loha Pul (1866) • 208.08m", u: 0.35, offset: new THREE.Vector3(0, 20, 0) },
      { name: "Kashmere Gate", sub: "Ring Road Submerged", u: 0.48, offset: new THREE.Vector3(-14, 18, 0) },
      { name: "Red Fort (Lal Qila)", sub: "Historic 208.66m Record Peak", u: 0.60, offset: new THREE.Vector3(-22, 22, 0) },
      { name: "ITO Barrage", sub: "Regulator 12 Breach & Bund", u: 0.74, offset: new THREE.Vector3(-14, 18, 0) },
      { name: "Rajghat & Relief Camp", sub: "1,000 HP Dewatering Fleet", u: 0.88, offset: new THREE.Vector3(-14, 18, 0) }
    ];

    for (const lm of landmarks) {
      this.addPlaceBoard(lm.name, lm.sub, lm.u, lm.offset);
    }
  }

  initNewYorkSimulation() {
    this.wipeableItems = [];
    this.bridges = [];

    // Realistic 3D hydrodynamic flood wave front
    this.initFloodFront();
    this.initWaypointMarker();
    this.initAtmosphere();

    // Atlantic outer seawall breach & harbor breaker genesis event
    this.initNewYorkGenesis();

    // Procedural New York landmarks, bridges, skyscrapers, and countermeasures
    const { wipeableItems, arcLight, arcMesh, updateTubes, updateFloatingItems, updateBridgeTraffic, updateFerryTerminalVessels } = buildNewYorkScene(this.group, this.river, this.terrain);
    this.wipeableItems = wipeableItems;
    this.nyArcLight = arcLight;
    this.nyArcMesh = arcMesh;
    this.nyUpdateTubes = updateTubes;
    this.nyUpdateFloating = updateFloatingItems;
    this.nyUpdateBridgeTraffic = updateBridgeTraffic;
    this.nyUpdateFerryVessels = updateFerryTerminalVessels;

    // New York landmark badges
    this.initNewYorkLandmarkBadges();
  }

  initNewYorkLandmarkBadges() {
    this.landmarkBadges = [];
    const landmarks = [
      { name: "Verrazzano Narrows", sub: "Morning Surge Funnel • 4.8m", u: 0.10, offset: new THREE.Vector3(0, 26, 0) },
      { name: "Statue of Liberty", sub: "Liberty Island • Fort Wood 1886", u: 0.32, offset: new THREE.Vector3(6.5, 32, -11.3) },
      { name: "Wall St Financial District", sub: "14.9 ft Surge Peak • Seawall Breached", u: 0.49, offset: new THREE.Vector3(-26, 38, 8) },
      { name: "South Ferry & Battery Park", sub: "7 Under-River Tubes Inundated", u: 0.52, offset: new THREE.Vector3(-14, 26, -8) },
      { name: "FDR Drive & ESCR", sub: "16.5-ft Roller Floodgates", u: 0.63, offset: new THREE.Vector3(-20, 24, 14) },
      { name: "Brooklyn Bridge", sub: "DUMBO Waterfront Submerged", u: 0.74, offset: new THREE.Vector3(0, 36, 0) },
      { name: "ConEd 14th St Substation", sub: "345 kV Arc Blast • Blackout", u: 0.86, offset: new THREE.Vector3(-15, 30, 20) },
      { name: "USACE Unwatering Armada", sub: "380k GPM Tunnel Dewatering", u: 0.94, offset: new THREE.Vector3(-12, 22, 0) }
    ];

    for (const lm of landmarks) {
      this.addPlaceBoard(lm.name, lm.sub, lm.u, lm.offset);
    }
  }

  initBeijingSimulation() {
    this.wipeableItems = [];
    this.bridges = [];

    // Realistic 3D hydrodynamic flood wave front
    this.initFloodFront();
    this.initWaypointMarker();
    this.initAtmosphere();

    // Taihang mountain bedrock landslide & gorge mudslide genesis event
    this.initBeijingGenesis();

    // Procedural Beijing landmarks, bridges, K396 train, and countermeasures
    const { wipeableItems, animatedRotors } = buildBeijingScene(this.group, this.river, this.terrain);
    this.wipeableItems = wipeableItems;
    this.bjRotors = animatedRotors || [];

    // Beijing landmark badges
    this.initBeijingLandmarkBadges();
  }

  initBeijingLandmarkBadges() {
    this.landmarkBadges = [];
    const landmarks = [
      { name: "Miaofengshan Headwaters", sub: "1,029mm Cloudburst Peak", u: 0.05, offset: new THREE.Vector3(0, 20, 0) },
      { name: "Luopoling Mountain Pass", sub: "K396 Train Stranded • Mudslide", u: 0.20, offset: new THREE.Vector3(-14, 18, 0) },
      { name: "National Highway G109", sub: "1,050 km Mountain Roads Cut", u: 0.35, offset: new THREE.Vector3(14, 18, 0) },
      { name: "Sanjiadian Dam Sluice", sub: "4,649 m³/s Gorge Throttle", u: 0.48, offset: new THREE.Vector3(0, 20, 0) },
      { name: "Lugouqiao (Marco Polo)", sub: "1189 AD Bridge & Sluice Opened", u: 0.60, offset: new THREE.Vector3(-14, 18, 0) },
      { name: "PLA Air-Bridge Task Force", sub: "Z-20 Airborne Relief Drops", u: 0.74, offset: new THREE.Vector3(-16, 22, 0) },
      { name: "Yongding Retention Basin", sub: "180M m³ Sponge City Storage", u: 0.88, offset: new THREE.Vector3(-14, 18, 0) }
    ];

    for (const lm of landmarks) {
      this.addPlaceBoard(lm.name, lm.sub, lm.u, lm.offset);
    }
  }

  initTokyoSimulation() {
    this.wipeableItems = [];
    this.bridges = [];

    // Realistic 3D hydrodynamic flood wave front
    this.initFloodFront();
    this.initWaypointMarker();
    this.initAtmosphere();

    // Saitama upstream levee blowout & revetment shear genesis event
    this.initTokyoGenesis();

    // Procedural Tokyo landmarks, G-CANS Underground Temple, bullet trains, and countermeasures
    const { wipeableItems } = buildTokyoScene(this.group, this.river, this.terrain);
    this.wipeableItems = wipeableItems;

    // Tokyo landmark badges
    this.initTokyoLandmarkBadges();
  }

  initTokyoLandmarkBadges() {
    this.landmarkBadges = [];
    const landmarks = [
      { name: "Upper Arakawa Catchment", sub: "Typhoon Spiral Rainband • 650mm", u: 0.05, offset: new THREE.Vector3(0, 20, 0) },
      { name: "Arakawa Super-Levee", sub: "Shinkansen Halted • 7,200 m³/s", u: 0.20, offset: new THREE.Vector3(-14, 18, 0) },
      { name: "G-CANS Silo No. 1", sub: "65m Vertical Drop Shaft • 200 m³/s", u: 0.35, offset: new THREE.Vector3(14, 18, 0) },
      { name: "G-CANS Underground Temple", sub: "59 Concrete Pillars • Jet Turbines", u: 0.48, offset: new THREE.Vector3(-14, 18, 0) },
      { name: "Tokyo Metro Portals", sub: "180 Watertight Rolling Gates", u: 0.60, offset: new THREE.Vector3(-12, 18, 0) },
      { name: "Sumida River & Skytree", sub: "Koto Zero-Meter Tidal Defense", u: 0.74, offset: new THREE.Vector3(16, 22, 0) },
      { name: "JSDF & Edo River Station", sub: "Amphibious Fleet • 14.5M m³ Flushed", u: 0.88, offset: new THREE.Vector3(-14, 18, 0) }
    ];

    for (const lm of landmarks) {
      this.addPlaceBoard(lm.name, lm.sub, lm.u, lm.offset);
    }
  }

  initLondonSimulation() {
    this.wipeableItems = [];
    this.bridges = [];

    // Realistic 3D hydrodynamic flood wave front
    this.initFloodFront();
    this.initWaypointMarker();
    this.initAtmosphere();

    // Outer Thames estuary sea defense wall breach genesis event
    this.initLondonGenesis();

    // Procedural London landmarks, Thames Barrier, Tube flood doors, and Tower Bridge
    const { wipeableItems, sectorGates } = buildLondonScene(this.group, this.river, this.terrain);
    this.wipeableItems = wipeableItems;
    this.londonSectorGates = sectorGates || [];

    // London landmark badges
    this.initLondonLandmarkBadges();
  }

  initLondonLandmarkBadges() {
    this.landmarkBadges = [];
    const landmarks = [
      { name: "Thames Estuary", sub: "North Sea Surge Funnel • +5.2m", u: 0.05, offset: new THREE.Vector3(0, 20, 0) },
      { name: "Woolwich Reach", sub: "PLA Navigation Halted • Sirens", u: 0.20, offset: new THREE.Vector3(-14, 18, 0) },
      { name: "The Thames Barrier", sub: "10 Rising Sector Gates Locked", u: 0.35, offset: new THREE.Vector3(0, 20, 0) },
      { name: "Canary Wharf & Docks", sub: "£320B Financial Assets Shielded", u: 0.48, offset: new THREE.Vector3(-16, 22, 0) },
      { name: "Under-River Tube Portals", sub: "16 Hydraulic Flood Doors Sealed", u: 0.60, offset: new THREE.Vector3(-12, 18, 0) },
      { name: "Tower Bridge & Heritage", sub: "Embankment Walls Deflect Swell", u: 0.74, offset: new THREE.Vector3(0, 20, 0) },
      { name: "Victoria Embankment", sub: "Parliament & Whitehall Safe", u: 0.88, offset: new THREE.Vector3(-14, 18, 0) }
    ];

    for (const lm of landmarks) {
      this.addPlaceBoard(lm.name, lm.sub, lm.u, lm.offset);
    }
  }

  /* ----------------------------------------------------
   * SCENARIO GENESIS FAILURE & BREACH EVENTS (t ∈ [0.0, 0.18])
   * ---------------------------------------------------- */
  initDelhiGenesis() {
    this.delhiGenesisGroup = new THREE.Group();
    this.group.add(this.delhiGenesisGroup);

    const f0 = {
      pt: this.river.getPointAt(0.02),
      tangent: this.river.getTangentAt(0.02)
    };
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(f0.tangent, up).normalize();

    const pierMat = new THREE.MeshStandardMaterial({ color: 0x8a9299, roughness: 0.85 });
    const gateMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5, metalness: 0.4 });
    const bundMat = new THREE.MeshStandardMaterial({ color: 0x6b4f3b, roughness: 0.95 });

    // Hathnikund Barrage concrete piers
    this.delhiPiers = [];
    [-10.0, 0.0, 10.0].forEach((offset) => {
      const pGeo = new THREE.BoxGeometry(3.5, 9.0, 7.0);
      const pier = new THREE.Mesh(pGeo, pierMat);
      pier.position.copy(f0.pt).addScaledVector(side, offset);
      pier.position.y += 3.5;
      pier.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), f0.tangent);
      this.delhiGenesisGroup.add(pier);
      this.delhiPiers.push(pier);
    });

    // Radial Sluice Gates (under extreme hydrostatic head)
    this.delhiGates = [];
    [-5.0, 5.0].forEach((offset) => {
      const gGeo = new THREE.BoxGeometry(6.5, 5.5, 1.2);
      const gate = new THREE.Mesh(gGeo, gateMat);
      gate.position.copy(f0.pt).addScaledVector(side, offset);
      gate.position.y += 3.0;
      gate.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), f0.tangent);
      this.delhiGenesisGroup.add(gate);
      this.delhiGates.push({
        mesh: gate,
        initialPos: gate.position.clone(),
        initialRot: gate.rotation.clone()
      });
    });

    // Earthen Guide Bund (right embankment)
    const bundGeo = new THREE.BoxGeometry(16.0, 7.5, 18.0);
    const bund = new THREE.Mesh(bundGeo, bundMat);
    bund.position.copy(f0.pt).addScaledVector(side, 18.0);
    bund.position.y += 2.8;
    bund.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), f0.tangent);
    this.delhiGenesisGroup.add(bund);
    this.delhiBund = {
      mesh: bund,
      initialPos: bund.position.clone(),
      initialRot: bund.rotation.clone()
    };

    // Concrete & riprap rupture shards
    this.delhiShards = [];
    const shardGeo = new THREE.DodecahedronGeometry(1.2, 0);
    for (let i = 0; i < 14; i++) {
      const sMesh = new THREE.Mesh(shardGeo, pierMat);
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 16.0,
        Math.random() * 4.0,
        (Math.random() - 0.5) * 10.0
      );
      sMesh.position.copy(f0.pt).add(offset);
      sMesh.visible = false;
      this.delhiGenesisGroup.add(sMesh);
      this.delhiShards.push({
        mesh: sMesh,
        basePos: sMesh.position.clone(),
        rotVel: new THREE.Vector3(Math.random() * 6 - 3, Math.random() * 6 - 3, Math.random() * 6 - 3)
      });
    }

    // Hydraulic eruption spray cloud
    const splashGeo = new THREE.SphereGeometry(1, 24, 18);
    const splashMat = new THREE.MeshBasicMaterial({
      color: 0xdde7ee,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    });
    this.delhiSplash = new THREE.Mesh(splashGeo, splashMat);
    this.delhiSplash.position.copy(f0.pt).addScaledVector(f0.tangent, 4.0);
    this.delhiSplash.position.y += 1.5;
    this.delhiGenesisGroup.add(this.delhiSplash);
  }

  updateDelhiGenesis(clampedT) {
    if (!this.delhiGenesisGroup) return;

    if (clampedT < 0.03) {
      for (const g of this.delhiGates) {
        g.mesh.position.copy(g.initialPos);
        g.mesh.rotation.copy(g.initialRot);
      }
      this.delhiBund.mesh.position.copy(this.delhiBund.initialPos);
      this.delhiBund.mesh.rotation.copy(this.delhiBund.initialRot);
      for (const s of this.delhiShards) s.mesh.visible = false;
      this.delhiSplash.material.opacity = 0.0;
    } else if (clampedT <= 0.16) {
      const pAlpha = (clampedT - 0.03) / 0.13;
      const smoothP = Math.sin(pAlpha * Math.PI * 0.5);

      for (let i = 0; i < this.delhiGates.length; i++) {
        const g = this.delhiGates[i];
        g.mesh.rotation.x = g.initialRot.x + smoothP * (0.85 + i * 0.2);
        g.mesh.rotation.z = g.initialRot.z + smoothP * (i === 0 ? 0.35 : -0.35);
        g.mesh.position.y = g.initialPos.y - smoothP * 2.8;
      }

      this.delhiBund.mesh.rotation.z = this.delhiBund.initialRot.z - smoothP * 0.45;
      this.delhiBund.mesh.position.y = this.delhiBund.initialPos.y - smoothP * 3.2;

      for (const s of this.delhiShards) {
        s.mesh.visible = true;
        s.mesh.position.set(
          s.basePos.x + Math.sin(pAlpha * 5.0) * 4.0,
          s.basePos.y - smoothP * 2.0,
          s.basePos.z + pAlpha * 22.0
        );
        s.mesh.rotation.x += s.rotVel.x * 0.02;
        s.mesh.rotation.y += s.rotVel.y * 0.02;
      }

      if (clampedT >= 0.08) {
        const sAlpha = (clampedT - 0.08) / 0.08;
        const radius = 2.0 + sAlpha * 20.0;
        this.delhiSplash.scale.set(radius, radius * 0.75, radius);
        this.delhiSplash.material.opacity = Math.max(0, 0.85 * (1.0 - sAlpha * 0.8));
      } else {
        this.delhiSplash.material.opacity = 0.0;
      }
    } else {
      this.delhiSplash.material.opacity = 0.0;
      for (const s of this.delhiShards) s.mesh.visible = false;
    }
  }

  initNewYorkGenesis() {
    this.nyGenesisGroup = new THREE.Group();
    this.group.add(this.nyGenesisGroup);

    const f0 = {
      pt: this.river.getPointAt(0.02),
      tangent: this.river.getTangentAt(0.02)
    };
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(f0.tangent, up).normalize();

    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    const deflectorMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 });

    // Static Granite Shoreline Breakwater Armor (solid coastal revetment, no involuntary block launching)
    this.nySeawallBlocks = [];
    [-14.0, -7.0, 7.0, 14.0].forEach((offset) => {
      const bGeo = new THREE.BoxGeometry(6.5, 4.5, 5.0);
      const bMesh = new THREE.Mesh(bGeo, stoneMat);
      bMesh.position.copy(f0.pt).addScaledVector(side, offset);
      bMesh.position.y += 2.2;
      bMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), f0.tangent);
      this.nyGenesisGroup.add(bMesh);

      const cGeo = new THREE.BoxGeometry(6.6, 1.2, 2.0);
      const cMesh = new THREE.Mesh(cGeo, deflectorMat);
      cMesh.position.y = 2.4;
      bMesh.add(cMesh);

      this.nySeawallBlocks.push({
        mesh: bMesh,
        initialPos: bMesh.position.clone(),
        initialRot: bMesh.rotation.clone()
      });
    });
  }

  updateNewYorkGenesis(clampedT) {
    // Involuntary block launching eliminated: seawall armor blocks remain rock-solid on the shore
    if (!this.nyGenesisGroup) return;
  }

  initBeijingGenesis() {
    this.bjGenesisGroup = new THREE.Group();
    this.group.add(this.bjGenesisGroup);

    this.bjPeakPos = new THREE.Vector3(-85, 52, -78);
    const riverPt = this.river.getPointAt(0.03);
    this.bjRiverHitPos = new THREE.Vector3(riverPt.x, riverPt.y + 1.0, riverPt.z);

    const massGeo = new THREE.DodecahedronGeometry(7.8, 1);
    const massMat = new THREE.MeshStandardMaterial({
      color: 0x5a483a,
      roughness: 0.9,
      flatShading: true
    });
    this.bjCollapseMass = new THREE.Mesh(massGeo, massMat);
    this.bjGenesisGroup.add(this.bjCollapseMass);

    const scarGeo = new THREE.CircleGeometry(13.0, 24);
    const scarMat = new THREE.MeshBasicMaterial({
      color: 0x221a14,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.bjScarMesh = new THREE.Mesh(scarGeo, scarMat);
    this.bjScarMesh.position.copy(this.bjPeakPos).add(new THREE.Vector3(2, -3, 3));
    this.bjScarMesh.rotation.set(-0.6, 0.35, 0.15);
    this.bjGenesisGroup.add(this.bjScarMesh);

    this.bjShards = [];
    const shardGeo = new THREE.DodecahedronGeometry(1.7, 0);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x483a2d,
      roughness: 0.95,
      flatShading: true
    });
    for (let i = 0; i < 14; i++) {
      const sh = new THREE.Mesh(shardGeo, shardMat);
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 12.0,
        (Math.random() - 0.5) * 8.0,
        (Math.random() - 0.5) * 12.0
      );
      this.bjGenesisGroup.add(sh);
      this.bjShards.push({
        mesh: sh,
        offset,
        rotSpeed: new THREE.Vector3(Math.random() * 8 - 4, Math.random() * 8 - 4, Math.random() * 8 - 4)
      });
    }

    const mudGeo = new THREE.SphereGeometry(1, 24, 20);
    const mudMat = new THREE.MeshBasicMaterial({
      color: 0x9a7b56,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    });
    this.bjMudCloud = new THREE.Mesh(mudGeo, mudMat);
    this.bjMudCloud.position.copy(this.bjRiverHitPos);
    this.bjGenesisGroup.add(this.bjMudCloud);
  }

  updateBeijingGenesis(clampedT) {
    if (!this.bjGenesisGroup) return;

    if (clampedT < 0.04) {
      this.bjCollapseMass.visible = true;
      this.bjCollapseMass.position.copy(this.bjPeakPos);
      this.bjCollapseMass.rotation.set(0, 0, 0);
      this.bjScarMesh.material.opacity = 0.0;
      this.bjMudCloud.material.opacity = 0.0;
      for (const s of this.bjShards) s.mesh.visible = false;
    } else if (clampedT <= 0.18) {
      const alpha = (clampedT - 0.04) / 0.13;
      const pAlpha = Math.min(1.0, Math.max(0, alpha));

      const curPos = new THREE.Vector3().lerpVectors(this.bjPeakPos, this.bjRiverHitPos, pAlpha);
      curPos.y += Math.sin(pAlpha * Math.PI) * 14.0;
      this.bjCollapseMass.position.copy(curPos);
      this.bjCollapseMass.rotation.x += 0.04;
      this.bjCollapseMass.rotation.y += 0.05;

      for (const s of this.bjShards) {
        s.mesh.visible = true;
        s.mesh.position.copy(curPos).addScaledVector(s.offset, pAlpha * 2.2);
        s.mesh.rotation.x += s.rotSpeed.x * 0.016;
        s.mesh.rotation.y += s.rotSpeed.y * 0.016;
      }

      this.bjScarMesh.material.opacity = Math.min(0.85, (clampedT - 0.04) / 0.08);

      if (clampedT >= 0.13) {
        const cAlpha = (clampedT - 0.13) / 0.05;
        const radius = 2.0 + cAlpha * 22.0;
        this.bjMudCloud.scale.set(radius, radius * 0.7, radius);
        this.bjMudCloud.material.opacity = Math.max(0, 0.85 * (1.0 - cAlpha * 0.7));
      } else {
        this.bjMudCloud.material.opacity = 0.0;
      }
    } else {
      this.bjCollapseMass.visible = false;
      this.bjScarMesh.material.opacity = 0.85;
      for (const s of this.bjShards) s.mesh.visible = false;
      this.bjMudCloud.material.opacity = 0.0;
    }
  }

  initTokyoGenesis() {
    this.tokyoGenesisGroup = new THREE.Group();
    this.group.add(this.tokyoGenesisGroup);

    const f0 = {
      pt: this.river.getPointAt(0.03),
      tangent: this.river.getTangentAt(0.03)
    };
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(f0.tangent, up).normalize();

    const leveeMat = new THREE.MeshStandardMaterial({ color: 0x4a5d3f, roughness: 0.95 });
    const slabMat = new THREE.MeshStandardMaterial({ color: 0x82929e, roughness: 0.8 });

    const leveeGeo = new THREE.BoxGeometry(18.0, 7.5, 20.0);
    const levee = new THREE.Mesh(leveeGeo, leveeMat);
    levee.position.copy(f0.pt).addScaledVector(side, 14.0);
    levee.position.y += 2.8;
    levee.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), f0.tangent);
    this.tokyoGenesisGroup.add(levee);
    this.tokyoLevee = {
      mesh: levee,
      initialPos: levee.position.clone(),
      initialRot: levee.rotation.clone()
    };

    this.tokyoSlabs = [];
    [-6.0, 0.0, 6.0].forEach((offset) => {
      const sGeo = new THREE.BoxGeometry(5.5, 6.0, 1.0);
      const slab = new THREE.Mesh(sGeo, slabMat);
      slab.position.copy(f0.pt).addScaledVector(side, 6.0);
      slab.position.y += 2.5;
      slab.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), f0.tangent);
      slab.position.addScaledVector(f0.tangent, offset);
      this.tokyoGenesisGroup.add(slab);
      this.tokyoSlabs.push({
        mesh: slab,
        initialPos: slab.position.clone(),
        initialRot: slab.rotation.clone()
      });
    });

    this.tokyoShards = [];
    const shardGeo = new THREE.BoxGeometry(1.8, 0.5, 1.8);
    for (let i = 0; i < 12; i++) {
      const sh = new THREE.Mesh(shardGeo, slabMat);
      sh.position.copy(f0.pt).add(new THREE.Vector3(
        (Math.random() - 0.5) * 12.0,
        Math.random() * 3.0,
        (Math.random() - 0.5) * 8.0
      ));
      sh.visible = false;
      this.tokyoGenesisGroup.add(sh);
      this.tokyoShards.push({
        mesh: sh,
        basePos: sh.position.clone(),
        rotVel: new THREE.Vector3(Math.random() * 6 - 3, Math.random() * 6 - 3, Math.random() * 6 - 3)
      });
    }

    const sprayGeo = new THREE.SphereGeometry(1, 24, 18);
    const sprayMat = new THREE.MeshBasicMaterial({
      color: 0xddeef8,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    });
    this.tokyoBreachSpray = new THREE.Mesh(sprayGeo, sprayMat);
    this.tokyoBreachSpray.position.copy(f0.pt).addScaledVector(side, 8.0);
    this.tokyoBreachSpray.position.y += 2.0;
    this.tokyoGenesisGroup.add(this.tokyoBreachSpray);
  }

  updateTokyoGenesis(clampedT) {
    if (!this.tokyoGenesisGroup) return;

    if (clampedT < 0.03) {
      this.tokyoLevee.mesh.position.copy(this.tokyoLevee.initialPos);
      this.tokyoLevee.mesh.rotation.copy(this.tokyoLevee.initialRot);
      for (const s of this.tokyoSlabs) {
        s.mesh.position.copy(s.initialPos);
        s.mesh.rotation.copy(s.initialRot);
      }
      for (const sh of this.tokyoShards) sh.mesh.visible = false;
      this.tokyoBreachSpray.material.opacity = 0.0;
    } else if (clampedT <= 0.16) {
      const pAlpha = (clampedT - 0.03) / 0.13;
      const smoothP = Math.sin(pAlpha * Math.PI * 0.5);

      this.tokyoLevee.mesh.rotation.z = this.tokyoLevee.initialRot.z - smoothP * 0.45;
      this.tokyoLevee.mesh.position.y = this.tokyoLevee.initialPos.y - smoothP * 3.0;

      for (let i = 0; i < this.tokyoSlabs.length; i++) {
        const sl = this.tokyoSlabs[i];
        sl.mesh.rotation.z = sl.initialRot.z - smoothP * (0.6 + i * 0.15);
        sl.mesh.position.y = sl.initialPos.y - smoothP * 3.2;
      }

      for (const sh of this.tokyoShards) {
        sh.mesh.visible = true;
        sh.mesh.position.set(
          sh.basePos.x - smoothP * 4.0,
          sh.basePos.y - smoothP * 2.0,
          sh.basePos.z + pAlpha * 18.0
        );
        sh.mesh.rotation.x += sh.rotVel.x * 0.02;
      }

      if (clampedT >= 0.08) {
        const sAlpha = (clampedT - 0.08) / 0.08;
        const rad = 2.0 + sAlpha * 20.0;
        this.tokyoBreachSpray.scale.set(rad, rad * 0.75, rad);
        this.tokyoBreachSpray.material.opacity = Math.max(0, 0.88 * (1.0 - sAlpha * 0.75));
      } else {
        this.tokyoBreachSpray.material.opacity = 0.0;
      }
    } else {
      this.tokyoBreachSpray.material.opacity = 0.0;
      for (const sh of this.tokyoShards) sh.mesh.visible = false;
    }
  }

  initLondonGenesis() {
    this.londonGenesisGroup = new THREE.Group();
    this.group.add(this.londonGenesisGroup);

    const f0 = {
      pt: this.river.getPointAt(0.02),
      tangent: this.river.getTangentAt(0.02)
    };
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(f0.tangent, up).normalize();

    const seawallMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.6 });

    this.londonSeawallBlocks = [];
    [-10.0, -3.0, 3.0, 10.0].forEach((offset, idx) => {
      const wGeo = new THREE.BoxGeometry(6.5, 8.5, 4.5);
      const wall = new THREE.Mesh(wGeo, seawallMat);
      wall.position.copy(f0.pt).addScaledVector(side, offset);
      wall.position.y += 3.8;
      wall.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), f0.tangent);
      this.londonGenesisGroup.add(wall);
      this.londonSeawallBlocks.push({
        mesh: wall,
        initialPos: wall.position.clone(),
        initialRot: wall.rotation.clone(),
        isCenter: idx === 1 || idx === 2
      });
    });

    const flapGeo = new THREE.BoxGeometry(6.0, 5.0, 0.8);
    const flap = new THREE.Mesh(flapGeo, steelMat);
    flap.position.copy(f0.pt).addScaledVector(side, 0);
    flap.position.y += 3.0;
    flap.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), f0.tangent);
    this.londonGenesisGroup.add(flap);
    this.londonFlap = {
      mesh: flap,
      initialPos: flap.position.clone(),
      initialRot: flap.rotation.clone()
    };

    this.londonShards = [];
    const shardGeo = new THREE.DodecahedronGeometry(1.3, 0);
    for (let i = 0; i < 12; i++) {
      const sh = new THREE.Mesh(shardGeo, seawallMat);
      sh.position.copy(f0.pt).add(new THREE.Vector3(
        (Math.random() - 0.5) * 14.0,
        Math.random() * 3.5,
        (Math.random() - 0.5) * 8.0
      ));
      sh.visible = false;
      this.londonGenesisGroup.add(sh);
      this.londonShards.push({
        mesh: sh,
        basePos: sh.position.clone(),
        rotVel: new THREE.Vector3(Math.random() * 6 - 3, Math.random() * 6 - 3, Math.random() * 6 - 3)
      });
    }

    const geyserGeo = new THREE.SphereGeometry(1, 24, 18);
    const geyserMat = new THREE.MeshBasicMaterial({
      color: 0xecfdf5,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    });
    this.londonSurgeGeyser = new THREE.Mesh(geyserGeo, geyserMat);
    this.londonSurgeGeyser.position.copy(f0.pt).addScaledVector(f0.tangent, 3.0);
    this.londonSurgeGeyser.position.y += 2.0;
    this.londonGenesisGroup.add(this.londonSurgeGeyser);
  }

  updateLondonGenesis(clampedT) {
    if (!this.londonGenesisGroup) return;

    if (clampedT < 0.03) {
      for (const w of this.londonSeawallBlocks) {
        w.mesh.position.copy(w.initialPos);
        w.mesh.rotation.copy(w.initialRot);
      }
      this.londonFlap.mesh.position.copy(this.londonFlap.initialPos);
      this.londonFlap.mesh.rotation.copy(this.londonFlap.initialRot);
      for (const sh of this.londonShards) sh.mesh.visible = false;
      this.londonSurgeGeyser.material.opacity = 0.0;
    } else if (clampedT <= 0.16) {
      const pAlpha = (clampedT - 0.03) / 0.13;
      const smoothP = Math.sin(pAlpha * Math.PI * 0.5);

      for (const w of this.londonSeawallBlocks) {
        if (w.isCenter) {
          w.mesh.rotation.x = w.initialRot.x - smoothP * 0.8;
          w.mesh.position.y = w.initialPos.y - smoothP * 3.5;
          w.mesh.position.addScaledVector(this.river.getTangentAt(0.02), smoothP * 4.5);
        }
      }

      this.londonFlap.mesh.rotation.x = this.londonFlap.initialRot.x + smoothP * 1.2;
      this.londonFlap.mesh.rotation.z = this.londonFlap.initialRot.z + smoothP * 0.4;
      this.londonFlap.mesh.position.y = this.londonFlap.initialPos.y - smoothP * 3.8;

      for (const sh of this.londonShards) {
        sh.mesh.visible = true;
        sh.mesh.position.set(
          sh.basePos.x + Math.sin(pAlpha * 4.0) * 3.0,
          sh.basePos.y - smoothP * 1.5,
          sh.basePos.z + pAlpha * 20.0
        );
        sh.mesh.rotation.x += sh.rotVel.x * 0.02;
      }

      if (clampedT >= 0.08) {
        const gAlpha = (clampedT - 0.08) / 0.08;
        const rad = 2.0 + gAlpha * 22.0;
        this.londonSurgeGeyser.scale.set(rad, rad * 0.8, rad);
        this.londonSurgeGeyser.material.opacity = Math.max(0, 0.88 * (1.0 - gAlpha * 0.75));
      } else {
        this.londonSurgeGeyser.material.opacity = 0.0;
      }
    } else {
      this.londonSurgeGeyser.material.opacity = 0.0;
      for (const sh of this.londonShards) sh.mesh.visible = false;
    }
  }

  /* ----------------------------------------------------
   * 1. AVALANCHE COLLAPSE MASS & IMPACT BLOOM (BALL)
   * ---------------------------------------------------- */
  initCollapse() {
    this.peakPos = new THREE.Vector3(-100, 64, -94);
    const riverHit = this.river.getPointAt(0.025);
    this.riverHitPos = new THREE.Vector3(riverHit.x, riverHit.y + 0.8, riverHit.z);

    // Main rock-ice collapse ball: faceted Dodecahedron sphere (r=7.5)
    const massGeo = new THREE.DodecahedronGeometry(7.5, 1);
    const massMat = new THREE.MeshStandardMaterial({
      color: 0x828b94,
      roughness: 0.8,
      metalness: 0.15,
      flatShading: true
    });
    this.collapseMass = new THREE.Mesh(massGeo, massMat);
    this.collapseMass.castShadow = true;
    this.group.add(this.collapseMass);

    // 16 debris shards
    this.shards = [];
    const shardGeo = new THREE.DodecahedronGeometry(1.6, 0);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x585e66,
      roughness: 0.9,
      flatShading: true
    });

    for (let i = 0; i < 16; i++) {
      const shard = new THREE.Mesh(shardGeo, shardMat);
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 12.0,
        (Math.random() - 0.5) * 8.0,
        (Math.random() - 0.5) * 12.0
      );
      const rotSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      );
      this.shards.push({ mesh: shard, offset, rotSpeed });
      this.group.add(shard);
    }

    // Detachment scarp on mountain peak
    const scarGeo = new THREE.CircleGeometry(12.0, 24);
    const scarMat = new THREE.MeshBasicMaterial({
      color: 0x1c2024,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.scarMesh = new THREE.Mesh(scarGeo, scarMat);
    this.scarMesh.position.set(-98.0, 60.0, -91.0);
    this.scarMesh.rotation.set(-0.7, 0.4, 0.2);
    this.group.add(this.scarMesh);

    // Impact blast cloud in riverbed
    const cloudGeo = new THREE.SphereGeometry(1, 24, 20);
    const cloudMat = new THREE.MeshBasicMaterial({
      color: 0xd9e2ec,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    });
    this.impactCloud = new THREE.Mesh(cloudGeo, cloudMat);
    this.impactCloud.position.copy(this.riverHitPos);
    this.group.add(this.impactCloud);
  }

  /* ----------------------------------------------------
   * 2. REALISTIC 3D HYDRODYNAMIC BREAKER WAVE & FOAM
   * ---------------------------------------------------- */
  initFloodFront() {
    this.floodGroup = new THREE.Group();
    this.group.add(this.floodGroup);

    let waveColor = 0x0284c7; // Azure default
    let foamColor = 0xffffff;
    if (this.scenarioId === 'delhi') {
      waveColor = 0x8c6239; // Muddy Yamuna silt
    } else if (this.scenarioId === 'beijing') {
      waveColor = 0x785638; // Taihang mountain torrent
    } else if (this.scenarioId === 'tokyo') {
      waveColor = 0x2e6660; // Stormy Arakawa green-slate
    } else if (this.scenarioId === 'london') {
      waveColor = 0x2a5060; // Thames estuary slate
    } else if (this.scenarioId === 'rasuwa') {
      waveColor = 0x7a6b5c; // Himalayan glacial debris
    }

    // (Removed rigid cylinder bars: organic flood front is rendered via trailObj ribbon, spray particles, and apron froth)

    // 3. Turbulent Froth Apron / Wake (foaming wake trailing behind the crest)
    const apronGeo = new THREE.PlaneGeometry(22.0, 10.0, 16, 8);
    apronGeo.rotateX(-Math.PI / 2);
    const apronMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.85,
      metalness: 0.0,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });
    this.waveApron = new THREE.Mesh(apronGeo, apronMat);
    this.waveApron.position.set(0, 0.5, -4.5);
    this.floodGroup.add(this.waveApron);

    // 4. Hydrodynamic Whitewater Spray Particles
    this.sprayParticles = [];
    const sprayGeo = new THREE.DodecahedronGeometry(0.65, 0);
    const sprayMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.6,
      transparent: true,
      opacity: 0.88,
      flatShading: true
    });

    for (let i = 0; i < 20; i++) {
      const p = new THREE.Mesh(sprayGeo, sprayMat);
      const spanX = (Math.random() - 0.5) * 20.0;
      const relPos = new THREE.Vector3(
        spanX,
        1.2 + Math.random() * 2.2,
        (Math.random() - 0.2) * 4.0
      );
      this.sprayParticles.push({
        mesh: p,
        basePos: relPos.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 3.0 + Math.random() * 4.0
      });
      this.floodGroup.add(p);
    }

    this.trailObj = this.river.createFloodTrail();
    this.group.add(this.trailObj.mesh);

    // Backward-compatible references (no glowing ball)
    this.surgeBall = { visible: false, position: new THREE.Vector3(), rotation: new THREE.Euler() };
    this.floodGlow = this.surgeBall;
    this.floodLight = { position: new THREE.Vector3(), intensity: 0 };
    this.surgeLight = this.floodLight;
    this.floodDebris = [];
    this.boulders = [];
  }

  /* ----------------------------------------------------
   * 3. CONTINUOUS TRISHULI HIGHWAY & DYNAMIC DAMAGE
   * ---------------------------------------------------- */
  initHighwaySystem() {
    this.highwaySections = [];

    // Continuous highway running on river terraces from u=0.08 down to u=0.78 (~40 km road corridor)
    const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x2c333a, roughness: 0.9 });
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x95a5a6, roughness: 0.8 }); // Concrete retaining wall
    const guardrailMat = new THREE.MeshStandardMaterial({ color: 0xdfe6e9, metalness: 0.8, roughness: 0.3 });

    const totalSegments = 26;

    for (let k = 0; k < totalSegments; k++) {
      const uSeg = 0.08 + (k / (totalSegments - 1)) * 0.70;
      const pt = this.river.getPointAt(uSeg);
      const tangent = this.river.getTangentAt(uSeg);
      const up = new THREE.Vector3(0, 1, 0);
      const side = new THREE.Vector3().crossVectors(tangent, up).normalize();

      const segGroup = new THREE.Group();

      // Roadway dimensions
      const roadWidth = 3.8;
      const roadLength = 9.5;
      const roadThickness = 0.4;

      // 1. Asphalt Road Surface
      const roadGeo = new THREE.BoxGeometry(roadWidth, roadThickness, roadLength);
      const roadMesh = new THREE.Mesh(roadGeo, asphaltMat);
      roadMesh.position.y = 0.2;
      segGroup.add(roadMesh);

      // Center dash line
      const lineGeo = new THREE.BoxGeometry(0.18, 0.02, roadLength * 0.85);
      const lineMesh = new THREE.Mesh(lineGeo, lineMat);
      lineMesh.position.y = 0.41;
      segGroup.add(lineMesh);

      // 2. Concrete Embankment Retaining Wall on river-facing edge
      const wallGeo = new THREE.BoxGeometry(0.5, 2.8, roadLength);
      const wallMesh = new THREE.Mesh(wallGeo, wallMat);
      wallMesh.position.set(-roadWidth * 0.5 - 0.2, -1.1, 0);
      segGroup.add(wallMesh);

      // 3. Steel W-Beam Guardrail
      const railGeo = new THREE.BoxGeometry(0.15, 0.45, roadLength);
      const railMesh = new THREE.Mesh(railGeo, guardrailMat);
      railMesh.position.set(-roadWidth * 0.5 - 0.1, 0.6, 0);
      segGroup.add(railMesh);

      // Position road on elevated river terrace
      const terraceDist = 8.5;
      const rPos = new THREE.Vector3().copy(pt).addScaledVector(side, terraceDist);
      rPos.y = this.terrain.getTerrainHeight(rPos.x, rPos.z) + 0.1;

      segGroup.position.copy(rPos);
      segGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      this.group.add(segGroup);

      this.highwaySections.push({
        group: segGroup,
        uTrigger: uSeg,
        initialPos: rPos.clone(),
        initialRot: segGroup.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(22.0),
        slideDir: side.clone().multiplyScalar(-1.0), // Slides inward toward river
        wallMesh,
        roadMesh
      });
    }
  }

  /* ----------------------------------------------------
   * 4. 100% REALISTIC DAMS, VILLAGES & VEHICLES
   * ---------------------------------------------------- */
  initStructuresAndVehicles() {
    this.wipeableItems = [];
    this.bridges = [];

    this.createRealisticDam(0.10);
    this.createAllRealisticBridges();
    this.createBorderPostWithVehicles(0.105);
    this.createSyabrubesiWithVehicles(0.30);
    this.createHydroCascade(0.42);
    this.createBetrawatiWithVehicles(0.52);
    this.createGalchhiHighwayVehicles(0.66);
  }

  // 1. Realistic Concrete Gravity/Arch Dam at Rasuwagadhi (u=0.10)
  createRealisticDam(uPos) {
    const pt = this.river.getPointAt(uPos);
    const tangent = this.river.getTangentAt(uPos);
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();

    const concreteMat = new THREE.MeshStandardMaterial({ color: 0xd8dde2, roughness: 0.65, metalness: 0.1 });
    const darkConcrete = new THREE.MeshStandardMaterial({ color: 0x7f878f, roughness: 0.8 });
    const waterIntakeMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.5 });

    const damSpan = 16.0;
    const damHeight = 7.5;
    const segCount = 6;
    const segWidth = damSpan / segCount;

    for (let s = 0; s < segCount; s++) {
      const segGroup = new THREE.Group();

      const bodyGeo = new THREE.BoxGeometry(segWidth * 0.96, damHeight, 4.2);
      const bodyMesh = new THREE.Mesh(bodyGeo, concreteMat.clone());
      bodyMesh.castShadow = true;
      segGroup.add(bodyMesh);

      const roadGeo = new THREE.BoxGeometry(segWidth * 0.98, 0.4, 3.2);
      const roadMesh = new THREE.Mesh(roadGeo, darkConcrete);
      roadMesh.position.y = damHeight * 0.5 + 0.2;
      segGroup.add(roadMesh);

      if (s >= 1 && s <= 4) {
        const pierMesh = new THREE.Mesh(new THREE.BoxGeometry(segWidth * 0.3, 1.8, 4.4), concreteMat);
        pierMesh.position.set(0, damHeight * 0.5 + 0.9, 0);
        segGroup.add(pierMesh);

        const gateMesh = new THREE.Mesh(new THREE.BoxGeometry(segWidth * 0.65, 2.2, 0.4), waterIntakeMat);
        gateMesh.position.set(0, damHeight * 0.5 - 0.4, 1.8);
        segGroup.add(gateMesh);
      }

      if (s === 0) {
        const towerGeo = new THREE.BoxGeometry(segWidth * 0.9, 3.6, 3.2);
        const towerMesh = new THREE.Mesh(towerGeo, concreteMat);
        towerMesh.position.set(0, damHeight * 0.5 + 1.8, 0);
        segGroup.add(towerMesh);
      }

      const tSpan = (s - (segCount - 1) / 2) * segWidth;
      const initialPos = new THREE.Vector3().copy(pt).addScaledVector(side, tSpan);
      initialPos.y = pt.y + damHeight * 0.45;

      segGroup.position.copy(initialPos);
      segGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      this.group.add(segGroup);

      this.wipeableItems.push({
        mesh: segGroup,
        uTrigger: uPos,
        initialPos: initialPos.clone(),
        initialRot: segGroup.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(22.0),
        tumbleVel: new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 8),
        material: bodyMesh.material
      });
    }

    const gatehouse = this.createDetailedDamGatehouse();
    const phPos = new THREE.Vector3().copy(pt).addScaledVector(side, 9.5).addScaledVector(tangent, 3.5);
    phPos.y = this.terrain.getTerrainHeight(phPos.x, phPos.z);
    gatehouse.group.position.copy(phPos);
    gatehouse.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    this.group.add(gatehouse.group);

    this.wipeableItems.push({
      mesh: gatehouse.group,
      uTrigger: uPos,
      initialPos: phPos.clone(),
      initialRot: gatehouse.group.rotation.clone(),
      driftDir: tangent.clone().multiplyScalar(18.0),
      tumbleVel: new THREE.Vector3(2, 3, 2),
      materials: gatehouse.materials
    });
  }

  // 2. Rasuwagadhi Border Post with Detailed Trucks & Containers
  createBorderPostWithVehicles(uPos) {
    const pt = this.river.getPointAt(uPos);
    const tangent = this.river.getTangentAt(uPos);
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();


    // Official Nepal Customs & Immigration Headquarters Complex
    const customs = this.createDetailedBorderCustomsBuilding();
    const cPos = new THREE.Vector3().copy(pt).addScaledVector(side, 9.2).addScaledVector(tangent, -4.5);
    cPos.y = this.terrain.getTerrainHeight(cPos.x, cPos.z);
    customs.group.position.copy(cPos);
    customs.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    this.group.add(customs.group);

    this.wipeableItems.push({
      mesh: customs.group,
      uTrigger: uPos,
      initialPos: cPos.clone(),
      initialRot: customs.group.rotation.clone(),
      driftDir: tangent.clone().multiplyScalar(20.0),
      tumbleVel: new THREE.Vector3(3, 2, 3),
      materials: customs.materials
    });

    // Dry Port Cargo Clearing Warehouse
    const warehouse = this.createDetailedDryPortWarehouse();
    const wPos = new THREE.Vector3().copy(pt).addScaledVector(side, -9.5).addScaledVector(tangent, -2.0);
    wPos.y = this.terrain.getTerrainHeight(wPos.x, wPos.z);
    warehouse.group.position.copy(wPos);
    warehouse.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    this.group.add(warehouse.group);

    this.wipeableItems.push({
      mesh: warehouse.group,
      uTrigger: uPos,
      initialPos: wPos.clone(),
      initialRot: warehouse.group.rotation.clone(),
      driftDir: tangent.clone().multiplyScalar(22.0),
      tumbleVel: new THREE.Vector3(3, 3, 2),
      materials: warehouse.materials
    });

    for (let tr = 0; tr < 2; tr++) {
      const truck = this.createDetailedTruck(tr === 0 ? 0x1d6fa5 : 0xc0392b);
      const trPos = new THREE.Vector3().copy(pt).addScaledVector(side, (tr === 0 ? 3.2 : -3.2));
      trPos.y = pt.y + 4.6;
      truck.position.copy(trPos);
      truck.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), side);
      this.group.add(truck);

      this.wipeableItems.push({
        mesh: truck,
        uTrigger: uPos,
        initialPos: trPos.clone(),
        initialRot: truck.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(28.0),
        tumbleVel: new THREE.Vector3(7, 6, 5),
        material: truck.userData.primaryMat
      });
    }

    const containerColors = [0x1d6fa5, 0xc23616, 0x27ae60, 0xf39c12, 0x8e44ad];
    for (let i = 0; i < 10; i++) {
      const col = containerColors[i % containerColors.length];
      const container = this.createCorrugatedContainer(col);

      const bankSide = (i % 2 === 0) ? 1 : -1;
      const bDist = 6.8 + Math.floor(i / 2) * 1.8;
      const cPos = new THREE.Vector3().copy(pt).addScaledVector(side, bankSide * bDist).addScaledVector(tangent, (i - 5) * 2.4);
      cPos.y = this.terrain.getTerrainHeight(cPos.x, cPos.z) + 0.7;

      container.position.copy(cPos);
      container.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      this.group.add(container);

      this.wipeableItems.push({
        mesh: container,
        uTrigger: uPos,
        initialPos: cPos.clone(),
        initialRot: container.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(26.0),
        tumbleVel: new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8),
        material: container.userData.primaryMat
      });
    }
  }

  // 3. Syabrubesi Village: Lodges, Footbridge & Mountain Jeeps
  createSyabrubesiWithVehicles(uPos) {
    const pt = this.river.getPointAt(uPos);
    const tangent = this.river.getTangentAt(uPos);
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();


    const jeepColors = [0xe74c3c, 0xf39c12, 0xecf0f1, 0x2c3e50];
    for (let c = 0; c < 4; c++) {
      const jeep = this.createDetailedJeep(jeepColors[c]);
      const cPos = new THREE.Vector3().copy(pt).addScaledVector(side, 7.2 + c * 1.6).addScaledVector(tangent, (c - 2) * 3.6);
      cPos.y = this.terrain.getTerrainHeight(cPos.x, cPos.z) + 0.4;
      jeep.position.copy(cPos);
      this.group.add(jeep);

      this.wipeableItems.push({
        mesh: jeep,
        uTrigger: uPos,
        initialPos: cPos.clone(),
        initialRot: jeep.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(30.0),
        tumbleVel: new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10),
        material: jeep.userData.primaryMat
      });
    }

    const roofColors = [0x0984e3, 0xc0392b, 0x10ac84, 0x2980b9, 0xd35400, 0x636e72];
    for (let i = 0; i < 12; i++) {
      const bw = 3.8 + (i % 3) * 0.4;
      const bh = 3.4 + (i % 2) * 0.5;
      const bd = 4.2 + (i % 3) * 0.3;

      const lodge = this.createDetailedTrekkingLodge(bw, bh, bd, roofColors[i % roofColors.length]);
      const bankSide = (i % 2 === 0) ? 1 : -1;
      const bDist = 7.2 + (i * 0.6);
      const sOffset = (i - 6) * 3.4;

      const pos = new THREE.Vector3().copy(pt).addScaledVector(side, bankSide * bDist).addScaledVector(tangent, sOffset);
      pos.y = this.terrain.getTerrainHeight(pos.x, pos.z);

      lodge.group.position.copy(pos);
      lodge.group.rotation.y = (bankSide > 0 ? -Math.PI * 0.5 : Math.PI * 0.5) + (Math.sin(i) * 0.2);
      this.group.add(lodge.group);

      this.wipeableItems.push({
        mesh: lodge.group,
        uTrigger: uPos,
        initialPos: pos.clone(),
        initialRot: lodge.group.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(22.0),
        tumbleVel: new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6),
        materials: lodge.materials
      });
    }
  }

  // 4. Hydropower Corridor Weir & Powerhouse
  createHydroCascade(uPos) {
    const pt = this.river.getPointAt(uPos);
    const tangent = this.river.getTangentAt(uPos);
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();

    const weirGeo = new THREE.BoxGeometry(13.0, 5.0, 3.2);
    const weirMat = new THREE.MeshStandardMaterial({ color: 0xc8d0d8, roughness: 0.65 });
    const weirMesh = new THREE.Mesh(weirGeo, weirMat);
    weirMesh.position.set(pt.x, pt.y + 2.2, pt.z);
    weirMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), side);
    this.group.add(weirMesh);

    this.wipeableItems.push({
      mesh: weirMesh,
      uTrigger: uPos,
      initialPos: weirMesh.position.clone(),
      initialRot: weirMesh.rotation.clone(),
      driftDir: tangent.clone().multiplyScalar(20.0),
      tumbleVel: new THREE.Vector3(3, 4, 3),
      material: weirMat
    });

    const powerhouse = this.createDetailedHydroPowerhouseComplex();
    const housePos = new THREE.Vector3().copy(pt).addScaledVector(side, 9.2).addScaledVector(tangent, 3.0);
    housePos.y = this.terrain.getTerrainHeight(housePos.x, housePos.z);
    powerhouse.group.position.copy(housePos);
    powerhouse.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    this.group.add(powerhouse.group);

    this.wipeableItems.push({
      mesh: powerhouse.group,
      uTrigger: uPos,
      initialPos: housePos.clone(),
      initialRot: powerhouse.group.rotation.clone(),
      driftDir: tangent.clone().multiplyScalar(18.0),
      tumbleVel: new THREE.Vector3(2, 3, 2),
      materials: powerhouse.materials
    });

    for (let p = 0; p < 2; p++) {
      const pylonGeo = new THREE.CylinderGeometry(0.3, 1.2, 9.0, 4);
      const pylonMat = new THREE.MeshStandardMaterial({ color: 0x95a5a6, metalness: 0.7, roughness: 0.4 });
      const pylonMesh = new THREE.Mesh(pylonGeo, pylonMat);
      const pPos = new THREE.Vector3().copy(pt).addScaledVector(side, (p === 0 ? 1 : -1) * 9.0).addScaledVector(tangent, 5.0);
      pPos.y = this.terrain.getTerrainHeight(pPos.x, pPos.z) + 4.5;
      pylonMesh.position.copy(pPos);
      this.group.add(pylonMesh);

      this.wipeableItems.push({
        mesh: pylonMesh,
        uTrigger: uPos,
        initialPos: pPos.clone(),
        initialRot: pylonMesh.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(22.0),
        tumbleVel: new THREE.Vector3(6, 4, 5),
        material: pylonMat
      });
    }
  }

  // 5. Betrawati: Bridge, Passenger Buses & Gauge Tower
  createBetrawatiWithVehicles(uPos) {
    const pt = this.river.getPointAt(uPos);
    const tangent = this.river.getTangentAt(uPos);
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();


    for (let b = 0; b < 2; b++) {
      const bus = this.createDetailedBus(b === 0 ? 0xe67e22 : 0x27ae60);
      const bPos = new THREE.Vector3().copy(pt).addScaledVector(side, (b === 0 ? 3.4 : -3.4));
      bPos.y = pt.y + 3.9;
      bus.position.copy(bPos);
      bus.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), side);
      this.group.add(bus);

      this.wipeableItems.push({
        mesh: bus,
        uTrigger: uPos,
        initialPos: bPos.clone(),
        initialRot: bus.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(28.0),
        tumbleVel: new THREE.Vector3(8, 7, 5),
        material: bus.userData.primaryMat
      });
    }

    const gaugeGeo = new THREE.CylinderGeometry(0.6, 0.8, 6.0, 8);
    const gaugeMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.5 });
    const gaugeMesh = new THREE.Mesh(gaugeGeo, gaugeMat);
    const gPos = new THREE.Vector3().copy(pt).addScaledVector(side, 6.2);
    gPos.y = this.terrain.getTerrainHeight(gPos.x, gPos.z) + 3.0;
    gaugeMesh.position.copy(gPos);
    this.group.add(gaugeMesh);

    this.wipeableItems.push({
      mesh: gaugeMesh,
      uTrigger: uPos,
      initialPos: gPos.clone(),
      initialRot: gaugeMesh.rotation.clone(),
      driftDir: tangent.clone().multiplyScalar(20.0),
      tumbleVel: new THREE.Vector3(4, 6, 2),
      material: gaugeMat
    });

    const facadeColors = [0x78e08f, 0x70a1ff, 0xf6b93b, 0xf8efba, 0xffcccc, 0xdff9fb];
    const shutterColors = [0x1e3799, 0x1b8a5a, 0x718093, 0xb33939];

    for (let i = 0; i < 8; i++) {
      const bw = 3.8 + (i % 2) * 0.4;
      const bh = 3.4 + (i % 3) * 0.5;
      const bd = 4.0 + (i % 2) * 0.3;

      const shop = this.createDetailedBazaarShophouse(
        bw, bh, bd,
        facadeColors[i % facadeColors.length],
        shutterColors[i % shutterColors.length]
      );

      const bankSide = (i % 2 === 0) ? 1 : -1;
      const bDist = 7.2 + (i * 0.5);
      const pos = new THREE.Vector3().copy(pt).addScaledVector(side, bankSide * bDist).addScaledVector(tangent, (i - 4) * 3.4);
      pos.y = this.terrain.getTerrainHeight(pos.x, pos.z);

      shop.group.position.copy(pos);
      shop.group.rotation.y = (bankSide > 0 ? -Math.PI * 0.5 : Math.PI * 0.5) + (Math.sin(i) * 0.15);
      this.group.add(shop.group);

      this.wipeableItems.push({
        mesh: shop.group,
        uTrigger: uPos,
        initialPos: pos.clone(),
        initialRot: shop.group.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(20.0),
        tumbleVel: new THREE.Vector3((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5),
        materials: shop.materials
      });
    }
  }

  // 6. Galchhi Township: Prithvi Highway Vehicles & Buildings
  createGalchhiHighwayVehicles(uPos) {
    const pt = this.river.getPointAt(uPos);
    const tangent = this.river.getTangentAt(uPos);
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();

    const vColors = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6];
    for (let v = 0; v < 5; v++) {
      const veh = (v % 2 === 0) ? this.createDetailedJeep(vColors[v]) : this.createDetailedTruck(vColors[v]);
      const cPos = new THREE.Vector3().copy(pt).addScaledVector(side, 8.2).addScaledVector(tangent, (v - 2) * 3.4);
      cPos.y = this.terrain.getTerrainHeight(cPos.x, cPos.z) + 0.5;
      veh.position.copy(cPos);
      veh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      this.group.add(veh);

      this.wipeableItems.push({
        mesh: veh,
        uTrigger: uPos,
        initialPos: cPos.clone(),
        initialRot: veh.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(30.0),
        tumbleVel: new THREE.Vector3((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 12),
        material: veh.userData.primaryMat
      });
    }

    const galchhiFacades = [0xf8efba, 0x78e08f, 0x70a1ff, 0xf6b93b, 0xffb8b8, 0xdff9fb];
    const galchhiShutters = [0x1e3799, 0x1b8a5a, 0x34495e, 0xc0392b];

    for (let i = 0; i < 10; i++) {
      const bw = 3.6 + (i % 3) * 0.4;
      const bh = 3.2 + (i % 2) * 0.6;
      const bd = 3.8 + (i % 2) * 0.4;

      const building = this.createDetailedBazaarShophouse(
        bw, bh, bd,
        galchhiFacades[i % galchhiFacades.length],
        galchhiShutters[i % galchhiShutters.length]
      );

      const pos = new THREE.Vector3().copy(pt).addScaledVector(side, 11.5).addScaledVector(tangent, (i - 5) * 3.6);
      pos.y = this.terrain.getTerrainHeight(pos.x, pos.z);

      building.group.position.copy(pos);
      building.group.rotation.y = -Math.PI * 0.5;
      this.group.add(building.group);

      this.wipeableItems.push({
        mesh: building.group,
        uTrigger: uPos,
        initialPos: pos.clone(),
        initialRot: building.group.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(20.0),
        tumbleVel: new THREE.Vector3((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5),
        materials: building.materials
      });
    }
  }

  /* ====================================================
   * 4B. 100% REALISTIC HIMALAYAN & HIGHWAY BRIDGES
   * ==================================================== */
  createAllRealisticBridges() {
    this.bridges = [];

    // 1. Rasuwagadhi Nepal-China International Friendship Bridge (u = 0.105)
    this.createFriendshipBorderBridge(0.105);

    // 2. Timure Gorge High Himalayan Suspension Bridge (u = 0.20)
    this.createSuspensionFootbridge(0.20, "Timure Suspension Bridge", 16.0);

    // 3. Syabrubesi Langtang Trail Confluence Suspension Bridge (u = 0.29)
    this.createSuspensionFootbridge(0.29, "Syabrubesi Suspension Bridge", 15.0);

    // 4. Thambuchet Himalayan Trail Footbridge (u = 0.36)
    this.createSuspensionFootbridge(0.36, "Thambuchet Suspension Bridge", 15.0);

    // 5. Mailung / Upper Trishuli 3A Hydropower Bailey Steel Truss Bridge (u = 0.42)
    this.createBaileyTrussBridge(0.42);

    // 6. Betrawati Trishuli Highway Concrete Girder Bridge (u = 0.52)
    this.createConcreteHighwayGirderBridge(0.52);

    // 7. Trishuli Bazaar Motorable River Bridge (u = 0.60)
    this.createTrishuliBazaarBridge(0.60);

    // 8. Galchhi / Prithvi Highway Mega River Crossing (u = 0.70)
    this.createGalchhiMegaBridge(0.70);
  }

  // 1. High Himalayan Suspension Footbridge (Twin A-Frame Lattice Towers, Cables, Planks, & Prayer Flags)
  createSuspensionFootbridge(uPos, name, span = 16.0) {
    const pt = this.river.getPointAt(uPos);
    const tangent = this.river.getTangentAt(uPos);
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();
    const actualUp = new THREE.Vector3().crossVectors(side, tangent).normalize();

    const basisMat = new THREE.Matrix4().makeBasis(tangent, actualUp, side);
    const baseQuat = new THREE.Quaternion().setFromRotationMatrix(basisMat);

    const deckY = pt.y + 3.8;
    const half = span * 0.5;

    const bridgeGroup = new THREE.Group();
    const dynamicParts = [];
    const flags = [];

    const towerMat = new THREE.MeshStandardMaterial({ color: 0x636e72, metalness: 0.8, roughness: 0.35 });
    const cableMat = new THREE.MeshStandardMaterial({ color: 0xdfe6e9, metalness: 0.9, roughness: 0.2 });
    const plankMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 });
    const meshMat = new THREE.MeshStandardMaterial({ color: 0xb2bec3, metalness: 0.5, roughness: 0.5 });
    const anchorMat = new THREE.MeshStandardMaterial({ color: 0x8395a7, roughness: 0.85 });

    // A. TWIN A-FRAME STEEL LATTICE TOWERS (Left & Right Banks)
    const towerZOffsets = [-half * 0.94, half * 0.94];

    for (let tIdx = 0; tIdx < 2; tIdx++) {
      const tZ = towerZOffsets[tIdx];
      const towerGroup = new THREE.Group();

      const basePos = new THREE.Vector3().copy(pt).addScaledVector(side, tZ);
      const terrY = this.terrain.getTerrainHeight(basePos.x, basePos.z);
      const towerBaseY = Math.max(pt.y + 1.2, terrY);
      const towerH = 5.6;

      const footGeo = new THREE.BoxGeometry(1.6, 0.8, 1.8);
      const footMesh = new THREE.Mesh(footGeo, anchorMat);
      footMesh.position.y = towerBaseY + 0.4;
      towerGroup.add(footMesh);

      const legGeo = new THREE.CylinderGeometry(0.12, 0.16, towerH, 8);
      const leg1 = new THREE.Mesh(legGeo, towerMat);
      leg1.position.set(0.65, towerBaseY + towerH * 0.5, 0);
      leg1.rotation.z = -0.10;
      towerGroup.add(leg1);

      const leg2 = new THREE.Mesh(legGeo, towerMat);
      leg2.position.set(-0.65, towerBaseY + towerH * 0.5, 0);
      leg2.rotation.z = 0.10;
      towerGroup.add(leg2);

      const strut1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 0.12), towerMat);
      strut1.position.set(0, towerBaseY + towerH * 0.4, 0);
      towerGroup.add(strut1);

      const strut2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.12), towerMat);
      strut2.position.set(0, towerBaseY + towerH * 0.75, 0);
      towerGroup.add(strut2);

      const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.6), towerMat);
      saddle.position.set(0, towerBaseY + towerH + 0.15, 0);
      towerGroup.add(saddle);

      towerGroup.position.copy(pt).addScaledVector(side, tZ);
      towerGroup.quaternion.copy(baseQuat);
      this.group.add(towerGroup);

      dynamicParts.push({
        mesh: towerGroup,
        initialPos: towerGroup.position.clone(),
        initialRot: towerGroup.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(12.0),
        tumbleVel: new THREE.Vector3(2.5, 1.5, tIdx === 0 ? 3.0 : -3.0),
        material: towerMat
      });

      // Rock Anchor Block & Backstays into mountain cliff
      const anchorDist = (tIdx === 0 ? -1 : 1) * (half + 4.0);
      const anchorPos = new THREE.Vector3().copy(pt).addScaledVector(side, anchorDist);
      anchorPos.y = this.terrain.getTerrainHeight(anchorPos.x, anchorPos.z) + 0.8;

      const blockMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 2.0), anchorMat);
      blockMesh.position.copy(anchorPos);
      blockMesh.quaternion.copy(baseQuat);
      this.group.add(blockMesh);

      const saddleWorldPos = new THREE.Vector3().copy(pt).addScaledVector(side, tZ);
      saddleWorldPos.y = towerBaseY + towerH + 0.2;
      const backstayDist = saddleWorldPos.distanceTo(anchorPos);
      const backstayMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, backstayDist, 6), cableMat);
      backstayMesh.position.copy(saddleWorldPos).lerp(anchorPos, 0.5);
      backstayMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(anchorPos, saddleWorldPos).normalize());
      this.group.add(backstayMesh);
    }

    // B. MAIN CATENARY SUSPENSION CABLES
    const cableOffsets = [-0.65, 0.65];
    const catenaryPointsCount = 20;

    for (let c = 0; c < 2; c++) {
      const cOff = cableOffsets[c];
      const curvePts = [];
      const sag = 2.4;
      const yCenter = deckY + 0.85;

      for (let k = 0; k <= catenaryPointsCount; k++) {
        const uC = (k / catenaryPointsCount) * 2.0 - 1.0;
        const zPos = uC * half * 0.94;
        const yPos = yCenter + sag * (uC * uC);
        const wPos = new THREE.Vector3().copy(pt)
          .addScaledVector(side, zPos)
          .addScaledVector(tangent, cOff);
        wPos.y = yPos;
        curvePts.push(wPos);
      }

      const cableCurve = new THREE.CatmullRomCurve3(curvePts);
      const cableGeo = new THREE.TubeGeometry(cableCurve, 28, 0.05, 6, false);
      const cableMesh = new THREE.Mesh(cableGeo, cableMat.clone());
      this.group.add(cableMesh);

      dynamicParts.push({
        mesh: cableMesh,
        initialPos: cableMesh.position.clone(),
        initialRot: cableMesh.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(18.0),
        tumbleVel: new THREE.Vector3(4, 2, 4),
        material: cableMesh.material
      });

      // C. TIBETAN BUDDHIST PRAYER FLAGS (Lungta) along main cables
      const flagColors = [0x2980b9, 0xecf0f1, 0xc0392b, 0x27ae60, 0xf1c40f];
      const numFlags = 14;

      for (let f = 0; f < numFlags; f++) {
        const uF = 0.12 + (f / (numFlags - 1)) * 0.76;
        const fPos = cableCurve.getPointAt(uF);
        const col = flagColors[f % flagColors.length];
        const flagMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.8, side: THREE.DoubleSide });

        const flagGeo = new THREE.BoxGeometry(0.32, 0.22, 0.015);
        const flagMesh = new THREE.Mesh(flagGeo, flagMat);
        flagMesh.position.set(fPos.x, fPos.y - 0.15, fPos.z);
        flagMesh.rotation.z = 0.15 * Math.sin(f * 1.5);
        this.group.add(flagMesh);

        flags.push(flagMesh);
        dynamicParts.push({
          mesh: flagMesh,
          initialPos: flagMesh.position.clone(),
          initialRot: flagMesh.rotation.clone(),
          driftDir: tangent.clone().multiplyScalar(22.0),
          tumbleVel: new THREE.Vector3(6, 4, 5),
          material: flagMat
        });
      }
    }

    // D. SUSPENDER HANGER RODS
    const hangerCount = 11;
    for (let h = 0; h < hangerCount; h++) {
      const uH = (h / (hangerCount - 1)) * 2.0 - 1.0;
      const zPos = uH * half * 0.80;
      const sagY = deckY + 0.85 + 2.4 * (uH * uH);
      const hHeight = Math.max(0.6, sagY - deckY);

      for (let s = 0; s < 2; s++) {
        const cOff = cableOffsets[s];
        const hangerGeo = new THREE.CylinderGeometry(0.02, 0.02, hHeight, 4);
        const hangerMesh = new THREE.Mesh(hangerGeo, cableMat);
        const hPos = new THREE.Vector3().copy(pt)
          .addScaledVector(side, zPos)
          .addScaledVector(tangent, cOff);
        hPos.y = deckY + hHeight * 0.5;
        hangerMesh.position.copy(hPos);
        this.group.add(hangerMesh);

        dynamicParts.push({
          mesh: hangerMesh,
          initialPos: hangerMesh.position.clone(),
          initialRot: hangerMesh.rotation.clone(),
          driftDir: tangent.clone().multiplyScalar(20.0),
          tumbleVel: new THREE.Vector3(5, 3, 4),
          material: cableMat
        });
      }
    }

    // E. WALKWAY DECK IN 3 FRACTURE SECTIONS
    const deckConfigs = [
      { id: 'left', zCenter: -half * 0.58, length: span * 0.32, driftScale: 16.0, tumble: new THREE.Vector3(4, 2, 4) },
      { id: 'center', zCenter: 0.0, length: span * 0.36, driftScale: 28.0, tumble: new THREE.Vector3(7, 5, 6) },
      { id: 'right', zCenter: half * 0.58, length: span * 0.32, driftScale: 16.0, tumble: new THREE.Vector3(4, 2, -4) }
    ];

    for (const dCfg of deckConfigs) {
      const dGroup = new THREE.Group();

      const plankGeo = new THREE.BoxGeometry(1.3, 0.14, dCfg.length);
      const plankMesh = new THREE.Mesh(plankGeo, plankMat.clone());
      plankMesh.castShadow = true;
      dGroup.add(plankMesh);

      const transCount = Math.floor(dCfg.length / 1.2);
      for (let tb = 0; tb <= transCount; tb++) {
        const tZ = (tb / transCount - 0.5) * dCfg.length * 0.95;
        const transMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.12), towerMat);
        transMesh.position.set(0, -0.12, tZ);
        dGroup.add(transMesh);
      }

      for (let sideEdge of [-0.65, 0.65]) {
        const meshGeo = new THREE.BoxGeometry(0.04, 0.75, dCfg.length);
        const meshPanel = new THREE.Mesh(meshGeo, meshMat);
        meshPanel.position.set(sideEdge, 0.42, 0);
        dGroup.add(meshPanel);

        const railGeo = new THREE.BoxGeometry(0.08, 0.08, dCfg.length);
        const railMesh = new THREE.Mesh(railGeo, towerMat);
        railMesh.position.set(sideEdge, 0.82, 0);
        dGroup.add(railMesh);
      }

      const dPos = new THREE.Vector3().copy(pt).addScaledVector(side, dCfg.zCenter);
      dPos.y = deckY;
      dGroup.position.copy(dPos);
      dGroup.quaternion.copy(baseQuat);
      this.group.add(dGroup);

      dynamicParts.push({
        mesh: dGroup,
        initialPos: dPos.clone(),
        initialRot: dGroup.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(dCfg.driftScale),
        tumbleVel: dCfg.tumble,
        material: plankMesh.material
      });
    }

    this.bridges.push({
      name,
      uTrigger: uPos,
      group: bridgeGroup,
      dynamicParts,
      flags
    });
  }

  // 2. Rasuwagadhi Nepal-China Friendship International Bridge (Arch Truss, Customs Portals, Freight Trucks)
  createFriendshipBorderBridge(uPos = 0.105) {
    const pt = this.river.getPointAt(uPos);
    const tangent = this.river.getTangentAt(uPos);
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();
    const actualUp = new THREE.Vector3().crossVectors(side, tangent).normalize();

    const basisMat = new THREE.Matrix4().makeBasis(tangent, actualUp, side);
    const baseQuat = new THREE.Quaternion().setFromRotationMatrix(basisMat);

    const bridgeGroup = new THREE.Group();
    const dynamicParts = [];

    const span = 18.0;
    const half = span * 0.5;
    const deckY = pt.y + 3.4;
    const deckW = 4.4;

    const concreteMat = new THREE.MeshStandardMaterial({ color: 0xd2dae2, roughness: 0.7 });
    const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x2c333a, roughness: 0.9 });
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xf1c40f });
    const redTrussMat = new THREE.MeshStandardMaterial({ color: 0xa82828, metalness: 0.5, roughness: 0.35 });
    const steelRailMat = new THREE.MeshStandardMaterial({ color: 0xdfe6e9, metalness: 0.8, roughness: 0.25 });
    const chinaGoldMat = new THREE.MeshStandardMaterial({ color: 0xf39c12, metalness: 0.4, roughness: 0.4 });
    const chinaRedMat = new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.5 });
    const nepalStoneMat = new THREE.MeshStandardMaterial({ color: 0xb33927, roughness: 0.8 });

    // Center Concrete Pier
    const pierGroup = new THREE.Group();
    const pierCol = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, 7.5, 10), concreteMat);
    pierGroup.add(pierCol);

    const cutwater = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.2, 4), concreteMat);
    cutwater.rotation.z = Math.PI / 2;
    cutwater.rotation.y = Math.PI / 4;
    cutwater.position.set(-1.8, 0.4, 0);
    pierGroup.add(cutwater);

    const pierCap = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.8, 5.2), concreteMat);
    pierCap.position.set(0, 3.8, 0);
    pierGroup.add(pierCap);

    pierGroup.position.set(pt.x, pt.y + 1.2, pt.z);
    pierGroup.quaternion.copy(baseQuat);
    this.group.add(pierGroup);

    dynamicParts.push({
      mesh: pierGroup,
      initialPos: pierGroup.position.clone(),
      initialRot: pierGroup.rotation.clone(),
      driftDir: tangent.clone().multiplyScalar(16.0),
      tumbleVel: new THREE.Vector3(5, 3, 4),
      material: concreteMat
    });

    // Concrete Abutments on canyon walls
    for (const abSide of [-1, 1]) {
      const abPos = new THREE.Vector3().copy(pt).addScaledVector(side, abSide * half);
      abPos.y = this.terrain.getTerrainHeight(abPos.x, abPos.z) + 1.2;
      const abMesh = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.8, 2.5), concreteMat);
      abMesh.position.copy(abPos);
      abMesh.quaternion.copy(baseQuat);
      this.group.add(abMesh);
    }

    // Two Steel Through-Truss Arch Spans
    const spanConfigs = [
      { id: 'north_china', zCenter: -half * 0.5, driftScale: 26.0, tumble: new THREE.Vector3(6, 4, 5) },
      { id: 'south_nepal', zCenter: half * 0.5, driftScale: 24.0, tumble: new THREE.Vector3(7, 5, -4) }
    ];

    const spanLen = half * 0.96;

    for (const sc of spanConfigs) {
      const spGroup = new THREE.Group();

      const deckGeo = new THREE.BoxGeometry(deckW, 0.4, spanLen);
      const deckMesh = new THREE.Mesh(deckGeo, asphaltMat.clone());
      spGroup.add(deckMesh);

      const lineGeo = new THREE.BoxGeometry(0.16, 0.02, spanLen * 0.95);
      const lineMesh = new THREE.Mesh(lineGeo, lineMat);
      lineMesh.position.y = 0.22;
      spGroup.add(lineMesh);

      for (const edge of [-deckW * 0.5 + 0.15, deckW * 0.5 - 0.15]) {
        const curbGeo = new THREE.BoxGeometry(0.3, 0.3, spanLen);
        const curbMesh = new THREE.Mesh(curbGeo, concreteMat);
        curbMesh.position.set(edge, 0.25, 0);
        spGroup.add(curbMesh);

        const railGeo = new THREE.BoxGeometry(0.08, 0.7, spanLen);
        const railMesh = new THREE.Mesh(railGeo, steelRailMat);
        railMesh.position.set(edge, 0.65, 0);
        spGroup.add(railMesh);
      }

      for (const trussEdge of [-deckW * 0.5 - 0.1, deckW * 0.5 + 0.1]) {
        const bChord = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, spanLen), redTrussMat);
        bChord.position.set(trussEdge, 0.15, 0);
        spGroup.add(bChord);

        const archSegs = 6;
        for (let a = 0; a < archSegs; a++) {
          const uA = (a + 0.5) / archSegs;
          const zA = (uA - 0.5) * spanLen;
          const archH = 2.6 * Math.sin(uA * Math.PI);

          const postMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, archH + 0.2, 0.18), redTrussMat);
          postMesh.position.set(trussEdge, 0.2 + (archH * 0.5), zA);
          spGroup.add(postMesh);

          const topSeg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, spanLen / archSegs), redTrussMat);
          topSeg.position.set(trussEdge, 0.2 + archH, zA);
          spGroup.add(topSeg);
        }
      }

      for (let ov = -spanLen * 0.35; ov <= spanLen * 0.35; ov += spanLen * 0.35) {
        const portalBeam = new THREE.Mesh(new THREE.BoxGeometry(deckW + 0.4, 0.2, 0.2), redTrussMat);
        portalBeam.position.set(0, 2.7, ov);
        spGroup.add(portalBeam);
      }

      const spPos = new THREE.Vector3().copy(pt).addScaledVector(side, sc.zCenter);
      spPos.y = deckY;
      spGroup.position.copy(spPos);
      spGroup.quaternion.copy(baseQuat);
      this.group.add(spGroup);

      dynamicParts.push({
        mesh: spGroup,
        initialPos: spPos.clone(),
        initialRot: spGroup.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(sc.driftScale),
        tumbleVel: sc.tumble,
        material: deckMesh.material
      });
    }

    // Chinese Customs Arch
    const chinaArch = new THREE.Group();
    const cPillar1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3.8, 0.7), chinaRedMat);
    cPillar1.position.set(1.9, 1.9, 0);
    chinaArch.add(cPillar1);
    const cPillar2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3.8, 0.7), chinaRedMat);
    cPillar2.position.set(-1.9, 1.9, 0);
    chinaArch.add(cPillar2);
    const cLintel = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.7, 1.0), chinaRedMat);
    cLintel.position.set(0, 3.8, 0);
    chinaArch.add(cLintel);
    const cRoof = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.4, 1.4), chinaGoldMat);
    cRoof.position.set(0, 4.3, 0);
    chinaArch.add(cRoof);

    const chinaPos = new THREE.Vector3().copy(pt).addScaledVector(side, -half - 0.5);
    chinaPos.y = this.terrain.getTerrainHeight(chinaPos.x, chinaPos.z);
    chinaArch.position.copy(chinaPos);
    chinaArch.quaternion.copy(baseQuat);
    this.group.add(chinaArch);

    dynamicParts.push({
      mesh: chinaArch,
      initialPos: chinaPos.clone(),
      initialRot: chinaArch.rotation.clone(),
      driftDir: tangent.clone().multiplyScalar(18.0),
      tumbleVel: new THREE.Vector3(4, 3, 3),
      material: chinaRedMat
    });

    // Nepali Customs Checkpoint Arch
    const nepalArch = new THREE.Group();
    const nPillar1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.6, 0.8), nepalStoneMat);
    nPillar1.position.set(1.9, 1.8, 0);
    nepalArch.add(nPillar1);
    const nPillar2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.6, 0.8), nepalStoneMat);
    nPillar2.position.set(-1.9, 1.8, 0);
    nepalArch.add(nPillar2);
    const nLintel = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.6, 0.9), nepalStoneMat);
    nLintel.position.set(0, 3.6, 0);
    nepalArch.add(nLintel);

    const nepalPos = new THREE.Vector3().copy(pt).addScaledVector(side, half + 0.5);
    nepalPos.y = this.terrain.getTerrainHeight(nepalPos.x, nepalPos.z);
    nepalArch.position.copy(nepalPos);
    nepalArch.quaternion.copy(baseQuat);
    this.group.add(nepalArch);

    dynamicParts.push({
      mesh: nepalArch,
      initialPos: nepalPos.clone(),
      initialRot: nepalArch.rotation.clone(),
      driftDir: tangent.clone().multiplyScalar(18.0),
      tumbleVel: new THREE.Vector3(4, 3, -3),
      material: nepalStoneMat
    });

    // Freight Truck crossing from China
    const truck = this.createDetailedTruck(0x1d6fa5);
    const trPos = new THREE.Vector3().copy(pt).addScaledVector(side, -3.2);
    trPos.y = deckY + 0.3;
    truck.position.copy(trPos);
    truck.quaternion.copy(baseQuat);
    this.group.add(truck);

    dynamicParts.push({
      mesh: truck,
      initialPos: trPos.clone(),
      initialRot: truck.rotation.clone(),
      driftDir: tangent.clone().multiplyScalar(28.0),
      tumbleVel: new THREE.Vector3(7, 6, 5),
      material: truck.userData.primaryMat
    });

    // Border Patrol Jeep on South span
    const jeep = this.createDetailedJeep(0xe74c3c);
    const jPos = new THREE.Vector3().copy(pt).addScaledVector(side, 3.2);
    jPos.y = deckY + 0.3;
    jeep.position.copy(jPos);
    jeep.quaternion.copy(baseQuat);
    this.group.add(jeep);

    dynamicParts.push({
      mesh: jeep,
      initialPos: jPos.clone(),
      initialRot: jeep.rotation.clone(),
      driftDir: tangent.clone().multiplyScalar(26.0),
      tumbleVel: new THREE.Vector3(6, 5, 4),
      material: jeep.userData.primaryMat
    });

    this.bridges.push({
      name: "Rasuwagadhi International Friendship Bridge",
      uTrigger: uPos,
      group: bridgeGroup,
      dynamicParts
    });
  }

  // 3. Mailung / Upper Trishuli 3A Hydropower Bailey Steel Truss Bridge
  createBaileyTrussBridge(uPos = 0.42) {
    const pt = this.river.getPointAt(uPos);
    const tangent = this.river.getTangentAt(uPos);
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();
    const actualUp = new THREE.Vector3().crossVectors(side, tangent).normalize();

    const basisMat = new THREE.Matrix4().makeBasis(tangent, actualUp, side);
    const baseQuat = new THREE.Quaternion().setFromRotationMatrix(basisMat);

    const bridgeGroup = new THREE.Group();
    const dynamicParts = [];

    const span = 16.0;
    const half = span * 0.5;
    const deckY = pt.y + 3.4;
    const deckW = 3.6;

    const steelTrussMat = new THREE.MeshStandardMaterial({ color: 0xd35400, metalness: 0.6, roughness: 0.4 });
    const darkSteelMat = new THREE.MeshStandardMaterial({ color: 0x2f3640, metalness: 0.7, roughness: 0.3 });
    const floorPlateMat = new THREE.MeshStandardMaterial({ color: 0x718093, metalness: 0.8, roughness: 0.3 });
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x95a5a6, roughness: 0.8 });

    for (const ab of [-half * 0.98, half * 0.98]) {
      const seatMesh = new THREE.Mesh(new THREE.BoxGeometry(deckW + 1.2, 3.2, 2.0), concreteMat);
      const abPos = new THREE.Vector3().copy(pt).addScaledVector(side, ab);
      abPos.y = this.terrain.getTerrainHeight(abPos.x, abPos.z) + 0.8;
      seatMesh.position.copy(abPos);
      seatMesh.quaternion.copy(baseQuat);
      this.group.add(seatMesh);
    }

    const spanConfigs = [
      { id: 'left', zCenter: -half * 0.5, driftScale: 25.0, tumble: new THREE.Vector3(5, 4, 6) },
      { id: 'right', zCenter: half * 0.5, driftScale: 27.0, tumble: new THREE.Vector3(6, 4, -5) }
    ];

    const segLen = half * 0.96;

    for (const sc of spanConfigs) {
      const bGroup = new THREE.Group();

      const deckMesh = new THREE.Mesh(new THREE.BoxGeometry(deckW, 0.25, segLen), floorPlateMat.clone());
      bGroup.add(deckMesh);

      const transCount = Math.floor(segLen / 1.4);
      for (let t = 0; t <= transCount; t++) {
        const tZ = (t / transCount - 0.5) * segLen * 0.95;
        const iBeam = new THREE.Mesh(new THREE.BoxGeometry(deckW + 0.4, 0.2, 0.15), darkSteelMat);
        iBeam.position.set(0, -0.2, tZ);
        bGroup.add(iBeam);
      }

      for (const trEdge of [-deckW * 0.5, deckW * 0.5]) {
        const bStringer = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, segLen), steelTrussMat);
        bStringer.position.set(trEdge, 0.12, 0);
        bGroup.add(bStringer);

        const tStringer = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, segLen), steelTrussMat);
        tStringer.position.set(trEdge, 1.45, 0);
        bGroup.add(tStringer);

        const panelCount = Math.floor(segLen / 1.4);
        for (let p = 0; p < panelCount; p++) {
          const pZ = (p / panelCount - 0.5 + 0.5 / panelCount) * segLen;

          const vPost = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.35, 0.12), steelTrussMat);
          vPost.position.set(trEdge, 0.8, pZ);
          bGroup.add(vPost);

          const diag1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.6, 0.08), steelTrussMat);
          diag1.position.set(trEdge, 0.8, pZ);
          diag1.rotation.x = 0.65;
          bGroup.add(diag1);

          const diag2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.6, 0.08), steelTrussMat);
          diag2.position.set(trEdge, 0.8, pZ);
          diag2.rotation.x = -0.65;
          bGroup.add(diag2);
        }
      }

      const spPos = new THREE.Vector3().copy(pt).addScaledVector(side, sc.zCenter);
      spPos.y = deckY;
      bGroup.position.copy(spPos);
      bGroup.quaternion.copy(baseQuat);
      this.group.add(bGroup);

      dynamicParts.push({
        mesh: bGroup,
        initialPos: spPos.clone(),
        initialRot: bGroup.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(sc.driftScale),
        tumbleVel: sc.tumble,
        material: deckMesh.material
      });
    }

    const tipper = this.createDetailedTruck(0xf39c12);
    const tipPos = new THREE.Vector3().copy(pt).addScaledVector(side, 1.2);
    tipPos.y = deckY + 0.3;
    tipper.position.copy(tipPos);
    tipper.quaternion.copy(baseQuat);
    this.group.add(tipper);

    dynamicParts.push({
      mesh: tipper,
      initialPos: tipPos.clone(),
      initialRot: tipper.rotation.clone(),
      driftDir: tangent.clone().multiplyScalar(28.0),
      tumbleVel: new THREE.Vector3(7, 5, 5),
      material: tipper.userData.primaryMat
    });

    this.bridges.push({
      name: "Upper Trishuli 3A Bailey Bridge",
      uTrigger: uPos,
      group: bridgeGroup,
      dynamicParts
    });
  }

  // 4. Betrawati Highway Concrete Girder Bridge (Heavy Center Pier, Girders, Bus & Jeep)
  createConcreteHighwayGirderBridge(uPos = 0.52) {
    const pt = this.river.getPointAt(uPos);
    const tangent = this.river.getTangentAt(uPos);
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();
    const actualUp = new THREE.Vector3().crossVectors(side, tangent).normalize();

    const basisMat = new THREE.Matrix4().makeBasis(tangent, actualUp, side);
    const baseQuat = new THREE.Quaternion().setFromRotationMatrix(basisMat);

    const bridgeGroup = new THREE.Group();
    const dynamicParts = [];

    const span = 18.0;
    const half = span * 0.5;
    const deckY = pt.y + 3.4;
    const deckW = 4.6;

    const concreteMat = new THREE.MeshStandardMaterial({ color: 0xd8dde2, roughness: 0.7 });
    const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x2c333a, roughness: 0.9 });
    const yellowLineMat = new THREE.MeshBasicMaterial({ color: 0xf1c40f });
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x7f8c8d, metalness: 0.8, roughness: 0.2 });

    // Center Concrete Pier with cutwater
    const pierGroup = new THREE.Group();
    const pierCol = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.8, 6.5, 12), concreteMat);
    pierGroup.add(pierCol);

    const cutwater = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2.8, 4), concreteMat);
    cutwater.rotation.z = Math.PI / 2;
    cutwater.rotation.y = Math.PI / 4;
    cutwater.position.set(-1.6, 0.2, 0);
    pierGroup.add(cutwater);

    const pierCap = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.7, 5.4), concreteMat);
    pierCap.position.set(0, 3.4, 0);
    pierGroup.add(pierCap);

    pierGroup.position.set(pt.x, pt.y + 0.8, pt.z);
    pierGroup.quaternion.copy(baseQuat);
    this.group.add(pierGroup);

    dynamicParts.push({
      mesh: pierGroup,
      initialPos: pierGroup.position.clone(),
      initialRot: pierGroup.rotation.clone(),
      driftDir: tangent.clone().multiplyScalar(15.0),
      tumbleVel: new THREE.Vector3(4, 2, 3),
      material: concreteMat
    });

    // Concrete Abutments
    for (const ab of [-half, half]) {
      const abMesh = new THREE.Mesh(new THREE.BoxGeometry(deckW + 0.8, 3.6, 2.2), concreteMat);
      const abPos = new THREE.Vector3().copy(pt).addScaledVector(side, ab);
      abPos.y = this.terrain.getTerrainHeight(abPos.x, abPos.z) + 1.2;
      abMesh.position.copy(abPos);
      abMesh.quaternion.copy(baseQuat);
      this.group.add(abMesh);
    }

    // Two Highway Concrete Spans
    const spanConfigs = [
      { id: 'left', zCenter: -half * 0.5, driftScale: 24.0, tumble: new THREE.Vector3(5, 3, 5) },
      { id: 'right', zCenter: half * 0.5, driftScale: 25.0, tumble: new THREE.Vector3(6, 4, -4) }
    ];

    const segLen = half * 0.96;

    for (const sc of spanConfigs) {
      const dGroup = new THREE.Group();

      const deckMesh = new THREE.Mesh(new THREE.BoxGeometry(deckW, 0.45, segLen), asphaltMat.clone());
      dGroup.add(deckMesh);

      const lineMesh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.02, segLen * 0.95), yellowLineMat);
      lineMesh.position.y = 0.24;
      dGroup.add(lineMesh);

      for (let g = -1.6; g <= 1.6; g += 1.05) {
        const girder = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, segLen), concreteMat);
        girder.position.set(g, -0.55, 0);
        dGroup.add(girder);
      }

      for (const edge of [-deckW * 0.5 + 0.15, deckW * 0.5 - 0.15]) {
        const jersey = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.65, segLen), concreteMat);
        jersey.position.set(edge, 0.45, 0);
        dGroup.add(jersey);
      }

      for (const lpZ of [-segLen * 0.28, segLen * 0.28]) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 2.2, 6), lampMat);
        pole.position.set(-deckW * 0.5 + 0.15, 1.35, lpZ);
        dGroup.add(pole);

        const luminaire = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, 0.15), lampMat);
        luminaire.position.set(-deckW * 0.5 + 0.35, 2.45, lpZ);
        dGroup.add(luminaire);
      }

      const spPos = new THREE.Vector3().copy(pt).addScaledVector(side, sc.zCenter);
      spPos.y = deckY;
      dGroup.position.copy(spPos);
      dGroup.quaternion.copy(baseQuat);
      this.group.add(dGroup);

      dynamicParts.push({
        mesh: dGroup,
        initialPos: spPos.clone(),
        initialRot: dGroup.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(sc.driftScale),
        tumbleVel: sc.tumble,
        material: deckMesh.material
      });
    }

    const bus = this.createDetailedBus(0x27ae60);
    const bPos = new THREE.Vector3().copy(pt).addScaledVector(side, -3.2);
    bPos.y = deckY + 0.3;
    bus.position.copy(bPos);
    bus.quaternion.copy(baseQuat);
    this.group.add(bus);

    dynamicParts.push({
      mesh: bus,
      initialPos: bPos.clone(),
      initialRot: bus.rotation.clone(),
      driftDir: tangent.clone().multiplyScalar(28.0),
      tumbleVel: new THREE.Vector3(8, 7, 5),
      material: bus.userData.primaryMat
    });

    const jeep = this.createDetailedJeep(0xf39c12);
    const jPos = new THREE.Vector3().copy(pt).addScaledVector(side, 3.4);
    jPos.y = deckY + 0.3;
    jeep.position.copy(jPos);
    jeep.quaternion.copy(baseQuat);
    this.group.add(jeep);

    dynamicParts.push({
      mesh: jeep,
      initialPos: jPos.clone(),
      initialRot: jeep.rotation.clone(),
      driftDir: tangent.clone().multiplyScalar(26.0),
      tumbleVel: new THREE.Vector3(7, 5, -5),
      material: jeep.userData.primaryMat
    });

    this.bridges.push({
      name: "Betrawati Highway Girder Bridge",
      uTrigger: uPos,
      group: bridgeGroup,
      dynamicParts
    });
  }

  // 5. Trishuli Bazaar Motorable Bridge (Multi-Pier, Blue Municipal Railings, Streetlights)
  createTrishuliBazaarBridge(uPos = 0.60) {
    const pt = this.river.getPointAt(uPos);
    const tangent = this.river.getTangentAt(uPos);
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();
    const actualUp = new THREE.Vector3().crossVectors(side, tangent).normalize();

    const basisMat = new THREE.Matrix4().makeBasis(tangent, actualUp, side);
    const baseQuat = new THREE.Quaternion().setFromRotationMatrix(basisMat);

    const bridgeGroup = new THREE.Group();
    const dynamicParts = [];

    const span = 19.0;
    const half = span * 0.5;
    const deckY = pt.y + 3.2;
    const deckW = 4.4;

    const concreteMat = new THREE.MeshStandardMaterial({ color: 0xd8dde2, roughness: 0.7 });
    const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x2c333a, roughness: 0.9 });
    const blueRailMat = new THREE.MeshStandardMaterial({ color: 0x2980b9, metalness: 0.6, roughness: 0.35 });

    for (const pZ of [-half * 0.35, half * 0.35]) {
      const pierCol = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.6, 5.5, 10), concreteMat);
      const pPos = new THREE.Vector3().copy(pt).addScaledVector(side, pZ);
      pPos.y = pt.y + 0.6;
      pierCol.position.copy(pPos);
      pierCol.quaternion.copy(baseQuat);
      this.group.add(pierCol);

      dynamicParts.push({
        mesh: pierCol,
        initialPos: pPos.clone(),
        initialRot: pierCol.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(15.0),
        tumbleVel: new THREE.Vector3(4, 3, 3),
        material: concreteMat
      });
    }

    const spanConfigs = [
      { id: 'left', zCenter: -half * 0.5, driftScale: 22.0, tumble: new THREE.Vector3(5, 3, 4) },
      { id: 'right', zCenter: half * 0.5, driftScale: 24.0, tumble: new THREE.Vector3(5, 3, -4) }
    ];

    const segLen = half * 0.96;

    for (const sc of spanConfigs) {
      const dGroup = new THREE.Group();

      const deckMesh = new THREE.Mesh(new THREE.BoxGeometry(deckW, 0.4, segLen), asphaltMat.clone());
      dGroup.add(deckMesh);

      for (const rEdge of [-deckW * 0.5 + 0.15, deckW * 0.5 - 0.15]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.65, segLen), blueRailMat);
        rail.position.set(rEdge, 0.45, 0);
        dGroup.add(rail);
      }

      const spPos = new THREE.Vector3().copy(pt).addScaledVector(side, sc.zCenter);
      spPos.y = deckY;
      dGroup.position.copy(spPos);
      dGroup.quaternion.copy(baseQuat);
      this.group.add(dGroup);

      dynamicParts.push({
        mesh: dGroup,
        initialPos: spPos.clone(),
        initialRot: dGroup.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(sc.driftScale),
        tumbleVel: sc.tumble,
        material: deckMesh.material
      });
    }

    const jeep = this.createDetailedJeep(0x2c3e50);
    const jPos = new THREE.Vector3().copy(pt).addScaledVector(side, 1.5);
    jPos.y = deckY + 0.3;
    jeep.position.copy(jPos);
    jeep.quaternion.copy(baseQuat);
    this.group.add(jeep);

    dynamicParts.push({
      mesh: jeep,
      initialPos: jPos.clone(),
      initialRot: jeep.rotation.clone(),
      driftDir: tangent.clone().multiplyScalar(26.0),
      tumbleVel: new THREE.Vector3(6, 4, 4),
      material: jeep.userData.primaryMat
    });

    this.bridges.push({
      name: "Trishuli Bazaar Motorable Bridge",
      uTrigger: uPos,
      group: bridgeGroup,
      dynamicParts
    });
  }

  // 6. Galchhi / Prithvi Highway Mega River Crossing (Multi-Pier, 4 Lanes, Guardrails, Sign Gantry)
  createGalchhiMegaBridge(uPos = 0.70) {
    const pt = this.river.getPointAt(uPos);
    const tangent = this.river.getTangentAt(uPos);
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();
    const actualUp = new THREE.Vector3().crossVectors(side, tangent).normalize();

    const basisMat = new THREE.Matrix4().makeBasis(tangent, actualUp, side);
    const baseQuat = new THREE.Quaternion().setFromRotationMatrix(basisMat);

    const bridgeGroup = new THREE.Group();
    const dynamicParts = [];

    const span = 22.0;
    const half = span * 0.5;
    const deckY = pt.y + 3.0;
    const deckW = 5.2;

    const concreteMat = new THREE.MeshStandardMaterial({ color: 0xd2dae2, roughness: 0.7 });
    const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x2c333a, roughness: 0.9 });
    const guardrailMat = new THREE.MeshStandardMaterial({ color: 0xdfe6e9, metalness: 0.8, roughness: 0.25 });
    const gantryMat = new THREE.MeshStandardMaterial({ color: 0x16a085, roughness: 0.5 });

    for (const pZ of [-half * 0.55, 0, half * 0.55]) {
      const pierCol = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, 5.0, 12), concreteMat);
      const pPos = new THREE.Vector3().copy(pt).addScaledVector(side, pZ);
      pPos.y = pt.y + 0.4;
      pierCol.position.copy(pPos);
      pierCol.quaternion.copy(baseQuat);
      this.group.add(pierCol);

      dynamicParts.push({
        mesh: pierCol,
        initialPos: pPos.clone(),
        initialRot: pierCol.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(14.0),
        tumbleVel: new THREE.Vector3(3, 2, 3),
        material: concreteMat
      });
    }

    const spanConfigs = [
      { id: 'left', zCenter: -half * 0.5, driftScale: 20.0, tumble: new THREE.Vector3(4, 2, 4) },
      { id: 'right', zCenter: half * 0.5, driftScale: 22.0, tumble: new THREE.Vector3(4, 2, -4) }
    ];

    const segLen = half * 0.96;

    for (const sc of spanConfigs) {
      const dGroup = new THREE.Group();

      const deckMesh = new THREE.Mesh(new THREE.BoxGeometry(deckW, 0.5, segLen), asphaltMat.clone());
      dGroup.add(deckMesh);

      const median = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, segLen), concreteMat);
      median.position.y = 0.35;
      dGroup.add(median);

      for (const gEdge of [-deckW * 0.5 + 0.15, deckW * 0.5 - 0.15]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, segLen), guardrailMat);
        rail.position.set(gEdge, 0.45, 0);
        dGroup.add(rail);
      }

      if (sc.id === 'left') {
        const gPillar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 6), guardrailMat);
        gPillar1.position.set(-deckW * 0.5 + 0.2, 1.8, 0);
        dGroup.add(gPillar1);

        const gPillar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 6), guardrailMat);
        gPillar2.position.set(deckW * 0.5 - 0.2, 1.8, 0);
        dGroup.add(gPillar2);

        const gBeam = new THREE.Mesh(new THREE.BoxGeometry(deckW, 0.2, 0.2), guardrailMat);
        gBeam.position.set(0, 3.3, 0);
        dGroup.add(gBeam);

        const signPlate = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.9, 0.08), gantryMat);
        signPlate.position.set(0, 3.3, 0);
        dGroup.add(signPlate);
      }

      const spPos = new THREE.Vector3().copy(pt).addScaledVector(side, sc.zCenter);
      spPos.y = deckY;
      dGroup.position.copy(spPos);
      dGroup.quaternion.copy(baseQuat);
      this.group.add(dGroup);

      dynamicParts.push({
        mesh: dGroup,
        initialPos: spPos.clone(),
        initialRot: dGroup.rotation.clone(),
        driftDir: tangent.clone().multiplyScalar(sc.driftScale),
        tumbleVel: sc.tumble,
        material: deckMesh.material
      });
    }

    const truck = this.createDetailedTruck(0xc0392b);
    const trPos = new THREE.Vector3().copy(pt).addScaledVector(side, -2.5);
    trPos.y = deckY + 0.3;
    truck.position.copy(trPos);
    truck.quaternion.copy(baseQuat);
    this.group.add(truck);

    dynamicParts.push({
      mesh: truck,
      initialPos: trPos.clone(),
      initialRot: truck.rotation.clone(),
      driftDir: tangent.clone().multiplyScalar(26.0),
      tumbleVel: new THREE.Vector3(6, 5, 4),
      material: truck.userData.primaryMat
    });

    this.bridges.push({
      name: "Galchhi Prithvi Highway Mega Bridge",
      uTrigger: uPos,
      group: bridgeGroup,
      dynamicParts
    });
  }

  /* ----------------------------------------------------
   * 100% REALISTIC VEHICLE BUILDERS
   * ---------------------------------------------------- */
  createDetailedBus(colorHex) {
    const bus = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.4, metalness: 0.2 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x1a252f, roughness: 0.1, metalness: 0.8 });
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 0.9 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xdfe6e9, metalness: 0.8, roughness: 0.2 });
    const luggageMat = new THREE.MeshStandardMaterial({ color: 0x34495e, roughness: 0.8 });

    const bodyGeo = new THREE.BoxGeometry(1.9, 1.4, 5.0);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 0.9;
    bodyMesh.castShadow = true;
    bus.add(bodyMesh);

    const windGeo = new THREE.BoxGeometry(1.82, 0.65, 0.1);
    const windMesh = new THREE.Mesh(windGeo, glassMat);
    windMesh.position.set(0, 1.1, -2.51);
    bus.add(windMesh);

    const sideGlassGeo = new THREE.BoxGeometry(1.92, 0.55, 3.8);
    const sideGlass = new THREE.Mesh(sideGlassGeo, glassMat);
    sideGlass.position.set(0, 1.1, 0.2);
    bus.add(sideGlass);

    const rackGeo = new THREE.BoxGeometry(1.6, 0.15, 3.6);
    const rackMesh = new THREE.Mesh(rackGeo, chromeMat);
    rackMesh.position.set(0, 1.68, 0.2);
    bus.add(rackMesh);

    for (let l = 0; l < 4; l++) {
      const lugGeo = new THREE.BoxGeometry(0.65, 0.35, 0.7);
      const lugMesh = new THREE.Mesh(lugGeo, luggageMat);
      lugMesh.position.set((l % 2 === 0 ? 0.35 : -0.35), 1.9, -0.9 + l * 0.75);
      bus.add(lugMesh);
    }

    const wheelGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.26, 12);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelZ = [-1.6, 0.9, 1.8];
    for (const wz of wheelZ) {
      for (const side of [-1, 1]) {
        const wheel = new THREE.Mesh(wheelGeo, rubberMat);
        wheel.position.set(side * 0.98, 0.36, wz);
        bus.add(wheel);
      }
    }

    const lightGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xfff3a1 });
    for (const side of [-1, 1]) {
      const light = new THREE.Mesh(lightGeo, lightMat);
      light.position.set(side * 0.7, 0.65, -2.52);
      bus.add(light);
    }

    bus.userData.primaryMat = bodyMat;
    return bus;
  }

  createDetailedJeep(colorHex) {
    const jeep = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.4, metalness: 0.2 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x1a252f, roughness: 0.1, metalness: 0.8 });

    const hoodGeo = new THREE.BoxGeometry(1.6, 0.7, 1.5);
    const hood = new THREE.Mesh(hoodGeo, bodyMat);
    hood.position.set(0, 0.6, -1.0);
    hood.castShadow = true;
    jeep.add(hood);

    const cabGeo = new THREE.BoxGeometry(1.6, 0.9, 1.8);
    const cab = new THREE.Mesh(cabGeo, bodyMat);
    cab.position.set(0, 1.05, 0.5);
    jeep.add(cab);

    const windGeo = new THREE.BoxGeometry(1.52, 0.65, 0.1);
    const wind = new THREE.Mesh(windGeo, glassMat);
    wind.position.set(0, 1.15, -0.42);
    jeep.add(wind);

    const bumperGeo = new THREE.BoxGeometry(1.7, 0.25, 0.25);
    const bumper = new THREE.Mesh(bumperGeo, blackMat);
    bumper.position.set(0, 0.35, -1.8);
    jeep.add(bumper);

    const wheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.26, 12);
    wheelGeo.rotateZ(Math.PI / 2);
    for (const wz of [-1.0, 0.9]) {
      for (const side of [-1, 1]) {
        const wheel = new THREE.Mesh(wheelGeo, blackMat);
        wheel.position.set(side * 0.86, 0.34, wz);
        jeep.add(wheel);
      }
    }

    const spare = new THREE.Mesh(wheelGeo, blackMat);
    spare.rotation.y = Math.PI / 2;
    spare.position.set(0, 0.9, 1.45);
    jeep.add(spare);

    jeep.userData.primaryMat = bodyMat;
    return jeep;
  }

  createDetailedTruck(colorHex) {
    const truck = new THREE.Group();

    const cabMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.4, metalness: 0.3 });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x1a252f, roughness: 0.1, metalness: 0.8 });

    const cabGeo = new THREE.BoxGeometry(1.8, 1.5, 1.8);
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(0, 1.25, -1.8);
    cab.castShadow = true;
    truck.add(cab);

    const wind = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.7, 0.1), glassMat);
    wind.position.set(0, 1.4, -2.72);
    truck.add(wind);

    const frameGeo = new THREE.BoxGeometry(1.7, 0.4, 4.4);
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(0, 0.7, 0.6);
    truck.add(frame);

    const cont = this.createCorrugatedContainer(0xf39c12);
    cont.position.set(0, 1.6, 0.6);
    truck.add(cont);

    const wGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 12);
    wGeo.rotateZ(Math.PI / 2);
    for (const wz of [-1.8, 1.4, 2.3]) {
      for (const side of [-1, 1]) {
        const wheel = new THREE.Mesh(wGeo, frameMat);
        wheel.position.set(side * 0.94, 0.4, wz);
        truck.add(wheel);
      }
    }

    truck.userData.primaryMat = cabMat;
    return truck;
  }

  createCorrugatedContainer(colorHex) {
    const group = new THREE.Group();
    const contMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.55, metalness: 0.35 });
    const cornerMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });

    const box = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.4, 4.6), contMat);
    box.castShadow = true;
    group.add(box);

    const postGeo = new THREE.BoxGeometry(0.12, 1.44, 0.12);
    for (const px of [-1.15, 1.15]) {
      for (const pz of [-2.3, 2.3]) {
        const post = new THREE.Mesh(postGeo, cornerMat);
        post.position.set(px, 0, pz);
        group.add(post);
      }
    }

    group.userData.primaryMat = contMat;
    return group;
  }

  /* ====================================================
   * 4C. 100% REALISTIC HIMALAYAN & NEPALI BUILDINGS
   * ==================================================== */

  // 1. Authentic Himalayan Trekking Lodge (Fieldstone ground floor, wood upper floor, cantilevered balcony, CGI gabled tin roof, chimney/solar heater, and signboard)
  createDetailedTrekkingLodge(bw, bh, bd, roofCol) {
    const group = new THREE.Group();
    const materials = [];

    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x5d666d, roughness: 0.95 });
    const plasterMat = new THREE.MeshStandardMaterial({ color: 0xf1f2f6, roughness: 0.8 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x433224, roughness: 0.85 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x1e272e, roughness: 0.1, metalness: 0.8 });
    const roofMat = new THREE.MeshStandardMaterial({ color: roofCol, roughness: 0.5, metalness: 0.25 });
    const signMat = new THREE.MeshStandardMaterial({ color: 0xf39c12, roughness: 0.6 });
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x1e272e, roughness: 0.2, metalness: 0.7 });
    const tankMat = new THREE.MeshStandardMaterial({ color: 0xdfe6e9, roughness: 0.3, metalness: 0.8 });

    materials.push(stoneMat, plasterMat, woodMat, glassMat, roofMat, signMat, solarMat, tankMat);

    // Ground floor (Himalayan stone masonry)
    const gH = bh * 0.48;
    const gMesh = new THREE.Mesh(new THREE.BoxGeometry(bw, gH, bd), stoneMat);
    gMesh.position.y = gH * 0.5;
    group.add(gMesh);

    // Dark timber entrance door with stone stoop
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 0.1), woodMat);
    door.position.set(0, 0.8, bd * 0.5 + 0.05);
    group.add(door);

    const stoop = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 0.6), stoneMat);
    stoop.position.set(0, 0.1, bd * 0.5 + 0.3);
    group.add(stoop);

    // Ground floor timber-framed windows
    for (const s of [-1, 1]) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.08), glassMat);
      win.position.set(s * (bw * 0.3), 1.0, bd * 0.5 + 0.05);
      group.add(win);

      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.95, 0.06), woodMat);
      frame.position.set(s * (bw * 0.3), 1.0, bd * 0.5 + 0.04);
      group.add(frame);
    }

    // Upper floor (Plaster & alpine timber)
    const uH = bh * 0.52;
    const uMesh = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.98, uH, bd * 0.98), plasterMat);
    uMesh.position.y = gH + uH * 0.5;
    group.add(uMesh);

    // Upper multi-pane windows
    for (const s of [-1, 0, 1]) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.8, 0.08), glassMat);
      win.position.set(s * (bw * 0.28), gH + uH * 0.55, bd * 0.49 + 0.05);
      group.add(win);

      const sill = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.08, 0.12), woodMat);
      sill.position.set(s * (bw * 0.28), gH + uH * 0.55 - 0.44, bd * 0.49 + 0.06);
      group.add(sill);
    }

    // Cantilevered wooden balcony
    const balcW = bw * 0.88;
    const balcD = 0.75;
    const balcFloor = new THREE.Mesh(new THREE.BoxGeometry(balcW, 0.1, balcD), woodMat);
    balcFloor.position.set(0, gH + 0.05, bd * 0.49 + balcD * 0.5);
    group.add(balcFloor);

    const balcRail = new THREE.Mesh(new THREE.BoxGeometry(balcW, 0.55, 0.04), woodMat);
    balcRail.position.set(0, gH + 0.38, bd * 0.49 + balcD);
    group.add(balcRail);

    for (const bX of [-balcW * 0.35, balcW * 0.35]) {
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.08), woodMat);
      bracket.rotation.x = 0.7;
      bracket.position.set(bX, gH - 0.2, bd * 0.49 + 0.25);
      group.add(bracket);
    }

    // CGI Gabled Tin Roof with overhangs
    const roofH = 1.35;
    const roofMesh = new THREE.Mesh(new THREE.ConeGeometry(Math.max(bw, bd) * 0.86, roofH, 4), roofMat);
    roofMesh.position.y = bh + roofH * 0.5;
    roofMesh.rotation.y = Math.PI * 0.25;
    group.add(roofMesh);

    const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, bd + 0.4), woodMat);
    ridge.position.y = bh + roofH;
    group.add(ridge);

    // Wooden Lodge Signboard
    const sign = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.32, 0.06), signMat);
    sign.position.set(0, gH + 0.8, bd * 0.49 + 0.06);
    group.add(sign);

    // Rooftop accessory: Solar water heater or stone chimney
    if (Math.random() > 0.4) {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.1, 8), tankMat);
      tank.rotation.z = Math.PI / 2;
      tank.position.set(bw * 0.22, bh + roofH * 0.6, 0);
      group.add(tank);

      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 0.7), solarMat);
      panel.rotation.x = 0.5;
      panel.position.set(bw * 0.22, bh + roofH * 0.45, 0.4);
      group.add(panel);
    } else {
      const chim = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.2, 0.45), stoneMat);
      chim.position.set(-bw * 0.25, bh + roofH * 0.6, -bd * 0.2);
      group.add(chim);
    }

    return { group, materials };
  }

  // 2. Authentic Nepali Bazaar Shophouse (RCC frame, steel roll-up dhoka, awning, balconies, parapet & black Sintex water tank)
  createDetailedBazaarShophouse(bw, bh, bd, facadeCol, shutterCol) {
    const group = new THREE.Group();
    const materials = [];

    const facadeMat = new THREE.MeshStandardMaterial({ color: facadeCol, roughness: 0.75 });
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x95a5a6, roughness: 0.8 });
    const shutterMat = new THREE.MeshStandardMaterial({ color: shutterCol, roughness: 0.45, metalness: 0.5 });
    const awningMat = new THREE.MeshStandardMaterial({ color: 0xe67e22, roughness: 0.6 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.1, metalness: 0.8 });
    const sintexMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });
    const railMat = new THREE.MeshStandardMaterial({ color: 0xdfe6e9, metalness: 0.8, roughness: 0.3 });

    materials.push(facadeMat, concreteMat, shutterMat, awningMat, glassMat, sintexMat, railMat);

    const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), facadeMat);
    wallMesh.position.y = bh * 0.5;
    group.add(wallMesh);

    for (const cX of [-bw * 0.5, bw * 0.5]) {
      for (const cZ of [-bd * 0.5, bd * 0.5]) {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.28, bh + 0.1, 0.28), concreteMat);
        col.position.set(cX, (bh + 0.1) * 0.5, cZ);
        group.add(col);
      }
    }

    const shutterW = bw * 0.76;
    const shutterH = Math.min(2.1, bh * 0.42);
    const shutter = new THREE.Mesh(new THREE.BoxGeometry(shutterW, shutterH, 0.08), shutterMat);
    shutter.position.set(0, shutterH * 0.5, bd * 0.5 + 0.04);
    group.add(shutter);

    const awning = new THREE.Mesh(new THREE.BoxGeometry(shutterW * 1.05, 0.06, 0.8), awningMat);
    awning.rotation.x = 0.35;
    awning.position.set(0, shutterH + 0.15, bd * 0.5 + 0.35);
    group.add(awning);

    const floorH = bh / 2;
    const winW = 0.7, winH = 0.9;
    for (const wX of [-bw * 0.26, bw * 0.26]) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(winW, winH, 0.08), glassMat);
      win.position.set(wX, floorH + 0.9, bd * 0.5 + 0.04);
      group.add(win);

      const sill = new THREE.Mesh(new THREE.BoxGeometry(winW + 0.15, 0.08, 0.12), concreteMat);
      sill.position.set(wX, floorH + 0.42, bd * 0.5 + 0.06);
      group.add(sill);
    }

    const balcW = bw * 0.85;
    const balcD = 0.65;
    const balcFloor = new THREE.Mesh(new THREE.BoxGeometry(balcW, 0.1, balcD), concreteMat);
    balcFloor.position.set(0, floorH + 0.05, bd * 0.5 + balcD * 0.5);
    group.add(balcFloor);

    const balcRail = new THREE.Mesh(new THREE.BoxGeometry(balcW, 0.55, 0.04), railMat);
    balcRail.position.set(0, floorH + 0.35, bd * 0.5 + balcD);
    group.add(balcRail);

    const parapet = new THREE.Mesh(new THREE.BoxGeometry(bw, 0.45, 0.12), concreteMat);
    parapet.position.set(0, bh + 0.22, bd * 0.5 - 0.06);
    group.add(parapet);

    const tankPad = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.25, 0.85), concreteMat);
    tankPad.position.set(-bw * 0.25, bh + 0.12, -bd * 0.2);
    group.add(tankPad);

    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.85, 10), sintexMat);
    tank.position.set(-bw * 0.25, bh + 0.68, -bd * 0.2);
    group.add(tank);

    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.1, 8), sintexMat);
    lid.position.set(-bw * 0.25, bh + 1.15, -bd * 0.2);
    group.add(lid);

    return { group, materials };
  }

  // 3. Official Rasuwagadhi Border Customs & Immigration Complex
  createDetailedBorderCustomsBuilding() {
    const group = new THREE.Group();
    const materials = [];

    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf1f2f6, roughness: 0.8 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x1e3799, roughness: 0.6 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.1, metalness: 0.8 });
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x95a5a6, roughness: 0.8 });
    const antennaMat = new THREE.MeshStandardMaterial({ color: 0xdfe6e9, metalness: 0.9, roughness: 0.2 });

    materials.push(wallMat, blueMat, glassMat, concreteMat, antennaMat);

    const bw = 9.0, bh = 5.2, bd = 7.0;

    const mainMesh = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), wallMat);
    mainMesh.position.y = bh * 0.5;
    group.add(mainMesh);

    const stripe = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.1, 0.45, bd + 0.1), blueMat);
    stripe.position.y = bh * 0.5;
    group.add(stripe);

    const porticoW = 3.8, porticoD = 2.4;
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(porticoW, 0.35, porticoD), blueMat);
    canopy.position.set(0, 2.6, bd * 0.5 + porticoD * 0.5);
    group.add(canopy);

    for (const cX of [-porticoW * 0.45, porticoW * 0.45]) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.5, 8), concreteMat);
      col.position.set(cX, 1.25, bd * 0.5 + porticoD - 0.2);
      group.add(col);
    }

    for (const fY of [1.4, 3.8]) {
      for (let w = -2; w <= 2; w++) {
        if (fY === 1.4 && w === 0) continue;
        const win = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 0.08), glassMat);
        win.position.set(w * 1.6, fY, bd * 0.5 + 0.05);
        group.add(win);
      }
    }

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 3.6, 6), antennaMat);
    mast.position.set(-bw * 0.3, bh + 1.8, -bd * 0.2);
    group.add(mast);

    const dish = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.25, 12), antennaMat);
    dish.rotation.x = -0.6;
    dish.position.set(bw * 0.3, bh + 0.8, -bd * 0.2);
    group.add(dish);

    return { group, materials };
  }

  // 4. Dry Port Cargo Clearing Warehouse
  createDetailedDryPortWarehouse() {
    const group = new THREE.Group();
    const materials = [];

    const steelWallMat = new THREE.MeshStandardMaterial({ color: 0x747d8c, roughness: 0.6, metalness: 0.4 });
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x2f3542, roughness: 0.5 });
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0xa4b0be, roughness: 0.85 });

    materials.push(steelWallMat, doorMat, concreteMat);

    const bw = 11.0, bh = 4.8, bd = 6.5;

    const dock = new THREE.Mesh(new THREE.BoxGeometry(bw + 1.0, 0.8, bd + 1.4), concreteMat);
    dock.position.y = 0.4;
    group.add(dock);

    const shed = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), steelWallMat);
    shed.position.y = 0.8 + bh * 0.5;
    group.add(shed);

    for (const dX of [-bw * 0.28, bw * 0.28]) {
      const bay = new THREE.Mesh(new THREE.BoxGeometry(3.0, 3.2, 0.1), doorMat);
      bay.position.set(dX, 0.8 + 1.6, bd * 0.5 + 0.05);
      group.add(bay);
    }

    return { group, materials };
  }

  // 5. Mailung / Upper Trishuli 3A Industrial Hydro Powerhouse Complex
  createDetailedHydroPowerhouseComplex() {
    const group = new THREE.Group();
    const materials = [];

    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x7f8c8d, roughness: 0.8 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.6 });
    const louverMat = new THREE.MeshStandardMaterial({ color: 0x34495e, roughness: 0.5 });
    const transMat = new THREE.MeshStandardMaterial({ color: 0x576574, metalness: 0.6, roughness: 0.4 });
    const bushingMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.4 });
    const gantryMat = new THREE.MeshStandardMaterial({ color: 0xdfe6e9, metalness: 0.8, roughness: 0.2 });

    materials.push(concreteMat, darkMat, louverMat, transMat, bushingMat, gantryMat);

    const bw = 10.0, bh = 6.8, bd = 13.0;

    const hall = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), concreteMat);
    hall.position.y = bh * 0.5;
    group.add(hall);

    for (let z = -bd * 0.4; z <= bd * 0.4; z += bd * 0.25) {
      for (const side of [-bw * 0.5 - 0.15, bw * 0.5 + 0.15]) {
        const buttress = new THREE.Mesh(new THREE.BoxGeometry(0.35, bh, 0.65), concreteMat);
        buttress.position.set(side, bh * 0.5, z);
        group.add(buttress);
      }
    }

    const eqDoor = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.4, 0.1), darkMat);
    eqDoor.position.set(0, 2.2, bd * 0.5 + 0.05);
    group.add(eqDoor);

    for (let z = -bd * 0.35; z <= bd * 0.35; z += 2.2) {
      const louver = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.15, 0.75, 1.4), louverMat);
      louver.position.set(0, bh - 0.75, z);
      group.add(louver);
    }

    // Outdoor Transformer Substation Yard
    const transYard = new THREE.Group();
    const pad = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.4, 10.0), concreteMat);
    pad.position.set(bw * 0.5 + 2.8, 0.2, 0);
    transYard.add(pad);

    for (let t = -1; t <= 1; t++) {
      const tZ = t * 3.2;
      const tMesh = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.2, 1.8), transMat);
      tMesh.position.set(bw * 0.5 + 2.8, 1.4, tZ);
      transYard.add(tMesh);

      for (const finX of [-0.9, 0.9]) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.8, 1.6), transMat);
        fin.position.set(bw * 0.5 + 2.8 + finX, 1.4, tZ);
        transYard.add(fin);
      }

      const cons = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.4, 8), transMat);
      cons.rotation.x = Math.PI / 2;
      cons.position.set(bw * 0.5 + 2.8, 2.7, tZ);
      transYard.add(cons);

      for (const bX of [-0.5, 0, 0.5]) {
        const bushing = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.12, 0.85, 6), bushingMat);
        bushing.position.set(bw * 0.5 + 2.8 + bX, 3.0, tZ);
        transYard.add(bushing);
      }
    }

    const gantryP1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 5.5, 6), gantryMat);
    gantryP1.position.set(bw * 0.5 + 1.2, 2.75, 4.0);
    transYard.add(gantryP1);
    const gantryP2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 5.5, 6), gantryMat);
    gantryP2.position.set(bw * 0.5 + 4.4, 2.75, 4.0);
    transYard.add(gantryP2);
    const gantryBeam = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.2, 0.2), gantryMat);
    gantryBeam.position.set(bw * 0.5 + 2.8, 5.4, 4.0);
    transYard.add(gantryBeam);

    group.add(transYard);

    return { group, materials };
  }

  // 6. Dam Operations & Intake Gatehouse
  createDetailedDamGatehouse() {
    const group = new THREE.Group();
    const materials = [];

    const concreteMat = new THREE.MeshStandardMaterial({ color: 0xd8dde2, roughness: 0.65 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x1e272e, roughness: 0.1, metalness: 0.8 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x2f3542, roughness: 0.5 });

    materials.push(concreteMat, glassMat, metalMat);

    const bw = 7.5, bh = 5.2, bd = 6.5;

    const base = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), concreteMat);
    base.position.y = bh * 0.5;
    group.add(base);

    const ctrlW = bw * 0.85, ctrlH = 1.8, ctrlD = 3.2;
    const ctrlMesh = new THREE.Mesh(new THREE.BoxGeometry(ctrlW, ctrlH, ctrlD), concreteMat);
    ctrlMesh.position.set(0, bh + ctrlH * 0.5, 0.6);
    group.add(ctrlMesh);

    const win = new THREE.Mesh(new THREE.BoxGeometry(ctrlW * 0.9, 1.1, 0.1), glassMat);
    win.position.set(0, bh + ctrlH * 0.5, 0.6 + ctrlD * 0.5 + 0.05);
    group.add(win);

    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 4.0, 6), metalMat);
    antenna.position.set(ctrlW * 0.35, bh + ctrlH + 2.0, 0);
    group.add(antenna);

    return { group, materials };
  }

  /* ----------------------------------------------------
   * 5. REALISTIC PROCEDURAL HIMALAYAN CLOUDS (SOFT VOLUMETRIC PUFFS)
   * ---------------------------------------------------- */
  initRealisticClouds() {
    this.cloudGroup = new THREE.Group();
    this.group.add(this.cloudGroup);

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 60);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    grad.addColorStop(0.3, 'rgba(245, 250, 255, 0.65)');
    grad.addColorStop(0.65, 'rgba(230, 240, 250, 0.28)');
    grad.addColorStop(1, 'rgba(215, 230, 245, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const cloudTexture = new THREE.CanvasTexture(canvas);
    this.cloudSprites = [];

    const cloudCenters = [
      { x: -96, y: 58, z: -88, count: 28, radius: 24 }, // Langtang Lirung summit shroud
      { x: -70, y: 48, z: -40, count: 22, radius: 20 },
      { x: -20, y: 42, z: -55, count: 25, radius: 22 },
      { x: 35,  y: 36, z: 10,  count: 24, radius: 25 },
      { x: 75,  y: 44, z: -8,  count: 26, radius: 22 },
      { x: 55,  y: 35, z: 62,  count: 20, radius: 20 },
      { x: -10, y: 32, z: 65,  count: 22, radius: 22 },
      { x: -110,y: 65, z: -105,count: 30, radius: 28 }
    ];

    cloudCenters.forEach((cc, cIdx) => {
      const clusterGroup = new THREE.Group();
      clusterGroup.position.set(cc.x, cc.y, cc.z);

      for (let p = 0; p < cc.count; p++) {
        const spriteMat = new THREE.SpriteMaterial({
          map: cloudTexture,
          transparent: true,
          opacity: 0.42 + Math.random() * 0.25,
          color: new THREE.Color(0xf6faff),
          depthWrite: false
        });

        const sprite = new THREE.Sprite(spriteMat);
        const scale = 12.0 + Math.random() * 16.0;
        sprite.scale.set(scale, scale * 0.65, 1);

        sprite.position.set(
          (Math.random() - 0.5) * cc.radius * 1.8,
          (Math.random() - 0.5) * cc.radius * 0.45,
          (Math.random() - 0.5) * cc.radius * 1.8
        );
        clusterGroup.add(sprite);
      }

      this.cloudGroup.add(clusterGroup);
      this.cloudSprites.push({
        group: clusterGroup,
        baseX: cc.x,
        driftSpeed: 0.15 + (cIdx % 3) * 0.08
      });
    });
  }

  /* ----------------------------------------------------
   * 6. FLOATING 3D LANDMARK BADGES
   * ---------------------------------------------------- */
  initLandmarkBadges() {
    this.badgeGroup = new THREE.Group();
    this.group.add(this.badgeGroup);

    const landmarks = [
      { u: 0.02, name: "LANGTANG LIRUNG", tag: "COLLAPSE ORIGIN (08:37)", yOffset: 16.0 },
      { u: 0.10, name: "RASUWAGADHI DAM", tag: "111 MW HYDRO (08:50)", yOffset: 12.0 },
      { u: 0.22, name: "LANGTANG GORGE", tag: "134M TRIMLINES", yOffset: 12.0 },
      { u: 0.30, name: "SYABRUBESI", tag: "SETTLEMENT HIT (09:00)", yOffset: 12.0 },
      { u: 0.42, name: "HYDRO CORRIDOR", tag: "431 MW OFFLINE", yOffset: 12.0 },
      { u: 0.52, name: "BETRAWATI", tag: "GAUGE LOST (09:20)", yOffset: 12.0 },
      { u: 0.66, name: "GALCHHI", tag: "+9M SURGE (09:40)", yOffset: 12.0 },
      { u: 0.90, name: "RUNOUT TO INDIA", tag: "240 KM CORRIDOR", yOffset: 12.0 }
    ];

    landmarks.forEach(lm => {
      const pt = this.river.getPointAt(lm.u);
      const sprite = this.createBadgeSprite(lm.name, lm.tag);
      sprite.position.set(pt.x, pt.y + lm.yOffset, pt.z);
      this.badgeGroup.add(sprite);

      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(pt.x, pt.y + lm.yOffset - 1.5, pt.z),
        new THREE.Vector3(pt.x, pt.y + 0.5, pt.z)
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xe8952f,
        transparent: true,
        opacity: 0.6
      });
      const line = new THREE.Line(lineGeo, lineMat);
      this.badgeGroup.add(line);
    });
  }

  createBadgeSprite(title, subtitle) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 260;
    const ctx = canvas.getContext('2d');

    // High-contrast modern GIS place placard background
    ctx.fillStyle = 'rgba(7, 16, 28, 0.94)';
    ctx.strokeStyle = '#f59e0b'; // Radiant amber-gold border
    ctx.lineWidth = 6;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(16, 16, 992, 228, 24);
    } else if (typeof ctx.rect === 'function') {
      ctx.rect(16, 16, 992, 228);
    }
    ctx.fill();
    ctx.stroke();

    // Subtle dark upper highlight banner
    ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(20, 20, 984, 56, [20, 20, 0, 0]);
    } else if (typeof ctx.rect === 'function') {
      ctx.rect(20, 20, 984, 56);
    }
    ctx.fill();

    // Sector / Location Tag Pill
    ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(125, 28, 170, 36, 8);
    } else if (typeof ctx.rect === 'function') {
      ctx.rect(125, 28, 170, 36);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText("KEY LANDMARK", 138, 53);

    // Glowing Map Pin / Beacon Dot on the left
    const cx = 68, cy = 130;
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 38, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fill();

    // Title rendering with dynamic scaling to fit available width safely
    const maxTitleW = 840;
    let titleFontSize = 46;
    ctx.font = `bold ${titleFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    let measuredTitleW = (typeof ctx.measureText === 'function') ? ctx.measureText(title).width : (title.length * 24);
    if (measuredTitleW > maxTitleW) {
      titleFontSize = Math.max(28, Math.floor(titleFontSize * (maxTitleW / measuredTitleW)));
      ctx.font = `bold ${titleFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillText(title, 125, 126);

    // Subtitle rendering with dynamic scaling
    const maxSubW = 840;
    let subFontSize = 28;
    ctx.font = `bold ${subFontSize}px "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace`;
    let measuredSubW = (typeof ctx.measureText === 'function') ? ctx.measureText(subtitle).width : (subtitle.length * 16);
    if (measuredSubW > maxSubW) {
      subFontSize = Math.max(20, Math.floor(subFontSize * (maxSubW / measuredSubW)));
      ctx.font = `bold ${subFontSize}px "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace`;
    }

    ctx.fillStyle = '#38bdf8'; // High-contrast luminous cyan for subtitle
    ctx.fillText(subtitle, 125, 185);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false, // NEVER occluded by buildings, trees or terrain!
      depthWrite: false
    });

    const sprite = new THREE.Sprite(spriteMat);
    sprite.renderOrder = 9999;
    sprite.scale.set(22.0, 5.6, 1.0); // Prominent, clearly visible from simulation camera distance
    return sprite;
  }

  addPlaceBoard(name, subtitle, u, offset) {
    const sprite = this.createBadgeSprite(name, subtitle);
    const pt = this.river.getPointAt(u);
    const boardPos = pt.clone().add(offset);
    sprite.position.copy(boardPos);
    this.group.add(sprite);

    // Tether Line & Anchor Ring linking the board directly to the ground / water
    const groundY = (this.terrain && typeof this.terrain.getTerrainHeight === 'function')
      ? this.terrain.getTerrainHeight(boardPos.x, boardPos.z)
      : pt.y;

    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(boardPos.x, boardPos.y - 2.8, boardPos.z),
      new THREE.Vector3(boardPos.x, groundY + 0.3, boardPos.z)
    ]);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.75,
      depthWrite: false
    });
    const tetherLine = new THREE.Line(lineGeo, lineMat);
    tetherLine.renderOrder = 9998;
    this.group.add(tetherLine);

    // Glowing ground anchor ring
    const ringGeo = new THREE.RingGeometry(1.6, 2.4, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const anchorRing = new THREE.Mesh(ringGeo, ringMat);
    anchorRing.rotation.x = -Math.PI * 0.5;
    anchorRing.position.set(boardPos.x, groundY + 0.35, boardPos.z);
    anchorRing.renderOrder = 9998;
    this.group.add(anchorRing);

    this.landmarkBadges.push({ sprite, tetherLine, anchorRing, u });
    return sprite;
  }

  /* ----------------------------------------------------
   * 7. ACTIVE WAYPOINT RING & ATMOSPHERE
   * ---------------------------------------------------- */
  initWaypointMarker() {
    const ringGeo = new THREE.RingGeometry(4.2, 5.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xe8952f,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.waypointRing = new THREE.Mesh(ringGeo, ringMat);
    this.waypointRing.rotation.x = -Math.PI / 2;
    this.group.add(this.waypointRing);

    this.beaconLight = new THREE.PointLight(0xe8952f, 2.0, 30);
    this.group.add(this.beaconLight);
  }

  initAtmosphere() {
    this.rainEnabled = false;

    const rainCount = 3000;
    const rainGeo = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(rainCount * 3);
    const rainVelocities = new Float32Array(rainCount);

    for (let i = 0; i < rainCount; i++) {
      rainPositions[i * 3 + 0] = (Math.random() - 0.5) * 240;
      rainPositions[i * 3 + 1] = Math.random() * 120;
      rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 240;
      rainVelocities[i] = 2.0 + Math.random() * 2.0;
    }

    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));

    const rainMat = new THREE.PointsMaterial({
      color: 0xcbe4f7,
      size: 0.35,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });

    this.rainSystem = new THREE.Points(rainGeo, rainMat);
    this.rainSystem.visible = false;
    this.rainPositions = rainPositions;
    this.rainVelocities = rainVelocities;
    this.rainCount = rainCount;
    this.group.add(this.rainSystem);

    this.mistPlane = { visible: false };
  }

  setRainVisible(visible) {
    this.rainEnabled = visible;
    if (this.rainSystem) this.rainSystem.visible = visible;
  }

  updateSurgeFront(uWave) {
    if (!this.river) return;
    const wavePos = this.river.getPointAt(uWave);
    const waveTangent = this.river.getTangentAt(uWave);

    if (this.floodGroup) {
      this.floodGroup.position.set(wavePos.x, wavePos.y + 0.6, wavePos.z);
      const lookTarget = wavePos.clone().add(waveTangent);
      this.floodGroup.lookAt(lookTarget.x, wavePos.y + 0.6, lookTarget.z);
    }

    if (this.sprayParticles && this.sprayParticles.length > 0) {
      const time = Date.now() * 0.005;
      for (const sp of this.sprayParticles) {
        const bounce = Math.sin(time * sp.speed + sp.phase);
        sp.mesh.position.set(
          sp.basePos.x + Math.cos(time * 2.0 + sp.phase) * 0.6,
          sp.basePos.y + Math.max(0, bounce) * 1.5,
          sp.basePos.z + Math.sin(time * 2.0 + sp.phase) * 0.8
        );
        sp.mesh.rotation.x += 0.08;
        sp.mesh.rotation.y += 0.10;
      }
    }

    if (this.waveApron) {
      this.waveApron.rotation.x = -Math.PI / 2 + Math.sin(Date.now() * 0.008) * 0.08;
    }

    if (this.trailObj) {
      this.river.updateFloodTrail(this.trailObj, uWave);
    }

    if (this.waypointRing) {
      const wpPt = this.river.getPointAt(uWave);
      this.waypointRing.position.set(wpPt.x, wpPt.y + 0.3, wpPt.z);
    }
  }

  animateRain(speed = 3.0) {
    if (this.rainSystem && this.rainSystem.visible) {
      const pos = this.rainSystem.geometry.attributes.position;
      const count = pos.count;
      for (let i = 0; i < count; i++) {
        let y = pos.getY(i) - speed;
        if (y < 0) y = 140;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }
  }

  updateWipeableItems(uWave) {
    if (!this.wipeableItems || this.wipeableItems.length === 0) return;

    for (const item of this.wipeableItems) {
      if (!item || !item.mesh) continue;

      if (uWave < item.uTrigger) {
        item.mesh.visible = true;
        item.mesh.position.copy(item.initialPos);
        item.mesh.rotation.copy(item.initialRot);
        if (item.material) {
          item.material.transparent = false;
          item.material.opacity = 1.0;
        } else if (item.materials) {
          for (const m of item.materials) {
            m.transparent = false;
            m.opacity = 1.0;
          }
        }
      } else {
        const washProgress = (uWave - item.uTrigger);
        const maxProg = Math.max(item.maxProg || 0.14, 0.14);

        if (washProgress < maxProg) {
          item.mesh.visible = true;
          const progressRatio = washProgress / maxProg;

          const normDrift = item.driftDir ? item.driftDir.clone().normalize() : new THREE.Vector3(0, 0, 1);

          // 1. Foundation failure: tilt up to 45-60 degrees toward current
          const tiltFactor = Math.sin(progressRatio * Math.PI * 0.5);
          const tiltZ = (item.collapseTilt || 0.70) * tiltFactor;
          const tiltX = (item.collapseTiltX || 0.35) * tiltFactor;
          item.mesh.rotation.z = item.initialRot.z + tiltZ;
          item.mesh.rotation.x = item.initialRot.x + tiltX;

          // For lighter items, add tumble rotation
          if (item.tumbleVel) {
            const tumbleScale = Math.pow(progressRatio, 1.2) * 3.5;
            item.mesh.rotation.x = item.initialRot.x + item.tumbleVel.x * tumbleScale;
            item.mesh.rotation.y = item.initialRot.y + item.tumbleVel.y * tumbleScale;
            item.mesh.rotation.z = item.initialRot.z + item.tumbleVel.z * tumbleScale;
          }

          // 2. Foundation scour and downward sinking into the bed
          const sinkDist = Math.pow(progressRatio, 1.4) * (item.sinkScale ? item.sinkScale * 25.0 : 7.0);

          // 3. Drift downriver
          const driftDist = Math.pow(progressRatio, 1.6) * (item.washSpeed ? item.washSpeed * 0.45 : 15.0);

          item.mesh.position.copy(item.initialPos)
            .addScaledVector(normDrift, driftDist)
            .add(new THREE.Vector3(0, -sinkDist, 0));

          // 4. Retain high opacity while visibly collapsing; only dissolve near end of submersion
          const fade = progressRatio < 0.65 ? 1.0 : Math.max(0.0, 1.0 - (progressRatio - 0.65) / 0.35);
          if (item.material) {
            item.material.transparent = true;
            item.material.opacity = fade;
          } else if (item.materials) {
            for (const m of item.materials) {
              m.transparent = true;
              m.opacity = fade;
            }
          }
        } else {
          item.mesh.visible = false;
        }
      }
    }
  }

  /* ----------------------------------------------------
   * 8. FRAME SIMULATION UPDATE
   * ---------------------------------------------------- */
  update(t, deltaSec = 0.016) {
    const clampedT = Math.max(0, Math.min(1, t));

    if (this.scenarioId === 'delhi') {
      this.updateDelhiGenesis(clampedT);
      let uWave = 0;
      if (clampedT < 0.05) {
        if (this.floodGroup) this.floodGroup.visible = false;
        if (this.trailObj) this.river.updateFloodTrail(this.trailObj, 0);
        this.uWave = 0;
        this.updateWipeableItems(0);
        if (this.delhiUpdateDynamic) this.delhiUpdateDynamic(clampedT, 0);
      } else {
        if (this.floodGroup) this.floodGroup.visible = true;
        uWave = Math.min(1.0, (clampedT - 0.04) / 0.94);
        this.uWave = uWave;
        this.updateSurgeFront(uWave);
        this.updateWipeableItems(uWave);
        if (this.delhiUpdateDynamic) this.delhiUpdateDynamic(clampedT, uWave);
      }
      this.animateRain(2.8);
      return uWave;
    }

    if (this.scenarioId === 'newyork') {
      this.updateNewYorkGenesis(clampedT);
      let uWave = 0;
      if (clampedT < 0.10) {
        if (this.floodGroup) this.floodGroup.visible = false;
        if (this.trailObj) this.river.updateFloodTrail(this.trailObj, 0);
        this.uWave = 0;
        this.updateWipeableItems(0);
        if (this.nyUpdateTubes) this.nyUpdateTubes(0);
        if (this.nyUpdateFloating) this.nyUpdateFloating(0);
        if (this.nyUpdateBridgeTraffic) this.nyUpdateBridgeTraffic(clampedT, 0);
        if (this.nyUpdateFerryVessels) this.nyUpdateFerryVessels(clampedT, 0);
      } else {
        if (this.floodGroup) this.floodGroup.visible = true;
        uWave = Math.min(1.0, (clampedT - 0.10) / 0.90);
        this.uWave = uWave;
        this.updateSurgeFront(uWave);
        this.updateWipeableItems(uWave);
        if (this.nyUpdateTubes) this.nyUpdateTubes(uWave);
        if (this.nyUpdateFloating) this.nyUpdateFloating(uWave);
        if (this.nyUpdateBridgeTraffic) this.nyUpdateBridgeTraffic(clampedT, uWave);
        if (this.nyUpdateFerryVessels) this.nyUpdateFerryVessels(clampedT, uWave);

        if (this.nyArcLight && this.nyArcMesh) {
          if (uWave >= 0.70 && uWave <= 0.82) {
            const flicker = Math.random() > 0.35 ? 1.0 : 0.2;
            const pulse = (Math.sin(Date.now() * 0.035) * 0.5 + 0.5) * flicker;
            this.nyArcLight.intensity = pulse * 8.0;
            this.nyArcMesh.material.opacity = pulse * 0.85;
            this.nyArcMesh.scale.setScalar(1.0 + pulse * 1.5);
          } else {
            this.nyArcLight.intensity = 0.0;
            this.nyArcMesh.material.opacity = 0.0;
          }
        }
      }
      this.animateRain(3.2);
      return uWave;
    }

    if (this.scenarioId === 'beijing') {
      this.updateBeijingGenesis(clampedT);
      let uWave = 0;
      if (clampedT < 0.10) {
        if (this.floodGroup) this.floodGroup.visible = false;
        if (this.trailObj) this.river.updateFloodTrail(this.trailObj, 0);
        this.uWave = 0;
        this.updateWipeableItems(0);
      } else {
        if (this.floodGroup) this.floodGroup.visible = true;
        uWave = Math.min(1.0, (clampedT - 0.10) / 0.90);
        this.uWave = uWave;
        this.updateSurgeFront(uWave);
        this.updateWipeableItems(uWave);

        if (this.bjRotors && this.bjRotors.length > 0) {
          for (const rotor of this.bjRotors) {
            rotor.rotation.y += 0.35;
          }
        }
      }
      this.animateRain(3.4);
      return uWave;
    }

    if (this.scenarioId === 'tokyo') {
      this.updateTokyoGenesis(clampedT);
      let uWave = 0;
      if (clampedT < 0.10) {
        if (this.floodGroup) this.floodGroup.visible = false;
        if (this.trailObj) this.river.updateFloodTrail(this.trailObj, 0);
        this.uWave = 0;
        this.updateWipeableItems(0);
      } else {
        if (this.floodGroup) this.floodGroup.visible = true;
        uWave = Math.min(1.0, (clampedT - 0.10) / 0.90);
        this.uWave = uWave;
        this.updateSurgeFront(uWave);
        this.updateWipeableItems(uWave);
      }
      this.animateRain(3.2);
      return uWave;
    }

    if (this.scenarioId === 'london') {
      this.updateLondonGenesis(clampedT);
      let uWave = 0;
      if (clampedT < 0.10) {
        if (this.floodGroup) this.floodGroup.visible = false;
        if (this.trailObj) this.river.updateFloodTrail(this.trailObj, 0);
        this.uWave = 0;
        this.updateWipeableItems(0);
      } else {
        if (this.floodGroup) this.floodGroup.visible = true;
        uWave = Math.min(1.0, (clampedT - 0.10) / 0.90);
        this.uWave = uWave;
        this.updateSurgeFront(uWave);
        this.updateWipeableItems(uWave);

        if (this.londonSectorGates && this.londonSectorGates.length > 0) {
          let gateRot = 0;
          if (uWave >= 0.20 && uWave < 0.38) {
            const alpha = (uWave - 0.20) / 0.18;
            gateRot = alpha * (Math.PI * 0.5);
          } else if (uWave >= 0.38) {
            gateRot = Math.PI * 0.5;
          }
          for (const gate of this.londonSectorGates) {
            gate.rotation.x = gateRot;
          }
        }
      }
      this.animateRain(3.0);
      return uWave;
    }

    // A. AVALANCHE DETACHMENT MASS (t in [0.00, 0.18])
    if (clampedT < 0.04) {
      this.collapseMass.visible = true;
      this.collapseMass.position.copy(this.peakPos);
      this.collapseMass.rotation.set(0, 0, 0);
      this.scarMesh.material.opacity = 0.0;
      this.impactCloud.material.opacity = 0.0;
      for (const shard of this.shards) shard.mesh.visible = false;
    } else if (clampedT <= 0.18) {
      this.collapseMass.visible = true;
      const alpha = (clampedT - 0.04) / (0.16 - 0.04);
      const pAlpha = Math.min(1.0, Math.max(0, alpha));

      const curPos = new THREE.Vector3().lerpVectors(this.peakPos, this.riverHitPos, pAlpha);
      curPos.y += Math.sin(pAlpha * Math.PI) * 16.0;
      this.collapseMass.position.copy(curPos);
      this.collapseMass.rotation.x += 0.04;
      this.collapseMass.rotation.y += 0.05;

      for (const shard of this.shards) {
        shard.mesh.visible = true;
        shard.mesh.position.copy(curPos).addScaledVector(shard.offset, pAlpha * 2.5);
        shard.mesh.rotation.x += shard.rotSpeed.x * 0.016;
        shard.mesh.rotation.y += shard.rotSpeed.y * 0.016;
      }

      this.scarMesh.material.opacity = Math.min(0.85, (clampedT - 0.04) / 0.08);

      if (clampedT >= 0.15) {
        const cAlpha = (clampedT - 0.15) / (0.18 - 0.15);
        const radius = 2.0 + cAlpha * 22.0;
        this.impactCloud.scale.set(radius, radius * 0.7, radius);
        this.impactCloud.material.opacity = Math.max(0, 0.85 * (1.0 - cAlpha));
      } else {
        this.impactCloud.material.opacity = 0.0;
      }
    } else {
      this.collapseMass.visible = false;
      this.scarMesh.material.opacity = 0.85;
      for (const shard of this.shards) shard.mesh.visible = false;

      if (clampedT < 0.25) {
        const dAlpha = (clampedT - 0.18) / 0.07;
        const radius = 22.0 + dAlpha * 14.0;
        this.impactCloud.scale.set(radius, radius * 0.7, radius);
        this.impactCloud.material.opacity = Math.max(0, 0.3 * (1.0 - dAlpha));
      } else {
        this.impactCloud.material.opacity = 0.0;
      }
    }

    // B. FLOOD SURGE 3D WAVE FRONT & DYNAMIC TRAIL (t in [0.20, 1.0])
    let uWave = 0;
    if (clampedT < 0.20) {
      if (this.floodGroup) this.floodGroup.visible = false;
      if (this.trailObj) this.river.updateFloodTrail(this.trailObj, 0);
      this.uWave = 0;
      this.updateWipeableItems(0);
    } else {
      if (this.floodGroup) this.floodGroup.visible = true;
      uWave = (clampedT - 0.20) / (1.0 - 0.20);
      this.uWave = uWave;
      this.updateSurgeFront(uWave);
      this.updateWipeableItems(uWave);
    }

    // D. HIGHWAY DAMAGE & ROAD WASHOUT MECHANICS
    for (const hwy of this.highwaySections) {
      if (uWave < hwy.uTrigger) {
        // Pristine highway before flood wave reaches it
        hwy.group.visible = true;
        hwy.group.position.copy(hwy.initialPos);
        hwy.group.rotation.copy(hwy.initialRot);
        hwy.roadMesh.material.transparent = false;
        hwy.roadMesh.material.opacity = 1.0;
      } else {
        // Surge hits highway section: Retaining wall fails, road shears & collapses into torrent!
        const collapseProg = (uWave - hwy.uTrigger);

        if (collapseProg < 0.065) {
          hwy.group.visible = true;
          const slideDist = collapseProg * 40.0;

          // Road tilts inward toward river, fractures, and slides into flood
          hwy.group.position.copy(hwy.initialPos)
            .addScaledVector(hwy.slideDir, slideDist * 0.45)
            .add(new THREE.Vector3(0, -slideDist * 0.35, 0))
            .addScaledVector(hwy.driftDir, slideDist * 0.25);

          // Severe tilt angle (sheared embankment)
          hwy.group.rotation.z = hwy.initialRot.z + Math.min(0.65, collapseProg * 14.0);
          hwy.group.rotation.x = hwy.initialRot.x + (collapseProg * 5.0);

          const fade = Math.max(0.0, 1.0 - (collapseProg / 0.065));
          hwy.roadMesh.material.transparent = true;
          hwy.roadMesh.material.opacity = fade;
        } else {
          // Road section completely washed away & submerged!
          hwy.group.visible = false;
        }
      }
    }

    // E. BRIDGE CATASTROPHIC COLLAPSE & WASHOUT DYNAMICS
    if (this.bridges) {
      for (const b of this.bridges) {
        if (uWave < b.uTrigger) {
          // Pristine standing bridge before flood wave arrives
          b.group.visible = true;
          for (const part of b.dynamicParts) {
            part.mesh.visible = true;
            part.mesh.position.copy(part.initialPos);
            part.mesh.rotation.copy(part.initialRot);
            if (part.material) {
              part.material.transparent = false;
              part.material.opacity = 1.0;
            }
          }
          // Gentle Tibetan Buddhist prayer flag fluttering in mountain wind
          if (b.flags && b.flags.length > 0) {
            const tFlag = Date.now() * 0.005;
            for (let f = 0; f < b.flags.length; f++) {
              b.flags[f].rotation.z = Math.sin(tFlag + f * 0.8) * 0.22;
              b.flags[f].rotation.x = Math.cos(tFlag + f * 0.6) * 0.14;
            }
          }
        } else {
          // Catastrophic destruction by high-velocity flood bore!
          const collapseProg = (uWave - b.uTrigger);

          if (collapseProg < 0.08) {
            b.group.visible = true;
            const washDist = collapseProg * 45.0;

            for (const part of b.dynamicParts) {
              part.mesh.visible = true;
              part.mesh.position.copy(part.initialPos)
                .addScaledVector(part.driftDir, washDist * 0.6)
                .add(new THREE.Vector3(0, -washDist * 0.45, 0));

              part.mesh.rotation.x = part.initialRot.x + part.tumbleVel.x * collapseProg * 8.0;
              part.mesh.rotation.y = part.initialRot.y + part.tumbleVel.y * collapseProg * 8.0;
              part.mesh.rotation.z = part.initialRot.z + part.tumbleVel.z * collapseProg * 8.0;

              const fade = Math.max(0.0, 1.0 - (collapseProg / 0.08));
              if (part.material) {
                part.material.transparent = true;
                part.material.opacity = fade;
              }
            }
          } else {
            // Completely torn away, swept downstream & submerged under sediment
            b.group.visible = false;
            for (const part of b.dynamicParts) {
              part.mesh.visible = false;
            }
          }
        }
      }
    }

    // F. Drift Soft Realistic Clouds slowly across peaks
    const time = Date.now() * 0.001;
    for (const cl of this.cloudSprites) {
      cl.group.position.x = cl.baseX + Math.sin(time * 0.05 * cl.driftSpeed) * 12.0;
    }

    // G. Active Waypoint Ground Ring & Pulse
    let activeWp = WAYPOINTS[0];
    if (uWave > 0) {
      for (let i = WAYPOINTS.length - 1; i >= 1; i--) {
        if (uWave >= (WAYPOINTS[i].u - 0.02)) {
          activeWp = WAYPOINTS[i];
          break;
        }
      }
    }

    const wpPos = this.river.getPointAt(activeWp.u);
    this.waypointRing.position.set(wpPos.x, wpPos.y + 0.4, wpPos.z);
    this.beaconLight.position.set(wpPos.x, wpPos.y + 3.0, wpPos.z);

    const pulse = 1.0 + Math.sin(Date.now() * 0.005) * 0.18;
    this.waypointRing.scale.set(pulse, pulse, pulse);

    // G. Rain particles
    if (this.rainEnabled) {
      const pos = this.rainPositions;
      for (let i = 0; i < this.rainCount; i++) {
        pos[i * 3 + 1] -= this.rainVelocities[i];
        pos[i * 3 + 0] += 0.12;
        if (pos[i * 3 + 1] < -2.0) {
          pos[i * 3 + 1] = 110 + Math.random() * 20;
          pos[i * 3 + 0] = (Math.random() - 0.5) * 240;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 240;
        }
      }
      this.rainSystem.geometry.attributes.position.needsUpdate = true;
    }

    return uWave;
  }

  dispose() {
    this.wipeableItems = [];
  }
}
