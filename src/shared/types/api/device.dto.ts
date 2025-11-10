import type { BaseEntity } from "../common";

export interface DeviceDto extends BaseEntity {
  userId: string;
  name: string;
  type: "arduino" | "sensor" | "other";
  status: "connected" | "disconnected";
  lastConnectedAt?: string;
}

export interface DeviceMetricsDto {
  deviceId: string;
  temperature?: number;
  humidity?: number;
  noise?: number;
  timestamp: string;
}




