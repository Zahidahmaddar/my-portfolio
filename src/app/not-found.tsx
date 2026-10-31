import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap min-h-screen flex flex-col items-start justify-center gap-4">
      <h1 className="section-title">This trail doesn&apos;t lead anywhere.</h1>
      <p className="text-muted">
        The page may have moved, or the link may be wrong.
      </p>
      <Link href="/" className="btn btn-primary">
        Go to the home page
      </Link>
    </main>
  );
}
