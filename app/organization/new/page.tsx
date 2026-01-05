'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'
import Navbar from '@/components/Navbar'
import { 
  Building2, 
  Trophy, 
  FileText, 
  Info, 
  Loader2, 
  X, 
  CheckCircle2,
  Sparkles,
  Image as ImageIcon,
  Upload,
  Gem
} from 'lucide-react'

// Default avatar URLs - Futbol/Halısaha organizasyonları için uygun logolar
// Farklı renklerde ve stillerde 10 logo seçeneği
const DEFAULT_AVATARS = [
  'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618324/black_katlhj.png', // Futbol topu - Renkli
  'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618373/red_ltriuy.png', // Futbol topu - Yeşil
  'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618323/green_ngessp.png', // Futbol topu - Mavi
  'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618323/black-1_h6jfsv.png', // Futbol topu - Kırmızı
  'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618372/red-1_p6itck.png', // Futbol topu - Turuncu
  'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618323/green-1_ibxene.png', // Futbol topu - Mor
  'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618323/black-2_jp5mrk.png', // Futbol topu - Cyan
  'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618373/red-2_bpi3gn.png', // Futbol topu - Pembe
  'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618323/green-2_vo08rx.png', // Futbol topu - Teal
  'https://res.cloudinary.com/dy7iwbznk/image/upload/v1767618373/stadium_idi4ba.png', // Futbol topu - İndigo
]

