'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/Navbar'

interface Organization {
  id: string
  name: string
  owner: {
    plan: string
  }
  _count: {
    members: number
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)

  useEffect(() => {
    fetchUser()
    fetchOrganizations()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (!res.ok) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setUser(data.user)
      setFormData({
        name: data.user.name || '',
        phone: data.user.phone || '',
      })
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchOrganizations = async () => {
    try {
      const res = await fetch('/api/organizations', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setOrganizations(data.organizations || [])
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        alert('Profil güncellendi')
        fetchUser()
        setShowEditForm(false)
      } else {
        const data = await res.json()
        alert(data.error || 'Hata oluştu')
      }
    } catch (error) {
      alert('Bir hata oluştu')
    } finally {
      setSaving(false)
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
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl backdrop-blur-sm border-4 border-white/30">
              ⚽
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-black mb-2">{user?.name}</h1>
              <p className="text-xl opacity-90 mb-3">{user?.email}</p>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  isAdmin 
                    ? 'bg-yellow-400 text-yellow-900' 
                    : 'bg-blue-400 text-blue-900'
                }`}>
                  {isAdmin ? '👑 Yönetici' : '⚽ Oyuncu'}
                </span>
                {user?.phone && (
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                    📞 {user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-black text-green-600 mb-2">
                  {organizations.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {isAdmin ? 'Organizasyon' : 'Katıldığım Organizasyon'}
                </div>
              </div>
            </CardContent>
          </Card>

          {isAdmin && (
            <>
              <Card className={`border-2 ${adminPlan === 'PREMIUM' ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50'}`}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className={`text-4xl font-black mb-2 ${adminPlan === 'PREMIUM' ? 'text-yellow-600' : 'text-gray-600'}`}>
                      {adminPlan === 'PREMIUM' ? '⭐' : '🆓'}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      Plan Durumu
                    </div>
                    <div className={`text-lg font-bold mt-1 ${adminPlan === 'PREMIUM' ? 'text-yellow-600' : 'text-gray-600'}`}>
                      {adminPlan}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-black text-blue-600 mb-2">
                      {organizations.length}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      Toplam Organizasyon
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!isAdmin && (
            <>
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-black text-blue-600 mb-2">
                      {2 - organizations.length}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      Kalan Kontenjan
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-black text-purple-600 mb-2">
                      ⭐
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      Puanlama Sistemi
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Info Card */}
          <Card className="border-2 hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Profil Bilgileri</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditForm(!showEditForm)}
                >
                  {showEditForm ? 'İptal' : 'Düzenle'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!showEditForm ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Label className="text-xs text-gray-500 uppercase">Email</Label>
                    <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Label className="text-xs text-gray-500 uppercase">Ad Soyad</Label>
                    <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                  </div>
                  {user?.phone && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label className="text-xs text-gray-500 uppercase">Telefon</Label>
                      <p className="text-lg font-semibold text-gray-900">{user.phone}</p>
                    </div>
                  )}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Label className="text-xs text-gray-500 uppercase">Rol</Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {isAdmin ? '👑 Yönetici' : '⚽ Oyuncu'}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Label className="text-xs text-gray-500 uppercase">Kayıt Tarihi</Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(user?.createdAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-xs text-gray-500">Email değiştirilemez</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0555 123 45 67"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={saving}>
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Organizations Card */}
          <Card className="border-2 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">
                {isAdmin ? 'Organizasyonlarım' : 'Katıldığım Organizasyonlar'}
              </CardTitle>
              <CardDescription>
                {isAdmin 
                  ? 'Oluşturduğunuz organizasyonlar ve plan durumları'
                  : 'Aktif olduğunuz organizasyonlar (Maksimum 2)'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {organizations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">⚽</div>
                  <p className="text-gray-600 mb-4">
                    {isAdmin 
                      ? 'Henüz organizasyon oluşturmadınız'
                      : 'Henüz bir organizasyona katılmadınız'}
                  </p>
                  {isAdmin && (
                    <Link href="/organization/new">
                      <Button>Yeni Organizasyon Oluştur</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {organizations.map((org) => (
                    <Link key={org.id} href={`/organization/${org.id}`}>
                      <div className="p-4 border-2 rounded-lg hover:border-green-400 hover:shadow-md transition-all cursor-pointer bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-gray-900">{org.name}</h3>
                          {isAdmin && (
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              org.owner.plan === 'PREMIUM'
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                : 'bg-gray-100 text-gray-800 border border-gray-300'
                            }`}>
                              {org.owner.plan}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>👥 {org._count.members} üye</span>
                          {isAdmin && (
                            <span className={org.owner.plan === 'PREMIUM' ? 'text-yellow-600 font-semibold' : ''}>
                              {org.owner.plan === 'PREMIUM' ? '⭐ Premium' : '🆓 Free'}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {isAdmin && (
                    <Link href="/organization/new">
                      <Button variant="outline" className="w-full mt-4">
                        + Yeni Organizasyon
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Plan Info Section (for Admins) */}
        {isAdmin && (
          <Card className="mt-6 border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <span>💎</span>
                Plan Bilgileri
              </CardTitle>
              <CardDescription>
                Organizasyonlarınızın plan durumları ve özellikleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Free Plan Özellikleri</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Haftada maksimum 1 maç</li>
                    <li>• Maksimum 10 oyuncu</li>
                    <li>• Temel organizasyon yönetimi</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-lg border border-yellow-300">
                  <h4 className="font-semibold text-gray-900 mb-2">Premium Plan Özellikleri</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Sınırsız maç oluşturma</li>
                    <li>• Sınırsız oyuncu ekleme</li>
                    <li>• Öncelikli destek</li>
                  </ul>
                </div>
              </div>
              {adminPlan === 'FREE' && (
                <div className="mt-4">
                  <Link href="/payment">
                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                      Premium Plan Satın Al
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Player Info Section */}
        {!isAdmin && (
          <Card className="mt-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <span>⚽</span>
                Oyuncu Bilgileri
              </CardTitle>
              <CardDescription>
                Oyuncu planı özellikleri ve limitleriniz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Mevcut Durum</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Katıldığım Organizasyon:</span>
                      <span className="font-semibold">{organizations.length}/2</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${(organizations.length / 2) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Ücretsiz Özellikler</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>✓ Maksimum 2 organizasyona katıl</li>
                    <li>✓ Maç bilgilerine erişim</li>
                    <li>✓ Oyuncu puanlama sistemi</li>
                    <li>✓ Profil yönetimi</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
