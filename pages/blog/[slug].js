// pages/blog/[slug].tsx
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";

const postContent = {
  "why-i-love-nextjs": {
    title: "Why I Love Next.js",
    date: "2025-05-20",
    content: `Next.js offers a perfect balance between flexibility and convention. Its built-in routing, SSR/SSG, and API routes simplify modern web development.`,
  },
  "dark-mode-in-tailwind": {
    title: "How to Add Dark Mode with Tailwind CSS",
    date: "2025-05-10",
    content: `Tailwind makes dark mode easy by using the 'dark:' prefix. You can use class-based toggling or media-query-based approach.`,
  },
};

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  const post = postContent[slug];

  if (!post) return <p className="text-center py-10">Post not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button
        onClick={() => router.back()}
        className="flex items-center text-blue-500 hover:underline mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{post.date}</p>
      <div className="prose dark:prose-invert">
        <p>{post.content}</p>
      </div>
    </div>
  );
}
