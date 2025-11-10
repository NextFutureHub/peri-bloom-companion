import type { BaseEntity } from "../common";

export type SymptomCategory = "physical" | "emotional" | "cognitive";
export type TriageLevel = "low" | "medium" | "high";

export interface SymptomDto extends BaseEntity {
  userId: string;
  category: SymptomCategory;
  name: string;
  intensity: number; // 1-5
  startDate: string;
  endDate?: string | null;
  note?: string | null;
  triageLevel?: TriageLevel | null;
  aiAnalysis?: string | null;
}

export interface CreateSymptomDto {
  category: SymptomCategory;
  name: string;
  intensity: number; // 1-5
  startDate: string;
  endDate?: string;
  note?: string;
}

export interface UpdateSymptomDto extends Partial<CreateSymptomDto> {}

export interface SymptomAnalysisDto {
  triageLevel: TriageLevel;
  aiAnalysis: string;
}




