"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Xmark,
  ArrowUpRight,
  Suitcase,
  Building,
  Calendar,
  LogOut,
  User,
  Home,
  Book,
} from "iconoir-react";

type AuthUser = {
  _id?: string;
  name?: string;
  email?: string;
};

function CatLogo() {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      className="h-9 w-9 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M9 22L10 8L21 16Q27 13 32 16L43 8L44 23Q49 37 36 43Q23 48 13 39Q6 32 9 22Z"
        fill="#E7DCFF"
        stroke="#42364D"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 20L13 12L20 18M35 18L41 12L40 21"
        fill="#FFB9A9"
        stroke="#42364D"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M15 28Q19 32 23 28M30 28Q34 32 38 27"
        stroke="#42364D"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M25 34L27 36L29 34"
        stroke="#E98E91"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M21 38Q27 42 33 37"
        stroke="#42364D"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const publicLinks = [
  { label: "Home", href: "/", section: "home" },
  { label: "Features", href: "/#features", section: "features" },
  {
    label: "How it works",
    href: "/how-it-works",
    section: "how-it-works",
  },
];

const dashboardLinks = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  {
    label: "Applications",
    href: "/dashboard/applications",
    icon: Suitcase,
  },
  { label: "Companies", href: "/dashboard/companies", icon: Building },
  { label: "Follow-ups", href: "/dashboard/follow-ups", icon: Calendar },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const isDashboard = pathname.startsWith("/dashboard");

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.authenticated && result?.user) {
        setUser(result.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth, pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function getPublicHref(href: string) {
    if (isHome && href.startsWith("/#")) {
      return href.slice(1);
    }

    return href;
  }

  function isPublicActive(section: string) {
    if (section === "home") {
      return isHome;
    }

    if (section === "how-it-works") {
      return pathname === "/how-it-works";
    }

    return false;
  }

  function isDashboardActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const linkClass = (active: boolean) =>
    `whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold transition-colors lg:px-4 ${
      active
        ? "bg-[#E7DCFF] text-[#42364D]"
        : "text-[#756B78] hover:bg-[#F1EBDD] hover:text-[#42364D]"
    }`;

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      setUser(null);
      setOpen(false);
      setLoggingOut(false);
      router.push("/");
      router.refresh();
    }
  }

  const displayName = user?.name?.trim() || user?.email || "Your account";

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F0]/90 px-3 py-3 backdrop-blur-md sm:px-6 sm:py-4">
      <nav
        aria-label="Main navigation"
        className="relative mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-full border-2 border-[#42364D] bg-[#FFFEFB] p-1.5 shadow-[3px_3px_0_#42364D] sm:gap-4 sm:px-3"
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          aria-label="JobQuest home"
          className="flex shrink-0 items-center gap-1 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-[#F1EBDD]"
        >
          <CatLogo />
          <span className="text-lg font-black tracking-[-1px] text-[#42364D] sm:text-xl">
            jobquest<span className="text-[#9274B8]">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 xl:flex">
          {isDashboard && user
            ? dashboardLinks.map((link) => {
                const Icon = link.icon;
                const active = isDashboardActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={linkClass(active)}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5" />
                      {link.label}
                    </span>
                  </Link>
                );
              })
            : publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={getPublicHref(link.href)}
                  aria-current={
                    isPublicActive(link.section) ? "page" : undefined
                  }
                  className={linkClass(isPublicActive(link.section))}
                >
                  {link.label}
                </Link>
              ))}
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          {authLoading ? (
            <div
              aria-label="Checking authentication"
              className="h-9 w-20 animate-pulse rounded-full bg-[#F1EBDD]"
            />
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="flex max-w-36 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold text-[#756B78] transition-colors hover:bg-[#F1EBDD] hover:text-[#42364D]"
                title={displayName}
              >
                <User className="h-4 w-4 shrink-0" />
                <span className="truncate">{displayName}</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2.5 text-xs font-bold text-[#756B78] transition-colors hover:bg-[#FFE0DF] hover:text-[#A44246] disabled:opacity-50"
              >
                <LogOut className="h-3.5 w-3.5" />
                {loggingOut ? "Signing out..." : "Sign out"}
              </button>

              {!isDashboard && (
                <Link
                  href="/dashboard"
                  className="group flex items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-[#42364D] bg-[#FFB9A9] px-3 py-2.5 text-xs font-black text-[#42364D] shadow-[2px_2px_0_#42364D] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#42364D] active:translate-y-0 active:shadow-none lg:px-4"
                >
                  Dashboard
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 py-2.5 text-xs font-bold text-[#756B78] transition-colors hover:bg-[#F1EBDD] hover:text-[#42364D] lg:px-4"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="group flex items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-[#42364D] bg-[#FFB9A9] px-3 py-2.5 text-xs font-black text-[#42364D] shadow-[2px_2px_0_#42364D] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#42364D] active:translate-y-0 active:shadow-none lg:px-4"
              >
                Get started
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#42364D] bg-[#E7DCFF] text-[#42364D] transition-transform hover:rotate-3 sm:hidden"
        >
          {open ? (
            <Xmark className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        {open && (
          <div
            id="mobile-navigation"
            className="absolute left-0 right-0 top-[calc(100%+10px)] max-h-[80vh] overflow-y-auto rounded-[24px] border-2 border-[#42364D] bg-[#FFFEFB] p-3 shadow-[3px_3px_0_#42364D] sm:hidden"
          >
            <div className="flex flex-col gap-1.5">
              {isDashboard && user
                ? dashboardLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isDashboardActive(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-3 rounded-full px-4 py-3 text-sm font-bold transition-colors ${
                          active
                            ? "bg-[#E7DCFF] text-[#42364D]"
                            : "text-[#756B78] hover:bg-[#F1EBDD]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    );
                  })
                : publicLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={getPublicHref(link.href)}
                      onClick={() => setOpen(false)}
                      aria-current={
                        isPublicActive(link.section) ? "page" : undefined
                      }
                      className={`rounded-full px-4 py-3 text-sm font-bold transition-colors ${
                        isPublicActive(link.section)
                          ? "bg-[#E7DCFF] text-[#42364D]"
                          : "text-[#756B78] hover:bg-[#F1EBDD]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}

              {user && (
                <div className="mt-1 rounded-2xl bg-[#F7F1E8] px-4 py-3">
                  <p className="truncate text-sm font-bold">{displayName}</p>
                  {user.email && (
                    <p className="mt-1 truncate text-xs text-[#766E7C]">
                      {user.email}
                    </p>
                  )}
                </div>
              )}

              <div className="my-1 border-t border-dashed border-[#D9CFC4]" />

              {authLoading ? (
                <div className="h-11 animate-pulse rounded-full bg-[#F1EBDD]" />
              ) : user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-[#A44246] transition-colors hover:bg-[#FFE0DF] disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                  {loggingOut ? "Signing out..." : "Sign out"}
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-full px-4 py-3 text-sm font-bold text-[#756B78] hover:bg-[#F1EBDD]"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-full border-2 border-[#42364D] bg-[#FFB9A9] px-4 py-3 text-sm font-black text-[#42364D] shadow-[2px_2px_0_#42364D]"
                  >
                    Get started
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}