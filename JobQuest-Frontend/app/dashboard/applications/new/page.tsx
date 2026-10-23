"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Link as LinkIcon,
  MapPin,
  Suitcase,
} from "iconoir-react";

const inputClass =
  "mt-2 w-full border-0 border-b border-[#DDD4DF] bg-transparent px-0 py-3 text-sm text-[#42364D] outline-none transition placeholder:text-[#B5AAB9] focus:border-[#7965CD] focus:ring-0";

const labelClass = "text-xs font-semibold tracking-wide text-[#827589]";

const sectionTitleClass = "text-lg font-bold tracking-tight text-[#42364D]";

export default function NewApplicationPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    jobTitle: "",
    company: "",
    location: "",
    jobType: "FULL_TIME",
    workMode: "HYBRID",
    status: "WISHLIST",
    jobUrl: "",
    salary: "",
    source: "LINKEDIN",
    priority: "MEDIUM",
    appliedAt: "",
    description: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      appliedAt: new Date().toISOString().slice(0, 10),
    }));
  }, []);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: Parameters<
      NonNullable<React.ComponentProps<"form">["onSubmit"]>
    >[0],
  ) {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.jobTitle.trim() || !form.company.trim()) {
      setError("Job title and company are required.");
      return;
    }

    if (form.jobUrl && !/^https?:\/\/.+/i.test(form.jobUrl.trim())) {
      setError("Enter a valid URL starting with http:// or https://.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        jobTitle: form.jobTitle.trim(),
        company: form.company.trim(),
        location: form.location.trim(),
        jobUrl: form.jobUrl.trim(),
        salary: form.salary.trim(),
        description: form.description.trim(),
        notes: form.notes.trim(),
        appliedAt: form.status === "WISHLIST" ? undefined : form.appliedAt,
      };

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to create this application.",
        );
      }

      setSuccess(true);

      window.setTimeout(() => {
        router.push("/dashboard/applications");
        router.refresh();
      }, 700);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF7F0] px-5 py-9 text-[#42364D] sm:px-10 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard/applications"
          className="inline-flex items-center gap-2 text-sm text-[#8B8193] transition hover:text-[#7965CD]"
        >
          <ArrowLeft width={16} height={16} />
          All applications
        </Link>

        <header className="mt-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9274B8]">
            A new opportunity
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Let's make it
            <br />
            <span className="text-[#7965CD]">happen.</span>
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-7 text-[#8B8193] sm:text-base">
            One more opportunity, one more possibility. Add the details now
            and let JobQuest keep everything organized for you.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mt-8 max-w-3xl border-l-2 border-[#C16D75] py-2 pl-4 text-sm text-[#9B3E38]"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mt-8 flex items-center gap-2 text-sm font-medium text-[#416B36]"
          >
            <CheckCircle width={18} height={18} />
            Saved! Taking you back to your applications.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-12 max-w-3xl">
          <section>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#9274B8]">01</span>
              <h2 className={sectionTitleClass}>The role</h2>
            </div>

            <div className="mt-7 grid gap-x-12 gap-y-7 sm:grid-cols-2">
              <div>
                <label htmlFor="jobTitle" className={labelClass}>
                  JOB TITLE *
                </label>
                <input
                  id="jobTitle"
                  required
                  maxLength={150}
                  value={form.jobTitle}
                  onChange={(event) =>
                    updateField("jobTitle", event.target.value)
                  }
                  placeholder="Backend Developer"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="company" className={labelClass}>
                  COMPANY *
                </label>
                <input
                  id="company"
                  required
                  maxLength={150}
                  value={form.company}
                  onChange={(event) =>
                    updateField("company", event.target.value)
                  }
                  placeholder="Where are you applying?"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className={`${labelClass} inline-flex items-center gap-1.5`}
                >
                  <MapPin width={13} height={13} />
                  LOCATION
                </label>
                <input
                  id="location"
                  maxLength={150}
                  value={form.location}
                  onChange={(event) =>
                    updateField("location", event.target.value)
                  }
                  placeholder="City, country or remote"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="jobUrl" className={labelClass}>
                  JOB POSTING
                </label>
                <div className="flex items-center gap-2">
                  <LinkIcon
                    width={15}
                    height={15}
                    className="shrink-0 text-[#A096AA]"
                  />
                  <input
                    id="jobUrl"
                    type="url"
                    maxLength={2048}
                    value={form.jobUrl}
                    onChange={(event) =>
                      updateField("jobUrl", event.target.value)
                    }
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-6">
              <div className="min-w-36 flex-1">
                <label htmlFor="jobType" className={labelClass}>
                  EMPLOYMENT TYPE
                </label>
                <select
                  id="jobType"
                  value={form.jobType}
                  onChange={(event) =>
                    updateField("jobType", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="CONTRACT">Contract</option>
                </select>
              </div>

              <div className="min-w-36 flex-1">
                <label htmlFor="workMode" className={labelClass}>
                  WORK MODE
                </label>
                <select
                  id="workMode"
                  value={form.workMode}
                  onChange={(event) =>
                    updateField("workMode", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="ONSITE">On-site</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>

              <div className="min-w-36 flex-1">
                <label htmlFor="salary" className={labelClass}>
                  SALARY / STIPEND
                </label>
                <input
                  id="salary"
                  maxLength={100}
                  value={form.salary}
                  onChange={(event) =>
                    updateField("salary", event.target.value)
                  }
                  placeholder="₹8–12 LPA"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="mt-14">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#9274B8]">02</span>
              <h2 className={sectionTitleClass}>Where things stand</h2>
            </div>

            <p className="mt-2 pl-7 text-sm text-[#8B8193]">
              Every application has its own journey.
            </p>

            <div className="mt-7 grid gap-x-12 gap-y-7 sm:grid-cols-2">
              <div>
                <label htmlFor="status" className={labelClass}>
                  CURRENT STATUS
                </label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(event) =>
                    updateField("status", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="WISHLIST">Wishlist</option>
                  <option value="APPLIED">Applied</option>
                  <option value="ASSESSMENT">Assessment</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="WITHDRAWN">Withdrawn</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className={labelClass}>
                  PRIORITY
                </label>
                <select
                  id="priority"
                  value={form.priority}
                  onChange={(event) =>
                    updateField("priority", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="source" className={labelClass}>
                  WHERE DID YOU FIND IT?
                </label>
                <select
                  id="source"
                  value={form.source}
                  onChange={(event) =>
                    updateField("source", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="LINKEDIN">LinkedIn</option>
                  <option value="COMPANY_WEBSITE">Company website</option>
                  <option value="REFERRAL">Referral</option>
                  <option value="JOB_PORTAL">Job portal</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="appliedAt" className={labelClass}>
                  APPLICATION DATE
                </label>
                <input
                  id="appliedAt"
                  type="date"
                  value={form.appliedAt}
                  onChange={(event) =>
                    updateField("appliedAt", event.target.value)
                  }
                  disabled={form.status === "WISHLIST"}
                  className={`${inputClass} disabled:opacity-40`}
                />
              </div>
            </div>
          </section>

          <section className="mt-14">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#9274B8]">03</span>
              <h2 className={sectionTitleClass}>A few extra details</h2>
            </div>

            <p className="mt-2 pl-7 text-sm text-[#8B8193]">
              Save anything you'll want to remember later.
            </p>

            <div className="mt-7 space-y-7">
              <div>
                <label htmlFor="description" className={labelClass}>
                  JOB DESCRIPTION
                </label>
                <textarea
                  id="description"
                  rows={3}
                  maxLength={10000}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Responsibilities, requirements, and skills..."
                  className={`${inputClass} resize-y`}
                />
              </div>

              <div>
                <label htmlFor="notes" className={labelClass}>
                  YOUR NOTES
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  maxLength={5000}
                  value={form.notes}
                  onChange={(event) =>
                    updateField("notes", event.target.value)
                  }
                  placeholder="Referral contact, interview preparation, follow-up..."
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>
          </section>

          <div className="mt-12 flex flex-col-reverse gap-5 border-t border-[#E8DFE8] pt-7 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/dashboard/applications"
              className="text-center text-sm font-semibold text-[#8B8193] transition hover:text-[#42364D] sm:text-left"
            >
              Cancel and go back
            </Link>

            <button
              type="submit"
              disabled={loading || success}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#7965CD] px-7 text-sm font-semibold text-white transition hover:bg-[#6C57BD] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Saving application..."
                : success
                  ? "Application saved"
                  : "Save application"}
              {!loading && !success && (
                <ArrowRight width={17} height={17} />
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}