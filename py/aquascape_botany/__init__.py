"""aquascape-botany: typed access to plants.json."""

from __future__ import annotations

import json
from importlib.resources import files
from pathlib import Path
from typing import Literal

from aquascape_botany.validate import Plant, validate_plants

__all__ = ["Plant", "plants", "by_id", "by_species", "by_growth_form", "PLANTS_JSON_PATH"]


def _load() -> list[Plant]:
    # Try packaged data (wheel install); fall back to repo-relative path (editable).
    try:
        raw = files("aquascape_botany").joinpath("_data", "plants.json").read_text()
    except FileNotFoundError:
        raw = Path(__file__).resolve().parents[2].joinpath("data", "plants.json").read_text()
    return validate_plants(json.loads(raw))


plants: list[Plant] = _load()


def _repo_data_path() -> Path | None:
    p = Path(__file__).resolve().parents[2].joinpath("data", "plants.json")
    return p if p.exists() else None


PLANTS_JSON_PATH: Path | None = _repo_data_path()


def by_id(plant_id: str) -> Plant | None:
    return next((p for p in plants if p.id == plant_id), None)


def by_species(scientific_name: str) -> Plant | None:
    target = scientific_name.lower()
    return next((p for p in plants if p.scientific_name.lower() == target), None)


GrowthForm = Literal["stem", "rosette", "carpeting", "epiphyte", "moss", "floating", "rhizome"]


def by_growth_form(form: GrowthForm) -> list[Plant]:
    return [p for p in plants if p.growth_form == form]
