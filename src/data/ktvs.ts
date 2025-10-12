import type { Ktv } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)!;

export const initialKtvs: Ktv[] = [
  {
    id: 'kingdom-ktv',
    name: 'Kingdom KTV',
    address: '28-34 Pasteur, District 1',
    district: 'District 1',
    categoryId: 'cat-1',
    description: 'A luxurious KTV experience with state-of-the-art sound systems.',
    priceRange: 'VND 2,000,000 - 5,000,000',
    hours: '2:00 PM - 2:00 AM',
    contact: { phone: '028 3823 8888' },
    cardImage: getImage('ktv-card-1'),
    gallery: [getImage('ktv-hero-1'), getImage('ktv-gallery-1-1'), getImage('ktv-gallery-1-2')],
    reviews: [],
    numberOfRooms: 20
  },
  {
    id: 'nnice-ktv',
    name: 'Nnice KTV',
    address: '231 Le Van Sy, Phu Nhuan',
    district: 'Phu Nhuan',
    categoryId: 'cat-2',
    description: 'A popular choice for students and young adults.',
    priceRange: 'VND 500,000 - 1,500,000',
    hours: '1:00 PM - 12:00 AM',
    contact: { phone: '028 3991 7566' },
    cardImage: getImage('ktv-card-2'),
    gallery: [],
    reviews: [],
    numberOfRooms: 30
  },
  {
    id: 'icool-ktv',
    name: 'ICOOL KTV',
    address: '123 Vo Van Tan, District 3',
    district: 'District 3',
    categoryId: 'cat-2',
    description: 'Modern and clean rooms with a wide song selection.',
    priceRange: 'VND 800,000 - 2,000,000',
    hours: '10:00 AM - 1:00 AM',
    contact: { phone: '1900 779 936' },
    cardImage: getImage('ktv-card-3'),
    gallery: [],
    reviews: [],
    numberOfRooms: 25
  },
  {
    id: 'catwalk-ktv',
    name: 'Catwalk KTV',
    address: '4A Ton Duc Thang, District 1',
    district: 'District 1',
    categoryId: 'cat-1',
    description: 'The place to see and be seen. Very high-end.',
    priceRange: 'VND 3,000,000 - 10,000,000',
    hours: '6:00 PM - 3:00 AM',
    contact: { phone: '028 3824 6777' },
    cardImage: getImage('ktv-card-4'),
    gallery: [],
    reviews: [],
    numberOfRooms: 15
  },
];
