"""Pydantic validators mirroring schema/plant.schema.json and js/schema.ts.

Kept manually in sync with the other two. CI cross-checks each run.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

GrowthForm = Literal["stem", "rosette", "carpeting", "epiphyte", "moss", "floating", "rhizome"]
Placement = Literal["foreground", "midground", "background", "attached", "floating"]
Propagation = Literal[
    "topping",
    "side-shoots",
    "runners",
    "rhizome-division",
    "adventitious-plantlets",
    "spores",
    "fragmentation",
    "seed",
]
GrowthRate = Literal["slow", "medium", "fast"]
DifficultyLabel = Literal["easy", "medium", "hard", "expert"]
License = Literal[
    "CC0-1.0",
    "CC-BY-4.0",
    "CC-BY-SA-4.0",
    "CC-BY-3.0",
    "CC-BY-SA-3.0",
    "original",
    "needs-replacement",
]


class _Strict(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)


class RangeNullable(_Strict):
    min: float | None
    opt: float | None
    max: float | None


class RangeWithUnit(RangeNullable):
    unit: str


class CommonNames(_Strict):
    en: list[str] = Field(min_length=1)
    zh: list[str] = Field(min_length=1)


class Taxonomy(_Strict):
    family: str
    genus: str
    species: str | None = None


class SizeCm(_Strict):
    height: RangeNullable
    spread: RangeNullable


class Envelope(_Strict):
    temperatureC: RangeWithUnit | None = None
    ph: RangeWithUnit | None = None
    gh: RangeWithUnit | None = None
    par: RangeWithUnit | None = None
    co2: RangeWithUnit | None = None
    no3: RangeWithUnit | None = None
    po4: RangeWithUnit | None = None
    k: RangeWithUnit | None = None
    fe: RangeWithUnit | None = None


class Difficulty(_Strict):
    score: int = Field(ge=1, le=5)
    label: DifficultyLabel


class Source(_Strict):
    cite_key: str = Field(alias="citeKey")
    url: str | None = None


class Plant(_Strict):
    id: str = Field(pattern=r"^[a-z][a-z0-9_]*$")
    scientific_name: str = Field(alias="scientificName", min_length=3)
    common_names: CommonNames = Field(alias="commonNames")
    taxonomy: Taxonomy
    growth_form: GrowthForm = Field(alias="growthForm")
    placement: list[Placement] = Field(min_length=1)
    size_cm: SizeCm = Field(alias="sizeCm")
    envelope: Envelope
    difficulty: Difficulty
    propagation: list[Propagation] = Field(min_length=1)
    growth_rate: GrowthRate = Field(alias="growthRate")
    notes: str | None = None
    sources: list[Source] = Field(min_length=1)
    image_license: License | None = Field(alias="imageLicense", default=None)


def validate_plants(data: list[dict]) -> list[Plant]:
    """Raises pydantic.ValidationError on any bad entry."""
    return [Plant.model_validate(item) for item in data]
