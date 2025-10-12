
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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { KtvForm } from '@/components/admin/KtvForm';
import { useToast } from '@/hooks/use-toast';
import type { Ktv } from '@/types';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)!;

const initialKtvs: Ktv[] = [
  {
    id: 'kingdom-ktv',
    name: 'Kingdom KTV',
    address: '28-34 Pasteur, District 1',
    district: 'District 1',
    type: 'High-end',
    description: 'A luxurious KTV experience with state-of-the-art sound systems.',
    priceRange: 'VND 2,000,000 - 5,000,000',
    hours: '2:00 PM - 2:00 AM',
    contact: { phone: '028 3823 8888' },
    cardImage: getImage('ktv-card-1'),
    gallery: [getImage('ktv-hero-1'), getImage('ktv-gallery-1-1'), getImage('ktv-gallery-1-2')],
    reviews: [],
    numberOfRooms: 20
  },
  {
    id: 'nnice-ktv',
    name: 'Nnice KTV',
    address: '231 Le Van Sy, Phu Nhuan',
    district: 'Phu Nhuan',
    type: 'Mid-range',
    description: 'A popular choice for students and young adults.',
    priceRange: 'VND 500,000 - 1,500,000',
    hours: '1:00 PM - 12:00 AM',
    contact: { phone: '028 3991 7566' },
    cardImage: getImage('ktv-card-2'),
    gallery: [],
    reviews: [],
    numberOfRooms: 30
  },
  {
    id: 'icool-ktv',
    name: 'ICOOL KTV',
    address: '123 Vo Van Tan, District 3',
    district: 'District 3',
    type: 'Mid-range',
    description: 'Modern and clean rooms with a wide song selection.',
    priceRange: 'VND 800,000 - 2,000,000',
    hours: '10:00 AM - 1:00 AM',
    contact: { phone: '1900 779 936' },
    cardImage: getImage('ktv-card-3'),
    gallery: [],
    reviews: [],
    numberOfRooms: 25
  },
  {
    id: 'catwalk-ktv',
    name: 'Catwalk KTV',
    address: '4A Ton Duc Thang, District 1',
    district: 'District 1',
    type: 'High-end',
    description: 'The place to see and be seen. Very high-end.',
    priceRange: 'VND 3,000,000 - 10,000,000',
    hours: '6:00 PM - 3:00 AM',
    contact: { phone: '028 3824 6777' },
    cardImage: getImage('ktv-card-4'),
    gallery: [],
    reviews: [],
    numberOfRooms: 15
  },
];


const getKtvTypeVariant = (type: string) => {
  switch (type) {
    case 'High-end':
      return 'destructive';
    case 'Mid-range':
      return 'default';
    case 'Budget':
      return 'secondary';
    default:
      return 'outline';
  }
};

export default function AdminKtvsPage() {
  const [ktvs, setKtvs] = useState<Ktv[]>(initialKtvs);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedKtv, setSelectedKtv] = useState<Ktv | null>(null);
  const { toast } = useToast();

  const handleAdd = () => {
    setSelectedKtv(null);
    setIsFormOpen(true);
  };

  const handleEdit = (ktv: Ktv) => {
    setSelectedKtv(ktv);
    setIsFormOpen(true);
  };

  const handleSave = (ktvData: Ktv) => {
    if (selectedKtv) {
      // Update
      setKtvs(
        ktvs.map((k) =>
          k.id === selectedKtv.id ? { ...k, ...ktvData } : k
        )
      );
      toast({ title: 'KTV updated successfully!' });
    } else {
      // Add
      const newKtv: Ktv = {
        ...ktvData,
        id: `ktv_${Date.now()}`,
      };
      setKtvs([newKtv, ...ktvs]);
      toast({
        title: 'New KTV Created!',
        description: `${newKtv.name} has been added to the directory.`,
      });
    }
    setIsFormOpen(false);
  };

  const handleDelete = (ktvId: string) => {
    if (confirm('Are you sure you want to delete this KTV?')) {
      setKtvs(ktvs.filter(k => k.id !== ktvId));
      toast({
        title: 'KTV Deleted',
        description: 'The KTV has been successfully removed.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>KTV Management</CardTitle>
          <Button onClick={handleAdd}>
             <PlusCircle className="mr-2 h-4 w-4" />
            Add New KTV
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ktvs.map((ktv) => (
                <TableRow key={ktv.id}>
                   <TableCell>
                      <Image
                        src={ktv.cardImage?.imageUrl || "https://placehold.co/100x75"}
                        alt={ktv.name}
                        width={100}
                        height={75}
                        className="rounded-md object-cover"
                      />
                  </TableCell>
                  <TableCell className="font-medium">{ktv.name}</TableCell>
                   <TableCell>{ktv.district}</TableCell>
                  <TableCell>
                     <Badge variant={getKtvTypeVariant(ktv.type)}>{ktv.type}</Badge>
                  </TableCell>
                  <TableCell>{ktv.contact.phone}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(ktv)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(ktv.id)}>Delete</DropdownMenuItem>
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedKtv ? 'Edit KTV' : 'Add New KTV'}</DialogTitle>
          </DialogHeader>
          <KtvForm
            ktv={selectedKtv}
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
