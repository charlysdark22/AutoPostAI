import PostCreator from '@/components/content/post-creator';

export default function ContentPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-semibold">Content Creator</h1>
        <p className="text-muted-foreground">Generate, enhance, and schedule your social media posts with AI.</p>
      </div>
      <PostCreator />
    </div>
  );
}
