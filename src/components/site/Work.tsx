import { ExternalLink } from "lucide-react";
import { Project } from "@/types/Project";
import {
  isUsableImage,
  isVectorImage,
  linkLabel,
  safeLink,
  sizedImage,
} from "@/lib/images";

// Admin entries can repeat a tag in different casing, like TypeScript / Typescript
function uniqueTech(tech: string[]): string[] {
  const seen = new Set<string>();
  return tech.filter((t) => {
    const key = t.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function ProjectImage({ project, wide }: { project: Project; wide: boolean }) {
  if (!isUsableImage(project.image)) return null;
  const src = sizedImage(project.image, 1400);

  return (
    <div className={`project-frame ${wide ? "md:!aspect-auto md:h-full md:min-h-64" : ""}`}>
      {/* eslint-disable @next/next/no-img-element */}
      <img src={src} alt="" aria-hidden loading="lazy" decoding="async" className="project-glow" />
      <img
        src={src}
        alt={`${project.title} preview`}
        loading="lazy"
        decoding="async"
        className={`project-shot ${isVectorImage(project.image) ? "is-vector" : ""}`}
      />
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  );
}

// Column spans for a grid where the first project takes two columns, so the rows
// come out even. The last project stretches to fill whatever its row has left.
function spanFor(index: number, total: number): { className: string; wide: boolean } {
  if (index === 0) {
    return total === 1
      ? { className: "md:col-span-2 lg:col-span-3", wide: true }
      : { className: "md:col-span-2", wide: true };
  }
  if (index < total - 1) return { className: "", wide: false };

  const medium = total % 2 === 0 ? "md:col-span-2" : "";
  const leftInRow = (total + 1) % 3;
  if (leftInRow === 1) return { className: `${medium} lg:col-span-3`, wide: true };
  if (leftInRow === 2) return { className: `${medium} lg:col-span-2`, wide: true };
  return { className: `${medium} lg:col-span-1`, wide: false };
}

export default function Work({ projects }: { projects: Project[] }) {
  return (
    <section id="work" className="wrap section !pt-10 md:!pt-14">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="section-title">Selected work</h2>
        <p className="text-sm text-muted">Newest first</p>
      </div>

      {projects.length === 0 ? (
        <p className="mt-6 text-muted max-w-xl">
          Projects are on their way. Until then,{" "}
          <a href="#contact" className="text-link">
            ask me about my work
          </a>
          .
        </p>
      ) : (
        <ol className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => {
            const live = safeLink(project.liveUrl);
            const repo = safeLink(project.repoUrl);
            const { className: span, wide } = spanFor(i, projects.length);
            return (
              <li
                key={project._id}
                className={`project ${span} ${wide ? "md:grid md:grid-cols-2 md:items-stretch" : "flex flex-col"}`}
              >
                <ProjectImage project={project} wide={wide} />
                <div className={`p-5 ${wide ? "md:order-first md:p-6 md:self-center" : "flex-1 flex flex-col"}`}>
                  <h3 className={`font-semibold leading-snug ${wide ? "text-lg" : "text-base"}`}>
                    {project.title}
                  </h3>
                  <p
                    title={project.description}
                    className={`mt-1.5 text-sm text-muted max-w-[60ch] ${wide ? "line-clamp-6" : "line-clamp-3"}`}
                  >
                    {project.description}
                  </p>
                  <ul className={`flex flex-wrap gap-1.5 ${wide ? "mt-3" : "mt-3 mb-auto"}`}>
                    {uniqueTech(project.tech).map((tech) => (
                      <li key={tech} className="tag">
                        {tech}
                      </li>
                    ))}
                  </ul>
                  {(live || repo) && (
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                      {live && (
                        <a
                          href={live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-link inline-flex items-center gap-1.5"
                        >
                          Visit {linkLabel(live)}
                          <ExternalLink size={14} aria-hidden />
                        </a>
                      )}
                      {repo && (
                        <a
                          href={repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-link inline-flex items-center gap-1.5"
                        >
                          View the code
                          <ExternalLink size={14} aria-hidden />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
