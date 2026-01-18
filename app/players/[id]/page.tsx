'use client'

import { useEffect, useState, useRef } from 'react'
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
  StarHalf,
  EyeOff,
  Trophy,
  Goal,
  CalendarDays,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight
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
  averageRating: number | null
  createdAt: string
  organizations: Array<{
    id: string
    name: string
    role: string
    status: string
  }>
  statistics?: {
    totalMatches: number
    totalGoals: number
  }
  matchHistory?: Array<{
    id: string
    date: string
    time: string
    venue: string | null
    status: string
    organization: {
      id: string
      name: string
    }
    scores: {
      teamAScore: number
      teamBScore: number
    } | null
    averageRating: number | null
    goalsCount: number
  }>
}

export default function PlayerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentOrgIndex, setCurrentOrgIndex] = useState(0)
  const orgCarouselRef = useRef<HTMLDivElement>(null)
  const orgTouchStartX = useRef<number | null>(null)
  const orgTouchEndX = useRef<number | null>(null)

  // Organization carousel functions
  const orgItemsPerPageDesktop = 3
  const orgItemsPerPageMobile = 1
  const orgTotalPagesDesktop = player ? Math.ceil(player.organizations.length / orgItemsPerPageDesktop) : 0
  const orgTotalPagesMobile = player ? Math.ceil(player.organizations.length / orgItemsPerPageMobile) : 0

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

  const getMatchStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'DRAFT': 'Kadro kuruluyor',
      'UPCOMING': 'Kadrolar hazır',
      'FINISHED': 'Oynandı',
      'PUBLISHED': 'Tamamlandı'
    }
    return labels[status] || status
  }

  const handlePrevOrg = () => {
    if (!player) return
    if (window.innerWidth >= 768) {
      setCurrentOrgIndex((prev) => (prev > 0 ? prev - 1 : orgTotalPagesDesktop - 1))
    } else {
      setCurrentOrgIndex((prev) => (prev > 0 ? prev - 1 : orgTotalPagesMobile - 1))
    }
  }

  const handleNextOrg = () => {
    if (!player) return
    if (window.innerWidth >= 768) {
      setCurrentOrgIndex((prev) => (prev < orgTotalPagesDesktop - 1 ? prev + 1 : 0))
    } else {
      setCurrentOrgIndex((prev) => (prev < orgTotalPagesMobile - 1 ? prev + 1 : 0))
    }
  }

  const handleOrgTouchStart = (e: React.TouchEvent) => {
    orgTouchStartX.current = e.touches[0].clientX
  }

  const handleOrgTouchMove = (e: React.TouchEvent) => {
    orgTouchEndX.current = e.touches[0].clientX
  }

  const handleOrgTouchEnd = () => {
    if (!orgTouchStartX.current || !orgTouchEndX.current || !player) return
    
    const distance = orgTouchStartX.current - orgTouchEndX.current
    const minSwipeDistance = 50

    if (distance > minSwipeDistance && currentOrgIndex < player.organizations.length - 1) {
      handleNextOrg()
    } else if (distance < -minSwipeDistance && currentOrgIndex > 0) {
      handlePrevOrg()
    }

    orgTouchStartX.current = null
    orgTouchEndX.current = null
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
        {/* Statistics Cards */}
        {player.statistics && (
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Total Matches */}
            <Card className="shadow-xl border-2 border-blue-200 bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Toplam Maç</p>
                    <p className="text-4xl font-black text-blue-600">
                      {player.statistics.totalMatches}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Goals */}
            <Card className="shadow-xl border-2 border-red-200 bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Toplam Gol</p>
                    <p className="text-4xl font-black text-red-600">
                      {player.statistics.totalGoals}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <Goal className="w-8 h-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Average Rating */}
            <Card className="shadow-xl border-2 border-yellow-200 bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Ortalama Puan</p>
                    {player.averageRating !== null && player.averageRating !== undefined ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const rating = player.averageRating!
                            const isFilled = star <= Math.floor(rating)
                            const isHalfFilled = star === Math.ceil(rating) && rating % 1 >= 0.5 && rating % 1 < 1
                            return isHalfFilled ? (
                              <StarHalf
                                key={star}
                                className="w-5 h-5 text-yellow-500 fill-yellow-500"
                              />
                            ) : (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${
                                  isFilled
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Henüz puanlanmamış</p>
                    )}
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Star className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
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

          {/* Match History */}
          <Card className="shadow-xl border-2 border-purple-200 bg-white h-full flex flex-col">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-6 h-6 text-purple-600" />
                Maç Geçmişi
                <span className="ml-auto text-sm font-normal text-gray-600">
                  ({player.matchHistory?.length || 0})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex-1 flex flex-col min-h-0">
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[570px]">
                {!player.matchHistory || player.matchHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarDays className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">Henüz maç geçmişi yok</p>
                  </div>
                ) : (
                  player.matchHistory.map((match) => (
                    <Link
                      key={match.id}
                      href={`/match/${match.id}`}
                      className="block p-4 border-2 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all hover:shadow-md border-gray-200 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                            <p className="font-bold text-gray-900 truncate">{match.organization.name}</p>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-3 h-3 text-gray-500" />
                            <p className="text-xs text-gray-600">
                              {new Date(match.date).toLocaleDateString('tr-TR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>

                          {match.venue && (
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-3 h-3 text-gray-500" />
                              <p className="text-xs text-gray-600 truncate">{match.venue}</p>
                            </div>
                          )}

                          {match.scores && (
                            <div className="flex items-center gap-2 mb-2">
                              <Trophy className="w-3 h-3 text-yellow-600" />
                              <p className="text-sm font-bold text-gray-900">
                                {match.scores.teamAScore} - {match.scores.teamBScore}
                              </p>
                            </div>
                          )}

                          {match.averageRating !== null && match.averageRating !== undefined && (
                            <div className="flex items-center gap-2 mb-2">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => {
                                  const rating = match.averageRating!
                                  const isFilled = star <= Math.floor(rating)
                                  const isHalfFilled = star === Math.ceil(rating) && rating % 1 >= 0.5 && rating % 1 < 1
                                  return isHalfFilled ? (
                                    <StarHalf
                                      key={star}
                                      className="w-3 h-3 text-yellow-500 fill-yellow-500"
                                    />
                                  ) : (
                                    <Star
                                      key={star}
                                      className={`w-3 h-3 ${
                                        isFilled
                                          ? 'text-yellow-500 fill-yellow-500'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                              match.status === 'DRAFT' 
                                ? 'bg-gray-100 text-gray-700'
                                : match.status === 'UPCOMING'
                                ? 'bg-blue-100 text-blue-700'
                                : match.status === 'FINISHED'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {getMatchStatusLabel(match.status)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {match.goalsCount > 0 && (
                            <div className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded-full">
                              <Goal className="w-4 h-4 text-red-600" />
                              <span className="text-sm font-bold text-red-600">{match.goalsCount}</span>
                            </div>
                          )}
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Organizations Slider */}
        <div className="mt-6">
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
              {player.organizations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">Henüz organizasyona katılmamış</p>
                </div>
              ) : (
                <>
                  {/* Desktop Carousel */}
                  <div className="hidden md:block relative">
                    {player.organizations.length > orgItemsPerPageDesktop && (
                      <>
                        <button
                          onClick={handlePrevOrg}
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-gray-200"
                        >
                          <ChevronLeft className="w-6 h-6 text-gray-700" />
                        </button>
                        <button
                          onClick={handleNextOrg}
                          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-gray-200"
                        >
                          <ChevronRight className="w-6 h-6 text-gray-700" />
                        </button>
                      </>
                    )}
                    <div className="overflow-hidden">
                      <div 
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{ 
                          width: `${orgTotalPagesDesktop * 100}%`,
                          transform: `translateX(-${currentOrgIndex * (100 / orgTotalPagesDesktop)}%)`
                        }}
                      >
                        {Array.from({ length: orgTotalPagesDesktop }).map((_, pageIndex) => (
                          <div key={pageIndex} className="flex-shrink-0 flex" style={{ width: `${100 / orgTotalPagesDesktop}%` }}>
                            {player.organizations.slice(pageIndex * orgItemsPerPageDesktop, (pageIndex + 1) * orgItemsPerPageDesktop).map((org) => (
                              <div key={org.id} className="flex-shrink-0 px-2" style={{ width: `${100 / orgItemsPerPageDesktop}%` }}>
                                <Link
                                  href={`/organization/${org.id}`}
                                  className="flex items-center gap-3 p-4 border-2 rounded-lg hover:border-green-400 hover:shadow-md transition-all bg-white cursor-pointer"
                                >
                                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                                    <Building2 className="w-6 h-6" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">{org.name}</p>
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
                                </Link>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Carousel */}
                  <div 
                    className="md:hidden relative"
                    ref={orgCarouselRef}
                    onTouchStart={handleOrgTouchStart}
                    onTouchMove={handleOrgTouchMove}
                    onTouchEnd={handleOrgTouchEnd}
                  >
                    {player.organizations.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevOrg}
                          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-gray-200"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={handleNextOrg}
                          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-gray-200"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                      </>
                    )}
                    <div className="overflow-hidden">
                      <div 
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{ 
                          transform: `translateX(-${currentOrgIndex * (player.organizations.length === 1 ? 0 : 66.666)}%)` 
                        }}
                      >
                        {player.organizations.map((org) => (
                          <div 
                            key={org.id} 
                            className={`flex-shrink-0 ${player.organizations.length === 1 ? 'w-full' : 'w-2/3'} px-2`}
                          >
                            <Link
                              href={`/organization/${org.id}`}
                              className="flex items-center gap-3 p-4 border-2 rounded-lg hover:border-green-400 hover:shadow-md transition-all bg-white cursor-pointer"
                            >
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                                <Building2 className="w-6 h-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{org.name}</p>
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
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
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
