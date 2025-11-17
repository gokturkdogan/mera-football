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
}

interface Organization {
  id: string
  name: string
  description: string | null
  plan: string
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
      <div className="min-h-screen flex items-center justify-center">
        <div>Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-gray-600">
            {user?.role === 'PLAYER' ? 'Oyuncu Paneli' : 'Yönetici Paneli'}
          </p>
        </div>

        {user?.role === 'ADMIN' && (
          <div className="mb-6">
            <Link href="/organization/new">
              <Button>Yeni Organizasyon Oluştur</Button>
            </Link>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-600">
                  {user?.role === 'PLAYER'
                    ? 'Henüz bir organizasyona katılmadınız'
                    : 'Henüz organizasyon oluşturmadınız'}
                </p>
              </CardContent>
            </Card>
          ) : (
            organizations.map((org) => (
              <Card key={org.id}>
                <CardHeader>
                  <CardTitle>{org.name}</CardTitle>
                  <CardDescription>
                    {org.description || 'Açıklama yok'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm">
                      <span className="font-semibold">Plan:</span>{' '}
                      <span className={org.plan === 'PREMIUM' ? 'text-yellow-600' : 'text-gray-600'}>
                        {org.plan}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Üye Sayısı:</span> {org._count.members}
                    </p>
                  </div>
                  <Link href={`/organization/${org.id}`}>
                    <Button className="w-full">Detayları Gör</Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

