import type { SymptomDto } from "@/shared/types/api/symptom.dto";
import type { UserProfileDto } from "@/shared/types/api/user.dto";

export type BloomGrowthStage = "seed" | "emerging" | "bloom" | "renewal" | "companions";
export type BloomMood = "radiant" | "balanced" | "resting";

export interface BloomPalette {
  gradientFrom: string;
  gradientTo: string;
  accent: string;
  glow: string;
}

export interface BloomNarrative {
  mood: BloomMood;
  harmonyScore: number; // 0-1
  careScore: number; // 0-1
  petals: number;
  storyCue: "rise" | "restore" | "glow";
}

export interface BloomState {
  growthStage: BloomGrowthStage;
  palette: BloomPalette;
  narrative: BloomNarrative;
  pulse: number; // 0-1 controls breathing animation
  shimmer: number; // 0-1 controls secondary animation
  companionVisible: boolean;
}

export interface BloomEngineInput {
  profile?: UserProfileDto;
  symptoms: SymptomDto[];
  recentAiInteractions?: number;
  recentCareActivities?: number; // breathing practices, sleep logs etc.
}

const STAGE_PALETTES: Record<BloomGrowthStage, BloomPalette> = {
  seed: {
    gradientFrom: "#f9d7eb",
    gradientTo: "#f7c8c3",
    accent: "#f07fa6",
    glow: "rgba(240, 127, 166, 0.55)",
  },
  emerging: {
    gradientFrom: "#fdd8b0",
    gradientTo: "#feb39a",
    accent: "#ff8f6b",
    glow: "rgba(255, 143, 107, 0.55)",
  },
  bloom: {
    gradientFrom: "#f0f4ff",
    gradientTo: "#c9d6ff",
    accent: "#8fa0ff",
    glow: "rgba(143, 160, 255, 0.55)",
  },
  renewal: {
    gradientFrom: "#e9dcff",
    gradientTo: "#d3c2ff",
    accent: "#a082ff",
    glow: "rgba(160, 130, 255, 0.55)",
  },
  companions: {
    gradientFrom: "#dff5e8",
    gradientTo: "#b8e4c6",
    accent: "#6fd3a2",
    glow: "rgba(111, 211, 162, 0.55)",
  },
};

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const calculateTrimester = (profile?: UserProfileDto | null): 1 | 2 | 3 => {
  const weeks = profile?.gestationalAgeWeeks;

  if (typeof weeks === "number") {
    if (weeks <= 12) return 1;
    if (weeks <= 27) return 2;
    return 3;
  }

  if (profile?.estimatedDueDate) {
    const due = new Date(profile.estimatedDueDate).getTime();
    const now = Date.now();
    const diffWeeks = Math.max(0, (due - now) / (1000 * 60 * 60 * 24 * 7));
    const currentWeek = 40 - diffWeeks;
    if (currentWeek <= 12) return 1;
    if (currentWeek <= 27) return 2;
    return 3;
  }

  return 1;
};

const mapLifeStageToGrowthStage = (profile?: UserProfileDto): BloomGrowthStage => {
  if (!profile) return "seed";

  if (profile.lifeStage === "pregnancy") {
    const trimester = calculateTrimester(profile);
    if (trimester === 1) return "seed";
    if (trimester === 2) return "emerging";
    return "bloom";
  }

  if (profile.lifeStage === "postpartum") {
    return "renewal";
  }

  if (profile.lifeStage === "childcare") {
    return "companions";
  }

  return "seed";
};

const calculateSymptomMetrics = (symptoms: SymptomDto[]) => {
  if (!symptoms.length) {
    return {
      balanceScore: 0.8,
      careScore: 0.4,
      logCount: 0,
    };
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recent = symptoms.filter((item) => {
    const date = new Date(item.startDate).getTime();
    return !Number.isNaN(date) && date >= sevenDaysAgo.getTime();
  });

  const intensityValues = (recent.length ? recent : symptoms).map((item) => item.intensity ?? 3);
  const averageIntensity = intensityValues.reduce((acc, val) => acc + val, 0) / intensityValues.length;
  const normalizedIntensity = clamp((averageIntensity - 1) / 4); // 0 (минимум) - 1 (максимум)

  const balanceScore = clamp(1 - normalizedIntensity); // чем ниже интенсивность, тем выше баланс
  const careScore = clamp(Math.log10(recent.length + 1) / Math.log10(6)); // 0..1, логирование симптомов = забота

  return {
    balanceScore,
    careScore,
    logCount: recent.length,
  };
};

const calculateNarrative = (
  balanceScore: number,
  careScore: number,
  recentAiInteractions?: number,
  recentCareActivities?: number,
): BloomNarrative => {
  const aiSupportFactor = clamp((recentAiInteractions ?? 0) / 5, 0, 0.3);
  const careActivityFactor = clamp((recentCareActivities ?? 0) / 5, 0, 0.3);

  const harmonyScore = clamp(0.6 * balanceScore + 0.3 * careScore + aiSupportFactor + careActivityFactor);

  let mood: BloomMood = "balanced";
  if (harmonyScore >= 0.75) {
    mood = "radiant";
  } else if (harmonyScore < 0.45) {
    mood = "resting";
  }

  const petalsBase = 5 + Math.round(careScore * 4);
  const petals = clamp(petalsBase, 5, 12);

  const storyCue: BloomNarrative["storyCue"] = (() => {
    if (mood === "radiant") return "glow";
    if (mood === "balanced") return "rise";
    return "restore";
  })();

  return {
    mood,
    harmonyScore,
    careScore,
    petals,
    storyCue,
  };
};

export const calculateBloomState = (input: BloomEngineInput): BloomState => {
  const growthStage = mapLifeStageToGrowthStage(input.profile);
  const palette = STAGE_PALETTES[growthStage];

  const symptomMetrics = calculateSymptomMetrics(input.symptoms);
  const narrative = calculateNarrative(
    symptomMetrics.balanceScore,
    symptomMetrics.careScore,
    input.recentAiInteractions,
    input.recentCareActivities,
  );

  const pulse = clamp(0.45 + narrative.harmonyScore * 0.4);
  const shimmer = clamp(0.3 + narrative.careScore * 0.5);

  return {
    growthStage,
    palette,
    narrative,
    pulse,
    shimmer,
    companionVisible: growthStage === "companions",
  };
};
