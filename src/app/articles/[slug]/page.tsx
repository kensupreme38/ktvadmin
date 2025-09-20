import { notFound } from 'next/navigation';
import Image from 'next/image';
import { allArticles } from '@/data/articles';
import { SocialShareButtons } from '@/components/SocialShareButtons';

type ArticlePageProps = {
  params: {
    slug: string;
  };
};

// Generate static pages for all articles
export async function generateStaticParams() {
  return allArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = allArticles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center leading-tight">
            {article.title}
          </h1>
          <p className="text-center text-muted-foreground">
            By {article.author} on {article.publishedDate}
          </p>
        </header>

        <div className="relative w-full h-96 rounded-lg overflow-hidden mb-8 shadow-lg">
          <Image
            src={article.image.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
            data-ai-hint={article.image.imageHint}
          />
        </div>

        <div
          className="prose prose-invert prose-lg max-w-none mx-auto
                     prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground 
                     prose-a:text-primary hover:prose-a:text-primary/80"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="mt-12 pt-8 border-t border-border/40 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Share this article:</h3>
          <SocialShareButtons url={`/articles/${article.slug}`} title={article.title} />
        </div>
      </article>
    </div>
  );
}
