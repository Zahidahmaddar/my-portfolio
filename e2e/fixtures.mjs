export const PORT = 3100;

export const ADMIN = {
  email: "admin@example.test",
  password: "e2e-password-not-real",
};

export const SEED_PROJECTS = [
  {
    title: "Trail Finder",
    description: "A trekking app for finding and saving routes.",
    tech: ["React Native", "TypeScript", "Typescript"],
    image: "/uploads/1776581447689-7untql.jpeg",
    liveUrl: "https://www.example.test/trails",
  },
  {
    title: "Tiny Icon Project",
    description: "Its only image is a 28 pixel icon.",
    tech: ["React Native"],
    image: "/uploads/1776582488463-22gl8r.png",
  },
  {
    title: "Vector Logo Project",
    description: "Its image is an SVG logo.",
    tech: ["Next.js"],
    image: "/uploads/1776581929155-4fcixi.svg",
    repoUrl: "https://github.com/example/vector",
    // Only http(s) links may ever reach an href
    liveUrl: "javascript:alert(1)",
  },
];

export const SEED_SKILLS = [
  { name: "React", level: 100 },
  { name: "Redux", level: 75 },
];

export const SEED_MESSAGE = {
  name: "Seed Visitor",
  email: "visitor@example.test",
  subject: "Seeded subject",
  message: "Seeded message body",
};
