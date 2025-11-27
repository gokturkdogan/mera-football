'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Sayfa başlıkları mapping
const pageTitles: Record<string, string> = {
  '/': 'Ana Sayfa',
  '/organizations': 'Organizasyonlar',
  '/players': 'Oyuncular',
  '/plans': 'Planlar',
  '/dashboard': 'Organizasyonlarım',
  '/profile': 'Profil',
  '/login': 'Giriş Yap',
  '/register': 'Kayıt Ol',
  '/organization/new': 'Yeni Organizasyon',
  '/match/new': 'Yeni Maç',
  '/payment': 'Ödeme',
}

// Dinamik sayfa başlıklarını tespit et
function getPageTitle(pathname: string): string {
  // Önce tam eşleşmeyi kontrol et
  if (pageTitles[pathname]) {
    return pageTitles[pathname]
  }
  
  // Dinamik route'lar için kontrol
  if (pathname.startsWith('/organization/') && pathname !== '/organization/new') {
    return 'Organizasyon Detayı'
  }
  if (pathname.startsWith('/match/') && pathname !== '/match/new') {
    return 'Maç Detayı'
  }
  if (pathname.startsWith('/players/')) {
    return 'Oyuncu Detayı'
  }
  if (pathname.startsWith('/facility/')) {
    return 'Tesis Detayı'
  }
  
  return 'MeraFootball'
}

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const currentPageTitle = getPageTitle(pathname)

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
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    window.location.href = '/'
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b-2 border-green-100 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-2xl">⚽</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                MeraFootball
              </h1>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link 
                href="/organizations" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/organizations')
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                Organizasyonlar
              </Link>
              <Link 
                href="/players" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/players')
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                Oyuncular
              </Link>
              <Link 
                href="/plans" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/plans')
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                Planlar
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="text-sm text-gray-600">Yükleniyor...</div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-sm text-gray-700 font-medium">{user.name}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-white gap-2 border-2 hover:border-green-500 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:inline">Profil</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className={`flex items-center gap-2 cursor-pointer ${isActive('/profile') ? 'bg-green-50 text-green-600' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className={`flex items-center gap-2 cursor-pointer ${isActive('/dashboard') ? 'bg-green-50 text-green-600' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7"></rect>
                          <rect x="14" y="3" width="7" height="7"></rect>
                          <rect x="14" y="14" width="7" height="7"></rect>
                          <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        Organizasyonlarım
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className={isActive('/login') ? 'bg-green-50 text-green-600' : ''}>
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className={`bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 ${isActive('/register') ? 'ring-2 ring-green-400' : ''}`}>
                    Kayıt Ol
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        {/* Sayfa Başlığı Bölümü */}
        {pathname !== '/' && (
          <div className="border-t border-green-100 py-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"></div>
              <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="text-gray-400">/</span>
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {currentPageTitle}
                </span>
              </h2>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

