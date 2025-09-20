'use client';

import { KtvCard } from '@/components/ktv/KtvCard';
import { allKtvs } from '@/data/ktvs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Music4, ShieldCheck, Utensils, Award } from 'lucide-react';

const featuredKtvs = allKtvs.slice(0, 3);

const highlights = [
    {
        icon: Music4,
        title: 'Best Sound',
        description: 'Crystal-clear audio for the ultimate singing experience.',
    },
    {
        icon: ShieldCheck,
        title: 'VIP Rooms',
        description: 'Exclusive, private rooms for you and your friends.',
    },
    {
        icon: Utensils,
        title: 'Great Food',
        description: 'Delicious snacks and drinks to keep the party going.',
    },
    {
        icon: Award,
        title: 'Party Atmosphere',
        description: 'Vibrant and energetic spaces to sing your heart out.',
    },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="https://picsum.photos/seed/301/1800/1200"
          alt="Neon karaoke sign"
          fill
          className="object-cover brightness-50"
          data-ai-hint="neon karaoke"
          priority
        />
        <div className="relative z-10 p-4">
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-shadow-glow">
            Find Your Stage
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-gray-200 text-shadow-glow-subtle">
            Explore the best KTV spots in Ho Chi Minh City.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20">
             <Link href="/#featured">Find Your KTV Tonight</Link>
          </Button>
        </div>
      </section>

      {/* Featured Venues Section */}
      <section id="featured" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-headline font-bold text-center mb-12">
            Featured Venues
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredKtvs.map((ktv) => (
              <KtvCard key={ktv.id} ktv={ktv} />
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-card/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-headline font-bold text-center mb-12">
            Why Choose Aura?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {highlights.map((highlight) => (
              <div key={highlight.title} className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40 hover:scale-110">
                  <highlight.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold font-headline mb-2">{highlight.title}</h3>
                <p className="text-muted-foreground">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
       <section className="py-20 text-center">
         <div className="container mx-auto px-4">
             <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Ready for the Spotlight?</h2>
             <p className="text-muted-foreground text-lg mb-8">Browse our full directory to discover your next favorite KTV.</p>
             <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20">
                <Link href="/directory">Explore All KTVs</Link>
            </Button>
         </div>
       </section>
    </div>
  );
}
