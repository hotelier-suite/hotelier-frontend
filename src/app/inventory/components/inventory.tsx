"use client";

import { useState } from "react";
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
        user: "Current User",
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
        user: "Automatic System",
        reason: "Automatic replenishment",
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
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Control of supplies, products and suppliers
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Truck className="mr-2 h-4 w-4" />
                New Movement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register Movement</DialogTitle>
                <DialogDescription>
                  Register inventory entry or exit
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="movementType">Movement Type</Label>
                    <Select
                      value={newMovement.type}
                      onValueChange={(value) =>
                        setNewMovement({ ...newMovement, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inbound">Entry</SelectItem>
                        <SelectItem value="outbound">Exit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item">Item</Label>
                    <Select
                      value={newMovement.item}
                      onValueChange={(value) =>
                        setNewMovement({ ...newMovement, item: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
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
                    <Label htmlFor="quantity">Quantity</Label>
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
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    value={newMovement.reason}
                    onChange={(e) =>
                      setNewMovement({ ...newMovement, reason: e.target.value })
                    }
                    placeholder="Reason for movement..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleAddMovement}>Register Movement</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>New Inventory Item</DialogTitle>
                <DialogDescription>
                  Add a new product to the inventory
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      placeholder="Product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) =>
                        setNewItem({ ...newItem, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Linens">Linens</SelectItem>
                        <SelectItem value="Amenities">Amenities</SelectItem>
                        <SelectItem value="Housekeeping">
                          Housekeeping
                        </SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stockMinimo">Minimum Stock</Label>
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
                    <Label htmlFor="stockMaximo">Maximum Stock</Label>
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
                    <Label htmlFor="unidad">Unit</Label>
                    <Input
                      id="unidad"
                      value={newItem.unit}
                      onChange={(e) =>
                        setNewItem({ ...newItem, unit: e.target.value })
                      }
                      placeholder="units, liters, kg..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="costoUnitario">Unit Cost</Label>
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
                    <Label htmlFor="supplier">Supplier</Label>
                    <Select
                      value={newItem.supplier}
                      onValueChange={(value) =>
                        setNewItem({ ...newItem, supplier: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
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
                  <Label htmlFor="location">Warehouse Location</Label>
                  <Input
                    id="location"
                    value={newItem.location}
                    onChange={(e) =>
                      setNewItem({ ...newItem, location: e.target.value })
                    }
                    placeholder="e.g., Warehouse A-1"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleAddItem}>Create Item</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
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
