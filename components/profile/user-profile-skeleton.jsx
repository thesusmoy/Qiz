
'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

export function UserProfileSkeleton() {
  return (
    <div className="py-6 space-y-6">
      {}
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback>
            <SkeletonWrapper className="h-full w-full" />
          </AvatarFallback>
        </Avatar>
        <div>
          <SkeletonWrapper variant="title" className="mb-1" />
          <SkeletonWrapper width={200} height={16} />
        </div>
      </div>

      {}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-3">
          <TabsTrigger value="profile" className="cursor-default">
            Profile
          </TabsTrigger>
          <TabsTrigger value="forms" className="cursor-default">
            Forms
          </TabsTrigger>
          <TabsTrigger value="settings" className="cursor-default">
            Settings
          </TabsTrigger>
        </TabsList>

        {}
        <TabsContent value="profile" className="space-y-6 pt-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Account Information
                  </h3>
                  <div className="space-y-3">
                    {}
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Name</div>
                      <SkeletonWrapper height={36} />
                    </div>

                    {}
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Email</div>
                      <SkeletonWrapper height={36} />
                    </div>
                  </div>
                </div>

                {}
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">API Access</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">API Key</div>
                      <div className="flex items-center space-x-2">
                        <SkeletonWrapper height={36} className="flex-1" />
                        <SkeletonWrapper width={80} height={36} />
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Integrations</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8">
                          <SkeletonWrapper className="w-8 h-8 rounded-md" />
                        </div>
                        <div>
                          <div className="font-medium">Salesforce</div>
                          <div className="text-sm text-muted-foreground">
                            <SkeletonWrapper width={120} height={16} />
                          </div>
                        </div>
                      </div>
                      <SkeletonWrapper width={100} height={36} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {}
        <TabsContent value="forms" className="pt-4">
          <Card>
            <CardContent className="p-6">
              <SkeletonWrapper variant="title" className="mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <SkeletonWrapper width="60%" height={20} />
                    <SkeletonWrapper width={100} height={36} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {}
        <TabsContent value="settings" className="pt-4">
          <Card>
            <CardContent className="p-6">
              <SkeletonWrapper variant="title" className="mb-4" />
              <div className="space-y-4">
                <SkeletonWrapper height={100} />
                <SkeletonWrapper width={120} height={36} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
