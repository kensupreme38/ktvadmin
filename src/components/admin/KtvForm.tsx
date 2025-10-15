
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
  FormDescription,
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
import type { Ktv } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useState, useImperativeHandle, forwardRef, useEffect, useRef, useMemo, useCallback } from 'react';
import { ImageGallery } from './ImageGallery';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { ImagePlus, X, Check, ChevronsUpDown } from 'lucide-react';
import { countries, citiesByCountry } from '@/data/locations';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { createClient } from '@/lib/supabase/client';
import { allCategories } from '@/data/categories';


const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  slug: z.string().min(2, { message: 'Slug must be at least 2 characters.' }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be in kebab-case format (e.g., "my-cool-ktv").'),
  mainImageId: z.string().optional(),
  imageIds: z.array(z.string()).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  price: z.string().optional(),
  hours: z.string().optional(),
  contact: z.string().optional(),
  description: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
});

type KtvFormValues = z.infer<typeof formSchema>;

interface KtvFormProps {
  ktv?: any | null; // Use any to support KtvWithImages
  onSave: (data: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

type KtvFormRef = {
    submit: () => void;
};

export const KtvForm = forwardRef<KtvFormRef, KtvFormProps>(({ ktv, onSave }, ref) => {
  const { toast } = useToast();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryTarget, setGalleryTarget] = useState<'main' | 'multi' | null>(null);
  const [availableImages, setAvailableImages] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const supabase = useMemo(() => createClient(), []);

  const defaultValues: KtvFormValues = {
    name: ktv?.name ?? '',
    slug: ktv?.slug ?? '',
    mainImageId: ktv?.images?.find((img: any) => img.is_main)?.image_id ?? '',
    imageIds: ktv?.images?.filter((img: any) => !img.is_main).map((img: any) => img.image_id) ?? [],
    address: ktv?.address ?? '',
    city: ktv?.city ?? 'Ho Chi Minh City',
    country: ktv?.country ?? 'Vietnam',
    phone: ktv?.phone ?? '',
    price: ktv?.price ?? '',
    hours: ktv?.hours ?? '',
    contact: ktv?.contact ?? '',
    description: ktv?.description ?? '',
    categoryIds: ktv?.categories?.map((c: any) => c.id) ?? [],
  };

  const form = useForm<KtvFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  const watchedCountry = form.watch('country');
  const watchedName = form.watch('name');
  const availableCities = watchedCountry ? citiesByCountry[watchedCountry] || [] : [];

  // Load available images from database
  const loadAvailableImages = useCallback(async () => {
    try {
      setLoadingImages(true);
      
      // Start with empty array
      setAvailableImages([]);
      
      // Try to load from database
      try {
        const { data, error } = await supabase
          .from('images')
          .select('id, image_url, created_at')
          .order('created_at', { ascending: false })
          .limit(100);

        if (!error && data && data.length > 0) {
          const dbImages = data.map((row: any) => ({
            id: row.id,
            imageUrl: row.image_url,
            description: row.image_url.split('/').pop() || 'image',
            imageHint: 'db image',
          }));
          
          setAvailableImages(dbImages);
          console.log('Loaded images from database:', dbImages.length);
        } else {
          console.log('No images found in database');
        }
      } catch (dbError) {
        console.log('Database images not available');
      }
      
    } catch (error: any) {
      console.error('Error loading images:', error);
      // Don't show toast for image loading errors
    } finally {
      setLoadingImages(false);
    }
  }, [supabase, toast]);

  // Load available categories from database
  const loadAvailableCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      
      // Always use static categories for now to avoid database issues
      console.log('Using static categories');
      setAvailableCategories(allCategories.filter(cat => cat.slug !== 'all'));
      
      // Optional: Try to load from database in background
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug, description')
          .order('name', { ascending: true });

        if (!error && data && data.length > 0) {
          console.log('Database categories loaded successfully, switching to database data');
          setAvailableCategories(data);
        }
      } catch (dbError) {
        console.log('Database categories not available, using static data');
      }
      
    } catch (error: any) {
      console.error('Error loading categories:', error);
      // Always fallback to static categories
      setAvailableCategories(allCategories.filter(cat => cat.slug !== 'all'));
    } finally {
      setLoadingCategories(false);
    }
  }, [supabase, toast]);

  useEffect(() => {
    loadAvailableImages();
    loadAvailableCategories();
  }, [loadAvailableImages, loadAvailableCategories]);
  
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

  useEffect(() => {
    // Auto-generate slug from name if creating a new KTV and slug is empty
    if (!ktv && watchedName && !form.getValues('slug')) {
        const generatedSlug = watchedName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        form.setValue('slug', generatedSlug);
    }
  }, [watchedName, form, ktv]);


  useImperativeHandle(ref, () => ({
    submit: () => {
        formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    },
  }));

  const handleImageSelect = (imageIds: string[]) => {
    if (galleryTarget === 'main') {
      // For main image, set it as mainImageId
      form.setValue('mainImageId', imageIds[0]);
    } else if (galleryTarget === 'multi') {
      // For gallery images, add to imageIds
      const currentImageIds = form.getValues('imageIds') || [];
      const newImageIds = [...currentImageIds, ...imageIds];
      form.setValue('imageIds', newImageIds);
    }
    setIsGalleryOpen(false);
  }

  function onSubmit(data: KtvFormValues) {
    const { imageIds, categoryIds, mainImageId, ...rest } = data;

    const processedData = {
      ...rest,
      // Pass image and category data separately for handling in the parent component
      mainImageId: mainImageId || '',
      selectedImageIds: imageIds || [],
      selectedCategoryIds: categoryIds || [],
    };

    onSave(processedData);
  }


  return (
    <>
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="p-1">
             <div className="grid grid-cols-2 gap-4 mt-4">
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
                 <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                        <Input placeholder="iconic-ktv" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
             </div>
            

            <Controller
                control={form.control}
                name="mainImageId"
                render={({ field }) => {
                  const mainImage = availableImages.find(img => img.id === field.value);
                  
                  return (
                    <FormItem className="mt-4">
                        <FormLabel>Main Image</FormLabel>
                        <FormControl>
                        <div className="w-full">
                            <Button type="button" variant="outline" onClick={() => { setGalleryTarget('main'); setIsGalleryOpen(true); }}>
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Select Main Image
                            </Button>
                            {mainImage && (
                            <div className="mt-2 relative w-48 h-32 border rounded-md overflow-hidden">
                                <Image 
                                    src={mainImage.imageUrl} 
                                    alt="Main image preview" 
                                    fill
                                    className="object-cover" 
                                />
                                <Button type="button" size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => field.onChange('')}>
                                <X className="h-4 w-4" />
                                </Button>
                            </div>
                            )}
                        </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  );
                }}
            />

            <Controller
                control={form.control}
                name="imageIds"
                render={({ field }) => {
                  const selectedImages = (field.value || [])
                    .map(id => availableImages.find(img => img.id === id))
                    .filter(Boolean);
                  
                  return (
                    <FormItem className="mt-4">
                        <FormLabel>Image Gallery</FormLabel>
                        <FormControl>
                        <div>
                            <Button type="button" variant="outline" onClick={() => { setGalleryTarget('multi'); setIsGalleryOpen(true); }}>
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Add to Gallery
                            </Button>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {selectedImages.map((image, index) => (
                                    <div key={image.id} className="relative w-32 h-24 border rounded-md overflow-hidden">
                                    <Image 
                                        src={image.imageUrl} 
                                        alt={`Gallery image ${index + 1}`} 
                                        fill
                                        className="object-cover" 
                                    />
                                <Button type="button" size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => {
                                        const newImageIds = field.value?.filter(id => id !== image.id) || [];
                                        field.onChange(newImageIds);
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
                  );
                }}
            />

            <FormField
                control={form.control}
                name="categoryIds"
                render={({ field }) => {
                  const selectedCategories = availableCategories.filter(cat => field.value?.includes(cat.id));
                  return (
                    <FormItem className="flex flex-col mt-4">
                        <FormLabel>Categories</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                "w-full justify-between",
                                !field.value?.length && "text-muted-foreground"
                                )}
                            >
                                <span className="truncate">
                                {selectedCategories.length > 0
                                ? selectedCategories.map(c => c.name).join(', ')
                                : "Select categories"}
                                </span>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                            <CommandInput placeholder="Search categories..." />
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandList>
                                <CommandGroup>
                                    {availableCategories.map((option) => (
                                    <CommandItem
                                        key={option.id}
                                        onSelect={() => {
                                        const currentIds = field.value || [];
                                        const newIds = currentIds.includes(option.id)
                                            ? currentIds.filter((id: string) => id !== option.id)
                                            : [...currentIds, option.id];
                                        field.onChange(newIds);
                                        }}
                                    >
                                        <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value?.includes(option.id)
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                        />
                                        {option.name}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                            </Command>
                        </PopoverContent>
                        </Popover>
                        <div className="flex flex-wrap gap-1 mt-2">
                        {selectedCategories.map((category) => (
                            <Badge
                            variant="secondary"
                            key={category.id}
                            className="flex items-center gap-1"
                            >
                            {category.name}
                            <button
                                type="button"
                                className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    field.onChange((field.value || []).filter((id: string) => id !== category.id));
                                }
                                }}
                                onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                }}
                                onClick={() => field.onChange((field.value || []).filter((id: string) => id !== category.id))}
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                            </Badge>
                        ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                  );
                }}
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
            </div>
             <div className="grid grid-cols-2 gap-4 mt-4">
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
                 <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Other Contact Info</FormLabel>
                        <FormControl>
                        <Input placeholder="WeChat ID, Telegram..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

           
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem className="mt-4">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="A brief description of the KTV." {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
          </div>
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
                      images={availableImages}
                      emptyText="No images available in media library."
                      onRefresh={loadAvailableImages}
                    />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

KtvForm.displayName = 'KtvForm';

    
    