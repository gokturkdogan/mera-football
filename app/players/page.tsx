'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
  Users,
  Search,
  Eye,
  EyeOff,
  ArrowRight,
  Filter,
  Shield,
  X,
  Star,
  StarHalf,
  ChevronUp,
  ChevronDown
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
  averageRating: number | null
  createdAt: string
  _count: {
    organizations: number
  }
}

export default function PlayersPage() {
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [ratingSortOrder, setRatingSortOrder] = useState<'none' | 'desc' | 'asc'>('none')

  useEffect(() => {
    fetchPlayers()
  }, [])

  useEffect(() => {
    let filtered = players

    // Apply position filter - sadece paylaşılan mevkiler arasında filtrele
    if (activeFilter !== 'all') {
      filtered = filtered.filter(player => 
        player.position === activeFilter && player.showPosition === true
      )
    }

    // Apply search term - sadece paylaşılan bilgiler arasında ara
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(
        (player) =>
          player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (player.phone && player.showPhone && player.phone.includes(searchTerm)) ||
          (player.position && player.showPosition && player.position.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply rating sort
    if (ratingSortOrder !== 'none') {
      filtered = [...filtered].sort((a, b) => {
        // Puanı olmayanları her zaman en sonda göster
        if (a.averageRating === null && b.averageRating === null) return 0
        if (a.averageRating === null) return 1
        if (b.averageRating === null) return -1
        
        if (ratingSortOrder === 'desc') {
          // En yüksekten en düşüğe
          return (b.averageRating || 0) - (a.averageRating || 0)
        } else {
          // En düşükten en yükseğe
          return (a.averageRating || 0) - (b.averageRating || 0)
        }
      })
    }

    setFilteredPlayers(filtered)
  }, [searchTerm, players, activeFilter, ratingSortOrder])

  const fetchPlayers = async () => {
    try {
      const res = await fetch('/api/players', {
        credentials: 'include',
      })
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch players')
      }
      const data = await res.json()
      setPlayers(data.players || [])
      setFilteredPlayers(data.players || [])
    } catch (error) {
      console.error('Error fetching players:', error)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2">Oyuncular</h1>
              <p className="text-xl opacity-90">
                Sistemdeki tüm oyuncuları görüntüleyin ve keşfedin
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
                <Users className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <Card className="mb-6 border-2">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Oyuncu adı, email, telefon veya mevki ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-6 text-lg"
              />
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-600 mt-2">
                {filteredPlayers.length} oyuncu bulundu
              </p>
            )}
          </CardContent>
        </Card>

        {/* Players Table */}
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Oyuncu Listesi
                </CardTitle>
                <CardDescription>
                  {searchTerm 
                    ? `${filteredPlayers.length} oyuncu bulundu`
                    : `Toplam ${players.length} oyuncu`}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-gray-500" />
                <div className="flex items-center gap-1">
                  <Button
                    variant={activeFilter === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveFilter('all')}
                    className={`h-8 px-3 text-xs ${
                      activeFilter === 'all' 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Tümü
                  </Button>
                  <Button
                    variant={activeFilter === 'KALECI' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveFilter('KALECI')}
                    className={`h-8 px-3 text-xs flex items-center gap-1 ${
                      activeFilter === 'KALECI' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    Kaleci
                  </Button>
                  <Button
                    variant={activeFilter === 'DEFANS' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveFilter('DEFANS')}
                    className={`h-8 px-3 text-xs flex items-center gap-1 ${
                      activeFilter === 'DEFANS' 
                        ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    Defans
                  </Button>
                  <Button
                    variant={activeFilter === 'ORTASAHA' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveFilter('ORTASAHA')}
                    className={`h-8 px-3 text-xs flex items-center gap-1 ${
                      activeFilter === 'ORTASAHA' 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Users className="w-3 h-3" />
                    Ortasaha
                  </Button>
                  <Button
                    variant={activeFilter === 'FORVET' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveFilter('FORVET')}
                    className={`h-8 px-3 text-xs flex items-center gap-1 ${
                      activeFilter === 'FORVET' 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Target className="w-3 h-3" />
                    Forvet
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredPlayers.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 animate-pulse"></div>
                    <Search className="w-16 h-16 text-gray-400 relative z-10" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-gray-900 mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {searchTerm 
                      ? 'Oyuncu bulunamadı' 
                      : activeFilter !== 'all' 
                        ? 'Seçtiğiniz mevkide oyuncu yok'
                        : 'Henüz oyuncu yok'}
                  </h3>
                  <div className="max-w-md mx-auto">
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {searchTerm
                        ? 'Arama kriterlerinize uygun oyuncu bulunamadı. Farklı bir arama terimi deneyin.'
                        : activeFilter !== 'all'
                          ? `Sistemde ${activeFilter === 'KALECI' ? 'Kaleci' : activeFilter === 'DEFANS' ? 'Defans' : activeFilter === 'ORTASAHA' ? 'Ortasaha' : 'Forvet'} mevkiinde kayıtlı oyuncu bulunmuyor.`
                          : 'Sistemde henüz kayıtlı oyuncu bulunmuyor.'}
                    </p>
                  </div>
                  {activeFilter !== 'all' && (
                    <div className="mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setActiveFilter('all')}
                        className="border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Filtreyi Kaldır
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="text-left p-4 font-semibold text-gray-900">Oyuncu</th>
                      <th className="text-left p-4 font-semibold text-gray-900">İletişim</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Mevki</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Güçlü Ayak</th>
                      <th 
                        className="text-left p-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={() => {
                          if (ratingSortOrder === 'none') {
                            setRatingSortOrder('desc')
                          } else if (ratingSortOrder === 'desc') {
                            setRatingSortOrder('asc')
                          } else {
                            setRatingSortOrder('none')
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span>Puan Ortalaması</span>
                          {ratingSortOrder === 'desc' && (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          )}
                          {ratingSortOrder === 'asc' && (
                            <ChevronUp className="w-4 h-4 text-gray-600" />
                          )}
                          {ratingSortOrder === 'none' && (
                            <div className="w-4 h-4 flex flex-col items-center justify-center opacity-60">
                              <ChevronUp className="w-3 h-3 text-gray-500" />
                              <ChevronDown className="w-3 h-3 text-gray-500 -mt-1" />
                            </div>
                          )}
                        </div>
                      </th>
                      <th className="text-center p-4 font-semibold text-gray-900">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.map((player, index) => (
                      <tr
                        key={player.id}
                        className={`border-b hover:bg-green-50/50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                        }`}
                      >
                        {/* Player Info */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md overflow-hidden ${
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
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                                  <Crown className="w-2.5 h-2.5 text-yellow-900" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 truncate">{player.name}</span>
                                {player.role === 'ADMIN' ? (
                                  <Crown className="w-4 h-4 text-yellow-600 flex-shrink-0" title="Yönetici" />
                                ) : (
                                  <User className="w-4 h-4 text-green-600 flex-shrink-0" title="Oyuncu" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Mail className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500 truncate">{player.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-blue-600" />
                            {player.showPhone && player.phone ? (
                              <span className="text-sm text-gray-900 font-medium">{player.phone}</span>
                            ) : (
                              <div className="flex items-center gap-1 text-gray-400">
                                <EyeOff className="w-3 h-3" />
                                <span className="text-xs italic">Paylaşılmamış</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Position */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-orange-600" />
                            {player.showPosition && player.position ? (
                              <span className="text-sm text-gray-900 font-medium">{player.position}</span>
                            ) : (
                              <div className="flex items-center gap-1 text-gray-400">
                                <EyeOff className="w-3 h-3" />
                                <span className="text-xs italic">Paylaşılmamış</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Strong Foot */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Footprints className="w-4 h-4 text-yellow-600" />
                            {player.showStrongFoot && player.strongFoot ? (
                              <span className="text-sm text-gray-900 font-medium">{player.strongFoot}</span>
                            ) : (
                              <div className="flex items-center gap-1 text-gray-400">
                                <EyeOff className="w-3 h-3" />
                                <span className="text-xs italic">Paylaşılmamış</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Average Rating */}
                        <td className="p-4">
                          {player.averageRating !== null && player.averageRating !== undefined ? (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => {
                                const rating = player.averageRating || 0
                                const fullStars = Math.floor(rating)
                                const hasHalfStar = rating % 1 >= 0.5 && i === fullStars
                                const isFilled = i < fullStars || hasHalfStar
                                
                                if (hasHalfStar) {
                                  return (
                                    <StarHalf
                                      key={i}
                                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                    />
                                  )
                                }
                                
                                return (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      isFilled
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                )
                              })}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Henüz puanlanmamış</span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="p-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/players/${player.id}`)
                            }}
                            className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <span className="text-sm font-medium">Detay</span>
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Bilgi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Bu sayfada sistemde kayıtlı tüm oyuncuları görüntüleyebilirsiniz. 
              Oyuncular, "listelemede göster" seçeneğini işaretledikleri bilgileri diğer üyelerle paylaşırlar. 
              Paylaşılmayan bilgiler "Paylaşılmamış" olarak gösterilir. 
              Arama özelliği ile oyuncuları ad, email, telefon veya mevkiye göre filtreleyebilirsiniz.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
