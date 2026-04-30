"use server";

import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

type PolicyStatus = Database["public"]["Enums"]["policy_status"];
type TaskStatus = Database["public"]["Enums"]["task_status"];
type DocumentType = Database["public"]["Enums"]["document_type"];

export type CrudActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

type AgencyContext =
  | {
      error: string;
      client: null;
      agencyId: null;
      userId: null;
    }
  | {
      error: "";
      client: NonNullable<Awaited<ReturnType<typeof getSupabaseServerClient>>>;
      agencyId: string;
      userId: string;
    };

function hasContext(
  context: AgencyContext,
): context is Extract<AgencyContext, { error: "" }> {
  return context.error === "";
}

const initialSuccess = (message: string): CrudActionState => ({
  status: "success",
  message,
});

const initialError = (message: string): CrudActionState => ({
  status: "error",
  message,
});

function parseText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function parseNullableText(formData: FormData, key: string) {
  return parseText(formData, key) || null;
}

function parseNumber(formData: FormData, key: string) {
  const raw = Number(formData.get(key) ?? 0);
  return Number.isFinite(raw) ? raw : 0;
}

function getDocumentsBucket() {
  return process.env.SUPABASE_DOCUMENTS_BUCKET || "documents";
}

function buildStoragePath(agencyId: string, fileName: string) {
  const cleaned = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `${agencyId}/${crypto.randomUUID()}-${cleaned}`;
}

function extractStoragePath(fileUrl: string, bucket: string) {
  const marker = `/${bucket}/`;
  const markerIndex = fileUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  const path = fileUrl.slice(markerIndex + marker.length).split("?")[0];
  return path || null;
}

async function getAgencyContext(slug: string): Promise<AgencyContext> {
  if (!hasSupabaseEnv()) {
    return {
      error: "Canli veritabani baglantisi bulunamadi.",
      client: null,
      agencyId: null,
      userId: null,
    };
  }

  const client = await getSupabaseServerClient();

  if (!client) {
    return {
      error: "Supabase istemcisi olusturulamadi.",
      client: null,
      agencyId: null,
      userId: null,
    };
  }

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return {
      error: "Oturum bulunamadi.",
      client: null,
      agencyId: null,
      userId: null,
    };
  }

  const { data: agency, error } = await client
    .from("agencies")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !agency) {
    return {
      error: "Kurum kaydi bulunamadi.",
      client: null,
      agencyId: null,
      userId: null,
    };
  }

  return {
    error: "",
    client,
    agencyId: agency.id,
    userId: user.id,
  };
}

async function uploadDocumentFile(
  context: Extract<AgencyContext, { error: "" }>,
  file: File,
) {
  if (!file.size) {
    return { error: "Yuklenecek dosya secilmedi.", publicUrl: null, storagePath: null };
  }

  const bucket = getDocumentsBucket();
  const storagePath = buildStoragePath(context.agencyId, file.name || "belge.pdf");
  const fileBuffer = await file.arrayBuffer();

  const { error } = await context.client.storage.from(bucket).upload(storagePath, fileBuffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    return {
      error: "Belge dosyasi Supabase Storage alanina yuklenemedi.",
      publicUrl: null,
      storagePath: null,
    };
  }

  const {
    data: { publicUrl },
  } = context.client.storage.from(bucket).getPublicUrl(storagePath);

  return {
    error: "",
    publicUrl,
    storagePath,
  };
}

async function removeStoredDocument(
  context: Extract<AgencyContext, { error: "" }>,
  fileUrl: string | null,
) {
  if (!fileUrl) {
    return;
  }

  const bucket = getDocumentsBucket();
  const storagePath = extractStoragePath(fileUrl, bucket);

  if (!storagePath) {
    return;
  }

  await context.client.storage.from(bucket).remove([storagePath]);
}

function refreshAgencyPage(slug: string) {
  revalidatePath(`/acente/${slug}`);
}

