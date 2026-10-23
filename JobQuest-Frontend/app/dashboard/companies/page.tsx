"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  Plus,
  Suitcase,
  Xmark,
  Building,
} from "iconoir-react";

interface Company {
  _id: string;
  name: string;
  website?: string;
  industry?: string;
  location?: string;
  notes?: string;
  applicationCount?: number;
  applicationsCount?: number;
  createdAt?: string;
}

function extractCompanies(payload: unknown): Company[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const response = payload as Record<string, unknown>;
  const data = response.data;

  if (Array.isArray(data)) {
    return data as Company[];
  }

  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>;

    if (Array.isArray(nested.companies)) {
      return nested.companies as Company[];
    }

    if (Array.isArray(nested.items)) {
      return nested.items as Company[];
    }
  }

  if (Array.isArray(response.companies)) {
    return response.companies as Company[];
  }

  if (Array.isArray(response.items)) {
    return response.items as Company[];
  }

  return [];
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/companies", {
        cache: "no-store",
      });

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(result?.message || "Unable to load companies.");
      }

      setCompanies(extractCompanies(result));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCompanies();
  }, [loadCompanies]);

  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return companies;
    }

    return companies.filter((company) =>
      [
        company.name,
        company.industry,
        company.location,
      ].some((value) => value?.toLowerCase().includes(query)),
    );
  }, [companies, search]);

  async function handleCreate(
    event: Parameters<
      NonNullable<React.ComponentProps<"form">["onSubmit"]>
    >[0],
  ) {
    event.preventDefault();
    setFormError("");

    if (!companyName.trim()) {
      setFormError("Company name is required.");
      return;
    }

    if (website.trim()) {
      try {
        const parsed = new URL(
          /^https?:\/\//i.test(website) ? website : `https://${website}`,
        );

        if (!["http:", "https:"].includes(parsed.protocol)) {
          throw new Error();
        }
      } catch {
        setFormError("Please enter a valid website address.");
        return;
      }
    }

    setSaving(true);

    try {
      const normalizedWebsite = website.trim()
        ? /^https?:\/\//i.test(website.trim())
          ? website.trim()
          : `https://${website.trim()}`
        : "";

      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: companyName.trim(),
          website: normalizedWebsite,
          industry: industry.trim(),
          location: location.trim(),
          notes: notes.trim(),
        }),
      });

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(result?.message || "Unable to create company.");
      }

      setCompanyName("");
      setWebsite("");
      setIndustry("");
      setLocation("");
      setNotes("");
      setShowForm(false);

      await loadCompanies();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Unable to create company.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(company: Company) {
    const confirmed = window.confirm(
      `Delete ${company.name}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/companies/${company._id}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(result?.message || "Unable to delete company.");
      }

      setCompanies((current) =>
        current.filter((item) => item._id !== company._id),
      );
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Unable to delete company.",
      );
    }
  }

  const totalApplications = companies.reduce(
    (total, company) =>
      total + (company.applicationCount ?? company.applicationsCount ?? 0),
    0,
  );

  const inputClass =
    "mt-2 w-full border-0 border-b border-[#DDD4DF] bg-transparent px-0 py-3 text-sm text-[#42364D] outline-none transition placeholder:text-[#B5AAB9] focus:border-[#7965CD] focus:ring-0";

  return (
    <main className="min-h-screen bg-[#FAF7F0] px-5 py-10 text-[#42364D] sm:px-10 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#96899D]">
              Your professional journey
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Companies<span className="text-[#7965CD]">.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#817687]">
              Keep track of the places you want to work, and every opportunity
              you pursue along the way.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowForm((current) => !current);
              setFormError("");
            }}
            className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#42364D] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#594866] sm:self-auto"
          >
            {showForm ? (
              <Xmark width={17} height={17} />
            ) : (
              <Plus width={17} height={17} />
            )}
            {showForm ? "Close form" : "Add company"}
          </button>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-12 gap-y-5 border-y border-[#E7DFD4] py-6">
          <div>
            <p className="text-3xl font-semibold tracking-tight">
              {companies.length}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#96899D]">
              Companies tracked
            </p>
          </div>

          <div>
            <p className="text-3xl font-semibold tracking-tight">
              {totalApplications}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#96899D]">
              Linked applications
            </p>
          </div>
        </div>

        {showForm && (
          <section className="border-b border-[#E7DFD4] py-9">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#96899D]">
                Add to your list
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                A company worth pursuing.
              </h2>

              <form onSubmit={handleCreate} className="mt-8">
                <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#817687]">
                      Company name *
                    </span>
                    <input
                      required
                      autoFocus
                      value={companyName}
                      onChange={(event) => setCompanyName(event.target.value)}
                      className={inputClass}
                      placeholder="e.g. Amazon"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#817687]">
                      Website
                    </span>
                    <input
                      value={website}
                      onChange={(event) => setWebsite(event.target.value)}
                      className={inputClass}
                      placeholder="company.com"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#817687]">
                      Industry
                    </span>
                    <input
                      value={industry}
                      onChange={(event) => setIndustry(event.target.value)}
                      className={inputClass}
                      placeholder="e.g. Technology"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#817687]">
                      Location
                    </span>
                    <input
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      className={inputClass}
                      placeholder="e.g. Noida, India"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#817687]">
                      Notes
                    </span>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      className={`${inputClass} resize-y`}
                      placeholder="Hiring teams, career pages, or anything worth remembering..."
                    />
                  </label>
                </div>

                {formError && (
                  <p role="alert" className="mt-5 text-sm text-[#A24754]">
                    {formError}
                  </p>
                )}

                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-3 rounded-full bg-[#7965CD] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#6854B7] disabled:opacity-60"
                  >
                    {saving ? "Adding company..." : "Add company"}
                    {!saving && <ArrowRight width={16} height={16} />}
                  </button>

                  <p className="text-xs text-[#96899D]">
                    You can update these details later.
                  </p>
                </div>
              </form>
            </div>
          </section>
        )}

        <div className="flex flex-col justify-between gap-5 py-8 sm:flex-row sm:items-center">
          <h2 className="text-xl font-semibold tracking-tight">
            Your company list
            <span className="ml-2 text-sm font-normal text-[#96899D]">
              ({filteredCompanies.length})
            </span>
          </h2>

          <div className="relative w-full sm:max-w-xs">
            <Search
              width={17}
              height={17}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-[#96899D]"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search companies..."
              aria-label="Search companies"
              className="w-full border-0 border-b border-[#DDD4DF] bg-transparent py-3 pl-7 pr-2 text-sm outline-none transition placeholder:text-[#B5AAB9] focus:border-[#7965CD]"
            />
          </div>
        </div>

        {error && (
          <div role="alert" className="py-6 text-sm text-[#A24754]">
            {error}
            <button
              type="button"
              onClick={() => void loadCompanies()}
              className="ml-3 font-medium underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="divide-y divide-[#E7DFD4]">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex animate-pulse gap-5 py-7">
                <div className="h-12 w-12 rounded-2xl bg-[#E8E0D5]" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 w-1/3 rounded bg-[#E8E0D5]" />
                  <div className="h-3 w-1/2 rounded bg-[#E8E0D5]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="border-t border-[#E7DFD4] py-16">
            <Building
              width={30}
              height={30}
              strokeWidth={1.4}
              className="text-[#7965CD]"
            />

            <h3 className="mt-5 text-xl font-semibold tracking-tight">
              {search ? "No matching companies." : "Your list starts here."}
            </h3>

            <p className="mt-3 max-w-md text-sm leading-7 text-[#817687]">
              {search
                ? "Try another search term, or clear your search to see all companies."
                : "Add companies you're interested in, then connect your applications to keep your job search organized."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#7965CD] transition hover:text-[#42364D]"
              >
                Add your first company
                <ArrowRight width={16} height={16} />
              </button>
            )}
          </div>
        ) : (
          <div className="border-t border-[#E7DFD4]">
            {filteredCompanies.map((company) => (
              <article
                key={company._id}
                className="group flex flex-col justify-between gap-5 border-b border-[#E7DFD4] py-7 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEE8F7] text-[#7965CD]">
                    <Building width={21} height={21} strokeWidth={1.6} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="wrap-break-word text-lg font-semibold tracking-tight">
                      {company.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#96899D]">
                      {company.industry && <span>{company.industry}</span>}
                      {company.location && <span>{company.location}</span>}
                      {company.website && (
                        <a
                          href={
                            /^https?:\/\//i.test(company.website)
                              ? company.website
                              : `https://${company.website}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#7965CD] transition hover:text-[#42364D]"
                        >
                          Website
                        </a>
                      )}
                    </div>

                    {company.notes && (
                      <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-[#817687]">
                        {company.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-5 pl-16 sm:pl-0">
                  <div>
                    <p className="text-lg font-semibold">
                      {company.applicationCount ??
                        company.applicationsCount ??
                        0}
                    </p>
                    <p className="mt-1 text-xs text-[#96899D]">
                      Applications
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/companies/${company._id}`}
                    aria-label={`View ${company.name}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#7965CD] transition hover:bg-[#EEE8F7]"
                  >
                    <ArrowRight width={19} height={19} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => void handleDelete(company)}
                    aria-label={`Delete ${company.name}`}
                    className="text-xs text-[#A24754] opacity-70 transition hover:opacity-100"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}