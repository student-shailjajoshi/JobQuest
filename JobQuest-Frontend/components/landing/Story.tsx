import { Heart } from "iconoir-react";

export default function Story() {
  return (
    <section
      id="story"
      className="bg-[#FAF7F0] px-5 py-12 sm:px-8 sm:py-16 lg:px-10"
    >
      <div className="mx-auto max-w-6xl border-t-2 border-dashed border-[#D9CFC4] pt-10">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto] md:gap-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#7965CD]">
              <Heart className="h-4 w-4" />
              The story behind JobQuest
            </span>

            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#42364D] sm:text-4xl">
              Job hunting is a job of its own.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#71667D] sm:text-base">
              Between applications, interview prep, follow-ups, and unanswered
              emails, it&apos;s easy to lose track of everything. JobQuest
              brings your job search into one organized place, so you can focus
              less on remembering every detail and more on finding your next
              opportunity.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border-2 border-[#42364D] bg-[#E4DDFF] p-4 sm:p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#42364D] bg-[#FFFEFB] text-xl">
              ♡
            </span>
            <div>
              <p className="text-sm font-black text-[#42364D]">
                One step at a time.
              </p>
              <p className="mt-1 text-xs text-[#71667D]">
                Every little win counts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}