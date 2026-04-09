import { LoginForm } from "@/components/login-form";
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
      <section className="grid w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 shadow-[0_28px_80px_rgba(17,33,48,0.12)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
        <div className="bg-[linear-gradient(140deg,#0d3d5a,#0c4a6e_52%,#b85c38)] p-8 text-white sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
            Sigorta CRM PWA
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight">
            Once acente sec, sonra o tenant icinde oturum ac
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/78">
            Bu akista her kullanici hangi acente paneline girecegini basta secer.
            Boylece 2 aktif acente ayni uygulamayi kullanirken veri ayrimi net kalir.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <article className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5">
              <p className="text-sm text-white/70">Aktif tenant</p>
              <p className="mt-2 text-2xl font-semibold">{agencyOptions.length} acente</p>
            </article>
            <article className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5">
              <p className="text-sm text-white/70">Giris modeli</p>
              <p className="mt-2 text-2xl font-semibold">
                {hasSupabaseEnv() ? "Supabase Auth" : "Demo yonlendirme"}
              </p>
            </article>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            Acenteli giris
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-[var(--color-ink)]">
            Secilen acenteye gore oturum ac
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
