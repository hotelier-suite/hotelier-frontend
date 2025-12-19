// Translations for inventory module

export const inventoryCategoryTranslations = {
  // Main categories
  CLEANING_SUPPLIES: "Cleaning Supplies",
  LINENS: "Linens",
  AMENITIES: "Amenities",
  ELECTRONICS: "Electronics",
  MAINTENANCE: "Maintenance",
  HOUSEKEEPING: "Housekeeping",
  FOOD_BEVERAGE: "Food & Beverage",
  OFFICE: "Office",
  SECURITY: "Security",
  GUEST_SUPPLIES: "Guest Supplies",

  // Additional subcategories
  BATHROOM_SUPPLIES: "Bathroom Supplies",
  BEDROOM_SUPPLIES: "Bedroom Supplies",
  CLEANING_EQUIPMENT: "Cleaning Equipment",
  LAUNDRY_SUPPLIES: "Laundry Supplies",
  GUEST_AMENITIES: "Guest Amenities",
  ROOM_AMENITIES: "Room Amenities",
  BATH_AMENITIES: "Bath Amenities",
  TECHNOLOGY: "Technology",
  FURNITURE: "Furniture",
  TEXTILE: "Textile",
  CHEMICAL: "Chemicals",
  TOOLS: "Tools",
  SAFETY: "Safety",
} as const;

export const inventoryStatusTranslations = {
  AVAILABLE: "Available",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
  DISCONTINUED: "Discontinued",
  ORDERED: "Ordered",
  RESERVED: "Reserved",
} as const;

export const movementTypeTranslations = {
  IN: "In",
  OUT: "Out",
  ADJUSTMENT: "Adjustment",
  TRANSFER: "Transfer",
  RETURN: "Return",
  LOSS: "Loss",
  DAMAGE: "Damage",
} as const;

export const unitTranslations = {
  bottles: "bottles",
  pieces: "pieces",
  bars: "bars",
  units: "units",
  boxes: "boxes",
  packs: "packs",
  rolls: "rolls",
  liters: "liters",
  kilograms: "kilograms",
  grams: "grams",
  meters: "meters",
  pairs: "pairs",
  sets: "sets",
  items: "items",
} as const;
