'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Navbar from '@/components/Navbar'
import { 
  User, 
  Mail, 
  Phone, 
  Target, 
  Footprints, 
  Ruler, 
  Weight, 
  Calendar,
  Crown,
  Building2,
  ArrowLeft,
  Shield,
  Info,
  CheckCircle2,
  Clock,
  Star,
  EyeOff
} from 'lucide-react'

interface Player {
  id: string
  name: string
  email: string
  phone: string | null
  avatarUrl: string | null
  position: string | null
  strongFoot: string | null
  height: number | null
  weight: number | null
  age: number | null
  showPhone: boolean
  showPosition: boolean
  showStrongFoot: boolean
  showHeight: boolean
  showWeight: boolean
  showAge: boolean
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

  const getPositionLabel = (position: string | null) => {
    if (!position) return ''
    const labels: Record<string, string> = {
      'KALECI': 'Kaleci',
      'DEFANS': 'Defans',
      'ORTASAHA': 'Ortasaha',
      'FORVET': 'Forvet'
    }
    return labels[position] || position
  }

  const getStrongFootLabel = (foot: string | null) => {
    if (!foot) return ''
    const labels: Record<string, string> = {
      'SOL': 'Sol',
      'SAĞ': 'Sağ',
      'İKİSİ': 'İkisi'
    }
    return labels[foot] || foot
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-5xl shadow-xl overflow-hidden border-4 border-white/30 ${
                player.role === 'ADMIN' 
                  ? 'bg-gradient-to-br from-yellow-500 to-orange-600' 
                  : 'bg-gradient-to-br from-green-500 to-emerald-600'
              }`}>
                {player.avatarUrl ? (
                  <img 
                    src={player.avatarUrl} 
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  player.name.charAt(0).toUpperCase()
                )}
              </div>
              {player.role === 'ADMIN' && (
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <Crown className="w-4 h-4 text-yellow-900" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black truncate">{player.name}</h1>
                {player.role === 'ADMIN' ? (
                  <Crown className="w-6 h-6 text-yellow-300 flex-shrink-0" />
                ) : (
                  <User className="w-6 h-6 text-white/80 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-4 h-4 text-white/80" />
                <p className="text-xl opacity-90 truncate">{player.email}</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                  player.role === 'ADMIN' 
                    ? 'bg-yellow-400 text-yellow-900' 
                    : 'bg-blue-400 text-blue-900'
                }`}>
                  {player.role === 'ADMIN' ? (
                    <>
                      <Crown className="w-4 h-4" />
                      Yönetici
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      Oyuncu
                    </>
                  )}
                </span>
                {player.showPhone && player.phone && (
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {player.phone}
                  </span>
                )}
                {player.showPosition && player.position && (
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    {getPositionLabel(player.position)}
                  </span>
                )}
                <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                  player.plan === 'PREMIUM' 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900' 
                    : 'bg-gray-400 text-gray-900'
                }`}>
                  {player.plan === 'PREMIUM' ? (
                    <>
                      <Star className="w-4 h-4" />
                      Premium
                    </>
                  ) : (
                    <>
                      <Info className="w-4 h-4" />
                      Ücretsiz
                    </>
                  )}
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
                <Building2 className="w-6 h-6 text-green-600" />
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
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">Henüz organizasyona katılmamış</p>
                  </div>
                ) : (
                  player.organizations.map((org) => (
                    <Link
                      key={org.id}
                      href={`/organization/${org.id}`}
                      className="block p-4 border-2 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all hover:shadow-md border-gray-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">{org.name}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                              {org.role === 'ADMIN' ? (
                                <>
                                  <Crown className="w-3 h-3 text-yellow-600" />
                                  Yönetici
                                </>
                              ) : (
                                <>
                                  <User className="w-3 h-3 text-blue-600" />
                                  Oyuncu
                                </>
                              )}
                            </span>
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                              {org.status === 'APPROVED' ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                                  Onaylı
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 text-orange-600" />
                                  Beklemede
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                        <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
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
                <Info className="w-6 h-6 text-blue-600" />
                Bilgiler
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Kayıt Tarihi - Her zaman göster */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <Label className="text-xs text-gray-600 uppercase font-semibold">Kayıt Tarihi</Label>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(player.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                {/* Email - Her zaman göster */}
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <Label className="text-xs text-gray-600 uppercase font-semibold">E-posta</Label>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{player.email}</p>
                </div>

                {/* Telefon - Her zaman göster, paylaşılmamışsa bilgi ver */}
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    <Label className="text-xs text-gray-600 uppercase font-semibold">Telefon</Label>
                  </div>
                  {player.showPhone && player.phone ? (
                    <p className="text-sm font-bold text-gray-900">{player.phone}</p>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                      <EyeOff className="w-4 h-4" />
                      <p className="text-sm italic">Paylaşılmamıştır</p>
                    </div>
                  )}
                </div>

                {/* Mevki - Her zaman göster, paylaşılmamışsa bilgi ver */}
                <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-orange-600" />
                    <Label className="text-xs text-gray-600 uppercase font-semibold">Tercih Edilen Mevki</Label>
                  </div>
                  {player.showPosition && player.position ? (
                    <p className="text-sm font-bold text-gray-900">{getPositionLabel(player.position)}</p>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                      <EyeOff className="w-4 h-4" />
                      <p className="text-sm italic">Paylaşılmamıştır</p>
                    </div>
                  )}
                </div>

                {/* Güçlü Ayak - Her zaman göster, paylaşılmamışsa bilgi ver */}
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Footprints className="w-4 h-4 text-yellow-600" />
                    <Label className="text-xs text-gray-600 uppercase font-semibold">Güçlü Ayak</Label>
                  </div>
                  {player.showStrongFoot && player.strongFoot ? (
                    <p className="text-sm font-bold text-gray-900">{getStrongFootLabel(player.strongFoot)}</p>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                      <EyeOff className="w-4 h-4" />
                      <p className="text-sm italic">Paylaşılmamıştır</p>
                    </div>
                  )}
                </div>

                {/* Fiziksel Özellikler - Her zaman göster, paylaşılmamışsa bilgi ver */}
                <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Ruler className="w-4 h-4 text-cyan-600" />
                    <Label className="text-xs text-gray-600 uppercase font-semibold">Fiziksel Özellikler</Label>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Ruler className="w-3 h-3 text-cyan-600" />
                        <p className="text-xs text-gray-600">Boy</p>
                      </div>
                      {player.showHeight && player.height ? (
                        <p className="text-sm font-bold text-gray-900">{player.height} cm</p>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-gray-400">
                          <EyeOff className="w-3 h-3" />
                          <p className="text-xs italic">-</p>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Weight className="w-3 h-3 text-cyan-600" />
                        <p className="text-xs text-gray-600">Kilo</p>
                      </div>
                      {player.showWeight && player.weight ? (
                        <p className="text-sm font-bold text-gray-900">{player.weight} kg</p>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-gray-400">
                          <EyeOff className="w-3 h-3" />
                          <p className="text-xs italic">-</p>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Calendar className="w-3 h-3 text-cyan-600" />
                        <p className="text-xs text-gray-600">Yaş</p>
                      </div>
                      {player.showAge && player.age ? (
                        <p className="text-sm font-bold text-gray-900">{player.age}</p>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-gray-400">
                          <EyeOff className="w-3 h-3" />
                          <p className="text-xs italic">-</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button 
            onClick={() => router.push('/players')} 
            variant="outline"
            className="flex items-center gap-2 border-2 hover:bg-green-50 hover:border-green-300 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Oyuncular Listesine Dön
          </Button>
        </div>
      </div>
    </div>
  )
}
