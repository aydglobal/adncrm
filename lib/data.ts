import { agencies, getAgencyBySlug, type Agency } from "@/lib/mock-data";
import type { Database } from "@/lib/supabase/database.types";
import {
  getSupabaseAdminClient,
  getSupabaseServerClient,
  hasSupabaseEnv,
} from "@/lib/supabase/server";

type DbAgency = Database["public"]["Tables"]["agencies"]["Row"] & {
  customers: Pick<Database["public"]["Tables"]["customers"]["Row"], "id">[] | null;
  policies:
    | Pick<
        Database["public"]["Tables"]["policies"]["Row"],
        "id" | "premium_amount" | "status"
      >[]
    | null;
  leads:
    | Pick<
        Database["public"]["Tables"]["leads"]["Row"],
        "id" | "quality_score" | "status"
      >[]
    | null;
};

type CustomerRow = Pick<
  Database["public"]["Tables"]["customers"]["Row"],
  | "id"
  | "full_name"
  | "company_name"
  | "city"
  | "phone"
  | "email"
  | "notes"
  | "created_at"
>;

type PolicyRow = Pick<
  Database["public"]["Tables"]["policies"]["Row"],
  | "id"
  | "customer_id"
  | "branch"
  | "insurer_name"
  | "policy_number"
  | "start_date"
  | "end_date"
  | "status"
  | "premium_amount"
  | "notes"
  | "created_at"
> & {
  customers:
    | Pick<Database["public"]["Tables"]["customers"]["Row"], "full_name" | "company_name">[]
    | null;
};

type LeadRow = Pick<
  Database["public"]["Tables"]["leads"]["Row"],
  | "full_name"
  | "source"
  | "quality_score"
  | "product_interest"
  | "last_action_note"
  | "status"
>;

type MessageRow = Pick<
  Database["public"]["Tables"]["messages"]["Row"],
  "topic" | "body" | "created_at"
>;

type TaskRow = Pick<
  Database["public"]["Tables"]["tasks"]["Row"],
  | "id"
  | "customer_id"
  | "policy_id"
  | "title"
  | "description"
  | "status"
  | "due_at"
  | "created_at"
>;

type DocumentRow = Pick<
  Database["public"]["Tables"]["documents"]["Row"],
  | "id"
  | "customer_id"
  | "policy_id"
  | "title"
  | "document_type"
  | "file_url"
  | "file_size_bytes"
  | "created_at"
>;

type MembershipRow = Pick<
  Database["public"]["Tables"]["agency_memberships"]["Row"],
  "role"
> & {
  profiles:
    | Pick<Database["public"]["Tables"]["profiles"]["Row"], "full_name" | "email">[]
    | null;
};

type SelectOption = {
  id: string;
  label: string;
};

type CustomerRecord = {
  id: string;
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  city: string;
  notes: string;
  createdAt: string;
};

type PolicyRecord = {
  id: string;
  customerId: string;
  customerLabel: string;
  branch: string;
  insurerName: string;
  policyNumber: string;
  startDate: string;
  endDate: string;
  status: string;
  premiumAmount: number;
  notes: string;
  createdAt: string;
};

type TaskRecord = {
  id: string;
  customerId: string;
  policyId: string;
  customerLabel: string;
  policyLabel: string;
  title: string;
  description: string;
  status: string;
  dueAt: string;
  createdAt: string;
};

type DocumentRecord = {
  id: string;
  customerId: string;
  policyId: string;
  customerLabel: string;
  policyLabel: string;
  title: string;
  documentType: string;
  fileUrl: string;
  fileSizeBytes: number;
  createdAt: string;
};

