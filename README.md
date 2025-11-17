# ⚽ MeraFootball - Halısaha Futbol Organizasyon Platformu

MeraFootball, halısaha futbol organizasyonları için modern ve kullanıcı dostu bir web platformudur. Oyuncular ve yöneticiler için özel tasarlanmış özelliklerle, futbol organizasyonlarınızı kolayca yönetin.

## 🎯 Özellikler

### 👥 Oyuncular İçin
- ✅ Ücretsiz kayıt ve kullanım
- ✅ Maksimum 2 organizasyona katılma
- ✅ Maç bilgilerine erişim
- ✅ Maç sonrası oyuncu puanlama sistemi (⭐ 5 yıldız)
- ✅ Profil yönetimi
- ✅ Organizasyonları keşfetme

### 👨‍💼 Yöneticiler İçin
- ✅ Free veya Premium plan seçimi
- ✅ Sınırsız organizasyon oluşturma
- ✅ Organizasyon yönetimi
- ✅ Maç oluşturma ve yönetimi
- ✅ Diziliş ön izlemesi (Halısaha krokisi)
- ✅ Kadro yönetimi
- ✅ Skor ve gol girişi
- ✅ Oyuncu taleplerini onaylama/reddetme
- ✅ Kapasite ve saha adı düzenleme

### 💎 Planlar

#### 🆓 Free Plan
- Haftada maksimum 1 maç
- Organizasyon başına maksimum 10 oyuncu
- Temel özellikler

#### ⭐ Premium Plan
- Sınırsız maç oluşturma
- Sınırsız oyuncu ekleme
- Gelişmiş istatistikler
- Öncelikli destek
- iyzico ile güvenli ödeme

## 🛠️ Teknoloji Stack

### 🎨 Frontend
- **⚛️ Next.js 14** - React framework (App Router)
- **🎨 TailwindCSS** - Utility-first CSS framework
- **🧩 shadcn/ui** - Modern UI component library
- **📅 date-fns** - Tarih formatlama ve işleme
- **🎯 TypeScript** - Tip güvenliği

### 🔧 Backend
- **🚀 Next.js API Routes** - Serverless API endpoints
- **🔐 JWT (jsonwebtoken)** - Authentication ve authorization
- **🔒 bcryptjs** - Şifre hashleme
- **✅ Zod** - Schema validation

### 💾 Veritabanı
- **🐘 PostgreSQL** - İlişkisel veritabanı
- **🔷 Prisma ORM** - Modern database toolkit
- **📊 Prisma Client** - Type-safe database client

### 💳 Ödeme
- **💳 iyzico** - Ödeme gateway entegrasyonu

### 🎨 UI Kütüphaneleri
- **🎭 Radix UI** - Accessible component primitives
  - Avatar, Dialog, Dropdown Menu, Label, Select, Tabs, Toast
- **🎨 Tailwind Animate** - Animasyonlar
- **🔗 Tailwind Merge** - Class name birleştirme
- **📐 Class Variance Authority** - Component variant yönetimi
- **🔤 clsx** - Conditional class names

### 🛠️ Development Tools
- **📝 ESLint** - Code linting
- **🔷 TypeScript** - Static type checking
- **🎨 PostCSS** - CSS processing
- **⚡ Autoprefixer** - CSS vendor prefixes

## 📱 Sayfalar

