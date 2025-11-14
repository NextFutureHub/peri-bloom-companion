import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/api/queryKeys";
import { fetchDevices, fetchDeviceMetrics } from "../api/device.client";

/**
 * Hook для получения всех устройств пользователя
 */
export const useDevicesQuery = (userId?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.devices(userId),
    queryFn: () => fetchDevices(userId),
    staleTime: 1000 * 60 * 2, // 2 минуты
  });
};

/**
 * Hook для получения метрик устройства
 */
export const useDeviceMetricsQuery = (deviceId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.deviceMetrics(deviceId),
    queryFn: () => fetchDeviceMetrics(deviceId),
    enabled: !!deviceId,
    refetchInterval: 5000, // Обновление каждые 5 секунд для IoT
  });
};






