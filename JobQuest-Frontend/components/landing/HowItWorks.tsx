import Link from "next/link";
import {
  Search,
  Plus,
  EditPencil,
  Calendar,
  Bell,
  Clock,
  CheckCircle,
  XmarkCircle,
  Trophy,
  ArrowRight,
  ArrowUpRight,
  NavArrowDown,
} from "iconoir-react";

const steps = [
  {
    number: "01",
    title: "Find a role worth chasing",
    description:
      "Discover an opportunity on a job board, company website, or through a referral. Save its details before the tab disappears.",
    icon: Search,
    color: "bg-[#E4DDFF]",
    tag: "THE DISCOVERY",
    details: ["Job title and company", "Job posting URL", "Application deadline"],
  },
  {
    number: "02",
    title: "Add it to your quest log",
    description:
      "Create an application entry and keep the important information together. Add notes about the role, recruiter, requirements, or referral.",
    icon: Plus,
    color: "bg-[#FFE8A3]",
    tag: "THE SETUP",
    details: ["Role and company details", "Notes and job description", "Application date"],
  },
  {
    number: "03",
    title: "Keep your status updated",
    description:
      "Move the application forward whenever something changes. Know which applications are pending and which need your attention.",
    icon: EditPencil,
    color: "bg-[#FFB9A9]",
    tag: "THE JOURNEY",
    details: ["Wishlist or saved", "Applied", "Interviewing", "Offer or rejected"],
  },
  {
    number: "04",
    title: "Prepare and follow up",
    description:
      "Record interview dates, preparation notes, and follow-up reminders so you don't have to rely on memory alone.",
    icon: Calendar,
    color: "bg-[#D8EFCB]",
    tag: "THE FOLLOW-THROUGH",
    details: ["Interview schedules", "Preparation notes", "Follow-up dates"],
  },
  {
    number: "05",
    title: "Learn from every outcome",
    description:
      "Review your applications and progress in one place. Celebrate offers, learn from rejections, and decide what to do next.",
    icon: Trophy,
    color: "bg-[#E4DDFF]",
    tag: "THE NEXT CHAPTER",
    details: ["Review application outcomes", "Spot pending tasks", "Keep moving forward"],
  },
];

const lifecycle = [
  { label: "Saved", color: "bg-[#E4DDFF]" },
  { label: "Applied", color: "bg-[#FFE8A3]" },
  { label: "Interview", color: "bg-[#FFB9A9]" },
  { label: "Offer", color: "bg-[#D8EFCB]" },
];

const faqs = [
  {
    question: "Can I track multiple applications?",
    answer:
      "Yes. JobQuest is designed to keep multiple opportunities organized in one place, so you can review each company's status and next steps.",
  },
  {
    question: "What if a company never replies?",
    answer:
      "Keep the application marked as pending and record a follow-up date if needed. You can decide when to follow up or move on.",
  },
  {
    question: "Can I track interviews and deadlines?",
    answer:
      "The workflow is designed around interview dates, deadlines, and follow-ups. The specific functionality depends on which features have been implemented in your current build.",
  },
  {
    question: "Does JobQuest apply for jobs automatically?",
    answer:
      "No automatic applications are implied here. JobQuest helps you organize and track your job search; you remain in control of submitting applications.",
  },
];

export default function HowItWorks() {
  return (
    <div className="bg-[#FAF7F0] text-[#42364D]">
      <section className="px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16">
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex -rotate-2 items-center gap-2 rounded-full border-2 border-[#42364D] bg-[#FFE8A3] px-4 py-2 text-xs font-black shadow-[3px_3px_0_#42364D]">
            <Search className="h-4 w-4" />
            YOUR JOB HUNT, EXPLAINED
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            From “found a job” to{" "}
            <span className="text-[#7965CD]">“got the offer.”</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#71667D] sm:text-lg sm:leading-8">
            JobQuest gives your job search a home. Keep opportunities,
            application updates, interview plans, and next steps together
            instead of scattered across tabs, notes, and memory.
          </p>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-black sm:text-3xl">
              Your quest, start to finish
            </h2>
            <span className="rounded-full border border-[#42364D]/20 bg-white px-3 py-1.5 text-xs font-bold text-[#71667D]">
              5 simple steps
            </span>
          </div>

          <div className="mt-8 space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="grid gap-5 rounded-2xl border-2 border-[#42364D] bg-[#FFFEFB] p-5 shadow-[3px_3px_0_#42364D] sm:grid-cols-[60px_1fr] sm:gap-6 sm:p-6"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#42364D] ${step.color}`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#7965CD]">
                        STEP {step.number}
                      </span>
                      <span className="text-xs font-bold text-[#93899C]">
                        · {step.tag}
                      </span>
                    </div>

                    <h3 className="mt-2 text-xl font-black sm:text-2xl">
                      {step.title}
                    </h3>

                    <p className="mt-2 max-w-3xl text-sm leading-7 text-[#71667D] sm:text-base">
                      {step.description}
                    </p>

                    <ul className="mt-4 flex flex-wrap gap-2">
                      {step.details.map((detail) => (
                        <li
                          key={detail}
                          className="rounded-full border border-[#42364D]/15 bg-[#FAF7F0] px-3 py-1.5 text-xs font-semibold text-[#554B65]"
                        >
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl rounded-3xl border-2 border-[#42364D] bg-[#F1EBDD] p-5 sm:p-8">
          <h2 className="text-2xl font-black sm:text-3xl">
            The application lifecycle
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#71667D]">
            A quick view of how an opportunity can progress. Real outcomes
            vary: an application may be rejected, withdrawn, or remain
            unanswered.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {lifecycle.map((stage, index) => (
              <div key={stage.label} className="flex items-center gap-3">
                <span
                  className={`rounded-full border-2 border-[#42364D] ${stage.color} px-4 py-2 text-sm font-extrabold shadow-[2px_2px_0_#42364D]`}
                >
                  {stage.label}
                </span>
                {index < lifecycle.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-[#7965CD]" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-[#554B65]">
              <XmarkCircle className="h-4 w-4 text-[#D66F65]" />
              Rejected
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-[#554B65]">
              <Clock className="h-4 w-4 text-[#7965CD]" />
              Still waiting
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-[#554B65]">
              <CheckCircle className="h-4 w-4 text-[#54865B]" />
              Withdrawn or completed
            </span>
          </div>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-black sm:text-3xl">
            A few things you might be wondering
          </h2>

          <div className="mt-6 divide-y-2 divide-dashed divide-[#EAE3D9] border-y-2 border-[#EAE3D9]">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {faq.question}
                  <NavArrowDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#71667D]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 pt-8 sm:px-8 sm:pb-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 rounded-3xl border-2 border-[#42364D] bg-[#E4DDFF] p-6 shadow-[4px_4px_0_#42364D] sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">
              Ready for your next quest?
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#71667D]">
              Give every opportunity a place, and give yourself a little
              breathing room.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-[#42364D] bg-[#FFB9A9] px-5 py-3 font-extrabold shadow-[3px_3px_0_#42364D] transition hover:-translate-y-0.5"
          >
            Start your quest
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}