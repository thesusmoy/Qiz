'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { QuestionTypeCards } from './question-type-cards';
import { SortableQuestionForm } from './sortable-question-form';

export function QuestionsSection({ value = [], onChange }) {
  const [questions, setQuestions] = useState(value);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const questionCounts = questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {});

  const handleQuestionAdd = (type) => {
    const newQuestion = {
      id: `temp_${Date.now()}`,
      type,
      text: '',
      description: '',
      required: true,
      showInResults: true,
    };
    const newQuestions = [...questions, newQuestion];
    setQuestions(newQuestions);
    onChange?.(newQuestions);
  };

  const handleQuestionChange = (id, changes) => {
    const newQuestions = questions.map((q) =>
      q.id === id ? { ...q, ...changes } : q
    );
    setQuestions(newQuestions);
    onChange?.(newQuestions);
  };

  const handleQuestionRemove = (id) => {
    const newQuestions = questions.filter((q) => q.id !== id);
    setQuestions(newQuestions);
    onChange?.(newQuestions);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);

    const newQuestions = arrayMove(questions, oldIndex, newIndex);
    setQuestions(newQuestions);
    onChange?.(newQuestions);
  };

  return (
    <div className="space-y-6">
      <QuestionTypeCards
        onSelect={handleQuestionAdd}
        questionCounts={questionCounts}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {questions.map((question, index) => (
              <SortableQuestionForm
                key={question.id}
                id={question.id}
                type={question.type}
                initialData={question}
                index={index}
                onChange={(changes) =>
                  handleQuestionChange(question.id, changes)
                }
                onRemove={() => handleQuestionRemove(question.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
