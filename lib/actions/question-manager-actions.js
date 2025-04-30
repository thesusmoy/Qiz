'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma/client';
import { revalidatePath } from 'next/cache';
import { QuestionSchema } from '@/lib/utils/validators';

export async function addQuestionToTemplate(templateId, formData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    
    const template = await prisma.template.findFirst({
      where: {
        id: templateId,
        authorId: session.user.id,
      },
      include: {
        questions: {
          select: {
            type: true,
            order: true,
          },
        },
      },
    });

    if (!template) {
      return { error: 'Template not found or access denied' };
    }

    
    const questionType = formData.get('type');
    const questionsOfType = template.questions.filter(
      (q) => q.type === questionType
    );
    if (questionsOfType.length >= 4) {
      return { error: `Maximum 4 questions of type ${questionType} allowed` };
    }

    
    const maxOrder =
      template.questions.length > 0
        ? Math.max(...template.questions.map((q) => q.order))
        : -1;
    const newOrder = maxOrder + 1;

    
    const questionData = {
      text: formData.get('text'),
      type: questionType,
      required: formData.get('required') === 'true',
      order: newOrder,
    };

    const validatedData = QuestionSchema.parse(questionData);

    
    const question = await prisma.question.create({
      data: {
        ...validatedData,
        templateId,
      },
    });

    revalidatePath(`/templates/${templateId}`);
    return { success: 'Question added successfully', data: question };
  } catch (error) {
    if (error.errors) {
      return { error: error.errors[0].message };
    }
    return { error: 'Failed to add question' };
  }
}

export async function reorderQuestions(templateId, orderedIds) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    
    const template = await prisma.template.findUnique({
      where: {
        id: templateId,
        authorId: session.user.id,
      },
    });

    if (!template) {
      return { error: 'Template not found or access denied' };
    }

    
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.question.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    revalidatePath(`/templates/${templateId}`);
    return { success: 'Questions reordered successfully' };
  } catch (error) {
    return { error: 'Failed to reorder questions' };
  }
}

export async function deleteQuestion(questionId) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        template: {
          select: { authorId: true },
        },
      },
    });

    if (!question) {
      return { error: 'Question not found' };
    }

    if (question.template.authorId !== session.user.id) {
      return { error: 'Not authorized' };
    }

    await prisma.question.delete({
      where: { id: questionId },
    });

    revalidatePath(`/templates/${question.templateId}`);
    return { success: 'Question deleted successfully' };
  } catch (error) {
    return { error: 'Failed to delete question' };
  }
}
