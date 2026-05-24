import ReactMarkdown from "react-markdown";
import type { Puzzle } from "../types/puzzle";

type PuzzleHeaderProps = {
    puzzle: Puzzle;
};

function getDifficultyStars(difficulty: number): string {
    const clampedDifficulty = Math.min(Math.max(difficulty, 1), 5);
    return "★".repeat(clampedDifficulty) + "☆".repeat(5 - clampedDifficulty);
}

export function PuzzleHeader({ puzzle }: PuzzleHeaderProps) {
    return (
        <section className="mt-6 overflow-hidden rounded-xl border border-[#2d2d2d] bg-[#1e1e1e]">
            <div className="border-b border-[#2d2d2d] bg-[#252526] px-4 py-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-100">
                            {puzzle.title}
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Today&apos;s debugging challenge
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span
                            className="rounded-full border border-[#3c3c3c] bg-[#181818] px-3 py-1 text-sm text-amber-300"
                            aria-label={`Difficulty ${puzzle.difficulty} out of 5`}
                        >
                            {getDifficultyStars(puzzle.difficulty)}
                        </span>

                        <span className="rounded-full border border-[#3c3c3c] bg-[#181818] px-3 py-1 text-sm text-slate-300">
                            {puzzle.language}
                        </span>
                    </div>
                </div>
            </div>

            <div className="px-4 py-4">
                <ReactMarkdown
                    components={{
                        p: ({ children }) => (
                            <p className="mb-3 leading-7 text-slate-300 last:mb-0">
                                {children}
                            </p>
                        ),
                        strong: ({ children }) => (
                            <strong className="font-semibold text-slate-100">
                                {children}
                            </strong>
                        ),
                        ul: ({ children }) => (
                            <ul className="mb-3 list-disc space-y-1 pl-6 text-slate-300 last:mb-0">
                                {children}
                            </ul>
                        ),
                        ol: ({ children }) => (
                            <ol className="mb-3 list-decimal space-y-1 pl-6 text-slate-300 last:mb-0">
                                {children}
                            </ol>
                        ),
                        li: ({ children }) => (
                            <li className="leading-7">{children}</li>
                        ),
                        code: ({ children }) => (
                            <code className="rounded bg-[#181818] px-1.5 py-0.5 font-mono text-sm text-amber-200">
                                {children}
                            </code>
                        ),
                    }}
                >
                    {puzzle.statement}
                </ReactMarkdown>
            </div>
        </section>
    );
}