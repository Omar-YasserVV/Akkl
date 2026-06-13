import { AxiosInstance } from "axios";
import { getBranchId } from "./BranchContext";
import {
  ApiError,
  getErrorMessage,
  getNetworkErrorMessage,
} from "./Errorhandlers";
import { RetryConfig, getRetryDelay, shouldRetry, sleep } from "./Retry";

export const applyInterceptors = (api: AxiosInstance): void => {
  api.interceptors.request.use((config) => {
    const branchId = getBranchId();
    if (branchId) {
      config.headers.set("x-branch-id", branchId);
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,

    async (error) => {
      // No response — offline or hard CORS block
      if (!error.response) {
        const message = getNetworkErrorMessage(error.code === "ECONNABORTED");
        return Promise.reject(new ApiError(0, message));
      }

      const { status, data, headers } = error.response;
      const config = error.config as RetryConfig;

      // Auto-retry transient failures before surfacing any error.
      // Spread config to avoid mutating the original object — mutation can
      // cause the retry counter to be lost if axios clones the config internally.
      if (shouldRetry(status, config._retryCount ?? 0)) {
        const retryCount = (config._retryCount ?? 0) + 1;
        const retryConfig: RetryConfig = { ...config, _retryCount: retryCount };
        await sleep(getRetryDelay(retryCount, headers["retry-after"]));
        return api(retryConfig);
      }

      // Throw a typed ApiError with a human-readable message.
      // The caller (React Query onError, Zustand, component) decides how to
      // present it — toast, redirect, inline validation message, etc.
      const message = getErrorMessage(status, data);
      return Promise.reject(new ApiError(status, message, data));
    },
  );
};
