interface KtvCardProps {
  ktv: any;
}

export function KtvCard({ ktv }: KtvCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold">{ktv.name}</h3>
      <p className="text-sm text-gray-600">{ktv.city}</p>
    </div>
  );
}
