"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, Users, Car, FileText } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      icon: CalendarDays,
      label: "New Reservation",
      color: "text-blue-600 dark:text-blue-400",
      href: "/reservations",
    },
    {
      icon: Users,
      label: "Quick Check-in",
      color: "text-green-600 dark:text-green-400",
      href: "/reservations",
    },
    {
      icon: Car,
      label: "Parking",
      color: "text-orange-600 dark:text-orange-400",
      href: "/parking",
    },
    {
      icon: FileText,
      label: "Generate Report",
      color: "text-purple-600 dark:text-purple-400",
      href: "/reports",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Direct access to main features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {actions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent hover:border-primary transition-colors"
            >
              <action.icon
                className={`h-5 w-5 ${action.color} flex-shrink-0`}
              />
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
