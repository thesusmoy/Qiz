'use client';

import { Card } from '@/components/ui/card';
import { TextIcon, AlignLeft, Hash, CheckSquare } from 'lucide-react';
import { QUESTION_TYPES } from '@/lib/constants/questions';

const TYPE_ICONS = {
  [QUESTION_TYPES.SINGLE_LINE]: TextIcon,
  [QUESTION_TYPES.MULTI_LINE]: AlignLeft,
  [QUESTION_TYPES.INTEGER]: Hash,
  [QUESTION_TYPES.CHECKBOX]: CheckSquare,
};

export function QuestionTypeCard({ type, label, count, onClick, disabled }) {
  const Icon = TYPE_ICONS[type];

  return (
    <Card
      onClick={() => !disabled && onClick?.()}
      className={`p-4 cursor-pointer transition-all ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:border-primary hover:shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{count}/4</span>
      </div>
      <h3 className="font-medium">{label}</h3>
    </Card>
  );
}
