'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { TEMPLATE_TOPICS } from '@/lib/constants/templates';
import { useQueryParams } from '@/hooks/use-query-params';
import { useOptimisticFilter } from '@/hooks/use-optimistic-filter';
import {
  VIEW_FILTERS,
  STATUS_FILTERS,
  TIME_FILTERS,
  DEFAULT_SORT,
  getFilterById,
} from '@/lib/constants/filters';

export function TemplateFilters({
  currentTopic,
  currentTag,
  currentFilter,
  currentStatus,
  currentSort = DEFAULT_SORT,
}) {
  // Use the custom hooks for each filter type
  const filter = useOptimisticFilter(currentFilter, 'filter');
  const topic = useOptimisticFilter(currentTopic, 'topic');
  const sort = useOptimisticFilter(currentSort, 'sort', {
    preventToggle: true, // Sort should always have a value
  });
  const status = useOptimisticFilter(currentStatus, 'status');

  // For tag which has a different toggle behavior
  const { toggleParam } = useQueryParams({ baseUrl: '/templates' });

  const handleTagClick = (tag) => {
    toggleParam('tag', tag);
  };

  return (
    <div className="rounded-lg border bg-card sticky top-6">
      <div className="space-y-4 p-4">
        {/* View Filters */}
        <div>
          <h3 className="mb-2 text-sm font-medium tracking-tight">View</h3>
          <div className="flex flex-wrap gap-2">
            {VIEW_FILTERS.map((viewFilter) => (
              <Button
                key={viewFilter.id}
                variant={filter.value === viewFilter.id ? 'secondary' : 'ghost'}
                size="sm"
                className="justify-start"
                onClick={() => filter.handleChange(viewFilter.id)}
              >
                <viewFilter.icon className="mr-2 h-4 w-4" />
                {viewFilter.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Status Filters */}
        <div>
          <h3 className="mb-2 text-sm font-medium tracking-tight">Status</h3>
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((statusFilter) => (
              <Button
                key={statusFilter.id}
                variant={
                  status.value === statusFilter.id ? 'secondary' : 'ghost'
                }
                size="sm"
                className="justify-start"
                onClick={() => status.handleChange(statusFilter.id)}
              >
                <statusFilter.icon className="mr-2 h-4 w-4" />
                {statusFilter.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Sort Filters */}
        <div>
          <h3 className="mb-2 text-sm font-medium tracking-tight">Sort By</h3>
          <div className="flex flex-wrap gap-2">
            {TIME_FILTERS.map((sortOption) => (
              <Button
                key={sortOption.id}
                variant={sort.value === sortOption.id ? 'secondary' : 'ghost'}
                size="sm"
                className="justify-start"
                onClick={() => sort.handleChange(sortOption.id)}
              >
                <sortOption.icon className="mr-2 h-4 w-4" />
                {sortOption.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Topics */}
        <div>
          <h3 className="mb-2 text-sm font-medium tracking-tight">Topics</h3>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 pb-4">
              {TEMPLATE_TOPICS.map((topicName) => (
                <Button
                  key={topicName}
                  variant={topic.value === topicName ? 'secondary' : 'ghost'}
                  size="sm"
                  className="min-w-fit"
                  onClick={() => topic.handleChange(topicName)}
                >
                  {topicName}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Active Filters */}
        {(filter.isActive ||
          topic.isActive ||
          currentTag ||
          status.isActive) && (
          <>
            <Separator />
            <div>
              <h3 className="mb-2 text-sm font-medium tracking-tight">
                Active Filters
              </h3>
              <div className="flex flex-wrap gap-2">
                {filter.isActive && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => filter.handleChange(filter.value)}
                  >
                    {getFilterById(VIEW_FILTERS, filter.value)?.label}
                    <span className="text-muted-foreground">×</span>
                  </Button>
                )}
                {status.isActive && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => status.handleChange(status.value)}
                  >
                    {getFilterById(STATUS_FILTERS, status.value)?.label}
                    <span className="text-muted-foreground">×</span>
                  </Button>
                )}
                {topic.isActive && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => topic.handleChange(topic.value)}
                  >
                    Topic: {topic.value}
                    <span className="text-muted-foreground">×</span>
                  </Button>
                )}
                {currentTag && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleTagClick(currentTag)}
                  >
                    Tag: {currentTag}
                    <span className="text-muted-foreground">×</span>
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
