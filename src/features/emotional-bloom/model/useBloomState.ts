import { useMemo } from "react";
import { useUserQuery } from "@/entities/user";
import { useSymptomsQuery } from "@/entities/symptom/model/useSymptom";
import { calculateBloomState } from "./bloomEngine";

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

  return {
    state,
    isLoading: userLoading || symptomsLoading,
  };
};
