"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LoginState = {
  error: string;
  success: string;
};

const initialState: LoginState = {
  error: "",
  success: "",
};

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  async function loginAction(
    _previousState: LoginState,
    formData: FormData,
  ): Promise<LoginState> {
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();

    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      return {
        error: "Please enter your email and password.",
        success: "",
      };
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          error: data?.message || "Couldn't sign you in. Please try again.",
          success: "",
        };
      }

      return {
        error: "",
        success: "Welcome back! Getting your career journey ready...",
      };
    } catch {
      return {
        error:
          "Couldn't connect to JobQuest. Please check your connection and try again.",
        success: "",
      };
    }
  }

  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  useEffect(() => {
    if (!state.success) return;

    router.replace("/dashboard");
  }, [state.success, router]);

  return (
    <main className="relative isolate overflow-hidden bg-[#FAF7F0] px-6 py-12 text-[#42364D] sm:px-10 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 -z-10 h-80 w-80 rounded-full bg-[#E7DCFF]/60 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-24 -z-10 h-80 w-80 rounded-full bg-[#FFB9A9]/25 blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1fr] lg:gap-24">
        <section className="mx-auto w-full max-w-md lg:mx-0">
          <div className="mb-8 flex items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center text-5xl sm:h-20 sm:w-20 sm:text-6xl">
              🐱
              <span className="absolute -right-1 top-0 text-2xl text-[#FFB9A9]">
                ✦
              </span>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9274B8]">
                Your career companion
              </p>
              <p className="mt-1 text-sm text-[#756B7D]">
                Hey, your next chapter is waiting.
              </p>
            </div>
          </div>

          <h1 className="text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Good to see you{" "}
            <span className="relative inline-block text-[#7965CD]">
              again.
              <svg
                aria-hidden="true"
                viewBox="0 0 200 12"
                fill="none"
                className="absolute -bottom-2 left-0 w-full"
              >
                <path
                  d="M3 8C48 2 137 2 197 7"
                  stroke="#FFB9A9"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-7 max-w-md text-base leading-8 text-[#756B7D] sm:text-lg">
            Your applications, career goals, and next big opportunity are all
            right where you left them. Let's pick up where you left off.
          </p>

          <div className="mt-12 space-y-7">
            <div className="flex items-start gap-4">
              <span className="text-2xl" aria-hidden="true">
                🌷
              </span>
              <div>
                <h2 className="text-sm font-bold sm:text-base">
                  Your journey, all in one place
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#8B8193]">
                  Applications, interviews, and offers without the chaos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-2xl" aria-hidden="true">
                ✨
              </span>
              <div>
                <h2 className="text-sm font-bold sm:text-base">
                  Every little step counts
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#8B8193]">
                  Keep moving forward, one opportunity at a time.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-3 text-sm font-medium text-[#9274B8]">
            <span className="h-px w-10 bg-[#D8C9F4]" />
            Your next opportunity could be the one.
          </div>
        </section>

        <section className="mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
          <div className="mb-9">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#9274B8]">
              Welcome back
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Let's get you in
              <span className="text-[#7965CD]">.</span>
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#756B7D]">
              Sign in to continue your career adventure.
            </p>
          </div>

          <form action={formAction} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                disabled={isPending || Boolean(state.success)}
                className="w-full rounded-xl border-0 border-b-2 border-[#E4DCEB] bg-white/55 px-4 py-3.5 text-sm outline-none transition placeholder:text-[#AAA0B2] hover:bg-white/80 focus:border-[#9274B8] focus:bg-white disabled:opacity-60"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#9274B8] transition hover:text-[#5945A9]"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                minLength={8}
                maxLength={128}
                required
                disabled={isPending || Boolean(state.success)}
                className="w-full rounded-xl border-0 border-b-2 border-[#E4DCEB] bg-white/55 px-4 py-3.5 text-sm outline-none transition placeholder:text-[#AAA0B2] hover:bg-white/80 focus:border-[#9274B8] focus:bg-white disabled:opacity-60"
              />
            </div>

            <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-[#756B7D]">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(event) => setShowPassword(event.target.checked)}
                className="h-4 w-4 accent-[#7965CD]"
              />
              Show password
            </label>

            {state.error && (
              <p
                role="alert"
                className="rounded-xl bg-[#FFF0ED] px-4 py-3 text-sm leading-6 text-[#9B3E38]"
              >
                {state.error}
              </p>
            )}

            {state.success && (
              <p
                role="status"
                className="rounded-xl bg-[#F0F9E9] px-4 py-3 text-sm leading-6 text-[#416B36]"
              >
                {state.success}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending || Boolean(state.success)}
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#7965CD] px-6 py-4 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#6C57BD] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isPending ? "Signing you in..." : "Let's go"}
              {!isPending && (
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#756B7D]">
            New to JobQuest?{" "}
            <Link
              href="/register"
              className="font-bold text-[#7965CD] underline decoration-[#D8C9F4] decoration-2 underline-offset-4 transition hover:text-[#5945A9]"
            >
              Create an account
            </Link>
          </p>

          <p className="mt-6 text-center text-xs leading-6 text-[#A096AA]">
            Made with a little love and a lot of ambition. 💜
          </p>
        </section>
      </div>
    </main>
  );
}