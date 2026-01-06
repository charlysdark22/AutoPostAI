import PerformanceCharts from '@/components/analytics/performance-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_POSTS, MOCK_ANALYTICS } from '@/lib/mock-data';
import { BarChart3, Heart, MessageCircle, Share2, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
    const totalReach = MOCK_ANALYTICS.reduce((acc, item) => acc + item.reach, 0);
    const totalEngagement = MOCK_ANALYTICS.reduce((acc, item) => acc + item.engagement, 0);
    const totalLikes = MOCK_POSTS.reduce((acc, post) => acc + post.engagement.likes, 0);
    const totalComments = MOCK_POSTS.reduce((acc, post) => acc + post.engagement.comments, 0);

  const summaryData = [
    { title: 'Total Reach', value: totalReach.toLocaleString(), icon: TrendingUp },
    { title: 'Total Engagement', value: totalEngagement.toLocaleString(), icon: BarChart3 },
    { title: 'Total Likes', value: totalLikes.toLocaleString(), icon: Heart },
    { title: 'Total Comments', value: totalComments.toLocaleString(), icon: MessageCircle },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-semibold">Analytics</h1>
        <p className="text-muted-foreground">Track your post performance and audience growth.</p>
      </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {summaryData.map(item => (
                <Card key={item.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{item.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>

      <PerformanceCharts data={MOCK_ANALYTICS} />
    </div>
  );
}
