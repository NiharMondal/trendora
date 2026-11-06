import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/** What an RTK Query hook's `error` can be. */
export type TApiError = FetchBaseQueryError | SerializedError | undefined;

/**
 * The HTTP status of a failed request, or `undefined` for a network failure,
 * a timeout or a thrown error — anything where the server never answered.
 */
export const getApiErrorStatus = (error: unknown): number | undefined => {
    const status = (error as { status?: unknown })?.status;
    return typeof status === "number" ? status : undefined;
};

/**
 * The backend's own `message` from the error envelope
 * (`{ success: false, message, errorDetails }`), else `fallback`. A request
 * that never reached the server gets a connection message instead, because
 * "Something went wrong" tells the user nothing they can act on.
 */
export const getApiErrorMessage = (
    error: unknown,
    fallback = "Something went wrong. Please try again.",
): string => {
    const message = (error as { data?: { message?: unknown } })?.data?.message;
    if (typeof message === "string" && message.trim()) return message;

    const status = (error as { status?: unknown })?.status;
    if (status === "FETCH_ERROR" || status === "TIMEOUT_ERROR") {
        return "We couldn't reach the server. Check your connection and try again.";
    }
    return fallback;
};

export const isNotFoundError = (error: unknown) =>
    getApiErrorStatus(error) === 404;
