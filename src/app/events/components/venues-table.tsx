import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, MapPin } from "lucide-react";
import type { Venue } from "@/lib/features/venues/types";

interface VenuesTableProps {
  venues: Venue[];
  onEdit: (venue: Venue) => void;
}

const getAvailabilityBadge = (available: boolean) => {
  return available ? (
    <Badge className="bg-green-100 text-green-800">Available</Badge>
  ) : (
    <Badge className="bg-red-100 text-red-800">Occupied</Badge>
  );
};

export function VenuesTable({ venues, onEdit }: VenuesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Area</TableHead>
            <TableHead>Hourly Rate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {venues.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                No venues registered
              </TableCell>
            </TableRow>
          ) : (
            venues.map((venue) => (
              <TableRow key={venue.id}>
                <TableCell className="font-medium">
                  {venue.name}
                  {venue.description && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {venue.description}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {venue.location}
                  </div>
                </TableCell>
                <TableCell>{venue.capacity} people</TableCell>
                <TableCell>{venue.area} m²</TableCell>
                <TableCell>${venue.hourlyRate}</TableCell>
                <TableCell>{getAvailabilityBadge(venue.available)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(venue)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
