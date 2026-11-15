"""Validate data/plants.json against the generated JSON Schema, plus cross-file checks."""

from __future__ import annotations

import json
import re
from pathlib import Path

import pytest

from aquascape_botany.validate import PlantValidationError, load_schema, validate_plants

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data" / "plants.json"
BIB = ROOT / "docs" / "citations.bib"


@pytest.fixture(scope="module")
def raw() -> list[dict]:
    return json.loads(DATA.read_text())


def test_plants_json_validates(raw):
    plants = validate_plants(raw)
    assert len(plants) >= 155
    ids = [p["id"] for p in plants]
    assert len(ids) == len(set(ids))


def test_schema_is_generated_draft_2020_12():
    schema = load_schema()
    assert schema["$schema"] == "https://json-schema.org/draft/2020-12/schema"
    assert "visual" in schema["properties"]


def test_invalid_record_rejected(raw):
    bad = dict(raw[0])
    bad["difficulty"] = 9
    with pytest.raises(PlantValidationError):
        validate_plants([bad])


def test_every_citation_key_exists_in_bibtex(raw):
    keys = set(re.findall(r"^@\w+\{([^,\s]+),", BIB.read_text(), flags=re.M))
    missing = {c: p["id"] for p in raw for c in p["citations"] if c not in keys}
    assert not missing, f"citation keys missing from docs/citations.bib: {missing}"
