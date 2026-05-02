type LegalFooterProps = {
  centered?: boolean;
};

export function LegalFooter({ centered = false }: LegalFooterProps) {
  return (
    <footer
      className={`rounded-[1.4rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.03)] px-4 py-4 text-sm text-[var(--color-muted)] ${
        centered ? "text-center" : ""
      }`}
    >
      <p className="font-medium text-[var(--color-ink)]">ADN Grup Sigorta</p>
      <p className="mt-1">Tum haklari saklidir.</p>
      <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
        ADN Trust Digital Operations Signature
      </p>
    </footer>
  );
}
