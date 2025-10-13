
'use client';

import { useEffect, useState } from 'react';
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
import { useCategories } from '@/hooks/use-categories';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories.filter(c => c.slug !== 'all'));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const { toast } = useToast();
  const { categories: remoteCategories, isLoading, error, createCategory, deleteCategory, reload } = useCategories();

  useEffect(() => {
    if (error) {
      toast({ title: 'Failed to load categories', description: error, variant: 'destructive' });
    }
  }, [error, toast]);

  useEffect(() => {
    if (remoteCategories && remoteCategories.length) {
      setCategories(remoteCategories);
    } else if (!isLoading) {
      setCategories([]);
    }
  }, [remoteCategories, isLoading]);

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

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    const id = categoryToDelete.id;
    const name = categoryToDelete.name;
    const { error } = await deleteCategory(id);
    if (error) {
      toast({ title: 'Delete failed', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Category Deleted', description: `${name} has been removed.` });
    }
    setIsAlertOpen(false);
    setCategoryToDelete(null);
  };

  const handleRowClick = (slug: string) => {
    router.push(`/admin/categories/${slug}`);
  };
  
  const handleSave = async (categoryData: Omit<Category, 'id'> & { id?: string }) => {
    if (editingCategory) {
      // Local edit only (server update not implemented yet)
      const updatedCategories = categories.map(c =>
        c.id === editingCategory.id ? { ...c, ...categoryData } : c
      );
      setCategories(updatedCategories);
      toast({
        title: 'Category Updated!',
        description: `${categoryData.name} has been updated.`,
      });
      setIsFormOpen(false);
      setEditingCategory(null);
      return;
    }

    try {
      const { category, error } = await createCategory({
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description ?? null,
      });
      if (error) {
        throw new Error(error);
      }
      const newCategory = category as Category;
      setCategories([newCategory, ...categories]);
      toast({
        title: 'New Category Created!',
        description: `${newCategory.name} has been added.`,
      });
      setIsFormOpen(false);
      setEditingCategory(null);
    } catch (e: any) {
      const raw = e?.message || '';
      const conflict = raw.toLowerCase().includes('duplicate') || raw.toLowerCase().includes('unique');
      const message = conflict ? 'Slug already exists. Please choose another.' : (raw || 'Unable to create category');
      toast({ title: 'Create failed', description: message, variant: 'destructive' });
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
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">Loading...</TableCell>
                </TableRow>
              ) : categories.map((category) => (
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
                This action cannot be undone. This will permanently delete the category <strong>{categoryToDelete?.name}</strong>.
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
