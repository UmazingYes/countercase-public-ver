import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import PuzzleStats


class StatsRepository:
    def get_stats_for_puzzle(
        self,
        db: Session,
        puzzle_id: uuid.UUID,
    ) -> PuzzleStats | None:
        return db.execute(
            select(PuzzleStats).where(PuzzleStats.puzzle_id == puzzle_id)
        ).scalar_one_or_none()

    def get_or_create_stats_for_update(
        self,
        db: Session,
        puzzle_id: uuid.UUID,
    ) -> PuzzleStats:
        stats = db.execute(
            select(PuzzleStats)
            .where(PuzzleStats.puzzle_id == puzzle_id)
            .with_for_update()
        ).scalar_one_or_none()

        if stats is not None:
            return stats

        stats = PuzzleStats(
            puzzle_id=puzzle_id,
            solve_count=0,
            total_attempts=0,
            total_solve_seconds=0,
            total_score=0,
        )

        db.add(stats)
        db.flush()

        return stats