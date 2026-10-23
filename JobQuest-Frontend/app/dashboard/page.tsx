"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  Refresh,
  Search,
  Suitcase,
  Trophy,
  Xmark,
} from "iconoir-react";

type Application = {
  _id: string;
  jobTitle?: string;
  role?: string;
  company?: string | { _id?: string; name?: string };
  status?: string;
  location?: string;
  appliedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  followUpDate?: string | null;
  nextAction?: string;
};

type FollowUp = {
  _id?: string;
  id?: string;
  applicationId?: string;
  application?: Application;
  jobTitle?: string;
  role?: string;
  title?: string;
  company?: string | { _id?: string; name?: string };
  companyName?: string;
  status?: string;
  followUpDate?: string;
  nextAction?: string;
  notes?: string;
};

type DashboardStats = {
  totalApplications: number;
  applied: number;
  interviews: number;
  offers: number;
  rejected: number;
};

type DashboardData = {
  stats?: Record<string, unknown>;
  data?: unknown;
  applications?: Application[];
  recentApplications?: Application[];
  totalApplications?: number;
  total?: number;
  applied?: number;
  interviews?: number;
  offers?: number;
  rejected?: number;
  [key: string]: unknown;
};

function extractApplications(payload: unknown): Application[] {
  if (Array.isArray(payload)) {
    return payload as Application[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const result = payload as Record<string, unknown>;

  if (Array.isArray(result.applications)) {
    return result.applications as Application[];
  }

  if (Array.isArray(result.recentApplications)) {
    return result.recentApplications as Application[];
  }

  if (Array.isArray(result.data)) {
    return result.data as Application[];
  }

  if (result.data && typeof result.data === "object") {
    const nested = result.data as Record<string, unknown>;

    if (Array.isArray(nested.applications)) {
      return nested.applications as Application[];
    }

    if (Array.isArray(nested.recentApplications)) {
      return nested.recentApplications as Application[];
    }

    if (Array.isArray(nested.items)) {
      return nested.items as Application[];
    }
  }

  return [];
}

function extractFollowUps(payload: unknown): {
  overdue: FollowUp[];
  upcoming: FollowUp[];
  total: number;
} {
  const empty = {
    overdue: [],
    upcoming: [],
    total: 0,
  };

  if (!payload || typeof payload !== "object") {
    return empty;
  }

  const result = payload as Record<string, unknown>;
  const nested =
    result.data && typeof result.data === "object"
      ? (result.data as Record<string, unknown>)
      : result;

  return {
    overdue: Array.isArray(nested.overdue)
      ? (nested.overdue as FollowUp[])
      : [],
    upcoming: Array.isArray(nested.upcoming)
      ? (nested.upcoming as FollowUp[])
      : [],
    total:
      typeof nested.total === "number"
        ? nested.total
        : (Array.isArray(nested.overdue) ? nested.overdue.length : 0) +
          (Array.isArray(nested.upcoming) ? nested.upcoming.length : 0),
  };
}

function getApplicationTitle(application: Application): string {
  return application.jobTitle || application.role || "Untitled position";
}

function getCompanyName(
  company?: string | { name?: string },
): string {
  if (typeof company === "string") {
    return company;
  }

  return company?.name || "Company not specified";
}

function getFollowUpApplicationId(item: FollowUp): string {
  return (
    item.application?._id ||
    item.applicationId ||
    item._id ||
    item.id ||
    ""
  );
}

function getFollowUpTitle(item: FollowUp): string {
  return (
    item.application?.jobTitle ||
    item.application?.role ||
    item.jobTitle ||
    item.role ||
    item.title ||
    "Untitled position"
  );
}

function getFollowUpCompany(item: FollowUp): string {
  return (
    getCompanyName(item.application?.company) !== "Company not specified"
      ? getCompanyName(item.application?.company)
      : getCompanyName(item.company) !== "Company not specified"
        ? getCompanyName(item.company)
        : item.companyName || "Company not specified"
  );
}

function getFollowUpAction(item: FollowUp): string {
  return (
    item.nextAction ||
    item.application?.nextAction ||
    item.notes ||
    "Review this application and decide on your next step."
  );
}

function getFollowUpDate(item: FollowUp): string {
  return item.followUpDate || item.application?.followUpDate || "";
}

function formatDate(value?: string): string {
  if (!value) {
    return "Date not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date not available";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusLabel(status?: string): string {
  if (!status) {
    return "Unknown";
  }

  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getStatusStyle(status?: string): string {
  switch (status?.toUpperCase()) {
    case "OFFER":
      return "bg-[#DDF2E3] text-[#286743]";
    case "INTERVIEW":
      return "bg-[#E8E1FF] text-[#6550A7]";
    case "ASSESSMENT":
      return "bg-[#FFE8CE] text-[#965D20]";
    case "APPLIED":
      return "bg-[#DDEBFF] text-[#345E9B]";
    case "REJECTED":
      return "bg-[#FFE0DF] text-[#A44246]";
    case "WITHDRAWN":
      return "bg-[#EAE5ED] text-[#6B6075]";
    default:
      return "bg-[#F0EAF7] text-[#7965CD]";
  }
}

function getCompanyCount(applications: Application[]): number {
  const companies = new Set(
    applications
      .map((application) => getCompanyName(application.company))
      .filter((company) => company !== "Company not specified"),
  );

  return companies.size;
}

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    applied: 0,
    interviews: 0,
    offers: 0,
    rejected: 0,
  });
  const [followUps, setFollowUps] = useState<{
    overdue: FollowUp[];
    upcoming: FollowUp[];
    total: number;
  }>({
    overdue: [],
    upcoming: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followUpError, setFollowUpError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = useCallback(async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");
    setFollowUpError("");

    try {
      const [dashboardResponse, applicationsResponse, followUpsResponse] =
        await Promise.all([
          fetch("/api/dashboard", {
            cache: "no-store",
          }),
          fetch("/api/applications", {
            cache: "no-store",
          }),
          fetch("/api/follow-ups", {
            cache: "no-store",
          }),
        ]);

      if (
        dashboardResponse.status === 401 ||
        applicationsResponse.status === 401 ||
        followUpsResponse.status === 401
      ) {
        window.location.href = "/login";
        return;
      }

      const dashboardPayload = await dashboardResponse
        .json()
        .catch(() => null);

      const applicationsPayload = await applicationsResponse
        .json()
        .catch(() => null);

      const followUpsPayload = await followUpsResponse
        .json()
        .catch(() => null);

      if (!dashboardResponse.ok) {
        throw new Error(
          dashboardPayload?.message || "Unable to load your dashboard.",
        );
      }

      if (!applicationsResponse.ok) {
        throw new Error(
          applicationsPayload?.message ||
            "Unable to load your applications.",
        );
      }

      const allApplications = extractApplications(applicationsPayload);
      const dashboardRoot =
        dashboardPayload && typeof dashboardPayload === "object"
          ? (dashboardPayload as DashboardData)
          : {};

      const dashboardData =
        dashboardRoot.data && typeof dashboardRoot.data === "object"
          ? (dashboardRoot.data as DashboardData)
          : dashboardRoot;

      const apiStats =
        dashboardData.stats && typeof dashboardData.stats === "object"
          ? dashboardData.stats
          : {};

      const countStatus = (status: string) =>
        allApplications.filter(
          (application) => application.status?.toUpperCase() === status,
        ).length;

      const numericValue = (
        keys: string[],
        fallback: number,
      ): number => {
        for (const key of keys) {
          const value = apiStats[key] ?? dashboardData[key];

          if (typeof value === "number" && Number.isFinite(value)) {
            return value;
          }
        }

        return fallback;
      };

      setApplications(
        [...allApplications].sort((a, b) => {
          const dateA = new Date(
            a.updatedAt || a.createdAt || a.appliedAt || 0,
          ).getTime();

          const dateB = new Date(
            b.updatedAt || b.createdAt || b.appliedAt || 0,
          ).getTime();

          return dateB - dateA;
        }),
      );

      setStats({
        totalApplications: numericValue(
          ["totalApplications", "total", "totalCount"],
          allApplications.length,
        ),
        applied: numericValue(
          ["applied", "appliedCount"],
          countStatus("APPLIED"),
        ),
        interviews: numericValue(
          ["interviews", "interviewCount", "interviewsCount"],
          countStatus("INTERVIEW"),
        ),
        offers: numericValue(
          ["offers", "offerCount", "offersCount"],
          countStatus("OFFER"),
        ),
        rejected: numericValue(
          ["rejected", "rejectedCount"],
          countStatus("REJECTED"),
        ),
      });

      if (followUpsResponse.ok) {
        setFollowUps(extractFollowUps(followUpsPayload));
      } else {
        setFollowUps({
          overdue: [],
          upcoming: [],
          total: 0,
        });
        setFollowUpError(
          followUpsPayload?.message || "Unable to load follow-ups.",
        );
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong while loading the dashboard.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const recentApplications = applications.slice(0, 5);

  const statsCards = [
    {
      label: "Total applications",
      value: stats.totalApplications,
      detail: "Across your job search",
      icon: Suitcase,
      iconStyle: "bg-[#E8E1FF] text-[#7965CD]",
    },
    {
      label: "Interviews",
      value: stats.interviews,
      detail: "Conversations in progress",
      icon: Calendar,
      iconStyle: "bg-[#FFE5D8] text-[#A45D45]",
    },
    {
      label: "Offers",
      value: stats.offers,
      detail: "Potential wins",
      icon: Trophy,
      iconStyle: "bg-[#DDF2E3] text-[#286743]",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      detail: "Keep moving forward",
      icon: Xmark,
      iconStyle: "bg-[#FFE0DF] text-[#A44246]",
    },
  ];

  const totalFollowUps = followUps.overdue.length + followUps.upcoming.length;

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#42364D]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7965CD]">
              Your workspace
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your job search, at a glance.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#766E7C] sm:text-base">
              Track your progress, stay ahead of follow-ups, and keep every
              opportunity moving.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void loadDashboard(true)}
              disabled={loading || refreshing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#DCD4E3] px-4 text-sm font-medium transition hover:bg-white disabled:opacity-50"
            >
              <Refresh
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <Link
              href="/dashboard/applications/new"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#7965CD] px-5 text-sm font-semibold text-white transition hover:bg-[#6550B5]"
            >
              <Plus className="h-4 w-4" />
              Add application
            </Link>
          </div>
        </header>

        {error && (
          <div className="mt-8 flex flex-col gap-3 border-l-2 border-[#C45F65] py-3 pl-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#A33E48]">{error}</p>
            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="self-start text-sm font-semibold text-[#7965CD] hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {statsCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.label}
                className="border-b border-[#DCD4E3] pb-5 sm:border-b-0 sm:pb-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-[#766E7C]">{card.label}</p>

                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${card.iconStyle}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                </div>

                <p className="mt-4 text-4xl font-semibold tracking-tight">
                  {loading ? "—" : card.value}
                </p>

                <p className="mt-2 text-sm text-[#766E7C]">{card.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="min-w-0">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7965CD]">
                  Your pipeline
                </p>

                <h2 className="text-xl font-semibold">Recent applications</h2>

                <p className="mt-1 text-sm text-[#766E7C]">
                  The latest opportunities you have been working on.
                </p>
              </div>

              <Link
                href="/dashboard/applications"
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#7965CD] transition hover:text-[#42364D]"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6">
              {loading ? (
                <div className="py-12 text-center text-sm text-[#766E7C]">
                  Loading applications...
                </div>
              ) : recentApplications.length === 0 ? (
                <div className="border-y border-dashed border-[#DCD4E3] py-12">
                  <Suitcase className="h-8 w-8 text-[#7965CD]" />

                  <h3 className="mt-4 text-lg font-semibold">
                    Your next opportunity starts here.
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-[#766E7C]">
                    Add your first application to start building your pipeline
                    and tracking your progress.
                  </p>

                  <Link
                    href="/dashboard/applications/new"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#7965CD] hover:underline"
                  >
                    Add your first application
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#E4DDE8]">
                  {recentApplications.map((application) => (
                    <Link
                      key={application._id}
                      href={`/dashboard/applications/${application._id}`}
                      className="group flex items-center justify-between gap-4 py-5 transition"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EDE7F7]">
                          <Suitcase className="h-5 w-5 text-[#7965CD]" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold transition group-hover:text-[#7965CD]">
                            {getApplicationTitle(application)}
                          </h3>

                          <p className="mt-1 truncate text-sm text-[#766E7C]">
                            {getCompanyName(application.company)}
                          </p>

                          <p className="mt-1 text-xs text-[#91879B]">
                            {formatDate(
                              application.appliedAt ||
                                application.createdAt,
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span
                          className={`hidden rounded-full px-3 py-1.5 text-xs font-medium sm:inline-flex ${getStatusStyle(application.status)}`}
                        >
                          {getStatusLabel(application.status)}
                        </span>

                        <ArrowRight className="h-4 w-4 text-[#91879B] transition group-hover:translate-x-1 group-hover:text-[#7965CD]" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="min-w-0">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7965CD]">
                  Don&apos;t lose momentum
                </p>

                <h2 className="text-xl font-semibold">Follow-ups</h2>

                <p className="mt-1 text-sm text-[#766E7C]">
                  Keep the conversation moving.
                </p>
              </div>

              <Link
                href="/dashboard/follow-ups"
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#7965CD] transition hover:text-[#42364D]"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 flex items-center justify-between border-y border-[#DCD4E3] py-4">
              <div>
                <p className="text-sm text-[#766E7C]">Overdue</p>
                <p className="mt-1 text-2xl font-semibold">
                  {loading ? "—" : followUps.overdue.length}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#766E7C]">Upcoming</p>
                <p className="mt-1 text-2xl font-semibold">
                  {loading ? "—" : followUps.upcoming.length}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#766E7C]">Total</p>
                <p className="mt-1 text-2xl font-semibold">
                  {loading ? "—" : followUps.total || totalFollowUps}
                </p>
              </div>
            </div>

            {followUpError && (
              <div className="mt-4 border-l-2 border-[#C45F65] py-2 pl-3">
                <p className="text-sm text-[#A33E48]">{followUpError}</p>
                <button
                  type="button"
                  onClick={() => void loadDashboard(true)}
                  className="mt-1 text-sm font-semibold text-[#7965CD] hover:underline"
                >
                  Retry
                </button>
              </div>
            )}

            {loading ? (
              <div className="py-10 text-center text-sm text-[#766E7C]">
                Loading follow-ups...
              </div>
            ) : !followUpError && totalFollowUps === 0 ? (
              <div className="py-10">
                <CheckCircle className="h-8 w-8 text-[#7965CD]" />

                <h3 className="mt-4 font-semibold">
                  You&apos;re all caught up.
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#766E7C]">
                  Follow-up dates and next actions from your applications will
                  show up here.
                </p>

                <Link
                  href="/dashboard/applications"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#7965CD] hover:underline"
                >
                  Review applications
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : !followUpError ? (
              <div className="divide-y divide-[#E4DDE8]">
                {[
                  ...followUps.overdue.map((item) => ({
                    item,
                    overdue: true,
                  })),
                  ...followUps.upcoming.map((item) => ({
                    item,
                    overdue: false,
                  })),
                ]
                  .slice(0, 5)
                  .map(({ item, overdue }, index) => {
                    const applicationId = getFollowUpApplicationId(item);

                    return (
                      <article
                        key={`${applicationId}-${getFollowUpDate(item)}-${index}`}
                        className="py-4"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                              overdue
                                ? "bg-[#FFE0DF] text-[#A44246]"
                                : "bg-[#E8E1FF] text-[#7965CD]"
                            }`}
                          >
                            {overdue ? (
                              <Clock className="h-4 w-4" />
                            ) : (
                              <Calendar className="h-4 w-4" />
                            )}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold">
                                {getFollowUpTitle(item)}
                              </h3>

                              {overdue && (
                                <span className="rounded-full bg-[#FFE0DF] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#A44246]">
                                  Overdue
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-sm text-[#766E7C]">
                              {getFollowUpCompany(item)}
                            </p>

                            <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#5F5668]">
                              {getFollowUpAction(item)}
                            </p>

                            <p
                              className={`mt-2 text-xs font-medium ${
                                overdue ? "text-[#A44246]" : "text-[#7965CD]"
                              }`}
                            >
                              {formatDate(getFollowUpDate(item))}
                            </p>

                            <Link
                              href={
                                applicationId
                                  ? `/dashboard/applications/${applicationId}`
                                  : "/dashboard/applications"
                              }
                              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#7965CD] hover:underline"
                            >
                              Open application
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
              </div>
            ) : null}

            {!loading && !followUpError && totalFollowUps > 5 && (
              <Link
                href="/dashboard/follow-ups"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#7965CD] hover:underline"
              >
                See all {totalFollowUps} follow-ups
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </aside>
        </section>

        <section className="mt-12 border-t border-[#DCD4E3] pt-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFE5D8] text-[#A45D45]">
                <Activity className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold">Keep building momentum.</h2>
                <p className="mt-1 text-sm leading-6 text-[#766E7C]">
                  {loading
                    ? "Getting your job search stats ready..."
                    : `You have tracked ${stats.totalApplications} ${
                        stats.totalApplications === 1
                          ? "application"
                          : "applications"
                      } across ${getCompanyCount(applications)} ${
                        getCompanyCount(applications) === 1
                          ? "company"
                          : "companies"
                      }. Keep your next steps up to date.`}
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/applications"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#7965CD] transition hover:text-[#42364D]"
            >
              <Search className="h-4 w-4" />
              Explore your pipeline
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}