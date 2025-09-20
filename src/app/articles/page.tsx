import Link from 'next/link';
import Image from 'next/image';
import { allArticles } from '@/data/articles';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function ArticlesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-2">Aura Insights</h1>
        <p className="text-lg text-muted-foreground">
          Your guide to KTV culture, reviews, and insider tips.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allArticles.map((article) => (
          <Link key={article.slug} href={`/articles/${article.slug}`} className="group">
            <Card className="h-full flex flex-col transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
              <CardHeader className="p-0">
                <div className="relative h-56 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src={article.image.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={article.image.imageHint}
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 flex flex-col flex-grow">
                <p className="text-sm text-muted-foreground mb-2">{article.publishedDate}</p>
                <h2 className="text-xl font-semibold mb-3">{article.title}</h2>
                <p className="text-muted-foreground flex-grow mb-4">{article.excerpt}</p>
                 <div className="flex items-center text-sm font-semibold text-primary">
                    Read more
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
