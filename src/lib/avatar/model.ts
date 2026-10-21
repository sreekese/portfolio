import * as T from "three";

// A stylized, locally modeled likeness based on the supplied reference photo.
export function createAvatarStudio() {
  const scene = new T.Scene();
  const materials = {
    skin: new T.MeshStandardMaterial({ color: "#b77b55", roughness: 0.65 }),
    hair: new T.MeshStandardMaterial({ color: "#202029", roughness: 0.8 }),
    hairHighlight: new T.MeshStandardMaterial({
      color: "#303039",
      roughness: 0.55,
    }),
    iris: new T.MeshStandardMaterial({ color: "#54392c", roughness: 0.35 }),
    lens: new T.MeshPhysicalMaterial({
      color: "#d7edf3",
      transparent: true,
      opacity: 0.09,
      roughness: 0.08,
      metalness: 0.1,
      depthWrite: false,
    }),
    shirt: new T.MeshStandardMaterial({ color: "#762b40", roughness: 0.85 }),
    seam: new T.MeshStandardMaterial({ color: "#a04757", roughness: 0.8 }),
    denim: new T.MeshStandardMaterial({ color: "#284968", roughness: 0.9 }),
    metal: new T.MeshStandardMaterial({
      color: "#34434b",
      metalness: 0.65,
      roughness: 0.3,
    }),
    sole: new T.MeshStandardMaterial({ color: "#e7e5de", roughness: 0.8 }),
    wood: new T.MeshStandardMaterial({ color: "#b78c64", roughness: 0.7 }),
    teal: new T.MeshStandardMaterial({ color: "#266e69", roughness: 0.7 }),
    screen: new T.MeshStandardMaterial({
      color: "#152b3b",
      emissive: "#183d4d",
      emissiveIntensity: 0.5,
    }),
    white: new T.MeshStandardMaterial({ color: "#fff8e7" }),
  };
  function mesh(
    parent: T.Object3D,
    geometry: T.BufferGeometry,
    material: T.Material,
    x = 0,
    y = 0,
    z = 0,
  ) {
    const m = new T.Mesh(geometry, material);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  function ellipsoid(
    parent: T.Object3D,
    material: T.Material,
    x: number,
    y: number,
    z: number,
    sx: number,
    sy: number,
    sz: number,
  ) {
    const m = mesh(parent, new T.SphereGeometry(1, 32, 24), material, x, y, z);
    m.scale.set(sx, sy, sz);
    return m;
  }
  function box(
    parent: T.Object3D,
    material: T.Material,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
  ) {
    return mesh(parent, new T.BoxGeometry(w, h, d), material, x, y, z);
  }
  function rod(
    parent: T.Object3D,
    material: T.Material,
    a: T.Vector3,
    b: T.Vector3,
    r: number,
  ) {
    const m = mesh(
      parent,
      new T.CylinderGeometry(r, r, a.distanceTo(b), 12),
      material,
    );
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(
      new T.Vector3(0, 1, 0),
      b.clone().sub(a).normalize(),
    );
    return m;
  }
  const floor = mesh(
    scene,
    new T.CylinderGeometry(2.55, 2.6, 0.12, 80),
    materials.teal,
    0,
    -0.08,
    0,
  );
  floor.receiveShadow = true;
  const person = new T.Group();
  person.name = "Sreekese";
  scene.add(person);
  const hips = new T.Group();
  hips.position.y = 1.02;
  person.add(hips);
  ellipsoid(hips, materials.denim, 0, 0.03, 0, 0.25, 0.19, 0.16);
  const legs = [-1, 1].map((side) => {
    const leg = new T.Group();
    leg.position.set(side * 0.14, 0, 0);
    hips.add(leg);
    mesh(
      leg,
      new T.CapsuleGeometry(0.105, 0.66, 8, 16),
      materials.denim,
      0,
      -0.43,
      0,
    );
    box(leg, materials.seam, side * 0.085, -0.4, 0, 0.012, 0.62, 0.015);
    ellipsoid(leg, materials.metal, 0, -0.9, 0.085, 0.135, 0.095, 0.23);
    ellipsoid(leg, materials.sole, 0, -0.95, 0.085, 0.14, 0.035, 0.23);
    for (let i = 0; i < 3; i++)
      box(leg, materials.sole, 0, -0.855, 0.12 + i * 0.035, 0.12, 0.012, 0.012);
    return leg;
  });
  const torso = new T.Group();
  torso.position.y = 1.1;
  person.add(torso);
  const shirt = mesh(
    torso,
    new T.CylinderGeometry(0.25, 0.23, 0.65, 32),
    materials.shirt,
    0,
    0.3,
    0,
  );
  shirt.scale.z = 0.7;
  box(torso, materials.seam, 0, 0.3, 0.181, 0.025, 0.59, 0.013);
  for (let i = 0; i < 5; i++)
    ellipsoid(
      torso,
      materials.sole,
      0.018,
      0.08 + i * 0.105,
      0.19,
      0.012,
      0.012,
      0.009,
    );
  for (const side of [-1, 1]) {
    const collar = box(
      torso,
      materials.seam,
      side * 0.09,
      0.59,
      0.16,
      0.13,
      0.15,
      0.025,
    );
    collar.rotation.z = side * 0.4;
  }
  mesh(
    torso,
    new T.CylinderGeometry(0.095, 0.11, 0.16, 24),
    materials.skin,
    0,
    0.68,
    0,
  );
  const arms = [-1, 1].map((side) => {
    const arm = new T.Group();
    arm.position.set(side * 0.29, 0.55, 0);
    torso.add(arm);
    mesh(
      arm,
      new T.CapsuleGeometry(0.09, 0.24, 6, 16),
      materials.shirt,
      0,
      -0.13,
      0,
    );
    mesh(
      arm,
      new T.CapsuleGeometry(0.068, 0.22, 6, 16),
      materials.skin,
      0,
      -0.43,
      0,
    );
    ellipsoid(arm, materials.skin, 0, -0.61, 0.015, 0.072, 0.1, 0.057);
    if (side === -1) {
      mesh(
        arm,
        new T.CylinderGeometry(0.076, 0.076, 0.045, 24),
        materials.metal,
        0,
        -0.49,
        0,
      );
      box(arm, materials.sole, 0, -0.49, 0.07, 0.075, 0.055, 0.015);
    }
    return arm;
  });
  const head = new T.Group();
  head.position.set(0, 0.97, 0);
  torso.add(head);
  ellipsoid(head, materials.skin, 0, 0, 0, 0.255, 0.33, 0.235);
  for (const side of [-1, 1])
    ellipsoid(head, materials.skin, side * 0.25, -0.01, 0, 0.055, 0.09, 0.055);
  // Close-fitting beard and a continuous swept hairstyle, rather than bead-like locks.
  ellipsoid(head, materials.hair, 0, -0.18, -0.005, 0.216, 0.135, 0.194);
  ellipsoid(head, materials.skin, 0, -0.095, 0.16, 0.178, 0.125, 0.088);
  const hair = new T.Group();
  hair.name = "swept-hair";
  head.add(hair);
  ellipsoid(hair, materials.hair, 0, 0.22, -0.035, 0.263, 0.145, 0.235);
  const sweep = ellipsoid(
    hair,
    materials.hair,
    -0.025,
    0.28,
    0.055,
    0.24,
    0.115,
    0.18,
  );
  sweep.rotation.z = -0.18;
  for (const side of [-1, 1]) {
    ellipsoid(
      hair,
      materials.hair,
      side * 0.239,
      0.105,
      -0.025,
      0.028,
      0.12,
      0.145,
    );
    ellipsoid(
      head,
      materials.skin,
      side * 0.255,
      -0.01,
      0.026,
      0.024,
      0.052,
      0.035,
    );
  }
  // Fine curved ridges follow the sweep and catch the studio light.
  for (let i = 0; i < 12; i++) {
    const offset = i * 0.026;
    const curve = new T.CatmullRomCurve3([
      new T.Vector3(-0.23 + offset, 0.205, 0.16),
      new T.Vector3(-0.21 + offset, 0.295, 0.205),
      new T.Vector3(-0.13 + offset, 0.35, 0.12),
      new T.Vector3(-0.06 + offset * 0.8, 0.31, -0.025),
    ]);
    mesh(
      hair,
      new T.TubeGeometry(curve, 24, 0.0045, 6, false),
      materials.hairHighlight,
    );
  }
  const eyes = new T.Group();
  head.add(eyes);
  for (const side of [-1, 1]) {
    ellipsoid(
      eyes,
      materials.white,
      side * 0.102,
      0.01,
      0.211,
      0.061,
      0.026,
      0.018,
    );
    ellipsoid(
      eyes,
      materials.iris,
      side * 0.102,
      0.01,
      0.234,
      0.022,
      0.022,
      0.009,
    );
    ellipsoid(
      eyes,
      materials.white,
      side * 0.095,
      0.02,
      0.243,
      0.006,
      0.007,
      0.004,
    );
    const brow = ellipsoid(
      head,
      materials.hair,
      side * 0.105,
      0.086,
      0.205,
      0.071,
      0.015,
      0.02,
    );
    brow.rotation.z = side * -0.1;
    const shape = new T.Shape();
    shape.moveTo(-0.07, -0.04);
    shape.lineTo(0.07, -0.04);
    shape.quadraticCurveTo(0.085, -0.04, 0.085, -0.025);
    shape.lineTo(0.085, 0.035);
    shape.lineTo(-0.085, 0.035);
    shape.lineTo(-0.085, -0.025);
    shape.quadraticCurveTo(-0.085, -0.04, -0.07, -0.04);
    const points = shape.getPoints(20).map((p) => new T.Vector3(p.x, p.y, 0));
    const rim = mesh(
      head,
      new T.TubeGeometry(
        new T.CatmullRomCurve3(points, true),
        64,
        0.0055,
        10,
        true,
      ),
      materials.metal,
      side * 0.103,
      0.015,
      0.244,
    );
    rim.name = "spectacles";
    const lens = mesh(
      head,
      new T.ShapeGeometry(shape, 24),
      materials.lens,
      side * 0.103,
      0.015,
      0.243,
    );
    lens.name = "spectacle-lens";
    lens.castShadow = false;
    ellipsoid(
      head,
      materials.metal,
      side * 0.184,
      0.035,
      0.244,
      0.009,
      0.009,
      0.009,
    );
    rod(
      head,
      materials.metal,
      new T.Vector3(side * 0.19, 0.035, 0.24),
      new T.Vector3(side * 0.25, 0.025, -0.05),
      0.008,
    );
  }
  rod(
    head,
    materials.metal,
    new T.Vector3(-0.02, 0.025, 0.25),
    new T.Vector3(0.02, 0.025, 0.25),
    0.008,
  );
  ellipsoid(head, materials.skin, 0, -0.045, 0.25, 0.042, 0.068, 0.05);
  for (const side of [-1, 1]) {
    const moustache = ellipsoid(
      head,
      materials.hair,
      side * 0.04,
      -0.12,
      0.235,
      0.055,
      0.025,
      0.02,
    );
    moustache.rotation.z = side * 0.17;
  }
  const mouth = ellipsoid(
    head,
    materials.hair,
    0,
    -0.161,
    0.235,
    0.055,
    0.012,
    0.012,
  );
  // Desk, an open laptop, task chair, notebook and mug.
  const desk = new T.Group();
  desk.position.set(0.95, 0, -0.65);
  scene.add(desk);
  box(desk, materials.wood, 0, 1.12, 0, 1.4, 0.08, 0.72);
  for (const x of [-0.58, 0.58])
    for (const z of [-0.25, 0.25])
      box(desk, materials.metal, x, 0.54, z, 0.045, 1.08, 0.045);
  box(desk, materials.metal, 0, 1.18, 0, 0.56, 0.025, 0.38);
  const lid = box(desk, materials.metal, 0, 1.38, -0.17, 0.56, 0.4, 0.025);
  lid.rotation.x = -0.15;
  const display = box(desk, materials.screen, 0, 1.38, -0.15, 0.51, 0.34, 0.01);
  display.rotation.x = -0.15;
  for (let i = 0; i < 5; i++)
    box(
      desk,
      i % 2 ? materials.teal : materials.sole,
      -0.06,
      1.48 - i * 0.045,
      -0.125,
      0.16 + (i % 3) * 0.05,
      0.009,
      0.008,
    );
  for (let row = 0; row < 3; row++)
    for (let col = 0; col < 8; col++)
      box(
        desk,
        materials.sole,
        -0.2 + col * 0.055,
        1.196,
        -0.1 + row * 0.05,
        0.035,
        0.003,
        0.025,
      );
  mesh(
    desk,
    new T.CylinderGeometry(0.055, 0.05, 0.12, 24),
    materials.sole,
    0.48,
    1.22,
    0.09,
  );
  const chair = new T.Group();
  chair.position.set(0.95, 0, 0.23);
  scene.add(chair);
  box(chair, materials.teal, 0, 0.61, 0, 0.48, 0.1, 0.43);
  const back = box(chair, materials.teal, 0, 0.94, 0.22, 0.48, 0.58, 0.08);
  back.rotation.x = -0.12;
  mesh(
    chair,
    new T.CylinderGeometry(0.035, 0.035, 0.57, 16),
    materials.metal,
    0,
    0.29,
    0,
  );
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5;
    rod(
      chair,
      materials.metal,
      new T.Vector3(0, 0.09, 0),
      new T.Vector3(Math.cos(a) * 0.3, 0.06, Math.sin(a) * 0.3),
      0.025,
    );
  }
  scene.add(new T.HemisphereLight(0xe4f4ff, 0x55756a, 2.4));
  const key = new T.DirectionalLight(0xffebd4, 4);
  key.position.set(-3, 6, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -4;
  key.shadow.camera.right = 4;
  key.shadow.camera.top = 4;
  key.shadow.camera.bottom = -4;
  key.shadow.normalBias = 0.03;
  scene.add(key);
  const rim = new T.DirectionalLight(0xb4e3ef, 2);
  rim.position.set(3, 3, -3);
  scene.add(rim);
  function pose(time: number, speaking: boolean, reduced: boolean) {
    const t = reduced ? 0 : time;
    // Keep the full-body stance fixed, including during speech.
    person.position.set(-0.8, 0, 0.4);
    person.rotation.y = 0.15;
    legs.forEach((leg) => {
      leg.rotation.x = 0;
    });
    arms.forEach((arm, i) => {
      arm.rotation.x = 0;
      arm.rotation.z =
        (i === 0 ? 1 : -1) *
        (0.08 + (speaking && !reduced ? Math.sin(t * 2) * 0.06 : 0));
    });
    mouth.scale.y =
      0.012 * (speaking && !reduced ? 1 + Math.abs(Math.sin(t * 14)) * 3 : 1);
    eyes.scale.y = !reduced && t % 4.5 > 4.34 ? 0.12 : 1;
    head.rotation.z = speaking && !reduced ? Math.sin(t * 2) * 0.025 : 0;
  }
  pose(0, false, true);
  return { scene, pose };
}
