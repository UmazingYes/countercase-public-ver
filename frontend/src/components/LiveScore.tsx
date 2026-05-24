import { useEffect, useRef, useState } from "react";
import type { PlayState } from "../types/puzzle";
import { estimateLiveScore } from "../utils/scoring";

type LiveScoreProps = {
    play: PlayState | null;
};

export function LiveScore({ play }: LiveScoreProps) {
    const [targetScore, setTargetScore] = useState<number | null>(() =>
        estimateLiveScore(play)
    );
    const [displayScore, setDisplayScore] = useState<number | null>(() =>
        estimateLiveScore(play)
    );
    const [flashing, setFlashing] = useState(false);

    const previousAttemptCountRef = useRef<number | null>(
        play?.attemptCount ?? null
    );

    useEffect(() => {
        if (play?.status === "solved") {
            setTargetScore(null);
            setDisplayScore(null);
            return;
        }

        function updateTargetScore() {
            setTargetScore(estimateLiveScore(play));
        }

        updateTargetScore();

        const timer = window.setInterval(updateTargetScore, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, [play]);

    useEffect(() => {
        const currentAttemptCount = play?.attemptCount ?? null;
        const previousAttemptCount = previousAttemptCountRef.current;

        if (
            previousAttemptCount !== null &&
            currentAttemptCount !== null &&
            currentAttemptCount > previousAttemptCount
        ) {
            setFlashing(true);
            window.setTimeout(() => setFlashing(false), 450);
        }

        previousAttemptCountRef.current = currentAttemptCount;
    }, [play?.attemptCount]);

    useEffect(() => {
        if (targetScore === null) {
            setDisplayScore(null);
            return;
        }

        if (displayScore === null) {
            setDisplayScore(targetScore);
            return;
        }

        if (targetScore >= displayScore) {
            setDisplayScore(targetScore);
            return;
        }

        const timer = window.setInterval(() => {
            setDisplayScore((currentScore) => {
                if (currentScore === null) {
                    return targetScore;
                }

                if (currentScore <= targetScore) {
                    window.clearInterval(timer);
                    return targetScore;
                }

                const step = Math.max(1, Math.ceil((currentScore - targetScore) / 5));
                return Math.max(targetScore, currentScore - step);
            });
        }, 25);

        return () => {
            window.clearInterval(timer);
        };
    }, [targetScore, displayScore]);

    if (displayScore === null) {
        return null;
    }

    return (
        <div
            className={
                "shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold tabular-nums transition-colors " +
                (flashing
                    ? "border-red-400/50 bg-red-500/20 text-red-100"
                    : "border-[#3c3c3c] bg-[#181818] text-slate-100")
            }
            aria-label={`Estimated score ${displayScore}`}
        >
            Score:{" "}
            <span className={flashing ? "text-red-200" : "text-emerald-300"}>
                {displayScore}
            </span>
        </div>
    );
}