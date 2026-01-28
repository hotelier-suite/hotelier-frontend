"use client";

import { useState } from "react";
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
  const { user, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (validatedData: ProfileData) => {
    if (!user?.id) {
      toast.error("Error", {
        description: "User ID not found. Please log in again.",
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

      toast("Profile updated", {
        description: "Changes have been saved successfully.",
      });
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Could not update profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and account settings
          </p>
        </div>
      </div>

      <PersonalInfoForm
        initialData={initialProfileData}
        userAvatar={user?.avatar}
        isSaving={isSaving}
        onSave={handleSave}
      />
    </div>
  );
}
