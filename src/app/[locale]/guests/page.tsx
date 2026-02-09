"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { type Guest } from "@/lib/features/guests/types";
import { guestsService } from "@/lib/features/guests/service";
import { GuestsManagement } from "./components/guests-management";

export default function GuestsPage() {
  const t = useTranslations("GuestsPage");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const guestsData = await guestsService.getAll();
        setGuests(guestsData);
      } catch (error) {
        console.error("Error fetching guests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("loadingGuestData")}</p>
        </div>
        <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
      </div>
    );
  }

  return <GuestsManagement initialGuests={guests} />;
}
