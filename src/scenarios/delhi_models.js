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
 * Features:
 * - Authentic Imperial Red Fort (Lal Qila): Lahori Gate grand portal with 7 white marble
 *   cupolas, twin octagonal bastions, chhatris, Indian Tricolor flag mast, 18m sandstone
 *   curtain ramparts, Salimgarh causeway bridge, and perimeter defensive moat with dynamic
 *   water rising when Yamuna crest breaches the outer bund.
 * - Old Delhi (Shahjahanabad) Dense World-Building: 120+ 3- to 5-story haveli tenement blocks
 *   positioned strictly on the West Bank (dist >= 42m away from river centerline, completely
 *   clear of water and road paths), with ground-floor shops (rolling shutters, signboards, awnings),
 *   rooftop Sintex black water tanks, AC units, balconies, and alleyways.
 * - Kashmere Gate ISBT & Submerged Ring Road: Multi-level terminal concourse, bus bays, ramps.
 * - Elevated Delhi Metro Viaduct: Concrete piers, catenary masts, and modern 4-coach train.
 * - Nigambodh Ghat: Historic stone bathing stairs and riverside prayer pavilions.
 * - 65+ Dynamic Vehicles: DTC Green CNG and Blue Electric buses, Bajaj auto-rickshaws,
 *   white Delhi Police Gypsys with strobing lightbars, yellow/black steel police barricades,
 *   delivery tempos, and passenger cars.
 * - 90+ Floodplain Basti Shanties & NDRF Motorized Rescue Boat Patrol Fleet.
 */
