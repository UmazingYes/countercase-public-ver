from datetime import date

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.play import PlayStateResponse, StatsResponse


class PuzzleResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        validate_by_name=True,
        validate_by_alias=True,
    )

    slug: str
    release_date: date = Field(serialization_alias="releaseDate")
    title: str
    difficulty: int
    language: str
    statement: str
    wrong_code: str = Field(serialization_alias="wrongCode")
    explanation: str | None
    tags: list[str]
    sample_input: str = Field(serialization_alias="sampleInput")


class TodayPuzzleResponse(BaseModel):
    puzzle: PuzzleResponse
    play: PlayStateResponse
    stats: StatsResponse | None