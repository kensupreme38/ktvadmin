
'use client';

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
import { useToast } from '@/hooks/use-toast';
import type { Ktv } from '@/types';
import Image from 'next/image';
import { allCategories } from '@/data/categories';
import { useKtvData } from '@/hooks/use-ktv-data';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


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

const TableSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Phone</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-[75px] w-[100px] rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[150px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-[80px] rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[120px]" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
);


export default function AdminKtvsPage() {
  const { ktvs, isLoading } = useKtvData();
  const router = useRouter();

  const handleRowClick = (ktvId: string) => {
    router.push(`/admin/ktvs/${ktvId}`);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>KTV Management</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? <TableSkeleton /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ktvs.map((ktv) => {
                  const categoryName = getCategoryName(ktv.categoryId);
                  return (
                      <TableRow key={ktv.id} onClick={() => handleRowClick(ktv.id)} className="cursor-pointer">
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
                      </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
