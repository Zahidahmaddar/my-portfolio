import Image from "next/image";
import { Download, Mail, MapPin } from "lucide-react";
import Contours from "@/components/common/Contours";
import { PublicSettings, PublicSkill } from "@/lib/content";
import { canOptimize, isUsableImage } from "@/lib/images";
import { CONTACT_EMAIL, DEFAULT_DESCRIPTION, DEFAULT_SUBTITLE, FACTS } from "@/lib/site";

const FALLBACK_PHOTO =
  "https://res.cloudinary.com/dtzswo7hc/image/upload/v1755886341/WhatsApp_Image_2025-08-22_at_23.42.08_mqx4bq.jpg";

const fact = (label: string) => FACTS.find((f) => f.label === label)?.value;

interface HeroProps {
  settings: PublicSettings | null;
  skills: PublicSkill[];
}

function Ticker({ names }: { names: string[] }) {
  return (
    // Decorative: the Skills section lists these properly for assistive tech
    <div aria-hidden className="ticker relative border-t border-band-line py-3 text-sm text-on-band-muted">
      <div className="ticker-track">
        {[0, 1, 2, 3].map((group) => (
          <div key={group} className="flex shrink-0">
            {names.map((name) => (
              <span key={name} className="inline-flex items-center gap-6 pl-6 whitespace-nowrap">
                {name}
                <span className="w-1 h-1 rounded-full bg-saffron" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero({ settings, skills }: HeroProps) {
  const photo = isUsableImage(settings?.heroImage)
    ? settings.heroImage
    : FALLBACK_PHOTO;
  const resumeUrl = settings?.resumeUrl;
  const availability = fact("Availability");
  const location = fact("Based in");
  const experience = fact("Experience");

  return (
    <section className="wrap pt-5">
      <div className="on-band relative overflow-hidden rounded-3xl bg-band text-on-band shadow-[var(--shadow-pop)]">
        <Contours className="opacity-[0.13]" />

        <div className="md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:min-h-[31rem] lg:min-h-[36rem] xl:min-h-[40rem]">
          <div className="relative z-10 p-6 pt-8 sm:p-10 md:p-12 xl:p-16 md:pr-0 xl:pr-0 flex flex-col justify-center">
            {availability && (
              <p className="inline-flex items-center gap-2 text-sm font-medium text-on-band-muted">
                <span aria-hidden className="w-2 h-2 rounded-full bg-saffron" />
                {availability}
              </p>
            )}
            <h1 className="display-name mt-4">
              {settings?.titleLine1 || "Zahid"} {settings?.titleLine2 || "Farooq"}
            </h1>
            <p className="mt-3 text-lg xl:text-2xl font-medium">
              {settings?.heroSubtitle || DEFAULT_SUBTITLE}
            </p>
            <p className="mt-3 text-base xl:text-lg leading-relaxed text-on-band-muted max-w-[42ch] xl:max-w-[48ch]">
              {settings?.heroDescription || DEFAULT_DESCRIPTION}
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-saffron"
                >
                  <Download size={16} />
                  Download resume
                </a>
              )}
              <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-ghost">
                <Mail size={16} />
                Email me
              </a>
            </div>
          </div>

          <div className="relative min-h-[22rem] md:min-h-0">
            <div className="hero-photo absolute inset-0">
              <Image
                src={photo}
                alt="Zahid standing on a snowfield with pine forest behind him"
                fill
                priority
                unoptimized={!canOptimize(photo)}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-[75%_center]"
              />
            </div>
            {/* A route across the map, starting where the text ends. Fixed in size
                and anchored to the column, so it never runs into the text. */}
            <svg
              aria-hidden
              viewBox="0 0 128 448"
              fill="none"
              className="absolute z-10 left-0 top-1/2 -translate-y-1/2 w-32 h-[28rem] pointer-events-none max-lg:hidden"
            >
              <path
                className="trail-line"
                pathLength={1}
                d="M36 436C78 396 16 358 42 298S116 234 88 156 46 54 106 12"
                stroke="var(--saffron)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <g className="trail-pin">
                <circle cx="106" cy="12" r="11" fill="var(--saffron)" opacity="0.25" />
                <circle cx="106" cy="12" r="5" fill="var(--saffron)" />
              </g>
            </svg>
            <div className="absolute left-4 bottom-4 md:left-24 md:bottom-6 flex flex-col items-start gap-2">
              {experience && (
                <p className="glass px-3.5 py-2">
                  <span className="block text-xl font-semibold leading-tight tracking-tight">{experience}</span>
                  <span className="block text-xs">Experience</span>
                </p>
              )}
              {location && (
                <p className="glass px-3 py-1.5 inline-flex items-center gap-1.5 text-xs font-medium">
                  <MapPin size={13} className="text-saffron" aria-hidden />
                  {location}
                </p>
              )}
            </div>
          </div>
        </div>

        {skills.length > 0 && <Ticker names={skills.map((s) => s.name)} />}
      </div>
    </section>
  );
}
