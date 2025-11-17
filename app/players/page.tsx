'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Navbar from '@/components/Navbar'

interface Player {
  id: string
  name: string
  email: string
  phone: string | null
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
          (player.phone && player.phone.includes(searchTerm))
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
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl backdrop-blur-sm border-4 border-white/30">
                ⚽
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Card */}
        <Card className="mb-6 border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Toplam Oyuncu</p>
                <p className="text-4xl font-black text-green-600">{players.length}</p>
              </div>
              <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center text-3xl">
                👥
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Oyuncu adı, email veya telefon ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-6 text-lg"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-600 mt-2">
                {filteredPlayers.length} oyuncu bulundu
              </p>
            )}
          </CardContent>
        </Card>

        {/* Players Table */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Oyuncu Listesi</CardTitle>
            <CardDescription>
              {searchTerm 
                ? `${filteredPlayers.length} oyuncu bulundu`
                : `Toplam ${players.length} oyuncu`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPlayers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
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
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-semibold text-gray-900">Oyuncu</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Email</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Telefon</th>
                      <th className="text-center p-4 font-semibold text-gray-900">Organizasyon</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Kayıt Tarihi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.map((player, index) => (
                      <tr
                        key={player.id}
                        className={`border-b hover:bg-green-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                              {player.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-900">{player.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-700">{player.email}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-700">
                            {player.phone || (
                              <span className="text-gray-400 italic">Belirtilmemiş</span>
                            )}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
                            <span>🏆</span>
                            {player._count.organizations}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-700">
                            {new Date(player.createdAt).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
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
              <span>ℹ️</span>
              Bilgi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Bu sayfada sistemde kayıtlı tüm oyuncuları görüntüleyebilirsiniz. 
              Oyuncular organizasyon bağımsız olarak listelenmektedir. 
              Arama özelliği ile oyuncuları ad, email veya telefon numarasına göre filtreleyebilirsiniz.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
