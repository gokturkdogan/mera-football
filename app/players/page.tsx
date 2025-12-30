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
  ArrowRight
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

  useEffect(() => {
    fetchPlayers()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPlayers(players)
    } else {
      const filtered = players.filter(
        (player) =>
          player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (player.phone && player.phone.includes(searchTerm)) ||
          (player.position && player.position.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredPlayers(filtered)
    }
  }, [searchTerm, players])

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
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Oyuncu Listesi
            </CardTitle>
            <CardDescription>
              {searchTerm 
                ? `${filteredPlayers.length} oyuncu bulundu`
                : `Toplam ${players.length} oyuncu`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPlayers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {searchTerm ? 'Oyuncu bulunamadı' : 'Henüz oyuncu yok'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? 'Arama kriterlerinize uygun oyuncu bulunamadı. Farklı bir arama terimi deneyin.'
                    : 'Sistemde henüz kayıtlı oyuncu bulunmuyor.'}
                </p>
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
                      <th className="text-left p-4 font-semibold text-gray-900">Fiziksel</th>
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

                        {/* Physical Attributes */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {/* Boy */}
                            <div className="flex items-center gap-1" title="Boy">
                              <Ruler className="w-3.5 h-3.5 text-cyan-600" />
                              {player.showHeight ? (
                                <span className="text-xs font-medium text-gray-700">
                                  {player.height ? `${player.height}cm` : '-'}
                                </span>
                              ) : (
                                <EyeOff className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                            {/* Kilo */}
                            <div className="flex items-center gap-1" title="Kilo">
                              <Weight className="w-3.5 h-3.5 text-cyan-600" />
                              {player.showWeight ? (
                                <span className="text-xs font-medium text-gray-700">
                                  {player.weight ? `${player.weight}kg` : '-'}
                                </span>
                              ) : (
                                <EyeOff className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                            {/* Yaş */}
                            <div className="flex items-center gap-1" title="Yaş">
                              <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                              {player.showAge ? (
                                <span className="text-xs font-medium text-gray-700">
                                  {player.age ? `${player.age}` : '-'}
                                </span>
                              ) : (
                                <EyeOff className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold">MeraFootball</h4>
              </div>
              <p className="text-gray-400">
                Halısaha futbol organizasyonları için profesyonel platform
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Hızlı Linkler</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">Nasıl Çalışır?</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Giriş Yap</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Kayıt Ol</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Destek</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Email: destek@merafootball.com</li>
                <li>7/24 Destek</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2024 MeraFootball. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
