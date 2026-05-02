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
    <main className="mx-auto flex min-h-screen max-w-7xl items-center px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      <section className="w-full space-y-4">
        <div className="hero-stage panel-card overflow-hidden rounded-[2rem] sm:rounded-[2.6rem]">
          <div className="relative grid gap-0 lg:grid-cols-[1.06fr_0.94fr]">
            <div className="border-b border-white/10 px-5 py-6 text-white sm:px-8 sm:py-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-10">
              <BrandMark dark priority href="/" />
              <div className="mt-8">
                <span className="executive-chip px-4 py-2 text-[10px] uppercase tracking-[0.28em]">
                  ADN Grup Sigorta Control Room
                </span>
                <h1 className="display-title mt-5 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-[4rem]">
                  Guven veren ilk izlenim, hizli giris, net operasyon.
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/72 sm:text-base sm:leading-8">
                  Musteri takibi, police yenileme, teklif surecleri ve belge merkezi tek
                  kurumlu ADN yapisinda sade, hizli ve kontrol edilebilir bir deneyimle
                  yonetilir.
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Aktif kurum", value: "ADN Grup Sigorta" },
                  { label: "Giris modeli", value: hasSupabaseEnv() ? "Canli yetkili giris" : "Demo onizleme" },
                  { label: "Durum", value: "Yetki kontrollu guvenli erisim" },
                ].map((item) => (
                  <div key={item.label} className="metric-tile rounded-[1.35rem] px-4 py-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/48">
                      {item.label}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-white sm:text-base">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="gold-sheen rounded-[1.45rem] px-5 py-5">
                  <div className="flex items-center gap-3">
                    <span className="status-dot" />
                    <p className="text-sm font-semibold text-white">Gunluk operasyon hazir</p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/72">
                    Ekip giris yaptigi anda musteri kartlari, police akisi ve belge alanlari
                    ayni merkezde acilir.
                  </p>
                </div>
                <div className="rounded-[1.45rem] border border-white/10 bg-white/5 px-5 py-5">
                  <p className="text-sm font-semibold text-white">Kullanim prensibi</p>
                  <p className="mt-3 text-sm leading-7 text-white/72">
                    Daha az kalabalik, daha net karar, daha hizli islem. Bu yuzey gunluk
                    ekip kullanimina uygun olarak tasarlandi.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
              <div className="rounded-[1.75rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.04)] p-5 shadow-[0_28px_70px_rgba(2,6,23,0.24)] sm:p-7">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-gold)]">
                  Kullanici girisi
                </p>
                <h2 className="display-title mt-3 text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
                  Panele girin
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-muted)]">
                  Kurum secimini kontrol edin, hesap bilginizi girin ve ADN operasyon
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
        </div>
        <LegalFooter centered />
      </section>
    </main>
  );
}
