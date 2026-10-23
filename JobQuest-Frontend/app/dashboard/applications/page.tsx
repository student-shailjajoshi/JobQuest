"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Search,
  Plus,
  Suitcase,
  Filter,
  Refresh,
} from "iconoir-react";

type Application = {
  _id: string;
  jobTitle?: string;
  position?: string;
  title?: string;
  company?: { name?: string } | string;
  status?: string;
  location?: string;
  jobType?: string;
  workMode?: string;
  appliedAt?: string;
  applicationDate?: string;
  createdAt?: string;
};

type ApplicationResponse = {
  data?:
    | Application[]
    | {
        applications?: Application[];
        items?: Application[];
        data?: Application[];
      };
  applications?: Application[];
  message?: string;
};

const statuses = [
  "ALL",
  "WISHLIST",
  "APPLIED",
  "ASSESSMENT",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

const statusColors: Record<string, string> = {
  WISHLIST: "bg-[#E7DCFF] text-[#6850A3]",
  APPLIED: "bg-[#DCE9FF] text-[#4267A9]",
  ASSESSMENT: "bg-[#FFE8A3] text-[#8B6819]",
  INTERVIEW: "bg-[#FFDFD7] text-[#A54F40]",
  OFFER: "bg-[#D8EFCB] text-[#416B36]",
  REJECTED: "bg-[#FFE0E0] text-[#A34444]",
  WITHDRAWN: "bg-[#EAE5ED] text-[#756B7D]",
};

function getApplications(result: ApplicationResponse): Application[] {
  if (Array.isArray(result.data)) return result.data;
  if (Array.isArray(result.applications)) return result.applications;

  if (result.data && !Array.isArray(result.data)) {
    if (Array.isArray(result.data.applications)) {
      return result.data.applications;
    }

    if (Array.isArray(result.data.items)) return result.data.items;
    if (Array.isArray(result.data.data)) return result.data.data;
  }

  return [];
}

function getCompanyName(company: Application["company"]) {
  if (typeof company === "string") return company;
  return company?.name || "Company";
}

function getJobTitle(application: Application) {
  return (
    application.jobTitle ||
    application.position ||
    application.title ||
    "Untitled position"
  );
}

function formatDate(date?: string) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatLabel(value?: string) {
  if (!value) return "";

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function ApplicationsPage() {
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/applications", {
        cache: "no-store",
      });

      const result = (await response.json().catch(() => null)) as
        | ApplicationResponse
        | null;

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to load your applications.",
        );
      }

      setApplications(getApplications(result || {}));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading applications.",
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesStatus =
        selectedStatus === "ALL" ||
        application.status?.toUpperCase() === selectedStatus;

      const matchesSearch =
        !query ||
        getJobTitle(application).toLowerCase().includes(query) ||
        getCompanyName(application.company).toLowerCase().includes(query) ||
        application.location?.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [applications, search, selectedStatus]);

  return (
    <main className="min-h-screen bg-[#FAF7F0] px-5 py-8 text-[#42364D] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-[#9274B8] transition hover:text-[#7965CD]"
            >
              Dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Applications<span className="text-[#7965CD]">.</span>
            </h1>

            <p className="mt-2 text-sm text-[#8B8193]">
              Keep every opportunity in one place.
            </p>
          </div>

          <Link
            href="/dashboard/applications/new"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#7965CD] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6C57BD]"
          >
            <Plus width={17} height={17} />
            Add application
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-11 flex-1 items-center gap-2 rounded-xl border border-[#E8DFE8] bg-white/70 px-3">
            <Search
              width={18}
              height={18}
              strokeWidth={1.7}
              className="shrink-0 text-[#9B8FA5]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search roles, companies, or locations..."
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-[#B0A6B8]"
              aria-label="Search applications"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter
              width={17}
              height={17}
              strokeWidth={1.7}
              className="shrink-0 text-[#9274B8]"
            />

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="h-11 min-w-36 rounded-xl border border-[#E8DFE8] bg-white/70 px-3 text-sm outline-none focus:border-[#7965CD]"
              aria-label="Filter by status"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "ALL" ? "All statuses" : formatLabel(status)}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => void loadApplications()}
              disabled={loading}
              aria-label="Refresh applications"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E8DFE8] bg-white/70 transition hover:bg-[#EEE7F5] disabled:opacity-50"
            >
              <Refresh
                width={17}
                height={17}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-[#8B8193]">
          <p>
            {loading
              ? "Loading applications..."
              : `${filteredApplications.length} ${
                  filteredApplications.length === 1
                    ? "application"
                    : "applications"
                }`}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-5 flex flex-col justify-between gap-3 rounded-xl bg-[#FFF0ED] px-4 py-3 text-sm text-[#9B3E38] sm:flex-row sm:items-center"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={() => void loadApplications()}
              className="w-fit font-semibold underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}

        <section className="mt-4">
          {loading ? (
            <div className="divide-y divide-[#E8DFE8]">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse items-center gap-3 py-5"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#E9E1EF]" />

                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 rounded bg-[#E9E1EF]" />
                    <div className="h-3 w-1/4 rounded bg-[#EEE8F0]" />
                  </div>

                  <div className="h-6 w-20 rounded-full bg-[#EEE8F0]" />
                </div>
              ))}
            </div>
          ) : filteredApplications.length > 0 ? (
            <div className="divide-y divide-[#E8DFE8]">
              {filteredApplications.map((application) => {
                const status = application.status?.toUpperCase() || "WISHLIST";

                return (
                  <Link
                    key={application._id}
                    href={`/dashboard/applications/${application._id}`}
                    className="group flex items-center gap-3 py-5 transition sm:gap-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E7DCFF] text-[#7965CD] transition group-hover:bg-[#DCCBFF]">
                      <Suitcase
                        width={19}
                        height={19}
                        strokeWidth={1.7}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-sm font-bold transition group-hover:text-[#7965CD]">
                        {getJobTitle(application)}
                      </h2>

                      <p className="mt-1 truncate text-xs text-[#8B8193]">
                        {getCompanyName(application.company)}
                        {application.location
                          ? ` · ${application.location}`
                          : ""}
                      </p>

                      {(application.jobType || application.workMode) && (
                        <p className="mt-1 text-[11px] text-[#A096AA]">
                          {[application.jobType, application.workMode]
                            .filter(Boolean)
                            .map(formatLabel)
                            .join(" · ")}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold sm:text-[11px] ${
                          statusColors[status] ||
                          "bg-[#EAE5ED] text-[#756B7D]"
                        }`}
                      >
                        {formatLabel(status)}
                      </span>

                      <span className="text-[10px] text-[#A096AA]">
                        {formatDate(
                          application.appliedAt ||
                            application.applicationDate ||
                            application.createdAt,
                        )}
                      </span>
                    </div>

                    <ArrowRight
                      width={16}
                      height={16}
                      className="hidden shrink-0 text-[#B4A6C1] transition group-hover:translate-x-0.5 group-hover:text-[#7965CD] sm:block"
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-14">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7DCFF] text-[#7965CD]">
                <Suitcase width={21} height={21} strokeWidth={1.7} />
              </div>

              <h2 className="mt-4 text-lg font-bold">
                {search || selectedStatus !== "ALL"
                  ? "No matching applications."
                  : "Your next opportunity starts here."}
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-[#8B8193]">
                {search || selectedStatus !== "ALL"
                  ? "Try another search term or change the status filter."
                  : "Add the jobs you're interested in and track each opportunity as it progresses."}
              </p>

              {search || selectedStatus !== "ALL" ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedStatus("ALL");
                  }}
                  className="mt-4 text-sm font-semibold text-[#7965CD]"
                >
                  Clear filters
                </button>
              ) : (
                <Link
                  href="/dashboard/applications/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#7965CD]"
                >
                  Add your first application
                  <ArrowRight width={16} height={16} />
                </Link>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}