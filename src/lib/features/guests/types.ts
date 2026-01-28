// Guest types

export interface Guest {
  id: number;
  name: string;
  email: string;
  phone?: string;
  document?: string;
  address?: string;
  nationality?: string;
  birthDate?: string;
  preferences?: string;
  vip: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateGuestDto = Omit<
  Guest,
  "id" | "createdAt" | "updatedAt" | "vip"
> & {
  vip?: boolean;
};

export type UpdateGuestDto = Partial<CreateGuestDto>;

export interface ActiveGuest extends Guest {
  roomNumber?: string;
  checkIn: string;
  checkOut: string;
}
