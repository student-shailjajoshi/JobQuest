
import Link from "next/link";
import { ArrowUpRight, Heart } from "iconoir-react";

function TinyCat() {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-9 w-9 -rotate-6"
      aria-hidden="true"
    >
      <path
        d="M8 19L9 7L18 13Q22 11 26 13L35 7L36 20Q40 31 29 36Q17 40 9 31Q5 25 8 19Z"
        fill="#E7DCFF"
        stroke="#42364D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 23Q16 26 19 23M25 23Q28 26 31 23"
        stroke="#42364D"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 28L22 30L24 28"
        stroke="#E98E91"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t-2 border-dashed border-[#D9CFC4] bg-[#FAF6EC] px-5 py-6 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <Link href="#home" className="group flex w-fit items-center gap-2.5">
          <TinyCat />
          <span className="text-lg font-black tracking-tight text-[#42364D]">
            jobquest<span className="text-[#9274B8]">.</span>
          </span>
        </Link>

        <p className="flex items-center gap-1.5 text-xs text-[#85798F]">
          made with
          <Heart
            className="h-3.5 w-3.5 fill-[#FFB6A5] text-[#42364D]"
            strokeWidth={1.8}
          />
          and probably too much coffee.
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-[#756B78]">
          <Link href="#features" className="transition-colors hover:text-[#9274B8]">
            the good stuff
          </Link>
          <Link href="#how-it-works" className="transition-colors hover:text-[#9274B8]">
            how it works
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 transition-colors hover:text-[#9274B8]"
          >
            my tracker
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-5 flex max-w-6xl flex-col gap-1 border-t border-[#EAE3D9] pt-4 text-[11px] text-[#A197A4] sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 JobQuest. Made for the job hunt.</span>
        <span>you&apos;re doing better than you think.</span>
      </div>
    </footer>
  );
}