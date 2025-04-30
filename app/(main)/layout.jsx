import { auth } from '@/auth';
import { MainLayout } from '@/components/layout/main-layout';


export default async function MainRootLayout({ children }) {
  const session = await auth();

  return <MainLayout user={session?.user}>{children}</MainLayout>;
}
