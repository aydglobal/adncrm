import { LoginForm } from "@/components/login-form";
import { BrandMark } from "@/components/brand-mark";
import { LegalFooter } from "@/components/legal-footer";
import { getAgencySummaries } from "@/lib/data";
import { hasSupabaseEnv } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{
    agency?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const { agencies } = await getAgencySummaries();
  const agencyOptions = agencies.map((agency) => ({
    slug: agency.slug,
    name: agency.name,
    city: agency.city,
  }));
  const unauthorizedError =
    resolvedSearchParams.error === "yetkisiz"
      ? "Bu hesap icin yetki bulunamadi. Tanimli kurum bilgisi ile tekrar giris yapin."
      : "";

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      <section className="w-full space-y-4">
        <div className="panel-card overflow-hidden rounded-[1.9rem] border border-white/10 sm:rounded-[2.4rem]">
          <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="border-b border-white/10 bg-[linear-gradient(145deg,#11161e,#171d26_55%,#2a2217)] p-5 text-white sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
            <BrandMark dark priority href="/" />
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-gold)]">
              ADN Grup Sigorta
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Kurumsal giris ekrani
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/72 sm:text-base">
              Musteri yonetimi, police yenileme, teklif takibi ve belge arsivi ADN Grup
              Sigorta ekibi icin tek noktada acilir.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-white/70 sm:grid-cols-2">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                  Aktif kurum
                </p>
                <p className="mt-2 font-semibold text-white">ADN Grup Sigorta</p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                  Giris modeli
                </p>
                <p className="mt-2 font-semibold text-white">
                  {hasSupabaseEnv() ? "Canli yetkili giris" : "Demo onizleme modu"}
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-[1.4rem] border border-[rgba(216,179,106,0.16)] bg-[rgba(216,179,106,0.08)] px-4 py-4 text-sm leading-7 text-white/75">
              Giris sonrasinda kullanici sadece kendi yetkili oldugu kurum ekranina
              ulasir. Yetkisiz gecisler otomatik olarak engellenir.
            </div>
          </div>

            <div className="p-5 sm:p-8 lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-gold)]">
                Kullanici girisi
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">
                Panele girin
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-muted)]">
                Kurum secimini kontrol edin, kullanici bilgilerinizi girin ve yonetim
                paneline guvenli sekilde ulasin.
              </p>
              <LoginForm
                agencies={agencyOptions}
                hasSupabase={hasSupabaseEnv()}
                initialAgencySlug={resolvedSearchParams.agency}
                unauthorizedError={unauthorizedError}
              />
            </div>
          </div>
        </div>
        <LegalFooter centered />
      </section>
    </main>
  );
}
