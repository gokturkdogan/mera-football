'use client'

import React, { useEffect, useState, useRef } from 'react'
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
    position: '' as string | null,
    strongFoot: '' as string | null,
    height: '' as number | null,
    weight: '' as number | null,
    age: '' as number | null,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const profileInfoRef = useRef<HTMLDivElement>(null)

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
        position: data.user.position || null,
        strongFoot: data.user.strongFoot || null,
        height: data.user.height || null,
        weight: data.user.weight || null,
        age: data.user.age || null,
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

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!user) return 0
    const optionalFields = ['phone', 'position', 'strongFoot', 'height', 'weight', 'age']
    const filledFields = optionalFields.filter(field => user[field] !== null && user[field] !== undefined && user[field] !== '')
    return Math.round((filledFields.length / optionalFields.length) * 100)
  }

  const profileCompletion = calculateProfileCompletion()
  const isProfileComplete = profileCompletion === 100

  const handleCompleteProfile = () => {
    setShowEditForm(true)
    setTimeout(() => {
      profileInfoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

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
              <div className="flex items-center gap-4 flex-wrap">
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
                {user?.position && (
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                    ⚽ {user.position}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Completion Banner */}
      {!isProfileComplete && (
        <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border-b-2 border-yellow-400">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📋</span>
                  <h3 className="text-lg font-bold text-gray-900">Profilinizi Tamamlayın</h3>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      profileCompletion >= 80 ? 'bg-green-500' :
                      profileCompletion >= 50 ? 'bg-yellow-500' :
                      'bg-orange-500'
                    }`}
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-700">
                  Profil tamamlanma oranı: <span className="font-bold">{profileCompletion}%</span>
                </p>
              </div>
              <Button
                onClick={handleCompleteProfile}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-6"
              >
                Tamamla
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Organization Count Card */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-5xl font-black text-green-600 mb-2">
                  {organizations.length}
                </div>
                <div className="text-lg text-gray-700 font-semibold">
                  {isAdmin ? 'Organizasyon' : 'Katıldığım Organizasyon'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Status Card (only for admins) */}
          {isAdmin && (
            <Card className={`border-2 ${adminPlan === 'PREMIUM' ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50'}`}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className={`text-5xl font-black mb-2 ${adminPlan === 'PREMIUM' ? 'text-yellow-600' : 'text-gray-600'}`}>
                    {adminPlan === 'PREMIUM' ? '⭐' : '🆓'}
                  </div>
                  <div className="text-lg text-gray-700 font-semibold mb-1">
                    Plan Durumu
                  </div>
                  <div className={`text-xl font-bold ${adminPlan === 'PREMIUM' ? 'text-yellow-600' : 'text-gray-600'}`}>
                    {adminPlan}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Info Card */}
          <Card ref={profileInfoRef} className="border-2 hover:shadow-xl transition-shadow">
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
                  {user?.position && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label className="text-xs text-gray-500 uppercase">Tercih Edilen Mevki</Label>
                      <p className="text-lg font-semibold text-gray-900">{user.position}</p>
                    </div>
                  )}
                  {user?.strongFoot && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label className="text-xs text-gray-500 uppercase">Güçlü Ayak</Label>
                      <p className="text-lg font-semibold text-gray-900">{user.strongFoot}</p>
                    </div>
                  )}
                  {user?.height && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label className="text-xs text-gray-500 uppercase">Boy</Label>
                      <p className="text-lg font-semibold text-gray-900">{user.height} cm</p>
                    </div>
                  )}
                  {user?.weight && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label className="text-xs text-gray-500 uppercase">Kilo</Label>
                      <p className="text-lg font-semibold text-gray-900">{user.weight} kg</p>
                    </div>
                  )}
                  {user?.age && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label className="text-xs text-gray-500 uppercase">Yaş</Label>
                      <p className="text-lg font-semibold text-gray-900">{user.age}</p>
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
                  <div className="space-y-2">
                    <Label htmlFor="position">Tercih Edilen Mevki (Opsiyonel)</Label>
                    <select
                      id="position"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.position || ''}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value || null })}
                    >
                      <option value="">Mevki Seçiniz</option>
                      <option value="KALECI">Kaleci</option>
                      <option value="DEFANS">Defans</option>
                      <option value="ORTASAHA">Ortasaha</option>
                      <option value="FORVET">Forvet</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="strongFoot">Güçlü Ayak (Opsiyonel)</Label>
                    <select
                      id="strongFoot"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.strongFoot || ''}
                      onChange={(e) => setFormData({ ...formData, strongFoot: e.target.value || null })}
                    >
                      <option value="">Güçlü Ayak Seçiniz</option>
                      <option value="SOL">Sol</option>
                      <option value="SAĞ">Sağ</option>
                      <option value="İKİSİ">İkisi</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Boy (cm) (Opsiyonel)</Label>
                      <Input
                        id="height"
                        type="number"
                        min="100"
                        max="250"
                        value={formData.height || ''}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value ? parseInt(e.target.value) : null })}
                        placeholder="175"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Kilo (kg) (Opsiyonel)</Label>
                      <Input
                        id="weight"
                        type="number"
                        min="30"
                        max="200"
                        value={formData.weight || ''}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value ? parseInt(e.target.value) : null })}
                        placeholder="75"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Yaş (Opsiyonel)</Label>
                      <Input
                        id="age"
                        type="number"
                        min="10"
                        max="100"
                        value={formData.age || ''}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : null })}
                        placeholder="25"
                      />
                    </div>
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
      </div>
    </div>
  )
}
