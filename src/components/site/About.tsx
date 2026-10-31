import Image from "next/image";
import { PublicSettings } from "@/lib/content";
import { canOptimize, isUsableImage } from "@/lib/images";
import { DEFAULT_ABOUT, FACTS } from "@/lib/site";

interface AboutProps {
  settings: PublicSettings | null;
  projectCount: number;
  skillCount: number;
}

export default function About({ settings, projectCount, skillCount }: AboutProps) {
  const paragraphs = settings?.aboutParagraphs?.length
    ? settings.aboutParagraphs
    : DEFAULT_ABOUT;

  const photo = isUsableImage(settings?.aboutImage) ? settings.aboutImage : null;
  // Numbers set in the admin panel win; otherwise count what's really on the page
  const stats = settings?.stats?.length
    ? settings.stats
    : [
        ...(projectCount ? [{ value: String(projectCount), label: "Projects shown here" }] : []),
        ...(skillCount ? [{ value: String(skillCount), label: "Tools I work with" }] : []),
      ];

  // Figures lead the tiles; a sort is stable, so the rest keep their order
  const facts = [...FACTS, ...stats].sort(
    (a, b) => Number(/^\d/.test(b.value)) - Number(/^\d/.test(a.value)),
  );

  return (
    <section id="about" className="wrap section !pb-4">
      <div className="grid md:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[24rem_minmax(0,1fr)] gap-4">
        {photo && (
          <div className="relative aspect-square md:aspect-auto md:min-h-full max-w-64 md:max-w-none w-full overflow-hidden rounded-[1.25rem] bg-sunken">
            <Image
              src={photo}
              alt="Portrait of Zahid"
              fill
              unoptimized={!canOptimize(photo)}
              sizes="42rem"
              // Always a tight portrait, so it never repeats the hero's full-length shot
              className="object-cover object-[57%_50%] scale-[1.75] origin-[57%_16%]"
            />
          </div>
        )}

        <div className="space-y-4 min-w-0">
          <div className="tile sm:!p-7">
            <h2 className="section-title">About</h2>
            <div className="mt-4 space-y-3 max-w-[72ch]">
              {paragraphs.map((paragraph, i) => (
                <p key={i} className={i === 0 ? "text-base" : "text-muted"}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <dl className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {facts.map((item) => (
              <div key={item.label} className="tile flex flex-col-reverse justify-end gap-1">
                <dt className="text-sm text-muted">{item.label}</dt>
                <dd
                  className={
                    /^\d/.test(item.value)
                      ? "text-3xl font-semibold tracking-tight text-action"
                      : "font-semibold leading-snug"
                  }
                >
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
