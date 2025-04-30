'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TemplateOverviewTab } from './template-overview-tab';
import { Card } from '@/components/ui/card';
import { TemplateResultsTab } from './results-components/template-results-tab';
import { MyResponseForm } from './my-response-form';

export function TemplateTabs({ template, session, userResponse, templateId }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const isOwner = template.author.id === session?.user?.id;
  const isAdmin = session?.user?.role === 'ADMIN';
  const canEdit = isOwner || isAdmin;

  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState(() => {
    if (tabParam === 'results' && (isOwner || isAdmin)) {
      return 'results';
    } else if (tabParam === 'myResponse') {
      return 'myResponse';
    }
    return 'overview';
  });

  const handleTabChange = (value) => {
    setActiveTab(value);

    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    router.push(`/templates/${templateId}?${params.toString()}`, {
      scroll: false,
    });
  };

  if (!canEdit) {
    return (
      <Tabs
        defaultValue="overview"
        className="w-full"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="myResponse">My Response</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <TemplateOverviewTab
            template={template}
            userResponse={userResponse}
            session={session}
            templateId={templateId}
            canEdit={canEdit}
            inTabView={true}
          />
        </TabsContent>

        <TabsContent value="myResponse" className="mt-0">
          <Card className="p-6">
            <MyResponseForm template={template} response={userResponse} />
          </Card>
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <Tabs
      defaultValue="overview"
      className="w-full"
      value={activeTab}
      onValueChange={handleTabChange}
    >
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="myResponse">My Response</TabsTrigger>
        <TabsTrigger value="results">Results</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-0">
        <TemplateOverviewTab
          template={template}
          userResponse={userResponse}
          session={session}
          templateId={templateId}
          canEdit={canEdit}
          inTabView={true}
        />
      </TabsContent>

      <TabsContent value="myResponse" className="mt-0">
        <Card className="p-6">
          <MyResponseForm template={template} response={userResponse} />
        </Card>
      </TabsContent>

      <TabsContent value="results" className="mt-0">
        <TemplateResultsTab templateId={templateId} />
      </TabsContent>
    </Tabs>
  );
}
