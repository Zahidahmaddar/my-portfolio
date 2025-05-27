// pages/blog/index.tsx
import Navbar from "@/components/Navbar";
import Link from "next/link";

const posts = [
  {
    slug: "why-i-love-nextjs",
    title: "Why I Love Next.js",
    date: "2025-05-20",
    summary:
      "An intro to why Next.js is my favorite React framework and how it simplifies web development.",
  },
  {
    slug: "dark-mode-in-tailwind",
    title: "How to Add Dark Mode with Tailwind CSS",
    date: "2025-05-10",
    summary:
      "Step-by-step guide to adding dark mode support using Tailwind’s dark variant.",
  },
];

export default function Blog() {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Blog</h1>
        <ul className="space-y-6">
          {posts.map(post => (
            <li key={post.slug} className="border-b pb-4">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl text-blue-500 hover:underline font-semibold">
                  {post.title}
                </h2>
              </Link>
              <p className="text-sm text-gray-500">{post.date}</p>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {post.summary}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
