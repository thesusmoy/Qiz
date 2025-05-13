'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Grip, Trash2 } from 'lucide-react';
import { QUESTION_TYPE_LABELS } from '@/lib/constants/questions';
import { FormControl, FormItem, FormMessage } from '../ui/form';

export function SortableQuestionForm({
  id,
  type,
  initialData = {},
  onChange,
  onRemove,
}) {
  const [touched, setTouched] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 ${isDragging ? 'z-50 shadow-lg border-primary' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div {...attributes} {...listeners} className="cursor-grab mt-1">
          <Grip className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {QUESTION_TYPE_LABELS[type]}
            </span>
            <Button variant="ghost" size="icon" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Question Title"
                  value={initialData.text || ''}
                  onChange={(e) => onChange({ text: e.target.value })}
                  onBlur={() => setTouched(true)}
                />
              </FormControl>
              {touched && !initialData.text && (
                <FormMessage>Question title is required</FormMessage>
              )}
            </FormItem>

            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Description (Optional)"
                  value={initialData.description || ''}
                  onChange={(e) => onChange({ description: e.target.value })}
                  rows={3}
                />
              </FormControl>
            </FormItem>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={initialData.required !== false}
                  onCheckedChange={(checked) => onChange({ required: checked })}
                />
                <span className="text-sm">Required question</span>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={initialData.showInResults || false}
                  onCheckedChange={(checked) =>
                    onChange({ showInResults: checked })
                  }
                />
                <span className="text-sm">Show in Results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
