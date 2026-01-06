'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Link as LinkIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { doc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import type { Group } from '@/lib/types';
import { MOCK_GROUPS } from '@/lib/mock-data'; // Using mock for display until we have real group fetching logic


export default function GroupsPage() {
  const [enabledGroups, setEnabledGroups] = useState<Set<string>>(new Set());
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();

  const userGroupsQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/groups`);
  }, [user, firestore]);

  const { data: userGroups, loading } = useCollection(userGroupsQuery);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (userGroups) {
      setEnabledGroups(new Set(userGroups.map(g => g.id)));
    }
  }, [userGroups]);
  
  const handleCheckedChange = async (group: Group, isChecked: boolean) => {
    if (!user || !firestore) return;
    
    const groupRef = doc(firestore, `users/${user.uid}/groups`, group.id);
    const newEnabledGroups = new Set(enabledGroups);

    if (isChecked) {
      newEnabledGroups.add(group.id);
      await setDoc(groupRef, { ...group, userId: user.uid });
    } else {
      newEnabledGroups.delete(group.id);
      await deleteDoc(groupRef);
    }

    setEnabledGroups(newEnabledGroups);
  };
  
  const handleConnect = () => {
    if (!user) {
      router.push('/login');
    } else {
      // Logic to connect to facebook and fetch groups
      console.log('Already logged in, implement group fetching from Facebook API');
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
                    <CardDescription>Connect your social media accounts to fetch your groups.</CardDescription>
                </div>
                <Button onClick={handleConnect}>
                  {user ? 'Connect New Account' : 'Connect Account'}
                </Button>
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
                {isClient && user && (
                  <div className="flex items-center gap-2">
                      <Label htmlFor={`switch-${group.id}`} className="text-sm text-muted-foreground">Enable Posting</Label>
                      <Switch 
                        id={`switch-${group.id}`} 
                        checked={enabledGroups.has(group.id)}
                        onCheckedChange={(isChecked) => handleCheckedChange(group, isChecked)}
                      />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
