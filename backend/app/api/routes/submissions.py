from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.repositories.play_repository import PlayRepository
from app.repositories.puzzle_repository import PuzzleRepository
from app.repositories.stats_repository import StatsRepository
from app.schemas.submission import SubmitRequest, SubmitResponse
from app.services.judge_service import JudgeError, JudgeService
from app.services.rate_limit_service import RateLimitExceeded, RateLimitService
from app.services.scoring_service import ScoringService
from app.services.stats_service import StatsService
from app.services.submission_service import SubmissionService
from app.services.visitor_session_service import VisitorSessionService

router = APIRouter(prefix="/puzzles", tags=["submissions"])

puzzle_repository = PuzzleRepository()
visitor_session_service = VisitorSessionService()

submission_service = SubmissionService(
    play_repository=PlayRepository(),
    stats_repository=StatsRepository(),
    judge_service=JudgeService(),
    scoring_service=ScoringService(),
    stats_service=StatsService(),
    rate_limit_service=RateLimitService(
        limit=settings.submit_rate_limit_count,
        window_seconds=settings.submit_rate_limit_window_seconds,
    ),
)


@router.post(
    "/{slug}/submissions",
    response_model=SubmitResponse,
    response_model_by_alias=True,
    response_model_exclude_none=True,
)
def submit(
    slug: str,
    request_body: SubmitRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    session = visitor_session_service.get_or_create_session(db, request, response)

    puzzle = puzzle_repository.get_puzzle_by_slug(db, slug)

    if puzzle is None:
        raise HTTPException(status_code=404, detail="Puzzle not found")

    try:
        return submission_service.submit(
            db=db,
            session=session,
            puzzle=puzzle,
            testcase=request_body.testcase,
        )
    except RateLimitExceeded as e:
        raise HTTPException(
            status_code=429,
            detail="Too many submissions. Please slow down.",
            headers={"Retry-After": str(e.retry_after_seconds)},
        )
    except JudgeError as e:
        raise HTTPException(status_code=400, detail=str(e))