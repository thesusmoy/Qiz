'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function ResponseSummary({ aggregatedData, responseCount, isLoading }) {
  const isNumberType = (type) => {
    if (!type) return false;
    const lowerType = type.toLowerCase();
    return lowerType === 'number' || lowerType === 'integer';
  };

  const isTextType = (type) => {
    if (!type) return false;
    const lowerType = type.toLowerCase();
    return (
      lowerType === 'text' ||
      lowerType === 'textarea' ||
      lowerType === 'single_line' ||
      lowerType === 'multi_line'
    );
  };

  const isCheckboxType = (type) => {
    if (!type) return false;
    return type.toLowerCase() === 'checkbox';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            Response Summary
          </CardTitle>
          <Badge variant="outline" className="ml-2">
            {responseCount} {responseCount === 1 ? 'response' : 'responses'}{' '}
            total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : responseCount === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No data to summarize</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(aggregatedData).map(([questionId, question]) => (
              <Card key={questionId} className="border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-md">
                      {question.questionText}
                    </CardTitle>
                    <Badge className="mt-2 sm:mt-0">{question.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* NUMBER/INTEGER type question */}
                  {isNumberType(question.type) && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                          Total Responses
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {question.count || 0}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center">
                        <p className="text-sm text-muted-foreground">Average</p>
                        <p className="text-2xl font-bold mt-1">
                          {question.average?.toFixed(2) || 'N/A'}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center">
                        <p className="text-sm text-muted-foreground">Sum</p>
                        <p className="text-2xl font-bold mt-1">
                          {question.sum || 0}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TEXT or TEXTAREA type question */}
                  {isTextType(question.type) && (
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Most Common Answer
                      </p>
                      {question.mostFrequent?.value ? (
                        <div className="mt-3">
                          <div className="flex justify-between items-center">
                            <div className="max-w-[80%]">
                              <p className="text-md font-medium line-clamp-2">
                                &quot;{question.mostFrequent.value}&quot;
                              </p>
                            </div>
                            <Badge variant="secondary">
                              {question.mostFrequent.count}{' '}
                              {question.mostFrequent.count === 1
                                ? 'response'
                                : 'responses'}
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <div className="w-full bg-secondary h-2 rounded-full">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (question.mostFrequent.count /
                                      responseCount) *
                                      100
                                  )}%`,
                                }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 text-right">
                              {Math.round(
                                (question.mostFrequent.count / responseCount) *
                                  100
                              )}
                              % of responses
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-md mt-2">No common answer found</p>
                      )}
                    </div>
                  )}

                  {isCheckboxType(question.type) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <p className="text-sm text-muted-foreground">
                            Checked vs Unchecked
                          </p>
                          <Badge variant="outline">
                            {question.percentage?.toFixed(1) || '0'}% checked
                          </Badge>
                        </div>
                        <div className="w-full bg-secondary h-4 rounded-full">
                          <div
                            className="bg-primary h-4 rounded-full"
                            style={{ width: `${question.percentage || 0}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-2 text-sm">
                          <span>Checked: {question.trueCount || 0}</span>
                          <span>Unchecked: {question.falseCount || 0}</span>
                        </div>
                      </div>

                      <div className="bg-muted p-4 rounded-lg flex flex-col justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Response Distribution
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-primary"></div>
                            <span>Checked</span>
                            <span className="font-medium ml-auto">
                              {question.trueCount || 0} (
                              {question.percentage?.toFixed(1) || '0'}%)
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="h-3 w-3 rounded-full bg-secondary"></div>
                            <span>Unchecked</span>
                            <span className="font-medium ml-auto">
                              {question.falseCount || 0} (
                              {(100 - (question.percentage || 0)).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
