import { Folder, Clock, QuestionMark } from "iconoir-react";

const problems = [
  {
    icon: Folder,
    title: "Where did I save that job?",
    description:
      "One link in your bookmarks, another in a spreadsheet, and that perfect role lost in your browser history.",
    color: "bg-[#E4DDFF]",
    number: "01",
  },
  {
    icon: Clock,
    title: "Wait, when should I follow up?",
    description:
      "Applications pile up, emails get buried, and remembering every deadline becomes a job of its own.",
    color: "bg-[#FFE8A3]",
    number: "02",
  },
  {
    icon: QuestionMark,
    title: "What's even happening anymore?",
    description:
      "You applied somewhere last week. Was it an interview, a rejection, or radio silence?",
    color: "bg-[#FFB9A9]",
    number: "03",
  },
];

export default function Problem() {
  return (
    <section className="bg-[#FAF7F0] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-6xl border-t-2 border-dashed border-[#D9CFC4] pt-10">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-widest text-[#7965CD]">
            the struggle is real
          </p>

          <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#42364D] sm:text-4xl">
            Applying for jobs is hard enough.
            <span className="text-[#7965CD]"> Keeping track shouldn&apos;t be.</span>
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#71667D] sm:text-base">
            Your attention belongs on finding the right opportunity, not
            hunting through tabs and trying to remember what happened.
          </p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {problems.map(({ icon: Icon, title, description, color, number }) => (
            <article
              key={number}
              className="flex gap-4 rounded-2xl border-2 border-[#42364D] bg-[#FFFEFB] p-4 transition-transform hover:-translate-y-1 sm:p-5"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#42364D] ${color}`}
              >
                <Icon className="h-5 w-5 text-[#42364D]" />
              </div>

              <div>
                <p className="text-[10px] font-black tracking-widest text-[#93899C]">
                  {number}
                </p>
                <h3 className="mt-1 text-base font-extrabold text-[#42364D]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#71667D]">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}