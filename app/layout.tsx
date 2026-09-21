import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ToastProvider } from '@/components/ui/Toast';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightRail } from '@/components/layout/RightRail';

export const metadata: Metadata = {
  title: 'Loppo - Modern Social Discussion & Community Platform',
  description: 'A modern social discussion platform built with Next.js 15, Tailwind CSS, Linear design tokens, and Supabase.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Zero-FOUC script: Executed immediately before paint to prevent flashing */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('loppoTheme') || 'dark';
                  const savedAccentId = localStorage.getItem('loppoAccentId') || 'lavender';
                  const accents = {
                    lavender: '#5e6ad2',
                    violet: '#8b5cf6',
                    cyan: '#06b6d4',
                    emerald: '#10b981',
                    amber: '#f59e0b'
                  };
                  document.documentElement.setAttribute('data-theme', savedTheme);
                  document.documentElement.classList.toggle('dark', savedTheme === 'dark');
                  document.documentElement.classList.toggle('dark-mode', savedTheme === 'dark');
                  document.documentElement.style.setProperty('--accent-color', accents[savedAccentId] || '#5e6ad2');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased selection:bg-primary/30 selection:text-ink">
        <ThemeProvider>
          <ToastProvider>
            <Header />
            <div className="w-full px-6 py-6 flex items-start justify-between gap-8 min-h-[calc(100vh-4rem)]">
              <Sidebar />
              <main className="flex-1 min-w-0 max-w-full">{children}</main>
              <RightRail />
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
