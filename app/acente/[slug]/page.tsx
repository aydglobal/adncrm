import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { SectionHeading } from "@/components/section-heading";
import { requireAgencyAccess } from "@/lib/auth";
import { getAgencyDashboard } from "@/lib/data";

type AgencyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AgencyPage({ params }: AgencyPageProps) {
  const { slug } = await params;
  await requireAgencyAccess(slug);
  const { agency, source } = await getAgencyDashboard(slug);

  if (!agency) {
    notFound();
  }

  const basePath = `/acente/${agency.slug}`;

  return (
    <AppShell
      agencyName={agency.name}
      basePath={basePath}
      title="Acenta bazli operasyon paneli"
      description={`${agency.city} ofisi icin musteri, police, lead, ekip ve operasyon verileri tenant bazli ayrik gorunur.`}
    >
      <section className="mb-6 panel-card rounded-[1.5rem] p-4 text-sm text-[var(--color-muted)]">
        Veri kaynagi: {source === "supabase" ? "Supabase canli veri" : "Demo veri"}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {agency.kpis.map((card) => (
          <article key={card.title} className="panel-card rounded-[1.5rem] p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-[var(--color-muted)]">{card.title}</p>
              <span className="rounded-full bg-[var(--color-chip)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-strong)]">
                {card.change}
              </span>
            </div>
            <p className="mt-6 text-3xl font-semibold text-[var(--color-ink)]">
              {card.value}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              {card.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="panel-card rounded-[2rem] p-6 sm:p-8">
          <SectionHeading
            eyebrow="Musteriler"
            title="Bu acentenin aktif portfoyu"
            description="Tum musteri ve firma kartlari sadece secili acente kapsaminda listelenir."
          />
          <div className="mt-8 space-y-4">
            {agency.customers.map((customer) => (
              <article
                key={customer.name}
                className="rounded-[1.5rem] border border-[var(--color-line)] bg-white/85 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                      {customer.name}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {customer.segment}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--color-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-strong)]">
                    {customer.owner}
                  </span>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-[var(--color-muted)]">
                  <p>{customer.contact}</p>
                  <p>{customer.products}</p>
                  <p>Sonraki yenileme: {customer.renewal}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel-card rounded-[2rem] p-6 sm:p-8">
            <SectionHeading
              eyebrow="Policeler"
              title="Yenileme ve premium listesi"
              description="Police kayitlari secili tenant icinde filtrelenmis halde gosterilir."
            />
            <div className="mt-8 space-y-4">
              {agency.policies.map((policy) => (
                <article
                  key={`${policy.customer}-${policy.branch}`}
                  className="rounded-[1.5rem] border border-[var(--color-line)] bg-white/85 p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                        {policy.customer}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        {policy.branch} / {policy.insurer}
                      </p>
                    </div>
                    <span className="rounded-full bg-[var(--color-chip)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-strong)]">
                      {policy.status}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-[var(--color-muted)]">{policy.expiry}</span>
                    <span className="font-semibold text-[var(--color-ink)]">
                      {policy.premium}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="panel-card rounded-[2rem] p-6 sm:p-8">
            <SectionHeading
              eyebrow="Lead Akisi"
              title="Acenteye ozel dijital talep havuzu"
              description="Meta Ads ve formlar sadece ilgili acente satis ekibine duser."
            />
            <div className="mt-8 space-y-4">
              {agency.leads.map((lead) => (
                <article
                  key={lead.name}
                  className="rounded-[1.5rem] border border-[var(--color-line)] bg-white/85 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                        {lead.name}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        {lead.source}
                      </p>
                    </div>
                    <span className="rounded-full bg-[var(--color-strong)] px-3 py-1 text-sm font-semibold text-white">
                      {lead.score}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-[var(--color-muted)]">
                    <p>Urun: {lead.product}</p>
                    <p>Son aksiyon: {lead.action}</p>
                    <p>Temsilci: {lead.owner}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel-card rounded-[2rem] p-6 sm:p-8">
          <SectionHeading
            eyebrow="Ekip"
            title="Acenteye bagli kullanicilar"
            description="Rol ve performans bilgileri tenant bazinda izlenir."
          />
          <div className="mt-8 space-y-4">
            {agency.teamMembers.map((member, index) => (
              <article
                key={member.name}
                className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-[var(--color-line)] bg-white/85 p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-soft)] text-lg font-semibold text-[var(--color-accent-strong)]">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-ink)]">
                      {member.name}
                    </h3>
                    <p className="text-sm text-[var(--color-muted)]">{member.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[var(--color-ink)]">{member.sales}</p>
                  <p className="text-sm text-[var(--color-muted)]">
                    Donusum {member.conversion}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="panel-card rounded-[2rem] p-6 sm:p-8">
          <SectionHeading
            eyebrow="Mesaj ve Operasyon"
            title="Acenteye ozel ic akis"
            description="Mesajlar, gorevler ve belge surecleri baska acentelerden ayrik tutulur."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {agency.operationCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-soft)] p-5"
              >
                <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  {card.text}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-6 space-y-4">
            {agency.messages.map((message) => (
              <article
                key={`${message.from}-${message.time}`}
                className="rounded-[1.5rem] border border-[var(--color-line)] bg-white/85 p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-[var(--color-ink)]">
                    {message.topic}
                  </h3>
                  <span className="text-sm text-[var(--color-muted)]">
                    {message.time}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--color-accent-strong)]">
                  {message.from}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  {message.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
