
'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { UserTemplatesTable } from './user-templates-table';
import { UserResponsesTable } from './user-responses-table';
import { CalendarDays, Mail, User } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

export function UserProfilePage({ user }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab');

  
  const [activeTab, setActiveTab] = useState(() => {
    return tabParam === 'templates' || tabParam === 'responses'
      ? tabParam
      : 'profile';
  });

  
  const handleTabChange = (value) => {
    setActiveTab(value);
    
    const params = new URLSearchParams(searchParams);
    if (value === 'profile') {
      params.delete('tab');
    } else {
      params.set('tab', value);
    }
    const queryString = params.toString();
    router.push(`/profile${queryString ? `?${queryString}` : ''}`, {
      scroll: false,
    });
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.image} alt={user.name || 'User'} />
          <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="templates">My Templates</TabsTrigger>
          <TabsTrigger value="responses">My Responses</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <User className="text-muted-foreground" />
                  <div>
                    <p className="font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                {user.createdAt && (
                  <div className="flex items-center space-x-4">
                    <CalendarDays className="text-muted-foreground" />
                    <div>
                      <p className="font-medium">Member Since</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <UserTemplatesTable />
        </TabsContent>

        <TabsContent value="responses" className="mt-4">
          <UserResponsesTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
