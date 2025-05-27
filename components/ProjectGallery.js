"use client";
import { useState } from "react";

// data/projects.ts
export const projects = [
  {
    id: 1,
    title: "Portfolio Website",
    tech: ["Next.js", "Tailwind CSS"],
    type: "Web App",
    year: 2025,
    description:
      "A modern, responsive portfolio built with Next.js and Tailwind CSS.",
  },
  {
    id: 2,
    title: "Task Manager API",
    tech: ["Node.js", "Express", "MongoDB"],
    type: "Backend API",
    year: 2024,
    description: "A RESTful API for managing tasks and user auth.",
  },
  {
    id: 3,
    title: "UI Design System",
    tech: ["Figma"],
    type: "UI/UX",
    year: 2023,
    description: "A design system for building consistent UIs in Figma.",
  },
];

const allYears = [...new Set(projects.map(p => p.year))];
const allTypes = [...new Set(projects.map(p => p.type))];
const allTech = [...new Set(projects.flatMap(p => p.tech))];

export default function ProjectGallery() {
  const [search, setSearch] = useState("");
  const [filterTech, setFilterTech] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const filtered = projects.filter(project => {
    return (
      project.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterTech ? project.tech.includes(filterTech) : true) &&
      (filterType ? project.type === filterType : true) &&
      (filterYear ? project.year.toString() === filterYear : true)
    );
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Projects</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          className="border px-4 py-2 rounded w-full sm:w-auto"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="border px-4 py-2 rounded"
          value={filterTech}
          onChange={e => setFilterTech(e.target.value)}
        >
          <option value="">All Tech</option>
          {allTech.map(tech => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>

        <select
          className="border px-4 py-2 rounded"
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          {allTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          className="border px-4 py-2 rounded"
          value={filterYear}
          onChange={e => setFilterYear(e.target.value)}
        >
          <option value="">All Years</option>
          {allYears.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Project List */}
      <div className="grid gap-6">
        {filtered.length > 0 ? (
          filtered.map(project => (
            <div
              key={project.id}
              className="border border-gray-300 dark:border-gray-700 p-4 rounded shadow-sm"
            >
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                {project.year} — {project.type}
              </p>
              <p className="mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map(t => (
                  <span
                    key={t}
                    className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No projects found.</p>
        )}
      </div>
    </div>
  );
}
