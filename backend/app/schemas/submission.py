from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.play import StatsResponse


class SubmitRequest(BaseModel):
    testcase: str


class SubmitResponse(BaseModel):
    model_config = ConfigDict(
        validate_by_name=True,
        validate_by_alias=True,
    )

    status: Literal["wrong", "solved", "already_solved"]

    attempt_count: int = Field(serialization_alias="attemptCount")

    solve_seconds: int | None = Field(
        default=None,
        serialization_alias="solveSeconds",
    )

    score: int | None = None
    stats: StatsResponse | None = None

    wrong_output: str | None = Field(
        default=None,
        serialization_alias="wrongOutput",
    )

    correct_output: str | None = Field(
        default=None,
        serialization_alias="correctOutput",
    )

    runtime_ms: int | None = Field(
        default=None,
        serialization_alias="runtimeMs",
    )

    message: str