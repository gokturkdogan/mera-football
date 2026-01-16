'use client'

import Link from 'next/link'
import { Target } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 md:py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold">MeraFootball</h4>
            </div>
            <p className="text-gray-400">
              Halısaha futbol organizasyonları için profesyonel platform
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Hızlı Linkler</h5>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">Nasıl Çalışır?</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Giriş Yap</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Kayıt Ol</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Destek</h5>
            <ul className="space-y-2 text-gray-400">
              <li>Email: destek@merafootball.com</li>
              <li>7/24 Destek</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2024 MeraFootball. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}
