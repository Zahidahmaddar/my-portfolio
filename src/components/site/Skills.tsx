import { PublicSkill } from "@/lib/content";

export default function Skills({ skills }: { skills: PublicSkill[] }) {
  if (skills.length === 0) return null;

  const strongestFirst = [...skills].sort((a, b) => b.level - a.level);

  return (
    <section id="skills" className="wrap">
      <div className="tile sm:!p-7 grid md:grid-cols-[14rem_minmax(0,1fr)] gap-5 md:gap-8">
        <div>
          <h2 className="section-title">Skills</h2>
          <p className="mt-1 text-sm text-muted">Strongest first</p>
        </div>
        <ul className="flex flex-wrap content-center gap-2">
          {strongestFirst.map((skill, i) => (
            <li
              key={skill._id}
              className={`chip ${i < 3 ? "!bg-action !text-on-action !shadow-none" : ""}`}
            >
              {skill.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
