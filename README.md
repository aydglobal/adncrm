# Sigorta CRM PWA

2 acente ile baslayan, ileride yeni acenteler eklenebilecek multi-tenant sigorta operasyon paneli.

## Neler var

- Next.js App Router tabanli PWA arayuzu
- 2 aktif acente icin tenant secim ekrani
- Acente bazli dashboard
- Musteri, police, lead, ekip, mesaj ve operasyon veri modeli
- Supabase/PostgreSQL migration ve seed dosyalari

## Lokalde calistirma

```bash
npm install
npm run dev
```

Giris ekrani: `/giris`

## Veritabani kurulumu

1. Supabase projesi olusturun.
2. `.env.example` dosyasindaki degiskenleri doldurup `.env.local` olusturun.
3. `supabase/migrations/20260408_initial_multi_tenant.sql` dosyasini calistirin.
4. `supabase/seed.sql` dosyasini calistirip 2 acentelik ornek veriyi yukleyin.

`SUPABASE_SERVICE_ROLE_KEY` tanimliysa ana ekran ve acente ekranlari veriyi Supabase'dan okur. Tanimli degilse uygulama demo veri ile calismaya devam eder.

Detayli notlar: [docs/database.md](/Users/Asus/Desktop/crm/docs/database.md)

## Mimari not

Tum ana tablolarda `agency_id` bulunur. Boylece her acente kendi verisini gorur; `super_admin` ise tum tenant'lari yonetebilir.
