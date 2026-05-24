import type { PuzzleStats } from "./puzzle";

export type SubmissionResult =
  | {
    status: "wrong";
    attemptCount: number;
    runtimeMs: number;
    message: string;
  }
  | {
    status: "solved";
    attemptCount: number;
    solveSeconds: number;
    score: number | null;
    stats: PuzzleStats | null;
    wrongOutput: string;
    correctOutput: string;
    runtimeMs: number;
    message: string;
  }
  | {
    status: "already_solved";
    attemptCount: number;
    solveSeconds: number | null;
    score: number | null;
    stats: PuzzleStats | null;
    message: string;
};