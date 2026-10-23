"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Link as LinkIcon,
  MapPin,
  Suitcase,
  Trash,
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

interface Application {
  _id: string;
  jobTitle: string;
  company: string | { _id?: string; name?: string };
  location?: string;
  jobType?: string;
  workMode?: string;
  status: ApplicationStatus;
  jobUrl?: string;
  salary?: string | number;
  source?: string;
  priority?: string;
  appliedAt?: string;
  description?: string;
  notes?: string;
  followUpDate?: string | null;
  nextAction?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApplicationForm {
  jobTitle: string;
  company: string;
  location: string;
  jobType: string;
  workMode: string;
  status: ApplicationStatus;
  jobUrl: string;
  salary: string;
  source: string;
  priority: string;
  appliedAt: string;
  description: string;
  notes: string;
  followUpDate: string;
  nextAction: string;
}

const EMPTY_FORM: ApplicationForm = {
  jobTitle: "",
  company: "",
  location: "",
  jobType: "FULL_TIME",
  workMode: "ONSITE",
  status: "APPLIED",
  jobUrl: "",
  salary: "",
  source: "OTHER",
  priority: "MEDIUM",
  appliedAt: "",
  description: "",
  notes: "",
  followUpDate: "",
  nextAction: "",
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

function getCompanyName(company: Application["company"]) {
  if (typeof company === "string") {
    return company;
  }

  return company?.name ?? "";
}

function getApplication(data: unknown): Application | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const response = data as Record<string, unknown>;
  const payload =
    (response.data as Record<string, unknown> | undefined) ?? response;

  const application =
    (payload.application as Application | undefined) ??
    (payload as unknown as Application);

  if (
    !application ||
    typeof application !== "object" ||
    !application._id
  ) {
    return null;
  }

  return application;
}

function formatLabel(value?: string) {
  if (!value) {
    return "Not specified";
  }

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Not specified";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDateInputValue(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getFollowUpState(value?: string | null) {
  if (!value) {
    return "none";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "none";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const difference = Math.round(
    (date.getTime() - today.getTime()) / 86400000,
  );

  if (difference < 0) {
    return "overdue";
  }

  if (difference === 0) {
    return "today";
  }

  if (difference === 1) {
    return "tomorrow";
  }

  return "upcoming";
}

function getFollowUpLabel(value?: string | null) {
  const state = getFollowUpState(value);

  if (state === "overdue") {
    return "Overdue";
  }

  if (state === "today") {
    return "Due today";
  }

  if (state === "tomorrow") {
    return "Due tomorrow";
  }

  if (state === "upcoming") {
    return "Upcoming";
  }

  return "Not scheduled";
}

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [application, setApplication] = useState<Application | null>(null);
  const [form, setForm] = useState<ApplicationForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadApplication = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/applications/${id}`, {
        cache: "no-store",
      });

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          result?.message || "We couldn't find this application.",
        );
      }

      const item = getApplication(result);

      if (!item) {
        throw new Error("The server returned an unexpected response.");
      }

      setApplication(item);

      setForm({
        jobTitle: item.jobTitle ?? "",
        company: getCompanyName(item.company),
        location: item.location ?? "",
        jobType: item.jobType ?? "FULL_TIME",
        workMode: item.workMode ?? "ONSITE",
        status: item.status ?? "APPLIED",
        jobUrl: item.jobUrl ?? "",
        salary: item.salary == null ? "" : String(item.salary),
        source: item.source ?? "OTHER",
        priority: item.priority ?? "MEDIUM",
        appliedAt: getDateInputValue(item.appliedAt),
        description: item.description ?? "",
        notes: item.notes ?? "",
        followUpDate: getDateInputValue(item.followUpDate),
        nextAction: item.nextAction ?? "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading this application.",
      );
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    void loadApplication();
  }, [loadApplication]);

  function updateField<K extends keyof ApplicationForm>(
    field: K,
    value: ApplicationForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    if (!application) {
      return;
    }

    setForm({
      jobTitle: application.jobTitle ?? "",
      company: getCompanyName(application.company),
      location: application.location ?? "",
      jobType: application.jobType ?? "FULL_TIME",
      workMode: application.workMode ?? "ONSITE",
      status: application.status ?? "APPLIED",
      jobUrl: application.jobUrl ?? "",
      salary: application.salary == null ? "" : String(application.salary),
      source: application.source ?? "OTHER",
      priority: application.priority ?? "MEDIUM",
      appliedAt: getDateInputValue(application.appliedAt),
      description: application.description ?? "",
      notes: application.notes ?? "",
      followUpDate: getDateInputValue(application.followUpDate),
      nextAction: application.nextAction ?? "",
    });
  }

  async function handleSave(
    event: Parameters<
      NonNullable<React.ComponentProps<"form">["onSubmit"]>
    >[0],
  ) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.jobTitle.trim() || !form.company.trim()) {
      setError("Job title and company are required.");
      return;
    }

    if (form.jobUrl.trim()) {
      try {
        const url = new URL(form.jobUrl);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error();
        }
      } catch {
        setError("Enter a valid job URL beginning with http:// or https://.");
        return;
      }
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle: form.jobTitle.trim(),
          company: form.company.trim(),
          location: form.location.trim(),
          jobType: form.jobType,
          workMode: form.workMode,
          status: form.status,
          jobUrl: form.jobUrl.trim(),
          salary: form.salary.trim(),
          source: form.source,
          priority: form.priority,
          appliedAt: form.appliedAt || undefined,
          description: form.description.trim(),
          notes: form.notes.trim(),
          followUpDate: form.followUpDate || null,
          nextAction: form.nextAction.trim(),
        }),
      });

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(result?.message || "Unable to save your changes.");
      }

      const updated = getApplication(result);

      if (updated) {
        setApplication(updated);
        setForm((current) => ({
          ...current,
          jobTitle: updated.jobTitle ?? current.jobTitle,
          company: getCompanyName(updated.company) || current.company,
          status: updated.status ?? current.status,
          followUpDate: getDateInputValue(updated.followUpDate),
          nextAction: updated.nextAction ?? "",
        }));
      } else {
        await loadApplication();
      }

      setEditing(false);
      setMessage("Your changes have been saved.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save your changes.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to delete this application.",
        );
      }

      router.replace("/dashboard/applications");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete this application.",
      );
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF7F0] px-5 py-12 text-[#42364D] sm:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="h-4 w-32 animate-pulse rounded bg-[#E8E0D5]" />
          <div className="mt-12 h-10 w-2/3 animate-pulse rounded bg-[#E8E0D5]" />
          <div className="mt-5 h-4 w-1/3 animate-pulse rounded bg-[#E8E0D5]" />
          <div className="mt-16 space-y-7">
            <div className="h-4 w-full animate-pulse rounded bg-[#E8E0D5]" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-[#E8E0D5]" />
            <div className="h-4 w-3/5 animate-pulse rounded bg-[#E8E0D5]" />
          </div>
        </div>
      </main>
    );
  }

  if (!application) {
    return (
      <main className="min-h-screen bg-[#FAF7F0] px-5 py-12 text-[#42364D] sm:px-10">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/dashboard/applications"
            className="inline-flex items-center gap-2 text-sm text-[#7965CD] transition hover:text-[#42364D]"
          >
            <ArrowLeft width={17} height={17} />
            All applications
          </Link>

          <div className="mt-20 max-w-lg">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#9A8DA0]">
              Application unavailable
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              This opportunity seems to be missing.
            </h1>
            <p className="mt-4 leading-7 text-[#817687]">
              {error ||
                "It may have been removed, or the link may be incorrect."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const companyName = getCompanyName(application.company);
  const followUpState = getFollowUpState(application.followUpDate);

  return (
    <main className="min-h-screen bg-[#FAF7F0] px-5 py-9 text-[#42364D] sm:px-10 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard/applications"
          className="inline-flex items-center gap-2 text-sm text-[#817687] transition hover:text-[#7965CD]"
        >
          <ArrowLeft width={17} height={17} />
          All applications
        </Link>

        <header className="mt-12 border-b border-[#E7DFD4] pb-9">
          <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#96899D]">
                Your opportunity
              </p>

              <h1 className="mt-4 wrap-break-word text-3xl font-semibold tracking-tight sm:text-5xl">
                {application.jobTitle}
              </h1>

              <p className="mt-3 text-lg text-[#817687]">{companyName}</p>

              {application.location && (
                <p className="mt-3 flex items-center gap-2 text-sm text-[#96899D]">
                  <MapPin width={16} height={16} />
                  {application.location}
                </p>
              )}
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-4 py-2 text-xs font-semibold ${STATUS_STYLES[application.status]}`}
              >
                {formatLabel(application.status)}
              </span>

