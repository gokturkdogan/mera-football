'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/Navbar'

export default function Home() {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <h2 className="text-7xl font-black text-gray-900 mb-6 leading-tight">
            Halısaha Futbol
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 mt-2">
              Organizasyon Platformu
            </span>
          </h2>
          <p className="text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
            Maçlarınızı organize edin, oyuncuları yönetin ve futbol deneyiminizi bir üst seviyeye taşıyın.
            <span className="block mt-3 text-lg text-gray-600">
              Profesyonel halısaha organizasyonları için tasarlanmış modern platform
            </span>
          </p>
          <div className="flex gap-4 justify-center">
            {user ? (
              <Link href="/profile">
                <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl">
                  Profilime Git
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register?role=PLAYER">
                  <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl">
                    Oyuncu Olarak Başla
                  </Button>
                </Link>
                <Link href="/register?role=ADMIN">
                  <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2 border-green-600 text-green-600 hover:bg-green-50">
                    Yönetici Olarak Başla
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-5xl font-bold text-gray-900 mb-4">
            Neden MeraFootball?
          </h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Halısaha futbol organizasyonlarınızı kolayca yönetin ve oyuncu deneyimini geliştirin
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl">⚽</span>
              </div>
              <CardTitle className="text-2xl">Maç Yönetimi</CardTitle>
              <CardDescription className="text-base">
                Maçlarınızı kolayca oluşturun, planlayın ve yönetin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Tarih ve saat yönetimi ile kolay planlama</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Kadro oluşturma ve oyuncu yönetimi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Skor ve gol takibi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Detaylı maç geçmişi</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl">⭐</span>
              </div>
              <CardTitle className="text-2xl">Oyuncu Puanlama</CardTitle>
              <CardDescription className="text-base">
                Maç sonrası oyuncuları değerlendirin ve performans takibi yapın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>5 yıldız puanlama sistemi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>Yorum ve geri bildirim ekleme</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>Performans istatistikleri</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>Oyuncu değerlendirme geçmişi</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl">👥</span>
              </div>
              <CardTitle className="text-2xl">Organizasyon</CardTitle>
              <CardDescription className="text-base">
                Organizasyonlarınızı oluşturun ve oyuncuları yönetin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Kolay organizasyon oluşturma</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Üye yönetimi ve onay sistemi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Katılım talepleri yönetimi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Esnek plan seçenekleri</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 bg-white rounded-3xl shadow-2xl my-16">
        <div className="text-center mb-16">
          <h3 className="text-5xl font-bold text-gray-900 mb-4">
            Nasıl Çalışır?
          </h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sadece birkaç adımda başlayın ve halısaha organizasyonlarınızı profesyonelce yönetin
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-xl transform group-hover:scale-110 transition-transform">
              1
            </div>
            <h4 className="font-bold text-xl mb-3 text-gray-900">Kayıt Ol</h4>
            <p className="text-gray-600 leading-relaxed">
              Oyuncu veya Yönetici olarak ücretsiz hesap oluşturun. Sadece birkaç dakika sürer.
            </p>
          </div>
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-xl transform group-hover:scale-110 transition-transform">
              2
            </div>
            <h4 className="font-bold text-xl mb-3 text-gray-900">Organizasyon</h4>
            <p className="text-gray-600 leading-relaxed">
              Organizasyon oluşturun veya mevcut organizasyonlara katılın. Oyuncular maksimum 2 organizasyona katılabilir.
            </p>
          </div>
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-xl transform group-hover:scale-110 transition-transform">
              3
            </div>
            <h4 className="font-bold text-xl mb-3 text-gray-900">Maç Oluştur</h4>
            <p className="text-gray-600 leading-relaxed">
              Maçlarınızı planlayın, kadro belirleyin ve oyuncuları ekleyin. Tarih, saat ve saha bilgilerini kolayca yönetin.
            </p>
          </div>
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-xl transform group-hover:scale-110 transition-transform">
              4
            </div>
            <h4 className="font-bold text-xl mb-3 text-gray-900">Oyna & Değerlendir</h4>
            <p className="text-gray-600 leading-relaxed">
              Maçları oynayın, skorları girin ve oyuncuları 5 yıldız üzerinden puanlayın. Performans takibi yapın.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100">
            <div className="text-5xl font-black text-green-600 mb-3">⚽</div>
            <div className="text-4xl font-bold text-gray-900 mb-2">Sınırsız</div>
            <div className="text-lg text-gray-600">Maç Organizasyonu</div>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100">
            <div className="text-5xl font-black text-blue-600 mb-3">⭐</div>
            <div className="text-4xl font-bold text-gray-900 mb-2">5 Yıldız</div>
            <div className="text-lg text-gray-600">Puanlama Sistemi</div>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100">
            <div className="text-5xl font-black text-purple-600 mb-3">👥</div>
            <div className="text-4xl font-bold text-gray-900 mb-2">Kolay</div>
            <div className="text-lg text-gray-600">Oyuncu Yönetimi</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-16 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <h3 className="text-5xl font-black mb-6">
              Hemen Başlayın
            </h3>
            <p className="text-2xl mb-10 opacity-95 max-w-2xl mx-auto">
              Halısaha futbol organizasyonlarınızı kolayca yönetin ve oyuncu deneyimini geliştirin
            </p>
            <div className="flex gap-4 justify-center">
              {user ? (
                <Link href="/profile">
                  <Button size="lg" variant="secondary" className="text-lg px-10 py-7 bg-white text-green-600 hover:bg-gray-100 font-semibold shadow-xl">
                    Profilime Git
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register?role=PLAYER">
                    <Button size="lg" variant="secondary" className="text-lg px-10 py-7 bg-white text-green-600 hover:bg-gray-100 font-semibold shadow-xl">
                      Oyuncu Olarak Başla
                    </Button>
                  </Link>
                  <Link href="/register?role=ADMIN">
                    <Button size="lg" variant="outline" className="text-lg px-10 py-7 bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold">
                      Yönetici Olarak Başla
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">⚽</span>
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
                <li><Link href="/login" className="hover:text-white transition-colors">Giriş Yap</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Kayıt Ol</Link></li>
                {user && <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>}
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
    </div>
  )
}
