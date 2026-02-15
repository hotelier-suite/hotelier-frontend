"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api/base";
import type { HotelConfig } from "@/lib/features/configuration/types";
import { HotelConfig as HotelConfigComponent } from "./hotel-config";

interface HotelConfigFormData {
  propertyName: string;
  propertyAddress: string;
  propertyPhone: string;
  propertyEmail: string;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy?: string;
  timeZone?: string;
}

interface ConfigurationProps {
  initialHotelConfig: HotelConfig;
}

export default function Configuration({
  initialHotelConfig,
}: ConfigurationProps) {
  const t = useTranslations("Configuration");
  const [isLoading, setIsLoading] = useState(false);
  const [hotelConfig, setHotelConfig] = useState(initialHotelConfig);

  const handleSaveHotelConfig = async (
    hotelConfigData: HotelConfigFormData,
  ) => {
    setIsLoading(true);
    try {
      // Transform frontend format to backend format
      const backendData = {
        name: hotelConfigData.propertyName,
        address: hotelConfigData.propertyAddress,
        phone: hotelConfigData.propertyPhone,
        email: hotelConfigData.propertyEmail,
        checkInTime: hotelConfigData.checkInTime,
        checkOutTime: hotelConfigData.checkOutTime,
        timezone: hotelConfigData.timeZone || "",
      };

      const result = await apiRequest<{ success: boolean }>(
        "/configuration/hotel",
        {
          method: "PATCH",
          body: JSON.stringify(backendData),
        },
      );

      if (result.success) {
        // Update the local state with the new data including the id
        setHotelConfig({
          ...hotelConfig,
          propertyName: hotelConfigData.propertyName,
          propertyAddress: hotelConfigData.propertyAddress,
          propertyPhone: hotelConfigData.propertyPhone,
          propertyEmail: hotelConfigData.propertyEmail,
          checkInTime: hotelConfigData.checkInTime,
          checkOutTime: hotelConfigData.checkOutTime,
          timeZone: hotelConfigData.timeZone || "",
          cancellationPolicy: hotelConfigData.cancellationPolicy || "",
        });
        toast(t("settingsSaved"), {
          description: t("settingsSavedDesc"),
        });
      }
    } catch (error) {
      console.error("Error saving hotel configuration:", error);
      toast.error(t("error"), {
        description: t("errorSaving"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <HotelConfigComponent
        initialData={hotelConfig}
        isLoading={isLoading}
        onSave={handleSaveHotelConfig}
      />
    </div>
  );
}
