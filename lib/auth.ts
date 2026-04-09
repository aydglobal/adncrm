import "server-only";

import { redirect } from "next/navigation";
import { getSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

function extractAgencySlug(
  agencies: { slug: string; name: string } | { slug: string; name: string }[] | null,
) {
  if (Array.isArray(agencies)) {
    return agencies[0]?.slug;
  }

  return agencies?.slug;
}

export async function getCurrentSessionUser() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const client = await getSupabaseServerClient();

  if (!client) {
    return null;
  }

  const {
    data: { user },
  } = await client.auth.getUser();

  return user;
}

export async function getAuthorizedAgencySlugsForCurrentUser() {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const user = await getCurrentSessionUser();

  if (!user) {
    return [];
  }

  const client = await getSupabaseServerClient();

  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from("agency_memberships")
    .select("agency_id, agencies(slug, name)")
    .eq("profile_id", user.id);

  if (error || !data) {
    return [];
  }

  return data
    .map((membership) => extractAgencySlug(membership.agencies))
    .filter((slug): slug is string => Boolean(slug));
}

export async function requireAgencyAccess(slug: string) {
  if (!hasSupabaseEnv()) {
    return;
  }

  const allowedSlugs = await getAuthorizedAgencySlugsForCurrentUser();

  if (!allowedSlugs.includes(slug)) {
    redirect(`/giris?error=yetkisiz&agency=${slug}`);
  }
}
