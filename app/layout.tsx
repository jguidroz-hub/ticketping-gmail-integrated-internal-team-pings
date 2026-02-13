import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TicketPing - Gmail-integrated Internal Team Pings',
  description: 'Value Proposition: Enables support teams and internal collaborators to quickly ping teammates directly within Gmail tickets, streamlining communication, reducing context switching, and replacing expensive internal messaging systems.

Target Customer: Small to medium-sized customer support teams, sales teams, or any team using Gmail for shared inbox management (e.g., support@, sales@) seeking efficient internal comms.

---
Category: MarTech
Target Market: Small to medium-sized customer support teams, sales teams, or any team using Gmail for shared inbox management (e.g., support@, sales@) seeking efficient internal comms.
Source Hypothesis ID: 2fc0dc84-bd3d-4781-bd2b-6904174772ae
Promotion Type: automatic',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <nav className="border-b">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
              <a href="/" className="font-bold text-lg">TicketPing - Gmail-integrated Internal Team Pings</a>
              <div className="flex items-center gap-4">
                <a href="/dashboard" className="text-sm hover:text-blue-600">Dashboard</a>
                <a href="/pricing" className="text-sm hover:text-blue-600">Pricing</a>
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
