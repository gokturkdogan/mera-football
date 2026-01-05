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
  User
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

  useEffect(() => {
    fetchOrganizations()
  }, [])

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
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch organizations')
      }
      const data = await res.json()
      setOrganizations(data.organizations || [])
      setFilteredOrganizations(data.organizations || [])
    } catch (error) {
      console.error('Error fetching organizations:', error)
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />

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

