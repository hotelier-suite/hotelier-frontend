import { apiRequest } from "./base";

// Configuration types
export interface HotelConfig {
  id: number;
  propertyName: string;
  propertyAddress: string;
  propertyPhone: string;
  propertyEmail: string;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  timeZone: string;
}

// API Response type
interface ConfigResponse<T> {
  value?: T;
  status: string;
  message?: string;
}

// Configuration API client
export const configurationApi = {
  // Hotel configuration
  getHotelConfig: async (): Promise<HotelConfig> => {
    const response = (await apiRequest(
      "/configuration/hotel",
    )) as ConfigResponse<HotelConfig>;
    return response.value || (response as unknown as HotelConfig);
  },

  updateHotelConfig: async (
    config: Partial<HotelConfig>,
  ): Promise<HotelConfig> => {
    const response = (await apiRequest("/configuration/hotel", {
      method: "PATCH",
      body: JSON.stringify(config),
    })) as ConfigResponse<HotelConfig>;
    return response.value || (response as unknown as HotelConfig);
  },
};
