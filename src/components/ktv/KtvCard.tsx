import Link from 'next/link';
import Image from 'next/image';
import { Ktv } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface KtvCardProps {
  ktv: Ktv;
}

export function KtvCard({ ktv }: KtvCardProps) {
  const averageRating = ktv.reviews.length > 0 
    ? ktv.reviews.reduce((acc, review) => acc + review.rating, 0) / ktv.reviews.length
    : 0;

  return (
    <Card className="h-full flex flex-col transition-all duration-300 ease-in-out bg-card/80 backdrop-blur-sm card-glow">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={ktv.cardImage.imageUrl}
            alt={ktv.name}
            fill
            className="object-cover"
            data-ai-hint={ktv.cardImage.imageHint}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl mb-2">{ktv.name}</CardTitle>
          {averageRating > 0 && (
              <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold text-sm text-foreground">{averageRating.toFixed(1)}</span>
              </div>
          )}
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{ktv.district}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {ktv.reviews[0]?.comment ? `"${ktv.reviews[0].comment}"` : 'A popular spot for music lovers.'}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-stretch gap-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{ktv.type}</Badge>
          {ktv.services.slice(0, 2).map((service) => (
            <Badge key={service} variant="outline">{service}</Badge>
          ))}
        </div>
        <Button asChild variant="outline" className="mt-auto w-full">
            <Link href={`/ktv/${ktv.id}`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
