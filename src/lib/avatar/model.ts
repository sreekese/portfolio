import * as T from "three";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";

export const studioCameraPosition = [2.8, 2.9, 6.8] as const;

export async function loadAvatarStudio() {
  const avatar = await new GLTFLoader().loadAsync("/models/boy-avatar.glb");
  return createAvatarStudio(avatar);
}

/** Keep the supplied character and its rig intact; normalize only studio placement. */
export function createAvatarStudio(avatar: Pick<GLTF, "scene" | "animations">) {
  const scene = new T.Scene();
  const fabric = (color: string) =>
    new T.MeshStandardMaterial({ color, roughness: 0.85 });
  const materials = {
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
  const character = avatar.scene;
  character.updateMatrixWorld(true);
  const bounds = new T.Box3().setFromObject(character);
  const size = bounds.getSize(new T.Vector3());
  if (!Number.isFinite(size.y) || size.y <= 0)
    throw new Error("Empty avatar model");
  const scale = 2.7 / size.y;
  const center = bounds.getCenter(new T.Vector3());
  character.scale.multiplyScalar(scale);
  character.position.set(
    -center.x * scale,
    -bounds.min.y * scale,
    -center.z * scale,
  );
  person.add(character);
  const faces: T.Mesh[] = [];
  character.traverse((object) => {
    if (object instanceof T.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
      if (object.morphTargetDictionary && object.morphTargetInfluences)
        faces.push(object);
    }
  });
  const mixer = new T.AnimationMixer(character);
  const idle = avatar.animations.find((clip) => clip.name === "Idle");
  // Keep facial weights controlled by speech, rather than the demo animation.
  if (idle) {
    const bodyIdle = new T.AnimationClip(
      "StudioIdle",
      idle.duration,
      idle.tracks.filter(
        (track) => !track.name.endsWith(".morphTargetInfluences"),
      ),
    );
    mixer.clipAction(bodyIdle).play();
  }
  function expression(name: string, weight: number) {
    faces.forEach((face) => {
      const index = face.morphTargetDictionary?.[name];
      if (index !== undefined && face.morphTargetInfluences)
        face.morphTargetInfluences[index] = weight;
    });
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
    mixer.setTime(t);
    const talking = speaking && !reduced;
    expression(
      "jawOpen",
      talking ? 0.15 + Math.abs(Math.sin(t * 11)) * 0.45 : 0,
    );
    expression("mouthFunnel", talking ? Math.max(0, Math.sin(t * 7)) * 0.2 : 0);
    const blink = !reduced && t % 4.8 > 4.64 ? 1 : 0;
    expression("eyeBlinkLeft", blink);
    expression("eyeBlinkRight", blink);
  }
  pose(0, false, true);
  return {
    scene,
    pose,
    dispose: () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(character);
      disposeScene(scene);
    },
  };
}

/** Release embedded GLB textures, skinning resources, and studio geometry. */
export function disposeScene(scene: T.Object3D) {
  const geometries = new Set<T.BufferGeometry>();
  const materials = new Set<T.Material>();
  const textures = new Set<T.Texture>();
  const skeletons = new Set<T.Skeleton>();
  scene.traverse((object) => {
    if (object instanceof T.Mesh) {
      geometries.add(object.geometry);
      (Array.isArray(object.material)
        ? object.material
        : [object.material]
      ).forEach((material) => materials.add(material));
    }
    if (object instanceof T.SkinnedMesh) skeletons.add(object.skeleton);
    if (object instanceof T.DirectionalLight) object.shadow.dispose();
  });
  materials.forEach((material) => {
    Object.values(material).forEach((value) => {
      if (value instanceof T.Texture) textures.add(value);
    });
    material.dispose();
  });
  textures.forEach((texture) => {
    if (
      typeof ImageBitmap !== "undefined" &&
      texture.source.data instanceof ImageBitmap
    )
      texture.source.data.close();
    texture.dispose();
  });
  geometries.forEach((geometry) => geometry.dispose());
  skeletons.forEach((skeleton) => skeleton.dispose());
}
