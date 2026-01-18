'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/Navbar'
import { User, Shield, Eye, EyeOff, FileText } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'

export default function RegisterPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: searchParams?.get('role') || 'PLAYER',
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  useEffect(() => {
    const role = searchParams?.get('role')
    if (role) {
      setFormData((prev) => ({ ...prev, role }))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreedToTerms) {
      showToast('Üyelik sözleşmesini kabul etmelisiniz', 'warning')
      return
    }
    
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
        const errorMessage = data.error || 'Kayıt başarısız'
        showToast(errorMessage, 'error')
        setLoading(false)
        return
      }

      // Success - show toast and redirect to login
      showToast('Hesap başarıyla oluşturuldu', 'success')
      
      // Wait a bit for toast to show, then redirect to login
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    } catch (err) {
      const errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.'
      showToast(errorMessage, 'error')
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
                </div>
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="mt-6 flex items-center justify-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label htmlFor="terms" className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="sr-only"
                      required
                    />
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 transform ${
                      agreedToTerms
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-600 shadow-lg scale-100'
                        : 'bg-white border-gray-300 group-hover:border-green-400 group-hover:bg-green-50 scale-100'
                    }`}>
                      {agreedToTerms && (
                        <svg
                          className="w-4 h-4 text-white animate-in fade-in duration-200"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="text-green-600 hover:text-green-700 font-semibold underline inline-flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Üyelik Sözleşmesi
                    </button>
                    <span>'ni okudum ve kabul ediyorum.</span>
                  </span>
                </label>
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

      {/* Terms and Conditions Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Üyelik Sözleşmesi</DialogTitle>
            <DialogDescription>
              Lütfen aşağıdaki sözleşmeyi dikkatlice okuyun
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="max-h-[60vh]">
            <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">MeraFootball Üyelik Sözleşmesi ve Kişisel Verilerin Kullanımı Hakkında Aydınlatma Metni</h3>
                <p className="text-gray-600">
                  MeraFootball platformuna üye olarak, aşağıda belirtilen şartları okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan etmiş olursunuz.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-semibold text-gray-900">1. Üyelik ve Platformun Amacı</h4>
                <p className="text-gray-600 leading-relaxed">
                  MeraFootball; halısaha futbol organizasyonları düzenleyen yöneticiler ile bu organizasyonlara katılmak isteyen oyuncuları bir araya getiren, web tabanlı bir organizasyon ve iletişim platformudur. Platformun temel amacı; oyuncuların ve yöneticilerin birbirlerini tanıyabilmesi, organizasyonlara katılım sağlayabilmesi ve sağlıklı bir kullanıcı deneyimi sunulmasıdır.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-semibold text-gray-900">2. Kayıt Sırasında Paylaşılan Kişisel Veriler</h4>
                <p className="text-gray-600 leading-relaxed">
                  Üyelik sırasında kullanıcıdan talep edilen ad, soyad, e-posta adresi, kullanıcı adı gibi kişisel bilgiler;
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Kullanıcı hesabının oluşturulması,</li>
                  <li>Oyuncu ve yöneticilerin birbirini tanıyabilmesi,</li>
                  <li>Organizasyon, maç ve kadro listelerinde kullanıcıların doğru şekilde gösterilmesi</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-3">
                  amaçlarıyla işlenmekte ve platform içerisinde görüntülenmektedir.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    <strong>Önemli Güvenlik Notu:</strong> Bu bilgiler (isim, soyisim, iletişim bilgileri vb.) 
                    <strong> yalnızca platforma üye olan ve giriş yapmış kullanıcılar</strong> tarafından görülebilir. 
                    Platforma üye olmayan veya giriş yapmamış kişiler bu bilgilere erişemez. 
                    Bu bilgiler; organizasyon listeleme sayfalarında, maç kadrolarında ve ilgili kullanıcı profillerinde, 
                    platformun işleyişi gereği <strong>sadece diğer üye kullanıcılar</strong> tarafından görülebilir.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-semibold text-gray-900">3. Profil Sonrasında Eklenen Kişisel Veriler</h4>
                <p className="text-gray-600 leading-relaxed">
                  Kullanıcılar, üyelik sonrası profil sayfaları üzerinden telefon numarası gibi ek kişisel bilgiler ekleyebilirler.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Bu tür bilgiler:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Üyelik sırasında zorunlu değildir,</li>
                  <li>Kullanıcının kendi iradesiyle eklenir.</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Telefon numarası ve benzeri hassas bilgiler için kullanıcıya "göster / gizle" seçenekleri sunulur ve bu bilgilerin diğer kullanıcılar tarafından görüntülenip görüntülenmeyeceği tamamen kullanıcının tercihine bırakılır.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-semibold text-gray-900">4. Verilerin Gizlenmesi ve Kullanıcı Deneyimi</h4>
                <p className="text-gray-600 leading-relaxed">
                  Kullanıcı tarafından gizlenen bilgiler, platform üzerinde diğer kullanıcılar tarafından görüntülenmez.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Ancak kullanıcı, bazı kişisel verileri gizlemenin;
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Organizasyon yöneticilerinin kendisine ulaşmasını,</li>
                  <li>Organizasyonlara davet edilmesini,</li>
                  <li>Platform içi iletişimi</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-3">
                  zorlaştırabileceğini kabul eder. Bu durumun, kullanıcı deneyimini olumsuz etkileyebileceği kullanıcıya açıkça bildirilmiştir.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-semibold text-gray-900">5. Kişisel Verilerin İşlenmesi ve Görüntülenmesi</h4>
                <p className="text-gray-600 leading-relaxed">
                  Kişisel veriler;
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Platformun teknik işleyişinin sağlanması,</li>
                  <li>Oyuncu ve yöneticilerin eşleştirilmesi,</li>
                  <li>Organizasyon ve maç yönetiminin yapılabilmesi</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-3">
                  amaçlarıyla sınırlı olarak işlenir.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  MeraFootball, kişisel verilerinizi <strong>platform dışındaki üçüncü kişilerle paylaşmaz</strong>; 
                  yalnızca platformun işlevselliği kapsamında ve kullanıcıların açık rızası doğrultusunda, 
                  <strong> sadece platform üyeleri arasında</strong> görüntülenmesini sağlar. 
                  Platforma üye olmayan kişiler bu bilgilere erişemez.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-semibold text-gray-900">6. Kullanıcının Hakları</h4>
                <p className="text-gray-600 leading-relaxed">
                  Kullanıcı;
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Profilindeki bilgileri dilediği zaman güncelleyebilir,</li>
                  <li>Gösterilen veya gizlenen alanlar üzerindeki tercihlerini değiştirebilir,</li>
                  <li>Hesabını silme talebinde bulunabilir.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-semibold text-gray-900">7. Kabul ve Yürürlük</h4>
                <p className="text-gray-600 leading-relaxed">
                  Kullanıcı, MeraFootball platformuna üye olarak;
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Bu metinde yer alan tüm koşulları,</li>
                  <li>Kişisel verilerinin belirtilen şekilde işlenmesini ve görüntülenmesini</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-3">
                  kabul etmiş sayılır.
                </p>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTermsModal(false)}
            >
              Kapat
            </Button>
            <Button
              onClick={() => {
                setAgreedToTerms(true)
                setShowTermsModal(false)
              }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Kabul Ediyorum
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

