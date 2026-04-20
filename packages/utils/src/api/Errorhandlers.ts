export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const extractMessage = (data: unknown, fallback: string): string => {
  if (!data || typeof data !== "object") return fallback;
  const d = data as Record<string, unknown>;

  if (typeof d.message === "string") return d.message;

  if (Array.isArray(d.message)) return d.message.join(" ");

  return fallback;
};

// Maps HTTP status codes to a human-readable message.
// No UI side effects here — the caller (React Query, store, component) decides
// how to present the error (toast, redirect, inline message, etc.).
export const getErrorMessage = (status: number, data?: unknown): string => {
  switch (status) {
    case 400:
      return extractMessage(data, "The request was invalid.");
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You don't have permission to do this.";
    case 404:
      return "The requested resource does not exist.";
    case 422:
      return extractMessage(data, "Please check your input.");
    case 429:
      return "Too many requests. Please wait a moment.";
    default:
      if (status >= 500)
        return "Something went wrong on our end. Please try again later.";
      return "An unexpected error occurred.";
  }
};

export const getNetworkErrorMessage = (isTimeout: boolean): string =>
  isTimeout
    ? "The server took too long to respond."
    : "Please check your internet connection.";
