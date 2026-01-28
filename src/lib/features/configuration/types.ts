// Hotel configuration types
export interface HotelConfig {
  id: number;
  propertyName: string;
  propertyAddress: string;
  propertyPhone: string;
  propertyEmail: string;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  timeZone: string;
}

// API Response type
export interface ConfigResponse<T> {
  value?: T;
  status: string;
  message?: string;
}
