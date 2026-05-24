const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

export class ApiError extends Error {
    status: number;
    detail: string;
    retryAfter: string | null;

    constructor(status: number, detail: string, retryAfter: string | null) {
        super(detail);
        this.status = status;
        this.detail = detail;
        this.retryAfter = retryAfter;
    }
}

async function buildApiError(response: Response): Promise<ApiError> {
    let detail = `Request failed with status ${response.status}`;

    try {
        const data = await response.json();

        if (typeof data.detail === "string") {
            detail = data.detail;
        }
    } catch {
        const text = await response.text();

        if (text !== "") {
            detail = text;
        }
    }

    return new ApiError(
        response.status,
        detail,
        response.headers.get("Retry-After")
    );
}

export async function apiGet<T>(path: string): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw await buildApiError(response);
    }

    const data = await response.json();
    return data as T;
}

export async function apiPost<TRes, Tgive>(
    path: string,
    input: Tgive
): Promise<TRes> {
    const response = await fetch(`${API_URL}${path}`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        throw await buildApiError(response);
    }

    const data = await response.json();
    return data as TRes;
}