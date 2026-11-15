# aquascape-botany

Aquatic-plant knowledge base for aquascape-studio. Source-of-truth repo for
`plants.json`, its schema, citations, and license audit.

## What's in here

```
.
├── data/
│   └── plants.json            # canonical species list (157 species; grows)
├── schema/
│   └── plant.schema.json      # JSON Schema (draft-2020-12)
├── js/                        # TypeScript consumer package (@aquascape/botany)
│   ├── index.ts
│   ├── schema.ts              # zod schema (source of truth for JS side)
│   └── schema.test.ts
├── py/                        # Python consumer package (aquascape_botany)
│   ├── aquascape_botany/
│   │   ├── __init__.py
│   │   └── validate.py
│   └── pyproject.toml
├── docs/
│   ├── citations.bib          # BibTeX refs backing envelope values (test enforces every cited key exists)
│   └── LICENSE-AUDIT.md       # image/data license audit (commercial-safe)
└── .github/workflows/ci.yml   # validates plants.json against BOTH schemas on every PR
```

## Why a separate repo

- The data is the most slowly-changing asset — stable contract for sim/render/app.
- Sim (Python) and web/mobile (TS) both consume it; dual-published makes that clean.
- Botany-agent operates independently; having its own repo matches ownership.

## Publishing

- **JS**: `@aquascape/botany` on GitHub Packages (npm). Published by
  `.github/workflows/publish-npm.yml` when a tag `v*` is pushed.
- **Python**: `aquascape_botany` on GitHub Packages (PyPI-compatible).
  Published by `.github/workflows/publish-pypi.yml` on the same tag.

For day-to-day development, consumers vendor the latest `data/plants.json`
either through the published packages or as a git submodule of this repo.

## Validation

Every PR runs:
- `pnpm test` — TypeScript / zod
- `pnpm validate` — zod + ajv (2020-12) against generated `schema/plant.schema.json`; fails if that file is stale
- `pytest` — Python / jsonschema against the same generated schema, plus BibTeX key check

`js/schema.ts` is the single source of truth. After changing it run
`cd js && npm run gen:schema` to regenerate `schema/plant.schema.json`; the Python
validator reads that file, so nothing else needs hand-syncing.

## Owner

botany-agent. Orchestrator reviews breaking-schema changes because all other
repos depend on this one.
