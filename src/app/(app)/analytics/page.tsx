'use client';
import PerformanceCharts from '@/components/analytics/performance-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useUser } from '@/firebase';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs,getCountFromServer } from 'firebase/firestore';
import { BarChart3, Heart, MessageCircle, TrendingUp } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';

export default function AnalyticsPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const [summaryData, setSummaryData] = useState([
        { title: 'Total Reach', value: '0', icon: TrendingUp },
        { title: 'Total Engagement', value: '0', icon: BarChart3 },
        { title: 'Total Likes', value: '0', icon: Heart },
        { title: 'Total Comments', value: '0', icon: MessageCircle },
    ]);


    const postsQuery = useMemo(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'posts'), where('userId', '==', user.uid));
    }, [user, firestore]);

    const { data: posts, loading: postsLoading } = useCollection(postsQuery);
    
    // Mock analytics for now as we don't have a collection for it.
    const MOCK_ANALYTICS = Array.from({ length: 14 }, (_, i) => {
        return {
            date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            reach: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
            engagement: Math.floor(Math.random() * (500 - 50 + 1)) + 50,
        };
    });

    useEffect(() => {
        if (posts) {
            const totalLikes = posts.reduce((acc, post) => acc + (post.engagement?.likes || 0), 0);
            const totalComments = posts.reduce((acc, post) => acc + (post.engagement?.comments || 0), 0);
            const totalEngagement = posts.reduce((acc, post) => acc + (post.engagement?.likes || 0) + (post.engagement?.comments || 0) + (post.engagement?.shares || 0), 0);
            const totalReach = posts.reduce((acc, post) => acc + (post.reach || 0), 0);

            setSummaryData([
                { title: 'Total Reach', value: totalReach.toLocaleString(), icon: TrendingUp },
                { title: 'Total Engagement', value: totalEngagement.toLocaleString(), icon: BarChart3 },
                { title: 'Total Likes', value: totalLikes.toLocaleString(), icon: Heart },
                { title: 'Total Comments', value: totalComments.toLocaleString(), icon: MessageCircle },
            ]);
        }
    }, [posts]);

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
