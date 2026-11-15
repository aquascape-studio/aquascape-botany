import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderPlantJsonSchema } from "./schema-lib.js";

const out = fileURLToPath(new URL("../../schema/plant.schema.json", import.meta.url));
writeFileSync(out, renderPlantJsonSchema());
console.log(`wrote ${out}`);