              {!editing && (
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setMessage("");
                    setEditing(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#42364D] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#594866]"
                >
                  Edit details
                  <ArrowRight width={16} height={16} />
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[#817687]">
            {application.jobType && (
              <span className="flex items-center gap-2">
                <Suitcase width={16} height={16} />
                {formatLabel(application.jobType)}
              </span>
            )}

            {application.workMode && (
              <span>{formatLabel(application.workMode)}</span>
            )}

            {application.salary && (
              <span>
                {typeof application.salary === "number"
                  ? `₹${application.salary.toLocaleString("en-IN")}`
                  : application.salary}
              </span>
            )}
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="mt-7 border-l-2 border-[#C96C69] pl-4 text-sm leading-6 text-[#A24754]"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mt-7 flex items-center gap-2 text-sm text-[#357449]"
          >
            <CheckCircle width={17} height={17} />
            {message}
          </div>
        )}

        {editing ? (
          <form onSubmit={handleSave} className="mt-12">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#96899D]">
                  Make it yours
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Edit opportunity
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setError("");
                  resetForm();
                }}
                className="inline-flex items-center gap-2 text-sm text-[#817687] transition hover:text-[#42364D]"
              >
                <Xmark width={17} height={17} />
                Cancel
              </button>
            </div>

            <div className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
              <Field label="Job title" required>
                <input
                  required
                  value={form.jobTitle}
                  onChange={(event) =>
                    updateField("jobTitle", event.target.value)
                  }
                  className="canvas-input"
                  placeholder="e.g. Backend Developer"
                />
              </Field>

              <Field label="Company" required>
                <input
                  required
                  value={form.company}
                  onChange={(event) =>
                    updateField("company", event.target.value)
                  }
                  className="canvas-input"
                  placeholder="Company name"
                />
              </Field>

              <Field label="Location">
                <input
                  value={form.location}
                  onChange={(event) =>
                    updateField("location", event.target.value)
                  }
                  className="canvas-input"
                  placeholder="e.g. Noida, India"
                />
              </Field>

              <Field label="Salary or stipend">
                <input
                  value={form.salary}
                  onChange={(event) =>
                    updateField("salary", event.target.value)
                  }
                  className="canvas-input"
                  placeholder="e.g. ₹8–12 LPA"
                />
              </Field>

              <Field label="Application status">
                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value as ApplicationStatus,
                    )
                  }
                  className="canvas-input"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {formatLabel(status)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Job type">
                <select
                  value={form.jobType}
                  onChange={(event) =>
                    updateField("jobType", event.target.value)
                  }
                  className="canvas-input"
                >
                  <option value="FULL_TIME">Full time</option>
                  <option value="PART_TIME">Part time</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="CONTRACT">Contract</option>
                </select>
              </Field>

              <Field label="Work mode">
                <select
                  value={form.workMode}
                  onChange={(event) =>
                    updateField("workMode", event.target.value)
                  }
                  className="canvas-input"
                >
                  <option value="ONSITE">On-site</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </Field>

              <Field label="Application date">
                <input
                  type="date"
                  value={form.appliedAt}
                  onChange={(event) =>
                    updateField("appliedAt", event.target.value)
                  }
                  className="canvas-input"
                />
              </Field>

              <Field label="Application source">
                <select
                  value={form.source}
                  onChange={(event) =>
                    updateField("source", event.target.value)
                  }
                  className="canvas-input"
                >
                  <option value="LINKEDIN">LinkedIn</option>
                  <option value="COMPANY_WEBSITE">Company website</option>
                  <option value="REFERRAL">Referral</option>
                  <option value="JOB_PORTAL">Job portal</option>
                  <option value="OTHER">Other</option>
                </select>
              </Field>

              <Field label="Priority">
                <select
                  value={form.priority}
                  onChange={(event) =>
                    updateField("priority", event.target.value)
                  }
                  className="canvas-input"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </Field>

              <div className="sm:col-span-2">
                <Field label="Job posting URL">
                  <input
                    type="url"
                    value={form.jobUrl}
                    onChange={(event) =>
                      updateField("jobUrl", event.target.value)
                    }
                    className="canvas-input"
                    placeholder="https://..."
                  />
                </Field>
              </div>

              <div className="sm:col-span-2 border-y border-[#E7DFD4] py-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEE8F7] text-[#7965CD]">
                    <Calendar width={19} height={19} />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium tracking-tight">
                      Follow-up plan
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[#96899D]">
                      Schedule your next move so no opportunity slips through
                      the cracks.
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid gap-x-12 gap-y-8 sm:grid-cols-2">
                  <Field label="Follow-up date">
                    <input
                      type="date"
                      value={form.followUpDate}
                      onChange={(event) =>
                        updateField("followUpDate", event.target.value)
                      }
                      className="canvas-input"
                    />
                  </Field>

                  <Field label="Next action">
                    <input
                      type="text"
                      value={form.nextAction}
                      onChange={(event) =>
                        updateField("nextAction", event.target.value)
                      }
                      className="canvas-input"
                      placeholder="e.g. Email recruiter for an update"
                    />
                  </Field>
                </div>

                <p className="mt-4 text-xs leading-5 text-[#96899D]">
                  Clear the date to remove this application from your follow-up
                  schedule. Your other application details will remain intact.
                </p>
              </div>

              <div className="sm:col-span-2">
                <Field label="Job description">
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    className="canvas-input resize-y"
                    placeholder="Responsibilities, requirements, and anything worth remembering..."
                  />
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field label="Personal notes">
                  <textarea
                    rows={4}
                    value={form.notes}
                    onChange={(event) =>
                      updateField("notes", event.target.value)
                    }
                    className="canvas-input resize-y"
                    placeholder="Referral details, recruiter contact, next steps..."
                  />
                </Field>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-[#E7DFD4] pt-7">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-3 rounded-full bg-[#7965CD] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#6854B7] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving changes..." : "Save changes"}
                {!saving && <ArrowRight width={17} height={17} />}
              </button>

              <p className="text-sm text-[#96899D]">
                Your opportunity, always up to date.
              </p>
            </div>
          </form>
        ) : (
          <>
            <section className="border-b border-[#E7DFD4] py-9">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEE8F7] text-[#7965CD]">
                    <Calendar width={19} height={19} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#96899D]">
                      Stay connected
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      Follow-up plan
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#817687]">
                      Keep track of when to reconnect and what to do next.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setMessage("");
                    setEditing(true);
                  }}
                  className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#7965CD] transition hover:text-[#42364D]"
                >
                  {application.followUpDate ? "Edit follow-up" : "Schedule follow-up"}
                  <ArrowRight width={16} height={16} />
                </button>
              </div>

              <div className="mt-7 grid gap-7 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#96899D]">
                    Scheduled date
                  </p>

                  <p className="mt-3 text-lg font-medium">
                    {formatDate(application.followUpDate)}
                  </p>

                  {application.followUpDate && (
                    <span
                      className={`mt-2 inline-flex items-center gap-1.5 text-xs font-medium ${
                        followUpState === "overdue"
                          ? "text-[#A24754]"
                          : followUpState === "today"
                            ? "text-[#92621F]"
                            : "text-[#7965CD]"
                      }`}
                    >
                      <Clock width={14} height={14} />
                      {getFollowUpLabel(application.followUpDate)}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#96899D]">
                    Next action
                  </p>

                  <p className="mt-3 text-sm leading-6 text-[#61546A]">
                    {application.nextAction ||
                      "No next action defined. Add one to decide your next move."}
                  </p>
                </div>
              </div>

              {!application.followUpDate && !application.nextAction && (
                <p className="mt-6 border-l-2 border-[#D8CBEF] pl-4 text-sm leading-6 text-[#817687]">
                  Tip: schedule a follow-up after applying or interviewing, so
                  you know when it's time to check in.
                </p>
              )}
            </section>

            <section className="grid gap-10 border-b border-[#E7DFD4] py-10 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#96899D]">
                  The timeline
                </p>

                <div className="mt-6 space-y-6">
                  <TimelineItem
                    label="Added to JobQuest"
                    value={formatDate(application.createdAt)}
                  />
                  <TimelineItem
                    label="Application date"
                    value={formatDate(application.appliedAt)}
                  />
                  <TimelineItem
                    label="Last updated"
                    value={formatDate(application.updatedAt)}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#96899D]">
                  At a glance
                </p>

                <div className="mt-6 space-y-5">
                  <DetailRow
                    label="Priority"
                    value={formatLabel(application.priority)}
                  />
                  <DetailRow
                    label="Source"
                    value={formatLabel(application.source)}
                  />
                  <DetailRow
                    label="Job type"
                    value={formatLabel(application.jobType)}
                  />
                  <DetailRow
                    label="Work mode"
                    value={formatLabel(application.workMode)}
                  />
                </div>

                {application.jobUrl && (
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-[#7965CD] transition hover:text-[#42364D]"
                  >
                    <LinkIcon width={17} height={17} />
                    View original job posting
                    <ArrowRight width={15} height={15} />
                  </a>
                )}
              </div>
            </section>

            <section className="border-b border-[#E7DFD4] py-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#96899D]">
                The opportunity
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Job description
              </h2>

              <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-[#817687]">
                {application.description || "No job description added yet."}
              </p>
            </section>

            <section className="py-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#96899D]">
                Your thoughts
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Personal notes
              </h2>

              <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-[#817687]">
                {application.notes ||
                  "Nothing here just yet. Add notes when you have something to remember."}
              </p>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setMessage("");
                  setEditing(true);
                }}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#7965CD] transition hover:text-[#42364D]"
              >
                Add or edit notes
                <ArrowRight width={16} height={16} />
              </button>
            </section>

            <section className="flex flex-col justify-between gap-5 border-t border-[#E7DFD4] py-8 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium">
                  No longer pursuing this one?
                </p>
                <p className="mt-1 text-sm text-[#96899D]">
                  Remove this opportunity from your tracker.
                </p>
              </div>

              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-2 self-start text-sm text-[#A24754] transition hover:text-[#7D2938]"
                >
                  <Trash width={16} height={16} />
                  Delete application
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-sm text-[#A24754]">
                    Delete this permanently?
                  </span>

                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    disabled={deleting}
                    className="text-sm text-[#817687] hover:text-[#42364D]"
                  >
                    Keep it
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-full bg-[#A24754] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#873642] disabled:opacity-60"
                  >
                    {deleting ? "Deleting..." : "Yes, delete"}
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </div>

      <style jsx>{`
        .canvas-input {
          display: block;
          width: 100%;
          border: 0;
          border-bottom: 1px solid #d9cfc5;
          border-radius: 0;
          background: transparent;
          padding: 12px 0;
          color: #42364d;
          font-size: 14px;
          outline: none;
          transition: border-color 160ms ease;
        }

        .canvas-input::placeholder {
          color: #b0a5b0;
        }

        .canvas-input:focus {
          border-bottom-color: #7965cd;
        }

        .canvas-input:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>
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

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-5">
      <span className="text-sm text-[#96899D]">{label}</span>
      <span className="text-right text-sm font-medium text-[#61546A]">
        {value}
      </span>
    </div>
  );
}

function TimelineItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#B8A7E9]" />
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-1 text-sm text-[#96899D]">{value}</p>
      </div>
    </div>
  );
}