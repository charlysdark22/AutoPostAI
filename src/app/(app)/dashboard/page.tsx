import { MOCK_POSTS, MOCK_ANALYTICS } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Clock, FileText, Users } from 'lucide-react';
import RecentActivity from '@/components/dashboard/recent-activity';
import AnalyticsOverview from '@/components/dashboard/analytics-overview';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const publishedPosts = MOCK_POSTS.filter((p) => p.status === 'Published').length;
  const scheduledPosts = MOCK_POSTS.filter((p) => p.status === 'Scheduled').length;
  const totalEngagement = MOCK_POSTS.reduce((acc, post) => acc + post.engagement.likes + post.engagement.comments + post.engagement.shares, 0);
  const latestPost = MOCK_POSTS.find(p => p.status === 'Published');

  const statCards = [
    { title: 'Published Posts', value: publishedPosts, icon: FileText, change: '+2 this week' },
    { title: 'Scheduled Posts', value: scheduledPosts, icon: Clock, change: '3 due tomorrow' },
    { title: 'Total Engagement', value: totalEngagement.toLocaleString(), icon: Users, change: '+12% this week' },
    { title: 'Latest Post', value: latestPost ? `${formatDistanceToNow(new Date(latestPost.publishDate))} ago` : 'N/A', icon: BarChart3, change: latestPost?.group.name },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's a snapshot of your account.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <AnalyticsOverview data={MOCK_ANALYTICS} />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity posts={MOCK_POSTS} />
        </div>
      </div>
    </div>
  );
}
