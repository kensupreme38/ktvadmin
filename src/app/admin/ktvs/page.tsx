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
import { allKtvs as initialKtvs } from '@/data/ktvs';
import type { Ktv } from '@/types';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { KtvForm } from '@/components/admin/KtvForm';

export default function AdminKtvsPage() {
  const [ktvs, setKtvs] = useState<Ktv[]>(initialKtvs);
  const [selectedKtv, setSelectedKtv] = useState<Ktv | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAdd = () => {
    setSelectedKtv(null);
    setIsFormOpen(true);
  };

  const handleEdit = (ktv: Ktv) => {
    setSelectedKtv(ktv);
    setIsFormOpen(true);
  };

  const handleDelete = (ktvId: string) => {
    if (confirm('Are you sure you want to delete this KTV?')) {
      setKtvs(ktvs.filter((k) => k.id !== ktvId));
    }
  };

  const handleSave = (ktvData: Ktv) => {
    if (selectedKtv) {
      // Update existing KTV
      setKtvs(ktvs.map((k) => (k.id === ktvData.id ? ktvData : k)));
    } else {
      // Add new KTV
      setKtvs([...ktvs, { ...ktvData, id: `ktv-${Date.now()}` }]);
    }
    setIsFormOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>KTV Management</CardTitle>
          <Button onClick={handleAdd}>Add New KTV</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ktvs.map((ktv) => (
                <TableRow key={ktv.id}>
                  <TableCell className="font-medium">{ktv.name}</TableCell>
                  <TableCell>{ktv.district}</TableCell>
                  <TableCell>{ktv.type}</TableCell>
                  <TableCell>
                    <Badge variant="default">Published</Badge>
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
                        <DropdownMenuItem onClick={() => handleEdit(ktv)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(ktv.id)}
                        >
                          Delete
                        </DropdownMenuItem>
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
          <KtvForm ktv={selectedKtv} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
