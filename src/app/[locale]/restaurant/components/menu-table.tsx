"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils/currency";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { MenuItem } from "@/lib/features/restaurant/types";
import { Edit2, Trash2, Plus } from "lucide-react";
import { MenuItemDialog } from "./menu-item-dialog";
import { useAuthenticatedUser } from "@/hooks/use-authenticated-user";

interface MenuTableProps {
  menuItems: MenuItem[];
  onEditItem?: (itemId: string) => void;
  onDeleteItem?: (item: MenuItem) => void;
  onCreateItem?: () => void;
  onRefresh?: () => void;
}

export function MenuTable({
  menuItems,
  // onEditItem,
  onDeleteItem,
  // onCreateItem,
  onRefresh,
}: MenuTableProps) {
  const t = useTranslations("MenuTableComp");
  const { hasRole } = useAuthenticatedUser();
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const handleCreateNew = () => {
    setEditingItem(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDeleteClick = (item: MenuItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      onDeleteItem?.(itemToDelete);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDialogSuccess = () => {
    onRefresh?.();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("title")}</CardTitle>
              <CardDescription>
                {!hasRole("client")
                  ? t("descriptionAdmin")
                  : t("descriptionClient")}
              </CardDescription>
            </div>
            {!hasRole("client") && (
              <Button onClick={handleCreateNew}>
                <Plus className="mr-2 h-4 w-4" />
                {t("newItem")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("category")}</TableHead>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("description")}</TableHead>
                <TableHead>{t("price")}</TableHead>
                <TableHead>{t("prepTime")}</TableHead>
                <TableHead>{t("available")}</TableHead>
                {!hasRole("client") && <TableHead>{t("actions")}</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {item.description}
                  </TableCell>
                  <TableCell>{formatCurrency(item.price)}</TableCell>
                  <TableCell>{item.preparationTime}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        item.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {item.available
                        ? t("availableStatus")
                        : t("notAvailable")}
                    </Badge>
                  </TableCell>
                  {!hasRole("client") && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(item)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {menuItems.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={hasRole("client") ? 6 : 7}
                    className="text-center text-muted-foreground"
                  >
                    {t("noItems")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Menu Item Dialog */}
      {!hasRole("client") && (
        <MenuItemDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          item={editingItem}
          onSuccess={handleDialogSuccess}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {!hasRole("client") && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("deleteItem")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("deleteItemDesc", { name: itemToDelete?.name ?? "" })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                {t("delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
