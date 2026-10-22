import * as T from "three";

export const studioCameraPosition = [2.8, 2.9, 6.8] as const;

/** A new, simplified character inspired by the supplied orange-hoodie render. */
export function createAvatarStudio() {
  const scene = new T.Scene();
  const fabric = (color: string) =>
    new T.MeshStandardMaterial({ color, roughness: 0.85 });
  const materials = {
    skin: new T.MeshStandardMaterial({ color: "#e6ad7a", roughness: 0.68 }),
    blush: fabric("#d4936d"),
    hair: fabric("#61351f"),
    strand: fabric("#89502e"),
    hoodie: fabric("#af4529"),
    cuff: fabric("#863822"),
    lining: fabric("#743c2b"),
    shirt: fabric("#57554c"),
    denim: fabric("#414b58"),
    seam: fabric("#343d47"),
    white: fabric("#fff8e7"),
    iris: new T.MeshStandardMaterial({ color: "#8b4b25", roughness: 0.35 }),
    pupil: fabric("#201710"),
    mouth: fabric("#73442f"),
    sole: fabric("#e5dece"),
    wood: fabric("#b78c64"),
    teal: fabric("#36726b"),
    metal: new T.MeshStandardMaterial({
      color: "#34434b",
      metalness: 0.5,
      roughness: 0.35,
    }),
    screen: new T.MeshStandardMaterial({
      color: "#152b3b",
      emissive: "#183d4d",
      emissiveIntensity: 0.5,
    }),
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
  function curve(
    parent: T.Object3D,
    material: T.Material,
    points: number[][],
    radius: number,
  ) {
    return mesh(
      parent,
      new T.TubeGeometry(
        new T.CatmullRomCurve3(points.map((p) => new T.Vector3(...p))),
        24,
        radius,
        8,
        false,
      ),
      material,
    );
  }
  // Curved tapered locks give the new hair a swept silhouette with pointed ends.
  function lock(parent: T.Object3D, points: number[][], radius: number) {
    const path = new T.CatmullRomCurve3(points.map((p) => new T.Vector3(...p)));
    const frames = path.computeFrenetFrames(24, false);
    const positions: number[] = [];
    const indices: number[] = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const center = path.getPoint(t);
      const r = Math.max(0.001, radius * Math.sin(Math.PI * (0.12 + t * 0.88)));
      for (let j = 0; j < 12; j++) {
        const angle = (j / 12) * Math.PI * 2;
        const point = center
          .clone()
          .addScaledVector(frames.normals[i], Math.cos(angle) * r)
          .addScaledVector(frames.binormals[i], Math.sin(angle) * r * 0.65);
        positions.push(point.x, point.y, point.z);
        if (i < 24) {
          const a = i * 12 + j,
            b = i * 12 + ((j + 1) % 12);
          indices.push(a, b, a + 12, b, b + 12, a + 12);
        }
      }
    }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute(
      "position",
      new T.Float32BufferAttribute(positions, 3),
    );
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    mesh(parent, geometry, materials.hair);
  }
  mesh(
    scene,
    new T.CylinderGeometry(2.35, 2.4, 0.12, 80),
    materials.teal,
    0,
    -0.08,
    0,
  );
  const person = new T.Group();
  person.name = "Sreekese";
  scene.add(person);
  const body = new T.Group();
  person.add(body);
  ellipsoid(body, materials.denim, 0, 1.02, 0, 0.27, 0.19, 0.18);
  for (const side of [-1, 1]) {
    const leg = new T.Group();
    leg.position.set(side * 0.155, 0.97, 0);
    body.add(leg);
    const trouser = mesh(
      leg,
      new T.CapsuleGeometry(0.125, 0.57, 8, 20),
      materials.denim,
      0,
      -0.37,
      0,
    );
    trouser.scale.z = 1.08;
    trouser.rotation.z = side * 0.04;
    ellipsoid(leg, materials.denim, side * 0.015, -0.72, 0, 0.142, 0.08, 0.14);
    curve(
      leg,
      materials.seam,
      [
        [side * 0.09, -0.12, 0.08],
        [side * 0.11, -0.38, 0.08],
        [side * 0.1, -0.67, 0.09],
      ],
      0.006,
    );
    ellipsoid(leg, materials.hoodie, 0, -0.82, 0.1, 0.16, 0.11, 0.245);
    ellipsoid(leg, materials.sole, 0, -0.89, 0.11, 0.17, 0.045, 0.26);
    ellipsoid(leg, materials.white, 0, -0.82, 0.255, 0.15, 0.07, 0.095);
    for (let i = 0; i < 3; i++)
      rod(
        leg,
        materials.sole,
        new T.Vector3(-0.08, -0.745, 0.09 + i * 0.035),
        new T.Vector3(0.08, -0.745, 0.1 + i * 0.035),
        0.009,
      );
  }
  ellipsoid(body, materials.shirt, 0, 1.39, 0.01, 0.265, 0.42, 0.18);
  // Open hoodie panels, hem, raised hood, zipper edges and drawstrings.
  const hoodie = new T.Group();
  hoodie.name = "orange-hoodie";
  body.add(hoodie);
  for (const side of [-1, 1]) {
    ellipsoid(
      hoodie,
      materials.hoodie,
      side * 0.175,
      1.4,
      0,
      0.16,
      0.39,
      0.205,
    );
    ellipsoid(
      hoodie,
      materials.cuff,
      side * 0.17,
      1.07,
      0.005,
      0.17,
      0.055,
      0.205,
    );
    const hood = ellipsoid(
      hoodie,
      materials.hoodie,
      side * 0.16,
      1.77,
      -0.075,
      0.17,
      0.17,
      0.16,
    );
    hood.rotation.z = side * 0.4;
    ellipsoid(
      hoodie,
      materials.lining,
      side * 0.105,
      1.77,
      0.045,
      0.075,
      0.12,
      0.075,
    );
    curve(
      hoodie,
      materials.sole,
      [
        [side * 0.09, 1.75, 0.18],
        [side * 0.095, 1.45, 0.204],
        [side * 0.1, 1.12, 0.19],
      ],
      0.009,
    );
    curve(
      hoodie,
      materials.sole,
      [
        [side * 0.13, 1.77, 0.2],
        [side * 0.145, 1.59, 0.228],
        [side * 0.14, 1.45, 0.227],
      ],
      0.012,
    );
    curve(
      hoodie,
      materials.cuff,
      [
        [side * 0.26, 1.34, 0.16],
        [side * 0.19, 1.25, 0.2],
        [side * 0.16, 1.15, 0.2],
      ],
      0.008,
    );
  }
  const arms = [-1, 1].map((side) => {
    const arm = new T.Group();
    arm.position.set(side * 0.3, 1.68, 0);
    body.add(arm);
    mesh(
      arm,
      new T.CapsuleGeometry(0.1, 0.42, 8, 20),
      materials.hoodie,
      0,
      -0.24,
      0,
    );
    ellipsoid(arm, materials.cuff, 0, -0.49, 0, 0.112, 0.065, 0.11);
    ellipsoid(arm, materials.skin, 0, -0.64, 0.015, 0.073, 0.12, 0.06);
    for (let i = 0; i < 4; i++)
      mesh(
        arm,
        new T.CapsuleGeometry(0.014, 0.06, 4, 8),
        materials.skin,
        -0.046 + i * 0.029,
        -0.74,
        0.025,
      );
    ellipsoid(
      arm,
      materials.skin,
      -side * 0.065,
      -0.62,
      0.055,
      0.026,
      0.065,
      0.03,
    );
    return arm;
  });
  mesh(
    body,
    new T.CylinderGeometry(0.095, 0.12, 0.22, 24),
    materials.skin,
    0,
    1.85,
    0,
  );
  const head = new T.Group();
  head.name = "reference-head";
  head.position.set(0, 2.2, 0);
  body.add(head);
  // Large reference-style head with cheeks, tapered jaw and a small nose.
  ellipsoid(head, materials.skin, 0, 0.015, 0, 0.35, 0.405, 0.3);
  for (const side of [-1, 1]) {
    ellipsoid(
      head,
      materials.skin,
      side * 0.345,
      -0.025,
      0,
      0.075,
      0.115,
      0.065,
    );
    ellipsoid(
      head,
      materials.blush,
      side * 0.365,
      -0.025,
      0.045,
      0.037,
      0.069,
      0.022,
    );
  }
  const eyes = new T.Group();
  eyes.name = "eyes";
  head.add(eyes);
  for (const side of [-1, 1]) {
    const eye = new T.Group();
    eye.position.set(side * 0.135, 0.035, 0.264);
    eyes.add(eye);
    ellipsoid(eye, materials.white, 0, 0, 0, 0.104, 0.118, 0.045);
    ellipsoid(eye, materials.iris, 0, 0, 0.041, 0.059, 0.073, 0.016);
    ellipsoid(eye, materials.pupil, 0, 0, 0.055, 0.035, 0.052, 0.008);
    ellipsoid(eye, materials.white, -0.018, 0.032, 0.065, 0.016, 0.019, 0.006);
    ellipsoid(eye, materials.white, 0.02, -0.022, 0.063, 0.006, 0.007, 0.004);
    curve(
      head,
      materials.hair,
      [
        [side * 0.055, 0.17, 0.25],
        [side * 0.13, 0.2, 0.258],
        [side * 0.22, 0.17, 0.23],
      ],
      0.023,
    );
    curve(
      eye,
      materials.blush,
      [
        [-0.095, 0.055, 0.005],
        [0, 0.12, 0.008],
        [0.095, 0.055, 0.005],
      ],
      0.009,
    );
  }
  ellipsoid(head, materials.skin, 0, -0.064, 0.29, 0.073, 0.072, 0.075);
  ellipsoid(head, materials.blush, 0, -0.081, 0.348, 0.052, 0.031, 0.023);
  const smile = curve(
    head,
    materials.mouth,
    [
      [-0.105, -0.177, 0.267],
      [0, -0.197, 0.283],
      [0.105, -0.177, 0.267],
    ],
    0.009,
  );
  const mouth = ellipsoid(
    head,
    materials.mouth,
    0,
    -0.19,
    0.278,
    0.065,
    0.024,
    0.014,
  );
  mouth.name = "speaking-mouth";
  const hair = new T.Group();
  hair.name = "swept-hair";
  head.add(hair);
  ellipsoid(hair, materials.hair, 0, 0.27, -0.07, 0.36, 0.23, 0.29);
  for (const side of [-1, 1]) {
    ellipsoid(
      hair,
      materials.hair,
      side * 0.3,
      0.13,
      -0.075,
      0.065,
      0.22,
      0.19,
    );
    lock(
      hair,
      [
        [side * 0.2, 0.16, -0.16],
        [side * 0.32, -0.1, -0.17],
        [side * 0.31, -0.22, -0.12],
      ],
      0.07,
    );
  }
  for (let i = 0; i < 7; i++) {
    const x = -0.25 + i * 0.072;
    lock(
      hair,
      [
        [x, 0.34, -0.12],
        [x + 0.1, 0.48, 0.02],
        [x + 0.03, 0.39, 0.23],
        [x - 0.12, 0.2, 0.29],
      ],
      0.085,
    );
    curve(
      hair,
      materials.strand,
      [
        [x + 0.015, 0.37, 0.02],
        [x + 0.04, 0.44, 0.1],
        [x - 0.015, 0.35, 0.25],
      ],
      0.004,
    );
  }
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
    person.position.set(-0.8, 0, 0.4);
    person.rotation.y = Math.atan2(
      studioCameraPosition[0] - person.position.x,
      studioCameraPosition[2] - person.position.z,
    );
    head.rotation.x = -0.08;
    head.rotation.z = speaking && !reduced ? Math.sin(t * 2) * 0.018 : 0;
    arms.forEach((arm, i) => {
      arm.rotation.z =
        (i === 0 ? -1 : 1) *
        (0.12 + (speaking && !reduced ? Math.sin(t * 2) * 0.02 : 0));
    });
    eyes.scale.y = !reduced && t % 4.8 > 4.64 ? 0.12 : 1;
    smile.visible = !speaking || reduced;
    mouth.visible = speaking && !reduced;
    mouth.scale.y = 0.024 * (0.4 + Math.abs(Math.sin(t * 13)));
  }
  pose(0, false, true);
  return { scene, pose };
}
