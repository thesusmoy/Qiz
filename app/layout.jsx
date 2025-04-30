import { Poppins } from 'next/font/google';
import { auth } from '@/auth';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/providers/theme-provider';

import './globals.css';
import { SessionProvider } from '@/providers/session-provider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'QIZ Platform – Customizable Forms & Surveys SaaS',
  description:
    'Create, manage, and analyze customizable forms, quizzes, and surveys with QIZ Platform. Secure, scalable, and user-friendly SaaS for organizations and teams.',
  keywords: [
    'forms',
    'surveys',
    'quizzes',
    'enterprise',
    'SaaS',
    'QIZ Platform',
    'customizable forms',
    'form builder',
    'survey builder',
    'user management',
    'analytics',
    'secure',
    'collaboration',
    'responsive',
    'cloud',
    'modern',
    'template',
    'workflow',
    'team',
    'organization',
  ],
  authors: [{ name: 'QIZ Platform Team', url: 'https://qizplatform.com' }],
  creator: 'QIZ Platform',
  openGraph: {
    title: 'QIZ Platform – Customizable Forms & Surveys SaaS',
    description:
      'Create, manage, and analyze customizable forms, quizzes, and surveys with QIZ Platform. Secure, scalable, and user-friendly SaaS for organizations and teams.',
    url: 'https://qizplatform.com',
    siteName: 'QIZ Platform',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QIZ Platform – Customizable Forms & Surveys SaaS',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QIZ Platform – Customizable Forms & Surveys SaaS',
    description:
      'Create, manage, and analyze customizable forms, quizzes, and surveys with QIZ Platform. Secure, scalable, and user-friendly SaaS for organizations and teams.',
    site: '@qizplatform',
    creator: '@qizplatform',
    images: ['/images/og-image.png'],
  },
  themeColor: '#6366f1',
  manifest: '/site.webmanifest',
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} no-scroll`}>
        <SessionProvider session={session}>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'QIZ Platform',
            url: 'https://qizplatform.com',
            description:
              'Create, manage, and analyze customizable forms, quizzes, and surveys with QIZ Platform. Secure, scalable, and user-friendly SaaS for organizations and teams.',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'All',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
            },
            author: {
              '@type': 'Organization',
              name: 'QIZ Platform Team',
              url: 'https://qizplatform.com',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'support@qizplatform.com',
              telephone: '+1-800-555-1234',
              contactType: 'customer support',
              areaServed: 'US',
              availableLanguage: ['English'],
            },
            sameAs: [
              'https://twitter.com/qizplatform',
              'https://facebook.com/qizplatform',
              'https://linkedin.com/company/qizplatform',
            ],
          }),
        }}
      />
    </html>
  );
}
