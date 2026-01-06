'use client';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { format, parseISO } from 'date-fns';
import { BotMessageSquare } from 'lucide-react';

function PostItem({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="hidden h-9 w-9 sm:flex">
        {post.image?.src ? <AvatarImage src={post.image.src} alt={post.image.alt} data-ai-hint={post.image.hint} /> : <AvatarFallback><BotMessageSquare className="w-5 h-5"/></AvatarFallback>}
      </Avatar>
      <div className="grid gap-1">
        <p className="text-sm font-medium leading-none truncate">{post.content}</p>
        <p className="text-sm text-muted-foreground">{post.group.name} &middot; {format(new Date(post.publishDate), "MMM d, h:mm a")}</p>
      </div>
    </div>
  );
}

export default function RecentActivity({ posts }: { posts: Post[] }) {
  const scheduledPosts = posts.filter((p) => p.status === 'Scheduled').sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime());
  const publishedPosts = posts.filter((p) => p.status === 'Published').sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Activity Feed</CardTitle>
        <CardDescription>An overview of your recent and upcoming posts.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scheduled">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>
          <TabsContent value="scheduled">
            <div className="space-y-6 pt-4">
              {scheduledPosts.length > 0 ? scheduledPosts.slice(0, 4).map((post) => <PostItem key={post.id} post={post} />) : <p className="text-sm text-muted-foreground text-center py-4">No scheduled posts.</p>}
            </div>
          </TabsContent>
          <TabsContent value="published">
            <div className="space-y-6 pt-4">
              {publishedPosts.length > 0 ? publishedPosts.slice(0, 4).map((post) => <PostItem key={post.id} post={post} />) : <p className="text-sm text-muted-foreground text-center py-4">No published posts yet.</p>}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
