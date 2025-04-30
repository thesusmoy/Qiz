'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NumberQuestionSummary } from './question-summaries/number-summary';
import { TextQuestionSummary } from './question-summaries/text-summary';
import { CheckboxQuestionSummary } from './question-summaries/checkbox-summary';

export function QuestionSummaryCard({ questionData, responseCount }) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-md">{questionData.questionText}</CardTitle>
          <Badge className="mt-2 sm:mt-0">{questionData.type}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {questionData.type === 'NUMBER' && (
          <NumberQuestionSummary data={questionData} />
        )}

        {(questionData.type === 'TEXT' || questionData.type === 'TEXTAREA') && (
          <TextQuestionSummary
            data={questionData}
            responseCount={responseCount}
          />
        )}

        {questionData.type === 'CHECKBOX' && (
          <CheckboxQuestionSummary data={questionData} />
        )}
      </CardContent>
    </Card>
  );
}