export async function createCustomer(
  slug: string,
  _prevState: CrudActionState,
  formData: FormData,
): Promise<CrudActionState> {
  void _prevState;
  const context = await getAgencyContext(slug);

  if (!hasContext(context)) {
    return initialError(context.error);
  }

  const fullName = parseText(formData, "fullName");
  const companyName = parseText(formData, "companyName");

  if (!fullName) {
    return initialError("Musteri adi zorunlu.");
  }

  const { error } = await context.client.from("customers").insert({
    agency_id: context.agencyId,
    full_name: fullName,
    company_name: companyName || null,
    phone: parseNullableText(formData, "phone"),
    email: parseNullableText(formData, "email"),
    city: parseNullableText(formData, "city"),
    notes: parseNullableText(formData, "notes"),
    customer_type: companyName ? "company" : "individual",
    created_by: context.userId,
  });

  if (error) {
    return initialError("Musteri kaydi eklenemedi.");
  }

  refreshAgencyPage(slug);
  return initialSuccess("Musteri kaydi eklendi.");
}

export async function updateCustomer(
  slug: string,
  customerId: string,
  _prevState: CrudActionState,
  formData: FormData,
): Promise<CrudActionState> {
  void _prevState;
  const context = await getAgencyContext(slug);

  if (!hasContext(context)) {
    return initialError(context.error);
  }

  const fullName = parseText(formData, "fullName");
  const companyName = parseText(formData, "companyName");

  if (!fullName) {
    return initialError("Musteri adi zorunlu.");
  }

  const { error } = await context.client
    .from("customers")
    .update({
      full_name: fullName,
      company_name: companyName || null,
      phone: parseNullableText(formData, "phone"),
      email: parseNullableText(formData, "email"),
      city: parseNullableText(formData, "city"),
      notes: parseNullableText(formData, "notes"),
      customer_type: companyName ? "company" : "individual",
    })
    .eq("agency_id", context.agencyId)
    .eq("id", customerId);

  if (error) {
    return initialError("Musteri kaydi guncellenemedi.");
  }

  refreshAgencyPage(slug);
  return initialSuccess("Musteri kaydi guncellendi.");
}

export async function deleteCustomer(
  slug: string,
  customerId: string,
  _prevState: CrudActionState,
  _formData: FormData,
): Promise<CrudActionState> {
  void _prevState;
  void _formData;
  const context = await getAgencyContext(slug);

  if (!hasContext(context)) {
    return initialError(context.error);
  }

  const { error } = await context.client
    .from("customers")
    .delete()
    .eq("agency_id", context.agencyId)
    .eq("id", customerId);

  if (error) {
    return initialError("Musteri kaydi silinemedi. Ilgili police veya gorevler bagli olabilir.");
  }

  refreshAgencyPage(slug);
  return initialSuccess("Musteri kaydi silindi.");
}

export async function createPolicy(
  slug: string,
  _prevState: CrudActionState,
  formData: FormData,
): Promise<CrudActionState> {
  void _prevState;
  const context = await getAgencyContext(slug);

  if (!hasContext(context)) {
    return initialError(context.error);
  }

  const customerId = parseText(formData, "customerId");
  const branch = parseText(formData, "branch");
  const insurerName = parseText(formData, "insurerName");

  if (!customerId || !branch || !insurerName) {
    return initialError("Musteri, brans ve sigorta sirketi zorunlu.");
  }

  const { error } = await context.client.from("policies").insert({
    agency_id: context.agencyId,
    customer_id: customerId,
    branch,
    insurer_name: insurerName,
    policy_number: parseNullableText(formData, "policyNumber"),
    start_date: parseNullableText(formData, "startDate"),
    end_date: parseNullableText(formData, "endDate"),
    premium_amount: parseNumber(formData, "premiumAmount"),
    status: parseText(formData, "status") as PolicyStatus,
    notes: parseNullableText(formData, "notes"),
    created_by: context.userId,
  });

  if (error) {
    return initialError("Police kaydi eklenemedi.");
  }

  refreshAgencyPage(slug);
  return initialSuccess("Police kaydi eklendi.");
}