- **🏠 /** - Ana sayfa (Landing page)
- **🔐 /login** - Giriş sayfası
- **📝 /register** - Kayıt sayfası
- **📊 /dashboard** - Organizasyonlarım (Dashboard)
- **👤 /profile** - Profil sayfası
- **📋 /organizations** - Tüm organizasyonlar
- **👥 /players** - Tüm oyuncular
- **💎 /plans** - Planlar sayfası
- **🏢 /organization/[id]** - Organizasyon detay
- **➕ /organization/new** - Yeni organizasyon oluştur
- **⚽ /match/[id]** - Maç detay ve diziliş
- **➕ /match/new** - Yeni maç oluştur
- **💳 /payment** - Premium ödeme sayfası

## 🗄️ Veritabanı Yapısı

- **👤 Users** - Kullanıcı bilgileri (oyuncu/yönetici, plan durumu)
- **🏢 Organizations** - Organizasyon bilgileri
- **🔗 OrganizationMembers** - Kullanıcı-organizasyon ilişkisi (PENDING/APPROVED/REJECTED)
- **⚽ Matches** - Maç bilgileri (tarih, saat, saha, kapasite, durum)
- **👥 MatchRoster** - Maç kadrosu ve pozisyonlar
- **📊 MatchScores** - Skor ve gol bilgileri
- **⭐ MatchRatings** - Oyuncu puanlamaları (5 yıldız + yorum)
- **💳 Payments** - iyzico ödeme kayıtları

## 🔌 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/logout` - Çıkış yapma
- `GET /api/auth/me` - Kullanıcı bilgileri

### 🏢 Organizations
- `GET /api/organizations` - Kullanıcının organizasyonları
- `GET /api/organizations/all` - Tüm organizasyonlar
- `POST /api/organizations` - Yeni organizasyon oluştur
- `GET /api/organizations/[id]` - Organizasyon detayı
- `POST /api/organizations/[id]/join` - Organizasyona katıl (PENDING)
- `POST /api/organizations/[id]/leave` - Organizasyondan ayrıl
- `GET /api/organizations/[id]/members` - Üye listesi
- `PATCH /api/organizations/[id]/members` - Üye onayla/reddet

### ⚽ Matches
- `GET /api/matches` - Maç listesi
- `POST /api/matches` - Yeni maç oluştur
- `GET /api/matches/[id]` - Maç detayı
- `PATCH /api/matches/[id]` - Maç güncelle (saha, kapasite)
- `GET /api/matches/[id]/roster` - Kadro listesi
- `POST /api/matches/[id]/roster` - Kadroya oyuncu ekle (pozisyon ile)
- `DELETE /api/matches/[id]/roster` - Kadrodan oyuncu çıkar
- `POST /api/matches/[id]/score` - Skor gir
- `GET /api/matches/[id]/ratings` - Puanlama listesi
- `POST /api/matches/[id]/ratings` - Oyuncu puanla

### 👥 Players
- `GET /api/players` - Tüm oyuncular listesi

### 💳 Payments
- `GET /api/payments` - Ödeme geçmişi
- `POST /api/payments` - Premium plan satın al

## ✨ Öne Çıkan Özellikler

- 🎨 **Modern ve Responsive Tasarım** - Tüm cihazlarda mükemmel görünüm
- ⚽ **Diziliş Ön İzlemesi** - Halısaha krokisi ile görsel diziliş yönetimi
- 🔐 **Güvenli Authentication** - JWT tabanlı kimlik doğrulama
- 💳 **Ödeme Entegrasyonu** - iyzico ile güvenli ödeme
- 📊 **Plan Bazlı Limitler** - Free ve Premium plan özellikleri
- ⭐ **Oyuncu Puanlama** - Maç sonrası 5 yıldız puanlama sistemi
- 📱 **Responsive Design** - Mobil, tablet ve desktop uyumlu
- 🎯 **Type-Safe** - TypeScript ile tip güvenliği
- 🚀 **Performance** - Next.js optimizasyonları

## 📦 Ana Bağımlılıklar

```json
{
  "next": "14.0.4",
  "react": "^18.2.0",
  "typescript": "^5",
  "@prisma/client": "^5.7.1",
  "prisma": "^5.7.1",
  "tailwindcss": "^3.3.0",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "zod": "^3.22.4",
  "date-fns": "^3.0.6",
  "iyzipay": "^2.0.48"
}
```

## 🎨 UI Component Library

- **shadcn/ui** - Accessible ve özelleştirilebilir component'ler
- **Radix UI** - Unstyled, accessible component primitives
- **TailwindCSS** - Utility-first CSS framework

## 📝 Notlar

- 🔒 JWT_SECRET production'da güçlü bir değer olmalı
- 💳 iyzico entegrasyonu için test API key'leri kullanılabilir
- 🗄️ Veritabanı migration'ları için `prisma migrate` kullanılır
- 🚀 Production deployment için Vercel önerilir
- 🐘 PostgreSQL veritabanı için Neon, Supabase veya Railway kullanılabilir

## 📄 Lisans

Bu proje özel bir projedir.
