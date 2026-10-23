"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type RegisterState = {
  error: string;
  success: string;
};

const initialState: RegisterState = {
  error: "",
  success: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  async function registerAction(
    _previousState: RegisterState,
    formData: FormData,
  ): Promise<RegisterState> {
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(
      formData.get("confirmPassword") ?? "",
    );

    if (password.length < 8) {
      return {
        error: "Your password must contain at least 8 characters.",
        success: "",
      };
    }

    if (password !== confirmPassword) {
      return {
        error: "Your passwords don't match. Give it another try!",
        success: "",
      };
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          error: data?.message || "Unable to create your account. Please try again.",
          success: "",
        };
      }
      return {
        error: "",
        success: "You're all set! Taking you to sign in...",
      };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        success: "",
      };
    }
  }

  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );

  useEffect(() => {
    if (!state.success) return;

    const timeout = window.setTimeout(() => {
      router.push("/login?registered=true");
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [state.success, router]);

  return (
    <main className="relative isolate overflow-hidden bg-[#FAF7F0] px-6 py-12 text-[#42364D] sm:px-10 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 -z-10 h-80 w-80 rounded-full bg-[#E7DCFF]/60 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-24 -z-10 h-80 w-80 rounded-full bg-[#FFB9A9]/20 blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
        <section className="mx-auto w-full max-w-xl lg:mx-0">
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
                A little less chaos, a lot more progress.
              </p>
            </div>
          </div>

          <h1 className="max-w-xl text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Your next chapter starts{" "}
            <span className="relative inline-block text-[#7965CD]">
              here.
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
            Every application tells a story. Keep yours organized, celebrate
            every little win, and make your next career move with confidence.
          </p>

          <div className="mt-10 space-y-6">
            {[
              {
                emoji: "🌷",
                title: "Everything in one place",
                description:
                  "Applications, companies, interviews, and offers.",
              },
              {
                emoji: "✨",
                title: "Progress you can actually see",
                description:
                  "Know where you stand without the spreadsheet chaos.",
              },
              {
                emoji: "🐾",
                title: "Your journey, your pace",
                description: "A little organization goes a long way.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <span className="mt-0.5 text-2xl" aria-hidden="true">
                  {item.emoji}
                </span>

                <div>
                  <h2 className="text-sm font-bold sm:text-base">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[#8B8193]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-3 text-sm font-medium text-[#9274B8]">
            <span className="h-px w-10 bg-[#D8C9F4]" />
            Small steps. Big dreams.
          </div>
        </section>

        <section className="mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
          <div className="mb-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#9274B8]">
              Let's get started
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Create your account
              <span className="text-[#7965CD]">.</span>
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#756B7D]">
              Set yourself up for a more organized job hunt.
            </p>
          </div>

          <form action={formAction} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold"
              >
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="What should we call you?"
                minLength={2}
                maxLength={100}
                required
                disabled={isPending}
                className="w-full rounded-xl border-0 border-b-2 border-[#E4DCEB] bg-white/55 px-4 py-3.5 text-sm outline-none transition placeholder:text-[#AAA0B2] hover:bg-white/80 focus:border-[#9274B8] focus:bg-white disabled:opacity-60"
              />
            </div>

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
                disabled={isPending}
                className="w-full rounded-xl border-0 border-b-2 border-[#E4DCEB] bg-white/55 px-4 py-3.5 text-sm outline-none transition placeholder:text-[#AAA0B2] hover:bg-white/80 focus:border-[#9274B8] focus:bg-white disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                minLength={8}
                maxLength={128}
                required
                disabled={isPending}
                className="w-full rounded-xl border-0 border-b-2 border-[#E4DCEB] bg-white/55 px-4 py-3.5 text-sm outline-none transition placeholder:text-[#AAA0B2] hover:bg-white/80 focus:border-[#9274B8] focus:bg-white disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Type it one more time"
                required
                disabled={isPending}
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
              Show passwords
            </label>

            {state.error && (
              <p
                role="alert"
                className="rounded-lg bg-[#FFF0ED] px-4 py-3 text-sm text-[#9B3E38]"
              >
                {state.error}
              </p>
            )}

            {state.success && (
              <p
                role="status"
                className="rounded-lg bg-[#F0F9E9] px-4 py-3 text-sm text-[#416B36]"
              >
                {state.success}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending || Boolean(state.success)}
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#7965CD] px-6 py-4 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#6C57BD] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isPending ? "Creating your account..." : "Create my account"}
              {!isPending && (
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#756B7D]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#7965CD] underline decoration-[#D8C9F4] decoration-2 underline-offset-4 transition hover:text-[#5945A9]"
            >
              Sign in
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