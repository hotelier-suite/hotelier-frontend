"use client";

import {
  DollarSign,
  Bed,
  UserCheck,
  Calendar,
  Wrench,
  Utensils,
} from "lucide-react";
import { StatCard } from "./stat-card";
import { useAuth } from "@/hooks/use-auth";

interface Stat {
  title: string;
  value: string;
  description: string;
  iconName: string;
  color: string;
  roles?: string[]; // Add role filtering
}

interface StatsGridProps {
  stats: Stat[];
}

const iconMap = {
  bed: Bed,
  "dollar-sign": DollarSign,
  "user-check": UserCheck,
  calendar: Calendar,
  wrench: Wrench,
  utensils: Utensils,
} as const;

export function StatsGrid({ stats }: StatsGridProps) {
  const { user } = useAuth();

  // Get user roles for filtering stats display
  const userRoles = user?.roles?.map((r) => r.name) || [];

  // Filter stats based on user roles if role information is provided
  const filteredStats = stats.filter((stat) => {
    if (!stat.roles || stat.roles.length === 0) {
      return true; // Show stats without role restrictions
    }
    return stat.roles.some((role) => userRoles.includes(role));
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {filteredStats.map((stat, index) => {
        const IconComponent =
          iconMap[stat.iconName as keyof typeof iconMap] || Bed;
        return (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={IconComponent}
            iconColor={stat.color}
          />
        );
      })}
    </div>
  );
}
