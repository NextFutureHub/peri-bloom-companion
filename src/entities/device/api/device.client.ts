import { BaseService } from "@/shared/api/baseService";
import type { DeviceDto, DeviceMetricsDto } from "@/shared/types/api/device.dto";

/**
 * Device Service - работа с IoT устройствами
 */
class DeviceService extends BaseService {
  /**
   * Получить все устройства пользователя
   */
  fetchDevices(userId?: string): Promise<DeviceDto[]> {
    const params = userId ? { userId } : {};
    return this.get<DeviceDto[]>("/devices", params);
  }

  /**
   * Получить метрики устройства
   */
  fetchDeviceMetrics(deviceId: string): Promise<DeviceMetricsDto[]> {
    return this.get<DeviceMetricsDto[]>(`/devices/${deviceId}/metrics`);
  }
}

export const deviceService = new DeviceService();

// Экспортируем методы для удобства
export const fetchDevices = (userId?: string) => deviceService.fetchDevices(userId);
export const fetchDeviceMetrics = (deviceId: string) => deviceService.fetchDeviceMetrics(deviceId);

// Re-export типы
export type { DeviceDto, DeviceMetricsDto } from "@/shared/types/api/device.dto";

