'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { AnalyticsData } from '@/lib/types';

const chartConfig = {
  reach: {
    label: 'Reach',
    color: 'hsl(var(--primary))',
  },
  engagement: {
    label: 'Engagement',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

export default function AnalyticsOverview({ data }: { data: AnalyticsData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Performance Overview</CardTitle>
        <CardDescription>Reach and engagement over the last 14 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={30}
                fontSize={12}
              />
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
              <Bar dataKey="reach" fill="var(--color-reach)" radius={4} />
              <Bar dataKey="engagement" fill="var(--color-engagement)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
