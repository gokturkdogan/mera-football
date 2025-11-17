'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    fetch('/api/auth/me')
      .then((res) => {
        if (res.ok) {
          router.push('/dashboard')
        }
      })
      .catch(() => {
        // Not logged in, stay on landing page
      })
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            MeraFootball
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Halısaha Futbol Organizasyon Platformu
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Oyuncu</CardTitle>
              <CardDescription>
                Ücretsiz olarak organizasyonlara katıl, maçlara katıl ve oyuncuları puanla
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li>✓ Ücretsiz kayıt</li>
                <li>✓ Maksimum 2 organizasyona katıl</li>
                <li>✓ Maç bilgilerine erişim</li>
                <li>✓ Oyuncu puanlama sistemi</li>
              </ul>
              <Link href="/register?role=PLAYER">
                <Button className="w-full">Oyuncu Olarak Kayıt Ol</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Yönetici</CardTitle>
              <CardDescription>
                Organizasyon oluştur, maç yönet ve oyuncuları organize et
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li>✓ Free veya Premium plan</li>
                <li>✓ Organizasyon yönetimi</li>
                <li>✓ Maç oluşturma ve yönetimi</li>
                <li>✓ Skor ve gol girişi</li>
              </ul>
              <Link href="/register?role=ADMIN">
                <Button className="w-full">Yönetici Olarak Kayıt Ol</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">Zaten hesabınız var mı?</p>
          <Link href="/login">
            <Button variant="outline">Giriş Yap</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

