import { apiPost } from "./client"
import type { SubmissionResult } from "../types/submission"

type SubmitTestcaseRequest = {
    testcase: string;
};

export function submitTestcase(
    slug: string,
    testcase: string
): Promise<SubmissionResult> {
    return apiPost<SubmissionResult, SubmitTestcaseRequest>(
        `/puzzles/${slug}/submissions`,
        { testcase }
    );
}