"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { type Guest } from "@/lib/features/guests/types";
import { guestsService } from "@/lib/features/guests/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { GuestFormDialog } from "./guest-form-dialog";

interface GuestsManagementProps {
  initialGuests: Guest[];
}

export function GuestsManagement({ initialGuests }: GuestsManagementProps) {
  const t = useTranslations("GuestsManagement");
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [search, setSearch] = useState("");

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const filtered = (() => {
    const s = search.trim().toLowerCase();
    if (!s) return guests;
    return guests.filter((g) =>
      [g.name, g.email, g.phone, g.document]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s)),
    );
  })();

  const loadGuests = async () => {
    try {
      setLoading(true);
      const data = await guestsService.getAll();
      setGuests(data);
    } catch (error) {
      console.error("Error loading guests:", error);
      toast.error(t("errorLoadingGuests"));
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingGuest(null);
    setOpenDialog(true);
  };

  const openEdit = (g: Guest) => {
    setEditingGuest(g);
    setOpenDialog(true);
  };

  const handleGuestSaved = (guest: Guest, isEdit: boolean) => {
    if (isEdit) {
      setGuests((prev) => prev.map((g) => (g.id === guest.id ? guest : g)));
      toast.success(t("guestUpdated"));
    } else {
      setGuests((prev) => [guest, ...prev]);
      toast.success(t("guestCreated"));
    }
    setOpenDialog(false);
  };

  const handleDelete = async (g: Guest) => {
    try {
      setLoading(true);
      await guestsService.delete(g.id);
      setGuests((prev) => prev.filter((x) => x.id !== g.id));
      toast.success(t("guestDeleted"));
    } catch (e) {
      console.error("Error deleting guest:", e);
      toast.error(t("error"), { description: t("couldNotDelete") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> {t("newGuest")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("guestList")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 pb-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={loadGuests}>
              {t("refresh")}
            </Button>
          </div>
          {loading ? (
            <div>{t("loading")}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("email")}</TableHead>
                  <TableHead>{t("phone")}</TableHead>
                  <TableHead>{t("document")}</TableHead>
                  <TableHead>{t("vip")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell>#{g.id}</TableCell>
                    <TableCell>{g.name}</TableCell>
                    <TableCell>{g.email}</TableCell>
                    <TableCell>{g.phone ?? "-"}</TableCell>
                    <TableCell>{g.document ?? "-"}</TableCell>
                    <TableCell>{g.vip ? t("yes") : t("no")}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(g)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(g)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <GuestFormDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        editingGuest={editingGuest}
        onGuestSaved={handleGuestSaved}
      />
    </div>
  );
}