export default function NewOrganizationPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avatarUrl: '',
  })
  const [loading, setLoading] = useState(false)
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const isPremium = user?.plan === 'PREMIUM'

  const handleDefaultAvatarSelect = (avatarUrl: string) => {
    setFormData({ ...formData, avatarUrl })
    setAvatarModalOpen(false)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isPremium) {
      showToast('Özel logo yükleme özelliği sadece Premium plan kullanıcıları için geçerlidir.', 'warning')
      return
    }

    setUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'organization-logos')
      formData.append('publicId', `org-${Date.now()}`)

      const res = await fetch('/api/upload/organization-logo', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        showToast(data.error || 'Logo yüklenirken bir hata oluştu', 'error')
        setUploadingAvatar(false)
        return
      }

      const data = await res.json()
      setFormData(prev => ({ ...prev, avatarUrl: data.url }))
      showToast('Logo başarıyla yüklendi', 'success')
      setAvatarModalOpen(false)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      showToast('Logo yüklenirken bir hata oluştu', 'error')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Organizasyon oluşturulamadı', 'error')
        setLoading(false)
        return
      }

      showToast('Organizasyon başarıyla oluşturuldu', 'success')
      router.push(`/organization/${data.organization.id}`)
    } catch (err) {
      showToast('Bir hata oluştu', 'error')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2">Organizasyon Oluştur</h1>
              <p className="text-xl opacity-90">
                Yeni bir halısaha futbol organizasyonu oluşturun
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
        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Form Card */}
          <Card className="border-2 shadow-xl bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-b-2 border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-2xl font-bold text-gray-900">Organizasyon Bilgileri</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Organizasyonunuzun temel bilgilerini girin. Plan limitleri yönetici planınıza göre belirlenir.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-base font-medium text-gray-700 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-green-600" />
                    Organizasyon Adı 
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      placeholder="Örn: Beylikdüzü Halısaha"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="text-base pl-12 border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 h-12 transition-all"
                      disabled={loading}
                    />
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-base font-medium text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    Açıklama 
                    <span className="text-gray-400 text-sm font-normal">(Opsiyonel, max 50 karakter)</span>
                  </Label>
                  <div className="relative">
                    <textarea
                      id="description"
                      className="flex min-h-[120px] w-full rounded-md border-2 border-gray-300 bg-background px-4 py-3 pl-12 pb-8 text-base ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-200 focus-visible:border-green-500 transition-all resize-none"
                      placeholder="Organizasyon hakkında bilgi..."
                      value={formData.description}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 50)
                        setFormData({ ...formData, description: value })
                      }}
                      maxLength={50}
                      disabled={loading}
                    />
                    <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <div className="absolute bottom-2 right-3 text-xs text-gray-500 font-medium">
                      <span className={formData.description.length >= 50 ? 'text-red-500' : formData.description.length >= 40 ? 'text-orange-500' : 'text-gray-500'}>
                        {formData.description.length}
                      </span>
                      <span className="text-gray-400">/50</span>
                    </div>
                  </div>
                </div>

                {/* Avatar/Logo Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-green-600" />
                    Organizasyon Logosu
                    <span className="text-gray-400 text-sm font-normal">(Opsiyonel)</span>
                  </Label>
                  <div 
                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all relative overflow-hidden group"
                    onClick={() => setAvatarModalOpen(true)}
                  >
                    {formData.avatarUrl ? (
                      <>
                        <img 
                          src={formData.avatarUrl} 
                          alt="Organization logo" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-white" />
                        </div>
                      </>
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  {formData.avatarUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({ ...formData, avatarUrl: '' })}
                      className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all font-medium"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Logoyu Kaldır
                    </Button>
                  )}
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Link href="/dashboard" className="flex-1">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-2 border-gray-300 hover:border-gray-400 h-12 font-semibold" 
                      disabled={loading}
                    >
                      İptal
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg h-12 font-semibold flex items-center justify-center gap-2" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <Trophy className="w-5 h-5" />
                        Organizasyonu Oluştur
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">Bilgi</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Organizasyon limitleri yönetici planınıza göre belirlenir. Premium plan için{' '}
                    <Link href="/payment" className="text-blue-600 hover:underline font-semibold inline-flex items-center gap-1">
                      buradan
                      <Sparkles className="w-3 h-3" />
                    </Link>{' '}
                    yükseltebilirsiniz.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Organizasyon oluşturulduktan sonra oyuncuları ekleyebilir, maçlar oluşturabilir ve tesisler ekleyebilirsiniz.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      <Dialog open={avatarModalOpen} onOpenChange={(open) => {
        if (!uploadingAvatar) {
          setAvatarModalOpen(open)
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-green-600" />
              <DialogTitle>Organizasyon Logosu Seç</DialogTitle>
            </div>
            <DialogDescription>
              Hazır logolardan birini seçin veya kendi logonuzu yükleyin
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4 px-6">
            {/* Default Avatars */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Hazır Logolar</h3>
              <div className="grid grid-cols-5 gap-3">
                {DEFAULT_AVATARS.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDefaultAvatarSelect(url)}
                    className={`aspect-square rounded-lg border-2 overflow-hidden transition-all hover:scale-105 ${
                      formData.avatarUrl === url
                        ? 'border-green-500 ring-2 ring-green-200'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <img 
                      src={url} 
                      alt={`Default avatar ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Upload - Premium Only */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Kendi Logonu Yükle</h3>
                {!isPremium && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full flex items-center gap-1">
                    <Gem className="w-3 h-3" />
                    Premium
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={!isPremium || uploadingAvatar}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                    isPremium && !uploadingAvatar
                      ? 'border-green-300 hover:border-green-500 hover:bg-green-50'
                      : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {uploadingAvatar ? (
                    <>
                      <Loader2 className="w-6 h-6 text-gray-400 animate-spin mb-2" />
                      <span className="text-sm text-gray-500">Yükleniyor...</span>
                    </>
                  ) : (
                    <>
                      <Upload className={`w-6 h-6 mb-2 ${isPremium ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className={`text-sm ${isPremium ? 'text-gray-700' : 'text-gray-400'}`}>
                        {isPremium ? 'Logo Yükle' : 'Premium plan gerekli'}
                      </span>
                    </>
                  )}
                </label>
                {!isPremium && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Özel logo yükleme özelliği için{' '}
                    <Link href="/payment" className="text-blue-600 hover:underline font-semibold">
                      Premium plan
                    </Link>{' '}
                    satın alın
                  </p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

