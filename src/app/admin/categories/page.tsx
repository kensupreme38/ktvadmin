
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
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/types';
import { allCategories as initialCategories } from '@/data/categories';
import { CategoryForm } from '@/components/admin/CategoryForm';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleAdd = () => {
    setIsFormOpen(true);
  };

  const handleRowClick = (slug: string) => {
    if (slug === 'all') return;
    router.push(`/admin/categories/${slug}`);
  };
  
  const handleSave = (categoryData: Omit<Category, 'id'>) => {
    // For now, we are not really saving to a persistent store.
    // This just updates the local state.
    const newCategory: Category = {
      ...categoryData,
      id: `cat_${Date.now()}`,
    };
    setCategories([newCategory, ...categories]);
    toast({
      title: 'New Category Created!',
      description: `${newCategory.name} has been added.`,
    });
    
    setIsFormOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Category Management</CardTitle>
          <Button onClick={handleAdd}>
             <PlusCircle className="mr-2 h-4 w-4" />
            Add New Category
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow 
                  key={category.id} 
                  onClick={() => handleRowClick(category.slug)} 
                  className={category.slug === 'all' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                >
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={null}
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
