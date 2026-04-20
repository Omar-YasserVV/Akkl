import { AxiosRequestConfig } from "axios";

export interface RetryConfig extends AxiosRequestConfig {
  _retryCount?: number;
}

export const RETRY_CONFIG = {
  MAX_RETRIES: 2,
  DELAY_MS: 1000,
  RETRYABLE_STATUSES: new Set([408, 429, 502, 503, 504]),
} as const;

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const shouldRetry = (status: number, retryCount: number): boolean =>
  RETRY_CONFIG.RETRYABLE_STATUSES.has(status) &&
  retryCount < RETRY_CONFIG.MAX_RETRIES;

export const getRetryDelay = (retryCount: number): number =>
  RETRY_CONFIG.DELAY_MS * retryCount;
