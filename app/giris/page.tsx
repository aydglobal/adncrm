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
      ? "Bu acente icin yetkiniz bulunmuyor. Lutfen size tanimli acenteyle giris yapin."
      : "";

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-[rgba(15,23,42,0.75)] shadow-[0_40px_120px_rgba(2,6,23,0.65)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.25),transparent_55%),linear-gradient(140deg,#0b1120,#0f172a_55%,#111827)] p-8 text-white sm:p-10">
          <BrandMark dark priority href="/" />
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/65">
            ADN Trust Giris
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">
            ADN Grup Sigorta icin guvenli operasyon girisi
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/75">
            Tek kurum yapisinda tum operasyon tek merkezden yonetilir. Giris sonrasi
            sadece ADN Grup Sigorta paneli acilir.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/70">Aktif kurum</p>
              <p className="mt-2 text-2xl font-semibold">ADN Grup Sigorta</p>
            </article>
            <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/70">Giris modeli</p>
              <p className="mt-2 text-2xl font-semibold">
                {hasSupabaseEnv() ? "Supabase Auth" : "Demo yonlendirme"}
              </p>
            </article>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            Kurumsal giris
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-[var(--color-ink)]">
            ADN kullanici girisi
          </h2>
          <LoginForm
            agencies={agencyOptions}
            hasSupabase={hasSupabaseEnv()}
            initialAgencySlug={resolvedSearchParams.agency}
            unauthorizedError={unauthorizedError}
          />
        </div>
      </section>
    </main>
  );
}
