'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getResponseDetails } from '@/lib/actions/form-actions';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Loader2, ExternalLink } from 'lucide-react';

export function ResponseDetailsModal({
  isOpen,
  onClose,
  responseId,
  templateId,
}) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const session = useSession();

  useEffect(() => {
    if (isOpen && responseId && templateId) {
      setLoading(true);
      getResponseDetails(templateId, responseId)
        .then((result) => {
          if (result.data) {
            setResponse(result.data);
            setError(null);
          } else {
            setError(result.error || 'Failed to load response');
          }
        })
        .catch((err) => {
          console.error('Error fetching response details:', err);
          setError('An error occurred while loading the response');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, responseId, templateId]);

  const isAdmin = session?.data?.user?.role === 'ADMIN';

  const isTemplateOwner =
    response?.template?.author?.id === session?.data?.user?.id;

  const getAnswerValue = (questionId) => {
    if (!response?.answers) return '-';

    const answer = response.answers.find((a) => a.questionId === questionId);
    if (!answer?.value) return '-';

    const question = response.template.questions.find(
      (q) => q.id === questionId
    );
    if (!question?.type) return answer.value;

    switch (question.type) {
      case 'CHECKBOX':
        return answer.value === 'true' ? 'Yes' : 'No';
      case 'NUMBER':
        return parseInt(answer.value).toLocaleString();
      default:
        return answer.value;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center justify-between">
            <span>
              {loading
                ? 'Loading Response'
                : error
                  ? 'Error Loading Response'
                  : 'Response Details'}
            </span>
            {!loading &&
              !error &&
              response &&
              response.updatedAt !== response.createdAt && (
                <Badge variant="outline">Updated</Badge>
              )}
            {!loading &&
              !error &&
              response &&
              response.updatedAt === response.createdAt && (
                <Badge variant="secondary">Submitted</Badge>
              )}
          </DialogTitle>
        </DialogHeader>

        {!loading && !error && response && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-2">
            <div>
              <p className="text-muted-foreground">
                Submitted by:{' '}
                <span className="font-medium text-foreground">
                  {response.user?.name || 'Unknown User'}
                </span>
              </p>
              <p className="text-muted-foreground">
                Email:{' '}
                <span className="font-medium text-foreground">
                  {response.user?.email || 'No email available'}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">
                Submitted on:{' '}
                <span className="font-medium text-foreground">
                  {formatDate(response.createdAt)}
                </span>
              </p>
              {(isTemplateOwner || isAdmin) &&
                response.updatedAt &&
                response.updatedAt !== response.createdAt && (
                  <p className="text-muted-foreground">
                    Updated on:{' '}
                    <span className="font-medium text-foreground">
                      {formatDate(response.updatedAt)}
                    </span>
                  </p>
                )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-10 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="py-10 text-center text-destructive">
            <p>{error}</p>
          </div>
        ) : response ? (
          <>
            <Separator className="my-4" />

            <div className="space-y-6">
              {response.template && response.template.questions?.length > 0 ? (
                response.template.questions.map((question) => (
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

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button asChild>
                <Link
                  href={`/templates/${templateId}/responses/${responseId}`}
                  className="flex items-center gap-1"
                >
                  <span>Full View</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            <p>No response data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
