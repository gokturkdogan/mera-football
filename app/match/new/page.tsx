'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [timePickerOpen, setTimePickerOpen] = useState(false)

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

  // Get today's date
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Handle date selection
  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      setFormData((prev) => ({ ...prev, date: dateStr }))
    }
  }, [selectedDate])

  // Initialize selectedDate from formData.date
  useEffect(() => {
    if (formData.date && !selectedDate) {
      const date = new Date(formData.date)
      if (!isNaN(date.getTime())) {
        setSelectedDate(date)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Generate time options (every 30 minutes from 00:00 to 23:30)
  const timeOptions = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      timeOptions.push(timeStr)
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
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <div className="relative group cursor-pointer">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 group-hover:text-green-600 transition-all duration-200">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </div>
                        <div className="w-full pl-14 pr-14 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-200/50 bg-gradient-to-br from-white to-gray-50 hover:border-green-400 hover:shadow-lg hover:shadow-green-100 transition-all duration-200 font-semibold flex items-center justify-between group-hover:scale-[1.02]">
                          <span className={selectedDate ? 'text-gray-800' : 'text-gray-400'}>
                            {selectedDate 
                              ? format(selectedDate, 'dd MMMM yyyy', { locale: tr })
                              : 'Tarih seçiniz...'}
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-green-600 transition-colors">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date)
                          setDatePickerOpen(false)
                        }}
                        disabled={(date) => date < today}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {formData.date && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <span className="text-green-600 text-lg">✓</span>
                      <p className="text-sm text-green-700 font-semibold">
                        {selectedDate && format(selectedDate, 'EEEE, d MMMM yyyy', { locale: tr })}
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
                  <Popover open={timePickerOpen} onOpenChange={setTimePickerOpen}>
                    <PopoverTrigger asChild>
                      <div className="relative group cursor-pointer">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-green-600 transition-colors">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        </div>
                        <div className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white hover:border-green-400 hover:shadow-md transition-all font-medium flex items-center justify-between">
                          <span className={formData.time ? 'text-gray-900' : 'text-gray-400'}>
                            {formData.time || 'Saat seçiniz...'}
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-4">
                        <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
                          {timeOptions.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, time })
                                setTimePickerOpen(false)
                              }}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                formData.time === time
                                  ? 'bg-green-600 text-white shadow-md'
                                  : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
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