export async function updatePolicy(
  slug: string,
  policyId: string,
  _prevState: CrudActionState,
  formData: FormData,
): Promise<CrudActionState> {
  void _prevState;
  const context = await getAgencyContext(slug);

  if (!hasContext(context)) {
    return initialError(context.error);
  }

  const customerId = parseText(formData, "customerId");
  const branch = parseText(formData, "branch");
  const insurerName = parseText(formData, "insurerName");

  if (!customerId || !branch || !insurerName) {
    return initialError("Musteri, brans ve sigorta sirketi zorunlu.");
  }

  const { error } = await context.client
    .from("policies")
    .update({
      customer_id: customerId,
      branch,
      insurer_name: insurerName,
      policy_number: parseNullableText(formData, "policyNumber"),
      start_date: parseNullableText(formData, "startDate"),
      end_date: parseNullableText(formData, "endDate"),
      premium_amount: parseNumber(formData, "premiumAmount"),
      status: parseText(formData, "status") as PolicyStatus,
      notes: parseNullableText(formData, "notes"),
    })
    .eq("agency_id", context.agencyId)
    .eq("id", policyId);

  if (error) {
    return initialError("Police kaydi guncellenemedi.");
  }

  refreshAgencyPage(slug);
  return initialSuccess("Police kaydi guncellendi.");
}

export async function deletePolicy(
  slug: string,
  policyId: string,
  _prevState: CrudActionState,
  _formData: FormData,
): Promise<CrudActionState> {
  void _prevState;
  void _formData;
  const context = await getAgencyContext(slug);

  if (!hasContext(context)) {
    return initialError(context.error);
  }

  const { error } = await context.client
    .from("policies")
    .delete()
    .eq("agency_id", context.agencyId)
    .eq("id", policyId);

  if (error) {
    return initialError("Police kaydi silinemedi. Ilgili belge ya da gorev bagli olabilir.");
  }

  refreshAgencyPage(slug);
  return initialSuccess("Police kaydi silindi.");
}

export async function createTask(
  slug: string,
  _prevState: CrudActionState,
  formData: FormData,
): Promise<CrudActionState> {
  void _prevState;
  const context = await getAgencyContext(slug);

  if (!hasContext(context)) {
    return initialError(context.error);
  }

  const title = parseText(formData, "title");

  if (!title) {
    return initialError("Gorev basligi zorunlu.");
  }

  const { error } = await context.client.from("tasks").insert({
    agency_id: context.agencyId,
    customer_id: parseNullableText(formData, "customerId"),
    policy_id: parseNullableText(formData, "policyId"),
    title,
    description: parseNullableText(formData, "description"),
    due_at: parseNullableText(formData, "dueAt"),
    status: parseText(formData, "status") as TaskStatus,
    created_by: context.userId,
  });

  if (error) {
    return initialError("Gorev eklenemedi.");
  }

  refreshAgencyPage(slug);
  return initialSuccess("Gorev eklendi.");
}

export async function updateTask(
  slug: string,
  taskId: string,
  _prevState: CrudActionState,
  formData: FormData,
): Promise<CrudActionState> {
  void _prevState;
  const context = await getAgencyContext(slug);

  if (!hasContext(context)) {
    return initialError(context.error);
  }

  const title = parseText(formData, "title");

  if (!title) {
    return initialError("Gorev basligi zorunlu.");
  }

  const { error } = await context.client
    .from("tasks")
    .update({
      customer_id: parseNullableText(formData, "customerId"),
      policy_id: parseNullableText(formData, "policyId"),
      title,
      description: parseNullableText(formData, "description"),
      due_at: parseNullableText(formData, "dueAt"),
      status: parseText(formData, "status") as TaskStatus,
    })
    .eq("agency_id", context.agencyId)
    .eq("id", taskId);

  if (error) {
    return initialError("Gorev guncellenemedi.");
  }

  refreshAgencyPage(slug);
  return initialSuccess("Gorev guncellendi.");
}

export async function deleteTask(
  slug: string,
  taskId: string,
  _prevState: CrudActionState,
  _formData: FormData,
): Promise<CrudActionState> {
  void _prevState;
  void _formData;
  const context = await getAgencyContext(slug);

  if (!hasContext(context)) {
    return initialError(context.error);
  }

  const { error } = await context.client
    .from("tasks")
    .delete()
    .eq("agency_id", context.agencyId)
    .eq("id", taskId);

  if (error) {
    return initialError("Gorev silinemedi.");
  }

  refreshAgencyPage(slug);
  return initialSuccess("Gorev silindi.");
}

