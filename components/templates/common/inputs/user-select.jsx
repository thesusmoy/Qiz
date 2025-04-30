'use client';

import { useState, useCallback } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Command } from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { searchUsers } from '@/lib/actions/user-actions';
import { useToast } from '@/hooks/use-toast';

export function UserSelect({ value, onChange, disabled }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('name');

  const searchUsersDebounced = useCallback(
    async (search) => {
      if (!search.trim()) {
        setUsers([]);
        return;
      }

      setIsLoading(true);
      try {
        const result = await searchUsers(search);

        if (result.error) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error,
          });
          return;
        }

        setUsers(result.data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to search users',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const selectedUsers = value ? value.split(',').filter(Boolean) : [];

  const sortedUsers = [...users].sort((a, b) =>
    sortBy === 'name'
      ? a.name.localeCompare(b.name)
      : a.email.localeCompare(b.email)
  );

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedUsers.length > 0
              ? `${selectedUsers.length} user${selectedUsers.length === 1 ? '' : 's'} selected`
              : 'Select users...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <div className="flex items-center border-b px-3">
              <input
                placeholder="Search users..."
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  searchUsersDebounced(e.target.value);
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortBy(sortBy === 'name' ? 'email' : 'name')}
              >
                Sort by {sortBy === 'name' ? 'Email' : 'Name'}
              </Button>
            </div>
            <div className="max-h-[300px] overflow-auto">
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : sortedUsers.length > 0 ? (
                sortedUsers.map((user) => (
                  <div
                    key={user.email}
                    className={cn(
                      'flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-accent',
                      selectedUsers.includes(user.email) && 'bg-accent'
                    )}
                    onClick={() => {
                      const newUsers = selectedUsers.includes(user.email)
                        ? selectedUsers.filter((email) => email !== user.email)
                        : [...selectedUsers, user.email];
                      onChange(newUsers.join(','));
                    }}
                  >
                    <div>
                      <div>{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                    {selectedUsers.includes(user.email) && (
                      <Check className="h-4 w-4" />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {searchTerm
                    ? 'No users found'
                    : 'Start typing to search users'}
                </div>
              )}
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      {}
      <div className="flex flex-wrap gap-2">
        {selectedUsers.map((email) => (
          <div
            key={email}
            className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-md"
          >
            <span className="text-sm">{email}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => {
                const newUsers = selectedUsers.filter((e) => e !== email);
                onChange(newUsers.join(','));
              }}
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
