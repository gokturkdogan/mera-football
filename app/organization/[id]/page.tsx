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
    user: {
      id: string
      name: string
      email: string
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
      const res = await fetch(`/api/organizations/${params.id}`)
      if (!res.ok) {
        router.push('/dashboard')
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
      })
      const data = await res.json()
      if (res.ok) {
        alert('Katılım talebi gönderildi')
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
        body: JSON.stringify({ memberId, status: 'APPROVED' }),
      })
      if (res.ok) {
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
              <Button onClick={handleJoin} className="w-full">
                Organizasyona Katıl
              </Button>
            )}
            {isMember && !isOwner && (
              <Button onClick={handleLeave} variant="destructive" className="w-full">
                Organizasyondan Ayrıl
              </Button>
            )}
            {isOwner && (
              <Link href="/payment">
                <Button className="w-full mb-2">
                  {organization.owner.plan === 'FREE' ? 'Premium Plana Geç' : 'Premium Aktif'}
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {isOwner && pendingMembers.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Bekleyen Katılım Talepleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pendingMembers.map((member) => (
                  <div key={member.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-semibold">{member.user.name}</p>
                      <p className="text-sm text-gray-600">{member.user.email}</p>
                    </div>
                    <Button onClick={() => handleApproveMember(member.id)} size="sm">
                      Onayla
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Üyeler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {organization.members
                .filter((m) => m.status === 'APPROVED')
                .map((member) => (
                  <div key={member.id} className="p-2 border rounded">
                    <p className="font-semibold">{member.user.name}</p>
                    <p className="text-sm text-gray-600">{member.user.email}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

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

