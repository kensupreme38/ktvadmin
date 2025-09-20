'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { SocialShareButtons } from '@/components/SocialShareButtons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Clock,
  Contact,
  CreditCard,
  DoorOpen,
  Info,
  Loader,
  MapPin,
  Music,
  PartyPopper,
  Sparkles,
  Star,
  Utensils,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';
import { summarizeKtvReviews } from '@/ai/flows/summarize-ktv-reviews';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Ktv } from '@/types';

type KtvPageClientProps = {
  ktv: Ktv;
};

export default function KtvPageClient({ ktv }: KtvPageClientProps) {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setError('');
    setSummary('');
    try {
      const reviewsText = ktv.reviews.map(r => r.comment).join('\n');
      const result = await summarizeKtvReviews({ reviews: reviewsText });
      setSummary(result.summary);
    } catch (e) {
      setError('Failed to generate summary. Please try again.');
    } finally {
      setIsSummarizing(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8 shadow-lg">
        <Image
          src={ktv.gallery[0].imageUrl}
          alt={`Hero image for ${ktv.name}`}
          fill
          className="object-cover"
          priority
          data-ai-hint={ktv.gallery[0].imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-5xl font-bold text-white mb-2">{ktv.name}</h1>
          <div className="flex items-center text-lg text-gray-200">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{ktv.address}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center"><Info className="mr-3 text-primary" /> About {ktv.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{ktv.description}</p>
            </CardContent>
          </Card>

          {/* Details Accordion */}
          <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
             {/* Rooms & Pricing */}
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-semibold"><Music className="mr-3 text-primary" />Rooms & Pricing</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {ktv.rooms.map((room, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-card/50 rounded-lg">
                      <div>
                        <p className="font-semibold">{room.type}</p>
                        <p className="text-sm text-muted-foreground">Capacity: {room.capacity}</p>
                      </div>
                      <p className="font-semibold text-primary">{room.price}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Food & Drinks */}
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl font-semibold"><Utensils className="mr-3 text-primary" />Food & Drinks</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                {ktv.menu.map((category, index) => (
                  <div key={index}>
                    <h4 className="font-bold text-lg mb-2 text-primary/80">{category.category}</h4>
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex justify-between items-center p-3 bg-card/50 rounded-lg">
                          <span>{item.name}</span>
                          <span className="font-mono text-muted-foreground">{item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Payment & Contact */}
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl font-semibold"><CreditCard className="mr-3 text-primary" />Payment & Contact</AccordionTrigger>
              <AccordionContent>
                 <div className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-bold text-lg mb-2 text-primary/80">Payment Methods</h4>
                      <div className="flex flex-wrap gap-2">
                        {ktv.paymentMethods.map(method => <Badge key={method} variant="secondary">{method}</Badge>)}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-bold text-lg mb-2 text-primary/80">Contact Information</h4>
                      <p className="text-muted-foreground">{ktv.contact}</p>
                    </div>
                 </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Gallery Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <Carousel className="w-full">
                <CarouselContent>
                  {ktv.gallery.map((img, index) => (
                    <CarouselItem key={index} className="md:basis-1/2">
                      <div className="p-1">
                        <div className="relative aspect-video">
                           <Image src={img.imageUrl} alt={`${ktv.name} gallery image ${index + 1}`} fill className="rounded-md object-cover" data-ai-hint={img.imageHint} />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <div className="text-center mt-4">
                 <Button variant="outline">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Optimize with AI
                 </Button>
                 <p className="text-xs text-muted-foreground mt-2">KTV owner tool to improve gallery images</p>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-background rounded-lg border">
                <div>
                    <h3 className="font-semibold">AI Review Summary</h3>
                    <p className="text-sm text-muted-foreground">Get the highlights from customer feedback.</p>
                </div>
                <Button onClick={handleSummarize} disabled={isSummarizing}>
                  {isSummarizing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {isSummarizing ? 'Generating...' : 'Summarize Reviews'}
                </Button>
              </div>

              {error && <Alert variant="destructive" className="mb-4"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
              
              {summary && <Alert className="mb-6 bg-primary/10 border-primary/20"><Sparkles className="h-4 w-4 text-primary" /><AlertTitle className="text-primary">AI Summary</AlertTitle><AlertDescription>{summary}</AlertDescription></Alert>}

              <div className="space-y-6">
                {ktv.reviews.map((review, index) => (
                  <div key={index}>
                    <div className="flex items-center mb-2">
                      <p className="font-semibold mr-4">{review.author}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-muted-foreground'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar Info */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex"><DoorOpen className="h-4 w-4 mr-3 mt-1 flex-shrink-0" /><span>{ktv.numberOfRooms} rooms</span></div>
              <div className="flex"><Clock className="h-4 w-4 mr-3 mt-1 flex-shrink-0" /><span>{ktv.hours}</span></div>
              <div className="flex"><Wallet className="h-4 w-4 mr-3 mt-1 flex-shrink-0" /><span>{ktv.priceRange}</span></div>
              <div className="flex"><Contact className="h-4 w-4 mr-3 mt-1 flex-shrink-0" /><span>{ktv.contact}</span></div>
              <Separator />
               <h4 className="font-semibold pt-2">Main Services</h4>
              <div className="flex flex-wrap gap-2">
                <Badge>{ktv.type}</Badge>
                {ktv.services.map(service => <Badge key={service} variant="secondary">{service}</Badge>)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Location</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="aspect-video w-full overflow-hidden rounded-md">
                   <iframe src={ktv.mapUrl} width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Share</CardTitle>
            </CardHeader>
            <CardContent>
              <SocialShareButtons url={`/ktv/${ktv.id}`} title={ktv.name} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
