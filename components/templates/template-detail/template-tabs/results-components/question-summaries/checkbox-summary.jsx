import { Badge } from '@/components/ui/badge';

export function CheckboxQuestionSummary({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex justify-between mb-2">
          <p className="text-sm text-muted-foreground">Checked vs Unchecked</p>
          <Badge variant="outline">{data.percentage.toFixed(1)}% checked</Badge>
        </div>
        <div className="w-full bg-secondary h-4 rounded-full">
          <div
            className="bg-primary h-4 rounded-full"
            style={{ width: `${data.percentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span>Checked: {data.trueCount}</span>
          <span>Unchecked: {data.falseCount}</span>
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
              {data.trueCount} ({data.percentage.toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-3 w-3 rounded-full bg-secondary"></div>
            <span>Unchecked</span>
            <span className="font-medium ml-auto">
              {data.falseCount} ({(100 - data.percentage).toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
