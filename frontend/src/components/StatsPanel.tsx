import type { PuzzleStats } from "../types/puzzle";

type StatsPanelProps = {
    stats: PuzzleStats | null;
};

function formatAverage(value: number | null): string {
    if (value === null) {
        return "N/A";
    }

    return value.toFixed(2);
}

export function StatsPanel({ stats }: StatsPanelProps) {
    if (stats === null) {
        return null;
    }

    return (
        <div className="mt-4 rounded-lg border border-[#3c3c3c] bg-[#181818] p-4">
            <h3 className="font-semibold text-slate-100">Global stats</h3>

            <div className="mt-2 space-y-1 text-sm text-slate-300">
                <p>Solves: {stats.solveCount}</p>
                <p>Average attempts: {formatAverage(stats.averageAttempts)}</p>
                <p>Average time: {formatAverage(stats.averageSolveSeconds)}s</p>
                <p>Average score: {formatAverage(stats.averageScore)}</p>
            </div>
        </div>
    );
}