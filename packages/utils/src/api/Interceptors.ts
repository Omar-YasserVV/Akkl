import { AxiosInstance } from "axios";
import {
  errorHandlers,
  handleNetworkError,
  handleServerError,
} from "./Errorhandlers";
import { RetryConfig, getRetryDelay, shouldRetry, sleep } from "./Retry";

export const applyInterceptors = (api: AxiosInstance): void => {
  api.interceptors.response.use(
    (response) => response,

    async (error) => {
      // No response — offline or hard CORS block
      if (!error.response) {
        handleNetworkError(error.code === "ECONNABORTED");
        return Promise.reject(error);
      }

      const { status, data } = error.response;
      const config = error.config as RetryConfig;

      // Auto-retry transient failures before showing any error
      if (shouldRetry(status, config._retryCount ?? 0)) {
        config._retryCount = (config._retryCount ?? 0) + 1;
        await sleep(getRetryDelay(config._retryCount));
        return api(config);
      }

      if (errorHandlers[status]) {
        errorHandlers[status](data);
      } else if (status >= 500) {
        handleServerError();
      }

      return Promise.reject(error);
    },
  );
};
