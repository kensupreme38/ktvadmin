'use client';

import { KtvCard } from '@/components/ktv/KtvCard';
import { allKtvs } from '@/data/ktvs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Music4, ShieldCheck, Utensils, Award, Waves, Wifi, CalendarClock, Armchair } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const featuredKtvs = allKtvs.slice(0, 6);

const bannerImages = [
  {
    src: 'https://hcmc-ktv.com/wp-content/uploads/2025/06/57-Tulip-KTV-1024x512.png',
    alt: 'Karaoke setup with neon lights',
    hint: 'dark karaoke room',
  },
  {
    src: 'https://picsum.photos/seed/101/1200/600',
    alt: 'A vibrant, modern KTV room with neon lights.',
    hint: 'neon karaoke'
  },
    {
    src: 'https://picsum.photos/seed/202/1200/600',
    alt: 'A group of friends having fun at a KTV.',
    hint: 'friends party'
  }
];

const newHighlights = [
    {
        icon: Waves,
        title: 'Professional Service',
        description: 'Our dedicated staff will make you want to come and never leave.',
    },
    {
        icon: Wifi,
        title: 'Free Wi-Fi',
        description: 'Free high-speed Wi-Fi covers the entire venue for your convenience.',
    },
    {
        icon: Armchair,
        title: 'Comfortable Rooms',
        description: 'Spacious and cozy rooms with full amenities, including private restrooms.',
    },
    {
        icon: CalendarClock,
        title: 'Free Booking',
        description: 'We support advance booking to make your party planning convenient and proactive.',
    },
];


const highlights = [
    {
        icon: Music4,
        title: 'Ultimate Sound',
        description: 'Experience crystal-clear audio for an amazing night of karaoke.',
    },
    {
        icon: ShieldCheck,
        title: 'Luxury VIP Rooms',
        description: 'Private, exclusive rooms for you and your friends to enjoy.',
    },
    {
        icon: Utensils,
        title: 'Gourmet Dining',
        description: 'Delicious snacks and drinks to keep the party going all night.',
    },
    {
        icon: Award,
        title: 'Party Atmosphere',
        description: 'A vibrant and energetic space to sing your heart out.',
    },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {bannerImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full aspect-video">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="w-full h-full object-cover"
                    data-ai-hint={image.hint}
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        </Carousel>
      </section>

      {/* Featured Venues Section */}
      <section id="featured" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            OUR KARAOKE SYSTEM
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredKtvs.map((ktv) => (
              <KtvCard key={ktv.id} ktv={ktv} />
            ))}
          </div>
        </div>
      </section>

      {/* New Highlights Section from image */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
            <Button asChild variant="outline" className="mb-8">
                <Link href="/directory">View All Karaoke Venues</Link>
            </Button>
            <h2 className="text-3xl md:text-4xl font-bold uppercase">
                The Best KTV in Ho Chi Minh City
            </h2>
            <div className="flex justify-center my-4">
                <div className="w-24 h-1 bg-primary" />
            </div>
            <p className="text-muted-foreground max-w-3xl mx-auto mb-12">
                Equipped with an automatic fire protection system, we prioritize your safety and enjoyment. We invest in top-tier safety to ensure your peace of mind.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {newHighlights.map((highlight) => (
                <Card key={highlight.title} className="bg-card text-card-foreground p-6 flex items-center gap-6 text-left rounded-lg">
                    <highlight.icon className="w-12 h-12 text-primary flex-shrink-0" />
                    <div>
                        <h3 className="text-lg font-semibold text-primary">{highlight.title}</h3>
                        <p className="text-muted-foreground">{highlight.description}</p>
                    </div>
                </Card>
                ))}
            </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-card/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose Aura?
            </h2>
             <p className="text-lg text-muted-foreground mt-2">Your trusted platform for Saigon's nightlife.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((highlight) => (
              <Card key={highlight.title} className="bg-card/50 text-center p-6 flex flex-col items-center transition-all duration-300 hover:bg-primary/10 card-glow">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4 shadow-lg shadow-primary/20">
                    <highlight.icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{highlight.title}</h3>
                  <p className="text-muted-foreground flex-grow">{highlight.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

       {/* Call to Action Section */}
       <section className="py-20 text-center bg-gradient-to-t from-background to-card/30">
         <div className="container mx-auto px-4">
             <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Shine?</h2>
             <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">Browse our full directory to discover your next favorite KTV. Adventure awaits.</p>
             <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20">
                <Link href="/directory">Discover All KTVs</Link>
            </Button>
         </div>
       </section>
    </div>
  );
}
