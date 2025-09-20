import type { Ktv } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)!;

export const allKtvs: Ktv[] = [
  {
    id: 'kingdom-ktv',
    name: 'Kingdom KTV',
    address: '67-69 Pham Viet Chanh, Ward 19, Binh Thanh',
    district: 'District 1',
    type: 'High-end',
    description: 'Kingdom KTV offers a luxurious and royal karaoke experience. With state-of-the-art sound systems and opulent decor, it\'s the perfect venue for special celebrations and corporate events. Our attentive staff ensures a memorable night for all guests.',
    services: ['Private Rooms', 'VIP Service', 'Full Bar', 'Modern Sound System'],
    priceRange: 'VND 1,000,000 - 3,000,000 / hour',
    hours: '2:00 PM - 2:00 AM',
    numberOfRooms: 30,
    contact: {
      phone: '028 3840 8333',
      whatsapp: '+84 79 491 5205',
      wechat: 'TTking789',
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.319243350993!2d106.704153314749!3d10.78683599231454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f491b29a039%3A0x6d93a6f1de0a5a5c!2sKingdom%20KTV!5e0!3m2!1sen!2sus!4v1678886666666',
    cardImage: getImage('ktv-card-1'),
    gallery: [
      getImage('ktv-hero-1'),
      getImage('ktv-gallery-1-1'),
      getImage('ktv-gallery-1-2'),
      getImage('ktv-gallery-1-3'),
      getImage('ktv-gallery-1-4'),
    ],
    reviews: [
      { author: 'Anh Tuan', comment: 'Amazing sound system and very luxurious rooms. A bit pricey but worth it for special occasions.', rating: 5 },
      { author: 'Linh Pham', comment: 'Service was top-notch. The staff were very attentive. Great song selection!', rating: 5 },
      { author: 'Minh Le', comment: 'Good place for business meetings. The VIP rooms are very private and well-equipped.', rating: 4 },
    ],
    rooms: [
        { type: 'Standard Room', capacity: 'Up to 10 people', price: 'VND 1,000,000 / hour' },
        { type: 'VIP Room', capacity: 'Up to 20 people', price: 'VND 2,000,000 / hour' },
        { type: 'Royal Suite', capacity: 'Up to 30 people', price: 'VND 3,000,000 / hour' }
    ],
    menu: [
        { category: 'Beers', items: [{name: 'Heineken', price: 'VND 80,000'}, {name: 'Tiger', price: 'VND 70,000'}] },
        { category: 'Spirits', items: [{name: 'Chivas 18', price: 'VND 3,500,000 / bottle'}, {name: 'Macallan 12', price: 'VND 4,000,000 / bottle'}] },
        { category: 'Snacks', items: [{name: 'French Fries', price: 'VND 150,000'}, {name: 'Fruit Platter', price: 'VND 500,000'}] }
    ],
    paymentMethods: [
      { method: 'Credit Card', details: '附加费 3%' },
      { method: 'WeChat Pay' },
      { method: 'Alipay' },
    ]
  },
  {
    id: 'nnice-ktv',
    name: 'Nnice KTV',
    address: '231 Le Van Sy, Ward 13, Phu Nhuan',
    district: 'Phu Nhuan',
    type: 'Mid-range',
    description: 'Nnice KTV is a popular chain known for its clean facilities and reasonable prices. It\'s a reliable choice for casual gatherings with friends and family, offering a wide selection of songs in a comfortable environment.',
    services: ['Private Rooms', 'Snacks & Drinks', 'Family Friendly'],
    priceRange: 'VND 300,000 - 600,000 / hour',
    hours: '10:00 AM - 12:00 AM',
    numberOfRooms: 50,
    contact: {
      phone: '028 3991 7579',
      whatsapp: '+84 79 491 5205',
      wechat: 'TTking789',
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.106526154562!2d106.6791993147492!3d10.8031389923026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752936a75f2849%3A0x8e8b2b737ef854e4!2sNnice%20Karaoke!5e0!3m2!1sen!2sus!4v1678886777777',
    cardImage: getImage('ktv-card-2'),
    gallery: [getImage('ktv-card-2'), getImage('ktv-gallery-1-1'), getImage('ktv-gallery-1-2')],
    reviews: [
      { author: 'Bao Tran', comment: 'A reliable choice for a casual night out. The prices are reasonable and the rooms are clean.', rating: 4 },
      { author: 'Thuy Nguyen', comment: 'Good for large groups and families. They have a decent selection of new songs.', rating: 4 },
    ],
    rooms: [
        { type: 'Small Room', capacity: 'Up to 8 people', price: 'VND 300,000 / hour' },
        { type: 'Medium Room', capacity: 'Up to 15 people', price: 'VND 450,000 / hour' },
        { type: 'Large Room', capacity: 'Up to 25 people', price: 'VND 600,000 / hour' }
    ],
    menu: [
        { category: 'Soft Drinks', items: [{name: 'Coke', price: 'VND 40,000'}, {name: 'Sprite', price: 'VND 40,000'}] },
        { category: 'Snacks', items: [{name: 'Popcorn', price: 'VND 100,000'}, {name: 'Mixed Nuts', price: 'VND 120,000'}] }
    ],
    paymentMethods: [
      { method: 'Credit Card', details: '附加费 3%' },
      { method: 'WeChat Pay' },
      { method: 'Alipay' },
    ]
  },
  {
    id: 'icool-ktv',
    name: 'ICOOL KTV',
    address: '128 Cach Mang Thang Tam, Ward 10, District 3',
    district: 'District 3',
    type: 'Mid-range',
    description: 'ICOOL stands out with its fun, themed rooms and optional buffet service. It\'s a great place for birthday parties and young crowds looking for a unique and energetic karaoke experience with good food.',
    services: ['Themed Rooms', 'Snacks & Drinks', 'Buffet Option'],
    priceRange: 'VND 400,000 - 800,000 / hour',
    hours: '11:00 AM - 1:00 AM',
    numberOfRooms: 40,
    contact: {
      phone: '1900 779 936',
      whatsapp: '+84 79 491 5205',
      wechat: 'TTking789',
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.420658422009!2d106.6852443147489!3d10.7792619923196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f28b7759d5b%3A0x5d5d85d7b5b5d5d5!2sICOOL%20Karaoke!5e0!3m2!1sen!2sus!4v1678886888888',
    cardImage: getImage('ktv-card-3'),
    gallery: [getImage('ktv-card-3'), getImage('ktv-gallery-1-1'), getImage('ktv-gallery-1-2')],
    reviews: [
      { author: 'Hoang Vu', comment: 'Love the themed rooms! Makes the experience much more fun. The buffet is a great deal.', rating: 5 },
      { author: 'Mai Anh', comment: 'The sound quality is good, but it can get very crowded on weekends. Book in advance!', rating: 4 },
    ],
    rooms: [
        { type: 'Galaxy Room', capacity: 'Up to 12 people', price: 'VND 450,000 / hour' },
        { type: 'Anime Room', capacity: 'Up to 12 people', price: 'VND 450,000 / hour' },
        { type: 'Party Room', capacity: 'Up to 30 people', price: 'VND 800,000 / hour' }
    ],
    menu: [
        { category: 'Buffet', items: [{name: 'Weekday Buffet', price: 'VND 199,000 / person'}, {name: 'Weekend Buffet', price: 'VND 249,000 / person'}] },
        { category: 'Cocktails', items: [{name: 'Mojito', price: 'VND 120,000'}, {name: 'Long Island', price: 'VND 150,000'}] }
    ],
    paymentMethods: [
      { method: 'Credit Card', details: '附加费 3%' },
      { method: 'WeChat Pay' },
      { method: 'Alipay' },
    ]
  },
  {
    id: 'catwalk-ktv',
    name: 'Catwalk KTV',
    address: 'New World Saigon Hotel, 76 Le Lai, Ben Thanh, District 1',
    district: 'District 1',
    type: 'High-end',
    description: 'Located within the prestigious New World Saigon Hotel, Catwalk offers a sophisticated KTV and nightclub experience. It\'s the ideal spot for those looking to sing, dance, and socialize in a high-energy, upscale environment.',
    services: ['VIP Service', 'Full Bar', 'Live DJs', 'In-Hotel Location'],
    priceRange: 'VND 1,500,000 - 4,000,000 / hour',
    hours: '6:00 PM - 3:00 AM',
    numberOfRooms: 20,
    contact: {
      phone: '028 3822 8888',
      whatsapp: '+84 79 491 5205',
      wechat: 'TTking789',
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.493399427027!2d106.6943013147488!3d10.7714159923245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3d7a7b3d3d%3A0x1d4a3d4a3d4a3d4d!2sCatwalk%20Club!5e0!3m2!1sen!2sus!4v1678886999999',
    cardImage: getImage('ktv-card-4'),
    gallery: [getImage('ktv-card-4'), getImage('ktv-gallery-1-1'), getImage('ktv-gallery-1-2')],
    reviews: [
      { author: 'David Chen', comment: 'The place to see and be seen. Very high-end, attracts a certain crowd. Professional setup.', rating: 5 },
      { author: 'Jessica Tran', comment: 'More of a club vibe than a traditional KTV. Great if you want to party.', rating: 4 },
    ],
    rooms: [
        { type: 'Deluxe Room', capacity: 'Up to 15 people', price: 'VND 1,500,000 / hour' },
        { type: 'Presidential Suite', capacity: 'Up to 40 people', price: 'VND 4,000,000 / hour' }
    ],
    menu: [
        { category: 'Champagne', items: [{name: 'Moët & Chandon', price: 'VND 5,000,000 / bottle'}]},
        { category: 'Premium Snacks', items: [{name: 'Cheese Platter', price: 'VND 750,000'}]}
    ],
    paymentMethods: [
      { method: 'Credit Card', details: '附加费 3%' },
      { method: 'WeChat Pay' },
      { method: 'Alipay' },
    ]
  },
  {
    id: 'fyou-ktv',
    name: 'F.YOU KTV',
    address: '239-241 Hai Ba Trung, Ward 6, District 3',
    district: 'District 3',
    type: 'Budget',
    description: 'F.YOU KTV is the go-to spot for students and anyone looking for a fun night out without breaking the bank. While the facilities are basic, the song list is surprisingly current and the atmosphere is always lively.',
    services: ['Private Rooms', 'Cheap Beer', 'Student Deals'],
    priceRange: 'VND 150,000 - 300,000 / hour',
    hours: '1:00 PM - 1:00 AM',
    numberOfRooms: 25,
    contact: {
      phone: '090 888 9999',
      whatsapp: '+84 79 491 5205',
      wechat: 'TTking789',
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.420658422009!2d106.6852443147489!3d10.7792619923196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f28b7759d5b%3A0x5d5d85d7b5b5d5d5!2sF.YOU%20KTV!5e0!3m2!1sen!2sus!4v1678886888888',
    cardImage: getImage('ktv-card-6'),
    gallery: [getImage('ktv-card-6'), getImage('ktv-gallery-1-1'), getImage('ktv-gallery-1-2')],
    reviews: [
      { author: 'StudentLife', comment: 'Our go-to place for cheap fun. Don\'t expect luxury, but it gets the job done.', rating: 4 },
      { author: 'Uyen My', comment: 'It\'s alright for the price. The rooms are a bit old but the song list is surprisingly updated.', rating: 3 },
    ],
    rooms: [
        { type: 'Small Group', capacity: 'Up to 6 people', price: 'VND 150,000 / hour' },
        { type: 'Medium Group', capacity: 'Up to 12 people', price: 'VND 220,000 / hour' },
        { type: 'Large Group', capacity: 'Up to 20 people', price: 'VND 300,000 / hour' }
    ],
    menu: [
        { category: 'Local Beer', items: [{name: 'Saigon Special', price: 'VND 30,000'}, {name: '333', price: 'VND 25,000'}] },
        { category: 'Instant Noodles', items: [{name: 'Hao Hao', price: 'VND 50,000'}]}
    ],
    paymentMethods: [
      { method: 'Credit Card', details: '附加费 3%' },
      { method: 'WeChat Pay' },
      { method: 'Alipay' },
    ]
  }
];
