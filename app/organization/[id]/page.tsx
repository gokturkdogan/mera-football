'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/Navbar'

interface Organization {
  id: string
  name: string
  description: string | null
  owner: {
    id: string
    name: string
    email: string
    plan: string
  }
  members: Array<{
    id: string
    userId: string
    status: string
    createdAt: string
    user: {
      id: string
      name: string
      email: string
      phone: string | null
    }
  }>
  matches: Array<{
    id: string
    date: string
    time: string
    venue: string
    status: string
  }>
  _count: {
    members: number
  }
}

export default function OrganizationPage() {
  const router = useRouter()
  const params = useParams()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchUser()
    fetchOrganization()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchOrganization = async () => {
    try {
      const res = await fetch(`/api/organizations/${params.id}`, {
        credentials: 'include',
      })
      if (!res.ok) {
        if (res.status === 404) {
          alert('Organizasyon bulunamadı')
          router.push('/organizations')
        } else {
          router.push('/login')
        }
        return
      }
      const data = await res.json()
      setOrganization(data.organization)
    } catch (error) {
      console.error('Error fetching organization:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    try {
      const res = await fetch(`/api/organizations/${params.id}/join`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      if (res.ok) {
        alert('Katılım isteğiniz gönderildi! Organizasyon yöneticisi onayladığında organizasyona katılacaksınız.')
        fetchOrganization()
      } else {
        alert(data.error || 'Hata oluştu')
      }
    } catch (error) {
      alert('Bir hata oluştu')
    }
  }

  const handleLeave = async () => {
    if (!confirm('Bu organizasyondan ayrılmak istediğinize emin misiniz?')) {
      return
    }
    try {
      const res = await fetch(`/api/organizations/${params.id}/leave`, {
        method: 'POST',
        credentials: 'include',
      })
      if (res.ok) {
        router.push('/dashboard')
      } else {
        const data = await res.json()
        alert(data.error || 'Hata oluştu')
      }
    } catch (error) {
      alert('Bir hata oluştu')
    }
  }

  const handleApproveMember = async (memberId: string) => {
    try {
      const res = await fetch(`/api/organizations/${params.id}/members`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ memberId, status: 'APPROVED' }),
      })
      if (res.ok) {
        alert('Katılım isteği onaylandı! Oyuncu organizasyona eklendi.')
        fetchOrganization()
      } else {
        const data = await res.json()
        alert(data.error || 'Hata oluştu')
      }
    } catch (error) {
      alert('Bir hata oluştu')
    }
  }

  const handleRejectMember = async (memberId: string) => {
    if (!confirm('Bu katılım isteğini reddetmek istediğinize emin misiniz?')) {
      return
    }
    try {
      const res = await fetch(`/api/organizations/${params.id}/members`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ memberId, status: 'REJECTED' }),
      })
      if (res.ok) {
        alert('Katılım isteği reddedildi')
        fetchOrganization()
      } else {
        const data = await res.json()
        alert(data.error || 'Hata oluştu')
      }
    } catch (error) {
      alert('Bir hata oluştu')
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

  if (!organization) {
    return null
  }

  const isOwner = user?.id === organization.owner.id
  const isMember = organization.members.some((m) => m.userId === user?.id && m.status === 'APPROVED')
  const approvedMembers = organization.members.filter((m) => m.status === 'APPROVED')
  const pendingMembers = organization.members.filter((m) => m.status === 'PENDING')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl backdrop-blur-sm border-4 border-white/30">
                  🏆
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-2">{organization.name}</h1>
                  <p className="text-xl opacity-90">{organization.description || 'Açıklama yok'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  organization.owner.plan === 'PREMIUM'
                    ? 'bg-yellow-400 text-yellow-900'
                    : 'bg-white/20 text-white backdrop-blur-sm'
                }`}>
                  {organization.owner.plan === 'PREMIUM' ? '⭐ Premium Plan' : '🆓 Free Plan'}
                </span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                  👥 {organization._count.members} üye
                </span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                  ⚽ {organization.matches.length} maç
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="mb-6">
          {!isMember && !isOwner && (
            <Button 
              onClick={handleJoin} 
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
            >
              ⚽ Organizasyona Katıl
            </Button>
          )}
          {isMember && !isOwner && (
            <Button 
              onClick={handleLeave} 
              variant="destructive" 
              size="lg"
              className="shadow-lg"
            >
              Organizasyondan Ayrıl
            </Button>
          )}
          {isOwner && (
            <div className="flex gap-3">
              <Link href="/payment">
                <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg">
                  {organization.owner.plan === 'FREE' ? '💎 Premium Plana Geç' : '⭐ Premium Aktif'}
                </Button>
              </Link>
              <Link href={`/match/new?organizationId=${organization.id}`}>
                <Button size="lg" variant="outline" className="border-2 border-green-500 text-green-600 hover:bg-green-50 shadow-lg">
                  + Yeni Maç Oluştur
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Aktif Üyeler</p>
                  <p className="text-4xl font-black text-green-600">{approvedMembers.length}</p>
                </div>
                <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center text-3xl">
                  👥
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Toplam Maç</p>
                  <p className="text-4xl font-black text-blue-600">{organization.matches.length}</p>
                </div>
                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-3xl">
                  ⚽
                </div>
              </div>
            </CardContent>
          </Card>

          {isOwner && (
            <Card className={`border-2 ${pendingMembers.length > 0 ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50'} hover:shadow-lg transition-shadow`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Bekleyen İstekler</p>
                    <p className={`text-4xl font-black ${pendingMembers.length > 0 ? 'text-yellow-600' : 'text-gray-600'}`}>
                      {pendingMembers.length}
                    </p>
                  </div>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${pendingMembers.length > 0 ? 'bg-yellow-200' : 'bg-gray-200'}`}>
                    ⏳
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isOwner && (
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Yönetici</p>
                    <p className="text-lg font-black text-purple-600 truncate">{organization.owner.name}</p>
                  </div>
                  <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center text-3xl">
                    👑
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bekleyen Katılım İstekleri - Sadece yönetici görür */}
        {isOwner && pendingMembers.length > 0 && (
          <Card className="mb-6 border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <span>⏳</span>
                Bekleyen Katılım İstekleri ({pendingMembers.length})
              </CardTitle>
              <CardDescription className="text-base">
                Organizasyonunuza katılmak isteyen oyuncuların isteklerini onaylayın veya reddedin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex justify-between items-center p-4 border-2 border-yellow-200 rounded-lg bg-white hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {member.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">{member.user.name}</p>
                        <p className="text-sm text-gray-600">{member.user.email}</p>
                        {member.user.phone && (
                          <p className="text-xs text-gray-500 mt-1">📞 {member.user.phone}</p>
                        )}
                        <p className="text-xs text-yellow-600 mt-1 font-medium">
                          📅 {new Date(member.createdAt).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })} tarihinde istek gönderdi
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveMember(member.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        ✓ Onayla
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectMember(member.id)}
                      >
                        ✕ Reddet
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Onaylanmış Üyeler */}
        {approvedMembers.length > 0 && (
          <Card className="mb-6 border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <span>👥</span>
                Organizasyon Üyeleri ({approvedMembers.length})
              </CardTitle>
              <CardDescription className="text-base">
                {isOwner 
                  ? 'Organizasyonunuzun aktif üyeleri'
                  : 'Bu organizasyonun aktif üyeleri'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-4 border-2 rounded-lg hover:border-green-400 hover:shadow-md transition-all bg-white"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                      {member.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{member.user.name}</p>
                      <p className="text-xs text-gray-600">{member.user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Maçlar */}
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>⚽</span>
                  Maçlar ({organization.matches.length})
                </CardTitle>
                <CardDescription className="text-base">
                  Organizasyonun maç geçmişi ve yaklaşan maçlar
                </CardDescription>
              </div>
              {isOwner && (
                <Link href={`/match/new?organizationId=${organization.id}`}>
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    + Yeni Maç
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {organization.matches.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚽</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Henüz maç oluşturulmamış</h3>
                <p className="text-gray-600 mb-6">
                  {isOwner 
                    ? 'İlk maçınızı oluşturarak başlayın'
                    : 'Bu organizasyonda henüz maç bulunmuyor'}
                </p>
                {isOwner && (
                  <Link href={`/match/new?organizationId=${organization.id}`}>
                    <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      İlk Maçı Oluştur
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {organization.matches.map((match) => (
                  <Link key={match.id} href={`/match/${match.id}`}>
                    <Card className="border-2 hover:border-green-400 hover:shadow-xl transition-all cursor-pointer bg-white">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-lg text-gray-900">
                              {new Date(match.date).toLocaleDateString('tr-TR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">🕐 {match.time}</p>
                            <p className="text-sm text-gray-600 mt-1">📍 {match.venue}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            match.status === 'FINISHED' 
                              ? 'bg-green-100 text-green-800 border border-green-300' 
                              : match.status === 'UPCOMING' 
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-gray-100 text-gray-800 border border-gray-300'
                          }`}>
                            {match.status === 'FINISHED' ? '✅ Tamamlandı' : 
                             match.status === 'UPCOMING' ? '📅 Yaklaşan' : 
                             match.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>Detayları Gör →</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Yönetici Bilgileri */}
        <Card className="mt-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>👑</span>
              Yönetici Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {organization.owner.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">{organization.owner.name}</p>
                <p className="text-sm text-gray-600">{organization.owner.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Plan: <span className={`font-semibold ${organization.owner.plan === 'PREMIUM' ? 'text-yellow-600' : 'text-gray-600'}`}>
                    {organization.owner.plan}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
