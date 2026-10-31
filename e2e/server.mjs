// Starts the app for e2e tests against an in-memory MongoDB with known data.
import { spawn } from "node:child_process";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ADMIN, PORT, SEED_MESSAGE, SEED_PROJECTS, SEED_SKILLS } from "./fixtures.mjs";

const mongo = await MongoMemoryServer.create();
const uri = mongo.getUri("portfolio-e2e");

await mongoose.connect(uri);
const db = mongoose.connection.db;
await db.collection("users").insertOne({
  email: ADMIN.email,
  password: await bcrypt.hash(ADMIN.password, 4),
  role: "admin",
  createdAt: new Date(),
});
await db.collection("projects").insertMany(
  SEED_PROJECTS.map((project, i) => ({
    ...project,
    createdAt: new Date(Date.now() - i * 86_400_000),
  })),
);
await db.collection("skills").insertMany(SEED_SKILLS.map((s) => ({ ...s, createdAt: new Date() })));
await db.collection("submissions").insertOne({
  ...SEED_MESSAGE,
  reply: "",
  replied: false,
  createdAt: new Date(),
});
await db.collection("sitesettings").insertOne({
  heroSubtitle: "Software Engineer (Frontend)",
  heroImage: "/uploads/1776581447689-7untql.jpeg",
  titleLine1: "Zahid",
  titleLine2: "Farooq",
  heroDescription: "Building seamless digital experiences across web and mobile.",
  aboutImage: "/uploads/1776581526194-jiujuz.jpeg",
  aboutParagraphs: [],
  resumeUrl: "/uploads/1776585822918-rgnt1e.pdf",
  stats: [],
  aiModel: "meta/llama-3.1-8b-instruct",
  updatedAt: new Date(),
});
await mongoose.disconnect();

// Values set here take priority over .env files, which is what isolates the run
const env = {
  ...process.env,
  NEXT_DIST_DIR: ".next-e2e",
  MONGODB_URI: uri,
  JWT_SECRET: "e2e-only-secret-not-used-anywhere-else",
  EMAIL_TRANSPORT: "json",
  EMAIL_USER: "",
  EMAIL_PASSWORD: "",
  NOTIFICATION_EMAIL: "",
  NVIDIA_API_KEY: "",
  CLOUDINARY_CLOUD_NAME: "",
  CLOUDINARY_API_KEY: "",
  CLOUDINARY_API_SECRET: "",
  NEXT_PUBLIC_SITE_URL: `http://localhost:${PORT}`,
};

const run = (args) =>
  spawn("npx", ["next", ...args], { env, stdio: "inherit" });

let server;
const stop = async () => {
  server?.kill();
  await mongo.stop();
  process.exit(0);
};
process.on("SIGTERM", stop);
process.on("SIGINT", stop);

const build = run(["build"]);
build.on("exit", (code) => {
  if (code !== 0) {
    console.error("The e2e build failed");
    mongo.stop().finally(() => process.exit(code ?? 1));
    return;
  }
  server = run(["start", "-p", String(PORT)]);
});
