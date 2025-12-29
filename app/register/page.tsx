'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/Navbar'
import { User, Shield, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: searchParams?.get('role') || 'PLAYER',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const role = searchParams?.get('role')
    if (role) {
      setFormData((prev) => ({ ...prev, role }))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Kayıt başarısız')
        setLoading(false)
        return
      }

      // Wait a bit for cookie to be set, then redirect
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
    } catch (err) {
      setError('Bir hata oluştu')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4 py-8">
        <Card className="w-full max-w-5xl shadow-2xl border-2">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold">Kayıt Ol</CardTitle>
            <CardDescription className="text-base">
              Yeni hesap oluşturun ve halısaha organizasyonlarına katılın
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side - Role Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Rol Seçin</Label>
                  <div className="space-y-4">
                    <label
                      className={`relative flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.role === 'PLAYER'
                          ? 'border-green-500 bg-green-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="PLAYER"
                        checked={formData.role === 'PLAYER'}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="sr-only"
                      />
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                        formData.role === 'PLAYER'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <User className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <span className={`block font-semibold text-lg ${
                          formData.role === 'PLAYER' ? 'text-green-700' : 'text-gray-700'
                        }`}>
                          Oyuncu
                        </span>
                        <span className={`text-sm mt-1 ${
                          formData.role === 'PLAYER' ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          Maçlara katıl ve oyun oyna
                        </span>
                      </div>
                    </label>

                    <label
                      className={`relative flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.role === 'ADMIN'
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="ADMIN"
                        checked={formData.role === 'ADMIN'}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="sr-only"
                      />
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                        formData.role === 'ADMIN'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Shield className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <span className={`block font-semibold text-lg ${
                          formData.role === 'ADMIN' ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                          Yönetici
                        </span>
                        <span className={`text-sm mt-1 ${
                          formData.role === 'ADMIN' ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          Organizasyon oluştur ve yönet
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Right Side - Form Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-medium">Ad Soyad</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Adınız Soyadınız"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ornek@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base font-medium">Şifre</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={6}
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Minimum 6 karakter</p>
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                      {error}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button and Links - Centered */}
              <div className="mt-6 space-y-4">
                <Button 
                  type="submit" 
                  className="w-full max-w-md mx-auto block h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg" 
                  disabled={loading}
                >
                  {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
                </Button>

                <div className="text-center text-sm space-y-2">
                  <div>
                    <span className="text-gray-600">Zaten hesabınız var mı? </span>
                    <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold hover:underline">
                      Giriş Yap
                    </Link>
                  </div>
                  <div>
                    <Link href="/" className="text-gray-500 hover:text-gray-700 hover:underline">
                      Ana Sayfaya Dön
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

