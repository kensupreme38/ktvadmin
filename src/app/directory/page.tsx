'use client';

import { KtvCard } from '@/components/ktv/KtvCard';
import { allKtvs } from '@/data/ktvs';

export default function DirectoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-2">KTV Directory</h1>
        <p className="text-lg text-muted-foreground">
          Find the perfect KTV for your night out in Ho Chi Minh City.
        </p>
      </header>

      {allKtvs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {allKtvs.map((ktv) => (
            <KtvCard key={ktv.id} ktv={ktv} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No KTVs found.</p>
        </div>
      )}
    </div>
  );
}
