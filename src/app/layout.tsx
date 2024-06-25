import '@/styles/global.css';
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toast';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('text-slate-900 bg-white antialiased', inter.className)}>
      <body className='min-h-screen bg-slate-50 dark:bg-slate-900 antialiased'>
        <Providers>
          {children}
          <Navbar />
          <Toaster position='bottom-right' />
        </Providers>

        {/*Allow for more height on mobile devices */}
        <div className='h-40 md:hidden'></div>
      </body>
    </html>
  );
}
