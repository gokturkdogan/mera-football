'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/Navbar'
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

export default function LoginPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (!email || !password) {
      showToast('Lütfen email ve şifre alanlarını doldurun', 'warning')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        // Türkçe hata mesajları
        let errorMessage = 'Giriş başarısız'
        if (data.error) {
          if (data.error.includes('Invalid') || data.error.includes('credentials')) {
            errorMessage = 'Hatalı kullanıcı adı veya şifre'
          } else if (data.error.includes('not found') || data.error.includes('User')) {
            errorMessage = 'Bu email adresi ile kayıtlı kullanıcı bulunamadı'
          } else {
            errorMessage = data.error
          }
        }
        showToast(errorMessage, 'error')
        setLoading(false)
        return
      }

      // Success
      showToast('Giriş başarılı! Yönlendiriliyorsunuz...', 'success')
      
      // Wait a bit for toast to show, then redirect
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    } catch (err) {
      const errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.'
      showToast(errorMessage, 'error')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4 py-12">
        <Card className="w-full max-w-md shadow-2xl border-2">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">Giriş Yap</CardTitle>
            <CardDescription className="text-base">
              Hesabınıza giriş yapın ve halısaha organizasyonlarına katılın
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Şifre
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg" 
                disabled={loading}
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm space-y-2">
              <div>
                <span className="text-gray-600">Hesabınız yok mu? </span>
                <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold hover:underline">
                  Kayıt Ol
                </Link>
              </div>
              <div>
                <Link href="/" className="text-gray-500 hover:text-gray-700 hover:underline">
                  Ana Sayfaya Dön
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

