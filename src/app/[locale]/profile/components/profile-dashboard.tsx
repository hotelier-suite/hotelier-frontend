"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { PersonalInfoForm } from "./personal-info-form";
import { usersService } from "@/lib/features/users/service";

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  bio?: string;
}

interface ProfileDashboardProps {
  initialProfileData: ProfileData;
}

export default function ProfileDashboard({
  initialProfileData,
}: ProfileDashboardProps) {
  const t = useTranslations("ProfileDashboardComp");
  const { user, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (validatedData: ProfileData) => {
    if (!user?.id) {
      toast.error(t("error"), {
        description: t("userIdNotFound"),
      });
      return;
    }

    try {
      setIsSaving(true);
      // Persist to backend
      const preferences = {
        address: validatedData.address || "",
        birthDate: validatedData.birthDate || "",
        bio: validatedData.bio || "",
      };

      await usersService.update(user.id, {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || "",
        preferences: JSON.stringify(preferences),
      });

      // Update local auth state/cookies
      updateUser({
        name: validatedData.name,
        email: validatedData.email,
      });

      toast(t("profileUpdated"), {
        description: t("changesSaved"),
      });
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      toast.error(t("error"), {
        description: t("couldNotUpdateProfile"),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PersonalInfoForm
        initialData={initialProfileData}
        isSaving={isSaving}
        onSave={handleSave}
      />
    </div>
  );
}
