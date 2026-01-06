'use client';

import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleGeneratePost, handleReasonAboutEnhancement, handleEnhancePost } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Calendar as CalendarIcon, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MOCK_GROUPS } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

function GenerationForm({ setGeneratedContent }: { setGeneratedContent: (content: string) => void }) {
  const initialState = { message: '', errors: {}, post: '' };
  const [state, dispatch] = useActionState(handleGeneratePost, initialState);

  if (state.message === 'success' && state.post) {
    setGeneratedContent(state.post);
  }

  return (
    <form action={dispatch}>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Sparkles className="text-accent" /> Step 1: Generate Content</CardTitle>
          <CardDescription>Enter a topic or keywords, and our AI will generate a post for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="topic">Topic</Label>
            <Input id="topic" name="topic" placeholder="e.g., 'The future of renewable energy'" />
            {state?.errors?.topic && <p className="text-sm text-destructive">{state.errors.topic[0]}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton>
            <Wand2 /> Generate Post
          </SubmitButton>
        </CardFooter>
      </Card>
    </form>
  );
}

function EnhancementForm({ generatedContent, setEnhancedContent }: { generatedContent: string; setEnhancedContent: (content: string) => void }) {
  const [reasoning, setReasoning] = useState<{ shouldEnhance: boolean; reasoning: string } | null>(null);

  const [reasonState, reasonDispatch] = useActionState(handleReasonAboutEnhancement, null);
  const [enhanceState, enhanceDispatch] = useActionState(handleEnhancePost, null);

  if (reasonState?.message === 'success' && !reasoning) {
    setReasoning({ shouldEnhance: reasonState.shouldEnhance, reasoning: reasonState.reasoning });
  }

  if (enhanceState?.message === 'success' && enhanceState.enhancedPostContent) {
    setEnhancedContent(enhanceState.enhancedPostContent);
    // Clear reasoning after enhancement
    if (reasoning) setReasoning(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><Bot className="text-primary" /> Step 2: Review & Enhance</CardTitle>
        <CardDescription>Review the generated content and use our AI to enhance it further.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea name="postContent" defaultValue={generatedContent} rows={6} />
        {reasoning && (
          <Alert variant={reasoning.shouldEnhance ? 'default' : 'destructive'}>
            <Sparkles className="h-4 w-4" />
            <AlertTitle>AI Analysis</AlertTitle>
            <AlertDescription>{reasoning.reasoning}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-2">
        <form action={reasonDispatch} className="w-full sm:w-auto">
          <input type="hidden" name="postContent" value={generatedContent} />
          <SubmitButton variant="outline" className="w-full">Analyze Post</SubmitButton>
        </form>
        <form action={enhanceDispatch} className="w-full sm:w-auto">
          <input type="hidden" name="postContent" value={generatedContent} />
          <SubmitButton className="w-full">
            <Sparkles /> Enhance Post
          </SubmitButton>
        </form>
      </CardFooter>
    </Card>
  );
}

function SchedulingForm({ finalContent }: { finalContent: string }) {
    const { toast } = useToast();
    const [date, setDate] = useState<Date>();

    const handleSchedule = () => {
        toast({
            title: "Post Scheduled! ✨",
            description: "Your post has been successfully scheduled for publication.",
        });
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><CalendarIcon /> Step 3: Schedule</CardTitle>
        <CardDescription>Select the group and time for your post to go live.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea value={finalContent} readOnly rows={6} className="bg-muted" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <Label>Group</Label>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                        {MOCK_GROUPS.map((group) => (
                            <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Publication Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSchedule} className="w-full sm:w-auto">Schedule Post</Button>
      </CardFooter>
    </Card>
  );
}


export default function PostCreator() {
  const [generatedContent, setGeneratedContent] = useState('');
  const [enhancedContent, setEnhancedContent] = useState('');
  const finalContent = enhancedContent || generatedContent;

  return (
    <div className="space-y-8">
      <GenerationForm setGeneratedContent={(content) => { setGeneratedContent(content); setEnhancedContent(''); }} />
      {generatedContent && <EnhancementForm generatedContent={generatedContent} setEnhancedContent={setEnhancedContent} />}
      {finalContent && <SchedulingForm finalContent={finalContent} />}
    </div>
  );
}

function SubmitButton({ children, ...props }: React.ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? <Loader2 className="animate-spin" /> : children}
    </Button>
  );
}
