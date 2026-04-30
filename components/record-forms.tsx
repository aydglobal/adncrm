"use client";

import type { ReactNode } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createCustomer,
  createDocument,
  createPolicy,
  createTask,
  deleteCustomer,
  deleteDocument,
  deletePolicy,
  deleteTask,
  type CrudActionState,
  updateCustomer,
  updateDocument,
  updatePolicy,
  updateTask,
} from "@/app/acente/[slug]/actions";

type SelectOption = { id: string; label: string };
type ActionHandler = (
  state: CrudActionState,
  formData: FormData,
) => Promise<CrudActionState>;

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

type RecordFormsProps = {
  slug: string;
  source: "demo" | "supabase";
  customerOptions: SelectOption[];
  policyOptions: SelectOption[];
  customerRecords: CustomerRecord[];
  policyRecords: PolicyRecord[];
  taskRecords: TaskRecord[];
  documentRecords: DocumentRecord[];
};

const initialState: CrudActionState = { status: "idle", message: "" };

function fmtDate(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

function StatusNote({ state }: { state: CrudActionState }) {
  if (state.status === "idle" || !state.message) return null;
  return (
    <p
      className={`mt-3 rounded-xl px-3 py-2 text-sm ${
        state.status === "success"
          ? "bg-emerald-500/10 text-emerald-300"
          : "bg-rose-500/10 text-rose-300"
      }`}
    >
      {state.message}
    </p>
  );
}

function SubmitButton({
  idle,
  pending,
  tone = "primary",
  disabled = false,
}: {
  idle: string;
  pending: string;
  tone?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}) {
  const { pending: isPending } = useFormStatus();
  const classes =
    tone === "primary"
      ? "bg-[var(--color-strong)] text-white"
      : tone === "danger"
        ? "border border-rose-400/40 bg-rose-500/10 text-rose-200"
        : "border border-[var(--color-line)] bg-white/5 text-[var(--color-ink)]";

  return (
    <button
      type="submit"
      disabled={isPending || disabled}
      className={`min-h-11 rounded-full px-4 py-3 text-sm font-semibold disabled:opacity-60 ${classes}`}
    >
      {isPending ? pending : idle}
    </button>
  );
}

function Input(props: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
        {props.label}
      </span>
      <input
        name={props.name}
        type={props.type ?? "text"}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
        required={props.required}
        disabled={props.disabled}
        className="min-h-12 w-full rounded-2xl border border-[var(--color-line)] bg-white/5 px-4 py-3 text-sm text-[var(--color-ink)] outline-none"
      />
    </label>
  );
}

function Textarea(props: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
        {props.label}
      </span>
      <textarea
        name={props.name}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
        rows={props.rows ?? 3}
        disabled={props.disabled}
        className="min-h-28 w-full rounded-2xl border border-[var(--color-line)] bg-white/5 px-4 py-3 text-sm text-[var(--color-ink)] outline-none"
      />
    </label>
  );
}

