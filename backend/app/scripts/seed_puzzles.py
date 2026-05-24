from datetime import date

from sqlalchemy import select
from textwrap import dedent

from app.db.models import Puzzle, PuzzleStats
from app.db.session import SessionLocal

BROKEN_BINARY_SEARCH_CODE = """#include <bits/stdc++.h>
using namespace std;

int binary_search_wrong(vector<int> a, int x)
{
    int l = 0;
    int r = a.size() - 1;

    while (l < r)
    {
        int mid = (l + r) / 2;

        if (a[mid] < x)
            l = mid + 1;
        else
            r = mid - 1;
    }

    return a[l] == x;
}

int main()
{
    int n, x;
    cin >> n >> x;

    vector<int> a(n);

    for (int i = 0; i < n; i++)
        cin >> a[i];

    cout << binary_search_wrong(a, x) << '\\n';
}
"""

BROKEN_BINARY_SEARCH_SAMPLE_INPUT = """5 6
1 2 3 4 5"""

PUZZLES = [
    {
        "slug": "broken-binary-search",
        "release_date": date(2026, 5, 24),
        "title": "Broken Binary Search",
        "difficulty": 2,
        "language": "cpp",
        "statement": dedent(
            """
            The program is supposed to determine whether `x` appears in a sorted array.

            It reads `n` and `x`, followed by `n` integers in nondecreasing order.

            It should output:

            - `1` if `x` is present
            - `0` otherwise

            Find a valid input where the visible implementation gives the wrong answer.

            **Input constraints:**

            - `1 ≤ n ≤ 100`
            - `-10^9 ≤ ai, x ≤ 10^9`
            - The array must be sorted in nondecreasing order.
            """
        ).strip(),
        "wrong_code": BROKEN_BINARY_SEARCH_CODE,
        "sample_input": BROKEN_BINARY_SEARCH_SAMPLE_INPUT,
        "explanation": (
            "When `a[mid] == x`, the code still moves `r` to `mid - 1`, "
            "so it can discard the correct position."
        ),
        "tags": ["binary-search", "implementation"],
        "is_published": True,
    },
]


def upsert_puzzle(db, puzzle_data):
    existing = db.execute(
        select(Puzzle).where(Puzzle.slug == puzzle_data["slug"])
    ).scalar_one_or_none()

    if existing is None:
        puzzle = Puzzle(**puzzle_data)
        db.add(puzzle)
        db.flush()
    else:
        puzzle = existing

        for key, value in puzzle_data.items():
            setattr(puzzle, key, value)

        db.flush()

    stats = db.execute(
        select(PuzzleStats).where(PuzzleStats.puzzle_id == puzzle.id)
    ).scalar_one_or_none()

    if stats is None:
        db.add(
            PuzzleStats(
                puzzle_id=puzzle.id,
                solve_count=0,
                total_attempts=0,
                total_solve_seconds=0,
                total_score=0,
            )
        )


def seed_puzzles():
    db = SessionLocal()

    try:
        for puzzle_data in PUZZLES:
            upsert_puzzle(db, puzzle_data)

        db.commit()
        print("Seeded puzzles.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_puzzles()