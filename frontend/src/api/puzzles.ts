import { apiGet, apiPost } from "./client";
import type { PlayState, TodayPuzzleResponse } from "../types/puzzle";

export function getTodayPuzzle(): Promise<TodayPuzzleResponse> {
    return apiGet<TodayPuzzleResponse>("/puzzles/today");
}

export function startPuzzle(slug: string): Promise<PlayState> {
    return apiPost<PlayState, Record<string, never>>(
        `/puzzles/${slug}/start`,
        {}
    );
}