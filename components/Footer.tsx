'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Target, Mail, Clock, Home, BookOpen, LogIn, UserPlus } from 'lucide-react'

export default function Footer() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        return null
      })
      .then((data) => {
        if (data) {
          setUser(data.user)
        }
      })
      .catch(() => {
        // Not logged in
      })
  }, [])
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white border-t border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                MeraFootball
              </h4>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Halısaha futbol organizasyonları için profesyonel ve modern platform
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>7/24 Destek</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-lg mb-5 text-white flex items-center gap-2">
              <Home className="w-5 h-5 text-green-400" />
              Hızlı Linkler
            </h5>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-green-400 transition-colors"></span>
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-green-400 transition-colors"></span>
                  Kullanım Kılavuzu
                </Link>
              </li>
              <li>
                <Link href="/plans" className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-green-400 transition-colors"></span>
                  Premium Programı
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h5 className="font-bold text-lg mb-5 text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Özellikler
            </h5>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Maç Organizasyonu
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Oyuncu Yönetimi
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                İstatistikler
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Puanlama Sistemi
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="font-bold text-lg mb-5 text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-teal-400" />
              Destek
            </h5>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-teal-400" />
                <a href="mailto:destek@merafootball.com" className="text-sm">
                  destek@merafootball.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>7/24 Müşteri Desteği</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} MeraFootball. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-green-400 transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/terms" className="hover:text-green-400 transition-colors">
                Kullanım Şartları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
