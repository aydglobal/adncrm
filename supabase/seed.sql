insert into public.agencies (id, name, slug, city, phone, email)
values
  ('11111111-1111-1111-1111-111111111111', 'Atlas Sigorta', 'atlas-sigorta', 'Istanbul', '0212 111 11 11', 'atlas@acentam.com'),
  ('22222222-2222-2222-2222-222222222222', 'Ege Guvence', 'ege-guvence', 'Izmir', '0232 222 22 22', 'ege@acentam.com')
on conflict (slug) do nothing;

insert into public.customers (
  id,
  agency_id,
  customer_type,
  full_name,
  company_name,
  phone,
  email,
  city,
  notes
)
values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'company',
    'Selim Karahan',
    'Deniz Lojistik A.S.',
    '05324551190',
    'selim@denizlojistik.com',
    'Istanbul',
    'Filo yenileme portfoyu'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222',
    'individual',
    'Ayse Yildiz',
    null,
    '05412120853',
    'ayse@ornek.com',
    'Izmir',
    'TSS ve konut police ilgisi'
  )
on conflict (id) do nothing;

insert into public.policies (
  id,
  agency_id,
  customer_id,
  branch,
  insurer_name,
  policy_number,
  status,
  start_date,
  end_date,
  premium_amount,
  notes
)
values
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Filo Kasko',
    'Anadolu Sigorta',
    'ATL-2026-001',
    'renewal_due',
    '2025-04-12',
    '2026-04-12',
    486000,
    'Teklif gonderildi'
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '22222222-2222-2222-2222-222222222222',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Tamamlayici Saglik',
    'Allianz',
    'EGE-2026-014',
    'active',
    '2025-04-14',
    '2026-04-14',
    18400,
    'Yenileme gorusmesi planlandi'
  )
on conflict (id) do nothing;

insert into public.leads (
  id,
  agency_id,
  customer_id,
  full_name,
  phone,
  email,
  source,
  campaign_name,
  product_interest,
  quality_score,
  status,
  last_action_note
)
values
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '11111111-1111-1111-1111-111111111111',
    null,
    'Elif Karatas',
    '05334445566',
    'elif@ornek.com',
    'Meta Ads',
    'Kasko Nisan Kampanyasi',
    'Kasko',
    89,
    'contacted',
    '2 dk once arandi'
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '22222222-2222-2222-2222-222222222222',
    null,
    'Tuna Apartmani',
    '02325550000',
    'yonetim@tunaapartmani.com',
    'Landing Page',
    'DASK Formu',
    'DASK',
    75,
    'quoted',
    'PDF teklif indirildi'
  )
on conflict (id) do nothing;

insert into public.tasks (
  id,
  agency_id,
  customer_id,
  policy_id,
  title,
  description,
  status,
  due_at
)
values
  (
    '12121212-1212-1212-1212-121212121212',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Filo teklifini teyit et',
    'Musteriden son arac listesi alinacak',
    'in_progress',
    '2026-04-10 10:00:00+03'
  ),
  (
    '34343434-3434-3434-3434-343434343434',
    '22222222-2222-2222-2222-222222222222',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'TSS yenileme aramasi',
    'Police bitmeden 7 gun once arama yap',
    'todo',
    '2026-04-09 14:00:00+03'
  )
on conflict (id) do nothing;

insert into public.messages (
  id,
  agency_id,
  customer_id,
  policy_id,
  topic,
  body
)
values
  (
    '56565656-5656-5656-5656-565656565656',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Atlas filo yenileme',
    'Ruhsatlar tamamlandi, son teklif bekleniyor.'
  ),
  (
    '78787878-7878-7878-7878-787878787878',
    '22222222-2222-2222-2222-222222222222',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Ege TSS tahsilat',
    'Kredi karti provizyonu tamamlandi.'
  )
on conflict (id) do nothing;

insert into public.documents (
  id,
  agency_id,
  customer_id,
  policy_id,
  title,
  document_type,
  file_url,
  file_size_bytes
)
values
  (
    '90909090-9090-9090-9090-909090909090',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Atlas filo teklif.pdf',
    'quote_pdf',
    'https://example.com/files/atlas-filo-teklif.pdf',
    248000
  ),
  (
    'abababab-abab-abab-abab-abababababab',
    '22222222-2222-2222-2222-222222222222',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Ege tss police.pdf',
    'policy_pdf',
    'https://example.com/files/ege-tss-police.pdf',
    192000
  )
on conflict (id) do nothing;
