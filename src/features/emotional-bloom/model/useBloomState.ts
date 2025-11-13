import { useEffect, useMemo, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserQuery } from "@/entities/user";
import { useSymptomsQuery } from "@/entities/symptom/model/useSymptom";
import { calculateBloomState } from "./bloomEngine";
import { createBloomSnapshot } from "@/shared/api/bloom.client";
import { QUERY_KEYS } from "@/shared/api/queryKeys";

const formatDateRange = (days: number) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

export const useBloomState = () => {
  const { data: userData, isLoading: userLoading } = useUserQuery("profile");
  const queryClient = useQueryClient();
  const lastPayloadRef = useRef<{
    stage: string;
    mood: string;
    harmonyScore: number;
    careScore: number;
    balanceScore: number;
    petals: number;
    storyCue: string;
    companionVisible: boolean;
  } | null>(null);
  const lastSavedAtRef = useRef<number>(0);

  const { start, end } = useMemo(() => formatDateRange(10), []);
  const {
    data: symptomData,
    isLoading: symptomsLoading,
  } = useSymptomsQuery(undefined, undefined, start, end);

  const state = useMemo(() => {
    return calculateBloomState({
      profile: userData?.profile,
      symptoms: symptomData ?? [],
    });
  }, [userData?.profile, symptomData]);

  const { mutate: mutateSnapshot, isPending: isSavingSnapshot } = useMutation({
    mutationFn: createBloomSnapshot,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "bloom" && query.queryKey[1] === "history",
      });
    },
  });

  useEffect(() => {
    if (userLoading || symptomsLoading || !userData?.id || isSavingSnapshot) {
      return;
    }

    const payload = {
      stage: state.growthStage,
      mood: state.narrative.mood,
      harmonyScore: state.narrative.harmonyScore,
      careScore: state.narrative.careScore,
      balanceScore: state.metrics.balanceScore,
      petals: state.narrative.petals,
      storyCue: state.narrative.storyCue,
      companionVisible: state.companionVisible,
    };

    const now = Date.now();
    const previous = lastPayloadRef.current;
    const lastSavedAt = lastSavedAtRef.current;
    const timeSinceLastSave = now - lastSavedAt;

    const SIGNIFICANT_THRESHOLD = 0.1;
    const MODERATE_THRESHOLD = 0.05;
    const DAILY_INTERVAL_MS = 1000 * 60 * 60 * 24;

    const harmonyDiff = previous ? Math.abs(previous.harmonyScore - payload.harmonyScore) : Infinity;
    const careDiff = previous ? Math.abs(previous.careScore - payload.careScore) : Infinity;
    const balanceDiff = previous ? Math.abs(previous.balanceScore - payload.balanceScore) : Infinity;

    const stageChanged = previous ? previous.stage !== payload.stage : true;
    const moodChanged = previous ? previous.mood !== payload.mood : true;
    const storyChanged = previous ? previous.storyCue !== payload.storyCue : true;
    const companionChanged = previous ? previous.companionVisible !== payload.companionVisible : true;
    const petalsChanged = previous ? previous.petals !== payload.petals : true;

    const significantChange =
      stageChanged ||
      moodChanged ||
      storyChanged ||
      companionChanged ||
      petalsChanged ||
      harmonyDiff >= SIGNIFICANT_THRESHOLD ||
      careDiff >= SIGNIFICANT_THRESHOLD ||
      balanceDiff >= SIGNIFICANT_THRESHOLD;

    const moderateChange =
      harmonyDiff >= MODERATE_THRESHOLD || careDiff >= MODERATE_THRESHOLD || balanceDiff >= MODERATE_THRESHOLD;

    const timeExceeded = timeSinceLastSave >= DAILY_INTERVAL_MS;

    if (!significantChange && !timeExceeded) {
      return;
    }

    if (!significantChange && timeExceeded && !moderateChange) {
      // Раз в сутки сохраняем только при заметном дрейфе метрик
      return;
    }

    mutateSnapshot(payload, {
      onSuccess: () => {
        lastPayloadRef.current = payload;
        lastSavedAtRef.current = Date.now();
      },
    });
  }, [state, userData?.id, userLoading, symptomsLoading, mutateSnapshot, isSavingSnapshot]);

  return {
    state,
    isLoading: userLoading || symptomsLoading,
  };
};
