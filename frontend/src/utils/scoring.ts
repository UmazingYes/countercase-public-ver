import type { PlayState } from "../types/puzzle";

const BASE_SCORE = 1000;
const WRONG_ATTEMPT_CAP = 10;

// only for estimated live score animations!
// real score is calculated in the backend

function computeAttemptPenalty(wrongAttempts: number): number {
    const cappedWrongAttempts = Math.min(
        Math.max(wrongAttempts, 0),
        WRONG_ATTEMPT_CAP
    );

    return (
        25 * cappedWrongAttempts +
        5 * cappedWrongAttempts * (cappedWrongAttempts - 1)
    );
}

export function estimateLiveScore(play: PlayState | null): number | null {
    if (play === null) {
        return null;
    }

    if (play.status === "solved") {
        return null;
    }

    if (play.startedAt === null) {
        return BASE_SCORE;
    }

    const startedAtMs = Date.parse(play.startedAt);

    if (Number.isNaN(startedAtMs)) {
        return BASE_SCORE;
    }

    const elapsedSeconds = Math.max(
        0,
        Math.floor((Date.now() - startedAtMs) / 1000)
    );

    const wrongAttempts = play.attemptCount;
    const penalty = elapsedSeconds + computeAttemptPenalty(wrongAttempts);

    return Math.max(0, BASE_SCORE - penalty);
}