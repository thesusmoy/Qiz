import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/client';

async function getAggregatedResultsForTemplate(templateId) {
  const responses = await prisma.formResponse.findMany({
    where: { templateId },
    include: { answers: true },
  });
  const totalResponses = responses.length;
  const questionStats = {};
  for (const response of responses) {
    for (const answer of response.answers) {
      if (!questionStats[answer.questionId])
        questionStats[answer.questionId] = [];
      questionStats[answer.questionId].push(answer.value);
    }
  }

  const aggregated = {};
  for (const [questionId, answers] of Object.entries(questionStats)) {
    const counts = {};
    for (const value of answers) {
      counts[value] = (counts[value] || 0) + 1;
    }
    aggregated[questionId] = counts;
  }
  return { totalResponses, questionStats: aggregated };
}

export async function GET(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Missing or invalid Authorization header' },
      { status: 401 }
    );
  }
  const apiToken = authHeader.replace('Bearer ', '');
  const user = await prisma.user.findUnique({ where: { apiToken } });
  if (!user) {
    return NextResponse.json({ error: 'Invalid API token' }, { status: 403 });
  }
  const templates = await prisma.template.findMany({
    where: { authorId: user.id },
    include: { questions: true },
  });

  const results = [];
  for (const template of templates) {
    const agg = await getAggregatedResultsForTemplate(template.id);
    results.push({
      templateId: template.id,
      title: template.title,
      questions: template.questions,
      aggregated: agg,
    });
  }
  return NextResponse.json({ templates: results });
}
