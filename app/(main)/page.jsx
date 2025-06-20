import { auth } from '@/auth';
import {
  getTopTemplates,
  getPopularTags,
} from '@/lib/actions/template-actions';
import { TemplateCarousel } from '@/components/home/templates/template-carousel';
import { TagCloud } from '@/components/home/tag-cloud';
import { Separator } from '@/components/ui/separator';

export default async function HomePage() {
  const session = await auth();
  const topTemplates = await getTopTemplates(5);
  const popularTags = await getPopularTags();

  return (
    <div className="container max-w-7xl py-12 space-y-12 bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col items-center justify-center min-h-[90vh] font-sans dark:bg-gray-900 dark:border-gray-800">
      <div className="w-full text-center space-y-4 pt-6">
        <h1 className="text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-indigo-700 via-purple-700 to-cyan-500 bg-clip-text text-transparent drop-shadow-xl font-sans">
          Welcome to QIZ Platform
        </h1>
        {session?.user ? (
          <p className="text-2xl text-gray-700 font-medium dark:text-gray-200">
            Welcome back, {session.user.name}!
          </p>
        ) : (
          <p className="text-2xl text-gray-600 font-medium dark:text-gray-300">
            Create and share customizable forms, surveys, and quizzes
          </p>
        )}
      </div>
      <Separator />
      <section className="w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Our Templates ({topTemplates.length})
        </h2>
        <TemplateCarousel
          templates={topTemplates}
          count={topTemplates.length + 1}
        />
      </section>
      <Separator />
      <section className="w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Popular Tags
        </h2>
        <TagCloud tags={popularTags} />
      </section>
      <footer className="w-full pt-8 text-center text-xs text-gray-400 dark:text-gray-500">
        © {new Date().getFullYear()} QIZ Platform. All rights reserved.
      </footer>
    </div>
  );
}
