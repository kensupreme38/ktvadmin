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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Booking } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const allKtvs = [
    { id: 'kingdom-ktv', name: 'Kingdom KTV' },
    { id: 'nnice-ktv', name: 'Nnice KTV' },
    { id: 'icool-ktv', name: 'ICOOL KTV' },
    { id: 'catwalk-ktv', name: 'Catwalk KTV' },
];

const formSchema = z.object({
  customerName: z.string().min(2, { message: 'Name is required.' }),
  ktvId: z.string({ required_error: 'Please select a KTV.' }),
  roomType: z.string().min(2, { message: 'Room type is required.' }),
  bookingDate: z.date({
    required_error: "A booking date is required.",
  }),
  bookingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s(AM|PM)$/, { message: "Invalid time format (e.g., 8:00 PM)"}),
  status: z.enum(['Confirmed', 'Pending', 'Canceled']),
});

type BookingFormValues = Omit<z.infer<typeof formSchema>, 'bookingDate'> & {
    bookingDate: string;
};

interface BookingFormProps {
  booking: Booking | null;
  onSave: (data: Omit<BookingFormValues, 'id' | 'ktvName'>) => void;
  onCancel: () => void;
}

export function BookingForm({ booking, onSave, onCancel }: BookingFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: booking?.customerName ?? '',
      ktvId: booking?.ktvId ?? '',
      roomType: booking?.roomType ?? '',
      bookingDate: booking?.bookingDate ? new Date(booking.bookingDate) : new Date(),
      bookingTime: booking?.bookingTime ?? '08:00 PM',
      status: booking?.status ?? 'Pending',
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    onSave({
        ...data,
        bookingDate: format(data.bookingDate, 'yyyy-MM-dd')
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input placeholder="Nguyen Van A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ktvId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>KTV</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a KTV" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {allKtvs.map(ktv => (
                    <SelectItem key={ktv.id} value={ktv.id}>{ktv.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roomType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Type</FormLabel>
              <FormControl>
                <Input placeholder="VIP Room" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="bookingDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Booking Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date < new Date()
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="bookingTime"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Booking Time</FormLabel>
                    <FormControl>
                        <Input placeholder="08:00 PM" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
         <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Booking</Button>
        </div>
      </form>
    </Form>
  );
}
