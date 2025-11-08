import type { BaseEntity } from "../common";

export interface SymptomDto extends BaseEntity {
  userId: string;
  date: string;
  name: string;
  severity: "low" | "medium" | "high";
  notes?: string;
}

export interface CreateSymptomDto {
  date: string;
  name: string;
  severity: "low" | "medium" | "high";
  notes?: string;
}

export interface UpdateSymptomDto extends Partial<CreateSymptomDto> {}



