'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/Navbar'
import { useToast } from '@/components/ui/toast'
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
  Move
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
    phone: '',
    position: '' as string | null,
    strongFoot: '' as string | null,
    height: '' as number | null,
    weight: '' as number | null,
    age: '' as number | null,
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
    const optionalFields = ['phone', 'position', 'strongFoot', 'height', 'weight', 'age']
    const filledFields = optionalFields.filter(field => user[field] !== null && user[field] !== undefined && user[field] !== '')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30 shadow-xl">
              {isAdmin ? (
                <Crown className="w-12 h-12 text-white" />
              ) : (
                <Trophy className="w-12 h-12 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-black mb-2">{user?.name}</h1>
              <p className="text-xl opacity-90 mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                {user?.email}
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                  isAdmin 
                    ? 'bg-yellow-400 text-yellow-900' 
                    : 'bg-blue-400 text-blue-900'
                }`}>
                  {isAdmin ? (
                    <>
                      <Crown className="w-4 h-4" />
                      Yönetici
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      Oyuncu
                    </>
                  )}
                </span>
                {user?.phone && (
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {user.phone}
                  </span>
                )}
                {user?.position && (
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    {user.position}
                  </span>
                )}
              </div>
            </div>
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
        {/* Plan Status Card (only for admins) */}
        {isAdmin && (
          <div className="mb-8">
            <Card className={`border-2 max-w-md mx-auto ${adminPlan === 'PREMIUM' ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50'}`}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                      adminPlan === 'PREMIUM' 
                        ? 'bg-gradient-to-br from-yellow-500 to-orange-600' 
                        : 'bg-gradient-to-br from-gray-400 to-gray-600'
                    }`}>
                      {adminPlan === 'PREMIUM' ? (
                        <Star className="w-8 h-8 text-white fill-white" />
                      ) : (
                        <User className="w-8 h-8 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="text-lg text-gray-700 font-semibold mb-1">
                    Plan Durumu
                  </div>
                  <div className={`text-xl font-bold ${adminPlan === 'PREMIUM' ? 'text-yellow-600' : 'text-gray-600'}`}>
                    {adminPlan}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
                <div className="space-y-3">
                  {organizations.map((org) => (
                    <Link key={org.id} href={`/organization/${org.id}`}>
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
