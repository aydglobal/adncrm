"use client";

import { useFormStatus } from "react-dom";

export function LoginSubmit() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="cta-button w-full"
    >
      {pending ? "Giris kontrol ediliyor..." : "Panele gir"}
    </button>
  );
}
