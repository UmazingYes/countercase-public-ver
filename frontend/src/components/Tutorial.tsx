type Tutorial = {
    onClose: () => void;
};

export function Tutorial({ onClose }: Tutorial) {
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 px-4 py-6 backdrop-blur-sm">
            <div className="flex min-h-full items-start justify-center sm:pt-14">
                <section
                    className="overflow-hidden tutorial-fade-in w-full max-w-lg rounded-xl border border-[#2d2d2d] bg-[#1e1e1e] shadow-2xl"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="tutorial-title"
                >
                    <div className="flex items-center justify-between border-b border-[#2d2d2d] bg-[#252526] px-4 py-3">
                        <h2 id="tutorial-title" className="font-semibold text-slate-100">
                            How CounterCase works
                        </h2>

                        <button
                            type="button"
                            className="rounded px-2 py-1 text-slate-400 hover:bg-[#2d2d2d] hover:text-slate-100"
                            onClick={onClose}
                            aria-label="Close tutorial"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-4 px-4 py-4 text-sm leading-6 text-slate-300">
                        <p>
                            Each puzzle has two codes: one hidden correct implementation, and
                            one visible wrong implementation.
                        </p>

                        <p>
                            Your goal is to write an input where the wrong implementation
                            fails, meaning it produces a different output from the correct
                            implementation.
                        </p>

                        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-red-100">
                            <p className="font-medium text-red-200">Wrong answer</p>
                            <p className="mt-1">
                                If both programs give the same output, your testcase does not
                                break the wrong implementation yet.
                            </p>
                        </div>

                        <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-3 text-emerald-50">
                            <p className="font-medium text-emerald-200">Solved</p>
                            <p className="mt-1">
                                If the outputs differ, your testcase is accepted and the puzzle
                                is solved.
                            </p>
                        </div>

                        <div className="rounded-lg border border-[#3c3c3c] bg-[#181818] p-3">
                            <p className="font-medium text-slate-100">Scoring</p>
                            <p className="mt-1">
                                Your score starts at 1000. You lose points for time and wrong
                                attempts.
                            </p>
                            <p className="mt-2 font-mono text-xs text-slate-400">
                                score = max(0, 1000 - time - attemptPenalty)
                            </p>
                            <p className="mt-1 text-slate-400">
                                Wrong attempts are capped at 10 for scoring.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="w-full rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-2 font-medium text-slate-100 hover:bg-[#2d2d2d]"
                            onClick={onClose}
                        >
                            Got it
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}