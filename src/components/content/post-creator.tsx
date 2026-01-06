'use client';

import { useState, useActionState, useRef, ChangeEvent } from 'react';
import { useFormStatus } from 'react-dom';
import { handleGeneratePost } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Calendar as CalendarIcon, Loader2, Sparkles, Wand2, Image as ImageIcon, X } from 'lucide-react';
import { MOCK_GROUPS } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

function SubmitButton({ children, ...props }: React.ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? <Loader2 className="animate-spin" /> : children}
    </Button>
  );
}

export default function PostCreator() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [generatedContent, setGeneratedContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialState = { message: '', errors: {}, post: '' };
  const [state, formAction] = useActionState(handleGeneratePost, initialState);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSchedule = () => {
    if (!generatedContent) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please generate content before scheduling.',
      });
      return;
    }
     if (!date) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a publication date.',
      });
      return;
    }
    toast({
      title: 'Post Scheduled! ✨',
      description: 'Your post has been successfully scheduled for publication.',
    });
  };
  
  if (state.message === 'success' && state.post && state.post !== generatedContent) {
    setGeneratedContent(state.post);
  }

  return (
    <Card className="w-full">
        <form action={formAction}>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                <Sparkles className="text-primary" /> Create a new Post
                </CardTitle>
                <CardDescription>
                Describe your topic, add an image, and let our AI create the perfect post for you.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="topic-textarea">Topic / Idea</Label>
                    <Textarea
                        id="topic-textarea"
                        name="topic"
                        placeholder="e.g., 'The future of renewable energy' or 'How to bake the perfect sourdough bread'"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        rows={3}
                    />
                    {state?.errors?.topic && <p className="text-sm text-destructive">{state.errors.topic[0]}</p>}
                </div>
                
                <input
                    type="file"
                    name="image"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                />

                {imagePreview && (
                    <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                         <Image src={imagePreview} alt="Image preview" fill objectFit="cover" />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7 rounded-full"
                            onClick={() => {
                                setImagePreview(null);
                                if(fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="content-textarea">Generated Post</Label>
                     <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                     >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        {imagePreview ? 'Change Image' : 'Add Image'}
                    </Button>
                  </div>
                    <Textarea
                        id="content-textarea"
                        name="postContent"
                        placeholder="AI will generate your post content here..."
                        value={generatedContent}
                        onChange={(e) => setGeneratedContent(e.target.value)}
                        rows={6}
                        className="bg-muted"
                    />
                </div>
                
                 <SubmitButton className="w-full">
                    <Wand2 /> Generate Post
                </SubmitButton>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
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
                <Button onClick={handleSchedule} type="button" className="w-full sm:w-auto">Schedule Post</Button>
            </CardFooter>
        </form>
    </Card>
  );
}
