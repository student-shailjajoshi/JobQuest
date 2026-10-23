"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Link as LinkIcon,
  MapPin,
  Suitcase,
  Xmark,
} from "iconoir-react";

const STATUSES = [
  "WISHLIST",
  "APPLIED",
  "ASSESSMENT",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
] as const;

type ApplicationStatus = (typeof STATUSES)[number];

interface Company {
  _id: string;
  name: string;
  website?: string;
  industry?: string;
  location?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Application {
  _id: string;
  jobTitle: string;
  company?: string | { _id?: string; name?: string };
  status: ApplicationStatus;
  location?: string;
  jobType?: string;
  workMode?: string;
  salary?: string | number;
  appliedAt?: string;
  createdAt?: string;
}

interface CompanyForm {
  name: string;
  website: string;
  industry: string;
  location: string;
  notes: string;
}

const EMPTY_FORM: CompanyForm = {
  name: "",
  website: "",
  industry: "",
  location: "",
  notes: "",
};

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  WISHLIST: "bg-[#EEE8F7] text-[#65518C]",
  APPLIED: "bg-[#E5E9FC] text-[#4E5EAC]",
  ASSESSMENT: "bg-[#FBE7C8] text-[#92621F]",
  INTERVIEW: "bg-[#F9DFD8] text-[#A34F40]",
  OFFER: "bg-[#DCEEE0] text-[#357449]",
  REJECTED: "bg-[#F5DFE1] text-[#A24754]",
  WITHDRAWN: "bg-[#E9E4E9] text-[#716775]",
};

