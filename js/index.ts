/**
 * @aquascape/botany — public entry.
 *
 * Re-exports the canonical Plant schema and provides typed accessors over
 * `plants.json`. Every downstream consumer (sim, render, app) imports from
 * here to avoid hand-rolling the type.
 */

import plantsJson from "../data/plants.json" with { type: "json" };
import { plantArraySchema, type Plant } from "./schema.js";

export * from "./schema.js";

/**
 * Runtime-validated array of all plants.
 * Throws at import time if plants.json ever drifts from the schema — this
 * gives every consumer (and CI) a single, early failure.
 */
export const plants: ReadonlyArray<Plant> = plantArraySchema.parse(plantsJson);

export function byId(id: string): Plant | undefined {
  return plants.find((p) => p.id === id);
}

export function bySpecies(scientificName: string): Plant | undefined {
  return plants.find(
    (p) => p.scientificName.toLowerCase() === scientificName.toLowerCase(),
  );
}

export function byDifficulty(score: 1 | 2 | 3 | 4 | 5): Plant[] {
  return plants.filter((p) => p.difficulty === score);
}

export function byGrowthForm(form: Plant["growthForm"]): Plant[] {
  return plants.filter((p) => p.growthForm === form);
}

// ---------------------------------------------------------------------------
// Search / filter
// ---------------------------------------------------------------------------

export interface SearchFilters {
  /** Filter by growth form (exact match). */
  growthForm?: Plant["growthForm"];
  /** Filter by difficulty label (exact match). */
  difficultyLabel?: Plant["difficultyLabel"];
  /** Filter by placement — plant must include this placement in its array. */
  placement?: Plant["placement"][number];
}

/**
 * searchPlants — fuzzy name search + structured filters.
 *
 * @param query   Optional free-text query. Matched (case-insensitive substring)
 *                against scientific name, English common names, Chinese common
 *                names, and pinyin. Pass `undefined` or omit to skip text
 *                filtering.
 * @param filters Optional structured filters applied after text matching.
 * @returns       A new array of matching plants (order preserved from
 *                `plants`).
 *
 * @example
 *   searchPlants("moss", { difficultyLabel: "easy" })
 *   searchPlants(undefined, { placement: "foreground" })
 *   searchPlants("anubias")
 */
export function searchPlants(
  query?: string,
  filters?: SearchFilters,
): Plant[] {
  const needle = query?.trim().toLowerCase();

  return plants.filter((p) => {
    // --- text filter ---
    if (needle) {
      const haystack = [
        p.scientificName,
        ...p.commonNames.en,
        ...p.commonNames.zh,
        ...p.pinyin,
        p.id,
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(needle)) return false;
    }

    // --- structured filters ---
    if (filters?.growthForm !== undefined && p.growthForm !== filters.growthForm) {
      return false;
    }
    if (
      filters?.difficultyLabel !== undefined &&
      p.difficultyLabel !== filters.difficultyLabel
    ) {
      return false;
    }
    if (
      filters?.placement !== undefined &&
      !p.placement.includes(filters.placement)
    ) {
      return false;
    }

    return true;
  });
}
