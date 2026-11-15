import { zodToJsonSchema } from "zod-to-json-schema";
import { plantArraySchema, plantSchema } from "../schema.js";

/** Build the Draft 2020-12 JSON Schema for a single Plant from js/schema.ts. */
export function buildPlantJsonSchema(): Record<string, unknown> {
  const generated = zodToJsonSchema(plantSchema, {
    target: "jsonSchema7",
    $refStrategy: "none",
  }) as Record<string, unknown>;
  const { $schema: _ignored, ...rest } = generated;
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://github.com/aquascape-studio/aquascape-botany/blob/main/schema/plant.schema.json",
    title: "Plant",
    description:
      "Single aquatic plant species entry. GENERATED from js/schema.ts (zod) by `npm run gen:schema` - do not edit by hand.",
    ...rest,
  };
}

export function renderPlantJsonSchema(): string {
  return JSON.stringify(buildPlantJsonSchema(), null, 2) + "\n";
}

export { plantArraySchema };
