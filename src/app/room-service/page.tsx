import { restaurantApi } from "@/lib/api/restaurant";
import { RoomServiceOrderManagement } from "./components/room-service-order-management";

export default async function RoomServicePage() {
  const [orders, menuItems] = await Promise.all([
    restaurantApi.getRoomServiceOrders().catch(() => []),
    restaurantApi.getMenuItems().catch(() => []),
  ]);

  return (
    <RoomServiceOrderManagement
      initialOrders={orders}
      initialMenuItems={menuItems}
    />
  );
}
