'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SocialShareButtons } from '@/components/SocialShareButtons';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Calendar,
  CheckCircle,
  Clock,
  Contact,
  CreditCard,
  Info,
  MapPin,
  Music,
  Phone,
  Sparkles,
  Star,
  Utensils,
  Wallet,
} from 'lucide-react';
import type { Ktv, ImagePlaceholder } from '@/types';
import Masonry from 'react-masonry-css';

// Custom SVG components for WhatsApp and WeChat
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const WeChatIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 10.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5S16.83 9 16 9s-1.5.67-1.5 1.5z" />
    <path d="M21.5 10.5c0 5.25-4.25 9.5-9.5 9.5S2.5 15.75 2.5 10.5 6.75 1 12 1s9.5 4.25 9.5 9.5z" />
    <path d="M8 10.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5S10.33 9 9.5 9s-1.5.67-1.5 1.5z" />
  </svg>
);


type KtvPageClientProps = {
  ktv: Ktv;
};

// A map for simplified payment method names
const paymentMethodTranslations: Record<string, string> = {
  'Credit Card': '信用卡',
  'WeChat Pay': '微信支付',
  'Alipay': '支付宝',
};


export default function KtvPageClient({ ktv }: KtvPageClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImagePlaceholder | null>(null);

  const openLightbox = (image: ImagePlaceholder) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };
  
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden mb-8 shadow-lg">
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
          
          {/* Gallery Section */}
           <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Gallery</CardTitle>
            </CardHeader>
            <CardContent>
               <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {ktv.gallery.map((img, index) => (
                  <div key={index} className="overflow-hidden rounded-md cursor-pointer" onClick={() => openLightbox(img)}>
                    <Image
                      src={img.imageUrl}
                      alt={`${ktv.name} gallery image ${index + 1}`}
                      width={600}
                      height={400}
                      className="rounded-md object-cover w-full h-auto transform hover:scale-105 transition-transform duration-300"
                      data-ai-hint={img.imageHint}
                    />
                  </div>
                ))}
              </Masonry>
            </CardContent>
          </Card>

          {/* Rooms & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Music className="mr-3 text-primary" /> Rooms & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
            </CardContent>
          </Card>
          
          {/* Food & Drinks */}
          <Card>
             <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Utensils className="mr-3 text-primary" /> Food & Drinks
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
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
            </CardContent>
          </Card>

          {/* Payment & Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <CreditCard className="mr-3 text-primary" /> 支付方式 | Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <ul className="space-y-3">
                    {ktv.paymentMethods.map(p => (
                       <li key={p.method} className="flex items-center">
                          <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                          <span>{paymentMethodTranslations[p.method] || p.method} {p.method} {p.details && `(${p.details})`}</span>
                       </li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div>
                  <h3 className="text-xl font-semibold flex items-center mb-4">
                     <Calendar className="mr-3 text-primary" /> 预约 | Reservations
                  </h3>
                   <ul className="space-y-3">
                    {ktv.contact.whatsapp && (
                      <li className="flex items-center">
                         <WhatsAppIcon className="h-5 w-5 mr-3 text-green-500" />
                         <span>WhatsApp: {ktv.contact.whatsapp}</span>
                      </li>
                    )}
                    {ktv.contact.wechat && (
                       <li className="flex items-center">
                         <WeChatIcon className="h-5 w-5 mr-3 text-green-500" />
                         <span>WeChat 微信: {ktv.contact.wechat}</span>
                       </li>
                    )}
                     <li className="flex items-center">
                         <Phone className="h-5 w-5 mr-3 text-primary" />
                         <span>Phone: {ktv.contact.phone}</span>
                      </li>
                   </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Reviews</CardTitle>
            </CardHeader>
            <CardContent>
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
              <div className="flex"><Music className="h-4 w-4 mr-3 mt-1 flex-shrink-0" /><span>{ktv.numberOfRooms} rooms</span></div>
              <div className="flex"><Clock className="h-4 w-4 mr-3 mt-1 flex-shrink-0" /><span>{ktv.hours}</span></div>
              <div className="flex"><Wallet className="h-4 w-4 mr-3 mt-1 flex-shrink-0" /><span>{ktv.priceRange}</span></div>
              <div className="flex"><Contact className="h-4 w-4 mr-3 mt-1 flex-shrink-0" /><span>{ktv.contact.phone}</span></div>
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
      
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-2 bg-transparent border-none">
          {selectedImage && (
            <Image
              src={selectedImage.imageUrl}
              alt={selectedImage.description}
              width={1200}
              height={800}
              className="rounded-lg object-contain w-full h-auto max-h-[80vh]"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
