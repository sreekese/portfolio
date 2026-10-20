import { describe, expect, it } from "vitest";
import { createAvatarStudio } from "@/lib/avatar/model";

describe("avatar studio poses", () => {
  it("keeps the stroll bounded and freezes movement for reduced motion", () => {
    const { scene, pose } = createAvatarStudio();
    const person = scene.getObjectByName("Sreekese")!;
    for (let time = 0; time < 60; time += 0.5) {
      pose(time, false, false);
      expect(person.position.x).toBeGreaterThanOrEqual(-1.28);
      expect(person.position.x).toBeLessThanOrEqual(-0.32);
    }
    pose(1, false, true);
    const first = person.position.clone();
    pose(10, false, true);
    expect(person.position.equals(first)).toBe(true);
  });
  it("stops walking and faces the visitor during the introduction", () => {
    const { scene, pose } = createAvatarStudio();
    const person = scene.getObjectByName("Sreekese")!;
    pose(2, true, false);
    expect(person.position.x).toBe(-0.8);
    expect(person.rotation.y).toBe(0.15);
    pose(8, true, false);
    expect(person.position.x).toBe(-0.8);
    expect(scene.getObjectByName("spectacles")).toBeDefined();
  });
});
