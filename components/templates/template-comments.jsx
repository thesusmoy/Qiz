'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { addComment } from '@/lib/actions/template-social-actions';
import { formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function CommentForm({ templateId }) {
  const router = useRouter();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await addComment(templateId, content);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        return;
      }

      setContent('');
      router.refresh();
      toast({
        title: 'Success',
        description: 'Comment added successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="p-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <Textarea
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading || !content.trim()}>
            {isLoading ? 'Adding...' : 'Add Comment'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function CommentList({ comments }) {
  const [expanded, setExpanded] = useState(false);
  
  const initialCommentCount = 3;
  const visibleComments = expanded
    ? comments
    : comments.slice(0, initialCommentCount);
  const hasMoreComments = comments.length > initialCommentCount;

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <Card className="p-4">
          <p className="text-center text-sm text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        </Card>
      ) : (
        <>
          <ScrollArea
            className={expanded && comments.length > 10 ? 'max-h-[500px]' : ''}
          >
            <div
              className={`space-y-4 ${!expanded && comments.length > initialCommentCount ? 'pb-2' : ''}`}
            >
              {visibleComments.map((comment) => (
                <Card key={comment.id} className="p-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">
                          {comment.author.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm">{comment.content}</p>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {hasMoreComments && (
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center gap-1"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span>Show less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span>Show all {comments.length} comments</span>
                </>
              )}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
