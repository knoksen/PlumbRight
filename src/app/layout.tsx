'use client';

import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/app-shell';
import { Toaster } from '@/components/ui/toaster';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isQuoteView = pathname.startsWith('/quote/view') || pathname.startsWith('/quote/bill-of-materials');

  if (isQuoteView) {
    return <main className="p-6 bg-gray-50 print:bg-white">{children}</main>;
  }

  return <AppShell>{children}</AppShell>;
}

const metadataBase: Metadata = {
  title: 'PlumbRight',
  description: 'AI-Powered Tools for Plumbing Professionals',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{String(metadataBase.title)}</title>
        <meta name="description" content={String(metadataBase.description)} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <LayoutWrapper>{children}</LayoutWrapper>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
