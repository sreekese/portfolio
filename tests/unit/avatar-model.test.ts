import { describe, expect, it } from "vitest";
import { createAvatarStudio, studioCameraPosition } from "@/lib/avatar/model";

describe("avatar studio poses", () => {
  it("keeps the avatar stationary over time and with reduced motion", () => {
    const { scene, pose } = createAvatarStudio();
    const person = scene.getObjectByName("Sreekese")!;
    for (let time = 0; time < 60; time += 0.5) {
      pose(time, false, false);
      expect(person.position.toArray()).toEqual([-0.8, 0, 0.4]);
      expect(person.rotation.y).toBeCloseTo(
        Math.atan2(
          studioCameraPosition[0] - person.position.x,
          studioCameraPosition[2] - person.position.z,
        ),
      );
    }
    pose(1, false, true);
    const first = person.position.clone();
    pose(10, false, true);
    expect(person.position.equals(first)).toBe(true);
  });
  it("maintains its standing pose during the introduction", () => {
    const { scene, pose } = createAvatarStudio();
    const person = scene.getObjectByName("Sreekese")!;
    pose(2, true, false);
    expect(person.position.x).toBe(-0.8);
    expect(person.rotation.y).toBeCloseTo(
      Math.atan2(
        studioCameraPosition[0] - person.position.x,
        studioCameraPosition[2] - person.position.z,
      ),
    );
    pose(8, true, false);
    expect(person.position.x).toBe(-0.8);
    expect(scene.getObjectByName("orange-hoodie")).toBeDefined();
    expect(scene.getObjectByName("reference-head")).toBeDefined();
  });
});
