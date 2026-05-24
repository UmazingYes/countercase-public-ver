import uuid
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Puzzle, PuzzlePlay, VisitorSession


class PlayRepository:
    def get_or_create_play(
        self,
        db: Session,
        session: VisitorSession,
        puzzle: Puzzle,
    ) -> PuzzlePlay:
        play = db.execute(
            select(PuzzlePlay)
            .where(PuzzlePlay.visitor_session_id == session.id)
            .where(PuzzlePlay.puzzle_id == puzzle.id)
        ).scalar_one_or_none()

        if play is not None:
            return play

        play = PuzzlePlay(
            visitor_session_id=session.id,
            puzzle_id=puzzle.id,
            started_at=None,
            attempt_count=0,
        )

        db.add(play)
        db.flush()

        return play

    def get_play_for_update(
        self,
        db: Session,
        play_id: uuid.UUID,
    ) -> PuzzlePlay:
        return db.execute(
            select(PuzzlePlay)
            .where(PuzzlePlay.id == play_id)
            .with_for_update()
        ).scalar_one()

    def start_play(
        self,
        db: Session,
        play: PuzzlePlay,
    ) -> PuzzlePlay:
        locked_play = self.get_play_for_update(db, play.id)

        if locked_play.started_at is None:
            locked_play.started_at = datetime.now(UTC)

        db.commit()
        db.refresh(locked_play)

        return locked_play