
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
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';


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
            <TableCell className="align-middle">
              <Skeleton className="h-[75px] w-[100px] rounded-md" />
            </TableCell>
            <TableCell className="align-middle">
              <Skeleton className="h-4 w-[150px]" />
            </TableCell>
            <TableCell className="align-middle">
              <Skeleton className="h-4 w-[100px]" />
            </TableCell>
            <TableCell className="align-middle">
              <Skeleton className="h-6 w-[80px] rounded-full" />
            </TableCell>
            <TableCell className="align-middle">
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
  const [searchTerm, setSearchTerm] = useState('');

  const handleRowClick = (ktvId: string) => {
    router.push(`/admin/ktvs/${ktvId}`);
  };

  const filteredKtvs = ktvs.filter(ktv => 
    ktv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>KTV Management</CardTitle>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
                {filteredKtvs.map((ktv) => {
                  const categoryName = getCategoryName(ktv.categoryId);
                  return (
                      <TableRow key={ktv.id} onClick={() => handleRowClick(ktv.id)} className="cursor-pointer">
                      <TableCell className="align-middle">
                          <Image
                              src={ktv.mainImageUrl || "https://placehold.co/100x75"}
                              alt={ktv.name}
                              width={100}
                              height={75}
                              className="rounded-md object-cover"
                          />
                      </TableCell>
                      <TableCell className="font-medium align-middle">{ktv.name}</TableCell>
                      <TableCell className="align-middle">{ktv.city}</TableCell>
                      <TableCell className="align-middle">
                          <Badge variant="secondary">{categoryName}</Badge>
                      </TableCell>
                      <TableCell className="align-middle">{ktv.phone}</TableCell>
                      </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
           { !isLoading && filteredKtvs.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    No KTVs found matching your search.
                </div>
            )}
        </CardContent>
      </Card>
    </>
  );
}
