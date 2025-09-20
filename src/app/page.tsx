'use client';

import { useState, useMemo } from 'react';
import { KtvCard } from '@/components/ktv/KtvCard';
import { FilterControls } from '@/components/ktv/FilterControls';
import { allKtvs, Ktv } from '@/data/ktvs';

export default function Home() {
  const [filters, setFilters] = useState({
    search: '',
    district: 'all',
    type: 'all',
    services: 'all',
  });

  const filteredKtvs = useMemo(() => {
    return allKtvs.filter((ktv: Ktv) => {
      const searchLower = filters.search.toLowerCase();
      const nameMatch = ktv.name.toLowerCase().includes(searchLower);
      const districtMatch = filters.district === 'all' || ktv.district === filters.district;
      const typeMatch = filters.type === 'all' || ktv.type === filters.type;
      const servicesMatch = filters.services === 'all' || ktv.services.includes(filters.services);
      return nameMatch && districtMatch && typeMatch && servicesMatch;
    });
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-headline font-bold mb-2">Find Your Stage</h1>
        <p className="text-lg text-muted-foreground">
          Explore the best KTV spots in Ho Chi Minh City.
        </p>
      </header>

      <FilterControls onFilterChange={setFilters} />

      {filteredKtvs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredKtvs.map((ktv) => (
            <KtvCard key={ktv.id} ktv={ktv} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No KTVs found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
