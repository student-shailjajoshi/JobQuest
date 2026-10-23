import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Clock,
  Suitcase,
} from "iconoir-react";

const stages = [
  { label: "Saved", count: "01", color: "bg-[#E4DDFF]" },
  { label: "Applied", count: "02", color: "bg-[#FFE8A3]" },
  { label: "Interview", count: "03", color: "bg-[#FFB9A9]" },
  { label: "Offer", count: "04", color: "bg-[#D8EFCB]" },
];

function CatMascot() {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="h-16 w-16" aria-hidden="true">
      <path
        d="M18 39L16 13L37 29Q50 24 63 29L84 13L82 40Q94 58 85 75Q75 91 50 91Q25 91 15 75Q6 58 18 39Z"
        fill="#E4DDFF"
        stroke="#42364D"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M24 36L22 20L36 31M76 36L78 20L64 31"
        stroke="#FFB9A9"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="36" cy="52" r="3" fill="#42364D" />
      <circle cx="64" cy="52" r="3" fill="#42364D" />
      <path
        d="M46 61L50 64L54 61M50 64V68M50 68Q43 74 39 68M50 68Q57 74 61 68"
        stroke="#42364D"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="29" cy="64" r="5" fill="#FFB9A9" />
      <circle cx="71" cy="64" r="5" fill="#FFB9A9" />
    </svg>
  );
}

function ApplicationJourney() {
  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      <div className="absolute -right-2 -top-5 z-10 rotate-6 rounded-full border-2 border-[#42364D] bg-[#FFE8A3] px-3 py-2 text-xs font-black shadow-[2px_2px_0_#42364D]">
        YOUR QUEST LOG ✳
      </div>

      <div className="rounded-[28px] border-2 border-[#42364D] bg-[#FFFEFB] p-5 shadow-[5px_5px_0_#42364D] sm:p-6">
        <div className="flex items-center gap-3 border-b-2 border-dashed border-[#EAE3D9] pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#42364D] bg-[#E4DDFF]">
            <Suitcase className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-black text-[#42364D]">
              My job quests
            </p>
            <p className="text-xs text-[#93899C]">
              Every opportunity, in one place.
            </p>
          </div>
          <CatMascot />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {stages.map((stage) => (
            <div
              key={stage.label}
              className={`rounded-2xl border-2 border-[#42364D] ${stage.color} p-3`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#554B65]">
                  {stage.label}
                </span>
                <span className="text-xs font-black text-[#42364D]">
                  {stage.count}
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/70">
                <div className="h-full w-2/3 rounded-full bg-[#42364D]/70" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border-2 border-[#42364D] bg-[#FAF7F0] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D8EFCB]">
              <Check className="h-5 w-5" strokeWidth={3} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-[#42364D]">
                Keep the next step in sight
              </p>
              <p className="mt-1 text-xs text-[#71667D]">
                Track progress, not scattered tabs.
              </p>
            </div>
            <Clock className="h-5 w-5 text-[#7965CD]" />
          </div>
        </div>
      </div>

      <div className="absolute -bottom-5 -left-2 -rotate-3 rounded-full border-2 border-[#42364D] bg-[#FFB9A9] px-4 py-2 text-xs font-black shadow-[3px_3px_0_#42364D]">
        one application at a time ♡
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="bg-[#FAF7F0] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-8"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-12">
        <div>
          <h1 className="mt-7 max-w-xl text-5xl font-black leading-[1.05] tracking-tight text-[#42364D] sm:text-6xl lg:text-7xl">
            Every job
            <br />
            application.
            <br />
            <span className="text-[#7965CD]">One happy place.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-[#71667D] sm:text-lg">
            JobQuest is your playful job application tracker. Organize
            opportunities, follow application progress, keep interview details
            handy, and stop losing track of what happens next.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-[#42364D] bg-[#FFB9A9] px-5 py-3 font-extrabold text-[#42364D] shadow-[3px_3px_0_#42364D] transition hover:-translate-y-1 hover:shadow-[4px_5px_0_#42364D]"
            >
              Track my applications
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/how-it-works"
              className="text-sm font-bold text-[#554B65] underline decoration-[#B8A9ED] decoration-2 underline-offset-4 hover:text-[#7965CD]"
            >
              See how it works
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-[#71667D]">
            <span>♡ Less application chaos</span>
            <span>✳ Clearer next steps</span>
          </div>
        </div>

        <ApplicationJourney />
      </div>
    </section>
  );
}