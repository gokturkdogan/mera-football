'use client'

import { useState, useEffect, useRef } from 'react'
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
import { CalendarDays, Clock, Info, Lightbulb, CheckCircle, Target, ChevronLeft, ChevronRight, Home } from 'lucide-react'

export default function NewMatchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const organizationId = searchParams?.get('organizationId') || ''
  const [formData, setFormData] = useState({
    organizationId,
    date: '',
    time: '',
    venue: '',
  })
  const [facilities, setFacilities] = useState<any[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [timePickerOpen, setTimePickerOpen] = useState(false)
  const [loadingFacilities, setLoadingFacilities] = useState(false)
  const [currentFacilityIndex, setCurrentFacilityIndex] = useState(0)
  const facilityCarouselRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  useEffect(() => {
    if (!organizationId) {
      setError('Organizasyon bulunamadı')
      router.push('/dashboard')
      return
    }
    fetchFacilities(organizationId)
  }, [organizationId, router])

  const fetchFacilities = async (orgId: string) => {
    if (!orgId) return
    setLoadingFacilities(true)
    try {
      const res = await fetch(`/api/organizations/${orgId}/facilities`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setFacilities(data.facilities || [])
      }
    } catch (error) {
      console.error('Error fetching facilities:', error)
    } finally {
      setLoadingFacilities(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate required fields
    if (!organizationId) {
      setError('Organizasyon bulunamadı')
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
          organizationId,
          date: formData.date,
          time: formData.time,
          venue: formData.venue || undefined,
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

  // Generate time options (every 15 minutes from 00:00 to 23:45)
  const timeOptions = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
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
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
                <Target className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-2 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Maç Bilgileri</CardTitle>
                <CardDescription className="text-base">
                  Maç detaylarını doldurun. Saha adını sonradan ekleyebilir veya düzenleyebilirsiniz.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Picker - Modern Design */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-base font-semibold flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-gray-600" />
                    Tarih <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`
                          w-full justify-start text-left font-normal h-12
                          ${!selectedDate ? 'text-gray-500' : 'text-gray-900'}
                          border-2 hover:border-green-500 focus:border-green-500
                          transition-all duration-200
                        `}
                      >
                        <CalendarDays className="mr-3 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, 'dd MMMM yyyy', { locale: tr })
                        ) : (
                          <span>Tarih seçiniz</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4 shadow-2xl border border-gray-200 rounded-xl bg-white z-50" align="start" sideOffset={4}>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date)
                          setDatePickerOpen(false)
                        }}
                        disabled={(date) => date < today}
                        initialFocus
                        locale={tr}
                        className="rounded-lg"
                        formatters={{
                          formatCaption: (date) => format(date, 'MMMM yyyy', { locale: tr }),
                          formatWeekdayName: (date) => format(date, 'EEEEEE', { locale: tr }),
                        }}
                        classNames={{
                          months: "flex flex-col space-y-4",
                          month: "space-y-4",
                          caption: "flex justify-center pt-1 relative items-center",
                          caption_label: "text-sm font-semibold text-gray-900 capitalize",
                          nav: "space-x-1 flex items-center",
                          button_previous: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-gray-100 rounded-md",
                          button_next: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-gray-100 rounded-md",
                          month_grid: "mt-4",
                          weekdays: "flex",
                          weekday: "text-gray-500 text-xs font-medium w-10 h-10 flex items-center justify-center capitalize",
                          week: "flex w-full mt-2",
                          day: "h-10 w-10 p-0 text-sm font-normal hover:bg-green-50 rounded-md transition-colors",
                          day_selected: "bg-green-600 text-white hover:bg-green-700 hover:text-white focus:bg-green-600 focus:text-white rounded-md",
                          day_today: "bg-green-50 text-green-700 font-semibold rounded-md",
                          day_disabled: "text-gray-300 cursor-not-allowed opacity-50",
                          day_outside: "text-gray-400 opacity-50",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {formData.date && selectedDate && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <p className="text-sm text-green-700 font-medium">
                        {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: tr })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Time Selection - Modern Design */}
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-base font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Saat <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={timePickerOpen} onOpenChange={setTimePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`
                          w-full justify-start text-left font-normal h-12
                          ${!formData.time ? 'text-gray-500' : 'text-gray-900'}
                          border-2 hover:border-green-500 focus:border-green-500
                          transition-all duration-200
                        `}
                      >
                        <Clock className="mr-3 h-4 w-4" />
                        {formData.time || <span>Saat seçiniz</span>}
                      </Button>
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
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-blue-700 font-semibold">
                        Seçilen saat: {formData.time}
                      </p>
                    </div>
                  )}
                </div>

                {/* Venue - Optional - Select from Facilities */}
                <div className="space-y-2">
                  <Label htmlFor="venue" className="text-base font-semibold">
                    Tesis / Saha <span className="text-gray-400 text-sm">(Opsiyonel)</span>
                  </Label>
                  {loadingFacilities ? (
                    <div className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg bg-gray-50 flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500">Tesisler yükleniyor...</span>
                    </div>
                  ) : facilities.length > 0 ? (
                    <div className="space-y-3">
                      {/* Facility Slider */}
                      <div className="relative">
                        <div 
                          ref={facilityCarouselRef}
                          className="relative overflow-hidden rounded-xl"
                          onTouchStart={(e) => {
                            touchStartX.current = e.touches[0].clientX
                          }}
                          onTouchMove={(e) => {
                            touchEndX.current = e.touches[0].clientX
                          }}
                          onTouchEnd={() => {
                            if (!touchStartX.current || !touchEndX.current) return
                            const distance = touchStartX.current - touchEndX.current
                            const minSwipeDistance = 50
                            
                            if (distance > minSwipeDistance && currentFacilityIndex < facilities.length - 1) {
                              setCurrentFacilityIndex(currentFacilityIndex + 1)
                            } else if (distance < -minSwipeDistance && currentFacilityIndex > 0) {
                              setCurrentFacilityIndex(currentFacilityIndex - 1)
                            }
                            
                            touchStartX.current = null
                            touchEndX.current = null
                          }}
                        >
                          <div 
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{ transform: `translateX(-${currentFacilityIndex * 100}%)` }}
                          >
                            {facilities.map((facility, index) => (
                              <div
                                key={facility.id}
                                className="min-w-full px-2"
                              >
                                <div
                                  onClick={() => {
                                    const newVenue = formData.venue === facility.name ? '' : facility.name
                                    setFormData({ ...formData, venue: newVenue })
                                  }}
                                  className={`
                                    relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                                    ${formData.venue === facility.name
                                      ? 'border-green-500 bg-green-50 shadow-lg ring-2 ring-green-200'
                                      : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                                    }
                                  `}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={`
                                      w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                                      ${formData.venue === facility.name
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-600'
                                      }
                                    `}>
                                      <Home className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-gray-900 mb-2 truncate">
                                        {facility.name}
                                      </h4>
                                      <div className="flex items-center gap-3 text-xs text-gray-500">
                                        {facility.isIndoor !== null && (
                                          <span className={`
                                            px-2 py-1 rounded-full
                                            ${facility.isIndoor ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}
                                          `}>
                                            {facility.isIndoor ? 'Kapalı' : 'Açık'}
                                          </span>
                                        )}
                                        {facility.matchPrice && (
                                          <span className="font-medium text-gray-700">
                                            {facility.matchPrice.toFixed(2)} TL
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    {formData.venue === facility.name && (
                                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Navigation Arrows */}
                        {facilities.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => setCurrentFacilityIndex(Math.max(0, currentFacilityIndex - 1))}
                              disabled={currentFacilityIndex === 0}
                              className={`
                                absolute -left-4 top-1/2 -translate-y-1/2 z-10
                                w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200
                                flex items-center justify-center
                                transition-all duration-200
                                ${currentFacilityIndex === 0
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'hover:bg-gray-50 hover:scale-110'
                                }
                              `}
                            >
                              <ChevronLeft className="w-5 h-5 text-gray-700" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setCurrentFacilityIndex(Math.min(facilities.length - 1, currentFacilityIndex + 1))}
                              disabled={currentFacilityIndex === facilities.length - 1}
                              className={`
                                absolute -right-4 top-1/2 -translate-y-1/2 z-10
                                w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200
                                flex items-center justify-center
                                transition-all duration-200
                                ${currentFacilityIndex === facilities.length - 1
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'hover:bg-gray-50 hover:scale-110'
                                }
                              `}
                            >
                              <ChevronRight className="w-5 h-5 text-gray-700" />
                            </button>
                          </>
                        )}
                      </div>
                      
                      {/* Dots Indicator */}
                      {facilities.length > 1 && (
                        <div className="flex justify-center gap-2">
                          {facilities.map((_, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setCurrentFacilityIndex(index)}
                              className={`
                                w-2 h-2 rounded-full transition-all duration-200
                                ${index === currentFacilityIndex
                                  ? 'bg-green-600 w-6'
                                  : 'bg-gray-300 hover:bg-gray-400'
                                }
                              `}
                            />
                          ))}
                        </div>
                      )}
                      
                      {/* Manual Input Option */}
                      <div className="pt-2">
                        <Input
                          id="venue"
                          type="text"
                          placeholder="Veya manuel olarak saha adı girin..."
                          value={formData.venue && !facilities.find(f => f.name === formData.venue) ? formData.venue : ''}
                          onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                          className="w-full text-sm border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-200"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        id="venue"
                        type="text"
                        placeholder="Örn: Halısaha Merkez, Futbol Sahası 1..."
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        className="w-full px-4 py-3 text-lg border-2 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                      />
                      <p className="text-xs text-blue-600 font-medium flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Bu organizasyonda henüz tesis eklenmemiş. Manuel olarak saha adı girebilir veya organizasyon sayfasından tesis ekleyebilirsiniz.</span>
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    {facilities.length > 0 
                      ? 'Tesisler arasında kaydırarak gezin, seçmek için tıklayın veya manuel olarak saha adı girebilirsiniz'
                      : 'Saha adını şimdi ekleyebilir veya sonradan düzenleyebilirsiniz'}
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 font-semibold">{error}</p>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Link href={organizationId ? `/organization/${organizationId}` : '/dashboard'} className="flex-1">
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
                    {loading ? 'Oluşturuluyor...' : (
                      <>
                        <Target className="w-5 h-5 mr-2" />
                        Maçı Oluştur
                      </>
                    )}
                  </Button>
                </div>
                </form>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
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
    </div>
  )
}