type AgencyDashboardResult = {
  source: "demo" | "supabase";
  agency: Agency | null;
  customerOptions: SelectOption[];
  policyOptions: SelectOption[];
  customerRecords: CustomerRecord[];
  policyRecords: PolicyRecord[];
  taskRecords: TaskRecord[];
  documentRecords: DocumentRecord[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDisplayDate(value: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDateTimeInput(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function getCustomerLabel(customer: {
  full_name?: string | null;
  company_name?: string | null;
}) {
  return customer.company_name || customer.full_name || "Musteri";
}

function mapDbAgencyToSummary(agency: DbAgency, fallback: Agency): Agency {
  const customerCount = agency.customers?.length ?? 0;
  const policyCount = agency.policies?.length ?? 0;
  const leadCount = agency.leads?.length ?? 0;
  const premiumTotal =
    agency.policies?.reduce(
      (sum, policy) => sum + Number(policy.premium_amount ?? 0),
      0,
    ) ?? 0;
  const renewalDueCount =
    agency.policies?.filter((policy) => policy.status === "renewal_due").length ?? 0;

  return {
    ...fallback,
    name: agency.name,
    slug: agency.slug,
    city: agency.city ?? fallback.city,
    users: `${Math.max(1, customerCount)} portfoy kaydi`,
    monthlyPremium:
      premiumTotal > 0 ? formatCurrency(premiumTotal) : fallback.monthlyPremium,
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
        detail: "renewal_due statusundeki police sayisi",
      },
      {
        title: "Aylik Prim Uretimi",
        value:
          premiumTotal > 0
            ? formatCurrency(premiumTotal)
            : fallback.kpis[3]?.value ?? "TL0",
        change: fallback.kpis[3]?.change ?? "+0",
        detail: "Police premium toplami",
      },
    ],
  };
}

function getDemoDashboard(fallback: Agency | undefined): AgencyDashboardResult {
  return {
    source: "demo",
    agency: fallback ?? null,
    customerOptions: [],
    policyOptions: [],
    customerRecords: [],
    policyRecords: [],
    taskRecords: [],
    documentRecords: [],
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

export async function getAgencyDashboard(
  slug: string,
): Promise<AgencyDashboardResult> {
  const fallback = getAgencyBySlug(slug);
  const client = await getSupabaseServerClient();
  const adminClient = getSupabaseAdminClient();

  if (!fallback || !client || !hasSupabaseEnv()) {
    return getDemoDashboard(fallback);
  }

  const { data: agency, error: agencyError } = await client
    .from("agencies")
    .select("id, name, slug, city")
    .eq("slug", slug)
    .maybeSingle();

  if (agencyError || !agency) {
    return getDemoDashboard(fallback);
  }

  const [
    { data: customers },
    { data: policies },
    { data: leads },
    { data: messages },
    { data: tasks },
    { data: documents },
    { data: memberships },
  ] = await Promise.all([
    client
      .from("customers")
      .select("id, full_name, company_name, city, phone, email, notes, created_at")
      .eq("agency_id", agency.id)
      .order("created_at", { ascending: false })
      .limit(8),
    client
      .from("policies")
      .select(
        "id, customer_id, branch, insurer_name, policy_number, start_date, end_date, status, premium_amount, notes, created_at, customers(full_name, company_name)",
      )
      .eq("agency_id", agency.id)
      .order("created_at", { ascending: false })
      .limit(8),
    client
      .from("leads")
      .select(
        "full_name, source, quality_score, product_interest, last_action_note, status",
      )
      .eq("agency_id", agency.id)
      .order("created_at", { ascending: false })
      .limit(6),
    client
      .from("messages")
      .select("topic, body, created_at")
      .eq("agency_id", agency.id)
      .order("created_at", { ascending: false })
      .limit(6),
    client
      .from("tasks")
      .select("id, customer_id, policy_id, title, description, status, due_at, created_at")
      .eq("agency_id", agency.id)
      .order("created_at", { ascending: false })
      .limit(8),
    client
      .from("documents")
      .select(
        "id, customer_id, policy_id, title, document_type, file_url, file_size_bytes, created_at",
      )
      .eq("agency_id", agency.id)
      .order("created_at", { ascending: false })
      .limit(8),
    adminClient
      ? adminClient
          .from("agency_memberships")
          .select("role, profiles(full_name, email)")
          .eq("agency_id", agency.id)
          .order("created_at", { ascending: true })
          .limit(6)
      : Promise.resolve({ data: null }),
  ]);

  const customerRows = (customers ?? []) as CustomerRow[];
  const policyRows = (policies ?? []) as PolicyRow[];
  const leadRows = (leads ?? []) as LeadRow[];
  const messageRows = (messages ?? []) as MessageRow[];
  const taskRows = (tasks ?? []) as TaskRow[];
  const documentRows = (documents ?? []) as DocumentRow[];
  const membershipRows = (memberships ?? []) as MembershipRow[];

  const customerRecords: CustomerRecord[] = customerRows.map((customer) => ({
    id: customer.id,
    fullName: customer.full_name,
    companyName: customer.company_name ?? "",
    phone: customer.phone ?? "",
    email: customer.email ?? "",
    city: customer.city ?? "",
    notes: customer.notes ?? "",
    createdAt: customer.created_at,
  }));

  const customerLookup = new Map(
    customerRecords.map((customer) => [
      customer.id,
      customer.companyName || customer.fullName,
    ]),
  );

  const policyRecords: PolicyRecord[] = policyRows.map((policy) => {
    const relatedCustomer = Array.isArray(policy.customers)
      ? policy.customers[0]
      : null;
    const customerLabel =
      customerLookup.get(policy.customer_id) ??
      getCustomerLabel(relatedCustomer ?? {}) ??
      "Musteri";

    return {
      id: policy.id,
      customerId: policy.customer_id,
      customerLabel,
      branch: policy.branch,
      insurerName: policy.insurer_name,
      policyNumber: policy.policy_number ?? "",
      startDate: policy.start_date ?? "",
      endDate: policy.end_date ?? "",
      status: policy.status,
      premiumAmount: Number(policy.premium_amount ?? 0),
      notes: policy.notes ?? "",
      createdAt: policy.created_at,
    };
  });

  const policyLookup = new Map(
    policyRecords.map((policy) => [
      policy.id,
      `${policy.branch} / ${policy.customerLabel}`,
    ]),
  );

  const taskRecords: TaskRecord[] = taskRows.map((task) => ({
    id: task.id,
    customerId: task.customer_id ?? "",
    policyId: task.policy_id ?? "",
    customerLabel: task.customer_id
      ? customerLookup.get(task.customer_id) ?? "-"
      : "-",
    policyLabel: task.policy_id ? policyLookup.get(task.policy_id) ?? "-" : "-",
    title: task.title,
    description: task.description ?? "",
    status: task.status,
    dueAt: formatDateTimeInput(task.due_at),
    createdAt: task.created_at,
  }));

  const documentRecords: DocumentRecord[] = documentRows.map((document) => ({
    id: document.id,
    customerId: document.customer_id ?? "",
    policyId: document.policy_id ?? "",
    customerLabel: document.customer_id
      ? customerLookup.get(document.customer_id) ?? "-"
      : "-",
    policyLabel: document.policy_id
      ? policyLookup.get(document.policy_id) ?? "-"
      : "-",
    title: document.title,
    documentType: document.document_type,
    fileUrl: document.file_url,
    fileSizeBytes: Number(document.file_size_bytes ?? 0),
    createdAt: document.created_at,
  }));

  const premiumTotal = policyRecords.reduce(
    (sum, policy) => sum + policy.premiumAmount,
    0,
  );

  return {
    source: "supabase",
    agency: {
      ...fallback,
      name: agency.name,
      slug: agency.slug,
      city: agency.city ?? fallback.city,
      kpis: [
        {
          title: "Aktif Police",
          value: String(policyRecords.length),
          change: fallback.kpis[0]?.change ?? "+0",
          detail: "Canli police sorgusundan geldi",
        },
        {
          title: "Bugun Gelen Lead",
          value: String(leadRows.length),
          change: fallback.kpis[1]?.change ?? "+0",
          detail: "Canli lead sorgusundan geldi",
        },
        {
          title: "Yenileme Riski",
          value: String(
            policyRecords.filter((policy) => policy.status === "renewal_due").length,
          ),
          change: fallback.kpis[2]?.change ?? "-0",
          detail: "renewal_due statusundeki police sayisi",
        },
        {
          title: "Aylik Prim Uretimi",
          value:
            premiumTotal > 0
              ? formatCurrency(premiumTotal)
              : fallback.kpis[3]?.value ?? "TL0",
          change: fallback.kpis[3]?.change ?? "+0",
          detail: "Toplam premium uretimi",
        },
      ],
      customers:
        customerRecords.length > 0
          ? customerRecords.map((customer) => ({
              name: customer.companyName || customer.fullName,
              segment: customer.companyName ? "Kurumsal" : "Bireysel",
              contact:
                [customer.phone, customer.email].filter(Boolean).join(" / ") ||
                customer.city ||
                "-",
              products: customer.notes || "Musteri notu henuz girilmedi",
              renewal: "Policelerle birlikte listeleniyor",
              owner: "ADN Sigorta",
            }))
          : fallback.customers,
      policies:
        policyRecords.length > 0
          ? policyRecords.map((policy) => ({
              customer: policy.customerLabel,
              branch: policy.branch,
              insurer: policy.insurerName,
              expiry: formatDisplayDate(policy.endDate),
              status: policy.status,
              premium: formatCurrency(policy.premiumAmount),
            }))
          : fallback.policies,
      leads:
        leadRows.length > 0
          ? leadRows.map((lead) => ({
              name: lead.full_name,
              source: lead.source,
              score: String(lead.quality_score),
              product: lead.product_interest || "-",
              action: lead.last_action_note || lead.status,
              owner: "ADN Sigorta",
            }))
          : fallback.leads,
      teamMembers:
        membershipRows.length > 0
          ? membershipRows.map((membership, index) => ({
              name:
                membership.profiles?.[0]?.full_name ||
                membership.profiles?.[0]?.email ||
                `Kullanici ${index + 1}`,
              role: membership.role.replaceAll("_", " "),
              sales: index === 0 ? "Canli ekip" : "Aktif uye",
              conversion: "Rol bazli",
              focus: "agency_memberships tablosundan geliyor",
            }))
          : fallback.teamMembers,
      operationCards:
        taskRecords.length > 0 || documentRecords.length > 0
          ? [
              {
                title: "Gorev Merkezi",
                text: `${taskRecords.length} gorev canli tabloda yonetiliyor. Ilk baslik: ${
                  taskRecords[0]?.title ?? "Henuz gorev yok"
                }`,
              },
              {
                title: "Belge Arsivi",
                text: `${documentRecords.length} belge canli arsivde. Son belge: ${
                  documentRecords[0]?.title ?? "Henuz belge yok"
                }`,
              },
              {
                title: "Surec Durumu",
                text: `En yakin operasyon durumu: ${
                  taskRecords[0]?.status ?? "beklemede"
                }`,
              },
              {
                title: "Canli Akis",
                text: "Tasks ve documents tablolari panelle cift yonlu bagli.",
              },
            ]
          : fallback.operationCards,
      messages:
        messageRows.length > 0
          ? messageRows.map((message) => ({
              from: "Ekip",
              topic: message.topic,
              body: message.body,
              time: new Date(message.created_at).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }))
          : fallback.messages,
    },
    customerOptions: customerRecords.map((customer) => ({
      id: customer.id,
      label: customer.companyName || customer.fullName,
    })),
    policyOptions: policyRecords.map((policy) => ({
      id: policy.id,
      label: `${policy.branch} / ${policy.customerLabel}`,
    })),
    customerRecords,
    policyRecords,
    taskRecords,
    documentRecords,
  };
}
