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
import { useTranslations } from "next-intl";

interface VenuesTableProps {
  venues: Venue[];
  onEdit: (venue: Venue) => void;
}

const getAvailabilityBadge = (
  available: boolean,
  t: (key: string) => string,
) => {
  return available ? (
    <Badge className="bg-green-100 text-green-800">
      {t("statusAvailable")}
    </Badge>
  ) : (
    <Badge className="bg-red-100 text-red-800">{t("statusOccupied")}</Badge>
  );
};

export function VenuesTable({ venues, onEdit }: VenuesTableProps) {
  const t = useTranslations("VenuesTable");
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("location")}</TableHead>
            <TableHead>{t("capacity")}</TableHead>
            <TableHead>{t("area")}</TableHead>
            <TableHead>{t("hourlyRate")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {venues.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                {t("noVenues")}
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
                <TableCell>
                  {venue.capacity} {t("people")}
                </TableCell>
                <TableCell>
                  {venue.area} {t("areaUnit")}
                </TableCell>
                <TableCell>
                  ${venue.hourlyRate}/{t("perHour")}
                </TableCell>
                <TableCell>
                  {getAvailabilityBadge(venue.available, t)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(venue)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {t("edit")}
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
