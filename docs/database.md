# Database Plan

Bu proje simdilik 2 acente ile baslayacak, ama veri modeli yeni acente eklemeye hazir tutuldu.

## Ana mantik

- Her is kaydi `agency_id` tasir.
- Kullanici yetkisi `agency_memberships` tablosu ile tanimlanir.
- `super_admin` tum tenant'lari gorur.
- `agency_admin`, `sales`, `operations`, `marketing` rolleri sadece bagli oldugu acentenin verisini gorur.

## Kurulan tablolar

- `agencies`: acente kayitlari
- `profiles`: `auth.users` ile bagli uygulama profilleri
- `agency_memberships`: kullanici-acente-rol iliskisi
- `customers`: musteri ve firma kartlari
- `policies`: police ve yenileme kayitlari
- `leads`: Meta Ads ve diger basvuru kaynaklari
- `tasks`: personel gorevleri ve takip akislari
- `messages`: sirket ici mesajlar
- `documents`: PDF ve evrak arsivi

## Supabase akisi

1. Supabase projesini acin.
2. [supabase/migrations/20260408_initial_multi_tenant.sql](/Users/Asus/Desktop/crm/supabase/migrations/20260408_initial_multi_tenant.sql) dosyasini SQL Editor'de calistirin.
3. Ardindan [supabase/seed.sql](/Users/Asus/Desktop/crm/supabase/seed.sql) dosyasini calistirarak 2 acentelik ornek veriyi yukleyin.
4. `.env.local` icine `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` ve `SUPABASE_SERVICE_ROLE_KEY` degerlerini yazin.
5. Auth tarafinda kullanicilar olustukca `profiles` ve `agency_memberships` kayitlarini ekleyin.

## Sonraki adimlar

- Supabase Auth ile giris
- `agency_id` bazli server-side query helper
- belge dosyalari icin Supabase Storage bucket
- dashboard KPI'larini SQL view veya RPC ile toplama
