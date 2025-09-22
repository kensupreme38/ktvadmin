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
import { allArticles as initialArticles } from '@/data/articles';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArticleForm } from '@/components/admin/ArticleForm';
import type { Article } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Published':
      return 'default';
    case 'Draft':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)!;

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleAdd = () => {
    setSelectedArticle(null);
    setIsFormOpen(true);
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setIsFormOpen(true);
  };

  const handleDelete = (slug: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      setArticles(articles.filter((a) => a.slug !== slug));
      toast({ title: 'Article deleted.' });
    }
  };

  const handleSave = (articleData: Omit<Article, 'slug' | 'image'>) => {
    if (selectedArticle) {
      // Update existing article
      const updatedArticle = { ...selectedArticle, ...articleData };
      setArticles(
        articles.map((a) => (a.slug === selectedArticle.slug ? updatedArticle : a))
      );
      toast({ title: 'Article updated successfully!' });
    } else {
      // Add new article
      const newArticle: Article = {
        ...articleData,
        slug: articleData.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50),
        image: getImage('article-1'), // Placeholder, maybe make this selectable in form
      };
      setArticles([newArticle, ...articles]);
      toast({ title: 'New article created!' });
    }
    setIsFormOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Article Management</CardTitle>
          <Button onClick={handleAdd}>Add New Article</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.slug}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>{article.author}</TableCell>
                  <TableCell>{article.publishedDate}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(article.status)}>
                      {article.status}
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(article)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            window.open(`/articles/${article.slug}`, '_blank')
                          }
                        >
                          View Article
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(article.slug)}
                        >
                          Delete
                        </DropdownMenuItem>
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
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {selectedArticle ? 'Edit Article' : 'Add New Article'}
            </DialogTitle>
          </DialogHeader>
          <ArticleForm
            article={selectedArticle}
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
