# ADN CRM Suite

ADN Grup Sigorta icin hazirlanmis, tek kurum odakli sigorta operasyon paneli.

## Neler var

- Next.js App Router tabanli PWA arayuzu
- ADN Grup Sigorta icin tek kurum dashboard
- Demo giris bilgisi: `adnsigorta / adn2025`
- Musteri, police, lead, ekip, mesaj ve operasyon veri modeli
- Supabase/PostgreSQL migration ve seed dosyalari
- Supabase Storage bagli belge yukleme ve arsiv yonetimi

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
4. `supabase/migrations/20260430_storage_documents_bucket.sql` dosyasini calistirin.
5. `supabase/seed.sql` dosyasini calistirip ADN Grup Sigorta ornek verisini yukleyin.

`SUPABASE_SERVICE_ROLE_KEY` tanimliysa ana ekran ve acente ekranlari veriyi Supabase'dan okur. Tanimli degilse uygulama demo veri ile calismaya devam eder.
Belge yukleme icin `SUPABASE_DOCUMENTS_BUCKET` degiskeni varsayilan olarak `documents` kabul edilir.

Detayli notlar: [docs/database.md](/Users/Asus/Desktop/crm/docs/database.md)

## Mimari not

Tum ana tablolarda `agency_id` bulunur. Boylece her acente kendi verisini gorur; `super_admin` ise tum tenant'lari yonetebilir.
