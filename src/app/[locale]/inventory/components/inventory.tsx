"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  InventoryItem,
  InventoryMovement,
  Supplier,
} from "@/lib/features/inventory/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Truck } from "lucide-react";
import { InventoryFilters } from "./inventory-filters";
import { InventoryTable } from "./inventory-table";
import { MovementsHistory } from "./movements-history";
import { SuppliersList } from "./suppliers-list";
import { InventoryAlerts } from "./inventory-alerts";

interface InventoryProps {
  initialItems: InventoryItem[];
  initialMovements: InventoryMovement[];
  initialSuppliers: Supplier[];
}

export function Inventory({
  initialItems,
  initialMovements,
  initialSuppliers,
}: InventoryProps) {
  const t = useTranslations("Inventory");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [inventoryItems, setInventoryItems] =
    useState<InventoryItem[]>(initialItems);
  const [movements, setMovements] =
    useState<InventoryMovement[]>(initialMovements);
  const [suppliers] = useState<Supplier[]>(initialSuppliers);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    minimumStock: "",
    maximumStock: "",
    unit: "",
    unitCost: "",
    supplier: "",
    location: "",
  });

  const [newMovement, setNewMovement] = useState({
    type: "",
    item: "",
    quantity: "",
    reason: "",
  });

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    if (newItem.name && newItem.category) {
      const item = {
        id: `INV${String(inventoryItems.length + 1).padStart(3, "0")}`,
        name: newItem.name,
        category: newItem.category,
        currentStock: 0,
        minimumStock: Number.parseInt(newItem.minimumStock) || 0,
        maximumStock: Number.parseInt(newItem.maximumStock) || 0,
        unit: newItem.unit,
        unitCost: Number.parseInt(newItem.unitCost) || 0,
        totalValue: 0,
        supplier: newItem.supplier,
        location: newItem.location,
        lastPurchaseDate: new Date().toISOString().split("T")[0],
        status: "out_of_stock" as const,
      };
      setInventoryItems([...inventoryItems, item]);
      setNewItem({
        name: "",
        category: "",
        minimumStock: "",
        maximumStock: "",
        unit: "",
        unitCost: "",
        supplier: "",
        location: "",
      });
    }
  };

  const handleAddMovement = () => {
    if (newMovement.type && newMovement.item && newMovement.quantity) {
      const movement = {
        id: `MOV${String(movements.length + 1).padStart(3, "0")}`,
        type: newMovement.type as "inbound" | "outbound",
        item: newMovement.item,
        quantity: Number.parseInt(newMovement.quantity),
        date: new Date().toISOString().split("T")[0],
        user: t("currentUser"),
        reason: newMovement.reason,
      };
      setMovements([movement, ...movements]);

      setInventoryItems(
        inventoryItems.map((item) => {
          if (item.name === newMovement.item) {
            const newStock =
              newMovement.type === "inbound"
                ? item.currentStock + Number.parseInt(newMovement.quantity)
                : item.currentStock - Number.parseInt(newMovement.quantity);

            let newStatus:
              | "available"
              | "low_stock"
              | "critical"
              | "out_of_stock" = "available";
            if (newStock <= 0) newStatus = "out_of_stock";
            else if (newStock <= item.minimumStock) newStatus = "low_stock";
            else if (newStock <= item.minimumStock * 1.5)
              newStatus = "critical";

            return {
              ...item,
              currentStock: Math.max(0, newStock),
              status: newStatus,
            };
          }
          return item;
        }),
      );

      setNewMovement({
        type: "",
        item: "",
        quantity: "",
        reason: "",
      });
    }
  };

  const handleReorder = (itemId: string) => {
    const item = inventoryItems.find((i) => i.id === itemId);
    if (item) {
      const reorderQuantity = item.maximumStock - item.currentStock;
      const movement = {
        id: `MOV${String(movements.length + 1).padStart(3, "0")}`,
        type: "inbound" as const,
        item: item.name,
        quantity: reorderQuantity,
        date: new Date().toISOString().split("T")[0],
        user: t("automaticSystem"),
        reason: t("automaticReplenishment"),
      };
      setMovements([movement, ...movements]);

      setInventoryItems(
        inventoryItems.map((i) =>
          i.id === itemId
            ? {
                ...i,
                currentStock: i.maximumStock,
                status: "available" as const,
              }
            : i,
        ),
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Truck className="mr-2 h-4 w-4" />
                {t("newMovement")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("registerMovement")}</DialogTitle>
                <DialogDescription>
                  {t("registerEntryOrExit")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="movementType">{t("movementType")}</Label>
                    <Select
                      value={newMovement.type}
                      onValueChange={(value) =>
                        setNewMovement({ ...newMovement, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectType")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inbound">{t("entry")}</SelectItem>
                        <SelectItem value="outbound">{t("exit")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item">{t("item")}</Label>
                    <Select
                      value={newMovement.item}
                      onValueChange={(value) =>
                        setNewMovement({ ...newMovement, item: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectItem")} />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryItems.map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">{t("quantity")}</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newMovement.quantity}
                      onChange={(e) =>
                        setNewMovement({
                          ...newMovement,
                          quantity: e.target.value,
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">{t("reason")}</Label>
                  <Textarea
                    id="reason"
                    value={newMovement.reason}
                    onChange={(e) =>
                      setNewMovement({ ...newMovement, reason: e.target.value })
                    }
                    placeholder={t("reasonPlaceholder")}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">{t("cancel")}</Button>
                  <Button onClick={handleAddMovement}>
                    {t("registerMovement")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("newItem")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t("newInventoryItem")}</DialogTitle>
                <DialogDescription>{t("addNewProduct")}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">{t("productName")}</Label>
                    <Input
                      id="productName"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      placeholder={t("productNamePlaceholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">{t("category")}</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) =>
                        setNewItem({ ...newItem, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCategory")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Linens">{t("linens")}</SelectItem>
                        <SelectItem value="Amenities">
                          {t("amenities")}
                        </SelectItem>
                        <SelectItem value="Housekeeping">
                          {t("housekeeping")}
                        </SelectItem>
                        <SelectItem value="Maintenance">
                          {t("maintenance")}
                        </SelectItem>
                        <SelectItem value="Office">{t("office")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stockMinimo">{t("minimumStock")}</Label>
                    <Input
                      id="stockMinimo"
                      type="number"
                      value={newItem.minimumStock}
                      onChange={(e) =>
                        setNewItem({ ...newItem, minimumStock: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stockMaximo">{t("maximumStock")}</Label>
                    <Input
                      id="stockMaximo"
                      type="number"
                      value={newItem.maximumStock}
                      onChange={(e) =>
                        setNewItem({ ...newItem, maximumStock: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unidad">{t("unit")}</Label>
                    <Input
                      id="unidad"
                      value={newItem.unit}
                      onChange={(e) =>
                        setNewItem({ ...newItem, unit: e.target.value })
                      }
                      placeholder={t("unitPlaceholder")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="costoUnitario">{t("unitCost")}</Label>
                    <Input
                      id="costoUnitario"
                      type="number"
                      value={newItem.unitCost}
                      onChange={(e) =>
                        setNewItem({ ...newItem, unitCost: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">{t("supplier")}</Label>
                    <Select
                      value={newItem.supplier}
                      onValueChange={(value) =>
                        setNewItem({ ...newItem, supplier: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectSupplier")} />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.name}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">{t("warehouseLocation")}</Label>
                  <Input
                    id="location"
                    value={newItem.location}
                    onChange={(e) =>
                      setNewItem({ ...newItem, location: e.target.value })
                    }
                    placeholder={t("warehousePlaceholder")}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">{t("cancel")}</Button>
                  <Button onClick={handleAddItem}>{t("createItem")}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">{t("inventory")}</TabsTrigger>
          <TabsTrigger value="movements">{t("movements")}</TabsTrigger>
          <TabsTrigger value="suppliers">{t("suppliers")}</TabsTrigger>
          <TabsTrigger value="alerts">{t("alerts")}</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <InventoryFilters
            searchTerm={searchTerm}
            categoryFilter={categoryFilter}
            onSearchChange={setSearchTerm}
            onCategoryChange={setCategoryFilter}
          />
          <InventoryTable items={filteredItems} onReorder={handleReorder} />
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <MovementsHistory movements={movements} />
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <SuppliersList suppliers={suppliers} />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <InventoryAlerts items={inventoryItems} onReorder={handleReorder} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
