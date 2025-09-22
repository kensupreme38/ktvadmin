
import Link from 'next/link';
import Image from 'next/image';
import { Ktv } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface KtvCardProps {
  ktv: Ktv;
}

export function KtvCard({ ktv }: KtvCardProps) {
  return (
    <Link href={`/ktv/${ktv.id}`} className="group block h-full">
      <Card className="h-full flex flex-col transition-all duration-300 ease-in-out bg-card/80 backdrop-blur-sm card-glow group-hover:shadow-primary/20">
        <CardHeader className="p-0">
          <div className="relative h-52 w-full overflow-hidden rounded-t-lg">
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
          </div>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{ktv.district}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col items-stretch gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{ktv.type}</Badge>
            {ktv.services.slice(0, 2).map((service) => (
              <Badge key={service} variant="outline">{service}</Badge>
            ))}
          </div>
          <div className={cn(buttonVariants({ variant: 'outline' }), "mt-auto w-full")}>
              Book Now
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
