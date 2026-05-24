from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Puzzle


class PuzzleRepository:
    def get_today_puzzle(self, db: Session) -> Puzzle | None:
        stmt = (
            select(Puzzle)
            .where(Puzzle.is_published == True)
            .where(Puzzle.release_date <= date.today())
            .order_by(Puzzle.release_date.desc())
            .limit(1)
        )

        return db.execute(stmt).scalar_one_or_none()
    
    def get_puzzle_by_slug(self, db: Session, slug: str) -> Puzzle | None:
        stmt = select(Puzzle).where(Puzzle.slug == slug)
        return db.execute(stmt).scalar_one_or_none()