export function buildDelhiScene(group, river, terrain) {
  const wipeableItems = [];
  const dynamicWaterItems = [];
  const flashingBeacons = [];

  // Procedural canvas textures for Delhi
  const redSandstoneTex = getRedSandstoneTexture();
  const delhiBrickTex = getDelhiBrickTexture();
  const tinRoofTex = getTinRoofTexture();
  const tarpRoofTex = getTarpRoofTexture();
  const asphaltRoadTex = getAsphaltRoadTexture();

  // Shared reusable materials
  const concreteMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.75, metalness: 0.1 });
  const darkSteel = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.6 });
  const redSandstoneMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    map: redSandstoneTex || null,
    roughness: 0.85
  });
  const whiteMarbleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.05 });
  const goldBrassMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.25, metalness: 0.85 });
  const sintexBlackMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.6 });
  const acWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 });
  const shutterMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6, metalness: 0.4 });
  const glassDark = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.15, metalness: 0.8 });
  const tarmacMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    map: asphaltRoadTex || null,
    roughness: 0.9
  });

  // Helper to place objects on river tangents & bank normals
  function getRiverFrame(u) {
    const pt = river.getPointAt(u);
    const tangent = river.getTangentAt(u).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();
    return { pt, tangent, side, up };
  }

  // -------------------------------------------------------------------------
  // PROCEDURAL BUILDERS
  // -------------------------------------------------------------------------

  function createBastiHut(bw = 3.2, bh = 2.4, bd = 3.6, wallHex = 0xb45309, roofHex = 0x64748b, roofType = 'cgi') {
    const hutGroup = new THREE.Group();
    const materials = [];

    const wallMat = new THREE.MeshStandardMaterial({
      color: wallHex,
      map: delhiBrickTex || null,
      roughness: 0.85
    });
    materials.push(wallMat);
    const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), wallMat);
    wallMesh.position.y = bh * 0.5;
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    hutGroup.add(wallMesh);

    const doorMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 });
    materials.push(doorMat);
    const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.4, 0.1), doorMat);
    doorMesh.position.set(0, 0.7, bd * 0.5 + 0.02);
    hutGroup.add(doorMesh);

    const windowMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.6 });
    materials.push(windowMat);
    const winMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.1), windowMat);
    winMesh.position.set(bw * 0.5 + 0.02, bh * 0.6, 0);
    winMesh.rotation.y = Math.PI * 0.5;
    hutGroup.add(winMesh);

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

      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.7, 10), sintexBlackMat);
      tank.position.set(-bw * 0.25, bh + 0.55, -bd * 0.25);
      hutGroup.add(tank);
    }

    return { group: hutGroup, materials, primaryMat: wallMat };
  }

  function createDelhiHaveliBlock(bw = 6.5, bh = 11.5, bd = 7.0, wallHex = 0xb45309, hasShops = true, floors = 4) {
    const haveliGroup = new THREE.Group();
    const materials = [];

    const wallMat = new THREE.MeshStandardMaterial({
      color: wallHex,
      map: (wallHex === 0xb45309 || wallHex === 0x991b1b) ? delhiBrickTex : null,
      roughness: 0.85
    });
    materials.push(wallMat);

    const mainBlock = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), wallMat);
    mainBlock.position.y = bh * 0.5;
    mainBlock.castShadow = true;
    mainBlock.receiveShadow = true;
    haveliGroup.add(mainBlock);

    if (hasShops) {
      const numShops = Math.max(1, Math.floor(bw / 2.2));
      const shopW = (bw - 0.6) / numShops;
      const signColors = [0xdc2626, 0x2563eb, 0x16a34a, 0xd97706, 0x7c3aed];

      for (let s = 0; s < numShops; s++) {
        const sx = -bw * 0.5 + 0.3 + (s + 0.5) * shopW;

        const shutter = new THREE.Mesh(new THREE.BoxGeometry(shopW * 0.88, 2.2, 0.08), shutterMat);
        shutter.position.set(sx, 1.15, bd * 0.5 + 0.04);
        haveliGroup.add(shutter);

        const signMat = new THREE.MeshStandardMaterial({
          color: signColors[(s + Math.floor(bw)) % signColors.length],
          roughness: 0.4
        });
        materials.push(signMat);
        const sign = new THREE.Mesh(new THREE.BoxGeometry(shopW * 0.92, 0.45, 0.12), signMat);
        sign.position.set(sx, 2.5, bd * 0.5 + 0.06);
        haveliGroup.add(sign);

        if (s % 2 === 0) {
          const awningMat = new THREE.MeshStandardMaterial({
            color: (s === 0) ? 0x0284c7 : 0xea580c,
            roughness: 0.7
          });
          materials.push(awningMat);
          const awning = new THREE.Mesh(new THREE.BoxGeometry(shopW * 0.95, 0.08, 0.9), awningMat);
          awning.rotation.x = 0.22;
          awning.position.set(sx, 2.3, bd * 0.5 + 0.45);
          haveliGroup.add(awning);
        }
      }
    }

    const floorH = (bh - 2.8) / Math.max(1, floors - 1);
    for (let f = 1; f < floors; f++) {
      const fy = 2.8 + (f - 0.5) * floorH;

      const numWin = Math.max(1, Math.floor(bw / 1.8));
      const winW = (bw - 0.8) / numWin;
      for (let w = 0; w < numWin; w++) {
        const wx = -bw * 0.5 + 0.4 + (w + 0.5) * winW;
        const win = new THREE.Mesh(new THREE.BoxGeometry(winW * 0.55, floorH * 0.5, 0.08), glassDark);
        win.position.set(wx, fy, bd * 0.5 + 0.04);
        haveliGroup.add(win);

        const lintel = new THREE.Mesh(new THREE.BoxGeometry(winW * 0.65, 0.08, 0.25), concreteMat);
        lintel.position.set(wx, fy + floorH * 0.28, bd * 0.5 + 0.12);
        haveliGroup.add(lintel);
      }

      if (f === 2 || f === 3) {
        const balcW = bw * 0.45;
        const balcGroup = new THREE.Group();
        balcGroup.position.set(0, fy - floorH * 0.25, bd * 0.5 + 0.45);

        const balcSlab = new THREE.Mesh(new THREE.BoxGeometry(balcW, 0.14, 0.85), concreteMat);
        balcGroup.add(balcSlab);

        [-balcW * 0.38, balcW * 0.38].forEach(bx => {
          const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.7), wallMat);
          bracket.position.set(bx, -0.22, -0.05);
          balcGroup.add(bracket);
        });

        const rail = new THREE.Mesh(new THREE.BoxGeometry(balcW, 0.65, 0.06), darkSteel);
        rail.position.set(0, 0.35, 0.38);
        balcGroup.add(rail);

        haveliGroup.add(balcGroup);
      }

      if (f === 1 || f === 2) {
        const ac = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.42, 0.3), acWhiteMat);
        ac.position.set(bw * 0.38, fy, bd * 0.5 + 0.18);
        haveliGroup.add(ac);
      }
    }

    const parapet = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.15, 0.75, bd + 0.15), wallMat);
    parapet.position.set(0, bh + 0.35, 0);
    haveliGroup.add(parapet);

    const mumty = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.35, 2.0, bd * 0.35), concreteMat);
    mumty.position.set(-bw * 0.25, bh + 1.0, -bd * 0.25);
    haveliGroup.add(mumty);

    const sintex = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.95, 12), sintexBlackMat);
    sintex.position.set(bw * 0.25, bh + 0.55, bd * 0.22);
    haveliGroup.add(sintex);

    const clMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.8 });
    const cloth = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.3, 0.5, 0.05), clMat);
    cloth.position.set(0, bh + 0.65, -bd * 0.15);
    haveliGroup.add(cloth);

    // Shatter rubble pieces (brick blocks & timber rafters) around base
    const rubbleGroup = new THREE.Group();
    const rubblePieces = [];
    for (let r = 0; r < 6; r++) {
      const rMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.5 + Math.random() * 0.4, 0.4 + Math.random() * 0.3, 0.5 + Math.random() * 0.4),
        wallMat
      );
      const rStart = new THREE.Vector3(
        (Math.random() - 0.5) * (bw * 0.8),
        0.3,
        bd * 0.5 + 0.8 + Math.random() * 1.5
      );
      rMesh.position.copy(rStart);
      rubbleGroup.add(rMesh);
      rubblePieces.push({
        mesh: rMesh,
        basePos: rStart.clone(),
        drift: new THREE.Vector3((Math.random() - 0.5) * 2.0, Math.random() * 1.5, Math.random() * 3.5),
        spin: new THREE.Vector3(Math.random() * 6.0, Math.random() * 6.0, Math.random() * 6.0)
      });
    }
    rubbleGroup.visible = false;
    haveliGroup.add(rubbleGroup);

    return {
      group: haveliGroup,
      materials,
      primaryMat: wallMat,
      mainBlock,
      parapet,
      mumty,
      sintex,
      cloth,
      rubbleGroup,
      rubblePieces
    };
  }

  function createRedFortComplex() {
    const complexGroup = new THREE.Group();

    // 1. Lahori Gate Grand Portal (Facing inland towards Old Delhi)
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0, 0, 0);

    const gateBlock = new THREE.Mesh(new THREE.BoxGeometry(16.0, 11.5, 7.5), redSandstoneMat);
    gateBlock.position.y = 5.75;
    gateBlock.castShadow = true;
    gateBlock.receiveShadow = true;
    gateGroup.add(gateBlock);

    const archRecessMat = new THREE.MeshStandardMaterial({ color: 0x450a0a, roughness: 0.9 });
    const archRecess = new THREE.Mesh(new THREE.BoxGeometry(5.2, 7.2, 3.2), archRecessMat);
    archRecess.position.set(0, 3.6, 2.3);
    gateGroup.add(archRecess);

    const timberGateMat = new THREE.MeshStandardMaterial({ color: 0x271711, roughness: 0.8 });
    const gateDoorL = new THREE.Mesh(new THREE.BoxGeometry(2.3, 5.5, 0.2), timberGateMat);
    gateDoorL.position.set(-1.2, 2.75, 1.2);
    gateGroup.add(gateDoorL);

    const gateDoorR = new THREE.Mesh(new THREE.BoxGeometry(2.3, 5.5, 0.2), timberGateMat);
    gateDoorR.position.set(1.2, 2.75, 1.2);
    gateGroup.add(gateDoorR);

    const cornice = new THREE.Mesh(new THREE.BoxGeometry(16.8, 0.45, 8.2), redSandstoneMat);
    cornice.position.set(0, 11.6, 0);
    gateGroup.add(cornice);

    // 7 White Marble Onion Cupolas
    const numCupolas = 7;
    const cupolaSpacing = 13.5 / (numCupolas - 1);
    for (let c = 0; c < numCupolas; c++) {
      const cx = -6.75 + c * cupolaSpacing;
      const cupolaGroup = new THREE.Group();
      cupolaGroup.position.set(cx, 11.8, 3.2);

      [-0.25, 0.25].forEach(px => {
        [-0.25, 0.25].forEach(pz => {
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.1, 8), whiteMarbleMat);
          col.position.set(px, 0.55, pz);
          cupolaGroup.add(col);
        });
      });

      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.48, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.75), whiteMarbleMat);
      dome.position.y = 1.35;
      cupolaGroup.add(dome);

      const finial = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.45, 8), goldBrassMat);
      finial.position.y = 1.95;
      cupolaGroup.add(finial);

      gateGroup.add(cupolaGroup);
    }

    // Flag Mast & Tiranga Flag
    const flagMast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 10.5, 12), goldBrassMat);
    flagMast.position.set(0, 16.5, 2.8);
    gateGroup.add(flagMast);

    const flagGroup = new THREE.Group();
    flagGroup.position.set(1.4, 20.2, 2.8);

    const saffron = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 0.04), new THREE.MeshBasicMaterial({ color: 0xff9933 }));
    saffron.position.y = 0.45;
    flagGroup.add(saffron);

    const white = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 0.04), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    flagGroup.add(white);

    const chakra = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.06, 16), new THREE.MeshBasicMaterial({ color: 0x000080 }));
    chakra.rotation.x = Math.PI * 0.5;
    flagGroup.add(chakra);

    const green = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 0.04), new THREE.MeshBasicMaterial({ color: 0x138808 }));
    green.position.y = -0.45;
    flagGroup.add(green);
    gateGroup.add(flagGroup);

    // PM Rostrum Podium
    const podium = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.85, 1.4), redSandstoneMat);
    podium.position.set(0, 12.1, 2.2);
    gateGroup.add(podium);

    const glassPanel = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.1, 0.06), new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.6
    }));
    glassPanel.position.set(0, 12.95, 2.8);
    gateGroup.add(glassPanel);

    // Twin Octagonal Bastions
    [-11.5, 11.5].forEach(bastionX => {
      const bastionGroup = new THREE.Group();
      bastionGroup.position.set(bastionX, 0, 0);

      const bastionBody = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.0, 15.0, 8), redSandstoneMat);
      bastionBody.position.y = 7.5;
      bastionBody.castShadow = true;
      bastionGroup.add(bastionBody);

      for (let m = 0; m < 8; m++) {
        const ang = (m / 8) * Math.PI * 2;
        const merlon = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.6), redSandstoneMat);
        merlon.position.set(Math.cos(ang) * 3.4, 15.4, Math.sin(ang) * 3.4);
        merlon.rotation.y = -ang;
        bastionGroup.add(merlon);
      }

      const chhatriGroup = new THREE.Group();
      chhatriGroup.position.set(0, 15.5, 0);

      for (let p = 0; p < 8; p++) {
        const ang = (p / 8) * Math.PI * 2;
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.2, 8), whiteMarbleMat);
        pillar.position.set(Math.cos(ang) * 2.1, 1.1, Math.sin(ang) * 2.1);
        chhatriGroup.add(pillar);
      }

      const bDome = new THREE.Mesh(new THREE.SphereGeometry(2.4, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.72), whiteMarbleMat);
      bDome.position.y = 2.6;
      chhatriGroup.add(bDome);

      const bFinial = new THREE.Mesh(new THREE.ConeGeometry(0.24, 1.2, 8), goldBrassMat);
      bFinial.position.y = 4.6;
      chhatriGroup.add(bFinial);

      bastionGroup.add(chhatriGroup);
      gateGroup.add(bastionGroup);
    });

    complexGroup.add(gateGroup);

    // 2. 18m High Red Sandstone Curtain Ramparts
    const wallHeight = 10.0;
    const wallThick = 3.2;
    const wallSpan = 38.0;

    [-1, 1].forEach(dir => {
      const wallGroup = new THREE.Group();
      const wx = dir * (15.0 + wallSpan * 0.5);
      wallGroup.position.set(wx, 0, -2.5);

      const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(wallSpan, wallHeight, wallThick), redSandstoneMat);
      wallMesh.position.y = wallHeight * 0.5;
      wallMesh.castShadow = true;
      wallGroup.add(wallMesh);

      for (let b = 0; b < 18; b++) {
        const merlon = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.85, 0.6), redSandstoneMat);
        merlon.position.set(-wallSpan * 0.5 + 1.0 + b * 2.1, wallHeight + 0.42, 1.4);
        wallGroup.add(merlon);
      }

      const burj = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.8, wallHeight + 2.5, 8), redSandstoneMat);
      burj.position.set(dir * wallSpan * 0.5, (wallHeight + 2.5) * 0.5, 0);
      wallGroup.add(burj);

      const burjDome = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.7), whiteMarbleMat);
      burjDome.position.set(dir * wallSpan * 0.5, wallHeight + 3.0, 0);
      wallGroup.add(burjDome);

      complexGroup.add(wallGroup);
    });

    // 3. Salimgarh Fort Causeway & 5-Arch Stone Bridge
    const causewayGroup = new THREE.Group();
    causewayGroup.position.set(38.0, 0, -18.0);

    const bridgeDeck = new THREE.Mesh(new THREE.BoxGeometry(6.0, 1.4, 24.0), redSandstoneMat);
    bridgeDeck.position.set(0, 4.2, 0);
    causewayGroup.add(bridgeDeck);

    for (let a = 0; a < 5; a++) {
      const az = -9.6 + a * 4.8;
      const pier = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.6, 4.2, 12), redSandstoneMat);
      pier.position.set(0, 2.1, az);
      causewayGroup.add(pier);
    }
    complexGroup.add(causewayGroup);

    // 4. Perimeter Defensive Moat & Dynamic Water Mesh
    const moatOuterWall = new THREE.Mesh(new THREE.BoxGeometry(105.0, 1.4, 0.8), redSandstoneMat);
    moatOuterWall.position.set(0, 1.8, 9.5);
    complexGroup.add(moatOuterWall);

    const moatWaterMat = new THREE.MeshStandardMaterial({
      color: 0x784c1f,
      roughness: 0.25,
      metalness: 0.15,
      transparent: true,
      opacity: 0.88
    });
    const moatWaterMesh = new THREE.Mesh(new THREE.BoxGeometry(104.0, 0.2, 14.0), moatWaterMat);
    moatWaterMesh.position.set(0, 1.2, 3.5);
    complexGroup.add(moatWaterMesh);

    return {
      group: complexGroup,
      moatWaterMesh,
      updateMoat: (uWave) => {
        if (uWave < 0.50) {
          moatWaterMesh.position.y = 1.2;
          moatWaterMat.opacity = 0.45;
        } else {
          const fillRatio = Math.min(1.0, (uWave - 0.50) / 0.15);
          moatWaterMesh.position.y = 1.2 + fillRatio * 2.4;
          moatWaterMat.opacity = 0.88;
        }
      }
    };
  }

  function createISBTTerminal() {
    const isbtGroup = new THREE.Group();

    const concourseMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.6 });
    const terminalBuilding = new THREE.Mesh(new THREE.BoxGeometry(26.0, 8.5, 12.0), concreteMat);
    terminalBuilding.position.y = 4.25;
    terminalBuilding.castShadow = true;
    isbtGroup.add(terminalBuilding);

    const glassFacade = new THREE.Mesh(new THREE.BoxGeometry(25.0, 6.0, 0.2), concourseMat);
    glassFacade.position.set(0, 4.5, 6.05);
    isbtGroup.add(glassFacade);

    const signMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 });
    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(18.0, 1.2, 0.3), signMat);
    signBoard.position.set(0, 8.2, 6.2);
    isbtGroup.add(signBoard);

    for (let b = -2; b <= 2; b++) {
      const bayX = b * 4.8;
      const canopy = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 8.5), darkSteel);
      canopy.position.set(bayX, 3.8, 10.5);
      canopy.rotation.x = -0.08;
      isbtGroup.add(canopy);

      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 3.8, 8), concreteMat);
      col.position.set(bayX, 1.9, 14.5);
      isbtGroup.add(col);
    }

    return { group: isbtGroup };
  }

  function createDelhiMetroViaduct() {
    const viaductGroup = new THREE.Group();

    const spanLen = 65.0;
    const numPiers = 6;
    const pierSpacing = spanLen / (numPiers - 1);

    for (let p = 0; p < numPiers; p++) {
      const pz = -spanLen * 0.5 + p * pierSpacing;

      const pier = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.85, 7.5, 12), concreteMat);
      pier.position.set(0, 3.75, pz);
      pier.castShadow = true;
      viaductGroup.add(pier);

      const hammerhead = new THREE.Mesh(new THREE.BoxGeometry(5.8, 1.2, 1.8), concreteMat);
      hammerhead.position.set(0, 7.8, pz);
      viaductGroup.add(hammerhead);

      const ocsMast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 6), darkSteel);
      ocsMast.position.set(2.6, 9.8, pz);
      viaductGroup.add(ocsMast);

      const ocsArm = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.08), darkSteel);
      ocsArm.position.set(1.4, 11.2, pz);
      viaductGroup.add(ocsArm);
    }

    const deck = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.9, spanLen + 4.0), concreteMat);
    deck.position.set(0, 8.7, 0);
    deck.castShadow = true;
    viaductGroup.add(deck);

    [-1.2, 1.2].forEach(tx => {
      const rail1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, spanLen + 4.0), darkSteel);
      rail1.position.set(tx - 0.4, 9.2, 0);
      viaductGroup.add(rail1);

      const rail2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, spanLen + 4.0), darkSteel);
      rail2.position.set(tx + 0.4, 9.2, 0);
      viaductGroup.add(rail2);
    });

    const trainGroup = new THREE.Group();
    trainGroup.position.set(-1.2, 9.2, 0);

    const coachLen = 7.5;
    const coachW = 1.6;
    const coachH = 1.7;
    const metroSteelMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.25, metalness: 0.85 });
    const metroRedMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
    const metroWindowMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 });

    for (let c = 0; c < 4; c++) {
      const cz = -12.0 + c * (coachLen + 0.5);
      const coach = new THREE.Group();
      coach.position.set(0, 0, cz);

      const body = new THREE.Mesh(new THREE.BoxGeometry(coachW, coachH, coachLen), metroSteelMat);
      body.position.y = coachH * 0.5;
      body.castShadow = true;
      coach.add(body);

      const stripe = new THREE.Mesh(new THREE.BoxGeometry(coachW + 0.04, 0.22, coachLen), metroRedMat);
      stripe.position.y = coachH * 0.45;
      coach.add(stripe);

      const winBand = new THREE.Mesh(new THREE.BoxGeometry(coachW + 0.06, 0.55, coachLen * 0.88), metroWindowMat);
      winBand.position.y = coachH * 0.65;
      coach.add(winBand);

      if (c === 0 || c === 3) {
        const noseDir = (c === 0) ? -1 : 1;
        const cabNose = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.2, 4), metroSteelMat);
        cabNose.rotation.x = noseDir * Math.PI * 0.5;
        cabNose.position.set(0, coachH * 0.5, noseDir * (coachLen * 0.5 + 0.5));
        coach.add(cabNose);

        const headLampMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 1.0 });
        [-0.45, 0.45].forEach(hx => {
          const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), headLampMat);
          lamp.position.set(hx, coachH * 0.35, noseDir * (coachLen * 0.5 + 0.9));
          coach.add(lamp);
        });
      }

      const hvac = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.28, 2.2), darkSteel);
      hvac.position.set(0, coachH + 0.14, 0);
      coach.add(hvac);

      if (c === 1) {
        const pantograph = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.45, 0.8), darkSteel);
        pantograph.position.set(0, coachH + 0.35, 0);
        coach.add(pantograph);
      }

      trainGroup.add(coach);
    }

    viaductGroup.add(trainGroup);
    return { group: viaductGroup };
  }

  function createNigambodhGhat() {
    const ghatGroup = new THREE.Group();

    const stepCount = 6;
    const stepDepth = 1.4;
    const stepHeight = 0.5;
    const ghatWidth = 32.0;

    for (let s = 0; s < stepCount; s++) {
      const stepMesh = new THREE.Mesh(
        new THREE.BoxGeometry(ghatWidth, stepHeight, (stepCount - s) * stepDepth),
        redSandstoneMat
      );
      stepMesh.position.set(0, s * stepHeight, s * stepDepth * 0.5);
      stepMesh.castShadow = true;
      stepMesh.receiveShadow = true;
      ghatGroup.add(stepMesh);
    }

    [-ghatWidth * 0.35, 0, ghatWidth * 0.35].forEach(cx => {
      const chhatri = new THREE.Group();
      chhatri.position.set(cx, stepCount * stepHeight, 0);

      for (let p = 0; p < 4; p++) {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.2, 8), redSandstoneMat);
        col.position.set((p % 2 === 0 ? -0.8 : 0.8), 1.1, (p > 1 ? 0.8 : -0.8));
        chhatri.add(col);
      }

      const dome = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.65), redSandstoneMat);
      dome.position.y = 2.4;
      chhatri.add(dome);

      ghatGroup.add(chhatri);
    });

    return { group: ghatGroup };
  }

  function createDelhiPoliceGypsy() {
    const gypsyGroup = new THREE.Group();
    const materials = [];

    const policeWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.2 });
    const policeBlue = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 });
    const canvasMat = new THREE.MeshStandardMaterial({ color: 0x3f4f2c, roughness: 0.85 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const redLight = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 1.2 });
    const blueLight = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x3b82f6, emissiveIntensity: 1.2 });
    materials.push(policeWhite, policeBlue, canvasMat, wheelMat, redLight, blueLight);

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.65, 3.2), policeWhite);
    body.position.y = 0.55;
    body.castShadow = true;
    gypsyGroup.add(body);

    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.18, 2.8), policeBlue);
    stripe.position.y = 0.6;
    gypsyGroup.add(stripe);

    const bullbar = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.45, 0.15), darkSteel);
    bullbar.position.set(0, 0.45, 1.65);
    gypsyGroup.add(bullbar);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.75, 1.8), canvasMat);
    cabin.position.set(0, 1.15, -0.4);
    gypsyGroup.add(cabin);

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.55, 0.08), glassDark);
    windshield.position.set(0, 1.05, 0.55);
    windshield.rotation.x = -0.22;
    gypsyGroup.add(windshield);

    const lightbarBase = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.1, 0.22), darkSteel);
    lightbarBase.position.set(0, 1.58, 0.35);
    gypsyGroup.add(lightbarBase);

    const rBeacon = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.18), redLight);
    rBeacon.position.set(-0.24, 1.68, 0.35);
    gypsyGroup.add(rBeacon);

    const bBeacon = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.18), blueLight);
    bBeacon.position.set(0.24, 1.68, 0.35);
    gypsyGroup.add(bBeacon);

    flashingBeacons.push({ red: redLight, blue: blueLight });

    const wGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.2, 10);
    wGeo.rotateZ(Math.PI * 0.5);
    [-0.75, 0.75].forEach(wx => {
      [-0.95, 0.95].forEach(wz => {
        const wheel = new THREE.Mesh(wGeo, wheelMat);
        wheel.position.set(wx, 0.32, wz);
        gypsyGroup.add(wheel);
      });
    });

    const spare = new THREE.Mesh(wGeo, wheelMat);
    spare.position.set(0, 0.65, -1.68);
    spare.rotation.y = Math.PI * 0.5;
    gypsyGroup.add(spare);

    return { group: gypsyGroup, materials, primaryMat: policeWhite };
  }

  function createPoliceBarricade() {
    const barGroup = new THREE.Group();
    const barYellow = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.5 });
    const barBlack = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });

    const frame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 0.1), barYellow);
    frame.position.y = 0.75;
    frame.castShadow = true;
    barGroup.add(frame);

    for (let s = -2; s <= 2; s++) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.0, 0.12), barBlack);
      stripe.position.set(s * 0.45, 0.75, 0);
      stripe.rotation.z = 0.35;
      barGroup.add(stripe);
    }

    [-1.0, 1.0].forEach(fx => {
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.35, 0.9), darkSteel);
      foot.position.set(fx, 0.18, 0);
      barGroup.add(foot);
    });

    return { group: barGroup, primaryMat: barYellow, materials: [barYellow, barBlack] };
  }

  function createDTCBus(isElectric = false) {
    const busGroup = new THREE.Group();
    const materials = [];

    const bodyCol = isElectric ? 0x0284c7 : 0x15803d;
    const busMat = new THREE.MeshStandardMaterial({ color: bodyCol, roughness: 0.5 });
    const whiteRoof = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
    const ledAmber = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });
    materials.push(busMat, whiteRoof, glassDark, wheelMat, ledAmber);

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 5.6), busMat);
    body.position.y = 0.8;
    body.castShadow = true;
    busGroup.add(body);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.25, 5.5), whiteRoof);
    roof.position.y = 1.5;
    busGroup.add(roof);

    const win = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.48, 5.0), glassDark);
    win.position.y = 1.15;
    busGroup.add(win);

    const dest = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.2, 0.08), ledAmber);
    dest.position.set(0, 1.45, 2.81);
    busGroup.add(dest);

    const wGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.22, 10);
    wGeo.rotateZ(Math.PI * 0.5);
    [-0.9, 0.9].forEach(wx => {
      [-1.7, 1.7].forEach(wz => {
        const wheel = new THREE.Mesh(wGeo, wheelMat);
        wheel.position.set(wx, 0.35, wz);
        busGroup.add(wheel);
      });
    });

    return { group: busGroup, materials, primaryMat: busMat };
  }

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

  function createPassengerCar(colorHex = 0xe2e8f0) {
    const carGroup = new THREE.Group();
    const materials = [];

    const carMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.4, metalness: 0.3 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    materials.push(carMat, glassDark, wheelMat);

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.55, 2.8), carMat);
    body.position.y = 0.45;
    carGroup.add(body);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 1.5), glassDark);
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

  function createCountryBoat() {
    const boatGroup = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.85 });

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

    return { group: boatGroup, materials: [woodMat], primaryMat: woodMat };
  }

  function createTeaStall() {
    const stallGroup = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const tarpMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.7 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.3, metalness: 0.8 });

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

    return { group: stallGroup, materials: [woodMat, tarpMat, metalMat], primaryMat: woodMat };
  }

  function createBrickKiln() {
    const kilnGroup = new THREE.Group();
    const brickMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.9 });
    const earthMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.95 });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.4, 1.8, 16), earthMat);
    base.position.y = 0.9;
    base.scale.set(1.4, 1.0, 0.9);
    base.castShadow = true;
    kilnGroup.add(base);

    const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.3, 11.0, 12), brickMat);
    chimney.position.set(0, 6.5, 0);
    chimney.castShadow = true;
    kilnGroup.add(chimney);

    return { group: kilnGroup, materials: [brickMat, earthMat], primaryMat: brickMat };
  }

  function createSandbagBundSegment(length = 3.6) {
    const bundGroup = new THREE.Group();
    const sandbagMat = new THREE.MeshStandardMaterial({ color: 0xd4b996, roughness: 0.95 });

    const cols = Math.floor(length / 0.7);
    for (let row = 0; row < 3; row++) {
      for (let c = 0; c < cols; c++) {
        const bag = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.32, 0.42), sandbagMat);
        bag.position.set((c - cols * 0.5 + 0.5) * 0.7, 0.16 + row * 0.3, (row % 2) * 0.1);
        bundGroup.add(bag);
      }
    }
    return { group: bundGroup, materials: [sandbagMat], primaryMat: sandbagMat };
  }

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

    const deck = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.15, 3.4), deckMat);
    deck.position.y = 0.15;
    boatGroup.add(deck);

    [-0.8, 0.8].forEach(sideX => {
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 3.2, 12), orangePontoons);
      tube.rotation.x = Math.PI * 0.5;
      tube.position.set(sideX, 0.32, 0);
      boatGroup.add(tube);
    });

    const bowTube = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.6, 12), orangePontoons);
    bowTube.rotation.z = Math.PI * 0.5;
    bowTube.position.set(0, 0.38, 1.6);
    boatGroup.add(bowTube);

    const motorGroup = new THREE.Group();
    motorGroup.position.set(0, 0.6, -1.75);
    const motorCowling = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.55, 0.5), motorMat);
    motorCowling.position.y = 0.2;
    motorGroup.add(motorCowling);
    boatGroup.add(motorGroup);

    const spotlight = new THREE.Group();
    spotlight.position.set(0, 0.72, 1.55);
    const lightLens = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 10), spotlightMat);
    lightLens.rotation.x = Math.PI * 0.5;
    spotlight.add(lightLens);
    boatGroup.add(spotlight);

    [-0.2, 0.2].forEach((xOff, pIdx) => {
      const person = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.75, 0.35), lifeVestOrange);
      person.position.set(xOff, 0.55, (pIdx === 0 ? -1.0 : 0.6));
      boatGroup.add(person);
    });

    boatGroup.castShadow = true;
    return { group: boatGroup, materials, primaryMat: orangePontoons, motorGroup, spotlight };
  }

  function createFloatingBarrelCluster() {
    const cluster = new THREE.Group();
    const barrelColors = [0x0284c7, 0xdc2626, 0xeab308];
    const drumGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.9, 10);
    for (let b = 0; b < 3; b++) {
      const mat = new THREE.MeshStandardMaterial({ color: barrelColors[b % barrelColors.length], roughness: 0.5, metalness: 0.4 });
      const drum = new THREE.Mesh(drumGeo, mat);
      drum.position.set((b - 1) * 0.45, 0.2, (b % 2 === 0 ? 0.2 : -0.2));
      cluster.add(drum);
    }
    return { group: cluster };
  }

  function createFloatingTimberRaft() {
    const raft = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    for (let p = 0; p < 5; p++) {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 2.8), woodMat);
      plank.position.set((p - 2) * 0.38, 0.1, (Math.random() - 0.5) * 0.3);
      raft.add(plank);
    }
    return { group: raft };
  }

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

  // -------------------------------------------------------------------------
  // 1. WAZIRABAD BARRAGE & WATER TREATMENT PLANT (u = 0.20) - SHATTERING & BLOWOUT
  // -------------------------------------------------------------------------
  const fWazir = getRiverFrame(0.20);
  const wazirGroup = new THREE.Group();
  wazirGroup.position.copy(fWazir.pt);

  const barrageSpan = 26.0;
  const barragePiers = 8;
  const pierSpacing = barrageSpan / barragePiers;

  const wazirPiers = [];
  const wazirGates = [];

  for (let i = 0; i <= barragePiers; i++) {
    const offset = (i - barragePiers * 0.5) * pierSpacing;
    const pier = new THREE.Mesh(new THREE.BoxGeometry(0.85, 5.8, 3.8), concreteMat);
    const pPos = new THREE.Vector3(fWazir.side.x * offset, 1.8, fWazir.side.z * offset);
    pier.position.copy(pPos);
    pier.castShadow = true;
    wazirGroup.add(pier);
    wazirPiers.push({ mesh: pier, basePos: pPos.clone(), index: i });

    if (i < barragePiers) {
      const gate = new THREE.Mesh(new THREE.BoxGeometry(pierSpacing * 0.88, 2.9, 0.32), darkSteel);
      const gateOffset = offset + pierSpacing * 0.5;
      const gPos = new THREE.Vector3(fWazir.side.x * gateOffset, 1.4, fWazir.side.z * gateOffset);
      gate.position.copy(gPos);
      gate.castShadow = true;
      wazirGroup.add(gate);
      wazirGates.push({
        mesh: gate,
        basePos: gPos.clone(),
        index: i,
        isBlowout: (i >= 2 && i <= 5) // Central gates blow out
      });
    }
  }

  // WTP Pump House on West Bank with Shattering Wall & Roof Collapse
  const pumpHouseGroup = new THREE.Group();
  const pumpHousePos = fWazir.pt.clone().addScaledVector(fWazir.side, 22.0);
  pumpHousePos.y = terrain.getTerrainHeight(pumpHousePos.x, pumpHousePos.z) + 2.25;
  pumpHouseGroup.position.copy(pumpHousePos);

  const pumpHouseMain = new THREE.Mesh(new THREE.BoxGeometry(10.0, 4.5, 8.0), concreteMat);
  pumpHouseMain.castShadow = true;
  pumpHouseGroup.add(pumpHouseMain);

  // Riverside fragile brick wall that collapses into water
  const pumpWallMat = new THREE.MeshStandardMaterial({ color: 0xb45309, map: delhiBrickTex, roughness: 0.85 });
  const pumpFrontWall = new THREE.Mesh(new THREE.BoxGeometry(10.1, 4.4, 0.5), pumpWallMat);
  pumpFrontWall.position.set(0, 0, 4.05);
  pumpHouseGroup.add(pumpFrontWall);

  // Shattered concrete rubble chunks around pump house
  const pumpRubblePieces = [];
  for (let r = 0; r < 6; r++) {
    const rb = new THREE.Mesh(new THREE.BoxGeometry(0.8 + Math.random() * 0.6, 0.6, 0.8), concreteMat);
    const rbPos = new THREE.Vector3((Math.random() - 0.5) * 8.0, -1.8, 4.5 + Math.random() * 3.0);
    rb.position.copy(rbPos);
    pumpHouseGroup.add(rb);
    pumpRubblePieces.push({ mesh: rb, basePos: rbPos.clone(), index: r });
  }

  group.add(pumpHouseGroup);
  group.add(wazirGroup);

  // Register WTP pump house in wipeableItems for automated test verification
  wipeableItems.push({
    mesh: pumpHouseGroup,
    uTrigger: 0.20,
    initialPos: pumpHousePos.clone(),
    initialRot: pumpHouseGroup.rotation.clone(),
    driftDir: fWazir.tangent.clone().multiplyScalar(16.0),
    collapseTilt: 0.38,
    sinkScale: 0.22,
    washSpeed: 25.0,
    maxProg: 0.08,
    material: concreteMat
  });

  // -------------------------------------------------------------------------
  // 2. OLD YAMUNA IRON BRIDGE (LOHA PUL - 1866) (u = 0.35) - CATASTROPHIC SHATTERING
  // -------------------------------------------------------------------------
  const fLoha = getRiverFrame(0.35);
  const lohaGroup = new THREE.Group();
  lohaGroup.position.copy(fLoha.pt);

  const lohaPiers = 4;
  const lohaSpan = 28.0;
  const lohaSpacing = lohaSpan / lohaPiers;

  // 1. Stone Masonry Piers with foundation scouring & tilt
  const lohaPierMeshes = [];
  for (let s = 0; s <= lohaPiers; s++) {
    const offset = (s - lohaPiers * 0.5) * lohaSpacing;
    const pier = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.65, 6.8, 16), redSandstoneMat);
    const pPos = new THREE.Vector3(fLoha.side.x * offset, 2.0, fLoha.side.z * offset);
    pier.position.copy(pPos);
    pier.castShadow = true;
    pier.receiveShadow = true;
    lohaGroup.add(pier);
    lohaPierMeshes.push({ mesh: pier, basePos: pPos.clone(), index: s });
  }

  // 2. Steel Lattice Truss Spans (Span 2 breaks and plunges downward)
  const lohaTrussMeshes = [];
  for (let s = 0; s < lohaPiers; s++) {
    const spanCenter = (s - lohaPiers * 0.5 + 0.5) * lohaSpacing;
    const tPos = new THREE.Vector3(fLoha.side.x * spanCenter, 5.2, fLoha.side.z * spanCenter);

    if (s === 2) {
      // Snapped into two halves (truss2A and truss2B)
      const halfLen = lohaSpacing * 0.48;
      const trussA = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.3, halfLen), darkSteel);
      const posA = tPos.clone().addScaledVector(fLoha.side, -halfLen * 0.5);
      trussA.position.copy(posA);
      trussA.castShadow = true;
      lohaGroup.add(trussA);

      const trussB = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.3, halfLen), darkSteel);
      const posB = tPos.clone().addScaledVector(fLoha.side, halfLen * 0.5);
      trussB.position.copy(posB);
      trussB.castShadow = true;
      lohaGroup.add(trussB);

      lohaTrussMeshes.push({
        span: s,
        isSplit: true,
        halfA: { mesh: trussA, basePos: posA.clone(), baseRot: trussA.rotation.clone() },
        halfB: { mesh: trussB, basePos: posB.clone(), baseRot: trussB.rotation.clone() }
      });
    } else {
      const truss = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.3, lohaSpacing * 0.96), darkSteel);
      truss.position.copy(tPos);
      truss.castShadow = true;
      lohaGroup.add(truss);
      lohaTrussMeshes.push({
        span: s,
        isSplit: false,
        mesh: truss,
        basePos: tPos.clone(),
        baseRot: truss.rotation.clone()
      });
    }
  }

  // 3. Train: Locomotive + 3 Passenger Sleeper Coaches
  const locoMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.35, metalness: 0.6 });
  const locoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.88, 1.25, 3.6), locoMat);
  const locoBasePos = new THREE.Vector3(0, 6.85, 2.2);
  locoMesh.position.copy(locoBasePos);
  locoMesh.castShadow = true;
  lohaGroup.add(locoMesh);

  const coaches = [];
  const coachColors = [0xb45309, 0x9a3412, 0x7c2d12];
  for (let c = 0; c < 3; c++) {
    const cMat = new THREE.MeshStandardMaterial({ color: coachColors[c], roughness: 0.45 });
    const cMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.15, 4.1), cMat);
    const cPos = new THREE.Vector3(0, 6.85, -2.3 - c * 4.3);
    cMesh.position.copy(cPos);
    cMesh.castShadow = true;
    lohaGroup.add(cMesh);
    coaches.push({ mesh: cMesh, basePos: cPos.clone(), index: c });
  }

  // 4. Severed Twisted Steel Rails & Splintered Bridge Debris
  const brokenSteelBeams = [];
  for (let b = 0; b < 8; b++) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 2.6 + Math.random() * 1.8), darkSteel);
    const bPos = new THREE.Vector3(
      (Math.random() - 0.5) * 3.5,
      5.2 + Math.random() * 1.2,
      (Math.random() - 0.5) * 6.0
    );
    beam.position.copy(bPos);
    beam.castShadow = true;
    lohaGroup.add(beam);
    brokenSteelBeams.push({
      mesh: beam,
      basePos: bPos.clone(),
      driftVel: new THREE.Vector3(
        fLoha.tangent.x * (20.0 + Math.random() * 14.0),
        -6.0 - Math.random() * 4.0,
        fLoha.tangent.z * (20.0 + Math.random() * 14.0)
      ),
      spinVel: new THREE.Vector3(Math.random() * 7.0, Math.random() * 9.0, Math.random() * 7.0)
    });
  }

  group.add(lohaGroup);

  // Register Old Iron Bridge in wipeableItems for automated verification
  wipeableItems.push({
    mesh: lohaGroup,
    uTrigger: 0.35,
    initialPos: fLoha.pt.clone(),
    initialRot: lohaGroup.rotation.clone(),
    driftDir: fLoha.tangent.clone().multiplyScalar(22.0),
    collapseTilt: 0.45,
    sinkScale: 0.25,
    washSpeed: 30.0,
    maxProg: 0.09,
    material: darkSteel
  });

  // -------------------------------------------------------------------------
  // 3. NIGAMBODH GHAT SACRED BATHING COMPLEX (u = 0.42)
  // -------------------------------------------------------------------------
  const fGhat = getRiverFrame(0.42);
  const ghatObj = createNigambodhGhat();
  const ghatPos = fGhat.pt.clone().addScaledVector(fGhat.side, 13.0);
  ghatPos.y = terrain.getTerrainHeight(ghatPos.x, ghatPos.z) + 0.1;
  ghatObj.group.position.copy(ghatPos);
  ghatObj.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fGhat.tangent);
  group.add(ghatObj.group);

  // -------------------------------------------------------------------------
  // 4. KASHMERE GATE ISBT & SUBMERGED RING ROAD (u = 0.46)
  // -------------------------------------------------------------------------
  const fKash = getRiverFrame(0.46);
  const isbt = createISBTTerminal();
  const isbtPos = fKash.pt.clone().addScaledVector(fKash.side, 36.0);
  isbtPos.y = terrain.getTerrainHeight(isbtPos.x, isbtPos.z);
  isbt.group.position.copy(isbtPos);
  isbt.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fKash.tangent);
  group.add(isbt.group);

  // Contiguous Submerged Ring Road Highway (Mahatma Gandhi Marg)
  for (let ru = 0.28; ru <= 0.82; ru += 0.045) {
    const rf = getRiverFrame(ru);
    const roadPiece = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.45, 11.5), tarmacMat);
    const rPos = rf.pt.clone().addScaledVector(rf.side, 20.0);
    rPos.y = terrain.getTerrainHeight(rPos.x, rPos.z) + 0.22;
    roadPiece.position.copy(rPos);
    roadPiece.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), rf.tangent);
    roadPiece.castShadow = true;
    roadPiece.receiveShadow = true;
    group.add(roadPiece);
  }

  // Elevated Delhi Metro Viaduct running along the West Bank
  const metroViaduct = createDelhiMetroViaduct();
  const metroPos = fKash.pt.clone().addScaledVector(fKash.side, 26.0);
  metroViaduct.group.position.copy(metroPos);
  metroViaduct.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fKash.tangent);
  group.add(metroViaduct.group);

  // -------------------------------------------------------------------------
  // 5. AUTHENTIC RED FORT (LAL QILA) COMPLEX & DYNAMIC MOAT (u = 0.60)
  // -------------------------------------------------------------------------
  const fFort = getRiverFrame(0.60);
  const redFort = createRedFortComplex();
  const fortPos = fFort.pt.clone().addScaledVector(fFort.side, 32.0);
  fortPos.y = terrain.getTerrainHeight(fortPos.x, fortPos.z) + 0.1;
  redFort.group.position.copy(fortPos);
  redFort.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fFort.tangent);
  group.add(redFort.group);

  // -------------------------------------------------------------------------
  // 6. ITO BARRAGE & DRAIN 12 REGULATOR BREACH (u = 0.74) - EXPLOSIVE BLOWOUT
  // -------------------------------------------------------------------------
  const fIto = getRiverFrame(0.74);
  const itoGroup = new THREE.Group();
  itoGroup.position.copy(fIto.pt);

  for (let i = -5; i <= 5; i++) {
    const pier = new THREE.Mesh(new THREE.BoxGeometry(0.7, 4.8, 3.2), concreteMat);
    pier.position.set(fIto.side.x * i * 2.2, 1.5, fIto.side.z * i * 2.2);
    itoGroup.add(pier);
  }

  const drainHeadwall = new THREE.Mesh(new THREE.BoxGeometry(4.0, 3.2, 1.8), concreteMat);
  const headPos = new THREE.Vector3(fIto.side.x * 12.0, 1.8, fIto.side.z * 12.0);
  drainHeadwall.position.copy(headPos);
  itoGroup.add(drainHeadwall);

  // Regulator 12 Gate that blows completely out under hydraulic reverse pressure
  const regulatorGate = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.0, 0.28), darkSteel);
  const regBasePos = new THREE.Vector3(fIto.side.x * 12.0, 1.1, fIto.side.z * 12.0 + 0.5);
  regulatorGate.position.copy(regBasePos);
  regulatorGate.castShadow = true;
  itoGroup.add(regulatorGate);

  // Shattered concrete debris blocks flung outward into Drain 12
  const itoRubblePieces = [];
  for (let r = 0; r < 5; r++) {
    const rb = new THREE.Mesh(new THREE.BoxGeometry(0.7 + Math.random() * 0.5, 0.5, 0.7), concreteMat);
    const rbPos = regBasePos.clone().add(new THREE.Vector3(
      (Math.random() - 0.5) * 2.0,
      -0.4,
      (Math.random() - 0.5) * 2.0
    ));
    rb.position.copy(rbPos);
    itoGroup.add(rb);
    itoRubblePieces.push({ mesh: rb, basePos: rbPos.clone(), index: r });
  }

  const vikasTower = new THREE.Mesh(new THREE.BoxGeometry(9.0, 26.0, 9.0), new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.35,
    metalness: 0.4
  }));
  const vikasPos = fIto.pt.clone().addScaledVector(fIto.side, 34.0);
  vikasTower.position.set(vikasPos.x, 13.0, vikasPos.z);
  group.add(vikasTower);
  group.add(itoGroup);

  // Register ITO Regulator in wipeableItems
  wipeableItems.push({
    mesh: itoGroup,
    uTrigger: 0.74,
    initialPos: fIto.pt.clone(),
    initialRot: itoGroup.rotation.clone(),
    driftDir: fIto.tangent.clone().multiplyScalar(18.0),
    collapseTilt: 0.35,
    sinkScale: 0.18,
    washSpeed: 24.0,
    maxProg: 0.08,
    material: concreteMat
  });

  // -------------------------------------------------------------------------
  // 7. RAJGHAT MEMORIAL & DISASTER RELIEF CAMP (u = 0.88)
  // -------------------------------------------------------------------------
  const fRaj = getRiverFrame(0.88);
  const rajGroup = new THREE.Group();
  rajGroup.position.copy(fRaj.pt);

  const rajWall = new THREE.Mesh(new THREE.BoxGeometry(14.0, 1.8, 14.0), concreteMat);
  rajWall.position.set(fRaj.side.x * 18.0, 2.2, fRaj.side.z * 18.0);
  rajGroup.add(rajWall);

  const rajLawn = new THREE.Mesh(new THREE.BoxGeometry(12.0, 0.4, 12.0), new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 }));
  rajLawn.position.set(fRaj.side.x * 18.0, 2.3, fRaj.side.z * 18.0);
  rajGroup.add(rajLawn);

  const plinth = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 2.4), new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2 }));
  plinth.position.set(fRaj.side.x * 18.0, 2.8, fRaj.side.z * 18.0);
  rajGroup.add(plinth);

  for (let p = 0; p < 3; p++) {
    const pumpUnit = new THREE.Group();
    const pumpEngine = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 1.8), new THREE.MeshStandardMaterial({ color: 0x16a34a }));
    pumpEngine.position.y = 0.6;
    pumpUnit.add(pumpEngine);
    pumpUnit.position.set(fRaj.side.x * 12.0, 2.4, fRaj.side.z * 12.0 - 5.0 + p * 4.5);
    rajGroup.add(pumpUnit);
  }
  group.add(rajGroup);

  // -------------------------------------------------------------------------
  // 8. DENSE OLD DELHI (SHAHJAHANABAD) URBAN HAVELIS (120+ Blocks)
  // Strictly placed at dist >= 44m on West Bank (completely clear of river & road)
  // -------------------------------------------------------------------------
  const haveliWallColors = [
    0x991b1b, // Terracotta red brick
    0xb45309, // Ochre brick
    0xd97706, // Weathered amber
    0x78350f, // Deep earthen brown
    0x4b5563, // Plaster grey
    0x94a3b8, // Dusty sandstone
    0x1e3a8a, // Indigo blue haveli accent
    0x047857  // Emerald green haveli accent
  ];

  let hIdx = 0;
  const shatteringHavelis = [];

  for (let uStation = 0.30; uStation <= 0.74; uStation += 0.038) {
    const fStation = getRiverFrame(uStation);

    for (let depth = 44.0; depth <= 92.0; depth += 9.5) {
      for (const tOffset of [-4.2, 4.2]) {
        const hPos = fStation.pt.clone()
          .addScaledVector(fStation.side, depth)
          .addScaledVector(fStation.tangent, tOffset);

        // Verification safety check: NEVER within 38m of river centerline!
        if (typeof river.getClosestRiverInfo === 'function' && river.getClosestRiverInfo(hPos.x, hPos.z).distance < 38.0) continue;

        const haveli = createDelhiHaveliBlock(
          6.0 + (hIdx % 3) * 0.7,
          9.5 + (hIdx % 4) * 1.5,
          6.2 + (hIdx % 2) * 0.8,
          haveliWallColors[hIdx % haveliWallColors.length],
          (depth < 65.0), // Ground-floor bazaar shops on commercial avenues
          3 + (hIdx % 3)
        );

        hPos.y = terrain.getTerrainHeight(hPos.x, hPos.z);
        haveli.group.position.copy(hPos);
        haveli.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fStation.tangent);
        if (hIdx % 2 === 1) haveli.group.rotateY(Math.PI * 0.5);

        group.add(haveli.group);

        // 24 Frontline havelis closest to the flood basin are vulnerable to structural shattering & collapse!
        if (depth <= 55.0) {
          shatteringHavelis.push({
            group: haveli.group,
            uTrigger: uStation,
            basePos: hPos.clone(),
            baseRot: haveli.group.rotation.clone(),
            tangent: fStation.tangent.clone(),
            tiltDir: (hIdx % 2 === 0 ? 1 : -1),
            sintex: haveli.sintex,
            sintexBase: haveli.sintex ? haveli.sintex.position.clone() : null,
            mumty: haveli.mumty,
            mumtyBase: haveli.mumty ? haveli.mumty.position.clone() : null,
            rubbleGroup: haveli.rubbleGroup,
            rubblePieces: haveli.rubblePieces || []
          });

          // Register in wipeableItems for automated test suite tracking
          wipeableItems.push({
            mesh: haveli.group,
            uTrigger: uStation,
            initialPos: hPos.clone(),
            initialRot: haveli.group.rotation.clone(),
            driftDir: fStation.tangent.clone().multiplyScalar(16.0),
            collapseTilt: (hIdx % 2 === 0 ? 1 : -1) * 0.42,
            sinkScale: 0.16,
            washSpeed: 22.0,
            maxProg: 0.08,
            material: haveli.primaryMat,
            materials: haveli.materials
          });
        }

        hIdx++;
      }
    }
  }

  // -------------------------------------------------------------------------
  // 9. FLOODPLAIN BASTI SHANTIES & COLLAPSING STRUCTURES (90+ Units)
  // -------------------------------------------------------------------------
  const hutWallColors = [0x991b1b, 0xb45309, 0xd97706, 0x4b5563, 0x78350f, 0xa16207];
  const hutRoofColors = [0x475569, 0x0284c7, 0xea580c, 0x64748b, 0x0f766e];
  const roofTypes = ['cgi', 'tarp', 'flat'];

  // Cluster A: Wazirabad & Majnu Ka Tila (u = 0.21 - 0.29) - 18 Huts
  for (let i = 0; i < 18; i++) {
    const uHut = 0.21 + i * 0.005;
    const fHut = getRiverFrame(uHut);
    const bankDir = (i % 2 === 0) ? 1 : -1;
    const dist = (bankDir === 1) ? (14.0 + (i % 3) * 1.5) : (15.0 + (i % 3) * 2.0);

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

  // Cluster B: Yamuna Bazar & Loha Pul Riverbed (u = 0.36 - 0.46) - 22 Huts
  for (let i = 0; i < 22; i++) {
    const uBasti = 0.36 + i * 0.0045;
    const fBasti = getRiverFrame(uBasti);
    const bankDir = (i % 3 === 0) ? -1 : 1;
    const dist = (bankDir === 1) ? (14.2 + (i % 3) * 1.5) : (16.0 + (i % 3) * 2.0);

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

  // Cluster C: Bela Estate & Geeta Colony (u = 0.61 - 0.71) - 20 Huts
  for (let i = 0; i < 20; i++) {
    const uBela = 0.61 + i * 0.005;
    const fBela = getRiverFrame(uBela);
    const bankDir = (i % 2 === 0) ? -1 : 1;
    const dist = (bankDir === 1) ? (14.5 + (i % 3) * 1.5) : (17.0 + (i % 3) * 2.0);

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

  // Cluster D: South Floodplain (u = 0.82 - 0.94) - 15 Huts
  for (let i = 0; i < 15; i++) {
    const uSouth = 0.82 + i * 0.008;
    const fSouth = getRiverFrame(uSouth);
    const dist = (i % 2 === 0 ? 15.0 : -16.5);

    const hut = createBastiHut(
      3.0, 2.2, 3.2,
      hutWallColors[(i + 4) % hutWallColors.length],
      hutRoofColors[i % hutRoofColors.length],
      'cgi'
    );
    const pos = fSouth.pt.clone().addScaledVector(fSouth.side, dist);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    hut.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fSouth.tangent);

    registerWipeable(hut.group, uSouth, pos, fSouth.tangent, fSouth.side, {
      primaryMat: hut.primaryMat,
      materials: hut.materials,
      driftSpeed: 24.0
    });
  }

  // Riverbed Tea Stalls & Country Boats
  [0.24, 0.38, 0.44, 0.65, 0.72].forEach((uChai, idx) => {
    const fChai = getRiverFrame(uChai);
    const chai = createTeaStall();
    const pos = fChai.pt.clone().addScaledVector(fChai.side, (idx % 2 === 0 ? 13.5 : -14.5));
    pos.y = terrain.getTerrainHeight(pos.x, pos.z) + 0.1;
    chai.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fChai.tangent);

    registerWipeable(chai.group, uChai, pos, fChai.tangent, fChai.side, {
      primaryMat: chai.primaryMat,
      materials: chai.materials,
      driftSpeed: 25.0
    });
  });

  [0.23, 0.27, 0.37, 0.43, 0.64, 0.68].forEach((uBoat, bIdx) => {
    const fBoat = getRiverFrame(uBoat);
    const boat = createCountryBoat();
    const pos = fBoat.pt.clone().addScaledVector(fBoat.side, (bIdx % 2 === 0 ? 4.2 : -4.2));
    pos.y = fBoat.pt.y + 0.2;
    boat.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fBoat.tangent);

    registerWipeable(boat.group, uBoat, pos, fBoat.tangent, fBoat.side, {
      primaryMat: boat.primaryMat,
      materials: boat.materials,
      driftSpeed: 29.0
    });
  });

  // Brick Kilns on East Bank
  [0.28, 0.66].forEach(uK => {
    const fK = getRiverFrame(uK);
    const kiln = createBrickKiln();
    const pos = fK.pt.clone().addScaledVector(fK.side, -20.0);
    pos.y = terrain.getTerrainHeight(pos.x, pos.z);
    kiln.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fK.tangent);

    registerWipeable(kiln.group, uK, pos, fK.tangent, fK.side, {
      primaryMat: kiln.primaryMat,
      materials: kiln.materials,
      driftSpeed: 18.0,
      collapseTilt: 0.4
    });
  });

  // Sandbag Embankment Bunds at ITO & Rajghat
  for (let s = 0; s < 4; s++) {
    const bund = createSandbagBundSegment(4.2);
    const pos = fIto.pt.clone().addScaledVector(fIto.side, 16.5).addScaledVector(fIto.tangent, (s - 1.5) * 4.2);
    pos.y = 1.4;
    bund.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fIto.tangent);

    registerWipeable(bund.group, 0.735 + s * 0.008, pos, fIto.tangent, fIto.side, {
      primaryMat: bund.primaryMat,
      materials: bund.materials,
      driftSpeed: 22.0,
      collapseTilt: 0.6
    });
  }

  // -------------------------------------------------------------------------
  // 10. 65+ VEHICLES: DTC BUSES, AUTOS, POLICE GYPSYS, BARRICADES & CARS
  // -------------------------------------------------------------------------

  // A. DTC Low-Floor Buses
  {
    const bus1 = createDTCBus(false);
    const pos = fKash.pt.clone().addScaledVector(fKash.side, 19.5).addScaledVector(fKash.tangent, 3.0);
    pos.y = 2.4;
    bus1.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fKash.tangent);
    bus1.group.rotation.z = 0.14;

    registerWipeable(bus1.group, 0.48, pos, fKash.tangent, fKash.side, {
      primaryMat: bus1.primaryMat,
      materials: bus1.materials,
      driftSpeed: 30.0,
      sinkScale: 0.22
    });
  }

  {
    const bus2 = createDTCBus(true);
    const pos = fKash.pt.clone().addScaledVector(fKash.side, 21.0).addScaledVector(fKash.tangent, -6.5);
    pos.y = 2.2;
    bus2.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fKash.tangent);
    bus2.group.rotation.x = -0.12;

    registerWipeable(bus2.group, 0.485, pos, fKash.tangent, fKash.side, {
      primaryMat: bus2.primaryMat,
      materials: bus2.materials,
      driftSpeed: 28.0,
      sinkScale: 0.25
    });
  }

  // Buses parked at ISBT bays and along Ring Road
  [0.44, 0.47, 0.52, 0.62].forEach((bu, bIdx) => {
    const bf = getRiverFrame(bu);
    const bus = createDTCBus(bIdx % 2 === 1);
    const bPos = bf.pt.clone().addScaledVector(bf.side, (bIdx < 2 ? 35.0 : 20.0)).addScaledVector(bf.tangent, (bIdx % 2) * 5.0);
    bPos.y = terrain.getTerrainHeight(bPos.x, bPos.z) + 0.1;
    bus.group.position.copy(bPos);
    bus.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), bf.tangent);
    group.add(bus.group);
  });

  // B. Bajaj Auto-Rickshaws (18 Units)
  [-3.0, 1.5, 6.0, 10.5, -7.5].forEach((zOff, aIdx) => {
    const auto = createAutoRickshaw();
    const pos = fKash.pt.clone().addScaledVector(fKash.side, 18.5 + (aIdx % 3) * 1.5).addScaledVector(fKash.tangent, zOff);
    pos.y = 2.1;
    auto.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fKash.tangent);
    auto.group.rotation.x = -0.18;
    auto.group.rotation.z = (aIdx % 2 === 0 ? 0.2 : -0.2);

    registerWipeable(auto.group, 0.475 + aIdx * 0.008, pos, fKash.tangent, fKash.side, {
      primaryMat: auto.primaryMat,
      materials: auto.materials,
      driftSpeed: 32.0,
      tumbleScale: 9.0
    });
  });

  for (let a = 0; a < 13; a++) {
    const uA = 0.35 + (a / 13) * 0.35;
    const fA = getRiverFrame(uA);
    const auto = createAutoRickshaw();
    const aPos = fA.pt.clone().addScaledVector(fA.side, 45.0 + (a % 3) * 6.0);
    aPos.y = terrain.getTerrainHeight(aPos.x, aPos.z);
    auto.group.position.copy(aPos);
    auto.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fA.tangent);
    group.add(auto.group);
  }

  // C. Delhi Police Gypsys (6 Units) & Steel Barricades (8 Units)
  [0.38, 0.44, 0.50, 0.58, 0.65, 0.72].forEach((pu, pIdx) => {
    const pf = getRiverFrame(pu);
    const gypsy = createDelhiPoliceGypsy();
    const pPos = pf.pt.clone().addScaledVector(pf.side, 21.5).addScaledVector(pf.tangent, 2.0);
    pPos.y = terrain.getTerrainHeight(pPos.x, pPos.z);
    gypsy.group.position.copy(pPos);
    gypsy.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pf.tangent);
    gypsy.group.rotateY(0.25);
    group.add(gypsy.group);

    const barricade = createPoliceBarricade();
    const barPos = pf.pt.clone().addScaledVector(pf.side, 20.0).addScaledVector(pf.tangent, -2.5);
    barPos.y = terrain.getTerrainHeight(barPos.x, barPos.z);
    barricade.group.position.copy(barPos);
    barricade.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pf.tangent);
    group.add(barricade.group);
  });

  [0.48, 0.60].forEach(pu => {
    const pf = getRiverFrame(pu);
    const barricade = createPoliceBarricade();
    const barPos = pf.pt.clone().addScaledVector(pf.side, 23.0);
    barPos.y = terrain.getTerrainHeight(barPos.x, barPos.z);
    barricade.group.position.copy(barPos);
    barricade.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pf.tangent);
    group.add(barricade.group);
  });

  // D. Passenger Cars & Commercial Delivery Tempos (24 Units)
  const carColors = [0xf8fafc, 0xe2e8f0, 0x94a3b8, 0xdc2626, 0xd97706, 0x2563eb];

  for (let c = 0; c < 8; c++) {
    const car = createPassengerCar(carColors[c % carColors.length]);
    const uCar = 0.48 + c * 0.006;
    const fCar = getRiverFrame(uCar);
    const pos = fCar.pt.clone().addScaledVector(fCar.side, 19.5 + (c % 3) * 1.5).addScaledVector(fCar.tangent, (c - 3.5) * 3.5);
    pos.y = 2.2;
    car.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fCar.tangent);
    car.group.rotation.z = (c % 2 === 0 ? 0.35 : -0.25);

    registerWipeable(car.group, uCar, pos, fCar.tangent, fCar.side, {
      primaryMat: car.primaryMat,
      materials: car.materials,
      driftSpeed: 28.0,
      tumbleScale: 7.0
    });
  }

  for (let c = 0; c < 16; c++) {
    const car = createPassengerCar(carColors[(c + 2) % carColors.length]);
    const uC = 0.32 + (c / 16) * 0.40;
    const fC = getRiverFrame(uC);
    const cPos = fC.pt.clone().addScaledVector(fC.side, 48.0 + (c % 3) * 8.0).addScaledVector(fC.tangent, 3.0);
    cPos.y = terrain.getTerrainHeight(cPos.x, cPos.z);
    car.group.position.copy(cPos);
    car.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), fC.tangent);
    group.add(car.group);
  }

  // -------------------------------------------------------------------------
  // 11. NDRF MOTORIZED RESCUE BOATS PATROL FLEET (6 Boats)
  // -------------------------------------------------------------------------
  const ndrfRescueFleet = [];
  const boatDefs = [
    { u: 0.24, side: 6.8, patrolSpan: 8.0, desc: 'Wazirabad & Majnu Ka Tila Floodplain Rescue' },
    { u: 0.38, side: -5.5, patrolSpan: 10.0, desc: 'Loha Pul & Yamuna Bazar Evacuation Patrol' },
    { u: 0.48, side: 10.2, patrolSpan: 12.0, desc: 'Kashmere Gate ISBT Submerged Ring Road Evac' },
    { u: 0.63, side: 8.0, patrolSpan: 9.0, desc: 'Red Fort & Salimgarh Ancient Bed Patrol' },
    { u: 0.76, side: 13.5, patrolSpan: 7.0, desc: 'ITO Drain 12 Regulator Breach Response' },
    { u: 0.86, side: -7.5, patrolSpan: 11.0, desc: 'Rajghat Relief Corridor Shuttling' }
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
        boat.group.position.copy(boat.basePos);
        const f = getRiverFrame(boat.uCenter);
        boat.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), f.tangent);
      } else {
        const waveIntensity = Math.min(1.0, (uWave - boat.uTrigger) / 0.15);
        const patrol = Math.sin(timeSec * 0.75 + boat.phase) * boat.patrolSpan * 0.002;
        const currentU = Math.min(0.96, Math.max(0.05, boat.uCenter + patrol));
        const f = getRiverFrame(currentU);

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

  // -------------------------------------------------------------------------
  // 12. FLOATING DEBRIS FLOTILLA (Chemical Drums & Timber Rafts)
  // -------------------------------------------------------------------------
  const floatingFlotilla = [];
  const debrisDefs = [
    { type: 'barrels', u: 0.23, side: 3.5, driftRate: 0.25 },
    { type: 'timber',  u: 0.27, side: -4.0, driftRate: 0.28 },
    { type: 'barrels', u: 0.36, side: 4.2, driftRate: 0.30 },
    { type: 'timber',  u: 0.42, side: -3.8, driftRate: 0.26 },
    { type: 'barrels', u: 0.49, side: 4.5, driftRate: 0.32 },
    { type: 'timber',  u: 0.53, side: -3.0, driftRate: 0.27 },
    { type: 'barrels', u: 0.63, side: 5.0, driftRate: 0.34 },
    { type: 'timber',  u: 0.69, side: -4.5, driftRate: 0.29 },
    { type: 'barrels', u: 0.75, side: 4.0, driftRate: 0.33 },
    { type: 'timber',  u: 0.81, side: -3.2, driftRate: 0.28 }
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
      }
    }
  }

  function updatePoliceBeacons() {
    const timeSec = Date.now() * 0.001;
    const strobe = (Math.sin(timeSec * 16.0) > 0);
    flashingBeacons.forEach(b => {
      if (b.red) b.red.emissiveIntensity = strobe ? 1.5 : 0.2;
      if (b.blue) b.blue.emissiveIntensity = strobe ? 0.2 : 1.5;
    });
  }

  // -------------------------------------------------------------------------
  // REAL-TIME BRIDGE & BUILDING SHATTERING DYNAMICS
  // -------------------------------------------------------------------------
  function updateOldIronBridgeShatter(uWave) {
    if (uWave < 0.34) {
      // 100% pristine standing bridge before flood wave arrives
      lohaGroup.visible = true;
      lohaPierMeshes.forEach(p => {
        p.mesh.position.copy(p.basePos);
        p.mesh.rotation.set(0, 0, 0);
      });
      lohaTrussMeshes.forEach(t => {
        if (t.isSplit) {
          t.halfA.mesh.position.copy(t.halfA.basePos);
          t.halfA.mesh.rotation.set(0, 0, 0);
          t.halfB.mesh.position.copy(t.halfB.basePos);
          t.halfB.mesh.rotation.set(0, 0, 0);
        } else {
          t.mesh.position.copy(t.basePos);
          t.mesh.rotation.set(0, 0, 0);
        }
      });
      locoMesh.position.copy(locoBasePos);
      locoMesh.rotation.set(0, 0, 0);
      coaches.forEach(c => {
        c.mesh.position.copy(c.basePos);
        c.mesh.rotation.set(0, 0, 0);
      });
      brokenSteelBeams.forEach(b => {
        b.mesh.position.copy(b.basePos);
        b.mesh.rotation.set(0, 0, 0);
        b.mesh.visible = false;
      });
    } else {
      // Catastrophic structural collapse as flood bore hits Loha Pul (u = 0.35)
      const prog = Math.min(1.0, (uWave - 0.34) / 0.12);
      const ease = Math.sin(prog * Math.PI * 0.5);

      // 1. Foundation scouring: Central deepwater pier tilts by 22 degrees into torrent
      const p2 = lohaPierMeshes[2];
      if (p2) {
        p2.mesh.rotation.z = ease * 0.38;
        p2.mesh.position.y = p2.basePos.y - ease * 0.9;
      }
      const p1 = lohaPierMeshes[1];
      if (p1) {
        p1.mesh.rotation.z = ease * 0.16;
      }

      // 2. Central Steel Truss Span 2 snaps in two and plunges into river!
      const t2 = lohaTrussMeshes[2];
      if (t2 && t2.isSplit) {
        // Half A: breaks and plunges downward at 46 degree angle
        t2.halfA.mesh.rotation.z = ease * 0.80;
        t2.halfA.mesh.rotation.x = ease * 0.28;
        t2.halfA.mesh.position.y = t2.halfA.basePos.y - ease * 4.2;
        t2.halfA.mesh.position.x = t2.halfA.basePos.x + ease * fLoha.tangent.x * 2.8;
        t2.halfA.mesh.position.z = t2.halfA.basePos.z + ease * fLoha.tangent.z * 2.8;

        // Half B: shears off bearing shoe and washes downriver
        t2.halfB.mesh.rotation.z = -ease * 0.70;
        t2.halfB.mesh.rotation.y = ease * 0.50;
        t2.halfB.mesh.position.y = t2.halfB.basePos.y - ease * 4.8;
        t2.halfB.mesh.position.x = t2.halfB.basePos.x + ease * fLoha.tangent.x * 4.8;
        t2.halfB.mesh.position.z = t2.halfB.basePos.z + ease * fLoha.tangent.z * 4.8;
      }

      // Span 1: buckles under lateral pressure
      const t1 = lohaTrussMeshes[1];
      if (t1 && !t1.isSplit) {
        t1.mesh.rotation.z = ease * 0.32;
        t1.mesh.position.y = t1.basePos.y - ease * 1.6;
      }

      // 3. Train Derailment & Coaches Swept Downstream
      // Locomotive derails: nose plunges 34 degrees forward into abyss
      locoMesh.rotation.x = ease * 0.60;
      locoMesh.rotation.z = ease * 0.24;
      locoMesh.position.y = locoBasePos.y - ease * 2.1;
      locoMesh.position.z = locoBasePos.z + ease * 1.5;

      // Coach 0 jackknifes at 42 degree roll over broken girder
      if (coaches[0]) {
        coaches[0].mesh.rotation.z = ease * 0.72;
        coaches[0].mesh.rotation.x = ease * 0.32;
        coaches[0].mesh.position.y = coaches[0].basePos.y - ease * 1.6;
      }

      // Coach 1: completely washed off deck into river, rolls and floats downstream!
      if (coaches[1]) {
        const washDist = Math.pow(prog, 1.4) * 32.0;
        coaches[1].mesh.position.copy(coaches[1].basePos)
          .addScaledVector(fLoha.tangent, washDist)
          .add(new THREE.Vector3(0, -Math.min(5.5, ease * 5.8), 0));
        coaches[1].mesh.rotation.x = ease * 2.2;
        coaches[1].mesh.rotation.y = ease * 2.8;
        coaches[1].mesh.rotation.z = ease * 1.5;
      }

      // Coach 2: halted on standing approach
      if (coaches[2]) {
        coaches[2].mesh.rotation.y = ease * 0.22;
        coaches[2].mesh.rotation.z = ease * 0.14;
      }

      // 4. Broken steel I-beams scattering into water
      brokenSteelBeams.forEach(b => {
        b.mesh.visible = (prog > 0.08);
        const bWash = Math.pow(prog, 1.3);
        b.mesh.position.copy(b.basePos)
          .addScaledVector(b.driftVel, bWash)
          .add(new THREE.Vector3(0, -bWash * 6.5, 0));
        b.mesh.rotation.x = bWash * b.spinVel.x;
        b.mesh.rotation.y = bWash * b.spinVel.y;
        b.mesh.rotation.z = bWash * b.spinVel.z;
      });
    }
  }

  function updateWazirabadShatter(uWave) {
    if (uWave < 0.19) {
      // Pristine barrage & WTP
      wazirGates.forEach(g => {
        g.mesh.position.copy(g.basePos);
        g.mesh.rotation.set(0, 0, 0);
      });
      pumpFrontWall.position.set(0, 0, 4.05);
      pumpFrontWall.rotation.set(0, 0, 0);
      pumpHouseMain.rotation.set(0, 0, 0);
      pumpRubblePieces.forEach(r => {
        r.mesh.position.copy(r.basePos);
        r.mesh.visible = false;
      });
    } else {
      const prog = Math.min(1.0, (uWave - 0.19) / 0.10);
      const ease = Math.sin(prog * Math.PI * 0.5);

      // Central barrage gates blow out and wash downstream
      wazirGates.forEach(g => {
        if (g.isBlowout) {
          const washDist = Math.pow(prog, 1.3) * 25.0;
          g.mesh.position.copy(g.basePos)
            .addScaledVector(fWazir.tangent, washDist)
            .add(new THREE.Vector3(0, -ease * 3.5, 0));
          g.mesh.rotation.x = ease * 1.5;
          g.mesh.rotation.y = ease * 2.0;
        }
      });

      // Pump house wall cracks and collapses forward
      pumpFrontWall.rotation.x = ease * 1.2;
      pumpFrontWall.position.y = -ease * 1.5;
      pumpHouseMain.rotation.z = ease * 0.18;

      // Concrete rubble chunks tumble into water
      pumpRubblePieces.forEach(r => {
        r.mesh.visible = (prog > 0.15);
        r.mesh.position.y = r.basePos.y - ease * 1.2;
      });
    }
  }

  function updateITOShatter(uWave) {
    if (uWave < 0.73) {
      regulatorGate.position.copy(regBasePos);
      regulatorGate.rotation.set(0, 0, 0);
      itoRubblePieces.forEach(r => {
        r.mesh.position.copy(r.basePos);
        r.mesh.visible = false;
      });
    } else {
      // Explosive blowout of Regulator 12
      const prog = Math.min(1.0, (uWave - 0.73) / 0.10);
      const ease = Math.sin(prog * Math.PI * 0.5);

      const blowDist = Math.pow(prog, 1.2) * 18.0;
      regulatorGate.position.copy(regBasePos)
        .add(new THREE.Vector3(-ease * 12.0, -ease * 2.0, blowDist));
      regulatorGate.rotation.x = ease * 1.8;
      regulatorGate.rotation.z = ease * 2.2;

      itoRubblePieces.forEach(r => {
        r.mesh.visible = (prog > 0.1);
        r.mesh.position.y = r.basePos.y - ease * 1.8;
      });
    }
  }

  function updateHaveliShatter(uWave) {
    for (let i = 0; i < shatteringHavelis.length; i++) {
      const h = shatteringHavelis[i];
      if (uWave < h.uTrigger) {
        // Pristine standing building
        h.group.position.copy(h.basePos);
        h.group.rotation.copy(h.baseRot);
        if (h.sintex) {
          h.sintex.position.copy(h.sintexBase);
          h.sintex.rotation.set(0, 0, 0);
        }
        if (h.mumty) {
          h.mumty.position.copy(h.mumtyBase);
          h.mumty.rotation.set(0, 0, 0);
        }
        if (h.rubbleGroup) {
          h.rubbleGroup.visible = false;
        }
      } else {
        // Dramatic building shatter, wall crumble, and roof collapse
        const prog = Math.min(1.0, (uWave - h.uTrigger) / 0.085);
        const ease = Math.sin(prog * Math.PI * 0.5);

        // 1. Foundation scour & building tilt toward floodwaters
        const tiltZ = ease * h.tiltDir * 0.44; // 25 degree tilt
        const tiltX = ease * 0.24;
        h.group.rotation.z = h.baseRot.z + tiltZ;
        h.group.rotation.x = h.baseRot.x + tiltX;
        h.group.position.y = h.basePos.y - ease * 2.4; // Sinks into saturated silt

        // 2. Sintex water tank pops off and drifts downriver
        if (h.sintex) {
          const sWash = Math.pow(prog, 1.4) * 24.0;
          h.sintex.position.copy(h.sintexBase)
            .addScaledVector(h.tangent, sWash)
            .add(new THREE.Vector3(0, -ease * 3.8, 0));
          h.sintex.rotation.x = prog * 8.0;
          h.sintex.rotation.y = prog * 6.0;
        }

        // 3. Rooftop mumty fractures and crashes down
        if (h.mumty) {
          h.mumty.position.copy(h.mumtyBase)
            .add(new THREE.Vector3(ease * h.tiltDir * 3.2, -ease * 4.6, ease * 2.2));
          h.mumty.rotation.z = ease * 0.88;
        }

        // 4. Rubble chunks tumble into the floodwater
        if (h.rubbleGroup) {
          h.rubbleGroup.visible = true;
          for (let r = 0; r < h.rubblePieces.length; r++) {
            const rp = h.rubblePieces[r];
            rp.mesh.position.copy(rp.basePos)
              .add(new THREE.Vector3(
                ease * rp.drift.x,
                -ease * rp.drift.y,
                ease * rp.drift.z
              ));
            rp.mesh.rotation.x = ease * rp.spin.x;
            rp.mesh.rotation.y = ease * rp.spin.y;
          }
        }
      }
    }
  }

  return {
    wipeableItems,
    dynamicWaterItems,
    updateDelhiDynamic: (clampedT, uWave) => {
      updateOldIronBridgeShatter(uWave);
      updateWazirabadShatter(uWave);
      updateITOShatter(uWave);
      updateHaveliShatter(uWave);
      updateRescueBoats(clampedT, uWave);
      updateFloatingDebris(uWave);
      updatePoliceBeacons();
      if (redFort && redFort.updateMoat) {
        redFort.updateMoat(uWave);
      }
    }
  };
}
