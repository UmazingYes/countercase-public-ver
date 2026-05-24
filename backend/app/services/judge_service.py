import json
import subprocess
import time

from app.core.config import settings


MAX_TESTCASE_BYTES = 16 * 1024
MAX_OUTPUT_CHARS = 4096
JUDGE_TIMEOUT_SECONDS = 1.5


class JudgeError(Exception):
    pass

class JudgeService:
    def run(self, puzzle_slug: str, testcase: str) -> dict:
        if len(testcase.encode("utf-8")) > MAX_TESTCASE_BYTES:
            raise JudgeError("testcase too large")

        start = time.perf_counter()

        try:
            result = subprocess.run(
                [settings.judge_path, puzzle_slug],
                input=testcase,
                text=True,
                capture_output=True,
                timeout=JUDGE_TIMEOUT_SECONDS,
            )
        except subprocess.TimeoutExpired:
            raise JudgeError("judge timed out")

        runtime_ms = int((time.perf_counter() - start) * 1000)

        stdout = result.stdout[:MAX_OUTPUT_CHARS]

        try:
            data = json.loads(stdout)
        except json.JSONDecodeError:
            raise JudgeError("judge returned invalid JSON")

        if data.get("status") != "ok":
            raise JudgeError(data.get("message", "judge failed"))

        return {
            "accepted": bool(data["accepted"]),
            "wrong_output": data["wrongOutput"][:MAX_OUTPUT_CHARS],
            "correct_output": data["correctOutput"][:MAX_OUTPUT_CHARS],
            "runtime_ms": runtime_ms,
        }
