
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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

  const handleDelete = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== categoryId));
      toast({
        title: 'Category Deleted',
        description: 'The category has been successfully removed.',
        variant: 'destructive',
      });
    }
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(category)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(category.id)}>Delete</DropdownMenuItem>
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
