'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Navbar from '@/components/Navbar'

interface Player {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  plan: string
  createdAt: string
  organizations: Array<{
    id: string
    name: string
    role: string
    status: string
  }>
}

export default function PlayerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchPlayer()
    }
  }, [params.id])

  const fetchPlayer = async () => {
    try {
      const res = await fetch(`/api/players/${params.id}`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setPlayer(data.player)
      } else {
        router.push('/players')
      }
    } catch (error) {
      console.error('Error fetching player:', error)
      router.push('/players')
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

  if (!player) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">Oyuncu bulunamadı</p>
              <Button onClick={() => router.push('/players')} className="mt-4">
                Oyuncular Listesine Dön
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl backdrop-blur-sm border-4 border-white/30">
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-black mb-2">{player.name}</h1>
              <p className="text-xl opacity-90 mb-3">{player.email}</p>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  player.role === 'ADMIN' 
                    ? 'bg-yellow-400 text-yellow-900' 
                    : 'bg-blue-400 text-blue-900'
                }`}>
                  {player.role === 'ADMIN' ? '👑 Yönetici' : '⚽ Oyuncu'}
                </span>
                {player.phone && (
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                    📞 {player.phone}
                  </span>
                )}
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  player.plan === 'PREMIUM' 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900' 
                    : 'bg-gray-400 text-gray-900'
                }`}>
                  {player.plan === 'PREMIUM' ? '⭐ Premium' : '🆓 Ücretsiz'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Organizasyonlar */}
          <Card className="shadow-xl border-2 border-green-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🏢</span>
                Organizasyonlar
                <span className="ml-auto text-sm font-normal text-gray-600">
                  ({player.organizations.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {player.organizations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">⚽</div>
                    <p className="text-gray-600 font-medium">Henüz organizasyona katılmamış</p>
                  </div>
                ) : (
                  player.organizations.map((org) => (
                    <Link
                      key={org.id}
                      href={`/organization/${org.id}`}
                      className="block p-4 border-2 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all hover:shadow-md border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-900">{org.name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {org.role === 'ADMIN' ? '👑 Yönetici' : '⚽ Oyuncu'} • {org.status === 'APPROVED' ? '✅ Onaylı' : '⏳ Beklemede'}
                          </p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                          <path d="M9 18l6-6-6-6"></path>
                        </svg>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bilgiler */}
          <Card className="shadow-xl border-2 border-blue-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">ℹ️</span>
                Bilgiler
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                  <Label className="text-xs text-gray-600 mb-1 block">📅 Kayıt Tarihi</Label>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(player.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                  <Label className="text-xs text-gray-600 mb-1 block">📧 E-posta</Label>
                  <p className="text-sm font-bold text-gray-900">{player.email}</p>
                </div>

                {player.phone && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                    <Label className="text-xs text-gray-600 mb-1 block">📞 Telefon</Label>
                    <p className="text-sm font-bold text-gray-900">{player.phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button onClick={() => router.push('/players')} variant="outline">
            ← Oyuncular Listesine Dön
          </Button>
        </div>
      </div>
    </div>
  )
}

