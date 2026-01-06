'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Clock, FileText, Users } from 'lucide-react';
import RecentActivity from '@/components/dashboard/recent-activity';
import AnalyticsOverview from '@/components/dashboard/analytics-overview';
import { formatDistanceToNow } from 'date-fns';
import { useUser, useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';
import type { Post } from '@/lib/types';

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const postsQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, "posts"), where("userId", "==", user.uid), orderBy("publishDate", "desc"));
  }, [user, firestore]);

  const { data: posts, loading } = useCollection(postsQuery);
  
  const publishedPosts = posts?.filter((p: Post) => p.status === 'Published').length || 0;
  const scheduledPosts = posts?.filter((p: Post) => p.status === 'Scheduled').length || 0;
  const totalEngagement = posts?.reduce((acc: number, post: Post) => acc + (post.engagement?.likes || 0) + (post.engagement?.comments || 0) + (post.engagement?.shares || 0), 0) || 0;
  const latestPost = posts?.find((p: Post) => p.status === 'Published');

  const statCards = [
    { title: 'Published Posts', value: publishedPosts, icon: FileText, change: 'From your feed' },
    { title: 'Scheduled Posts', value: scheduledPosts, icon: Clock, change: 'Upcoming posts' },
    { title: 'Total Engagement', value: totalEngagement.toLocaleString(), icon: Users, change: 'Across all posts' },
    { title: 'Latest Post', value: latestPost ? `${formatDistanceToNow(new Date(latestPost.publishDate))} ago` : 'N/A', icon: BarChart3, change: latestPost?.group?.name },
  ];

    // Mock analytics for now as we don't have a collection for it.
    const MOCK_ANALYTICS = Array.from({ length: 14 }, (_, i) => {
        return {
            date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            reach: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
            engagement: Math.floor(Math.random() * (500 - 50 + 1)) + 50,
        };
    });

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
          <RecentActivity posts={posts as Post[] || []} />
        </div>
      </div>
    </div>
  );
}
