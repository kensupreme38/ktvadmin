'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookingForm } from '@/components/admin/BookingForm';
import { useToast } from '@/hooks/use-toast';
import type { Booking } from '@/types';
import { allKtvs } from '@/data/ktvs';

const initialBookings: Booking[] = [
  {
    id: 'book_1',
    customerName: 'Nguyen Van A',
    ktvId: 'kingdom-ktv',
    ktvName: 'Kingdom KTV',
    roomType: 'VIP Room',
    bookingDate: '2024-07-20',
    bookingTime: '8:00 PM',
    status: 'Confirmed',
  },
  {
    id: 'book_2',
    customerName: 'Tran Thi B',
    ktvId: 'nnice-ktv',
    ktvName: 'Nnice KTV',
    roomType: 'Medium Room',
    bookingDate: '2024-07-21',
    bookingTime: '7:30 PM',
    status: 'Pending',
  },
  {
    id: 'book_3',
    customerName: 'Le Van C',
    ktvId: 'icool-ktv',
    ktvName: 'ICOOL KTV',
    roomType: 'Party Room',
    bookingDate: '2024-07-22',
    bookingTime: '9:00 PM',
    status: 'Canceled',
  },
  {
    id: 'book_4',
    customerName: 'Pham Thi D',
    ktvId: 'catwalk-ktv',
    ktvName: 'Catwalk KTV',
    roomType: 'Deluxe Room',
    bookingDate: '2024-07-23',
    bookingTime: '10:00 PM',
    status: 'Confirmed',
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Canceled':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { toast } = useToast();

  const handleAdd = () => {
    setSelectedBooking(null);
    setIsFormOpen(true);
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsFormOpen(true);
  };

  const handleSave = (bookingData: Omit<Booking, 'id' | 'ktvName'>) => {
    const ktv = allKtvs.find(k => k.id === bookingData.ktvId);
    
    if (selectedBooking) {
      // Update
      const updatedBooking = { ...selectedBooking, ...bookingData, ktvName: ktv?.name || '' };
      setBookings(
        bookings.map((b) =>
          b.id === selectedBooking.id ? updatedBooking : b
        )
      );
      toast({ title: 'Booking updated successfully!' });
    } else {
      // Add
      const newBooking: Booking = {
        id: `book_${Date.now()}`,
        ...bookingData,
        ktvName: ktv?.name || '',
      };
      setBookings([newBooking, ...bookings]);
      toast({
        title: 'New Booking Created!',
        description: `${newBooking.customerName} has booked a ${newBooking.roomType} at ${newBooking.ktvName}.`,
      });
    }
    setIsFormOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Booking Management</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button onClick={handleAdd}>Add New Booking</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>KTV</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.customerName}</TableCell>
                  <TableCell>{booking.ktvName}</TableCell>
                  <TableCell>{booking.roomType}</TableCell>
                  <TableCell>
                    {booking.bookingDate} at {booking.bookingTime}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(booking)}>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>Confirm Booking</DropdownMenuItem>
                        <DropdownMenuItem>Cancel Booking</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedBooking ? 'Edit Booking' : 'Add New Booking'}</DialogTitle>
          </DialogHeader>
          <BookingForm
            booking={selectedBooking}
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
