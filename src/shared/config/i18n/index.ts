import { ru } from "./ru";
import { kk } from "./kk";

export type Language = "ru" | "kk" | "en";

export const translations = {
  ru,
  kk,
  // TODO: Добавить английский
  en: ru, // Временно используем русский
} as const;

export type TranslationKey = typeof ru;

