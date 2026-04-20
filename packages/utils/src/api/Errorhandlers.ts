import { addToast } from "@heroui/toast";

type ErrorHandler = (data?: unknown) => void;

const extractMessage = (data: unknown, fallback: string): string => {
  if (!data || typeof data !== "object") return fallback;
  const d = data as Record<string, unknown>;

  if (typeof d.message === "string") return d.message;

  if (Array.isArray(d.message)) return d.message.join(" ");

  return fallback;
};

export const errorHandlers: Record<number, ErrorHandler> = {
  400: (data) =>
    addToast({
      title: "Bad Request",
      description: extractMessage(data, "The request was invalid."),
      color: "warning",
    }),

  // 401 — session expired or missing cookie, send to login
  401: () => {
    window.location.href = "/login";
  },

  // 403 — authenticated but not allowed, show message instead of redirect
  403: () =>
    addToast({
      title: "Access Denied",
      description: "You don't have permission to do this.",
      color: "warning",
    }),

  404: () =>
    addToast({
      title: "Not Found",
      description: "The requested resource does not exist.",
      color: "warning",
    }),

  // 422 — NestJS can return this but class-validator usually uses 400
  422: (data) =>
    addToast({
      title: "Validation Error",
      description: extractMessage(data, "Please check your input."),
      color: "warning",
    }),

  429: () =>
    addToast({
      title: "Slow Down",
      description: "Too many requests. Please wait a moment.",
      color: "warning",
    }),
};

export const handleServerError = (): void => {
  addToast({
    title: "Server Error",
    description: "Something went wrong on our end. Please try again later.",
    color: "danger",
  });
};

export const handleNetworkError = (isTimeout: boolean): void => {
  addToast({
    title: isTimeout ? "Request Timed Out" : "Network Error",
    description: isTimeout
      ? "The server took too long to respond."
      : "Please check your internet connection.",
    color: "danger",
  });
};
