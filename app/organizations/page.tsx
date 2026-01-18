'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Navbar from '@/components/Navbar'
import { 
  Building2, 
  Trophy, 
  Search, 
  Users, 
  Calendar, 
  Star, 
  FileText, 
  Info, 
  ArrowRight,
  Loader2,
  Target,
  User,
  Shield,
  LogIn,
  Home
} from 'lucide-react'

interface Organization {
  id: string
  name: string
  description: string | null
  avatarUrl: string | null
  createdAt: string
  owner: {
    id: string
    name: string
    email: string
    plan: string
  }
  _count: {
    members: number
    matches: number
  }
}

export default function OrganizationsPage() {
  const router = useRouter()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [user, setUser] = useState<any>(null)
  const [isUnauthorized, setIsUnauthorized] = useState(false)

  useEffect(() => {
    fetchUser()
    fetchOrganizations()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      // User not logged in
    }
  }

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOrganizations(organizations)
    } else {
      const filtered = organizations.filter(
        (org) =>
          org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          org.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          org.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          org.owner.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredOrganizations(filtered)
    }
  }, [searchTerm, organizations])

  const fetchOrganizations = async () => {
    try {
      const res = await fetch('/api/organizations/all', {
        credentials: 'include',
      })
      if (!res.ok) {
        if (res.status === 401) {
          setIsUnauthorized(true)
          setOrganizations([])
          setFilteredOrganizations([])
          return
        }
        throw new Error('Failed to fetch organizations')
      }
      const data = await res.json()
      setOrganizations(data.organizations || [])
      setFilteredOrganizations(data.organizations || [])
      setIsUnauthorized(false)
    } catch (error) {
      console.error('Error fetching organizations:', error)
      setIsUnauthorized(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative">
      <Navbar />

      {/* Blurred Background Content */}
      <div className={isUnauthorized ? 'blur-md pointer-events-none select-none opacity-50' : ''}>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black mb-2">Organizasyonlar</h1>
                <p className="text-xl opacity-90">
                  Sistemdeki tüm organizasyonları görüntüleyin ve keşfedin
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30 shadow-xl">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
            {/* Stats Card */}
          <Card className="mb-6 border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Toplam Organizasyon</p>
                  <p className="text-4xl font-black text-green-600">{organizations.length}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
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
                  placeholder="Organizasyon adı, açıklama, yönetici adı veya email ile ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-6 text-lg"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {searchTerm && (
                <p className="text-sm text-gray-600 mt-2">
                  {filteredOrganizations.length} organizasyon bulundu
                </p>
              )}
            </CardContent>
          </Card>

          {/* Organizations Table */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Organizasyon Listesi</CardTitle>
            <CardDescription>
              {searchTerm 
                ? `${filteredOrganizations.length} organizasyon bulundu`
                : `Toplam ${organizations.length} organizasyon`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredOrganizations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Search className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {searchTerm ? 'Organizasyon bulunamadı' : 'Henüz organizasyon yok'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? 'Arama kriterlerinize uygun organizasyon bulunamadı. Farklı bir arama terimi deneyin.'
                    : 'Sistemde henüz kayıtlı organizasyon bulunmuyor.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-semibold text-gray-900">Organizasyon</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Yönetici</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Plan</th>
                      <th className="text-center p-4 font-semibold text-gray-900">Üye</th>
                      <th className="text-center p-4 font-semibold text-gray-900">Maç</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Oluşturulma</th>
                      <th className="text-center p-4 font-semibold text-gray-900">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrganizations.map((org, index) => (
                      <tr
                        key={org.id}
                        className={`border-b hover:bg-green-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                              {org.avatarUrl ? (
                                <img 
                                  src={org.avatarUrl} 
                                  alt={org.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Building2 className="w-6 h-6 text-green-600" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-gray-900 block">{org.name}</span>
                              {org.description && (
                                <span className="text-xs text-gray-500 line-clamp-1">
                                  {org.description.length > 20 
                                    ? `${org.description.substring(0, 20)}...` 
                                    : org.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Link href={`/players/${org.owner.id}`} className="inline-block">
                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-sm transition-colors cursor-pointer ${
                              org.owner.plan === 'PREMIUM'
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200'
                            }`}>
                              <User className="w-4 h-4" />
                              {org.owner.name}
                            </span>
                          </Link>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-sm ${
                            org.owner.plan === 'PREMIUM'
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                              : 'bg-gray-100 text-gray-800 border border-gray-300'
                          }`}>
                            {org.owner.plan === 'PREMIUM' ? (
                              <>
                                <Star className="w-3 h-3 fill-yellow-800" />
                                Premium
                              </>
                            ) : (
                              <>
                                <FileText className="w-3 h-3" />
                                Free
                              </>
                            )}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
                            <Users className="w-4 h-4" />
                            {org._count.members}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-semibold text-sm">
                            <Target className="w-4 h-4" />
                            {org._count.matches}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            {new Date(org.createdAt).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <Link href={`/organization/${org.id}`}>
                            <Button variant="outline" size="sm" className="border-green-500 text-green-600 hover:bg-green-50 flex items-center gap-2">
                              Detay
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
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
        <Card className="mt-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Bilgi</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Bu sayfada sistemde kayıtlı tüm organizasyonları görüntüleyebilirsiniz. 
              Organizasyonlar, yöneticileri, plan durumları ve istatistikleri ile birlikte listelenmektedir. 
              Arama özelliği ile organizasyonları ad, açıklama, yönetici adı veya email'e göre filtreleyebilirsiniz.
            </p>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Unauthorized Warning - Overlay */}
      {isUnauthorized && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-black/20 backdrop-blur-sm">
          <Card className="w-full max-w-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-2xl">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-900 mb-2">
                    Üyelik Gerekli
                  </h3>
                  <p className="text-amber-800 mb-4">
                    Bu içerikleri sadece platform üyelerimiz görüntüleyebilmektedir. Organizasyonları görmek için lütfen giriş yapın veya kayıt olun.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/login">
                      <Button className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white">
                        <LogIn className="w-4 h-4 mr-2" />
                        Giriş Yap
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="outline" className="w-full sm:w-auto border-amber-600 text-amber-700 hover:bg-amber-50">
                        Kayıt Ol
                      </Button>
                    </Link>
                    <Link href="/">
                      <Button variant="ghost" className="w-full sm:w-auto text-amber-700 hover:bg-amber-100">
                        <Home className="w-4 h-4 mr-2" />
                        Anasayfaya Dön
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

