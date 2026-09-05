import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../src/index.css';
import { Providers } from './providers';
import { Navbar } from '../src/components/layout/Navbar';
import { Footer } from '../src/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Raja Construction | Luxury Real Estate & Contracting in Erode',
  description: 'Discover luxury villas, penthouses, commercial spaces, and custom construction solutions by Raja Construction in Erode, Tamil Nadu.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ivory text-charcoal font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-ruby selection:text-white">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
