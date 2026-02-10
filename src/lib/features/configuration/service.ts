import { apiRequest } from "@/lib/api/base";
import { HotelConfig, ConfigResponse } from "./types";

export const configurationService = {
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
