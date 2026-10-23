"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Refresh,
  Search,
  Suitcase,
} from "iconoir-react";

type FollowUp = {
  _id?: string;
  id?: string;
  applicationId?: string;
  application?: {
    _id?: string;
    id?: string;
    jobTitle?: string;
    title?: string;
    company?: string | { name?: string };
    companyName?: string;
    status?: string;
    followUpDate?: string;
    nextAction?: string;
  };
  jobTitle?: string;
  title?: string;
  company?: string | { name?: string };
  companyName?: string;
  status?: string;
  followUpDate?: string;
  nextAction?: string;
  notes?: string;
};

type FollowUpGroup = "overdue" | "today" | "upcoming";

function extractFollowUps(payload: unknown): FollowUp[] {
  if (Array.isArray(payload)) {
    return payload as FollowUp[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const result = payload as Record<string, unknown>;

  if (Array.isArray(result.data)) {
    return result.data as FollowUp[];
  }

  if (result.data && typeof result.data === "object") {
    const nested = result.data as Record<string, unknown>;

    if (Array.isArray(nested.followUps)) {
      return nested.followUps as FollowUp[];
    }

    if (Array.isArray(nested.followups)) {
      return nested.followups as FollowUp[];
    }

    if (Array.isArray(nested.applications)) {
      return nested.applications as FollowUp[];
    }

    if (Array.isArray(nested.items)) {
      return nested.items as FollowUp[];
    }
  }

  if (Array.isArray(result.followUps)) {
    return result.followUps as FollowUp[];
  }

  if (Array.isArray(result.followups)) {
    return result.followups as FollowUp[];
  }

  if (Array.isArray(result.applications)) {
    return result.applications as FollowUp[];
  }

  if (Array.isArray(result.items)) {
    return result.items as FollowUp[];
  }

  return [];
}

function getApplicationId(item: FollowUp): string {
  return (
    item.application?._id ||
    item.application?.id ||
    item.applicationId ||
    item._id ||
    item.id ||
    ""
  );
}

function getJobTitle(item: FollowUp): string {
  return (
    item.application?.jobTitle ||
    item.application?.title ||
    item.jobTitle ||
    item.title ||
    "Untitled position"
  );
}

function getCompanyName(item: FollowUp): string {
  const company = item.application?.company ?? item.company;

  if (typeof company === "string") {
    return company;
  }

  if (company && typeof company === "object" && "name" in company) {
    return company.name || item.companyName || "Company not specified";
  }

  return (
    item.application?.companyName ||
    item.companyName ||
    "Company not specified"
  );
}

function getFollowUpDate(item: FollowUp): string {
  return (
    item.followUpDate ||
    item.application?.followUpDate ||
    ""
  );
}

function getNextAction(item: FollowUp): string {
  return (
    item.nextAction ||
    item.application?.nextAction ||
    item.notes ||
    "Review your application and decide on the next step."
  );
}

function getDateKey(value: string): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getTodayKey(): string {
  const today = new Date();

  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function formatDate(value: string): string {
  if (!value) {
    return "Date not specified";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date not specified";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getGroup(value: string): FollowUpGroup {
  const dateKey = getDateKey(value);
  const today = getTodayKey();

  if (dateKey && dateKey < today) {
    return "overdue";
  }

  if (dateKey === today) {
    return "today";
  }

  return "upcoming";
}

function getStatusLabel(status?: string): string {
  if (!status) {
    return "Application";
  }

  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

const groupDetails: Record<
  FollowUpGroup,
  { title: string; description: string }
> = {
  overdue: {
    title: "Overdue",
    description: "These follow-ups need your attention.",
  },
  today: {
    title: "Due today",
    description: "Make these follow-ups a priority.",
  },
  upcoming: {
    title: "Coming up",
    description: "Stay ahead of your next steps.",
  },
};

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadFollowUps = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await fetch("/api/follow-ups", {
        method: "GET",
        cache: "no-store",
      });

      const payload = await response.json().catch(() => null);

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          payload?.message || "Unable to load your follow-ups.",
        );
      }

      setFollowUps(extractFollowUps(payload));
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong while loading follow-ups.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadFollowUps();
  }, [loadFollowUps]);

  const scheduledFollowUps = useMemo(() => {
    return followUps
      .filter((item) => Boolean(getFollowUpDate(item)))
      .filter((item) => {
        const query = search.trim().toLowerCase();

        if (!query) {
          return true;
        }

        return (
          getJobTitle(item).toLowerCase().includes(query) ||
          getCompanyName(item).toLowerCase().includes(query) ||
          getNextAction(item).toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        return (
          new Date(getFollowUpDate(a)).getTime() -
          new Date(getFollowUpDate(b)).getTime()
        );
      });
  }, [followUps, search]);

  const groupedFollowUps = useMemo(() => {
    return {
      overdue: scheduledFollowUps.filter(
        (item) => getGroup(getFollowUpDate(item)) === "overdue",
      ),
      today: scheduledFollowUps.filter(
        (item) => getGroup(getFollowUpDate(item)) === "today",
      ),
      upcoming: scheduledFollowUps.filter(
        (item) => getGroup(getFollowUpDate(item)) === "upcoming",
      ),
    };
  }, [scheduledFollowUps]);

  const overdueCount = groupedFollowUps.overdue.length;
  const todayCount = groupedFollowUps.today.length;
  const upcomingCount = groupedFollowUps.upcoming.length;

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#42364D]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/dashboard"
              className="mb-5 inline-flex items-center gap-2 text-sm text-[#7965CD] transition hover:text-[#42364D]"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to dashboard
            </Link>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7965CD]">
              Stay on top of things
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Follow-ups
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#766E7C] sm:text-base">
              Keep track of recruiter conversations, pending responses, and
              the next step for every application.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadFollowUps(true)}
            disabled={loading || refreshing}
            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-full border border-[#DCD4E3] px-5 text-sm font-medium transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            <Refresh className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="border-b border-[#DCD4E3] pb-5 sm:border-b-0 sm:border-r sm:pr-5">
            <div className="flex items-center gap-2 text-sm text-[#766E7C]">
              <Clock className="h-4 w-4" />
              Overdue
            </div>
            <p className="mt-3 text-3xl font-semibold">{overdueCount}</p>
            <p className="mt-1 text-sm text-[#766E7C]">
              {overdueCount === 1 ? "Follow-up needs" : "Follow-ups need"} your
              attention
            </p>
          </div>

          <div className="border-b border-[#DCD4E3] pb-5 sm:border-b-0 sm:border-r sm:px-5">
            <div className="flex items-center gap-2 text-sm text-[#766E7C]">
              <Calendar className="h-4 w-4" />
              Due today
            </div>
            <p className="mt-3 text-3xl font-semibold">{todayCount}</p>
            <p className="mt-1 text-sm text-[#766E7C]">
              {todayCount === 1 ? "Action to complete" : "Actions to complete"}
            </p>
          </div>

          <div className="pb-5 sm:pl-5">
            <div className="flex items-center gap-2 text-sm text-[#766E7C]">
              <CheckCircle className="h-4 w-4" />
              Upcoming
            </div>
            <p className="mt-3 text-3xl font-semibold">{upcomingCount}</p>
            <p className="mt-1 text-sm text-[#766E7C]">
              Scheduled next steps
            </p>
          </div>
        </div>

        <div className="mt-8 border-b border-[#DCD4E3] pb-4">
          <label className="flex max-w-lg items-center gap-3">
            <Search className="h-5 w-5 shrink-0 text-[#91879B]" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by role, company, or next action..."
              className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-[#A49AAA]"
            />
          </label>
        </div>

        {error && (
          <div className="mt-8 flex flex-col gap-3 border-l-2 border-[#C45F65] py-3 pl-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#A33E48]">{error}</p>
            <button
              type="button"
              onClick={() => void loadFollowUps()}
              className="self-start text-sm font-semibold text-[#7965CD] hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#DCD4E3] border-t-[#7965CD]" />
            <p className="mt-4 text-sm text-[#766E7C]">
              Loading your follow-ups...
            </p>
          </div>
        ) : !error && scheduledFollowUps.length === 0 ? (
          <div className="py-20 text-center">
            <Calendar className="mx-auto h-9 w-9 text-[#91879B]" />
            <h2 className="mt-5 text-xl font-semibold">
              {search ? "No matching follow-ups" : "Nothing scheduled yet"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#766E7C]">
              {search
                ? "Try another search term to find a follow-up."
                : "Add a follow-up date and next action to an application to see it here."}
            </p>
            {!search && (
              <Link
                href="/dashboard/applications"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#7965CD] hover:underline"
              >
                View applications
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {(
              ["overdue", "today", "upcoming"] as FollowUpGroup[]
            ).map((group) => {
              const items = groupedFollowUps[group];

              if (items.length === 0) {
                return null;
              }

              return (
                <section key={group}>
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {groupDetails[group].title}
                      </h2>
                      <p className="mt-1 text-sm text-[#766E7C]">
                        {groupDetails[group].description}
                      </p>
                    </div>

                    <span className="text-sm text-[#766E7C]">
                      {items.length} {items.length === 1 ? "item" : "items"}
                    </span>
                  </div>

                  <div className="divide-y divide-[#E4DDE8]">
                    {items.map((item, index) => {
                      const applicationId = getApplicationId(item);
                      const status =
                        item.application?.status || item.status;

                      return (
                        <article
                          key={`${applicationId}-${getFollowUpDate(item)}-${index}`}
                          className="flex flex-col gap-4 py-5 sm:flex-row sm:items-start sm:justify-between"
                        >
                          <div className="flex min-w-0 gap-4">
                            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDE7F7]">
                              <Suitcase className="h-5 w-5 text-[#7965CD]" />
                            </div>

                            <div className="min-w-0">
                              <h3 className="font-semibold">
                                {getJobTitle(item)}
                              </h3>

                              <p className="mt-1 text-sm text-[#766E7C]">
                                {getCompanyName(item)}
                              </p>

                              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5F5668]">
                                {getNextAction(item)}
                              </p>

                              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#766E7C]">
                                <span className="inline-flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {formatDate(getFollowUpDate(item))}
                                </span>

                                {status && (
                                  <span className="capitalize">
                                    {getStatusLabel(status)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {applicationId ? (
                            <Link
                              href={`/dashboard/applications/${applicationId}`}
                              className="inline-flex shrink-0 items-center gap-2 self-start text-sm font-semibold text-[#7965CD] transition hover:text-[#42364D]"
                            >
                              View application
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          ) : (
                            <Link
                              href="/dashboard/applications"
                              className="inline-flex shrink-0 items-center gap-2 self-start text-sm font-semibold text-[#7965CD] transition hover:text-[#42364D]"
                            >
                              View applications
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}