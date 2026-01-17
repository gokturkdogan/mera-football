'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Navbar from '@/components/Navbar'
import {
  Building2,
  Calendar,
  MapPin,
  Info,
  Crown,
  ExternalLink,
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  DollarSign,
  Home,
  TreePine
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'

interface Facility {
  id: string
  name: string
  location: string
  matchPrice: number | null
  isIndoor: boolean | null
  fieldType: string | null
  createdAt: string
  organization: {
    id: string
    name: string
    owner: {
      id: string
      name: string
    }
  }
}

export default function FacilityDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [facility, setFacility] = useState<Facility | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    matchPrice: '',
    isIndoor: null as boolean | null,
    fieldType: null as 'REAL_GRASS' | 'SYNTHETIC_GRASS' | null,
  })
  const { showToast } = useToast()

  useEffect(() => {
    if (params.id) {
      fetchFacility()
      fetchUser()
    }
  }, [params.id])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchFacility = async () => {
    try {
      const res = await fetch(`/api/facilities/${params.id}`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setFacility(data.facility)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching facility:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  // Extract map embed URL from iframe HTML or use directly if it's already a URL
  const getMapEmbedUrl = (locationData: string | null | undefined): string => {
    if (!locationData) {
      return ''
    }
    
    // If it's a full iframe HTML, extract the src URL
    if (locationData.includes('<iframe')) {
      const srcMatch = locationData.match(/src=["']([^"']+)["']/i)
      if (srcMatch && srcMatch[1]) {
        return srcMatch[1]
      }
    }
    
    // If it's already a Google Maps embed URL (contains pb= parameter), use it directly
    if (locationData.includes('google.com/maps/embed') && locationData.includes('pb=')) {
      return locationData
    }
    
    // If it's a plain URL, try to convert to embed format
    try {
      if (locationData.includes('google.com/maps')) {
        const url = new URL(locationData)
        
        // Check if ftid (feature ID) exists
        if (url.searchParams.has('ftid')) {
          const ftid = url.searchParams.get('ftid')
          return `https://www.google.com/maps?ftid=${ftid}&output=embed&hl=tr`
        }
        
        // If q parameter exists
        if (url.searchParams.has('q')) {
          const query = url.searchParams.get('q')
          if (query) {
            if (/^-?\d+\.?\d*,-?\d+\.?\d*$/.test(query)) {
              const [lat, lng] = query.split(',')
              return `https://www.google.com/maps?q=${lat},${lng}&output=embed&hl=tr&z=15`
            }
            return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed&hl=tr&z=15`
          }
        }
        
        // Add output=embed to existing URL
        const separator = locationData.includes('?') ? '&' : '?'
        return `${locationData}${separator}output=embed`
      }
      
      // Return as is if we can't parse it
      return locationData
    } catch (error) {
      // If parsing fails, return the original data
      return locationData
    }
  }

  const isOwner = user?.id === facility?.organization.owner.id

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/facilities/${params.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (res.ok) {
        const data = await res.json()
        showToast(
          data.deletedMatchesCount > 0
            ? `Tesis silindi. ${data.deletedMatchesCount} maç verisi de silindi.`
            : 'Tesis başarıyla silindi',
          'success'
        )
        router.push(`/organization/${facility?.organization.id}`)
      } else {
        const errorData = await res.json()
        showToast(errorData.error || 'Tesis silinirken bir hata oluştu', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'error')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const handleEdit = async () => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/facilities/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: editForm.name,
          location: editForm.location,
          matchPrice: editForm.matchPrice ? parseFloat(editForm.matchPrice) : null,
          isIndoor: editForm.isIndoor,
          fieldType: editForm.fieldType,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setFacility(data.facility)
        showToast('Tesis başarıyla güncellendi', 'success')
        setShowEditModal(false)
      } else {
        const errorData = await res.json()
        showToast(errorData.error || 'Tesis güncellenirken bir hata oluştu', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'error')
    } finally {
      setUpdating(false)
    }
  }

  const openEditModal = () => {
    if (facility) {
      setEditForm({
        name: facility.name,
        location: facility.location,
        matchPrice: facility.matchPrice?.toString() || '',
        isIndoor: facility.isIndoor ?? null,
        fieldType: (facility.fieldType as 'REAL_GRASS' | 'SYNTHETIC_GRASS') || null,
      })
      setShowEditModal(true)
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

  if (!facility) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">Tesis bulunamadı</p>
              <Button onClick={() => router.push('/dashboard')} className="mt-4">
                Ana Sayfaya Dön
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
      <section className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
              <Building2 className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-black mb-2">{facility.name}</h1>
              <p className="text-xl opacity-90 mb-3">
                {facility.organization.name}
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(facility.createdAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                {isOwner && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={openEditModal}
                      variant="outline"
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Düzenle
                    </Button>
                    <Button
                      onClick={() => setShowDeleteModal(true)}
                      variant="outline"
                      className="bg-red-500/20 border-red-300/30 text-white hover:bg-red-500/30 backdrop-blur-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Sil
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Harita */}
          <Card className="shadow-xl border-2 border-blue-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <MapPin className="w-6 h-6 text-blue-600" />
                Konum
              </CardTitle>
              <CardDescription className="text-base">
                Tesis konumunu haritada görüntüleyin
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="w-full h-96 rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-100">
                {facility?.location ? (
                  <iframe
                    src={getMapEmbedUrl(facility.location)}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                    onError={(e) => {
                      console.error('Iframe load error:', e)
                    }}
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Harita yükleniyor...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bilgiler */}
          <Card className="shadow-xl border-2 border-green-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Info className="w-6 h-6 text-green-600" />
                Tesis Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                  <Label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    Tesis Adı
                  </Label>
                  <p className="text-lg font-bold text-gray-900">{facility.name}</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                  <Label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    Organizasyon
                  </Label>
                  <Link 
                    href={`/organization/${facility.organization.id}`}
                    className="text-lg font-bold text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-1"
                  >
                    {facility.organization.name}
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <Label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Yönetici
                  </Label>
                  <p className="text-sm font-bold text-gray-900">{facility.organization.owner.name}</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                  <Label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Kayıt Tarihi
                  </Label>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(facility.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200">
                  <Label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Maç Ücreti
                  </Label>
                  <p className="text-sm font-bold text-gray-900">
                    {facility.matchPrice ? `${facility.matchPrice.toFixed(2)} TL` : 'Belirtilmedi'}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-200">
                  <Label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
                    <Home className="w-3 h-3" />
                    Saha Tipi
                  </Label>
                  <p className="text-sm font-bold text-gray-900">
                    {facility.isIndoor === true 
                      ? 'Kapalı Saha' 
                      : facility.isIndoor === false 
                      ? 'Açık Saha' 
                      : 'Belirtilmedi'}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <Label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
                    <TreePine className="w-3 h-3" />
                    Çim Tipi
                  </Label>
                  <p className="text-sm font-bold text-gray-900">
                    {facility.fieldType === 'REAL_GRASS' 
                      ? 'Gerçek Çim' 
                      : facility.fieldType === 'SYNTHETIC_GRASS' 
                      ? 'Sentetik Çim' 
                      : 'Belirtilmedi'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button 
            onClick={() => router.push(`/organization/${facility.organization.id}`)} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Organizasyon Sayfasına Dön
          </Button>
        </div>
      </div>

      {/* Silme Onay Modalı */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Trash2 className="w-6 h-6 text-red-600" />
              Tesis Sil
            </DialogTitle>
            <DialogDescription className="text-base">
              Bu işlem geri alınamaz
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4 py-4 px-6">
            <p className="text-gray-700">
              <strong>{facility?.name}</strong> tesisini silmek istediğinize emin misiniz?
            </p>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-900 font-semibold">
                ⚠️ Önemli Uyarı
              </p>
              <p className="text-sm text-yellow-800 mt-2">
                Bu tesiste oynanmış bir maç var ise o maçın verileri de silinecektir.
              </p>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              İptal
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
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

      {/* Düzenleme Modalı */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Edit className="w-6 h-6 text-blue-600" />
              Tesis Düzenle
            </DialogTitle>
            <DialogDescription className="text-base">
              Tesis bilgilerini güncelleyin
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4 py-4 px-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Tesis Adı <span className="text-red-500">*</span>
              </label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Tesis adı"
                required
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Konum (Google Maps Embed HTML) <span className="text-red-500">*</span>
              </label>
              <Input
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                placeholder='<iframe src="https://www.google.com/maps/embed?pb'
                required
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Maç Ücreti (TL)
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={editForm.matchPrice}
                onChange={(e) => setEditForm({ ...editForm, matchPrice: e.target.value })}
                placeholder="Örn: 500"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Saha Tipi
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, isIndoor: false })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    editForm.isIndoor === false
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      editForm.isIndoor === false
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {editForm.isIndoor === false && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className={`font-medium ${
                      editForm.isIndoor === false ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      Açık Saha
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, isIndoor: true })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    editForm.isIndoor === true
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      editForm.isIndoor === true
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {editForm.isIndoor === true && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className={`font-medium ${
                      editForm.isIndoor === true ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      Kapalı Saha
                    </span>
                  </div>
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Çim Tipi
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, fieldType: 'REAL_GRASS' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    editForm.fieldType === 'REAL_GRASS'
                      ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                      : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      editForm.fieldType === 'REAL_GRASS'
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {editForm.fieldType === 'REAL_GRASS' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className={`font-medium ${
                      editForm.fieldType === 'REAL_GRASS' ? 'text-green-700' : 'text-gray-700'
                    }`}>
                      Gerçek Çim
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, fieldType: 'SYNTHETIC_GRASS' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    editForm.fieldType === 'SYNTHETIC_GRASS'
                      ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                      : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      editForm.fieldType === 'SYNTHETIC_GRASS'
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {editForm.fieldType === 'SYNTHETIC_GRASS' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className={`font-medium ${
                      editForm.fieldType === 'SYNTHETIC_GRASS' ? 'text-green-700' : 'text-gray-700'
                    }`}>
                      Sentetik Çim
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              disabled={updating}
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              İptal
            </Button>
            <Button
              onClick={handleEdit}
              disabled={updating || !editForm.name || !editForm.location}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Güncelleniyor...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Güncelle
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

