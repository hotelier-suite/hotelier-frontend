import { restaurantService } from "@/lib/features/restaurant/service";
import { RoomServiceOrderManagement } from "./components/room-service-order-management";

export default async function RoomServicePage() {
  const [orders, menuItems] = await Promise.all([
    restaurantService.getRoomServiceOrders().catch(() => []),
    restaurantService.getMenuItems().catch(() => []),
  ]);

  return (
    <RoomServiceOrderManagement
      initialOrders={orders}
      initialMenuItems={menuItems}
    />
  );
}
