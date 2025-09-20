'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '../ui/card';

interface FilterControlsProps {
  onFilterChange: (filters: { search: string; district: string; type: string; services: string; }) => void;
}

const districts = ['District 1', 'District 3', 'District 5', 'District 7', 'Phu Nhuan'];
const types = ['High-end', 'Mid-range', 'Budget'];
const services = ['VIP Service', 'Themed Rooms', 'Buffet Option', 'Family Friendly'];

export function FilterControls({ onFilterChange }: FilterControlsProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    onFilterChange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="p-4 mb-8 bg-card/50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Search KTV name..."
          name="search"
          onChange={handleInputChange}
          className="lg:col-span-1"
        />
        <Select name="district" onValueChange={handleSelectChange('district')} defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="All Districts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {districts.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select name="type" onValueChange={handleSelectChange('type')} defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
             {types.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select name="services" onValueChange={handleSelectChange('services')} defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="All Services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {services.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