function formatLabel(value?: string) {
  if (!value) return "Not specified";

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(value?: string) {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function extractCompany(payload: unknown): Company | null {
  if (!payload || typeof payload !== "object") return null;

  const response = payload as Record<string, unknown>;
  const data =
    response.data && typeof response.data === "object"
      ? (response.data as Record<string, unknown>)
      : response;

  const company =
    (data.company as Company | undefined) ??
    (data as unknown as Company);

  return company?._id && company.name ? company : null;
}

function extractApplications(payload: unknown): Application[] {
  if (Array.isArray(payload)) return payload as Application[];
  if (!payload || typeof payload !== "object") return [];

  const response = payload as Record<string, unknown>;
  const data =
    response.data && typeof response.data === "object"
      ? (response.data as Record<string, unknown>)
      : response;

  if (Array.isArray(data.applications)) {
    return data.applications as Application[];
  }

  if (Array.isArray(data.items)) {
    return data.items as Application[];
  }

  if (Array.isArray(response.applications)) {
    return response.applications as Application[];
  }

  if (Array.isArray(response.items)) {
    return response.items as Application[];
  }

  if (Array.isArray(response.data)) {
    return response.data as Application[];
  }

  return [];
}

function normalizeWebsite(value: string) {
  const website = value.trim();

  if (!website) return "";

  return /^https?:\/\//i.test(website)
    ? website
    : `https://${website}`;
}

export default function CompanyDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [company, setCompany] = useState<Company | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState<CompanyForm>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadCompany = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/companies/${id}`, {
        cache: "no-store",
      });

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(result?.message || "Unable to load this company.");
      }

      const item = extractCompany(result);

      if (!item) {
        throw new Error("The server returned an unexpected company response.");
      }

      setCompany(item);
      setForm({
        name: item.name ?? "",
        website: item.website ?? "",
        industry: item.industry ?? "",
        location: item.location ?? "",
        notes: item.notes ?? "",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load this company.",
      );
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  const loadApplications = useCallback(async () => {
    setApplicationsLoading(true);

    try {
      const response = await fetch(`/api/companies/${id}/applications`, {
        cache: "no-store",
      });

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to load company applications.",
        );
      }

      setApplications(extractApplications(result));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load company applications.",
      );
    } finally {
      setApplicationsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    void loadCompany();
    void loadApplications();
  }, [loadCompany, loadApplications]);

  function updateField<K extends keyof CompanyForm>(
    field: K,
    value: CompanyForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave(
    event: Parameters<
      NonNullable<React.ComponentProps<"form">["onSubmit"]>
    >[0],
  ) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.name.trim()) {
      setError("Company name is required.");
      return;
    }

    const normalizedWebsite = normalizeWebsite(form.website);

    if (normalizedWebsite) {
      try {
        const parsed = new URL(normalizedWebsite);

        if (!["http:", "https:"].includes(parsed.protocol)) {
          throw new Error();
        }
      } catch {
        setError("Enter a valid company website.");
        return;
      }
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/companies/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          website: normalizedWebsite,
          industry: form.industry.trim(),
          location: form.location.trim(),
          notes: form.notes.trim(),
        }),
      });

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(result?.message || "Unable to save company details.");
      }

      const updated = extractCompany(result);

      if (updated) {
        setCompany(updated);
        setForm({
          name: updated.name ?? "",
          website: updated.website ?? "",
          industry: updated.industry ?? "",
          location: updated.location ?? "",
          notes: updated.notes ?? "",
        });
      } else {
        await loadCompany();
      }

      setEditing(false);
      setMessage("Company details saved.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save company details.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/companies/${id}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(result?.message || "Unable to delete this company.");
      }

      router.replace("/dashboard/companies");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete this company.",
      );
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF7F0] px-5 py-12 text-[#42364D] sm:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="h-4 w-36 animate-pulse rounded bg-[#E8E0D5]" />
          <div className="mt-12 h-10 w-2/3 animate-pulse rounded bg-[#E8E0D5]" />
          <div className="mt-5 h-4 w-1/3 animate-pulse rounded bg-[#E8E0D5]" />
        </div>
      </main>
    );
  }

  if (!company) {
    return (
      <main className="min-h-screen bg-[#FAF7F0] px-5 py-12 text-[#42364D] sm:px-10">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/dashboard/companies"
            className="inline-flex items-center gap-2 text-sm text-[#7965CD]"
          >
            <ArrowLeft width={17} height={17} />
            All companies
          </Link>

          <h1 className="mt-12 text-3xl font-semibold">
            Company unavailable.
          </h1>

          <p className="mt-4 text-sm text-[#817687]">
            {error || "We couldn't find this company."}
          </p>
        </div>
      </main>
    );
  }

  const inputClass =
    "mt-2 w-full border-0 border-b border-[#DDD4DF] bg-transparent px-0 py-3 text-sm text-[#42364D] outline-none transition placeholder:text-[#B5AAB9] focus:border-[#7965CD] focus:ring-0";

  const applicationCounts = STATUSES.map((status) => ({
    status,
    count: applications.filter((item) => item.status === status).length,
  })).filter((item) => item.count > 0);

  return (
    <main className="min-h-screen bg-[#FAF7F0] px-5 py-9 text-[#42364D] sm:px-10 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard/companies"
          className="inline-flex items-center gap-2 text-sm text-[#817687] transition hover:text-[#7965CD]"
        >
          <ArrowLeft width={17} height={17} />
          All companies
        </Link>

        <header className="mt-12 border-b border-[#E7DFD4] pb-9">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div className="flex min-w-0 items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EEE8F7] text-[#7965CD]">
                <Building width={26} height={26} strokeWidth={1.5} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#96899D]">
                  Company profile
                </p>

                <h1 className="mt-3 wrap-break-word text-3xl font-semibold tracking-tight sm:text-5xl">
                  {company.name}
                  <span className="text-[#7965CD]">.</span>
                </h1>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#817687]">
                  {company.industry && <span>{company.industry}</span>}

                  {company.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin width={15} height={15} />
                      {company.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setError("");
                setMessage("");
                setEditing((current) => !current);
              }}
              className="inline-flex items-center gap-2 self-start rounded-full bg-[#42364D] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#594866]"
            >
              {editing ? (
                <>
                  <Xmark width={16} height={16} />
                  Cancel edit
                </>
              ) : (
                "Edit company"
              )}
            </button>
          </div>

          {company.website && (
            <a
              href={normalizeWebsite(company.website)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#7965CD] transition hover:text-[#42364D]"
            >
              <LinkIcon width={16} height={16} />
              {company.website}
              <ArrowRight width={15} height={15} />
            </a>
          )}
        </header>

        {error && (
          <p role="alert" className="mt-6 text-sm text-[#A24754]">
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="mt-6 text-sm text-[#357449]">
            {message}
          </p>
        )}

        {editing && (
          <section className="border-b border-[#E7DFD4] py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#96899D]">
              Company information
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Update the details.
            </h2>

            <form onSubmit={handleSave} className="mt-8 max-w-3xl">
              <div className="grid gap-x-12 gap-y-7 sm:grid-cols-2">
                <Field label="Company name" required>
                  <input
                    required
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Website">
                  <input
                    value={form.website}
                    onChange={(event) =>
                      updateField("website", event.target.value)
                    }
                    className={inputClass}
                    placeholder="company.com"
                  />
                </Field>

                <Field label="Industry">
                  <input
                    value={form.industry}
                    onChange={(event) =>
                      updateField("industry", event.target.value)
                    }
                    className={inputClass}
                    placeholder="Technology"
                  />
                </Field>

                <Field label="Location">
                  <input
                    value={form.location}
                    onChange={(event) =>
                      updateField("location", event.target.value)
                    }
                    className={inputClass}
                    placeholder="Noida, India"
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Notes">
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(event) =>
                        updateField("notes", event.target.value)
                      }
                      className={`${inputClass} resize-y`}
                      placeholder="Hiring contacts, career page, or research..."
                    />
                  </Field>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#7965CD] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#6854B7] disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save company"}
                {!saving && <ArrowRight width={16} height={16} />}
              </button>
            </form>
          </section>
        )}

        <section className="border-b border-[#E7DFD4] py-9">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#96899D]">
            Your progress
          </p>

          <div className="mt-6 flex flex-wrap gap-x-12 gap-y-6">
            <div>
              <p className="text-3xl font-semibold tracking-tight">
                {applications.length}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-[#96899D]">
                Applications
              </p>
            </div>

            <div>
              <p className="text-3xl font-semibold tracking-tight">
                {applications.filter((item) => item.status === "INTERVIEW").length}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-[#96899D]">
                Interviews
              </p>
            </div>

            <div>
              <p className="text-3xl font-semibold tracking-tight">
                {applications.filter((item) => item.status === "OFFER").length}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-[#96899D]">
                Offers
              </p>
            </div>
          </div>

          {applicationCounts.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2">
              {applicationCounts.map(({ status, count }) => (
                <span
                  key={status}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${STATUS_STYLES[status]}`}
                >
                  {formatLabel(status)} · {count}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="py-9">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#96899D]">
                Your applications
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Opportunities at {company.name}
              </h2>
            </div>

            <Link
              href="/dashboard/applications/new"
              className="inline-flex items-center gap-2 self-start text-sm font-medium text-[#7965CD] transition hover:text-[#42364D]"
            >
              Add application
              <ArrowRight width={16} height={16} />
            </Link>
          </div>

          {applicationsLoading ? (
            <div className="mt-8 space-y-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse border-b border-[#E7DFD4]"
                />
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="mt-8 border-t border-[#E7DFD4] py-12">
              <Suitcase
                width={27}
                height={27}
                strokeWidth={1.5}
                className="text-[#7965CD]"
              />

              <h3 className="mt-5 text-lg font-semibold">
                No applications linked yet.
              </h3>

              <p className="mt-2 max-w-lg text-sm leading-7 text-[#817687]">
                When you apply to a role here, you can keep its status and
                details organized alongside this company.
              </p>
            </div>
          ) : (
            <div className="mt-7 border-t border-[#E7DFD4]">
              {applications.map((application) => (
                <Link
                  key={application._id}
                  href={`/dashboard/applications/${application._id}`}
                  className="group flex flex-col justify-between gap-4 border-b border-[#E7DFD4] py-6 transition sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="text-base font-semibold transition group-hover:text-[#7965CD]">
                      {application.jobTitle}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#96899D]">
                      {application.location && (
                        <span>{application.location}</span>
                      )}
                      {application.jobType && (
                        <span>{formatLabel(application.jobType)}</span>
                      )}
                      {application.appliedAt && (
                        <span>{formatDate(application.appliedAt)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${STATUS_STYLES[application.status] ?? "bg-[#E9E4E9] text-[#716775]"}`}
                    >
                      {formatLabel(application.status)}
                    </span>

                    <ArrowRight
                      width={17}
                      height={17}
                      className="text-[#96899D] transition group-hover:translate-x-1 group-hover:text-[#7965CD]"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col justify-between gap-5 border-t border-[#E7DFD4] py-8 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium">Remove this company?</p>
            <p className="mt-1 text-sm text-[#96899D]">
              This sends a delete request to your backend.
            </p>
          </div>

          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="self-start text-sm text-[#A24754] transition hover:text-[#7D2938]"
            >
              Delete company
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-[#A24754]">
                Are you sure?
              </span>

              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="text-sm text-[#817687] hover:text-[#42364D]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={deleting}
                className="rounded-full bg-[#A24754] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#873642] disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Confirm delete"}
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#61546A]">
        {label}
        {required && <span className="ml-1 text-[#A34F40]">*</span>}
      </span>
      {children}
    </label>
  );
}