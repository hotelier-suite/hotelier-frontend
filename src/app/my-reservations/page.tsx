"use client";

import { useState } from "react";
import { MyReservationsManagement } from "./components/my-reservations-management";

export default function MyReservationsPage() {
  const [loading] = useState(false);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Reservations</h1>
          <p className="text-muted-foreground">Loading reservations...</p>
        </div>
        <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <MyReservationsManagement />
    </div>
  );
}
