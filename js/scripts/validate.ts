import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { plantArraySchema, renderPlantJsonSchema } from "./schema-lib.js";

const root = (p: string) => fileURLToPath(new URL(`../../${p}`, import.meta.url));
let failed = false;
const fail = (msg: string) => {
  console.error(`FAIL: ${msg}`);
  failed = true;
};

const data: unknown = JSON.parse(readFileSync(root("data/plants.json"), "utf8"));

// 1. zod
const z = plantArraySchema.safeParse(data);
if (!z.success) {
  for (const i of z.error.issues.slice(0, 20)) fail(`zod: ${i.path.join(".")}: ${i.message}`);
} else {
  console.log(`zod: ${z.data.length} plants OK`);
}

// 2. checked-in schema must equal freshly generated output
const checkedIn = readFileSync(root("schema/plant.schema.json"), "utf8");
const fresh = renderPlantJsonSchema();
if (checkedIn !== fresh) fail("schema/plant.schema.json is stale; run `npm run gen:schema`");
else console.log("schema/plant.schema.json matches js/schema.ts");

// 3. ajv (2020) against the checked-in schema
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv as never);
const validate = ajv.compile(JSON.parse(checkedIn));
let n = 0;
const records = data as Array<{ id?: string }>;
for (const [i, p] of records.entries() as IterableIterator<[number, { id?: string }]>) {
  const ok: boolean = validate(p as unknown);
  if (!ok) {
    fail(`ajv: #${i} ${p.id ?? "?"}: ${ajv.errorsText(validate.errors)}`);
  } else n++;
}
console.log(`ajv: ${n}/${records.length} plants OK`);

process.exit(failed ? 1 : 0);
