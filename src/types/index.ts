import type { ImagePlaceholder } from "@/lib/placeholder-images";

export interface Ktv {
  id: string;
  name: string;
  address: string;
  district: 'District 1' | 'District 3' | 'District 5' | 'District 7' | 'Phu Nhuan';
  type: 'High-end' | 'Budget' | 'Mid-range';
  services: string[];
  priceRange: string;
  hours: string;
  numberOfRooms: number;
  contact: string;
  mapUrl: string;
  cardImage: ImagePlaceholder;
  gallery: ImagePlaceholder[];
  reviews: { author: string; comment: string; rating: number }[];
}

export interface Article {
  slug: string;
  title: string;
  author: string;
  publishedDate: string;
  excerpt: string;
  content: string;
  image: ImagePlaceholder;
}
