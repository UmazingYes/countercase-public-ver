from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class PlayStateResponse(BaseModel):
    model_config = ConfigDict(
        validate_by_name=True,
        validate_by_alias=True,
    )

    status: Literal["not_started", "active", "solved"]
    attempt_count: int = Field(serialization_alias="attemptCount")
    started_at: datetime | None = Field(serialization_alias="startedAt")
    solved_at: datetime | None = Field(serialization_alias="solvedAt")
    solve_seconds: int | None = Field(serialization_alias="solveSeconds")
    score: int | None
    solved_testcase: str | None = Field(serialization_alias="solvedTestcase")


class StatsResponse(BaseModel):
    model_config = ConfigDict(
        validate_by_name=True,
        validate_by_alias=True,
    )

    solve_count: int = Field(serialization_alias="solveCount")
    average_attempts: float | None = Field(serialization_alias="averageAttempts")
    average_solve_seconds: float | None = Field(serialization_alias="averageSolveSeconds")
    average_score: float | None = Field(serialization_alias="averageScore")