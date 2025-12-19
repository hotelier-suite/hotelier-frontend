"use client";

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
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "clean":
        return <Badge className="bg-green-100 text-green-800">Clean</Badge>;
      case "dirty":
        return <Badge className="bg-red-100 text-red-800">Dirty</Badge>;
      case "cleaning":
        return <Badge className="bg-blue-100 text-blue-800">Being Cleaned</Badge>;
      case "maintenance":
        return (
          <Badge className="bg-orange-100 text-orange-800">Maintenance</Badge>
        );
      case "occupied":
        return <Badge className="bg-purple-100 text-purple-800">Occupied</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Status</CardTitle>
        <CardDescription>
          Real-time cleaning status control
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Cleaning</TableHead>
              <TableHead>Next Guest</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.number}>
                <TableCell className="font-medium">{room.number}</TableCell>
                <TableCell>{room.type}</TableCell>
                <TableCell>
                  {getStatusBadge(room.available ? "clean" : "occupied")}
                </TableCell>
                <TableCell>{room.lastCleaning || "Today 14:00"}</TableCell>
                <TableCell>{room.nextGuest || "-"}</TableCell>
                <TableCell>{room.assignedEmployee || "Not assigned"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {!room.available && (
                      <Button
                        size="sm"
                        onClick={() => onStartCleaning(room.number)}
                      >
                        <Bed className="mr-2 h-4 w-4" />
                        Start Cleaning
                      </Button>
                    )}
                    {room.available && (
                      <Badge className="bg-green-100 text-green-800">
                        Ready
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
