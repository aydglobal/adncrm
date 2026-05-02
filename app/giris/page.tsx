import { LoginForm } from "@/components/login-form";
import { BrandMark } from "@/components/brand-mark";
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
      ? "Bu hesap icin yetki bulunamadi. Tanimli kurum ile tekrar giris yapin."
      : "";

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      <section className="panel-card w-full overflow-hidden rounded-[1.9rem] border border-white/10 sm:rounded-[2.4rem]">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border-b border-white/10 bg-[linear-gradient(145deg,#091221,#10203a)] p-5 text-white sm:p-8 lg:border-b-0 lg:border-r">
            <BrandMark dark priority href="/" />
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-gold)]">
              ADN Grup Sigorta
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Guvenli panel girisi
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/72 sm:text-base">
              Tek kurumlu yapida musteri, police, lead ve belge akisi sade bir panel
              uzerinden yonetilir.
            </p>
            <div className="mt-8 space-y-3 text-sm text-white/70">
              <div className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3">
                Aktif kurum: <span className="font-semibold text-white">ADN Grup Sigorta</span>
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3">
                Giris modeli:{" "}
                <span className="font-semibold text-white">
                  {hasSupabaseEnv() ? "Supabase Auth" : "Demo mod"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-gold)]">
              Kullanici girisi
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">
              Hesabiniza girin
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              Yetkili kullanici paneli yalnizca tanimli kurum ve hesap ile acilir.
            </p>
            <LoginForm
              agencies={agencyOptions}
              hasSupabase={hasSupabaseEnv()}
              initialAgencySlug={resolvedSearchParams.agency}
              unauthorizedError={unauthorizedError}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
