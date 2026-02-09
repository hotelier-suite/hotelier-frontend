"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bed } from "lucide-react";

interface Room {
  id: string;
  number: string;
  type: string;
  available: boolean;
  status: string;
  lastCleaning?: string;
  nextGuest?: string;
  assignedEmployee?: string;
}

interface RoomStatusManagementProps {
  rooms: Room[];
  onStartCleaning: (roomNumber: string) => void;
}

export default function RoomStatusManagement({
  rooms,
  onStartCleaning,
}: RoomStatusManagementProps) {
  const t = useTranslations("RoomStatusManagement");
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "clean":
        return (
          <Badge className="bg-green-100 text-green-800">
            {t("statusClean")}
          </Badge>
        );
      case "dirty":
        return (
          <Badge className="bg-red-100 text-red-800">{t("statusDirty")}</Badge>
        );
      case "cleaning":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            {t("statusBeingCleaned")}
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            {t("statusMaintenance")}
          </Badge>
        );
      case "occupied":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            {t("statusOccupied")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("room")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("lastCleaning")}</TableHead>
              <TableHead>{t("nextGuest")}</TableHead>
              <TableHead>{t("employee")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.number}>
                <TableCell className="font-medium">{room.number}</TableCell>
                <TableCell>{t(`roomTypes.${room.type}`)}</TableCell>
                <TableCell>
                  {getStatusBadge(room.available ? "clean" : "occupied")}
                </TableCell>
                <TableCell>{room.lastCleaning || t("noRecord")}</TableCell>
                <TableCell>{room.nextGuest || "-"}</TableCell>
                <TableCell>
                  {room.assignedEmployee || t("notAssigned")}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {!room.available && (
                      <Button
                        size="sm"
                        onClick={() => onStartCleaning(room.number)}
                      >
                        <Bed className="mr-2 h-4 w-4" />
                        {t("startCleaning")}
                      </Button>
                    )}
                    {room.available && (
                      <Badge className="bg-green-100 text-green-800">
                        {t("ready")}
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
