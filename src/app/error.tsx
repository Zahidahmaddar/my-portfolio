"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="wrap min-h-screen flex flex-col items-start justify-center gap-4">
      <h1 className="section-title">This page didn&apos;t load.</h1>
      <p className="text-muted">
        The site couldn&apos;t reach its data. Try again in a moment.
      </p>
      <button type="button" onClick={reset} className="btn btn-primary">
        Try again
      </button>
    </main>
  );
}
