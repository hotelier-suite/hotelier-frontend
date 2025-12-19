"use client";

import { useState } from "react";
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
import { MenuItem } from "@/lib/api/restaurant";
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
              <CardTitle>Restaurant Menu</CardTitle>
              <CardDescription>
                {!hasRole("client")
                  ? "Menu item management and availability"
                  : "List of available items"}
              </CardDescription>
            </div>
            {!hasRole("client") && (
              <Button onClick={handleCreateNew}>
                <Plus className="mr-2 h-4 w-4" />
                New Item
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Prep. Time</TableHead>
                <TableHead>Available</TableHead>
                {!hasRole("client") && <TableHead>Actions</TableHead>}
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
                  <TableCell>${item.price.toLocaleString()}</TableCell>
                  <TableCell>{item.preparationTime}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        item.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {item.available ? "Available" : "Not Available"}
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
                    No items in the menu
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
              <AlertDialogTitle>Delete menu item?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The item &quot;
                {itemToDelete?.name}&quot; will be permanently deleted from the
                menu.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
