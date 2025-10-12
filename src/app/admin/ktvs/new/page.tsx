
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { KtvForm } from '@/components/admin/KtvForm';
import { useToast } from '@/hooks/use-toast';
import type { Ktv } from '@/types';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { useKtvData } from '@/hooks/use-ktv-data';

export default function NewKtvPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addKtv } = useKtvData();
  const formRef = useRef<{ submit: () => void }>(null);

  const handleSave = (ktvData: Omit<Ktv, 'id'>) => {
    const newKtv: Ktv = {
      ...ktvData,
      id: `ktv_${Date.now()}`,
    };
    
    addKtv(newKtv);

    toast({
      title: 'New KTV Created!',
      description: `${newKtv.name} has been added to the directory.`,
    });

    router.push('/admin');
  };

  const handleCancel = () => {
    router.push('/admin');
  };

  const triggerFormSubmit = () => {
    formRef.current?.submit();
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Add New KTV</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <KtvForm ref={formRef} onSave={handleSave} />
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={triggerFormSubmit}>Save</Button>
      </CardFooter>
    </Card>
  );
}
