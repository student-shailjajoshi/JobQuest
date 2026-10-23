import {
  Suitcase,
  Calendar,
  Clock,
  CheckCircle,
} from "iconoir-react";

const features = [
  {
    icon: Suitcase,
    title: "Save opportunities",
    description: "Keep job titles, companies, links, and application details together.",
    color: "bg-[#E4DDFF]",
  },
  {
    icon: Calendar,
    title: "Remember the dates",
    description: "Keep deadlines, interviews, and follow-ups on your radar.",
    color: "bg-[#FFE8A3]",
  },
  {
    icon: Clock,
    title: "Know what's next",
    description: "See which applications are pending, progressing, or finished.",
    color: "bg-[#FFB9A9]",
  },
  {
    icon: CheckCircle,
    title: "See your progress",
    description: "Keep track of your journey, one application at a time.",
    color: "bg-[#D8EFCB]",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-[#FAF7F0] px-5 py-12 sm:px-8 sm:py-16 lg:px-10"
    >
      <div className="mx-auto max-w-6xl border-t-2 border-dashed border-[#D9CFC4] pt-10">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#7965CD]">
              Your quest toolkit ✳
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#42364D] sm:text-4xl">
              Your job hunt, organized.
            </h2>
          </div>

          <p className="max-w-xs text-sm leading-6 text-[#71667D]">
            All the important details, without the tab chaos.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description, color }) => (
            <article
              key={title}
              className="rounded-2xl border-2 border-[#42364D] bg-[#FFFEFB] p-4 transition-transform duration-200 hover:-translate-y-1"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#42364D] ${color}`}
              >
                <Icon className="h-5 w-5 text-[#42364D]" />
              </div>

              <h3 className="mt-4 text-base font-extrabold text-[#42364D]">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#71667D]">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}