import type { Metadata } from 'next';
import { Inter, Public_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const publicSans = Public_Sans({ subsets: ['latin'], variable: '--font-public-sans' });

export const metadata: Metadata = {
  title: 'CrewForce - Infrastructure Management OS',
  description: 'Manage active deployments, daily logs, and payrolls.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className={`${inter.variable} ${publicSans.variable} font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex h-screen overflow-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
