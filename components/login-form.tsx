"use client";

import { useActionState, useEffect } from "react";
import { loginWithAgency, type LoginActionState } from "@/app/giris/actions";
import { LoginSubmit } from "@/components/login-submit";

type AgencyOption = {
  slug: string;
  name: string;
  city: string;
};

type LoginFormProps = {
  agencies: AgencyOption[];
  hasSupabase: boolean;
  initialAgencySlug?: string;
  unauthorizedError?: string;
};

const initialState: LoginActionState = {
  error: "",
};

export function LoginForm({
  agencies,
  hasSupabase,
  initialAgencySlug,
  unauthorizedError = "",
}: LoginFormProps) {
  const [state, formAction] = useActionState(loginWithAgency, initialState);
  const selectedAgency = initialAgencySlug ?? agencies[0]?.slug ?? "";

  useEffect(() => {
    if (unauthorizedError && typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [unauthorizedError]);

  return (
    <form className="mt-8 space-y-5" action={formAction}>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
          Acente
        </span>
        <select
          name="agencySlug"
          defaultValue={selectedAgency}
          className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-soft)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none"
        >
          {agencies.map((agency) => (
            <option key={agency.slug} value={agency.slug}>
              {agency.name} / {agency.city}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
          E-posta
        </span>
        <input
          name="email"
          type="email"
          defaultValue="yonetici@acentam.com"
          className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-soft)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
          Sifre
        </span>
        <input
          name="password"
          type="password"
          defaultValue="demo1234"
          className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-soft)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none"
        />
      </label>

      <LoginSubmit />

      <div className="rounded-[1.25rem] border border-[var(--color-line)] bg-white/75 p-4 text-sm text-[var(--color-muted)]">
        {hasSupabase
          ? "Gercek giris modu aktif. Yetkisiz bir acente secilirse kullanici iceri alinmaz."
          : "Demo mod aktif. Supabase bilgileri tanimlanana kadar yetki kontrolu yerine demo yonlendirme kullanilir."}
      </div>

      {unauthorizedError ? (
        <p className="rounded-[1rem] bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {unauthorizedError}
        </p>
      ) : null}

      {state.error ? (
        <p className="rounded-[1rem] bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
