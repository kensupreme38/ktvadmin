
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Ktv } from '@/types';
import Image from 'next/image';
import { allCategories } from '@/data/categories';
import { useKtvData } from '@/hooks/use-ktv-data';
import { useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


const getCategoryName = (categoryIds: string[]) => {
    if (!categoryIds || categoryIds.length === 0) return 'N/A';
    // Return the name of the first category
    return allCategories.find(c => c.id === categoryIds[0])?.name || 'N/A';
}

const TableSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[15%]">Image</TableHead>
          <TableHead className="w-[30%]">Name</TableHead>
          <TableHead className="w-[20%]">City</TableHead>
          <TableHead className="w-[15%]">Category</TableHead>
          <TableHead className="w-[20%]">Phone</TableHead>
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
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleRowClick = (ktvId: string) => {
    router.push(`/admin/ktvs/${ktvId}`);
  };

  const handleRefresh = () => {
    if (confirm('Are you sure you want to reset all KTV data to the initial default state? All your changes will be lost.')) {
        localStorage.removeItem('ktv_data');
        toast({
            title: "Data Reset",
            description: "KTV data has been reset to its initial state. The page will now reload."
        });
        setTimeout(() => window.location.reload(), 1500);
    }
  }

  const filteredKtvs = useMemo(() => ktvs.filter(ktv => 
    ktv.name.toLowerCase().includes(searchTerm.toLowerCase())
  ), [ktvs, searchTerm]);

  const totalPages = Math.ceil(filteredKtvs.length / itemsPerPage);
  const paginatedKtvs = filteredKtvs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  
  // Reset to page 1 when search term changes
  useState(() => {
    setCurrentPage(1);
  });

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>KTV Management</CardTitle>
          <div className="relative ml-auto flex items-center gap-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on new search
              }}
            />
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4"/>
                <span className="sr-only">Refresh Data</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <TableSkeleton /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{width: '15%'}}>Image</TableHead>
                  <TableHead style={{width: '30%'}}>Name</TableHead>
                  <TableHead style={{width: '20%'}}>City</TableHead>
                  <TableHead style={{width: '15%'}}>Category</TableHead>
                  <TableHead style={{width: '20%'}}>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedKtvs.map((ktv) => {
                  const categoryName = getCategoryName(ktv.categoryIds);
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
         {totalPages > 1 && (
            <CardFooter className="flex items-center justify-between border-t bg-background px-6 py-3">
                <div className="text-xs text-muted-foreground">
                    Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </CardFooter>
        )}
      </Card>
    </>
  );
}
