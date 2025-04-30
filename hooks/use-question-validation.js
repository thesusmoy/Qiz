// hooks/use-question-validation.js
'use client';

import { useToast } from '@/hooks/use-toast';
import { QUESTION_TYPES } from '@/lib/constants/questions';

/**
 * Custom hook for validating template questions
 * @returns {Object} Validation methods
 */
export function useQuestionValidation() {
  const { toast } = useToast();

  /**
   * Validates that all questions are properly configured
   * @param {Array} questions - Array of question objects to validate
   * @returns {boolean} Whether the questions are valid
   */
  const validateQuestions = (questions) => {
    // Check if there are any questions
    if (!questions || questions.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please add at least one question',
      });
      return false;
    }

    // Check for questions without titles
    const emptyTitleQuestions = questions.filter((q) => !q.text?.trim());
    if (emptyTitleQuestions.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `${emptyTitleQuestions.length} question(s) are missing titles. All questions must have a title.`,
      });
      return false;
    }

    // All validations passed
    return true;
  };

  return {
    validateQuestions,
  };
}
