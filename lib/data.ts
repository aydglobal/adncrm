import { agencies, getAgencyBySlug, type Agency } from "@/lib/mock-data";
import { getSupabaseAdminClient, getSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type DbAgency = Database["public"]["Tables"]["agencies"]["Row"] & {
  customers: Pick<Database["public"]["Tables"]["customers"]["Row"], "id">[] | null;
  policies:
    | Pick<
        Database["public"]["Tables"]["policies"]["Row"],
        "id" | "premium_amount" | "status"
      >[]
    | null;
  leads:
    | Pick<Database["public"]["Tables"]["leads"]["Row"], "id" | "quality_score" | "status">[]
    | null;
};

type DashboardCustomerRow = Pick<
  Database["public"]["Tables"]["customers"]["Row"],
  "full_name" | "company_name" | "city" | "phone" | "email" | "notes"
>;

type DashboardLeadRow = Pick<
  Database["public"]["Tables"]["leads"]["Row"],
  "full_name" | "source" | "quality_score" | "product_interest" | "last_action_note" | "status"
>;

type DashboardMessageRow = Pick<
  Database["public"]["Tables"]["messages"]["Row"],
  "topic" | "body" | "created_at"
>;

type DashboardPolicyRow = Pick<
  Database["public"]["Tables"]["policies"]["Row"],
  "branch" | "insurer_name" | "end_date" | "status" | "premium_amount"
> & {
  customers:
    | Pick<Database["public"]["Tables"]["customers"]["Row"], "full_name" | "company_name">[]
    | null;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

function mapDbAgencyToSummary(agency: DbAgency, fallback: Agency): Agency {
  const customerCount = agency.customers?.length ?? 0;
  const policyCount = agency.policies?.length ?? 0;
  const leadCount = agency.leads?.length ?? 0;
  const premiumTotal =
    agency.policies?.reduce((sum, policy) => sum + Number(policy.premium_amount ?? 0), 0) ?? 0;
  const renewalDueCount =
    agency.policies?.filter((policy) => policy.status === "renewal_due").length ?? 0;

  return {
    ...fallback,
    name: agency.name,
    slug: agency.slug,
    city: agency.city ?? fallback.city,
    users: `${Math.max(1, customerCount)} portfoy kaydi`,
    monthlyPremium: premiumTotal > 0 ? formatCurrency(premiumTotal) : fallback.monthlyPremium,
    kpis: [
      {
        title: "Aktif Police",
        value: String(policyCount || fallback.kpis[0]?.value || "0"),
        change: fallback.kpis[0]?.change ?? "+0",
        detail: "Supabase verisinden canli hesaplanir",
      },
      {
        title: "Bugun Gelen Lead",
        value: String(leadCount || fallback.kpis[1]?.value || "0"),
        change: fallback.kpis[1]?.change ?? "+0",
        detail: "Lead tablosundan canli gelir",
      },
      {
        title: "Yenileme Riski",
        value: String(renewalDueCount || fallback.kpis[2]?.value || "0"),
        change: fallback.kpis[2]?.change ?? "-0",
        detail: "renewal_due statulu police sayisi",
      },
      {
        title: "Aylik Prim Uretimi",
        value: premiumTotal > 0 ? formatCurrency(premiumTotal) : fallback.kpis[3]?.value ?? "TL0",
        change: fallback.kpis[3]?.change ?? "+0",
        detail: "Police premium toplami",
      },
    ],
  };
}

export async function getAgencySummaries() {
  const client = getSupabaseAdminClient();

  if (!client || !hasSupabaseEnv()) {
    return {
      source: "demo" as const,
      agencies,
    };
  }

  const { data, error } = await client
    .from("agencies")
    .select(
      `
        id,
        name,
        slug,
        city,
        phone,
        email,
        customers ( id ),
        policies ( id, premium_amount, status ),
        leads ( id, quality_score, status )
      `,
    )
    .order("name", { ascending: true });

  if (error || !data) {
    return {
      source: "demo" as const,
      agencies,
    };
  }

  const mapped = (data as DbAgency[]).map((agency, index) => {
    const fallback = agencies[index] ?? agencies[0];
    return mapDbAgencyToSummary(agency, fallback);
  });

  return {
    source: "supabase" as const,
    agencies: mapped,
  };
}

export async function getAgencyDashboard(slug: string) {
  const fallback = getAgencyBySlug(slug);
  const client = await getSupabaseServerClient();

  if (!fallback || !client || !hasSupabaseEnv()) {
    return {
      source: "demo" as const,
      agency: fallback ?? null,
    };
  }

  const { data: agency, error: agencyError } = await client
    .from("agencies")
    .select("id, name, slug, city")
    .eq("slug", slug)
    .maybeSingle();

  if (agencyError || !agency) {
    return {
      source: "demo" as const,
      agency: fallback,
    };
  }

  const [{ data: customers }, { data: policies }, { data: leads }, { data: messages }] =
    await Promise.all([
      client
        .from("customers")
        .select("full_name, company_name, city, phone, email, notes")
        .eq("agency_id", agency.id)
        .order("created_at", { ascending: false })
        .limit(6),
      client
        .from("policies")
        .select("branch, insurer_name, end_date, status, premium_amount, customers(full_name, company_name)")
        .eq("agency_id", agency.id)
        .order("end_date", { ascending: true })
        .limit(6),
      client
        .from("leads")
        .select("full_name, source, quality_score, product_interest, last_action_note, status")
        .eq("agency_id", agency.id)
        .order("created_at", { ascending: false })
        .limit(6),
      client
        .from("messages")
        .select("topic, body, created_at")
        .eq("agency_id", agency.id)
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

  const safeCustomers = (customers ?? []) as DashboardCustomerRow[];
  const safePolicies = (policies ?? []) as DashboardPolicyRow[];
  const safeLeads = (leads ?? []) as DashboardLeadRow[];
  const safeMessages = (messages ?? []) as DashboardMessageRow[];

  const premiumTotal =
    safePolicies.reduce((sum, policy) => sum + Number(policy.premium_amount ?? 0), 0);

  return {
    source: "supabase" as const,
    agency: {
      ...fallback,
      name: agency.name,
      slug: agency.slug,
      city: agency.city ?? fallback.city,
      kpis: [
        {
          title: "Aktif Police",
          value: String(safePolicies.length),
          change: fallback.kpis[0]?.change ?? "+0",
          detail: "Canli police sorgusundan geldi",
        },
        {
          title: "Bugun Gelen Lead",
          value: String(safeLeads.length),
          change: fallback.kpis[1]?.change ?? "+0",
          detail: "Canli lead sorgusundan geldi",
        },
        {
          title: "Yenileme Riski",
          value: String(safePolicies.filter((policy) => policy.status === "renewal_due").length),
          change: fallback.kpis[2]?.change ?? "-0",
          detail: "renewal_due statulu police sayisi",
        },
        {
          title: "Aylik Prim Uretimi",
          value: premiumTotal > 0 ? formatCurrency(premiumTotal) : fallback.kpis[3]?.value ?? "TL0",
          change: fallback.kpis[3]?.change ?? "+0",
          detail: "Toplam premium uretimi",
        },
      ],
      customers:
        safeCustomers.map((customer) => ({
          name: customer.company_name || customer.full_name,
          segment: customer.company_name ? "Kurumsal" : "Bireysel",
          contact: [customer.phone, customer.email].filter(Boolean).join(" / ") || customer.city || "-",
          products: customer.notes || "Police detaylari baglanacak",
          renewal: "Takvim baglaninca otomatik dolacak",
          owner: "Atanacak",
        })) || fallback.customers,
      policies:
        safePolicies.map((policy) => ({
          customer:
            (Array.isArray(policy.customers) ? policy.customers[0]?.company_name || policy.customers[0]?.full_name : "") ||
            "Musteri",
          branch: policy.branch,
          insurer: policy.insurer_name,
          expiry: policy.end_date ?? "-",
          status: policy.status,
          premium: formatCurrency(Number(policy.premium_amount ?? 0)),
        })) || fallback.policies,
      leads:
        safeLeads.map((lead) => ({
          name: lead.full_name,
          source: lead.source,
          score: String(lead.quality_score),
          product: lead.product_interest || "-",
          action: lead.last_action_note || lead.status,
          owner: "Atanacak",
        })) || fallback.leads,
      messages:
        safeMessages.map((message) => ({
          from: "Ekip",
          topic: message.topic,
          body: message.body,
          time: new Date(message.created_at).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        })) || fallback.messages,
    },
  };
}
