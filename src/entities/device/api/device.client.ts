import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/types";

export interface DeviceDto {
  id: string;
  userId: string;
  name: string;
  type: "arduino" | "sensor" | "other";
  status: "connected" | "disconnected";
  lastConnectedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceMetricsDto {
  deviceId: string;
  temperature?: number;
  humidity?: number;
  noise?: number;
  timestamp: string;
}

/**
 * Получить все устройства пользователя
 */
export const fetchDevices = (userId?: string): Promise<DeviceDto[]> => {
  const params = userId ? { userId } : {};
  return api.get<ApiResponse<DeviceDto[]>>("/devices", { params }).then((r) => r.data.data);
};

/**
 * Получить метрики устройства
 */
export const fetchDeviceMetrics = (deviceId: string): Promise<DeviceMetricsDto[]> => {
  return api
    .get<ApiResponse<DeviceMetricsDto[]>>(`/devices/${deviceId}/metrics`)
    .then((r) => r.data.data);
};

