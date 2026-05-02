import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { RecordForms } from "@/components/record-forms";
import { SectionHeading } from "@/components/section-heading";
import { requireAgencyAccess } from "@/lib/auth";
import { getAgencyDashboard } from "@/lib/data";

type AgencyPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
};

export default async function AgencyPage({ params, searchParams }: AgencyPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  await requireAgencyAccess(slug);
  const {
    agency,
    source,
    customerOptions,
    policyOptions,
    customerRecords,
    policyRecords,
    taskRecords,
    documentRecords,
  } = await getAgencyDashboard(slug);

  if (!agency) {
    notFound();
  }

  const basePath = `/acente/${agency.slug}`;
  const activeTab =
    resolvedSearchParams.tab === "customers" ||
    resolvedSearchParams.tab === "policies" ||
    resolvedSearchParams.tab === "operations"
      ? resolvedSearchParams.tab
      : "overview";
  const renewalDueCount = policyRecords.filter(
    (policy) => policy.status === "renewal_due",
  ).length;
  const openTaskCount = taskRecords.filter((task) =>
    ["todo", "in_progress", "waiting"].includes(task.status),
  ).length;
  const recentDocumentCount = documentRecords.length;
  const hotLeadCount = agency.leads.filter((lead) => Number(lead.score) >= 80).length;

  return (
    <AppShell
      agencyName={agency.name}
      basePath={basePath}
      activeTab={activeTab}
      title="Operasyon ve portfoy kontrol merkezi"
      description={`${agency.city} ofisi icin musteri, police, lead, ekip ve belge surecleri tek merkezden yonetilir.`}
    >
      {activeTab === "overview" ? (
      <>
      <section id="genel-bakis" className="mb-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="hero-stage glow-card rounded-[1.9rem] p-5 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
            Canli genel bakis
          </p>
          <h2 className="display-title mt-3 text-3xl font-semibold text-white sm:text-[3rem]">
            Gunluk operasyonu hizli okuyun, dogru aksiyona inin.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:text-base sm:leading-8">
            ADN Grup Sigorta icin bugunku portfoy, yenileme, ekip ve dijital talep akisi
            tek ekranda toplandi. Ilk bakista neyin oncelikli oldugu hemen anlasilsin diye
            yuzeyi sade ama daha etkili hale getirdik.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Veri kaynagi", value: source === "supabase" ? "Supabase canli veri" : "Demo veri" },
              { label: "Sicak lead", value: `${hotLeadCount} kayit` },
              { label: "Acil takip", value: `${renewalDueCount + openTaskCount} dosya` },
            ].map((item) => (
              <div key={item.label} className="metric-tile rounded-[1.25rem] px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/48">{item.label}</p>
                <p className="mt-3 text-base font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-card rounded-[1.9rem] p-5 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
            Hizli karar paneli
          </p>
          <div className="mt-5 grid gap-3">
            {[
              "Yenilemesi gelen dosyalari once acin ve teklif bekleyen kayitlari guncelleyin.",
              "Skoru yuksek lead'leri gun icinde ilk 15 dakika icinde arayin.",
              "Belge hareketlerini tamamlayip ekip gorevlerini gun sonuna kadar kapatin.",
            ].map((item) => (
              <div key={item} className="rounded-[1.25rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.03)] px-4 py-4 text-sm leading-7 text-[var(--color-muted)]">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a href={`${basePath}?tab=policies`} className="cta-button text-center">
              Police akisini ac
            </a>
            <a href={`${basePath}?tab=operations`} className="secondary-button text-center">
              Operasyon alanina git
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Yenileme alarmi",
            value: `${renewalDueCount} police`,
            detail: "Bugun yakin takip isteyen yenileme dosyalari",
          },
          {
            title: "Acil gorev",
            value: `${openTaskCount} is`,
            detail: "Satis ve operasyon ekiplerinin bekleyen gorevleri",
          },
          {
            title: "Sicak lead",
            value: `${hotLeadCount} kayit`,
            detail: "Skoru 80 uzeri gelen dijital basvurular",
          },
          {
            title: "Belge hareketi",
            value: `${recentDocumentCount} dosya`,
            detail: "Arsive bagli son teklifler ve police kopyalari",
          },
        ].map((item) => (
          <article key={item.title} className="metric-tile rounded-[1.55rem] p-5">
            <p className="text-sm text-[var(--color-muted)]">{item.title}</p>
            <p className="mt-4 text-[2rem] font-semibold text-[var(--color-ink)]">
              {item.value}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              {item.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {agency.kpis.map((card) => (
          <article key={card.title} className="premium-card rounded-[1.6rem] p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-[var(--color-muted)]">{card.title}</p>
              <span className="rounded-full bg-[var(--color-chip)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-strong)]">
                {card.change}
              </span>
            </div>
            <p className="display-title mt-6 text-[2.4rem] font-semibold text-[var(--color-ink)]">
              {card.value}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              {card.detail}
            </p>
          </article>
        ))}
      </section>

      <section
        id="lead-akisi"
        className="mt-6 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]"
      >
        <div className="panel-card rounded-[2.25rem] p-6 sm:p-8">
          <SectionHeading
            eyebrow="Musteriler"
            title="Aktif musteri portfoyu"
            description="Kurumsal ve bireysel kartlar yenileme ve satis akisiyla birlikte izlenir."
          />
          <div className="mt-8 space-y-4">
            {agency.customers.map((customer) => (
              <article
                key={customer.name}
                className="premium-card rounded-[1.5rem] p-5"
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
                  <span className="rounded-full bg-[var(--color-chip)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-strong)]">
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
          <div className="panel-card rounded-[2.25rem] p-6 sm:p-8">
          <SectionHeading
            eyebrow="Policeler"
            title="Yenileme ve premium takibi"
            description="Kesilen, teklifte kalan ve yenilemeye gelen policeler ayni akista gorunur."
          />
            <div className="mt-8 space-y-4">
              {agency.policies.map((policy) => (
                <article
                  key={`${policy.customer}-${policy.branch}`}
                  className="premium-card rounded-[1.5rem] p-5"
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

          <div className="panel-card rounded-[2.25rem] p-6 sm:p-8">
          <SectionHeading
            eyebrow="Lead Akisi"
            title="Dijital talep havuzu"
            description="Meta Ads, landing page ve manuel talepler kalite skoruyla takip edilir."
          />
            <div className="mt-8 space-y-4">
              {agency.leads.map((lead) => (
                <article
                  key={lead.name}
                  className="premium-card rounded-[1.5rem] p-5"
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
      </>
      ) : null}

      {activeTab === "operations" ? (
      <section
        id="ekip"
        className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <div className="panel-card rounded-[2.25rem] p-6 sm:p-8">
          <SectionHeading
            eyebrow="Ekip"
            title="Ekip ve performans"
            description="Satis, yenileme ve operasyon ekiplerinin canli dagilimi gorunur."
          />
          <div className="mt-8 space-y-4">
            {agency.teamMembers.map((member, index) => (
              <article
                key={member.name}
                className="flex items-center justify-between gap-4 rounded-[1.5rem] premium-card p-5"
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

        <div className="panel-card rounded-[2.25rem] p-6 sm:p-8">
          <SectionHeading
            eyebrow="Mesaj ve Operasyon"
            title="Ic iletisim ve operasyon akisi"
            description="Mesajlasma, gorevler ve belge surecleri ayni panelde toplanir."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {agency.operationCards.map((card) => (
              <article
                key={card.title}
                className="premium-card rounded-[1.5rem] p-5"
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
                className="premium-card rounded-[1.5rem] p-5"
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
      ) : null}

      {activeTab !== "overview" ? (
        <section className="mt-6 panel-card rounded-[1.6rem] p-5 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
            {activeTab === "customers" ? "Musteri ekrani" : activeTab === "policies" ? "Police ekrani" : "Operasyon ekrani"}
          </p>
          <h2 className="display-title mt-3 text-3xl font-semibold text-[var(--color-ink)]">
            {activeTab === "customers"
              ? "Musteri listesi ve kayit islemleri"
              : activeTab === "policies"
                ? "Police akisi ve yenileme islemleri"
                : "Gorev, belge ve ekip operasyonu"}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            {activeTab === "customers"
              ? "Bu ekranda sadece musteri ile ilgili kayitlar, duzenlemeler ve musteri listesi gorunur."
              : activeTab === "policies"
                ? "Bu ekranda sadece police olusturma, portfoy duzenleme ve yenileme odakli alanlar gorunur."
                : "Bu ekranda gorevler, belgeler ve ekip operasyonuyla ilgili alanlar net sekilde ayrilir."}
          </p>
        </section>
      ) : null}

      {activeTab !== "overview" ? (
        <RecordForms
          slug={slug}
          source={source}
          customerOptions={customerOptions}
          policyOptions={policyOptions}
          customerRecords={customerRecords}
          policyRecords={policyRecords}
          taskRecords={taskRecords}
          documentRecords={documentRecords}
          mode={
            activeTab === "customers"
              ? "customers"
              : activeTab === "policies"
                ? "policies"
                : "operations"
          }
        />
      ) : null}
    </AppShell>
  );
}
