import { useEffect, useState, useCallback } from 'react';
import type { TriageStatus } from '@/shared/types/api/bloom.dto';

export type ThemeMode = 'auto' | 'light' | 'dark';

const THEME_STORAGE_KEY = 'peribloom_theme_mode';
const THEME_AUTO_NOTIFICATION_KEY = 'peribloom_theme_auto_notified';

/**
 * Проверяет, находится ли текущее время в ночном диапазоне
 */
const isNightTime = (): boolean => {
  const now = new Date();
  const hour = now.getHours();
  // 20:00 - 07:00
  return hour >= 20 || hour < 7;
};

/**
 * Определяет, должна ли тема быть тёмной на основе статуса и времени
 */
const shouldUseDarkTheme = (
  status: TriageStatus | undefined,
  themeMode: ThemeMode
): boolean => {
  if (themeMode === 'light') return false;
  if (themeMode === 'dark') return true;

  // Auto mode
  if (!status) return false;

  // CRITICAL всегда включает тёмную тему
  if (status === 'CRITICAL') return true;

  // RISK + ночное время
  if (status === 'RISK' && isNightTime()) return true;

  // Ночное время (21:00 - 06:00) без статуса
  const hour = new Date().getHours();
  if (hour >= 21 || hour < 6) return true;

  return false;
};

/**
 * Хук для управления темой с автоматическим переключением
 */
export const useThemeManager = (status?: TriageStatus) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const [hasShownAutoNotification, setHasShownAutoNotification] = useState(false);

  // Загружаем сохранённый режим темы
  useEffect(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && (saved === 'auto' || saved === 'light' || saved === 'dark')) {
      setThemeMode(saved as ThemeMode);
    }

    const notified = localStorage.getItem(THEME_AUTO_NOTIFICATION_KEY);
    setHasShownAutoNotification(notified === 'true');
  }, []);

  // Определяем финальную тему
  const effectiveTheme = shouldUseDarkTheme(status, themeMode)
    ? 'dark'
    : themeMode === 'light'
    ? 'light'
    : themeMode === 'dark'
    ? 'dark'
    : 'light';

  // Применяем тему к document
  useEffect(() => {
    const root = document.documentElement;
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [effectiveTheme]);

  // Отслеживаем автоматическое переключение
  useEffect(() => {
    if (themeMode !== 'auto' || !status) return;

    const shouldBeDark = shouldUseDarkTheme(status, 'auto');
    const isDark = effectiveTheme === 'dark';

    if (shouldBeDark && isDark && !hasShownAutoNotification) {
      // Показываем уведомление один раз
      setHasShownAutoNotification(true);
      localStorage.setItem(THEME_AUTO_NOTIFICATION_KEY, 'true');

      const reason =
        status === 'CRITICAL'
          ? 'status'
          : status === 'RISK' && isNightTime()
          ? 'status'
          : 'time';

      // TODO: Интегрировать с аналитикой
      console.log('[Analytics] theme_auto_enabled', { reason });
    }
  }, [status, themeMode, effectiveTheme, hasShownAutoNotification]);

  // Сохраняем изменения режима темы
  const updateThemeMode = useCallback(
    (mode: ThemeMode) => {
      setThemeMode(mode);
      localStorage.setItem(THEME_STORAGE_KEY, mode);

      if (mode === 'auto') {
        const reason = shouldUseDarkTheme(status, 'auto') ? 'status' : 'time';
        console.log('[Analytics] theme_auto_enabled', { reason });
      } else {
        console.log('[Analytics] theme_manual_override', { mode });
      }
    },
    [status]
  );

  return {
    themeMode,
    effectiveTheme,
    updateThemeMode,
    isAutoMode: themeMode === 'auto',
  };
};
