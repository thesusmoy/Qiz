'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { TEMPLATE_TOPICS } from '@/lib/constants/templates';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { GlobalSearch } from '@/components/shared/global-search';

export const mainNavItems = [
  {
    title: 'Templates',
    href: '/templates',
  },
  {
    title: 'My Responses',
    href: '/forms/my-responses',
  },
  {
    title: 'Profile',
    href: '/profile',
  },
];

export function MainNav() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTopic = searchParams.get('topic') || 'all';

  const createQueryString = useCallback(
    (params) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });

      return newParams.toString();
    },
    [searchParams]
  );

  const handleTopicChange = useCallback(
    (topic) => {
      const queryString = createQueryString({
        query: searchParams.get('query'),
        topic: topic === 'all' ? '' : topic,
      });
      router.push(`/templates${queryString ? `?${queryString}` : ''}`);
    },
    [createQueryString, router, searchParams]
  );

  const handleSignOut = async () => {
    // Store the current path with user ID as part of the key
    const currentPath = window.location.pathname + window.location.search;
    if (
      currentPath !== '/' &&
      currentPath !== '/login' &&
      currentPath !== '/register'
    ) {
      // Store both the user's email and the path
      if (user?.email) {
        localStorage.setItem(
          `returnPath_${encodeURIComponent(user.email)}`,
          currentPath
        );
      }
    }
    await signOut({
      redirect: true,
      callbackUrl: `/`,
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white text-black dark:bg-gray-900 dark:text-white backdrop-blur-xl shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-6">
          {/* Logo and Brand */}
          <Link
            href="/"
            className="hidden md:flex items-center gap-2 font-extrabold text-2xl tracking-tight text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300 transition-colors"
          >
            {/* Modern form SVG icon */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              className="inline-block"
            >
              <rect x="3" y="4" width="18" height="16" rx="3" fill="#6366f1" />
              <rect x="7" y="8" width="10" height="2" rx="1" fill="#fff" />
              <rect x="7" y="12" width="6" height="2" rx="1" fill="#fff" />
              <circle cx="17" cy="13" r="1" fill="#fff" />
            </svg>
            QIZ
          </Link>

          {/* Search and Topic Filter */}
          <div className="flex-1 flex gap-3 max-w-full md:max-w-2xl items-center">
            <GlobalSearch />
            <div className="hidden sm:flex shrink-0">
              <Select value={selectedTopic} onValueChange={handleTopicChange}>
                <SelectTrigger className="w-[180px] border-gray-300 shadow-sm">
                  <SelectValue placeholder="All Topics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Filter</SelectItem>
                  {TEMPLATE_TOPICS.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Navigation and User Controls */}
          <nav className="flex items-center gap-2 md:gap-4 shrink-0">
            {user ? (
              <>
                <Link href="/templates" className="hidden md:block">
                  <Button
                    size="sm"
                    className="bg-black hover:bg-gray-900 text-white font-semibold dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:hover:text-black"
                  >
                    Templates
                  </Button>
                </Link>
                <ThemeToggle />
                {/* User Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative border-gray-300 bg-white hover:bg-gray-100"
                    >
                      <UserIcon className="h-6 w-6 text-black" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 rounded-2xl shadow-2xl border bg-white  text-black font-semibold dark:bg-black dark:text-white p-2"
                  >
                    <DropdownMenuItem
                      asChild
                      className="hover:bg-gray-100 text-white dark:hover:bg-gray-800 dark:hover:text-white rounded-xl transition flex items-center gap-3 py-3 px-2"
                    >
                      <Link href="/profile" className="w-full cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-black font-bold text-lg">
                            {user.name?.[0]}
                          </div>
                          <div className="flex flex-col w-full">
                            <span className="font-semibold truncate text-black  text-base dark:text-white dark:group-hover:text-gray-300 group-hover:text-gray-700">
                              {user.name}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5 truncate dark:text-gray-400 dark:group-hover:text-gray-300 group-hover:text-gray-700">
                              {user.email}
                            </span>
                            {user.role === 'ADMIN' && (
                              <span className="text-xs bg-gray-200 text-black px-1.5 py-0.5 rounded mt-1 inline-block font-bold dark:bg-gray-700 dark:text-white">
                                Admin
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user.role === 'ADMIN' && (
                      <>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 font-semibold text-black dark:bg-gray-700 dark:text-white transition">
                            <svg
                              className="h-5 w-5 text-black"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16 3v4M8 3v4M4 11h16"
                              />
                            </svg>
                            <span>Admin Panel</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="w-56 rounded-xl bg-white dark:bg-black dark:text-white shadow-xl border border-gray-100 dark:border-gray-800 p-4">
                              <DropdownMenuItem
                                asChild
                                className="hover:bg-gray-100  dark:text-white rounded-lg px-3 py-2 font-medium text-black flex items-center gap-2"
                              >
                                <Link
                                  href="/admin/users"
                                  className="w-full cursor-pointer flex items-center gap-2"
                                >
                                  <svg
                                    className="text-gray-500"
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                  Users Management
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                asChild
                                className="hover:bg-gray-100 dark:text-white rounded-lg px-3 py-2 font-medium text-black flex items-center gap-2"
                              >
                                <Link
                                  href="/admin/templates"
                                  className="w-full cursor-pointer flex items-center gap-2"
                                >
                                  <svg
                                    className="h-4 w-4 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <rect
                                      width="18"
                                      height="14"
                                      x="3"
                                      y="5"
                                      rx="2"
                                    />
                                    <path d="M7 3v4M17 3v4" />
                                  </svg>
                                  Templates Management
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                asChild
                                className="hover:bg-gray-100 dark:text-white rounded-lg px-3 py-2 font-medium text-black flex items-center gap-2"
                              >
                                <Link
                                  href="/admin/responses"
                                  className="w-full cursor-pointer flex items-center gap-2"
                                >
                                  <svg
                                    className="h-4 w-4 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M8 17l4 4 4-4m-4-5v9"
                                    />
                                    <rect
                                      width="20"
                                      height="14"
                                      x="2"
                                      y="5"
                                      rx="2"
                                    />
                                  </svg>
                                  Responses Management
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 font-semibold text-black dark:bg-gray-700 dark:text-white transition">
                        <svg
                          className="h-5 w-5 "
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>My Content</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="w-56 rounded-xl bg-white dark:bg-black shadow-xl border border-gray-100 p-2">
                          <DropdownMenuItem
                            asChild
                            className="hover:bg-gray-100 rounded-lg px-3 py-2 font-medium text-black dark:text-white flex items-center gap-2"
                          >
                            <Link
                              href="/profile?tab=templates"
                              className="w-full cursor-pointer flex items-center gap-2"
                            >
                              <svg
                                className="h-4 w-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <rect
                                  width="18"
                                  height="14"
                                  x="3"
                                  y="5"
                                  rx="2"
                                />
                                <path d="M7 3v4M17 3v4" />
                              </svg>
                              My Templates
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            asChild
                            className="hover:bg-gray-100 dark:text-white rounded-lg px-3 py-2 font-medium text-black flex items-center gap-2"
                          >
                            <Link
                              href="/profile?tab=responses"
                              className="w-full cursor-pointer flex items-center gap-2"
                            >
                              <svg
                                className="h-4 w-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8 17l4 4 4-4m-4-5v9"
                                />
                                <rect
                                  width="20"
                                  height="14"
                                  x="2"
                                  y="5"
                                  rx="2"
                                />
                              </svg>
                              My Responses
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem className="md:hidden" asChild>
                      <Link
                        href="/templates"
                        className="w-full cursor-pointer "
                      >
                        Templates
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer text-gray-500 font-semibold hover:bg-red-50 rounded-xl transition py-3 px-2 flex items-center gap-2"
                    >
                      <svg
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                        />
                      </svg>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2 md:gap-4">
                <ThemeToggle />
                <Link href="/login">
                  <Button
                    size="sm"
                    className="bg-black hover:bg-gray-900 text-white font-semibold dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:hover:text-black"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="hidden sm:block">
                  <Button
                    size="sm"
                    className="bg-black hover:bg-gray-900 text-white font-semibold dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:hover:text-black"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
