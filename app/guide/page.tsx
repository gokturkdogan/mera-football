'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Target, 
  Users, 
  Building2, 
  Calendar, 
  Trophy,
  Star,
  DollarSign,
  Shield,
  CheckCircle2,
  ArrowRight,
  Crown,
  User,
  Settings,
  MapPin,
  Bell,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Layout,
  Target as TargetIcon,
  Footprints,
  Ruler,
  Weight,
  Clock,
  Camera,
  MessageSquare,
  Sparkles,
  CreditCard,
  CalendarDays,
  Zap
} from 'lucide-react'

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<'admin' | 'player'>('admin')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Kullanım Kılavuzu
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            MeraFootball platformunu kullanarak futbol organizasyonlarınızı yönetin, maçlar düzenleyin ve oyuncuları değerlendirin.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          <Button
            variant={activeTab === 'admin' ? 'default' : 'outline'}
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-6 py-3 text-base font-medium transition-all ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg border-0'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300'
            }`}
          >
            <Crown className="w-5 h-5" />
            Yönetici Profili
          </Button>
          <Button
            variant={activeTab === 'player' ? 'default' : 'outline'}
            onClick={() => setActiveTab('player')}
            className={`flex items-center gap-2 px-6 py-3 text-base font-medium transition-all ${
              activeTab === 'player'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg border-0'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300'
            }`}
          >
            <Users className="w-5 h-5" />
            Oyuncu Profili
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'admin' ? (
          <div className="space-y-6">
            {/* 1. Profil Oluşturma */}
            <Card className="shadow-lg border-2 border-yellow-100">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b-2 border-yellow-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="w-6 h-6 text-yellow-600" />
                  Profil Oluşturma ve Tamamlama
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Platforma ilk adım: Hesap oluşturma ve profilinizi tamamlama
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-600 font-bold">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Hesap Oluşturun</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Kayıt sayfasından email ve şifre ile hesabınızı oluşturun. Sistemin tüm özelliklerine erişmek için giriş yapmanız yeterli.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-600 font-bold">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Profil Bilgilerinizi Tamamlayın</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Profil sayfasından kişisel bilgilerinizi ekleyin: mevki tercihiniz, güçlü ayağınız, boy, kilo, yaş gibi bilgiler.
                        Bu bilgiler maç organizasyonunda ve eşit takımlar oluştururken size yardımcı olacaktır.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Crown className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Yönetici = Oyuncu</h3>
                      <p className="text-sm text-gray-600">
                        Unutmayın: Her yönetici aynı zamanda maçlara katılabilen bir oyuncudur. Organizasyonunuzu yönetirken 
                        kendinizi de maçlara ekleyebilir ve oyuncu istatistiklerinizi takip edebilirsiniz.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Profil Paylaşım Ayarları */}
            <Card className="shadow-lg border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Settings className="w-6 h-6 text-blue-600" />
                  Profil Paylaşım Ayarları
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Hangi bilgilerinizin diğer oyuncularla paylaşılacağını kontrol edin
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-sm text-gray-700 mb-4">
                    Profil sayfanızda her bilgi için bir paylaşım seçeneği bulunur. Bu sayede hangi bilgilerinizin 
                    <strong className="text-gray-900"> listeleme sayfalarında ve detay sayfalarında</strong> görüntüleneceğini kontrol edebilirsiniz.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">Telefon Numarası</h4>
                      </div>
                      <p className="text-xs text-gray-600">
                        İsterseniz telefon numaranızı organizasyon üyeleriyle paylaşabilirsiniz.
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TargetIcon className="w-5 h-5 text-orange-600" />
                        <h4 className="font-semibold text-gray-900">Mevki Tercihi</h4>
                      </div>
                      <p className="text-xs text-gray-600">
                        Tercih ettiğiniz mevkiyi diğer oyuncularla paylaşın.
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Footprints className="w-5 h-5 text-yellow-600" />
                        <h4 className="font-semibold text-gray-900">Güçlü Ayak</h4>
                      </div>
                      <p className="text-xs text-gray-600">
                        Güçlü ayağınızı paylaşarak takım kurulumuna katkı sağlayın.
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Ruler className="w-5 h-5 text-purple-600" />
                        <h4 className="font-semibold text-gray-900">Fiziksel Bilgiler</h4>
                      </div>
                      <p className="text-xs text-gray-600">
                        Boy, kilo, yaş gibi fiziksel özelliklerinizi paylaşabilirsiniz.
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800 flex items-start gap-2">
                      <Eye className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        Paylaşım ayarlarınızı değiştirdiğinizde, bu bilgiler oyuncular listesi ve detay sayfalarında 
                        <EyeOff className="w-3 h-3 inline mx-1" /> simgesi ile gizlenir veya görüntülenir.
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Organizasyon Oluşturma */}
            <Card className="shadow-lg border-2 border-green-100">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Building2 className="w-6 h-6 text-green-600" />
                  Organizasyon Oluşturma ve Yönetimi
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Kendi organizasyonunuzu oluşturun ve üyelerinizi yönetin
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Organizasyon Oluşturun</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Dashboard sayfanızdan "Yeni Organizasyon" butonuna tıklayarak organizasyonunuzu oluşturun. 
                        Organizasyon adı ve kısa bir açıklama ekleyin. İsterseniz organizasyon logo'su da yükleyebilirsiniz.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Üye Davet ve Onay Sistemi</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Organizasyonunuza üyeler iki şekilde katılabilir:
                      </p>
                      <ul className="space-y-2 ml-4 mt-2">
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <ArrowRight className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Davet:</strong> Organizasyon sayfasından üyeleri doğrudan davet edebilirsiniz.</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-600">
                          <ArrowRight className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Başvuru:</strong> Oyuncular organizasyonunuza katılmak için başvuru yapabilir, siz de onaylayabilir veya reddedebilirsiniz.</span>
                        </li>
                      </ul>
                      <p className="text-sm text-gray-600 mt-3">
                        Organizasyon detay sayfasından gelen tüm üyelik isteklerini görüntüleyebilir, onaylayabilir veya reddedebilirsiniz.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4. Tesis Yönetimi */}
            <Card className="shadow-lg border-2 border-purple-100">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <MapPin className="w-6 h-6 text-purple-600" />
                  Tesis Yönetimi
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Organizasyonunuzun tesislerini ekleyin ve hızlıca maç organize edin
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      Tesis Ekleme ve Bilgilendirme
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Organizasyonunuzun düzenli olarak kullandığı tesisleri sisteme ekleyerek maç organizasyonunu kolaylaştırın.
                    </p>
                    <div className="grid md:grid-cols-2 gap-3 mt-3">
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="text-xs font-semibold text-purple-900 mb-1">Konum Bilgisi</h4>
                        <p className="text-xs text-purple-700">
                          Tesis adı ve adresi ekleyin. Bu bilgiler maç oluştururken otomatik doldurulur.
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="text-xs font-semibold text-purple-900 mb-1">Tesis Ücreti</h4>
                        <p className="text-xs text-purple-700">
                          Tesis kiralama ücretini kaydedin. Maç organizasyonunda maliyet hesaplamalarınızı kolaylaştırır.
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="text-xs font-semibold text-purple-900 mb-1">Kapasite</h4>
                        <p className="text-xs text-purple-700">
                          Sahaya kaç oyuncu sığacağını belirtin. Eşit takım kurulumunda rehber olur.
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="text-xs font-semibold text-purple-900 mb-1">Diğer Özellikler</h4>
                        <p className="text-xs text-purple-700">
                          İç mekan/dış mekan, saha tipi (çim/sentetik) gibi bilgileri de kaydedebilirsiniz.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 5. Maç Oluşturma ve Organizasyon */}
            <Card className="shadow-lg border-2 border-orange-100">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b-2 border-orange-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Calendar className="w-6 h-6 text-orange-600" />
                  Maç Oluşturma ve Organizasyon
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Maçları oluşturun, kadro kurun ve bildirim gönderin
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      Maç Oluşturma
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Organizasyon detay sayfasından "Yeni Maç" butonuna tıklayarak maç oluşturun. 
                      Tarih, saat, tesis seçimi ve saha kapasitesi gibi bilgileri girin. Maç oluşturulduğunda 
                      organizasyonunuzdaki tüm onaylı üyelere otomatik olarak <strong className="text-gray-900">bildirim gönderilir</strong>.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-orange-600" />
                      Bildirim ve Katılım Sistemi
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Maç oluşturulduğunda organizasyondaki tüm oyunculara bildirim gönderilir. Oyuncular:
                    </p>
                    <ul className="space-y-2 ml-4 mt-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Maça katılmak istediklerini belirtebilir ve onay isteği gönderebilirler.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Yönetici olarak katılım isteklerini onaylayarak oyuncuları maç listesine ekleyebilirsiniz.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Maç gününe kadar katılım durumunu takip edebilir ve gerekirse yeni oyuncular ekleyebilirsiniz.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Maç Statüleri ve İzinler */}
            <Card className="shadow-lg border-2 border-cyan-100">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b-2 border-cyan-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Settings className="w-6 h-6 text-cyan-600" />
                  Maç Statüleri ve İzinler
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Her maç statüsünde hangi işlemlerin yapılabileceğini öğrenin
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-sm text-gray-700 mb-4">
                    Maçlarınız <strong className="text-gray-900">4 farklı statü</strong>de olabilir. Her statüde farklı işlemler yapılabilir. 
                    Maç detay sayfasından statüyü değiştirebilirsiniz.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* DRAFT */}
                    <div className="p-4 bg-white rounded-lg border-2 border-gray-300">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-700 font-bold text-xs">1</span>
                        </div>
                        <h3 className="font-semibold text-gray-900">Kadro Kuruluyor</h3>
                        <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">DRAFT</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">
                        Maçın ilk oluşturulduğu statü. Kadro ve diziliş işlemleri için kullanılır.
                      </p>
                      <ul className="space-y-1.5 text-xs text-gray-600">
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Kadroya oyuncu ekleme/çıkarma</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Diziliş oluşturma ve düzenleme (sürükle-bırak)</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Tarih, saat, tesis bilgisi güncelleme</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Oyuncu genel ortalama puanlarını görüntüleme</span>
                        </li>
                      </ul>
                    </div>

                    {/* UPCOMING */}
                    <div className="p-4 bg-white rounded-lg border-2 border-blue-300">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-700 font-bold text-xs">2</span>
                        </div>
                        <h3 className="font-semibold text-gray-900">Kadrolar Hazır</h3>
                        <span className="text-xs px-2 py-1 bg-blue-200 text-blue-700 rounded">UPCOMING</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">
                        Kadro en az 10 oyuncu ve tesis bilgisi girildikten sonra geçilebilir. Maç hazır demektir.
                      </p>
                      <ul className="space-y-1.5 text-xs text-gray-600">
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Maç bilgilerini görüntüleme</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Kadro ve diziliş görüntüleme (düzenleme kapalı)</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-400">Kadro güncelleme kapalı</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-400">Diziliş düzenleme kapalı</span>
                        </li>
                      </ul>
                    </div>

                    {/* FINISHED */}
                    <div className="p-4 bg-white rounded-lg border-2 border-orange-300">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-700 font-bold text-xs">3</span>
                        </div>
                        <h3 className="font-semibold text-gray-900">Oynandı</h3>
                        <span className="text-xs px-2 py-1 bg-orange-200 text-orange-700 rounded">FINISHED</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">
                        Maç tamamlandığında bu statüye geçilir. Skor ve puanlama işlemleri yapılabilir.
                      </p>
                      <ul className="space-y-1.5 text-xs text-gray-600">
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 mt-0.5 flex-shrink-0" />
                          <span>Skor ve gol girişi</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 mt-0.5 flex-shrink-0" />
                          <span>Oyuncu puanlama (yıldız sistemi)</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 mt-0.5 flex-shrink-0" />
                          <span>Maç bazlı ortalama puanların görüntülenmesi</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-400">Kadro ve diziliş düzenleme kapalı</span>
                        </li>
                      </ul>
                    </div>

                    {/* PUBLISHED */}
                    <div className="p-4 bg-white rounded-lg border-2 border-green-300">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-green-700" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Tamamlandı</h3>
                        <span className="text-xs px-2 py-1 bg-green-200 text-green-700 rounded">PUBLISHED</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">
                        Maçın final statüsü. Tüm işlemler tamamlanmış ve sonuçlar kesinleşmiş demektir.
                      </p>
                      <ul className="space-y-1.5 text-xs text-gray-600">
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Maç sonuçlarını görüntüleme</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Oyuncu istatistiklerini görüntüleme</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Puanlama sonuçlarını görüntüleme</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-400">Hiçbir düzenleme yapılamaz</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                    <p className="text-xs text-cyan-800 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Statü Değişikliği:</strong> Maç detay sayfasından statü butonlarına tıklayarak maçı bir sonraki aşamaya 
                        ilerletebilirsiniz. Her statü geçişinde gerekli kontroller otomatik yapılır (örneğin "Kadrolar Hazır" için en az 10 oyuncu gereklidir).
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 6. Kadro Kurma ve Diziliş */}
            <Card className="shadow-lg border-2 border-indigo-100">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b-2 border-indigo-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Layout className="w-6 h-6 text-indigo-600" />
                  Kadro Kurma ve Diziliş Oluşturma
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Sürükle-bırak yöntemi ile eşit takımlar oluşturun
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      Kadroya Oyuncu Ekleme
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Maç detay sayfasında "Kadro Ekle" butonu ile oyuncuları kadroya ekleyin. 
                      Organizasyon üyeleri listesinden seçebilir veya daha önce onayladığınız katılım isteklerini otomatik olarak kadroya alabilirsiniz.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Layout className="w-5 h-5 text-indigo-600" />
                      Diziliş Oluşturma (Sürükle-Bırak)
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Kadroya eklenen oyuncuları <strong className="text-gray-900">sürükle-bırak</strong> yöntemi ile sahaya yerleştirin:
                    </p>
                    <ul className="space-y-2 ml-4 mt-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <span>Oyuncuları sahaya sürükleyin ve istediğiniz pozisyona bırakın.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <span>Diziliş önizlemesini anlık olarak görüntüleyin ve düzenleyin.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <span>Oyuncuların genel ortalama puanlarını görebilir, eşit güçte takımlar oluşturabilirsiniz.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <p className="text-xs text-indigo-800 flex items-start gap-2">
                      <Star className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>İpucu:</strong> Kadro kurarken oyuncuların genel ortalama puanlarını göz önünde bulundurarak 
                        daha eşit ve dengeli takımlar oluşturabilirsiniz. Bu bilgiler sadece <strong>DRAFT</strong> statüsündeki maçlarda görünür.
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 7. Oylama ve Puanlama Sistemi */}
            <Card className="shadow-lg border-2 border-yellow-100">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b-2 border-yellow-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Star className="w-6 h-6 text-yellow-600" />
                  Oyuncu Puanlama ve Oylama Sistemi
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Maç sonrası oyuncuları yıldız sistemi ile değerlendirin
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      Puanlama Nasıl Çalışır?
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Maç bittiğinde ve <strong className="text-gray-900">"Oynandı"</strong> statüsüne geçildiğinde, 
                      "Oyuncu Puanlama" butonu aktif olur. Bu butona tıklayarak tüm oyuncuları yıldız sistemi ile değerlendirebilirsiniz.
                    </p>
                    <ul className="space-y-2 ml-4 mt-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Herkes Herkesi Puanlar:</strong> Maçta oynayan her oyuncu, diğer tüm oyuncuları 1-5 yıldız arası puanlayabilir.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Maç Bazlı Ortalama:</strong> Her oyuncunun o maç için aldığı puanların ortalaması hesaplanır ve kaydedilir.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Genel Ortalama Güncelleme:</strong> Her maçın ortalama puanı, oyuncunun genel ortalama puanına eklenir ve güncellenir.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Kendini Puanlama:</strong> Oyuncular kendilerini de puanlayabilirler.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs text-yellow-800 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        Puanlama sistemi sayesinde oyuncuların performanslarını objektif bir şekilde takip edebilir 
                        ve gelecek maçlarda daha eşit takımlar oluşturabilirsiniz. Ortalama puanlar oyuncu profillerinde ve listelerinde görüntülenir.
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 8. Skor ve Gol Girişi */}
            <Card className="shadow-lg border-2 border-red-100">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b-2 border-red-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Trophy className="w-6 h-6 text-red-600" />
                  Skor ve Gol Girişi
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Maç sonuçlarını kaydedin ve istatistikleri tutun
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-red-600" />
                      Skorboard ile Skor Girişi
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Maç detay sayfasında "Skor Gir" butonunu kullanarak maç sonucunu girebilirsiniz:
                    </p>
                    <ul className="space-y-2 ml-4 mt-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Takım A ve Takım B için skorları girin.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Her golü atan oyuncuyu ve hangi takım için attığını belirtin.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Gol atan oyuncuların istatistikleri otomatik olarak güncellenir.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Target className="w-5 h-5 text-red-600" />
                      İstatistik Takibi
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tüm goller oyuncu profillerinde ve organizasyon istatistiklerinde otomatik olarak tutulur. 
                      Oyuncuların toplam gol sayıları, oynadıkları maç sayıları ve ortalama puanları güncel olarak görüntülenir.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 8.5. Maç Fotoğrafı ve Yorumlar */}
            <Card className="shadow-lg border-2 border-pink-100">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 border-b-2 border-pink-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Camera className="w-6 h-6 text-pink-600" />
                  Maç Fotoğrafı ve Yorumlar
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Maç anılarını kaydedin ve oyuncu yorumlarını yönetin
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-pink-600" />
                      Maç Fotoğrafı Yükleme
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Maç <strong className="text-gray-900">"Oynandı"</strong> statüsüne geçildikten sonra, 
                      maç detay sayfasından <strong className="text-gray-900">1 adet maç fotoğrafı</strong> yükleyebilirsiniz. 
                      Bu fotoğraf maç detay sayfasında sergilenir ve oyuncular tarafından görüntülenebilir.
                    </p>
                    <div className="p-3 bg-pink-50 rounded-lg border border-pink-200 mt-3">
                      <p className="text-xs text-pink-800 flex items-start gap-2">
                        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Premium Özellik:</strong> Maç fotoğrafı yükleme özelliği Premium ve Premium Plus planlarda mevcuttur.
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-pink-600" />
                      Maç Yorumları
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Maç <strong className="text-gray-900">"Oynandı"</strong> statüsüne geçildikten sonra, 
                      maçta oynayan her oyuncu maç hakkında <strong className="text-gray-900">1 adet yorum</strong> yapabilir. 
                      Yorumlar maç detay sayfasında sergilenir.
                    </p>
                    <ul className="space-y-2 ml-4 mt-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Yorum Kontrolü:</strong> Yönetici olarak istediğiniz yorumu kaldırabilirsiniz.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Her Oyuncu 1 Yorum:</strong> Maçta oynayan her oyuncu sadece 1 yorum yapabilir.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Görüntüleme:</strong> Yorumlar maç detay sayfasında tüm oyuncular tarafından görüntülenebilir.</span>
                      </li>
                    </ul>
                    <div className="p-3 bg-pink-50 rounded-lg border border-pink-200 mt-3">
                      <p className="text-xs text-pink-800 flex items-start gap-2">
                        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Premium Özellik:</strong> Maç yorumları özelliği Premium ve Premium Plus planlarda mevcuttur.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 6.5. Detaylı Diziliş Kurma Sistemi */}
            <Card className="shadow-lg border-2 border-violet-100">
              <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b-2 border-violet-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Layout className="w-6 h-6 text-violet-600" />
                  Detaylı Diziliş Kurma Sistemi
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Geniş ekranda istatistiklerle diziliş oluşturun
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Layout className="w-5 h-5 text-violet-600" />
                      Gelişmiş Diziliş Arayüzü
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong className="text-gray-900">Detaylı diziliş kurma sistemi</strong> ile geniş bir ekranda 
                      maçı kabul eden oyuncuların <strong className="text-gray-900">tüm istatistik bilgilerinin</strong> 
                      yer aldığı büyük bir detay ekranında daha profesyonel dizilişler oluşturabilirsiniz.
                    </p>
                    <ul className="space-y-2 ml-4 mt-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                        <span>Oyuncuların tüm istatistik bilgileri (gol sayısı, maç sayısı, ortalama puan, mevki, fiziksel özellikler) görüntülenir.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                        <span>Geniş ekran arayüzü ile daha detaylı takım kurulumu yapabilirsiniz.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                        <span>İstatistiklere göre daha dengeli ve rekabetçi takımlar oluşturabilirsiniz.</span>
                      </li>
                    </ul>
                    <div className="p-3 bg-violet-50 rounded-lg border border-violet-200 mt-3">
                      <p className="text-xs text-violet-800 flex items-start gap-2">
                        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Premium Plus Özellik:</strong> Detaylı diziliş kurma sistemi sadece Premium Plus planında mevcuttur.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 6.6. Yapay Zeka Destekli Kadro Öneri Sistemi */}
            <Card className="shadow-lg border-2 border-cyan-100">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b-2 border-cyan-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Sparkles className="w-6 h-6 text-cyan-600" />
                  Yapay Zeka Destekli Kadro Öneri Sistemi
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  AI asistanı ile en rekabetçi kadroları oluşturun
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-cyan-600" />
                      AI Asistanı Nasıl Çalışır?
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong className="text-gray-900">Yapay zeka destekli kadro öneri sistemi</strong>, 
                      organizasyonunuzun <strong className="text-gray-900">geçmiş maçlarını</strong>, 
                      <strong className="text-gray-900"> oyuncu istatistiklerini</strong> ve 
                      <strong className="text-gray-900"> bilgilerini</strong> analiz ederek 
                      <strong className="text-gray-900"> en rekabetçi olabilecek iki kadroyu</strong> size önerir.
                    </p>
                    <ul className="space-y-2 ml-4 mt-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Geçmiş Maç Analizi:</strong> Organizasyonunuzun önceki maçlarını ve sonuçlarını inceler.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Oyuncu İstatistikleri:</strong> Her oyuncunun gol sayısı, maç sayısı, ortalama puanı ve FIFA kartı puanlarını değerlendirir.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Rekabetçi Kadro:</strong> En dengeli ve rekabetçi iki takımı otomatik olarak önerir.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Öneriyi Kullanma:</strong> AI'ın önerdiği kadroyu kabul edebilir veya manuel olarak düzenleyebilirsiniz.</span>
                      </li>
                    </ul>
                    <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200 mt-3">
                      <p className="text-xs text-cyan-800 flex items-start gap-2">
                        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Premium Plus Özellik:</strong> Yapay zeka destekli kadro öneri sistemi sadece Premium Plus planında mevcuttur.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 6.7. Oyuncu FIFA Kartı Sistemi */}
            <Card className="shadow-lg border-2 border-amber-100">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b-2 border-amber-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <CreditCard className="w-6 h-6 text-amber-600" />
                  Oyuncu FIFA Kartı Sistemi
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Oyuncuları detaylı özelliklerle değerlendirin
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                      FIFA Kartı Nasıl Oluşturulur?
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Organizasyon içerisindeki oyuncular, birbirlerine 
                      <strong className="text-gray-900"> hız, şut, pas, dripling, defans</strong> gibi konularda 
                      <strong className="text-gray-900"> 99 üzerinden puanlar</strong> verebilirler. 
                      Bu oylama tamamlandıktan sonra tüm oyuncular için birer FIFA kartı oluşur.
                    </p>
                    <ul className="space-y-2 ml-4 mt-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span><strong>5 Farklı Özellik:</strong> Hız, Şut, Pas, Dripling, Defans (her biri 99 üzerinden)</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Oylama Sistemi:</strong> Organizasyon üyeleri birbirlerini değerlendirir.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span><strong>FIFA Kartı Oluşturma:</strong> Oylama tamamlandıktan sonra her oyuncu için bir FIFA kartı oluşturulur.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span><strong>AI Kadro Önerilerinde Kullanım:</strong> FIFA kartı puanları yapay zeka destekli kadro önerilerinde göz önünde bulundurulur.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Profil Görüntüleme:</strong> FIFA kartları oyuncu profillerinde görüntülenebilir.</span>
                      </li>
                    </ul>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 mt-3">
                      <p className="text-xs text-amber-800 flex items-start gap-2">
                        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Premium Plus Özellik:</strong> Oyuncu FIFA Kartı sistemi sadece Premium Plus planında mevcuttur.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 5.5. Otomatik Maç Oluşturma Sistemi */}
            <Card className="shadow-lg border-2 border-teal-100">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b-2 border-teal-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <CalendarDays className="w-6 h-6 text-teal-600" />
                  Otomatik Maç Oluşturma Sistemi
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Maç şablonları ile otomatik maç organizasyonu
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-teal-600" />
                      Maç Şablonu Oluşturma
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong className="text-gray-900">Otomatik maç oluşturma sistemi</strong> ile 
                      yönetici olarak bir <strong className="text-gray-900">maç şablonu</strong> belirleyebilir ve 
                      <strong className="text-gray-900"> haftanın kendi seçtiğiniz gününde</strong> o maçın otomatik olarak oluşturulmasını sağlayabilirsiniz.
                    </p>
                    <ul className="space-y-2 ml-4 mt-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Maç Şablonu:</strong> Tesis, saat, saha kapasitesi gibi bilgileri içeren bir şablon oluşturun.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Haftalık Gün Seçimi:</strong> Haftanın hangi gününde maçın oluşturulacağını seçin (örneğin: Her Pazar).</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Otomatik Oluşturma:</strong> Seçilen günden 3 gün önce maç otomatik olarak oluşturulur.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Bildirim Gönderimi:</strong> Maç oluşturulduğunda organizasyondaki tüm oyunculara bildirim gönderilir.</span>
                      </li>
                    </ul>
                    <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 mt-3">
                      <p className="text-xs text-teal-800 flex items-start gap-2">
                        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Premium Plus Özellik:</strong> Otomatik maç oluşturma sistemi sadece Premium Plus planında mevcuttur.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 9. Premium Üyelik (Kısa) */}
            <Card className="shadow-lg border-2 border-emerald-100">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Shield className="w-6 h-6 text-emerald-600" />
                  Planlar ve Limitler
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Ücretsiz, Premium ve Premium Plus plan özellikleri hakkında bilgi
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-sm text-gray-700 mb-4">
                    Platformumuz <strong className="text-gray-900">Ücretsiz</strong>, 
                    <strong className="text-gray-900"> Premium</strong> ve 
                    <strong className="text-gray-900"> Premium Plus</strong> olmak üzere üç plana sahiptir. 
                    Organizasyon sayısı, üye limitleri, maç sınırları ve özellikler plan tipine göre değişiklik gösterir.
                  </p>
                  <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <p className="text-sm text-yellow-900 flex items-start gap-2">
                      <Zap className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Önemli Not:</strong> Bu kılavuzda bahsedilen tüm özellikler her planda sunulmamaktadır. 
                        Bazı özellikler sadece Premium veya Premium Plus planlarında mevcuttur. 
                        Detaylı bilgi için <Link href="/plans" className="font-semibold underline underline-offset-2 text-yellow-800 hover:text-yellow-900">Premium Programı</Link> sayfasını inceleyebilirsiniz.
                      </span>
                    </p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div className="p-4 bg-white rounded-lg border-2 border-gray-300">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-5 h-5 text-gray-600" />
                        <h3 className="font-semibold text-gray-900">Ücretsiz Plan</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>1 organizasyon</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>2 maç / organizasyon</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>14 üye / organizasyon</span>
                        </li>
                      </ul>
                    </div>
                    <div className="p-4 bg-white rounded-lg border-2 border-yellow-500">
                      <div className="flex items-center gap-2 mb-3">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                        <h3 className="font-semibold text-gray-900">Premium Plan</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span>3 organizasyon</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span>Sınırsız maç</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span>Sınırsız üye</span>
                        </li>
                      </ul>
                    </div>
                    <div className="p-4 bg-white rounded-lg border-2 border-purple-500">
                      <div className="flex items-center gap-2 mb-3">
                        <Crown className="w-5 h-5 text-purple-600" />
                        <h3 className="font-semibold text-gray-900">Premium Plus</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span>5 organizasyon</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span>Tüm Premium özellikleri</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span>+ Gelişmiş özellikler</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-xs text-emerald-800">
                      <strong>Daha fazla bilgi:</strong> Detaylı özellik karşılaştırması ve plan bilgilerini 
                      <Link href="/plans" className="inline-flex items-center gap-1 ml-1 text-emerald-700 hover:text-emerald-900 font-medium underline underline-offset-2">
                        Premium Programı Sayfası
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                      'ndan inceleyebilirsiniz.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 1. Profil Oluşturma */}
            <Card className="shadow-lg border-2 border-green-100">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="w-6 h-6 text-green-600" />
                  Profil Oluşturma ve Tamamlama
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Platforma ilk adım: Hesap oluşturma ve profilinizi tamamlama
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 font-bold">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Hesap Oluşturun</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Kayıt sayfasından email ve şifre ile hesabınızı oluşturun. Sistemin tüm özelliklerine erişmek için giriş yapmanız yeterli.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Profil Bilgilerinizi Tamamlayın</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Profil sayfanızdan kişisel bilgilerinizi ekleyin: mevki tercihiniz, güçlü ayağınız, boy, kilo, yaş gibi bilgiler.
                        Bu bilgiler sayesinde yöneticiler sizi daha kolay bulabilir ve uygun takımlara ekleyebilir.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Profil Paylaşım Ayarları */}
            <Card className="shadow-lg border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Settings className="w-6 h-6 text-blue-600" />
                  Profil Paylaşım Ayarları
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Hangi bilgilerinizin listeleme sayfalarında görüntüleneceğini seçin
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-blue-600" />
                      Bilgilerinizi Paylaşın, Fırsatları Artırın
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Profil sayfanızda her bilgi için bir paylaşım seçeneği bulunur. 
                      <strong className="text-gray-900"> Ne kadar çok bilgi listelerseniz</strong>, farklı organizasyonlardan 
                      oyuncu arayan yöneticilerin sizi bulması ve iletişime geçmesi o kadar kolay olur.
                    </p>
                    <div className="grid md:grid-cols-2 gap-3 mt-3">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="text-xs font-semibold text-blue-900 mb-1">Telefon Numarası</h4>
                        <p className="text-xs text-blue-700">
                          Paylaşırsanız yöneticiler size daha hızlı ulaşabilir.
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="text-xs font-semibold text-blue-900 mb-1">Mevki Tercihi</h4>
                        <p className="text-xs text-blue-700">
                          Hangi pozisyonda oynamayı tercih ettiğinizi gösterin.
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="text-xs font-semibold text-blue-900 mb-1">Güçlü Ayak</h4>
                        <p className="text-xs text-blue-700">
                          Güçlü ayağınızı paylaşarak takım kurulumuna yardımcı olun.
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="text-xs font-semibold text-blue-900 mb-1">Fiziksel Bilgiler</h4>
                        <p className="text-xs text-blue-700">
                          Boy, kilo, yaş gibi bilgiler eşit takım kurulumunda faydalıdır.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>İpucu:</strong> Listeleme sayfalarında ve oyuncu detay sayfalarında paylaştığınız bilgiler 
                        görüntülenir. Daha fazla bilgi paylaşmak, yöneticilerin sizi bulmasını ve maçlara davet etmesini kolaylaştırır.
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Organizasyonlara Katılma */}
            <Card className="shadow-lg border-2 border-purple-100">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Building2 className="w-6 h-6 text-purple-600" />
                  Organizasyonlara Katılma
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Organizasyonlara katılın ve futbol topluluğuna dahil olun
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      Organizasyonlara Nasıl Katılabilirsiniz?
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Platformda iki şekilde organizasyona katılabilirsiniz:
                    </p>
                    <ul className="space-y-3 ml-4 mt-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-gray-900">Katılma İsteği Gönderme:</strong> Organizasyonlar sayfasından beğendiğiniz 
                          organizasyonu bulun ve "Katılma İsteği Gönder" butonuna tıklayın. Yönetici isteğinizi onayladığında 
                          organizasyonun bir üyesi olursunuz.
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-gray-900">Davet Kabul Etme:</strong> Yöneticiler sizi doğrudan davet edebilir. 
                          Dashboard veya bildirimlerden gelen davetleri kabul ederek organizasyona katılabilirsiniz.
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      Organizasyon Bulma
                    </h3>
                    <p className="text-sm text-gray-600">
                      <strong className="text-gray-900">Arkadaşlarınızla bir organizasyona katılabileceğiniz gibi</strong>, 
                      Organizasyonlar sayfasından yeni topluluklar da bulabilirsiniz. Farklı organizasyonlara üye olarak 
                      daha geniş bir oyuncu ağına sahip olabilir ve daha fazla maç fırsatı yakalayabilirsiniz.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4. Maç Bildirimleri ve Katılım */}
            <Card className="shadow-lg border-2 border-orange-100">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b-2 border-orange-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Bell className="w-6 h-6 text-orange-600" />
                  Maç Bildirimleri ve Katılım
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Maç bildirimlerini alın ve katılım sürecini takip edin
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-orange-600" />
                      Bildirim Sistemi
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong className="text-gray-900">Yöneticiniz yeni bir maç oluşturduğunda</strong>, organizasyonun onaylı 
                      tüm üyelerine otomatik olarak bildirim gönderilir. Bu bildirimler sayesinde:
                    </p>
                    <ul className="space-y-2 ml-4 mt-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Maç tarihi, saati, tesis bilgilerini öğrenebilirsiniz.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Maça katılmak istediğinizi belirtebilir ve katılım isteği gönderebilirsiniz.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Yönetici isteğinizi onayladığında maç listesine eklenirsiniz.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      Maç Bilgilerini Takip Etme
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Maç detay sayfasından <strong className="text-gray-900">anlık olarak</strong> şunları takip edebilirsiniz:
                    </p>
                    <ul className="space-y-2 ml-4 mt-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Maç Tarihi ve Saati:</strong> Maç ne zaman yapılacak?</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Kadro Durumu:</strong> Kaç oyuncu var, kimler kadroya seçildi?</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Tesis Bilgisi:</strong> Konum, ücret, saha özellikleri nelerdir?</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Diziliş:</strong> Kadrolar hazırsa hangi takımda oynayacaksınız?</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-xs text-orange-800 flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Kadroya Seçilme:</strong> Yönetici maç detay sayfasından sizi kadroya eklediğinde, 
                        "Kadrolar Hazır" statüsüne geçildiğinde hangi takımda oynayacağınızı görebilirsiniz.
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 5. Maç Sonrası Puanlama */}
            <Card className="shadow-lg border-2 border-yellow-100">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b-2 border-yellow-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Star className="w-6 h-6 text-yellow-600" />
                  Maç Sonrası Puanlama
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Maçta yer alan oyuncuları puanlayın ve puanlanın
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      Oyuncu Puanlama Sistemi
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Maç bittiğinde ve <strong className="text-gray-900">"Oynandı"</strong> statüsüne geçildiğinde, 
                      "Oyuncu Puanlama" butonu aktif olur. Bu butona tıklayarak maçta yer alan tüm oyuncuları 
                      1-5 yıldız arası puanlayabilirsiniz.
                    </p>
                    <ul className="space-y-2 ml-4 mt-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Herkes Herkesi Puanlar:</strong> Maçta oynayan her oyuncu, diğer tüm oyuncuları puanlayabilir.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Kendinizi Puanlama:</strong> Kendinizi de puanlayabilirsiniz.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Siz de Puanlanırsınız:</strong> Maçtaki diğer oyuncular sizi de puanlayacaktır.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Ortalama Hesaplama:</strong> Aldığınız tüm puanların ortalaması hesaplanır ve profilinize yansır.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs text-yellow-800 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        Puanlamalar sayesinde <strong>oyuncu profiliniz oluşur</strong>. Ortalama puanınız oyuncular listesi ve 
                        detay sayfalarında görüntülenir, yöneticiler sizi tanıyabilir ve uygun maçlara davet edebilir.
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 5.5. Maç Fotoğrafı ve Yorumlar (Oyuncu) */}
            <Card className="shadow-lg border-2 border-pink-100">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 border-b-2 border-pink-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Camera className="w-6 h-6 text-pink-600" />
                  Maç Fotoğrafı ve Yorumlar
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Maç anılarını görüntüleyin ve yorumlarınızı paylaşın
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-pink-600" />
                      Maç Fotoğrafı Görüntüleme
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Yönetici tarafından yüklenen <strong className="text-gray-900">maç fotoğrafını</strong> 
                      maç detay sayfasından görüntüleyebilirsiniz. Maç anılarınızı bu şekilde saklayabilirsiniz.
                    </p>
                    <div className="p-3 bg-pink-50 rounded-lg border border-pink-200 mt-3">
                      <p className="text-xs text-pink-800 flex items-start gap-2">
                        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Premium Özellik:</strong> Maç fotoğrafı görüntüleme özelliği, organizasyonunuz Premium veya Premium Plus planına sahipse kullanılabilir.
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-pink-600" />
                      Maç Yorumları
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Maç <strong className="text-gray-900">"Oynandı"</strong> statüsüne geçildikten sonra, 
                      maçta oynayan her oyuncu maç hakkında <strong className="text-gray-900">1 adet yorum</strong> yapabilir. 
                      Yorumlar maç detay sayfasında sergilenir.
                    </p>
                    <ul className="space-y-2 ml-4 mt-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Yorum Yapma:</strong> Maçta oynadıysanız, maç hakkında 1 yorum yazabilirsiniz.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Yorum Görüntüleme:</strong> Diğer oyuncuların yorumlarını maç detay sayfasından okuyabilirsiniz.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Yorum Kontrolü:</strong> Yönetici uygunsuz yorumları kaldırabilir.</span>
                      </li>
                    </ul>
                    <div className="p-3 bg-pink-50 rounded-lg border border-pink-200 mt-3">
                      <p className="text-xs text-pink-800 flex items-start gap-2">
                        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Premium Özellik:</strong> Maç yorumları özelliği, organizasyonunuz Premium veya Premium Plus planına sahipse kullanılabilir.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 5.6. Oyuncu FIFA Kartı Sistemi (Oyuncu) */}
            <Card className="shadow-lg border-2 border-amber-100">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b-2 border-amber-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <CreditCard className="w-6 h-6 text-amber-600" />
                  Oyuncu FIFA Kartı Sistemi
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Organizasyon içinde birbirinizi değerlendirin ve FIFA kartınızı oluşturun
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                      FIFA Kartı Oluşturma ve Görüntüleme
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Organizasyon içerisindeki oyuncular, birbirlerine 
                      <strong className="text-gray-900"> hız, şut, pas, dripling, defans</strong> gibi konularda 
                      <strong className="text-gray-900"> 99 üzerinden puanlar</strong> verebilirler. 
                      Bu oylama tamamlandıktan sonra tüm oyuncular için birer FIFA kartı oluşur.
                    </p>
                    <ul className="space-y-2 ml-4 mt-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Oyuncuları Değerlendirme:</strong> Organizasyon üyelerini 5 farklı özellikte (Hız, Şut, Pas, Dripling, Defans) 99 üzerinden puanlayın.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span><strong>FIFA Kartı Oluşturma:</strong> Oylama tamamlandıktan sonra sizin için de bir FIFA kartı oluşturulur.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Profil Görüntüleme:</strong> FIFA kartınız oyuncu profilinizde görüntülenebilir.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span><strong>AI Kadro Önerilerinde:</strong> FIFA kartı puanlarınız yapay zeka destekli kadro önerilerinde göz önünde bulundurulur.</span>
                      </li>
                    </ul>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 mt-3">
                      <p className="text-xs text-amber-800 flex items-start gap-2">
                        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Premium Plus Özellik:</strong> Oyuncu FIFA Kartı sistemi, organizasyonunuz Premium Plus planına sahipse kullanılabilir.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 6. İstatistikler ve Profil Oluşturma */}
            <Card className="shadow-lg border-2 border-emerald-100">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Trophy className="w-6 h-6 text-emerald-600" />
                  İstatistikler ve Profil Geliştirme
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Performansınızı takip edin ve profilinizi geliştirin
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Target className="w-5 h-5 text-emerald-600" />
                      Otomatik İstatistik Takibi
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Platformda oynadığınız her maçta <strong className="text-gray-900">istatistikleriniz otomatik olarak kaydedilir</strong>:
                    </p>
                    <ul className="space-y-2 ml-4 mt-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Toplam Oynanan Maç:</strong> Kaç maça katıldınız?</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Toplam Atılan Gol:</strong> Kaç gol attınız?</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Ortalama Puan:</strong> Maçlarda aldığınız ortalama yıldız puanı</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-600" />
                      Profilinizi Görünür Yapın
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong className="text-gray-900">Gol istatistikleriniz kayıt edilsin</strong> ve 
                      <strong className="text-gray-900"> farklı insanlar tarafından görünsün</strong>. 
                      Oyuncu profiliniz:
                    </p>
                    <ul className="space-y-2 ml-4 mt-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>Oyuncular listesi sayfasında görüntülenir.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>Detay sayfanızda tüm istatistikleriniz ve maç geçmişiniz yer alır.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>Organizasyon yöneticileri sizi bulabilir ve maçlarına davet edebilir.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>Ortalama puanınız ve gol istatistikleriniz yıldız ve sayılar şeklinde gösterilir.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-xs text-emerald-800 flex items-start gap-2">
                      <Star className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Profil Oluşturma:</strong> Her maç sonrası puanlamalar ve gol istatistikleri sayesinde 
                        <strong className="text-emerald-900"> bir oyuncu profiliniz oluşur</strong>. Bu profil sayesinde 
                        yöneticiler sizi tanır, performansınızı değerlendirir ve uygun maçlara dahil eder.
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 6.5. Premium Avantajları (Oyuncu) */}
            <Card className="shadow-lg border-2 border-purple-100">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Crown className="w-6 h-6 text-purple-600" />
                  Premium Avantajları
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Organizasyonunuzun planına göre premium özelliklerden faydalanın
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Crown className="w-5 h-5 text-purple-600" />
                      Premium Organizasyon Üyeliği
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong className="text-gray-900">Premium programı yönetici bazlı ve organizasyona uygulanır</strong>. 
                      Eğer üye olduğunuz bir organizasyonun yöneticisi Premium veya Premium Plus planına sahipse, 
                      <strong className="text-gray-900"> siz de otomatik olarak premium avantajlarından faydalanabilirsiniz</strong>.
                    </p>
                    <ul className="space-y-2 ml-4 mt-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Maç Fotoğrafı:</strong> Premium organizasyonlarda maç fotoğraflarını görüntüleyebilirsiniz.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Maç Yorumları:</strong> Premium organizasyonlarda maç hakkında yorum yapabilir ve okuyabilirsiniz.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span><strong>FIFA Kartı (Premium Plus):</strong> Premium Plus organizasyonlarda FIFA kartı oluşturabilir ve görüntüleyebilirsiniz.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Sınırsız Maç ve Üye:</strong> Premium organizasyonlarda daha fazla maç fırsatı yakalayabilirsiniz.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-xs text-purple-800 flex items-start gap-2">
                      <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Önemli:</strong> Premium avantajları organizasyon bazlıdır. 
                        Üye olduğunuz organizasyonun planına göre bu özelliklerden faydalanırsınız. 
                        Detaylı bilgi için <Link href="/plans" className="font-semibold underline underline-offset-2 text-purple-800 hover:text-purple-900">Premium Programı</Link> sayfasını inceleyebilirsiniz.
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
