import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center">
      <p className="text-xs font-mono font-medium uppercase tracking-[0.3em] text-muted">
        {"404"}
      </p>

      <p className="mt-4 text-2xl font-medium">{"Nothing here."}</p>

      <Link
        href="/"
        className="mt-10 px-3 py-2 border text-xs font-mono font-medium uppercase tracking-[0.3em] hover:opacity-60 transition-opacity"
      >
        {"← Go home"}
      </Link>
    </main>
  );
}
