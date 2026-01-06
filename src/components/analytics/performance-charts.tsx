'use client';

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AnalyticsData } from '@/lib/types';

const chartConfig: ChartConfig = {
  reach: {
    label: 'Reach',
    color: 'hsl(var(--primary))',
  },
  engagement: {
    label: 'Engagement',
    color: 'hsl(var(--accent))',
  },
};

export default function PerformanceCharts({ data }: { data: AnalyticsData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Detailed Performance</CardTitle>
        <CardDescription>Dive deeper into your post metrics over the last 14 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reach">
          <TabsList>
            <TabsTrigger value="reach">Reach</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          <TabsContent value="reach" className="pt-4">
            <ChartContainer config={chartConfig} className="h-72 w-full">
              <ResponsiveContainer>
                <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
                    fontSize={12}
                    width={40}
                  />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent indicator="dot" />} />
                  <defs>
                    <linearGradient id="fillReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-reach)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--color-reach)" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="reach" stroke="var(--color-reach)" strokeWidth={2} fillOpacity={1} fill="url(#fillReach)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="engagement" className="pt-4">
            <ChartContainer config={chartConfig} className="h-72 w-full">
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
                    width={40}
                    fontSize={12}
                  />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent indicator="dot" />} />
                  <Bar dataKey="engagement" fill="var(--color-engagement)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
