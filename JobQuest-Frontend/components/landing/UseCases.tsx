import { GraduationCap, Code, Rocket } from "iconoir-react";

const audiences = [
  {
    icon: GraduationCap,
    label: "Still studying",
    title: "Your first internship hunt",
    description:
      "Keep internship applications, eligibility details, deadlines, and recruiter contacts organized while juggling college.",
    color: "bg-[#E4DDFF]",
  },
  {
    icon: Rocket,
    label: "Starting out",
    title: "Your first full-time role",
    description:
      "Track graduate programs, entry-level openings, interview rounds, and follow-ups without losing momentum.",
    color: "bg-[#FFE8A3]",
  },
  {
    icon: Code,
    label: "Building a career",
    title: "Your next big move",
    description:
      "Manage multiple opportunities, compare roles, and keep your job search intentional instead of chaotic.",
    color: "bg-[#D8EFCB]",
  },
];

export default function UseCases() {
  return (
    <section className="bg-[#FAF7F0] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-6xl border-t-2 border-dashed border-[#D9CFC4] pt-10">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-widest text-[#7965CD]">
            different paths, same chaos
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#42364D] sm:text-4xl">
            Wherever you are in your career.
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#71667D] sm:text-base">
            Whether you&apos;re looking for your very first opportunity or
            planning your next move, your job hunt deserves a little structure.
          </p>
        </div>

        <div className="mt-8 divide-y-2 divide-dashed divide-[#D9CFC4] border-y-2 border-dashed border-[#D9CFC4]">
          {audiences.map(
            ({ icon: Icon, label, title, description, color }, index) => (
              <article
                key={title}
                className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:gap-6"
              >
                <div className="flex shrink-0 items-center gap-4 sm:w-52">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#42364D] ${color}`}
                  >
                    <Icon className="h-5 w-5 text-[#42364D]" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#93899C]">
                      PATH 0{index + 1}
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#42364D]">
                      {label}
                    </p>
                  </div>
                </div>

                <div className="flex-1 sm:border-l-2 sm:border-dashed sm:border-[#D9CFC4] sm:pl-6">
                  <h3 className="text-lg font-extrabold text-[#42364D]">
                    {title}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-[#71667D]">
                    {description}
                  </p>
                </div>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}