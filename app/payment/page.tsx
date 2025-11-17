'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    organizationId: searchParams?.get('organizationId') || '',
    cardHolderName: '',
    cardNumber: '',
    expireMonth: '',
    expireYear: '',
    cvc: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          plan: 'PREMIUM',
          price: 99.99, // Premium plan price
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ödeme işlemi başarısız')
        setLoading(false)
        return
      }

      alert('Ödeme başarılı! Premium plan aktif edildi.')
      router.push(`/organization/${formData.organizationId}`)
    } catch (err) {
      setError('Bir hata oluştu')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href={`/organization/${formData.organizationId}`}>
            <Button variant="ghost">← Geri</Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Premium Plan Satın Al</CardTitle>
            <CardDescription>
              Premium plan ile sınırsız maç ve oyuncu ekleyebilirsiniz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-yellow-50 rounded">
              <p className="font-semibold text-lg mb-2">Premium Plan Özellikleri:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Sınırsız maç oluşturma</li>
                <li>Sınırsız oyuncu ekleme</li>
                <li>Öncelikli destek</li>
              </ul>
              <p className="mt-4 font-bold text-xl">Fiyat: 99.99 ₺</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardHolderName">Kart Sahibi Adı</Label>
                <Input
                  id="cardHolderName"
                  type="text"
                  placeholder="AD SOYAD"
                  value={formData.cardHolderName}
                  onChange={(e) => setFormData({ ...formData, cardHolderName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Kart Numarası</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expireMonth">Ay</Label>
                  <Input
                    id="expireMonth"
                    type="text"
                    placeholder="12"
                    maxLength={2}
                    value={formData.expireMonth}
                    onChange={(e) => setFormData({ ...formData, expireMonth: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expireYear">Yıl</Label>
                  <Input
                    id="expireYear"
                    type="text"
                    placeholder="2025"
                    maxLength={4}
                    value={formData.expireYear}
                    onChange={(e) => setFormData({ ...formData, expireYear: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    type="text"
                    placeholder="123"
                    maxLength={3}
                    value={formData.cvc}
                    onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                    required
                  />
                </div>
              </div>
              {error && (
                <div className="text-sm text-red-600">{error}</div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'İşleniyor...' : 'Ödeme Yap (99.99 ₺)'}
              </Button>
            </form>

            <p className="mt-4 text-xs text-gray-500 text-center">
              Ödeme iyzico üzerinden güvenli bir şekilde işlenmektedir.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

