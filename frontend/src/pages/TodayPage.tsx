import { useEffect, useState } from "react";
import { ApiError } from "../api/client";
import { getTodayPuzzle, startPuzzle } from "../api/puzzles";
import { submitTestcase } from "../api/submissions";
import { CodePanel } from "../components/CodePanel";
import { PuzzleHeader } from "../components/PuzzleHeader";
import { TestcasePanel } from "../components/TestcasePanel";
import type { PlayState, Puzzle, PuzzleStats } from "../types/puzzle";
import type { SubmissionResult } from "../types/submission";
import { Tutorial } from "../components/Tutorial";

function TodayPage() {
    const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
    const [testcase, setTestcase] = useState("");
    const [result, setResult] = useState<SubmissionResult | null>(null);
    const [loadingPuzzle, setLoadingPuzzle] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState("");
    const [play, setPlay] = useState<PlayState | null>(null);
    const [stats, setStats] = useState<PuzzleStats | null>(null);
    const [tutorialOpen, setTutorialOpen] = useState(false);

    useEffect(() => {
        async function loadPuzzle() {
            try {
                const today = await getTodayPuzzle();
                setPuzzle(today.puzzle);
                setPlay(today.play);
                setStats(today.stats);

                if (today.play.status === "solved" && today.play.solvedTestcase !== null) {
                    setTestcase(today.play.solvedTestcase);
                }

                if (today.play.status === "not_started") {
                    setTutorialOpen(true);
                }
            } catch (err) {
                console.error(err);
                setApiError("Failed to load puzzle.");
            } finally {
                setLoadingPuzzle(false);
            }
        }

        loadPuzzle();
    }, []);

    async function handleSubmit() {
        if (submitting) {
            return;
        }

        if (puzzle === null) {
            return;
        }

        if (play?.status === "solved") {
            return;
        }

        setSubmitting(true);
        setResult(null);
        setApiError("");

        try {
            const submissionResult = await submitTestcase(puzzle.slug, testcase);
            setResult(submissionResult);

            if (submissionResult.status === "wrong") {
                setPlay((oldPlay) => {
                    if (oldPlay === null) {
                        return oldPlay;
                    }

                    return {
                        ...oldPlay,
                        status: oldPlay.status === "not_started" ? "active" : oldPlay.status,
                        attemptCount: submissionResult.attemptCount,
                    };
                });
            }

            if (submissionResult.status === "solved") {
                setPlay((oldPlay) => {
                    if (oldPlay === null) {
                        return oldPlay;
                    }

                    return {
                        ...oldPlay,
                        status: "solved",
                        attemptCount: submissionResult.attemptCount,
                        solveSeconds: submissionResult.solveSeconds,
                        score: submissionResult.score,
                        solvedTestcase: testcase,
                    };
                });

                setStats(submissionResult.stats);
            }

            if (submissionResult.status === "already_solved") {
                setPlay((oldPlay) => {
                    if (oldPlay === null) {
                        return oldPlay;
                    }

                    return {
                        ...oldPlay,
                        status: "solved",
                        attemptCount: submissionResult.attemptCount,
                        solveSeconds: submissionResult.solveSeconds,
                        score: submissionResult.score,
                    };
                });

                setStats(submissionResult.stats);
            }
        } catch (err) {
            console.error(err);

            if (err instanceof ApiError) {
                if (err.status === 429) {
                    setApiError(
                        err.retryAfter !== null
                            ? `Rate limited. Try again in ${err.retryAfter} seconds.`
                            : "Rate limited. Please slow down."
                    );
                } else {
                    setApiError(err.detail);
                }
            } else {
                setApiError("Something went wrong. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function closeTutorial() {
        if (puzzle !== null && play?.status === "not_started") {
            try {
                const startedPlay = await startPuzzle(puzzle.slug);
                setPlay(startedPlay);
            } catch (err) {
                console.error(err);

                if (err instanceof ApiError) {
                    setApiError(err.detail);
                } else {
                    setApiError("Failed to start puzzle.");
                }

                return;
            }
        }

        setTutorialOpen(false);
    }

    if (loadingPuzzle) {
        return <main className="p-6">Loading puzzle...</main>;
    }

    if (puzzle === null) {
        return <main className="p-6">No puzzle found.</main>;
    }

    const isSolved = play?.status === "solved";

    const solvedResult: SubmissionResult | null =
        play !== null && play.status === "solved"
            ? {
                  status: "already_solved",
                  attemptCount: play.attemptCount,
                  solveSeconds: play.solveSeconds,
                  score: play.score,
                  stats,
                  message: "You already solved this puzzle.",
              }
            : null;

    return (
        <main className="relative flex min-h-screen flex-col bg-[#181818] p-4 text-slate-100 sm:p-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-100">
                        Countercase
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                        A daily game where you have to find a testcase that breaks an incorrectly implemented algorithm.
                    </p>
                </div>

                <div className="flex items-center gap-3 text-sm">
                    <a
                        href="https://github.com/your-username/countercase"
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-slate-100"
                    >
                        GitHub
                    </a>

                    <span className="text-slate-600">|</span>

                    <a
                        href="mailto:countercasehelp@gmail.com"
                        className="text-slate-400 hover:text-slate-100"
                    >
                        Report bugs
                    </a>

                    <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2d2d2d] bg-[#1e1e1e] text-sm font-semibold text-slate-400 hover:bg-[#252526] hover:text-slate-100"
                        onClick={() => setTutorialOpen(true)}
                        aria-label="Open tutorial"
                        title="Open tutorial"
                    >
                        ?
                    </button>
                </div>
            </header>
            <PuzzleHeader puzzle={puzzle} />

            <section className="mt-6 grid grid-cols-1 gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-2">
                <CodePanel code={puzzle.wrongCode} language={puzzle.language} />

                <TestcasePanel
                    testcase={testcase}
                    submitting={submitting}
                    disabled={isSolved}
                    apiError={apiError}
                    result={result ?? solvedResult}
                    onTestcaseChange={setTestcase}
                    onSubmit={handleSubmit}
                    sampleInput={puzzle.sampleInput}
                    play={play}
                    explanation={puzzle.explanation}
                />
            </section>

        <footer className="pointer-events-none absolute bottom-1 left-0 right-0 text-center text-xs text-slate-600">
            © 2026 Countercase. All rights reserved.
        </footer>

        {tutorialOpen && <Tutorial onClose={closeTutorial} />}
        </main>
    );
}

export default TodayPage;