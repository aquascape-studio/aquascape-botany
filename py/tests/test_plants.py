"""Load plants.json and confirm every entry passes validation."""

from __future__ import annotations

import json
from pathlib import Path

from aquascape_botany.validate import validate_plants

DATA = Path(__file__).resolve().parents[2] / "data" / "plants.json"


def test_plants_json_validates():
    raw = json.loads(DATA.read_text())
    plants = validate_plants(raw)
    assert len(plants) >= 20, f"expected MVP 20+ species, got {len(plants)}"

    # Every id is unique
    ids = [p.id for p in plants]
    assert len(ids) == len(set(ids))
