import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/toast'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MeraFootball - Halısaha Futbol Organizasyon Platformu',
  description: 'Halısaha futbol organizasyonları için web tabanlı platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ToastProvider>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  )
}

