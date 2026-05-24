# Countercase

Countercase is a daily algorithm game where players hunt for counterexamples.
Each day publishes one puzzle: you are shown an intentionally flawed implementation and your goal is to submit an input (testcase) that makes it disagree with the correct implementation.

You can find the live game (based on a slightly different private repository) here: https://countercase.org/

Basically, the gameplay is: Read buggy code → craft testcase → submit → get instant judge verdict + stats

---

## Overview

Countercase is built as a full-stack production-style web application with a separate native judging layer that uses:
- A frontend with React + TypeScript + Vite
- A FastAPI backend for puzzle retrieval, submissions, scoring, sessions, and stats
- A PostgreSQL database with SQLAlchemy models and Alembic migrations
- A deterministic native judge (C++17 binary)
- Anonymous session-based progression, solve tracking, scoring, and aggregate puzzle statistics

Each system does its own thing:
- **Frontend** handles the player experience, tutorial flow, puzzle display, submissions, and result states
- **Backend API** coordinates the puzzle lifecycle, session state, submission validation, scoring, and persistence
- **Judge process** evaluates submitted testcases by comparing buggy and correct implementations
- **Database** stores puzzles, anonymous sessions, per-puzzle play state, and stats
---

## Tech Stack

### Frontend
- **React 19** + **TypeScript**
- **Vite** for development/build tooling
- **Tailwind CSS 4** for styling
- **@tanstack/react-query** for server-state patterns
- Supporting UI/content libs: `react-markdown`, `react-shiki`, `react-syntax-highlighter`, `react-router-dom`

### Backend
- **FastAPI** for HTTP API
- **Pydantic v2** for request/response schemas
- **SQLAlchemy 2** ORM
- **Alembic** for migrations
- **psycopg 3** PostgreSQL driver
- **Uvicorn** ASGI runtime

### Judge
- **C++17** executable
- Registry-based puzzle dispatch
- JSON response contract consumed by the backend

### Data + Infrastructure
- **PostgreSQL 16**
- **Docker Compose** for local multi-service orchestration
- Containerized frontend/backend services

### Database info
- `Puzzle`: daily content (slug, release date, statement, wrong code, sample input, explanation, tags)
- `VisitorSession`: anonymous persistent visitor identity using a hashed session token
- `PuzzlePlay`: per-session, per-puzzle progress (started_at, attempts, solved_at, score, accepted testcase)
- `PuzzleStats`: aggregated puzzle metrics (solves, attempts, total solve time, total score)

---

## How the System Works

### 1) Daily puzzle retrieval
Frontend loads `GET /api/puzzles/today`.

The backend:
1. Resolves or creates an anonymous visitor session from the request cookie.
2. Fetches the puzzle for current release date.
3. Ensures a PuzzlePlay row exists for the (visitor_session, puzzle) pair.
4. Returns:
   - puzzle content
   - normalized play state (`not_started`, `active`, `solved`)
   - stats if already solved

### 2) Puzzle start

When tutorial/onboarding closes for first-time play, frontend calls `POST /api/puzzles/{slug}/start`.

The backend:

1. Validates that the puzzle exists.
2. Gets or creates the play row
3. Sets the start timestamp if it has not already been set.
4. Returns updated play state

### 3) Testcase submission + counterexample checking
Frontend submits a testcase to `POST /api/puzzles/{slug}/submissions`

The backend:
1. Resolves anonymous session and puzzle
2. Loads/creates play state
3. Returns early if the puzzle has already been solved.
4. Applies the submission rate-limit.
5. Sends testcase to judge service
6. Executes the C++ judge binary with:
   - the puzzle slug as an argument
   - the submitted testcase on stdin
   - a strict timeout
   - capped input/output sizes
7. Parses judge JSON result
8. Locks the play row and records the attempt.
9. If the wrong and correct implementations match, returns a wrong verdict.
10. If accepted counterexample (implementations give different outputs):
    - compute solve duration
    - compute score
    - store accepted testcase
    - update puzzle aggregate stats
    - commit and return `solved` with outputs and stats

### 4) Judge behavior
The C++ judge returns JSON containing:
- `status` for judge health
- `accepted` whether the testcase is a valid counterexample
- `wrongOutput` output from the flawed implementation, and
- `correctOutput` output from the correct implementation

Backend validates and maps this to API responses with runtime metadata (`runtime_ms`).

---
## Important API Endpoints
- `GET /api/puzzles/today`
  - Returns the current daily puzzle and the visitor’s play state.
- `POST /api/puzzles/{slug}/start`
  - Marks the puzzle as started for the current anonymous visitor session.
- `POST /api/puzzles/{slug}/submissions`
  - submits testcase and returns `wrong`, `solved`, or `already_solved`
- `GET /api/health/*`
  - Just a Health-check
---

## Running Locally
You can run this locally too and add your own puzzles using the seeder script and your own c++ file!
## Prerequisites

- Docker + Docker Compose

### 1) Clone

```bash
git clone <urllater>
cd Countercase
```

### 2) Configure environment variables

Use `.env.example` as a reference for local overrides.

### 3) Start all services

```bash
docker compose up --build
```

Services:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- PostgreSQL: localhost:5432

### 4) Seed puzzles

Run the seed script inside backend container/workflow:
```bash
python backend/app/scripts/seed_puzzles.py
```

If running this outside Docker, ensure PostgreSQL is reachable and backend dependencies are installed.

Later, there will be a short tutorial on how to use this seed script to add your own puzzles.

### 4) Credentials
The default Docker Compose credentials are for local development only. Use separate secrets and environment variables for any deployed environment.

---

## Live Version

The live version is available at:

**https://countercase.org/**

This is the hosted version with daily puzzle release, anonymous play state, testcase submission, native judge execution, scoring, and aggregate stats. Note: It uses a private repository that has the same design with this one with minor changes, it does NOT run on this public repository.

---

Thank you GPT for polishing the README