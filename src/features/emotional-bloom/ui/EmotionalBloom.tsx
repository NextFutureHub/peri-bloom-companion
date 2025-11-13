import { memo, useMemo, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { cn } from "@/shared/lib/utils";
import { useBloomState } from "../model/useBloomState";

interface EmotionalBloomProps {
  className?: string;
}

interface PetalProps {
  angle: number;
  palette: { gradientFrom: string; gradientTo: string; accent: string };
  index: number;
  length: number;
  width: number;
  offset: number;
  opacity?: number;
  reducedMotion?: boolean;
}

const Petal = ({ angle, palette, index, length, width, offset, opacity = 1, reducedMotion = false }: PetalProps) => {
  const animationProps = reducedMotion
    ? { animate: { opacity, scale: 1 } }
    : {
        initial: { opacity: 0, scale: 0.92 },
        animate: { opacity, scale: 1 },
        transition: { delay: 0.08 + index * 0.04, duration: 0.6, ease: "easeOut" as const },
      };

  const petalAnimation = reducedMotion
    ? {}
    : {
        animate: { scale: [1, 1.035, 1] },
        transition: { repeat: Infinity, duration: 8, ease: [0.45, 0.05, 0.15, 0.95] as const, delay: index * 0.08 },
      };

  const highlightAnimation = reducedMotion
    ? {}
    : {
        animate: { opacity: [0.45, 0.65, 0.45] },
        transition: { repeat: Infinity, duration: 6.5, ease: "easeInOut" as const, delay: 0.2 + index * 0.05 },
      };

  return (
    <motion.div
      {...animationProps}
      className="absolute top-1/2 left-1/2"
      style={{ rotate: angle }}
      aria-hidden="true"
    >
      <motion.span
        className="block rounded-[60%_60%_45%_45%/80%_80%_40%_40%] shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
        style={{
          width,
          height: length,
          marginLeft: -(width / 2),
          marginTop: -offset,
          background: `linear-gradient(150deg, ${palette.gradientFrom}, ${palette.gradientTo})`,
          filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.08))",
        }}
        {...petalAnimation}
      />
      <motion.span
        className="absolute left-1/2 top-1/2 block rounded-[65%_65%_45%_45%/85%_85%_45%_45%]"
        style={{
          width: width * 0.6,
          height: length * 0.75,
          marginLeft: -(width * 0.3),
          marginTop: -offset * 0.86,
          background: `linear-gradient(120deg, ${palette.gradientTo}, rgba(255,255,255,0.65))`,
          opacity: 0.55,
          filter: "blur(0.5px)",
        }}
        {...highlightAnimation}
      />
    </motion.div>
  );
};

const CompanionBloom = ({
  palette,
  reducedMotion = false,
}: {
  palette: { gradientFrom: string; gradientTo: string; accent: string };
  reducedMotion?: boolean;
}) => {
  const animationProps = reducedMotion
    ? { animate: { opacity: 0.9, scale: 1, x: 50, y: 50 } }
    : {
        initial: { opacity: 0, scale: 0.5, x: 60, y: 30 },
        animate: { opacity: 0.9, scale: 1, x: 50, y: 50 },
        transition: { duration: 0.9, ease: "easeOut" as const },
      };

  return (
    <motion.div
      {...animationProps}
      className="absolute right-0 bottom-2 flex h-24 w-24 items-center justify-center"
      aria-label="Цветок малыша"
    >
      <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: palette.accent, opacity: 0.35 }} />
      <div
        className="relative h-16 w-16 rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
        style={{ background: `linear-gradient(145deg, ${palette.gradientFrom}, ${palette.gradientTo})` }}
      />
    </motion.div>
  );
};

const LoadingBloom = () => {
  return (
    <div className="flex h-56 w-56 items-center justify-center" role="status" aria-label="Загрузка эмоционального цветка">
      <motion.div
        className="h-20 w-20 rounded-full border-4 border-dashed border-primary/40"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        aria-hidden="true"
      />
      <span className="sr-only">Загрузка...</span>
    </div>
  );
};

