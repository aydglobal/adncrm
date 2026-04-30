"use server";

import { redirect } from "next/navigation";
import { demoAgencySlug, demoPassword, demoUsername } from "@/lib/demo-auth";
import { getSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

export type LoginActionState = {
  error: string;
};

export async function loginWithAgency(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const agencySlug = String(formData.get("agencySlug") ?? "");
  const identifier = String(formData.get("identifier") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!agencySlug) {
    return { error: "Lutfen bir acente secin." };
  }

  if (!hasSupabaseEnv()) {
    if (
      agencySlug !== demoAgencySlug ||
      identifier !== demoUsername ||
      password !== demoPassword
    ) {
      return { error: "Kullanici adi veya sifre hatali." };
    }

    redirect(`/acente/${agencySlug}`);
  }

  const client = await getSupabaseServerClient();

  if (!client) {
    return { error: "Supabase baglantisi kurulamadı." };
  }

  const { data: signInData, error: authError } = await client.auth.signInWithPassword({
    email: identifier.includes("@") ? identifier : `${identifier}@adntrust.net`,
    password,
  });

  if (authError || !signInData.user) {
    return { error: authError?.message ?? "Giris basarisiz oldu." };
  }

  const { data: membership, error: membershipError } = await client
    .from("agency_memberships")
    .select("agency_id, agencies!inner(slug)")
    .eq("profile_id", signInData.user.id)
    .eq("agencies.slug", agencySlug)
    .maybeSingle();

  if (membershipError || !membership) {
    await client.auth.signOut();
    return {
      error: "Bu kullanicinin sectiginiz acenteye giris yetkisi yok.",
    };
  }

  redirect(`/acente/${agencySlug}`);
}
