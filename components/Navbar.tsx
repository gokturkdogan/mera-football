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
import { Menu, X, Building2, Users, CreditCard, User, LayoutDashboard, LogOut, Target, Home } from 'lucide-react'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
    <>
    <nav className="bg-white/95 backdrop-blur-md border-b-2 border-green-100 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/" className="flex items-center gap-2 md:gap-3 group" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                MeraFootball
              </h1>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link 
                href="/organizations" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive('/organizations')
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Organizasyonlar
              </Link>
              <Link 
                href="/players" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive('/players')
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                <Users className="w-4 h-4" />
                Oyuncular
              </Link>
              <Link 
                href="/plans" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive('/plans')
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Planlar
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {loading ? (
              <div className="text-xs md:text-sm text-gray-600">Yükleniyor...</div>
            ) : user ? (
              <>
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-sm text-gray-700 font-medium">{user.name}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="bg-white gap-2 border-2 hover:border-green-500 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span>Profil</span>
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
                          <User className="w-4 h-4" />
                          Profil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className={`flex items-center gap-2 cursor-pointer ${isActive('/dashboard') ? 'bg-green-50 text-green-600' : ''}`}>
                          <LayoutDashboard className="w-4 h-4" />
                          Organizasyonlarım
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                        <LogOut className="w-4 h-4 mr-2" />
                        Çıkış Yap
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
              </>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-2">
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
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
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

      {/* Mobile Menu Overlay - Outside nav for proper z-index */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] md:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar - Slide from right - Outside nav for proper positioning */}
      <div
        className={`fixed inset-y-0 right-0 w-[80%] max-w-sm bg-white z-[70] transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b-2 border-green-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                MeraFootball
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {user ? (
              <div className="space-y-4">
                {/* User Info */}
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-600">{user.email}</div>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive('/')
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <Home className="w-5 h-5" />
                    Ana Sayfa
                  </Link>
                  <Link
                    href="/organizations"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive('/organizations')
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    Organizasyonlar
                  </Link>
                  <Link
                    href="/players"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive('/players')
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    Oyuncular
                  </Link>
                  <Link
                    href="/plans"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive('/plans')
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    Planlar
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive('/profile')
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    Profil
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive('/dashboard')
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Organizasyonlarım
                  </Link>
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleLogout()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive('/')
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  Ana Sayfa
                </Link>
                <Link
                  href="/organizations"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive('/organizations')
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  Organizasyonlar
                </Link>
                <Link
                  href="/players"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive('/players')
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  Oyuncular
                </Link>
                <Link
                  href="/plans"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive('/plans')
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  Planlar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Footer - Login/Register Buttons */}
          {!user && (
            <div className="border-t-2 border-green-100 p-4 bg-white flex-shrink-0 space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive('/login')
                    ? 'bg-green-50 text-green-600 border-2 border-green-200'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600 border-2 border-gray-200'
                }`}
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg ${
                  isActive('/register') ? 'ring-2 ring-green-400' : ''
                }`}
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

