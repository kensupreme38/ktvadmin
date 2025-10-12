
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Ktv, KtvDescription } from '@/types';
import { allCategories } from '@/data/categories';
import { useToast } from '@/hooks/use-toast';
import { useState, useImperativeHandle, forwardRef, useEffect, useRef } from 'react';
import { ImageGallery } from './ImageGallery';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { ImagePlus, X } from 'lucide-react';
import { CardFooter } from '../ui/card';
import { countries, citiesByCountry } from '@/data/locations';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  mainImageUrl: z.string().optional(),
  images: z.array(z.string()).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  categoryId: z.string().optional(),
  price: z.string().optional(),
  hours: z.string().optional(),
  description: z.object({
    summary: z.string().optional(),
    features: z.string().optional(), // Will be string from textarea, split into array on submit
  }).optional(),
  contact: z.string().optional(),
});

type KtvFormValues = z.infer<typeof formSchema>;

interface KtvFormProps {
  ktv?: Ktv | null;
  onSave: (data: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onCancel?: () => void;
}

type KtvFormRef = {
    submit: () => void;
};

export const KtvForm = forwardRef<KtvFormRef, KtvFormProps>(({ ktv, onSave, onCancel }, ref) => {
  const { toast } = useToast();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryTarget, setGalleryTarget] = useState<'main' | 'multi' | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  const defaultValues: KtvFormValues = {
    name: ktv?.name ?? '',
    mainImageUrl: ktv?.mainImageUrl ?? '',
    images: ktv?.images ?? [],
    address: ktv?.address ?? '',
    city: ktv?.city ?? 'Ho Chi Minh City',
    country: ktv?.country ?? 'Vietnam',
    phone: ktv?.phone ?? '',
    categoryId: ktv?.categoryId ?? allCategories.find(c => c.slug === 'ktv')?.id,
    price: ktv?.price ?? '',
    hours: ktv?.hours ?? '',
    description: {
      summary: ktv?.description?.summary ?? '',
      features: ktv?.description?.features?.join('\n') ?? '',
    },
    contact: ktv?.contact ?? '',
  };

  const form = useForm<KtvFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  const watchedCountry = form.watch('country');
  const availableCities = watchedCountry ? citiesByCountry[watchedCountry] || [] : [];
  
  useEffect(() => {
    form.reset(defaultValues);
  }, [ktv, form]);

  useEffect(() => {
    // Reset city when country changes if the current city is not in the new country's list
    const currentCity = form.getValues('city');
    if (watchedCountry && !citiesByCountry[watchedCountry]?.some(c => c.value === currentCity)) {
        form.setValue('city', '');
    }
  }, [watchedCountry, form]);

  useImperativeHandle(ref, () => ({
    submit: () => {
        formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    },
  }));

  const handleImageSelect = (urls: string[]) => {
    if (galleryTarget === 'main') {
      form.setValue('mainImageUrl', urls[0]);
    } else if (galleryTarget === 'multi') {
      const currentImages = form.getValues('images') || [];
      const newImages = [...currentImages, ...urls];
      form.setValue('images', newImages);
    }
    setIsGalleryOpen(false);
  }

  function onSubmit(data: KtvFormValues) {
    const { description, ...rest } = data;

    const finalDescription: KtvDescription = {
        summary: description?.summary || '',
        features: description?.features?.split('\n').filter(f => f.trim() !== '') || [],
    };

    const fullKtvData: Ktv = {
      ...(ktv || {
        id: '', 
        slug: '', 
        isActive: true,
      }),
      ...rest,
      categoryId: data.categoryId || '',
      images: data.images || [],
      description: finalDescription,
    };
    onSave(fullKtvData);
  }

  return (
    <>
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="p-1">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                    <Input placeholder="Iconic KTV" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <Controller
                control={form.control}
                name="mainImageUrl"
                render={({ field }) => (
                <FormItem className="mt-4">
                    <FormLabel>Main Image</FormLabel>
                    <FormControl>
                    <div className="w-full">
                        <Button type="button" variant="outline" onClick={() => { setGalleryTarget('main'); setIsGalleryOpen(true); }}>
                        <ImagePlus className="mr-2 h-4 w-4" />
                        Select Main Image
                        </Button>
                        {field.value && (
                        <div className="mt-2 relative w-48 h-32">
                            <Image src={field.value} alt="Main image preview" layout="fill" objectFit="cover" className="rounded-md" />
                            <Button type="button" size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => field.onChange('')}>
                            <X className="h-4 w-4" />
                            </Button>
                        </div>
                        )}
                    </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <Controller
                control={form.control}
                name="images"
                render={({ field }) => (
                <FormItem className="mt-4">
                    <FormLabel>Image Gallery</FormLabel>
                    <FormControl>
                    <div>
                        <Button type="button" variant="outline" onClick={() => { setGalleryTarget('multi'); setIsGalleryOpen(true); }}>
                        <ImagePlus className="mr-2 h-4 w-4" />
                        Add to Gallery
                        </Button>
                        <div className="mt-2 flex flex-wrap gap-2">
                        {field.value?.map((url, index) => (
                            <div key={index} className="relative w-32 h-24">
                            <Image src={url} alt={`Gallery image ${index + 1}`} layout="fill" objectFit="cover" className="rounded-md" />
                            <Button type="button" size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => {
                                const newImages = [...field.value!];
                                newImages.splice(index, 1);
                                field.onChange(newImages);
                            }}>
                                <X className="h-4 w-4" />
                            </Button>
                            </div>
                        ))}
                        </div>
                    </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                <FormItem className="mt-4">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                    <Input placeholder="35 Selegie Rd" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
                <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {countries.map(country => (
                                <SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>City</FormLabel>
                         <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a city" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {availableCities.length > 0 ? availableCities.map(city => (
                                    <SelectItem key={city.value} value={city.value}>{city.label}</SelectItem>
                                )) : <SelectItem value="all" disabled>Select a country first</SelectItem>}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {allCategories.filter(c => c.slug !== 'all').map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                        <Input placeholder="+84 123 456 789" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                        <Input placeholder="$248" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Opening Hours</FormLabel>
                    <FormControl>
                        <Input placeholder="4PM - 3AM" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
                control={form.control}
                name="description.summary"
                render={({ field }) => (
                    <FormItem className="mt-4">
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                        <Textarea placeholder="A brief summary of the KTV." {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="description.features"
                render={({ field }) => (
                    <FormItem className="mt-4">
                    <FormLabel>Features</FormLabel>
                    <FormControl>
                        <Textarea placeholder="List features, one per line..." {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                <FormItem className="mt-4">
                    <FormLabel>Other Contact Info</FormLabel>
                    <FormControl>
                    <Input placeholder="WeChat ID, Telegram..." {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>
          {onCancel && (
             <CardFooter className="flex justify-end gap-2 border-t pt-4">
                <Button variant="outline" type="button" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
            </CardFooter>
          )}
        </form>
      </Form>

      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-4xl h-[80vh] p-0 flex flex-col">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Select Images</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <ImageGallery
              onSelect={handleImageSelect}
              multiple={galleryTarget === 'multi'}
              onClose={() => setIsGalleryOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

KtvForm.displayName = 'KtvForm';

    

    