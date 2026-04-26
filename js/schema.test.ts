import { describe, expect, it } from "vitest";
import plantsJson from "../data/plants.json" with { type: "json" };
import { plantArraySchema, plants, byId, byGrowthForm, searchPlants } from "./index.js";

describe("plants.json", () => {
  it("parses cleanly against plantArraySchema", () => {
    const result = plantArraySchema.safeParse(plantsJson);
    if (!result.success) {
      // Print the first few issues for easy debugging.
      const issues = result.error.issues.slice(0, 5).map((i) => ({
        path: i.path.join("."),
        message: i.message,
      }));
      throw new Error(
        `schema validation failed:\n${JSON.stringify(issues, null, 2)}`,
      );
    }
    expect(result.success).toBe(true);
  });

  it("has exactly the Round 2 target count of species", () => {
    // Round 2: 26 original + 10 rosette/moss/fern/floating additions = 36.
    expect(plants.length).toBe(36);
  });

  it("has unique IDs", () => {
    const ids = plants.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every plant has at least one citation", () => {
    for (const p of plants) {
      expect(p.citations.length).toBeGreaterThan(0);
    }
  });

  it("covers the required growth-form mix", () => {
    expect(byGrowthForm("stem").length).toBeGreaterThan(0);
    expect(byGrowthForm("carpeting").length).toBeGreaterThan(0);
    expect(byGrowthForm("epiphyte").length).toBeGreaterThan(0);
    expect(byGrowthForm("moss").length).toBeGreaterThan(0);
    expect(byGrowthForm("floating").length).toBeGreaterThan(0);
    expect(byGrowthForm("rosette").length).toBeGreaterThan(0);
  });

  it("byId finds a known plant", () => {
    // Every dataset includes Anubias barteri — it's the easiest plant for
    // smoke-testing.
    expect(byId("anubias-barteri")).toBeDefined();
  });
});

describe("searchPlants", () => {
  it("returns all plants when called with no arguments", () => {
    expect(searchPlants().length).toBe(plants.length);
  });

  it("filters by exact growthForm", () => {
    const mosses = searchPlants(undefined, { growthForm: "moss" });
    expect(mosses.length).toBeGreaterThan(0);
    expect(mosses.every((p) => p.growthForm === "moss")).toBe(true);
  });

  it("filters by difficultyLabel", () => {
    const easy = searchPlants(undefined, { difficultyLabel: "easy" });
    expect(easy.length).toBeGreaterThan(0);
    expect(easy.every((p) => p.difficultyLabel === "easy")).toBe(true);
  });

  it("filters by placement", () => {
    const foreground = searchPlants(undefined, { placement: "foreground" });
    expect(foreground.length).toBeGreaterThan(0);
    expect(foreground.every((p) => p.placement.includes("foreground"))).toBe(true);
  });

  it("fuzzy-matches a common name substring", () => {
    const results = searchPlants("java moss");
    expect(results.some((p) => p.id === "taxiphyllum-barbieri")).toBe(true);
  });

  it("fuzzy-matches a scientific name substring", () => {
    const results = searchPlants("anubias");
    expect(results.length).toBeGreaterThanOrEqual(2);
    expect(results.every((p) => p.scientificName.toLowerCase().includes("anubias"))).toBe(true);
  });

  it("combines query and filters", () => {
    const results = searchPlants("crypt", { difficultyLabel: "easy" });
    expect(results.every((p) => p.difficultyLabel === "easy")).toBe(true);
    expect(
      results.every(
        (p) =>
          p.scientificName.toLowerCase().includes("crypt") ||
          p.commonNames.en.some((n) => n.toLowerCase().includes("crypt")) ||
          p.commonNames.zh.some((n) => n.toLowerCase().includes("crypt")),
      ),
    ).toBe(true);
  });

  it("returns empty array when nothing matches", () => {
    const results = searchPlants("xyzzy-not-a-plant");
    expect(results.length).toBe(0);
  });

  it("is case-insensitive", () => {
    const lower = searchPlants("anubias");
    const upper = searchPlants("ANUBIAS");
    expect(lower.length).toBe(upper.length);
  });
});
