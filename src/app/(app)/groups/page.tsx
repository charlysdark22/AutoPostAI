'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_GROUPS } from '@/lib/mock-data';
import { Users, Link as LinkIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';


export default function GroupsPage() {
  // Use a map to store the checked state for each switch
  const [checkedStates, setCheckedStates] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    // Initialize checked states from local storage or a default
    const initialStates: Record<string, boolean> = {};
    MOCK_GROUPS.forEach(group => {
      const storedState = localStorage.getItem(`switch-${group.id}`);
      initialStates[group.id] = storedState ? JSON.parse(storedState) : false;
    });
    setCheckedStates(initialStates);
  }, []);

  const handleCheckedChange = (groupId: string, isChecked: boolean) => {
    setCheckedStates(prev => {
      const newStates = { ...prev, [groupId]: isChecked };
      localStorage.setItem(`switch-${groupId}`, JSON.stringify(isChecked));
      return newStates;
    });
  };
  
  const handleConnect = () => {
    if (user) {
      // Optional: Handle logic for already logged-in user, e.g., link another account
      console.log('User is already connected.');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-semibold">Group Management</h1>
        <p className="text-muted-foreground">Connect your accounts and manage groups for posting.</p>
      </div>

      <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <LinkIcon className="text-primary" /> Connect Account
                    </CardTitle>
                    <CardDescription>Connect and manage your social media groups.</CardDescription>
                </div>
                <Button onClick={handleConnect}>Connect New Account</Button>
            </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_GROUPS.map((group) => (
              <Card key={group.id} className="flex items-center p-4">
                <div className="flex-1">
                  <p className="font-semibold">{group.name}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1.5 h-4 w-4" />
                    {group.memberCount.toLocaleString()} members
                  </div>
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor={`switch-${group.id}`} className="text-sm text-muted-foreground">Enable Posting</Label>
                    <Switch 
                      id={`switch-${group.id}`} 
                      checked={checkedStates[group.id] || false}
                      onCheckedChanged={(isChecked) => handleCheckedChange(group.id, isChecked)}
                    />
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
