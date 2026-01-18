'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/Navbar'
import { useToast } from '@/components/ui/toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog'
import { 
  User, 
  Shield, 
  Mail, 
  Phone, 
  Target, 
  Footprints, 
  Ruler, 
  Weight, 
  Calendar,
  Building2,
  Crown,
  Star,
  Users,
  Edit,
  CheckCircle2,
  FileText,
  Trophy,
  X,
  Save,
  Circle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Move,
  Plus,
  Upload,
  Loader2
} from 'lucide-react'

interface Organization {
  id: string
  name: string
  owner: {
    plan: string
  }
  _count: {
    members: number
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [formData, setFormData] = useState({
    name: '',
    avatarUrl: '' as string | null,
    phone: '',
    position: '' as string | null,
    strongFoot: '' as string | null,
    height: null as number | null,
    weight: null as number | null,
    age: null as number | null,
    showPhone: false,
    showPosition: false,
    showStrongFoot: false,
    showHeight: false,
    showWeight: false,
    showAge: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [deletingAvatar, setDeletingAvatar] = useState(false)
  const [showCropModal, setShowCropModal] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [showRoleChangeModal, setShowRoleChangeModal] = useState(false)
  const [changingRole, setChangingRole] = useState(false)
  const profileInfoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchUser()
    fetchOrganizations()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (!res.ok) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setUser(data.user)
      setFormData({
        name: data.user.name || '',
        avatarUrl: data.user.avatarUrl || null,
        phone: data.user.phone || '',
        position: data.user.position || null,
        strongFoot: data.user.strongFoot || null,
        height: data.user.height || null,
        weight: data.user.weight || null,
        age: data.user.age || null,
        showPhone: data.user.showPhone || false,
        showPosition: data.user.showPosition || false,
        showStrongFoot: data.user.showStrongFoot || false,
        showHeight: data.user.showHeight || false,
        showWeight: data.user.showWeight || false,
        showAge: data.user.showAge || false,
      })
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchOrganizations = async () => {
    try {
      const res = await fetch('/api/organizations', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setOrganizations(data.organizations || [])
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        showToast('Profil başarıyla güncellendi', 'success')
        fetchUser()
        setShowEditForm(false)
        // Sayfayı en üste scroll et
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const data = await res.json()
        showToast(data.error || 'Profil güncellenirken bir hata oluştu', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', error => reject(error))
      image.src = url
    })

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<Blob> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

    // Round crop için boyutları ayarla
    const size = Math.min(pixelCrop.width, pixelCrop.height)
    canvas.width = size
    canvas.height = size

    // Yuvarlak mask oluştur
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
    ctx.clip()

    // Görseli çiz
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      size,
      size
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Canvas to blob conversion failed'))
        }
      }, 'image/jpeg', 0.95)
    })
  }

  const handleCropComplete = async () => {
    if (!imageSrc || !croppedAreaPixels || !selectedFile || uploadingAvatar) return

    setUploadingAvatar(true)
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
      const file = new File([croppedImage], selectedFile.name, { type: 'image/jpeg' })

      // Cloudinary'e yükle
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const uploadRes = await fetch('/api/upload/avatar', {
        method: 'POST',
        credentials: 'include',
        body: uploadFormData,
      })

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json()
        showToast(errorData.error || 'Görsel yüklenirken bir hata oluştu', 'error')
        setUploadingAvatar(false)
        return
      }

      const { url } = await uploadRes.json()

      // Form data'yı güncelle
      setFormData({ ...formData, avatarUrl: url })
      // User state'i güncelle (preview için)
      setUser({ ...user, avatarUrl: url })
      
      // API'ye kaydet
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...formData, avatarUrl: url }),
      })
      
      if (res.ok) {
        showToast('Profil fotoğrafı güncellendi', 'success')
        fetchUser()
        setShowCropModal(false)
        setImageSrc(null)
        setSelectedFile(null)
        setShowAvatarModal(false)
      } else {
        showToast('Profil fotoğrafı güncellenirken bir hata oluştu', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'error')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleFileSelect = (file: File) => {
    // Dosya formatı kontrolü
    if (!file.type.startsWith('image/')) {
      showToast('Lütfen geçerli bir görsel dosyası seçin', 'error')
      return
    }
    
    // Dosya boyutu kontrolü (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Dosya boyutu 5MB\'dan küçük olmalıdır', 'error')
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setImageSrc(reader.result as string)
      setShowCropModal(true)
    })
    reader.readAsDataURL(file)
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

  const isAdmin = user?.role === 'ADMIN'
  const adminPlan = user?.plan || 'FREE'

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!user) return 0
    const optionalFields = ['avatarUrl', 'phone', 'position', 'strongFoot', 'height', 'weight', 'age']
    const filledFields = optionalFields.filter(field => {
      if (field === 'avatarUrl') {
        return user[field] !== null && user[field] !== undefined && user[field] !== ''
      }
      return user[field] !== null && user[field] !== undefined && user[field] !== ''
    })
    return Math.round((filledFields.length / optionalFields.length) * 100)
  }

  const profileCompletion = calculateProfileCompletion()
  const isProfileComplete = profileCompletion === 100

  const handleCompleteProfile = () => {
    setShowEditForm(true)
    setTimeout(() => {
      profileInfoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleChangeRole = async () => {
    if (changingRole) return
    setChangingRole(true)
    try {
      const newRole = isAdmin ? 'PLAYER' : 'ADMIN'
      const res = await fetch('/api/users/change-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newRole }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Rol başarıyla değiştirildi', 'success')
        setShowRoleChangeModal(false)
        // Sayfayı yenile
        router.refresh()
        fetchUser()
        fetchOrganizations()
      } else {
        showToast(data.error || 'Rol değiştirme başarısız', 'error')
      }
    } catch (error) {
      showToast('Bir hata oluştu', 'error')
    } finally {
      setChangingRole(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
            {/* Left Side - Profile Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full min-w-0">
              {/* Avatar */}
              <div className="relative group flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30 shadow-xl overflow-hidden">
                  {user?.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                {/* Hover Overlay */}
                <div 
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => {
                    if (user?.avatarUrl) {
                      // Görsel varsa modal aç
                      setShowAvatarModal(true)
                    } else {
                      // Görsel yoksa direkt file input'u aç
                      document.getElementById('avatar-upload-direct')?.click()
                    }
                  }}
                >
                  {user?.avatarUrl ? (
                    <Edit className="w-8 h-8 text-white" />
                  ) : (
                    <Plus className="w-8 h-8 text-white" />
                  )}
                </div>
                
                {/* Direct Upload Input (görsel yoksa kullanılır) */}
                <input
                  type="file"
                  accept="image/*"
                  id="avatar-upload-direct"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleFileSelect(file)
                    }
                  }}
                />
              </div>
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 break-words">{user?.name}</h1>
                <p className="text-base sm:text-lg md:text-xl opacity-90 mb-3 flex items-center gap-2 min-w-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </p>
              
              {/* Avatar Modal */}
              <Dialog 
                open={showAvatarModal} 
                onOpenChange={(open) => {
                  // Loader aktifken modal'ı kapatma
                  if (!open && deletingAvatar) return
                  setShowAvatarModal(open)
                }}
                disabled={deletingAvatar}
              >
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Profil Fotoğrafı Düzenle</DialogTitle>
                    <DialogDescription>
                      Profil fotoğrafınızı değiştirebilir veya kaldırabilirsiniz
                    </DialogDescription>
                  </DialogHeader>
                  <DialogBody className="space-y-4">
                    {/* Mevcut Görsel */}
                    {user?.avatarUrl && (
                      <div className="flex justify-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                          <img 
                            src={user.avatarUrl} 
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Seçenekler */}
                    <div className="space-y-3">
                      {user?.avatarUrl ? (
                        <>
                          <Button
                            variant="outline"
                            className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                            onClick={async () => {
                              setDeletingAvatar(true)
                              try {
                                const res = await fetch('/api/upload/avatar/delete', {
                                  method: 'DELETE',
                                  credentials: 'include',
                                })
                                
                                if (res.ok) {
                                  showToast('Profil fotoğrafı kaldırıldı', 'success')
                                  fetchUser()
                                  setShowAvatarModal(false)
                                } else {
                                  const errorData = await res.json()
                                  showToast(errorData.error || 'Görsel kaldırılırken bir hata oluştu', 'error')
                                }
                              } catch (error) {
                                showToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'error')
                              } finally {
                                setDeletingAvatar(false)
                              }
                            }}
                            disabled={deletingAvatar}
                          >
                            {deletingAvatar ? (
                              <>
                                <Circle className="w-4 h-4 animate-spin mr-2" />
                                Kaldırılıyor...
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4 mr-2" />
                                Görseli Kaldır
                              </>
                            )}
                          </Button>
                          <Button
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => {
                              // File input'u tetikle (modal kapanmadan önce)
                              document.getElementById('avatar-upload-modal')?.click()
                            }}
                            disabled={deletingAvatar}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Yeni Görsel Ekle
                          </Button>
                        </>
                      ) : (
                        <Button
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => {
                            // File input'u tetikle (modal kapanmadan önce)
                            document.getElementById('avatar-upload-modal')?.click()
                          }}
                          disabled={deletingAvatar}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Görsel Ekle
                        </Button>
                      )}
                    </div>
                    
                    {/* Hidden File Input */}
                    <input
                      type="file"
                      accept="image/*"
                      id="avatar-upload-modal"
                      className="hidden"
                      disabled={deletingAvatar}
                      onChange={(e) => {
                        if (deletingAvatar) return
                        const file = e.target.files?.[0]
                        if (file) {
                          // Modal'ı kapat ve crop modal'ını aç
                          setShowAvatarModal(false)
                          handleFileSelect(file)
                        }
                        // Input'u sıfırla (aynı dosyayı tekrar seçebilmek için)
                        e.target.value = ''
                      }}
                    />
                  </DialogBody>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setShowAvatarModal(false)}
                      disabled={deletingAvatar}
                    >
                      İptal
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* Crop Modal */}
              <Dialog 
                open={showCropModal} 
                onOpenChange={(open) => {
                  // Loader aktifken modal'ı kapatma
                  if (!open && uploadingAvatar) return
                  setShowCropModal(open)
                }}
                disabled={uploadingAvatar}
              >
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Profil Fotoğrafını Kırp</DialogTitle>
                    <DialogDescription>
                      Görseli istediğiniz şekilde kırpın ve onaylayın
                    </DialogDescription>
                  </DialogHeader>
                  <DialogBody className="space-y-4">
                    {imageSrc && (
                      <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden">
                        <Cropper
                          image={imageSrc}
                          crop={crop}
                          zoom={zoom}
                          aspect={1}
                          onCropChange={uploadingAvatar ? () => {} : setCrop}
                          onZoomChange={uploadingAvatar ? () => {} : setZoom}
                          onCropComplete={onCropComplete}
                          cropShape="round"
                          showGrid={false}
                        />
                        {uploadingAvatar && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                            <div className="text-center">
                              <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
                              <p className="text-white text-sm">Yükleniyor...</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Zoom Control */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Yakınlaştır</Label>
                      <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        disabled={uploadingAvatar}
                        className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </DialogBody>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        setShowCropModal(false)
                        setImageSrc(null)
                        setSelectedFile(null)
                      }}
                      disabled={uploadingAvatar}
                    >
                      İptal
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleCropComplete}
                      disabled={uploadingAvatar}
                    >
                      {uploadingAvatar ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Yükleniyor...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Onayla ve Yükle
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                      isAdmin 
                        ? 'bg-yellow-400 text-yellow-900' 
                        : 'bg-blue-400 text-blue-900'
                    }`}>
                      {isAdmin ? (
                        <>
                          <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>Yönetici</span>
                        </>
                      ) : (
                        <>
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>Oyuncu</span>
                        </>
                      )}
                    </span>
                    <Button
                      onClick={() => setShowRoleChangeModal(true)}
                      size="sm"
                      variant="outline"
                      className="border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap"
                    >
                      {isAdmin ? (
                        <>
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          <span className="hidden sm:inline">Oyuncu Rolüne Geç</span>
                          <span className="sm:hidden">Oyuncu</span>
                        </>
                      ) : (
                        <>
                          <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          <span className="hidden sm:inline">Yönetici Rolüne Geç</span>
                          <span className="sm:hidden">Yönetici</span>
                        </>
                      )}
                    </Button>
                  </div>
                  {user?.phone && (
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 rounded-full text-xs sm:text-sm backdrop-blur-sm flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate max-w-[150px] sm:max-w-none">{user.phone}</span>
                    </span>
                  )}
                  {user?.position && (
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 rounded-full text-xs sm:text-sm backdrop-blur-sm flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                      <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>{user.position}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Plan Status (only for admins) */}
            {isAdmin && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border-2 border-white/20 p-3 sm:p-4 md:p-6 shadow-2xl w-full max-w-full overflow-hidden">
                <div className="relative">
                  {/* Premium için animasyonlu arka plan */}
                  {adminPlan === 'PREMIUM' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-amber-400/20 rounded-2xl animate-pulse"></div>
                  )}
                  
                  <div className="relative p-2 sm:p-3 md:p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                      {/* Icon Container */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center shadow-xl relative overflow-hidden ${
                          adminPlan === 'PREMIUM' 
                            ? 'bg-gradient-to-br from-yellow-500 via-orange-500 to-amber-600' 
                            : 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600'
                        }`}>
                          {/* Shine effect for Premium */}
                          {adminPlan === 'PREMIUM' && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                          )}
                          {adminPlan === 'PREMIUM' ? (
                            <Star className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white fill-white relative z-10 drop-shadow-lg" />
                          ) : (
                            <User className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white relative z-10 drop-shadow-lg" />
                          )}
                        </div>
                        {/* Premium için ekstra glow efekti */}
                        {adminPlan === 'PREMIUM' && (
                          <div className="absolute -inset-1 bg-yellow-400/30 rounded-xl blur-lg animate-pulse"></div>
                        )}
                      </div>

                      {/* Plan Info */}
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                          <span className="text-[10px] sm:text-xs font-semibold text-white/80 uppercase tracking-wide">
                            Plan Durumu
                          </span>
                          {adminPlan === 'PREMIUM' && (
                            <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-yellow-300/30 rounded-full border border-yellow-300/50">
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-yellow-300 rounded-full animate-pulse"></div>
                              <span className="text-[10px] sm:text-xs font-bold text-white">Aktif</span>
                            </div>
                          )}
                        </div>
                        <h3 className={`text-lg sm:text-xl md:text-2xl font-black break-words ${
                          adminPlan === 'PREMIUM' 
                            ? 'bg-gradient-to-r from-yellow-300 via-orange-300 to-amber-300 bg-clip-text text-transparent' 
                            : 'text-white'
                        }`}>
                          {adminPlan === 'PREMIUM' ? 'Premium' : 'Ücretsiz'}
                        </h3>
                        <p className="text-[11px] sm:text-xs md:text-sm text-white/80 mt-0.5 sm:mt-1 break-words">
                          {adminPlan === 'PREMIUM' 
                            ? 'Sınırsız organizasyon ve maç'
                            : 'Sınırlı organizasyon ve maç'}
                        </p>
                      </div>
                    </div>

                    {/* Premium için özel özellikler listesi */}
                    {adminPlan === 'PREMIUM' && (
                      <div className="mt-2 sm:mt-3 md:mt-4 pt-2 sm:pt-3 md:pt-4 border-t border-white/20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-300 flex-shrink-0" />
                            <span className="text-[11px] sm:text-xs text-white/90 font-medium break-words">Sınırsız Org.</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-300 flex-shrink-0" />
                            <span className="text-[11px] sm:text-xs text-white/90 font-medium break-words">Sınırsız Maç</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-300 flex-shrink-0" />
                            <span className="text-[11px] sm:text-xs text-white/90 font-medium break-words">Öncelikli Destek</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-300 flex-shrink-0" />
                            <span className="text-[11px] sm:text-xs text-white/90 font-medium break-words">Gelişmiş Özellikler</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Free plan için yükselt butonu */}
                    {adminPlan === 'FREE' && (
                      <div className="mt-2 sm:mt-3 md:mt-4">
                        <Link href="/plans" className="block w-full">
                          <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 backdrop-blur-sm transition-all text-xs sm:text-sm md:text-base py-2 sm:py-2.5">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                            <span className="whitespace-nowrap">Premium'a Yükselt</span>
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Profile Completion Banner */}
      {!isProfileComplete && (
        <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border-b-2 border-yellow-400">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Profilinizi Tamamlayın</h3>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      profileCompletion >= 80 ? 'bg-green-500' :
                      profileCompletion >= 50 ? 'bg-yellow-500' :
                      'bg-orange-500'
                    }`}
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-700">
                  Profil tamamlanma oranı: <span className="font-bold">{profileCompletion}%</span>
                </p>
              </div>
              <Button
                onClick={handleCompleteProfile}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-6 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Tamamla
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Info Card */}
          <Card ref={profileInfoRef} className="border-2 hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <User className="w-6 h-6 text-green-600" />
                  Profil Bilgileri
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditForm(!showEditForm)}
                  className="flex items-center gap-2"
                >
                  {showEditForm ? (
                    <>
                      <X className="w-4 h-4" />
                      İptal
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      Düzenle
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!showEditForm ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <Label className="text-xs text-gray-600 uppercase flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <Label className="text-xs text-gray-600 uppercase flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      Ad Soyad
                    </Label>
                    <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                  </div>
                  {user?.phone && (
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <Label className="text-xs text-gray-600 uppercase flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4" />
                        Telefon
                      </Label>
                      <p className="text-lg font-semibold text-gray-900">{user.phone}</p>
                    </div>
                  )}
                  {user?.position && (
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
                      <Label className="text-xs text-gray-600 uppercase flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4" />
                        Tercih Edilen Mevki
                      </Label>
                      <p className="text-lg font-semibold text-gray-900">{user.position}</p>
                    </div>
                  )}
                  {user?.strongFoot && (
                    <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                      <Label className="text-xs text-gray-600 uppercase flex items-center gap-2 mb-2">
                        <Footprints className="w-4 h-4" />
                        Güçlü Ayak
                      </Label>
                      <p className="text-lg font-semibold text-gray-900">{user.strongFoot}</p>
                    </div>
                  )}
                  {(user?.height || user?.weight || user?.age) && (
                    <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                      <Label className="text-xs text-gray-600 uppercase flex items-center gap-2 mb-3">
                        Fiziksel Özellikler
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {user?.height && (
                          <div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                              <Ruler className="w-3 h-3" />
                              Boy
                            </div>
                            <p className="text-base font-semibold text-gray-900">{user.height} cm</p>
                          </div>
                        )}
                        {user?.weight && (
                          <div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                              <Weight className="w-3 h-3" />
                              Kilo
                            </div>
                            <p className="text-base font-semibold text-gray-900">{user.weight} kg</p>
                          </div>
                        )}
                        {user?.age && (
                          <div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                              <Calendar className="w-3 h-3" />
                              Yaş
                            </div>
                            <p className="text-base font-semibold text-gray-900">{user.age}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                    <Label className="text-xs text-gray-600 uppercase flex items-center gap-2 mb-2">
                      {isAdmin ? <Crown className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      Rol
                    </Label>
                    <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      {isAdmin ? (
                        <>
                          <Crown className="w-5 h-5 text-yellow-600" />
                          Yönetici
                        </>
                      ) : (
                        <>
                          <User className="w-5 h-5 text-blue-600" />
                          Oyuncu
                        </>
                      )}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                    <Label className="text-xs text-gray-600 uppercase flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4" />
                      Kayıt Tarihi
                    </Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(user?.createdAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email - Disabled */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold">
                      <Mail className="w-4 h-4 text-gray-500" />
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-gray-100 pl-10"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Email değiştirilemez</p>
                  </div>

                  {/* Ad Soyad */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold">
                      <User className="w-4 h-4 text-gray-500" />
                      Ad Soyad
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Telefon */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold">
                        <Phone className="w-4 h-4 text-gray-500" />
                        Telefon (Opsiyonel)
                      </Label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.showPhone}
                          onChange={(e) => setFormData({ ...formData, showPhone: e.target.checked })}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          formData.showPhone
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-600'
                            : 'bg-white border-gray-300 group-hover:border-green-400'
                        }`}>
                          {formData.showPhone && (
                            <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </div>
                        <span className="text-xs text-gray-600">Listelemede göster</span>
                      </label>
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0555 123 45 67"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Tercih Edilen Mevki - Radio Buttons */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2 text-sm font-semibold">
                        <Target className="w-4 h-4 text-gray-500" />
                        Tercih Edilen Mevki (Opsiyonel)
                      </Label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.showPosition}
                          onChange={(e) => setFormData({ ...formData, showPosition: e.target.checked })}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          formData.showPosition
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-600'
                            : 'bg-white border-gray-300 group-hover:border-green-400'
                        }`}>
                          {formData.showPosition && (
                            <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </div>
                        <span className="text-xs text-gray-600">Listelemede göster</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'KALECI', label: 'Kaleci', icon: Shield },
                        { value: 'DEFANS', label: 'Defans', icon: Shield },
                        { value: 'ORTASAHA', label: 'Ortasaha', icon: Users },
                        { value: 'FORVET', label: 'Forvet', icon: Target }
                      ].map((option) => {
                        const Icon = option.icon
                        const isSelected = formData.position === option.value
                        return (
                          <label
                            key={option.value}
                            className={`
                              relative flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
                              ${isSelected 
                                ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md' 
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                              }
                            `}
                          >
                            <input
                              type="radio"
                              name="position"
                              value={option.value}
                              checked={formData.position === option.value}
                              onChange={(e) => setFormData({ ...formData, position: e.target.value || null })}
                              className="sr-only"
                            />
                            <div className={`
                              w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                              ${isSelected 
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' 
                                : 'bg-gray-100 text-gray-400'
                              }
                            `}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <span className={`text-sm font-medium ${isSelected ? 'text-green-700' : 'text-gray-700'}`}>
                              {option.label}
                            </span>
                            {isSelected && (
                              <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-green-500" />
                            )}
                          </label>
                        )
                      })}
                    </div>
                    {formData.position && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, position: null })}
                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Seçimi temizle
                      </button>
                    )}
                  </div>

                  {/* Güçlü Ayak - Radio Buttons */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2 text-sm font-semibold">
                        <Footprints className="w-4 h-4 text-gray-500" />
                        Güçlü Ayak (Opsiyonel)
                      </Label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.showStrongFoot}
                          onChange={(e) => setFormData({ ...formData, showStrongFoot: e.target.checked })}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          formData.showStrongFoot
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-600'
                            : 'bg-white border-gray-300 group-hover:border-green-400'
                        }`}>
                          {formData.showStrongFoot && (
                            <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </div>
                        <span className="text-xs text-gray-600">Listelemede göster</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'SOL', label: 'Sol', icon: ArrowLeft },
                        { value: 'SAĞ', label: 'Sağ', icon: ArrowRight },
                        { value: 'İKİSİ', label: 'İkisi', icon: Move }
                      ].map((option) => {
                        const Icon = option.icon
                        const isSelected = formData.strongFoot === option.value
                        return (
                          <label
                            key={option.value}
                            className={`
                              relative flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
                              ${isSelected 
                                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md' 
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                              }
                            `}
                          >
                            <input
                              type="radio"
                              name="strongFoot"
                              value={option.value}
                              checked={formData.strongFoot === option.value}
                              onChange={(e) => setFormData({ ...formData, strongFoot: e.target.value || null })}
                              className="sr-only"
                            />
                            <div className={`
                              w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                              ${isSelected 
                                ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white scale-110' 
                                : 'bg-gray-100 text-gray-400'
                              }
                            `}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                              {option.label}
                            </span>
                            {isSelected && (
                              <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-blue-500" />
                            )}
                          </label>
                        )
                      })}
                    </div>
                    {formData.strongFoot && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, strongFoot: null })}
                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Seçimi temizle
                      </button>
                    )}
                  </div>

                  {/* Fiziksel Özellikler */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2 text-sm font-semibold">
                        <Ruler className="w-4 h-4 text-gray-500" />
                        Fiziksel Özellikler (Opsiyonel)
                      </Label>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="height" className="text-xs text-gray-600 flex items-center gap-1">
                            <Ruler className="w-3 h-3" />
                            Boy (cm)
                          </Label>
                          <label className="flex items-center gap-1 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={formData.showHeight}
                              onChange={(e) => setFormData({ ...formData, showHeight: e.target.checked })}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                              formData.showHeight
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-600'
                                : 'bg-white border-gray-300 group-hover:border-green-400'
                            }`}>
                              {formData.showHeight && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                          </label>
                        </div>
                        <div className="relative">
                          <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="height"
                            type="number"
                            min="100"
                            max="250"
                            value={formData.height || ''}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="175"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="weight" className="text-xs text-gray-600 flex items-center gap-1">
                            <Weight className="w-3 h-3" />
                            Kilo (kg)
                          </Label>
                          <label className="flex items-center gap-1 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={formData.showWeight}
                              onChange={(e) => setFormData({ ...formData, showWeight: e.target.checked })}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                              formData.showWeight
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-600'
                                : 'bg-white border-gray-300 group-hover:border-green-400'
                            }`}>
                              {formData.showWeight && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                          </label>
                        </div>
                        <div className="relative">
                          <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="weight"
                            type="number"
                            min="30"
                            max="200"
                            value={formData.weight || ''}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="75"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="age" className="text-xs text-gray-600 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Yaş
                          </Label>
                          <label className="flex items-center gap-1 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={formData.showAge}
                              onChange={(e) => setFormData({ ...formData, showAge: e.target.checked })}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                              formData.showAge
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-600'
                                : 'bg-white border-gray-300 group-hover:border-green-400'
                            }`}>
                              {formData.showAge && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                          </label>
                        </div>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="age"
                            type="number"
                            min="10"
                            max="100"
                            value={formData.age || ''}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="25"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Notice */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-semibold text-blue-900">Bilgilendirme:</span> "Listelemede göster" seçeneği işaretli olan tüm alanlar üyelerimiz ile listeleme ekranlarında paylaşılacaktır. Detaylar için{' '}
                      <Link 
                        href="/terms" 
                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                        target="_blank"
                      >
                        kullanıcı sözleşmesi
                      </Link>
                      {' '}sayfasını inceleyebilirsiniz.
                    </p>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Circle className="w-4 h-4 animate-spin" />
                          Kaydediliyor...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Kaydet
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowEditForm(false)
                        // Form verilerini sıfırla
                        if (user) {
                          setFormData({
                            name: user.name || '',
                            avatarUrl: user.avatarUrl || null,
                            phone: user.phone || '',
                            position: user.position || null,
                            strongFoot: user.strongFoot || null,
                            height: user.height || null,
                            weight: user.weight || null,
                            age: user.age || null,
                            showPhone: user.showPhone || false,
                            showPosition: user.showPosition || false,
                            showStrongFoot: user.showStrongFoot || false,
                            showHeight: user.showHeight || false,
                            showWeight: user.showWeight || false,
                            showAge: user.showAge || false,
                          })
                        }
                        // Sayfayı en üste scroll et
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="flex-1 border-2 hover:bg-gray-50 font-semibold flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      İptal
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Organizations Card */}
          <Card className="border-2 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Building2 className="w-6 h-6 text-green-600" />
                {isAdmin ? 'Organizasyonlarım' : 'Katıldığım Organizasyonlar'}
              </CardTitle>
              <CardDescription>
                {isAdmin 
                  ? 'Oluşturduğunuz organizasyonlar ve plan durumları'
                  : 'Aktif olduğunuz organizasyonlar (Maksimum 2)'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {organizations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-gray-500" />
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {isAdmin 
                      ? 'Henüz organizasyon oluşturmadınız'
                      : 'Henüz bir organizasyona katılmadınız'}
                  </p>
                  {isAdmin ? (
                    <Link href="/organization/new" className="flex justify-center">
                      <Button className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Yeni Organizasyon Oluştur
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/organizations" className="flex justify-center">
                      <Button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                        <Building2 className="w-4 h-4" />
                        Organizasyonları Görüntüle
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div>
                  {organizations.map((org) => (
                    <Link key={org.id} href={`/organization/${org.id}`} className="block mb-4 last:mb-0">
                      <div className="p-4 border-2 rounded-lg hover:border-green-400 hover:shadow-md transition-all cursor-pointer bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-green-600" />
                            {org.name}
                          </h3>
                          {isAdmin && (
                            <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                              org.owner.plan === 'PREMIUM'
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                : 'bg-gray-100 text-gray-800 border border-gray-300'
                            }`}>
                              {org.owner.plan === 'PREMIUM' ? (
                                <>
                                  <Star className="w-3 h-3 fill-yellow-800" />
                                  {org.owner.plan}
                                </>
                              ) : (
                                org.owner.plan
                              )}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {org._count.members} üye
                          </span>
                          {isAdmin && (
                            <span className={`flex items-center gap-1 ${org.owner.plan === 'PREMIUM' ? 'text-yellow-600 font-semibold' : 'text-gray-600'}`}>
                              {org.owner.plan === 'PREMIUM' ? (
                                <>
                                  <Star className="w-4 h-4 fill-yellow-600" />
                                  Premium
                                </>
                              ) : (
                                'Free'
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {isAdmin && (
                    <Link href="/organization/new">
                      <Button variant="outline" className="w-full mt-4 flex items-center justify-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Yeni Organizasyon
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Role Change Modal */}
      <Dialog 
        open={showRoleChangeModal} 
        onOpenChange={(open) => {
          if (!open && !changingRole) {
            setShowRoleChangeModal(false)
          }
        }}
        disabled={changingRole}
      >
        <DialogContent className="relative max-w-md">
          {changingRole && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <Loader2 className={`w-8 h-8 animate-spin mx-auto mb-2 ${isAdmin ? 'text-red-600' : 'text-yellow-600'}`} />
                <p className="text-sm text-gray-700 font-medium">
                  Rol değiştiriliyor...
                </p>
              </div>
            </div>
          )}
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isAdmin ? 'Oyuncu Rolüne Geç' : 'Yönetici Rolüne Geç'}
            </DialogTitle>
            <DialogDescription className="text-base">
              {isAdmin ? (
                <>
                  <p className="mb-3 text-red-600 font-semibold">
                    ⚠️ UYARI: Bu işlem geri alınamaz!
                  </p>
                  <p className="mb-2">
                    Oyuncu rolüne geçtiğinizde:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Bugüne kadar oluşturduğunuz <strong>tüm organizasyonlar</strong> silinecek</li>
                    <li>Organizasyonlarınızdaki <strong>tüm tesisler</strong> silinecek</li>
                    <li>Bu tesislerde oynanan <strong>tüm maçlar ve maç verileri</strong> silinecek</li>
                    <li>Organizasyonlarınızdaki <strong>tüm üyeler</strong> silinecek</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="mb-3 text-red-600 font-semibold">
                    ⚠️ UYARI: Bu işlem geri alınamaz!
                  </p>
                  <p className="mb-2">
                    Yönetici rolüne geçtiğinizde:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Katılmış olduğunuz <strong>tüm organizasyonlardan</strong> atılacaksınız</li>
                    <li>Organizasyon üyelikleriniz <strong>tamamen silinecek</strong></li>
                  </ul>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRoleChangeModal(false)}
              disabled={changingRole}
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              İptal
            </Button>
            <Button
              onClick={handleChangeRole}
              disabled={changingRole}
              variant={isAdmin ? "destructive" : "default"}
              className={isAdmin 
                ? "bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              }
            >
              {changingRole ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Değiştiriliyor...
                </>
              ) : (
                'Onayla ve Değiştir'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
