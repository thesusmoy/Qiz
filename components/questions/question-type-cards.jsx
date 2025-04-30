'use client';

import { Card } from '@/components/ui/card';
import { TextIcon, AlignLeft, Hash, CheckSquare } from 'lucide-react';
import { QUESTION_TYPES } from '@/lib/constants/questions';

export function QuestionTypeCards({ onSelect, questionCounts = {} }) {
  const typeConfig = [
    {
      type: QUESTION_TYPES.SINGLE_LINE,
      icon: TextIcon,
      label: 'Single Line',
      description: 'Short text answer',
    },
    {
      type: QUESTION_TYPES.MULTI_LINE,
      icon: AlignLeft,
      label: 'Multi Line',
      description: 'Long text answer',
    },
    {
      type: QUESTION_TYPES.INTEGER,
      icon: Hash,
      label: 'Number',
      description: 'Numeric answer',
    },
    {
      type: QUESTION_TYPES.CHECKBOX,
      icon: CheckSquare,
      label: 'Checkbox',
      description: 'Yes/No answer',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {typeConfig.map(({ type, icon: Icon, label, description }) => {
        const count = questionCounts[type] || 0;
        const isDisabled = count >= 4;

        return (
          <Card
            key={type}
            onClick={() => !isDisabled && onSelect(type)}
            className={`flex items-center justify-between p-4 cursor-pointer transition-all ${
              isDisabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:border-primary hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">{label}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">{count}/4</span>
          </Card>
        );
      })}
    </div>
  );
}
