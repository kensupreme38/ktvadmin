
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useKtvData } from '@/hooks/use-ktv-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowLeft, MapPin, Phone, Clock, DollarSign, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { allCategories } from '@/data/categories';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { Ktv } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


const getCategoryNames = (categoryIds: string[]) => {
    if (!categoryIds || categoryIds.length === 0) return ['N/A'];
    return categoryIds.map(id => allCategories.find(c => c.id === id)?.name || 'N/A');
};

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string | null }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <Icon className="h-5 w-5 text-muted-foreground mt-1" />
            <div>
                <p className="font-semibold">{label}</p>
                <p className="text-muted-foreground">{value}</p>
            </div>
        </div>
    );
};

const PageSkeleton = () => (
    <div>
        <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-9 w-32" />
            <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
            </div>
        </div>
        <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3 space-y-6">
                <Skeleton className="w-full aspect-video rounded-lg" />
                <Skeleton className="h-32 w-full" />
            </div>
            <div className="md:col-span-2 space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <div className="space-y-4">
                    {Array.from({length: 5}).map((_, i) => (
                        <div key={i} className="flex gap-3">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        </div>
                    ))}
                </div>
                 <Skeleton className="h-24 w-full" />
            </div>
        </div>
    </div>
);


export default function KtvDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { ktvs, isLoading, deleteKtv } = useKtvData();
    const { toast } = useToast();
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const ktvId = typeof params.id === 'string' ? params.id : '';
    const ktv = ktvs.find(k => k.id === ktvId);

    const handleEdit = () => {
        router.push(`/admin/ktvs/${ktvId}/edit`);
    };
    
    const handleDeleteClick = () => {
        setIsAlertOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (ktv) {
            deleteKtv(ktv.id);
            toast({
                title: 'KTV Deleted',
                description: `${ktv.name} has been successfully removed.`,
                variant: 'destructive',
            });
            router.push('/admin');
        }
        setIsAlertOpen(false);
    };
    
    if (isLoading) {
        return <PageSkeleton />;
    }

    if (!ktv) {
        return (
            <div className="text-center py-10">
                <p className="text-lg font-semibold">KTV not found</p>
                <Button onClick={() => router.push('/admin')} className="mt-4">Go Back to List</Button>
            </div>
        );
    }
    
    const categoryNames = getCategoryNames(ktv.categoryIds);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <Button variant="outline" onClick={() => router.push('/admin')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to List
                </Button>
                <div className="flex gap-2">
                    <Button onClick={handleEdit}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteClick}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
                {/* Left Column - Images */}
                <div className="md:col-span-3">
                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                           <Image
                                src={ktv.mainImageUrl || "https://placehold.co/1200x800"}
                                alt={ktv.name}
                                width={1200}
                                height={800}
                                className="w-full h-auto object-cover aspect-[4/3]"
                            />
                        </CardContent>
                    </Card>

                    {ktv.images && ktv.images.length > 0 && (
                       <div className="mt-6">
                            <h3 className="text-xl font-semibold mb-4">Image Gallery</h3>
                             <Carousel className="w-full">
                                <CarouselContent>
                                    {ktv.images.map((image, index) => (
                                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                            <div className="p-1">
                                                <Card className="overflow-hidden">
                                                    <CardContent className="p-0 flex items-center justify-center">
                                                         <Image
                                                            src={image}
                                                            alt={`${ktv.name} gallery image ${index + 1}`}
                                                            width={400}
                                                            height={300}
                                                            className="aspect-[4/3] object-cover"
                                                        />
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="ml-12"/>
                                <CarouselNext className="mr-12" />
                            </Carousel>
                       </div>
                    )}
                </div>

                {/* Right Column - Details */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold">{ktv.name}</CardTitle>
                             <div className="text-sm text-muted-foreground pt-1 flex flex-wrap gap-2">
                                 {categoryNames.map((name, index) => (
                                     <Badge key={index} variant="secondary">{name}</Badge>
                                 ))}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4 text-sm">
                                <DetailItem icon={MapPin} label="Address" value={`${ktv.address}, ${ktv.city}`} />
                                <DetailItem icon={Phone} label="Phone" value={ktv.phone} />
                                <DetailItem icon={Clock} label="Hours" value={ktv.hours} />
                                <DetailItem icon={DollarSign} label="Price Range" value={ktv.price} />
                            </div>
                            
                            {(ktv.description?.summary || (ktv.description?.features && ktv.description.features.length > 0)) && (
                                <>
                                    <Separator />
                                    <div className="space-y-4">
                                        {ktv.description.summary && (
                                             <div>
                                                <h4 className="font-semibold mb-2">Summary</h4>
                                                <p className="text-muted-foreground text-sm">
                                                    {ktv.description.summary}
                                                </p>
                                            </div>
                                        )}
                                       
                                        {ktv.description.features && ktv.description.features.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold mb-2">Features</h4>
                                                <ul className="space-y-2 text-sm">
                                                    {ktv.description.features.map((feature, index) => (
                                                        <li key={index} className="flex items-center gap-2">
                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                            <span className="text-muted-foreground">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

             <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the KTV <strong>{ktv.name}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
