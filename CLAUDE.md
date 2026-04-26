# aquascape-botany

**Owner**: botany-agent  
**Publishes**: `@aquascape/botany` (JS) + Python package → GitHub Packages

## Layout

```
aquascape-botany/
├── data/
│   └── plants.json          # canonical species database (≡ packages/data/plants.json in skill docs)
├── schema/
│   └── plant.schema.json    # JSON Schema Draft 2020-12
├── js/                      # TypeScript/JS package
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── py/                      # Python package
├── docs/
│   └── citations.bib        # BibTeX citations
└── README.md
```

## Path note

Agent definitions reference `packages/data/` — the actual root is `aquascape-botany/`. `plants.json` lives at `aquascape-botany/data/plants.json`.

## Key commands

```bash
cd js && npm run validate    # JSON Schema validation
cd js && npm run build       # emit TS types
pytest                       # Python binding tests
```

## Contracts

- `data/plants.json` is source of truth for all agents
- Schema changes are orchestrator-only — open an issue
- Every numeric parameter needs a citation in `docs/citations.bib`
