import type { Article } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)!;

export const allArticles: Article[] = [
  {
    slug: 'ktv-etiquette-for-beginners',
    title: 'KTV Etiquette for Beginners: How to Shine on Your First Night Out',
    author: 'Aura Editorial',
    publishedDate: '2024-05-15',
    status: 'Published',
    image: getImage('article-1'),
    excerpt: 'Stepping into a KTV for the first time can be daunting. From choosing songs to ordering drinks, we cover the unwritten rules to ensure you have a blast and impress your friends.',
    content: `
      <h2>The Basics of KTV</h2>
      <p>Karaoke Television, or KTV, is a staple of nightlife in many parts of Asia, and Ho Chi Minh City is no exception. It's more than just singing; it's a social event. Here's what to expect.</p>
      
      <h3>1. Choosing the Right Venue</h3>
      <p>Venues range from budget-friendly spots perfect for students to luxurious lounges for business events. Use Aura KTV's filters to find one that matches your vibe and budget.</p>
      
      <h3>2. Song Selection</h3>
      <p>Don't be shy! Hogging the remote is a no-no. A good rule of thumb is to queue up one or two songs at a time and let others have their turn. Try a mix of popular hits and classics that everyone can sing along to.</p>

      <h3>3. Duets and Group Songs</h3>
      <p>The best part of KTV is singing together. Suggest a popular group song to get everyone involved. Duets are also a great way to bond with a friend.</p>
      
      <h3>4. Food and Drinks</h3>
      <p>Most KTVs have an extensive menu of snacks and beverages. Pacing yourself is key. Remember to hydrate with water between your powerhouse performances!</p>
    `,
  },
  {
    slug: 'top-5-high-end-ktv-saigon',
    title: 'The Top 5 High-End KTVs for a Night of Luxury in Saigon',
    author: 'Aura Editorial',
    publishedDate: '2024-05-10',
    status: 'Published',
    image: getImage('article-2'),
    excerpt: 'For those special occasions that call for more than just a microphone and a screen. We explore the most opulent KTV experiences Saigon has to offer.',
    content: `
      <h2>When Only the Best Will Do</h2>
      <p>Ho Chi Minh City's luxury KTV scene is all about extravagant decor, state-of-the-art technology, and impeccable service. Here are our top picks for an unforgettable night.</p>
      
      <h3>1. Kingdom KTV</h3>
      <p>As the name suggests, Kingdom treats its guests like royalty. With lavish, spacious rooms and a professional-grade sound system, it's a favorite for corporate clients and celebrities.</p>
      
      <h3>2. Catwalk KTV</h3>
      <p>Located in the New World Hotel, Catwalk offers a nightclub-KTV hybrid experience. It's the perfect place if you want to sing, dance, and mingle in a high-energy environment.</p>

      <h3>3. The Penthouse</h3>
      <p>Offering stunning city views and private butler service, The Penthouse is the pinnacle of exclusive entertainment. It's less a KTV room and more a private party palace.</p>

      <p>Explore our directory for more details on these and other premium venues.</p>
    `,
  },
  {
    slug: 'history-of-karaoke-vietnam',
    title: 'A Brief History of Karaoke in Vietnam',
    author: 'Aura Editorial',
    publishedDate: '2024-05-01',
    status: 'Published',
    image: getImage('article-3'),
    excerpt: 'From its humble beginnings to becoming a cultural phenomenon, discover how karaoke became an integral part of Vietnamese social life.',
    content: `
      <h2>From Japan to Vietnam</h2>
      <p>Karaoke, which means "empty orchestra" in Japanese, was invented in the 1970s. It didn't take long for this exciting new form of entertainment to travel across Asia.</p>

      <h3>The 90s Boom</h3>
      <p>Karaoke arrived in Vietnam in the early 1990s and quickly captured the nation's heart. Initially available in cafes and bars, the demand for private spaces grew, leading to the birth of the dedicated KTV venues we know today.</p>

      <h3>Modern KTV Culture</h3>
      <p>Today, KTV is a multi-generational activity. It's where families celebrate birthdays, friends gather on weekends, and colleagues unwind after work. The technology has evolved, but the core joy of singing together remains the same.</p>
    `,
  },
    {
    slug: 'saigon-nightlife-guide',
    title: 'Your Ultimate Saigon Nightlife Guide: Beyond KTV',
    author: 'Thanh Nguyen',
    publishedDate: '2024-06-25',
    status: 'Draft',
    image: getImage('article-1'),
    excerpt: 'Explore the vibrant nightlife of Ho Chi Minh City, from rooftop bars to hidden speakeasies. There is more to discover beyond the karaoke rooms.',
    content: `
      <h2>Discover the Night</h2>
      <p>While KTV is a fantastic part of Saigon's nightlife, the city offers so much more after dark. This guide will help you explore other exciting options.</p>
    `,
  },
];
