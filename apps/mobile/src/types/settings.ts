export type AppLanguage = "en" | "ar";

export interface AppSettings {
  language: AppLanguage;
  notificationsEnabled: boolean;
  biometricLoginEnabled: boolean;
}

export const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  en: "English",
  ar: "Arabic",
};

export const APP_VERSION = "1.0.0";
