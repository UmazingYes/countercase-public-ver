import ReactMarkdown from "react-markdown";

type EditorialPanelProps = {
    explanation: string | null;
};

export function EditorialPanel({ explanation }: EditorialPanelProps) {
    if (explanation === null || explanation.trim() === "") {
        return null;
    }

    return (
        <div className="mt-4 rounded-lg border border-[#3c3c3c] bg-[#181818] p-4">
            <h3 className="font-semibold text-slate-100">Editorial</h3>

            <ReactMarkdown
                components={{
                    p: ({ children }) => (
                        <p className="mt-2 leading-6 text-slate-300">{children}</p>
                    ),
                    code: ({ children }) => (
                        <code className="rounded bg-[#252526] px-1.5 py-0.5 font-mono text-sm text-amber-200">
                            {children}
                        </code>
                    ),
                    strong: ({ children }) => (
                        <strong className="font-semibold text-slate-100">
                            {children}
                        </strong>
                    ),
                }}
            >
                {explanation}
            </ReactMarkdown>
        </div>
    );
}