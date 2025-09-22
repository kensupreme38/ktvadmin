
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const users = [
  { id: 'usr_1', name: 'Admin User', email: 'admin@aura.com', role: 'Admin', joined: '2024-01-15', status: 'Active' },
  { id: 'usr_2', name: 'Thanh Nguyen', email: 'thanh.nguyen@example.com', role: 'Editor', joined: '2024-02-20', status: 'Active' },
  { id: 'usr_3', name: 'Minh Tran', email: 'minh.tran@example.com', role: 'User', joined: '2024-03-10', status: 'Active' },
  { id: 'usr_4', name: 'Hoang Pham', email: 'hoang.pham@example.com', role: 'User', joined: '2024-04-05', status: 'Suspended' },
  { id: 'usr_5', name: 'Linh Bui', email: 'linh.bui@example.com', role: 'User', joined: '2024-05-21', status: 'Active' },
  { id: 'usr_6', name: 'An Le', email: 'an.le@example.com', role: 'User', joined: '2024-06-18', status: 'Pending' },
];

const getRoleVariant = (role: string) => {
  switch (role) {
    case 'Admin':
      return 'destructive';
    case 'Editor':
      return 'default';
    default:
      return 'secondary';
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Suspended':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function AdminUsersPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <Button>Add New User</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://i.pravatar.cc/40?u=${user.id}`} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleVariant(user.role)}>{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
                </TableCell>
                <TableCell>{user.joined}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit Role</DropdownMenuItem>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Suspend User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
