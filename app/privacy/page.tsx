'use client'

import Navbar from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Gizlilik Politikası
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            MeraFootball olarak kişisel verilerinizin korunmasına büyük önem veriyoruz. Bu politika, verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi sağlar.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Son Güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Privacy Content */}
        <Card className="shadow-lg border-2 border-green-100">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Shield className="w-6 h-6 text-green-600" />
              Gizlilik Politikası ve Kişisel Verilerin Korunması
            </CardTitle>
            <CardDescription className="text-base mt-2">
              6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca hazırlanmıştır
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose prose-sm max-w-none text-gray-700 space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">1. Veri Sorumlusu</h3>
                <p className="text-gray-600 leading-relaxed">
                  Bu Gizlilik Politikası, MeraFootball platformu ("Platform") tarafından toplanan kişisel verilerin işlenmesi ve korunması hakkında bilgi vermek amacıyla hazırlanmıştır. Platform, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca veri sorumlusu sıfatıyla kişisel verilerinizi işlemektedir.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">2. Toplanan Kişisel Veriler</h3>
                <p className="text-gray-600 leading-relaxed">
                  Platformumuzda aşağıdaki kişisel veriler toplanmaktadır:
                </p>
                <div className="space-y-3 mt-3">
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-2">2.1. Kimlik ve İletişim Bilgileri</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li>Ad ve soyad</li>
                      <li>E-posta adresi</li>
                      <li>Telefon numarası (isteğe bağlı)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-2">2.2. Profil Bilgileri</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li>Profil fotoğrafı</li>
                      <li>Mevki tercihi (Kaleci, Defans, Orta Saha, Forvet)</li>
                      <li>Güçlü ayak bilgisi (Sol, Sağ, İkisi)</li>
                      <li>Boy, kilo, yaş gibi fiziksel bilgiler (isteğe bağlı)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-2">2.3. Platform Kullanım Verileri</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li>Organizasyon üyelik bilgileri</li>
                      <li>Maç katılım kayıtları</li>
                      <li>Oyuncu puanlama ve değerlendirme verileri</li>
                      <li>Gol ve istatistik bilgileri</li>
                      <li>Platform kullanım logları</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">3. Kişisel Verilerin İşlenme Amaçları</h3>
                <p className="text-gray-600 leading-relaxed">
                  Toplanan kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Platform hizmetlerinin sunulması ve geliştirilmesi</li>
                  <li>Kullanıcı hesabının oluşturulması ve yönetilmesi</li>
                  <li>Organizasyon ve maç yönetimi</li>
                  <li>Oyuncu ve yöneticilerin birbirini tanıyabilmesi</li>
                  <li>İstatistik ve performans takibi</li>
                  <li>Kullanıcı deneyiminin iyileştirilmesi</li>
                  <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                  <li>Güvenlik ve dolandırıcılık önleme</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">4. Kişisel Verilerin İşlenme Hukuki Sebepleri</h3>
                <p className="text-gray-600 leading-relaxed">
                  Kişisel verileriniz KVKK'nın 5. ve 6. maddelerinde belirtilen aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li><strong>Açık Rızanız:</strong> Üyelik sözleşmesini kabul ederek, kişisel verilerinizin platform üyeleri arasında paylaşılmasına açık rıza vermiş olursunuz.</li>
                  <li><strong>Sözleşmenin İfası:</strong> Platform hizmetlerinin sunulması (organizasyon yönetimi, maç organizasyonu, oyuncu eşleştirme) için kişisel verilerinizin işlenmesi zorunludur.</li>
                  <li><strong>Meşru Menfaat:</strong> Platformun işleyişi ve kullanıcı deneyiminin sağlanması için veri işleme zorunludur. Bu işleme, temel hak ve özgürlüklerinize zarar vermeyecek şekilde yapılmaktadır.</li>
                  <li><strong>Yasal Yükümlülük:</strong> Yasal düzenlemeler gereği veri saklama ve işleme yükümlülüklerinin yerine getirilmesi.</li>
                </ul>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
                  <p className="text-sm text-blue-800">
                    <strong>Rıza Mekanizması:</strong> Platforma üye olurken, üyelik sözleşmesini kabul ederek kişisel verilerinizin işlenmesine ve platform üyeleri arasında paylaşılmasına rıza gösterirsiniz. 
                    Bu rıza, profil paylaşım ayarlarınızdan kontrol edilebilir ve istediğiniz zaman değiştirilebilir.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">5. Kişisel Verilerin Paylaşımı ve Erişim Kontrolü</h3>
                <p className="text-gray-600 leading-relaxed">
                  MeraFootball, kişisel verilerinizin güvenliği ve gizliliği için aşağıdaki önlemleri almaktadır:
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
                  <h4 className="text-base font-semibold text-green-900 mb-2">5.1. Platform Üyeleri Arası Paylaşım</h4>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    <strong>Önemli Güvenlik Önlemi:</strong> Kişisel verileriniz (isim, soyisim, iletişim bilgileri vb.) <strong>yalnızca platforma üye olan ve giriş yapmış kullanıcılar</strong> tarafından görüntülenebilir. 
                    Platforma üye olmayan veya giriş yapmamış kişiler bu bilgilere erişemez.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Profil paylaşım ayarlarınıza göre, belirli bilgileriniz platform içerisinde <strong>sadece diğer üye kullanıcılar</strong> tarafından görüntülenebilir (örneğin: organizasyon listeleri, maç kadroları, oyuncu profilleri).
                  </p>
                </div>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Platform dışında kişisel verileriniz aşağıdaki durumlar dışında paylaşılmaz:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li><strong>Yasal Yükümlülükler:</strong> Yasal düzenlemeler gereği yetkili kurum ve kuruluşlarla paylaşım yapılabilir.</li>
                  <li><strong>Hizmet Sağlayıcılar:</strong> Platform hizmetlerinin sunulması için gerekli olan teknik hizmet sağlayıcılar (hosting, veritabanı vb.) ile sınırlı olarak paylaşım yapılabilir. Bu sağlayıcılar verilerinizi yalnızca teknik hizmet sunumu için kullanır ve başka amaçlarla kullanamaz.</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-3">
                  <strong>Önemli:</strong> Platform, kişisel verilerinizi ticari amaçlarla üçüncü kişilere satmaz, kiralamaz veya başka şekilde paylaşmaz.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">6. Veri Güvenliği</h3>
                <p className="text-gray-600 leading-relaxed">
                  Kişisel verilerinizin güvenliği için aşağıdaki teknik ve idari önlemler alınmaktadır:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>SSL/TLS şifreleme teknolojileri kullanılarak veri aktarımı güvence altına alınmıştır</li>
                  <li>Şifreler hash algoritmaları ile güvenli şekilde saklanmaktadır</li>
                  <li>Düzenli güvenlik güncellemeleri ve yedekleme işlemleri yapılmaktadır</li>
                  <li>Erişim yetkilendirme ve kontrol mekanizmaları uygulanmaktadır</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">7. Veri Saklama Süreleri</h3>
                <p className="text-gray-600 leading-relaxed">
                  Kişisel verileriniz, işlenme amaçlarının gerektirdiği süre boyunca ve yasal saklama yükümlülüklerinin öngördüğü süreler dahilinde saklanmaktadır. Hesabınızı sildiğinizde, verileriniz yasal saklama yükümlülükleri saklı kalmak kaydıyla silinir veya anonimleştirilir.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">8. Çerezler (Cookies)</h3>
                <p className="text-gray-600 leading-relaxed">
                  Platform, kullanıcı deneyimini iyileştirmek ve platform işlevselliğini sağlamak amacıyla çerezler kullanmaktadır. Çerezler, kimlik doğrulama (authentication) ve oturum yönetimi için zorunludur. Tarayıcı ayarlarınızdan çerezleri kontrol edebilirsiniz, ancak bu durumda platformun bazı özelliklerini kullanamayabilirsiniz.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">9. KVKK Kapsamındaki Haklarınız</h3>
                <p className="text-gray-600 leading-relaxed">
                  KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                  <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                  <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                  <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
                  <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme</li>
                  <li>Kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
                  <li>Düzeltme, silme, yok etme işlemlerinin, kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
                  <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme</li>
                  <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması halinde zararın giderilmesini talep etme</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Bu haklarınızı kullanmak için <strong>destek@merafootball.com</strong> adresine e-posta gönderebilir veya profil sayfanızdan ilgili taleplerinizi iletebilirsiniz.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">10. Profil Paylaşım Ayarları</h3>
                <p className="text-gray-600 leading-relaxed">
                  Platform, kullanıcıların hangi bilgilerinin diğer kullanıcılar tarafından görüntüleneceğini kontrol etmesine olanak tanır. Profil sayfanızdan "Listelemede göster" seçeneklerini kullanarak telefon numaranız, mevki tercihiniz, fiziksel bilgileriniz gibi verilerin görünürlüğünü yönetebilirsiniz.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong>Not:</strong> Bazı bilgileri gizlemeniz, organizasyon yöneticilerinin size ulaşmasını ve maçlara davet edilmenizi zorlaştırabilir.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">11. Çocukların Gizliliği</h3>
                <p className="text-gray-600 leading-relaxed">
                  Platform, 18 yaş altındaki kişilerden bilerek kişisel veri toplamamaktadır. 18 yaş altındaki bir kişinin verilerinin toplandığını tespit edersek, bu veriler derhal silinir.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">12. Gizlilik Politikasının Güncellenmesi</h3>
                <p className="text-gray-600 leading-relaxed">
                  Bu Gizlilik Politikası, yasal değişiklikler veya platform güncellemeleri nedeniyle zaman zaman güncellenebilir. Önemli değişiklikler durumunda kullanıcılar e-posta veya platform içi bildirim ile bilgilendirilir. Güncel politika metni her zaman bu sayfada yayınlanmaktadır.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">13. İletişim</h3>
                <p className="text-gray-600 leading-relaxed">
                  Gizlilik politikamız hakkında sorularınız, önerileriniz veya KVKK kapsamındaki talepleriniz için bizimle iletişime geçebilirsiniz:
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
                  <p className="text-gray-700">
                    <strong>E-posta:</strong> destek@merafootball.com
                  </p>
                  <p className="text-gray-700 mt-2">
                    <strong>Destek:</strong> 7/24 müşteri desteği
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mt-6">
                <p className="text-sm text-blue-800">
                  <strong>Önemli Not:</strong> Bu Gizlilik Politikası, MeraFootball platformunun kullanımı sırasında toplanan kişisel verilerin işlenmesi ve korunması hakkında bilgi vermektedir. 
                  Platform kullanımına devam ederek, bu politikada belirtilen koşulları kabul etmiş sayılırsınız.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
