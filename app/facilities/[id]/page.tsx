'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Navbar from '@/components/Navbar'

interface Facility {
  id: string
  name: string
  location: string
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

  useEffect(() => {
    if (params.id) {
      fetchFacility()
    }
  }, [params.id])

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
  const getMapEmbedUrl = (locationData: string): string => {
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
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl backdrop-blur-sm border-4 border-white/30">
              🏟️
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-black mb-2">{facility.name}</h1>
              <p className="text-xl opacity-90 mb-3">
                {facility.organization.name}
              </p>
              <div className="flex items-center gap-4">
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                  📅 {new Date(facility.createdAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
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
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🗺️</span>
                Konum
              </CardTitle>
              <CardDescription>
                Tesis konumunu haritada görüntüleyin
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="w-full h-96 rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-100">
                <iframe
                  src={getMapEmbedUrl(facility.location)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
              <a
                href={facility.location.includes('<iframe') ? 
                  (facility.location.match(/src=["']([^"']+)["']/i)?.[1] || facility.location) : 
                  facility.location}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Google Maps'te Aç
              </a>
            </CardContent>
          </Card>

          {/* Bilgiler */}
          <Card className="shadow-xl border-2 border-green-200 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">ℹ️</span>
                Tesis Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                  <Label className="text-xs text-gray-600 mb-1 block">🏟️ Tesis Adı</Label>
                  <p className="text-lg font-bold text-gray-900">{facility.name}</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                  <Label className="text-xs text-gray-600 mb-1 block">🏢 Organizasyon</Label>
                  <Link 
                    href={`/organization/${facility.organization.id}`}
                    className="text-lg font-bold text-purple-700 hover:text-purple-900 hover:underline"
                  >
                    {facility.organization.name}
                  </Link>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <Label className="text-xs text-gray-600 mb-1 block">👑 Yönetici</Label>
                  <p className="text-sm font-bold text-gray-900">{facility.organization.owner.name}</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                  <Label className="text-xs text-gray-600 mb-1 block">📅 Kayıt Tarihi</Label>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(facility.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button onClick={() => router.push(`/organization/${facility.organization.id}`)} variant="outline">
            ← Organizasyon Sayfasına Dön
          </Button>
        </div>
      </div>
    </div>
  )
}

