'use client'

import Navbar from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Üyelik Sözleşmesi
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            MeraFootball platformuna üye olarak, aşağıda belirtilen şartları okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan etmiş olursunuz.
          </p>
        </div>

        {/* Terms Content */}
        <Card className="shadow-lg border-2 border-green-100">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileText className="w-6 h-6 text-green-600" />
              MeraFootball Üyelik Sözleşmesi ve Kişisel Verilerin Kullanımı Hakkında Aydınlatma Metni
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Lütfen aşağıdaki sözleşmeyi dikkatlice okuyun
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose prose-sm max-w-none text-gray-700 space-y-8">
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  MeraFootball platformuna üye olarak, aşağıda belirtilen şartları okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan etmiş olursunuz.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900">1. Üyelik ve Platformun Amacı</h4>
                <p className="text-gray-600 leading-relaxed">
                  MeraFootball; halısaha futbol organizasyonları düzenleyen yöneticiler ile bu organizasyonlara katılmak isteyen oyuncuları bir araya getiren, web tabanlı bir organizasyon ve iletişim platformudur. Platformun temel amacı; oyuncuların ve yöneticilerin birbirlerini tanıyabilmesi, organizasyonlara katılım sağlayabilmesi ve sağlıklı bir kullanıcı deneyimi sunulmasıdır.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900">2. Kayıt Sırasında Paylaşılan Kişisel Veriler</h4>
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
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Önemli Güvenlik Notu:</strong> Bu bilgiler (isim, soyisim, iletişim bilgileri vb.) 
                    <strong> yalnızca platforma üye olan ve giriş yapmış kullanıcılar</strong> tarafından görülebilir. 
                    Platforma üye olmayan veya giriş yapmamış kişiler bu bilgilere erişemez. 
                    Bu bilgiler; organizasyon listeleme sayfalarında, maç kadrolarında ve ilgili kullanıcı profillerinde, 
                    platformun işleyişi gereği <strong>sadece diğer üye kullanıcılar</strong> tarafından görülebilir.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900">3. Profil Sonrasında Eklenen Kişisel Veriler</h4>
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
                <h4 className="text-lg font-semibold text-gray-900">4. Verilerin Gizlenmesi ve Kullanıcı Deneyimi</h4>
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
                <h4 className="text-lg font-semibold text-gray-900">5. Kişisel Verilerin İşlenmesi ve Görüntülenmesi</h4>
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
                <h4 className="text-lg font-semibold text-gray-900">6. Kullanıcının Hakları</h4>
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
                <h4 className="text-lg font-semibold text-gray-900">7. Kabul ve Yürürlük</h4>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
