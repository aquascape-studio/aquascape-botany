"""Validate plant records against the generated JSON Schema.

The schema (schema/plant.schema.json) is GENERATED from js/schema.ts (zod) by
`cd js && npm run gen:schema`. There are intentionally no hand-written rules
here: js/schema.ts is the single source of truth.
"""

from __future__ import annotations

import json
from functools import lru_cache
from importlib.resources import files
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator, FormatChecker

Plant = dict[str, Any]

_REPO_SCHEMA = Path(__file__).resolve().parents[2] / "schema" / "plant.schema.json"


class PlantValidationError(ValueError):
    """Raised when one or more plant records violate the schema."""


def schema_text() -> str:
    # Packaged data (wheel install) first, then repo-relative path (editable / checkout).
    try:
        return files("aquascape_botany").joinpath("_data", "plant.schema.json").read_text()
    except (FileNotFoundError, ModuleNotFoundError):
        return _REPO_SCHEMA.read_text()


@lru_cache(maxsize=1)
def load_schema() -> dict[str, Any]:
    return json.loads(schema_text())


@lru_cache(maxsize=1)
def _validator() -> Draft202012Validator:
    schema = load_schema()
    Draft202012Validator.check_schema(schema)
    return Draft202012Validator(schema, format_checker=FormatChecker())


def validate_plants(data: list[Plant]) -> list[Plant]:
    """Validate every record; raise PlantValidationError listing all problems."""
    v = _validator()
    problems: list[str] = []
    for i, item in enumerate(data):
        label = item.get("id", f"#{i}") if isinstance(item, dict) else f"#{i}"
        for err in sorted(v.iter_errors(item), key=lambda e: list(e.absolute_path)):
            loc = ".".join(str(p) for p in err.absolute_path) or "<root>"
            problems.append(f"{label}: {loc}: {err.message}")
    if problems:
        shown = "\n".join(problems[:50])
        raise PlantValidationError(f"{len(problems)} schema violation(s):\n{shown}")
    return data
