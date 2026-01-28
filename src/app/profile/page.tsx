"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/auth-context";
import ProfileDashboard from "./components/profile-dashboard";
import { type UserResponseDto } from "@/lib/features/users/types";
import { usersService } from "@/lib/features/users/service";
import { authService } from "@/lib/features/auth/service";
import { useRouter } from "next/navigation";

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  bio?: string;
}

interface UserPreferences {
  address?: string;
  birthDate?: string;
  bio?: string;
}

function safeParsePrefs(prefs?: string | null): UserPreferences {
  if (!prefs) return {};
  try {
    return JSON.parse(prefs) as UserPreferences;
  } catch {
    return {};
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setError("Authentication required");
      setLoading(false);
      router.replace("/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // Try full profile (requires users:read)
        const me: UserResponseDto = await usersService.getMyProfile();
        const prefs = safeParsePrefs(me.preferences);
        const data: ProfileData = {
          name: me.name || "",
          email: me.email || "",
          phone: me.phone || "",
          address: prefs.address || "",
          birthDate: prefs.birthDate || "",
          bio: prefs.bio || "",
        };
        setProfileData(data);
        setError(null);
      } catch {
        // Fallback for users without users:read permission
        try {
          const authMe = await authService.getCurrentUser();
          const fallbackData: ProfileData = {
            name: authMe.name || "",
            email: authMe.email || "",
            phone: authMe.phone || "",
            address: "",
            birthDate: "",
            bio: "",
          };
          setProfileData(fallbackData);
          setError(null);
        } catch (e) {
          if (
            e instanceof Error &&
            e.message?.toLowerCase().includes("authentication required")
          ) {
            await logout();
            return;
          }
          console.error("Error fetching profile:", e);
          setError("Error loading profile data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, authLoading, router, logout]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">No profile data available</p>
        </div>
      </div>
    );
  }

  return <ProfileDashboard initialProfileData={profileData} />;
}
