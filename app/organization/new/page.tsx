'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/Navbar'

export default function NewOrganizationPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Organizasyon oluşturulamadı')
        setLoading(false)
        return
      }

      router.push(`/organization/${data.organization.id}`)
    } catch (err) {
      setError('Bir hata oluştu')
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
              <h1 className="text-4xl font-black mb-2">Yeni Organizasyon Oluştur</h1>
              <p className="text-xl opacity-90">
                Yeni bir halısaha futbol organizasyonu oluşturun
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

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-2 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
            <CardTitle className="text-2xl">Organizasyon Bilgileri</CardTitle>
            <CardDescription className="text-base">
              Organizasyonunuzun temel bilgilerini girin. Plan limitleri yönetici planınıza göre belirlenir.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">
                  Organizasyon Adı <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Örn: Beylikdüzü Halısaha"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold">
                  Açıklama <span className="text-gray-400 text-sm">(Opsiyonel)</span>
                </Label>
                <textarea
                  id="description"
                  className="flex min-h-[100px] w-full rounded-md border-2 border-gray-300 bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-200 focus-visible:border-green-500 transition-all"
                  placeholder="Organizasyon hakkında bilgi..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-semibold">{error}</p>
                </div>
              )}
              
              <div className="flex gap-4 pt-4">
                <Link href="/dashboard" className="flex-1">
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
                  {loading ? 'Oluşturuluyor...' : '🏆 Organizasyonu Oluştur'}
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
                <span>Organizasyon limitleri yönetici planınıza göre belirlenir. Premium plan için <Link href="/payment" className="text-blue-600 hover:underline font-semibold">buradan</Link> yükseltebilirsiniz.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Organizasyon oluşturulduktan sonra oyuncuları ekleyebilir, maçlar oluşturabilir ve tesisler ekleyebilirsiniz.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

