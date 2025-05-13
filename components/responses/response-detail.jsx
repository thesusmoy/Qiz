'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { getResponseDetails } from '@/lib/actions/form-actions';
import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';

export function ResponseDetail({ templateId, response }) {
  const session = useSession();
  const [fullResponse, setFullResponse] = useState(response);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const isAdmin = session?.data?.user?.role === 'ADMIN';
  const isResponseCreator = session?.data?.user?.id === response?.userId;
  const isTemplateOwner =
    response?.template?.author?.id === session?.data?.user?.id;

  const canEdit = isResponseCreator || isAdmin;

  const needsFullDetails = !response.template?.questions?.length && response.id;

  useEffect(() => {
    if (needsFullDetails) {
      const fetchFullResponse = async () => {
        setIsLoadingDetails(true);
        try {
          const result = await getResponseDetails(templateId, response.id);
          if (result.data) {
            setFullResponse(result.data);
          }
        } catch (error) {
          console.error('Error fetching response details:', error);
        } finally {
          setIsLoadingDetails(false);
        }
      };

      fetchFullResponse();
    }
  }, [templateId, response.id, needsFullDetails]);

  const getAnswerValue = (questionId) => {
    const answer = fullResponse.answers.find(
      (a) => a.questionId === questionId
    );
    if (!answer?.value) return '-';

    const question = fullResponse.template.questions.find(
      (q) => q.id === questionId
    );
    switch (question?.type) {
      case 'CHECKBOX':
        return answer.value === 'true' ? 'Yes' : 'No';
      case 'NUMBER':
        return parseInt(answer.value).toLocaleString();
      default:
        return answer.value;
    }
  };

  const formatSafeDate = (dateValue) => {
    if (!dateValue) return 'Unknown date';

    try {
      const date = new Date(dateValue);

      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }

      return format(date, 'PPP');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <>
      <Card className="p-6 space-y-6">
        {}
        <div>
          <div className="flex justify-between items-start">
            <div>
              {}
              <h2 className="text-lg font-medium">
                {fullResponse.user?.name || 'Unknown User'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {fullResponse.user?.email || 'No email available'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Submitted on {formatSafeDate(fullResponse.createdAt)}
              </p>
              {}
              {(isTemplateOwner || isAdmin) &&
                fullResponse.updatedAt &&
                fullResponse.updatedAt !== fullResponse.createdAt && (
                  <p className="text-sm text-muted-foreground">
                    Updated on {formatSafeDate(fullResponse.updatedAt)}
                  </p>
                )}
            </div>
          </div>
        </div>

        <Separator />

        {}
        <div className="space-y-6">
          {isLoadingDetails ? (
            <p className="text-center text-muted-foreground">
              Loading questions and answers...
            </p>
          ) : fullResponse.template &&
            fullResponse.template.questions?.length > 0 ? (
            fullResponse.template.questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{question.text}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {question.type.toLowerCase().replace('_', ' ')}
                  </Badge>
                </div>
                {question.description && (
                  <p className="text-sm text-muted-foreground">
                    {question.description}
                  </p>
                )}
                <p className="text-sm p-3 bg-muted rounded-md">
                  {getAnswerValue(question.id)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No questions available</p>
          )}
        </div>
      </Card>

      {}
      {canEdit && (
        <div className="flex justify-end gap-4">
          <Button asChild>
            <Link
              href={`/templates/${templateId}?tab=myResponse`}
              className="gap-2"
            >
              Edit Response
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}
