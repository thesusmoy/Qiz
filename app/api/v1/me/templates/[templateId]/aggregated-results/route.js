import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/client';
import { authenticateApiRequest } from '@/lib/actions/auth-api';

async function calculateAggregatedResults(templateId, userId) {
  const template = await prisma.template.findUnique({
    where: { id: templateId },
    include: {
      questions: {
        orderBy: { order: 'asc' },
      },
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!template) {
    return { error: 'Template not found', status: 404 };
  }

  // Ensure the authenticated user owns this template
  if (template.userId !== userId) {
    return {
      error: 'Forbidden: You do not have access to this template',
      status: 403,
    };
  }

  const responses = await prisma.response.findMany({
    where: { templateId: templateId },
    include: {
      answers: {
        include: {
          question: true,
        },
      },
    },
  });

  const aggregatedQuestions = template.questions.map((question) => {
    const questionAggregates = {
      questionId: question.id,
      text: question.text,
      type: question.type,
      options: question.options,
      totalResponsesForQuestion: 0,
    };

    const relevantAnswers = responses.flatMap((r) =>
      r.answers.filter((a) => a.questionId === question.id)
    );
    questionAggregates.totalResponsesForQuestion = relevantAnswers.length;

    if (relevantAnswers.length === 0) {
      return questionAggregates;
    }

    switch (question.type) {
      case 'RATING':
      case 'NUMBER_INPUT':
        const numericValues = relevantAnswers
          .map((a) => parseFloat(a.value))
          .filter((v) => !isNaN(v));
        if (numericValues.length > 0) {
          questionAggregates.min = Math.min(...numericValues);
          questionAggregates.max = Math.max(...numericValues);
          questionAggregates.average = parseFloat(
            (
              numericValues.reduce((sum, val) => sum + val, 0) /
              numericValues.length
            ).toFixed(2)
          );
        }
        break;

      case 'SHORT_TEXT':
      case 'LONG_TEXT':
      case 'SINGLE_CHOICE':
      case 'DROPDOWN':
        const textCounts = {};
        relevantAnswers.forEach((a) => {
          const value = a.value;
          textCounts[value] = (textCounts[value] || 0) + 1;
        });
        questionAggregates.popularAnswers = Object.entries(textCounts)
          .sort(([, countA], [, countB]) => countB - countA)
          .slice(0, 5)
          .map(([answer, count]) => ({ answer, count }));
        break;

      case 'MULTIPLE_CHOICE':
        const mcCounts = {};
        relevantAnswers.forEach((a) => {
          try {
            const selectedOptions = JSON.parse(a.value);
            if (Array.isArray(selectedOptions)) {
              selectedOptions.forEach((option) => {
                mcCounts[option] = (mcCounts[option] || 0) + 1;
              });
            }
          } catch (e) {}
        });
        questionAggregates.popularAnswers = Object.entries(mcCounts)
          .sort(([, countA], [, countB]) => countB - countA)
          .slice(0, 5)
          .map(([answer, count]) => ({ answer, count }));
        break;

      case 'BOOLEAN':
        questionAggregates.trueCount = relevantAnswers.filter(
          (a) => a.value === 'true' || a.value === true
        ).length;
        questionAggregates.falseCount = relevantAnswers.filter(
          (a) => a.value === 'false' || a.value === false
        ).length;
        break;
      default:
        break;
    }
    return questionAggregates;
  });

  return {
    data: {
      templateId: template.id,
      templateTitle: template.title,
      author: { name: template.user.name, email: template.user.email },
      totalResponses: responses.length,
      questions: aggregatedQuestions,
    },
    status: 200,
  };
}

export async function GET(request, { params }) {
  try {
    const {
      user,
      error: authError,
      status: authStatus,
    } = await authenticateApiRequest(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: authStatus });
    }

    const { templateId } = params;
    const { data, error, status } = await calculateAggregatedResults(
      templateId,
      user.id
    );

    return NextResponse.json(data || { error }, { status });
  } catch (err) {
    console.error(
      `API Error fetching aggregated results for template ${params.templateId}:`,
      err
    );
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
