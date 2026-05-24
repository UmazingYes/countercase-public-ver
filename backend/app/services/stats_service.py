from app.db.models import PuzzleStats


class StatsService:
    def build_stats_response(self, stats: PuzzleStats | None) -> dict | None:
        if stats is None:
            return None

        solve_count = stats.solve_count or 0

        if solve_count == 0:
            return {
                "solve_count": 0,
                "average_attempts": None,
                "average_solve_seconds": None,
                "average_score": None,
            }

        return {
            "solve_count": solve_count,
            "average_attempts": round((stats.total_attempts or 0) / solve_count, 2),
            "average_solve_seconds": round((stats.total_solve_seconds or 0) / solve_count, 2),
            "average_score": round((stats.total_score or 0) / solve_count, 2),
        }