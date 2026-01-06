import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_GROUPS } from '@/lib/mock-data';
import { Facebook, Users } from 'lucide-react';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';

export default function GroupsPage() {
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
                        <Facebook className="text-blue-600" /> Facebook Account
                    </CardTitle>
                    <CardDescription>Connect and manage your Facebook groups.</CardDescription>
                </div>
                <Button>Connect New Account</Button>
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
                    <Switch id={`switch-${group.id}`} defaultChecked={Math.random() > 0.5} />
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
