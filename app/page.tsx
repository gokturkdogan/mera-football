'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              MeraFootball
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Giriş Yap</Button>
            </Link>
            <Link href="/register">
              <Button>Kayıt Ol</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-6xl font-bold text-gray-900 mb-6">
          Halısaha Futbol
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
            Organizasyon Platformu
          </span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Maçlarınızı organize edin, oyuncuları yönetin ve futbol deneyiminizi bir üst seviyeye taşıyın.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register?role=PLAYER">
            <Button size="lg" className="text-lg px-8 py-6">
              Oyuncu Olarak Başla
            </Button>
          </Link>
          <Link href="/register?role=ADMIN">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Yönetici Olarak Başla
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Özellikler
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚽</span>
              </div>
              <CardTitle>Maç Yönetimi</CardTitle>
              <CardDescription>
                Maçlarınızı kolayca oluşturun, kadro belirleyin ve skorları girin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Tarih ve saat yönetimi</li>
                <li>✓ Kadro oluşturma</li>
                <li>✓ Skor ve gol takibi</li>
                <li>✓ Maç geçmişi</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <CardTitle>Oyuncu Puanlama</CardTitle>
              <CardDescription>
                Maç sonrası oyuncuları 5 yıldız üzerinden değerlendirin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ 5 yıldız puanlama sistemi</li>
                <li>✓ Yorum ekleme</li>
                <li>✓ Performans takibi</li>
                <li>✓ Oyuncu istatistikleri</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <CardTitle>Organizasyon Yönetimi</CardTitle>
              <CardDescription>
                Organizasyonlarınızı oluşturun ve oyuncuları yönetin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Organizasyon oluşturma</li>
                <li>✓ Üye yönetimi</li>
                <li>✓ Katılım talepleri</li>
                <li>✓ Plan yönetimi</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Plans Section */}
      <section className="container mx-auto px-4 py-16 bg-white rounded-2xl shadow-lg my-16">
        <h3 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Planlar
        </h3>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Oyuncu - Ücretsiz</CardTitle>
              <CardDescription className="text-lg font-semibold text-green-600">
                Her zaman ücretsiz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Maksimum 2 organizasyona katıl</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Maç bilgilerine erişim</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Oyuncu puanlama sistemi</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Profil yönetimi</span>
                </li>
              </ul>
              <Link href="/register?role=PLAYER">
                <Button className="w-full" size="lg">
                  Ücretsiz Başla
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl">Yönetici - Free</CardTitle>
                <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                  ÜCRETSİZ
                </span>
              </div>
              <CardDescription className="text-lg">
                Premium'a yükseltme seçeneği
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Organizasyon oluşturma</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Haftada 1 maç</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Maksimum 10 oyuncu</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Maç ve skor yönetimi</span>
                </li>
              </ul>
              <Link href="/register?role=ADMIN">
                <Button className="w-full" size="lg" variant="outline">
                  Free Plan ile Başla
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 max-w-2xl mx-auto">
          <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl">Yönetici - Premium</CardTitle>
                <span className="bg-purple-200 text-purple-800 text-xs font-bold px-2 py-1 rounded">
                  ÖDEMELİ
                </span>
              </div>
              <CardDescription className="text-lg font-semibold text-purple-600">
                99.99 ₺
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span className="font-semibold">Sınırsız maç oluşturma</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span className="font-semibold">Sınırsız oyuncu ekleme</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>Öncelikli destek</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>Tüm Free plan özellikleri</span>
                </li>
              </ul>
              <p className="text-sm text-gray-600 mb-4">
                Premium plana geçmek için önce Free plan ile kayıt olun, sonra organizasyonunuzdan Premium'a yükseltebilirsiniz.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Nasıl Çalışır?
        </h3>
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h4 className="font-semibold mb-2">Kayıt Ol</h4>
            <p className="text-sm text-gray-600">
              Oyuncu veya Yönetici olarak ücretsiz hesap oluşturun
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h4 className="font-semibold mb-2">Organizasyon</h4>
            <p className="text-sm text-gray-600">
              Organizasyon oluşturun veya mevcut organizasyonlara katılın
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h4 className="font-semibold mb-2">Maç Oluştur</h4>
            <p className="text-sm text-gray-600">
              Maçlarınızı planlayın, kadro belirleyin ve oyuncuları ekleyin
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h4 className="font-semibold mb-2">Oyna & Değerlendir</h4>
            <p className="text-sm text-gray-600">
              Maçları oynayın, skorları girin ve oyuncuları puanlayın
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-12 text-white">
          <h3 className="text-4xl font-bold mb-4">
            Hemen Başlayın
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Halısaha futbol organizasyonlarınızı kolayca yönetin
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register?role=PLAYER">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Oyuncu Olarak Başla
              </Button>
            </Link>
            <Link href="/register?role=ADMIN">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white text-green-600 hover:bg-gray-100">
                Yönetici Olarak Başla
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 MeraFootball. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  )
}
