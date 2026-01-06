'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/firebase';
import { FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Facebook } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleFacebookLogin = async () => {
    if (!auth) return;
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Login Successful',
        description: "You've been successfully logged in.",
      });
      router.push('/groups');
    } catch (error: any) {
      console.error('Facebook login error:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not sign in with Facebook.',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Connect Your Account</CardTitle>
          <CardDescription>
            Sign in with Facebook to manage your groups and posts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleFacebookLogin} className="w-full bg-[#1877F2] hover:bg-[#1877F2]/90">
            <Facebook className="mr-2 h-5 w-5" />
            Sign in with Facebook
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
