
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Heart } from 'lucide-react';
import { toggleLike } from '@/lib/actions/template-social-actions';

export function TemplateLikeButton({ templateId, initialLiked, likeCount }) {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [count, setCount] = useState(likeCount);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLike() {
    setIsLoading(true);
    try {
      const result = await toggleLike(templateId);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        return;
      }

      setIsLiked(!isLiked);
      setCount(count + (isLiked ? -1 : 1));
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
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={handleLike}
      disabled={isLoading}
    >
      <Heart
        className={`h-4 w-4 ${isLiked ? 'fill-current text-red-500' : ''}`}
      />
      <span>{count}</span>
    </Button>
  );
}
