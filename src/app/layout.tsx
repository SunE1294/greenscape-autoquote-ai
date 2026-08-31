import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Greenscape AutoQuote AI · P0 Proposal Engine',
  description: 'Production AI Proposal & Scope Estimator Engine for Greenscape Pro (Phoenix, AZ)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#070c18] text-slate-100 selection:bg-emerald-500 selection:text-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
