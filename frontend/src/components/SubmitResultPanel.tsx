import { StatsPanel } from "./StatsPanel";
import type { SubmissionResult } from "../types/submission";
import { EditorialPanel } from "./EditorialPanel";

type SubmitResultPanelProps = {
    result: SubmissionResult;
    explanation: string | null;
};

export function SubmitResultPanel({ result, explanation }: SubmitResultPanelProps) {
    if (result.status === "wrong") {
        return (
            <div className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
                <p className="font-medium text-red-200">{result.message}</p>
                <p className="mt-1 text-red-100/80">
                    Attempts: {result.attemptCount}
                </p>
            </div>
        );
    }

    return (
        <details
            className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-50"
            open
        >
            <summary className="cursor-pointer font-semibold text-emerald-200">
                {result.status === "solved" ? "Solved!" : "Already solved"}
            </summary>

            <div className="mt-3 space-y-1 text-emerald-50/90">
                <p>{result.message}</p>
                <p>Attempts: {result.attemptCount}</p>

                {result.solveSeconds !== null && (
                    <p>Time: {result.solveSeconds}s</p>
                )}

                <p>Score: {result.score}</p>

                {result.status === "solved" && (
                    <>
                        <p>Judge runtime: {result.runtimeMs}ms</p>

                        <div className="mt-3 rounded border border-[#3c3c3c] bg-[#181818] p-3 text-slate-200">
                            <p className="text-slate-400">Wrong output</p>
                            <pre className="mt-1 overflow-auto whitespace-pre-wrap font-mono text-sm">
                                {result.wrongOutput}
                            </pre>
                        </div>

                        <div className="mt-3 rounded border border-[#3c3c3c] bg-[#181818] p-3 text-slate-200">
                            <p className="text-slate-400">Correct output</p>
                            <pre className="mt-1 overflow-auto whitespace-pre-wrap font-mono text-sm">
                                {result.correctOutput}
                            </pre>
                        </div>
                    </>
                )}

                <StatsPanel stats={result.stats} />
                <EditorialPanel explanation={explanation} />
            </div>
        </details>
    );
}