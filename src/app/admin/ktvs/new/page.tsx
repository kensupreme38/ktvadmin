
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KtvForm } from '@/components/admin/KtvForm';
import { useToast } from '@/hooks/use-toast';
import type { Ktv } from '@/types';
// In a real app, you would fetch/mutate data from a database
// For now, we just show a toast and redirect.

export default function NewKtvPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSave = (ktvData: Ktv) => {
    const newKtv: Ktv = {
      ...ktvData,
      id: `ktv_${Date.now()}`,
      slug: ktvData.name.toLowerCase().replace(/\s+/g, '-'),
    };
    
    toast({
      title: 'New KTV Created!',
      description: `${newKtv.name} has been added to the directory.`,
    });

    // In a real app, you would save the data and then redirect.
    // For this demo, we'll just redirect.
    console.log('New KTV data:', newKtv);
    router.push('/admin');
  };

  const handleCancel = () => {
    router.push('/admin');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New KTV</CardTitle>
      </CardHeader>
      <CardContent>
        <KtvForm onSave={handleSave} onCancel={handleCancel} />
      </CardContent>
    </Card>
  );
}
