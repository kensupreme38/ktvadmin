
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
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/types';
import { allCategories as initialCategories } from '@/data/categories';
import { CategoryForm } from '@/components/admin/CategoryForm';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleSave = (categoryData: Omit<Category, 'id'>) => {
    if (selectedCategory) {
      // Update
      const updatedCategory = { ...selectedCategory, ...categoryData };
      setCategories(
        categories.map((c) =>
          c.id === selectedCategory.id ? updatedCategory : c
        )
      );
      toast({ title: 'Category updated successfully!' });
    } else {
      // Add
      const newCategory: Category = {
        ...categoryData,
        id: `cat_${Date.now()}`,
      };
      setCategories([newCategory, ...categories]);
      toast({
        title: 'New Category Created!',
        description: `${newCategory.name} has been added.`,
      });
    }
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
                <TableRow key={category.id} onClick={() => handleEdit(category)} className="cursor-pointer">
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
            <DialogTitle>{selectedCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={selectedCategory}
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
