import { describe, expect, it } from "vitest";
import * as T from "three";
import { createAvatarStudio, studioCameraPosition } from "@/lib/avatar/model";

function fixture() {
  const scene = new T.Group();
  const face = new T.Mesh(
    new T.BoxGeometry(1, 2, 1),
    new T.MeshStandardMaterial(),
  );
  face.position.y = 1;
  face.morphTargetDictionary = {
    jawOpen: 0,
    mouthFunnel: 1,
    eyeBlinkLeft: 2,
    eyeBlinkRight: 3,
  };
  face.morphTargetInfluences = [0, 0, 0, 0];
  scene.add(face);
  return { avatar: { scene, animations: [] }, face };
}

describe("imported avatar studio", () => {
  it("grounds and scales the supplied model while keeping it stationary and facing the camera", () => {
    const { avatar } = fixture();
    const studio = createAvatarStudio(avatar);
    const person = studio.scene.getObjectByName("Sreekese")!;
    expect(person.children[0]).toBe(avatar.scene);
    expect(
      new T.Box3().setFromObject(avatar.scene).getSize(new T.Vector3()).y,
    ).toBeCloseTo(2.7);
    for (const time of [0, 1, 8, 60]) {
      studio.pose(time, false, false);
      expect(person.position.toArray()).toEqual([-0.8, 0, 0.4]);
      expect(person.rotation.y).toBeCloseTo(
        Math.atan2(
          studioCameraPosition[0] + 0.8,
          studioCameraPosition[2] - 0.4,
        ),
      );
    }
    studio.dispose();
  });
  it("uses supplied facial controls for speech and resets them on stop or reduced motion", () => {
    const { avatar, face } = fixture();
    const studio = createAvatarStudio(avatar);
    studio.pose(2, true, false);
    expect(face.morphTargetInfluences![0]).toBeGreaterThan(0);
    studio.pose(2, false, false);
    expect(face.morphTargetInfluences![0]).toBe(0);
    studio.pose(4.7, true, true);
    expect(face.morphTargetInfluences).toEqual([0, 0, 0, 0]);
    studio.dispose();
  });
  it("rejects an empty model", () => {
    expect(() =>
      createAvatarStudio({ scene: new T.Group(), animations: [] }),
    ).toThrow("Empty avatar model");
  });
});
