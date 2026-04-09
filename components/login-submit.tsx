"use client";

import { useFormStatus } from "react-dom";

export function LoginSubmit() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-[var(--color-strong)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
    >
      {pending ? "Giris kontrol ediliyor..." : "Acenteyi secip gir"}
    </button>
  );
}
