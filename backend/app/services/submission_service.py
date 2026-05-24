from datetime import UTC, datetime

from sqlalchemy.orm import Session

from app.db.models import Puzzle, VisitorSession
from app.repositories.play_repository import PlayRepository
from app.repositories.stats_repository import StatsRepository
from app.services.judge_service import JudgeService
from app.services.rate_limit_service import RateLimitService
from app.services.scoring_service import ScoringService
from app.services.stats_service import StatsService


class SubmissionService:
    def __init__(
        self,
        play_repository: PlayRepository,
        stats_repository: StatsRepository,
        judge_service: JudgeService,
        scoring_service: ScoringService,
        stats_service: StatsService,
        rate_limit_service: RateLimitService,
    ):
        self.play_repository = play_repository
        self.stats_repository = stats_repository
        self.judge_service = judge_service
        self.scoring_service = scoring_service
        self.stats_service = stats_service
        self.rate_limit_service = rate_limit_service

    def submit(
        self,
        db: Session,
        session: VisitorSession,
        puzzle: Puzzle,
        testcase: str,
    ) -> dict:
        play = self.play_repository.get_or_create_play(db, session, puzzle)

        if play.solved_at is not None:
            return self._already_solved_response(db, puzzle, play)

        self.rate_limit_service.check(str(session.id))

        result = self.judge_service.run(puzzle.slug, testcase)

        locked_play = self.play_repository.get_play_for_update(db, play.id)
        if locked_play.started_at is None:
            locked_play.started_at = datetime.now(UTC)

        if locked_play.solved_at is not None:
            db.commit()
            return self._already_solved_response(db, puzzle, locked_play)

        locked_play.attempt_count += 1
        locked_play.last_attempt_at = datetime.now(UTC)

        if not result["accepted"]:
            db.commit()

            return {
                "status": "wrong",
                "attempt_count": locked_play.attempt_count,
                "runtime_ms": result["runtime_ms"],
                "message": "Both implementations produced the same output.",
            }
        
        solve_seconds = self.scoring_service.compute_solve_seconds(locked_play)
        score = self.scoring_service.compute_score(locked_play, solve_seconds)

        locked_play.solved_at = datetime.now(UTC)
        locked_play.score = score
        locked_play.accepted_testcase = testcase

        stats = self.stats_repository.get_or_create_stats_for_update(db, puzzle.id)

        stats.solve_count += 1
        stats.total_attempts += locked_play.attempt_count
        stats.total_solve_seconds += solve_seconds
        stats.total_score += score
        stats.updated_at = datetime.now(UTC)

        db.commit()

        stats_row = self.stats_repository.get_stats_for_puzzle(db, puzzle.id)

        return {
            "status": "solved",
            "attempt_count": locked_play.attempt_count,
            "solve_seconds": solve_seconds,
            "score": score,
            "stats": self.stats_service.build_stats_response(stats_row),
            "wrong_output": result["wrong_output"],
            "correct_output": result["correct_output"],
            "runtime_ms": result["runtime_ms"],
            "message": "Counterexample found.",
        }

    def _already_solved_response(
        self,
        db: Session,
        puzzle: Puzzle,
        play,
    ) -> dict:
        stats_row = self.stats_repository.get_stats_for_puzzle(db, puzzle.id)

        solve_seconds = None

        if play.solved_at is not None:
            solve_seconds = max(0, int((play.solved_at - play.started_at).total_seconds()))

        return {
            "status": "already_solved",
            "attempt_count": play.attempt_count,
            "solve_seconds": solve_seconds,
            "score": play.score,
            "stats": self.stats_service.build_stats_response(stats_row),
            "message": "You already solved this puzzle.",
        }