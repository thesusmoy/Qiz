'use client';

import { useToast } from '@/hooks/use-toast';
import { QUESTION_TYPES } from '@/lib/constants/questions';

export function useQuestionValidation() {
  const { toast } = useToast();

  const validateQuestions = (questions) => {
    if (!questions || questions.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please add at least one question',
      });
      return false;
    }

    const emptyTitleQuestions = questions.filter((q) => !q.text?.trim());
    if (emptyTitleQuestions.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `${emptyTitleQuestions.length} question(s) are missing titles. All questions must have a title.`,
      });
      return false;
    }

    return true;
  };

  return {
    validateQuestions,
  };
}