export const EmotionalBloom = memo(({ className }: EmotionalBloomProps) => {
  const { t } = useTranslation();
  const { state, isLoading } = useBloomState();
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true); // По умолчанию видим, чтобы цветок всегда отображался

  // Оптимизация: включаем полные анимации только когда компонент виден
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    const element = document.getElementById("emotional-bloom-container");
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const petalAngles = useMemo(() => {
    const petals = Math.max(6, state.narrative.petals);
    const step = 360 / petals;
    const primary = Array.from({ length: petals }).map((_, index) => index * step);
    const secondary = primary.map((angle) => angle + step / 2);
    return { primary, secondary, count: petals };
  }, [state.narrative.petals]);

  const stageLabel = t(`bloom.stages.${state.growthStage}.label`);
  const stageDescription = t(`bloom.stages.${state.growthStage}.description`);
  const moodLabel = t(`bloom.moods.${state.narrative.mood}.label`);
  const moodMessage = t(`bloom.moods.${state.narrative.mood}.message`);
  const storyMessage = t(`bloom.story.${state.narrative.storyCue}`);

  if (isLoading) {
    return <LoadingBloom />;
  }

  const containerAnimation = reducedMotion
    ? {}
    : {
        animate: {
          scale: [1, 1 + state.pulse * 0.08, 1],
        },
        transition: { repeat: Infinity, duration: 7, ease: "easeInOut" as const },
      };

  const glowAnimation = reducedMotion
    ? { animate: { opacity: 0.35 } }
    : {
        animate: { opacity: [0.35, 0.6 * state.pulse, 0.35] },
        transition: { repeat: Infinity, duration: 5, ease: [0.6, 0.05, 0.01, 0.99] as const },
      };

  const centerAnimation = reducedMotion
    ? {}
    : {
        animate: { rotate: [0, 5 * state.shimmer, 0] },
        transition: { repeat: Infinity, duration: 12, ease: "easeInOut" as const },
      };

  const coreAnimation = reducedMotion
    ? {}
    : {
        animate: { scale: [0.94, 1.06, 0.94] },
        transition: { repeat: Infinity, duration: 6.5, ease: "easeInOut" as const },
      };

  return (
    <div
      id="emotional-bloom-container"
      className={cn("flex flex-col items-center gap-4", className)}
      role="img"
      aria-label={`Эмоциональный цветок: ${stageLabel}, настроение: ${moodLabel}`}
    >
      <motion.div
        className="relative flex h-56 w-56 items-center justify-center"
        {...containerAnimation}
      >
        {isVisible && (
          <>
            <motion.span
              className="absolute inset-4 rounded-full blur-3xl"
              style={{
                background: `radial-gradient(circle, ${state.palette.glow} 0%, transparent 70%)`,
              }}
              {...glowAnimation}
              aria-hidden="true"
            />

            {petalAngles.primary.map((angle, index) => (
              <Petal
                key={`primary-${angle}`}
                angle={angle}
                palette={state.palette}
                index={index}
                length={150}
                width={70}
                offset={130}
                reducedMotion={reducedMotion ?? false}
              />
            ))}

            {petalAngles.secondary.map((angle, index) => (
              <Petal
                key={`secondary-${angle}`}
                angle={angle}
                palette={state.palette}
                index={index + petalAngles.count}
                length={120}
                width={56}
                offset={105}
                opacity={0.82}
                reducedMotion={reducedMotion ?? false}
              />
            ))}

            <motion.div
              className="relative z-10 flex h-[6.5rem] w-[6.5rem] items-center justify-center rounded-full shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
              style={{ background: `linear-gradient(145deg, ${state.palette.gradientFrom}, ${state.palette.gradientTo})` }}
              {...centerAnimation}
              aria-label="Сердцевина цветка"
            >
              <motion.div
                className="absolute inset-1 rounded-full bg-white/35 blur-md"
                animate={reducedMotion ? { opacity: 0.35 } : { opacity: [0.35, 0.55, 0.35] }}
                transition={reducedMotion ? {} : { repeat: Infinity, duration: 9, ease: "easeInOut" }}
                aria-hidden="true"
              />
              <motion.div
                className="relative h-14 w-14 rounded-full"
                style={{
                  background: state.palette.accent,
                  boxShadow: `0 0 18px ${state.palette.accent}40`,
                }}
                {...coreAnimation}
                aria-label="Центр цветка"
              />
            </motion.div>

            {state.companionVisible ? <CompanionBloom palette={state.palette} reducedMotion={reducedMotion ?? false} /> : null}
          </>
        )}
      </motion.div>

      <div className="text-center space-y-1">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{t("bloom.title")}</p>
        <p className="text-xl font-semibold text-foreground">{stageLabel}</p>
        <p className="text-sm text-muted-foreground">{stageDescription}</p>
      </div>

      <div className="text-center space-y-1 rounded-xl bg-primary/5 px-4 py-3 shadow-inner">
        <p className="text-sm font-medium text-primary">{moodLabel}</p>
        <p className="text-sm text-muted-foreground">{moodMessage}</p>
        <p className="text-sm text-foreground">{storyMessage}</p>
      </div>
    </div>
  );
});

EmotionalBloom.displayName = "EmotionalBloom";
