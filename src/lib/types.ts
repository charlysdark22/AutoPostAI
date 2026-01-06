export type Post = {
  id: string;
  content: string;
  platform: 'facebook';
  status: 'Published' | 'Scheduled' | 'Draft';
  publishDate: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  group: {
    id: string;
    name: string;
  };
  image?: {
    src: string;
    alt: string;
    hint: string;
  };
};

export type Group = {
  id: string;
  name: string;
  memberCount: number;
  platform: 'facebook';
};

export type AnalyticsData = {
  date: string;
  reach: number;
  engagement: number;
};
