export default async function KtvDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">KTV Detail</h1>
      <p className="text-gray-600">KTV ID: {id}</p>
      <p className="text-gray-600 mt-2">Detail page coming soon...</p>
    </div>
  );
}
