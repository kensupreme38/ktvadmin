
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface KtvDescription {
  summary?: string;
  features?: string[];
}
export interface Ktv {
  id: string;
  slug: string;
  name: string;
  mainImageUrl?: string;
  images?: string[];
  address: string;
  city: string;
  country: string;
  phone: string;
  categoryIds: string[];
  price: string;
  hours: string;
  contact?: string;
  description: KtvDescription;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'User';
  status: 'Active' | 'Inactive';
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
