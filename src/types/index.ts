import type { ImagePlaceholder } from "@/lib/placeholder-images";

export interface Category {
  id: string;
  name: 'High-end' | 'Budget' | 'Mid-range';
  slug: string;
}
export interface Ktv {
  id: string;
  name: string;
  address: string;
  district: 'District 1' | 'District 3' | 'District 5' | 'District 7' | 'Phu Nhuan';
  categoryId: string;
  description: string;
  priceRange: string;
  hours: string;
  contact: {
    phone: string;
  };
   // The following properties are now optional or removed as they are no longer used in the admin UI
  services?: string[];
  rooms?: { type: string; capacity: string; price: string; }[];
  menu?: { category: string; items: { name: string; price: string; }[]; }[];
  paymentMethods?: {
    method: string;
    details?: string;
  }[];
  numberOfRooms?: number;
  mapUrl?: string;
  cardImage?: ImagePlaceholder;
  gallery?: ImagePlaceholder[];
  reviews?: { author: string; comment: string; rating: number }[];
}

export interface Booking {
  id: string;
  customerName: string;
  ktvId: string;
  ktvName: string;
  roomType: string;
  bookingDate: string;
  bookingTime: string;
  status: 'Confirmed' | 'Pending' | 'Canceled';
}
