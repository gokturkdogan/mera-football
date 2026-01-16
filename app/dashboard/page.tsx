'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'
import Navbar from '@/components/Navbar'
import { 
  Trophy, 
  Star, 
  Crown, 
  Users, 
  BarChart3, 
  Zap, 
  Plus, 
  Gem, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Building2,
  ArrowRight,
  Sparkles,
  Loader2,
  Target,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Calendar
} from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  role: string
  plan?: string
}

interface Organization {
  id: string
  name: string
  description: string | null
  avatarUrl: string | null
  owner: {
    plan: string
  }
  _count: {
    members: number
  }
  pendingRequestsCount?: number
  pendingMatchAttendanceCount?: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [uniqueMemberCount, setUniqueMemberCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [organizationToDelete, setOrganizationToDelete] = useState<Organization | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

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
        setUniqueMemberCount(data.uniqueMemberCount || 0)
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (org: Organization) => {
    setOrganizationToDelete(org)
    setDeleteModalOpen(true)
  }

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleNextSlide = () => {
    if (currentSlide < organizations.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const distance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (distance > minSwipeDistance && currentSlide < organizations.length - 1) {
      // Swipe left - next slide
      handleNextSlide()
    } else if (distance < -minSwipeDistance && currentSlide > 0) {
      // Swipe right - previous slide
      handlePrevSlide()
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  const handleDeleteConfirm = async () => {
    if (!organizationToDelete) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/organizations/${organizationToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!res.ok) {
        const data = await res.json()
        showToast(data.error || 'Organizasyon silinirken bir hata oluştu', 'error')
        setDeleting(false)
        return
      }

      // Remove from list
      setOrganizations(organizations.filter(org => org.id !== organizationToDelete.id))
      showToast('Organizasyon başarıyla silindi', 'success')
      setDeleteModalOpen(false)
      setOrganizationToDelete(null)
    } catch (error) {
      console.error('Error deleting organization:', error)
      showToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'error')
    } finally {
      setDeleting(false)
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

  const isAdmin = user?.role === 'ADMIN'
  const adminPlan = user?.plan || 'FREE'

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2">Organizasyonlarım</h1>
              <p className="text-xl opacity-90">
                {isAdmin ? 'Organizasyonlarınızı yönetin' : 'Organizasyonlarınızı görüntüleyin'}
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
        {/* Plan Info for Admin - Premium Upgrade */}
        {isAdmin && adminPlan === 'FREE' && (
          <Card className="mb-8 border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Gem className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-lg font-bold text-gray-900">Premium Plan'a Geçin</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Sınırsız maç</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Sınırsız oyuncu</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Öncelikli destek</span>
                    </div>
                  </div>
                </div>
                <Link href="/payment" className="flex-shrink-0">
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold shadow-lg flex items-center gap-2 whitespace-nowrap">
                    <Gem className="w-4 h-4" />
                    Premium Satın Al - 99.99 ₺
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all hover:scale-105">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Toplam Organizasyon</p>
                  <p className="text-4xl font-black text-green-600">
                    {organizations.length}/3
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {isAdmin && (
            <>
              <Card className={`border-2 ${adminPlan === 'PREMIUM' ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50'} hover:shadow-lg transition-all hover:scale-105`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">Plan Durumu</p>
                      <p className={`text-2xl font-black ${adminPlan === 'PREMIUM' ? 'text-yellow-600' : 'text-gray-600'}`}>
                        {adminPlan === 'PREMIUM' ? 'Premium' : 'Free'}
                      </p>
                    </div>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${adminPlan === 'PREMIUM' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-gray-400 to-gray-600'}`}>
                      {adminPlan === 'PREMIUM' ? (
                        <Gem className="w-8 h-8 text-white" />
                      ) : (
                        <FileText className="w-8 h-8 text-white" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">Toplam Üye</p>
                      <p className="text-4xl font-black text-blue-600">
                        {uniqueMemberCount}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!isAdmin && (
            <>
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">Kalan Kontenjan</p>
                      <p className="text-4xl font-black text-blue-600">{2 - organizations.length}</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">Oyuncu Planı</p>
                      <p className="text-2xl font-black text-purple-600">Ücretsiz</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Organizations Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {isAdmin ? 'Organizasyonlarım' : 'Katıldığım Organizasyonlar'}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              {isAdmin 
                ? 'Oluşturduğunuz organizasyonları yönetin ve yeni organizasyonlar oluşturun'
                : 'Aktif olduğunuz organizasyonlar (Maksimum 2)'}
            </p>
          </div>
          {isAdmin && (
            <Link href="/organization/new" className="flex-shrink-0">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Yeni Organizasyon
              </Button>
            </Link>
          )}
        </div>

        {organizations.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Building2 className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {isAdmin ? 'Henüz organizasyon oluşturmadınız' : 'Henüz bir organizasyona katılmadınız'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {isAdmin
                    ? 'İlk organizasyonunuzu oluşturarak başlayın ve halısaha futbol organizasyonlarınızı yönetmeye başlayın'
                    : 'Organizasyonlara katılarak maçlara katılabilir ve futbol deneyiminizi paylaşabilirsiniz'}
                </p>
                {isAdmin ? (
                  <Link href="/organization/new">
                    <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center gap-2 mx-auto">
                      <Plus className="w-5 h-5" />
                      İlk Organizasyonu Oluştur
                    </Button>
                  </Link>
                ) : (
                  <Link href="/organizations">
                    <Button size="lg" variant="outline" className="flex items-center gap-2 mx-auto">
                      <Building2 className="w-5 h-5" />
                      Organizasyonları Keşfet
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-600" />
                Organizasyonlarınız
              </CardTitle>
              <CardDescription>
                Oluşturduğunuz organizasyonları yönetin ve düzenleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Desktop Grid View */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizations.map((org) => (
                  <Card key={org.id} className="border-2 hover:border-green-400 hover:shadow-xl transition-all bg-white h-full flex flex-col relative group">
                    {/* Pending Requests Badge (Admin) */}
                    {isAdmin && (org.pendingRequestsCount ?? 0) > 0 && (
                      <div className="absolute top-2 left-2 z-20">
                        <div className="relative">
                          <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                          <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg border-2 border-white animate-pulse">
                            <Bell className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">{org.pendingRequestsCount}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Pending Match Attendance Badge (Player) */}
                    {!isAdmin && (org.pendingMatchAttendanceCount ?? 0) > 0 && (
                      <div className="absolute top-2 right-2 z-20">
                        <div className="relative">
                          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                          <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg border-2 border-white animate-pulse">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">{org.pendingMatchAttendanceCount}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-white/90 hover:bg-red-50 hover:text-red-600 text-gray-500 border border-gray-200 shadow-sm"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDeleteClick(org)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <Link href={`/organization/${org.id}`} className="flex-1 flex flex-col">
                      <CardHeader>
                        <div className="flex items-start gap-3 mb-2">
                          {/* Avatar */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                            {org.avatarUrl ? (
                              <img 
                                src={org.avatarUrl} 
                                alt={org.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Building2 className="w-8 h-8 text-green-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-xl mb-1">{org.name}</CardTitle>
                                <CardDescription className="line-clamp-2">
                                  {org.description || 'Açıklama yok'}
                                </CardDescription>
                              </div>
                              {isAdmin && org.owner.plan === 'PREMIUM' && (
                                <span className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 flex-shrink-0 bg-yellow-100 text-yellow-800 border-2 border-yellow-300">
                                  <Star className="w-3 h-3 fill-yellow-800" />
                                  Premium
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between">
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold">Üye Sayısı:</span>
                            <span className="font-bold text-gray-900">{org._count.members}</span>
                          </div>
                          {isAdmin && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-semibold text-gray-600">Plan:</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
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
                            </div>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold flex items-center justify-center gap-2"
                        >
                          Detayları Gör
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>

              {/* Mobile Carousel View */}
              <div className="md:hidden relative mt-6">
                <div 
                  ref={carouselRef}
                  className="overflow-hidden relative"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div 
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {organizations.map((org) => (
                      <div key={org.id} className="min-w-full px-2">
                        <Card className="border-2 hover:border-green-400 hover:shadow-xl transition-all bg-white h-full flex flex-col relative group">
                          {/* Pending Requests Badge (Admin) */}
                          {isAdmin && (org.pendingRequestsCount ?? 0) > 0 && (
                            <div className="absolute top-2 left-2 z-20">
                              <div className="relative">
                                <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                                <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg border-2 border-white animate-pulse">
                                  <Bell className="w-3.5 h-3.5" />
                                  <span className="text-xs font-bold">{org.pendingRequestsCount}</span>
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Pending Match Attendance Badge (Player) */}
                          {!isAdmin && (org.pendingMatchAttendanceCount ?? 0) > 0 && (
                            <div className="absolute top-2 right-2 z-20">
                              <div className="relative">
                                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                                <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg border-2 border-white animate-pulse">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span className="text-xs font-bold">{org.pendingMatchAttendanceCount}</span>
                                </div>
                              </div>
                            </div>
                          )}
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-white/90 hover:bg-red-50 hover:text-red-600 text-gray-500 border border-gray-200 shadow-sm"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleDeleteClick(org)
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                          <Link href={`/organization/${org.id}`} className="flex-1 flex flex-col">
                            <CardHeader>
                              <div className="flex items-start gap-3 mb-2">
                                {/* Avatar */}
                                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                                  {org.avatarUrl ? (
                                    <img 
                                      src={org.avatarUrl} 
                                      alt={org.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Building2 className="w-8 h-8 text-green-600" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                      <CardTitle className="text-xl mb-1">{org.name}</CardTitle>
                                      <CardDescription className="line-clamp-2">
                                        {org.description || 'Açıklama yok'}
                                      </CardDescription>
                                    </div>
                                    {isAdmin && org.owner.plan === 'PREMIUM' && (
                                      <span className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 flex-shrink-0 bg-yellow-100 text-yellow-800 border-2 border-yellow-300">
                                        <Star className="w-3 h-3 fill-yellow-800" />
                                        Premium
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-between">
                              <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Users className="w-4 h-4 text-gray-500" />
                                  <span className="font-semibold">Üye Sayısı:</span>
                                  <span className="font-bold text-gray-900">{org._count.members}</span>
                                </div>
                                {isAdmin && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="font-semibold text-gray-600">Plan:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
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
                                  </div>
                                )}
                              </div>
                              <Button 
                                variant="outline" 
                                className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold flex items-center justify-center gap-2"
                              >
                                Detayları Gör
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </CardContent>
                          </Link>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Arrows */}
                {organizations.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 h-10 w-10 rounded-full bg-white/90 border-2 border-gray-300 shadow-lg hover:bg-white hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handlePrevSlide}
                      disabled={currentSlide === 0}
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 h-10 w-10 rounded-full bg-white/90 border-2 border-gray-300 shadow-lg hover:bg-white hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleNextSlide}
                      disabled={currentSlide === organizations.length - 1}
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </Button>
                  </>
                )}

                {/* Slide Indicators */}
                {organizations.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {organizations.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentSlide
                            ? 'w-8 bg-green-500'
                            : 'w-2 bg-gray-300'
                        }`}
                        aria-label={`Slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteModalOpen} onOpenChange={(open) => {
          if (!deleting) {
            setDeleteModalOpen(open)
            if (!open) {
              setOrganizationToDelete(null)
            }
          }
        }}>
          <DialogContent className="max-w-md border-2 border-red-200">
            <DialogHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold text-gray-900 mb-1">
                    Organizasyonu Sil
                  </DialogTitle>
                  <DialogDescription className="text-base text-gray-600">
                    Bu işlem geri alınamaz
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <div className="py-4 px-6 space-y-4">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold text-gray-900">{organizationToDelete?.name}</span> organizasyonunu silmek istediğinizden emin misiniz?
                </p>
                <div className="flex items-start gap-2 mt-3">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">
                    Organizasyon ile birlikte tüm maçlar, üyeler ve veriler kalıcı olarak silinecektir.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-3 sm:gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteModalOpen(false)
                  setOrganizationToDelete(null)
                }}
                disabled={deleting}
                className="border-2 border-gray-300 hover:border-gray-400 flex-1 sm:flex-none"
              >
                <X className="w-4 h-4 mr-2" />
                İptal
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg flex-1 sm:flex-none"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Siliniyor...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Sil
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Quick Actions for Admin */}
        {isAdmin && organizations.length > 0 && (
          <Card className="mt-8 border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                Hızlı İşlemler
              </CardTitle>
              <CardDescription>
                Sık kullanılan işlemler için hızlı erişim
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/organization/new">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2 border-2 hover:border-green-400 hover:bg-green-50 transition-all">
                    <Plus className="w-6 h-6 text-green-600" />
                    <span className="font-semibold">Yeni Organizasyon</span>
                  </Button>
                </Link>
                {adminPlan === 'FREE' && (
                  <Link href="/payment">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2 border-2 border-yellow-400 hover:border-yellow-500 bg-yellow-50 hover:bg-yellow-100 transition-all">
                      <Gem className="w-6 h-6 text-yellow-600" />
                      <span className="font-semibold">Premium Ol</span>
                    </Button>
                  </Link>
                )}
                <Link href="/plans">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2 border-2 hover:border-blue-400 hover:bg-blue-50 transition-all">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <span className="font-semibold">Planları Görüntüle</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

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
                {user && <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>}
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
