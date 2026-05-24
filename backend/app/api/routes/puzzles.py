from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repositories.play_repository import PlayRepository
from app.repositories.puzzle_repository import PuzzleRepository
from app.repositories.stats_repository import StatsRepository
from app.schemas.puzzle import TodayPuzzleResponse
from app.services.play_state_service import PlayStateService
from app.services.stats_service import StatsService
from app.services.visitor_session_service import VisitorSessionService
from app.schemas.play import PlayStateResponse

router = APIRouter(prefix="/puzzles", tags=["puzzles"])

puzzle_repository = PuzzleRepository()
play_repository = PlayRepository()
stats_repository = StatsRepository()
visitor_session_service = VisitorSessionService()
play_state_service = PlayStateService()
stats_service = StatsService()


@router.get("/today", response_model=TodayPuzzleResponse, response_model_by_alias=True)
def get_today_puzzle(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    session = visitor_session_service.get_or_create_session(db, request, response)

    puzzle = puzzle_repository.get_today_puzzle(db)

    if puzzle is None:
        raise HTTPException(status_code=404, detail="No puzzle available")

    play = play_repository.get_or_create_play(db, session, puzzle)
    db.commit()

    stats = None

    if play.solved_at is not None:
        stats_row = stats_repository.get_stats_for_puzzle(db, puzzle.id)
        stats = stats_service.build_stats_response(stats_row)

    return {
        "puzzle": puzzle,
        "play": play_state_service.build_play_response(play),
        "stats": stats,
    }

@router.post(
    "/{slug}/start",
    response_model=PlayStateResponse,
    response_model_by_alias=True,
)
def start_puzzle(
    slug: str,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    session = visitor_session_service.get_or_create_session(db, request, response)

    puzzle = puzzle_repository.get_puzzle_by_slug(db, slug)

    if puzzle is None:
        raise HTTPException(status_code=404, detail="Puzzle not found")

    play = play_repository.get_or_create_play(db, session, puzzle)
    play = play_repository.start_play(db, play)

    return play_state_service.build_play_response(play)