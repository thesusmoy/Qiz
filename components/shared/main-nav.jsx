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
    <header className="sticky top-0 z-50 w-full border-b bg-white text-black backdrop-blur-xl shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-6">
          {/* Logo and Brand */}
          <Link
            href="/"
            className="hidden md:flex items-center gap-2 font-extrabold text-2xl tracking-tight text-black hover:text-gray-700 transition-colors"
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
                    variant="outline"
                    className="border-gray-300 bg-white hover:bg-gray-100 "
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
                    className="w-64 rounded-2xl shadow-2xl border border-gray-100 bg-white text-black p-2"
                  >
                    <DropdownMenuItem
                      asChild
                      className="hover:bg-gray-100 rounded-xl transition flex items-center gap-3 py-3 px-2"
                    >
                      <Link href="/profile" className="w-full cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-black font-bold text-lg">
                            {user.name?.[0]}
                          </div>
                          <div className="flex flex-col w-full">
                            <span className="font-semibold truncate text-black text-base">
                              {user.name}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5 truncate">
                              {user.email}
                            </span>
                            {user.role === 'ADMIN' && (
                              <span className="text-xs bg-gray-200 text-black px-1.5 py-0.5 rounded mt-1 inline-block font-bold">
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
                          <DropdownMenuSubTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 font-semibold text-black transition">
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
                            <DropdownMenuSubContent className="w-56 rounded-xl bg-white shadow-xl border border-gray-100 p-2">
                              <DropdownMenuItem
                                asChild
                                className="hover:bg-gray-100 rounded-lg px-3 py-2 font-medium text-black flex items-center gap-2"
                              >
                                <Link
                                  href="/admin/users"
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
                                      d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75"
                                    />
                                  </svg>
                                  Users Management
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                asChild
                                className="hover:bg-gray-100 rounded-lg px-3 py-2 font-medium text-black flex items-center gap-2"
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
                                className="hover:bg-gray-100 rounded-lg px-3 py-2 font-medium text-black flex items-center gap-2"
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
                      <DropdownMenuSubTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 font-semibold text-black transition">
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>My Content</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="w-56 rounded-xl bg-white shadow-xl border border-gray-100 p-2">
                          <DropdownMenuItem
                            asChild
                            className="hover:bg-gray-100 rounded-lg px-3 py-2 font-medium text-black flex items-center gap-2"
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
                            className="hover:bg-gray-100 rounded-lg px-3 py-2 font-medium text-black flex items-center gap-2"
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
                      <Link href="/templates" className="w-full cursor-pointer">
                        Templates
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer text-red-600 font-semibold hover:bg-red-50 rounded-xl transition py-3 px-2 flex items-center gap-2"
                    >
                      <svg
                        className="h-5 w-5 text-red-500"
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
                    variant="outline"
                    size="sm"
                    className="border-gray-300 font-semibold text-black hover:bg-gray-100"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="hidden sm:block">
                  <Button
                    size="sm"
                    className="bg-black hover:bg-gray-900 text-white font-semibold"
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