function Select(props: {
  label: string;
  name: string;
  options: SelectOption[];
  defaultValue?: string;
  emptyLabel?: string;
  allowEmpty?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
        {props.label}
      </span>
      <select
        name={props.name}
        defaultValue={props.defaultValue ?? ""}
        disabled={props.disabled}
        className="min-h-12 w-full rounded-2xl border border-[var(--color-line)] bg-white/5 px-4 py-3 text-sm text-[var(--color-ink)] outline-none"
      >
        <option value="" disabled={!props.allowEmpty}>
          {props.emptyLabel ?? "Secim yapin"}
        </option>
        {props.options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Card({
  eyebrow,
  title,
  children,
  id,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="panel-card rounded-[1.6rem] p-4 sm:rounded-[2rem] sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-xl font-semibold text-[var(--color-ink)] sm:text-2xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ModeBanner({ source }: { source: "demo" | "supabase" }) {
  if (source === "supabase") {
    return null;
  }

  return (
    <section className="premium-card rounded-[1.6rem] border border-amber-300/20 bg-amber-500/5 p-4 text-sm text-[var(--color-muted)] sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
        Onizleme modu
      </p>
      <p className="mt-2 leading-7">
        Bu ekrandaki formlar ve duzenleme aksiyonlari tasarim ve akisi gostermek
        icin hazir. Gercek kayit ekleme, duzenleme ve belge yukleme Supabase
        baglantisi acildiginda otomatik olarak aktif olur.
      </p>
    </section>
  );
}

function MessageState({
  primary,
  secondary,
}: {
  primary: CrudActionState;
  secondary?: CrudActionState;
}) {
  return <StatusNote state={primary.status !== "idle" ? primary : secondary ?? initialState} />;
}

function CustomerItem({
  record,
  updateAction,
  deleteAction,
  disabled = false,
}: {
  record: CustomerRecord;
  updateAction: ActionHandler;
  deleteAction: ActionHandler;
  disabled?: boolean;
}) {
  const [updateState, updateFormAction] = useActionState(updateAction, initialState);
  const [deleteState, deleteFormAction] = useActionState(deleteAction, initialState);

  return (
    <article className="premium-card rounded-[1.5rem] p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[var(--color-ink)]">
          {record.companyName || record.fullName}
        </h3>
        <p className="text-sm text-[var(--color-muted)]">{fmtDate(record.createdAt)}</p>
      </div>
      <form action={updateFormAction} className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Musteri adi" name="fullName" defaultValue={record.fullName} required disabled={disabled} />
          <Input label="Firma adi" name="companyName" defaultValue={record.companyName} disabled={disabled} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Telefon" name="phone" defaultValue={record.phone} disabled={disabled} />
          <Input label="E-posta" name="email" type="email" defaultValue={record.email} disabled={disabled} />
          <Input label="Sehir" name="city" defaultValue={record.city} disabled={disabled} />
        </div>
        <Textarea label="Not" name="notes" defaultValue={record.notes} disabled={disabled} />
        <div className="flex flex-wrap gap-3">
          <SubmitButton idle="Guncelle" pending="Guncelleniyor..." disabled={disabled} />
        </div>
      </form>
      <form action={deleteFormAction} className="mt-3">
        <SubmitButton idle="Musteriyi sil" pending="Siliniyor..." tone="danger" disabled={disabled} />
      </form>
      <MessageState primary={updateState} secondary={deleteState} />
    </article>
  );
}

function PolicyItem({
  record,
  customerOptions,
  updateAction,
  deleteAction,
  disabled = false,
}: {
  record: PolicyRecord;
  customerOptions: SelectOption[];
  updateAction: ActionHandler;
  deleteAction: ActionHandler;
  disabled?: boolean;
}) {
  const [updateState, updateFormAction] = useActionState(updateAction, initialState);
  const [deleteState, deleteFormAction] = useActionState(deleteAction, initialState);

  return (
    <article className="premium-card rounded-[1.5rem] p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-ink)]">
            {record.branch} / {record.customerLabel}
          </h3>
          <p className="text-sm text-[var(--color-muted)]">
            {fmtCurrency(record.premiumAmount)}
          </p>
        </div>
        <span className="rounded-full bg-[var(--color-chip)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-strong)]">
          {record.status}
        </span>
      </div>
      <form action={updateFormAction} className="grid gap-4">
        <Select
          label="Musteri"
          name="customerId"
          options={customerOptions}
          defaultValue={record.customerId}
          disabled={disabled}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Brans" name="branch" defaultValue={record.branch} required disabled={disabled} />
          <Input label="Sigorta sirketi" name="insurerName" defaultValue={record.insurerName} required disabled={disabled} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Police no" name="policyNumber" defaultValue={record.policyNumber} disabled={disabled} />
          <Input label="Prim" name="premiumAmount" type="number" defaultValue={record.premiumAmount} disabled={disabled} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Baslangic" name="startDate" type="date" defaultValue={record.startDate} disabled={disabled} />
          <Input label="Bitis" name="endDate" type="date" defaultValue={record.endDate} disabled={disabled} />
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">Durum</span>
            <select name="status" defaultValue={record.status} disabled={disabled} className="w-full rounded-2xl border border-[var(--color-line)] bg-white/5 px-4 py-3 text-sm text-[var(--color-ink)] outline-none">
              <option value="draft">draft</option>
              <option value="quoted">quoted</option>
              <option value="active">active</option>
              <option value="renewal_due">renewal_due</option>
              <option value="expired">expired</option>
              <option value="cancelled">cancelled</option>
            </select>
          </label>
        </div>
        <Textarea label="Not" name="notes" defaultValue={record.notes} disabled={disabled} />
        <SubmitButton idle="Guncelle" pending="Guncelleniyor..." disabled={disabled} />
      </form>
      <form action={deleteFormAction} className="mt-3">
        <SubmitButton idle="Policeyi sil" pending="Siliniyor..." tone="danger" disabled={disabled} />
      </form>
      <MessageState primary={updateState} secondary={deleteState} />
    </article>
  );
}

function TaskItem({
  record,
  customerOptions,
  policyOptions,
  updateAction,
  deleteAction,
  disabled = false,
}: {
  record: TaskRecord;
  customerOptions: SelectOption[];
  policyOptions: SelectOption[];
  updateAction: ActionHandler;
  deleteAction: ActionHandler;
  disabled?: boolean;
}) {
  const [updateState, updateFormAction] = useActionState(updateAction, initialState);
  const [deleteState, deleteFormAction] = useActionState(deleteAction, initialState);

  return (
    <article className="premium-card rounded-[1.5rem] p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-ink)]">{record.title}</h3>
          <p className="text-sm text-[var(--color-muted)]">
            {record.customerLabel} | {record.policyLabel}
          </p>
        </div>
        <span className="rounded-full bg-[var(--color-chip)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-strong)]">
          {record.status}
        </span>
      </div>
      <form action={updateFormAction} className="grid gap-4">
        <Input label="Baslik" name="title" defaultValue={record.title} required disabled={disabled} />
        <Textarea label="Aciklama" name="description" defaultValue={record.description} disabled={disabled} />
        <div className="grid gap-4 md:grid-cols-2">
          <Select label="Musteri" name="customerId" options={customerOptions} defaultValue={record.customerId} allowEmpty emptyLabel="Baglama yapma" disabled={disabled} />
          <Select label="Police" name="policyId" options={policyOptions} defaultValue={record.policyId} allowEmpty emptyLabel="Baglama yapma" disabled={disabled} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Termin" name="dueAt" type="datetime-local" defaultValue={record.dueAt} disabled={disabled} />
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">Durum</span>
            <select name="status" defaultValue={record.status} disabled={disabled} className="w-full rounded-2xl border border-[var(--color-line)] bg-white/5 px-4 py-3 text-sm text-[var(--color-ink)] outline-none">
              <option value="todo">todo</option>
              <option value="in_progress">in_progress</option>
              <option value="waiting">waiting</option>
              <option value="done">done</option>
              <option value="cancelled">cancelled</option>
            </select>
          </label>
        </div>
        <SubmitButton idle="Guncelle" pending="Guncelleniyor..." disabled={disabled} />
      </form>
      <form action={deleteFormAction} className="mt-3">
        <SubmitButton idle="Gorevi sil" pending="Siliniyor..." tone="danger" disabled={disabled} />
      </form>
      <MessageState primary={updateState} secondary={deleteState} />
    </article>
  );
}

function DocumentItem({
  record,
  customerOptions,
  policyOptions,
  updateAction,
  deleteAction,
  disabled = false,
}: {
  record: DocumentRecord;
  customerOptions: SelectOption[];
  policyOptions: SelectOption[];
  updateAction: ActionHandler;
  deleteAction: ActionHandler;
  disabled?: boolean;
}) {
  const [updateState, updateFormAction] = useActionState(updateAction, initialState);
  const [deleteState, deleteFormAction] = useActionState(deleteAction, initialState);

  return (
    <article className="premium-card rounded-[1.5rem] p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-ink)]">{record.title}</h3>
          <p className="text-sm text-[var(--color-muted)]">{record.documentType} | {fmtDate(record.createdAt)}</p>
        </div>
        <a href={record.fileUrl} target="_blank" rel="noreferrer" className="rounded-full border border-[var(--color-line)] bg-white/5 px-4 py-2 text-sm font-semibold text-[var(--color-ink)]">
          Belgeyi ac
        </a>
      </div>
      <form action={updateFormAction} className="grid gap-4">
        <input type="hidden" name="existingFileUrl" value={record.fileUrl} />
        <input type="hidden" name="existingFileSize" value={record.fileSizeBytes} />
        <Input label="Belge adi" name="title" defaultValue={record.title} required disabled={disabled} />
        <div className="grid gap-4 md:grid-cols-2">
          <Select label="Musteri" name="customerId" options={customerOptions} defaultValue={record.customerId} allowEmpty emptyLabel="Baglama yapma" disabled={disabled} />
          <Select label="Police" name="policyId" options={policyOptions} defaultValue={record.policyId} allowEmpty emptyLabel="Baglama yapma" disabled={disabled} />
        </div>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">Belge tipi</span>
          <select name="documentType" defaultValue={record.documentType} disabled={disabled} className="w-full rounded-2xl border border-[var(--color-line)] bg-white/5 px-4 py-3 text-sm text-[var(--color-ink)] outline-none">
            <option value="quote_pdf">quote_pdf</option>
            <option value="policy_pdf">policy_pdf</option>
            <option value="claim_document">claim_document</option>
            <option value="payment_receipt">payment_receipt</option>
            <option value="other">other</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">Yeni dosya yukle</span>
          <input name="file" type="file" disabled={disabled} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" className="w-full rounded-2xl border border-dashed border-[var(--color-line)] bg-white/5 px-4 py-3 text-sm text-[var(--color-ink)]" />
        </label>
        <SubmitButton idle="Guncelle" pending="Guncelleniyor..." disabled={disabled} />
      </form>
      <form action={deleteFormAction} className="mt-3">
        <input type="hidden" name="fileUrl" value={record.fileUrl} />
        <SubmitButton idle="Belgeyi sil" pending="Siliniyor..." tone="danger" disabled={disabled} />
      </form>
      <MessageState primary={updateState} secondary={deleteState} />
    </article>
  );
}

export function RecordForms(props: RecordFormsProps) {
  const isLive = props.source === "supabase";
  const [customerState, customerAction] = useActionState(
    createCustomer.bind(null, props.slug),
    initialState,
  );
  const [policyState, policyAction] = useActionState(
    createPolicy.bind(null, props.slug),
    initialState,
  );
  const [taskState, taskAction] = useActionState(
    createTask.bind(null, props.slug),
    initialState,
  );
  const [documentState, documentAction] = useActionState(
    createDocument.bind(null, props.slug),
    initialState,
  );

  return (
    <section className="mt-8 space-y-6" id="kayit-merkezi">
      <ModeBanner source={props.source} />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card eyebrow="Musteri Kaydi" title="Yeni musteri ekle">
          <form action={customerAction} className="grid gap-4">
            <Input label="Musteri adi" name="fullName" placeholder="Ayse Yildiz" required disabled={!isLive} />
            <Input label="Firma adi" name="companyName" placeholder="Opsiyonel firma adi" disabled={!isLive} />
            <Input label="Telefon" name="phone" placeholder="05xx xxx xx xx" disabled={!isLive} />
            <Input label="E-posta" name="email" type="email" placeholder="ornek@adntrust.net" disabled={!isLive} />
            <Input label="Sehir" name="city" placeholder="Istanbul" disabled={!isLive} />
            <Textarea label="Not" name="notes" placeholder="Musteri notu" disabled={!isLive} />
            <SubmitButton idle="Musteri olustur" pending="Kaydediliyor..." disabled={!isLive} />
          </form>
          <StatusNote state={customerState} />
        </Card>

        <Card eyebrow="Police Kaydi" title="Yeni police ac" id="police-yonetimi">
          <form action={policyAction} className="grid gap-4">
            <Select label="Musteri" name="customerId" options={props.customerOptions} disabled={!isLive} />
            <Input label="Brans" name="branch" placeholder="Kasko" required disabled={!isLive} />
            <Input label="Sigorta sirketi" name="insurerName" placeholder="Allianz" required disabled={!isLive} />
            <Input label="Police no" name="policyNumber" placeholder="ADN-2026-101" disabled={!isLive} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Baslangic" name="startDate" type="date" disabled={!isLive} />
              <Input label="Bitis" name="endDate" type="date" disabled={!isLive} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Prim tutari" name="premiumAmount" type="number" placeholder="25000" disabled={!isLive} />
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">Durum</span>
                <select name="status" defaultValue="draft" disabled={!isLive} className="w-full rounded-2xl border border-[var(--color-line)] bg-white/5 px-4 py-3 text-sm text-[var(--color-ink)] outline-none">
                  <option value="draft">draft</option>
                  <option value="quoted">quoted</option>
                  <option value="active">active</option>
                  <option value="renewal_due">renewal_due</option>
                  <option value="expired">expired</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </label>
            </div>
            <Textarea label="Not" name="notes" placeholder="Police detay notu" disabled={!isLive} />
            <SubmitButton idle="Police olustur" pending="Kaydediliyor..." disabled={!isLive} />
          </form>
          <StatusNote state={policyState} />
        </Card>

        <Card eyebrow="Gorev Merkezi" title="Yeni gorev olustur">
          <form action={taskAction} className="grid gap-4">
            <Input label="Gorev basligi" name="title" placeholder="Yenileme aramasi yap" required disabled={!isLive} />
            <Textarea label="Aciklama" name="description" placeholder="Gorev detayi" disabled={!isLive} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Musteri" name="customerId" options={props.customerOptions} allowEmpty emptyLabel="Baglama yapma" disabled={!isLive} />
              <Select label="Police" name="policyId" options={props.policyOptions} allowEmpty emptyLabel="Baglama yapma" disabled={!isLive} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Termin" name="dueAt" type="datetime-local" disabled={!isLive} />
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">Durum</span>
                <select name="status" defaultValue="todo" disabled={!isLive} className="w-full rounded-2xl border border-[var(--color-line)] bg-white/5 px-4 py-3 text-sm text-[var(--color-ink)] outline-none">
                  <option value="todo">todo</option>
                  <option value="in_progress">in_progress</option>
                  <option value="waiting">waiting</option>
                  <option value="done">done</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </label>
            </div>
            <SubmitButton idle="Gorev olustur" pending="Kaydediliyor..." disabled={!isLive} />
          </form>
          <StatusNote state={taskState} />
        </Card>

        <Card eyebrow="Belge Arsivi" title="Yeni belge yukle" id="operasyon">
          <form action={documentAction} className="grid gap-4">
            <Input label="Belge adi" name="title" placeholder="Kasko teklif pdf" required disabled={!isLive} />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">Dosya</span>
              <input name="file" type="file" required disabled={!isLive} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" className="w-full rounded-2xl border border-dashed border-[var(--color-line)] bg-white/5 px-4 py-3 text-sm text-[var(--color-ink)] disabled:opacity-60" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Musteri" name="customerId" options={props.customerOptions} allowEmpty emptyLabel="Baglama yapma" disabled={!isLive} />
              <Select label="Police" name="policyId" options={props.policyOptions} allowEmpty emptyLabel="Baglama yapma" disabled={!isLive} />
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">Belge tipi</span>
              <select name="documentType" defaultValue="other" disabled={!isLive} className="w-full rounded-2xl border border-[var(--color-line)] bg-white/5 px-4 py-3 text-sm text-[var(--color-ink)] outline-none">
                <option value="quote_pdf">quote_pdf</option>
                <option value="policy_pdf">policy_pdf</option>
                <option value="claim_document">claim_document</option>
                <option value="payment_receipt">payment_receipt</option>
                <option value="other">other</option>
              </select>
            </label>
            <SubmitButton idle="Belge yukle" pending="Yukleniyor..." disabled={!isLive} />
          </form>
          <StatusNote state={documentState} />
        </Card>
      </div>

      <Card eyebrow="Musteri Yonetimi" title="Canli musteri listesi" id="musteri-yonetimi">
        <div className="space-y-4">
          {props.customerRecords.length === 0 ? <p className="text-sm text-[var(--color-muted)]">Henuz musteri kaydi yok.</p> : null}
          {props.customerRecords.map((record) => (
            <CustomerItem
              key={record.id}
              record={record}
              updateAction={updateCustomer.bind(null, props.slug, record.id)}
              deleteAction={deleteCustomer.bind(null, props.slug, record.id)}
              disabled={!isLive}
            />
          ))}
        </div>
      </Card>

      <Card eyebrow="Police Yonetimi" title="Portfoy ve yenileme kayitlari">
        <div className="space-y-4">
          {props.policyRecords.length === 0 ? <p className="text-sm text-[var(--color-muted)]">Henuz police kaydi yok.</p> : null}
          {props.policyRecords.map((record) => (
            <PolicyItem
              key={record.id}
              record={record}
              customerOptions={props.customerOptions}
              updateAction={updatePolicy.bind(null, props.slug, record.id)}
              deleteAction={deletePolicy.bind(null, props.slug, record.id)}
              disabled={!isLive}
            />
          ))}
        </div>
      </Card>

      <Card eyebrow="Gorev Yonetimi" title="Ekip operasyon listesi">
        <div className="space-y-4">
          {props.taskRecords.length === 0 ? <p className="text-sm text-[var(--color-muted)]">Henuz gorev kaydi yok.</p> : null}
          {props.taskRecords.map((record) => (
            <TaskItem
              key={record.id}
              record={record}
              customerOptions={props.customerOptions}
              policyOptions={props.policyOptions}
              updateAction={updateTask.bind(null, props.slug, record.id)}
              deleteAction={deleteTask.bind(null, props.slug, record.id)}
              disabled={!isLive}
            />
          ))}
        </div>
      </Card>

      <Card eyebrow="Belge Yonetimi" title="Storage bagli belge arsivi">
        <div className="space-y-4">
          {props.documentRecords.length === 0 ? <p className="text-sm text-[var(--color-muted)]">Henuz belge kaydi yok.</p> : null}
          {props.documentRecords.map((record) => (
            <DocumentItem
              key={record.id}
              record={record}
              customerOptions={props.customerOptions}
              policyOptions={props.policyOptions}
              updateAction={updateDocument.bind(null, props.slug, record.id)}
              deleteAction={deleteDocument.bind(null, props.slug, record.id)}
              disabled={!isLive}
            />
          ))}
        </div>
      </Card>
    </section>
  );
}
