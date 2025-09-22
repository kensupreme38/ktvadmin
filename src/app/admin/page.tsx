
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building, FileText, Star, CalendarPlus, Edit3, UserPlus } from 'lucide-react';
import { allKtvs } from '@/data/ktvs';
import { allArticles } from '@/data/articles';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const recentActivities = [
  {
    icon: <CalendarPlus className="h-5 w-5 text-green-500" />,
    description: 'New booking for Kingdom KTV by Nguyen Van A.',
    time: '5 minutes ago',
    user: { name: 'Nguyen Van A', id: 'usr_7' }
  },
  {
    icon: <Edit3 className="h-5 w-5 text-blue-500" />,
    description: 'Article "Top 5 High-End KTVs" was published.',
    time: '1 hour ago',
    user: { name: 'Admin User', id: 'usr_1' }
  },
  {
    icon: <UserPlus className="h-5 w-5 text-purple-500" />,
    description: 'A new user, Linh Bui, has registered.',
    time: '3 hours ago',
    user: { name: 'Linh Bui', id: 'usr_5' }
  },
  {
    icon: <Star className="h-5 w-5 text-yellow-500" />,
    description: 'New review submitted for Catwalk KTV.',
    time: 'Yesterday',
    user: { name: 'David Chen', id: 'usr_8' }
  },
    {
    icon: <CalendarPlus className="h-5 w-5 text-green-500" />,
    description: 'New booking for Nnice KTV by Tran Thi B.',
    time: 'Yesterday',
    user: { name: 'Tran Thi B', id: 'usr_9' }
  }
];


export default function AdminDashboardPage() {
  const totalReviews = allKtvs.reduce((sum, ktv) => sum + ktv.reviews.length, 0);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total KTVs</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allKtvs.length}</div>
            <p className="text-xs text-muted-foreground">venues currently listed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allArticles.length}</div>
            <p className="text-xs text-muted-foreground">insights published</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
            <p className="text-xs text-muted-foreground">across all venues</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground">+50 in the last hour</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                         <p className="text-sm">{activity.description}</p>
                         <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                     <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`https://i.pravatar.cc/32?u=${activity.user.id}`} />
                            <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{activity.user.name}</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
