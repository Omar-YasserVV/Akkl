export { apiClient } from "./ApiClient";

// Export the typed error class so callers can instanceof-check in their
// error handlers (React Query onError, Zustand, etc.)
export { ApiError } from "./Errorhandlers";

// Export types if needed elsewhere in the app
export type { RetryConfig } from "./Retry";
