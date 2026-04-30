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
3. Ardindan [20260430_storage_documents_bucket.sql](/Users/Asus/Desktop/crm/supabase/migrations/20260430_storage_documents_bucket.sql) dosyasini calistirip `documents` bucket ve policy'lerini olusturun.
4. Son olarak [supabase/seed.sql](/Users/Asus/Desktop/crm/supabase/seed.sql) dosyasini calistirarak ADN Grup Sigorta ornek verisini yukleyin.
5. `.env.local` icine `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` ve gerekiyorsa `SUPABASE_DOCUMENTS_BUCKET` degerlerini yazin.
6. Auth tarafinda kullanicilar olustukca `profiles` ve `agency_memberships` kayitlarini ekleyin.

## Sonraki adimlar

- Supabase Auth ile giris
- `agency_id` bazli server-side query helper
- dashboard KPI'larini SQL view veya RPC ile toplama
