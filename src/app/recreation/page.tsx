"use client";

import { useState, useEffect } from "react";
import { Dumbbell, Calendar, BarChart3, Plus, Search } from "lucide-react";
import { useAuthContext } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  recreationalApi,
  type RecreationalFacility,
  type RecreationalBooking,
} from "@/lib/api/recreational";
import { FacilitiesManagement } from "./components/facilities-management";
import { BookingsManagement } from "./components/bookings-management";
import { RecreationalStats } from "./components/recreational-stats";
import { QuickBookingDialog } from "./components/quick-booking-dialog";
import { FacilityDialog } from "./components/facility-dialog";

export default function RecreationPage() {
  const { hasRole } = useAuthContext();
  const [facilities, setFacilities] = useState<RecreationalFacility[]>([]);
  const [bookings, setBookings] = useState<RecreationalBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showQuickBooking, setShowQuickBooking] = useState(false);
  const [showFacilityDialog, setShowFacilityDialog] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [facilitiesData, bookingsData] = await Promise.all([
          recreationalApi.getFacilities(),
          recreationalApi.getBookings(),
        ]);
        setFacilities(facilitiesData);
        setBookings(bookingsData);
      } catch (error) {
        console.error("Error loading recreational data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter facilities based on search
  const filteredFacilities = facilities.filter(
    (facility) =>
      facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Quick stats
  const availableFacilities = facilities.filter(
    (f) => f.status === "AVAILABLE",
  ).length;
  const totalBookingsToday = bookings.filter((b) => {
    const today = new Date().toISOString().split("T")[0];
    return b.bookingDate === today;
  }).length;
  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Recreational Facilities
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Recreational Facilities
        </h2>
        <div className="flex items-center space-x-2">
          {/* Only show button if user has client role */}
          {hasRole("client") && (
            <Button onClick={() => setShowQuickBooking(true)}>
              <Calendar className="mr-2 h-4 w-4" />
              Quick Booking
            </Button>
          )}
          {!hasRole("client") && (
            <Button onClick={() => setShowFacilityDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Facility
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Facilities
            </CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableFacilities}</div>
            <p className="text-xs text-muted-foreground">
              of {facilities.length} facilities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookingsToday}</div>
            <p className="text-xs text-muted-foreground">
              scheduled bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookings}</div>
            <p className="text-xs text-muted-foregreen">
              require confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Occupancy
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73%</div>
            <p className="text-xs text-muted-foreground">last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search facilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Overview: Quick facility grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFacilities.map((facility) => (
              <Card
                key={facility.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{facility.name}</CardTitle>
                    <Badge
                      variant={
                        facility.status === "AVAILABLE"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        facility.status === "AVAILABLE"
                          ? "bg-green-500"
                          : facility.status === "OCCUPIED"
                            ? "bg-blue-500"
                            : facility.status === "MAINTENANCE"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                      }
                    >
                      {facility.status === "AVAILABLE" && "Available"}
                      {facility.status === "OCCUPIED" && "Occupied"}
                      {facility.status === "MAINTENANCE" && "Maintenance"}
                      {facility.status === "OUT_OF_ORDER" &&
                        "Out of Service"}
                      {facility.status === "RESERVED" && "Reserved"}
                      {facility.status === "CLEANING" && "Cleaning"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {facility.location}
                  </p>
                  <p className="text-sm mb-2">{facility.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span>Capacity: {facility.capacity}</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span>
                      {facility.openingTime} - {facility.closingTime}
                    </span>
                    <span>{facility.type.replace(/_/g, " ")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="facilities">
          <FacilitiesManagement
            facilities={facilities}
            onFacilitiesChange={setFacilities}
          />
        </TabsContent>

        <TabsContent value="bookings">
          <BookingsManagement
            bookings={bookings}
            facilities={facilities}
            onBookingsChange={setBookings}
          />
        </TabsContent>

        <TabsContent value="statistics">
          <RecreationalStats />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <QuickBookingDialog
        open={showQuickBooking}
        onOpenChange={setShowQuickBooking}
        facilities={facilities.filter((f) => f.status === "AVAILABLE")}
        onBookingCreated={(booking: RecreationalBooking) => {
          setBookings((prev) => [...prev, booking]);
          setShowQuickBooking(false);
        }}
      />

      <FacilityDialog
        open={showFacilityDialog}
        onOpenChange={setShowFacilityDialog}
        onFacilityCreated={(facility: RecreationalFacility) => {
          setFacilities((prev) => [...prev, facility]);
          setShowFacilityDialog(false);
        }}
      />
    </div>
  );
}
