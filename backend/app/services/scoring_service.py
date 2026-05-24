from datetime import UTC, datetime

from app.db.models import PuzzlePlay


class ScoringService:
    def compute_solve_seconds(self, play: PuzzlePlay) -> int:
        if play.started_at is None:
            return 0

        return max(0, int((datetime.now(UTC) - play.started_at).total_seconds()))

    def compute_score(self, play: PuzzlePlay, solve_seconds: int) -> int:
        wrong_attempts = max(0, play.attempt_count - 1)
        capped_wrong = min(wrong_attempts, 10)

        penalty = solve_seconds
        penalty += 25 * capped_wrong
        penalty += 5 * capped_wrong * (capped_wrong - 1)

        return max(0, 1000 - penalty)