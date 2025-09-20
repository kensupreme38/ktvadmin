import { notFound } from 'next/navigation';
import { allKtvs } from '@/data/ktvs';
import KtvPageClient from '@/components/ktv/KtvPageClient';
import type { Ktv } from '@/types';

type KtvPageProps = {
  params: {
    id: string;
  };
};

// This is now a Server Component
export default function KtvPage({ params }: KtvPageProps) {
  const ktv = allKtvs.find((k) => k.id === params.id);

  if (!ktv) {
    notFound();
  }

  // We pass the fetched data to the client component
  return <KtvPageClient ktv={ktv} />;
}
