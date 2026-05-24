export type Puzzle = {
  slug: string;
  releaseDate: string;
  title: string;
  difficulty: number;
  language: string;
  statement: string;
  wrongCode: string;
  sampleInput: string;
  explanation: string | null;
  tags: string[];
};

export type PlayState = {
  status: "not_started" | "active" | "solved";
  attemptCount: number;
  startedAt: string | null;
  solvedAt: string | null;
  solveSeconds: number | null;
  score: number | null;
  solvedTestcase: string | null;
};

export type PuzzleStats = {
  solveCount: number;
  averageAttempts: number | null;
  averageSolveSeconds: number | null;
  averageScore: number | null;
};

export type TodayPuzzleResponse = {
  puzzle: Puzzle;
  play: PlayState;
  stats: PuzzleStats | null;
};