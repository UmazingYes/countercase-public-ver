import type { SubmissionResult } from "../types/submission";
import { SubmitResultPanel } from "./SubmitResultPanel";
import type { PlayState } from "../types/puzzle";
import { LiveScore } from "./LiveScore";

type TestcasePanelProps = {
    testcase: string;
    submitting: boolean;
    disabled: boolean;
    apiError: string;
    result: SubmissionResult | null;
    play: PlayState | null;
    onTestcaseChange: (value: string) => void;
    onSubmit: () => void;
    sampleInput: string;
    explanation: string | null;
};

export function TestcasePanel({
    testcase,
    submitting,
    disabled,
    apiError,
    result,
    play,
    onTestcaseChange,
    onSubmit,
    sampleInput,
    explanation,
}: TestcasePanelProps) {
    return (
        <section className="flex max-h-[80vh] min-h-[28rem] flex-col overflow-hidden rounded-xl border border-[#2d2d2d] bg-[#1e1e1e] lg:h-full lg:max-h-none lg:min-h-0">
            <div className="border-b border-[#2d2d2d] bg-[#252526] px-4 py-3">
                <h3 className="font-semibold text-slate-100">Your testcase</h3>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-4">
                <textarea
                    className="h-64 w-full resize-none rounded-lg border border-[#3c3c3c] bg-[#181818] p-4 font-mono text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-[#007acc] disabled:cursor-not-allowed disabled:bg-[#202020] disabled:text-slate-500 sm:h-80"
                    value={testcase}
                    onChange={(event) => onTestcaseChange(event.target.value)}
                    placeholder={sampleInput}
                    disabled={disabled}
                />

                <div className="mt-4 flex items-center justify-between gap-3">
                    <button
                        className="w-28 rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-2 text-center text-sm font-medium text-slate-100 hover:bg-[#2d2d2d] disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={onSubmit}
                        disabled={submitting || disabled}
                    >
                        {disabled ? "Solved" : submitting ? "Submitting..." : "Submit"}
                    </button>

                    <LiveScore play={play} />
                </div>

                {apiError !== "" && (
                    <div className="mt-4 rounded-lg border border-amber-400/30 bg-amber-500/10 p-3 text-sm text-amber-100">
                        <p>{apiError}</p>
                    </div>
                )}

                {result !== null && (
                    <SubmitResultPanel result={result} explanation={explanation} />
                )}
            </div>
        </section>
    );
}