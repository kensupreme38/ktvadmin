
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import type { Ktv } from '@/types';
import { allCategories } from '@/data/categories';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  mainImageUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  images: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  categoryId: z.string({ required_error: 'Please select a category.' }),
  price: z.string().optional(),
  hours: z.string().optional(),
  description: z.string().optional(),
  contact: z.string().optional(),
});

type KtvFormValues = z.infer<typeof formSchema>;

interface KtvFormProps {
  ktv: Ktv | null;
  onSave: (data: Ktv) => void;
  onCancel: () => void;
}

export function KtvForm({ ktv, onSave, onCancel }: KtvFormProps) {
  const { toast } = useToast();
  
  const defaultValues: KtvFormValues = {
    name: ktv?.name ?? '',
    mainImageUrl: ktv?.mainImageUrl ?? '',
    images: ktv?.images?.join('\n') ?? '',
    address: ktv?.address ?? '',
    city: ktv?.city ?? 'Ho Chi Minh City',
    country: ktv?.country ?? 'Vietnam',
    phone: ktv?.phone ?? '',
    categoryId: ktv?.categoryId ?? allCategories[1].id,
    price: ktv?.price ?? '',
    hours: ktv?.hours ?? '',
    description: ktv?.description ? JSON.stringify(ktv.description, null, 2) : '',
    contact: ktv?.contact ?? '',
  };

  const form = useForm<KtvFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(data: KtvFormValues) {
    const { images, description, ...rest } = data;
    
    let parsedDescription;
    try {
        if (description) {
            parsedDescription = JSON.parse(description);
        } else {
            parsedDescription = {};
        }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Invalid JSON in Description",
            description: "Please ensure the description is a valid JSON object or empty.",
        });
        return;
    }

    const fullKtvData: Ktv = {
      ...(ktv || {
        id: '',
        slug: '',
        isActive: true,
      }),
      ...rest,
      images: images ? images.split('\n').filter(url => url.trim() !== '') : [],
      description: parsedDescription,
    };
    onSave(fullKtvData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
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
          name="mainImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/main-image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Gallery URLs</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter one URL per line" {...field} rows={4}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="35 Selegie Rd" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Ho Chi Minh City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Vietnam" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
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
                          {allCategories.map(cat => (
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
        <div className="grid grid-cols-2 gap-4">
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
            name="description"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description (JSON)</FormLabel>
                <FormControl>
                    <Textarea placeholder='{ "summary": "A great place...", "features": ["Karaoke", "Bar"] }' {...field} rows={5} />
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

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
