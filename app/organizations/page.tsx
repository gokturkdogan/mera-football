'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Navbar from '@/components/Navbar'

interface Organization {
  id: string
  name: string
  description: string | null
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
              <h1 className="text-4xl font-black mb-2">Organizasyonlar</h1>
              <p className="text-xl opacity-90">
                Sistemdeki tüm organizasyonları görüntüleyin ve keşfedin
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl backdrop-blur-sm border-4 border-white/30">
                🏆
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
                <p className="text-sm text-gray-600 font-medium mb-1">Toplam Organizasyon</p>
                <p className="text-4xl font-black text-green-600">{organizations.length}</p>
              </div>
              <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center text-3xl">
                🏆
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
                <div className="text-6xl mb-4">🔍</div>
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
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                              {org.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900 block">{org.name}</span>
                              {org.description && (
                                <span className="text-xs text-gray-500 line-clamp-1">
                                  {org.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <span className="font-medium text-gray-900 block">{org.owner.name}</span>
                            <span className="text-sm text-gray-600">{org.owner.email}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-sm ${
                            org.owner.plan === 'PREMIUM'
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                              : 'bg-gray-100 text-gray-800 border border-gray-300'
                          }`}>
                            {org.owner.plan === 'PREMIUM' ? '⭐' : '🆓'}
                            {org.owner.plan}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
                            <span>👥</span>
                            {org._count.members}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-semibold text-sm">
                            <span>⚽</span>
                            {org._count.matches}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-700">
                            {new Date(org.createdAt).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <Link href={`/organization/${org.id}`}>
                            <Button variant="outline" size="sm" className="border-green-500 text-green-600 hover:bg-green-50">
                              Detay
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
        <Card className="mt-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>ℹ️</span>
              Bilgi
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
  )
}

