
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface KtvImage {
  ktv_id: string;
  image_id: string;
  is_main: boolean;
  order_index: number;
  created_at: string;
  imageUrl?: string;
}

export interface Ktv {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  price: string;
  hours: string;
  contact?: string;
  description?: string | { summary?: string; features?: string[] }; // Support both string and object
  is_active?: boolean;
  isActive?: boolean; // Legacy support
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  categoryIds?: string[]; // Legacy support
}

export interface KtvWithImages extends Ktv {
  images: KtvImage[] | string[]; // Support both types
  main_image_url?: string; // Computed field, not stored in database
}

export interface KtvWithCategories extends Ktv {
  categories: Category[];
}

export interface KtvCategory {
  ktv_id: string;
  category_id: string;
  created_at: string;
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
