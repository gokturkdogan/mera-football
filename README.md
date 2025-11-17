# MeraFootball - Halısaha Futbol Organizasyon Platformu

MeraFootball, halısaha futbol organizasyonları için web tabanlı bir platformdur. İki tip kullanıcı vardır: Oyuncu ve Yönetici (Admin). Oyuncular ücretsizdir ve maksimum aynı anda 2 organizasyona katılabilir. Yöneticiler Free veya Premium plan ile organizasyon oluşturabilir ve yönetebilir.

## Özellikler

### Oyuncular
- Ücretsiz kayıt
- Maksimum 2 organizasyona katılma
- Maç bilgilerine erişim
- Maç sonrası oyuncu puanlama sistemi (5 yıldız)

### Yöneticiler
- Free veya Premium plan seçimi
- Organizasyon oluşturma ve yönetimi
- Maç oluşturma ve kadro yönetimi
- Skor ve gol girişi
- Oyuncu taleplerini onaylama/reddetme

### Planlar
- **Free Plan:**
  - Haftada maksimum 1 maç
  - Maksimum 10 oyuncu
- **Premium Plan:**
  - Sınırsız maç
  - Sınırsız oyuncu
  - iyzico ile ödeme entegrasyonu

## Teknoloji Stack

- **Frontend:** Next.js 14, TailwindCSS, shadcn/ui
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** JWT (JSON Web Tokens)
- **Payment:** iyzico

## Kurulum

### Gereksinimler

- Node.js 18+ 
- PostgreSQL
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın:**
```bash
git clone <repository-url>
cd mera-football
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Environment değişkenlerini ayarlayın:**
`.env` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mera_football?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
IYZICO_API_KEY="your-iyzico-api-key"
IYZICO_SECRET_KEY="your-iyzico-secret-key"
IYZICO_BASE_URL="https://api.iyzipay.com"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Veritabanını oluşturun:**
```bash
npx prisma generate
npx prisma db push
```

5. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

6. Tarayıcınızda `http://localhost:3000` adresine gidin.

## Veritabanı Yapısı

- **Users:** Kullanıcı bilgileri (oyuncu/yönetici)
- **Organizations:** Organizasyon bilgileri ve plan tipi
- **OrganizationMembers:** Kullanıcı-organizasyon ilişkisi
- **Matches:** Maç bilgileri
- **MatchRoster:** Maç kadrosu
- **MatchScores:** Skor ve gol bilgileri
- **MatchRatings:** Oyuncu puanlamaları (5 yıldız)
- **Payments:** iyzico ödeme kayıtları

## API Endpoints

### Authentication
- `POST /api/auth/register` - Kayıt
- `POST /api/auth/login` - Giriş
- `POST /api/auth/logout` - Çıkış
- `GET /api/auth/me` - Kullanıcı bilgileri

### Organizations
- `GET /api/organizations` - Organizasyon listesi
- `POST /api/organizations` - Yeni organizasyon oluştur
- `GET /api/organizations/[id]` - Organizasyon detayı
- `POST /api/organizations/[id]/join` - Organizasyona katıl
- `POST /api/organizations/[id]/leave` - Organizasyondan ayrıl
- `GET /api/organizations/[id]/members` - Üye listesi
- `PATCH /api/organizations/[id]/members` - Üye onayla/reddet

### Matches
- `GET /api/matches` - Maç listesi
- `POST /api/matches` - Yeni maç oluştur
- `GET /api/matches/[id]` - Maç detayı
- `PATCH /api/matches/[id]` - Maç güncelle
- `GET /api/matches/[id]/roster` - Kadro listesi
- `POST /api/matches/[id]/roster` - Kadroya oyuncu ekle
- `DELETE /api/matches/[id]/roster` - Kadrodan oyuncu çıkar
- `POST /api/matches/[id]/score` - Skor gir
- `GET /api/matches/[id]/ratings` - Puanlama listesi
- `POST /api/matches/[id]/ratings` - Oyuncu puanla

### Payments
- `GET /api/payments` - Ödeme geçmişi
- `POST /api/payments` - Premium plan satın al

### Profile
- `PATCH /api/profile` - Profil güncelle

## Sayfalar

- `/` - Landing / Login / Register
- `/login` - Giriş sayfası
- `/register` - Kayıt sayfası
- `/dashboard` - Dashboard (Oyuncu/Yönetici)
- `/profile` - Profil güncelleme
- `/organization/[id]` - Organizasyon detay
- `/organization/new` - Yeni organizasyon oluştur
- `/match/[id]` - Maç detay ve puanlama
- `/match/new` - Yeni maç oluştur
- `/payment` - Premium ödeme sayfası

## Deployment

### Vercel

1. Projeyi GitHub'a push edin
2. Vercel'e giriş yapın ve projeyi import edin
3. Environment değişkenlerini ekleyin
4. Deploy edin

### Veritabanı

Production için PostgreSQL veritabanı kullanın (ör. Supabase, Railway, Neon).

## Notlar

- iyzico entegrasyonu için test API key'leri kullanabilirsiniz
- JWT_SECRET production'da güçlü bir değer olmalı
- Database migration'ları için `prisma migrate` kullanın

## Lisans

Bu proje özel bir projedir.

