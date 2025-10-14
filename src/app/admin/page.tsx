"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useKtvs } from "@/hooks/use-ktvs";
import { useMemo, useCallback, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDebouncedCallback } from "use-debounce";

const getCategoryName = (categories: any[]) => {
  if (!categories || categories.length === 0) return "N/A";
  // Return the name of the first category
  return categories[0]?.name || "N/A";
};

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

function AdminKtvsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { toast } = useToast();

  const itemsPerPage = 10;
  const searchTerm = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const { ktvs, totalCount, isLoading, refreshKtvs } = useKtvs(searchTerm, currentPage, itemsPerPage);

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const handleRowClick = (ktvId: string) => {
    router.push(`/admin/ktvs/${ktvId}`);
  };

  const handleRefresh = async () => {
    try {
      await refreshKtvs();
      toast({
        title: "Data Refreshed",
        description: "KTV data has been refreshed from the database.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error refreshing data",
        description: error.message || "Failed to refresh data",
      });
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(`${pathname}?${createQueryString({ page })}`);
    }
  };

  const handleSearchChange = useDebouncedCallback((term: string) => {
    router.push(
      `${pathname}?${createQueryString({ search: term || null, page: 1 })}`
    );
  }, 300);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const page = value ? Number(value) : 1;
    if (page > 0 && page <= totalPages) {
      handlePageChange(page);
    }
  };

  const handlePageInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const page = Number(e.target.value);
    if (page < 1) {
      handlePageChange(1);
    } else if (page > totalPages) {
      handlePageChange(totalPages);
    }
  };

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
              defaultValue={searchTerm}
              onChange={(e) => {
                handleSearchChange(e.target.value);
              }}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Refresh Data</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: "15%" }}>Image</TableHead>
                  <TableHead style={{ width: "30%" }}>Name</TableHead>
                  <TableHead style={{ width: "20%" }}>City</TableHead>
                  <TableHead style={{ width: "15%" }}>Category</TableHead>
                  <TableHead style={{ width: "20%" }}>Phone</TableHead>
                </TableRow>
              </TableHeader>
               <TableBody>
                 {ktvs.map((ktv) => {
                   const categoryName = getCategoryName(ktv.categories || []);
                   return (
                     <TableRow
                       key={ktv.id}
                       onClick={() => handleRowClick(ktv.id)}
                       className="cursor-pointer"
                     >
                       <TableCell className="align-middle">
                         <Image
                           src={
                             ktv.main_image_url || "https://placehold.co/100x75"
                           }
                           alt={ktv.name}
                           width={100}
                           height={75}
                           className="rounded-md object-cover"
                         />
                       </TableCell>
                       <TableCell className="font-medium align-middle">
                         {ktv.name}
                       </TableCell>
                       <TableCell className="align-middle">{ktv.city}</TableCell>
                       <TableCell className="align-middle">
                         <Badge variant="secondary">{categoryName}</Badge>
                       </TableCell>
                       <TableCell className="align-middle">
                         {ktv.phone}
                       </TableCell>
                     </TableRow>
                   );
                 })}
              </TableBody>
            </Table>
          )}
          {!isLoading && ktvs.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No KTVs found matching your search.
            </div>
          )}
        </CardContent>
        {totalPages > 1 && (
          <CardFooter className="flex items-center justify-between border-t bg-background px-6 py-3">
            <div className="text-xs text-muted-foreground">
              Showing{" "}
              <strong>
                {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, totalCount)}
              </strong>{" "}
              of <strong>{totalCount}</strong> KTVs
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <div className="flex items-center gap-1.5">
                <Input
                  key={currentPage}
                  type="number"
                  min="1"
                  max={totalPages}
                  defaultValue={currentPage}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const page = Number((e.target as HTMLInputElement).value);
                      if (page > 0 && page <= totalPages) {
                        handlePageChange(page);
                      }
                    }
                  }}
                  onBlur={handlePageInputBlur}
                  className="h-8 w-12 text-center"
                />
                <span className="text-muted-foreground">/ {totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  );
}

export default function AdminKtvsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <AdminKtvsPageContent />
    </Suspense>
  );
}
