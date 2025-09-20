
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const bookings = [
  { id: 'book_1', customerName: 'Nguyen Van A', ktvName: 'Kingdom KTV', roomType: 'VIP Room', bookingDate: '2024-07-20', bookingTime: '8:00 PM', status: 'Confirmed' },
  { id: 'book_2', customerName: 'Tran Thi B', ktvName: 'Nnice KTV', roomType: 'Medium Room', bookingDate: '2024-07-21', bookingTime: '7:30 PM', status: 'Pending' },
  { id: 'book_3', customerName: 'Le Van C', ktvName: 'ICOOL KTV', roomType: 'Party Room', bookingDate: '2024-07-22', bookingTime: '9:00 PM', status: 'Canceled' },
  { id: 'book_4', customerName: 'Pham Thi D', ktvName: 'Catwalk KTV', roomType: 'Deluxe Room', bookingDate: '2024-07-23', bookingTime: '10:00 PM', status: 'Confirmed' },
];

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Confirmed': return 'default';
        case 'Pending': return 'secondary';
        case 'Canceled': return 'destructive';
        default: return 'outline';
    }
}

export default function AdminBookingsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Booking Management</CardTitle>
        <div className="flex items-center gap-2">
            <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
            </Button>
            <Button>Add New Booking</Button>
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
                <TableCell>{booking.bookingDate} at {booking.bookingTime}</TableCell>
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
                      <DropdownMenuItem>View Details</DropdownMenuItem>
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
  );
}
