export default async function ArticleDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Article Detail</h1>
      <p className="text-gray-600">Article Slug: {slug}</p>
      <p className="text-gray-600 mt-2">Article detail page coming soon...</p>
    </div>
  );
}
