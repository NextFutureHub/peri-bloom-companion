import { ru } from "./ru";
import { kk } from "./kk";
import { en } from "./en";

export type Language = "ru" | "kk" | "en";

export const translations = {
  ru,
  kk,
  en,
} as const;

export type TranslationKey = typeof ru;




