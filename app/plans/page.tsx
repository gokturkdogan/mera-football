'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import Navbar from '@/components/Navbar'

export default function PlansPage() {
  const { showToast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-black text-gray-900 mb-4">
          Premium Programı
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Size en uygun planı seçin ve halısaha futbol organizasyonlarınızı profesyonelce yönetin
        </p>
      </section>

      {/* Admin Plans */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2 border-gray-200 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl">Free Plan</CardTitle>
                <span className="bg-gray-200 text-gray-800 text-xs font-bold px-2 py-1 rounded">
                  ÜCRETSİZ
                </span>
              </div>
              <CardDescription className="text-lg font-semibold text-gray-600">
                Başlangıç için ideal
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-sm"><strong>1 organizasyon</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-sm"><strong>2 maç</strong> / organizasyon</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-sm"><strong>14 üye</strong> / organizasyon</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-sm"><strong>Oyuncu puanlama</strong> sistemi</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-sm"><strong>Sürükle-bırak</strong> kadro</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-sm"><strong>İstatistik sistemi</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-sm"><strong>Bildirim sistemi</strong></span>
                </div>
              </div>
              {user?.plan === 'FREE' ? (
                <div className="w-full mt-auto p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-sm font-semibold text-green-800">Free Plan'a dahilsiniz</p>
                </div>
              ) : (
                <Link href={user ? '/profile' : '/register?role=ADMIN'}>
                  <Button className="w-full mt-auto" variant="outline">
                    Free Plan ile Başla
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 relative flex flex-col">
            <div className="absolute -top-4 right-4">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                POPÜLER
              </span>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl">Premium Plan</CardTitle>
                <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                  ÖDEMELİ
                </span>
              </div>
              <div className="mb-2">
                <span className="text-3xl font-black text-gray-900">99.99 ₺</span>
                <span className="text-gray-600 ml-2">/ aylık</span>
              </div>
              <CardDescription className="text-base">
                Sınırsız özelliklerle profesyonel yönetim
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold mt-1">✓</span>
                  <span className="text-sm">Tüm <strong>Free plan</strong> özellikleri</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold mt-1">✓</span>
                  <span className="text-sm"><strong>3 organizasyon</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold mt-1">✓</span>
                  <span className="text-sm"><strong>Sınırsız maç</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold mt-1">✓</span>
                  <span className="text-sm"><strong>Sınırsız üye</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold mt-1">✓</span>
                  <span className="text-sm"><strong>Maç sonrası yorum</strong> ekleme</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold mt-1">✓</span>
                  <span className="text-sm"><strong>Maç fotoğrafı</strong> ekleme</span>
                </div>
              </div>
              {user?.plan === 'PREMIUM' ? (
                <div className="w-full mt-auto p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                  <p className="text-sm font-semibold text-yellow-800">Premium Plan'a dahilsiniz</p>
                </div>
              ) : (
                <Button 
                  className="w-full mt-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
                  size="lg"
                  onClick={() => {
                    // Premium ol butonu - şimdilik action yok
                    showToast('Premium plan özelliği yakında eklenecek!', 'info')
                  }}
                >
                  Premium Ol
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Premium Plus Plan */}
          <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 relative flex flex-col">
            <div className="absolute -top-4 right-4">
              <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                PREMIUM+
              </span>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl">Premium Plus</CardTitle>
                <span className="bg-purple-200 text-purple-800 text-xs font-bold px-2 py-1 rounded">
                  ÖDEMELİ
                </span>
              </div>
              <div className="mb-2">
                <span className="text-3xl font-black text-gray-900">149.99 ₺</span>
                <span className="text-gray-600 ml-2">/ aylık</span>
              </div>
              <CardDescription className="text-base">
                Sınırsız özelliklerle profesyonel yönetim
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-1">✓</span>
                  <span className="text-sm">Tüm <strong>Premium plan</strong> özellikleri</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-1">✓</span>
                  <span className="text-sm"><strong>5 organizasyon</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-1">✓</span>
                  <span className="text-sm"><strong>Detaylı diziliş</strong> kurma sistemi</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-1">✓</span>
                  <span className="text-sm"><strong>Yapay zeka</strong> destekli kadro öneri sistemi</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-1">✓</span>
                  <span className="text-sm"><strong>Oyuncu FIFA Kartı</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-1">✓</span>
                  <span className="text-sm"><strong>Otomatik maç oluşturma</strong> sistemi</span>
                </div>
              </div>
              {user?.plan === 'PREMIUM_PLUS' ? (
                <div className="w-full mt-auto p-3 bg-purple-50 border border-purple-200 rounded-lg text-center">
                  <p className="text-sm font-semibold text-purple-800">Premium Plus Plan'a dahilsiniz</p>
                </div>
              ) : (
                <Button 
                  className="w-full mt-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                  size="lg"
                  onClick={() => {
                    // Premium Plus ol butonu - şimdilik action yok
                    showToast('Premium Plus plan özelliği yakında eklenecek!', 'info')
                  }}
                >
                  Premium Plus Ol
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Plan Karşılaştırması</h2>
          <p className="text-lg text-gray-600">Tüm planları detaylı karşılaştırın</p>
        </div>
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="text-left p-5 font-bold text-gray-900 text-lg">Özellik</th>
                      <th className="text-center p-5 font-bold text-gray-900 text-lg bg-gray-50">Free Plan</th>
                      <th className="text-center p-5 font-bold text-yellow-700 text-lg bg-gradient-to-br from-yellow-50 to-orange-50">Premium Plan</th>
                      <th className="text-center p-5 font-bold text-purple-700 text-lg bg-gradient-to-br from-purple-50 to-pink-50">Premium Plus</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4 font-semibold text-gray-800">Organizasyon Sayısı</td>
                      <td className="p-4 text-center"><span className="text-gray-700 font-medium">1</span></td>
                      <td className="p-4 text-center"><span className="text-yellow-600 font-semibold">3</span></td>
                      <td className="p-4 text-center"><span className="text-purple-600 font-semibold">5</span></td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4 font-semibold text-gray-800">Maç Oluşturma</td>
                      <td className="p-4 text-center"><span className="text-gray-700 font-medium">2 maç / organizasyon</span></td>
                      <td className="p-4 text-center"><span className="text-yellow-600 font-semibold">Sınırsız</span></td>
                      <td className="p-4 text-center"><span className="text-purple-600 font-semibold">Sınırsız</span></td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4 font-semibold text-gray-800">Üye Sayısı</td>
                      <td className="p-4 text-center"><span className="text-gray-700 font-medium">14 üye / organizasyon</span></td>
                      <td className="p-4 text-center"><span className="text-yellow-600 font-semibold">Sınırsız</span></td>
                      <td className="p-4 text-center"><span className="text-purple-600 font-semibold">Sınırsız</span></td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4 font-semibold text-gray-800">Oyuncu Puanlama Sistemi</td>
                      <td className="p-4 text-center"><span className="text-green-600 text-xl">✓</span></td>
                      <td className="p-4 text-center"><span className="text-green-600 text-xl">✓</span></td>
                      <td className="p-4 text-center"><span className="text-green-600 text-xl">✓</span></td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4 font-semibold text-gray-800">Sürükle-Bırak Kadro</td>
                      <td className="p-4 text-center"><span className="text-green-600 text-xl">✓</span></td>
                      <td className="p-4 text-center"><span className="text-green-600 text-xl">✓</span></td>
                      <td className="p-4 text-center"><span className="text-green-600 text-xl">✓</span></td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4 font-semibold text-gray-800">İstatistik Sistemi</td>
                      <td className="p-4 text-center"><span className="text-green-600 text-xl">✓</span></td>
                      <td className="p-4 text-center"><span className="text-green-600 text-xl">✓</span></td>
                      <td className="p-4 text-center"><span className="text-green-600 text-xl">✓</span></td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4 font-semibold text-gray-800">Bildirim Sistemi</td>
                      <td className="p-4 text-center"><span className="text-green-600 text-xl">✓</span></td>
                      <td className="p-4 text-center"><span className="text-green-600 text-xl">✓</span></td>
                      <td className="p-4 text-center"><span className="text-green-600 text-xl">✓</span></td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4 font-semibold text-gray-800">Maç Sonrası Yorum Ekleme</td>
                      <td className="p-4 text-center"><span className="text-gray-400">-</span></td>
                      <td className="p-4 text-center"><span className="text-yellow-600 text-xl">✓</span></td>
                      <td className="p-4 text-center"><span className="text-purple-600 text-xl">✓</span></td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4 font-semibold text-gray-800">Maç Fotoğrafı Ekleme</td>
                      <td className="p-4 text-center"><span className="text-gray-400">-</span></td>
                      <td className="p-4 text-center"><span className="text-yellow-600 text-xl">✓</span></td>
                      <td className="p-4 text-center"><span className="text-purple-600 text-xl">✓</span></td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4 font-semibold text-gray-800">Detaylı Diziliş Kurma Sistemi</td>
                      <td className="p-4 text-center"><span className="text-gray-400">-</span></td>
                      <td className="p-4 text-center"><span className="text-gray-400">-</span></td>
                      <td className="p-4 text-center"><span className="text-purple-600 text-xl">✓</span></td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4 font-semibold text-gray-800">Yapay Zeka Destekli Kadro Öneri Sistemi</td>
                      <td className="p-4 text-center"><span className="text-gray-400">-</span></td>
                      <td className="p-4 text-center"><span className="text-gray-400">-</span></td>
                      <td className="p-4 text-center"><span className="text-purple-600 text-xl">✓</span></td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-4 font-semibold text-gray-800">Oyuncu FIFA Kartı</td>
                      <td className="p-4 text-center"><span className="text-gray-400">-</span></td>
                      <td className="p-4 text-center"><span className="text-gray-400">-</span></td>
                      <td className="p-4 text-center"><span className="text-purple-600 text-xl">✓</span></td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-gray-800">Otomatik Maç Oluşturma Sistemi</td>
                      <td className="p-4 text-center"><span className="text-gray-400">-</span></td>
                      <td className="p-4 text-center"><span className="text-gray-400">-</span></td>
                      <td className="p-4 text-center"><span className="text-purple-600 text-xl">✓</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="container mx-auto px-4 py-8 md:py-16">
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl md:rounded-3xl p-6 md:p-12 text-white text-center shadow-2xl">
            <h3 className="text-2xl md:text-4xl font-black mb-3 md:mb-4">
              Hemen Başlayın
            </h3>
            <p className="text-base md:text-xl mb-6 md:mb-8 opacity-95 max-w-2xl mx-auto">
              Size en uygun planı seçin ve halısaha futbol organizasyonlarınızı yönetmeye başlayın
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-stretch sm:items-center">
              <Link href="/register?role=PLAYER" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 bg-white text-green-600 hover:bg-gray-100">
                  Oyuncu Olarak Başla
                </Button>
              </Link>
              <Link href="/register?role=ADMIN" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 bg-transparent border-2 border-white text-white hover:bg-white/10">
                  Yönetici Olarak Başla
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

