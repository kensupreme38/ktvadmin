
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
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/types';
import { allCategories as initialCategories } from '@/data/categories';
import { CategoryForm } from '@/components/admin/CategoryForm';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories.filter(c => c.slug !== 'all'));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const { toast } = useToast();

  const handleAdd = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };
  
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
        // This is a mock delete, it does not persist.
        setCategories(categories.filter(c => c.id !== categoryToDelete.id));
        toast({
            title: 'Category Deleted',
            description: `${categoryToDelete.name} has been removed.`,
            variant: 'destructive',
        });
        setIsAlertOpen(false);
        setCategoryToDelete(null);
    }
  };

  const handleRowClick = (slug: string) => {
    router.push(`/admin/categories/${slug}`);
  };
  
  const handleSave = (categoryData: Omit<Category, 'id'> & { id?: string }) => {
    if (editingCategory) { // Editing existing category
        const updatedCategories = categories.map(c => 
            c.id === editingCategory.id ? { ...c, ...categoryData } : c
        );
        setCategories(updatedCategories);
        toast({
            title: 'Category Updated!',
            description: `${categoryData.name} has been updated.`,
        });
    } else { // Adding new category
        const newCategory: Category = {
            id: `cat_${Date.now()}`,
            ...categoryData,
        };
        setCategories([newCategory, ...categories]);
        toast({
            title: 'New Category Created!',
            description: `${newCategory.name} has been added.`,
        });
    }
    
    setIsFormOpen(false);
    setEditingCategory(null);
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
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium cursor-pointer" onClick={() => handleRowClick(category.slug)}>{category.name}</TableCell>
                  <TableCell className="cursor-pointer" onClick={() => handleRowClick(category.slug)}>{category.slug}</TableCell>
                  <TableCell className="text-muted-foreground cursor-pointer" onClick={() => handleRowClick(category.slug)}>{category.description}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(category)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                    </Button>
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
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={editingCategory}
            onSave={handleSave}
            onCancel={() => {
                setIsFormOpen(false);
                setEditingCategory(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the category
                and remove it from any KTVs it's associated with.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
