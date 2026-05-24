import type { CSSProperties } from "react";
import ShikiHighlighter from "react-shiki";
import "react-shiki/css";

type CodePanelProps = {
    code: string;
    language: string;
};

export function CodePanel({ code, language }: CodePanelProps) {
    return (
        <section className="flex max-h-[70vh] min-h-[22rem] flex-col overflow-hidden rounded-xl border border-[#2d2d2d] bg-[#1e1e1e] lg:h-full lg:max-h-none lg:min-h-0">
            <div className="flex items-center justify-between border-b border-[#2d2d2d] bg-[#252526] px-4 py-3">
                <h3 className="font-semibold text-slate-100">Wrong implementation</h3>
                <span className="text-xs text-slate-400">{language}</span>
            </div>

            <div className="min-h-0 flex-1 overflow-auto bg-[#1e1e1e]">
                <ShikiHighlighter
                    language={language}
                    theme="dark-plus"
                    showLineNumbers
                    showLanguage={false}
                    className="min-w-full text-sm leading-6"
                    style={
                        {
                            background: "transparent",
                            "--rs-line-numbers-foreground": "#858585",
                            "--rs-line-numbers-width": "3ch",
                            "--rs-line-numbers-padding-right": "1rem",
                        } as CSSProperties
                    }
                >
                    {code}
                </ShikiHighlighter>
            </div>
        </section>
    );
}