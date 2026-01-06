import type { Post, Group, AnalyticsData } from '@/lib/types';
import { subDays, format } from 'date-fns';

export const MOCK_USER = {
  name: 'Alex Wolfe',
  email: 'alex.wolfe@example.com',
  avatarUrl: 'https://picsum.photos/seed/101/100/100',
};

export const MOCK_GROUPS: Group[] = [
  { id: 'group-1', name: 'Next.js Developers', memberCount: 125000, platform: 'facebook' },
  { id: 'group-2', name: 'React Community', memberCount: 250000, platform: 'facebook' },
  { id: 'group-3', name: 'AI & Machine Learning Enthusiasts', memberCount: 78000, platform: 'facebook' },
  { id: 'group-4', name: 'Startup Founders Hub', memberCount: 42000, platform: 'facebook' },
  { id: 'group-5', name: 'Digital Nomads Collective', memberCount: 95000, platform: 'facebook' },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    content: 'Just launched a new feature for our AI-powered content scheduler! Now you can analyze post performance directly from the dashboard. 🚀 #AI #SaaS #React',
    platform: 'facebook',
    status: 'Published',
    publishDate: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm'),
    engagement: { likes: 152, comments: 34, shares: 12 },
    group: MOCK_GROUPS[0],
    image: { src: 'https://picsum.photos/seed/201/800/600', alt: 'Abstract technology background', hint: 'technology abstract' },
  },
  {
    id: 'post-2',
    content: 'What are your favorite custom hooks in React? I\'m building a new project and looking for inspiration. Share your go-to hooks below! 👇',
    platform: 'facebook',
    status: 'Published',
    publishDate: format(subDays(new Date(), 3), 'yyyy-MM-dd HH:mm'),
    engagement: { likes: 289, comments: 102, shares: 5 },
    group: MOCK_GROUPS[1],
  },
  {
    id: 'post-3',
    content: 'Exploring the future of generative AI. The possibilities are endless, from art to code generation. What are you most excited about?',
    platform: 'facebook',
    status: 'Scheduled',
    publishDate: format(subDays(new Date(), -2), 'yyyy-MM-dd HH:mm'),
    engagement: { likes: 0, comments: 0, shares: 0 },
    group: MOCK_GROUPS[2],
    image: { src: 'https://picsum.photos/seed/203/800/600', alt: 'Data visualization on a screen', hint: 'data visualization' },
  },
  {
    id: 'post-4',
    content: 'Weekly check-in! What are your goals for this week? Let\'s hold each other accountable. My goal is to finish the user authentication flow.',
    platform: 'facebook',
    status: 'Scheduled',
    publishDate: format(subDays(new Date(), -3), 'yyyy-MM-dd HH:mm'),
    engagement: { likes: 0, comments: 0, shares: 0 },
    group: MOCK_GROUPS[3],
  }
];


export const MOCK_ANALYTICS: AnalyticsData[] = Array.from({ length: 14 }, (_, i) => {
  const date = subDays(new Date(), 13 - i);
  return {
    date: format(date, 'MMM d'),
    reach: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
    engagement: Math.floor(Math.random() * (500 - 50 + 1)) + 50,
  };
});
