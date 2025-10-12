
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'User';
  status: 'Active' | 'Inactive';
}

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@aura.com',
    avatar: 'https://i.pravatar.cc/150?u=admin@aura.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 'user-2',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?u=john.doe@example.com',
    role: 'User',
    status: 'Active',
  },
  {
    id: 'user-3',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://i.pravatar.cc/150?u=jane.smith@example.com',
    role: 'User',
    status: 'Active',
  },
  {
    id: 'user-4',
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    avatar: 'https://i.pravatar.cc/150?u=michael.j@example.com',
    role: 'User',
    status: 'Inactive',
  },
  {
    id: 'user-5',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    avatar: 'https://i.pravatar.cc/150?u=emily.d@example.com',
    role: 'User',
    status: 'Active',
  },
];
