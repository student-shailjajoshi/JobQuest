
import Link from "next/link";
import { ArrowUpRight } from "iconoir-react";

function SleepingCat() {
  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-24 w-28"
      aria-hidden="true"
    >
      <path
        d="M17 57C10 39 24 22 43 25C55 11 79 20 84 37C101 40 109 56 100 70C89 87 42 88 25 74C19 70 16 64 17 57Z"
        fill="#E7DCFF"
        stroke="#42364D"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M29 30L27 14L44 25M75 23L91 12L88 36"
        fill="#E7DCFF"
        stroke="#42364D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M35 49Q41 54 47 49M64 49Q70 54 76 48"
        stroke="#42364D"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M53 57L57 60L61 57"
        stroke="#D98F91"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M49 65Q57 70 65 64"
        stroke="#42364D"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M90 8L93 14L99 16L93 19L91 25L88 19L82 17L88 14Z"
        fill="#FFE8A3"
        stroke="#42364D"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 35L16 33M9 42L14 42"
        stroke="#42364D"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function FinalCTA() {
  return (
    <section className="bg-[#FAF6EC] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] border-2 border-[#42364D] bg-[#E7DCFF] px-6 py-9 shadow-[5px_5px_0_#42364D] sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute -right-5 -top-8 h-32 w-32 rotate-12 rounded-full border-2 border-dashed border-[#9274B8]/40 sm:right-16 sm:top-5" />

        <div className="relative z-10 flex flex-col items-center gap-5 text-center md:flex-row md:justify-between md:gap-8 md:text-left">
          <div className="max-w-xl">
            <span className="inline-block -rotate-2 rounded-full border-2 border-[#42364D] bg-[#FFFEFB] px-3 py-1 text-xs font-bold text-[#42364D]">
              a tiny reminder from us
            </span>

            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-[#42364D] sm:text-4xl">
              you don't have to
              <br className="hidden sm:block" /> figure it all out today.
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-[#665A75] sm:text-base">
              Just keep your applications together, take a deep breath, and
              do what you can. The rest can wait until tomorrow.
            </p>

            <Link
              href="/dashboard"
              className="group mt-6 inline-flex -rotate-1 items-center gap-2 rounded-2xl border-2 border-[#42364D] bg-[#FFC5B5] px-5 py-3.5 text-sm font-black text-[#42364D] shadow-[3px_3px_0_#42364D] transition-all hover:rotate-1 hover:shadow-[5px_5px_0_#42364D] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              okay, let's do this
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2.5}
              />
            </Link>
          </div>

          <div className="relative shrink-0">
            <div className="absolute -right-4 top-0 rotate-12 rounded-lg border border-[#42364D] bg-[#FFE8A3] px-2 py-1 text-[10px] font-black text-[#42364D]">
              nap first?
            </div>
            <SleepingCat />
            <p className="-mt-1 rotate-2 text-center font-serif text-sm italic text-[#665A75]">
              one thing at a time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}