"use client";

import { useEffect, useState } from "react";
import Configuration from "./components/configuration";
import { configurationService } from "@/lib/features/configuration/service";
import type { HotelConfig } from "@/lib/features/configuration/types";

export default function ConfigurationPage() {
  const [hotelConfig, setHotelConfig] = useState<HotelConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await configurationService.getHotelConfig();
        setHotelConfig(config);
      } catch (err) {
        console.error("Error fetching hotel config:", err);
        setError("Error loading configuration");
      }
    };

    fetchConfig();
  }, []);

  if (error) {
    return null; // Error boundary will handle this
  }

  if (!hotelConfig) {
    return null; // Loading.tsx will show
  }

  return <Configuration initialHotelConfig={hotelConfig} />;
}
