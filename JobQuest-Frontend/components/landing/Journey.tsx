import {
  Bookmark,
  Send,
  Calendar,
  Trophy,
} from "iconoir-react";

const stages = [
  {
    icon: Bookmark,
    title: "Saved",
    description: "Found a role worth chasing.",
    color: "bg-[#E4DDFF]",
  },
  {
    icon: Send,
    title: "Applied",
    description: "Application sent. One step closer.",
    color: "bg-[#D8EFCB]",
  },
  {
    icon: Calendar,
    title: "Interview",
    description: "Prep notes and dates, all together.",
    color: "bg-[#FFE8A3]",
  },
  {
    icon: Trophy,
    title: "Decision",
    description: "Offer, rejection, or your next move.",
    color: "bg-[#FFB9A9]",
  },
];

export default function Journey() {
  return (
    <section className="bg-[#FAF7F0] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-6xl border-t-2 border-dashed border-[#D9CFC4] pt-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-widest text-[#7965CD]">
              every application has a story
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#42364D] sm:text-4xl">
              From “maybe” to “what&apos;s next?”
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#71667D] sm:text-base">
              Give every opportunity a place in your journey. Update its
              status as things happen, and keep the next step in sight.
            </p>
          </div>

          <p className="shrink-0 text-sm font-bold text-[#7965CD]">
            Your quest, your pace. ↗
          </p>
        </div>

        <div className="relative mt-9">
          <div className="absolute left-6 right-6 top-6 hidden border-t-2 border-dashed border-[#C9BDEB] md:block" />

          <div className="relative grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {stages.map(({ icon: Icon, title, description, color }, index) => (
              <article key={title} className="flex gap-3 md:flex-col">
                <div
                  className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#42364D] ${color}`}
                >
                  <Icon className="h-5 w-5 text-[#42364D]" />
                </div>

                <div className="pt-1 md:pt-0">
                  <p className="text-xs font-bold text-[#93899C]">
                    STEP 0{index + 1}
                  </p>
                  <h3 className="mt-1 text-base font-extrabold text-[#42364D]">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#71667D]">
                    {description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}