// import { Skeleton } from '@/components/ui/skeleton';
// import { Separator } from '@/components/ui/separator';

// export default function HomeLoading() {
//   return (
//     <div className="container max-w-7xl py-6 space-y-8">
//       {}
//       <div className="text-center space-y-2">
//         <h1 className="text-4xl font-bold">Welcome to QIZ Platform</h1>
//         <p className="text-xl text-muted-foreground">
//           Create and share forms, surveys, and quizzes
//         </p>
//       </div>

//       <Separator />

//       {}
//       <section>
//         <h2 className="text-2xl font-bold mb-4">Latest Templates</h2>
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {Array(3)
//             .fill(null)
//             .map((_, i) => (
//               <div key={`latest-${i}`} className="rounded-lg border h-[380px]">
//                 <div className="relative w-full h-[180px]">
//                   <Skeleton className="h-full w-full rounded-t-lg" />
//                 </div>
//                 <div className="p-4 space-y-4">
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <Skeleton className="h-6 w-3/4" />
//                       <Skeleton className="h-4 w-4 rounded-full" />
//                     </div>
//                     <Skeleton className="h-4 w-full" />
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     <Skeleton className="h-5 w-16" />
//                     <Skeleton className="h-5 w-20" />
//                   </div>
//                   <div className="flex items-center justify-end gap-2 pt-4 mt-auto">
//                     <Skeleton className="h-8 w-8" />
//                     <Skeleton className="h-8 w-8" />
//                     <Skeleton className="h-8 w-8" />
//                   </div>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </section>

//       <Separator />

//       {}
//       <section>
//         <h2 className="text-2xl font-bold mb-4">Most Popular Templates</h2>
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {Array(3)
//             .fill(null)
//             .map((_, i) => (
//               <div key={`popular-${i}`} className="rounded-lg border h-[380px]">
//                 <div className="relative w-full h-[180px]">
//                   <Skeleton className="h-full w-full rounded-t-lg" />
//                 </div>
//                 <div className="p-4 space-y-4">
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <Skeleton className="h-6 w-3/4" />
//                       <Skeleton className="h-4 w-4 rounded-full" />
//                     </div>
//                     <Skeleton className="h-4 w-full" />
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     <Skeleton className="h-5 w-16" />
//                     <Skeleton className="h-5 w-20" />
//                   </div>
//                   <div className="flex items-center justify-end gap-2 pt-4 mt-auto">
//                     <Skeleton className="h-8 w-8" />
//                     <Skeleton className="h-8 w-8" />
//                     <Skeleton className="h-8 w-8" />
//                   </div>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </section>

//       <Separator />

//       {}
//       <section>
//         <h2 className="text-2xl font-bold mb-4">Popular Tags</h2>
//         <div className="flex flex-wrap gap-2">
//           {Array(8)
//             .fill(null)
//             .map((_, i) => (
//               <Skeleton key={`tag-${i}`} className="h-8 w-24" />
//             ))}
//         </div>
//       </section>
//     </div>
//   );
// }

import { auth } from '@/auth';
import {
  getLatestTemplates,
  getTopTemplates,
  getPopularTags,
} from '@/lib/actions/template-actions';
import { TemplateCarousel } from '@/components/home/templates/template-carousel';
import { TagCloud } from '@/components/home/tag-cloud';
import { Separator } from '@/components/ui/separator';

export default async function HomePage() {
  const session = await auth();
  const latestTemplates = await getLatestTemplates(5);
  const topTemplates = await getTopTemplates(5);
  const popularTags = await getPopularTags();

  return (
    <div className="container max-w-7xl py-12 space-y-12 bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col items-center justify-center min-h-[90vh] font-sans">
      <div className="w-full text-center space-y-4 pt-6">
        <h1 className="text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-indigo-700 via-purple-700 to-cyan-500 bg-clip-text text-transparent drop-shadow-xl font-sans">
          Welcome to QIZ Platform
        </h1>
        {session?.user ? (
          <p className="text-2xl text-gray-700 font-medium">
            Welcome back, {session.user.name}!
          </p>
        ) : (
          <p className="text-2xl text-gray-600 font-medium">
            Create and share customizable forms, surveys, and quizzes
          </p>
        )}
      </div>
      <Separator />
      {/* <section className="w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          Latest Templates
        </h2>
        <TemplateCarousel templates={latestTemplates} count={5} />
      </section>
      <Separator /> */}
      <section className="w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          Latest Templates
        </h2>
        <TemplateCarousel templates={topTemplates} count={5} />
      </section>
      <Separator />
      <section className="w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Popular Tags</h2>
        <TagCloud tags={popularTags} />
      </section>
      <footer className="w-full pt-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} QIZ Platform. All rights reserved.
      </footer>
    </div>
  );
}
