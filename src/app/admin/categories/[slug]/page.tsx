"use client";

import { useParams, useRouter } from "next/navigation";
import { useKtvData } from "@/hooks/use-ktv-data";
import { allCategories } from "@/data/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const TableSkeleton = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Image</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>City</TableHead>
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
            <Skeleton className="h-4 w-[120px]" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default function CategoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { ktvs, isLoading } = useKtvData();

  const slug = typeof params.slug === "string" ? params.slug : "";
  const category = allCategories.find((c) => c.slug === slug);
  const categoryId = category?.id;

  // TODO: Update to use useKtvs hook with Supabase for category filtering
  // const filteredKtvs = categoryId
  //   ? ktvs.filter(
  //       (ktv) =>
  //         Array.isArray(ktv.categories) && ktv.categories.some(c => c.id === categoryId)
  //     )
  //   : [];
  const filteredKtvs: any[] = []; // Placeholder until Supabase integration

  const handleKtvClick = (ktvId: string) => {
    router.push(`/admin/ktvs/${ktvId}`);
  };

  if (!category) {
    return (
      <div className="text-center py-10">
        <p className="text-lg font-semibold">Category not found</p>
        <Button
          onClick={() => router.push("/admin/categories")}
          className="mt-4"
        >
          Go Back to Categories
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {category.name}
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>KTVs in {category.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : filteredKtvs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKtvs.map((ktv) => (
                  <TableRow
                    key={ktv.id}
                    onClick={() => handleKtvClick(ktv.id)}
                    className="cursor-pointer"
                  >
                    <TableCell className="align-middle">
                      <Image
                        src={ktv.main_image_url || "https://placehold.co/100x75"}
                        alt={ktv.name}
                        width={100}
                        height={75}
                        className="rounded-md object-cover"
                        loading="lazy"
                        quality={60}
                        sizes="100px"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN89+7dfwAJRQOi3pdVgQAAAABJRU5ErkJggg=="
                      />
                    </TableCell>
                    <TableCell className="font-medium align-middle">
                      {ktv.name}
                    </TableCell>
                    <TableCell className="align-middle">{ktv.city}</TableCell>
                    <TableCell className="align-middle">{ktv.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No KTVs found in this category.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
