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
      const res = await fetch('/api/auth/me')
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
      // Update user access info if available
      if (data.userAccess) {
        // This will be used to determine what actions user can take
      }
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
      <div className="min-h-screen flex items-center justify-center">
        <div>Yükleniyor...</div>
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{organization.name}</CardTitle>
                <CardDescription>{organization.description || 'Açıklama yok'}</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Plan: <span className={organization.owner.plan === 'PREMIUM' ? 'text-yellow-600 font-semibold' : ''}>{organization.owner.plan}</span></p>
                <p className="text-sm text-gray-600">Üye Sayısı: {organization._count.members}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!isMember && !isOwner && (
              <Button onClick={handleJoin} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                Organizasyona Katıl
              </Button>
            )}
            {isMember && !isOwner && (
              <Button onClick={handleLeave} variant="destructive" className="w-full">
                Organizasyondan Ayrıl
              </Button>
            )}
            {isOwner && (
              <>
                <Link href="/payment">
                  <Button className="w-full mb-2">
                    {organization.owner.plan === 'FREE' ? 'Premium Plana Geç' : 'Premium Aktif'}
                  </Button>
                </Link>
                <Link href={`/organization/${organization.id}`}>
                  <Button variant="outline" className="w-full">
                    Organizasyonu Yönet
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        {/* Bekleyen Katılım İstekleri - Sadece yönetici görür */}
        {isOwner && pendingMembers.length > 0 && (
          <Card className="mb-6 border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>⏳</span>
                Bekleyen Katılım İstekleri ({pendingMembers.length})
              </CardTitle>
              <CardDescription>
                Organizasyonunuza katılmak isteyen oyuncuların isteklerini onaylayın veya reddedin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex justify-between items-center p-4 border-2 border-yellow-200 rounded-lg bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                        {member.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{member.user.name}</p>
                        <p className="text-sm text-gray-600">{member.user.email}</p>
                        {member.user.phone && (
                          <p className="text-xs text-gray-500">📞 {member.user.phone}</p>
                        )}
                        <p className="text-xs text-yellow-600 mt-1">
                          {new Date(member.createdAt).toLocaleDateString('tr-TR', {
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
                        className="bg-green-600 hover:bg-green-700"
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
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>👥</span>
                Organizasyon Üyeleri ({approvedMembers.length})
              </CardTitle>
              <CardDescription>
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
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
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

        <Card>
          <CardHeader>
            <CardTitle>Maçlar</CardTitle>
            {isOwner && (
              <Link href={`/match/new?organizationId=${organization.id}`}>
                <Button>Yeni Maç Oluştur</Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {organization.matches.length === 0 ? (
                <p className="text-gray-600">Henüz maç oluşturulmamış</p>
              ) : (
                organization.matches.map((match) => (
                  <Link key={match.id} href={`/match/${match.id}`}>
                    <div className="p-4 border rounded hover:bg-gray-50 cursor-pointer">
                      <p className="font-semibold">{new Date(match.date).toLocaleDateString('tr-TR')} - {match.time}</p>
                      <p className="text-sm text-gray-600">{match.venue}</p>
                      <p className="text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          match.status === 'FINISHED' ? 'bg-green-100 text-green-800' :
                          match.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {match.status}
                        </span>
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