export async function createDocument(
  slug: string,
  _prevState: CrudActionState,
  formData: FormData,
): Promise<CrudActionState> {
  void _prevState;
  const context = await getAgencyContext(slug);

  if (!hasContext(context)) {
    return initialError(context.error);
  }

  const title = parseText(formData, "title");
  const file = formData.get("file");

  if (!title) {
    return initialError("Belge adi zorunlu.");
  }

  if (!(file instanceof File) || !file.size) {
    return initialError("Belge dosyasi secmelisiniz.");
  }

  const upload = await uploadDocumentFile(context, file);

  if (upload.error || !upload.publicUrl) {
    return initialError(upload.error || "Belge dosyasi yuklenemedi.");
  }

  const { error } = await context.client.from("documents").insert({
    agency_id: context.agencyId,
    customer_id: parseNullableText(formData, "customerId"),
    policy_id: parseNullableText(formData, "policyId"),
    title,
    file_url: upload.publicUrl,
    file_size_bytes: file.size,
    document_type: parseText(formData, "documentType") as DocumentType,
    uploaded_by: context.userId,
  });

  if (error) {
    await removeStoredDocument(context, upload.publicUrl);
    return initialError("Belge kaydi eklenemedi.");
  }

  refreshAgencyPage(slug);
  return initialSuccess("Belge kaydi eklendi.");
}

export async function updateDocument(
  slug: string,
  documentId: string,
  _prevState: CrudActionState,
  formData: FormData,
): Promise<CrudActionState> {
  void _prevState;
  const context = await getAgencyContext(slug);

  if (!hasContext(context)) {
    return initialError(context.error);
  }

  const title = parseText(formData, "title");
  const existingFileUrl = parseNullableText(formData, "existingFileUrl");
  const file = formData.get("file");

  if (!title) {
    return initialError("Belge adi zorunlu.");
  }

  let nextFileUrl = existingFileUrl;
  let nextFileSize = parseNumber(formData, "existingFileSize");

  if (file instanceof File && file.size) {
    const upload = await uploadDocumentFile(context, file);

    if (upload.error || !upload.publicUrl) {
      return initialError(upload.error || "Yeni belge yuklenemedi.");
    }

    nextFileUrl = upload.publicUrl;
    nextFileSize = file.size;

    if (existingFileUrl && existingFileUrl !== nextFileUrl) {
      await removeStoredDocument(context, existingFileUrl);
    }
  }

  if (!nextFileUrl) {
    return initialError("Belge dosyasi zorunlu.");
  }

  const { error } = await context.client
    .from("documents")
    .update({
      customer_id: parseNullableText(formData, "customerId"),
      policy_id: parseNullableText(formData, "policyId"),
      title,
      file_url: nextFileUrl,
      file_size_bytes: nextFileSize || null,
      document_type: parseText(formData, "documentType") as DocumentType,
    })
    .eq("agency_id", context.agencyId)
    .eq("id", documentId);

  if (error) {
    return initialError("Belge kaydi guncellenemedi.");
  }

  refreshAgencyPage(slug);
  return initialSuccess("Belge kaydi guncellendi.");
}

export async function deleteDocument(
  slug: string,
  documentId: string,
  _prevState: CrudActionState,
  formData: FormData,
): Promise<CrudActionState> {
  void _prevState;
  const context = await getAgencyContext(slug);

  if (!hasContext(context)) {
    return initialError(context.error);
  }

  const fileUrl = parseNullableText(formData, "fileUrl");

  const { error } = await context.client
    .from("documents")
    .delete()
    .eq("agency_id", context.agencyId)
    .eq("id", documentId);

  if (error) {
    return initialError("Belge kaydi silinemedi.");
  }

  await removeStoredDocument(context, fileUrl);

  refreshAgencyPage(slug);
  return initialSuccess("Belge kaydi silindi.");
}
