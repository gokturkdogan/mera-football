'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/Navbar'

interface User {
  id: string
  email: string
  name: string
  role: string
  plan?: string
}

interface Organization {
  id: string
  name: string
  description: string | null
  owner: {
    plan: string
  }
  _count: {
    members: number
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
    fetchOrganizations()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      })
      if (!res.ok) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setUser(data.user)
    } catch (error) {
      router.push('/login')
    }
  }

  const fetchOrganizations = async () => {
    try {
      const res = await fetch('/api/organizations', {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setOrganizations(data.organizations || [])
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  const isAdmin = user?.role === 'ADMIN'
  const adminPlan = user?.plan || 'FREE'

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2">Organizasyonlarım</h1>
              <p className="text-xl opacity-90">
                {isAdmin ? 'Organizasyonlarınızı yönetin' : 'Organizasyonlarınızı görüntüleyin'}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl backdrop-blur-sm border-4 border-white/30">
                ⚽
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Toplam Organizasyon</p>
                  <p className="text-4xl font-black text-green-600">{organizations.length}</p>
                </div>
                <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center text-3xl">
                  🏆
                </div>
              </div>
            </CardContent>
          </Card>

          {isAdmin && (
            <>
              <Card className={`border-2 ${adminPlan === 'PREMIUM' ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50'} hover:shadow-lg transition-shadow`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">Plan Durumu</p>
                      <p className={`text-2xl font-black ${adminPlan === 'PREMIUM' ? 'text-yellow-600' : 'text-gray-600'}`}>
                        {adminPlan === 'PREMIUM' ? '⭐ Premium' : '🆓 Free'}
                      </p>
                    </div>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${adminPlan === 'PREMIUM' ? 'bg-yellow-200' : 'bg-gray-200'}`}>
                      {adminPlan === 'PREMIUM' ? '💎' : '📋'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">Toplam Üye</p>
                      <p className="text-4xl font-black text-blue-600">
                        {organizations.reduce((sum, org) => sum + org._count.members, 0)}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-3xl">
                      👥
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!isAdmin && (
            <>
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">Kalan Kontenjan</p>
                      <p className="text-4xl font-black text-blue-600">{2 - organizations.length}</p>
                    </div>
                    <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-3xl">
                      📊
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">Oyuncu Planı</p>
                      <p className="text-2xl font-black text-purple-600">Ücretsiz</p>
                    </div>
                    <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center text-3xl">
                      ⚽
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Organizations Section */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isAdmin ? 'Organizasyonlarım' : 'Katıldığım Organizasyonlar'}
            </h2>
            <p className="text-gray-600">
              {isAdmin 
                ? 'Oluşturduğunuz organizasyonları yönetin ve yeni organizasyonlar oluşturun'
                : 'Aktif olduğunuz organizasyonlar (Maksimum 2)'}
            </p>
          </div>
          {isAdmin && (
            <Link href="/organization/new">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg">
                + Yeni Organizasyon
              </Button>
            </Link>
          )}
        </div>

        {organizations.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <div className="text-6xl mb-4">⚽</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {isAdmin ? 'Henüz organizasyon oluşturmadınız' : 'Henüz bir organizasyona katılmadınız'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {isAdmin
                    ? 'İlk organizasyonunuzu oluşturarak başlayın ve halısaha futbol organizasyonlarınızı yönetmeye başlayın'
                    : 'Organizasyonlara katılarak maçlara katılabilir ve futbol deneyiminizi paylaşabilirsiniz'}
                </p>
                {isAdmin ? (
                  <Link href="/organization/new">
                    <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      İlk Organizasyonu Oluştur
                    </Button>
                  </Link>
                ) : (
                  <Link href="/organizations">
                    <Button size="lg" variant="outline">
                      Organizasyonları Keşfet
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <Link key={org.id} href={`/organization/${org.id}`}>
                <Card className="border-2 hover:border-green-400 hover:shadow-xl transition-all cursor-pointer bg-white h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{org.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {org.description || 'Açıklama yok'}
                        </CardDescription>
                      </div>
                      {isAdmin && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ml-2 ${
                          org.owner.plan === 'PREMIUM'
                            ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                            : 'bg-gray-100 text-gray-800 border-2 border-gray-300'
                        }`}>
                          {org.owner.plan === 'PREMIUM' ? '⭐ Premium' : '🆓 Free'}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-semibold">👥 Üye Sayısı:</span>
                        <span className="font-bold text-gray-900">{org._count.members}</span>
                      </div>
                      {isAdmin && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`font-semibold ${org.owner.plan === 'PREMIUM' ? 'text-yellow-600' : 'text-gray-600'}`}>
                            Plan:
                          </span>
                          <span className={`font-bold ${org.owner.plan === 'PREMIUM' ? 'text-yellow-600' : 'text-gray-600'}`}>
                            {org.owner.plan}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold"
                    >
                      Detayları Gör →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Quick Actions for Admin */}
        {isAdmin && organizations.length > 0 && (
          <Card className="mt-8 border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>⚡</span>
                Hızlı İşlemler
              </CardTitle>
              <CardDescription>
                Sık kullanılan işlemler için hızlı erişim
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/organization/new">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2 border-2 hover:border-green-400">
                    <span className="text-2xl">➕</span>
                    <span className="font-semibold">Yeni Organizasyon</span>
                  </Button>
                </Link>
                {adminPlan === 'FREE' && (
                  <Link href="/payment">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2 border-2 border-yellow-400 hover:border-yellow-500 bg-yellow-50">
                      <span className="text-2xl">💎</span>
                      <span className="font-semibold">Premium Ol</span>
                    </Button>
                  </Link>
                )}
                <Link href="/plans">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2 border-2 hover:border-blue-400">
                    <span className="text-2xl">📋</span>
                    <span className="font-semibold">Planları Görüntüle</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plan Info for Admin */}
        {isAdmin && adminPlan === 'FREE' && (
          <Card className="mt-6 border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>💎</span>
                Premium Plan'a Geçin
              </CardTitle>
              <CardDescription>
                Sınırsız özelliklerle organizasyonlarınızı yönetin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Free Plan Sınırlamaları</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span>⚠️</span>
                      <span>Haftada maksimum 1 maç</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>⚠️</span>
                      <span>Maksimum 10 oyuncu</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Premium Plan Avantajları</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span>✅</span>
                      <span>Sınırsız maç oluşturma</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>✅</span>
                      <span>Sınırsız oyuncu ekleme</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>✅</span>
                      <span>Öncelikli destek</span>
                    </li>
                  </ul>
                </div>
              </div>
              <Link href="/payment">
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold shadow-lg">
                  Premium Plan Satın Al - 99.99 ₺
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
