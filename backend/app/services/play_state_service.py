from app.db.models import PuzzlePlay


class PlayStateService:
    def build_play_response(self, play: PuzzlePlay) -> dict:
        solved = play.solved_at is not None
        active = play.started_at is not None

        solve_seconds = None

        if solved and play.solved_at is not None and play.started_at is not None:
            solve_seconds = max(
                0,
                int((play.solved_at - play.started_at).total_seconds()),
            )

        if solved:
            status = "solved"
        elif active:
            status = "active"
        else:
            status = "not_started"

        return {
            "status": status,
            "attempt_count": play.attempt_count,
            "started_at": play.started_at,
            "solved_at": play.solved_at,
            "solve_seconds": solve_seconds,
            "score": play.score,
            "solved_testcase": play.accepted_testcase,
        }