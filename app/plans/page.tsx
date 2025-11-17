'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/Navbar'

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-black text-gray-900 mb-4">
          Planlar ve Fiyatlandırma
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Size en uygun planı seçin ve halısaha futbol organizasyonlarınızı profesyonelce yönetin
        </p>
      </section>

      {/* Player Plan */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Oyuncu Planı</h2>
          <p className="text-xl text-gray-600">Her zaman ücretsiz</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-3xl">Oyuncu - Ücretsiz</CardTitle>
                <span className="bg-green-200 text-green-800 text-sm font-bold px-3 py-1 rounded-full">
                  ÜCRETSİZ
                </span>
              </div>
              <CardDescription className="text-lg">
                Oyuncular için tasarlanmış ücretsiz plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-xl mt-1">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Maksimum 2 Organizasyona Katıl</p>
                    <p className="text-sm text-gray-600">Aynı anda 2 farklı organizasyonda aktif olabilirsiniz</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-xl mt-1">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Maç Bilgilerine Erişim</p>
                    <p className="text-sm text-gray-600">Katıldığınız organizasyonların tüm maç bilgilerini görüntüleyin</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-xl mt-1">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Oyuncu Puanlama Sistemi</p>
                    <p className="text-sm text-gray-600">Maç sonrası oyuncuları 5 yıldız üzerinden değerlendirin</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-xl mt-1">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Profil Yönetimi</p>
                    <p className="text-sm text-gray-600">Profil bilgilerinizi güncelleyin ve yönetin</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-xl mt-1">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Kadro ve Skor Görüntüleme</p>
                    <p className="text-sm text-gray-600">Maç kadrolarını ve skorları görüntüleyin</p>
                  </div>
                </div>
              </div>
              <Link href="/register?role=PLAYER">
                <Button className="w-full" size="lg" variant="outline">
                  Ücretsiz Başla
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Admin Plans */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Yönetici Planları</h2>
          <p className="text-xl text-gray-600">Organizasyonlarınızı yönetmek için plan seçin</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2 border-gray-200">
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
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-sm">Organizasyon oluşturma</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-sm">Haftada maksimum <strong>1 maç</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-sm">Maksimum <strong>10 oyuncu</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-sm">Maç ve skor yönetimi</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-sm">Kadro oluşturma</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-sm">Üye yönetimi</span>
                </div>
              </div>
              <Link href="/register?role=ADMIN">
                <Button className="w-full" variant="outline">
                  Free Plan ile Başla
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 relative">
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
                <span className="text-gray-600 ml-2">/ tek seferlik</span>
              </div>
              <CardDescription className="text-base">
                Sınırsız özelliklerle profesyonel yönetim
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold mt-1">✓</span>
                  <span className="text-sm"><strong>Sınırsız maç</strong> oluşturma</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold mt-1">✓</span>
                  <span className="text-sm"><strong>Sınırsız oyuncu</strong> ekleme</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold mt-1">✓</span>
                  <span className="text-sm">Tüm Free plan özellikleri</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold mt-1">✓</span>
                  <span className="text-sm">Öncelikli destek</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold mt-1">✓</span>
                  <span className="text-sm">Gelişmiş istatistikler</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold mt-1">✓</span>
                  <span className="text-sm">Organizasyon özelleştirme</span>
                </div>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
                size="lg"
                onClick={() => {
                  // Premium ol butonu - şimdilik action yok
                  alert('Premium plan özelliği yakında eklenecek!')
                }}
              >
                Premium Ol
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Plan Karşılaştırması</h2>
          <p className="text-lg text-gray-600">Yönetici planlarını karşılaştırın</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-semibold text-gray-900">Özellik</th>
                      <th className="text-center p-4 font-semibold text-gray-900">Free Plan</th>
                      <th className="text-center p-4 font-semibold text-yellow-600">Premium Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Maç Oluşturma</td>
                      <td className="p-4 text-center text-gray-600">Haftada 1</td>
                      <td className="p-4 text-center text-yellow-600 font-semibold">Sınırsız</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Maksimum Oyuncu</td>
                      <td className="p-4 text-center text-gray-600">10 oyuncu</td>
                      <td className="p-4 text-center text-yellow-600 font-semibold">Sınırsız</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Organizasyon Oluşturma</td>
                      <td className="p-4 text-center text-green-500">✓</td>
                      <td className="p-4 text-center text-green-500">✓</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Maç Yönetimi</td>
                      <td className="p-4 text-center text-green-500">✓</td>
                      <td className="p-4 text-center text-green-500">✓</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Skor ve Gol Girişi</td>
                      <td className="p-4 text-center text-green-500">✓</td>
                      <td className="p-4 text-center text-green-500">✓</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Kadro Yönetimi</td>
                      <td className="p-4 text-center text-green-500">✓</td>
                      <td className="p-4 text-center text-green-500">✓</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Üye Yönetimi</td>
                      <td className="p-4 text-center text-green-500">✓</td>
                      <td className="p-4 text-center text-green-500">✓</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Öncelikli Destek</td>
                      <td className="p-4 text-center text-gray-400">-</td>
                      <td className="p-4 text-center text-green-500">✓</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Sık Sorulan Sorular</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Free Plan'dan Premium'a geçiş yapabilir miyim?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Evet, istediğiniz zaman Premium plana geçiş yapabilirsiniz. Mevcut organizasyonunuz ve verileriniz korunur.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Premium plan tek seferlik mi yoksa aylık mı?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Premium plan tek seferlik ödemelidir. Bir kez ödeme yaparak organizasyonunuz için sınırsız özelliklere sahip olursunuz.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Oyuncu planı gerçekten ücretsiz mi?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Evet, oyuncu planı tamamen ücretsizdir ve her zaman ücretsiz kalacaktır. Hiçbir ödeme yapmanız gerekmez.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-12 text-white text-center shadow-2xl">
          <h3 className="text-4xl font-black mb-4">
            Hemen Başlayın
          </h3>
          <p className="text-xl mb-8 opacity-95 max-w-2xl mx-auto">
            Size en uygun planı seçin ve halısaha futbol organizasyonlarınızı yönetmeye başlayın
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register?role=PLAYER">
              <Button size="lg" variant="secondary" className="text-lg px-8 bg-white text-green-600 hover:bg-gray-100">
                Oyuncu Olarak Başla
              </Button>
            </Link>
            <Link href="/register?role=ADMIN">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-2 border-white text-white hover:bg-white/10">
                Yönetici Olarak Başla
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

