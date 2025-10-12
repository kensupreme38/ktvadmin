
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { MoreHorizontal } from 'lucide-react';
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
import { initialKtvs } from '@/data/ktvs';
import { allCategories } from '@/data/categories';


const getKtvTypeVariant = (categoryName: string) => {
  switch (categoryName) {
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

const getCategoryName = (categoryId: string) => {
    return allCategories.find(c => c.id === categoryId)?.name || 'N/A';
}

export default function AdminKtvsPage() {
  const [ktvs, setKtvs] = useState<Ktv[]>(initialKtvs);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedKtv, setSelectedKtv] = useState<Ktv | null>(null);
  const { toast } = useToast();
  const router = useRouter();

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
    }
    // "Add" case is handled by the new page
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
        <CardHeader>
          <CardTitle>KTV Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ktvs.map((ktv) => {
                const categoryName = getCategoryName(ktv.categoryId);
                return (
                    <TableRow key={ktv.id}>
                    <TableCell>
                        <Image
                            src={ktv.mainImageUrl || "https://placehold.co/100x75"}
                            alt={ktv.name}
                            width={100}
                            height={75}
                            className="rounded-md object-cover"
                        />
                    </TableCell>
                    <TableCell className="font-medium">{ktv.name}</TableCell>
                    <TableCell>{ktv.city}</TableCell>
                    <TableCell>
                        <Badge variant={getKtvTypeVariant(categoryName)}>{categoryName}</Badge>
                    </TableCell>
                    <TableCell>{ktv.phone}</TableCell>
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
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit KTV</DialogTitle>
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
