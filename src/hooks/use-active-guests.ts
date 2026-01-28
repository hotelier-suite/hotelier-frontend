import { useState, useEffect } from "react";
import { roomsService } from "@/lib/features/rooms/service";
import { reservationsService } from "@/lib/features/reservations/service";

export interface ActiveGuest {
  id: string;
  name: string;
  email: string;
  roomNumber: string;
  checkOut: string;
}

export function useActiveGuests() {
  const [guests, setGuests] = useState<ActiveGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        // Get rooms and reservations
        const [rooms, reservations] = await Promise.all([
          roomsService.getAll(),
          reservationsService.getAll(),
        ]);

        // Filter active reservations (checked in or confirmed for today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeReservations = reservations.filter((reservation) => {
          const checkIn = new Date(reservation.checkInDate);
          const checkOut = new Date(reservation.checkOutDate);
          checkIn.setHours(0, 0, 0, 0);
          checkOut.setHours(0, 0, 0, 0);

          return (
            (reservation.status === "CHECKED_IN" ||
              reservation.status === "CONFIRMED") &&
            today >= checkIn &&
            today < checkOut
          );
        });

        // Map active reservations to active guests
        const activeGuests = activeReservations.map((reservation) => {
          const room = rooms.find((r) => r.id === reservation.roomId);
          return {
            id: reservation.id.toString(),
            name: reservation.guestName || "No name",
            email: reservation.guestEmail || "Not available",
            roomNumber: room?.number || "Not assigned",
            checkOut: reservation.checkOutDate,
          };
        });

        setGuests(activeGuests);
        setError(null);
      } catch (err) {
        setError("Error loading active guests");
        console.error("Error fetching occupied rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, []);

  return { guests, loading, error };
}
