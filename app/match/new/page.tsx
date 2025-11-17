'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/Navbar'

export default function NewMatchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    organizationId: searchParams?.get('organizationId') || '',
    date: '',
    time: '',
    venue: '',
    capacity: 10,
  })
  const [organizations, setOrganizations] = useState<any[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      const res = await fetch('/api/organizations', {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setOrganizations(data.organizations || [])
        if (!formData.organizationId && data.organizations.length > 0) {
          setFormData({ ...formData, organizationId: data.organizations[0].id })
        }
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate required fields
    if (!formData.organizationId) {
      setError('Lütfen bir organizasyon seçin')
      setLoading(false)
      return
    }

    if (!formData.date) {
      setError('Lütfen bir tarih seçin')
      setLoading(false)
      return
    }

    if (!formData.time) {
      setError('Lütfen bir saat seçin')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          venue: formData.venue || undefined, // Send undefined if empty
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Maç oluşturulamadı')
        setLoading(false)
        return
      }

      router.push(`/match/${data.match.id}`)
    } catch (err) {
      setError('Bir hata oluştu')
      setLoading(false)
    }
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2">Yeni Maç Oluştur</h1>
              <p className="text-xl opacity-90">
                Organizasyonunuz için yeni bir maç oluşturun
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
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Maç Bilgileri</CardTitle>
              <CardDescription className="text-base">
                Maç detaylarını doldurun. Saha adını sonradan ekleyebilir veya düzenleyebilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Organization Selection */}
                <div className="space-y-2">
                  <Label htmlFor="organizationId" className="text-base font-semibold">
                    Organizasyon <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="organizationId"
                    value={formData.organizationId}
                    onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white"
                    required
                  >
                    <option value="">Organizasyon seçin...</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Picker - Modern Design */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-base font-semibold flex items-center gap-2">
                    <span className="text-2xl">📅</span>
                    Tarih <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-focus-within:text-green-600 transition-colors">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <Input
                      id="date"
                      type="date"
                      min={today}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white cursor-pointer hover:border-green-400 hover:shadow-md transition-all font-medium"
                      required
                    />
                    {formData.date && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-bold">
                          {new Date(formData.date).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  {formData.date && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <span className="text-green-600 text-lg">✓</span>
                      <p className="text-sm text-green-700 font-semibold">
                        {new Date(formData.date).toLocaleDateString('tr-TR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Time Selection - Modern Design */}
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-base font-semibold flex items-center gap-2">
                    <span className="text-2xl">🕐</span>
                    Saat <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-focus-within:text-green-600 transition-colors">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white cursor-pointer hover:border-green-400 hover:shadow-md transition-all font-medium"
                      required
                    />
                    {formData.time && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold">
                          {formData.time}
                        </div>
                      </div>
                    )}
                  </div>
                  {formData.time && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <span className="text-blue-600 text-lg">✓</span>
                      <p className="text-sm text-blue-700 font-semibold">
                        Seçilen saat: {formData.time}
                      </p>
                    </div>
                  )}
                </div>

                {/* Venue - Optional */}
                <div className="space-y-2">
                  <Label htmlFor="venue" className="text-base font-semibold">
                    Saha Adı <span className="text-gray-400 text-sm">(Opsiyonel)</span>
                  </Label>
                  <Input
                    id="venue"
                    type="text"
                    placeholder="Örn: Halısaha Merkez, Futbol Sahası 1..."
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-4 py-3 text-lg border-2 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  />
                  <p className="text-xs text-gray-500">
                    Saha adını şimdi ekleyebilir veya sonradan düzenleyebilirsiniz
                  </p>
                </div>

                {/* Capacity */}
                <div className="space-y-2">
                  <Label htmlFor="capacity" className="text-base font-semibold">
                    Kapasite <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="2"
                    max="22"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 10 })}
                    className="w-full px-4 py-3 text-lg border-2 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Maça katılabilecek maksimum oyuncu sayısı (2-22 arası)
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 font-semibold">{error}</p>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Link href={formData.organizationId ? `/organization/${formData.organizationId}` : '/dashboard'} className="flex-1">
                    <Button type="button" variant="outline" className="w-full" disabled={loading}>
                      İptal
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg" 
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? 'Oluşturuluyor...' : '⚽ Maçı Oluştur'}
                  </Button>
                </div>
              </form>
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
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Saha adı opsiyoneldir ve sonradan maç detay sayfasından eklenebilir veya düzenlenebilir.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Maç oluşturulduktan sonra oyuncuları kadroya ekleyebilir ve maç detaylarını yönetebilirsiniz.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Free plan için haftada maksimum 1 maç oluşturabilirsiniz.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
